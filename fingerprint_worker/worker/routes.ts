import express from "express";
import upload from "@/worker/middleware/memoryUpload";

import * as RootController from "./controllers";

const router = express.Router();

// ----------------
// --- Requests ---
// ----------------

const fileFields = [
    { name: "audioFile", maxCount: 1 }
];

// [domain]/fingerprint_worker/generate_fingerprint : POST
router.post("/generate_fingerprint", upload(fileFields), RootController.generate_fingerprint);

// "audio/wav"

export default router;