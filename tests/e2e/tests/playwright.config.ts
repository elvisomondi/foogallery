// File: tests/playwright.config.ts
// Playwright configuration for FooGallery Premium E2E Testing

import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const baseURL = process.env.WP_BASE_URL || 'http://localhost:8080';
const isCI = process.env.CI === 'true';

export default defineConfig({
  // Test directory
  testDir: './specs',

  // Maximum time one test can run
  timeout: 60 * 1000,

  // Maximum time expect() should wait for condition
  expect: {
    timeout: 10 * 1000,
  },

  // Run tests sequentially in Phase 1
  fullyParallel: true,
  workers: 2,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: isCI,

  // Retry failed tests (1 on CI, 0 locally)
  retries: isCI ? 1 : 0,

  // Reporter configuration
  reporter: [
    // Console output during test run
    ['list'],
    // HTML report with dashboard
    ['html', {
      open: 'never',
      outputFolder: '../playwright-report',
    }],
    // PHP error capture reporter
    ['./reporters/php-error-reporter.ts'],
  ],

  // Shared settings for all projects
  use: {
    // Base URL for all tests
    baseURL,

    // Action timeout
    actionTimeout: 30 * 1000,

    // Collect trace on failure for debugging
    trace: 'retain-on-failure',

    // Capture screenshot only on failure (reduces overhead)
    screenshot: 'only-on-failure',

    // Record video on failure
    video: 'retain-on-failure',

    // Viewport size (optimized for FooGallery admin)
    viewport: { width: 1932, height: 1271 },

    // Ignore HTTPS errors (for local development)
    ignoreHTTPSErrors: true,
  },

  // Global setup and teardown
  globalSetup: require.resolve('./global-setup'),
  globalTeardown: require.resolve('./global-teardown'),

  // Configure projects (Chromium only for Phase 1)
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Use stored authentication state
        storageState: path.resolve(__dirname, '../.auth/admin.json'),
      },
    },
  ],

  // Output folder for test artifacts
  outputDir: '../test-results',
});
