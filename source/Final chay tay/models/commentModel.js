const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Comment = new Schema({
    username: String,
    img: {type: String, required: true},
    content: String,
    timeComment: {
        type: Date,
        default: () => Date.now(),
    },

})
module.exports = mongoose.model('Comment', Comment);
