const router = require('koa-router')()
const ImageController = require('../controller/ImageController')

router.prefix('/bing/api/v1')

router.get('/images', ImageController.getImagesAll)
router.get('/images/:id', ImageController.getImagesById)
router.get('/images/date/:date', ImageController.getImageByDate)
router.get('/images/:page/:limit', ImageController.getImageByPage)
router.get('/images/history/:year', ImageController.getImageHistoryByYear)
router.get('/images/month/:month/:page/:limit', ImageController.getImageByMonth)

module.exports = router
