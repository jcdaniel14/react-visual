const express = require("express");
const multer = require("multer");
const { dirname } = require('path');
const appDir = dirname(require.main.filename);
const router = express.Router();
const ts = require("../../controllers/ts/ts");
const ml = require("../../controllers/ml/ml");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, `${appDir}/scripts/ml/files/upload/`);
    },
    filename: function(req, file, cb) {
        cb(null, "dataset_prueba.csv");
    }
});
const upload = multer({ storage: storage });

router.post("/getTimeSeries", ts.getTimeSeries);

router.post("/getFileStatus", ml.getFileStatus);
router.post("/uploadDataset", upload.single("dataset"), ml.uploadDataset);
router.post("/getHeatMap", ml.getHeatMap);
router.post("/getBoxPlotEE", ml.getBoxPlotEE);
router.post("/getBoxPlotT", ml.getBoxPlotT);
router.post("/getFacets", ml.getFacets);
router.post("/getPrediction", ml.getPrediction);

module.exports = router;
