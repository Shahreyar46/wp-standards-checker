# 📋 THE 18 OFFICIAL WP.ORG GUIDELINES (COMPLETE MAPPING)
> Source: developer.wordpress.org/plugins/wordpress-org/detailed-plugin-guidelines/

This is the definitive checklist used by the WordPress Review Team.

---

### [1] GPL Compatibility
- **Rule**: Entire plugin must be GPLv2 or later (or compatible).
- **Check**: `License: GPL-2.0-or-later` in header. All 3rd party assets must be checked.

### [2] Developer Responsibility
- **Rule**: You are responsible for everything in the zip.
- **Check**: Verify licensing for all external libraries/images.

### [3] Stable Version
- **Rule**: The SVN trunk/tags must match the directory distribution.
- **Check**: Version parity between `readme.txt` and main PHP file.

### [4] Human Readable Code
- **Rule**: No obfuscation (p,a,c,k,e,r), minification-without-source, or mangle.
- **Forbidden**: Variable names like `$a123bc`.

### [5] Trialware
- **Rule**: No features locked behind a local payment/key.
- **Check**: Plugin must be fully functional without a Pro version.

### [6] Software as a Service (SaaS)
- **Rule**: Service must provide substance; plugin is just the interface.
- **Check**: Link to Terms of Use in `readme.txt`.

### [7] User Tracking
- **Rule**: Telemetry/Tracking must be **opt-in only**.
- **Check**: No data collection on activation.

### [8] No Executable Code via 3rd Party
- **Rule**: JS/CSS must be local (except fonts). No `eval()` from APIs.
- **Forbidden**: Iframes for admin UI (use APIs instead).

### [9] Nothing Illegal/Dishonest
- **Rule**: No SEO black-hat, fake reviews, or botnets.

### [10] Front-end Links & Credits
- **Rule**: "Powered by" links must be **opt-in** and default to OFF.

### [11] Handling the Admin Dashboard
- **Rule**: No persistent nags. Notices must be dismissible.

### [12] Readme Spam
- **Rule**: **Limit: 5 tags max.**
- **Check**: Disclosure of all affiliate links. No keyword stuffing.

### [13] Default Libraries
- **Rule**: Do NOT bundle core libraries.
- **Forbidden**: `jQuery`, `PHPMailer`, `PHPass`, `SimplePie`, `Atom Lib`.

### [14] Frequent Commits
- **Rule**: SVN is for releases, not development.

### [15] Version Increment
- **Rule**: Incremental version numbers for every update.

### [16] Complete Plugin at Submission
- **Rule**: Submitting a "placeholder" zip to reserve a name is banned.

### [17] Trademarks & Naming
- **Rule**: Slugs cannot begin with a trademarked term.
- **Correct**: `Plugin for Trademark`
- **Incorrect**: `Trademark Plugin`

### [18] Maintenance Reservation
- **Policy**: WordPress reserves the right to remove plugins or change code for safety.
