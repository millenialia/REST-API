const User = require("../models/usersModel");
const { AppError} = require("../utils");
const ImageServices = require("./imageServices");
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

  // const { _id, password, ...user } = newUser.toObject();


  return newUser;
};

exports.loginUser = async (userData) => {
  const userLogin = await User.findOne({ email: userData.email });
  const isPasswordCorrect = await userLogin.checkPassword(
    userData.password,
    userLogin.password
  );

  if (!isPasswordCorrect) throw new AppError(401, "Email or password is wrong");

  // const { _id, password, ...user } = userLogin.toObject();

  const token = loginToken(userLogin.id);

  return { token, userLogin };
};

exports.updateUserSubscription =  async (id, data) => {
const user = await User.findById(id);

  Object.keys(data).forEach((key) => {
    user[key] = data[key];
  });

  return user.save();
}


exports.updateUserAvatar = async (userData, id, file) => {
  const user = await User.findById(id);
  
  if (file) {
    user.avatarURL = await ImageServices.save(file, {})
  }

  
  Object.keys(userData).forEach((key) => {
    user[key] = userData[key];
  });

  return user.save();
}