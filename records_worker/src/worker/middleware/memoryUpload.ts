import { Request } from "express";
import multer, { FileFilterCallback, Field } from "multer";

export default (fileFields: Field[], ...mimeTypes: string[]) => {
    const storage = multer.memoryStorage();

    const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
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

    const upload = multer({
        storage, 
        limits: {
            fileSize: 50000000 // 50 mb
        },
        fileFilter
    });

    return upload.fields(fileFields);
};