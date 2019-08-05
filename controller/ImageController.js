require('../models/Image')()
require('../models/Detail')()

const mongoose = require('mongoose')
const Image = mongoose.model('Image')
// const Detail = mongoose.model('Detail')

// const { multiTableQuery } = require('../utils/multiTableQuery')
const schedule = require('../utils/schedule.js')

// sort
const sort = { date: 1 }
const reverseSort = { date: -1 }

// 定时任务
schedule()

class ImageController {
  static async getImagesAll (ctx) {
    const count = await Image.count({})

    console.log(`🔥  检索到 ${count} 条列表数据 !`)

    if (count) {
      const collect = await Image.find({})
        .sort(reverseSort)
        .limit(100)
      ctx.body = collect
    } else {
      // local data
      // multiTableQuery()
    }
  }

  static async getImageDetailsById (ctx) {
    const { id } = ctx.params
    const image = await Image.findById(id).populate({ path: 'detail' })

    ctx.body = image
  }

  // search history by day
  static async getImageDetailsByDate (ctx) {
    const { date } = ctx.params
    const images = await Image.find({
      dateString: { $regex: date }
    }).sort(reverseSort)
      .limit(100)

    ctx.body = images
  }

  // search history by year
  static async getImageHistoryByYear (ctx) {
    const { year } = ctx.params
    const regex = new RegExp(`${year}[0-9]{2}01`)

    const images = await Image.find({
      dateString: { $regex: regex }
    }).sort(sort)
      .limit(100)

    ctx.body = images
  }

  // search by month
  static async getHistoryByMonth (ctx) {
    const { page, limit = 10, month } = ctx.params
    const regex = new RegExp(`${month}[0-9]{2}`)
    const images = await Image.paginate(
      { dateString: { $regex: regex } },
      { page, limit: Number(limit), sort }
    )

    ctx.body = images
  }

  // search by page
  static async getImageHistory (ctx) {
    const { page, limit = 10 } = ctx.params
    const images = await Image.paginate(
      {},
      { page, limit: Number(limit), sort: reverseSort }
    )

    ctx.body = images
  }
}

module.exports = ImageController
