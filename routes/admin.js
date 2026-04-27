const express = require('express');
const router = express.Router();

const User = require("../models/admin");
const Blog = require("../models/blog");

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "public/uploads"),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

function isAdmin(req, res, next) {
    if (!req.session.user || req.session.user.role !== "ADMIN") {
        return res.redirect("/");
    }
    next();
}

router.get("/", (req, res) => {
    res.render("signin");
});

router.post("/", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.matchedhash(email, password);

        req.session.user = user;

        if (user.role !== "ADMIN") return res.send("Not Admin ❌");

        return res.redirect("/admin/dashboard");
    } catch {
        return res.send("Admin Login Failed ❌");
    }
});

// SIGNUP ADMIN (ONE TIME ONLY)
router.get("/signup", async (req, res) => {
    const admin = await User.findOne({ role: "ADMIN" });
    if (admin) return res.send("Admin already exists ❌");

    res.render("signup");
});

router.post("/signup", async (req, res) => {
    const admin = await User.findOne({ role: "ADMIN" });
    if (admin) return res.send("Admin already exists ❌");

    const { fullname, email, password } = req.body;

    await User.create({ fullname, email, password, role: "ADMIN" });

    res.redirect("/admin");
});

// DASHBOARD
router.get("/dashboard", isAdmin, async (req, res) => {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.render("dashboard", { blogs, page: 1 });
});

// ADD BLOG
router.get("/dashboard/add", isAdmin, (req, res) => {
    res.render("add");
});

router.post("/dashboard/add", isAdmin, upload.single("profileImage"), async (req, res) => {
    const { title, content, author } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : "";

    await Blog.create({ title, content, author, image });

    res.redirect("/admin/dashboard");
});

// VIEW
router.get("/dashboard/:id", isAdmin, async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    res.render("render", { blog });
});

// UPDATE PAGE
router.get("/dashboard/update/:id", isAdmin, async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    res.render("update", { blog });
});

// UPDATE POST
router.post("/dashboard/update/:id", isAdmin, upload.single("profileImage"), async (req, res) => {
    const { title, content, author } = req.body;

    const updateData = { title, content, author };

    if (req.file) {
        updateData.image = `/uploads/${req.file.filename}`;
    }

    await Blog.findByIdAndUpdate(req.params.id, updateData);

    res.redirect("/admin/dashboard");
});

// DELETE
router.post("/dashboard/delete/:id", isAdmin, async (req, res) => {
    await Blog.findByIdAndDelete(req.params.id);
    res.redirect("/admin/dashboard");
});

module.exports = router;