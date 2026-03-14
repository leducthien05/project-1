const multer = require("multer");

module.exports.uploadStorage = () => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "public/admin/uploads/");
        },
        filename: function (req, file, cb) {
            const unique = Date.now() + "-" + file.originalname;
            cb(null, unique);
        }
    });

    return multer({ storage: storage });
};

