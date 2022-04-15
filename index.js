const express = require("express");
const cors = require("cors");
require("./db/config");
const User = require("./db/User");
const Product = require("./db/Product");
const res = require("express/lib/response");
// const res = require("express/lib/response");

const Jwt = require('jsonwebtoken');
const jwtKey = 'e-comm';

const app = express();

app.use(express.json());
app.use(cors());

app.post("/register", async (req, resp) => {
  let users = new User(req.body);
  let result = await users.save();
  result = result.toObject();
  delete result.password;
    Jwt.sign({result}, jwtKey,{expiresIn: "2h"}, (err, token)=>{
        resp.send({ result ,auth : token});
      })
});

app.post("/login", async (req, resp) => {
  if (req.body.password && req.body.email) {
    let user = await User.findOne(req.body).select("-password");
    if (user) {
      Jwt.sign({user}, jwtKey,{expiresIn: "2h"}, (err, token)=>{
        resp.send({ user ,auth : token});
      })
    } else {
      resp.send({ result: "No User Found" });
    }
  }
});

app.post("/add-product", async (req, resp) => {
  let product = new Product(req.body);
  let result = await product.save();
  resp.send(result);
});

app.get("/productsList", async (req, resp)=>{
  let productsList = await Product.find();
  if(productsList.length>0){
    resp.send(productsList)
  }
  else{
    resp.send({result: "Products not Found"})
  }
});

app.delete("/product/:id", async (req, resp)=>{
  const result = await  Product.deleteOne({_id:req.params.id});
  resp.send(result);
});

app.get("/product/:id", async (req, resp)=>{
  const result = await Product.findOne({_id:req.params.id});
 if(result){
  resp.send(result);
 } else{
   resp.send({result: "No Record Found"})
 }
});

app.put("product/:id", async (req, resp)=>{
  let result = await Product.updateOne(
    {_id: req.params.id},
    {
      $set: req.body
    }
  )
  resp.send(result)
})

app.listen(5000);
