const Utilities = require("./utilities");

exports.identify_fingerprint = async (req, res, next) => {
    const fingerprintFile = req.files.fingerprint[0];
    const windowAmount = parseInt(req.body.windowAmount);
    const partitionAmount = parseInt(req.body.partitionAmount);

    console.log("FINGERPRINT", fingerprintFile);
    console.log("Window amount", windowAmount);
    console.log("Partition amount", partitionAmount);

    // const fingerprintBuffer = await Utilities.getFingerprintBuffer(fingerprintReadStream)
    const fingerprintBuffer = fingerprintFile.buffer;
    const fingerprintCondensedData = Utilities.getFingerprintData(fingerprintBuffer);
    const fingerprintData = Utilities.uncondenseFingerprintData(fingerprintCondensedData, windowAmount, partitionAmount);

    console.log("Condensed Fingerprint Data", fingerprintCondensedData);
    console.log("Fingerprint data", fingerprintData);

    // Send response
    res.status(200).json({ message: "TODO: implement"} );
}