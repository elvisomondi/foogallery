// File: tests/reporters/php-error-reporter.ts
// Custom Playwright Reporter for PHP Error Capture
// Automatically tracks PHP errors per-test and generates summary reports

import type {
  Reporter,
  FullConfig,
  Suite,
  TestCase,
  TestResult,
  FullResult,
} from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';
import {
  getLogPosition,
  readLogSince,
  readDebugLog,
  PHPLogEntry,
  ErrorLevel,
  getSummary,
  getEnvironmentInfo,
} from '../helpers/php-error-log-helper';

/**
 * Test error record - errors associated with a specific test
 */
interface TestErrorRecord {
  testTitle: string;
  testFile: string;
  errors: PHPLogEntry[];
  startPosition: number;
  endPosition: number;
}

/**
 * PHP Error Reporter for Playwright
 *
 * This reporter automatically tracks PHP errors from WordPress debug.log
 * and associates them with the tests that generated them.
 */
class PHPErrorReporter implements Reporter {
  private config!: FullConfig;
  private outputDir: string = '';
  private testErrors: Map<string, TestErrorRecord> = new Map();
  private currentTestPosition: number = 0;
  private allErrors: PHPLogEntry[] = [];
  private startTime: Date = new Date();

  /**
   * Called once before running tests
   */
  onBegin(config: FullConfig, suite: Suite): void {
    this.config = config;
    this.outputDir = path.resolve(config.rootDir, '..', 'test-results');
    this.startTime = new Date();
    this.testErrors.clear();
    this.allErrors = [];

    // Ensure output directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    console.log('\n[PHP Error Reporter] Initialized - tracking FooGallery PHP errors\n');
  }

  /**
   * Called before each test starts
   */
  async onTestBegin(test: TestCase, result: TestResult): Promise<void> {
    // Record log position before test
    this.currentTestPosition = await getLogPosition();
  }

  /**
   * Called after each test completes
   */
  async onTestEnd(test: TestCase, result: TestResult): Promise<void> {
    const testId = `${test.parent?.title || 'unknown'}::${test.title}`;
    const testFile = test.location?.file || 'unknown';

    // Get new errors since test started
    const logResult = await readLogSince(this.currentTestPosition);
    const fooGalleryErrors = logResult.fooGalleryOnly;

    // Store errors for this test
    const record: TestErrorRecord = {
      testTitle: test.title,
      testFile: path.basename(testFile),
      errors: fooGalleryErrors,
      startPosition: this.currentTestPosition,
      endPosition: await getLogPosition(),
    };

    this.testErrors.set(testId, record);
    this.allErrors.push(...fooGalleryErrors);

    // Log if errors were found
    if (fooGalleryErrors.length > 0) {
      const { byLevel } = getSummary(fooGalleryErrors);

      let summaryMsg = `[PHP] ${fooGalleryErrors.length} FooGallery log entries`;
      if (byLevel.fatal > 0) summaryMsg += ` (${byLevel.fatal} fatal!)`;
      else if (byLevel.error > 0) summaryMsg += ` (${byLevel.error} errors)`;
      else if (byLevel.warning > 0) summaryMsg += ` (${byLevel.warning} warnings)`;

      console.log(`  ${summaryMsg}`);
    }
  }

  /**
   * Called after all tests complete
   */
  async onEnd(result: FullResult): Promise<void> {
    console.log('\n[PHP Error Reporter] Generating reports...');

    // Read full log for final summary
    const fullLog = await readDebugLog();

    // Generate reports
    await this.generateHTMLReport(fullLog);
    await this.generateJSONSummary(fullLog);
    await this.copyDebugLog(fullLog);

    // Print console summary
    this.printConsoleSummary(fullLog);
  }

  /**
   * Generate HTML report
   */
  private async generateHTMLReport(fullLog: { entries: PHPLogEntry[]; fooGalleryOnly: PHPLogEntry[] }): Promise<void> {
    const reportPath = path.join(this.outputDir, 'php-errors-report.html');

    const html = this.buildHTMLReport(fullLog.fooGalleryOnly);
    fs.writeFileSync(reportPath, html);

    console.log(`[PHP Error Reporter] HTML report: ${reportPath}`);
  }

  /**
   * Build HTML report content
   */
  private buildHTMLReport(errors: PHPLogEntry[]): string {
    const timestamp = this.startTime.toISOString();
    const testCount = this.testErrors.size;
    const env = getEnvironmentInfo();

    // Group errors by test
    const errorsByTest: Map<string, PHPLogEntry[]> = new Map();
    for (const [testId, record] of this.testErrors) {
      if (record.errors.length > 0) {
        errorsByTest.set(`${record.testFile} > ${record.testTitle}`, record.errors);
      }
    }

    // Count by level
    const levelCounts: Record<ErrorLevel, number> = {
      fatal: 0, error: 0, warning: 0, notice: 0, deprecated: 0, unknown: 0,
    };
    for (const entry of errors) {
      levelCounts[entry.level]++;
    }

    // Build HTML
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FooGallery PHP Error Report</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    h1 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
    h2 { color: #555; margin-top: 30px; }
    h3 { color: #666; font-size: 1rem; margin: 20px 0 10px; }
    .summary {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 20px;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 15px;
      margin-top: 15px;
    }
    .summary-item {
      text-align: center;
      padding: 15px;
      border-radius: 6px;
      background: #f8f9fa;
    }
    .summary-item.fatal { background: #f8d7da; color: #721c24; }
    .summary-item.error { background: #f5c6cb; color: #721c24; }
    .summary-item.warning { background: #fff3cd; color: #856404; }
    .summary-item.notice { background: #d1ecf1; color: #0c5460; }
    .summary-item.deprecated { background: #e2e3e5; color: #383d41; }
    .summary-count { font-size: 2rem; font-weight: bold; }
    .summary-label { font-size: 0.875rem; text-transform: uppercase; }
    .test-group {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 15px;
    }
    .test-name {
      font-weight: 600;
      color: #333;
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }
    .error-entry {
      padding: 10px;
      margin: 5px 0;
      border-left: 4px solid #ccc;
      background: #f8f9fa;
      font-family: monospace;
      font-size: 0.875rem;
      overflow-x: auto;
    }
    .error-entry.fatal { border-color: #dc3545; background: #f8d7da; }
    .error-entry.error { border-color: #dc3545; background: #f8d7da; }
    .error-entry.warning { border-color: #ffc107; background: #fff3cd; }
    .error-entry.notice { border-color: #17a2b8; background: #d1ecf1; }
    .error-entry.deprecated { border-color: #6c757d; background: #e2e3e5; }
    .error-level {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 3px;
      font-size: 0.75rem;
      font-weight: bold;
      text-transform: uppercase;
      margin-right: 10px;
    }
    .error-level.fatal { background: #dc3545; color: white; }
    .error-level.error { background: #dc3545; color: white; }
    .error-level.warning { background: #ffc107; color: #333; }
    .error-level.notice { background: #17a2b8; color: white; }
    .error-level.deprecated { background: #6c757d; color: white; }
    .error-location { color: #666; font-size: 0.8rem; margin-top: 5px; }
    .error-header { display: flex; align-items: center; gap: 10px; margin-bottom: 5px; }
    .error-message { word-break: break-word; }
    .error-line { color: #666; font-size: 0.8rem; }
    .occurrence-count {
      background: #6c757d;
      color: white;
      padding: 2px 6px;
      border-radius: 10px;
      font-size: 0.7rem;
      font-weight: bold;
    }
    .no-errors {
      text-align: center;
      padding: 40px;
      color: #28a745;
      font-size: 1.2rem;
    }
    .no-errors::before { content: '✓ '; }
    .meta { color: #888; font-size: 0.875rem; }
    .version-info { margin-top: 10px; }
    .version-badge {
      display: inline-block;
      padding: 4px 10px;
      margin-right: 8px;
      background: #007bff;
      color: white;
      border-radius: 4px;
      font-size: 0.8rem;
    }
  </style>
</head>
<body>
  <h1>FooGallery PHP Error Report</h1>

  <div class="summary">
    <p class="meta">Test Run: ${timestamp} | Tests: ${testCount}</p>
    <div class="version-info">
      <span class="version-badge">WordPress ${env.wordpressVersion}</span>
      <span class="version-badge">PHP ${env.phpVersion}</span>
      <span class="version-badge">FooGallery ${env.fooGalleryVersion}</span>
    </div>

    <div class="summary-grid">
      <div class="summary-item fatal">
        <div class="summary-count">${levelCounts.fatal}</div>
        <div class="summary-label">Fatal</div>
      </div>
      <div class="summary-item error">
        <div class="summary-count">${levelCounts.error}</div>
        <div class="summary-label">Errors</div>
      </div>
      <div class="summary-item warning">
        <div class="summary-count">${levelCounts.warning}</div>
        <div class="summary-label">Warnings</div>
      </div>
      <div class="summary-item notice">
        <div class="summary-count">${levelCounts.notice}</div>
        <div class="summary-label">Notices</div>
      </div>
      <div class="summary-item deprecated">
        <div class="summary-count">${levelCounts.deprecated}</div>
        <div class="summary-label">Deprecated</div>
      </div>
    </div>
  </div>
`;

    if (errors.length === 0) {
      html += `
  <div class="test-group">
    <div class="no-errors">No FooGallery PHP errors detected during test run</div>
  </div>
`;
    } else {
      // Generate unique errors summary section
      html += this.buildUniqueErrorsSection(errors);

      // Errors by Test section
      html += `<h2>Errors by Test</h2>`;

      if (errorsByTest.size === 0) {
        html += `
  <div class="test-group">
    <p class="meta">No test-specific errors captured. Errors shown above were detected in Docker logs.</p>
  </div>`;
      } else {
        for (const [testName, testErrors] of errorsByTest) {
          html += `
  <div class="test-group">
    <div class="test-name">${this.escapeHtml(testName)}</div>
`;
          for (const entry of testErrors) {
            const location = entry.file ? `${path.basename(entry.file)}:${entry.line}` : '';
            html += `
    <div class="error-entry ${entry.level}">
      <span class="error-level ${entry.level}">${entry.level}</span>
      ${this.escapeHtml(entry.message)}
      ${location ? `<div class="error-location">${this.escapeHtml(location)}</div>` : ''}
    </div>
`;
          }
          html += `  </div>`;
        }
      }
    }

    html += `
</body>
</html>`;

    return html;
  }

  /**
   * Generate JSON summary
   */
  private async generateJSONSummary(fullLog: { entries: PHPLogEntry[]; fooGalleryOnly: PHPLogEntry[] }): Promise<void> {
    const summaryPath = path.join(this.outputDir, 'php-errors-summary.json');

    const summary = {
      timestamp: this.startTime.toISOString(),
      totalTests: this.testErrors.size,
      totalErrors: fullLog.fooGalleryOnly.length,
      summary: getSummary(fullLog.fooGalleryOnly),
      byTest: Array.from(this.testErrors.entries()).map(([testId, record]) => ({
        testId,
        testFile: record.testFile,
        testTitle: record.testTitle,
        errorCount: record.errors.length,
        errors: record.errors.map(e => ({
          level: e.level,
          message: e.message,
          file: e.file,
          line: e.line,
        })),
      })).filter(t => t.errorCount > 0),
      allErrors: fullLog.fooGalleryOnly.map(e => ({
        level: e.level,
        message: e.message,
        file: e.file,
        line: e.line,
        timestamp: e.timestamp?.toISOString(),
      })),
    };

    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    console.log(`[PHP Error Reporter] JSON summary: ${summaryPath}`);
  }

  /**
   * Copy the full debug.log to test-results
   */
  private async copyDebugLog(fullLog: { raw: string }): Promise<void> {
    const logPath = path.join(this.outputDir, 'debug.log');
    fs.writeFileSync(logPath, fullLog.raw || '(empty)');
    console.log(`[PHP Error Reporter] Debug log: ${logPath}`);
  }

  /**
   * Print console summary
   */
  private printConsoleSummary(fullLog: { fooGalleryOnly: PHPLogEntry[] }): void {
    const errors = fullLog.fooGalleryOnly;
    const summary = getSummary(errors);

    console.log('\n========================================');
    console.log('[PHP Error Reporter] Summary');
    console.log('========================================');

    if (errors.length === 0) {
      console.log('\n  No FooGallery PHP errors detected!\n');
    } else {
      console.log(`\n  Total FooGallery entries: ${errors.length}`);
      console.log(`  - Fatal: ${summary.byLevel.fatal}`);
      console.log(`  - Errors: ${summary.byLevel.error}`);
      console.log(`  - Warnings: ${summary.byLevel.warning}`);
      console.log(`  - Notices: ${summary.byLevel.notice}`);
      console.log(`  - Deprecated: ${summary.byLevel.deprecated}`);

      // Show tests with errors
      const testsWithErrors = Array.from(this.testErrors.values())
        .filter(r => r.errors.length > 0);

      if (testsWithErrors.length > 0) {
        console.log(`\n  Tests with PHP errors (${testsWithErrors.length}):`);
        for (const record of testsWithErrors.slice(0, 5)) {
          console.log(`    - ${record.testFile}: ${record.testTitle} (${record.errors.length} entries)`);
        }
        if (testsWithErrors.length > 5) {
          console.log(`    ... and ${testsWithErrors.length - 5} more`);
        }
      }
    }

    console.log('\n  Reports generated in: test-results/');
    console.log('    - php-errors-report.html');
    console.log('    - php-errors-summary.json');
    console.log('    - debug.log\n');
    console.log('========================================\n');
  }

  /**
   * Build the unique errors section for the HTML report
   */
  private buildUniqueErrorsSection(errors: PHPLogEntry[]): string {
    // Group and deduplicate errors by file:line:message
    const uniqueErrors = new Map<string, { entry: PHPLogEntry; count: number }>();

    for (const entry of errors) {
      const key = `${entry.file || 'unknown'}:${entry.line || 0}:${entry.message}`;
      const existing = uniqueErrors.get(key);
      if (existing) {
        existing.count++;
      } else {
        uniqueErrors.set(key, { entry, count: 1 });
      }
    }

    // Sort by level severity then by file
    const levelPriority: Record<ErrorLevel, number> = {
      fatal: 0, error: 1, warning: 2, notice: 3, deprecated: 4, unknown: 5,
    };

    const sortedErrors = Array.from(uniqueErrors.values()).sort((a, b) => {
      const levelDiff = levelPriority[a.entry.level] - levelPriority[b.entry.level];
      if (levelDiff !== 0) return levelDiff;
      return (a.entry.file || '').localeCompare(b.entry.file || '');
    });

    // Group by file
    const errorsByFile = new Map<string, { entry: PHPLogEntry; count: number }[]>();
    for (const item of sortedErrors) {
      const file = item.entry.file ? path.basename(item.entry.file) : 'Unknown Source';
      const existing = errorsByFile.get(file) || [];
      existing.push(item);
      errorsByFile.set(file, existing);
    }

    let html = `<h2>All Errors & Warnings (${uniqueErrors.size} unique)</h2>`;

    for (const [file, fileErrors] of errorsByFile) {
      html += `
  <div class="test-group">
    <div class="test-name">${this.escapeHtml(file)}</div>
`;
      for (const { entry, count } of fileErrors) {
        const location = entry.line ? `Line ${entry.line}` : '';
        const countBadge = count > 1 ? `<span class="occurrence-count">${count}x</span>` : '';

        // Extract just the error message without the PHP prefix for cleaner display
        let cleanMessage = entry.message;
        const phpPrefixMatch = cleanMessage.match(/^PHP (Warning|Error|Notice|Fatal error|Deprecated):\s*/i);
        if (phpPrefixMatch) {
          cleanMessage = cleanMessage.substring(phpPrefixMatch[0].length);
        }

        html += `
    <div class="error-entry ${entry.level}">
      <div class="error-header">
        <span class="error-level ${entry.level}">${entry.level}</span>
        ${countBadge}
        ${location ? `<span class="error-line">${location}</span>` : ''}
      </div>
      <div class="error-message">${this.escapeHtml(cleanMessage)}</div>
    </div>
`;
      }
      html += `  </div>`;
    }

    return html;
  }

  /**
   * Escape HTML special characters
   */
  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

export default PHPErrorReporter;
