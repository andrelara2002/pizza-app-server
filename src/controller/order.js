const orderModel = require('../model/order');
const express = require('express');

const router = express.Router();
const verifyToken = require('../services/validatejwt')

const internalError = {
    success: false,
    message: 'Error: Server error',
    status: 500
}

const requestError = {
    success: false,
    message: 'Error: Request error',
    status: 400
}

//Create new order
router.post('/order', (req, res) => {
    const { user, email, document, address, city, zip, phone, items } = req.body;
    const date = new Date().getDate();

    let total = 0;
    items.map(item => {
        total += item.price * item.quantity
    })

    if (!user) res.json(requestError);
    else orderModel.create({
        user, email, document, address, city, zip, phone, items, total, date
    }, (err, order) => {
        if (err) res.json(internalError);
        else res.json(order);
    })
})

//Get all orders by date
router.get('/order/filterbydate', (req, res) => {
    const { date, user, token } = req.body;
    const isValid = verifyToken(token)
    if (!date || !user) res.json(requestError);
    else if (isValid.status !== 200) res.json(isValid)
    else orderModel.find({ date: date, user: user }, (err, orders) => {
        if (err) res.json(internalError);
        else res.json(orders);
    })
})

//Get all orders by month
router.get('/order/filterbymonth', (req, res) => {
    const { month, user, token } = req.body;
    const isValid = verifyToken(token)
    if (!month) res.json(requestError);
    else if (isValid.status !== 200) res.json(isValid)
    else orderModel.find({ user: user, date: { $gte: new Date(month) } }, (err, orders) => {
        if (err) res.json(internalError);
        else res.json(orders);
    })
})

//Get all order
router.get('/order', (req, res) => {
    const { user, token } = req.body
    const isValid = verifyToken(token)
    if (!user) res.json(requestError)
    else if (isValid.status !== 200) res.json(isValid)
    else orderModel.find({ user: user }, (err, orders) => {
        if (err) res.json(internalError)
        else res.json(orders)
    })
})

//Get order by id
router.get('/order/getbyid', (req, res) => {
    const { id, user, token } = req.body;
    const isValid = verifyToken(token)
    if (!id || !user) res.json(requestError);
    else if (isValid.status !== 200) res.json(isValid)
    else orderModel.find({ user: user, id: id }, (err, item) => {
        if (err) res.json(internalError);
        else res.json(item)
    })
})

//Update the order status
router.put('/order/changestatus', (req, res) => {
    const { id, status, user, token } = req.body
    const isValid = verifyToken(token)
    if (!id || !status) res.json(requestError)
    else if (isValid.status !== 200) res.json(isValid)
    else orderModel.findByIdAndUpdate(id, {
        status: status
    })
        .then(() => {
            res.send(`Status changed to ${status}`)
        })
        .catch(err => {
            res.json(internalError)
        })
})

//Update the order
router.put('/order', (req, res) => {
    const { token, id, user, email, document, address, city, zip, phone, items, status, active } = req.body;
    const isValid = verifyToken(token)

    if (!id) res.json(requestError)
    else if (isValid.status !== 200) res.json(isValid)
    else {
        let total = 0;
        items.map(item => {
            total += item.price * item.quantity
        })
        orderModel.findByIdAndUpdate(id, {
            user, email, document, address, city, zip, phone, items, total, status, active
        })
    }
})

//Delete the order
router.delete('/order', (req, res) => {
    const { id, token } = req.body;
    const isValid = verifyToken(token)
    if (!id) res.json(requestError)
    else if (isValid.status !== 200) res.json(isValid)
    else orderModel.findByIdAndDelete(id)
        .then(() => {
            res.send(`Item ${id} deleted`)
        })
        .catch(err => {
            res.json(internalError)
        })
})

//Get active order
router.get('/order/activeorder', (res, req) => {
    const { user, token } = req.body
    const isValid = verifyToken(token)
    if (!user || !token) res.json(requestError);
    else if (isValid.status !== 200) res.json(isValid)
    else orderModel.find({ user: user, active: true },
        (err, found) => {
            if (err) res.json(internalError) && console.log(err)
            else res.json(found)
        })
})

//Finish an active order
router.post('/order/finishorder', (req, res) => {
    const { id, token } = req.body
    const isValid = verifyToken(token)
    if (!id || !token) res.json(requestError)
    else if (isValid.status !== 200) res.json(isValid)
    else orderModel.findByIdAndUpdate(id, {
        active: false,
        status: 'finished'
    }, (err, result) => {
        if (err) res.json(internalError) && console.log(err)
        else res.json({
            success: true,
            status: 200,
            message: `Order ${id} finished`
        })
    })
})

module.exports = router