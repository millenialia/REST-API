const { catchAsync } = require("../utils");
const {
  createUser,
  loginUser,
  updateUserSubscription,
  updateUserAvatar,
  checkIfAvatarBody,
} = require("../services/authServices");
const { addToBlackList } = require("../services/jwtServices");

exports.register = catchAsync(async (req, res) => {
  const {email, subscription} = await createUser(req.body);
  res.status(201).json({user:{email, subscription}});
});

exports.login = catchAsync(async (req, res) => {
  const currentUser = await loginUser(req.body);
  const {token, userLogin:{email, subscription}} = currentUser
  res.status(201).json({token, user:{email,subscription}});
});

exports.getUser = catchAsync(async (req, res) => {
  const { email, subscription } = req.user.toObject();
  res.status(200).json({email, subscription});
});

exports.logout = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  addToBlackList(token);
  res.status(204).send();
};

exports.updateSubscription = catchAsync(async (req, res) => {
  const { email, subscription } = await updateUserSubscription(req.user, req.body);
  res.status(200).json({ email, subscription });
});

exports.updateAvatar = catchAsync(async (req, res) => {
  checkIfAvatarBody(req.file)
  const updatedUser = await updateUserAvatar(req.body, req.user.id, req.file)
  res.status(200).json({"avatarURL":updatedUser.avatarURL})
})
