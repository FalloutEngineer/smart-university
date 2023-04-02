const express = require('express');
const router = express.Router();
const Pulpit = require('../models/pulpit');

const authMiddleware = require('../middleware/authMiddleware');


router.get('/:number', authMiddleware, (req, res)=>{
    getPulpit(req.params.number).then((result) =>{
        if(result){
            res.render('view-pulpit',  {item: result, currentPage: 'manage', currentBoard: 'pulpit-list'});
        }else{
            res.redirect('../404');
        }
    }).catch((e)=>{
        res.redirect('../404');
    });
    
})


async function getPulpit(name){
    try{
        pulpit = await Pulpit.findOne({
            name: name
        })
        if(pulpit == null){
            return null;
        }
    } catch(err){
        return null;
    }
    return pulpit;
}

module.exports = router;