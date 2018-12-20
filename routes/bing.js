const router = require('koa-router')()
const BingController = require('../controller/BingController')

router.prefix('/bing')

router.get('/getAll', BingController.getAll)
router.get('/getById', BingController.getById)
router.get('/getByDate', BingController.getByDate)
router.get('/getByPage', BingController.getByPage)

module.exports = router
