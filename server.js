const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const session = require("express-session");

dotenv.config();
const app = express();

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,   // 🔥 IMPORTANT
    cookie: {
        secure: false
    }
}));

// Static files
app.use(express.static(path.join(__dirname, "views")));

// ================= MONGODB =================
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// ================= MODELS =================
const User = require("./Models/User");
const Contact = require("./Models/Contact");

// ================= PROTECT MIDDLEWARE =================
const protect = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    next();
};

// ================= ROUTES =================

const sendPage = (page) => (req, res) => {
    res.sendFile(path.join(__dirname, "views", page));
};

// PUBLIC ROUTES
app.get("/login", sendPage("login.html"));
app.get("/signup", sendPage("signup.html"));

// PROTECTED ROUTES
app.get("/", protect, sendPage("login.html"));
app.get("/index", protect, sendPage("index.html"));
app.get("/aboutus", protect, sendPage("aboutus.html"));
app.get("/contact", protect, sendPage("contact.html"));
app.get("/shopnow", protect, sendPage("shopnow.html"));
app.get("/mobile", protect, sendPage("mobile.html"));
app.get("/accessories", protect, sendPage("accessories.html"));
app.get("/cover", protect, sendPage("cover.html"));
app.get("/iphone", protect, sendPage("iphone.html"));
app.get("/samsung", protect, sendPage("samsung.html"));
app.get("/realme", protect, sendPage("realme.html"));
app.get("/iqoo", protect, sendPage("iqoo.html"));
app.get("/narzo", protect, sendPage("narzo.html"));
app.get("/redmi", protect, sendPage("redmi.html"));
app.get("/oppo", protect, sendPage("oppo.html"));
app.get("/poco", protect, sendPage("poco.html"));
app.get("/vivo", protect, sendPage("vivo.html"));

// ================= SIGNUP =================
app.post("/signup", async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.send("User already exists ❌");
        }

        const newUser = new User({ email, password });
        await newUser.save();

        res.redirect("/login"); // ✅ signup nantar login page
    } catch (err) {
        console.log(err);
        res.status(500).send("Signup Error");
    }
});

// ================= LOGIN =================
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) return res.send("User not found ❌");

        if (user.password !== password)
            return res.send("Wrong password ❌");

        // ✅ session set
        req.session.user = user;

        // 🔥 FORCE SAVE (fix)
        req.session.save(() => {
            res.redirect("/");
        });

    } catch (err) {
        console.log(err);
        res.status(500).send("Login Error");
    }
});

// ================= LOGOUT =================
app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
});

// ================= CONTACT =================
app.post("/contact", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        const newMessage = new Contact({ name, email, message });
        await newMessage.save();

        res.send("Message Sent Successfully ✅");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error saving message");
    }
});

// ================= SERVER =================
const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
