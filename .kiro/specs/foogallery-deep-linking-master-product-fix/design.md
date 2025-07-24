# Design Document

## Overview

This design addresses the deep linking bug in FooGallery Premium where Master Product functionality breaks URL sharing by forcing data attribute changes. The solution involves modifying the Master Product implementation to respect global settings and enhancing the JavaScript state management system for better compatibility.

## Architecture

### Current System Analysis

**Master Product Data Attribute Handling:**
- Location: `pro/includes/woocommerce/class-foogallery-pro-woocommerce-master-product.php`
- Method: `adjust_attachment_link_data_attributes()`
- Current Behavior: Unconditionally removes `data-attachment-id` and adds `data-id`
- Problem: Ignores global "Item ID Attribute" setting

**Deep Linking System:**
- Location: `pro/includes/class-foogallery-pro-advanced-gallery-settings.php`
- JavaScript: `extensions/default-templates/shared/js/foogallery.js`
- Current Behavior: Uses configured attribute type for item identification
- Problem: May not handle attribute type mismatches gracefully

**Global Setting:**
- Location: `includes/admin/class-settings.php`
- Setting: `item_id_attribute`
- Options: `data-attachment-id` (default) or `data-id`
- Problem: Not respected by Master Product code

### Proposed Solution Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FooGallery Core                          │
├─────────────────────────────────────────────────────────────┤
│  Global Setting: item_id_attribute                          │
│  - data-attachment-id (default)                             │
│  - data-id                                                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Master Product Handler                         │
├─────────────────────────────────────────────────────────────┤
│  NEW: Check global setting before attribute modification    │
│  - If setting = data-attachment-id → Keep original         │
│  - If setting = data-id → Convert to data-id               │
│  - Respect user preference instead of forcing change       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│            JavaScript State Management                      │
├─────────────────────────────────────────────────────────────┤
│  ENHANCED: Handle both attribute types gracefully          │
│  - Primary: Check configured attribute type                │
│  - Fallback: Check alternative attribute type              │
│  - Ensure deep linking works regardless of attribute       │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### Component 1: Master Product Attribute Handler

**File:** `pro/includes/woocommerce/class-foogallery-pro-woocommerce-master-product.php`

**Interface Changes:**
```php
public function adjust_attachment_link_data_attributes( $attr, $args, $foogallery_attachment ) {
    // NEW: Respect global setting instead of forcing change
    $product_id = $this->get_master_product_id_from_current_gallery();
    if ( $product_id > 0 ) {
        $item_id_attribute = foogallery_get_setting( 'item_id_attribute', 'data-attachment-id' );
        
        // Only modify attributes if global setting requires data-id
        if ( $item_id_attribute === 'data-id' && array_key_exists( 'data-attachment-id', $attr ) ) {
            unset( $attr[ 'data-attachment-id' ] );
            $attr[ 'data-id' ] = $foogallery_attachment->ID;
        }
        // Otherwise preserve existing attribute type
    }
    return $attr;
}
```

**Responsibilities:**
- Check global "Item ID Attribute" setting
- Only modify attributes when setting requires `data-id`
- Preserve `data-attachment-id` when that's the configured preference
- Maintain backward compatibility

### Component 2: JavaScript State Management Enhancement

**File:** `extensions/default-templates/shared/js/foogallery.js`

**Interface Changes:**
```javascript
// Enhanced item identification function
function getItemId($item) {
    // Check primary attribute based on configuration
    var primaryAttr = FooGallery.template.opt.itemIdAttribute || 'data-attachment-id';
    var itemId = $item.attr(primaryAttr);
    
    // Fallback to alternative attribute if primary not found
    if (!itemId) {
        var fallbackAttr = primaryAttr === 'data-id' ? 'data-attachment-id' : 'data-id';
        itemId = $item.attr(fallbackAttr);
    }
    
    return itemId;
}
```

**Responsibilities:**
- Detect configured attribute type from template options
- Provide fallback mechanism for attribute detection
- Ensure deep linking works with both attribute types
- Maintain compatibility with existing URLs

### Component 3: Configuration Integration

**File:** `pro/includes/class-foogallery-pro-advanced-gallery-settings.php`

**Interface Changes:**
```php
function add_data_options($options, $gallery, $attributes) {
    // Existing deep linking options
    $enable_state = foogallery_gallery_template_setting( 'state', 'no' );
    if ( 'yes' === $enable_state ) {
        $options['state']['enabled'] = true;
        $state_mask = foogallery_gallery_template_setting( 'state_mask', 'foogallery-{id}' );
        $options['state']['mask'] = $state_mask;
        
        // NEW: Pass item ID attribute setting to JavaScript
        $options['state']['itemIdAttribute'] = foogallery_get_setting( 'item_id_attribute', 'data-attachment-id' );
    }
    return $options;
}
```

**Responsibilities:**
- Pass global setting to JavaScript layer
- Ensure consistent configuration across PHP and JavaScript
- Enable JavaScript to make informed decisions about attribute handling

## Data Models

### Global Setting Model
```php
// Setting key: 'item_id_attribute'
// Values: 'data-attachment-id' | 'data-id'
// Default: 'data-attachment-id'
// Location: WordPress options table
```

### Gallery State Model
```javascript
// JavaScript state object structure
{
    enabled: boolean,
    mask: string,
    itemIdAttribute: string, // NEW: 'data-attachment-id' | 'data-id'
    current: {
        item: string,
        page: number,
        filter: string
    }
}
```

### Item Attribute Model
```html
<!-- Option 1: data-attachment-id (default) -->
<a class="fg-thumb" data-attachment-id="123" href="...">

<!-- Option 2: data-id (alternative) -->
<a class="fg-thumb" data-id="123" href="...">
```

## Error Handling

### PHP Error Handling
```php
public function adjust_attachment_link_data_attributes( $attr, $args, $foogallery_attachment ) {
    try {
        $product_id = $this->get_master_product_id_from_current_gallery();
        if ( $product_id > 0 ) {
            // Get setting with fallback
            $item_id_attribute = foogallery_get_setting( 'item_id_attribute', 'data-attachment-id' );
            
            // Validate setting value
            if ( !in_array( $item_id_attribute, ['data-attachment-id', 'data-id'] ) ) {
                $item_id_attribute = 'data-attachment-id'; // Fallback to default
            }
            
            // Apply logic based on validated setting
            if ( $item_id_attribute === 'data-id' && array_key_exists( 'data-attachment-id', $attr ) ) {
                unset( $attr[ 'data-attachment-id' ] );
                $attr[ 'data-id' ] = $foogallery_attachment->ID;
            }
        }
    } catch ( Exception $e ) {
        // Log error but don't break functionality
        error_log( 'FooGallery Master Product attribute adjustment failed: ' . $e->getMessage() );
    }
    
    return $attr;
}
```

### JavaScript Error Handling
```javascript
function getItemId($item) {
    try {
        var config = FooGallery.template.opt.state || {};
        var primaryAttr = config.itemIdAttribute || 'data-attachment-id';
        var itemId = $item.attr(primaryAttr);
        
        // Fallback mechanism
        if (!itemId) {
            var fallbackAttr = primaryAttr === 'data-id' ? 'data-attachment-id' : 'data-id';
            itemId = $item.attr(fallbackAttr);
        }
        
        // Final fallback to any ID-like attribute
        if (!itemId) {
            itemId = $item.attr('data-attachment-id') || $item.attr('data-id');
        }
        
        return itemId;
    } catch (e) {
        console.warn('FooGallery: Error getting item ID', e);
        return null;
    }
}
```

## Testing Strategy

### Unit Testing
1. **PHP Unit Tests:**
   - Test `adjust_attachment_link_data_attributes()` with different global settings
   - Test behavior with and without Master Product
   - Test error handling and edge cases

2. **JavaScript Unit Tests:**
   - Test `getItemId()` function with different attribute types
   - Test state management with mixed attribute scenarios
   - Test URL parsing and item identification

### Integration Testing
1. **Gallery Creation Tests:**
   - Create galleries with different Master Product configurations
   - Verify correct attribute types are applied
   - Test setting changes affect existing galleries

2. **Deep Linking Tests:**
   - Test URL generation with different attribute types
   - Test URL parsing and item identification
   - Test cross-browser compatibility

3. **User Workflow Tests:**
   - Test complete user journey from gallery creation to URL sharing
   - Test different user roles and permissions
   - Test mobile and desktop experiences

### Regression Testing
1. **Backward Compatibility:**
   - Test existing galleries continue to work
   - Test existing deep linking URLs remain functional
   - Test upgrade scenarios

2. **Performance Testing:**
   - Ensure changes don't impact gallery loading performance
   - Test with large galleries (100+ images)
   - Test with multiple galleries on same page

## Implementation Phases

### Phase 1: Core Fix Implementation
- Modify Master Product attribute handling
- Update global setting integration
- Add error handling and validation

### Phase 2: JavaScript Enhancement
- Enhance state management system
- Add fallback mechanisms
- Improve attribute detection

### Phase 3: Configuration Integration
- Pass settings to JavaScript layer
- Ensure consistent behavior
- Add debugging capabilities

### Phase 4: Testing and Validation
- Comprehensive testing across scenarios
- Performance validation
- User acceptance testing

### Phase 5: Documentation and Deployment
- Update documentation
- Create migration guide if needed
- Deploy with proper versioning