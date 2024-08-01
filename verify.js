const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config;

module.exports = async function (token) {
  try {
    return jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    return new Error(error);
  }
};
