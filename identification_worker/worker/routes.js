const express = require("express");
const router = express.Router();
const upload = require("./middleware/memoryUpload");
const validateResult = require("./middleware/validateResult");

const RootValidator = require("./validators");
const RootController = require("./controllers");

// ----------------
// --- Requests ---
// ----------------

const fileFields = [
    { name: "fingerprint", maxCount: 1 }
];

// [domain]/identification_worker/identify_fingerprint : POST
router.post("/identify_fingerprint", upload(fileFields), RootValidator.identify_fingerprint, validateResult, RootController.identify_fingerprint);

module.exports = router;