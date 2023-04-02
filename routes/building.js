const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const Building = require('../models/building');


router.get('/:name', authMiddleware, (req, res)=>{
    getBuilding(req.params.name).then((result) =>{
        if(result){
            res.render('view-building',  {item: result, currentPage: 'manage', currentBoard: 'building-list'});
        }else{
            res.redirect('../404');
        }
    }).catch((e)=>{
        res.redirect('../404');
    });
    
})


async function getBuilding(name){
    try{
        building = await Building.findOne({
            name: name
        })
        if(building == null){
            return null;
        }
    } catch(err){
        return null;
    }
    return building;
}

module.exports = router;