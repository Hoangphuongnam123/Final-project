
var express = require('express');
var router = express.Router();
var dbConn = require('../dbConnect/db');

router.get('/', function (req, res, next) {
  res.render('login', { title: 'Express',message: req.flash('message') });
});
router.post('/checklogin', (req, res) => {
  let username = req.body.ten;
  let password = req.body.password;
  let sql = "SELECT * FROM nhanvien where ten = ? and password = ? ";
  let query = dbConn.query(sql,[username,password],(err, results) => {
    if(results.length > 0)
    {
      req.session.username = username;
      req.session.loggedin = true;
      res.redirect('/');
    }
    else if (results.length==0){
      req.flash('message','Cần nhập đúng thông tin!!');
      res.redirect('/login');
    }
  });
});
/*l*/
router.get('/logout', function (req, res, next) {
  req.session.destroy();
  res.redirect('/');
});
  module.exports = router;
  