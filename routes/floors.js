const express = require('express');
const router = express.Router();
const Floor = require('../models/floor');
const Room = require('../models/room');
const Faculty = require('../models/faculty');
const Building = require('../models/building');

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
    let isBuildingExists = await Building.exists({name: req.body.building});
    let roomsArray = [];

    req.body.rooms.forEach(room =>{
        roomsArray.push(Room.exists({number: room}));
    })

    let isRoomsExists = roomsArray.every(i => i === true);


    if(isFacultyExists && isRoomsExists && isBuildingExists){
        const floor = new Floor({
            number: req.body.number,
            faculty: req.body.faculty,
            rooms: req.body.rooms,
            building: req.body.building,
            temperatureSensorURL: req.body.temperatureSensorURL,
            co2SensorURL: req.body.co2SensorURL,
            floorColor: req.body.floorColor ?? '#ffffff'
        });
    
        try{
            const newFloor = await floor.save();

            const faculty = await Faculty.findOne({ name: req.body.faculty });
            faculty.floors.push(req.body.number);
            const updatedFaculty = await faculty.save();

            const building = await Building.findOne({ name: req.body.building })
            building.floors.push(req.body.number);
            const updatedBuilding = await building.save();

            res.status(201).json({floor: newFloor, faculty: updatedFaculty, building: updatedBuilding});
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
    let isBuildingExists = await Building.exists({name: req.body.building});
    let roomsArray = [];

    req.body.rooms.forEach(room =>{
        roomsArray.push(Room.exists({number: room.number}));
    })

    let isRoomsExists = roomsArray.every(i => i === true);

    if(isFacultyExists && isRoomsExists  && isBuildingExists){
        if(req.body.number != null){
            req.floor.number = req.body.number
        }
        if(req.body.faculty != null){
            req.floor.faculty = req.body.faculty
        }
        if(req.body.rooms != null){
            req.floor.rooms = req.body.rooms
        }
        if(req.body.temperatureSensorURL != null){
            req.floor.temperatureSensorURL = req.body.temperatureSensorURL
        }
        if(req.body.co2SensorURL != null){
            req.floor.co2SensorURL = req.body.co2SensorURL
        }
        if(req.body.floorColor != null){
            req.floor.floorColor = req.body.floorColor
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
        await Faculty.updateOne({ name: res.floor.faculty }, {
            $pullAll: {
                floors: [res.floor.number],
            },
        });
        await Building.updateOne({ name: res.floor.building }, {
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