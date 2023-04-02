const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

//faculty

router.get('/faculties-page', (req, res)=>{
    res.render('faculties',  {currentPage: 'faculties'});
})

//buildings

router.get('/1building', authMiddleware, (req, res)=>{
    res.render('1building',  {currentPage: '1building'});
});

router.get('/2building', authMiddleware, (req, res)=>{
    res.render('2building',  {currentPage: '2building'});
});

router.get('/5building', authMiddleware, (req, res)=>{
    res.render('5building',  {currentPage: '5building'});
});

router.get('/6building', authMiddleware, (req, res)=>{
    res.render('6building',  {currentPage: '6building'});
});

//floors

//floors 1
router.get('/1_1floor', authMiddleware, (req, res)=>{
    res.render('1_1floor',  {currentPage: '1building'});
});

router.get('/1_2floor', authMiddleware, (req, res)=>{
    res.render('1_2floor',  {currentPage: '1building'});
});

router.get('/1_3floor', authMiddleware, (req, res)=>{
    res.render('1_3floor',  {currentPage: '1building'});
});

router.get('/1_4floor', authMiddleware, (req, res)=>{
    res.render('1_4floor',  {currentPage: '1building'});
});

router.get('/1_5floor', authMiddleware, (req, res)=>{
    res.render('1_5floor',  {currentPage: '1building'});
});

router.get('/1_6floor', authMiddleware, (req, res)=>{
    res.render('1_6floor',  {currentPage: '1building'});
});

router.get('/1_7floor', authMiddleware, (req, res)=>{
    res.render('1_7floor',  {currentPage: '1building'});
});

router.get('/1_8floor', authMiddleware, (req, res)=>{
    res.render('1_8floor',  {currentPage: '1building'});
});

// floors 2

router.get('/2_3floor', authMiddleware, (req, res)=>{
    res.render('2_3floor',  {currentPage: '2building'});
});

router.get('/2_4floor', authMiddleware, (req, res)=>{
    res.render('2_4floor',  {currentPage: '2building'});
});

router.get('/2_5floor', authMiddleware, (req, res)=>{
    res.render('2_5floor',  {currentPage: '2building'});
});

// floors 5

router.get('/5_1floor', authMiddleware, (req, res)=>{
    res.render('5_1floor',  {currentPage: '5building'});
});

router.get('/5_2floor', authMiddleware, (req, res)=>{
    res.render('5_2floor',  {currentPage: '5building'});
});

router.get('/5_3floor', authMiddleware, (req, res)=>{
    res.render('5_3floor',  {currentPage: '5building'});
});

router.get('/5_4floor', authMiddleware, (req, res)=>{
    res.render('5_4floor',  {currentPage: '5building'});
});

router.get('/5_5floor', authMiddleware, (req, res)=>{
    res.render('5_5floor',  {currentPage: '5building'});
});

//floors 6

router.get('/6_1floor', authMiddleware, (req, res)=>{
    res.render('6_1floor',  {currentPage: '6building'});
});

router.get('/6_2floor', authMiddleware, (req, res)=>{
    res.render('6_2floor',  {currentPage: '6building'});
});

module.exports = router;