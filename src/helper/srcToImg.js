const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const util = require('util');

const writeFile = util.promisify(fs.writeFile);


module.exports = async (src, dir) => {
  if(/\.(jpg|png|gif)$/.test(src)) {
    await urlToImg(src, dir);
  } else {
    await base64ToImg(src, dir);
  }
};


// url => img
const urlToImg = util.promisify((url, dir, callback) => {
  const mod = /^https/.test(url) ? https : http;
  const ext = path.extname(url);
  const file = path.join(dir, `${Date.now()}${ext}`);
  mod.get(url, res => {
    res.pipe(fs.createWriteStream(file)).on('finish', () => {
      callback();
      console.log(file + '.1111');
    });
  });
});


//base64 => img
const base64ToImg = async (base64Str, dir) => {
  //data:image/jpeg;base64,/asdasda
  try {
    const matches = base64Str.match(/^data:(.+?);base64,(.+)$/);
    const ext = matches[1].split('/')[1].replace('jpeg', 'jpg');
    const file = path.join(dir, `${Date.now()}.${ext}`);
    await writeFile(file, matches[2], 'base64');
    console.log(file + '.2222');
  } catch(err) {
    console.log('error base64');
  }
};