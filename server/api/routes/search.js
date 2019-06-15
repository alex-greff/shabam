const express = require("express");
const router = express.router();
const permit = require("../middleware/permission");

const SearchController = require("../controllers/search");

// TODO: setup multer upload for audio blob

// ----------------
// --- Requests ---
// ----------------

// TODO: make endpoints

// [domain]/api/search : POST
