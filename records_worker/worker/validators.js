const { check } = require("express-validator");

exports.search_address_db = [
    check("addressDbNum").isInt(),
];