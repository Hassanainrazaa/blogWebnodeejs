const { Router } = require("express");
const User = require("../models/userModel");

const router = Router();

router.get("/signin", (req, res) => {
    return res.render("signin");
});

router.get("/signup", (req, res) => {
    return res.render("signup");
});

router.post("/signup", async (req, res) => {
    const { fullname, email, password } = req.body;
    await User.create({
        fullname,
        email,
        password
    });
    return res.redirect("/");
});

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user and validate password
        const token = await User.matchPasswords(email, password);

        // If successful, set session or return some response
        // req.session.userId = user._id;
        console.log(" token " + token);
        return res.cookie("token", token).redirect("/");

    } catch (error) {
        console.error(error.message);
        return res.render("signin", {
            error: error.message
        });
    }
});

router.get("/logout", (req, res) => {
    return res.clearCookie("token").redirect("/");

});

module.exports = router;
