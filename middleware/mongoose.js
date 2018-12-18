'use strict'

const mongoose = require('mongoose')
const async = require('async')
const { mongoConfig, database } = require('../config')

require('../models/Bing')()
const Bing = mongoose.model('Bing')
const data = require('../models/201812.json')

const options = {
  useNewUrlParser: true,
  keepAlive: true
}

module.exports = app => {
  mongoose
    .connect(
      database,
      options
    )
    .then(() => {
      console.log(`MongoDB connected on ${mongoConfig.uri}`)
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
    .catch(err => {
      console.error(err)
      process.exit(1)
    })

  return async function(ctx, next) {
    return next()
  }
}
