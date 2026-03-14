# 🐘 WORDPRESS PHP CODING STANDARDS (WPCS)

> This document summarizes the **300+ rules** found in the official WordPress-Core and Extra rulesets.

---

## 1. Naming Conventions
- **Functions, Variables, Filters**: `lower_snake_case`.
- **Classes, Traits, Interfaces**: `StudlyCaps` (e.g., `Class_Name`).
- **Constants**: `SCREAMING_SNAKE_CASE`.
- **Files**: Lowercase with hyphens. Class files prepend `class-`.

## 2. Whitespace & Indentation
- **Indentation**: Real **TABS** only.
- **Tab Width**: 4 characters.
- **Trailing Whitespace**: Strictly forbidden at end of lines.
- **Blank Lines**: No trailing blank lines at end of function bodies.

## 3. Formatting & Braces
- **Braces**: Must be used for **ALL** blocks (even 1-line `if`).
- **Brace Style**: Kernighan & Ritchie (same line for `if`, `foreach`, `function`).
- **Yoda Conditions**: `if ( true === $boolean )`.
- **Type Casts**: Small caps and one space after: `(int) $id`.

## 4. Arrays
- **Syntax**: Long array syntax `array()` is traditional, but modern WP allows `[]`.
- **Formatting**: Multi-line arrays must have one item per line and a trailing comma.
- **Alignment**: Align the double arrows `=>` in associative blocks.

## 5. Security & DB
- **Prepared SQL**: Mandatory use of `$wpdb->prepare()`.
- **Late Escaping**: Mandatory `esc_html()` etc., on output.
- **No Silenced Errors**: Avoid `@` operator.
- **No extract()**: Never use `extract()`.

---

## 🔍 Technical Error Codes
Refer to `knowledge/07_ERROR_CODE_INDEX.md` for specific codes like `WordPress.Security.EscapeOutput`.
