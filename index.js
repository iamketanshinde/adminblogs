const express = require('express');
const path = require('path');
const adminroute = require("./routes/admin")

const app = express();
const PORT = 3000;
const mongoose = require("mongoose");

app.set("view engine", "ejs");
app.set("views",path.resolve('./views'));
mongoose.connect("mongodb://127.0.0.1:27017/adminblogs")
.then(e => console.log("MongoDb Connected On 27017 !!."))
.catch(Error=> console.log(`${Error} in MongoDb Connection?`));

app.get("/",(req,res) => {
    res.render("dashboard")
})

app.use("/admin",(req,res)=>{
    res.render("signup")
},adminroute)


app.listen(PORT,()=>console.log(`Server Running On :- ${PORT} !!.`));