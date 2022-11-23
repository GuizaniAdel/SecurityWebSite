const router = require('express').Router(); // import express routers
const Blog = require('../models/Blog'); // import our Blog model
const { BlogValidation } = require('../utils/validation'); // import our constraints on user 

const addBlog = async (req, res) => {
    // new date 
    const date = new Date();
    // create new Blog
    const blog = new Blog({
        title: req.body.title,
        category: req.body.category,
        description: req.body.description,
        blogContent: req.body.blogcontent,
        team: req.body.team,
        flag: req.body.flag,
        dateCreated: date,
        dateModified: date,
        username: req.user.username,
        userid: req.user.id

    });

    //validate Blog data req.body
    const { error } = BlogValidation(req.body);
    if (error) {
        return res.status(400).send({ error: error.details[0].message });
    }

    try {
        // save blog to our database
        const savedBlog = await blog.save();
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(400).send(err);
    }
};

const UpdateBlog = async (req, res) => {

    // retrieve blog with it's id and user's id for extra security
    const blog = await Blog.findOne({ _id: req.params.id, userid: req.user.id });
    // if the blog to update exists
    if (blog) {
        // updating the blog informations 
        const UpdateBlog = await Blog.updateOne(
            { _id: req.params.id },
            req.body,
        )
        return res.status(200).json({ success: true });
    }

    // if user doesn't own the blog or blog doesnt exist
    return res.json({ error: "Access Denied" });
};

const getBlogThroughFlag = async (req, res) => {

    // retrieve Flag and id of blog to fetch
    const Flag = req.params.flag;
    const _id = req.params.id;



    const blogs = await Blog.find({ flag: Flag, _id: _id });
    if (typeof blogs !== 'undefined' && blogs.length !== 0) {

        // select specific attributes to return to our client side
        let OneBlog = [];
        blogs.map((blog) => {
            OneBlog.push({
                title: blog.title,
                category: blog.category,
                description: blog.description,
                blogContent: blog.blogContent,
                flag: blog.flag,
                username: blog.username,
                state: true
            })
        });
        return res.status(200).json(OneBlog);
    }
    else
        res.status(200).json([{ state: false }]);
};



const getAllBlogs = async (req, res) => {

    // fetch all blogs from our database
    const blogs = await Blog.find();

    try {
        if (blogs) {
            var blogsJson = [];
            // mapping all blogs to retrieve only specific data for the display page
            blogs.map((blog) => {
                blogsJson.push({
                    id: blog._id,
                    title: blog.title,
                    category: blog.category,
                    description: blog.description,
                    username: blog.username
                })
            });
            res.status(200).json(blogsJson);
        }

    } catch (e) {
        res.status(400).json({ error: "Server error !" });
    }

};

const deleteBlog = async (req, res) => {

    const blog = await Blog.findByIdAndRemove({
        _id: req.params.id,
        userid: req.user.id,
    })

    if (blog) {
        return res.status(200).json({ success: "Blog Deleted !" });
    }

    res.status(400).json({ error: "Access denied" });
};

const oneblog = async (req, res) => {

    const blogs = await Blog.find({
        _id: req.params.id,

    })

    try {
        if (blogs) {
            var blogsJson = [];
            // mapping all blogs to retrieve only specific data for the display page
            blogs.map((blog) => {
                blogsJson.push({
                    id: blog._id,
                    title: blog.title,
                    category: blog.category,
                    description: blog.description,
                    username: blog.username,
                    blogContent: blog.blogContent
                })
            });
            res.status(200).json(blogsJson);
        }

    } catch (e) {
        res.status(400).json({ error: "Server error !" });
    }
};

const getBlogsWithCategory = async (req, res) => {

    const blogs = await Blog.find({ category: req.params.category });
    try {
        if (blogs) {

            var blogsJson = [];
            // mapping all blogs to retrieve only specific data for the display page
            blogs.map((blog) => {
                blogsJson.push({
                    id: blog._id,
                    title: blog.title,
                    category: blog.category,
                    description: blog.description,
                    username: blog.username
                })
            });
            res.status(200).json(blogsJson);
        }
    }
    catch (e) {


        res.status(400).json({ error: "Server error !" });
    }
};

const getLatestThreeBlogs = async (req, res) => {
    // fetch all blogs from our database
    const blogs = await Blog.find();
    try {
        if (blogs) {

            var blogsJson = [];
            // mapping all blogs to retrieve only specific data for the display page
            blogs.map((blog) => {
                blogsJson.push({
                    id: blog._id,
                    title: blog.title,
                    category: blog.category,
                    description: blog.description,
                    username: blog.username
                })
            });
            let blogsJson1 = blogsJson.reverse().slice(0, 3)
            res.status(200).json(blogsJson1);
        }
    } catch (e) {
        res.status(400).json({ error: "Server error !" });
    }

}


// export our blog api to our routes
module.exports = {
    addBlog,
    UpdateBlog,
    getBlogThroughFlag,
    getAllBlogs,
    deleteBlog,
    getBlogsWithCategory,
    getLatestThreeBlogs,
    oneblog
};