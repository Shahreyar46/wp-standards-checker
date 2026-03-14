# Advanced WordPress JS Internationalization (i18n) Patterns

This document outlines the two primary methods for translating JavaScript (React/Vue/Vanilla) in WordPress and why Method 2 is often the professional choice for reliability.

## ⚖️ Method Comparison

| Feature | Method 1: Modern (`wp_set_script_translations`) | Method 2: Hybrid (`wp_localize_script`) |
|:---|:---|:---|
| **Core PHP Function** | `wp_set_script_translations( $handle, $domain, $path )` | `wp_localize_script( $handle, $object_name, $data )` |
| **Logic** | Loads a `.json` file based on MD5 of script path | Injects a JS object directly into the HTML page |
| **Standard** | Official for Gutenberg Blocks | Traditional but still the industry standard for complexity |
| **Developer Experience** | Frustrating (Silent failures, hash mismatch) | High (Reliable, easy to debug in console) |
| **Loco Translate** | Unreliable (Requires specific file references) | **Perfect (Works like standard PHP translations)** |

---

## ❌ Why Method 1 (Modern) Often Fails
Method 1 relies on a specific JSON file naming convention: `${domain}-${locale}-${md5_hash}.json`.
1.  **MD5 Sensitivity**: The hash is calculated from the *relative* path of the registered script. Moving files between `src/` and `dist/` breaks the hash.
2.  **JSON Generation**: Tools like Loco Translate or `wp i18n make-json` require explicit file references in the `.po` file. If a script isn't referenced exactly, the JSON won't be generated.
3.  **Silent Deaths**: If the hash or path is wrong, WordPress doesn't show an error; it simply shows the original English string.

---

## ✅ Method 2: The "Hybrid" Pattern (Professional Choice)

This method wraps strings in PHP and "pushes" them to JS. It is the pattern used in high-traffic plugins like **EchoRewards** and **WP Dark Mode**.

### 1. The PHP Map (`includes/class-strings.php`)
Create a static class to manage all strings in one place.
```php
namespace MyPlugin;

class Strings {
    public static function get() {
        return [
            'settings_saved' => __( 'Settings successfully saved!', 'my-plugin' ),
            'error_saving'   => __( 'Something went wrong while saving.', 'my-plugin' ),
        ];
    }
}
```

### 2. The JS Bridge (Enqueue)
Pass the strings inside your enqueue hook.
```php
wp_localize_script( 'my-plugin-script', 'myPluginData', [
    'strings' => \MyPlugin\Strings::get(),
    'api_url' => rest_url( 'my-plugin/v1' ),
] );
```

### 3. Usage in React (Advanced Hook Pattern)

For modern React apps, a **Custom Hook** (as seen in **EchoRewards** evolved) is the best practice. It centralizes the string lookup and supports parameter interpolation.

#### 1. Create the Hook (`src/hooks/useTranslation.js`)
```javascript
import { useMemo } from 'react';

// Initialize from WordPress localized data
const config = window.my_plugin_admin_json || window.my_plugin_frontend_json || {};
const translations = config.strings || {};

export function useTranslation() {
    /**
     * Get translated string with optional interpolation
     * @param {string} key - Translation key
     * @param {object} params - { name: 'John' } for "Hello {name}"
     * @param {string} fallback - Optional fallback text
     */
    const t = useMemo(() => (key, params = {}, fallback = key) => {
        let text = translations[key] || fallback;

        if (Object.keys(params).length > 0) {
            Object.entries(params).forEach(([param, value]) => {
                text = text.replace(new RegExp(`{${param}}`, 'g'), value);
            });
        }
        return text;
    }, []);

    return { t };
}
```

#### 2. Usage in a Component
```javascript
import { useTranslation } from '../hooks/useTranslation';

const WelcomeBanner = ({ userName }) => {
    const { t } = useTranslation();

    return (
        <div className="banner">
            <h1>{ t('welcome_message', { name: userName }) }</h1>
            <p>{ t('info_text') }</p>
        </div>
    );
};
```

### 4. Usage in Vue (Advanced Composable Pattern)

For Vue 3 applications, the **Composable Pattern** (as seen in **FormyChat**) is superior to global properties because it provides better type inference, reactivity control, and easy parameter interpolation.

#### 1. Create the Composable (`src/admin/composables/useTranslation.js`)
```javascript
import { reactive, readonly } from 'vue';

// Initialize from WordPress localized data
const translations = reactive(
    window.my_plugin_admin_json?.strings || {}
);

export function useTranslation() {
    /**
     * Get translated string with optional interpolation
     * @param {string} key - Translation key
     * @param {object} params - { name: 'John' } for "Hello {name}"
     * @param {string} fallback - Optional fallback text
     */
    const t = (key, params = {}, fallback = key) => {
        let text = translations[key] || fallback;

        if (Object.keys(params).length > 0) {
            Object.entries(params).forEach(([param, value]) => {
                text = text.replace(new RegExp(`{${param}}`, 'g'), value);
            });
        }
        return text;
    };

    return { t, translations: readonly(translations) };
}
```

#### 2. Usage in a Component
```html
<script setup>
import { useTranslation } from '@/composables/useTranslation';
const { t } = useTranslation();

const userName = 'Alice';
</script>

<template>
    <div>
        <h1>{{ t('welcome_message', { name: userName }) }}</h1>
        <button>{{ t('save_changes') }}</button>
    </div>
</template>
```

#### 3. Translatable Props & `defineProps` Hoisting (CRITICAL)

When using `<script setup>`, `defineProps` is **hoisted** outside the setup function. This means it **cannot** reference locally declared variables or composables like `t`.

**❌ THIS WILL FAIL (Build Error):**
```html
<script setup>
import { useTranslation } from '@/composables/useTranslation';
const { t } = useTranslation();

const props = defineProps({
    title: {
        type: String,
        default: () => t('default_title'), // ERROR: t is not defined (hoisted)
    }
});
</script>
```

**✅ SOLUTION: Use a Computed Property or Fallback**

The best practice is to accept an empty default in `defineProps` and handle the translation in a `computed` property or directly in the template.

```html
<script setup>
import { computed } from 'vue';
import { useTranslation } from '@/composables/useTranslation';
const { t } = useTranslation();

const props = defineProps({
    title: {
        type: String,
        default: '',
    }
});

// Handle the default translation reactively
const displayTitle = computed(() => props.title || t('default_title'));
</script>

<template>
    <h1>{{ displayTitle }}</h1>
</template>
```

---

## **The WPS-Suite Way**: We use Method 2 (Localize) for all high-complexity JS dashboards.

### Implementation Checklist:
1.  **PHP Architecture**: Create/Update `includes/class-strings.php` with a `get()` method.
2.  **Bridge**: Update the Enqueue class to include the `wp_localize_script` bridge.
3.  **Composable**: Add `useTranslation.js` to your Vue/React source.
4.  **Surgical Migration**: Replace hardcoded strings in components one-by-one following the `09_SAFE_I18N_MIGRATION.md` protocol.
