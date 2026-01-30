// File: tests/helpers/gallery-factory.ts
// Shared gallery creation factory for all test helpers
// This consolidates duplicated gallery creation logic into a single reusable module

import { Page, expect } from '@playwright/test';

export interface GalleryFactoryOptions {
  galleryName: string;
  templateSelector: string;
  imageCount?: number;
  configureSettings?: (page: Page) => Promise<void>;
  navigateToFrontend?: boolean;
  selectImages?: (page: Page, modal: any, count: number) => Promise<void>;
  searchForImages?: string[];
}

export interface GalleryFactoryResult {
  galleryId: string;
  frontendUrl?: string;
}

/**
 * Creates a gallery with the specified options.
 * This is the core factory function used by all feature-specific helpers.
 *
 * @param page - Playwright page object
 * @param options - Gallery creation options
 * @returns Gallery ID and optional frontend URL
 */
export async function createGallery(
  page: Page,
  options: GalleryFactoryOptions
): Promise<GalleryFactoryResult> {
  const {
    galleryName,
    templateSelector,
    imageCount = 5,
    configureSettings,
    navigateToFrontend = false,
    selectImages,
    searchForImages,
  } = options;

  // Direct navigation (saves 2 page loads vs menu clicking)
  await page.goto('/wp-admin/post-new.php?post_type=foogallery');
  await page.waitForLoadState('domcontentloaded');

  // Title
  await page.locator('#title').fill(galleryName);

  // Template selection
  const templateCard = page.locator(`[data-template="${templateSelector}"]`);
  await templateCard.waitFor({ state: 'visible', timeout: 10000 });
  await templateCard.click();
  await expect(templateCard).toHaveClass(/selected/);

  // Add images
  await page.locator('text=Add From Media Library').click();
  await page.waitForLoadState('domcontentloaded');

  const modal = page.locator('.media-modal:visible');
  await modal.waitFor({ state: 'visible', timeout: 10000 });

  // Click Media Library tab
  const mediaLibraryTab = modal.locator('.media-menu-item').filter({ hasText: 'Media Library' });
  await mediaLibraryTab.click();

  // Handle image selection
  if (selectImages) {
    // Custom image selection logic
    await selectImages(page, modal, imageCount);
  } else if (searchForImages && searchForImages.length > 0) {
    // Search for specific images by name
    for (const imageName of searchForImages) {
      const searchInput = modal.locator('#media-search-input');
      await searchInput.fill(imageName);
      await page.waitForTimeout(500); // Wait for search results

      const attachment = modal.locator('.attachment').first();
      if (await attachment.count() > 0) {
        await attachment.click();
      }

      // Clear search for next image
      await searchInput.clear();
    }
  } else {
    // Default: select first N images
    const attachments = modal.locator('.attachment');
    await attachments.first().waitFor({ state: 'visible', timeout: 10000 });

    const availableCount = await attachments.count();
    const imagesToSelect = Math.min(imageCount, availableCount);

    for (let i = 0; i < imagesToSelect; i++) {
      await attachments.nth(i).click();
    }
  }

  // Add to gallery
  const addButton = modal.locator('button.media-button-select, button:has-text("Add to Gallery")').first();
  await addButton.click();
  await modal.waitFor({ state: 'hidden', timeout: 10000 });

  // Feature-specific configuration
  if (configureSettings) {
    await configureSettings(page);
  }

  // Publish
  await page.locator('#publish').click();
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(/post\.php\?post=\d+&action=edit/);

  // Extract gallery ID
  const galleryId = page.url().match(/post=(\d+)/)?.[1] || '';
  const result: GalleryFactoryResult = { galleryId };

  // Frontend navigation
  if (navigateToFrontend) {
    await page.locator('#foogallery_create_page').click();
    await page.waitForLoadState('networkidle');

    const viewLink = page.getByRole('link', { name: 'View', exact: true }).first();
    await viewLink.waitFor({ state: 'visible', timeout: 30000 });
    const viewUrl = await viewLink.getAttribute('href');

    if (viewUrl) {
      await page.goto(viewUrl);
      await page.waitForLoadState('load');
      result.frontendUrl = viewUrl;
    }
  }

  return result;
}

/**
 * Navigates to an existing gallery's edit page
 */
export async function navigateToGalleryEdit(page: Page, galleryId: string): Promise<void> {
  await page.goto(`/wp-admin/post.php?post=${galleryId}&action=edit`);
  await page.waitForLoadState('domcontentloaded');
}

/**
 * Publishes/updates an existing gallery
 */
export async function publishGallery(page: Page): Promise<string> {
  await page.locator('#publish').click();
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(/post\.php\?post=\d+&action=edit/);

  return page.url().match(/post=(\d+)/)?.[1] || '';
}

/**
 * Creates a page for a gallery and navigates to it
 */
export async function createGalleryPageAndNavigate(page: Page): Promise<string> {
  await page.locator('#foogallery_create_page').click();
  await page.waitForLoadState('networkidle');

  const viewLink = page.getByRole('link', { name: 'View', exact: true }).first();
  await viewLink.waitFor({ state: 'visible', timeout: 30000 });
  const viewUrl = await viewLink.getAttribute('href') || '';

  if (viewUrl) {
    await page.goto(viewUrl);
    await page.waitForLoadState('load');
  }

  return viewUrl;
}

/**
 * Waits for gallery to be visible on frontend
 */
export async function waitForGalleryOnFrontend(page: Page): Promise<void> {
  await page.waitForSelector('.foogallery', { state: 'visible', timeout: 15000 });
}

/**
 * Scrolls to gallery settings section
 */
export async function scrollToGallerySettings(page: Page): Promise<void> {
  const settingsSection = page.locator('#foogallery_settings');
  await settingsSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
}

/**
 * Clicks a tab in the gallery settings for a specific template
 */
export async function clickSettingsTab(
  page: Page,
  templateSelector: string,
  tabName: string
): Promise<void> {
  await scrollToGallerySettings(page);

  const templateContainer = page.locator(`.foogallery-settings-container-${templateSelector}`);
  const tab = templateContainer.getByText(tabName, { exact: true }).first();
  await tab.scrollIntoViewIfNeeded();
  await tab.click({ force: true });
  await page.waitForTimeout(300);
}
