const { default: mongoose } = require("mongoose");
const Order = require("../../models/order.model");
const OrderItems = require('../../models/orderItem.model')



async function httpGetOrders (req,res) {
    try{
        const orderList = await Order.find().populate('user','name').sort({'dateCreated':1});
    
        if(!orderList) {
            return res.status(500).json({
                success: false,
            })
        }
        return res.json(orderList)   
    }catch (err){
        console.log(err.message)
        res.end(err.message)
    }
}


async function httpGetOrder (req,res) {
    try{
        const id = req.params.id;
        if(!mongoose.isValidObjectId(id)) return res.status(404).json({
            message: 'The order wasn\'t found',
        })
        const order = await Order.findById(id)
        .populate('user','name')
        .populate({
            path: 'orderItems' , populate: {
                path: 'product' , populate: 'category'
            }});
    
        if(!order) {
            return res.status(500).json({
                success: false,
            })
        }
        return res.json(order)   
    }catch (err){
        console.log(err.message)
        res.end(err.message)
    }
}



async function httpPostOrder (req,res) {

    const orderItemsIds = await Promise.all(req.body.orderItems.map(async orderItem => {
        let newOrderItem = new OrderItems({
            quantity: orderItem.quantity,
            product: orderItem.product,
        });
        console.log(orderItem)
        newOrderItem = await newOrderItem.save();
        return newOrderItem._id;
    }));
    console.log("ids",orderItemsIds)
    const totalPrices = await Promise.all(orderItemsIds.map(async (orderItemId) => {
        const orderItem = await OrderItems.findById(orderItemId).populate('product','price');
        const totalPrice = await orderItem.product.price * orderItem.quantity;
        return totalPrice;
    }));
    const totalPrice = totalPrices.reduce((a,b) => a+b,0)
    let order = new Order({
        orderItems:  orderItemsIds,
        sippingAddress1: req.body.sippingAddress1,
        sippingAddress2: req.body.sippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user,
    });
    order = await order.save();
    if(!order) return res.status(500)
    .send('Category cann\'t be created try again letter!');

    res.status(201).send(order)
}


async function httpUpdateOrder (req,res) {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id , {
            status: req.body.status,
        }, {
            new: true,
        });
        if(!order) return res.status(404).json({
            success: false,
            message: 'The order with the given id is not found',
        });
    
        return res.status(200).json(order);
        
    } catch (err) {
        console.log(er.message);
        res.end('There are err pleace try again letter')
    }
}


async function httpDeleteOrder (req,res)  {

    try {
        const _id = req.params.id;
        const order = await Order.findByIdAndDelete(_id).populate('orderItems');
        if (!order) return res.status(404).json({success: false , message: 'Order not found'});
        await order.orderItems.map(async orderItem => {
            await OrderItems.findByIdAndDelete(orderItem);
        })
        return res.status(200).json(({
            success: true,
            message: 'The order is deleted',
        }));
    } catch (err) {
    return res.status(400).json({
        success: false, 
        err: err.message
    });
    }
}

async function httpGetTotalSales (req,res)  {
    const totalsales = await Order.aggregate([{
        $group: {_id: null , totalsales: {$sum: '$totalPrice'}}
    }]);

    if(!totalsales) return res.status(400).json({
        message: 'Cann\'t be aggregate'
    });

    res.json({totalsales:totalsales.pop().totalsales})
}

async function httpGetOrdersCount (req,res)  {
    const orderCount = await Order.countDocuments();
    if(!orderCount) {
        res.status(500).json({success: false})
    }
    res.json({
        orderCount : orderCount,
    });
}

async function httpGetUserOrders (req,res)  {
    try{
        const id = req.params.userId;
        if(!mongoose.isValidObjectId(id)) return res.status(404).json({
            message: 'The user wasn\'t found',
        })
        const userOrdersList = await Order.find({user:req.params.userId})
        .populate({
            path: 'orderItems' , populate: {
                path: 'product' , populate: 'category'
            }});
    
        if(!userOrdersList) {
            return res.status(500).json({
                success: false,
            })
        }
        return res.json(userOrdersList)   
    }catch (err){
        console.log(err.message)
        res.end(err.message)
    }
}
module.exports = {
    httpGetOrders,
    httpGetOrder,
    httpPostOrder,
    httpUpdateOrder,
    httpDeleteOrder,
    httpGetTotalSales,
    httpGetOrdersCount,
    httpGetUserOrders,
}