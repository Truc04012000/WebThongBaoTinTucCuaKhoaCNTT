const mongoose = require('mongoose')
const Schema  = mongoose.Schema
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { isEmail } = require('validator')
const accountSchema  =  new Schema({
    fullname: {
        type: String,
        unique: true,
        required: [true, 'Vui lòng nhập tên đầy đủ'],
    },
    email:{
        type: String,
        required: [true, 'Vui lòng nhập email'],
        unique: true,
        lowercase: true,
        validate: [isEmail,'Email không hợp lệ'],
        trim: true

    },
    username:{
        type: String,
        unique: true,
        required: [true, 'Vui lòng nhập username'],
        minLength: [6, 'Tên người dùng phải từ 6 kí tự trở lên']
    },
    password:{
        type: String,
        required: [true, 'Vui lòng nhập password'],
        minLength: [6, 'Mật khẩu phải từ 6 kí tự trở lên']
    },
    role:{type: Number, default: 2},
    roleNotification: Array,
    picture:{type: String, default: "user.jpg"}
});
accountSchema.pre('save', async function(next){
    if(!this.isModified("password")) {
        return next();
    }
    this.password = bcrypt.hashSync(this.password, 10);
    next();
})
accountSchema.methods.comparePassword = function(plaintext, callback) {
    return callback(null, bcrypt.compareSync(plaintext, this.password));
};
accountSchema.methods.generateToken = function(callback){
    let user = this;
    let {JWT_SECRET} = process.env
    let token = jwt.sign({
        data: user._email
        }, JWT_SECRET, { 
        expiresIn: "1h" 
        }
    );
    user.token = token;
    user.save(function(err, user){
        if(err) return (callback(err));
        callback(null, user);
    })
}
const Account = mongoose.model('account',accountSchema);
module.exports = Account;