const router = require('koa-router')()
const fs = require('fs')
const path = require('path')
const Cos = require('cos-nodejs-sdk-v5')
const multer = require('koa-multer')

const cosConfig = {
  SecretId: '',
  SecretKey: ''
}

const uploadConfig = {
  Bucket: 'bing-1256168624',
  Region: 'ap-chengdu'
}

const cos = new Cos({ ...cosConfig })

const DirPath = 'uploads/'

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, DirPath)
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage })

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.post('/upload', upload.single('file'), async (ctx, next) => {
  const { originalname: Key } = ctx.req.file
  const FilePath = path.resolve(__dirname, '../', DirPath, Key)
  const params = { ...uploadConfig, Key, FilePath }

  cos.sliceUploadFile(params, function(err, data) {
    if (err) return console.error(err)
    ctx.body = data.Key
  })
})

module.exports = router
