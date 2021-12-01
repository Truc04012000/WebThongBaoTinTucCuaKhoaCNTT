const Router = require('express').Router();
const studentController = require('../controllers/studentController')
const postController = require('../controllers/postsController')
const commentController = require('../controllers/commentController')
//
Router.get('/', studentController.loadPage);
Router.post('/studentupdate',studentController.upload.single('picture'), studentController.postStudent);
Router.get('/studentupdate', studentController.getStudent);
//Xem tat ca bai viet cua mot user
Router.get('/profile/:username',studentController.LoadPostsOfUser);
//Xem tat ca thong bao
Router.get('/listnotification',studentController.getLoadAllNotification);
//router dang bai cua sinh vien
Router.post('/', postController.upload.single('img'),postController.createPosts);
Router.get('/', postController.getPosts);
//router comment cua sinh vien
Router.post('/comment',commentController.postComment);
Router.get('/comment',commentController.getComment);


module.exports = Router;