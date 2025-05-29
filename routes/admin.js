const Router = require('express');

const router = Router();
const Admin = require("../models/admin")

router.get("/signin",(req,res)=>{
    return res.render("signin");
})
router.get("/admin",(req,res)=>{
    return res.render("signup");
})

router.post("/signup", async(req,res)=>{
    const {fullname, email, password} = req.body;
    await Admin.create({
        fullname,
        email,
        password,
    });
    return res.redirect("/")
})

module.exports = router;
