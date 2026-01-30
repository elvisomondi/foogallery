// File: tests/specs/gallery-grid-pro.spec.ts
// Test for creating a Grid PRO gallery layout with unique maximize button

import { test, expect } from '@playwright/test';
import { createGalleryAndNavigateToPage } from '../../helpers/gallery-test-helper';

test.describe('Gallery - Grid PRO Layout', () => {
  test('create gallery, add images, publish, and test grid interaction', async ({ page }) => {
    // Create gallery and navigate to page
    await createGalleryAndNavigateToPage(page, {
      layoutName: 'Grid PRO',
      templateSelector: 'foogridpro',
      screenshotPrefix: 'grid-pro',
      imageCount: 4,
    });

    // Wait for gallery to be visible
    const galleryThumb = page.locator('.fg-item a.fg-thumb').first();
    await galleryThumb.waitFor({ state: 'visible', timeout: 15000 });

    // Click thumbnail to open lightbox
    await galleryThumb.click({ force: true });

    // Wait for lightbox/panel to open
    await page.waitForSelector('.fg-panel-content', { state: 'visible', timeout: 10000 });


    // Navigate in lightbox
    await page.locator('button.fg-panel-button-next').click();
    await page.locator('button.fg-panel-button-next').click();

    // Navigate back
    await page.locator('button.fg-panel-button-prev').click();
    await page.locator('button.fg-panel-button-prev').click();
    await page.locator('button.fg-panel-button-prev').click();


    // Click maximize button (unique to Grid PRO)
    await page.locator('button.fg-panel-button-maximize > svg').click();


    // Click maximize again to restore
    await page.locator('button.fg-panel-button-maximize path').click();


    // Close lightbox
    await page.locator('button.fg-panel-button-close > svg').click();

    // Wait for lightbox to close
    await page.waitForSelector('.fg-panel-content', { state: 'hidden', timeout: 10000 });


    // Click second image to verify multiple images work
    const secondImage = page.locator('.fg-item a.fg-thumb').nth(1);
    await secondImage.click({ force: true });

    // Wait for lightbox
    await page.waitForSelector('.fg-panel-content', { state: 'visible', timeout: 10000 });


    // Close lightbox
    await page.locator('button.fg-panel-button-close path').click();

    // Wait for lightbox to close
    await page.waitForSelector('.fg-panel-content', { state: 'hidden', timeout: 10000 });

  });
});
