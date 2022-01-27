const express = require('express');
const router = express.Router();
const esfirraModel = require('../model/esfirra');

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

//Get all esfirras
router.get('/esfirra', (req, res) => {
    esfirraModel.find({}, (err, esfirras) => {
        if (err) res.json(internalError);
        else res.json(esfirras);
    });
})

//Get esfirra by id
router.get('/esfirra/getbyid', (req, res) => {
    const { id } = req.body;
    if (!id) res.json(requestError);
    esfirraModel.findById(id, (err, esfirra) => {
        if (err) res.json(internalError);
        else res.json(esfirra);
    })
})

//Get esfirra by name
router.get('/esfirra/getbyname', (req, res) => {
    const { name } = req.body;
    if (!name) res.json(requestError);
    esfirraModel.find({ name: new RegExp(name, 'i') }, (err, esfirra) => {
        if (err) res.json(internalError);
        else res.send(esfirra);
    })
})

//Add new esfirra
router.post('/esfirra', (req, res) => {
    const { name, description, price, image, category, ingredients } = req.body;
    if (!name) res.json(requestError)
    esfirraModel.create({
        name, description, price, image, category, ingredients
    }, (err, esfirra) => {
        if (err) res.json(internalError);
        else res.json(esfirra);
    })
})

//Update esfirra
router.put('/esfirra', (req, res) => {
    const { id, name, description, price, image, category, ingredients } = req.body;
    if (!id) res.json(requestError);
    esfirraModel.findByIdAndUpdate(id, {
        name, description, price, image, category, ingredients
    }, (result, err) => {
        if (err) res.json(internalError)
        else res.send(`Esfirra updated: ${name}`)
    })
})

//Delete esfirra
router.delete('/esfirra', (req, res) => {
    const { id } = req.body;
    if (!id) res.json(requestError);
    esfirraModel.findByIdAndDelete(id)
        .then(() => {
            res.send(`Esfirra ${id} deleted`);
        })
        .catch(err => {
            res.json(internalError)
        })
})

module.exports = router