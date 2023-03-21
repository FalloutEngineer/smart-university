const express = require('express');
const router = express.Router();
const Floor = require('../models/floor');
const Room = require('../models/room');
const Faculty = require('../models/faculty');

const authMiddleware = require('../middleware/authMiddleware');

//get all
router.get('/', authMiddleware, async (req, res) => {
    try{
        const floors = await Floor.find();
        res.json(floors);
    } catch (err){
        res.status().json({message: err.message});
    }
});

//get one
router.get('/:number', authMiddleware, getFloor, (req, res) => {
    res.json(res.floor)
});

//create one
router.post('/', authMiddleware, async (req, res) =>{
    let isFacultyExists = await Faculty.exists({name: req.body.faculty});
    let roomsArray = [];

    req.body.rooms.forEach(room =>{
        roomsArray.push(Room.exists({number: room}));
    })

    let isRoomsExists = roomsArray.every(i => i === true);


    if(isFacultyExists && isRoomsExists){
        const floor = new Floor({
            number: req.body.number,
            faculty: req.body.faculty,
            rooms: req.body.rooms
        });
    
        try{
            const newFloor = await floor.save();

            const faculty = await Faculty.findOne({ name: req.body.faculty });
            faculty.floors.push(req.body.name);
            const updatedFaculty = await faculty.save();

            res.status(201).json({floor: newFloor, faculty: updatedFaculty});
        } catch(err){
            res.status(400).json({message: err.message});
        }
    }else{
        res.status(400).json({message: "Invalid room or faculty"});
    }
    
});

//update one
router.patch('/', authMiddleware, getFloor, async (req, res)=>{
    let isFacultyExists = await Faculty.exists({name: req.body.faculty});
    let roomsArray = [];

    req.body.rooms.forEach(room =>{
        roomsArray.push(Room.exists({number: room}));
    })

    let isRoomsExists = roomsArray.every(i => i === true);

    if(isFacultyExists && isRoomsExists){
        if(req.body.number != null){
            req.floor.number = req.body.number
        }
        if(req.body.faculty != null){
            req.floor.faculty = req.body.faculty
        }
        if(req.body.rooms != null){
            req.floor.rooms = req.body.rooms
        }
        try{
            const updatedFloor = await res.floor.save
            res.json(updatedFloor);
        } catch (err){
            res.status(400).json({message: err.message});
        }
    }else{
        res.status(400).json({message: "Invalid room or faculty"});
    }
    
});

// delete one
router.delete('/:number', authMiddleware, getFloor, async (req, res) =>{
    try{
        console.log(res);
        await Faculty.updateOne({ name: res.floor.faculty }, {
            $pullAll: {
                floors: [res.floor.number],
            },
        });
        await res.floor.remove();
        res.json({message: "Deleted Floor"});
    } catch(err){
        res.status(500).json({message: err.message});
    }
});

async function getFloor(req, res, next){
    try{
        floor = await Floor.findOne({
            number: req.params.number
        })
        if(floor == null){
            return res.status(404).json({message: "Can't find floor"});
        }
    } catch(err){
        return res.status(500).json({message: err.message});
    }

    res.floor = floor;
    next();
}

module.exports = router;