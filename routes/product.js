const express = require('express');
const router = express.Router();
const multer = require('multer');

const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, escape(new Date().toISOString()) + "_" + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB
    },
    //fileFilter: fileFilter
});

const ProductController = require('../controllers/product');

router.get('/', checkAuth, ProductController.get_all);

router.get('/:productId', checkAuth, ProductController.get_by_id);

router.post('/', checkAuth, upload.single('productImage'), ProductController.create);

router.patch('/:productId', checkAuth, ProductController.update);

router.delete('/:productId', checkAuth, ProductController.delete);

module.exports = router;