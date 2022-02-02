const express = require('express');
const router = express.Router();
const itemModel = require('../model/pizza');
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

const permissionError = {
    success: false,
    message: 'Error: you do not have permission to this action',
    status: 500
}

//Get all itens
router.get('/item', (req, res) => {
    itemModel.find({}, (err, items) => {
        if (err) res.json(internalError);
        else res.json(items);
    });
})

//Get item by id
router.get('/item/findbyid', (req, res) => {
    const { id } = req.body;
    if (!id) res.json(requestError);
    itemModel.findById(id, (err, item) => {
        if (err) res.json(internalError);
        else res.json(item);
    })
})

//Get item by name
router.post('/item/findbyname', (req, res) => {
    const { name } = req.body;
    if (!name) res.json(requestError);
    itemModel.find({ name: new RegExp(name, 'i') }, (err, item) => {
        if (err) res.json(internalError);
        else res.send(item);
    })
})

//Get item by category
router.post('/item/findbycategory', (req, res) => {
    const { category } = req.body;
    if (!category) res.json(requestError)
    itemModel.find({ category }, (err, item) => {
        if (err) res.json(internalError);
        else res.send(item)
    })
})

//Add new item
router.post('/item', (req, res) => {
    const { token, name, description, price, image, category, ingredients, sizes } = req.body;
    const decoded = verifyAndDecode(token)
    if (!name) res.json(requestError)
    else if (decoded === undefined) res.json(internalError)
    else if (decoded.accessLevel === 3) itemModel.create({
        name, description, price, image, category, ingredients, sizes
    }).then(() => {
        res.json({
            message: `item adicionada: ${name}`,
            status: 200,
            success: true
        })
    }).catch(err => {
        res.json(internalError)
    })
    else res.json(permissionError)
})

//Delete item
router.delete('/item', (req, res) => {
    const { id, token } = req.body
    const decoded = verifyAndDecode(token)
    if (!id) res.json(requestError)
    else if (decoded === undefined) res.json(internalError)
    else if (decoded.accessLevel === 3) itemModel.findByIdAndDelete(id)
        .then(() => {
            res.send(`item deletada: ${id}`)
        })
        .catch(err => {
            res.json(internalError)
        })
    else res.json(permissionError)
})

//Update item
router.put('/item', (req, res) => {
    const { token, name, description, price, image, category, ingredients, sizes, id } = req.body;
    const decoded = verifyAndDecode(token)
    if (!id) res.json(requestError)
    else if (decoded === undefined) res.json(internalError)
    else if (decoded.accessLevel === 3) itemModel.findByIdAndUpdate(id, {
        name, description, price, image, category, ingredients, sizes
    }, { new: true }, (err, item) => {
        if (err) res.json(internalError)
        else res.send(`item ${pizza.name} changed`)
    })
    else res.json(permissionError)
})

module.exports = router