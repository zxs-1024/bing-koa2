require('../models/Image')()
const mongoose = require('mongoose')
const Image = mongoose.model('Image')
const { handleImportLocalCollect } = require('../utils/index.js')

const sort = { date: -1 }

class ImageController {
  static async getImagesAll(ctx) {
    const collect = await Image.find({})
      .sort(sort)
      .limit(100)

    if (collect && collect.length) {
      ctx.body = collect
    } else {
      handleImportLocalCollect(Image)
      ctx.body = await Image.find({})
    }
  }

  static async getImagesById(ctx) {
    const { id } = ctx.params
    const images = await Image.findOne({ _id: id })
    ctx.body = images
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
    const images = await Image.paginate({}, { page, sort })
    ctx.body = images
  }
}

module.exports = ImageController
