const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = process.cwd();

const installInDir = (dirName) => {
  const targetDir = path.join(rootDir, dirName);
  
  if (!fs.existsSync(targetDir)) {
    console.log(`⚠️  Directory ${dirName} not found, skipping...`);
    return;
  }

  console.log(`\n📦 Installing dependencies in: ${dirName}...`);
  try {
    // We use shell: true to handle Windows command resolution better
    // and explicitly set the cwd (current working directory)
    execSync('npm install', { 
      cwd: targetDir, 
      stdio: 'inherit',
      shell: true 
    });
    console.log(`✅ ${dirName} dependencies installed.`);
  } catch (error) {
    console.error(`❌ Failed to install dependencies in ${dirName}.`);
    // We don't exit here to allow the env setup to potentially still run
  }
};

installInDir('server');
installInDir('client');
