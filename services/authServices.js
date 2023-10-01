const User = require("../models/usersModel");
const { AppError } = require("../utils");
const { loginToken } = require("./jwtServices");

exports.getUserById = (id) => User.findById(id);

exports.checkUserExists = async (filter) => {
  const contactExists = await User.exists(filter);

  if (contactExists) throw new AppError(409, "Email in use");
};

exports.checkUserExistsLogin = async (filter) => {
  const contactExists = await User.exists(filter);

  if (!contactExists) throw new AppError(401, "Email or password is wrong");
};

exports.createUser = async (userData) => {
  const newUser = await User.create(userData);

  const { _id, password, ...newUserWithoutId } = newUser.toObject();

  return newUserWithoutId;
};

exports.loginUser = async (userData) => {
  const user = await User.findOne({ email: userData.email });
  const isPasswordCorrect = await user.checkPassword(
    userData.password,
    user.password
  );

  if (!isPasswordCorrect) throw new AppError(401, "Email or password is wrong");

  const { _id, password, ...userWithoutId } = user.toObject();

  const token = loginToken(user.id);

  return { token, userWithoutId };
};

exports.updateUserSubscription = (id, subscription) =>
  User.findByIdAndUpdate(id, { subscription }, { new: true });
