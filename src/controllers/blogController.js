const blogModel = require('../models/blog');
const userModel = require('../models/user')
const { isValid,
    validString,
    validateEmail } = require('../validations/valid')

const mongoose = require('mongoose');

//=================/CRUD Operation-> CREATE/=========================
const createBlog = async function (req, res) {
    try {
        let blogData = req.body;
        // Destructuring the blogData
        const { title, body, userId, category, tags } = blogData;

        // checking for mandatory fields
        if (!title) return res.status(400).send({ status: false, message: "title is mandatory" });
        if (!body) return res.status(400).send({ status: false, message: "blog body is mandatory" });
        if (typeof body !== "string") return res.status(400).send({ status: false, message: "blog body should be string" });
        if (!userId) return res.status(400).send({ status: false, message: "authorId is mandatory" });
        if (!tags) return res.status(400).send({ status: false, message: "blog tag is mandatory" });
        if (!category) return res.status(400).send({ status: false, message: "blog category is mandatory" });

        // validating the mandatory fields
        if (!isValid(title)) return res.status(400).send({ status: false, message: "title is in valid" })
        if (!isValid(category)) return res.status(400).send({ status: false, message: "category is in valid" });

        //checking if userId is a valid ObjectId or not
        let id = mongoose.Types.ObjectId.isValid(userId)
        if (!id) return res.status(400).send({ status: false, message: "userId is not a valid ObjectId" });

        let user = await userModel.findById(userId);
        if (!user) return res.status(404).send({ status: false, message: "No User Found With This ID" });

        // saving the new blog document in the blog collection
        let newBlog = await blogModel.create(blogData);
        res.status(201).send({ status: true, data: newBlog });
    }
    catch (err) {
        res.status(500).send({ status: false, message: "Invalid request. Please check your request parameters." });
    }
}
//=================/CRUD Operation-> READ/=====================

const getAllBlogs = async (req, res) => {
    try {
        const blogs = await blogModel.find()


        res.status(200).json({ status: true, blogs: blogs })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: false, error: error })
    }
}

//=================/CRUD Operation-> UPDATE/=====================
const updateBlog = async function (req, res) {
    try {
        const { blogId } = req.params;
        const { title, body, tags, category,comment } = req.body;
        const updateFields = {};
   
        const blog = await blogModel.findOneAndUpdate(
            { _id: blogId, isDeleted: false },
            // addToSet  - check if the item already exist or not, if not then push it to array
            { $set: { title, body, category,tags }, $addToSet: { comment } },
            { new: true }
          );
        
        if (!blog) {
            return res.status(404).json({ status: false, message: "Blog not found" });
        }

        return res.status(200).json({ status: true, message: "Blog updated Successfully", data: blog });
    } 
    catch (err) {
        console.log(err);
        res.status(500).json({ status: false, message: "Internal server error" });
    }
};

//=================/CRUD Operation-> DELETE/=====================

const deleteBlog = async function (req, res) {

    try {
        let {blogId} = req.params;

        let blog = await blogModel.findOne({
            _id: blogId,
            isDeleted: false
        })

        if (blog == null) {
            return res.status(404).send({
                message: 'no such blog exists'
            });
        }

        let deleteUser = await blogModel.findOneAndUpdate(
            {
            _id: blogId,
            isDeleted: false
        }, {
            $set: {
                isDeleted: true,
            }
        }, { new: true })

        return res.status(200).send({
            status: true,
            data: "deletion succesfull"
        })
    } catch (err) {
        console.log(err)
        return res.status(500).send({
            status: false,
            message: err.message
        })
    }
}



module.exports.createBlog = createBlog;
module.exports.getAllBlogs = getAllBlogs;
module.exports.updateBlog = updateBlog;
module.exports.deleteBlog = deleteBlog;