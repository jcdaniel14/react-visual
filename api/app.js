//- Node Modules
const express = require("express");
const session = require("cookie-session");
const compression = require("compression");
const cors = require("cors");
//- Modular Routing
const apiRouter = require("./routes/api/route");

//- Error Handling
const AppError = require("./utils/appError");
const globalError = require("./controllers/error");

//- Middlewares
const app = express();
app.use(express.json());
app.use(compression());
app.use(require("connect-history-api-fallback")());
app.use(
  session({ secret: "secretkey", resave: false, saveUninitialized: true })
);

//- CORS
app.use(
  cors({
    allowedHeaders:
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  })
);
app.options(
  "*",
  cors({
    allowedHeaders:
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  })
);

//- Static Public File Serve (VueJS)
app.use(express.static(`${__dirname}/public`));
//- APIs
app.use("/api", apiRouter);

app.all("*", (req, res, next) => {
  console.log("Unknown URL");
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

//- Global error handling
app.use(globalError);

module.exports = app;
