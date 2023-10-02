const { catchAsync } = require("../utils");
const {
  createUser,
  loginUser,
  updateUserSubscription,
} = require("../services/authServices");
const { addToBlackList } = require("../services/jwtServices");

exports.register = catchAsync(async (req, res) => {
  const newUser = await createUser(req.body);
  res.status(201).json({user:newUser});
});

exports.login = catchAsync(async (req, res) => {
  const currentUser = await loginUser(req.body);
  res.status(201).json(currentUser);
});

exports.getUser = catchAsync(async (req, res) => {
  const { _id, ...userWithoutId } = req.user.toObject();
  res.status(200).json(userWithoutId);
});

exports.logout = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  addToBlackList(token);
  res.status(204).send();
};

exports.updateSubscription = catchAsync(async (req, res) => {
  const { subscription } = req.body;
  const updatedUser = await updateUserSubscription(req.user, subscription);
  res.status(200).json(updatedUser);
});
