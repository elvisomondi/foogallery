// File: tests/specs/gallery-slider-pro.spec.ts
// Test for creating a Slider PRO gallery layout with unique panel and thumbnail navigation

import { test, expect } from '@playwright/test';
import { createGalleryAndNavigateToPage } from '../../helpers/gallery-test-helper';

test.describe('Gallery - Slider PRO Layout', () => {
  test('create gallery, add images, publish, and test slider navigation', async ({ page }) => {
    // Create gallery and navigate to page
    await createGalleryAndNavigateToPage(page, {
      layoutName: 'Slider PRO',
      templateSelector: 'slider',
      screenshotPrefix: 'slider-pro',
      imageCount: 4,
    });

    // Slider PRO opens directly in panel view
    // Wait for the panel content to be visible
    const panelContent = page.locator('div.fg-panel-content');
    await panelContent.waitFor({ state: 'visible', timeout: 15000 });

    // Click on the main image in the panel
    const panelImage = page.locator('div.fg-panel-content img').first();
    await panelImage.waitFor({ state: 'visible', timeout: 10000 });
    await panelImage.click();


    // Navigate using next/prev buttons
    await page.locator('button.fg-panel-button-next').click();
    await page.locator('button.fg-panel-button-next').click();
    await page.locator('button.fg-panel-button-next').click();
    await page.locator('button.fg-panel-button-next').click();


    // Navigate back
    await page.locator('button.fg-panel-button-prev > svg').click();
    await page.locator('button.fg-panel-button-prev > svg').click();
    await page.locator('button.fg-panel-button-prev > svg').click();
    await page.locator('button.fg-panel-button-prev > svg').click();


    // Test thumbnail navigation (unique to Slider PRO)
    // Click on thumbnail figures directly (overlays only visible on hover)
    const thumbs = page.locator('.fg-panel-thumbs figure.fg-panel-thumb');
    await thumbs.first().waitFor({ state: 'visible', timeout: 10000 });

    // Click 3rd thumbnail
    await thumbs.nth(2).click({ force: true });


    // Click 2nd thumbnail
    await thumbs.nth(1).click({ force: true });


    // Click 1st thumbnail
    await thumbs.nth(0).click({ force: true });


    // Click maximize button (unique to Slider PRO)
    await page.locator('button.fg-panel-button-maximize > svg').click();


    // Navigate in maximized view
    await page.locator('button.fg-panel-button-next').click();
    await page.locator('button.fg-panel-button-next').click();
    await page.locator('button.fg-panel-button-next').click();

    // Navigate back
    await page.locator('button.fg-panel-button-prev').click();
    await page.locator('button.fg-panel-button-prev').click();
    await page.locator('button.fg-panel-button-prev').click();


    // Click maximize again to restore
    await page.locator('button.fg-panel-button-maximize > svg').click();

  });
});
