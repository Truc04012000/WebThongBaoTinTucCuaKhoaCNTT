const Router = require('express').Router();
const accountController = require('../controllers/accountController');
const postController = require('../controllers/postsController');
const commentController = require('../controllers/commentController');
//PhongKhoa, Admin dang nhap
Router.get('/', accountController.getLogin);
Router.post('/login', accountController.postLogin);
//Admin tao tai khoan phong khoa
Router.get('/register', accountController.getRegister);
Router.post('/register', accountController.postRegister);
//PhongKhoa thay doi mat khau
Router.post('/changepassword', accountController.postChangePassword);
Router.get('/changepassword', accountController.getChangePassword);
//Phong khoa dang bai
// Router.post('/', postController.upload.single('img'),postController.createPostsDM);
// Router.get('/', postController.getPostsDM);
// //Phong khoa comment
// Router.post('/',commentController.postComment);
// Router.get('/',commentController.getComment);
module.exports = Router;
