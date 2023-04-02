const express = require('express');
const router = express.Router();
const Floor = require('../models/floor');

const authMiddleware = require('../middleware/authMiddleware');


router.get('/:number', authMiddleware, (req, res)=>{
    getFloor(req.params.number).then((result) =>{
        if(result){
            res.render('view-floor',  {item: result, currentPage: 'manage', currentBoard: 'floor-list'});
        }else{
            res.redirect('../404');
        }
    }).catch((e)=>{
        res.redirect('../404');
    });
    
})


async function getFloor(number){
    try{
        floor = await Floor.findOne({
            number: number
        })
        if(floor == null){
            return null;
        }
    } catch(err){
        return null;
    }
    return floor;
}

module.exports = router;