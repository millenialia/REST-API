const { catchAsync, AppError } = require("../utils");
const {
  createUser,
  loginUser,
  updateUserSubscription,
  updateUserAvatar,
  checkIfAvatarBody,
  checkVerificationToken,
  getUserByEmail,
} = require("../services/authServices");
const { sendVerificationEmail } = require("../services/emailServices")
const { addToBlackList } = require("../services/jwtServices");

exports.register = catchAsync(async (req, res) => {
  const { email, subscription, verificationToken } = await createUser(req.body);
  await sendVerificationEmail(email, verificationToken)
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

exports.verifyToken = catchAsync(async (req, res) => {
  const {verificationToken} = req.params
  await checkVerificationToken(verificationToken)
  res.status(200).json({message: 'Verification successful'})
})

exports.verifyEmail = catchAsync(async (req, res) => {
  const { email } = req.body
  const user = await getUserByEmail(email)

  if (!user || user.verify) throw new AppError(400, "Verification has already been passed")
  
  await sendVerificationEmail(email, user.verificationToken)
  res.status(200).json({message: 'Verification email sent'})
})