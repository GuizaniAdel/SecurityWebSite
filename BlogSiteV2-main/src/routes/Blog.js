const express = require('express');
const router = express.Router();

const { addBlog, UpdateBlog, getBlogThroughFlag, getAllBlogs, deleteBlog, getBlogsWithCategory, getLatestThreeBlogs, oneblog } = require('../controllers/Blog');

const verifyTokenMiddleware = require('../middlewares/verifyToken');

router.route('/addBlog').post(verifyTokenMiddleware, addBlog);
router.route('/UpdateBlog/:id').put(verifyTokenMiddleware, UpdateBlog);
router.route('/Flag/:id/:flag').get(getBlogThroughFlag);
router.route('/getAllBlogs').get(getAllBlogs);
router.route('/blogs/:id').delete(verifyTokenMiddleware, deleteBlog);
router.route('/oneBlog/:id').get(oneblog);
router.route('/SearchWithCategory/:category').get(getBlogsWithCategory);
router.route('/homeBlogs').get(getLatestThreeBlogs);


module.exports = router

