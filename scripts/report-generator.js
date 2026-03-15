const fs = require('fs');
const path = require('path');

// Usage: node report-generator.js <json-report-path> <plugin-name> <output-folder> [optional-extra-blockers-json-path]
const jsonPath = process.argv[2];
const pluginName = process.argv[3] || 'Plugin';
const reportFolder = process.argv[4] || './wp-standards-reports';
const extraBlockersPath = process.argv[5];

if (!jsonPath || !fs.existsSync(jsonPath)) {
    console.error('Error: Please provide a valid path to the phpcs JSON report.');
    process.exit(1);
}

const content = fs.readFileSync(jsonPath, 'utf8');
const data = JSON.parse(content.replace(/^\uFEFF/, ''));

let uniqueErrors = {};
let classABlockers = []; // Security
let classBBlockers = []; // Coexistence/Prefixes
let classCBlockers = []; // Compliance/Legal
let classDBlockers = []; // Technical Blockers (Minified, etc.)
let classEBlockers = []; // A11y
let classFBlockers = []; // Policy/UX
let styleIssues = [];
let fileSummaries = [];

// Load extra blockers if provided
if (extraBlockersPath && fs.existsSync(extraBlockersPath)) {
    try {
        const extraContent = fs.readFileSync(extraBlockersPath, 'utf8');
        const extraData = JSON.parse(extraContent.replace(/^\uFEFF/, ''));
        if (Array.isArray(extraData)) {
            extraData.forEach(eb => {
                const entry = `- **[AI.Detected.Blocker]** \`${eb.file}:${eb.line || 1}\` — ${eb.message}`;
                classABlockers.push(entry);
            });
        }
    } catch (e) {
        console.error('Failed to load extra blockers:', e);
    }
}

Object.keys(data.files).forEach(f => {
    const fileStats = data.files[f];
    const shortF = f.includes(path.sep) ? f.split(path.sep).slice(-2).join('/') : f.split('/').slice(-2).join('/');

    if (fileStats.errors > 0 || fileStats.warnings > 0) {
        fileSummaries.push({
            name: shortF,
            errors: fileStats.errors,
            warnings: fileStats.warnings
        });
    }

    fileStats.messages.forEach(m => {
        const source = m.source;
        if (!uniqueErrors[source]) {
            uniqueErrors[source] = {
                count: 0,
                example: '`' + shortF + ':' + m.line + '` — ' + m.message
            };
        }
        uniqueErrors[source].count++;

        const msgLower = m.message.toLowerCase();
        const suspectedPrefix = pluginName.replace(/[^a-zA-Z0-9]/g, '').substring(0, 3).toLowerCase(); // e.g., 'ech' from 'echo-rewards'

        // Categorize based on Knowledge/Rules
        // CLASS A: Security
        const isSecurity = source.includes('Security') || source.includes('PreparedSQL') || source.includes('CSRF') || source.includes('XSS') || source.includes('DirectDatabaseQuery') || source.includes('SlowDBQuery') || msgLower.includes('escape') || msgLower.includes('nonce') || msgLower.includes('abspath') || msgLower.includes('direct access');

        // Filename Check Logics (PSR-4 Support)
        const isFileNameViolation = source.includes('Files.FileName');
        const hasProperPrefix = shortF.toLowerCase().includes(suspectedPrefix) || shortF.includes('_') && shortF.split('_')[0].length >= 3;

        // CLASS B: Coexistence/Prefixing (Blockers)
        // If it's a filename error, but Has no prefix -> It's a prefix blocker.
        // If it's a naming convention error (ClassName, etc.) -> Check if it's prefix related.
        const isPrefixBlocker = source.includes('PrefixAllGlobals') || 
                               (isFileNameViolation && !hasProperPrefix) ||
                               (source.includes('NamingConventions.ValidFunctionName') && msgLower.includes('prefix'));

        const isCoexistence = source.includes('PrefixAllGlobals') || (source.includes('NamingConventions') && !source.includes('Files.FileName') && !source.includes('ValidVariableName') && !isFileNameViolation);

        // CLASS D: Technical (Minified, Enqueuing, etc.)
        const isTechnicalBlocker = source.includes('Internal.Tokenizer') || source.includes('WP.EnqueuedResource') || msgLower.includes('minified');

        // STYLE ISSUES
        // 1. Standard style (whitespace, yoda, comments)
        // 2. FileName violations IF they HAVE a prefix (PSR-4 compatible)
        // 3. Variable naming (local vars)
        const isStyleOnly = msgLower.includes('whitespace') || msgLower.includes('space') || msgLower.includes('yoda') || source.includes('Comment') || source.includes('Alignment') || (isFileNameViolation && hasProperPrefix) || source.includes('ValidVariableName');

        const entry = `- **[${source}]** \`${shortF}:${m.line}\` — ${m.message}`;

        if (isSecurity) {
            classABlockers.push(entry);
        } else if (isPrefixBlocker || isCoexistence) {
            classBBlockers.push(entry);
        } else if (isTechnicalBlocker) {
            classDBlockers.push(entry);
        } else if (isStyleOnly) {
            styleIssues.push(entry);
        } else {
            // General Errors become Technical Blockers by default if they are ERROR type
            if (m.type === 'ERROR') {
                classDBlockers.push(entry);
            } else {
                styleIssues.push(entry);
            }
        }
    });
});

if (!fs.existsSync(reportFolder)) {
    fs.mkdirSync(reportFolder, { recursive: true });
}

// Ensure the raw JSON is in the report folder
fs.copyFileSync(jsonPath, path.join(reportFolder, 'phpcs_full_report.json'));

// Sort file summaries by issues
fileSummaries.sort((a, b) => (b.errors + b.warnings) - (a.errors + a.warnings));

// Violation Breakdown
const sortedErrorTypes = Object.keys(uniqueErrors)
    .sort((a, b) => uniqueErrors[b].count - uniqueErrors[a].count)
    .slice(0, 50);

let typeSummaryHtml = sortedErrorTypes.map(type => `| ${type} | ${uniqueErrors[type].count} |`).join('\n');

const d = new Date().toISOString().split('T')[0];
const totalBlockersCount = classABlockers.length + classBBlockers.length + classCBlockers.length + classDBlockers.length + classEBlockers.length + classFBlockers.length;

const mdHeader = `# 📄 Comprehensive Audit Report: ${pluginName}\n\n`;
const mdSummary = `## 📊 Summary
- **Total PHPCS Errors**: ${data.totals.errors}
- **Total PHPCS Warnings**: ${data.totals.warnings}
- **Mandatory Blockers Identified**: ${totalBlockersCount}
- **Style/Maintenance Issues**: ${styleIssues.length}\n\n`;

const mdFiles = `### 📂 Top 20 Files with Most Issues
| File Path | Errors | Warnings |
| :--- | :--- | :--- |
${fileSummaries.slice(0, 20).map(f => `| ${f.name} | ${f.errors} | ${f.warnings} |`).join('\n')}\n\n`;

const mdTypes = `### 🛠️ Violation Breakdown (Top 50 Types)
| Error Code / Sniff | Occurrences |
| :--- | :--- |
${typeSummaryHtml}\n\n---\n\n`;

const renderBlockerList = (title, list) => list.length > 0 ? `### ${title}\n${list.join('\n')}\n\n` : '';

const mdBlockers = `## 🛑 MANDATORY FIX LIST (${totalBlockersCount} Found)\n` +
    renderBlockerList('Class A: Security Blockers', classABlockers) +
    renderBlockerList('Class B: Coexistence & Prefixing', classBBlockers) +
    renderBlockerList('Class C: Compliance & Legal', classCBlockers) +
    renderBlockerList('Class D: Technical Blockers', classDBlockers) +
    renderBlockerList('Class E: Accessibility', classEBlockers) +
    renderBlockerList('Class F: Policy & UX', classFBlockers) +
    `---\n\n`;

const mdStyle = `## ⚠️ STYLE & MAINTENANCE (${styleIssues.length} Found)\n` +
    `*Note: These issues (whitespace, formatting, docblocks) usually do NOT cause WP.org rejections but are recommended for clean code.*\n\n` +
    `${styleIssues.slice(0, 1000).join('\n')}\n\n---\n\n`;

const mdFooter = `*Note: For the full dataset, refer to the [phpcs_full_report.json](./phpcs_full_report.json) in this directory.*\n\nGenerated on: ${d}`;

// Generate AUDIT_REPORT.md
fs.writeFileSync(path.join(reportFolder, 'AUDIT_REPORT.md'), mdHeader + mdSummary + mdFiles + mdTypes + mdBlockers + mdStyle + mdFooter);

// Generate PCP_REPORT.md (All Blockers)
fs.writeFileSync(path.join(reportFolder, 'PCP_REPORT.md'), `# 🛡️ WP.org Blocker Audit (PCP Mode): ${pluginName}\n\n${mdBlockers}\n\nGenerated on: ${d}`);

// Generate REVIEW_REPORT.md (All Blockers + Summaries for Review)
fs.writeFileSync(path.join(reportFolder, 'REVIEW_REPORT.md'), `# 🔍 WP.org Submission Review: ${pluginName}\n\n${mdSummary}${mdTypes}${mdBlockers}\n\nGenerated on: ${d}`);

// Generate PHPCS_REPORT.md (All violations, file by file, detailed)
let phpcsMd = `# 🐘 Full PHPCS Detail Report: ${pluginName}\n\n*Note: This report lists every single violation found by PHPCS.* \n\n`;

Object.keys(data.files).forEach(f => {
    const fileStats = data.files[f];
    const shortF = f.includes(path.sep) ? f.split(path.sep).slice(-2).join('/') : f.split('/').slice(-2).join('/');
    
    if (fileStats.messages.length > 0) {
        phpcsMd += `### 📄 File: \`${shortF}\`\n`;
        phpcsMd += `| Line | Type | Message | Sniff |\n`;
        phpcsMd += `| :--- | :--- | :--- | :--- |\n`;
        fileStats.messages.forEach(m => {
            phpcsMd += `| ${m.line} | ${m.type} | ${m.message.replace(/\|/g, '\\|')} | \`${m.source}\` |\n`;
        });
        phpcsMd += `\n`;
    }
});

fs.writeFileSync(path.join(reportFolder, 'PHPCS_REPORT.md'), phpcsMd + `\nGenerated on: ${d}`);

console.log('All 4 reports (AUDIT, PCP, REVIEW, PHPCS) generated successfully. Found ' + totalBlockersCount + ' blockers across active guideline classes.');
