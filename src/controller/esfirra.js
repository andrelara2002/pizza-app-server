const express = require('express');
const router = express.Router();
const esfirraModel = require('../model/esfirra');
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
    message: 'Error, you do not have permission to do this action',
    status: 500
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
    const { token, name, description, price, image, category, ingredients } = req.body;
    const decoded = verifyAndDecode(token)
    if (!name) res.json(requestError)
    else if (decoded === undefined) res.json(internalError)
    else if (decoded.accessLevel === 3) esfirraModel.create({
        name, description, price, image, category, ingredients
    }, (err, esfirra) => {
        if (err) res.json(internalError);
        else res.json(esfirra);
    })
    else res.json(permissionError)
})

//Update esfirra
router.put('/esfirra', (req, res) => {
    const { token, id, name, description, price, image, category, ingredients } = req.body;
    const decoded = verifyAndDecode(token)
    if (!id) res.json(requestError);
    else if (decoded === undefined) res.json(internalError)
    else if (decoded.accessLevel === 3)
        esfirraModel.findByIdAndUpdate(id, {
            name, description, price, image, category, ingredients
        }, (result, err) => {
            if (err) res.json(internalError)
            else res.send(`Esfirra updated: ${name}`)
        })
    else res.json(permissionError)
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