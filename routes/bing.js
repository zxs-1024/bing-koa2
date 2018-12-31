const router = require('koa-router')()
const ImageController = require('../controller/ImageController')

router.prefix('/bing/api/v1')

router.get('/images', ImageController.getImagesAll)
router.get('/images/:id', ImageController.getImagesById)
router.get('/images/date/:data', ImageController.getImageByDate)
router.get('/images/:page/:limit', ImageController.getImageByPage)

module.exports = router
