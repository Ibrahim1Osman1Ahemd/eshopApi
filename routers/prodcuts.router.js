const { default: mongoose } = require('mongoose');
const Category = require('../models/category.model');
const Product = require('../models/product.model');
const express = require('express');
const router = express.Router();


router.get(`/` , async(req,res) => {
    let filter = {};
    if(req.query.categories){
        filter  = {category: req.query.categories.split(',')}
    } 
    const productList = await Product.find(filter).populate('category');

    if(!productList) {
        return res.status(500).json({
            success: false,
        })
    }
    res.status(200).json(productList)
});

router.get(`/:id` , async(req,res) => {
    try{
        if(!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({
            success: false,
            message: 'Invalid product id!'
        })
        const product = await Product.findById(req.params.id).populate('category');
    
        if(!product) {
            return res.status(500).json({
                success: false,
                message: 'Invalid product id!'
            })
        }
        res.status(200).json(product)

    }catch(err){
        return res.status(500).json({
            err: err.message
        })
    }
});

router.post(`/` , async(req,res) => {
    try{
        const category = await Category.findById(req.body.category);
        
        if(!category) return res.status(400).json({
            success: false,
            message: 'Invalid Category!'
        });
        let product = new Product({
            name : req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image : req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.reting,
            numReviews: req.body.numReviews,
            isFeatured: true,
        })
        product = await product.save();

        if(!product) return res.status(500).json({
            success: false,
            message: 'Cann\'t created the product try again letter!',
        });

        return res.status(201).json(product);

    }catch (err) {
        console.log(err)
        return res.status(500).json({
            error: 'There some error pleace try again letter',
        })
    }
});

router.put('/:id' , async(req,res) => {
    try{
        if(mongoose.isValidObjectId(req.params.id)) return res.status(400).json({
            message: 'Invalid product id!',
            success: false
        })
        const category = await Category.findById(req.body.category);
            
        if(!category) return res.status(400).json({
            success: false,
            message: 'Invalid Category!'
        });
    
        const product = await Product.findByIdAndUpdate(req.params.id , {
            name : req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image : req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.reting,
            numReviews: req.body.numReviews,
            isFeatured: true,
        }, {
            new: true,
        });
        if(!product) return res.status(404).json({
            success: false,
            message: 'The product with the given id is not found',
        });
    
        return res.status(200).json({
            product,
            success: true,
        });
    }catch (err){
        res.status(500).json({
            success: false,
            error: err.message
        })
    }
});

router.delete('/:id' , async(req,res) => {
    try {
        const _id = req.params.id;
        const product = await Product.findByIdAndDelete(_id);
        if (!product) return res.status(404).json({success: false , message: 'Product not found'});
        return res.status(200).json(({
            success: true,
            message: 'The product is deleted',
        }));
    } catch (err) {
    return res.status(400).json({
        success: false, 
        err: err.message
    });
    }
});

router.get('/get/count' , async(req,res) => {
    const productCount = await Product.countDocuments();
    if(!productCount) {
        res.status(500).json({success: false})
    }
    res.json({
        productCount : productCount,
    });
});

router.get('/get/featured/:count'  , async(req,res) => {
    const count = req.params.count || 5
    const productCount = await Product.find({isFeatured: true}).limit(+count);
    if(!productCount) {
        res.status(500).json({success: false})
    }
    res.json({
        productCount : productCount,
    });
});
module.exports = router;