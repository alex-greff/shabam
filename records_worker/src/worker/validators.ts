import { check } from "express-validator";

export const search_address_db = [
    check("addressDbNum").optional().isInt(),
    check("windowAmount").isInt(),
    check("partitionAmount").isInt()
];

export const add_track_addresses = [
    check("addressDbNums").optional().isArray(),
    // check("addressDbNums.*").isInt().optional(),
    check("trackId").isInt(),
    check("windowAmount").isInt(),
    check("partitionAmount").isInt()
];

export const delete_track_addresses = [
    check("addressDbNums").optional().isArray(),
    // check("addressDbNums.*").isInt().optional(),
    check("trackId").isInt()
];

export const get_address_database = [
    check("addressDbNums").optional().isArray(),
    check("trackId").isInt()
]