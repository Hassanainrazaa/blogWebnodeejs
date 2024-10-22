// const { Router } = require("express");
// const Blog = require("../models/blogModel");
// const router = Router();
// const multer = require("multer");
// const path = require("path");


// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.resolve(`./public/uploads/`));
//     },
//     filename: function (req, file, cb) {
//         const uniquesuffix = Date.now() + `_` + file.originalname;
//         cb(null, uniquesuffix);
//     },
// });

// const upload = multer({ storage: storage });
// router.get("/add-new", (req, res) => {
//     return res.render("addBlog", {
//         user: req.user,
//     });
// });


// router.post("/", upload.single("coverImage"), async (req, res) => {
//     const { title, body } = req.body;
//     const blog = await Blog.create({
//         body,
//         title,
//         createdBy: req.user._id,
//         coverImage: `/uploads/${req.file.filename}`,

//     });
//     return res.redirect(`/blog/${blog._id}`);
// });

// module.exports = router;


const { Router } = require("express");
const Blog = require("../models/blogModel");
const Comment = require("../models/commentModel");

const router = Router();
const multer = require("multer");
const path = require("path");

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/uploads/`));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + `_` + file.originalname;
        cb(null, uniqueSuffix);
    },
});

const upload = multer({ storage: storage });

router.get("/add-new", (req, res) => {
    return res.render("addBlog", {
        user: req.user,
    });
});



// Handle the blog post creation
router.post("/", upload.single("coverImage"), async (req, res) => {
    const { title, body } = req.body;

    // Check if the file (cover image) is uploaded
    if (!req.file) {
        return res.render("addBlog", {
            error: "Cover image is required.",  // Display error message
            user: req.user, // Pass the user back to render the form correctly
            title,          // Pass back the title if it was already filled
            body,           // Pass back the body if it was already filled
        });
    }

    // Create the blog post if cover image is provided
    try {
        const blog = await Blog.create({
            body,
            title,
            createdBy: req.user._id,
            coverImageURL: `/uploads/${req.file.filename}`,  // Use correct field name
        });
        return res.redirect(`/blog/${blog._id}`);
    } catch (error) {
        return res.render("addBlog", {
            error: "Error creating blog post. Please try again.",
            user: req.user,
        });
    }
});

router.get("/:id", async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate('createdBy');
    const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy"); // Change this to 'comments'

    return res.render("blog", {
        user: req.user,
        blog,
        comments, // Now this will correctly refer to the comments variable
    });
});



///coments routes
router.post('/comment/:blogId', async (req, res) => {
    await Comment.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id,

    });
    return res.redirect(`/blog/${req.params.blogId}`);
});
module.exports = router;


