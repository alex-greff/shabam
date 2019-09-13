const express = require("express");
const router = express.Router();
const upload = require("./middleware/memoryUpload");
const validateResult = require("./middleware/validateResult");

const RootValidator = require("./validators");
const RootController = require("./controllers");

// ----------------
// --- Requests ---
// ----------------

// [domain]/identification_worker/search_address_db : GET
router.get("/search_address_db", RootValidator.search_address_db, validateResult, RootController.search_address_db);

module.exports = router;