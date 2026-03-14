# ⚖️ WP.ORG POLICY: TRIALWARE, SaaS & PRIVACY
> Source: Official WordPress.org Detailed Plugin Guidelines (Update 2024/2025)

These rules are non-technical but cause immediate rejection or removal from the directory.

---

## 🚫 1. Trialware is NOT Permitted (Guideline 5)
- **Rule**: You cannot lock functionality inside the plugin that only becomes available after payment.
- **Rule**: You cannot disable functionality after a trial period or quota is met.
- **Forbidden**: "Sandbox-only" access to APIs (where the plugin is useless without a paid key).
- **Allowed**: Serving as an interface to a paid **SaaS** (see below), provided the plugin code itself stays fully functional.
- **Best Practice**: Use "Add-on" plugins if you want to sell premium features.

## ☁️ 2. Software as a Service (SaaS) (Guideline 6)
- **Allowed**: Plugins that connect to an external service (e.g., Video hosting, Cloud storage).
- **Rule**: The service must provide "functionality of substance" (it can't just be a license validator).
- **Forbidden**: Moving arbitrary code to a service just to bypass GPL or directory rules.
- **Requirement**: Must link to the service's **Terms of Use** in the `readme.txt`.

## 🔒 3. Tracking & User Privacy (Guideline 7 & WP.org Privacy Policy)
- **Rule**: **No tracking without explicit opt-in.**
- **GDPR Compliance**: All data collection MUST be GDPR compliant.
- **Data Minimization**: Collect information **only insofar as is necessary** to fulfill the specific feature.
- **Forbidden**: Automatically collecting email, site URL, or usage data on activation.
- **Forbidden**: Offloading assets (images/scripts) from your own server unless essential for a SaaS.
- **Requirement**: Clearly document what data is collected and how it's used in the `readme.txt`.
- **Requirement**: Privacy policy link in `readme.txt`.
- **Rule**: **No logging PII/Sensitive Data** to public or accessible log files (e.g., passwords, keys, user emails).

## 🚮 3.1 Data Subject Rights (Access & Erasure)
Plugins that store personally identifying information (PII) in custom tables or metadata SHOULD support WordPress core's privacy tools:
- **Requirement**: Support `wp_privacy_personal_data_exporters` hook.
- **Requirement**: Support `wp_privacy_personal_data_erasers` hook.
- **Rule**: Users must have the right to request a copy of their data or permanent deletion from the plugin's live systems.

## 🔗 4. External Links & "Powered By" (Guideline 10)

## 🔗 4. External Links & "Powered By" (Guideline 10)
- **Rule**: No credit links, "Powered by" footer links, or developer site links on the **front-end** by default.
- **Requirement**: Must be **opt-in only**. The user must check a box to show credits.
- **Limit**: Links can only appear on the public site with explicit permission.

## 🛑 5. Hijacking the Admin Experience (Guideline 11)
- **Rule**: Don't overwhelm the user with "nags" or alerts.
- **Requirement**: Admin notices MUST be dismissible.
- **Forbidden**: Re-showing a notice constantly if it doesn't affect critical site safety.
- **Advertising**: Avoid ads in the dashboard. If present, they must be extremely limited and never track referrals (Guideline 7).
- **Context**: Notices should ideally only appear on the plugin's own settings page, not sitewide.

## 📦 6. Executable Code via 3rd Parties (Guideline 8)
- **Forbidden**: You cannot use a 3rd party system to send executable code (JS, PHP) to the site.
- **Impact**: Using external APIs to fetch and `eval()` code is an instant ban.

---

## 📝 Checklist for AI Auditor
- [ ] Check for `Update URI` in header (Guideline 3).
- [ ] Check for `eval()`, `base64_decode` (Guideline 4).
- [ ] Check for local features locked behind a "Pro" key (Guideline 5).
- [ ] Check for sitewide admin notices that aren't dismissible (Guideline 11).
- [ ] Check for default-enabled "Powered by" links in frontend views (Guideline 10).
- [ ] Check for phone-home/telemetry without a splash screen/opt-in (Guideline 7).
