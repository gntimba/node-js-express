var express = require('express');
var router = express.Router();
const stocks=require('../controllers/stocks')

router.get('/:stockSymbol/trades',stocks.tradesBytyp);
router.get('/:stockSymbol/price',stocks.stocks )




// Routes related to stocks

module.exports = router;