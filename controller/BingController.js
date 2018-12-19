require('../models/Bing')()
const mongoose = require('mongoose')
const async = require('async')
const Bing = mongoose.model('Bing')

const readCollect = require('../middleware/readCollect')

class BingController {
  static async getAll(ctx) {
    const collect = await Bing.find({})

    if (collect && collect.length) {
      ctx.body = collect
    } else {
      console.log(`😂  没有数据，尝试从本地重新写入！`)
      await readCollect().then(data => {
        async.each(
          data,
          (item, cb) => {
            Bing.create(item, cb)
          },
          err => {
            if (err) return console.error(err)
          }
        )
      })
      ctx.body = await Bing.find({})
    }
  }

  static async getById(ctx) {
    const { id } = ctx.query
    const images = await Bing.find({ _id: id })
    ctx.body = images
  }

  static async getByDate(ctx) {
    const { date } = ctx.query
    const images = await Bing.find({ enddate: date })
    ctx.body = images
  }
}

module.exports = BingController
