// File: tests/specs/gallery-carousel.spec.ts
// Test for creating a Carousel gallery layout with unique carousel navigation

import { test, expect } from '@playwright/test';
import { createGalleryAndNavigateToPage } from '../../helpers/gallery-test-helper';

test.describe('Gallery - Carousel Layout', () => {
  test('create gallery, add images, publish, and test carousel navigation', async ({ page }) => {
    // Create gallery and navigate to page
    await createGalleryAndNavigateToPage(page, {
      layoutName: 'Carousel',
      templateSelector: 'carousel',
      screenshotPrefix: 'carousel',
      imageCount: 5,
    });

    // Wait for carousel to be visible
    const carouselNext = page.locator('button.fg-carousel-next');
    await carouselNext.waitFor({ state: 'visible', timeout: 15000 });

    // Test carousel navigation - click next 5 times
    for (let i = 0; i < 5; i++) {
      await page.locator('button.fg-carousel-next path').click();
      await page.waitForTimeout(300); // Brief pause for animation
    }


    // Test carousel navigation - click prev 5 times
    for (let i = 0; i < 5; i++) {
      await page.locator('button.fg-carousel-prev path').click();
      await page.waitForTimeout(300);
    }


    // Click on the active item to open lightbox (use .fg-thumb which is the clickable anchor)
    const activeItem = page.locator('div.fg-item-active a.fg-thumb');
    await activeItem.waitFor({ state: 'visible', timeout: 10000 });
    await activeItem.click({ force: true });

    // Wait for lightbox to open
    await page.waitForSelector('.fg-panel-content', { state: 'visible', timeout: 10000 });


    // Navigate in lightbox
    await page.locator('button.fg-panel-button-next > svg').click();
    await page.locator('button.fg-panel-button-prev').click();
    await page.locator('button.fg-panel-button-prev path').click();


    // Expand fullscreen
    await page.locator('svg.fg-icon-expand').click();


    // Shrink back
    await page.locator('svg.fg-icon-shrink').click();

    // Close lightbox - click the button directly with force
    await page.locator('button.fg-panel-button-close').click({ force: true });

    // Wait for lightbox to close
    await page.waitForSelector('.fg-panel-content', { state: 'hidden', timeout: 20000 });

  });
});
