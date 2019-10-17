import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
// const { validationResult } = require("express-validator");

export default (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    next();
};