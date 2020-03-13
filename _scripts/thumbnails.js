const { resolve } = require('path');
const { readdir } = require('fs').promises;
const imageThumbnail = require('image-thumbnail');
const fs = require('fs').promises;

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
        return string.endsWith(suffix);
    });
}

async function resizeFiles(dirs) {
  for(dir in dirs) {
    let _dir = dirs[dir];
    const files = await getFiles(_dir)
      for(file in files) {
          let path = files[file];
          if(endsWithAny(['.png', '.jpg', 'jpeg'], path) && !path.endsWith('_thumb.jpg')) {
            console.log(path)
            

            try {
                let options = { percentage: 50, jpegOptions: 75 }
                const thumbnail = await imageThumbnail(path, options);
                fs.writeFile(path + "_thumb.jpg", thumbnail,  "binary").then(() => {
                        
                }).catch(er => {
                    console.log(er);
                  });
            } catch (err) {
                console.error(err);
            }
          }
      }
    }
  }

//resizeFiles()
resizeFiles([__dirname + "/../assets/images/blog", __dirname + "/../assets/images/portfolio"])