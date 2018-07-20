var tedious = require('tedious');

var Connection = tedious.Connection;
var Request = tedious.Request;

var config = {
    userName: 'ppescorenode',
    password: 'int BABA();',
    server: 'ppescorenodesql.database.windows.net',
    options: {
        database: 'ppescoredb',
        encrypt: true,
        rowCollectionOnRequestCompletion: true
    }
}

var createUsers = function(callback) {
    var connection = new Connection(config);
    connection.on('connect', function(err) {
        if(err) {
            callback(err);
        }
        else {
            var request = new Request(
                `
                IF EXISTS (SELECT 1 FROM operator where id=?)
                UPDATE operator SET operatorName=?, zoneID=?, ppe1Status=?, ppe2Status=?, ppe3Status=?, ppe4Status=?, ppe5Status=? where id=?
                ELSE
                INSERT INTO operator (operatorName, zoneID, ppe1Status, ppe2Status, ppe3Status, ppe4Status, ppe5Status) VALUES (?,?,?,?,?,?,?)
                `,
                function(err, rowCount) {
                    callback(err, rowCount);
                }
            );
            connection.execSql(request, 1, 'Ananya', 1, 1, 1, 1, 1, 1, 1, 'Alekhya', 1, 1, 1, 1, 1, 1);
        }
    });
};

var queryUsers = function(callback) {
    var connection = new Connection(config);
    connection.on('connect', function(err) {
        if(err) {
            callback(err);
        }
        else {
            var request = new Request(               
                "select * from users",                
                function(err, rowCount, rows) {
                    callback(err, rowCount, rows);
                }
            );
            connection.execSql(request);
        }
    });
};

module.exports = {
    createUsers: createUsers,
    queryUsers: queryUsers
};