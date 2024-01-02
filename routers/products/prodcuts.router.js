const express = require('express');
const router = express.Router();
const {
    httpGetProducts, 
    httpGetProduct,
    httpPostProduct,
    httpUpdateProduct,
    httpDeleteProduct,
    httpGetFeaturedCount,
    httpGetProductsCount,
    httpUpdateGallery,
} = require('./products.controller');


const uploadOptions = require('../../helpers/mutler')


router.get(`/` , httpGetProducts);

router.get(`/:id` , httpGetProduct);

router.get('/get/count' , httpGetProductsCount);

router.get('/get/featured/:count'  , httpGetFeaturedCount);

router.post(`/` , uploadOptions.single('image'),httpPostProduct);

router.put('/:id' , httpUpdateProduct);

router.delete('/:id' ,httpDeleteProduct);




router.put('/gallery0images/:id' , uploadOptions.array('images') , httpUpdateGallery);
module.exports = router;