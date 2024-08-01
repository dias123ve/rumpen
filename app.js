const db = require("./database");
const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const bodyParser = require("body-parser");
const fileupload = require("express-fileupload");
const path = require("path");

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(fileupload());
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(bodyParser.json({ limit: "250mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("online"));
app.use("/api/program", require("./router/router-program"));
app.use("/api/user", require("./router/router-auth"));
app.use("/api/program", require("./router/router-program"));
app.use("/api/user", require("./router/router-auth"));
app.use("/api/to", require("./router/router-to"));
app.use("/api/new_program", require("./router/router-new-program"));

//middleware
app.use(require("./middleware/error"));

db.on("error", console.log.bind(console, "databases connection error"));
db.on("open", () => {
  console.log("databases connection success");
  app.listen(4000, () => {
    console.log("express is running");
  });
});
