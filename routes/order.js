const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');

const OrderController = require('../controllers/order');

router.get('/', checkAuth, OrderController.get_all);

router.post('/', checkAuth, OrderController.create);

router.get('/:orderId', checkAuth, OrderController.get_by_id);

module.exports = router;