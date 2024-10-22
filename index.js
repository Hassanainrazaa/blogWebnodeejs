const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const Blog = require("./models/blogModel");

const userRoute = require("./routes/userRouter");
const blogRoute = require("./routes/blogRouter");


const { checkForAuthenticationCookies } = require('./middleware/authentication');

const app = express();
const PORT = 8001;
mongoose.connect("mongodb://localhost:27017/blogify").then(console.log("DB Connection established"));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"));
app.use(express.urlencoded({ extended: false }));
app.use(checkForAuthenticationCookies("token"));
app.use(express.static(path.resolve("./public")));


app.use('/user', userRoute);
app.use('/blog', blogRoute);

app.get('/', async (req, res) => {
    const allBlogs = await Blog.find({});
    res.render('home', {

        user: req.user,
        blogs: allBlogs,
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});