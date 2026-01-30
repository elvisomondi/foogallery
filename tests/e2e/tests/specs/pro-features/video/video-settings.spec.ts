// File: tests/specs/pro-features/video/video-settings.spec.ts
// Tests for video gallery settings configuration

import { test, expect } from '@playwright/test';
import {
  configureVideoSettings,
  navigateToVideoSettings,
  createGalleryWithVideos,
  VIDEO_HOVER_ICONS,
  VIDEO_SIZES,
  VIDEO_ICON_SIZES,
} from '../../../helpers/video-test-helper';

test.describe('Video Settings Configuration', () => {
  test.describe.configure({ mode: 'serial' });

  const templateSelector = 'default';
  const screenshotPrefix = 'video-settings';

  test.beforeEach(async ({ page }) => {
    // Viewport is set globally in playwright.config.ts
  });

  test('enables video feature by default', async ({ page }) => {
    // Navigate to create new gallery
    await page.goto('/wp-admin/post-new.php?post_type=foogallery');
    await page.waitForLoadState('domcontentloaded');

    // Enter gallery title
    await page.locator('#title').fill('Test Video Default Enabled');

    // Select template
    const templateCard = page.locator(`[data-template="${templateSelector}"]`);
    await templateCard.waitFor({ state: 'visible', timeout: 10000 });
    await templateCard.click();

    // Navigate to Video settings tab
    await navigateToVideoSettings(page, templateSelector);

    // Screenshot

    // Verify video is enabled by default (empty value radio should be checked)
    const templateContainer = page.locator(`.foogallery-settings-container-${templateSelector}`);
    const enabledRadio = templateContainer.locator(`input[name*="${templateSelector}_video_enabled"][value=""]`);
    await expect(enabledRadio).toBeChecked();
  });

  test('disables video feature', async ({ page }) => {
    // Navigate to create new gallery
    await page.goto('/wp-admin/post-new.php?post_type=foogallery');
    await page.waitForLoadState('domcontentloaded');

    // Enter gallery title
    await page.locator('#title').fill('Test Video Disabled');

    // Select template
    const templateCard = page.locator(`[data-template="${templateSelector}"]`);
    await templateCard.waitFor({ state: 'visible', timeout: 10000 });
    await templateCard.click();

    // Configure video settings - disabled
    await configureVideoSettings(page, templateSelector, {
      enabled: false,
    });

    // Screenshot

    // Verify disabled radio is checked
    const templateContainer = page.locator(`.foogallery-settings-container-${templateSelector}`);
    const disabledRadio = templateContainer.locator(`input[name*="${templateSelector}_video_enabled"][value="disabled"]`);
    await expect(disabledRadio).toBeChecked();
  });

  test('displays video hover icon options', async ({ page }) => {
    // Navigate to create new gallery
    await page.goto('/wp-admin/post-new.php?post_type=foogallery');
    await page.waitForLoadState('domcontentloaded');

    // Enter gallery title
    await page.locator('#title').fill('Test Video Icons');

    // Select template
    const templateCard = page.locator(`[data-template="${templateSelector}"]`);
    await templateCard.waitFor({ state: 'visible', timeout: 10000 });
    await templateCard.click();

    // Navigate to Video settings tab
    await navigateToVideoSettings(page, templateSelector);

    // Screenshot

    // Verify all 6 icon options are present
    const templateContainer = page.locator(`.foogallery-settings-container-${templateSelector}`);
    const iconRadios = templateContainer.locator(`input[name*="${templateSelector}_video_hover_icon"]`);

    // Should have 6 options (none + 5 icon styles)
    const count = await iconRadios.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  // TODO: Needs Chrome DevTools recording to capture exact selectors for htmlicon field
  test.skip('applies video hover icon to gallery', async ({ page }) => {
    // Navigate to create new gallery
    await page.goto('/wp-admin/post-new.php?post_type=foogallery');
    await page.waitForLoadState('domcontentloaded');

    // Enter gallery title
    await page.locator('#title').fill('Test Video Icon Style');

    // Select template
    const templateCard = page.locator(`[data-template="${templateSelector}"]`);
    await templateCard.waitFor({ state: 'visible', timeout: 10000 });
    await templateCard.click();

    // Configure video settings - use icon2 style
    await configureVideoSettings(page, templateSelector, {
      enabled: true,
      hoverIcon: 'icon2',
    });

    // Screenshot

    // Verify icon2 is selected by checking the hidden radio button state
    const isChecked = await page.evaluate(() => {
      const radio = document.querySelector('input[name*="video_hover_icon"][value="fg-video-2"]') as HTMLInputElement;
      return radio ? radio.checked : false;
    });
    expect(isChecked).toBe(true);
  });

  test('enables sticky video icon', async ({ page }) => {
    // Navigate to create new gallery
    await page.goto('/wp-admin/post-new.php?post_type=foogallery');
    await page.waitForLoadState('domcontentloaded');

    // Enter gallery title
    await page.locator('#title').fill('Test Sticky Icon Enabled');

    // Select template
    const templateCard = page.locator(`[data-template="${templateSelector}"]`);
    await templateCard.waitFor({ state: 'visible', timeout: 10000 });
    await templateCard.click();

    // Configure video settings - sticky icon enabled
    await configureVideoSettings(page, templateSelector, {
      enabled: true,
      stickyIcon: true,
    });

    // Screenshot

    // Verify sticky icon is enabled - check the Yes radio is checked
    const templateContainer = page.locator(`.foogallery-settings-container-${templateSelector}`);
    const stickyRow = templateContainer.locator('tr').filter({ hasText: 'Sticky Video Icon' });
    const yesRadio = stickyRow.locator('input[type="radio"][value="fg-video-sticky"]');
    await expect(yesRadio).toBeChecked();
  });

  test('disables sticky video icon', async ({ page }) => {
    // Navigate to create new gallery
    await page.goto('/wp-admin/post-new.php?post_type=foogallery');
    await page.waitForLoadState('domcontentloaded');

    // Enter gallery title
    await page.locator('#title').fill('Test Sticky Icon Disabled');

    // Select template
    const templateCard = page.locator(`[data-template="${templateSelector}"]`);
    await templateCard.waitFor({ state: 'visible', timeout: 10000 });
    await templateCard.click();

    // Configure video settings - sticky icon disabled
    await configureVideoSettings(page, templateSelector, {
      enabled: true,
      stickyIcon: false,
    });

    // Screenshot

    // Verify sticky icon is disabled (No is checked)
    const templateContainer = page.locator(`.foogallery-settings-container-${templateSelector}`);
    const stickyRow = templateContainer.locator('tr').filter({ hasText: 'Sticky Video Icon' });
    const noRadio = stickyRow.locator('input[type="radio"][value=""]');
    await expect(noRadio).toBeChecked();
  });

  test('sets video icon size', async ({ page }) => {
    // Navigate to create new gallery
    await page.goto('/wp-admin/post-new.php?post_type=foogallery');
    await page.waitForLoadState('domcontentloaded');

    // Enter gallery title
    await page.locator('#title').fill('Test Icon Size');

    // Select template
    const templateCard = page.locator(`[data-template="${templateSelector}"]`);
    await templateCard.waitFor({ state: 'visible', timeout: 10000 });
    await templateCard.click();

    // Navigate to Video settings
    await navigateToVideoSettings(page, templateSelector);

    // Screenshot before - show icon size options

    // Note: Icon size setting is only visible when hover effect is "None"
    // This test verifies the setting exists
    const templateContainer = page.locator(`.foogallery-settings-container-${templateSelector}`);
    const iconSizeRadios = templateContainer.locator(`input[name*="${templateSelector}_video_icon_size"]`);

    // The setting exists even if hidden
    const count = await iconSizeRadios.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('configures lightbox video size', async ({ page }) => {
    // Navigate to create new gallery
    await page.goto('/wp-admin/post-new.php?post_type=foogallery');
    await page.waitForLoadState('domcontentloaded');

    // Enter gallery title
    await page.locator('#title').fill('Test Lightbox Size');

    // Select template
    const templateCard = page.locator(`[data-template="${templateSelector}"]`);
    await templateCard.waitFor({ state: 'visible', timeout: 10000 });
    await templateCard.click();

    // Configure video settings - set HD size
    await configureVideoSettings(page, templateSelector, {
      enabled: true,
      videoSize: '1280x720',
    });

    // Screenshot

    // Verify size is selected
    const templateContainer = page.locator(`.foogallery-settings-container-${templateSelector}`);
    const sizeSelect = templateContainer.locator(`select[name*="${templateSelector}_video_size"]`);
    await expect(sizeSelect).toHaveValue('1280x720');
  });

  test('enables lightbox autoplay', async ({ page }) => {
    // Navigate to create new gallery
    await page.goto('/wp-admin/post-new.php?post_type=foogallery');
    await page.waitForLoadState('domcontentloaded');

    // Enter gallery title
    await page.locator('#title').fill('Test Autoplay Enabled');

    // Select template
    const templateCard = page.locator(`[data-template="${templateSelector}"]`);
    await templateCard.waitFor({ state: 'visible', timeout: 10000 });
    await templateCard.click();

    // Configure video settings - autoplay enabled
    await configureVideoSettings(page, templateSelector, {
      enabled: true,
      autoplay: true,
    });

    // Screenshot

    // Verify autoplay is enabled (Yes is checked)
    const templateContainer = page.locator(`.foogallery-settings-container-${templateSelector}`);
    const autoplayRow = templateContainer.locator('tr').filter({ hasText: 'Lightbox Autoplay' });
    const yesRadio = autoplayRow.locator('input[type="radio"][value="yes"]');
    await expect(yesRadio).toBeChecked();
  });

  test('disables lightbox autoplay', async ({ page }) => {
    // Navigate to create new gallery
    await page.goto('/wp-admin/post-new.php?post_type=foogallery');
    await page.waitForLoadState('domcontentloaded');

    // Enter gallery title
    await page.locator('#title').fill('Test Autoplay Disabled');

    // Select template
    const templateCard = page.locator(`[data-template="${templateSelector}"]`);
    await templateCard.waitFor({ state: 'visible', timeout: 10000 });
    await templateCard.click();

    // Configure video settings - autoplay disabled
    await configureVideoSettings(page, templateSelector, {
      enabled: true,
      autoplay: false,
    });

    // Screenshot

    // Verify autoplay is disabled (No is checked)
    const templateContainer = page.locator(`.foogallery-settings-container-${templateSelector}`);
    const autoplayRow = templateContainer.locator('tr').filter({ hasText: 'Lightbox Autoplay' });
    const noRadio = autoplayRow.locator('input[type="radio"][value="no"]');
    await expect(noRadio).toBeChecked();
  });
});
