const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('useFindAndModify', false);
const Posts = new Schema({
    idUserPosts:String,
    author: String,
    imgAuthor: {type: String, required: true},
    description: {type:String},
    idYoutube:{type: String, default: null},
    imgPost: {type: String, required: true},
    comments: [
        {
            username: String,
            img: {type: String, required: true},
            content: String,
            timeComment: {
                type: Date,
                default: () => Date.now()
            },
            // type: mongoose.Schema.Types.ObjectId,
            // ref: "Comment",
            // required: true,
        }
    ],
    dateCreated: {
        type: Date,
        default: () => Date.now(),
    },
})
Posts.set('versionKey', false);
module.exports = mongoose.model('Posts', Posts);
