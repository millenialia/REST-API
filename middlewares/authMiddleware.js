const { catchAsync, authValidators, AppError } = require("../utils");
const {
  checkUserExists,
  checkUserExistsLogin,
  getUserById,
  getUserByEmail,
} = require("../services/authServices");
const { checkToken } = require("../services/jwtServices");
const ImageServices = require('../services/imageServices');

exports.checkRegisterUserData = catchAsync(async (req, res, next) => {
  const { error, value } = authValidators.createUserDataValidator(req.body);

  if (error) {
    throw new AppError(400, error.message);
  }

  await checkUserExists({ email: value.email });

  req.body = value;
  next();
});

exports.checkLoginUserData = catchAsync(async (req, res, next) => {
  const { error, value } = authValidators.loginUserDataValidator(req.body);

  if (error) {
    throw new AppError(400, error.message);
  }

  await checkUserExistsLogin({ email: value.email });

  req.body = value;
  next();
});

exports.protectLogin = catchAsync(async (req, res, next) => {
  const currentUser = await getUserByEmail(req.body.email);
  if (!currentUser.verify) throw new AppError(401, "Not authorized");
  next();
});

exports.protect = catchAsync(async (req, res, next) => {
  const token =
    req.headers.authorization?.startsWith("Bearer") &&
    req.headers.authorization.split(" ")[1];
  const userId = checkToken(token);
  const currentUser = await getUserById(userId);
  if (!currentUser) throw new AppError(401, "Not authorized");
  currentUser.password = undefined;
  req.user = currentUser;
  next();
});

exports.checkSubscriptionBody = catchAsync(async (req, res, next) => {
  const { error, value } = authValidators.SubscriptionDataValidator(req.body);

  if (error) {
    throw new AppError(400, error.message);
  }

  req.body = value;
  next();
});

exports.checkVerifyBody = catchAsync(async (req, res, next) => {
  const { error, value } = authValidators.VerifyEmailValidator(req.body);

  if (error) {
    throw new AppError(400, error.message);
  }

  req.body = value;
  next();
});

exports.uploadUserAvatar = ImageServices.initUploadMiddleware('avatar')