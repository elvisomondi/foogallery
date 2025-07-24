# Requirements Document

## Introduction

This specification addresses a critical bug in FooGallery Premium where deep linking functionality fails when Master Product is configured for a gallery. The issue prevents users from sharing lightbox URLs that automatically open the correct image when accessed by others, but only when Master Product functionality is active.

The root cause is a data attribute conflict where Master Product code unconditionally changes `data-attachment-id` to `data-id` attributes, breaking the deep linking system's ability to identify items correctly.

## Requirements

### Requirement 1

**User Story:** As a FooGallery user with Master Product enabled, I want deep linking to work correctly so that shared lightbox URLs open the intended image automatically for other users.

#### Acceptance Criteria

1. WHEN a gallery has Master Product configured AND deep linking is enabled THEN shared lightbox URLs SHALL open the correct image in the lightbox automatically
2. WHEN a user copies a lightbox URL from a Master Product gallery THEN another user accessing that URL SHALL see the same image opened in the lightbox
3. WHEN Master Product is enabled THEN the deep linking behavior SHALL be consistent with galleries that don't use Master Product
4. WHEN the global "Item ID Attribute" setting is configured THEN Master Product galleries SHALL respect this setting instead of forcing attribute changes

### Requirement 2

**User Story:** As a FooGallery administrator, I want the Master Product functionality to respect global settings so that the plugin behavior is consistent and predictable.

#### Acceptance Criteria

1. WHEN the global "Item ID Attribute" setting is set to "data-attachment-id" THEN Master Product galleries SHALL use "data-attachment-id" attributes
2. WHEN the global "Item ID Attribute" setting is set to "data-id" THEN Master Product galleries SHALL use "data-id" attributes
3. WHEN the global setting is changed THEN existing Master Product galleries SHALL automatically use the new attribute type
4. WHEN Master Product is disabled for a gallery THEN the gallery SHALL revert to using the global setting for item identification

### Requirement 3

**User Story:** As a developer maintaining FooGallery, I want the JavaScript state management system to be robust enough to handle both attribute types so that future compatibility issues are prevented.

#### Acceptance Criteria

1. WHEN the JavaScript state system encounters "data-attachment-id" attributes THEN it SHALL correctly identify and track items
2. WHEN the JavaScript state system encounters "data-id" attributes THEN it SHALL correctly identify and track items
3. WHEN a gallery contains mixed attribute types THEN the state system SHALL handle both gracefully
4. WHEN deep linking URLs are processed THEN the system SHALL correctly identify items regardless of attribute type used

### Requirement 4

**User Story:** As a FooGallery user, I want backward compatibility maintained so that existing galleries continue to work without requiring manual updates.

#### Acceptance Criteria

1. WHEN upgrading to the fixed version THEN existing Master Product galleries SHALL continue to function without manual intervention
2. WHEN existing deep linking URLs are accessed THEN they SHALL continue to work with the updated system
3. WHEN galleries were created with different attribute types THEN they SHALL all work correctly after the fix
4. WHEN users have customized the "Item ID Attribute" setting THEN their preference SHALL be maintained and respected

### Requirement 5

**User Story:** As a FooGallery user, I want comprehensive testing to ensure the fix works across different scenarios so that I can rely on the deep linking functionality.

#### Acceptance Criteria

1. WHEN testing with different gallery templates THEN deep linking SHALL work consistently across all templates
2. WHEN testing with different browsers THEN the fix SHALL work in Chrome, Firefox, Safari, and Edge
3. WHEN testing with mobile devices THEN deep linking SHALL work on iOS and Android devices
4. WHEN testing with different Master Product configurations THEN deep linking SHALL work with simple and variable products
5. WHEN testing URL sharing across different domains THEN the deep linking SHALL work correctly
6. WHEN testing with galleries that have filtering enabled THEN deep linking SHALL work with filtered states
7. WHEN testing with paginated galleries THEN deep linking SHALL work with different page states