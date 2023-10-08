const express = require("express");
const { contactsController } = require("../../controllers");
const { authMiddleware, contactsMiddleware } = require("../../middlewares");

const router = express.Router();

router.use(authMiddleware.protect);

router.get("/", contactsController.listContacts);

router.post(
  "/",
  contactsMiddleware.checkCreateContactData,
  contactsController.addContact
);

router.get(
  "/:contactId",
  contactsMiddleware.checkContactId,
  contactsController.getContactById
);

router.delete(
  "/:contactId",
  contactsMiddleware.checkContactId,
  contactsController.removeContact
);

router.put(
  "/:contactId",
  contactsMiddleware.checkContactId,
  contactsMiddleware.checkIfBody,
  contactsMiddleware.checkUpdateContactData,
  contactsController.updateContact
);

router.patch(
  "/:contactId/favorite",
  contactsMiddleware.checkContactId,
  contactsMiddleware.checkFavoriteBody,
  contactsController.updateFavorite
);

module.exports = router;
