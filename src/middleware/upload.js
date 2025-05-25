const multer = require("multer");

// Set up storage for uploaded files
const storage = multer.memoryStorage();

// Define file filter to accept only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload only images.'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10 // 5MB max size
    },
    fileFilter: fileFilter
});

module.exports = upload; 