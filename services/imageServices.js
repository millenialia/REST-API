const multer = require('multer')
const Jimp = require('jimp')
const path = require('path')
const uuid = require('uuid').v4
const fse = require('fs-extra')

const {AppError} = require('../utils')

class ImageServices {
    static initUploadMiddleware(name)
{
    const multerStorage = multer.memoryStorage();
    const multerFilter = (req, file, cbk) => {
  if (file.mimetype.startsWith('image/')) {
    cbk(null, true)
  } else {
    cbk(new AppError(400, 'Please upload images only.'), false)
  }
    }
        return multer({
            storage: multerStorage,
            fileFilter: multerFilter,
        }).single(name)
    }

    static async save(file, options) {
        if (file.size > (options?.maxSize || 1 * 1024 * 1024)) throw new AppError(400, 'File is too large')

        const fileName = `${uuid()}.jpeg`;
        const fullFilePath = path.join(process.cwd(), 'public', 'avatars')
 
        await fse.ensureDir(fullFilePath)

        await Jimp.read(file.buffer).then((avatar) => {
            return avatar.resize(250, 250).quality(90).write(path.join(fullFilePath, fileName))
        }).catch(e=>console.log(e))
        
        return path.join('avatars', fileName)
    }
}

module.exports = ImageServices