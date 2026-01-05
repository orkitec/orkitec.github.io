const { resolve } = require('path');
const { readdir } = require('fs').promises;
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

async function resizeFiles(dirs) {
  for (const dir of dirs) {
    const files = await getFiles(dir);
    for (const path of files) {
      if (endsWithAny(['.png', '.jpg', '.jpeg'], path) && !path.endsWith('_thumb.jpg')) {
        const thumbPath = path + '_thumb.jpg';

        // Skip if thumbnail already exists
        if (fs.existsSync(thumbPath)) {
          continue;
        }

        console.log(path);

        try {
          await sharp(path)
            .resize({ width: null, height: null, withoutEnlargement: true })
            .resize({ percentage: 50 })
            .metadata()
            .then(async (metadata) => {
              await sharp(path)
                .resize(Math.round(metadata.width / 2), Math.round(metadata.height / 2))
                .jpeg({ quality: 75 })
                .toFile(thumbPath);
            });
        } catch (err) {
          console.error(`Error processing ${path}:`, err.message);
        }
      }
    }
  }
}

resizeFiles([__dirname + '/../assets/images/blog', __dirname + '/../assets/images/portfolio']);
