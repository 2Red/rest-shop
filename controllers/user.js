const mongose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = (req, res, next) => {
    User.find({ email: req.body.email }).then(user => {
        if (user.length > 1) {
            res.status(409).json({
                error: 'Email already in use'
            });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new User({
                        _id: mongose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });

                    user.save()
                        .then(result => {
                            res.status(201).json({
                                message: {
                                    message: 'User created successfully'
                                }
                            });
                        })
                        .catch(err => {
                            res.status(500).json({
                                error: err
                            });
                        });
                }
            });
        }
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
};

exports.signin = (req, res, next) => {
    User.find({ email: req.body.email }).exec().then(user => {
        if (user.length < 1) {
            res.status(401).json({
                message: 'Auth failed'
            });
        } else {
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }

                if (result) {
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        "secret",
                        { expiresIn: '1h' }
                    );

                    return res.status(200).json({
                        message: 'Auth successful',
                        token: token
                    });
                }

                res.status(401).json({
                    message: 'Auth failed'
                });
            });
        }
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
};

exports.delete = (req, res, next) => {
    User.remove({ _id: req.params.userId }).then(result => {
        res.status(200).json({
            message: 'Deleted user successfully'
        });
    }).catch(err => {
        res.status(200).json({
            error: err
        });
    });
}