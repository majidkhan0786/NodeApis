const express = require("express");
const cors = require("cors");
require("./db/config");
const User = require("./db/User");
const Product = require("./db/Product");
const res = require("express/lib/response");
const app = express();

app.use(express.json());
app.use(cors());

app.post("/register", async (req, resp) => {
  let users = new User(req.body);
  let result = await users.save();
  result = result.toObject();
  delete result.password;
  resp.send(result);
});

app.post("/login", async (req, resp) => {
  if (req.body.password && req.body.email) {
    let user = await User.findOne(req.body).select("-password");
    if (user) {
      resp.send(user);
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

app.patch("/updateData/:id", async (req, resp)=>{
  const result = await Product.updateOne({_id:req.params.id});
  resp.send("updating data ......");
});

app.listen(5000);
