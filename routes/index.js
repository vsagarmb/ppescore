var express = require('express');
var router = express.Router();
var myParser = require("body-parser");
var app = express();
var data;
var db = require('../data/userdb');

var bodyParser = require('body-parser');
router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

db.aSyncCalls();

/* GET home page. */
router.get('/', function(req, res, next) {
  
  db.queryZones(function(err,zoneCount, zoneObjs) {   
    if(err) return console.log(err);
    db.queryOperators(function(err, opCount, opObjs) {
      if(err) return console.log(err);
      res.render('index', { opObjs: opObjs, opCount: opCount, zoneCount: zoneCount, zoneObjs: zoneObjs });
    });    
  });   
});

/* POST Data */
router.post("/data", function(request, response, next) {   
  var objs = [request.body.OperatorID, request.body.operatorName, request.body.zoneID, request.body.ppe1Status, request.body.ppe2Status, request.body.ppe3Status, request.body.ppe4Status, request.body.ppe5Status];
  db.createOperators(objs, function(err, rowCount) {
    if(err) return console.log(err);
    response.send(`Added ${rowCount} records new`);  
    console.log(`Added ${rowCount} records inside`);
  });
}); 

router.get('/view', function(req, res, next) {
  res.render('view', { title: 'Data Received', name: 'Sagar'});
  console.log("view method");
});

module.exports = router;
