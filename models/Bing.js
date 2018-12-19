const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = function() {
  // define schema
  const BingSchema = mongoose.Schema({
    date: {
      type: Date,
      default: Date.now
    },
    enddate: String,
    title: String,
    url: String,
    copyright: String
  })

  mongoose.model('Bing', BingSchema)
}
