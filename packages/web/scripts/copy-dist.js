const fs = require('fs');
const path = require('path');

/**
 * 递归复制目录
 */
function copyDir(src, dest) {
  // 创建目标目录
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // 读取源目录
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
 * 主函数
 */
function main() {
  const serverDist = path.resolve(__dirname, '../../server/views');
  const indexDist = path.resolve(__dirname, '../../index/public/terminal');

  console.log('📦 Copying build output...');
  console.log(`   From: ${serverDist}`);
  console.log(`   To:   ${indexDist}`);

  try {
    // 检查源目录是否存在
    if (!fs.existsSync(serverDist)) {
      console.error('❌ Error: Build output not found at', serverDist);
      process.exit(1);
    }

    // 复制构建产物
    copyDir(serverDist, indexDist);

    console.log('✅ Build output copied successfully!');
  } catch (error) {
    console.error('❌ Error copying build output:', error);
    process.exit(1);
  }
}

main();
