const router = require('koa-router')()
const ImageController = require('../controller/ImageController')

router.prefix('/bing/api/v1')

router.get('/images', ImageController.getImagesAll)
router.get('/images/getImageDetailsById/:id', ImageController.getImageDetailsById)
router.get('/images/getImageDetailsByDate/:date', ImageController.getImageDetailsByDate)
router.get('/images/getImageHistory/:page/:limit', ImageController.getImageHistory)
router.get('/images/getImageHistoryByYear/:year', ImageController.getImageHistoryByYear)
router.get('/images/getHistoryByMonth/:month/:page/:limit', ImageController.getHistoryByMonth)

module.exports = router
