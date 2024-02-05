const express = require('express');
const router = express.Router();
const multer = require('multer');
const productsController = require('../controllers/products');
const checkAuth = require('../middleware/check-auth');

const multerOptions = {
  storage : multer.diskStorage({
    destination: function(req, file, callback) {
      callback(null, './uploads/');
    },
    filename: function(req, file, callback) {
      callback(null, +(new Date()) + file.originalname);
    }
  }),
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter : function(req, file, callback) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      callback(null, true);
    } else {
      callback(null, true);
    }
  }
  
};
const upload = multer(multerOptions);


// GET products
router.get('/', productsController.get_all_products);

// POST product
router.post('/', checkAuth, upload.single('productImage'), productsController.add_product);

// GET product
router.get('/:productId', productsController.get_product_by_id);

// PATCH product
router.patch('/:productId', checkAuth, productsController.update_product);

// DELETE product
router.delete('/:productId', checkAuth, productsController.delete_product);

module.exports = router;