const { check } = require("express-validator");

exports.search_address_db = [
    // check("addressDbNum").isInt(),
];

exports.add_track_addresses = [
    check("trackId").isInt()
];

exports.delete_track_addresses = [
    check("trackId").isInt()
];