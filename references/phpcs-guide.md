# PHPCS + WPCS Quick Reference Guide

## Installation (Windows — Global)

```powershell
# 1. Install Composer (https://getcomposer.org/download/)
# 2. Add to PATH: %USERPROFILE%\AppData\Roaming\Composer\vendor\bin

# 3. Install WPCS globally
composer global config allow-plugins.dealerdirect/phpcodesniffer-composer-installer true
composer global require --dev wp-coding-standards/wpcs:"^3.0"

# 4. Verify
phpcs -i
# Should list: WordPress, WordPress-Core, WordPress-Docs, WordPress-Extra
```

## Running PHPCS

```powershell
# Basic audit (current machine — WordPress standard already configured)
phpcs --standard=WordPress --extensions=php --ignore=vendor,node_modules,assets,build,dist -p -s .

# Summary report only
phpcs --standard=WordPress --report=summary .

# Specific file or directory
phpcs --standard=WordPress src/Plugin.php
phpcs --standard=WordPress src/API/

# JSON report (for CI pipelines)
phpcs --standard=WordPress --report=json .

# With minimum WP version enforcement
phpcs --standard=WordPress --runtime-set minimum_wp_version 6.5 .

# Specific sniffs only
phpcs --standard=WordPress --sniffs=WordPress.Security .
phpcs --standard=WordPress --sniffs=WordPress.NamingConventions .
phpcs --standard=WordPress --sniffs=WordPress.DB.PreparedSQL .
phpcs --standard=WordPress --sniffs=WordPress.PHP.YodaConditions .
phpcs --standard=WordPress --sniffs=WordPress.WP.I18n .
```

## Auto-fixing with PHPCBF

```powershell
# Fix all auto-fixable issues
phpcbf --standard=WordPress --extensions=php --ignore=vendor,node_modules -p .

# Fix specific directory
phpcbf --standard=WordPress src/

# Fix specific sniff (e.g., tabs only)
phpcbf --standard=WordPress --sniffs=Generic.WhiteSpace.DisallowSpaceIndent .

# Fix comment punctuation
phpcbf --standard=WordPress --sniffs=Squiz.Commenting.InlineComment .
```

## VS Code Integration

`.vscode/settings.json`:
```json
{
  "phpcs.standard": "WordPress",
  "editor.insertSpaces": false,
  "editor.tabSize": 4,
  "editor.detectIndentation": false,
  "[php]": {
    "editor.insertSpaces": false,
    "editor.tabSize": 4
  }
}
```

## phpcs.xml Ruleset (for projects)

```xml
<?xml version="1.0"?>
<ruleset name="Plugin Standards">
    <description>WordPress Coding Standards for this plugin.</description>
    
    <!-- Scan PHP files only -->
    <arg name="extensions" value="php"/>
    
    <!-- Show progress and sniff codes -->
    <arg value="ps"/>
    
    <!-- Use WordPress standard -->
    <rule ref="WordPress"/>
    
    <!-- Set minimum WordPress version -->
    <config name="minimum_wp_version" value="6.5"/>
    
    <!-- Set text domain -->
    <rule ref="WordPress.WP.I18n">
        <properties>
            <property name="text_domain" type="array">
                <element value="your-plugin-slug"/>
            </property>
        </properties>
    </rule>
    
    <!-- Set plugin prefix -->
    <rule ref="WordPress.NamingConventions.PrefixAllGlobals">
        <properties>
            <property name="prefixes" type="array">
                <element value="yourplugin"/>
                <element value="YourPlugin"/>
                <element value="YOURPLUGIN"/>
            </property>
        </properties>
    </rule>
    
    <!-- PSR-4 class files — ignore filename conventions -->
    <rule ref="WordPress.Files.FileName">
        <properties>
            <property name="strict_class_file_names" value="false"/>
        </properties>
    </rule>
    
    <!-- Ignore vendor/build directories -->
    <exclude-pattern>*/vendor/*</exclude-pattern>
    <exclude-pattern>*/node_modules/*</exclude-pattern>
    <exclude-pattern>*/build/*</exclude-pattern>
    <exclude-pattern>*/dist/*</exclude-pattern>
    <exclude-pattern>*/assets/js/vendor/*</exclude-pattern>
</ruleset>
```

## Standards Available on This Machine

```
MySource, PEAR, PSR1, PSR2, PSR12, Squiz, Zend,
WordPress, WordPress-Core, WordPress-Docs, WordPress-Extra,
PHPCompatibility, PHPCompatibilityWP, PHPCSUtils,
Modernize, NormalizedArrays, Universal
```

## CI Integration Example

```yaml
# GitHub Actions
- name: Run PHPCS
  run: |
    phpcs --standard=WordPress \
          --extensions=php \
          --ignore=vendor,node_modules \
          --report=checkstyle \
          --runtime-set minimum_wp_version 6.5 \
          . | cs2pr
```

## Troubleshooting

```powershell
# Check installed standards
phpcs -i

# Check PHPCS version
phpcs --version

# Reinstall WPCS if missing
composer global remove wp-coding-standards/wpcs
composer global require --dev wp-coding-standards/wpcs:"^3.0"

# Performance: parallel processing
phpcs --parallel=8 --extensions=php .

# Increase memory limit
php -d memory_limit=512M (Get-Command phpcs).Source .
```

## References

- WPCS GitHub: https://github.com/WordPress/WordPress-Coding-Standards
- Customizable properties: https://github.com/WordPress/WordPress-Coding-Standards/wiki/Customizable-sniff-properties
- PHP_CodeSniffer: https://github.com/squizlabs/PHP_CodeSniffer
- WordPress Coding Standards: https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/
