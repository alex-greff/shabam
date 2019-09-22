const { check } = require("express-validator");

exports.search_address_db = [
    check("addressDbNum").optional().isInt(),
    check("windowSize").isInt(),
    check("partitionSize").isInt()
];

exports.add_track_addresses = [
    check("addressDbNums").optional().isArray(),
    // check("addressDbNums.*").isInt().optional(),
    check("trackId").isInt(),
    check("windowSize").isInt(),
    check("partitionSize").isInt()
];

exports.delete_track_addresses = [
    check("addressDbNums").optional().isArray(),
    // check("addressDbNums.*").isInt().optional(),
    check("trackId").isInt()
];