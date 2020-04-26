import { check } from "express-validator";

export const identify_fingerprint = [
    check("windowAmount").isInt(),
    check("partitionAmount").isInt()
];