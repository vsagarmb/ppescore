var tedious = require('tedious');

var Connection = tedious.Connection;
var Request = tedious.Request;
var TYPES = tedious.TYPES;

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
                IF EXISTS (SELECT 1 FROM operator where id=@idValue)
                UPDATE operator SET operatorName=@opName, zoneID=@zID, ppe1Status=@ppe1Stat, ppe2Status=@ppe2Stat, ppe3Status=@ppe3Stat, ppe4Status=@ppe4Stat, ppe5Status=@ppe5Stat where id=@idValue;
                ELSE
                INSERT INTO operator (operatorName, zoneID, ppe1Status, ppe2Status, ppe3Status, ppe4Status, ppe5Status) VALUES (@opName,@zID,@ppe1Stat,@ppe2Stat,@ppe3Stat,@ppe4Stat,@ppe5Stat);
                `,
                function(err, rowCount) {
                    if (err) console.log(err);                    
                    callback(err, rowCount);
                }
            );

            request.addParameter('idValue', TYPES.Int, 1);
            request.addParameter('opName', TYPES.NVarChar, 'Ananya');
            request.addParameter('zID', TYPES.Int, 1);
            request.addParameter('ppe1Stat', TYPES.Int, 1);
            request.addParameter('ppe2Stat', TYPES.Int, 0);
            request.addParameter('ppe3Stat', TYPES.Int, 0);
            request.addParameter('ppe4Stat', TYPES.Int, 1);
            request.addParameter('ppe5Stat', TYPES.Int, 1);
            
            connection.execSql(request);
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