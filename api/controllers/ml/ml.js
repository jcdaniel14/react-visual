const { dirname } = require("path");
const appDir = dirname(require.main.filename);
const { exec } = require("child_process");
const logger = require("../../logger/logger");

const executeScript = function (cmd, route, req, res, debug = false) {
  exec(cmd, { maxBuffer: 1024 * 1024 * 10 }, (err, stdout, _stderr) => {
    if (err) logger.error(err, { user: "fp", route: route });
    const rs = JSON.parse(stdout.substring(stdout.indexOf("{"), stdout.length).trim());
    if (debug) logger.info(rs, { user: "fp", route: route });
    res.status(200).json(rs);
  });
};

exports.getFileStatus = async function (req, res) {
  console.log(req.body);
  let cmd = "";
  if (req.body.name)
    cmd = `${appDir}/scripts/venv/Scripts/python ${appDir}/scripts/ml/get_file_status.py --name "${req.body.name}"`;
  else cmd = `${appDir}/scripts/venv/Scripts/python ${appDir}/scripts/ml/get_file_status.py`;
  console.log(cmd);
  return executeScript(cmd, "getFileStatus", req, res, false);
};

exports.uploadDataset = function (req, res) {
  let cmd = `${appDir}/scripts/venv/Scripts/python ${appDir}/scripts/ml/prepare_upload.py`;
  console.log(cmd);
  return executeScript(cmd, "uploadDataset", req, res, false);
};

exports.getHeatMap = async function (req, res) {
  let cmd = `${appDir}/scripts/venv/Scripts/python ${appDir}/scripts/ml/get_heatmap.py`;
  return executeScript(cmd, "getHeatMap", req, res, false);
};

exports.getBoxPlotEE = async function (req, res) {
  let cmd = `${appDir}/scripts/venv/Scripts/python ${appDir}/scripts/ml/get_boxplots_ee.py`;
  return executeScript(cmd, "getBoxplotEE", req, res, false);
};

exports.getBoxPlotT = async function (req, res) {
  let cmd = `${appDir}/scripts/venv/Scripts/python ${appDir}/scripts/ml/get_boxplots_t.py`;
  return executeScript(cmd, "getBoxplotT", req, res, false);
};

exports.getBoxPlotHR = async function (req, res) {
  let cmd = `${appDir}/scripts/venv/Scripts/python ${appDir}/scripts/ml/get_boxplots_hr.py`;
  return executeScript(cmd, "getBoxplotHR", req, res, false);
};

exports.getBoxPlotV = async function (req, res) {
  let cmd = `${appDir}/scripts/venv/Scripts/python ${appDir}/scripts/ml/get_boxplots_v.py`;
  return executeScript(cmd, "getBoxplotV", req, res, false);
};


exports.getFacets = async function (req, res) {
  let cmd = `${appDir}/scripts/venv/Scripts/python ${appDir}/scripts/ml/get_facets.py`;
  return executeScript(cmd, "getFacets", req, res, false);
};

exports.getPrediction = async function (req, res) {
  //TODO cambiar virtualenvironment para CUDAs
  let cmd;
  if (req.body.uploaded)
    cmd = `${appDir}/scripts/venv/Scripts/python ${appDir}/scripts/ml/get_prediction.py --uploaded`;
  else cmd = `${appDir}/scripts/venv/Scripts/python ${appDir}/scripts/ml/get_prediction.py`;
  console.log(cmd);
  return executeScript(cmd, "getPrediction", req, res, false);
};

exports.getRawEE = async function (req, res) {
  let cmd = `${appDir}/scripts/venv/Scripts/python ${appDir}/scripts/ml/get_raw_ee.py`;
  return executeScript(cmd, "getRawEE", req, res, false);
};
