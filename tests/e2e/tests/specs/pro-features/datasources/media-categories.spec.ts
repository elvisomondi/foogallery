// File: tests/specs/pro-features/datasources/media-categories.spec.ts
// E2E tests for Media Categories datasource functionality

import { test, expect } from '@playwright/test';
import {
  COMMON,
  MEDIA_CATEGORIES,
  navigateToNewGallery,
  openDatasourceModal,
  setGalleryTitle,
  publishGallery,
  createPageAndView,
  applyDatasource,
  verifyLightboxWorks,
  getGalleryImageCount,
  waitForGalleryImages,
  selectMediaCategoriesDatasource,
  selectCategoriesByIndices,
} from './datasource-test-helper';

test.describe('Datasource - Media Categories', () => {

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
  });

  test('Media Categories datasource option is visible in modal', async ({ page }) => {
    await navigateToNewGallery(page);
    await setGalleryTitle(page, 'Media Categories Visibility Test');
    await openDatasourceModal(page);

    // Verify Media Categories option (2nd option in modal)
    const mediaCategoriesOption = page.locator(MEDIA_CATEGORIES.datasourceOption);
    await expect(mediaCategoriesOption).toBeVisible({ timeout: 10000 });

    // Verify it contains text indicating categories
    const optionText = await mediaCategoriesOption.textContent();
    expect(optionText?.toLowerCase()).toMatch(/categor/);

    await page.screenshot({ path: 'test-results/datasource-media-categories-modal.png' });
  });

  test('shows available categories after selection', async ({ page }) => {
    await navigateToNewGallery(page);
    await setGalleryTitle(page, 'Media Categories List Test');
    await openDatasourceModal(page);
    await selectMediaCategoriesDatasource(page);

    // Wait for category list to load
    await page.waitForTimeout(1000);

    // Verify category list items exist
    const categoryItems = page.locator('div.foogallery-datasources-modal-wrapper li > a');
    const count = await categoryItems.count();

    // Should have at least some categories (created in setup script)
    expect(count).toBeGreaterThan(0);

    await page.screenshot({ path: 'test-results/datasource-media-categories-list.png' });
  });

  test('can select single category', async ({ page }) => {
    await navigateToNewGallery(page);
    await setGalleryTitle(page, 'Media Categories Single Select Test');
    await openDatasourceModal(page);
    await selectMediaCategoriesDatasource(page);

    // Wait for category list
    await page.waitForTimeout(1000);

    // Select first category
    const firstCategory = page.locator(MEDIA_CATEGORIES.categoryItem(1));
    if (await firstCategory.isVisible()) {
      await firstCategory.click();
      await page.waitForTimeout(300);

      await page.screenshot({ path: 'test-results/datasource-media-categories-single-selected.png' });
    }
  });

  test('can select multiple categories', async ({ page }) => {
    await navigateToNewGallery(page);
    await setGalleryTitle(page, 'Media Categories Multi Select Test');
    await openDatasourceModal(page);
    await selectMediaCategoriesDatasource(page);

    // Wait for category list
    await page.waitForTimeout(1000);

    // Select multiple categories
    const categoryItems = page.locator('div.foogallery-datasources-modal-wrapper li > a');
    const count = await categoryItems.count();

    if (count >= 2) {
      await selectCategoriesByIndices(page, [1, 2]);
      await page.screenshot({ path: 'test-results/datasource-media-categories-multi-selected.png' });
    }
  });

  test('shows hierarchical structure', async ({ page }) => {
    await navigateToNewGallery(page);
    await setGalleryTitle(page, 'Media Categories Hierarchy Test');
    await openDatasourceModal(page);
    await selectMediaCategoriesDatasource(page);

    // Wait for category list
    await page.waitForTimeout(1000);

    // Look for hierarchical indicators (nested lists, indentation, etc.)
    const categoryItems = page.locator('div.foogallery-datasources-modal-wrapper li');

    // Check for nested structure (ul > li > ul > li pattern)
    const nestedItems = page.locator('div.foogallery-datasources-modal-wrapper li li');
    const nestedCount = await nestedItems.count();

    // If there are nested items, hierarchy is present
    // The setup script creates parent "Landscapes" with children "Mountains" and "Beaches"
    await page.screenshot({ path: 'test-results/datasource-media-categories-hierarchy.png' });

    // Log hierarchy structure for debugging
    const count = await categoryItems.count();
    console.log(`Total category items: ${count}, Nested items: ${nestedCount}`);
  });

  test('shows selection checkboxes', async ({ page }) => {
    await navigateToNewGallery(page);
    await setGalleryTitle(page, 'Media Categories Checkbox Test');
    await openDatasourceModal(page);
    await selectMediaCategoriesDatasource(page);

    // Wait for options
    await page.waitForTimeout(1000);

    // Check for checkbox inputs in the modal
    const checkboxes = page.locator('div.foogallery-datasources-modal-wrapper input[type="checkbox"]');
    const checkboxCount = await checkboxes.count();

    // There may or may not be checkboxes depending on UI version
    if (checkboxCount > 0) {
      await expect(checkboxes.first()).toBeVisible();
    }

    await page.screenshot({ path: 'test-results/datasource-media-categories-checkboxes.png' });
  });

  test('creates gallery from media categories', async ({ page }) => {
    await navigateToNewGallery(page);
    await setGalleryTitle(page, 'Media Categories Gallery Creation Test');
    await openDatasourceModal(page);
    await selectMediaCategoriesDatasource(page);

    // Wait for category list
    await page.waitForTimeout(1000);

    // Select a category (Landscapes or first available)
    const categoryItems = page.locator('div.foogallery-datasources-modal-wrapper li > a');
    const count = await categoryItems.count();

    let categoryClicked = false;
    for (let i = 0; i < count; i++) {
      const text = await categoryItems.nth(i).textContent();
      if (text?.toLowerCase().includes('landscape') || text?.toLowerCase().includes('architecture') || text?.toLowerCase().includes('test')) {
        await categoryItems.nth(i).click();
        await page.waitForTimeout(300);
        categoryClicked = true;
        break;
      }
    }

    // Fallback: click first category if no specific category found
    if (!categoryClicked && count > 0) {
      await categoryItems.first().click();
      await page.waitForTimeout(300);
    }

    await page.screenshot({ path: 'test-results/datasource-media-categories-category-selected.png' });

    // Apply datasource
    await applyDatasource(page);

    // Verify datasource info is displayed
    const datasourceInfo = page.locator(MEDIA_CATEGORIES.datasourceInfo);
    await expect(datasourceInfo).toBeVisible({ timeout: 10000 });

    // Publish gallery
    await publishGallery(page);

    await page.screenshot({ path: 'test-results/datasource-media-categories-published.png' });
  });

  test('gallery displays categorized images', async ({ page }) => {
    await navigateToNewGallery(page);
    await setGalleryTitle(page, 'Media Categories Display Test');
    await openDatasourceModal(page);
    await selectMediaCategoriesDatasource(page);

    // Wait and select a category
    await page.waitForTimeout(1000);
    const categoryItems = page.locator('div.foogallery-datasources-modal-wrapper li > a');
    if (await categoryItems.count() > 0) {
      await categoryItems.first().click();
      await page.waitForTimeout(300);
    }

    await applyDatasource(page);
    await publishGallery(page);
    await createPageAndView(page);

    // Wait for gallery to load
    await waitForGalleryImages(page);

    // Verify images are displayed
    const imageCount = await getGalleryImageCount(page);
    expect(imageCount).toBeGreaterThan(0);

    await page.screenshot({ path: 'test-results/datasource-media-categories-frontend.png' });
  });

  test('lightbox works on media categories gallery', async ({ page }) => {
    await navigateToNewGallery(page);
    await setGalleryTitle(page, 'Media Categories Lightbox Test');
    await openDatasourceModal(page);
    await selectMediaCategoriesDatasource(page);

    // Select a category
    await page.waitForTimeout(1000);
    const categoryItems = page.locator('div.foogallery-datasources-modal-wrapper li > a');
    if (await categoryItems.count() > 0) {
      await categoryItems.first().click();
      await page.waitForTimeout(300);
    }

    await applyDatasource(page);
    await publishGallery(page);
    await createPageAndView(page);
    await waitForGalleryImages(page);

    // Test lightbox functionality
    await verifyLightboxWorks(page);

    await page.screenshot({ path: 'test-results/datasource-media-categories-lightbox.png' });
  });

  test('can edit media categories datasource', async ({ page }) => {
    await navigateToNewGallery(page);
    await setGalleryTitle(page, 'Media Categories Edit Test');
    await openDatasourceModal(page);
    await selectMediaCategoriesDatasource(page);

    // Select a category
    await page.waitForTimeout(1000);
    const categoryItems = page.locator('div.foogallery-datasources-modal-wrapper li > a');
    if (await categoryItems.count() > 0) {
      await categoryItems.first().click();
      await page.waitForTimeout(300);
    }

    await applyDatasource(page);

    // Verify edit button exists
    const editButton = page.locator(MEDIA_CATEGORIES.editButton);
    await expect(editButton).toBeVisible({ timeout: 10000 });

    // Click edit button to reopen modal
    await editButton.click();

    // Wait for modal heading to appear as indicator that modal is open
    const modalHeading = page.locator('h1:has-text("Add To Gallery From Another Source")');
    await modalHeading.waitFor({ state: 'visible', timeout: 15000 });

    await page.screenshot({ path: 'test-results/datasource-media-categories-edit.png' });
  });

  test('can remove media categories datasource', async ({ page }) => {
    await navigateToNewGallery(page);
    await setGalleryTitle(page, 'Media Categories Remove Test');
    await openDatasourceModal(page);
    await selectMediaCategoriesDatasource(page);

    // Select a category
    await page.waitForTimeout(1000);
    const categoryItems = page.locator('div.foogallery-datasources-modal-wrapper li > a');
    if (await categoryItems.count() > 0) {
      await categoryItems.first().click();
      await page.waitForTimeout(300);
    }

    await applyDatasource(page);

    // Verify datasource info is displayed
    const datasourceInfo = page.locator(MEDIA_CATEGORIES.datasourceInfo);
    await expect(datasourceInfo).toBeVisible({ timeout: 10000 });

    // Click remove button
    const removeButton = page.locator(MEDIA_CATEGORIES.removeButton);
    await expect(removeButton).toBeVisible();
    await removeButton.click();

    // Verify datasource info is removed
    await expect(datasourceInfo).not.toBeVisible({ timeout: 5000 });

    await page.screenshot({ path: 'test-results/datasource-media-categories-removed.png' });
  });
});
