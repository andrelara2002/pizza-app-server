const express = require('express');

const userModel = require('../model/user');
const router = express.Router();
const settings = require('../../settings.json')

const jwt = require('jsonwebtoken')
const SECRET = settings.jwtsecret
const expires = settings.jwtExpiration //Time to expires token in seconds

const { verifyAndDecode, verifyToken } = require('../services/validatejwt')

const requestError = {
    success: false,
    message: 'Error: Request error',
    status: 400
}

const internalError = {
    success: false,
    message: 'Error: Server error',
    status: 500
}

//Get all users
router.get('/user', (req, res) => {
    const { token } = req.body;
    const decoded = verifyAndDecode(token)
    if (decoded === undefined) res.json(internalError)
    else if (decoded.accessLevel === 3) {
        userModel.find({}).then(users => {
            res.json(users);
        }).catch(err => {
            console.log(err)
            res.json(internalError)
        })
    } else {
        res.json({ message: 'You do not have access to this operation' })
    }
})

//Get user by id
router.post('/user/findbyid', (req, res) => {
    const { token, id } = req.body;
    const decoded = verifyAndDecode(token);
    if (decoded === undefined) {
        res.json(internalError)
    }
    else userModel.findById(token ? decoded.id : id, (err, user) => {
        if (err) res.json(internalError);
        else {
            const { email, phone, address, city, state, country, zip, paymentMethods } = user
            res.json({ email, phone, address, city, state, country, zip, paymentMethods })
        }
    });
})

//Get user by email or document and authenticate
router.post('/user/login', (req, res) => {
    const { email, document, password } = req.body;
    if (!email && !document) res.json({ message: "Credential not defined" })
    let query;
    if (document) query = { document: document }
    else query = { email: email }

    userModel.find(query).then(user => {
        if (password === user[0].password) {
            const expiresIn = expires;
            const token = jwt.sign({ id: user[0].id, accessLevel: user[0].accessLevel }, SECRET, {
                expiresIn: expiresIn
            })
            res.json({ status: 200, token: token, expiresIn: expiresIn })
        }
        else {
            res.json({ message: "Invalid credential", status: 400 })
        }
    }).catch(err => {
        res.json(internalError)
    })
})

router.post('/user/refreshtoken', (req, res) => {
    const { token } = req.body
    if (!token) res.send(requestError)
    const isValid = verifyAndDecode(token)
    if (isValid === undefined) res.send({ success: false, message: "Token is too old, please login again", status: 400 })
    else {
        const newToken = jwt.sign({ id: isValid.id, accessLevel: isValid.accessLevel }, SECRET, {
            expiresIn: expires
        })
        res.json({
            status: 200,
            token: newToken,
            expiresIn: expires
        })
    }
})

//Logout user
router.get('/user/logout', (req, res) => {
    res.json({ token: null, expiresIn: null, id: null })
})

//Add new user
router.post('/user', (req, res) => {
    const {
        name,
        email,
        password,
        document,
        phone,
        address,
        city,
        state,
        country,
        zip
    } = req.body;
    if (!name || !password) res.json(requestError)
    userModel.create({
        name, email, password, document, phone, address, city, state, country, zip
    })
        .then(user => {
            console.log("User created: ", user);
            res.json(user);
        })
        .catch(err => {
            console.log("Error creating user: ", err);
            res.json(internalError);
        })
})

//Update user
router.put('/user', (req, res) => {
    const {
        name,
        email,
        password,
        document,
        phone,
        address,
        city,
        state,
        country,
        zip,
        token,
        paymentMethods,
        accessLevel
    } = req.body;
    const isValid = verifyAndDecode(token);
    if (isValid !== undefined) {
        userModel.findByIdAndUpdate(isValid.id, {
            name, email, password, document, phone, address, city, state, country, zip, paymentMethods, accessLevel
        }, { new: true }, (err, user) => {
            console.log(user)
            if (err) res.json(internalError);
            else if (user === null) res.json({ message: "User not found", status: 500, success: false })
            else res.json(user);
        });
    }
    else {
        res.json({
            message: "Error with token"
        })
    }
})

//Insert payment method
router.post('/user/addpayment', (req, res) => {
    const { token, payment } = req.body
    const isValid = verifyToken(token)
    if (!payment) res.json(requestError)
    else if (isValid === undefined) res.json(internalError)
    else {
        userModel.findById(isValid.id).then(found => {
            userModel.findByIdAndUpdate(isValid.id, {
                paymentMethods: [...found.paymentMethods, payment]
            }).then(() => {
                res.json({ message: 'Payment method added', status: 200, success: true })
            }).catch(err => {
                console.log(err)
                res.json(internalError)
            })
        }).catch(err => {
            console.log(err)
            res.json(internalError)
        })
    }
})

//Delete user by id
router.delete('/user', (req, res) => {
    const { token } = req.body;
    const isValid = verifyAndDecode(token)
    if (isValid === undefined) res.json(isValid)
    else userModel.findByIdAndDelete(isValid.id, (err, user) => {
        if (err) res.json(internalError);
        res.json({ success: true, message: "User deleted" });
    })
})

router.get('/user/decodetoken', (req, res) => {
    const { token } = req.body;
    res.json(verifyAndDecode(token))
})

module.exports = router;