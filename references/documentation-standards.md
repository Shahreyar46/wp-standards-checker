# WordPress Documentation Standards (PHPDoc & JSDoc)

> Source: https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/#comments--documentation

## 1. General Rules
- DocBlocks should directly precede the code element.
- Use **spaces**, not tabs, inside the DocBlock for alignment.
- Every function, method, class, and hook MUST have a DocBlock.
- All descriptions must end in a period (`.`).
- Leave a blank line between the description and the first tag.

## 2. Documenting Hooks (Actions & Filters)
```php
/**
 * Fires after the plugin has been initialized.
 *
 * @since 1.0.0
 *
 * @param array $args Initialization arguments.
 */
do_action( 'plugin_init', $args );
```
- Filters: Explain **what** is being filtered.
- Actions: Explain **when** it fires.
- Do NOT use `@return` for hooks.
- If a hook is called multiple times, document it once at the primary call site and use `/** This filter is documented in... */` at other sites.

## 3. Formatting Tags
- Use `@since` for every tagged addition.
- Use `@param` for every argument (include type and description).
- Use `@return` for functions (unless `void`).
- Use `@throws` for exceptions.
- Order: `@since` first, then `@param`, then `@return`, then `@throws`.
