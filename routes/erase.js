var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data/trade.db');

db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS trades (type TEXT, id INTEGER, userId INTEGER, symbol TEXT, shares INTEGER,price INTEGER, timestamp DATETIME)");
    db.run("CREATE TABLE IF NOT EXISTS users (name TEXT, id INTEGER)");
});

// Route to delete all trades
router.delete('/', function(req,res){

    db.run('delete from trades',function(err, row){
        if (err){
            res.status(500).json();
        }
        else {
            db.run('delete from users',function(err, row){
                if (err){
                    res.status(500).json();
                }
                else {
                    res.status(200).json();
                }
              
            })

        }
      
    })

})

module.exports = router;
