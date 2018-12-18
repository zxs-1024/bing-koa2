'use strict'

const mongoose = require('mongoose')
const config = require('../config')

// mongoose.Promise = global.Promise

const options = {
  // promiseLibrary: global.Promise,
  useNewUrlParser: true,
  keepAlive: true
}

module.exports = app => {
  mongoose
    .connect(
      config.uri,
      options
    )
    .then(() => {
      console.log(`MongoDB connected on ${config.uri} mode`)
    })
    .catch(err => {
      console.error(err)
      process.exit(1)
    })

  return async function(ctx, next) {
    return next()
  }
}
