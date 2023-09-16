const mongoose= require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const blogSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    body : {
        type: String,
        required: true
    },
    userId : {
        type : ObjectId,
        ref : 'User',
        required: true
    },
    tags : {type : String},
    category : {type : String},
    comment : [{type : String}]

},{ timestamps: true })

module.exports = mongoose.model('Blog', blogSchema)
