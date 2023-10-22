const User = require("../models/usersModel");
const { AppError} = require("../utils");
const ImageServices = require("./imageServices");
const { loginToken } = require("./jwtServices");

exports.getUserById = (id) => User.findById(id);
exports.getUserByEmail = (email) => User.findOne({email});

exports.checkUserExists = async (filter) => {
  const userExists = await User.exists(filter);

  if (userExists) throw new AppError(409, "Email in use");
};

exports.checkUserExistsLogin = async (filter) => {
  const userExists = await User.exists(filter);

  if (!userExists) throw new AppError(401, "Email or password is wrong");
};

exports.createUser = async (userData) => {
  const newUser = await User.create(userData);
  return newUser;
};

exports.loginUser = async (userData) => {
  const userLogin = await User.findOne({ email: userData.email });
  const isPasswordCorrect = await userLogin.checkPassword(
    userData.password,
    userLogin.password
  );

  if (!isPasswordCorrect) throw new AppError(401, "Email or password is wrong");

  const token = loginToken(userLogin.id);

  return { token, userLogin };
};

exports.checkVerificationToken = async (verificationToken) => {
  const user = await User.findOne({ verificationToken });

  if (!user) throw new AppError(404, "User not found!");

  user.verify = true;
  user.verificationToken = null
  await user.save()
}

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

exports.checkIfAvatarBody = (data) => {
  if (!data) throw new AppError(400, 'No image provided')
}