// File: tests/specs/pro-features/datasources/media-tags.spec.ts
// E2E tests for Media Tags datasource functionality

import { test, expect } from '@playwright/test';
import {
  COMMON,
  MEDIA_TAGS,
  navigateToNewGallery,
  openDatasourceModal,
  setGalleryTitle,
  publishGallery,
  createPageAndView,
  applyDatasource,
  verifyLightboxWorks,
  getGalleryImageCount,
  waitForGalleryImages,
  selectMediaTagsDatasource,
  selectTagsByIndices,
} from './datasource-test-helper';

test.describe('Datasource - Media Tags', () => {

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
  });

  test('Media Tags datasource option is visible in modal', async ({ page }) => {
    await navigateToNewGallery(page);
    await setGalleryTitle(page, 'Media Tags Visibility Test');
    await openDatasourceModal(page);

    // Verify Modal sidebar exists
    const modalSidebar = page.locator(COMMON.modalSidebar);
    await expect(modalSidebar).toBeVisible({ timeout: 10000 });

    // Verify Media Tags option in sidebar (1st option)
    const mediaTagsOption = page.locator(MEDIA_TAGS.sidebarLink);
    await expect(mediaTagsOption).toBeVisible({ timeout: 10000 });

    // Verify it contains text indicating media tags
    const optionText = await mediaTagsOption.textContent();
    expect(optionText?.toLowerCase()).toMatch(/tag/);

    await page.screenshot({ path: 'test-results/datasource-media-tags-modal.png' });
  });

  test('shows available tags after selection', async ({ page }) => {
    await navigateToNewGallery(page);
    await setGalleryTitle(page, 'Media Tags List Test');
    await openDatasourceModal(page);
    await selectMediaTagsDatasource(page);

    // Wait for tag list to load
    await page.waitForTimeout(1000);

    // Verify tag list items exist
    const tagItems = page.locator('div.foogallery-datasources-modal-wrapper li > a');
    const count = await tagItems.count();

    // Should have at least some tags (created in setup script)
    expect(count).toBeGreaterThan(0);

    await page.screenshot({ path: 'test-results/datasource-media-tags-list.png' });
  });

  test('can select single tag', async ({ page }) => {
    await navigateToNewGallery(page);
    await setGalleryTitle(page, 'Media Tags Single Select Test');
    await openDatasourceModal(page);
    await selectMediaTagsDatasource(page);

    // Wait for tag list
    await page.waitForTimeout(1000);

    // Select first tag
    const firstTag = page.locator(MEDIA_TAGS.tagItem(1));
    if (await firstTag.isVisible()) {
      await firstTag.click();
      await page.waitForTimeout(300);

      // Verify selection (could be highlighted or checked)
      await page.screenshot({ path: 'test-results/datasource-media-tags-single-selected.png' });
    }
  });

  test('can select multiple tags', async ({ page }) => {
    await navigateToNewGallery(page);
    await setGalleryTitle(page, 'Media Tags Multi Select Test');
    await openDatasourceModal(page);
    await selectMediaTagsDatasource(page);

    // Wait for tag list
    await page.waitForTimeout(1000);

    // Select multiple tags using indices
    const tagItems = page.locator('div.foogallery-datasources-modal-wrapper li > a');
    const count = await tagItems.count();

    if (count >= 2) {
      await selectTagsByIndices(page, [1, 2]);
      await page.screenshot({ path: 'test-results/datasource-media-tags-multi-selected.png' });
    }
  });

  test('shows selection checkboxes', async ({ page }) => {
    await navigateToNewGallery(page);
    await setGalleryTitle(page, 'Media Tags Checkbox Test');
    await openDatasourceModal(page);
    await selectMediaTagsDatasource(page);

    // Wait for options
    await page.waitForTimeout(1000);

    // Check for checkbox inputs in the modal
    const checkboxes = page.locator('div.foogallery-datasources-modal-wrapper input[type="checkbox"]');
    const checkboxCount = await checkboxes.count();

    // There may or may not be checkboxes depending on UI version
    if (checkboxCount > 0) {
      await expect(checkboxes.first()).toBeVisible();
    }

    await page.screenshot({ path: 'test-results/datasource-media-tags-checkboxes.png' });
  });

  test('creates gallery from media tags', async ({ page }) => {
    await navigateToNewGallery(page);
    await setGalleryTitle(page, 'Media Tags Gallery Creation Test');
    await openDatasourceModal(page);
    await selectMediaTagsDatasource(page);

    // Wait for tag list
    await page.waitForTimeout(1000);

    // Select a tag (Nature tag was created in setup)
    const tagItems = page.locator('div.foogallery-datasources-modal-wrapper li > a');
    const count = await tagItems.count();

    // Find and click a tag - prefer "Nature" or first available
    let tagClicked = false;
    for (let i = 0; i < count; i++) {
      const text = await tagItems.nth(i).textContent();
      if (text?.toLowerCase().includes('nature') || text?.toLowerCase().includes('animals') || text?.toLowerCase().includes('objects')) {
        await tagItems.nth(i).click();
        await page.waitForTimeout(300);
        tagClicked = true;
        break;
      }
    }

    // Fallback: click first tag if no specific tag found
    if (!tagClicked && count > 0) {
      await tagItems.first().click();
      await page.waitForTimeout(300);
    }

    await page.screenshot({ path: 'test-results/datasource-media-tags-tag-selected.png' });

    // Apply datasource
    await applyDatasource(page);

    // Verify datasource info is displayed
    const datasourceInfo = page.locator(MEDIA_TAGS.datasourceInfo);
    await expect(datasourceInfo).toBeVisible({ timeout: 10000 });

    // Publish gallery
    await publishGallery(page);

    await page.screenshot({ path: 'test-results/datasource-media-tags-published.png' });
  });

  test('gallery displays tagged images', async ({ page }) => {
    await navigateToNewGallery(page);
    await setGalleryTitle(page, 'Media Tags Display Test');
    await openDatasourceModal(page);
    await selectMediaTagsDatasource(page);

    // Wait and select a tag
    await page.waitForTimeout(1000);
    const tagItems = page.locator('div.foogallery-datasources-modal-wrapper li > a');
    if (await tagItems.count() > 0) {
      await tagItems.first().click();
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

    await page.screenshot({ path: 'test-results/datasource-media-tags-frontend.png' });
  });

  test('lightbox works on media tags gallery', async ({ page }) => {
    await navigateToNewGallery(page);
    await setGalleryTitle(page, 'Media Tags Lightbox Test');
    await openDatasourceModal(page);
    await selectMediaTagsDatasource(page);

    // Select a tag
    await page.waitForTimeout(1000);
    const tagItems = page.locator('div.foogallery-datasources-modal-wrapper li > a');
    if (await tagItems.count() > 0) {
      await tagItems.first().click();
      await page.waitForTimeout(300);
    }

    await applyDatasource(page);
    await publishGallery(page);
    await createPageAndView(page);
    await waitForGalleryImages(page);

    // Test lightbox functionality
    await verifyLightboxWorks(page);

    await page.screenshot({ path: 'test-results/datasource-media-tags-lightbox.png' });
  });

  test('can edit media tags datasource', async ({ page }) => {
    await navigateToNewGallery(page);
    await setGalleryTitle(page, 'Media Tags Edit Test');
    await openDatasourceModal(page);
    await selectMediaTagsDatasource(page);

    // Select a tag
    await page.waitForTimeout(1000);
    const tagItems = page.locator('div.foogallery-datasources-modal-wrapper li > a');
    if (await tagItems.count() > 0) {
      await tagItems.first().click();
      await page.waitForTimeout(300);
    }

    await applyDatasource(page);

    // Verify edit button exists
    const editButton = page.locator(MEDIA_TAGS.editButton);
    await expect(editButton).toBeVisible({ timeout: 10000 });

    // Click edit button to reopen modal
    await editButton.click();

    // Wait for modal heading to appear as indicator that modal is open
    const modalHeading = page.locator('h1:has-text("Add To Gallery From Another Source")');
    await modalHeading.waitFor({ state: 'visible', timeout: 15000 });

    await page.screenshot({ path: 'test-results/datasource-media-tags-edit.png' });
  });

  test('can remove media tags datasource', async ({ page }) => {
    await navigateToNewGallery(page);
    await setGalleryTitle(page, 'Media Tags Remove Test');
    await openDatasourceModal(page);
    await selectMediaTagsDatasource(page);

    // Select a tag
    await page.waitForTimeout(1000);
    const tagItems = page.locator('div.foogallery-datasources-modal-wrapper li > a');
    if (await tagItems.count() > 0) {
      await tagItems.first().click();
      await page.waitForTimeout(300);
    }

    await applyDatasource(page);

    // Verify datasource info is displayed
    const datasourceInfo = page.locator(MEDIA_TAGS.datasourceInfo);
    await expect(datasourceInfo).toBeVisible({ timeout: 10000 });

    // Click remove button
    const removeButton = page.locator(MEDIA_TAGS.removeButton);
    await expect(removeButton).toBeVisible();
    await removeButton.click();

    // Verify datasource info is removed
    await expect(datasourceInfo).not.toBeVisible({ timeout: 5000 });

    await page.screenshot({ path: 'test-results/datasource-media-tags-removed.png' });
  });
});
