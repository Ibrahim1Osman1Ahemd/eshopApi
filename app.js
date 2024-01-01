PORT = 8080;
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const authJwt = require('./helpres/jwt')
const errHandler = require('./helpres/errorHandler');
const app = express();
require('dotenv/config');

app.use(cors({
    origin: '*'
}))
// middleware
app.use(express.json());
app.use(morgan('tiny'))
app.use(authJwt())
app.use(errHandler)
app.use(express.static('public'));


//Routers
const API = process.env.API_URL;


const productsRouter = require('./routers/prodcuts.router');
const usersRouter = require('./routers/users.router');
const ordersRouter = require('./routers/orders.router');
const categoriesRouter = require('./routers/categories.router');

app.use(`${API}/products` , productsRouter);
app.use(`${API}/users` , usersRouter);
app.use(`${API}/orders` , ordersRouter);
app.use(`${API}/categories` , categoriesRouter);


mongoose.connect(process.env.LOCAL_CONNECTION_URL)
.then(() => {
    console.log('Database connection is ready');
})
.catch((err) => {
    console.log(err.message)
})

app.listen(PORT , () => console.log(`Listenig on port: ${PORT}`))

