const { check } = require("express-validator");

exports.identify_fingerprint = [
    check("windowSize").isInt(),
    check("partitionSize").isInt()
];