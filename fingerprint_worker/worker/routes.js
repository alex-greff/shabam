const express = require("express");
const router = express.Router();

const RootController = require("./controllers");

// ----------------
// --- Requests ---
// ----------------

// [domain]/fingerprint_worker/generate_fingerprint : POST
router.post("/generate_fingerprint", RootController.generate_fingerprint);

module.exports = router;