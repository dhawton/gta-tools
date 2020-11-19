const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const origDir = path.resolve(__dirname, "img");
const resizedDir = path.resolve(__dirname, "resized-img");

if (!fs.existsSync(resizedDir)) {
  fs.mkdirSync(resizedDir);
}

const images = [];
let dir = fs.readdirSync(origDir);

for (const idx in dir) {
  const file = dir[idx];
  if (fs.lstatSync(path.resolve(origDir, file)).isFile()) {
    images.push(file);
  }
}

const resize = (file) => {
  return new Promise((resolve, reject) => {
    sharp(path.resolve(origDir, file))
    .resize({ width: 512 })
    .toFile(path.resolve(resizedDir, file))
    .then(() => {
      console.log(`Resized ${file}`);
      resolve(true);
    }).catch((err) => {
      console.error(`Error resizing ${file}: ${err}`);
      reject(err);
    });
  });
}

Promise.all(
  images.map(v => resize(v))
).then(() => {
  console.log("Complete");
}).catch((err) => {
  console.error(`Error: ${err}`);
});
