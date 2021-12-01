const Router = require('express').Router();
const notificationController = require('../controllers/notificationController')

Router.get('/', notificationController.getNotification);
Router.get('/new',notificationController.getNewNotification);
Router.get('/:slug',notificationController.slug);
Router.post('/',notificationController.upload.single('image'),notificationController.postNotification);
Router.get('/edit/:id', notificationController.getEditId);
Router.post('/update/:id', notificationController.putNotification);
Router.post('/delete/:id', notificationController.deleteNotification);

module.exports = Router;