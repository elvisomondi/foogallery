// File: tests/specs/pro-features/datasources/post-query.spec.ts
// E2E tests for Post Query datasource functionality

import { test, expect } from '@playwright/test';
import {
  COMMON,
  POST_QUERY,
  navigateToNewGallery,
  openDatasourceModal,
  setGalleryTitle,
  publishGallery,
  createPageAndView,
  applyDatasource,
  verifyLightboxWorks,
  getGalleryImageCount,
  waitForGalleryImages,
  selectPostQueryDatasource,
  configurePostQuery,
} from './datasource-test-helper';

test.describe('Datasource - Post Query', () => {

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
  });

  test('Post Query datasource option is visible in modal', async ({ page }) => {
    await navigateToNewGallery(page);
    await setGalleryTitle(page, 'Post Query Visibility Test');
    await openDatasourceModal(page);

    // Verify Post Query option (4th option in modal)
    const postQueryOption = page.locator(POST_QUERY.datasourceOption);
    await expect(postQueryOption).toBeVisible({ timeout: 10000 });

    // Verify it contains text indicating post query
    const optionText = await postQueryOption.textContent();
    expect(optionText?.toLowerCase()).toMatch(/post|query/);

    await page.screenshot({ path: 'test-results/datasource-post-query-modal.png' });
  });

  test('can select post type', async ({ page }) => {
    await navigateToNewGallery(page);
    await setGalleryTitle(page, 'Post Query Post Type Test');
    await openDatasourceModal(page);
    await selectPostQueryDatasource(page);

    // Wait for options to load
    await page.waitForTimeout(500);

    // Verify post type input is visible
    const postTypeInput = page.locator(POST_QUERY.postType);
    await expect(postTypeInput).toBeVisible({ timeout: 10000 });

    // Test entering post type
    await configurePostQuery(page, { postType: 'post' });
    await expect(postTypeInput).toHaveValue('post');

    // Test changing to page
    await configurePostQuery(page, { postType: 'page' });
    await expect(postTypeInput).toHaveValue('page');

    // Test attachment
    await configurePostQuery(page, { postType: 'attachment' });
    await expect(postTypeInput).toHaveValue('attachment');

    await page.screenshot({ path: 'test-results/datasource-post-query-post-type.png' });
  });

  test('can set number of posts', async ({ page }) => {
    await navigateToNewGallery(page);
    await setGalleryTitle(page, 'Post Query Number Test');
    await openDatasourceModal(page);
    await selectPostQueryDatasource(page);

    // Wait for options
    await page.waitForTimeout(500);

    // Verify number of posts input is visible
    const numberOfPostsInput = page.locator(POST_QUERY.numberOfPosts);
    await expect(numberOfPostsInput).toBeVisible({ timeout: 10000 });

    // Test setting number of posts
    await configurePostQuery(page, { numberOfPosts: '5' });
    await expect(numberOfPostsInput).toHaveValue('5');

    // Test different value
    await configurePostQuery(page, { numberOfPosts: '10' });
    await expect(numberOfPostsInput).toHaveValue('10');

    await page.screenshot({ path: 'test-results/datasource-post-query-number.png' });
  });

  test('can set exclude IDs', async ({ page }) => {
    await navigateToNewGallery(page);
    await setGalleryTitle(page, 'Post Query Exclude Test');
    await openDatasourceModal(page);
    await selectPostQueryDatasource(page);

    // Wait for options
    await page.waitForTimeout(500);

    // Verify exclude input is visible
    const excludeInput = page.locator(POST_QUERY.exclude);
    await expect(excludeInput).toBeVisible({ timeout: 10000 });

    // Test entering exclude IDs
    await configurePostQuery(page, { exclude: '1,2,3' });
    await expect(excludeInput).toHaveValue('1,2,3');

    await page.screenshot({ path: 'test-results/datasource-post-query-exclude.png' });
  });

  test('can set taxonomy filter', async ({ page }) => {
    await navigateToNewGallery(page);
    await setGalleryTitle(page, 'Post Query Taxonomy Test');
    await openDatasourceModal(page);
    await selectPostQueryDatasource(page);

    // Wait for options
    await page.waitForTimeout(500);

    // Verify taxonomy input is visible
    const taxonomyInput = page.locator(POST_QUERY.taxonomy);
    await expect(taxonomyInput).toBeVisible({ timeout: 10000 });

    // Test entering taxonomy term
    await configurePostQuery(page, { taxonomy: 'category:uncategorized' });
    await expect(taxonomyInput).toHaveValue('category:uncategorized');

    await page.screenshot({ path: 'test-results/datasource-post-query-taxonomy.png' });
  });

  test('shows override options', async ({ page }) => {
    await navigateToNewGallery(page);
    await setGalleryTitle(page, 'Post Query Override Test');
    await openDatasourceModal(page);
    await selectPostQueryDatasource(page);

    // Wait for options
    await page.waitForTimeout(500);

    // Check for override option inputs
    const overrideLinkInput = page.locator(POST_QUERY.overrideLink);
    const overrideDescInput = page.locator(POST_QUERY.overrideDesc);
    const overrideTitleInput = page.locator(POST_QUERY.overrideTitle);

    // At least some override options should be visible
    const linkVisible = await overrideLinkInput.isVisible();
    const descVisible = await overrideDescInput.isVisible();
    const titleVisible = await overrideTitleInput.isVisible();

    expect(linkVisible || descVisible || titleVisible).toBe(true);

    await page.screenshot({ path: 'test-results/datasource-post-query-overrides.png' });
  });

  test('creates gallery from posts', async ({ page }) => {
    await navigateToNewGallery(page);
    await setGalleryTitle(page, 'Post Query Gallery Creation Test');
    await openDatasourceModal(page);
    await selectPostQueryDatasource(page);

    // Wait for options
    await page.waitForTimeout(500);

    // Configure query to get test posts with featured images
    await configurePostQuery(page, {
      postType: 'post',
      numberOfPosts: '5',
    });

    await page.screenshot({ path: 'test-results/datasource-post-query-configured.png' });

    // Apply datasource
    await applyDatasource(page);

    // Verify datasource info is displayed
    const datasourceInfo = page.locator(POST_QUERY.datasourceInfo);
    await expect(datasourceInfo).toBeVisible({ timeout: 10000 });

    // Publish gallery
    await publishGallery(page);

    await page.screenshot({ path: 'test-results/datasource-post-query-published.png' });
  });

  test('gallery displays post images', async ({ page }) => {
    await navigateToNewGallery(page);
    await setGalleryTitle(page, 'Post Query Display Test');
    await openDatasourceModal(page);
    await selectPostQueryDatasource(page);

    // Configure query
    await page.waitForTimeout(500);
    await configurePostQuery(page, {
      postType: 'post',
      numberOfPosts: '5',
    });

    await applyDatasource(page);
    await publishGallery(page);
    await createPageAndView(page);

    // Wait for gallery to load
    await waitForGalleryImages(page);

    // Verify images are displayed (posts with featured images)
    const imageCount = await getGalleryImageCount(page);
    expect(imageCount).toBeGreaterThan(0);

    await page.screenshot({ path: 'test-results/datasource-post-query-frontend.png' });
  });

  test('lightbox works on post query gallery', async ({ page }) => {
    await navigateToNewGallery(page);
    await setGalleryTitle(page, 'Post Query Lightbox Test');
    await openDatasourceModal(page);
    await selectPostQueryDatasource(page);

    // Configure query
    await page.waitForTimeout(500);
    await configurePostQuery(page, {
      postType: 'post',
      numberOfPosts: '5',
    });

    await applyDatasource(page);
    await publishGallery(page);
    await createPageAndView(page);
    await waitForGalleryImages(page);

    // Test lightbox functionality
    await verifyLightboxWorks(page);

    await page.screenshot({ path: 'test-results/datasource-post-query-lightbox.png' });
  });

  test('can edit post query datasource', async ({ page }) => {
    await navigateToNewGallery(page);
    await setGalleryTitle(page, 'Post Query Edit Test');
    await openDatasourceModal(page);
    await selectPostQueryDatasource(page);

    // Configure query
    await page.waitForTimeout(500);
    await configurePostQuery(page, {
      postType: 'post',
      numberOfPosts: '5',
    });

    await applyDatasource(page);

    // Verify edit button exists
    const editButton = page.locator(POST_QUERY.editButton);
    await expect(editButton).toBeVisible({ timeout: 10000 });

    // Click edit button to reopen modal
    await editButton.click();

    // Wait for modal heading to appear as indicator that modal is open
    const modalHeading = page.locator('h1:has-text("Add To Gallery From Another Source")');
    await modalHeading.waitFor({ state: 'visible', timeout: 15000 });

    // Verify existing values are preserved
    const postTypeInput = page.locator(POST_QUERY.postType);
    await expect(postTypeInput).toHaveValue('post');

    await page.screenshot({ path: 'test-results/datasource-post-query-edit.png' });
  });

  test('can remove post query datasource', async ({ page }) => {
    await navigateToNewGallery(page);
    await setGalleryTitle(page, 'Post Query Remove Test');
    await openDatasourceModal(page);
    await selectPostQueryDatasource(page);

    // Configure query
    await page.waitForTimeout(500);
    await configurePostQuery(page, {
      postType: 'post',
      numberOfPosts: '5',
    });

    await applyDatasource(page);

    // Verify datasource info is displayed
    const datasourceInfo = page.locator(POST_QUERY.datasourceInfo);
    await expect(datasourceInfo).toBeVisible({ timeout: 10000 });

    // Click remove button
    const removeButton = page.locator(POST_QUERY.removeButton);
    await expect(removeButton).toBeVisible();
    await removeButton.click();

    // Verify datasource info is removed
    await expect(datasourceInfo).not.toBeVisible({ timeout: 5000 });

    await page.screenshot({ path: 'test-results/datasource-post-query-removed.png' });
  });

  test('can query attachments directly', async ({ page }) => {
    await navigateToNewGallery(page);
    await setGalleryTitle(page, 'Post Query Attachments Test');
    await openDatasourceModal(page);
    await selectPostQueryDatasource(page);

    // Configure query for attachments
    await page.waitForTimeout(500);
    await configurePostQuery(page, {
      postType: 'attachment',
      numberOfPosts: '10',
    });

    await applyDatasource(page);
    await publishGallery(page);
    await createPageAndView(page);

    // Wait for gallery to load
    await waitForGalleryImages(page);

    // Verify images are displayed
    const imageCount = await getGalleryImageCount(page);
    expect(imageCount).toBeGreaterThan(0);

    await page.screenshot({ path: 'test-results/datasource-post-query-attachments.png' });
  });
});
