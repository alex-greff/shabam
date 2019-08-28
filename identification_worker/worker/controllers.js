exports.identify_fingerprint = (req, res, next) => {
    const fingerprint = req.files.fingerprint[0];
    const { windowAmount, partitionAmount } = req.body;

    console.log("FINGERPRINT", fingerprint);
    console.log("Window amount", windowAmount);
    console.log("Partition amount", partitionAmount);

    // Send response
    res.status(200).json({ message: "TODO: implement"} );
}