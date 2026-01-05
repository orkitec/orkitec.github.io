const { resolve, relative, dirname, basename } = require('path');
const { readdir, mkdir } = require('fs').promises;
const sharp = require('sharp');
const fs = require('fs');

async function getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map((dirent) => {
    const res = resolve(dir, dirent.name);
    return dirent.isDirectory() ? getFiles(res) : res;
  }));
  return Array.prototype.concat(...files);
}

function endsWithAny(suffixes, string) {
  return suffixes.some(function (suffix) {
    return string.toLowerCase().endsWith(suffix);
  });
}

async function convertToWebp(baseDir) {
  const files = await getFiles(baseDir);
  const outputDir = resolve(__dirname, '../assets/webp');

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    await mkdir(outputDir, { recursive: true });
  }

  for (const path of files) {
    if (endsWithAny(['.png', '.jpg', '.jpeg'], path)) {
      const relativePath = relative(baseDir, path);
      const outputName = basename(relativePath).replace(/\.(png|jpe?g)$/i, '.webp');
      const outputPath = resolve(outputDir, outputName);

      console.log(path);

      try {
        await sharp(path)
          .webp({ quality: 65 })
          .toFile(outputPath);
      } catch (err) {
        console.error(`Error processing ${path}:`, err.message);
      }
    }
  }
}

convertToWebp(resolve(__dirname, '../assets/images'));
