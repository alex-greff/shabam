import express from "express";
import upload from "@/worker/middleware/memoryUpload";
import validateResult from "@/worker/middleware/validateResult";
import { Field } from "multer";

import * as RootValidator from "./validators";
import * as RootController from "./controllers";

const router = express.Router();

// ----------------
// --- Requests ---
// ----------------

const fileFields: Field[] = [
    { name: "fingerprint", maxCount: 1 }
];

// [domain]/identification_worker/identify_fingerprint : POST
router.post("/identify_fingerprint", upload(fileFields), RootValidator.identify_fingerprint, validateResult, RootController.identify_fingerprint);

export default router;