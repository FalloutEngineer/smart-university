const express = require('express');
const router = express.Router();
const Faculty = require('../models/faculty');

const authMiddleware = require('../middleware/authMiddleware');


router.get('/:number', authMiddleware, (req, res)=>{
    getFaculty(req.params.number).then((result) =>{
        if(result){
            res.render('view-faculty',  {item: result, currentPage: 'manage', currentBoard: 'faculty-list'});
        }else{
            res.redirect('../404');
        }
    }).catch((e)=>{
        res.redirect('../404');
    });
    
})


async function getFaculty(name){
    try{
        faculty = await Faculty.findOne({
            name: decodeURI(name)
        })
        if(faculty == null){
            return null;
        }
    } catch(err){
        return null;
    }
    return faculty;
}

module.exports = router;