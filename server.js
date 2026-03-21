const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, "views")));

// MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Models
const User = require("./Models/User");
const Contact = require("./Models/Contact");

// ================= ROUTES =================

const sendPage = (page) => (req, res) => {
    res.sendFile(path.join(__dirname, "views", page));
};

app.get("/", sendPage("index.html"));
app.get("/login", sendPage("login.html"));
app.get("/signup", sendPage("signup.html"));
app.get("/aboutus", sendPage("aboutus.html"));
app.get("/contact", sendPage("contact.html"));
app.get("/shopnow", sendPage("shopnow.html"));
app.get("/mobile", sendPage("mobile.html"));
app.get("/accessories", sendPage("accessories.html"));
app.get("/cover", sendPage("cover.html"));
app.get("/iphone", sendPage("iphone.html"));
app.get("/samsung", sendPage("samsung.html"));
app.get("/realme", sendPage("realme.html"));
app.get("/iqoo", sendPage("iqoo.html"));
app.get("/narzo", sendPage("narzo.html"));
app.get("/redmi", sendPage("redmi.html"));
app.get("/oppo", sendPage("oppo.html"));
app.get("/poco", sendPage("poco.html"));
app.get("/vivo", sendPage("vivo.html"));

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

        res.redirect("/"); // FIX
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

        res.redirect("/"); // FIX
    } catch (err) {
        console.log(err);
        res.status(500).send("Login Error");
    }
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
