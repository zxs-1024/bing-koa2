const schedule = require('node-schedule')
const puppeteer = require('./puppeteer')

module.exports = () => {
  const time = '22 5 * * *'
  schedule.scheduleJob(time, function () {
    puppeteer()
    console.log(`🔥  The schedule.scheduleJob in ${time} !`)
  })
}
