# FooGallery Deep Linking Bug Analysis - Master Product Issue

**Bug Report**: Deep linking fails when Master Product is configured
**Date**: July 24, 2025
**Plugin Version**: 2.4.34

---

## Problem Description

When a Master Product is set up and configured for a gallery with Deep Linking enabled, shared lightbox URLs fail to automatically open the correct image in the lightbox when loaded by another user. The page loads normally but the lightbox doesn't open automatically as expected.

**Key Issue**: This bug only occurs when Master Product functionality is used.

---

## Technical Analysis

### 1. **Root Cause Identification**

The issue stems from a **data attribute conflict** in the Master Product implementation:

**File**: `pro/includes/woocommerce/class-foogallery-pro-woocommerce-master-product.php`
**Method**: `adjust_attachment_link_data_attributes()` (Lines 305-315)

```php
public function adjust_attachment_link_data_attributes( $attr, $args, $foogallery_attachment ) {
    $product_id = $this->get_master_product_id_from_current_gallery();
    if ( $product_id > 0 ) {
        // The data-attachment-id attribute does not work with master products, 
        // so we need to make sure it is data-id
        if ( array_key_exists( 'data-attachment-id', $attr ) ) {
            unset( $attr[ 'data-attachment-id' ] );
            $attr[ 'data-id' ] = $foogallery_attachment->ID;
        }
    }
    return $attr;
}
```

### 2. **Deep Linking System Overview**

**Deep Linking Configuration** (`pro/includes/class-foogallery-pro-advanced-gallery-settings.php`):
- Enabled via `state` setting (default: 'yes')
- Uses URL mask pattern (default: 'foogallery-{id}')
- Implemented in JavaScript (`extensions/default-templates/shared/js/foogallery.js`)

**JavaScript State Management**:
- State system tracks current gallery state including selected items
- Uses `data-id` or `data-attachment-id` attributes to identify items
- URL hash format: `#foogallery-{gallery-id}-{item-id}`

### 3. **The Conflict**

**Normal Gallery Behavior**:
- Items use `data-attachment-id` attribute
- Deep linking JavaScript reads this attribute to identify items
- URL sharing works correctly

**Master Product Behavior**:
- Master Product code **removes** `data-attachment-id` attribute
- Replaces it with `data-id` attribute
- Deep linking JavaScript may not recognize the `data-id` attribute properly
- URL sharing fails because item identification is broken

### 4. **Item ID Attribute Setting**

**Global Setting** (`includes/admin/class-settings.php` Line 515):
```php
'desc' => __( 'Each item has an ID attribute which identifies itself. Changing the attribute will change what is used for deeplinking.', 'foogallery' )
```

This setting allows choosing between:
- `data-attachment-id` (default)
- `data-id`

**The Problem**: Master Product code **forcibly changes** the attribute regardless of this setting.

---

## Bug Analysis Summary

### **Primary Issue**
The Master Product functionality **unconditionally** changes `data-attachment-id` to `data-id`, but the deep linking system may be configured to expect `data-attachment-id`.

### **Secondary Issues**
1. **Inconsistent Behavior**: The attribute change happens only when Master Product is active
2. **Setting Override**: The global "Item ID Attribute" setting is ignored
3. **JavaScript Dependency**: Deep linking JavaScript may not handle both attribute types properly

---

## Potential Solutions

### **Solution 1: Respect Global Setting** (Recommended)
Modify the Master Product code to respect the global "Item ID Attribute" setting:

```php
public function adjust_attachment_link_data_attributes( $attr, $args, $foogallery_attachment ) {
    $product_id = $this->get_master_product_id_from_current_gallery();
    if ( $product_id > 0 ) {
        // Get the global setting for item ID attribute
        $item_id_attribute = foogallery_get_setting( 'item_id_attribute', 'data-attachment-id' );
        
        if ( $item_id_attribute === 'data-id' ) {
            // Only change if the setting requires data-id
            if ( array_key_exists( 'data-attachment-id', $attr ) ) {
                unset( $attr[ 'data-attachment-id' ] );
                $attr[ 'data-id' ] = $foogallery_attachment->ID;
            }
        }
        // Otherwise, leave data-attachment-id as is
    }
    return $attr;
}
```

### **Solution 2: Ensure JavaScript Compatibility**
Update the JavaScript state management to handle both attribute types:

```javascript
// In the state management code, check for both attributes
var itemId = $item.attr('data-id') || $item.attr('data-attachment-id');
```

### **Solution 3: Master Product Setting Override**
Add a Master Product-specific setting to control the attribute behavior:

```php
// In the Master Product fields
array(
    'id'       => 'ecommerce_master_product_item_id_attribute',
    'title'    => __( 'Item ID Attribute', 'foogallery' ),
    'desc'     => __( 'Choose which attribute to use for item identification with Master Products.', 'foogallery' ),
    'section'  => __( 'Ecommerce', 'foogallery' ),
    'subsection' => array( 'ecommerce-master-product' => __( 'Master Product', 'foogallery' ) ),
    'type'     => 'radio',
    'default'  => 'data-attachment-id',
    'choices'  => array(
        'data-attachment-id' => __( 'data-attachment-id', 'foogallery' ),
        'data-id' => __( 'data-id', 'foogallery' ),
    ),
)
```

---

## Testing Strategy

### **Test Cases**
1. **Normal Gallery**: Deep linking works without Master Product
2. **Master Product + data-attachment-id**: Deep linking works with Master Product using default attribute
3. **Master Product + data-id**: Deep linking works with Master Product using data-id attribute
4. **Setting Changes**: Behavior changes correctly when global setting is modified
5. **Cross-browser**: Test in different browsers and devices

### **Test Steps**
1. Create gallery with Master Product enabled
2. Enable Deep Linking
3. Open image in lightbox
4. Copy URL from browser
5. Share URL with another user/browser
6. Verify lightbox opens automatically with correct image

---

## Recommended Fix Priority

**Priority**: HIGH - This affects core functionality for e-commerce users

**Recommended Solution**: Solution 1 (Respect Global Setting) as it:
- Maintains backward compatibility
- Respects existing user configurations
- Requires minimal code changes
- Fixes the root cause rather than symptoms

---

## Files to Modify

1. **`pro/includes/woocommerce/class-foogallery-pro-woocommerce-master-product.php`**
   - Method: `adjust_attachment_link_data_attributes()`
   - Add logic to respect global setting

2. **Testing Files**
   - Create test cases for both attribute types
   - Verify JavaScript state management works with both

---

## Additional Notes

- This bug likely affects all Master Product users who rely on deep linking
- The issue may also impact other features that depend on consistent item identification
- Consider adding debug logging to help identify similar issues in the future
- Review other areas where Master Product might override global settings
