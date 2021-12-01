const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Student = new Schema({
   username: String,
   googleId: String,
   picture: {type: String, required: true},
   studentclass:{type:String, default: null},
   falcuty: {type:String, default: null},
   role:{type: Number, default: 0}
});

const User = mongoose.model('student', Student);

module.exports = User;