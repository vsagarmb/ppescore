var express = require('express');
var router = express.Router();
var myParser = require("body-parser");
var app = express();
var data;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'PPE-Score' });
});

/* POST Data */
router.post("/data", function(request, response) {
  console.log(request.body);  
  data = request.get('Hello');
});

router.get('/view', function(req, res, next) {
  res.render('view', { title: 'Data Received', name: 'Sagar'});
 //console.log("view method");
});

module.exports = router;
