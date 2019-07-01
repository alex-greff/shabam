const express = require("express");
const router = express.Router();

const RootController = require("../controllers/root");

// ----------------
// --- Requests ---
// ----------------

// [domain]/fingerprint_worker : POST
router.post("/", RootController.generate_fingerprint);

module.exports = router;