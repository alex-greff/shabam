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

// [domain]/records_worker/search_address_db : GET
router.post("/search_address_db", 
    upload(fileFields), 
    RootValidator.search_address_db, 
    validateResult, 
    RootController.search_address_db
);

// [domain]/records_worker/add_track_addresses : POST
router.post("/add_track_addresses", 
    upload(fileFields), 
    RootValidator.add_track_addresses, 
    validateResult, 
    RootController.add_track_addresses
);

// [domain]/records_worker/delete_track_addresses : DELETE
router.delete("/delete_track_addresses", 
    upload(fileFields), 
    RootValidator.delete_track_addresses, 
    validateResult, 
    RootController.delete_track_addresses
);

module.exports = router;