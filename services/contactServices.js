const { Types } = require("mongoose");

const Contact = require("../models/contactsModel");
const { AppError } = require("../utils");

exports.getAllContacts = () => Contact.find();

exports.getContactById = (id) => Contact.findById(id);

exports.deleteContact = (id) => Contact.findByIdAndDelete(id);

exports.createContact = (data) => Contact.create(data);

exports.updateContactData = (id, data) =>
  Contact.findByIdAndUpdate(id, data, { new: true });

exports.updateContactFavorite = (id, favorite) =>
  Contact.findByIdAndUpdate(id, { favorite }, { new: true }).select(
    "+favorite"
  );

exports.checkContactExistsById = async (id) => {
  const idIsValid = Types.ObjectId.isValid(id);
  if (!idIsValid) {
    throw new AppError(404, "Not found");
  }

  const contactExist = await Contact.exists({ _id: id });
  if (!contactExist) {
    throw new AppError(404, "Not found");
  }
};

exports.checkIfBodyExist = (data) => {
  if (Object.keys(data).length === 0) {
    throw new AppError(400, "missing fields");
  }
};

exports.checkContactExists = async (filter) => {
  const contactExists = await Contact.exists(filter);

  if (contactExists)
    throw new AppError(409, "Contact with such email already exists.");
};
