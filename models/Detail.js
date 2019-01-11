const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = function() {
  // define schema

  const DetailSchema = new Schema(
    {
      dateString: String,
      date: { type: Date, default: Date.now },
      title: String,
      story: [
        {
          title: String,
          au: String,
          describe: String,
          miniUrl: String
        }
      ],
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
