require('dotenv').config()
const passport = require('passport')
const Router = require('express').Router();
const googleStrategy = require('passport-google-oauth20').Strategy
const Student = require('../models/studentModel');
const Posts = require('../models/postsModel');
const Notification = require('../models/notificationModel');
const multer = require('multer')
const formidable = require('formidable');
//Xac dinh noi luu anh
const storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, './public/avatars');
    },
    //them phan mo rong
    filename: function(req, file, callback){
        callback(null, Date.now()  + file.originalname);
    }
});
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 4 * 1024 * 1024,
    } 
});
passport.serializeUser((user, done) => {
    done(null, user.id);
 });
//lay du lieu user 
passport.deserializeUser((id, done) => {
    Student.findById(id)
    .then((user) => {
        done(null, user);
    })
 })
passport.use(new googleStrategy({
    clientID : process.env.CLIENT_ID,
    clientSecret : process.env.CLIENT_SECRET,
    callbackURL : process.env.CALLBACK_URL,
    }, (accessToken, refreshToken, profile, done) => {
        
        //kiem tra mail sv
        // console.log(profile)
        var checkmail = (profile._json.hd)
        if(checkmail==="student.tdtu.edu.vn"){
            //kiem tra tai khoan trong db      
            Student.findOne({googleId: profile.id}).then((currentUser) => {
                if (currentUser) {
                   done(null, currentUser);
                } else {
                   // tao account moi 
                   new Student({
                      googleId: profile.id,
                      username: profile.displayName,
                      picture: "user.jpg"
                   })
                   .save()
                   .then( (newUser) => {
                      done(null, newUser);
                   });
                }
             })
            
        }else{
            return done(null, false, {message: 'Email không hợp lệ.'});
        }   
    })
);
const checkauth = async (req, res, next) =>{
    if (req.user) {
        return next()
    } else {
        return res.redirect('/login');
    }
}
const loadPage = async (req, res) => {
    if (req.user) {
        const user = req.user;
        //luu thong tin student dang nhap vao session
        req.session.user = req.user;
        //Thong tin profile
        const imgProfile = user.picture;
        const txtUsername = user.username;
        //Bai viet
        const posts =  await Posts.find().sort({ dateCreated: 'desc' });
        //Thong bao
        const notification = await Notification.find().sort({ dateCreated: 'desc' }); 
        //
        return res.render('student', {imgProfile, txtUsername, posts, notification}); 
    } else {
        return res.redirect('/login');
    }
}
// const loadPage =  (req, res) => {
//     var form = new formidable.IncomingForm();
//     var formdata = [];
//     form.parse(req, function(er, field, files){
//         const {formPosts} = field;
//         formdata.push(formPosts);
//     })
//     form.on('end',()=>{
//         if (req.user) {
//             const user = req.user;
//             //luu thong tin student dang nhap vao session
//             req.session.user = req.user;
//             //Thong tin profile
//             const imgProfile = user.picture;
//             const txtUsername = user.username;
//             //Bai viet
//             const posts =  Posts.find().sort({ dateCreated: 'desc' });
//             //Thong bao
//             const notification =  Notification.find().sort({ dateCreated: 'desc' }); 
//             //
//             return res.render('student', {imgProfile, txtUsername, posts, notification}); 
//         } else {
//             return res.redirect('/login');
//         }
//     })
// }
const getStudent = (req, res) =>{
    res.render('studentupdate');
}
//chinh sua thong tin sinh vien
const postStudent =  async (req, res) =>{
    
    const userID = req.user._id
    const {username, studentclass, falcuty} = req.body;
    const picture = req.file.filename;
    try{
        const updateProfile =  await Student.findByIdAndUpdate({_id:userID},{
            username: username,
            studentclass: studentclass,
            falcuty: falcuty,
            picture: picture,
        });
        // console.log(updateProfile)
        return res.status(201).json(updateProfile);
    }
    catch(err){
        res.status(400).json(err)
    } 
}
const getLoadAllNotification = async(req, res) =>{
    if(req.user){
        const username = req.user.username
        const picture = req.user.picture
        const noti = await Notification.find().sort({ dateCreated: 'desc' }); 
        res.render('listnotification',{username, picture, noti})
    }
    else{
        res.redirect('/login')
    }
}
const LoadPostsOfUser = async(req, res) =>{
    const username = req.params.username
    const infoUser = await Posts.findOne({author:username})
    const {imgAuthor, author} = infoUser
    const profileUserPosts = await Posts.find({author: username}).sort({dateCreated: 'desc'});
    res.render('profile',{imgAuthor, author, profileUserPosts})
}
const shownotification = async(req, res) =>{
    console.log(req.body)
}
module.exports = {
    loadPage,
    postStudent,
    getStudent,
    upload,
    checkauth,
    getLoadAllNotification,
    LoadPostsOfUser,
    shownotification

}