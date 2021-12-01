
const Router = require('express').Router();
const multer = require('multer');
const Posts = require('../models/postsModel');
const { param } = require('../routes/loginGoogleRouter');
const storage = multer.diskStorage({
    // nguồn lưu cho các tệp
    destination: function(req, file, callback) {
        callback(null, './public/imageposts');
    },
    // thêm phần mở rộng
    filename: function(req, file, callback) {
        callback(null, Date.now() + file.originalname);
    },
});
const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 598 * 900
    },
});
const createPosts = async (req, res) =>{
    const description =  req.body.description;
    const imgPost = req.file;
    let idYt = req.body.idYoutube;
    let idYoutube = (idYt === '') ? null : idYt;
    try{
        const author = req.session.user.username;
        const imgAuthor = req.session.user.picture;
        if(req.file){
            let posts = new Posts({
                author: author,
                imgAuthor: imgAuthor,
                description: description,
                idYoutube: idYoutube,
                imgPost: imgPost.filename,
            })
            posts = await posts.save();            
        }else{
            let posts = new Posts({
                author: author,
                imgAuthor: imgAuthor,
                description: description,
                idYoutube: idYoutube,
                imgPost: " ",
            })
            posts = await posts.save();
        }
        res.redirect('student')       
    }
    catch (error){
        console.log(error);
        res.redirect('/login')
        
    }
}
const getPosts = async (req, res) =>{
    res.render('student');
}
// const createPostsDM = async (req, res) =>{
//     console.log(req.session)
//     console.log(req.body)
//     const description =  req.body.description;
//     const imgPost = req.file;
//     let idYt = req.body.idYoutube;
//     let idYoutube = (idYt === '') ? null : idYt;
//     try{
//         const author = req.session.user.username;
//         const imgAuthor = req.session.user.picture;
//         if(req.file){
//             let posts = new Posts({
//                 author: author,
//                 imgAuthor: imgAuthor,
//                 description: description,
//                 idYoutube: idYoutube,
//                 imgPost: imgPost.filename,
//             })
//             posts = await posts.save();            
//         }else{
//             let posts = new Posts({
//                 author: author,
//                 imgAuthor: imgAuthor,
//                 description: description,
//                 idYoutube: idYoutube,
//                 imgPost: " ",
//             })
//             posts = await posts.save();
//         }
//         res.redirect('department')       
//     }
//     catch (error){
//         console.log(error);
//         res.redirect('/login')      
//     }
// }

// const getPostsDM = async (req, res) =>{
//     res.render('department');
// }
const loadPosts = async (req, res, next) =>{
    if (req.user) {
        return next()
    } else {
        return res.redirect('/login');
    }
}
module.exports ={
    upload,
    createPosts,
    loadPosts,
    getPosts,
    // createPostsDM,
    // getPostsDM

}