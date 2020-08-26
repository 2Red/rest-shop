
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

exports.get_all = (req, res, next) => {
    Order.find()
        .select('_id product quantity')
        .then(docs => {
            const response = {
                count: docs.length,
                orders: docs
            };

            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.create = (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found'
                });
            }

            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                product: req.body.productId,
                quantity: req.body.quantity
            });

            order.save()
                .then(result => {
                    console.log(result);
                    res.status(201).json({
                        message: 'Order stored',
                        order: result
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.get_by_id = (req, res, next) => {
    Order.findById(req.params.orderId)
        .then(order => {
            res.status(200).json(order);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};