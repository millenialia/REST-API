const express = require('express')
const {contactsController} = require('../../controllers')
const { contactsMiddleware } = require('../../middlewares')

const router = express.Router()

router.get('/', contactsController.listContacts)

router.post('/', contactsMiddleware.checkCreateContactData, contactsController.addContact)

router.get('/:contactId', contactsMiddleware.checkContactId, contactsController.getContactById)

router.delete('/:contactId', contactsMiddleware.checkContactId, contactsController.removeContact)

router.put('/:contactId', contactsMiddleware.checkContactId, contactsMiddleware.checkIfBody, contactsMiddleware.checkUpdateContactData, contactsController.updateContact)

router.patch('/:contactId', contactsMiddleware.checkFavoriteBody, contactsController.updateFavorite)

module.exports = router
