// const { db } = require('../models/userModel');
const { session } = require('passport');
const Account = require('../models/userModel');
const Posts = require('../models/postsModel');
const Notification = require('../models/notificationModel');
const multer = require('multer')
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

//error
const handleErrors = (err) =>{
    console.log(err.message, err.code)
    let errors = { fullname:'', email: '', username:'', password: ''};
    //Kiem tra email
    if(err.code === 11000){
        errors.email = 'Email đã tồn tại';
        return errors;
    }
    //Bat loi validator
    if(err.message.includes('account validation failed')){
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path] = properties.message;
            console.log(errors[properties.path])
        
        });
    }
    return errors;
}

//Kiem tra role 
const checkRole = (req, res ,next) =>{
    const role = req.data.role
    console.log(role)
    if(role == 1){
        return next()
    }
    return res.send('Student account')
}
const getRegister = (req, res) =>{
    res.render('register');
}
const getLogin = async (req, res) =>{
    // if(req.session.user){
    //     const imgProfile = req.session.user.picture;
    //     const txtUsername = req.session.user.username;
    //     //xu ly bai dang
    //     const posts =  await Posts.find().sort({ dateCreated: 'desc' });
    //     console.log(posts)
    //     //Thong bao
    //     const notification = await Notification.find().sort({ dateCreated: 'desc' }); 
    //     return res.render('login',{imgProfile, txtUsername, posts, notification});
    // }
    // else{
    //     return res.redirect('/login')
    // }
    res.render('login')
}
const postRegister = async (req, res) =>{
    const {fullname, email, username, password, roleNotification} = req.body;
    try{
        const user = await Account.create({fullname, email, username, password, roleNotification});
        return res.status(201).json(user);
    }
    catch(err){
        const errors = handleErrors(err);
        res.status(400).json({ errors })
    }
}
const postLogin = async (req, res) =>{
    const userLogin = req.body.username;
    req.session.user = userLogin
    const user = await Account.findOne({ username: req.body.username });
    
    if(user) {
        //luu vao session
        
        user.comparePassword(req.body.password, (err, match) => {
            if(!match) {
                return res.render('login',{loginSuccess: false, message: "Mật khẩu không hợp lệ!"})
                //return res.status(400).send({ message: "Mật khẩu không hợp lệ!" });
            }else{
               
                user.generateToken((err, user)=>{
                    if(err) return res.status(400).json({error: err});
                    else{
                        
                        return res.cookie("x-auth", user.token).status(200).json({ message:"Đăng nhập thành công!"});
                    }    
                });
                
            }     
        });
        
    }else{
        return res.status(400).json({ message: "Tài khoản không tồn tại!" })
    }  
}
const getChangePassword = (req, res) =>{
    res.render('changepassword');
}
const postChangePassword = async (req, res) =>{
    const {oldpassword, newpassword, confirmpassword} = req.body;
    const session = req.session.user
    const user = await Account.findOne({ username: session });
    // console.log(user)
    if(user){
        user.comparePassword(oldpassword, (err, match) => {
            if(match) {
                if(newpassword===confirmpassword){
                   user.password = newpassword;
                   user.save(function(err){
                       if(err){
                           return res.status(401).json({message: errHandler.getErrorMessage(err)})
                       }
                       return res.json({loginSuccess: true, message: "login success"})
                   })
                }
            }else{
                return res.status(400).json({loginSuccess: false, message: "Mật khẩu không hợp lệ!"})
            }
        }
    )}
}
module.exports = {
    getRegister,
    getLogin,
    postRegister,
    postLogin,
    checkRole,
    postChangePassword,
    getChangePassword
   
}