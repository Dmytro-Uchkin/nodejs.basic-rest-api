const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders')

// GET orders
router.get('/', ordersController.get_all_orders);

// POST order
router.post('/', ordersController.add_order);

// GET order
router.get('/:orderId', ordersController.get_order_by_id);

// DELETE order
router.delete('/:orderId', ordersController.delete_order_by_id);

module.exports = router;