const express = require("express");
const router = express.Router();
const upload = require("./middleware/memoryUpload");

const RootController = require("./controllers");

// ----------------
// --- Requests ---
// ----------------

const fileFields = [
    { name: "audioFile", maxCount: 1 }
];

// [domain]/fingerprint_worker/generate_fingerprint : POST
router.post("/generate_fingerprint", upload(fileFields, "audio/wav"), RootController.generate_fingerprint);

module.exports = router;