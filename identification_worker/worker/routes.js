const express = require("express");
const router = express.Router();

const RootController = require("./controllers");

// ----------------
// --- Requests ---
// ----------------

// [domain]/identification_worker/match_snippet : POST
router.post("/match_snippet", RootController.match_snippet);

module.exports = router;