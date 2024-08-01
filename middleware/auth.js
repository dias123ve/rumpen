const jwt = require("../verify");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    console.log(req.headers);
    if (!token)
      return res.status(401).json({ error: false, message: "Token not Found" });

    const verifyToken = jwt(token);
    req.user = verifyToken;
    next();
  } catch (error) {
    if (error.message === "Token has expired") {
      return res
        .status(401)
        .json({ error: true, message: "Token has expired" });
    } else if (error.message === "Invalid Token") {
      return res.status(401).json({ error: true, message: "Invalid Token" });
    } else {
      console.log(error);
      return res
        .status(500)
        .json({ error: true, message: "Token verification failed" });
    }
  }
};
