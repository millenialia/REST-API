const fs = require('fs').promises

const { AppError, catchAsync, contactsValidators } = require('../utils')

exports.readFile = catchAsync(async (req, res, next) => {
    const contactsDB = await fs.readFile('./models/contacts.json')
    const contacts = JSON.parse(contactsDB)
    
    if (!contacts) {
        throw new AppError(404, "Not found")
    }  
    
    req.contacts = contacts
    next()
})

exports.checkContactId = catchAsync(async (req, res, next) => {
    const contactsDB = await fs.readFile('./models/contacts.json')
    const contacts = JSON.parse(contactsDB)
    const { contactId } = req.params
    const contact = contacts.find(({ id }) => id === contactId) 
        
    if (!contact) {
        throw new AppError(404, "Not found")
    }
    
    req.contact = contact
    next()
})

exports.checkIfBody = catchAsync(async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
    throw new AppError(400, "missing fields")
    }
    next()
})

exports.checkContactFields = catchAsync(async (req, res, next) => {
    const { error, value } = contactsValidators.createContactDataValidator(req.body)
  
  if (error) {
    throw new AppError(400, error.message)
  }
    const { name, phone, email } = value
    req.newContact = {name, phone, email}
    next()
})