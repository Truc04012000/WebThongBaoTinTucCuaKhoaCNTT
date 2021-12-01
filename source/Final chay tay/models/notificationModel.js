const mongoose = require('mongoose');
const { JSDOM } = require('jsdom');
const stripHtml = require('string-strip-html');
const slug = require('mongoose-slug-generator');
const domPurifier = require('dompurify');
const htmlPurify = domPurifier(new JSDOM().window);
const Schema = mongoose.Schema;

//Khoi tao slug
mongoose.plugin(slug);
const Notification = new Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    timeCreated: {
        type: Date,
        default: () => Date.now(),
    },
    snippet: {
        type: String,
    },
    img: {
        type: String,
        default: null,
    },
    slug: { type: String, slug: 'title', unique: true, slug_padding_size: 2 },
});
Notification.pre('validate', function(next) {
    // kiểm tra xem có description 
    if (this.description) {
        this.description = htmlPurify.sanitize(this.description);
        this.snippet = stripHtml(this.description.substring(0, 200)).result;
    }

    next();
});
module.exports = mongoose.model('Notification', Notification);