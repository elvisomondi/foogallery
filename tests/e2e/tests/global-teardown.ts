// File: tests/global-teardown.ts
// Global teardown for FooGallery Premium E2E Testing
//
// Note: PHP error capture and reporting is handled by the PHPErrorReporter.
// This teardown handles basic cleanup only.

import { FullConfig } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import { isContainerRunning } from './helpers/php-error-log-helper';

/**
 * Global teardown function - runs once after all tests complete
 */
async function globalTeardown(config: FullConfig): Promise<void> {
  console.log('\n========================================');
  console.log('[Global Teardown] FooGallery E2E Test Cleanup');
  console.log('========================================\n');

  // Ensure test-results directory exists
  const outputDir = path.resolve(config.rootDir, '..', 'test-results');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Check if container is still running
  if (!isContainerRunning()) {
    console.log('[Global Teardown] WordPress container not running');
  }

  console.log('[Global Teardown] Complete!\n');
}

export default globalTeardown;
