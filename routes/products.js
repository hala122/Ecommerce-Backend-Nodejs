const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const Product = require('../models/product');

/////////////////////////////////////////Add Product///////////////////////////

router.post('/',(req,res,next)=>{
    const{ userId,productName,description,price,discount,isOnSale,category}=req.body;
    const product = new Product({userId,productName,description,price,discount,isOnSale,category});
    product.save((err)=>{
        if(err) return next(createError(400,err));
        res.send(product);
    })

})

//////////////////////////////////////Get All Products///////////////////////

router.get('/',(req,res,next)=>{
    Product.find({}, function (err, products) {
        if(err) return next(createError(400,err));
        res.send(products);
    });
})
/////////////////////////////Get By Id////////////////////////////////////
router.get('/:productId',(req,res,next)=>{
    Product.findOne({_id:req.params.productId},(err,product)=>{
        if(err) return next(createError(err,400));
        res.send(product);
    })
})
////////////////////////////////////Update Product//////////////////////////////
router.patch('/:productId', async (req,res,next)=>{
    try{
      let productUpdated =  await Product.findByIdAndUpdate(req.params.productId,req.body);
      res.send(productUpdated); 
    } catch (err) {
      next(createError(400, err))
    }
    })

//////////////////////////////////Delete Product//////////////////////////////////
router.delete('/:productId',(req,res,next)=>{
    Product.findById(req.params.productId , (err , product)=>{
        if(err) return next(createError(400,err));
        product.remove(product,(err)=>{
            if(err) return next(createError(400,err));
        });
        res.send(product);
    })
})







module.exports = router;