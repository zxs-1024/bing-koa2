const path = require('path')
const axios = require('axios')
const dayjs = require('dayjs')

const { handleSaveData } = require('./multiTableQuery')
const { mkdirAsync, downLoadFile } = require('./index')

const url = 'https://www.bing.com/HPImageArchive.aspx?format=js&idx=-1&n=8&nc=1546351489339&pid=hp&video=1'

const imagePath = path.resolve(__dirname, '../', '../', 'image')
const largeImagePath = path.resolve(__dirname, '../', '../', 'image/large')
const storyImagePath = path.resolve(__dirname, '../', '../', 'image/story')

async function main () {

  await mkdirAsync(imagePath)
  await mkdirAsync(largeImagePath)
  await mkdirAsync(storyImagePath)

  const [image] = await handleGetBingImageData()

  console.log(image)

  const downLoadUrl = image.imageUrl.replace(/_1920x1080|_1366x768/g, '')

  await handleSaveData(
    image,
    {
      ...image,
      attribute: null,
      title: null,
      story: [],
      downLoadUrl
    }
  )
}

async function handleGetBingImageData () {
  const { data: { images } } = await axios.get(url)

  return images.map(image => {
    const { enddate: dateString, urlbase, url, copyright } = image
    const date = dayjs().valueOf()
    const name = urlbase.replace('/th?id=OHR.', '').split('_')[0]
    const downLoadUrl = `https://www.bing.com${url}`
    const imageUrl = `https://zhanghao-zhoushan.cn/image/large/${name}_1920x1080.jpg`
    const target = `${largeImagePath}/${name}.jpg`

    downLoadFile(downLoadUrl, target, dateString)

    return {
      dateString,
      date,
      imageUrl,
      name,
      copyright
    }
  })
}

module.exports = main
