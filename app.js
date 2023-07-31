var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const nunjucks = require("nunjucks");
var cors = require("cors");
var txRoutes = require("./routes/txRoutes");
var googleApiRoutes = require("./routes/googleApiRoutes");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "njk");
nunjucks.configure("views", {
  express: app,
  watch: true,
});

// json parsing -- router 보다 먼저 실행되어야한다.
app.use(express.json());

// form data 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// custom settigs
app.use(cors());
app.use(express.static('./public'));

app.use("/", txRoutes);
app.use("/api/tx", txRoutes);
app.use("/api/google", googleApiRoutes);

// basic settings
app.use(logger("dev"));




app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
