require('dotenv').config();

const PORT = process.env.PORT || 5000;

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const {secret} = require('./config.js');
const cookieParser = require('cookie-parser')


const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Connected to database'));

app.set('view engine', 'ejs');

app.use(express.json());

app.use(express.static(path.resolve(__dirname, 'static')));

app.use(session({secret: secret, cookie: {sameSite: 'strict'}}));
app.use(cookieParser());

const facultyRouter = require('./routes/faculties');
app.use('/faculties', facultyRouter);
const floorRouter = require('./routes/floors');
app.use('/floors', floorRouter);
const roomRouter = require('./routes/rooms');
app.use('/rooms', roomRouter);
const pulpitRouter = require('./routes/pulpits');
app.use('/pulpits', pulpitRouter);

const viewRoomRouter = require('./routes/room');
app.use('/room', viewRoomRouter, express.static('required'));


const authRouter = require('./routes/auth');
const authMiddleware = require('./middleware/authMiddleware');
app.use('/auth', authRouter);

app.get('/', (req, res) =>{
    res.render('index');
})

app.get('/login', (req, res) =>{
    res.render('login');
})

app.get('/manage', authMiddleware, (req, res)=>{
    res.render('manage');
})

app.get('/manage.html', authMiddleware, (req, res)=>{
    res.redirect('/manage');
})

app.get('/room-list', authMiddleware, (req, res)=>{
    res.render('room-list');
})

app.get('/faculty-list', authMiddleware, (req, res)=>{
    res.render('faculty-list');
})

app.get('/pulpit-list', authMiddleware, (req, res)=>{
    res.render('pulpit-list');
})

app.get('/floor-list', authMiddleware, (req, res)=>{
    res.render('floor-list');
})

app.get('*', function(req, res){
    res.status(404).render('404');
  });

// app.get('/list.html', authMiddleware, (req, res)=>{
//     res.redirect('/room-list');
// })

app.get('/edit', authMiddleware, (req, res)=>{
    res.render('edit');
})

app.get('/edit.html', authMiddleware, (req, res)=>{
    res.redirect('/edit');
})

const start = async() => {
    try{
        await mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true});
        app.listen(PORT, ()=>console.log(`Server started on port ${PORT}`));
    }catch(e){
        console.log(e);
    }
}

start();