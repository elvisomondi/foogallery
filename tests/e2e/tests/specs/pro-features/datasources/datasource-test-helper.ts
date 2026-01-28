// File: tests/specs/pro-features/datasources/datasource-test-helper.ts
// Shared selectors and helpers for datasource E2E tests

import { Page, expect } from '@playwright/test';

// ============================================================================
// COMMON SELECTORS
// ============================================================================
export const COMMON = {
  // Navigation
  foogalleryMenu: '#menu-posts-foogallery',
  addNewGallery: '#menu-posts-foogallery li:nth-of-type(3) > a',

  // Gallery Editor
  titleInput: '#title',
  publishButton: '#publish',
  updateButton: '#publish',
  createPageButton: '#foogallery_create_page',
  viewLink: 'span.view > a',

  // Datasource Modal
  datasourceButton: 'button:has-text("Add From Another Source")',
  modalWrapper: 'div.foogallery-datasources-modal-wrapper',
  modalSidebar: 'div.foogallery-datasource-modal-sidebar',
  applyButton: 'div.foogallery-datasources-modal-wrapper a:has-text("OK")',
  cancelButton: 'div.foogallery-datasources-modal-wrapper a:has-text("Cancel")',

  // Gallery Preview
  galleryContainer: (id: number) => `#foogallery-gallery-${id}`,
  galleryImage: (id: number, index: number) => `#foogallery-gallery-${id} > div:nth-of-type(${index}) img`,
  galleryFigure: '.foogallery figure',

  // Lightbox
  panelContent: 'div.fg-panel-content > div.fg-panel-area-inner',
  panelVisible: 'div.fg-panel-content',
  nextButton: 'button.fg-panel-button-next',
  prevButton: 'button.fg-panel-button-prev',
  closeButton: 'button.fg-panel-button-close',
} as const;

// ============================================================================
// SERVER FOLDER DATASOURCE SELECTORS
// ============================================================================
export const SERVER_FOLDER = {
  // Datasource selection - look for link containing "Server Folder" text
  datasourceOption: 'div.foogallery-datasources-modal-wrapper a:has-text("Server Folder")',

  // Metadata storage options
  metadataDatabase: '#foogallery-datasource-folder-metadata-database',
  metadataFile: '#foogallery-datasource-folder-metadata-file',

  // Folder navigation
  folderContainer: 'div.foogallery-datasource-modal-container a',
  folderTreeItem: (index: number) => `div.foogallery-datasources-modal-wrapper li:nth-of-type(${index}) > a`,

  // Sort options
  sortDefault: '#foogallery-datasource-folder-sort-default',
  sortFilename: '#foogallery-datasource-folder-sort-filename',
  sortFilenameDesc: '#foogallery-datasource-folder-sort-filename-desc',

  // Datasource info on editor - look for heading with datasource name
  datasourceInfo: 'h3:has-text("Datasource : Server Folder")',
  editButton: 'h3:has-text("Datasource : Server Folder") ~ button:has-text("Change")',
  removeButton: 'h3:has-text("Datasource : Server Folder") ~ button:has-text("Remove")',

  // Image metadata form (database storage)
  metadataForm: {
    caption: '#foogallery-server-image-metadata-form-caption',
    description: '#foogallery-server-image-metadata-form-description',
    alt: '#foogallery-server-image-metadata-form-alt',
    customUrl: '#foogallery-server-image-metadata-form-custom_url',
    customTarget: '#foogallery-server-image-metadata-form-custom_target',
    saveButton: 'a.foogallery-server-image-metadata-form-button-save',
  },

  // JSON metadata textarea (file storage)
  metadataTextarea: 'div.foogallery-datasources-modal-wrapper textarea',
  metadataCloseLink: 'div.foogallery-datasource-folder-metadata > a',
} as const;

// ============================================================================
// MEDIA TAGS DATASOURCE SELECTORS
// ============================================================================
export const MEDIA_TAGS = {
  // Datasource selection - look for link containing "Media Tags" text
  sidebarLink: 'div.foogallery-datasources-modal-wrapper a:has-text("Media Tags")',

  // Tag list items (dynamic based on tag count)
  tagItem: (index: number) => `div.foogallery-datasources-modal-wrapper li:nth-of-type(${index}) > a`,

  // Selection checkboxes
  checkbox1: 'div.foogallery-datasources-modal-wrapper label:nth-of-type(1) > input',
  checkbox2: 'div.foogallery-datasources-modal-wrapper label:nth-of-type(2) > input',

  // Additional options link
  optionsLink: 'div.foogallery-datasources-modal-wrapper p:nth-of-type(2) > a',

  // Datasource info on editor - look for heading with datasource name
  datasourceInfo: 'h3:has-text("Datasource : Media Tags")',
  editButton: 'h3:has-text("Datasource : Media Tags") ~ button:has-text("Change")',
  removeButton: 'h3:has-text("Datasource : Media Tags") ~ button:has-text("Remove")',
} as const;

// ============================================================================
// MEDIA CATEGORIES DATASOURCE SELECTORS
// ============================================================================
export const MEDIA_CATEGORIES = {
  // Datasource selection - look for link containing "Media Categories" text
  datasourceOption: 'div.foogallery-datasources-modal-wrapper a:has-text("Media Categories")',

  // Category list items
  categoryItem: (index: number) => `div.foogallery-datasources-modal-wrapper li:nth-of-type(${index}) > a`,

  // Selection checkboxes
  checkbox1: 'div.foogallery-datasources-modal-wrapper label:nth-of-type(1) > input',
  checkbox2: 'div.foogallery-datasources-modal-wrapper label:nth-of-type(2) > input',

  // Datasource info on editor - look for heading with datasource name
  datasourceInfo: 'h3:has-text("Datasource : Media Categories")',
  editButton: 'h3:has-text("Datasource : Media Categories") ~ button:has-text("Change")',
  removeButton: 'h3:has-text("Datasource : Media Categories") ~ button:has-text("Remove")',
} as const;

// ============================================================================
// POST QUERY DATASOURCE SELECTORS
// ============================================================================
export const POST_QUERY = {
  // Datasource selection - look for link containing "Post Query" text
  datasourceOption: 'div.foogallery-datasources-modal-wrapper a:has-text("Post Query")',

  // Query parameters
  postType: '#gallery_post_type',
  numberOfPosts: '#no_of_post',
  exclude: '#exclude',
  taxonomy: '#taxonomy',

  // Override properties
  customTarget: '#custom_target',
  overrideLink: '#override_link_property',
  overrideDesc: '#override_desc_property',
  overrideTitle: '#override_title_property',
  overrideClass: '#override_class_property',
  overrideSort: '#override_sort_property',

  // Checkboxes
  checkbox1: 'div.foogallery-datasources-modal-wrapper label:nth-of-type(1) > input',
  checkbox2: 'div.foogallery-datasources-modal-wrapper label:nth-of-type(2) > input',

  // Datasource info on editor - look for heading with datasource name
  datasourceInfo: 'h3:has-text("Datasource : Post Query")',
  editButton: 'h3:has-text("Datasource : Post Query") ~ button:has-text("Change")',
  removeButton: 'h3:has-text("Datasource : Post Query") ~ button:has-text("Remove")',
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Navigate to the Add New Gallery page
 */
export async function navigateToNewGallery(page: Page): Promise<void> {
  await page.goto('/wp-admin/post-new.php?post_type=foogallery');
  await page.waitForLoadState('domcontentloaded');
  await expect(page.locator(COMMON.titleInput)).toBeVisible({ timeout: 15000 });
}

/**
 * Open the datasource selection modal
 */
export async function openDatasourceModal(page: Page): Promise<void> {
  // Use first() to avoid strict mode violations if multiple buttons exist
  const datasourceButton = page.locator(COMMON.datasourceButton).first();
  await expect(datasourceButton).toBeVisible({ timeout: 10000 });

  // Click to open the modal
  await datasourceButton.click();

  // Wait for the modal heading to appear as indicator that modal is open
  const modalHeading = page.locator('h1:has-text("Add To Gallery From Another Source")');
  await modalHeading.waitFor({ state: 'visible', timeout: 15000 });

  // Also verify the sidebar links are visible
  const serverFolderLink = page.locator('a:has-text("Server Folder")');
  await serverFolderLink.waitFor({ state: 'visible', timeout: 5000 });
}

/**
 * Set the gallery title
 */
export async function setGalleryTitle(page: Page, title: string): Promise<void> {
  await page.locator(COMMON.titleInput).click();
  await page.locator(COMMON.titleInput).fill(title);
}

/**
 * Publish the gallery
 */
export async function publishGallery(page: Page): Promise<void> {
  await page.locator(COMMON.publishButton).click();
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(/post\.php\?post=\d+&action=edit/);
}

/**
 * Update an existing gallery
 */
export async function updateGallery(page: Page): Promise<void> {
  await page.locator(COMMON.updateButton).click();
  await page.waitForLoadState('networkidle');
}

/**
 * Create a page for the gallery and navigate to view it
 */
export async function createPageAndView(page: Page): Promise<void> {
  // Click create page button
  const createButton = page.locator(COMMON.createPageButton);
  await expect(createButton).toBeVisible({ timeout: 10000 });
  await createButton.click();
  await page.waitForLoadState('networkidle');

  // Wait for page to be created and view link to appear
  const viewLink = page.locator(COMMON.viewLink);
  await expect(viewLink).toBeVisible({ timeout: 15000 });

  // Get the href and navigate directly (more reliable than clicking)
  const href = await viewLink.getAttribute('href');
  if (href) {
    await page.goto(href);
  } else {
    await viewLink.click();
  }

  await page.waitForLoadState('domcontentloaded');

  // Verify we're on the frontend (URL should not contain wp-admin)
  const currentUrl = page.url();
  if (currentUrl.includes('wp-admin')) {
    throw new Error(`Failed to navigate to frontend. Current URL: ${currentUrl}`);
  }
}

/**
 * Apply the selected datasource
 */
export async function applyDatasource(page: Page): Promise<void> {
  await page.locator(COMMON.applyButton).click();
  await page.waitForLoadState('networkidle');
  // Wait for modal to close
  await expect(page.locator(COMMON.modalWrapper)).not.toBeVisible({ timeout: 10000 });
}

/**
 * Cancel datasource selection
 */
export async function cancelDatasource(page: Page): Promise<void> {
  await page.locator(COMMON.cancelButton).click();
  await expect(page.locator(COMMON.modalWrapper)).not.toBeVisible({ timeout: 10000 });
}

/**
 * Verify lightbox works on the gallery
 */
export async function verifyLightboxWorks(page: Page): Promise<void> {
  // Allow FooGallery JS to fully initialize
  await page.waitForTimeout(2000);

  // Wait for gallery images to be present - try multiple selectors
  const imageSelectors = [
    '.foogallery figure img',
    '.foogallery .fg-item img',
    '.foogallery .fg-thumb img',
    'div[id^="foogallery-gallery-"] figure img',
    'figure img'
  ];

  let imagesFound = false;
  for (const selector of imageSelectors) {
    try {
      await page.waitForSelector(selector, { state: 'visible', timeout: 5000 });
      imagesFound = true;
      break;
    } catch {
      continue;
    }
  }

  if (!imagesFound) {
    console.log('Warning: No gallery images found with standard selectors');
  }

  // Try clicking various gallery elements to open lightbox
  // FooGallery captions can intercept clicks, so we may need to use force
  const clickTargets = [
    'div[id^="foogallery-gallery-"] figure a',
    '.foogallery figure a',
    '.foogallery .fg-item a',
    '.fg-thumb',
    'figure a'
  ];

  let clicked = false;
  for (const selector of clickTargets) {
    try {
      const element = page.locator(selector).first();
      const count = await page.locator(selector).count();
      if (count > 0) {
        // Use force click to bypass caption overlay interception
        await element.click({ timeout: 5000, force: true });
        clicked = true;
        break;
      }
    } catch {
      continue;
    }
  }

  if (!clicked) {
    throw new Error('Could not find clickable gallery element for lightbox');
  }

  // Wait for lightbox to open
  await expect(page.locator(COMMON.panelVisible)).toBeVisible({ timeout: 10000 });

  // Navigate forward if possible
  const nextButton = page.locator(COMMON.nextButton);
  if (await nextButton.isVisible()) {
    await nextButton.click();
    await page.waitForTimeout(500);

    // Navigate back
    const prevButton = page.locator(COMMON.prevButton);
    if (await prevButton.isVisible()) {
      await prevButton.click();
      await page.waitForTimeout(500);
    }
  }

  // Close lightbox
  const closeButton = page.locator(COMMON.closeButton).first();
  await closeButton.click();
  await expect(page.locator(COMMON.panelVisible)).not.toBeVisible({ timeout: 5000 });
}

/**
 * Get the count of visible gallery images
 */
export async function getGalleryImageCount(page: Page): Promise<number> {
  const images = page.locator('.foogallery figure:not(.fg-hidden)');
  return await images.count();
}

/**
 * Extract gallery ID from the current URL
 */
export async function getGalleryIdFromUrl(page: Page): Promise<string> {
  const url = page.url();
  const postIdMatch = url.match(/post=(\d+)/);
  return postIdMatch ? postIdMatch[1] : '';
}

/**
 * Wait for gallery images to load on frontend
 */
export async function waitForGalleryImages(page: Page): Promise<void> {
  // Wait for page to be ready
  await page.waitForLoadState('domcontentloaded');

  // Try multiple selectors for gallery container
  const gallerySelectors = [
    '.foogallery[id^="foogallery-gallery-"]',
    '.foogallery',
    'div[class*="foogallery"]'
  ];

  let galleryFound = false;
  for (const selector of gallerySelectors) {
    try {
      await page.waitForSelector(selector, { state: 'visible', timeout: 15000 });
      galleryFound = true;
      break;
    } catch {
      continue;
    }
  }

  if (!galleryFound) {
    // Take a screenshot for debugging
    const pageTitle = await page.title();
    console.log(`Gallery not found. Page title: ${pageTitle}`);
    console.log(`Current URL: ${page.url()}`);
    throw new Error('Gallery container not found on page');
  }

  // Wait for loading state to complete (with try-catch)
  try {
    await page.waitForFunction(() => {
      const gallery = document.querySelector('.foogallery');
      return gallery && !gallery.classList.contains('fg-loading');
    }, { timeout: 15000 });
  } catch {
    // Gallery may not have loading class, continue anyway
    console.log('No fg-loading class found, continuing...');
  }

  // Ensure at least one image is visible
  try {
    await page.waitForSelector('.foogallery figure img, .foogallery .fg-thumb img, .foogallery .fg-item img', {
      state: 'visible',
      timeout: 10000
    });
  } catch {
    console.log('Warning: No images found in gallery');
  }

  await page.waitForTimeout(1000); // Allow lazy loading to complete
}

// ============================================================================
// SERVER FOLDER SPECIFIC FUNCTIONS
// ============================================================================

/**
 * Select the Server Folder datasource option
 */
export async function selectServerFolderDatasource(page: Page): Promise<void> {
  await page.locator(SERVER_FOLDER.datasourceOption).click();
  await page.waitForTimeout(500);
}

/**
 * Navigate to a folder in the folder tree
 * @param folderIndices Array of indices to click through the folder tree
 */
export async function navigateToFolder(page: Page, folderIndices: number[]): Promise<void> {
  for (const index of folderIndices) {
    await page.locator(SERVER_FOLDER.folderTreeItem(index)).click();
    await page.waitForTimeout(500);
  }
}

/**
 * Select metadata storage option
 */
export async function selectMetadataStorage(page: Page, storage: 'database' | 'file'): Promise<void> {
  const selector = storage === 'database' ? SERVER_FOLDER.metadataDatabase : SERVER_FOLDER.metadataFile;
  await page.locator(selector).click();
}

/**
 * Select sort option
 */
export async function selectSortOption(page: Page, sort: 'default' | 'filename' | 'filename-desc'): Promise<void> {
  let selector: string;
  switch (sort) {
    case 'filename':
      selector = SERVER_FOLDER.sortFilename;
      break;
    case 'filename-desc':
      selector = SERVER_FOLDER.sortFilenameDesc;
      break;
    default:
      selector = SERVER_FOLDER.sortDefault;
  }
  await page.locator(selector).click();
}

// ============================================================================
// MEDIA TAGS SPECIFIC FUNCTIONS
// ============================================================================

/**
 * Select the Media Tags datasource option
 */
export async function selectMediaTagsDatasource(page: Page): Promise<void> {
  await page.locator(MEDIA_TAGS.sidebarLink).click();
  await page.waitForTimeout(500);
}

/**
 * Select tags by indices
 */
export async function selectTagsByIndices(page: Page, indices: number[]): Promise<void> {
  for (const index of indices) {
    await page.locator(MEDIA_TAGS.tagItem(index)).click();
    await page.waitForTimeout(300);
  }
}

// ============================================================================
// MEDIA CATEGORIES SPECIFIC FUNCTIONS
// ============================================================================

/**
 * Select the Media Categories datasource option
 */
export async function selectMediaCategoriesDatasource(page: Page): Promise<void> {
  await page.locator(MEDIA_CATEGORIES.datasourceOption).click();
  await page.waitForTimeout(500);
}

/**
 * Select categories by indices
 */
export async function selectCategoriesByIndices(page: Page, indices: number[]): Promise<void> {
  for (const index of indices) {
    await page.locator(MEDIA_CATEGORIES.categoryItem(index)).click();
    await page.waitForTimeout(300);
  }
}

// ============================================================================
// POST QUERY SPECIFIC FUNCTIONS
// ============================================================================

/**
 * Select the Post Query datasource option
 */
export async function selectPostQueryDatasource(page: Page): Promise<void> {
  await page.locator(POST_QUERY.datasourceOption).click();
  await page.waitForTimeout(500);
}

/**
 * Configure post query parameters
 */
export async function configurePostQuery(page: Page, options: {
  postType?: string;
  numberOfPosts?: string;
  exclude?: string;
  taxonomy?: string;
}): Promise<void> {
  if (options.postType) {
    // #gallery_post_type is a <select> dropdown, not an input
    await page.locator(POST_QUERY.postType).selectOption(options.postType);
  }

  if (options.numberOfPosts) {
    await page.locator(POST_QUERY.numberOfPosts).click();
    await page.locator(POST_QUERY.numberOfPosts).fill(options.numberOfPosts);
  }

  if (options.exclude) {
    await page.locator(POST_QUERY.exclude).click();
    await page.locator(POST_QUERY.exclude).fill(options.exclude);
  }

  if (options.taxonomy) {
    await page.locator(POST_QUERY.taxonomy).click();
    await page.locator(POST_QUERY.taxonomy).fill(options.taxonomy);
  }
}
