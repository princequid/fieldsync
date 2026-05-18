const express = require("express");
const router = express.Router();
const controller = require("../controllers/fieldController");

router.get("/", controller.getFields);
router.get("/:id", controller.getField);

module.exports = router;
