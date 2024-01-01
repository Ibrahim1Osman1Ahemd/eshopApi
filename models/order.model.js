const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderItems: [{
        type: mongoose.Types.ObjectId,
        ref: 'OrderItem',
        required: true,
    }],
    sippingAddress1: {
        type: String,
        required: true,
    },
    sippingAddress2: {
        type: String,
    },
    city: {
        type: String,
        required: true,
    },
    zip: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: 'Pending',
    },
    totalPrice: {
        type: Number,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    dateOrderd: {
        type: Date,
        default: Date.now,
    }
});
orderSchema.set('toJSON' , {
    virtuals: true,
})
orderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
const Order = mongoose.model('Order' , orderSchema);

module.exports = Order;