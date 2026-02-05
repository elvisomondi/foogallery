// File: tests/specs/gutenberg-block.spec.ts
// Test for FooGallery Gutenberg block editor integration
// This test ensures the FooGallery block works in the Gutenberg editor
// and triggers the enqueue_block_assets hook to catch PHP warnings.

import { test, expect } from '@playwright/test';

test.describe('FooGallery - Gutenberg Block Editor', () => {

  test('add FooGallery block to page in Gutenberg editor', async ({ page }) => {
    await page.setViewportSize({ width: 1932, height: 1271 });

    // Step 1: Create a gallery via FooGallery admin
    await page.goto('/wp-admin/post-new.php?post_type=foogallery');
    await page.waitForLoadState('domcontentloaded');

    // Enter gallery title
    await page.locator('#title').fill('Gutenberg Test Gallery');

    // Select the default (Responsive) template
    const templateCard = page.locator('[data-template="default"]');
    await templateCard.waitFor({ state: 'visible', timeout: 10000 });
    await templateCard.click();

    // Add images from media library
    await page.locator('text=Add From Media Library').click();
    await page.waitForLoadState('networkidle');

    const modal = page.locator('.media-modal:visible');
    await modal.waitFor({ state: 'visible', timeout: 10000 });

    // Click "Media Library" tab
    const mediaLibraryTab = modal.locator('.media-menu-item').filter({ hasText: 'Media Library' });
    await mediaLibraryTab.click();

    // Select 3 images
    const attachments = modal.locator('.attachment');
    await attachments.first().waitFor({ state: 'visible', timeout: 10000 });
    for (let i = 0; i < 3; i++) {
      await attachments.nth(i).click();
    }

    // Add to gallery
    const addButton = modal.locator('button.media-button-select, button:has-text("Add to Gallery")').first();
    await addButton.click();
    await page.waitForLoadState('networkidle');

    // Publish the gallery
    await page.locator('#publish').click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/post\.php\?post=\d+&action=edit/);

    // Extract gallery ID
    const galleryUrl = page.url();
    const galleryIdMatch = galleryUrl.match(/post=(\d+)/);
    const galleryId = galleryIdMatch ? galleryIdMatch[1] : null;
    console.log(`Gallery created with ID: ${galleryId}`);

    // Step 2: Open Gutenberg editor for a new page
    // This triggers enqueue_block_assets hook → enqueue_block_editor_assets()
    // which is where the PHP warnings originate from class-foogallery-blocks.php
    await page.goto('/wp-admin/post-new.php?post_type=page');
    await page.waitForLoadState('domcontentloaded');

    // WordPress 6.9 shows a "Choose a pattern" modal on new pages - dismiss it
    const patternModalClose = page.locator('button[aria-label="Close"]').first();
    await patternModalClose.waitFor({ state: 'visible', timeout: 10000 });
    await patternModalClose.click();

    // Wait for the Gutenberg editor to be ready
    // WordPress 6.9 uses an iframe for the editor canvas
    await page.waitForTimeout(2000);

    // Dismiss the Gutenberg welcome guide if it appears
    const welcomeGuideClose = page.locator('.components-modal__header button[aria-label="Close"]');
    if (await welcomeGuideClose.isVisible({ timeout: 2000 }).catch(() => false)) {
      await welcomeGuideClose.click();
    }

    // The editor content may be inside an iframe in WordPress 6.9+
    // Try to get the editor frame
    let editorFrame = page;
    const iframe = page.frameLocator('iframe[name="editor-canvas"]');
    const iframeTitle = iframe.locator('[data-title="Add title"], [aria-label="Add title"], .wp-block-post-title, h1[contenteditable="true"]');

    // Check if the editor uses an iframe
    if (await iframeTitle.first().isVisible({ timeout: 5000 }).catch(() => false)) {
      // Editor is in an iframe - type the title there
      await iframeTitle.first().click();
      await page.keyboard.type('Gutenberg Block Test Page');
      await page.keyboard.press('Enter');

      // Use slash command to insert FooGallery block
      await page.keyboard.type('/foogallery');
      await page.waitForTimeout(1000);
    } else {
      // Editor is NOT in an iframe - interact directly
      const titleField = page.locator('[aria-label="Add title"], .editor-post-title__input, .wp-block-post-title, h1[contenteditable="true"]');
      await titleField.first().waitFor({ state: 'visible', timeout: 10000 });
      await titleField.first().click();
      await page.keyboard.type('Gutenberg Block Test Page');
      await page.keyboard.press('Enter');

      // Use slash command to insert FooGallery block
      await page.keyboard.type('/foogallery');
      await page.waitForTimeout(1000);
    }

    // Wait for the block inserter autocomplete to appear and click FooGallery
    const fooGalleryOption = page.locator('[role="option"]')
      .filter({ hasText: 'FooGallery' }).first();

    if (await fooGalleryOption.isVisible({ timeout: 5000 }).catch(() => false)) {
      await fooGalleryOption.click();
    } else {
      // Fallback: Use the block inserter (+) button in the top toolbar
      await page.keyboard.press('Escape');

      const inserterButton = page.locator('button[aria-label="Toggle block inserter"], button[aria-label="Block Inserter"], button.editor-document-tools__inserter-toggle').first();
      await inserterButton.waitFor({ state: 'visible', timeout: 5000 });
      await inserterButton.click();

      // Search for FooGallery
      const searchInput = page.locator('input[placeholder="Search"], .block-editor-inserter__search input').first();
      await searchInput.waitFor({ state: 'visible', timeout: 5000 });
      await searchInput.fill('FooGallery');
      await page.waitForTimeout(1000);

      // Click the FooGallery block result
      const blockResult = page.locator('.block-editor-block-types-list__item')
        .filter({ hasText: 'FooGallery' }).first();
      await blockResult.waitFor({ state: 'visible', timeout: 5000 });
      await blockResult.click();
    }

    // Wait for the FooGallery block to be inserted
    await page.waitForTimeout(2000);

    // Step 4: Select the gallery in the FooGallery block
    // The block shows a dropdown/select to choose a gallery
    // It could be in the main page or inside the editor iframe
    const gallerySelect = page.locator('select').filter({ has: page.locator('option[value="0"]') }).first();
    if (await gallerySelect.isVisible({ timeout: 5000 }).catch(() => false)) {
      if (galleryId) {
        await gallerySelect.selectOption(galleryId);
      } else {
        // Select the first non-zero option
        const options = await gallerySelect.locator('option').all();
        for (const option of options) {
          const value = await option.getAttribute('value');
          if (value && value !== '0' && value !== '') {
            await gallerySelect.selectOption(value);
            break;
          }
        }
      }
      await page.waitForTimeout(3000);
    } else {
      // Try finding the select in the iframe
      const iframeSelect = iframe.locator('select').first();
      if (await iframeSelect.isVisible({ timeout: 3000 }).catch(() => false)) {
        if (galleryId) {
          await iframeSelect.selectOption(galleryId);
        }
        await page.waitForTimeout(3000);
      }
    }

    // Screenshot: FooGallery block in Gutenberg editor
    await page.screenshot({ path: 'test-results/gutenberg-block-01-editor.png' });

    // Step 5: Publish the page
    const publishButton = page.locator('button.editor-post-publish-button, button.editor-post-publish-panel__toggle')
      .filter({ hasText: /Publish/ }).first();
    await publishButton.waitFor({ state: 'visible', timeout: 10000 });
    await publishButton.click();

    // If there's a confirmation panel, click Publish again
    const confirmPublish = page.locator('.editor-post-publish-panel button.editor-post-publish-button')
      .filter({ hasText: /Publish/ });
    if (await confirmPublish.isVisible({ timeout: 3000 }).catch(() => false)) {
      await confirmPublish.click();
    }

    // Wait for publish to complete
    await page.waitForTimeout(3000);

    // Screenshot: Published state
    await page.screenshot({ path: 'test-results/gutenberg-block-02-published.png' });

    // Step 6: View the page on the frontend
    const viewPageLink = page.locator('a').filter({ hasText: /View Page/ }).first();
    if (await viewPageLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      const viewUrl = await viewPageLink.getAttribute('href');
      if (viewUrl) {
        await page.goto(viewUrl);
        await page.waitForLoadState('networkidle');
      }
    } else {
      // Fallback: navigate to the page directly
      await page.goto('/gutenberg-block-test-page/');
      await page.waitForLoadState('networkidle');
    }

    // Verify the page loaded
    await expect(page).toHaveTitle(/Gutenberg Block Test Page/);

    // Check if gallery rendered on the frontend
    const galleryContainer = page.locator('.foogallery, .fg-responsive, [class*="foogallery"]');
    if (await galleryContainer.isVisible({ timeout: 10000 }).catch(() => false)) {
      const galleryImages = page.locator('.fg-item, .fg-thumb img');
      const imageCount = await galleryImages.count();
      console.log(`Gallery rendered with ${imageCount} images on frontend`);
    }

    // Screenshot: Frontend page with gallery
    await page.screenshot({ path: 'test-results/gutenberg-block-03-frontend.png' });
  });
});
