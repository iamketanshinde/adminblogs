const express = require('express');
const path = require('path');
const mongoose = require("mongoose");

const Blog = require("./models/blog");
const adminroute = require("./routes/admin");

const app = express();
const PORT = 3000;

/* ================== MIDDLEWARE ================== */

// Parse form data
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));


/* ================== VIEW ENGINE ================== */

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


/* ================== DATABASE ================== */

mongoose.connect("mongodb://127.0.0.1:27017/adminblogs", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1); // stop server if DB fails
    });


/* ================== ROUTES ================== */

// Home Page
app.get("/", async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.render("home", { blogs });
    } catch (err) {
        console.error("Error fetching blogs:", err);
        res.status(500).send("Internal Server Error");
    }
});

// Logout
app.get("/logout", (req, res) => {
    res.redirect("/admin");
});

// Admin Routes
app.use("/admin", adminroute);


/* ================== ERROR HANDLING ================== */

// 404 Page
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("🔥 FULL ERROR:", err);   // full error in terminal
    res.status(500).send(err.message);      // show actual message in browser
});


/* ================== SERVER ================== */

app.listen(PORT, () => {
    console.log(`🚀 Server Running at: http://localhost:${PORT}`);
});