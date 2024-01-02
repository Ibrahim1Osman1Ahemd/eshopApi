
const Category = require('../../models/category.model');
const Product = require('../../models/product.model');
const mongoose = require('mongoose')


async function httpGetProducts (req,res)  {
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
}



async function httpGetProduct (req,res) {
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
}


async function httpPostProduct (req,res)  {
    try{
        console.log(req.path)

        const category = await Category.findById(req.body.category);
        
        if(!category) return res.status(400).json({
            success: false,
            message: 'Invalid Category!'
        });

        const file = req.file;
        if(!file) return res.status(400).json({
            message: 'No image in the request'
        })

        const fileName = req.file.filename;
        console.log(fileName)
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`
        let product = new Product({
            name : req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image : `${basePath}${fileName}`,
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
}


async function httpUpdateProduct (req,res) {
    try{
        if(!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({
            message: 'Invalid product id!',
            success: false
        })
        const category = await Category.findById(req.body.category);
        console.log(category)
            
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
};


async function httpDeleteProduct (req,res) {
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
}

async function httpGetFeaturedCount (req,res) {
    const count = req.params.count || 5
    const productCount = await Product.find({isFeatured: true}).limit(+count);
    if(!productCount) {
        res.status(500).json({success: false})
    }
    res.json({
        productCount : productCount,
    });
}

async function httpGetProductsCount  (req,res)  {
    const productCount = await Product.countDocuments();
    if(!productCount) {
        res.status(500).json({success: false})
    }
    res.json({
        productCount : productCount,
    });
}


async function httpUpdateGallery (req,res)  {
    try{
        if(!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({
            message: 'Invalid product id!',
            success: false,
            id : req.params.id
        })
        const files = req.files
        if(!files) return res.status(400).json({
            message: 'There are no files in ht requset!'
        });
        const imagesPaths = [];
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`
        
        if(files) {
            files.map(file => {
                imagesPaths.push(`${basePath}${file.filename}`)
            });
        }
        const product = await Product.findByIdAndUpdate(req.params.id , {
            images: imagesPaths
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
}
module.exports = {
    httpGetProducts,
    httpGetProduct,
    httpPostProduct,
    httpUpdateProduct,
    httpDeleteProduct,
    httpGetFeaturedCount,
    httpGetProductsCount,
    httpUpdateGallery,
}