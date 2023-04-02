const express = require('express');
const router = express.Router();
const Room = require('../models/room');

const authMiddleware = require('../middleware/authMiddleware');


router.get('/:number', authMiddleware, (req, res)=>{
    getRoom(req.params.number).then((result) =>{
        if(result){
            res.render('view-room',  {item: result, currentPage: 'manage', currentBoard: 'room-list'});
        }else{
            res.redirect('../404');
        }
    }).catch((e)=>{
        res.redirect('../404');
    });
    
})

router.get('/:number/edit/', authMiddleware, (req, res)=>{
    getRoom(req.params.number).then((result) =>{
        console.log(result);
        if(result){
            res.render('edit',  {item: result, currentPage: 'manage', currentBoard: 'room-list'});
        }else{
            res.redirect('../404');
        }
    }).catch((e)=>{
        res.redirect('../404');
    });
    
})


async function getRoom(number){
    try{
        room = await Room.findOne({
            number: number
        })
        if(room == null){
            return null;
        }
    } catch(err){
        return null;
    }

    return room;
}

module.exports = router;