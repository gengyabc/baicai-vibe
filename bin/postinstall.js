const fs = require('fs');
const path = require('path');
const utils = require('./install-utils');
const ownedPaths = require('./owned-paths');

const pkgDir = utils.resolvePkgDir();
const installScope = utils.isGlobalInstall() ? 'global' : 'project';
const projectRoot = utils.resolveProjectRoot(pkgDir);

if (utils.isSelfInstall(pkgDir, projectRoot)) {
  console.log('baicai-vibe: local package mode, skipping postinstall copy');
  process.exit(0);
}

const targetDir = installScope === 'global' ? utils.resolveGlobalDir() : path.join(projectRoot, '.opencode');
const sourceDir = path.join(pkgDir, '.opencode');
const backupDir = utils.resolveBackupDir(targetDir);

async function main() {
  const lockPath = await utils.acquireLock(targetDir);

  try {
    const targetExists = utils.hasBaicaiVibeContent(targetDir);

    if (targetExists) {
      console.log('\nbaicai-vibe: Found existing baicai-vibe content');
      console.log('  Existing content will be backed up before overwrite.');
      console.log('');

      const answer = await utils.prompt('Continue? [y/N]: ');

      if (answer !== 'y' && answer !== 'yes') {
        console.log('baicai-vibe: Installation cancelled');
        return;
      }
    }

    fs.rmSync(backupDir, { recursive: true, force: true });
    if (utils.backupOwnedContent(targetDir, backupDir, ownedPaths)) {
      console.log(`✓ Backed up existing content to ${backupDir}`);
    }

    utils.removeOwnedContent(targetDir, ownedPaths);
    utils.syncDir(sourceDir, targetDir);

    console.log(`✓ baicai-vibe installed to ${targetDir}`);
  } finally {
    utils.releaseLock(lockPath);
  }
}

main().catch(err => {
  console.error('baicai-vibe postinstall error:', err.message);
  process.exit(1);
});
