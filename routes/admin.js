const Router = require('express');

const router = Router();
const User = require("../models/admin")

router.get("/", (req, res) => {
    return res.render("signup");  
});

router.get("/signin",(req,res)=>{
    return res.render("signin"); 
})
router.get("/signup",(req,res)=>{
    return res.render("signup");
})

router.post("/", async(req,res)=>{
    const {fullname, email, password} = req.body;
    try {
        await User.create({ fullname, email, password });
        return res.render("dashboard"); 
    } catch (err) {
        console.error("Signup error:", err.message);
        return res.status(500).send("Error during signup");
    }
    
})


module.exports = router;
