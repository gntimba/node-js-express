var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data/trade.db');

// {
//     "id": 1,
//     "type": "buy",
//     "user": {
//        "id": 1,
//        "name": "David"
//     },
//     "symbol": "AC",
//     "shares": 28,
//     "price": 162.17,
//     "timestamp": "2014-06-14 13:13:13"
//  }
db.serialize(function () {
    db.run("CREATE TABLE IF NOT EXISTS trades (type TEXT, id INTEGER, userId INTEGER, symbol TEXT, shares INTEGER,price INTEGER, timestamp DATETIME)");
    db.run("CREATE TABLE IF NOT EXISTS users (name TEXT, id INTEGER)");
});
exports.getAllTrades = function (req, res) {
    let response = []

    db.all('SELECT  DISTINCT trades.id as id,type,symbol,userId,name,shares,timestamp,price FROM trades,users WHERE trades.userId=users.id ORDER by trades.id ASC', [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            resp = {
                "id": row.id,
                "type": row.type,
                "user": {
                    "id": row.userId,
                    "name": row.name
                },
                "symbol": row.symbol,
                "shares": row.shares,
                "price": row.price,
                "timestamp": row.timestamp
            }
            response.push(resp)
        });
        res.status(200).json(response)
    });
}

exports.getSingleTrdes = function (req, res) {
    let id = req.params.id

    let response = []

    db.all('SELECT  DISTINCT trades.id as id,type,symbol,userId,name,shares,timestamp,price FROM trades,users WHERE trades.userId=users.id AND users.id=? ORDER by trades.id ASC', id, [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            resp = {
                "id": row.id,
                "type": row.type,
                "user": {
                    "id": row.userId,
                    "name": row.name
                },
                "symbol": row.symbol,
                "shares": row.shares,
                "price": row.price,
                "timestamp": row.timestamp
            }
            response.push(resp)
        });
        res.status(200).json(response)
    });
}

exports.insertTrade = function (req, res) {
    let data = req.body;
    db.get('SELECT id FROM trades WHERE id =?', data.id, function (err, row) {
        try {
            if (data.id === row.id) {

                res.status(400).json(row)
            }
        } catch (error) {
            db.run("INSERT INTO trades (type, id, userId, symbol, shares,price, timestamp) VALUES (?, ?,?,?,?,?,?)", data.type, data.id, req.body.user.id, data.symbol, data.shares, data.price, data.timestamp, function (err, row) {
                if (err) {
                    console.err(err);
                    res.status(500);
                }
                else {
                    db.run("INSERT INTO users (name, id) VALUES (?, ?)", req.body.user.name, req.body.user.id);
                    res.status(201);
                }
                res.end();
            });
        }
    })
}