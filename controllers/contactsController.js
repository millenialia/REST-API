const { getAllContacts, getContactById, deleteContact, createContact, updateContactData, updateContactFavorite } = require('../services/contactServices')
const { catchAsync } = require('../utils')

exports.listContacts = catchAsync(async (req, res) => {
  const contacts = await getAllContacts()
  res.status(200).json(contacts)
} )

exports.getContactById = catchAsync( async(req, res) => {
  const contact = await getContactById(req.params.contactId)
  res.status(200).json(contact)
})

exports.removeContact = catchAsync(async (req, res) => {
  await deleteContact(req.params.contactId)
  res.status(200).json({"message": "contact deleted"})
})

exports.addContact = catchAsync(async (req, res) => {
    const newContact = await createContact(req.body)
    res.status(201).json(newContact)
})

exports.updateContact = catchAsync(async (req, res) => {
  const { contactId } = req.params
  const updatedContact = await updateContactData(contactId, req.body)
  res.status(200).json(updatedContact)
})

exports.updateFavorite = catchAsync(async (req, res) => {
  const { favorite } = req.body
  const { contactId } = req.params
  const updatedContact = await updateContactFavorite(contactId, favorite)
  res.status(200).json(updatedContact)
})