import fs from "fs";
import { Request, Response, NextFunction } from "express";

// const testAddon = require("../build/Release/testaddon.node");

export const generate_fingerprint = (req: Request, res: Response, next: NextFunction) => {
    // console.log("TEST ADDON", testAddon);

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const audioFile = files.audioFile[0];

    // TODO: implement
    console.log("AUDIO FILE", audioFile);

    // Write to temp file
    try {
        // NOTE: make sure "temp" directory exists
        const writeStream = fs.createWriteStream("./temp/test.wav");
        writeStream.write(audioFile.buffer);
        writeStream.end();

        console.log("DONE!");
    } catch(err) {
        console.log("ERROR", err);
    }

    // Send response
    res.status(200).json({ fingerprint: {"some":"json data"} });
}