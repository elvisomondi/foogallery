// File: tests/helpers/php-error-log-helper.ts
// PHP Error Log Capture Utility for FooGallery E2E Testing

import { execSync } from 'child_process';

/**
 * Error severity levels
 */
export type ErrorLevel = 'fatal' | 'error' | 'warning' | 'notice' | 'deprecated' | 'unknown';

/**
 * Environment version information
 */
export interface EnvironmentInfo {
  wordpressVersion: string;
  phpVersion: string;
  fooGalleryVersion: string;
}

/**
 * Parsed PHP log entry
 */
export interface PHPLogEntry {
  timestamp: Date | null;
  level: ErrorLevel;
  message: string;
  file?: string;
  line?: number;
  raw: string;
}

/**
 * Result from reading the debug log
 */
export interface LogCaptureResult {
  entries: PHPLogEntry[];
  raw: string;
  fooGalleryOnly: PHPLogEntry[];
  byLevel: Record<ErrorLevel, PHPLogEntry[]>;
}

// Constants
const CONTAINER_NAME = 'foogallery-e2e-wordpress';
const DEBUG_LOG_PATH = '/var/www/html/wp-content/debug.log';
const MAX_BUFFER = 10 * 1024 * 1024; // 10MB

/**
 * Empty result for when container is not running
 */
const EMPTY_LOG_RESULT: LogCaptureResult = {
  entries: [],
  raw: '',
  fooGalleryOnly: [],
  byLevel: { fatal: [], error: [], warning: [], notice: [], deprecated: [], unknown: [] },
};

/**
 * FooGallery-related patterns for filtering
 */
const FOOGALLERY_PATTERNS = [
  /foogallery/i,
  /\/foogallery-premium\//i,
  /class-foogallery/i,
  /\bfg_/i,
  /\bfoogallery_/i,
  /FooGallery/,
  /FooGallery_/,
];

/**
 * Patterns to identify error levels
 */
const LEVEL_PATTERNS: { level: ErrorLevel; pattern: RegExp }[] = [
  { level: 'fatal', pattern: /Fatal error:/i },
  { level: 'fatal', pattern: /PHP Fatal/i },
  { level: 'error', pattern: /PHP Error:/i },
  { level: 'error', pattern: /\bError:/i },
  { level: 'warning', pattern: /PHP Warning:/i },
  { level: 'warning', pattern: /\bWarning:/i },
  { level: 'notice', pattern: /PHP Notice:/i },
  { level: 'notice', pattern: /\bNotice:/i },
  { level: 'deprecated', pattern: /Deprecated:/i },
  { level: 'deprecated', pattern: /PHP Deprecated:/i },
];

/**
 * Pattern to extract file and line info
 */
const FILE_LINE_PATTERN = /in\s+([^\s]+\.php)\s+on\s+line\s+(\d+)/i;

/**
 * Pattern to extract timestamp from WordPress debug.log format
 */
const TIMESTAMP_PATTERN = /^\[(\d{2}-\w{3}-\d{4}\s+\d{2}:\d{2}:\d{2}\s+\w+)\]/;

/**
 * Execute a command in the WordPress Docker container
 */
function dockerExec(command: string): string {
  try {
    return execSync(
      `docker exec ${CONTAINER_NAME} ${command}`,
      { encoding: 'utf-8', maxBuffer: MAX_BUFFER }
    );
  } catch (error: unknown) {
    const execError = error as { status?: number; stdout?: string };
    if (execError.status === 1 && execError.stdout === '') {
      return '';
    }
    throw error;
  }
}

/**
 * Check if the WordPress container is running
 */
export function isContainerRunning(): boolean {
  try {
    const result = execSync(
      `docker ps --filter "name=${CONTAINER_NAME}" --format "{{.Names}}"`,
      { encoding: 'utf-8' }
    );
    return result.trim() === CONTAINER_NAME;
  } catch {
    return false;
  }
}

/**
 * Read PHP errors from Docker container logs
 */
function readDockerLogs(): string {
  try {
    return execSync(
      `docker logs ${CONTAINER_NAME} 2>&1 | grep -E "\\[php:(warn|error|notice)\\]" || true`,
      { encoding: 'utf-8', maxBuffer: MAX_BUFFER }
    );
  } catch {
    return '';
  }
}

/**
 * Parse Docker log format into WordPress debug.log format
 */
function convertDockerLogFormat(dockerLog: string): string {
  const lines = dockerLog.split('\n');
  const converted: string[] = [];

  for (const line of lines) {
    const match = line.match(/\[(\w{3} \w{3} \d{2} \d{2}:\d{2}:\d{2})\.\d+ (\d{4})\] \[php:\w+\] \[pid [^\]]+\] \[client [^\]]+\] (.+)/);
    if (match) {
      const [, dateTime, year, message] = match;
      const date = new Date(`${dateTime} ${year} UTC`);
      const formattedDate = date.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC');
      const wpDate = `[${formattedDate.replace(/^(\d{4})-(\d{2})-(\d{2})/, (_, y, m, d) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${d}-${months[parseInt(m) - 1]}-${y}`;
      })}]`;
      converted.push(`${wpDate} ${message}`);
    }
  }

  return converted.join('\n');
}

/**
 * Read the WordPress debug.log file from the Docker container
 * Also reads PHP errors from Docker logs since Apache logs there
 */
export async function readDebugLog(): Promise<LogCaptureResult> {
  if (!isContainerRunning()) {
    return EMPTY_LOG_RESULT;
  }

  const debugLogRaw = dockerExec(`cat ${DEBUG_LOG_PATH} 2>/dev/null || echo ""`);
  const dockerLogsRaw = readDockerLogs();
  const convertedDockerLogs = convertDockerLogFormat(dockerLogsRaw);

  const raw = [debugLogRaw, convertedDockerLogs].filter(s => s.trim()).join('\n');
  const entries = parseLogEntries(raw);
  const fooGalleryOnly = filterFooGalleryErrors(entries);

  return {
    entries,
    raw,
    fooGalleryOnly,
    byLevel: categorizeByLevel(entries),
  };
}

/**
 * Get the current byte position (size) of the debug.log file
 */
export async function getLogPosition(): Promise<number> {
  if (!isContainerRunning()) {
    return 0;
  }

  try {
    const result = dockerExec(`stat -c %s ${DEBUG_LOG_PATH} 2>/dev/null || echo "0"`);
    return parseInt(result.trim(), 10) || 0;
  } catch {
    return 0;
  }
}

/**
 * Read log entries since a specific byte position
 */
export async function readLogSince(position: number): Promise<LogCaptureResult> {
  if (!isContainerRunning()) {
    return EMPTY_LOG_RESULT;
  }

  const raw = dockerExec(`tail -c +${position + 1} ${DEBUG_LOG_PATH} 2>/dev/null || echo ""`);
  const entries = parseLogEntries(raw);
  const fooGalleryOnly = filterFooGalleryErrors(entries);

  return {
    entries,
    raw,
    fooGalleryOnly,
    byLevel: categorizeByLevel(entries),
  };
}

/**
 * Clear the debug.log file (truncate to empty)
 */
export async function clearDebugLog(): Promise<void> {
  if (!isContainerRunning()) {
    console.log('[PHP Error Log] Container not running, skipping log clear');
    return;
  }

  try {
    dockerExec(`truncate -s 0 ${DEBUG_LOG_PATH} 2>/dev/null || true`);
    dockerExec(`touch ${DEBUG_LOG_PATH} && chown www-data:www-data ${DEBUG_LOG_PATH}`);
    console.log('[PHP Error Log] Cleared debug.log');
  } catch (error) {
    console.warn('[PHP Error Log] Could not clear debug.log:', error);
  }
}

/**
 * Parse raw log content into structured entries
 */
export function parseLogEntries(content: string): PHPLogEntry[] {
  if (!content || content.trim() === '') {
    return [];
  }

  const entries: PHPLogEntry[] = [];
  const lines = content.split('\n');
  let currentEntry: string[] = [];

  for (const line of lines) {
    if (TIMESTAMP_PATTERN.test(line) && currentEntry.length > 0) {
      const entry = parseEntry(currentEntry.join('\n'));
      if (entry) {
        entries.push(entry);
      }
      currentEntry = [line];
    } else if (line.trim()) {
      if (currentEntry.length === 0 && !TIMESTAMP_PATTERN.test(line)) {
        currentEntry = [line];
      } else {
        currentEntry.push(line);
      }
    }
  }

  if (currentEntry.length > 0) {
    const entry = parseEntry(currentEntry.join('\n'));
    if (entry) {
      entries.push(entry);
    }
  }

  return entries;
}

/**
 * Parse a single log entry
 */
function parseEntry(raw: string): PHPLogEntry | null {
  if (!raw || raw.trim() === '') {
    return null;
  }

  let timestamp: Date | null = null;
  const timestampMatch = raw.match(TIMESTAMP_PATTERN);
  if (timestampMatch) {
    try {
      timestamp = new Date(timestampMatch[1]);
    } catch {
      // Invalid date, leave as null
    }
  }

  let level: ErrorLevel = 'unknown';
  for (const { level: l, pattern } of LEVEL_PATTERNS) {
    if (pattern.test(raw)) {
      level = l;
      break;
    }
  }

  let file: string | undefined;
  let line: number | undefined;
  const fileLineMatch = raw.match(FILE_LINE_PATTERN);
  if (fileLineMatch) {
    file = fileLineMatch[1];
    line = parseInt(fileLineMatch[2], 10);
  }

  let message = raw;
  if (timestampMatch) {
    message = raw.substring(timestampMatch[0].length).trim();
  }

  return { timestamp, level, message, file, line, raw };
}

/**
 * Filter entries to only include FooGallery-related errors
 */
export function filterFooGalleryErrors(entries: PHPLogEntry[]): PHPLogEntry[] {
  return entries.filter(entry => {
    return FOOGALLERY_PATTERNS.some(pattern => pattern.test(entry.raw));
  });
}

/**
 * Categorize entries by error level
 */
export function categorizeByLevel(entries: PHPLogEntry[]): Record<ErrorLevel, PHPLogEntry[]> {
  const result: Record<ErrorLevel, PHPLogEntry[]> = {
    fatal: [],
    error: [],
    warning: [],
    notice: [],
    deprecated: [],
    unknown: [],
  };

  for (const entry of entries) {
    result[entry.level].push(entry);
  }

  return result;
}

/**
 * Get a summary object for reporting
 */
export function getSummary(entries: PHPLogEntry[]): {
  total: number;
  byLevel: Record<ErrorLevel, number>;
  fooGalleryCount: number;
} {
  const byLevel = categorizeByLevel(entries);
  const fooGalleryOnly = filterFooGalleryErrors(entries);

  return {
    total: entries.length,
    byLevel: {
      fatal: byLevel.fatal.length,
      error: byLevel.error.length,
      warning: byLevel.warning.length,
      notice: byLevel.notice.length,
      deprecated: byLevel.deprecated.length,
      unknown: byLevel.unknown.length,
    },
    fooGalleryCount: fooGalleryOnly.length,
  };
}

/**
 * Get WordPress, PHP, and FooGallery version information from the Docker container
 */
export function getEnvironmentInfo(): EnvironmentInfo {
  if (!isContainerRunning()) {
    return {
      wordpressVersion: 'Unknown',
      phpVersion: 'Unknown',
      fooGalleryVersion: 'Unknown',
    };
  }

  try {
    const wordpressVersion = execSync(
      `docker exec ${CONTAINER_NAME} wp core version --allow-root`,
      { encoding: 'utf-8' }
    ).trim();

    const phpVersion = execSync(
      `docker exec ${CONTAINER_NAME} php -r "echo PHP_VERSION;"`,
      { encoding: 'utf-8' }
    ).trim();

    const fooGalleryVersion = execSync(
      `docker exec ${CONTAINER_NAME} wp plugin get foogallery-premium --field=version --allow-root`,
      { encoding: 'utf-8' }
    ).trim();

    return {
      wordpressVersion: wordpressVersion || 'Unknown',
      phpVersion: phpVersion || 'Unknown',
      fooGalleryVersion: fooGalleryVersion || 'Unknown',
    };
  } catch {
    return {
      wordpressVersion: 'Unknown',
      phpVersion: 'Unknown',
      fooGalleryVersion: 'Unknown',
    };
  }
}
