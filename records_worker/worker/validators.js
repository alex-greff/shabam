const { check } = require("express-validator");

exports.search_address_db = [
    check("addressDbNum").optional().isInt(),
    check("windowAmount").isInt(),
    check("partitionAmount").isInt()
];

exports.add_track_addresses = [
    check("addressDbNums").optional().isArray(),
    // check("addressDbNums.*").isInt().optional(),
    check("trackId").isInt(),
    check("windowAmount").isInt(),
    check("partitionAmount").isInt()
];

exports.delete_track_addresses = [
    check("addressDbNums").optional().isArray(),
    // check("addressDbNums.*").isInt().optional(),
    check("trackId").isInt()
];

exports.get_address_database = [
    check("addressDbNums").optional().isArray(),
    check("trackId").isInt()
]