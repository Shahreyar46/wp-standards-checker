const fs = require('fs');
const path = require('path');

// Usage: node report-generator.js <json-report-path> <plugin-name> <output-folder>
const jsonPath = process.argv[2];
const pluginName = process.argv[3] || 'Plugin';
const reportFolder = process.argv[4] || './wp-standards-reports';

if (!jsonPath || !fs.existsSync(jsonPath)) {
    console.error('Error: Please provide a valid path to the phpcs JSON report.');
    process.exit(1);
}

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

let uniqueErrors = {};
let criticalBlockers = [];
let styleIssues = [];
let fileSummaries = [];

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
        
        // WP.ORG BLOCKERS: Even if these are "WARNINGS", they are BLOCKERS for submission
        const blockerSniffs = [
            'Security',
            'PreparedSQL',
            'CSRF',
            'XSS',
            'DirectDatabaseQuery',
            'SlowDBQuery',
            'NamingConventions',
            'Files.FileName',
            'WP.EnqueuedResource',
            'FileOperations',
            'FileSystem'
        ];

        const blockerKeywords = [
            'escape', 'nonce', 'abspath', 'direct access', 
            'cache', 'global', 'minified', 'sanitiz', 'stripslash'
        ];

        const isKnownBlockerSource = blockerSniffs.some(s => source.includes(s));
        const hasBlockerKeyword = blockerKeywords.some(k => msgLower.includes(k));

        // A blocker is either a PHPCS ERROR or a sensitive WARNING
        const isBlocker = (m.type === 'ERROR') || isKnownBlockerSource || hasBlockerKeyword;

        const entry = `- **[${source}]** \`${shortF}:${m.line}\` — ${m.message}`;

        if (isBlocker) {
            criticalBlockers.push(entry);
        } else {
            styleIssues.push(entry);
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

const mdHeader = `# 📄 Comprehensive Audit Report: ${pluginName}\n\n`;
const mdSummary = `## 📊 Summary
- **Total Errors**: ${data.totals.errors}
- **Total Warnings**: ${data.totals.warnings}
- **Total Fixable**: ${data.totals.fixable}
- **Blockers Identified**: ${criticalBlockers.length}
- **Style Issues Identified**: ${styleIssues.length}\n\n`;

const mdFiles = `### 📂 Top 20 Files with Most Issues
| File Path | Errors | Warnings |
| :--- | :--- | :--- |
${fileSummaries.slice(0, 20).map(f => `| ${f.name} | ${f.errors} | ${f.warnings} |`).join('\n')}\n\n`;

const mdTypes = `### 🛠️ Violation Breakdown (Top 50 Types)
| Error Code / Sniff | Occurrences |
| :--- | :--- |
${typeSummaryHtml}\n\n---\n\n`;

const mdBlockers = `## ❌ CRITICAL BLOCKERS (${criticalBlockers.length} Found)
*Note: Showing first 5000.*

${criticalBlockers.slice(0, 5000).join('\n')}\n\n---\n\n`;

const mdStyle = `## ⚠️ STYLE & MAINTENANCE (${styleIssues.length} Found)
*Note: Showing first 1000.*

${styleIssues.slice(0, 1000).join('\n')}\n\n---\n\n`;

const mdFooter = `*Note: For the full dataset, refer to the [phpcs_full_report.json](./phpcs_full_report.json) in this directory.*\n\nGenerated on: ${d}`;

// Generate AUDIT_REPORT.md
fs.writeFileSync(path.join(reportFolder, 'AUDIT_REPORT.md'), mdHeader + mdSummary + mdFiles + mdTypes + mdBlockers + mdStyle + mdFooter);

// Generate PCP_REPORT.md (All Blockers)
fs.writeFileSync(path.join(reportFolder, 'PCP_REPORT.md'), `# 🛡️ WP.org Blocker Audit (PCP Mode): ${pluginName}\n\n### ❌ CRITICAL BLOCKERS (${criticalBlockers.length} Found)\n${criticalBlockers.slice(0, 5000).join('\n')}\n\nGenerated on: ${d}`);

// Generate REVIEW_REPORT.md (All Blockers + Summaries for Review)
fs.writeFileSync(path.join(reportFolder, 'REVIEW_REPORT.md'), `# 🔍 WP.org Submission Review: ${pluginName}\n\n${mdSummary}${mdTypes}### 🛑 MANDATORY FIX LIST (${criticalBlockers.length} Issues)\n${criticalBlockers.slice(0, 5000).join('\n')}\n\nGenerated on: ${d}`);

console.log('All 3 reports (AUDIT, PCP, REVIEW) generated successfully. Found ' + criticalBlockers.length + ' blockers.');
