# WordPress JavaScript Coding Standards

> Source: https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/

## 1. Indentation & Spacing
- Use **tabs** for indentation (not spaces).
- No trailing whitespace.
- Line length: Soft limit 80, Hard limit 100 characters.
- Blocks (`if`, `else`, `for`, etc.) must ALWAYS use braces and go on multiple lines.
- Space before opening braces `{`.
- No space between function name and `(` in calls: `fn()`.
- Spaces inside parentheses for control structures: `if ( condition )`.
- Any `!` negation operator should have a following space: `if ( ! condition )`.

## 2. Assignments & Globals
- Use `const` and `let` (ES2015+).
- Use `const` by default; use `let` if reassignment happens.
- Avoid `var` (only for legacy browser support).
- Document globals at the top of the file: `/* global passwordStrength:true */`.

## 3. Naming Conventions
- Methods and variables: `camelCase` (lowercase first letter).
- Classes: `PascalCase`.
- Constants: `UPPER_SNAKE_CASE`.
- Selector names in DOM: `hyphenated-lowercase`.

## 4. Equality & Type Checks
- Use **strict equality** (`===`) instead of abstract (`==`).
- Type check examples:
  - String: `typeof obj === 'string'`
  - Number: `typeof obj === 'number'`
  - null: `obj === null`
  - undefined: `obj === undefined` (local) or `typeof var === 'undefined'` (global)

## 5. Strings
- Use **single quotes** for string literals: `'text'`.
- Escape single quotes with a backslash if needed: `'Note the backslash before the \'single quotes\'';`.
