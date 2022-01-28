const express = require('express');

const userModel = require('../model/user');
const router = express.Router();
const settings = require('../../settings.json')

const jwt = require('jsonwebtoken')
const SECRET = settings.jwtsecret
const expires = settings.jwtExpiration //Time to expires token in seconds

const verifyToken = require('../services/validatejwt')

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
    const decoded = verifyToken(token, SECRET)
    if (decoded.status !== 200) res.json(decoded)
    else {
        userModel.find({}).then(users => {
            res.json(users);
        }).catch(err => {
            console.log(err)
            res.json(internalError)
        })
    }
})

//Get user by id
router.get('/user/findbyid', (req, res) => {
    const { token, id } = req.body;
    const decoded = verifyToken(token, SECRET);
    if (decoded.status !== 200) res.json(decoded)

    else userModel.findById(id, (err, user) => {
        if (err) res.json(internalError);
        else {
            const { name, email, document, phone, address, city, state, country, zip } = user
            res.json({ name, email, document, phone, address, city, state, country, zip })
        }
    });
})

//Get user by email or document and authenticate
router.get('/user/login', (req, res) => {
    const { email, document, password } = req.body;
    if (!email && !document) res.json({ message: "Credential not defined" })
    let query;
    if (document) query = { document: document }
    else query = { email: email }

    userModel.find(query).then(user => {
        if (password === user[0].password) {
            const expiresIn = expires;
            const token = jwt.sign({ id: user.id }, SECRET, {
                expiresIn: expiresIn
            })
            res.json({ status: 200, auth: true, token: token, expiresIn: expiresIn, id: user.id })
        }
        else {
            res.json({ message: "Invalid credential", status: 400, success: false })
        }
    }).catch(err => {
        console.log(err)
        res.json(internalError)
    })
})

router.get('/user/refreshtoken', (req, res) => {
    const { id, token } = req.body
    if (!token) res.send(requestError)
    const isValid = verifyToken(token, SECRET)
    console.log(isValid)
    if (isValid.status !== 200) res.send({ success: false, message: "Token is too old, please login again", status: 400 })
    else {
        const newToken = jwt.sign({ id }, SECRET, {
            expiresIn: expires
        })
        res.json({
            auth: true,
            token: newToken,
            expiresIn: expires
        })
    }
})

//Logout user
router.get('/user/logout', (req, res) => {
    res.json({ auth: false, token: null, expiresIn: null })
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
        id
    } = req.body;
    const isValid = verifyToken(token, SECRET);
    if (isValid.status === 200) {
        userModel.findByIdAndUpdate(id, {
            name, email, password, document, phone, address, city, state, country, zip
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
router.post('/addpayment', (req, res) => {
    const { token, id, payment } = req.body
    const isValid = verifyToken(token)
    if (!id || !payment) res.json(requestError)
    else if (isValid.status !== 200) res.json(isValid)
    else {
        userModel.findById(id).then(found => {
            userModel.findByIdAndUpdate(id, {
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
    const { id } = req.body;
    userModel.findByIdAndDelete(id, (err, user) => {
        if (err) res.json(internalError);
        res.json({ success: true, message: "User deleted" });
    })
})

module.exports = router;