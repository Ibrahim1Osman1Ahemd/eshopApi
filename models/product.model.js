const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    richDescription:{
        type: String,
        default: false,
    },
    image: {
        type: String,
        default: '',
    },  
    images: [{
        type: String,
        default: '',
    }],
    brand: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    countInStock: {
        type: Number,
        required: true,
        min: 0 ,
        max: 255    
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    rating: {
        type: Number,
        default: 0,
    },
    numReviews: {
        type: Number,
        default: 0,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    }
});

productSchema.set('toJSON' , {
    virtuals: true,
})
productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

const Product = mongoose.model('Product' , productSchema);

module.exports = Product