// const multer = require('multer')
// const uuid = require('uuid').v4

const { catchAsync, authValidators, AppError } = require("../utils");
const {
  checkUserExists,
  checkUserExistsLogin,
  getUserById,
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

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cbk) => {
//     cbk(null, 'tmp')
//   },
//   filename: (req, file, cbk) => {
//     const extension = file.mimetype.split('/')[1]
//     cbk(null, `${req.user.id}-${uuid()}.${extension}`)
//   }
// })

// const multerFilter = (req, file, cbk) => {
//   if (file.mimetype.startsWith('image/')) {
//     cbk(null, true)
//   } else {
//     cbk(new AppError(400, 'Please upload images only.'), false)
//   }
// }

// exports.uploadUserAvatar = multer({
//   storage: multerStorage,
//   fileFilter: multerFilter,
//   limits: {
//     fileSize: 2 * 1024 * 1024
//   }
// }).single('avatar')

exports.uploadUserAvatar = ImageServices.initUploadMiddleware('avatar')