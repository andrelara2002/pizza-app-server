const orderModel = require('../model/order');
const express = require('express');

const router = express.Router();

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
    orderModel.create({
        user, email, document, address, city, zip, phone, items, total, date
    }, (err, order) => {
        if (err) res.json(internalError);
        else res.json(order);
    })
})

//Get all orders by date
router.get('/order/filterbydate', (req, res) => {
    const { date } = req.body;
    if (!date) res.json(requestError);
    orderModel.find({ date }, (err, orders) => {
        if (err) res.json(internalError);
        else res.json(orders);
    })
})

//Get all orders by month
router.get('/order/filterbymonth', (req, res) => {
    const { month } = req.body;
    if (!month) res.json(requestError);
    orderModel.find({ date: { $gte: new Date(month) } }, (err, orders) => {
        if (err) res.json(internalError);
        else res.json(orders);
    })
})

//Get all order
router.get('/order', (req, res) => {
    orderModel.find({}, (err, orders) => {
        if (err) res.json(internalError)
        else res.json(orders)
    })
})

//Get order by id
router.get('/order/getbyid', (req, res) => {
    const { id } = req.body;
    if (!id) res.json(requestError);
    orderModel.findById(id, (err, item) => {
        if (err) res.json(internalError);
        else res.json(item)
    })
})

//Update the order status
router.put('/order/changestatus', (req, res) => {
    const { id, status } = req.body
    if (!id || !status) res.json(requestError)
    orderModel.findByIdAndUpdate(id, {
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
    const { id, user, email, document, address, city, zip, phone, items } = req.body;
    if (!id) res.json(requestError)

    let total = 0;
    items.map(item => {
        total += item.price * item.quantity
    })

    orderModel.findByIdAndUpdate(id, {
        user, email, document, address, city, zip, phone, items, total
    })
})

//Delete the order
router.delete('/order', (req, res) => {
    const { id } = req.body;
    if (!id) res.json(requestError)
    orderModel.findByIdAndDelete(id)
        .then(() => {
            res.send(`Item ${id} deleted`)
        })
        .catch(err => {
            res.json(internalError)
        })
})

module.exports = router