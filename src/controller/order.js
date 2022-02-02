const orderModel = require('../model/order');
const express = require('express');

const router = express.Router();
const verifyAndDecode = require('../services/validatejwt')

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
    const { token, email, document, address, city, zip, phone, items } = req.body.order;
    const date = new Date().getDate();
    const decoded = verifyAndDecode(token)

    let total = 0;
    items.map(item => {
        total += item.price * item.quantity
    })

    if (!token) res.json(requestError);
    else if (decoded === undefined) res.json(internalError)
    else orderModel.create({
        user: decoded.id, email, document, address, city, zip, phone, items, total, date
    }, (err, order) => {
        if (err) res.json(internalError);
        else res.json(order);
    })
})

//Get all orders by date
router.get('/order/filterbydate', (req, res) => {
    const { date, token } = req.body;
    const decoded = verifyAndDecode(token)
    if (!date || !token) res.json(requestError);
    else if (decoded === undefined) res.json(internalError)
    else orderModel.find({ date: date, user: decoded.id }, (err, orders) => {
        if (err) res.json(internalError);
        else res.json(orders);
    })
})

//Get all orders by month
router.get('/order/filterbymonth', (req, res) => {
    const { month, token } = req.body;
    const isValid = verifyToken(token)
    if (!month) res.json(requestError);
    else if (isValid === undefined) res.json(internalError)
    else orderModel.find({ user: isValid.id, date: { $gte: new Date(month) } }, (err, orders) => {
        if (err) res.json(internalError);
        else res.json(orders);
    })
})

//Get all order of the user
router.post('/order', (req, res) => {
    const { token } = req.body
    const decoded = verifyAndDecode(token)
    if (!token) res.json(requestError)
    else if (decoded === undefined) res.json(decoded)
    else orderModel.find({ user: decoded.id }, (err, orders) => {
        if (err) res.json(internalError)
        else res.json(orders)
    })
})

//Get order by id
router.post('/order/getbyid', (req, res) => {
    const { id, token } = req.body;
    const decoded = verifyAndDecode(token)
    if (!id || !user) res.json(requestError);
    else if (decoded === undefined) res.json(internalError)
    else orderModel.find({ user: decoded.id, id: id }, (err, item) => {
        if (err) res.json(internalError);
        else res.json(item)
    })
})

//Update the order status
router.patch('/order/changestatus', (req, res) => {
    const { id, status, token } = req.body
    const isValid = verifyAndDecode(token)
    if (!id || !status) res.json(requestError)
    else if (isValid.status === 200) res.json(internalError)
    else orderModel.findByIdAndUpdate(id, {
        status: status
    })
        .then(() => {
            res.json({ message: `Status changed to ${status}`, success: true, status: 200 })
        })
        .catch(err => {
            res.json(internalError)
        })
})

//Update the order
router.put('/order', (req, res) => {
    const { token, id, user, email, document, address, city, zip, phone, items, status, active } = req.body.obj
    const isValid = verifyAndDecode(token)
    if (!id) res.json(requestError)
    else if (isValid.status === undefined) res.json(internalError)
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
    const isValid = verifyAndDecode(token)
    if (!id) res.json(requestError)
    else if (isValid === undefined) res.json(internalError)
    else orderModel.findByIdAndDelete(id)
        .then(() => {
            res.send(`Item ${id} deleted`)
        })
        .catch(err => {
            res.json(internalError)
        })
})

//Get active order
router.post('/order/activeorder', (res, req) => {
    const { token } = req.body
    const isValid = verifyAndDecode(token)
    if (!token) res.json(requestError);
    else if (isValid === undefined) res.json(internalError)
    else orderModel.find({ user: isValid.id, active: true },
        (err, found) => {
            if (err) { res.json(internalError); console.log(err) }
            else res.json(found)
        })
})

//Finish an active order
router.post('/order/finishorder', (req, res) => {
    const { id, token } = req.body
    const isValid = verifyAndDecode(token)
    if (!id || !token) res.json(requestError)
    else if (isValid === undefined) res.json(internalError)
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