const { exec } = require("child_process");
const logger = require("../../logger/logger");

const executeScript = function (cmd, route, req, res, debug = false) {
  logger.info(cmd, { user: req.body.uid, route: route });

  exec(cmd, (err, stdout, _stderr) => {
    if (err) logger.error(err, { user: req.body.uid, route: route });

    const rs = JSON.parse(
      stdout.substring(stdout.indexOf("{"), stdout.length).trim()
    );
    if (debug) logger.info(rs, { user: req.body.uid, route: route });
    res.status(200).json(rs);
  });
};

exports.getTimeSeries = function (req, res) {
  const ts = {
    ts: {
      data: [
        {
          x: [
            "2013-10-04 22:23:00",
            "2013-11-04 22:23:00",
            "2013-12-04 22:23:00",
          ],
          y: [1, 3, 6],
          type: "scatter",
        },
      ],
      layout: {
        width: 800,
        height: 400,
        title: "A Fancy Plot",
        paper_bgcolor: "#FEF7D8",
        plot_bgcolor: "#FEF7D8",
        font: { family: "Quicksand" },
      },
      config: { responsive: true },
    },
    ts2: {
      data: [
        {
          x: [
            "2013-10-04 22:23:00",
            "2013-11-04 22:23:00",
            "2013-12-04 22:23:00",
          ],
          y: [20, 1, 12],
          type: "scatter",
        },
      ],
      layout: {
        width: 800,
        height: 400,
        title: "A Fancy Plot",
        paper_bgcolor: "#FEF7D8",
        plot_bgcolor: "#FEF7D8",
        font: { family: "Quicksand" },
      },
      config: { responsive: true },
    },
    ts3: {
      data: [
        {
          x: [
            "2013-10-04 22:23:00",
            "2013-11-04 22:23:00",
            "2013-12-04 22:23:00",
          ],
          y: [15, 21, 10],
          type: "scatter",
        },
      ],
      layout: {
        width: 800,
        height: 400,
        title: "A Fancy Plot",
        paper_bgcolor: "#FEF7D8",
        plot_bgcolor: "#FEF7D8",
        font: { family: "Quicksand" },
      },
      config: { responsive: true },
    },
  };
  res.status(200).json(ts);
  // executeScript(cmd, "dns", req, res);
};
