const fs = require('fs')
const path = require('path')
const async = require('async')
const { promisify } = require('util')

const writeFile = promisify(fs.writeFile)
const readdir = promisify(fs.readdir)
const readFile = promisify(fs.readFile)

const mongoose = require('mongoose')
const Image = mongoose.model('Image')
const Detail = mongoose.model('Detail')

const collectPath = 'collect'
const detailsPath = 'detail'

async function main() {
  const resolvePath = path.resolve(__dirname, '../', collectPath)
  const files = await readdir(resolvePath)

  for (let i = 0; i < files.length; i++) {
    await handleReadFile(files[i])
  }
}

async function handleReadFile(file) {
  const imageBuffer = await readFile(
    path.resolve(__dirname, '../', collectPath, file)
  )
  console.log(`🔖  读取 ${collectPath}/${file} 文件成功！`)
  const detailBuffer = await readFile(
    path.resolve(__dirname, '../', detailsPath, file)
  )
  console.log(`🔖  读取 ${detailsPath}/${file} 文件成功！`)

  const imageArray = JSON.parse(imageBuffer.toString())
  const detailArray = JSON.parse(detailBuffer.toString())

  for (let i = 0; i < imageArray.length; i++) {
    await handleSaveData(imageArray[i], detailArray[i])
  }
}

async function handleSaveData(imageData, detailData) {
  const detail = new Detail({ ...detailData })
  await detail.save(async (err, detail) => {
    if (err) return console.error(err)
    const image = new Image({ ...imageData, detail: detail._id })
    await image.save((err, image) => {
      if (err) return console.error(err)
      console.log(`储存详情成功！`, image)
    })
  })
}

module.exports = main
