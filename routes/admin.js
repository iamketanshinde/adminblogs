const Router = require('express');
const router = Router();
const User = require("../models/admin");
const User = require("../models/blog");

router.get("/",(req,res)=>{
    return res.render("signin"); 
})


router.post("/",(req, res)=>{
    const {email, password} = req.body;
    const user = User.matchedhash(email, password);
    console.log("user", user);
    return res.redirect("admin/dashboard")
})

router.get("/signup", (req, res) => {
    return res.render("signup");  
});  

router.post("/signup", async(req,res)=>{
    const {fullname, email, password} = req.body;
    try {
        await User.create({ fullname, email, password });
    } catch (err) {
        console.error("Signup error:", err.message);
        return res.status(500).send("Error during signup");
    }
    return res.redirect("/admin"); 
})


router.get("/admin/dashboard/add",(req,res)=>{
    return res.render("add.ejs");
})


module.exports = router;
