const OrderItems  = require("../../models/orderItem.model");
const  Order  = require("../../models/order.model");
const express = require('express');
const { default: mongoose } = require("mongoose");
const { 
    httpGetOrders,
    httpGetOrder,
    httpPostOrder,
    httpUpdateOrder,
    httpDeleteOrder,
    httpGetTotalSales,
    httpGetOrdersCount,
    httpGetUserOrders,
} = require("./order.controller");
const router = express.Router();


router.get('/' , httpGetOrders);

router.get('/:id' , httpGetOrder);

router.get('/get/totalsales' , httpGetTotalSales);

router.get('/get/count' , httpGetOrdersCount);

router.get('/get/userorders/:userId' , httpGetUserOrders);


router.post('/' , httpPostOrder);

router.put('/:id' , httpUpdateOrder);


router.delete('/:id' , httpDeleteOrder);


module.exports = router;