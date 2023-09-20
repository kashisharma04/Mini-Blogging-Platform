const express = require('express')
const router = express.Router()
const { login,createUser,getUser } = require('../controllers/userController');
const { createBlog,getAllBlogs,updateBlog,deleteBlog } = require('../controllers/blogController')
const { authentication , authorization } = require('../middleware/middleware')

router.get('/', (req, res) => {
    res.send('Router Method !');
  });

// user routes
router.post("/registration", createUser)
router.get("/getuser", getUser)
router.post('/login', login)

// blog routes
router.post('/blogs',authentication, createBlog)
router.get('/blogs' , getAllBlogs);
router.put('/blogs/:blogId',authentication,authorization,updateBlog);
router.delete('/blogs/:blogId',authentication,authorization,deleteBlog)

module.exports = router;