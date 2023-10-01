const jwt = require("jsonwebtoken");

const { AppError } = require("../utils");

const blacklist = new Set();

exports.loginToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.checkToken = (token) => {
  if (!token) throw new AppError(401, "Not authorized");
  if (blacklist.has(token)) throw new AppError(401, "Not authorized");
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    return id;
  } catch (error) {
    throw new AppError(401, "Not authorized");
  }
};

exports.addToBlackList = (token) => blacklist.add(token);
