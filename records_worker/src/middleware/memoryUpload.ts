import { Request, Response, NextFunction, RequestHandler } from "express";
import multer, { Field, Options, Instance } from "multer";
// const multer = require("multer");

interface MulterCallback {
    (error: Error | null, acceptFile: boolean): void
}

export default (fileFields: Field[], ...mimeTypes: String[]): RequestHandler => {
    const storage = multer.memoryStorage();

    const fileFilter = (req: Request, file: Express.Multer.File, cb: MulterCallback) => {
        // Auto accept if no mimetypes were provided
        if (mimeTypes.length <= 0) {
            return cb(null, true); 
        }

        // Accept if file mimetype matches one of the provided mimetypes
        if (mimeTypes.includes(file.mimetype)) {
            return cb(null, true);
        }

        // Reject
        return cb(null, false); 
    };

    const options: Options = {
        storage, 
        limits: {
            fileSize: 50000000 // 50 mb
        },
        fileFilter
    };

    const upload: Instance = multer(options);

    return upload.fields(fileFields);
};