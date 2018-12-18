const mongoConfig = {
  username: 'zhanghao',
  psw: 'lulu',
  address: '118.24.8.202:27017',
  uri: '118.24.8.202:27017',
  db: 'fire'
}

const { username, psw, address, db } = mongoConfig
const database = `mongodb://${username}:${psw}@${address}/${db}`

module.exports = {
  mongoConfig,
  database
}
