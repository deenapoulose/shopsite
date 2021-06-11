const express =require('express');
const expressAsyncHandler =require('express-async-handler');
const  data =require( '../data.js');
const locs=require('../models/LocationModel');

const productRouter = express.Router();



productRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const products = await locs.find({});
    res.send(products);
  })
);

productRouter.get(
  '/seed',
  expressAsyncHandler(async (req, res) => {
    // await Product.remove({});
    const createdProducts = await locs.insertMany(data.place);
    res.send({ createdProducts });
  })
);

productRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const product = await locs.findById(req.params.id);
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: 'location Not Found' });
    }
  })
);

productRouter.post(
  '/',
 
  expressAsyncHandler(async (req, res) => {
    const product = new locs({
      name: 'sample name '+Date.now() ,
      latitude:750222,
      longitude:455,
      location: { type: "Point", coordinates: [ -73.9375, 40.8303 ] },
      image: '/images/l22.jpg',
      category: 'sample category',
     
    });
   const createdloc = await  product .save();
    // const createdloc = await locs.insertOne(product);
    res.send({ message: 'loc Created', product: createdloc });
  })
);
productRouter.put(
  '/:id',
  
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await locs.findById(productId);
    if (product) {
      product.name = req.body.name;
      product.latitude= req.body.lati;
      product.longitude=req.body.long;
      product.image = req.body.image;
      product.category = req.body.category;
      product.location= { type: "Point", coordinates: [ req.body.lati, req.body.long ] }
      
      const updatedProduct = await product.save();
      res.send({ message: 'loc Updated', product: updatedProduct });
    } else {
      res.status(404).send({ message: 'loc Not Found' });
    }
  })
);

productRouter.delete(
  '/:id',
  
  expressAsyncHandler(async (req, res) => {
    const product = await locs.findById(req.params.id);
    if (product) {
      
     const deleteProduct = await product.remove();
      res.send({ message: 'locs Deleted', product: deleteProduct });
    } else {
      res.status(404).send({ message: 'locs Not Found' });
    }
  })
);
productRouter.post("/read", async(req, res) => {
  const lang= req.body.lang;
  const long =  req.body.long;
  const km = req.body.km;
  console.log(km)
  
  await locs.find({
      location:
      { $geoWithin: { $center: [ [lang, long], km] } }
    
  }, (err, result) => {
    if (err) console.log(err);
    else {
      res.send(result);
    }
  });
});


module.exports=productRouter;