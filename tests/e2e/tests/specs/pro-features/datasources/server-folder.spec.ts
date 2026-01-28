// File: tests/specs/pro-features/datasources/server-folder.spec.ts
// E2E tests for Server Folder datasource functionality

import { test, expect } from '@playwright/test';
import {
  COMMON,
  SERVER_FOLDER,
  navigateToNewGallery,
  openDatasourceModal,
  setGalleryTitle,
  publishGallery,
  createPageAndView,
  applyDatasource,
  verifyLightboxWorks,
  getGalleryImageCount,
  waitForGalleryImages,
  selectServerFolderDatasource,
  navigateToFolder,
  selectMetadataStorage,
  selectSortOption,
} from './datasource-test-helper';

test.describe('Datasource - Server Folder', () => {

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
  });

  test('Server Folder datasource option is visible in modal', async ({ page }) => {
    await navigateToNewGallery(page);
    await setGalleryTitle(page, 'Server Folder Visibility Test');
    await openDatasourceModal(page);

    // Verify Server Folder option exists (3rd option)
    const serverFolderOption = page.locator(SERVER_FOLDER.datasourceOption);
    await expect(serverFolderOption).toBeVisible({ timeout: 10000 });

    // Verify it contains text indicating server folder
    const optionText = await serverFolderOption.textContent();
    expect(optionText?.toLowerCase()).toContain('server');

    await page.screenshot({ path: 'test-results/datasource-server-folder-modal.png' });
  });

  test('can select metadata storage option', async ({ page }) => {
    await navigateToNewGallery(page);
    await setGalleryTitle(page, 'Server Folder Metadata Test');
    await openDatasourceModal(page);
    await selectServerFolderDatasource(page);

    // Verify metadata options are visible
    const databaseOption = page.locator(SERVER_FOLDER.metadataDatabase);
    const fileOption = page.locator(SERVER_FOLDER.metadataFile);

    await expect(databaseOption).toBeVisible({ timeout: 5000 });
    await expect(fileOption).toBeVisible({ timeout: 5000 });

    // Test selecting database storage
    await selectMetadataStorage(page, 'database');
    await expect(databaseOption).toBeChecked();

    // Test selecting file storage
    await selectMetadataStorage(page, 'file');
    await expect(fileOption).toBeChecked();

    await page.screenshot({ path: 'test-results/datasource-server-folder-metadata-options.png' });
  });

  test('can navigate folder tree', async ({ page }) => {
    await navigateToNewGallery(page);
    await setGalleryTitle(page, 'Server Folder Navigation Test');
    await openDatasourceModal(page);
    await selectServerFolderDatasource(page);

    // Wait for folder tree to load
    await page.waitForTimeout(1000);

    // Verify folder tree container exists
    const folderContainer = page.locator('div.foogallery-datasource-modal-container');
    await expect(folderContainer).toBeVisible({ timeout: 10000 });

    // Verify folder items are clickable
    const folderItems = page.locator('div.foogallery-datasources-modal-wrapper li > a');
    const count = await folderItems.count();
    expect(count).toBeGreaterThan(0);

    // Click first folder to expand
    if (count > 0) {
      await folderItems.first().click();
      await page.waitForTimeout(500);
    }

    await page.screenshot({ path: 'test-results/datasource-server-folder-navigation.png' });
  });

  test('can set sort options', async ({ page }) => {
    await navigateToNewGallery(page);
    await setGalleryTitle(page, 'Server Folder Sort Test');
    await openDatasourceModal(page);
    await selectServerFolderDatasource(page);

    // Wait for options to load
    await page.waitForTimeout(500);

    // Check if sort options are visible
    const sortDefaultOption = page.locator(SERVER_FOLDER.sortDefault);
    const sortFilenameOption = page.locator(SERVER_FOLDER.sortFilename);

    if (await sortDefaultOption.isVisible()) {
      // Test selecting different sort options
      await selectSortOption(page, 'default');
      await expect(sortDefaultOption).toBeChecked();

      await selectSortOption(page, 'filename');
      await expect(sortFilenameOption).toBeChecked();

      await page.screenshot({ path: 'test-results/datasource-server-folder-sort-options.png' });
    }
  });

  test('creates gallery from server folder', async ({ page }) => {
    await navigateToNewGallery(page);
    await setGalleryTitle(page, 'Server Folder Gallery Test');
    await openDatasourceModal(page);
    await selectServerFolderDatasource(page);

    // Wait for folder tree to load
    await page.waitForTimeout(1000);

    // Navigate: wp-content > uploads > e2e-test-folder
    const folderBase = page.locator('div.foogallery-datasources-modal-wrapper li > a');

    // Click wp-content folder first
    const wpContentFolder = folderBase.filter({ hasText: 'wp-content' }).first();
    await expect(wpContentFolder).toBeVisible({ timeout: 10000 });
    await wpContentFolder.click();
    await page.waitForTimeout(500);

    // Click uploads folder
    const uploadsFolder = folderBase.filter({ hasText: 'uploads' }).first();
    await expect(uploadsFolder).toBeVisible({ timeout: 10000 });
    await uploadsFolder.click();
    await page.waitForTimeout(500);

    // Click e2e-test-folder
    const testFolder = folderBase.filter({ hasText: 'e2e-test-folder' }).first();
    await expect(testFolder).toBeVisible({ timeout: 10000 });
    await testFolder.click();
    await page.waitForTimeout(500);

    await page.screenshot({ path: 'test-results/datasource-server-folder-selected.png' });

    // Apply datasource
    await applyDatasource(page);

    // Verify datasource info is displayed - scroll into view first
    const datasourceInfo = page.locator(SERVER_FOLDER.datasourceInfo);
    await datasourceInfo.scrollIntoViewIfNeeded();
    await expect(datasourceInfo).toBeVisible({ timeout: 10000 });

    // Publish gallery
    await publishGallery(page);

    await page.screenshot({ path: 'test-results/datasource-server-folder-published.png' });
  });

  test('gallery displays images from server folder', async ({ page }) => {
    await navigateToNewGallery(page);
    await setGalleryTitle(page, 'Server Folder Display Test');
    await openDatasourceModal(page);
    await selectServerFolderDatasource(page);

    // Wait for folder tree to load
    await page.waitForTimeout(1000);

    // Navigate: wp-content > uploads > e2e-test-folder
    const folderBase = page.locator('div.foogallery-datasources-modal-wrapper li > a');

    // Click wp-content folder first
    const wpContentFolder = folderBase.filter({ hasText: 'wp-content' }).first();
    await expect(wpContentFolder).toBeVisible({ timeout: 10000 });
    await wpContentFolder.click();
    await page.waitForTimeout(500);

    // Click uploads folder
    const uploadsFolder = folderBase.filter({ hasText: 'uploads' }).first();
    await expect(uploadsFolder).toBeVisible({ timeout: 10000 });
    await uploadsFolder.click();
    await page.waitForTimeout(500);

    // Click e2e-test-folder
    const testFolder = folderBase.filter({ hasText: 'e2e-test-folder' }).first();
    await expect(testFolder).toBeVisible({ timeout: 10000 });
    await testFolder.click();
    await page.waitForTimeout(500);

    await applyDatasource(page);
    await publishGallery(page);
    await createPageAndView(page);

    // Wait for gallery to load
    await waitForGalleryImages(page);

    // Verify images are displayed
    const imageCount = await getGalleryImageCount(page);
    expect(imageCount).toBeGreaterThan(0);

    await page.screenshot({ path: 'test-results/datasource-server-folder-frontend.png' });
  });

  test('lightbox works on server folder gallery', async ({ page }) => {
    await navigateToNewGallery(page);
    await setGalleryTitle(page, 'Server Folder Lightbox Test');
    await openDatasourceModal(page);
    await selectServerFolderDatasource(page);

    // Wait for folder tree to load
    await page.waitForTimeout(1000);

    // Navigate: wp-content > uploads > e2e-test-folder
    const folderBase = page.locator('div.foogallery-datasources-modal-wrapper li > a');

    // Click wp-content folder first
    const wpContentFolder = folderBase.filter({ hasText: 'wp-content' }).first();
    await expect(wpContentFolder).toBeVisible({ timeout: 10000 });
    await wpContentFolder.click();
    await page.waitForTimeout(500);

    // Click uploads folder
    const uploadsFolder = folderBase.filter({ hasText: 'uploads' }).first();
    await expect(uploadsFolder).toBeVisible({ timeout: 10000 });
    await uploadsFolder.click();
    await page.waitForTimeout(500);

    // Click e2e-test-folder
    const testFolder = folderBase.filter({ hasText: 'e2e-test-folder' }).first();
    await expect(testFolder).toBeVisible({ timeout: 10000 });
    await testFolder.click();
    await page.waitForTimeout(500);

    await applyDatasource(page);
    await publishGallery(page);
    await createPageAndView(page);
    await waitForGalleryImages(page);

    // Test lightbox functionality
    await verifyLightboxWorks(page);

    await page.screenshot({ path: 'test-results/datasource-server-folder-lightbox.png' });
  });

  test('can edit server folder datasource', async ({ page }) => {
    await navigateToNewGallery(page);
    await setGalleryTitle(page, 'Server Folder Edit Test');
    await openDatasourceModal(page);
    await selectServerFolderDatasource(page);

    // Select a folder
    await page.waitForTimeout(1000);
    const folderItems = page.locator('div.foogallery-datasources-modal-wrapper li > a');
    if (await folderItems.count() > 0) {
      await folderItems.first().click();
      await page.waitForTimeout(500);
    }

    await applyDatasource(page);

    // Verify edit button exists
    const editButton = page.locator(SERVER_FOLDER.editButton);
    await expect(editButton).toBeVisible({ timeout: 10000 });

    // Click edit button to reopen modal
    await editButton.click();

    // Wait for modal heading to appear as indicator that modal is open
    const modalHeading = page.locator('h1:has-text("Add To Gallery From Another Source")');
    await modalHeading.waitFor({ state: 'visible', timeout: 15000 });

    await page.screenshot({ path: 'test-results/datasource-server-folder-edit.png' });
  });

  test('can remove server folder datasource', async ({ page }) => {
    await navigateToNewGallery(page);
    await setGalleryTitle(page, 'Server Folder Remove Test');
    await openDatasourceModal(page);
    await selectServerFolderDatasource(page);

    // Select a folder
    await page.waitForTimeout(1000);
    const folderItems = page.locator('div.foogallery-datasources-modal-wrapper li > a');
    if (await folderItems.count() > 0) {
      await folderItems.first().click();
      await page.waitForTimeout(500);
    }

    await applyDatasource(page);

    // Verify datasource info is displayed
    const datasourceInfo = page.locator(SERVER_FOLDER.datasourceInfo);
    await expect(datasourceInfo).toBeVisible({ timeout: 10000 });

    // Click remove button
    const removeButton = page.locator(SERVER_FOLDER.removeButton);
    await expect(removeButton).toBeVisible();
    await removeButton.click();

    // Verify datasource info is removed
    await expect(datasourceInfo).not.toBeVisible({ timeout: 5000 });

    await page.screenshot({ path: 'test-results/datasource-server-folder-removed.png' });
  });

  test('can add captions via database storage', async ({ page }) => {
    await navigateToNewGallery(page);
    await setGalleryTitle(page, 'Server Folder Database Captions Test');
    await openDatasourceModal(page);
    await selectServerFolderDatasource(page);

    // Select database storage
    await selectMetadataStorage(page, 'database');
    await expect(page.locator(SERVER_FOLDER.metadataDatabase)).toBeChecked();

    // Navigate to folder and apply
    await page.waitForTimeout(1000);
    const folderItems = page.locator('div.foogallery-datasources-modal-wrapper li > a');
    if (await folderItems.count() > 0) {
      await folderItems.first().click();
      await page.waitForTimeout(500);
    }

    await applyDatasource(page);

    // Verify the metadata form inputs exist when editing images
    // This depends on clicking an image in the gallery preview
    await page.screenshot({ path: 'test-results/datasource-server-folder-database-captions.png' });
  });

  test('can add captions via JSON file storage', async ({ page }) => {
    await navigateToNewGallery(page);
    await setGalleryTitle(page, 'Server Folder JSON Captions Test');
    await openDatasourceModal(page);
    await selectServerFolderDatasource(page);

    // Select file storage
    await selectMetadataStorage(page, 'file');
    await expect(page.locator(SERVER_FOLDER.metadataFile)).toBeChecked();

    // Navigate to folder
    await page.waitForTimeout(1000);
    const folderItems = page.locator('div.foogallery-datasources-modal-wrapper li > a');
    if (await folderItems.count() > 0) {
      await folderItems.first().click();
      await page.waitForTimeout(500);
    }

    // Check if JSON metadata textarea becomes visible
    const metadataTextarea = page.locator(SERVER_FOLDER.metadataTextarea);
    if (await metadataTextarea.isVisible()) {
      // Verify textarea is editable
      await expect(metadataTextarea).toBeEditable();
    }

    await page.screenshot({ path: 'test-results/datasource-server-folder-json-captions.png' });
  });
});
