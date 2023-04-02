const express = require('express');
const router = express.Router();
const Faculty = require('../models/faculty');
const authMiddleware = require('../middleware/authMiddleware');

//get all
router.get('/', authMiddleware, async (req, res) => {
    try{
        const faculties = await Faculty.find();
        res.json(faculties);
    } catch (err){
        res.status().json({message: err.message});
    }
});

//get one
router.get('/:id', authMiddleware, getFaculty, (req, res) => {
    res.json(res.faculty)
});

//create one
router.post('/', authMiddleware, async (req, res) =>{
    const faculty = new Faculty({
        name: req.body.name,
        floors: req.body.floors || [],
        pulpits: req.body.pulpits || []
    });

    try{
        const newFaculty = await faculty.save();
        res.status(201).json(newFaculty);
    } catch(err){
        res.status(400).json({message: err.message});
    }
});

//update one
router.patch('/', authMiddleware, getFaculty, async (req, res)=>{
    if(req.body.name != null){
        req.faculty.name = req.body.name
    }
    if(req.body.floors != null){
        req.faculty.floors = req.body.floors
    }
    if(req.body.pulpits != null){
        req.faculty.pulpits = req.body.pulpits
    }
    try{
        const updatedFaculty = await res.faculty.save
        res.json(updatedFaculty);
    } catch (err){
        res.status(400).json({message: err.message});
    }
});

// delete one
router.delete('/:name', authMiddleware, getFaculty, async (req, res) =>{
    try{
        await res.faculty.remove();
        res.json({message: "Faculty successfull deleted"});
    } catch(err){
        res.status(500).json({message: err.message});
    }
});

async function getFaculty(req, res, next){
    try{
        faculty = await Faculty.findOne({name: req.params.name});
        if(faculty == null){
            return res.status(404).json({message: "Can't find faculty"});
        }
    } catch(err){
        return res.status(500).json({message: err.message});
    }

    res.faculty = faculty;
    next();
}

module.exports = router;