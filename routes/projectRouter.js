const { Router } = require("express");
const router = Router();
const Project = require("../models/projectsModel");
const multer = require("multer");
const path = require("path");

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
    return res.render("addProjects", {
        user: req.user,
    });
});

router.post("/", upload.fields([
    { name: 'projectImage1', maxCount: 1 },
    { name: 'projectImage2', maxCount: 1 },
    { name: 'projectImage3', maxCount: 1 }
]), async (req, res) => {
    const { title, description, startDate, endDate, progress, completed } = req.body;

    // Check if all three project images are uploaded
    if (!req.files || !req.files['projectImage1'] || !req.files['projectImage2'] || !req.files['projectImage3']) {
        return res.render("addProject", {
            error: "All three project images are required.",
            user: req.user,
            title,
            description,
            startDate,
            endDate,
            progress,
            completed
        });
    }

    // Create the project if images are provided
    try {
        const project = await Project.create({
            title,
            description,
            startDate,
            endDate,
            progress,
            completed: completed ? true : false,
            projectImage1: `/uploads/projects/${req.files['projectImage1'][0].filename}`,
            projectImage2: `/uploads/projects/${req.files['projectImage2'][0].filename}`,
            projectImage3: `/uploads/projects/${req.files['projectImage3'][0].filename}`,
            createdBy: req.user._id
        });
        return res.redirect(`/`); // Redirect to the project's page
    } catch (error) {
        console.error(error);
        return res.render("addProject", {
            error: "Error creating project. Please try again.",
            user: req.user,
            title,
            description,
            startDate,
            endDate,
            progress,
            completed
        });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.redirect('/'); // Redirect to homepage after deletion
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get("/:id", async (req, res) => {
    const project = await Project.findById(req.params.id).populate('createdBy');
    return res.render("project", {
        user: req.user,
        project,
    });
});

module.exports = router;
