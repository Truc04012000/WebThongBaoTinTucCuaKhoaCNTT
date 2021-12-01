const express = require('express');
const { model } = require('mongoose');
const Notification = require('../models/notificationModel')
const Account = require('../models/userModel');
const Router = express.Router();
const multer = require('multer');
const { response } = require('express');
const storage = multer.diskStorage({
    // nguồn lưu cho các tệp
    destination: function(req, file, callback) {
        callback(null, './public/images');
    },
    // thêm phần mở rộng
    filename: function(req, file, callback) {
        callback(null, Date.now() + file.originalname);
    },
});
const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 1024 * 1024 * 3,
    },
});
const getNotification = async(req, res) => {
    const notifications = await Notification.find().sort({ timeCreated: 'desc' });
    res.render('index', { notifications: notifications });
}
const getNewNotification = async(req, res) => {
    const session = req.session.user
    const roleNotification = await Account.findOne({ username: session})

        // const roleNoti = roleNotification.roleNotification
    if (roleNotification === null) {
        return res.redirect('/login')
    } else {
        const roleNoti = roleNotification.roleNotification
        res.render('new', { role: roleNoti });
    }
}
const slug = async(req, res) => {
        const blog = await Notification.findOne({ slug: req.params.slug });
        if (blog) {
            return res.render('show', { blog: blog });
        } else {
            res.redirect('/');
        }
    }
    //Dang thong bao moi
const postNotification = async(req, res) => {
        let blog = new Notification({
            title: req.body.title,
            author: req.body.author,
            description: req.body.description,
            img: req.file.filename,
        });
        try {
            blog = await blog.save();
            res.redirect(`notifications/${blog.slug}`);
        } catch (error) {
            console.log(error);
        }
    }
    //Chinh sua thong bao
const getEditId = async(req, res) => {
        const blog = await Notification.findById(req.params.id);
        res.render('edit', { blog: blog });
    }
    //Cap nhat thong bao
const putNotification = async(req, res) => {
        req.blog = await Notification.findById(req.params.id);
        let blog = req.blog;
        blog.title = req.body.title;
        blog.author = req.body.author;
        blog.description = req.body.description;
        try {
            blog = await blog.save();
            //redirect den route
            res.redirect(`/notifications/${blog.slug}`);
        } catch (error) {
            console.log(error);
            res.redirect(`/notifications/update/${blog.id}`, { blog: blog });
        }
    }
    //Xoa thong bao
const deleteNotification = async(req, res) => {
    
    await Notification.findByIdAndDelete(req.params.id);
    res.redirect('/notifications');
}
module.exports = {
    getNotification,
    getNewNotification,
    slug,
    postNotification,
    getEditId,
    putNotification,
    deleteNotification,
    upload

}