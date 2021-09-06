const express = require("express");
const router = express.Router();
const ts = require("../../controllers/ts/ts");

router.post("/getTimeSeries", ts.getTimeSeries);

module.exports = router;
