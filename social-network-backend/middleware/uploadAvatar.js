
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const avatarDir = path.join(__dirname, '..', 'uploads', 'avatars');


if (!fs.existsSync(avatarDir)) {
  fs.mkdirSync(avatarDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, avatarDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Ce type de fichier n\'est pas autorisé'), false);
  }
};

const uploadAvatar = multer({ storage, fileFilter });

module.exports = uploadAvatar;
