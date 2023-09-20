const userModel = require('../models/user')
const jwt = require('jsonwebtoken')
const { validateEmail,isValidReqBody } = require('../validations/valid')

require('dotenv').config();
const { JWT_SECRET} = process.env

const createUser = async function (req, res) {
    try {
        let user = req.body
        const { name, email, mobile, password } = user;

        //checking for required fields
        if (!name) { return res.status(400).send({ status: false, message: "user name is required" }) }

        if (!email) { return res.status(400).send({ status: false, message: "email is required" }) }

        if (!mobile) { return res.status(400).send({ status: false, message: "mobile is required" }) }

        if (!password) { return res.status(400).send({ status: false, message: "password is required" }) }

        if (password.length < 7) return res.status(400).send({ status: false, message: "Password length should be greater than 8 characters" })

        if (!validateEmail(email)) { return res.status(400).send({ status: false, message: "Enter the valid email" }) }

        //checking for unique mail
        const uniqueMail = await userModel.findOne({ email: email });
        if (uniqueMail) return res.status(400).send({ status: false, message: "this email already exist" });

        
        let userCreated = await userModel.create(user)
        return res.status(201).send({ status: true, data: userCreated })
    }
    catch (err) { return res.status(500).send({ status: false, message: err.message }) }

}
//==================CRUD METHODS================================
//================/GET METHOD/==================================
const getUser = async function (req, res) {
    try {
        const user = await userModel.find()
        res.status(200).send({ status: true, data: user });
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ status: false, error: 'Internal Server Error' });
    }
};


const login = async (req, res) => {
    try {
        if (!isValidReqBody(req.body)) {
            res.status(400).json({
                status: false,
                message: 'Invalid Request Parameters, Please provide login details'
            });
            
        }

        const {
            email,
            password
        } = req.body

        if (!validateEmail(email)) {
            res.status(400).json({
                status: false,
                message: "Email is required"
            })
        }

        if (!(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email))) {
            res.status(400).json({
                status: false,
                message: "Email should be valid email."
            })
        }

        if (!email || !password) return res.status(400).json({
            message: "Please enter email and password"
        })

        const user = await userModel.findOne({
            email: email,
            password : password
        })


        if (!user) return res.status(401).json({
            status: false,
            message: 'You are not registered'
        })
        console.log(user.password)

        if (password) {
            const token = jwt.sign({
                user_id: user._id,
            }, JWT_SECRET)

            res.header('x-header-key', token)

            res.status(200).json({
                status: true,
                data: {
                    token
                }
            })
        } else {
            return res.status(401).send({
                status: false,
                message: "not a authenticate user"
            })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

module.exports.login = login
module.exports.createUser = createUser;
module.exports.getUser = getUser;


