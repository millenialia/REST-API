const { AppError, catchAsync, contactsValidators } = require('../utils')
const { checkContactExistsById, checkIfBodyExist, checkContactExists } = require('../services/contactServices')


exports.checkContactId = catchAsync(async (req, res, next) => {
    await checkContactExistsById(req.params.contactId)
    next()
})

exports.checkIfBody = catchAsync(async (req, res, next) => {
    checkIfBodyExist(req.body)
    next()
})

exports.checkCreateContactData = catchAsync(async (req, res, next) => {
    const { error, value } = contactsValidators.createContactDataValidator(req.body)
  
    if (error) {
        throw new AppError(400, error.message)
    }
    
    await checkContactExists({ email: value.email })
    
    req.body = value
    next()
})

exports.checkUpdateContactData = catchAsync(async (req, res, next) => {
    const { error, value } = contactsValidators.createContactDataValidator(req.body)
  
    if (error) {
        throw new AppError(400, error.message)
    }
    
    req.body = value
    next()
})

exports.checkFavoriteBody = catchAsync(async (req, res, next) => {
    const { error, value } = contactsValidators.favoriteContactDataValidator(req.body)

    if (error) {
        throw new AppError(400, error.message)
    }

    req.body = value
    next()
})

