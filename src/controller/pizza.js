const express = require('express');
const router = express.Router();
const pizzaModel = require('../model/pizza');
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

//Get all pizzas
router.get('/pizza', (req, res) => {
    pizzaModel.find({}, (err, pizzas) => {
        if (err) res.json(internalError);
        else res.json(pizzas);
    });
})

//Get pizza by id
router.get('/pizza/findbyid', (req, res) => {
    const { id } = req.body;
    if (!id) res.json(requestError);
    pizzaModel.findById(id, (err, pizza) => {
        if (err) res.json(internalError);
        else res.json(pizza);
    })
})

//Get pizza by name
router.get('/pizza/findbyname', (req, res) => {
    const { name } = req.body;
    if (!name) res.json(requestError);
    pizzaModel.find({ name: new RegExp(name, 'i') }, (err, pizza) => {
        if (err) res.json(internalError);
        else res.send(pizza);
    })
})

//Get pizza by category
router.get('/pizza/findbycategory', (req, res) => {
    const { category } = req.body;
    if (!category) res.json(requestError)
    pizzaModel.find({ category }, (err, pizza) => {
        if (err) res.json(internalError);
        else res.send(pizza)
    })
})

//Add new pizza
router.post('/pizza', (req, res) => {
    const { token, name, description, price, image, category, ingredients, sizes } = req.body;
    const decoded = verifyAndDecode(token)
    if (!name) res.json(requestError)
    else if (decoded === undefined) res.json(internalError)
    else if (decoded.accessLevel === 3) pizzaModel.create({
        name, description, price, image, category, ingredients, sizes
    }).then(() => {
        res.json({
            message: `Pizza adicionada: ${name}`,
            status: 200,
            success: true
        })
    }).catch(err => {
        res.json(internalError)
    })
    else res.json(permissionError)
})

//Delete pizza
router.delete('/pizza', (req, res) => {
    const { id, token } = req.body
    const decoded = verifyAndDecode(token)
    if (!id) res.json(requestError)
    else if (decoded === undefined) res.json(internalError)
    else if (decoded.accessLevel === 3) pizzaModel.findByIdAndDelete(id)
        .then(() => {
            res.send(`Pizza deletada: ${id}`)
        })
        .catch(err => {
            res.json(internalError)
        })
    else res.json(permissionError)
})

//Update pizza
router.put('/pizza', (req, res) => {
    const { token, name, description, price, image, category, ingredients, sizes, id } = req.body;
    const decoded = verifyAndDecode(token)
    if (!id) res.json(requestError)
    else if (decoded === undefined) res.json(internalError)
    else if (decoded.accessLevel === 3) pizzaModel.findByIdAndUpdate(id, {
        name, description, price, image, category, ingredients, sizes
    }, { new: true }, (err, pizza) => {
        if (err) res.json(internalError)
        else res.send(`Pizza ${pizza.name} changed`)
    })
    else res.json(permissionError)
})

module.exports = router