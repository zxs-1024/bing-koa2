const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = function() {
  // define schema

  const DetailSchema = new Schema(
    {
      dateString: String,
      date: { type: Date, default: Date.now },
      title: String,
      titleDescribe: String,
      titleDescribe1: String,
      titleDescribe2: String,
      titleDescribe3: String,
      describe1: String,
      describe2: String,
      describe3: String,
      miniImage1: String,
      miniImage2: String,
      miniImage3: String,
      primaryImageUrl: String,
      provider: String,
      Continent: String,
      Country: String,
      City: String,
      Longitude: String,
      Latitude: String,
      ImageId: { type: Schema.Types.ObjectId, ref: 'Image' }
    },
    { timestamps: true }
  )

  mongoose.model('Detail', DetailSchema)
}
