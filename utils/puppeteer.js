const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const axios = require('axios')
const dayjs = require('dayjs')

const mkdir = promisify(fs.mkdir)
const { handleSaveData } = require('./multiTableQuery')
const { mkdirAsync, downLoadFile, fillZero } = require('./index')

const url =
  'https://www2.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&nc=1546351489339&pid=hp&video=1'
const storyUrl = 'https://www2.bing.com/cnhp/coverstory?d='
const detailUrl = 'https://www2.bing.com/cnhp/life?currentDate='
const time = dayjs().format('YYYYMMDD')

const imagePath = path.resolve(__dirname, '../', '../', 'image')
const largeImagePath = path.resolve(__dirname, '../', '../', 'image/large')
const storyImagePath = path.resolve(__dirname, '../', '../', 'image/story')

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
    timeout: 0,
    ignoreHTTPSErrors: true
  })

  const page = await browser.newPage()

  // 创建图片文件夹
  await mkdirAsync(imagePath)
  await mkdirAsync(largeImagePath)
  await mkdirAsync(storyImagePath)

  const image = await handleGetBingImageData()

  const {
    provider,
    Continent,
    Country,
    City,
    Longitude,
    Latitude,
    primaryImageUrl
  } = await axios.get(`${storyUrl}${time}`).then(({ data }) => data)

  const data = await puppeteerFn(page, time)

  const { story } = data

  for (let i = 0; i < story.length; i++) {
    let { miniImage } = story[i]
    const match = miniImage.match(/https:\/\/(.*)?id=(.*)&pid=(.*)/) || []
    const name = match[2]

    const target = `${storyImagePath}/${name}.png`

    if (name) {
      story[i].miniUrl = `https://zhanghao-zhoushan.cn/image/story/${name}.png`
      // 下载图片
      await downLoadFile(miniImage.replace(/https/, 'http'), target, `${time}`)
    }
  }

  const { copyright, name, url, dateString } = image

  const collect = {
    ...data,
    primaryImageUrl,
    url,
    name,
    provider,
    copyright,
    Continent,
    Country,
    City,
    Longitude,
    Latitude
  }

  await handleSaveData(
    {
      ...image,
      Continent,
      Country,
      City
    },
    collect
  )
}

// 收集列表数据
function handleGetBingImageData() {
  return axios.get(url).then(async ({ data: { images } }) => {
    const {
      enddate: dateString,
      urlbase: urlBase1,
      url: urlBase2,
      copyright,
      urlbase
    } = images[0]
    const splitUrl = urlbase.split('/')
    const name = splitUrl[splitUrl.length - 1].replace('th?id=OHR.', '')
    const url =
      urlBase2.indexOf('http') > -1
        ? urlBase2
        : `https://www2.bing.com${urlBase2}`
    const imageUrl = `https://zhanghao-zhoushan.cn/image/large/${name}_1920x1080.jpg`
    const target = `${largeImagePath}/${name}.jpg`
    // 下载图片
    await downLoadFile(url, target, dateString)

    return {
      dateString,
      date: dayjs().valueOf(),
      url,
      imageUrl,
      urlBase1,
      urlBase2,
      name,
      copyright
    }
  })
}

// 收集图片详情
async function puppeteerFn(page) {
  const date = new Date()
  const month = date.getMonth() + 1
  const time = `${date.getFullYear()}${fillZero(month)}${fillZero(
    date.getDate()
  )}`
  await page.goto(`${detailUrl}${time}`)

  // 等待页面渲染
  // await page.waitForSelector('#hplaT .hplaTtl')
  // await page.waitForSelector('.hplaCata .hplats')
  // await page.waitForSelector('#hplaSnippet')

  return await page.evaluate(time => {
    function handleGetInnerText(name) {
      return (
        document.querySelector(name) && document.querySelector(name).innerText
      )
    }

    // 获取文本
    const title = handleGetInnerText('#hplaT .hplaTtl')
    const attribute = handleGetInnerText('#hplaT .hplaAttr')
    const titleDescribes = document.querySelectorAll('.hplats') || [{}, {}, {}]
    const Au = document.querySelectorAll('.hplatt') || [{}, {}, {}]
    const titleDescribe1 = handleGetInnerText('.hplaCata .hplatt')
    const titleDescribeAu1 = handleGetInnerText('.hplaCata .hplats')
    const titleDescribe2 = titleDescribes[1] && titleDescribes[1].innerText
    const titleDescribeAu2 = Au[1] && Au[1].innerText
    const titleDescribe3 = titleDescribes[2] && titleDescribes[2].innerText
    const titleDescribeAu3 = Au[2] && Au[2].innerText

    const describes = document.querySelectorAll('.hplatxt') || [{}, {}, {}]
    const describe1 = handleGetInnerText('#hplaSnippet')
    const describe2 = describes[0] && describes[0].innerText
    const describe3 = describes[1] && describes[1].innerText

    const images = document.querySelectorAll('.hplaCard .rms_img')
    const miniImage1 = (document.querySelectorAll('#hpla .rms_img')[1] || {})
      .src
    const miniImage2 = images[1] && images[1].src
    const miniImage3 = images[3] && images[3].src

    const date = new Date(
      `${time.slice(0, 4)}-${time.slice(4, 6)}-${time.slice(6, 8)}`
    ).getTime()

    const story = []

    if (titleDescribe1 || describe1 || miniImage1) {
      story.push({
        title: titleDescribe1,
        au: titleDescribeAu1,
        describe: describe1,
        miniImage: miniImage1
      })
    }

    if (titleDescribe2 || describe2 || miniImage2) {
      story.push({
        title: titleDescribe2,
        au: titleDescribeAu2,
        describe: describe2,
        miniImage: miniImage2
      })
    }

    if (titleDescribe3 || describe3 || miniImage3) {
      story.push({
        title: titleDescribe3,
        au: titleDescribeAu3,
        describe: describe3,
        miniImage: miniImage3
      })
    }

    // 合并成对象
    return {
      dateString: time,
      date,
      attribute,
      title,
      story
    }
  }, time)
}

module.exports = main
