const express = require('express');
const router = express.Router();
const Room = require('../models/room');
const Floor = require('../models/floor');
const Pulpit = require('../models/pulpit');
const Faculty = require('../models/faculty');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const authMiddleware = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, './static/images');
    },
    filename: (req,file,cb)=>{
        cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  
const upload = multer({
  storage: storage
});

//get all
router.get('/', async (req, res) => {
    try{
        const rooms = await Room.find();
        res.json(rooms);
    } catch (err){
        res.status().json({message: err.message});
    }
});

//get one
router.get('/:number', getRoom, (req, res) => {
    res.json(res.room)
});

//create one
router.post('/', authMiddleware, upload.any('images'), async (req, res) =>{
    let isFacultyExists = await Faculty.exists({name: req.body.faculty});
    let isFloorValid = await Floor.exists({number: req.body.floor, faculty: req.body.faculty});

    let pulpitsArray = [];

    for(const pulpit of req.body.pulpits){
        pulpitsArray.push(null != await Pulpit.exists({name: pulpit, faculty: req.body.faculty}));
    }
    
    let isPulpitsValid = pulpitsArray.every(i => i === true);

    let images = req.files.map(file => file.filename);

    if(isFacultyExists && isFloorValid && isPulpitsValid){
        const room = new Room({
            number: req.body.number,
            floor: req.body.floor,
            faculty: req.body.faculty,
            capacity: req.body.capacity,
            type: req.body.type,
            photo_links: images[0] != '' ? images : [],
            description: req.body.description,
            assistant: req.body.assistant,
            model: req.body.model,
            pulpits: req.body.pulpits[0] != '' ? req.body.pulpits : [],
            co2: req.body.co2[0] != '' ? h : [],
            temperature: req.body.temperature[0] != '' ? req.body.temperature : [],
            co2_history: req.body.co2_history[0] != '' ? req.body.co2_history : [],
            temperature_history: req.body.temperature_history[0] != '' ? req.body.temperature_history : [],
        });
    
        try{
            const newRoom = await room.save();

            const floorObj = await Floor.findOne({ number: req.body.floor });
            floorObj.rooms.push(req.body.number);
            const updatedFloor = await floorObj.save();

            for(const pulpit of req.body.pulpits){
                const pulpitObj = await Pulpit.findOne({ name: pulpit });
                pulpitObj.rooms.push(req.body.number);
                const updatedPulpit = await pulpitObj.save();
            }

            res.status(201).json(newRoom);
        } catch(err){
            res.status(400).json({message: err.message});
        }
    }else{
        res.status(400).json({message: "Invalid floor, faculty or pulpit"});
    }
    
});

//update one
router.patch('/:number', authMiddleware, upload.any('images'), getRoom, async (req, res)=>{
    let isFacultyExists = true;
    let isFloorExists = true;

    if(req.body.floor != [] && req.body.floor){
        isFloorExists = await Floor.exists({number: req.body.floor});
    }
    if(req.body.faculty != [] && req.body.faculty){
        isFacultyExists = await Faculty.exists({name: req.body.faculty});
    }

    let pulpitsArray = [];

    let isPulpitssExists = true;

    const images = req.files.map(file => file.filename);

    res.room.photo_links.forEach(link =>{
        const address = path.resolve('./static/images/' + link);
        if(fs.existsSync(address)){
            fs.unlinkSync(address);
        }
    });

    if(req.body.pulpits){
        for(const pulpit of req.body.pulpits){
            pulpitsArray.push(null != await Pulpit.exists({name: pulpit}));
        }
        isPulpitssExists = pulpitsArray.every(i => i === true);
    }

    if(isFacultyExists && isFloorExists && isPulpitssExists){
        if(req.body.number != null){
            res.room.number = req.body.number
        }
        if(req.body.floor != null){
            res.room.floor = req.body.floor
        }
        if(req.body.faculty != null){
            res.room.faculty = req.body.faculty
        }
        if(req.body.capacity != null){
            res.room.capacity = req.body.capacity
        }
        if(req.body.type != null){
            res.room.type = req.body.type
        }
        if(req.body.photo_links != null){
            res.room.photo_links = images
        }
        if(req.body.description != null){
            res.room.description = req.body.description
        }
        if(req.body.assistant != null){
            res.room.assistant = req.body.assistant
        }
        if(req.body.model != null){
            res.room.model = req.body.model
        }
        if(req.body.pulpits != null){
            res.room.pulpits = req.body.pulpits
        }
        if(req.body.co2 != null){
            res.room.co2 = req.body.co2
        }
        if(req.body.temperature != null){
            res.room.temperature = req.body.temperature
        }
        if(req.body.co2_history != null){
            res.room.co2_history = req.body.co2_history
        }
        if(req.body.temperature_history != null){
            res.room.temperature_history = req.body.temperature_history
        }
        try{
            const updatedRoom = await res.room.save()
            res.json(updatedRoom);
        } catch (err){
            res.status(400).json({message: err.message});
        }
    }else{
        res.status(400).json({message: "Invalid floor, faculty or pulpit"});
    }
    
});

// delete one
router.delete('/:number', authMiddleware, getRoom, async (req, res) =>{
    try{
        await Floor.updateOne({ rooms: res.room.number }, {
            $pullAll: {
                rooms: [res.room.number],
            },
        });
        await Pulpit.updateMany({ rooms: res.room.number }, {
            $pullAll: {
                rooms: [res.room.number],
            },
        });

        res.room.photo_links.forEach(link =>{
            const address = path.resolve('./static/images/' + link);
            if(fs.existsSync(address)){
                fs.unlinkSync(address);
            }
        });

        await res.room.remove();
        res.json({message: "Deleted Room"});
    } catch(err){
        res.status(500).json({message: err.message});
    }
});

async function getRoom(req, res, next){
    try{
        room = await Room.findOne({
            number: req.params.number
        })
        if(room == null){
            return res.status(404).json({message: "Can't find room"});
        }
    } catch(err){
        return res.status(500).json({message: err.message});
    }

    res.room = room;
    next();
}

module.exports = router;