require('../models/Image')()
const mongoose = require('mongoose')
const Image = mongoose.model('Image')
const { handleImportLocalCollect } = require('../utils/index.js')

const sort = { date: -1 }

class ImageController {
  static async getImagesAll(ctx) {
    const count = await Image.count({})

    if (count) {
      const collect = await Image.find({})
        .sort(sort)
        .limit(100)
      ctx.body = collect
    } else {
      handleImportLocalCollect(Image)
      ctx.body = await Image.find({})
    }
  }

  static async getImagesById(ctx) {
    const { id } = ctx.params
    const image = await Image.findById(id)
    ctx.body = image
  }

  static async getImageByDate(ctx) {
    const { data } = ctx.params
    const images = await Image.find({
      enddate: { $regex: data }
    }).sort(sort)
    ctx.body = images
  }

  static async getImageByPage(ctx) {
    const { page } = ctx.params
    const images = await Image.paginate({}, { page, limit: 12, sort })
    ctx.body = images
  }
}

module.exports = ImageController
