// File: tests/specs/gallery-image-viewer.spec.ts
// Test for creating an Image Viewer gallery layout with unique viewer navigation

import { test, expect } from '@playwright/test';
import { createGalleryAndNavigateToPage } from '../../helpers/gallery-test-helper';

test.describe('Gallery - Image Viewer Layout', () => {
  test('create gallery, add images, publish, and test viewer navigation', async ({ page }) => {
    // Create gallery and navigate to page
    await createGalleryAndNavigateToPage(page, {
      layoutName: 'Image Viewer',
      templateSelector: 'image-viewer',
      screenshotPrefix: 'image-viewer',
      imageCount: 4,
    });

    // Wait for gallery to be visible
    const galleryThumb = page.locator('.fg-item a.fg-thumb').first();
    await galleryThumb.waitFor({ state: 'visible', timeout: 15000 });

    // Click thumbnail to open lightbox
    await galleryThumb.click({ force: true });

    // Wait for lightbox to open
    await page.waitForSelector('.fg-panel-content', { state: 'visible', timeout: 10000 });


    // Navigate in lightbox
    await page.locator('button.fg-panel-button-next path').click();
    await page.locator('button.fg-panel-button-next > svg').click();
    await page.locator('button.fg-panel-button-next > svg').click();

    // Navigate back
    await page.locator('button.fg-panel-button-prev > svg').click();
    await page.locator('button.fg-panel-button-prev > svg').click();
    await page.locator('button.fg-panel-button-prev > svg').click();


    // Toggle fullscreen
    await page.locator('button.fg-panel-button-fullscreen').click();


    // Shrink back
    await page.locator('svg.fg-icon-shrink').click();

    // Close lightbox - use Escape key which is more reliable
    await page.keyboard.press('Escape');

    // Wait for lightbox to close with a shorter timeout
    await page.waitForSelector('.fg-panel-content', { state: 'hidden', timeout: 15000 });


    // Test the unique Image Viewer navigation (fiv-next/fiv-prev)
    const fivNext = page.locator('button.fiv-next > span');
    await fivNext.waitFor({ state: 'visible', timeout: 10000 });

    // Navigate using viewer controls
    await fivNext.click();
    await fivNext.click();
    await fivNext.click();
    await fivNext.click();


    // Navigate back using viewer controls
    await page.locator('button.fiv-prev > span').click();
    await page.locator('button.fiv-prev > span').click();
    await page.locator('button.fiv-prev > span').click();
    await page.locator('button.fiv-prev > span').click();

  });
});
