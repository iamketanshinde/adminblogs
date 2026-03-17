const express = require('express');
const path = require('path');
const Blog = require("./models/blog")
const adminroute = require("./routes/admin");

const app = express();
const PORT = 3000;
const mongoose = require("mongoose");
const User = require('./models/admin');

app.set("view engine", "ejs");
app.set("views", path.resolve('./views'));

mongoose.connect("mongodb://127.0.0.1:27017/adminblogs")
    .then(e => console.log("MongoDb Connected On 27017 !!."))
    .catch(Error => console.log(`${Error} in MongoDb Connection?`));

app.use(express.urlencoded({ extended: false }));

app.get("/logout", (req, res) => {
    res.redirect("/admin");
});

app.get("/", async (req, res) => {

    const blogs = await Blog.find().sort({ createdAt: -1 });

    res.render("home", { blogs });

});

app.get("/", (req, res) => {
    res.render("home.ejs");
});

app.use(express.static(path.join(__dirname, "public")));


app.use("/admin", adminroute)


app.listen(PORT, () => console.log(`Server Running On :- ${PORT} !!.`));