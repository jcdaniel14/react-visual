const express = require("express");
const router = express.Router();
const ts = require("../../controllers/ts/ts");
const ml = require("../../controllers/ml/ml");

router.post("/getTimeSeries", ts.getTimeSeries);
router.post("/getFileStatus", ml.getFileStatus);
// router.post("/getPredictedTS", ml.getPredictedTS);

module.exports = router;
