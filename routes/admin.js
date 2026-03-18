const Router = require('express');
const router = Router();
const User = require("../models/admin")
const Blog = require("../models/blog");


const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads");
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });



router.get("/", (req, res) => {
    return res.render("signin");
})
router.get("/", async (req, res) => {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.render("home", { blogs });
});

router.post("/", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.matchedhash(email, password);
        res.redirect("/admin/dashboard");
    } catch (error) {
        res.status(401).send(error.message);
    }
});


router.get("/signup", (req, res) => {
    return res.render("signup");
});

router.post("/signup", async (req, res) => {
    const { fullname, email, password } = req.body;
    try {
        await User.create({ fullname, email, password, role: "ADMIN" });
        console.log(User)
    } catch (err) {
        return res.status(500).send("Error during signup");
    }
    return res.redirect("/admin");
})


router.get("/dashboard", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const blogsOnPerPage = 5;

    const blogs = await Blog.find()
        .skip((page - 1) * blogsOnPerPage)
        .limit(blogsOnPerPage)
        .sort({ createdAt: -1 });

    const totalBlogs = await Blog.countDocuments();
    const totalPages = Math.ceil(totalBlogs / blogsOnPerPage);

    const startSerial = (page - 1) * blogsOnPerPage + 1;

    res.render("dashboard", { blogs, totalPages, page, startSerial });
});

router.get("/dashboard/add", async (req, res) => {
    res.render("add.ejs");
})

router.post("/dashboard/add", upload.single("profileImage"), async (req, res) => {
    console.log("➡️ Request received");

    try {
        console.log("FILE:", req.file);
        console.log("BODY:", req.body);

        if (!req.file) {
            return res.status(400).send("File not uploaded ❌");
        }

        const { title, content, author } = req.body;

        const imagePath = `/uploads/${req.file.filename}`;

        await Blog.create({
            title,
            content,
            author,
            image: imagePath
        });

        console.log("✅ Blog saved");

        return res.redirect("/admin/dashboard");  // MUST return

    } catch (err) {
        console.error("❌ ERROR:", err);
        return res.status(500).send(err.message);
    }
});
router.get("/dashboard/:id", async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    res.render("render.ejs", { blog });
});
router.get("/dashboard/update/:id", async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    res.render("update", { blog });
});


router.post("/dashboard/update/:id", async (req, res) => {
    const { title, content, author } = req.body;
    await Blog.findByIdAndUpdate(req.params.id, { title, content, author })
    res.redirect("/admin/dashboard");
});

router.post("/dashboard/delete/:id", async (req, res) => {
    await Blog.findByIdAndDelete(req.params.id)
    res.redirect("/admin/dashboard");
});



module.exports = router;
