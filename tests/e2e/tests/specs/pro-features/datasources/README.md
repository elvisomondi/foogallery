# Datasource E2E Tests

End-to-end tests for FooGallery Pro Datasource features.

## Test Files

| File | Tests | Description |
|------|-------|-------------|
| `server-folder.spec.ts` | 11 | Server Folder datasource configuration and gallery creation |
| `media-tags.spec.ts` | 10 | Media Tags datasource selection and gallery creation |
| `media-categories.spec.ts` | 10 | Media Categories datasource with hierarchical support |
| `post-query.spec.ts` | 11 | Post Query datasource for posts with featured images |

**Total: 42 tests**

## Running Datasource Tests

```bash
# Navigate to e2e directory
cd e2e

# Run all datasource tests
npm run test:datasources

# Run datasource tests in headed mode (see browser)
npm run test:datasources:headed

# Run specific test file
npx playwright test --config=tests/playwright.config.ts tests/specs/pro-features/datasources/server-folder.spec.ts
npx playwright test --config=tests/playwright.config.ts tests/specs/pro-features/datasources/media-tags.spec.ts
npx playwright test --config=tests/playwright.config.ts tests/specs/pro-features/datasources/media-categories.spec.ts
npx playwright test --config=tests/playwright.config.ts tests/specs/pro-features/datasources/post-query.spec.ts
```

## Prerequisites

### 1. Test Data Setup
The setup script automatically creates test data:
- **Server Folder**: Test folder with images in `wp-content/uploads/e2e-test-folder/`
- **Media Tags**: Tags assigned to uploaded images (Animals, Nature, Objects, etc.)
- **Media Categories**: Hierarchical categories (Landscapes > Mountains, Beaches)
- **Test Posts**: 5 posts with featured images for Post Query testing

### 2. Test Images
Sample images are located in `e2e/test-assets/images/` and are automatically imported during setup.

## Test Coverage

### Server Folder (`server-folder.spec.ts`)
- Datasource option visibility in modal
- Metadata storage selection (database/file)
- Folder tree navigation
- Sort options (default, filename, filename-desc)
- Gallery creation from folder
- Frontend image display
- Lightbox functionality
- Edit datasource settings
- Remove datasource
- Caption editing via database storage
- Caption editing via JSON file

### Media Tags (`media-tags.spec.ts`)
- Datasource option visibility in sidebar
- Available tags display
- Single tag selection
- Multiple tag selection
- Selection checkboxes
- Gallery creation from tags
- Frontend tagged images display
- Lightbox functionality
- Edit datasource settings
- Remove datasource

### Media Categories (`media-categories.spec.ts`)
- Datasource option visibility in modal
- Available categories display
- Single category selection
- Multiple category selection
- Hierarchical structure display
- Selection checkboxes
- Gallery creation from categories
- Frontend categorized images display
- Lightbox functionality
- Edit/remove datasource

### Post Query (`post-query.spec.ts`)
- Datasource option visibility in modal
- Post type selection (post, page, attachment)
- Number of posts configuration
- Exclude IDs configuration
- Taxonomy filter configuration
- Override options (link, desc, title, class, sort)
- Gallery creation from posts
- Frontend post images display
- Lightbox functionality
- Edit/remove datasource
- Direct attachment query

## Troubleshooting

### Tests failing to find datasource options
The datasource modal opens after clicking "Add From Another Source" button. Use the modal heading to verify it's open before selecting options.

### Server Folder not showing images
1. Verify the test folder exists at `wp-content/uploads/e2e-test-folder/`
2. Check that images were copied during setup
3. Review setup script logs: `npm run docker:logs`

### Media Tags/Categories empty
1. Verify taxonomies were created in setup script
2. Check that images have tags/categories assigned
3. Run WP-CLI to verify: `npm run docker:wp -- term list foogallery_attachment_tag`

### Post Query showing no images
1. Verify test posts were created with featured images
2. Check post count: `npm run docker:wp -- post list --post_type=post`
3. Verify featured images: `npm run docker:wp -- post meta get <post_id> _thumbnail_id`

## Related Files

- `tests/helpers/datasource-test-helper.ts` - Shared selectors and helper functions
- `docker/scripts/setup-wordpress.sh` - Test data creation during setup
- `docker/docker-compose.yml` - Volume mounts for test assets
