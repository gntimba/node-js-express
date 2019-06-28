var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data/trade.db');
db.serialize(function () {
    db.run("CREATE TABLE IF NOT EXISTS trades (type TEXT, id INTEGER, userId INTEGER, symbol TEXT, shares INTEGER,price INTEGER, timestamp DATETIME)");
    db.run("CREATE TABLE IF NOT EXISTS users (name TEXT, id INTEGER)");
    // db.run("INSERT INTO counts (key, value) VALUES (?, ?)", "counter", 0);
});
exports.tradesBytyp = function (req, res) {
    //console.log(req.query)
    let type = req.query.type
    let start = req.query.start
    let end = req.query.end
    let stock = req.params.stockSymbol
    let response = []

    db.all('SELECT  DISTINCT trades.id as id,type,symbol,userId,name,shares,timestamp,price FROM trades,users WHERE trades.userId=users.id AND symbol =? and type=? AND timestamp BETWEEN ? AND ? ORDER by trades.id ASC', stock, type, start, end, [], (err, rows) => {
        if (err) {
            throw err;
        }
        console.log(rows)
        if (rows.length > 0) {
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
        }
        else {
            res.status(404).json()
        }
    });
    res.end
}

exports.stocks = function (req, res) {
    let start = req.query.start
    let end = req.query.end
    let stock = req.params.stockSymbol
    db.get('select symbol, max(price) as highest,min(price) as lowest FROM trades WHERE symbol=? AND timestamp BETWEEN ? and ?', stock, start, end, function (err, row) {
        try {
            if (row.symbol !== null) {
                res.status(200).json(row)
            } else {
                res.status(404).json({ message: 'couldnt find stock' })
            }
        } catch (error) {

        }
    })
}