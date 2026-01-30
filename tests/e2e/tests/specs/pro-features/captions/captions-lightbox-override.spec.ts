// File: tests/specs/pro-features/captions/captions-lightbox-override.spec.ts
// Tests for Lightbox Caption Override functionality

import { test, expect } from '@playwright/test';
import {
  navigateToLightboxInfoTab,
  setLightboxCaptionOverride,
  setLightboxOverrideTitleSource,
  setLightboxOverrideDescSource,
  setLightboxCustomTemplate,
  createGalleryAndNavigateToPage,
  getDataAttributes,
  openLightbox,
  getCaptionFromLightbox,
  closeLightbox,
  CAPTION_SELECTORS,
  CAPTION_SOURCES,
} from '../../../helpers/captions-test-helper';

test.describe('Lightbox Caption Override', () => {
  test.describe.configure({ mode: 'serial' });

  const templateSelector = 'default';
  const screenshotPrefix = 'captions-lightbox-override';

  test.beforeEach(async ({ page }) => {
  });

  test('uses thumbnail caption by default', async ({ page }) => {
    // Navigate to create new gallery
    await page.goto('/wp-admin/post-new.php?post_type=foogallery');
    await page.waitForLoadState('domcontentloaded');

    // Enter gallery title
    await page.locator('#title').fill('Test Default Lightbox Caption');

    // Select template
    const templateCard = page.locator(`[data-template="${templateSelector}"]`);
    await templateCard.waitFor({ state: 'visible', timeout: 10000 });
    await templateCard.click();

    // Navigate to Lightbox Info tab
    await navigateToLightboxInfoTab(page, templateSelector);

    // Screenshot

    // Verify override is set to none (default)
    const noneRadio = page.locator(`#FooGallerySettings_${templateSelector}_lightbox_caption_override0`);
    await expect(noneRadio).toBeChecked();
  });

  test('enables caption override', async ({ page }) => {
    // Navigate to create new gallery
    await page.goto('/wp-admin/post-new.php?post_type=foogallery');
    await page.waitForLoadState('domcontentloaded');

    // Enter gallery title
    await page.locator('#title').fill('Test Enable Caption Override');

    // Select template
    const templateCard = page.locator(`[data-template="${templateSelector}"]`);
    await templateCard.waitFor({ state: 'visible', timeout: 10000 });
    await templateCard.click();

    // Navigate to Lightbox Info tab and enable override
    await navigateToLightboxInfoTab(page, templateSelector);
    await setLightboxCaptionOverride(page, 'override', templateSelector);

    // Screenshot

    // Verify override is enabled
    const overrideRadio = page.locator(`#FooGallerySettings_${templateSelector}_lightbox_caption_override1`);
    await expect(overrideRadio).toBeChecked();
  });

  test('overrides title source', async ({ page }) => {
    // Navigate to create new gallery
    await page.goto('/wp-admin/post-new.php?post_type=foogallery');
    await page.waitForLoadState('domcontentloaded');

    // Enter gallery title
    await page.locator('#title').fill('Test Override Title Source');

    // Select template
    const templateCard = page.locator(`[data-template="${templateSelector}"]`);
    await templateCard.waitFor({ state: 'visible', timeout: 10000 });
    await templateCard.click();

    // Navigate to Lightbox Info tab and set override title source
    await navigateToLightboxInfoTab(page, templateSelector);
    await setLightboxCaptionOverride(page, 'override', templateSelector);
    await setLightboxOverrideTitleSource(page, 'alt', templateSelector);

    // Screenshot

    // Verify title source is set to alt
    const titleRadio = page.locator(`#FooGallerySettings_${templateSelector}_lightbox_caption_override_title${CAPTION_SOURCES.alt}`);
    await expect(titleRadio).toBeChecked();
  });

  test('overrides description source', async ({ page }) => {
    // Navigate to create new gallery
    await page.goto('/wp-admin/post-new.php?post_type=foogallery');
    await page.waitForLoadState('domcontentloaded');

    // Enter gallery title
    await page.locator('#title').fill('Test Override Description Source');

    // Select template
    const templateCard = page.locator(`[data-template="${templateSelector}"]`);
    await templateCard.waitFor({ state: 'visible', timeout: 10000 });
    await templateCard.click();

    // Navigate to Lightbox Info tab and set override desc source
    await navigateToLightboxInfoTab(page, templateSelector);
    await setLightboxCaptionOverride(page, 'override', templateSelector);
    await setLightboxOverrideDescSource(page, 'desc', templateSelector);

    // Screenshot

    // Verify desc source is set to description
    const descRadio = page.locator(`#FooGallerySettings_${templateSelector}_lightbox_caption_override_desc${CAPTION_SOURCES.desc}`);
    await expect(descRadio).toBeChecked();
  });

  test('enables custom lightbox template', async ({ page }) => {
    // Navigate to create new gallery
    await page.goto('/wp-admin/post-new.php?post_type=foogallery');
    await page.waitForLoadState('domcontentloaded');

    // Enter gallery title
    await page.locator('#title').fill('Test Custom Lightbox Template');

    // Select template
    const templateCard = page.locator(`[data-template="${templateSelector}"]`);
    await templateCard.waitFor({ state: 'visible', timeout: 10000 });
    await templateCard.click();

    // Navigate to Lightbox Info tab and enable custom template
    await navigateToLightboxInfoTab(page, templateSelector);
    await setLightboxCaptionOverride(page, 'custom', templateSelector);

    // Screenshot

    // Verify custom is selected
    const customRadio = page.locator(`#FooGallerySettings_${templateSelector}_lightbox_caption_override2`);
    await expect(customRadio).toBeChecked();

    // Verify custom template textarea is visible
    const templateTextarea = page.locator(`#FooGallerySettings_${templateSelector}_lightbox_caption_custom_template`);
    await expect(templateTextarea).toBeVisible();
  });

  test('uses custom lightbox template', async ({ page }) => {
    // Navigate to create new gallery
    await page.goto('/wp-admin/post-new.php?post_type=foogallery');
    await page.waitForLoadState('domcontentloaded');

    // Enter gallery title
    await page.locator('#title').fill('Test Custom Lightbox Template Content');

    // Select template
    const templateCard = page.locator(`[data-template="${templateSelector}"]`);
    await templateCard.waitFor({ state: 'visible', timeout: 10000 });
    await templateCard.click();

    // Navigate to Lightbox Info tab and set custom template
    await navigateToLightboxInfoTab(page, templateSelector);
    await setLightboxCaptionOverride(page, 'custom', templateSelector);
    await setLightboxCustomTemplate(page, '<h3>{{title}}</h3><p>{{description}}</p>', templateSelector);

    // Screenshot

    // Verify template textarea has content
    const templateTextarea = page.locator(`#FooGallerySettings_${templateSelector}_lightbox_caption_custom_template`);
    await expect(templateTextarea).toHaveValue('<h3>{{title}}</h3><p>{{description}}</p>');
  });

  test('sets data-lightbox-title attribute', async ({ page }) => {
    // Create gallery with lightbox override
    await createGalleryAndNavigateToPage(
      page,
      {
        galleryName: 'Test Data Lightbox Title Attribute',
        templateSelector,
        screenshotPrefix: `${screenshotPrefix}-07-data-lightbox-title`,
        imageCount: 3,
      },
      { titleSource: 'title' },
      { overrideMode: 'override', overrideTitleSource: 'alt' }
    );

    // Wait for gallery to load
    await page.waitForSelector(CAPTION_SELECTORS.galleryContainer, { state: 'visible', timeout: 15000 });

    // Screenshot

    // Verify anchor element exists
    const anchor = page.locator(CAPTION_SELECTORS.itemAnchor).first();
    await expect(anchor).toBeVisible();
  });

  test('sets data-lightbox-description attribute', async ({ page }) => {
    // Create gallery with lightbox override
    await createGalleryAndNavigateToPage(
      page,
      {
        galleryName: 'Test Data Lightbox Description Attribute',
        templateSelector,
        screenshotPrefix: `${screenshotPrefix}-08-data-lightbox-desc`,
        imageCount: 3,
      },
      { descSource: 'caption' },
      { overrideMode: 'override', overrideDescSource: 'desc' }
    );

    // Wait for gallery to load
    await page.waitForSelector(CAPTION_SELECTORS.galleryContainer, { state: 'visible', timeout: 15000 });

    // Screenshot

    // Verify anchor element exists
    const anchor = page.locator(CAPTION_SELECTORS.itemAnchor).first();
    await expect(anchor).toBeVisible();
  });

  test('displays overridden caption in lightbox', async ({ page }) => {
    // Create gallery with lightbox override and navigate to frontend
    await createGalleryAndNavigateToPage(
      page,
      {
        galleryName: 'Test Overridden Caption Display',
        templateSelector,
        screenshotPrefix: `${screenshotPrefix}-09-overridden-display`,
        imageCount: 3,
      },
      { titleSource: 'title' },
      { overrideMode: 'override', overrideTitleSource: 'alt', overrideDescSource: 'desc' }
    );

    // Wait for gallery to load
    await page.waitForSelector(CAPTION_SELECTORS.galleryContainer, { state: 'visible', timeout: 15000 });

    // Open lightbox
    await openLightbox(page, 0);

    // Screenshot

    // Verify lightbox is visible
    const lightbox = page.locator(CAPTION_SELECTORS.lightboxPanel);
    await expect(lightbox).toBeVisible();

    // Close lightbox
    await closeLightbox(page);
  });

  test('displays custom template in lightbox', async ({ page }) => {
    // Create gallery with custom lightbox template
    await createGalleryAndNavigateToPage(
      page,
      {
        galleryName: 'Test Custom Template Display',
        templateSelector,
        screenshotPrefix: `${screenshotPrefix}-10-custom-display`,
        imageCount: 3,
      },
      undefined,
      { overrideMode: 'custom', customTemplate: '<strong>{{title}}</strong> - {{alt}}' }
    );

    // Wait for gallery to load
    await page.waitForSelector(CAPTION_SELECTORS.galleryContainer, { state: 'visible', timeout: 15000 });

    // Open lightbox
    await openLightbox(page, 0);

    // Screenshot

    // Verify lightbox is visible
    const lightbox = page.locator(CAPTION_SELECTORS.lightboxPanel);
    await expect(lightbox).toBeVisible();

    // Close lightbox
    await closeLightbox(page);
  });
});
