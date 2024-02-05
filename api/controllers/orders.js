const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

exports.get_all_orders = (req, res, next) => {
  Order.find().select('product quantity _id').populate('product', '_id name price').exec()
  .then(docs => {
    res.status(200).json({
      count: docs.length,
      orders: docs.map(doc => {
        return {
          _id: doc._id,
          product: doc.product,
          quantity: doc.quantity,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/orders/' + doc._id
          }
        };
      })
    });
  })
  .catch(err => {
    res.status(500).json({
      error: err
    });
  });
}

exports.add_order = (req, res, next) => {
  const productId = req.body.productId;
  console.log(productId)
  Product.findById(productId)
  .then(product => {
    if (!product) {
      throw (() => {
        const err = new Error('Product not found');
        err.status = 404;
        return err;
      })();
    }

    const order = new Order({
      _id: mongoose.Types.ObjectId(),
      quantity: req.body.quantity,
      product: req.body.productId
    });
    
    return order.save();
  })
  .then(result => {
    res.status(201).json({
      message: 'Order stored!',
      createdOrder: {
        _id: result._id,
        product: result.product,
        quantity: result.quantity
      },
      request: {
        type: 'GET',
        url: 'http://localhost:3000/orders/' + result._id
      }
    });
  })
  .catch(err => {
    res.status(err.status || 500).json({
      message: err.message 
    });
  });
}

exports.get_order_by_id = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId).select('product quantity _id').populate('product', '_id name price').exec()
  .then(order => {
    if (!order) {
      return res.status(404).json({
        message: 'Order not found!'
      });
    }
    res.status(200).json({
      order: order,
      request: {
        type: 'GET',
        url: 'http://localhost:300/orders/'
      }
    });
  })
  .catch(err => {
    res.status(500).json({
      error: err
    });
  });
}

exports.delete_order_by_id = (req, res, next) => {
  const id = req.params.orderId;
  Order.remove({ _id: id }).exec()
    .then(result => {
      res.status(200).json({
        message: 'Order deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/orders/',
          body: {productId: 'ID', quantity: 'Number'}
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
}