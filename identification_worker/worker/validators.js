const { check } = require("express-validator");

exports.identify_fingerprint = [
    check("windowAmount").isInt(),
    check("partitionAmount").isInt()
];