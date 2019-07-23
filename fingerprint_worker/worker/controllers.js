const fs = require("fs");

const testAddon = require("../build/Release/testaddon.node");

exports.generate_fingerprint = (req, res, next) => {
    console.log("TEST ADDON", testAddon);

    const audioFile = req.files.audioFile[0];

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