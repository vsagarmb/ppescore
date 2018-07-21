
var tedious = require('tedious');
var aSyncPolling = require("async-polling");

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
        rowCollectionOnRequestCompletion: true,
        useColumnNames: true
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
                UPDATE operator SET operatorName=@opName, zoneID=@zID, lastContactTime=@timeNow, ppe1Status=@ppe1Stat, ppe2Status=@ppe2Stat, ppe3Status=@ppe3Stat, ppe4Status=@ppe4Stat, ppe5Status=@ppe5Stat where id=@idValue;
                ELSE
                INSERT INTO operator (operatorName, zoneID, lastContactTime, ppe1Status, ppe2Status, ppe3Status, ppe4Status, ppe5Status) VALUES (@opName, @zID, @timeNow, @ppe1Stat, @ppe2Stat, @ppe3Stat, @ppe4Stat, @ppe5Stat);
                `,
                function(err, rowCount) {
                    if (err) console.log(err);                    
                    callback(err, rowCount);
                }
            );

            var timeNow = Math.round((new Date().getTime())/1000);

            request.addParameter('idValue', TYPES.Int, objs[0]);
            request.addParameter('opName', TYPES.NVarChar, objs[1]);
            request.addParameter('zID', TYPES.Int, objs[2]);
            request.addParameter('timeNow', TYPES.Int, timeNow);
            request.addParameter('ppe1Stat', TYPES.Int, objs[3]);
            request.addParameter('ppe2Stat', TYPES.Int, objs[4]);
            request.addParameter('ppe3Stat', TYPES.Int, objs[5]);
            request.addParameter('ppe4Stat', TYPES.Int, objs[6]);
            request.addParameter('ppe5Stat', TYPES.Int, objs[7]);
           
            connection.execSql(request);
        }
    });    
};

var checkConnection = function(opObj) {

    var currentTime = Math.round((new Date().getTime()/1000));

    if ((currentTime - opObj.lastContactTime.value) > 20)
        return 0;
    else
        return 1;
};

var checkCompliance = function(zones, opObj) {

    var opZoneID = opObj.zoneID.value;

    if ( (zones[opZoneID-1].ppe1.value <= opObj.ppe1Status.value) && 
    (zones[opZoneID-1].ppe2.value <= opObj.ppe2Status.value) && 
    (zones[opZoneID-1].ppe3.value <= opObj.ppe3Status.value) && 
    (zones[opZoneID-1].ppe4.value <= opObj.ppe4Status.value) && 
    (zones[opZoneID-1].ppe5.value <= opObj.ppe5Status.value) )
    {
        return 1;
    }
    else
        return 0;
};

var updateOperatorStatus = function(objs, callback) {    
    var connection = new Connection(config);    
    connection.on('connect', function(err) {
        if(err) {
            callback(err);
        }
        else {
            var request = new Request(
                `                
                UPDATE operator SET connectionStatus=@conStat, complianceStatus=@compStat where id=@idValue;
                `,
                function(err, rowCount) {
                    if (err) console.log(err);                    
                    callback(err, rowCount);
                }
            );

            request.addParameter('idValue', TYPES.Int, objs[0]);            
            request.addParameter('compStat', TYPES.Int, objs[1]);
            request.addParameter('conStat', TYPES.Int, objs[2]);
           
            connection.execSql(request);
        }
    });    
};

var queryOperators = function(callback) {
    var connection = new Connection(config);
    connection.on('connect', function(err) {
        if(err) {
            callback(err);
        }
        else {            
            var request = new Request(               
                "select * from operator",                
                function(err, rowCount, rows) {
                    callback(err, rowCount, rows);
                }
            );            
            connection.execSql(request);            
        }
    });    
};

var queryZones = function(callback) {
    var connection = new Connection(config);
    connection.on('connect', function(err) {
        if(err) {
            callback(err);
        }
        else {            
            var request = new Request(               
                "select * from zones",                
                function(err, rowCount, rows) {
                    callback(err, rowCount, rows);
                }
            );            
            connection.execSql(request);            
        }
    });    
};


var aSyncCalls = function() {

    var statusCheck = aSyncPolling(function(end) {
        
        var zoneObjs;
        var zoneObjsLen;

        // First Query the Zone Info
        queryZones(function(err, rowCount, rows) {                        
            zoneObjs = rows;            

            // Once you get the callback from the Zone info query, query the operator info
            queryOperators(function(err,rowCount, rows) {      
                
                for (var i = 0; i < rowCount; i++) {                

                    console.log("Operator " + rows[i].id.value + " Name: " + rows[i].operatorName.value);

                    // Check Connection Status
                    var conStatus = checkConnection(rows[i]);
                    console.log("Connection Status: " + conStatus);

                    // Check Compliance Status
                    compStatus = checkCompliance(zoneObjs, rows[i]);
                    console.log("Compliance Status: " + compStatus);

                    // Update Operator Status
                    if ((rows[i].connectionStatus.value != conStatus) || (rows[i].complianceStatus.value != compStatus)) {
                        updateOperatorStatus([i+1, compStatus, conStatus], function(err, rowCount){
                            if(rowCount > 0)
                                console.log("Updated " + rowCount + " operator");
                            else
                                console.log("Not Updated");

                            console.log("");
                        });
                    }
                    else {
                        console.log("Data upto date");
                        console.log("");
                    }
                }                
            });
        });

        end(null, "its over..");    
        
    }, 10000);

    statusCheck.run();
}

module.exports = {
    createUsers: createUsers,
    queryOperators: queryOperators,
    aSyncCalls: aSyncCalls    
};