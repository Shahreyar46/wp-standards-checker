# 📝 WORDPRESS DOCUMENTATION STANDARDS (PHPDoc)

**MANDATORY**: Every single file, class, method, and function MUST have a comprehensive DocBlock.

---

## 1. File Headers (Mandatory)
Every PHP file must start with a file-level DocBlock.
```php
<?php
/**
 * Short description of file purpose.
 *
 * @package YourPlugin
 */
```

## 2. Functions & Methods (Mandatory)
Every function/method must be documented. 
- **Punctuation**: The short description and all @param/@return descriptions MUST end with a period (`.`).

```php
/**
 * Short description ends with period.
 *
 * @since 1.0.0
 *
 * @param string $v Description of parameter ends with period.
 * @return bool True on success, false on failure.
 */
function my_prefix_function( $v ) { ... }
```

## 3. Class Documentation (Mandatory)
```php
/**
 * Class handles user logic.
 *
 * @since 1.0.0
 */
class My_Prefix_User { ... }
```

## 4. Hook Documentation (Mandatory)
Every `do_action` or `apply_filters` should be documented.
```php
/**
 * Fires after a user is saved.
 *
 * @since 1.0.0
 *
 * @param int $user_id The ID of the saved user.
 */
do_action( 'my_prefix_after_save', $user_id );
```

## 5. Inline Comments
- **Rule**: Use inline comments to explain complex logic.
- **Punctuation**: All inline comments MUST end with a period (`.`), exclamation (`!`), or question mark (`?`).
- **Style**: Use `//` for single lines.

```php
// Validate the user input before processing.
if ( empty( $input ) ) {
    return;
}
```
