const dbQueries = require("./dbQueries.js");

const homeRequest = (req, res) => {
  res.render("index.html");
};

const logInRequests = (req, res) => {
  if (req.session.isUserLoggedIn) {
    res.redirect("/user");
  }
  res.render("log-in", { status: true, register: true });
};

const logInHandler = async (req, res) => {
  if (req.body["log-in-button"]) {
    const user = await dbQueries.checkForUser(
      req.body.username,
      req.body.password
    );
    if (user) {
      req.session.isUserLoggedIn = true;
      req.session.userId = req.body.username;
      res.redirect("/user");
    } else res.render("log-in", { status: false, register: true });
  } else if (req.body["register-button"]) {
    const result = await dbQueries.createUser(
      req.body.username,
      req.body.ministryNumber,
      req.body.password
    );
    if (result.Error) {
      res.render("log-in", { status: true, register: false });
    } else {
      req.session.isUserLoggedIn = true;
      req.session.userId = req.body.username;
      res.redirect("/user");
    }
  }
};

const logOutRequests = (req, res) => {
  req.session.isUserLoggedIn = false;
  res.redirect('user')
}

const userIndexRequest = async (req, res) => {
  if (req.session.isUserLoggedIn) {
    const user = await dbQueries.getUser(req.session.userId);
    res.render("userIndex", { voucherPayed: user.isPayed });
  } else {
    res.render("log-in", { status: true, register: true });
  }
};

const verifyUser = async (req, res) => {
  if (req.session.isUserLoggedIn) {
    const verification = await dbQueries.checkForVoucher(
      req.session.userId,
      req.body.voucher
    );
    res.redirect("/user");
  } else {
    res.redirect("log-in");
  }
};

const whatIsState = async (req, res) => {
  if (req.session.isUserLoggedIn) {
    const points = await dbQueries.getPoints(req.session.userId);
    res.render("whatsIsMyStatus", { point: `${points}` });
  } else {
    res.redirect("log-in");
  }
};

setInterval(() => {
  dbQueries.checkForPoints();
}, 84600);

module.exports = {
  homeRequest,
  logInHandler,
  logInRequests,
  userIndexRequest,
  verifyUser,
  whatIsState,
  logOutRequests
};
