const express = require("express");
const es6Renderer = require("express-es6-template-engine");
const session = require("express-session");
const bodyParser = require("body-parser");
const serverRequest = require("./utils/server-request.js");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);
app.engine("html", es6Renderer);

app.set("views", __dirname + "/views");
app.set("view engine", "html");
app.set("view engine", "ejs");

// All the routes
app.get("/", serverRequest.homeRequest);
app.get("/log-in", serverRequest.logInRequests);
app.get("/log-out", serverRequest.logOutRequests);
app.post("/log-in", serverRequest.logInHandler);
app.get("/user", serverRequest.userIndexRequest);
app.post("/verify-user", serverRequest.verifyUser);
app.get("/whatIsState", serverRequest.whatIsState);

app.listen(3000, () => {
  console.log("Server is on .....");
});
