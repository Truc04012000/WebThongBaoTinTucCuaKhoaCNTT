
const Router = require('express').Router();
const Comment = require('../models/commentModel');
const Posts = require('../models/postsModel');
//Xu ly comment 
const postComment = async(req, res) =>{
    try{
        const {idPost, content} = req.body;
        const {username, picture} = req.session.user;
        const comment = await Comment.create({content:content, username:username, img: picture});
        const a = await Posts.findByIdAndUpdate({_id:idPost}, {$push:{comments:comment}},{new: true})
        res.redirect('/student')
    }
    catch(err){
        console.log(err);
        res.redirect('/student')
    }
}
const getComment  = (req, res) =>{
    res.render('student');
}
//Phong khoa comment
// const postCommentPM = async(req,res) =>{
   
//     try{
//         const {idPost, content} = req.body;
//         const {username, picture} = req.session.user;
//         const comment = await Comment.create({content:content, username:username, img: picture});
//         const a = await Posts.findByIdAndUpdate({_id:idPost}, {$push:{comments:comment}},{new: true})
//         res.redirect('/deparment')
//     }
//     catch(err){
//         console.log(err);
//         res.redirect('/deparment')
//     }
// }
// const getCommentPM  = (req, res) =>{
//     res.render('department');
// }
module.exports = {
    postComment,
    getComment,
    // postCommentPM,
    // getCommentPM
}