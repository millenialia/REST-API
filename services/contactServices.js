const { Types } = require("mongoose");

const Contact = require("../models/contactsModel");
const { AppError } = require("../utils");

exports.getAllContacts = async (filter, user) => {
  const findOptions = filter.favorite
    ? {
        favorite: filter.favorite,
        owner: user,
      }
    : { owner: user };

  const contactsQuery = Contact.find(findOptions).populate({
    path: "owner",
    select: "name email phone",
  });

  const paginationPage = filter.page ? +filter.page : 1;
  const paginationLimit = filter.limit ? +filter.limit : 20;
  const contactsToSkip = (paginationPage - 1) * paginationLimit;

  contactsQuery.skip(contactsToSkip).limit(paginationLimit);
  const contacts = await contactsQuery;
  const total = await Contact.count(findOptions);

  return { contacts, total };
};

exports.getContactById = (id) => Contact.findById(id);

exports.deleteContact = (id) => Contact.findByIdAndDelete(id);

exports.createContact = (data, owner) => {
  const { name, email, phone } = data;
  return Contact.create({
    name,
    email,
    phone,
    owner,
  });
};

exports.updateContactData = (id, data) =>
  Contact.findByIdAndUpdate(id, data, { new: true });

exports.updateContactFavorite = (id, favorite) =>
  Contact.findByIdAndUpdate(id, { favorite }, { new: true });

exports.checkContactExistsById = async (id, owner) => {
  const idIsValid = Types.ObjectId.isValid(id);
  if (!idIsValid) {
    throw new AppError(404, "Not found");
  }

  const contactExist = await Contact.exists({ _id: id, owner });
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
