require('../models/Image')()
require('../models/Detail')()

const mongoose = require('mongoose')
const Image = mongoose.model('Image')
const Detail = mongoose.model('Detail')

const { multiTableQuery } = require('../utils/multiTableQuery')
const schedule = require('../utils/schedule.js')

// 默认倒序
const sort = { date: -1 }

// 定时任务
schedule()

class ImageController {
  static async getImagesAll(ctx) {
    const count = await Image.count({})

    console.log(`🔥  检索到 ${count} 条列表数据 !`)

    if (count) {
      const collect = await Image.find({})
        .sort(sort)
        .limit(100)
      ctx.body = collect
    } else {
      // 加载本地数据
      // multiTableQuery()
    }
  }

  static async getImagesById(ctx) {
    const { id } = ctx.params
    const image = await Image.findById(id).populate({ path: 'detail' })

    ctx.body = image
  }

  // 查询单日
  static async getImageByDate(ctx) {
    const { date } = ctx.params
    const images = await Image.find({
      dateString: { $regex: date }
    }).sort(sort)

    ctx.body = images
  }

  // 查询单月
  static async getImageByMonth(ctx) {
    const { month } = ctx.params
    const images = await Image.find({
      dateString: { $regex: month }
    }).sort({ date: 1 })

    ctx.body = images
  }

  // 查询单年
  static async getImageByYear(ctx) {
    const { year } = ctx.params
    const re = new RegExp(`${year}[0-9]{2}(.*)01`)

    const images = await Image.find({
      dateString: { $regex: re }
    }).sort({ date: 1 })

    ctx.body = images
  }

  // 分页查询 默认 10
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
