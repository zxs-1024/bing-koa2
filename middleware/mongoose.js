const mongoose = require('mongoose')
const async = require('async')
const { mongoConfig, database } = require('../config')

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
    })
    .catch(err => {
      console.error(err)
      process.exit(1)
    })

  return async function(ctx, next) {
    return next()
  }
}
