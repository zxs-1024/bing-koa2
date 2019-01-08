const schedule = require('node-schedule')
const puppeteer = require('puppeteer')
const axios = require('axios')
const dayjs = require('dayjs')

const { handleSaveData } = require('./multiTableQuery')

const url =
  'https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&nc=1546351489339&pid=hp&video=1'
const storyUrl = 'https://cn.bing.com/cnhp/coverstory?d='
const detailUrl = 'https://cn.bing.com/cnhp/life?currentDate='
const time = dayjs().format('YYYYMMDD')

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
    timeout: 0,
    ignoreHTTPSErrors: true
  })

  const page = await browser.newPage()

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

function handleGetBingImageData() {
  return axios.get(url).then(({ data: { images } }) => {
    const {
      enddate: dateString,
      urlbase: urlBase1,
      url: urlBase2,
      copyright,
      urlbase
    } = images[0]

    const name = urlbase.replace(/\/az\/hprichbg\/rb\//, '')
    const url = `http://cdn.nanxiongnandi.com/bing/${name}_1366x768.jpg`
    return {
      dateString,
      date: dayjs().valueOf(),
      url,
      urlBase1,
      urlBase2,
      name,
      copyright
    }
  })
}

// 收集图片详情
async function puppeteerFn(page, date) {
  await page.goto(`${detailUrl}${date}`)

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

    // 合并成对象
    return {
      dateString: time,
      date,
      attribute,
      title,
      titleDescribe1,
      titleDescribeAu1,
      titleDescribe2,
      titleDescribeAu2,
      titleDescribe3,
      titleDescribeAu3,
      describe1,
      describe2,
      describe3,
      miniImage1,
      miniImage2,
      miniImage3
    }
  }, date)
}

module.exports = () => {
  const time = '11 11 * * *'
  schedule.scheduleJob(time, function() {
    main()
    console.log(`The schedule.scheduleJob ${time} !`)
  })
}
