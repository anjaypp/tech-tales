const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create uploads directory if it doesn't exist
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Save only the filename without the full path
        const uniqueFileName = Date.now() + path.extname(file.originalname);
        // Set the filename in request object so we can access it in the route handler
        req.uploadedFileName = uniqueFileName;
        cb(null, uniqueFileName);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = path.extname(file.originalname).toLowerCase();
        if (mimetype && filetypes.test(extname)) {
            cb(null, true);
        } else {
            cb(new Error('Not an image! Please upload a jpeg, jpg, or png image.'), false);
        }
    }
});

module.exports = upload;