require('../models/Image')()
require('../models/Detail')()

const mongoose = require('mongoose')
const Image = mongoose.model('Image')
const Detail = mongoose.model('Detail')

const multiTableQuery = require('../utils/multiTableQuery')
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
      // trans local data
      await multiTableQuery()
      ctx.body = await Image.find({})
        .sort(sort)
        .limit(100)
    }
  }

  static async getImagesById(ctx) {
    const { id } = ctx.params
    const image = await Image.findById(id).populate({ path: 'detail' })
    ctx.body = image
  }

  static async getImageByDate(ctx) {
    const { data } = ctx.params
    const images = await Image.find({
      dateString: { $regex: data }
    }).sort(sort)
    ctx.body = images
  }

  static async getImageByPage(ctx) {
    const { page, limit = 10 } = ctx.params
    const images = await Image.paginate(
      {},
      { page, limit: Number(limit), sort }
    )
    ctx.body = images
  }
}

module.exports = ImageController
