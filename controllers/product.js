const mongose = require('mongoose');
const Product = require('../models/product');

exports.get_all = (req, res, next) => {
    Product.find()
        .select('_id name price productImage')
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs
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

exports.get_by_id = (req, res, next) => {
    Product.findById(req.params.productId)
        .select('_id name price productImage')
        .then(doc => {
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({
                    message: 'No valid entry found for provided ID'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.create = (req, res, next) => {
    const product = new Product({
        _id: mongose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });

    product
        .save()
        .then(result => {
            res.status(201).json({
                message: 'Created product successfully',
                createdProduct: product
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.update = (req, res, next) => {
    const updateOps = {};

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Product.update({ _id: req.params.productId }, { $set: updateOps })
        .then(result => {
            res.status(200).json({
                message: 'Updated product successfully',
                updatedProduct: updateOps
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.delete = (req, res, next) => {
    Product.remove({ _id: req.params.productId })
        .then(result => {
            res.status(200).json({
                message: 'Deleted product successfully'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};