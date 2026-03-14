const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function runPhpcs(pluginPath, outputPath) {
    // Detect PSR-4
    const composerPath = path.join(pluginPath, 'composer.json');
    const srcPath = path.join(pluginPath, 'src');
    
    let isPsr4 = false;
    if (fs.existsSync(composerPath)) {
        const composer = JSON.parse(fs.readFileSync(composerPath, 'utf8'));
        if (composer.autoload && composer.autoload['psr-4']) {
            isPsr4 = true;
        }
    } else if (fs.existsSync(srcPath)) {
        isPsr4 = true;
    }

    let args = [
        '--standard=WordPress',
        '--ignore=vendor,node_modules',
        '--report=json',
        '-q',
        '--encoding=UTF-8',
        '.'
    ];

    if (isPsr4) {
        args.push('--exclude=WordPress.Files.FileName,WordPress.NamingConventions.ValidVariableName');
    }

    console.log('Running: phpcs ' + args.join(' '));

    const result = spawnSync('phpcs', args, {
        cwd: pluginPath,
        encoding: 'utf8',
        maxBuffer: 10 * 1024 * 1024 // 10MB
    });

    if (result.stdout) {
        fs.writeFileSync(outputPath, result.stdout);
        return true;
    }

    return false;
}

const pluginPath = process.argv[2] || '.';
const outputPath = process.argv[3] || './phpcs_full_report.json';

if (runPhpcs(pluginPath, outputPath)) {
    console.log('Successfully completed phpcs scan and saved to ' + outputPath);
} else {
    console.error('Error: Failed to run phpcs scan.');
    process.exit(1);
}
