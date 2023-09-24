const fs = require('fs').promises
const uuid = require('uuid').v4

exports.listContacts = async (req, res) => {
  const contacts = req.contacts
  res.status(200).json(contacts)
} 

exports.getContactById = (req, res) => {
  const contact = req.contact
  res.status(200).json(contact)
}

exports.removeContact = (req, res) => {
  const contacts = req.contacts
  const { contactId } = req.params
  contacts.splice(contacts.findIndex(({ id }) => id === contactId), 1)
  fs.writeFile('./models/contacts.json', JSON.stringify(contacts, null, 2))
  res.status(200).json({"message": "contact deleted"})
  
}

exports.addContact = (req, res) => {
  const {name, phone, email} = req.newContact
    const newContact = {id:uuid(), name, email, phone,}
    const contacts = req.contacts
    contacts.push(newContact)
    fs.writeFile('./models/contacts.json', JSON.stringify(contacts, null, 2))
    res.status(201).json(newContact)

}
exports.updateContact = (req, res) => {
  const contacts = req.contacts
  const {name, phone, email} = req.newContact
    const { contactId } = req.params
    const contact = contacts.find(({id}) => id === contactId) 
    contact.name = name
    contact.email = email
    contact.phone = phone
    fs.writeFile('./models/contacts.json', JSON.stringify(contacts, null, 2))
    res.status(200).json(contact)
}