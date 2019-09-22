const { check } = require("express-validator");

exports.search_address_db = [
    // check("addressDbNum").isInt(),
    check("windowSize").isInt(),
    check("partitionSize").isInt()
];

exports.add_track_addresses = [
    // check("addressDbNum").isArray(),
    check("trackId").isInt(),
    check("windowSize").isInt(),
    check("partitionSize").isInt()
];

exports.delete_track_addresses = [
    // check("addressDbNum").isArray(),
    check("trackId").isInt()
];