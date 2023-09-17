
//npm i --save multer for image uploads (extract incoming files)
const multer = require('multer');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

//multer will extract an image in the post
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimeType];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    callback(null, "images")  //relative to server.js folder //backend/images for aws
  },
  filename: (req, file, callback) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimeType];
    callback(null, name + '-' + Date.now() + '.' + ext);
  }
});
//configuration for files with mime type validation export
module.exports = multer({storage: storage}).single('image');
