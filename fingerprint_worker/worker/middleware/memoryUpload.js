const multer = require("multer");

module.exports = (i_oFileFields, ...i_aMimeTypes) => {
    const storage = multer.memoryStorage();

    const fileFilter = (req, file, cb) => {
        // Auto accept if no mimetypes were provided
        if (i_aMimeTypes.length <= 0) {
            return cb(null, true); 
        }

        // Accept if file mimetype matches one of the provided mimetypes
        if (i_aMimeTypes.includes(file.mimetype)) {
            return cb(null, true);
        }

        // Reject
        return cb(null, false); 
    };

    const upload = multer({
        storage, 
        limits: {
            fileSize: 50000000 // 50 mb
        },
        fileFilter
    });

    return upload.fields(i_oFileFields);
};