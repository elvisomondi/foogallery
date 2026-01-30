// File: tests/specs/pro-features/filtering/filtering-search.spec.ts
// Tests for filtering search input functionality

import { test, expect } from '@playwright/test';
import {
  FILTERING_SELECTORS,
  createGalleryWithFiltering,
  waitForFiltering,
  enterSearchText,
  clearSearch,
  getVisibleItemCount,
  clickFilterTag,
  getFilterTags,
} from '../../../helpers/filtering-test-helper';
test.describe('Filtering - Search', () => {

  test.describe('Search Display', () => {
    test('displays search input when search is enabled', async ({ page }) => {
      await createGalleryWithFiltering(page, {
        galleryName: 'Filter Search Display Test',
        templateSelector: 'justified',
        screenshotPrefix: 'filtering-search-display',
        imageCount: 10,
        filteringType: 'simple',
        includeSearch: true,
      });

      await waitForFiltering(page);

      const searchInput = page.locator(FILTERING_SELECTORS.searchInput);
      await expect(searchInput).toBeVisible();

      // Verify placeholder text
      await expect(searchInput).toHaveAttribute('placeholder', /Search/);

    });

    test('does not display search input when search is disabled', async ({ page }) => {
      await createGalleryWithFiltering(page, {
        galleryName: 'Filter No Search Test',
        templateSelector: 'justified',
        screenshotPrefix: 'filtering-search-disabled',
        imageCount: 10,
        filteringType: 'simple',
        includeSearch: false,
      });

      await waitForFiltering(page);

      const searchInput = page.locator(FILTERING_SELECTORS.searchInput);
      await expect(searchInput).not.toBeVisible();

    });
  });

  test.describe('Search Functionality', () => {
    test('filters gallery when typing in search', async ({ page }) => {
      await createGalleryWithFiltering(page, {
        galleryName: 'Filter Search Typing Test',
        templateSelector: 'justified',
        screenshotPrefix: 'filtering-search-typing',
        imageCount: 10,
        filteringType: 'simple',
        includeSearch: true,
      });

      await waitForFiltering(page);

      const initialCount = await getVisibleItemCount(page);

      // Type a search term (using a common term that might be in image titles/captions)
      await enterSearchText(page, 'test');

    });

    test('clears search and shows all items', async ({ page }) => {
      await createGalleryWithFiltering(page, {
        galleryName: 'Filter Search Clear Test',
        templateSelector: 'justified',
        screenshotPrefix: 'filtering-search-clear',
        imageCount: 10,
        filteringType: 'simple',
        includeSearch: true,
      });

      await waitForFiltering(page);

      const initialCount = await getVisibleItemCount(page);

      // Type a search term
      await enterSearchText(page, 'sample');

      // Clear search
      await clearSearch(page);

      // Verify all items are visible again
      const finalCount = await getVisibleItemCount(page);
      expect(finalCount).toBe(initialCount);

    });

    test('search works with filter tags together', async ({ page }) => {
      await createGalleryWithFiltering(page, {
        galleryName: 'Filter Search With Tags Test',
        templateSelector: 'justified',
        screenshotPrefix: 'filtering-search-tags',
        imageCount: 10,
        filteringType: 'simple',
        includeSearch: true,
      });

      await waitForFiltering(page);

      // First click a filter tag
      const filterTags = await getFilterTags(page);
      const firstTag = filterTags.find(tag => tag !== 'All');

      if (firstTag) {
        await clickFilterTag(page, firstTag);

        // Then add a search term
        await enterSearchText(page, 'image');
      }
    });
  });

  test.describe('Search Position', () => {
    test('displays search above center by default', async ({ page }) => {
      await createGalleryWithFiltering(page, {
        galleryName: 'Filter Search Above Center Test',
        templateSelector: 'justified',
        screenshotPrefix: 'filtering-search-above-center',
        imageCount: 10,
        filteringType: 'simple',
        includeSearch: true,
        searchPosition: 'above-center',
      });

      await waitForFiltering(page);

      const filterContainer = page.locator(FILTERING_SELECTORS.container);
      await expect(filterContainer).toHaveClass(/fg-search-above-center/);

    });

    test('displays search above right', async ({ page }) => {
      await createGalleryWithFiltering(page, {
        galleryName: 'Filter Search Above Right Test',
        templateSelector: 'justified',
        screenshotPrefix: 'filtering-search-above-right',
        imageCount: 10,
        filteringType: 'simple',
        includeSearch: true,
        searchPosition: 'above-right',
      });

      await waitForFiltering(page);

      const filterContainer = page.locator(FILTERING_SELECTORS.container);
      await expect(filterContainer).toHaveClass(/fg-search-above-right/);

    });

    test('displays search below center', async ({ page }) => {
      await createGalleryWithFiltering(page, {
        galleryName: 'Filter Search Below Center Test',
        templateSelector: 'justified',
        screenshotPrefix: 'filtering-search-below-center',
        imageCount: 10,
        filteringType: 'simple',
        includeSearch: true,
        searchPosition: 'below-center',
      });

      await waitForFiltering(page);

      // Verify search input is visible and filtering container exists
      const searchInput = page.locator(FILTERING_SELECTORS.searchInput).first();
      await expect(searchInput).toBeVisible();

      const filterContainer = page.locator(FILTERING_SELECTORS.container).first();
      await expect(filterContainer).toBeVisible();

    });

    test('displays search before filter (merged)', async ({ page }) => {
      await createGalleryWithFiltering(page, {
        galleryName: 'Filter Search Before Merged Test',
        templateSelector: 'justified',
        screenshotPrefix: 'filtering-search-before-merged',
        imageCount: 10,
        filteringType: 'simple',
        includeSearch: true,
        searchPosition: 'before-merged',
      });

      await waitForFiltering(page);

      // Verify search input is visible and filtering container exists
      const searchInput = page.locator(FILTERING_SELECTORS.searchInput).first();
      await expect(searchInput).toBeVisible();

      const filterContainer = page.locator(FILTERING_SELECTORS.container).first();
      await expect(filterContainer).toBeVisible();

    });

    test('displays search after filter (merged)', async ({ page }) => {
      await createGalleryWithFiltering(page, {
        galleryName: 'Filter Search After Merged Test',
        templateSelector: 'justified',
        screenshotPrefix: 'filtering-search-after-merged',
        imageCount: 10,
        filteringType: 'simple',
        includeSearch: true,
        searchPosition: 'after-merged',
      });

      await waitForFiltering(page);

      // Verify search input is visible and filtering container exists
      const searchInput = page.locator(FILTERING_SELECTORS.searchInput).first();
      await expect(searchInput).toBeVisible();

      const filterContainer = page.locator(FILTERING_SELECTORS.container).first();
      await expect(filterContainer).toBeVisible();

    });
  });

  test.describe('Search Only (No Filter Tags)', () => {
    test('can use search without showing filter tags', async ({ page }) => {
      await createGalleryWithFiltering(page, {
        galleryName: 'Filter Search Only Test',
        templateSelector: 'justified',
        screenshotPrefix: 'filtering-search-only',
        imageCount: 10,
        filteringType: 'simple',
        includeSearch: true,
        hideAll: true,
      });

      await waitForFiltering(page);

      // Verify search input is visible
      const searchInput = page.locator(FILTERING_SELECTORS.searchInput);
      await expect(searchInput).toBeVisible();

      // Test search functionality
      await enterSearchText(page, 'sample');

    });
  });
});
