const express = require('express');
const path = require('path');
const adminroute = require("./routes/admin")

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views",path.resolve('./views'));


app.get("/",(req,res) => {
    res.render("dashboard")
})

app.use("/admin",adminroute)


app.listen(PORT,()=>console.log(`Server Running On :- ${PORT} !!.`));