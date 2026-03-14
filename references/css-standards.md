# WordPress CSS Coding Standards

> Source: https://developer.wordpress.org/coding-standards/wordpress-coding-standards/css/

## 1. Structure
- Use **tabs** for indentation.
- Two blank lines between sections; one blank line between blocks.
- Each selector on its own line.
- Property-value pairs on their own line with one tab indent.
- The closing brace should be flush left, at the same indentation level as the selector.

## 2. Selectors
- **hyphenated-lowercase** only (no camelCase, no underscores).
- Use human-readable, descriptive names.
- Avoid "over-qualified" selectors (use `.container` not `div.container`).
- Attribute selectors: use double quotes around values `[type="text"]`.

## 3. Properties & Values
- Space after colon in property: `margin: 0;`.
- Use **lowercase** for properties and values (except font names).
- Use **hex codes** for colors (`#fff`, not `#FFFFFF`). Shorten values where possible.
- Use **shorthand** properties where possible (`margin`, `padding`, `background`).
- Font weights: use numeric values (`400`, `700`) instead of `normal`/`bold`.
- 0 values should NOT have units (use `0`, not `0px`) unless necessary (e.g. `transition-duration`).
- Line height should be unit-less unless a specific pixel value is required.
- Use a leading zero for decimal values: `0.5`, not `.5`.

## 4. Media Queries
- Group media queries at the bottom of the stylesheet.
- Indent rule sets inside media queries by one level (one tab).

## 5. Commenting
- Use PHPDoc style for sections/subsections.
- Section headers: `/** * #.# Section title */`.
- Manual break line length at 80 characters for long comments.
