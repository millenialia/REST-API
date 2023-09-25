const express = require('express')
const {contactsController} = require('../../controllers')
const { contactsMiddleware } = require('../../middlewares')

const router = express.Router()

router.get('/', contactsMiddleware.readFile, contactsController.listContacts)

router.post('/', contactsMiddleware.checkContactFields, contactsMiddleware.readFile, contactsController.addContact)

router.get('/:contactId', contactsMiddleware.checkContactId, contactsController.getContactById)

router.delete('/:contactId', contactsMiddleware.readFile, contactsMiddleware.checkContactId, contactsController.removeContact)

router.put('/:contactId', contactsMiddleware.readFile, contactsMiddleware.checkContactId, contactsMiddleware.checkIfBody, contactsMiddleware.checkContactFields, contactsController.updateContact)

module.exports = router
