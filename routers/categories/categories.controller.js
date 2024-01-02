const Category = require("../../models/category.model");



async function httpGetCategories (req,res)  {
    const categoryList = await Category.find();

    if(!categoryList) {
        return res.status(500).json({
            success: false,
        })
    }
    return res.json(categoryList)
};

async function httpGetCategory (req,res) {
    try{
        const category = await Category.findById(req.params.id);
        if(!category) return res.status(404).json({
            message: 'The category with the given id is not found',
            success: false,
        })
        return res.status(200).json(category);

    }catch(err){
        console.log(err.message)
        res.end(err.message)
    }
}


async function httpPostCategory (req,res)  {
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.icon,
    });
    category = await category.save();
    if(!category) 
        return res.status(500).send('Category cann\'t be created try again letter!');


    res.status(201).send(category)
}

async function httpUpdateCategory (req,res)  {
    const category = await Category.findByIdAndUpdate(req.params.id , {
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
    }, {
        new: true,
    });
    if(!category) return res.status(404).json({
        success: false,
        message: 'The category with the given id is not found',
    });

    return res.status(200).json(category);
}

async function httpDeleteCategory (req,res)  {

    try {
        const _id = req.params.id;
        const category = await Category.findByIdAndDelete(_id);
        if (!category) return res.status(404).json({success: false , message: 'Category not found'});
        return res.status(200).json(({
            success: true,
            message: 'The category is deleted',
        }));
    } catch (err) {
    return res.status(400).json({
        success: false, 
        err: err.message
    });
    }
}
module.exports = {
    httpGetCategories,
    httpGetCategory,
    httpPostCategory,
    httpUpdateCategory,
    httpDeleteCategory,
}