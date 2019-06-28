var express = require('express');
var router = express.Router();
const trades=require('../controllers/trades')


router.get('/',trades.getAllTrades );
router.post('/',trades.insertTrade )
router.get('/users/:id',trades.getSingleTrdes)

// Routes related to trades

module.exports = router;