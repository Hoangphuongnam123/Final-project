

var flash = require('express-flash');
//router.use(flash());

var dbConn = require('../dbConnect/db');
var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
router.get("/chat", function (req, res) {
  var session = req.session.username;

  res.render('chat', { title: 'Express', session: session });
});


/* GET home page. */
router.get('/', function (req, res, next) {

  var session = req.session.username;

  res.render('index', { title: 'Express', session: session });
});


//hiên thi danh sách
router.get('/list', (req, res) => {
  var session = req.session.username;
  let sql = "SELECT * FROM nhanvien";
  let query = dbConn.query(sql, (err, users) => {
    if (err) throw err;
    res.render('list', {
      users: users, session: session
    });
  });
});

//thêm nhân viên
router.post('/create', (req, res) => {
  let name = req.body.hoten;
  let email = req.body.email;
  let password = req.body.password;
  let errors = false;

  if (name.length === 0 || email.length === 0 || password.length === 0) {
    errors = true;
    req.flash('error', "Thông tin không được bổ trống!!");
    res.locals.message = req.flash();
    res.redirect('/list');
  }
  else {
    let data = { ten: name, email: email, password: password };
    let sql = "INSERT INTO nhanvien SET ?";
    let query = dbConn.query(sql, data, (err, results) => {
      if (err) throw err;
      res.redirect('/');
      var transporter = nodemailer.createTransport({// config mail server
        service: 'gmail',
        auth: {
          user: '198hoangnam@gmail.com',
          pass: 'sakuragihanamichi'
        }
      });
      var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
        from: '198hoangnam@gmail.com',
        to: req.body.email,
        subject: 'Create Account',
        text: 'You recieved message  ',
        html: '<p>Your account have been created</b><ul><li>Username:' + req.body.hoten + '</li><li>Email:' + req.body.email + '</li><li>Password:' + req.body.password + '</li></ul>'
      }
      transporter.sendMail(mainOptions, function (err, info) {
        if (err) {
          console.log(err);
          res.redirect('/');
        } else {
          console.log('Message sent: ' + info.response);
          res.redirect('/');
        }
      });
      console.log('Create success.');
    });
  }
});
router.post('/search', (req, res) => {
  let name = req.body.ten;
  let sql = "select * from nhanvien where ten like ? ";
  let query = dbConn.query(sql, '%' + name + '%', (err, users) => {
    if (err) throw err;
    res.render('list', {
      users: users
    });
  });
});
//update
router.post('/edit', (req, res) => {
  let id = req.body.id;
  let name = req.body.hoten;
  let email = req.body.email;
  let password = req.body.password;
  let data = { ten: name, email: email, password: password };
  let sql = "update nhanvien set ? where id = " + id;
  let query = dbConn.query(sql, data, (err, users) => {
    if (err) throw err;
    res.redirect('/list');
  });
});
//xóa
router.post('/delete', (req, res) => {
  let id = req.body.id;
  let sql = "delete from nhanvien where id = " + id;
  let query = dbConn.query(sql, (err, users) => {
    if (err) throw err;
    console.log('delete');
    res.redirect('/list');
  });
});

module.exports = router;
