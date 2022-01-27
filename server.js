const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

console.clear();

mongoose.connect('mongodb://localhost:27017/user')
    .then(() => {
        console.log('Connected to database');
    })
    .catch(() => {
        console.log('Connection to database failed');
    })

const userController = require('./src/controller/user');
const esfirraController = require('./src/controller/esfirra')
const pizzaController = require('./src/controller/pizza')
const orderController = require('./src/controller/order')

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 3002;

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.listen(port)
    .on('listening', () => {
        console.log(`Server is running on port ${port}`);
    })
    .on('error', err => {
        console.log(`Error running server: ${err}`);
    })

app.use('/', userController);
app.use('/', esfirraController);
app.use('/', pizzaController)
app.use('/', orderController)