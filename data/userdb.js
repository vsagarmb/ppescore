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

var createUsers = function(objs, callback) {    
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

            request.addParameter('idValue', TYPES.Int, objs[0]);
            request.addParameter('opName', TYPES.NVarChar, objs[1]);
            request.addParameter('zID', TYPES.Int, objs[2]);
            request.addParameter('ppe1Stat', TYPES.Int, objs[3]);
            request.addParameter('ppe2Stat', TYPES.Int, objs[4]);
            request.addParameter('ppe3Stat', TYPES.Int, objs[5]);
            request.addParameter('ppe4Stat', TYPES.Int, objs[6]);
            request.addParameter('ppe5Stat', TYPES.Int, objs[7]);
            
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