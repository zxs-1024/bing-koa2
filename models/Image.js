const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema

module.exports = function() {
  // define schema
  const ImageSchema = new Schema(
    {
      date: {
        type: Date,
        default: Date.now
      },
      enddate: String,
      title: String,
      url: String,
      copyright: String
    },
    { timestamps: true }
  )

  ImageSchema.plugin(mongoosePaginate)

  mongoosePaginate.paginate.options = {
    lean: true,
    limit: 10
  }

  mongoose.model('Image', ImageSchema)
}
