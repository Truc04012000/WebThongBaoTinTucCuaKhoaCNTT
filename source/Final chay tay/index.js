require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const cookieParser = require('cookie-parser')
// const bodyParser = require('body-parser')
const methodOverride = require('method-override');
const loginGoogleRouter = require('./routes/loginGoogleRouter');
const studentRouter = require('./routes/studentRouter');
const accountRouter = require('./routes/accountRouter');
const notificationRouter = require('./routes/notificationRouter');
const app = express()
const socketio = require('socket.io')
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cookieParser())
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: { 
        secure: false,
        maxAge: 24*60*60*1000   
    }
}))
//set view engine
app.set('view engine','ejs')
app.use(express.static(__dirname + '/public'));
//set passport
app.use(passport.initialize());
app.use(passport.session());

//Connection MongoDB
mongoose.connect('mongodb://localhost/finalProject',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex: true
})
// set up routes
app.use('/auth',loginGoogleRouter)
app.use('/student', studentRouter);
app.use(accountRouter)
app.use('/notifications',notificationRouter);
//router
app.get('/', (req, res) => {
    res.render('login');
});
app.get('/login',(req,res)=>{
    res.render('login')   
})
app.get('/notifications', (req, res) =>{
    res.render('index')
})
//running
const port = process.env.PORT || 3000
const httpServer = app.listen(port,()=>{
    
    console.log('http://localhost:'+ port)
})
const io = socketio(httpServer)
    io.on("connection", function(socket){
    // console.log("Có người kết nối: "+ socket.id);
    
    socket.on("sendNotification", function(data){
        socket.broadcast.emit("sendNotification", data)
    })
})
// http.listen(3000, function(){
//     socketio.on("connection", function(socket){
//         console.log("Auth value: "+ socket.id);
        
//         socket.on("sendNotification", function(data){
//             socket.broadcast.emit("sendNotification", data)
//         })
//     })
// })
