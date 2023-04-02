const express = require('express');
const router = express.Router();
const Building = require('../models/building');
const Floor = require('../models/floor');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const authMiddleware = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, './static/svg');
    },
    filename: (req,file,cb)=>{
        cb(null, Date.now() + path.extname(file.originalname));
    }
  });

//   const backgroundStorage = multer.diskStorage({
//     destination: (req, file, cb) =>{
//         cb(null, './static/backgrounds');
//     },
//     filename: (req,file,cb)=>{
//         cb(null, Date.now() + path.extname(file.originalname));
//     }
//   });
  
const upload = multer({
  storage: storage
});



//get all
router.get('/', authMiddleware, async (req, res) => {
    try{
        const buildings = await Building.find();
        res.json(buildings);
    } catch (err){
        res.status().json({message: err.message});
    }
});

//get one
router.get('/:name', authMiddleware, getBuilding, (req, res) => {
    res.json(res.building)
});

//create one
router.post('/', authMiddleware, upload.single('svg'), async (req, res) =>{
    let floorsArray = [];

    let isFloorsExists = true;

    if(floorsArray.length > 0 && floorsArray != '[]'){
        for(const floor of req.body.floors){
            floorsArray.push(null != await Floor.exists({number: floor.number}));
        }
    
        isFloorsExists = floorsArray.every(i => i === true);
    }

    let svg;
    
    if(req.file){
        svg = req.file.filename
    }

    if(isFloorsExists){
        const building = new Building({
            name: req.body.name,
            floors: req.body.floors[0] != '' ? req.body.floors : [],
            svg: svg,
            // background: req.body.background,
            address: req.body.address
        });
    
        try{
            const newBuilding = await building.save();


            res.status(201).json({building: newBuilding});
        } catch(err){
            res.status(400).json({message: err.message});
        }
    }else{
        res.status(400).json({message: "Invalid floors"});
    }

    
});

//update one
router.patch('/', authMiddleware, getBuilding, async (req, res)=>{
    let floorsArray = [];


    for(const floor of req.body.floors){
        floorsArray.push(null != await Floor.exists({number: floor.number}));
    }

    let isFloorsExists = floorsArray.every(i => i === true);

    
    const address = path.resolve('./static/svgModels/' + res.building.svg);
    if(fs.existsSync(address)){
        fs.unlinkSync(address);
    }

    const svg = req.file.filename;

    if(isFacultyExists && isFloorsExists){
        if(req.body.name != null){
            req.building.name = req.body.name
        }
        if(req.body.floors != null){
            req.building.floors = req.body.floors
        }
        if(req.body.svg != null){
            req.building.svg = svg
        }
        // if(req.body.background != null){
        //     req.building.background = req.body.background
        // }
        if(req.body.address != null){
            req.building.address = address
        }
        try{
            const updatedBuilding = await res.building.save
            res.status(200).json(updatedBuilding);
        } catch (err){
            res.status(400).json({message: err.message});
        }
    }else{
        res.status(400).json({message: "Invalid room or faculty"});
    }
    
});

// delete one
router.delete('/:name', authMiddleware, getBuilding, async (req, res) =>{
    try{
        const address = path.resolve('./static/svg/' + res.room.svg);
        if(fs.existsSync(address)){
            fs.unlinkSync(address);
        }
        await res.building.remove();
        res.json({message: "Deleted Building"});
    } catch(err){
        res.status(500).json({message: err.message});
    }
});

async function getBuilding(req, res, next){
    try{
        building = await Building.findOne({
            name: req.params.name
        })
        if(building == null){
            return res.status(404).json({message: "Can't find building"});
        }
    } catch(err){
        return res.status(500).json({message: err.message});
    }

    res.building = building;
    next();
}

module.exports = router;