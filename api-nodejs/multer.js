const multer = require('multer');
const path = require('path')
const fs = require('fs')
const axios = require('axios')

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileName =
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    cb(null, fileName);    
    req.on('aborted', () => {
      const fullFilePath = path.join('uploads', fileName);
      file.stream.on('end', () => {
        fs.unlink(fullFilePath, (err) => {
          if (err) {
            throw err;
          }
        });
      });
      file.stream.emit('end');
    })
  }
});


// Create the multer instance"
const upload = multer({ storage: storage, limits: { fileSize: 20971520 }}).single('file')

module.exports = upload;
