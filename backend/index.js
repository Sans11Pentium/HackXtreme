const connectToMongodb = require("./src/v1/services/mongoDB");
var winston = require("./src/v1/configs/winston");
const express = require("express");
const cors = require("cors");
const app = express();
const port = 4000;

//? Connect to MongoDB modules.
connectToMongodb();

//? Setting up logs.
var morgan = require("morgan");
app.use(cors());
app.use(express.json());
app.use(morgan("combined", { stream: winston.stream }));
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // add this line to include winston logging
  winston.error(
    `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
      req.method
    } - ${req.ip}`
  );

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

//? Import Routes.
const accountsRoutes = require("./src/v1/routes/accounts");
const palmRoutes = require("./src/v1/routes/PaLM");

//? Available routes.
app.use("/api/v1/accounts", accountsRoutes);
app.use("/api/v1/palm", palmRoutes);

app.listen(port, () => {
  console.log(`OptiSync is listening on port ${port}`);
});
