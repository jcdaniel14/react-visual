const path = require("path");
const { exec } = require("child_process");
const logger = require("../../logger/logger");
const csv = require("csvtojson");

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

const avg = function (array) {
  var total = 0;
  var count = 0;

  array.forEach(function (item, index) {
    total += item;
    count++;
  });

  return total / count;
};

const loadFromFile = async function (grouper) {
  let pathGRU = "";
  if (grouper == "day")
    pathGRU = `${process.env.BASEDIR}/static/output/prediccion_GRU_day.csv`;
  else if (grouper == "month")
    pathGRU = `${process.env.BASEDIR}/static/output/prediccion_GRU_month.csv`;
  else pathGRU = `${process.env.BASEDIR}/static/output/prediccion_GRU.csv`;
  const gru = await csv().fromFile(pathGRU);
  const x = gru.map((e) => {
    return e.tiempo;
  });
  const y = gru.map((e) => {
    return parseFloat(e.energia_activa);
  });
  const y_gru = gru.map((e) => {
    return parseFloat(e.prediction);
  });

  const path = `${process.env.BASEDIR}/static/output/med_principal_clean.csv`;
  const file = await csv().fromFile(path);
  const y2 = file.map((e) => {
    return e.energia_activa_sin_factor;
  });
  const y3 = file.map((e) => {
    return e.energia_rectiva;
  });
  const y4 = file.map((e) => {
    return e.energia_rectiva_sin_factor;
  });
  const y5 = file.map((e) => {
    return e.demanda_activa;
  });
  const y6 = file.map((e) => {
    return e.demanda_reactiva;
  });
  return { x, y, y_gru, y2, y3, y4, y5, y6 };
};

exports.getTimeSeries = async function (req, res) {
  const { x, y, y_gru, y2, y3, y4, y5, y6 } = await loadFromFile(
    req.body.grouper
  );
  console.log(req.body);
  const layout = {
    width: 1200,
    height: 375,
    margin: {
      l: 50,
      r: 50,
      b: 0,
      t: 10,
      pad: 1,
    },
    paper_bgcolor: "#fff",
    plot_bgcolor: "#fff",
    font: { family: "Quicksand" },
    showlegend: true,
    legend: { orientation: "h" },
    xaxis: {
      rangeselector: {
        buttons: [
          {
            count: 1,
            label: "1d",
            step: "day",
            stepmode: "backward",
          },
          {
            count: 1,
            label: "1m",
            step: "month",
            stepmode: "backward",
          },
          {
            count: 6,
            label: "6m",
            step: "month",
            stepmode: "backward",
          },
          { step: "all" },
        ],
      },
    },
    yaxis: { fixedrange: true },
  };

  const ts = {
    count: y.length,
    max: Math.max(...y).toFixed(1),
    mean: avg(y).toFixed(1),
    ts: {
      data: [
        {
          name: "kWh",
          x: x,
          y: y,
          type: "scatter",
        },
        {
          name: "kWh (GRU)",
          x: x,
          y: y_gru,
          type: "scatter",
          line: {
            dash: "dot",
          },
        },
      ],
      layout: layout,
      config: { responsive: true, scrollZoom: true, autoMargin: true },
    },
    ts2: {
      data: [
        {
          name: "kWh",
          x: x,
          y: y2,
          type: "scatter",
        },
      ],
      layout: layout,
      config: { responsive: true, scrollZoom: true, autoMargin: true },
    },
    ts3: {
      data: [
        {
          name: "kWh",
          x: x,
          y: y3,
          type: "scatter",
        },
      ],
      layout: layout,
      config: { responsive: true, scrollZoom: true, autoMargin: true },
    },
    ts4: {
      data: [
        {
          name: "kWh",
          x: x,
          y: y4,
          type: "scatter",
        },
      ],
      layout: layout,
      config: { responsive: true, scrollZoom: true, autoMargin: true },
    },
    ts5: {
      data: [
        {
          name: "kWh",
          x: x,
          y: y5,
          type: "scatter",
        },
      ],
      layout: layout,
      config: { responsive: true, scrollZoom: true, autoMargin: true },
    },
    ts6: {
      data: [
        {
          name: "kWh",
          x: x,
          y: y6,
          type: "scatter",
        },
      ],
      layout: layout,
      config: { responsive: true, scrollZoom: true, autoMargin: true },
    },
  };
  res.status(200).json(ts);
  // executeScript(cmd, "dns", req, res);
};
