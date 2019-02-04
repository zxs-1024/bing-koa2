const async = require('async')
const fs = require('fs')
const path = require('path')
const request = require('request')
const { promisify } = require('util')
const mkdir = promisify(fs.mkdir)

const readCollect = require('./readCollect')
const tinify = require('./tinify')

async function handleImportLocalCollect(model) {
  console.log(`😂  没有数据，尝试从本地重新写入！`)
  await readCollect().then(data => {
    async.each(
      data,
      (item, cb) => {
        model.create(item, cb)
      },
      err => {
        if (err) return console.error(err)
      }
    )
  })
}

function mkdirAsync(url) {
  return new Promise(async (resolve, reject) => {
    if (fs.existsSync(url)) {
      console.log(`📂  已经存在 ${url} 文件夹！`)
      resolve(url)
    } else {
      await mkdir(url).then(() => {
        console.log(`📂  创建 ${url} 文件夹成功！`)
        resolve(url)
      })
    }
  })
}

// 下载文件
async function downLoadFile(source, target, date = '') {
  if (fs.existsSync(target)) {
    console.log(
      `😂  请注意，已经存在 ${target} 文件，为了防止文件覆盖，已经帮你中断写入啦！`
    )
    return Promise.resolve(target)
  }

  const tinifySource = tinify.fromUrl(source)

  return tinifySource
    .toFile(target)
    .then(res => {
      console.log(`🌁  ${date} 下载 ${target} 文件成功！`)
    })
    .catch(err => console.log(err))
}

const sleep = time => {
  return new Promise(resolve => setTimeout(() => resolve(), time))
}

const fillZero = number => {
  return number < 10 ? `0${number}` : number
}

module.exports = {
  handleImportLocalCollect,
  mkdirAsync,
  downLoadFile,
  sleep,
  fillZero
}
