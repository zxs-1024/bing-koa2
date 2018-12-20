const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const async = require('async')

const writeFile = promisify(fs.writeFile)
const readdir = promisify(fs.readdir)
const readFile = promisify(fs.readFile)

const collectDir = 'collect'
const collectPath = path.resolve(__dirname, '../', collectDir)

let collectArray = []

fs.readdir(collectPath, (err, files) => {
  if (err) return console.error(err)
})

async function collect() {
  const files = await readdir(collectPath)

  // use async
  async.each(files, async function(file) {
    const fileData = await readFile(
      path.resolve(__dirname, '../', collectDir, file)
    )
    collectArray = [...collectArray, ...JSON.parse(fileData.toString())]
    console.log(`🔖  读取 ${file} 文件成功！`)
  })

  console.log(`📂  读取 ${collectDir} 文件夹完毕！`)
  return collectArray
}

module.exports = collect
