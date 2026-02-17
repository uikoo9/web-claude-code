const fs = require('fs');
const path = require('path');

/**
 * Recursively copy a directory
 */
function copyDir(src, dest) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Read source directory
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Main function
 */
function main() {
  const serverDist = path.resolve(__dirname, '../../server/views');
  const indexDist = path.resolve(__dirname, '../../index/public/terminal');

  console.log('📦 Copying build output...');
  console.log(`   From: ${serverDist}`);
  console.log(`   To:   ${indexDist}`);

  try {
    // Check if source directory exists
    if (!fs.existsSync(serverDist)) {
      console.error('❌ Error: Build output not found at', serverDist);
      process.exit(1);
    }

    // Copy build output
    copyDir(serverDist, indexDist);

    console.log('✅ Build output copied successfully!');
  } catch (error) {
    console.error('❌ Error copying build output:', error);
    process.exit(1);
  }
}

main();
