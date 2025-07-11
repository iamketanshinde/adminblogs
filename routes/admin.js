const Router = require('express');
const router = Router();
const User = require("../models/admin");
const Blog = require("../models/blog");

router.get("/",(req,res)=>{
    return res.render("signin"); 
})


router.post("/",async (req, res)=>{
    const {email, password} = req.body;
    const user = await  User.matchedhash(email, password);
    // console.log("user", user);
    return res.redirect("/admin/dashboard")
});

router.get("/signup", (req, res) => {
    return res.render("signup");  
});  

router.post("/signup", async(req,res)=>{
    const {fullname, email, password} = req.body;
    try {
        await User.create({ fullname, email, password });
    } catch (err) {
        return res.status(500).send("Error during signup");
    }
    return res.redirect("/admin"); 
})


router.get("/dashboard", async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.render("dashboard", { blogs });
});

router.get("/dashboard/:id",async(req, res)=>{
    const blog = await Blog.findById(req.params.id);
    res.render("render.ejs",{blog});
})
router.get("/dashboard/update/:id",async(req, res)=>{
    const blog = await Blog.findById(req.params.id);
    res.render("update",{blog});
});


router.post("/dashboard/update/:id",async(req, res)=>{
    const {title,content, author} = req.body;
    await Blog.findByIdAndUpdate(req.params.id,{title,content,author})
    res.redirect("/admin/dashboard");
});

router.post("/dashboard/delete/:id",async(req, res)=>{
    await Blog.findByIdAndDelete(req.params.id)
    res.redirect("/admin/dashboard");
});


router.get("/admin/dashboard/add",(req,res)=>{
    res.render("add.ejs");
})

router.post("/dashboard/add", async (req, res) => {
    try {
        const { title, content, author } = req.body;
        await Blog.create({ title, content, author });
        console.log("form data:", req.body)
        return res.redirect("/admin/dashboard");
    } catch (error) {
        console.log(`error found while creating blog ${error}`);
        res.redirect("/admin/dashboard");
    }
});



module.exports = router;
