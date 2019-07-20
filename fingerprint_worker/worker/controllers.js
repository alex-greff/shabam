const testAddon = require("../build/Release/testaddon.node");

exports.generate_fingerprint = (req, res, next) => {
    console.log("TEST ADDON", testAddon);

    // TODO: implement

    // Send response
    res.status(200).json({ fingerprint: {"some":"json data"} });
}