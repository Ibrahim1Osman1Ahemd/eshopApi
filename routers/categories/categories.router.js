const express = require('express');
const router = express.Router();

const { 
    httpGetCategories,
    httpGetCategory,
    httpPostCategory,
    httpUpdateCategory,
    httpDeleteCategory,
} = require('./categories.controller');


router.get('/' , httpGetCategories)

router.get('/:id' , httpGetCategory);

router.post('/' , httpPostCategory);

router.put('/:id' , httpUpdateCategory);

router.delete('/:id' , httpDeleteCategory)

module.exports = router;