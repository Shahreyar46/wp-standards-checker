# 🛡️ SAFE I18N MIGRATION PROTOCOL (100% ACCURACY)

This protocol serves as a mandatory safety guard for the AI when migrating hardcoded strings in large JS/React/Vue applications to a translation bridge (Method 2).

## 🚀 1. THE "ONE-BY-ONE" RULE
**Strict Enforcement**: NEVER attempt to migrate an entire folder or multiple complex components in a single task.
- **Limit**: Max **one large component** or **two small components** per task.
- **Reasoning**: Large context shifts cause the AI to "hallucinate" over the middle sections of files, leading to missing markup, broken imports, or incomplete components.

## 🔍 2. THE EXTRACTION PHASE (The "Lookup Table")
Before editing any file, you must first create a **Map** of the strings to be moved.
- Scan the file line-by-line.
- Extract the raw string and propose a unique, descriptive key (e.g., `Settings Saved` -> `settings_saved`).
- **Wait for Developer Sync**: Present this map to the developer before editing the file.

## ✍️ 3. THE REPLACEMENT PHASE (Surgical Accuracy)
When applying the fix:
1.  **Direct Import**: Only add the necessary import/helper at the top. Do not re-organize existing imports.
2.  **Surgical Replacement**: Replace ONLY the string literal. 
    - ✅ **GOOD**: `<button>{{ __('save_changes') }}</button>`
    - ❌ **BAD**: Rewriting the entire `<button>` block or parent `<div>`.
3.  **No Logic Changes**: Never touch event handlers, computed properties, or props while doing i18n work.

## 📂 4. THE PHP SYNC (No Missing & No Duplicate Strings)
- Every time a key is added to a JS file, it **MUST** be immediately added to the PHP `Strings` class.
- **Deduplication Check**: Before adding a new key to PHP, scan the existing `Strings` class.
    - If the same text already has a key (e.g., `Save Changes` already exists as `save`), REUSE the existing key in the JS file.
    - NEVER create redundant keys like `save_btn` and `save_changes` for the same translation string.

### 4.1 THE DUPLICATE KEY PITFALL
PHP associative arrays silently overwrite previous values if a key is repeated. 
- **Consequence**: If you define `'save' => 'Save'` on line 10 and `'save' => 'Update'` on line 50, the UI will show "Update" even where "Save" was intended.
- **Action**: Always run a deduplication audit on the PHP file after every edit.
- **Detection**: Use a script or regex search to find duplicate keys before concluding a task.

- **Audit Step (Mandatory)**: After finishing a component or updating `class-strings.php`, run a script or check to ensure:
    1. **No Duplicate Keys**: No array key is defined twice in the PHP array.
    2. **Key Parity**: Every `t('key')` or `__('key')` used in JS/Vue/React has a matching key in PHP.
    3. **Key Mismatch Fix**: If PHP has `enable_dark_mode` but JS uses `enable_dark_mode_i18n`, rename one to match EXACTLY.

## 🏗️ 6. THE REGISTRATION RULE (Bootstrapper Awareness)
- **CRITICAL**: When creating a new `Strings` class for the i18n bridge, YOU MUST verify it is properly loaded.
- **Action**: Locate the plugin's main entry point (e.g., `class-boot.php`, `functions.php`, or the main plugin file) and ensure a `require_once` or autoloader registration is added for the `class-strings.php` file.
- **Fatal Error Prevention**: Failure to register the class will cause a `Fatal Error: Class not found` when `wp_localize_script()` or the assets class tries to call `Strings::get()`.
- **Verification**: Always check the `Boot` or `init` sequence before concluding the task.

## 🛑 7. AI SAFETY CHECKLIST
- [ ] **Did I read every line?** (Verify no strings hidden in tooltips or placeholders).
- [ ] **Is the markup identical?** (Inspect the diff for missing closing tags or brackets).
- [ ] **Is the helper available?** (Ensure the Vue `useTranslation` composable, global prop, or React import is active).
- [ ] **Class Registered?** (Ensure the `Strings` class is required in the bootstrapper/loader).
- [ ] **Duplicate Scan?** (Ran `node find_duplicates.js` or equivalent to ensure no double array keys).
- [ ] **Token Management**: If the file is >300 lines, use the `replace_file_content` tool on specific chunks rather than the whole file to prevent truncation.
