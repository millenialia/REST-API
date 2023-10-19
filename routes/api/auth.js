const express = require("express");
const { authController } = require("../../controllers");
const { authMiddleware } = require("../../middlewares");

const router = express.Router();

router.post(
  "/register",
  authMiddleware.checkRegisterUserData,
  authController.register
);

router.get("/verify/:verificationToken", authController.verifyToken)

router.post("/verify", authMiddleware.checkVerifyBody, authController.verifyEmail)

router.post("/login", authMiddleware.checkLoginUserData, authMiddleware.protectLogin, authController.login);

router.use(authMiddleware.protect);

router.get("/current", authController.getUser);
router.patch("/avatars", authMiddleware.uploadUserAvatar, authController.updateAvatar)

router.post("/logout", authController.logout);

router.patch(
  "/",
  authMiddleware.checkSubscriptionBody,
  authController.updateSubscription
);

module.exports = router;
