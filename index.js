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

app.use(express.urlencoded({extended:false}))

app.get("/", (req, res) => {
    res.render("home.ejs");
});

app.get("/admin/dashboard",(req,res) => {
    res.render("dashboard")
})
app.get("/dashboard/add",(req,res)=>{
    res.render("add.ejs")
})
app.use("/admin/",adminroute)


app.listen(PORT,()=>console.log(`Server Running On :- ${PORT} !!.`));