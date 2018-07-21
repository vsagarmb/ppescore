var express = require('express');
var router = express.Router();
var myParser = require("body-parser");
var app = express();
var data;
var db = require('../data/userdb');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'PPE-Score' });
});

/* POST Data */
router.post("/data", function(request, response, next) {
  console.log(request.body);  
  
  db.createUsers(function(err, rowCount) {
    if(err) return next(err);    
    response.send(`Added ${rowCount} records new`);  
    console.log(`Added ${rowCount} records inside`);
  });
});

router.get('/view', function(req, res, next) {
  res.render('view', { title: 'Data Received', name: 'Sagar'});
  console.log("view method");
});

module.exports = router;
