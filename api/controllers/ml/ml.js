const { dirname } = require('path');
const appDir = dirname(require.main.filename);
const { exec } = require("child_process");
const logger = require("../../logger/logger");

const executeScript = function (cmd, route, req, res, debug = false) {
  logger.info(cmd, { user: "fp", route: route });

  exec(cmd, (err, stdout, _stderr) => {
    if (err) logger.error(err, { user: "fp", route: route });
    const rs = JSON.parse(
      stdout.substring(stdout.indexOf("{"), stdout.length).trim()
    );
    if (debug) logger.info(rs, { user: "fp", route: route });
    res.status(200).json(rs);
  });
};

exports.getFileStatus = async function (req, res) {
  let cmd = `${appDir}/scripts/venv/Scripts/python ${appDir}/scripts/ml/get_file_status.py`;
  console.log(cmd);
  return executeScript(cmd, "getFileStatus", req, res);
};