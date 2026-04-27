const express = require('express');
const path = require('path');
const mongoose = require("mongoose");
const session = require("express-session");

const Blog = require("./models/blog");
const User = require("./models/admin");
const adminroute = require("./routes/admin");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

app.use(session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: false
}));

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

app.set("view engine", "ejs");

mongoose.connect("mongodb://127.0.0.1:27017/adminblogs");

// HOME
app.get("/", async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.render("home", { blogs });
    } catch (error) {
        console.log(error);
        res.send("Error loading home page");
    }
});

app.get("/admin/dashboard", async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const totalBlogs = await Blog.countDocuments();
        const blogs = await Blog.find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        res.render("dashboard", {
            blogs,
            page,
            totalBlogs
        });
    } catch (error) {
        console.log(error);
        res.send("Error loading dashboard");
    }
});



// AUTH
app.get("/signin", (req, res) => res.render("signin"));
app.get("/signup", (req, res) => res.render("signup"));

// LOGIN
app.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.matchedhash(email, password);

        req.session.user = user;

        if (user.role === "ADMIN") return res.redirect("/admin/dashboard");

        return res.redirect("/");
    } catch {
        return res.send("Invalid Login ❌");
    }
});

// SIGNUP USER
app.post("/signup", async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        const existing = await User.findOne({ email });
        if (existing) return res.send("User already exists ❌");

        await User.create({ fullname, email, password, role: "USER" });

        return res.redirect("/signin");
    } catch {
        return res.send("Signup Error ❌");
    }
});

// LOGOUT
app.get("/logout", (req, res) => {
    req.session.destroy(() => res.redirect("/"));
});

// ADMIN ROUTE
app.use("/admin", adminroute);

// SERVER
app.listen(3000, () => console.log("http://localhost:3000"));