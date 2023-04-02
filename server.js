require('dotenv').config();

const PORT = process.env.PORT || 5000;

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const {secret} = require('./config.js');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const Building = require('./models/building');
const Floor = require('./models/floor');
const Room = require('./models/room');



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

const buildingRouter = require('./routes/buildings');
app.use('/buildings', buildingRouter);

const pagesRouter = require('./routes/pages');
app.use('/', pagesRouter);

const viewRoomRouter = require('./routes/room');
app.use('/room', viewRoomRouter, express.static('required'));

const viewFloorRouter = require('./routes/floor');
app.use('/floor', viewFloorRouter, express.static('required'));

const viewFacultyRouter = require('./routes/faculty');
app.use('/faculty', viewFacultyRouter, express.static('required'));

const viewPulpitRouter = require('./routes/pulpit');
app.use('/pulpit', viewPulpitRouter, express.static('required'));

const viewBuildingRouter = require('./routes/building');
app.use('/building', viewBuildingRouter, express.static('required'));


const authRouter = require('./routes/auth');
const authMiddleware = require('./middleware/authMiddleware');
const { log } = require('console');
app.use('/auth', authRouter);

app.get('', (req, res) =>{
    res.render('index', {currentPage: 'main'});
})

app.get('/login', (req, res) =>{
    res.render('login');
})

app.get('/manage', authMiddleware, (req, res)=>{
    res.render('manage', {currentPage: 'manage', currentBoard: 'manage'});
})

app.get('/manage.html', authMiddleware, (req, res)=>{
    res.redirect('/manage', {currentPage: 'manage', currentBoard: 'manage'});
})

app.get('/room-list', authMiddleware, (req, res)=>{
    res.render('room-list', {currentPage: 'manage', currentBoard: 'room-list'});
})

app.get('/faculty-list', authMiddleware, (req, res)=>{
    res.render('faculty-list', {currentPage: 'manage', currentBoard: 'faculty-list'});
})

app.get('/pulpit-list', authMiddleware, (req, res)=>{
    res.render('pulpit-list', {currentPage: 'manage', currentBoard: 'pulpit-list'});
})

app.get('/floor-list', authMiddleware, (req, res)=>{
    res.render('floor-list', {currentPage: 'manage', currentBoard: 'floor-list'});
})

app.get('/building-list', authMiddleware, (req, res)=>{
    res.render('building-list', {currentPage: 'manage', currentBoard: 'building-list'});
})

app.get('/edit', authMiddleware, (req, res)=>{
    res.render('edit', {currentPage: 'manage', currentBoard: 'manage', itemType: 'room'});
})

app.get('/buildings-page', async (req, res)=>{
    const buildings = await Building.find();
    res.render('buildings-page', {currentPage: 'buildings-page', buildings: buildings});
})

app.get('/building-page/:name', async (req, res)=>{
    const building = await Building.findOne({name: req.params.name});
    let floors = [];
    for (const floor of building.floors) {
        const tempFloor = await Floor.findOne({number: floor});
        floors.push(tempFloor);
      }
    res.render('building-page', {currentPage: 'buildings-page', building: building, floors: floors});
})

app.get('/floor-page/:name', async (req, res)=>{
    const floor = await Floor.findOne({number: req.params.name});
    res.render('floor-page', {currentPage: 'buildings-page', floor: floor});
})

app.get('/room-page/:number', async (req, res)=>{
    const room = await Room.findOne({number: req.params.number});
    const floor = await Floor.findOne({number: room.floor});
    res.render('room-page', {currentPage: 'buildings-page', floor: floor, room: room});
})


app.get('*', function(req, res){
    res.status(404).render('404');
  });


// app.get('/edit.html', authMiddleware, (req, res)=>{
//     res.redirect('/edit', {currentPage: 'manage'});
// })

const start = async() => {
    try{
        await mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true});
        app.listen(PORT, ()=>console.log(`Server started on port ${PORT}`));
    }catch(e){
        console.log(e);
    }
}

start();