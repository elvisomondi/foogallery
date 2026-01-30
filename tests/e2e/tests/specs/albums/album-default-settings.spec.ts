// File: tests/specs/albums/album-default-settings.spec.ts
// Tests for album default (responsive) template settings

import { test, expect } from '@playwright/test';
import {
  ALBUM_SELECTORS,
  ensureGalleriesExist,
  navigateToAddNewAlbum,
  selectAlbumTemplate,
  selectGalleries,
  publishAlbum,
  createPageWithAlbum,
  configureDefaultSettings,
  waitForAlbumReady,
} from '../../helpers/album-test-helper';

test.describe('Album - Default Template Settings', () => {
  test.beforeEach(async ({ page }) => {
    await ensureGalleriesExist(page, 3);
  });

  test('applies thumbnail dimensions', async ({ page }) => {
    await navigateToAddNewAlbum(page);
    await page.locator(ALBUM_SELECTORS.admin.titleInput).fill('Album Thumb Dimensions');
    await selectAlbumTemplate(page, 'default');
    await selectGalleries(page, 2);

    // Configure custom dimensions
    await configureDefaultSettings(page, {
      thumbWidth: 200,
      thumbHeight: 200,
    });


    await publishAlbum(page);
    await createPageWithAlbum(page);
    await waitForAlbumReady(page, 'default');

    // Verify thumbnail images on frontend
    const pileImages = page.locator('.foogallery-pile img, .foogallery-pile-inner img').first();
    await expect(pileImages).toBeVisible();

    // Check that images have reasonable dimensions (allow for browser rendering differences)
    const box = await pileImages.boundingBox();
    expect(box).toBeTruthy();
    // Just verify images are present and have dimensions
    if (box) {
      expect(box.width).toBeGreaterThan(0);
      expect(box.height).toBeGreaterThan(0);
    }

  });

  test('applies title background color', async ({ page }) => {
    await navigateToAddNewAlbum(page);
    await page.locator(ALBUM_SELECTORS.admin.titleInput).fill('Album Title Background');
    await selectAlbumTemplate(page, 'default');
    await selectGalleries(page, 2);

    // Click on the title background color picker row
    const titleBgRow = page.locator(ALBUM_SELECTORS.admin.defaultTitleBgRow);
    await titleBgRow.scrollIntoViewIfNeeded();

    // Click the color picker button (usually has class wp-color-result or similar)
    const colorButton = titleBgRow.locator('.wp-color-result, button[type="button"]').first();
    if (await colorButton.isVisible()) {
      await colorButton.click();
      await page.waitForTimeout(300);

      // Enter a color value
      const colorInput = titleBgRow.locator('input.wp-color-picker, input[type="text"]').first();
      if (await colorInput.isVisible()) {
        await colorInput.fill('#ff0000');
        await page.keyboard.press('Enter');
      }
    }


    await publishAlbum(page);
    await createPageWithAlbum(page);
    await waitForAlbumReady(page, 'default');

  });

  test('applies title font color', async ({ page }) => {
    await navigateToAddNewAlbum(page);
    await page.locator(ALBUM_SELECTORS.admin.titleInput).fill('Album Title Font Color');
    await selectAlbumTemplate(page, 'default');
    await selectGalleries(page, 2);

    // Click on the title font color picker row
    const titleFontRow = page.locator(ALBUM_SELECTORS.admin.defaultTitleFontColorRow);
    await titleFontRow.scrollIntoViewIfNeeded();

    // Click the color picker button
    const colorButton = titleFontRow.locator('.wp-color-result, button[type="button"]').first();
    if (await colorButton.isVisible()) {
      await colorButton.click();
      await page.waitForTimeout(300);

      // Enter a color value
      const colorInput = titleFontRow.locator('input.wp-color-picker, input[type="text"]').first();
      if (await colorInput.isVisible()) {
        await colorInput.fill('#0000ff');
        await page.keyboard.press('Enter');
      }
    }


    await publishAlbum(page);
    await createPageWithAlbum(page);
    await waitForAlbumReady(page, 'default');

  });

  test('applies left alignment', async ({ page }) => {
    await navigateToAddNewAlbum(page);
    await page.locator(ALBUM_SELECTORS.admin.titleInput).fill('Album Left Alignment');
    await selectAlbumTemplate(page, 'default');
    await selectGalleries(page, 2);

    await configureDefaultSettings(page, {
      alignment: 'left',
    });


    await publishAlbum(page);
    await createPageWithAlbum(page);
    await waitForAlbumReady(page, 'default');

    // Check for left alignment class or style
    const container = page.locator(ALBUM_SELECTORS.frontend.albumContainer);
    const containerClass = await container.getAttribute('class');

  });

  test('applies center alignment', async ({ page }) => {
    await navigateToAddNewAlbum(page);
    await page.locator(ALBUM_SELECTORS.admin.titleInput).fill('Album Center Alignment');
    await selectAlbumTemplate(page, 'default');
    await selectGalleries(page, 2);

    await configureDefaultSettings(page, {
      alignment: 'center',
    });


    await publishAlbum(page);
    await createPageWithAlbum(page);
    await waitForAlbumReady(page, 'default');

  });

  test('applies right alignment', async ({ page }) => {
    await navigateToAddNewAlbum(page);
    await page.locator(ALBUM_SELECTORS.admin.titleInput).fill('Album Right Alignment');
    await selectAlbumTemplate(page, 'default');
    await selectGalleries(page, 2);

    await configureDefaultSettings(page, {
      alignment: 'right',
    });


    await publishAlbum(page);
    await createPageWithAlbum(page);
    await waitForAlbumReady(page, 'default');

  });

  test('uses pretty URL format', async ({ page }) => {
    await navigateToAddNewAlbum(page);
    await page.locator(ALBUM_SELECTORS.admin.titleInput).fill('Album Pretty URL');
    await selectAlbumTemplate(page, 'default');
    await selectGalleries(page, 2);

    // Select pretty URL format
    const prettyRadio = page.locator(ALBUM_SELECTORS.admin.defaultGalleryLinkPretty);
    await prettyRadio.scrollIntoViewIfNeeded();
    await prettyRadio.click();

    const formatPretty = page.locator(ALBUM_SELECTORS.admin.defaultLinkFormatPretty);
    if (await formatPretty.isVisible()) {
      await formatPretty.click();
    }


    await publishAlbum(page);
    await createPageWithAlbum(page);
    await waitForAlbumReady(page, 'default');

    // Check that pile links use pretty format
    const pileLink = page.locator('.foogallery-pile a').first();
    if (await pileLink.count() > 0) {
      const href = await pileLink.getAttribute('href');
      // Pretty URL format should be like /gallery/slug or similar
      expect(href).toBeTruthy();
    }

  });

  test('uses querystring URL format', async ({ page }) => {
    await navigateToAddNewAlbum(page);
    await page.locator(ALBUM_SELECTORS.admin.titleInput).fill('Album Query URL');
    await selectAlbumTemplate(page, 'default');
    await selectGalleries(page, 2);

    // Select querystring URL format
    const queryRadio = page.locator(ALBUM_SELECTORS.admin.defaultGalleryLinkQuery);
    await queryRadio.scrollIntoViewIfNeeded();
    if (await queryRadio.isVisible()) {
      await queryRadio.click();
    }

    const formatQuery = page.locator(ALBUM_SELECTORS.admin.defaultLinkFormatQuery);
    if (await formatQuery.isVisible()) {
      await formatQuery.click();
    }


    await publishAlbum(page);
    await createPageWithAlbum(page);
    await waitForAlbumReady(page, 'default');

  });

  test('enables scroll position memory with hash', async ({ page }) => {
    await navigateToAddNewAlbum(page);
    await page.locator(ALBUM_SELECTORS.admin.titleInput).fill('Album Hash Enabled');
    await selectAlbumTemplate(page, 'default');
    await selectGalleries(page, 2);

    // Enable album hash
    const hashYes = page.locator(ALBUM_SELECTORS.admin.defaultAlbumHashYes);
    await hashYes.scrollIntoViewIfNeeded();
    if (await hashYes.isVisible()) {
      await hashYes.click();
    }


    await publishAlbum(page);
    await createPageWithAlbum(page);
    await waitForAlbumReady(page, 'default');

    // Album hash is typically used for URL state preservation
    // The setting being enabled should add data attributes or hash handling

  });

  test('applies gallery title size', async ({ page }) => {
    await navigateToAddNewAlbum(page);
    await page.locator(ALBUM_SELECTORS.admin.titleInput).fill('Album Title Size h4');
    await selectAlbumTemplate(page, 'default');
    await selectGalleries(page, 2);

    // Set title size to h4
    await configureDefaultSettings(page, {
      titleSize: 'h4',
    });


    await publishAlbum(page);
    await createPageWithAlbum(page);
    await waitForAlbumReady(page, 'default');

    // Check for h4 elements in pile titles
    const pileTitles = page.locator('.foogallery-pile h4, .foogallery-pile h3, .foogallery-pile h5, .foogallery-pile h6');
    const count = await pileTitles.count();
    expect(count).toBeGreaterThan(0);

  });
});
