const mongoose= require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type : String,
        require : true
    }, 
    email : {
        type : String,
        require : true,
        unique : true
    },
    password: {
        type : String,
        required : true
    },
    mobile : {
        type : String,
        reuqire : true,
        unique : true,
        minlength : 10,
        maxength : 10
    },
},{timestamps:true
})

module.exports = mongoose.model('User' , userSchema);

