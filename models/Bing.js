const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema

module.exports = function() {
  // define schema
  const BingSchema = new Schema({
    date: {
      type: Date,
      default: Date.now
    },
    enddate: String,
    title: String,
    url: String,
    copyright: String
  })

  BingSchema.plugin(mongoosePaginate)

  mongoosePaginate.paginate.options = {
    lean: true,
    limit: 10
  }

  mongoose.model('Bing', BingSchema)
}
