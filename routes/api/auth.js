const express = require("express");
const { authController } = require("../../controllers");
const { authMiddleware } = require("../../middlewares");

const router = express.Router();

router.post(
  "/register",
  authMiddleware.checkRegisterUserData,
  authController.register
);

router.post("/login", authMiddleware.checkLoginUserData, authController.login);

router.use(authMiddleware.protect);

router.get("/current", authController.getUser);

router.post("/logout", authController.logout);

router.patch(
  "/",
  authMiddleware.checkSubscriptionBody,
  authController.updateSubscription
);

module.exports = router;
