const async = require('async')
const readCollect = require('./readCollect')

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

module.exports = {
  handleImportLocalCollect
}
