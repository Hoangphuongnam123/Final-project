var express = require('express');
var router = express.Router();
var dbConn = require('../dbConnect/db');
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage }).single('hinhanh')
router.get('/listproduct', (req, res) => {
  var session = req.session.username;
  let sql = "SELECT * FROM sanpham";
  let query = dbConn.query(sql, (err, products) => {
    if (err) throw err;
    res.render('listproduct', {
      products: products, session: session
    });
  });
});
router.post('/add', (req, res) => {
  upload(req, res, function (err) {
    if (err) console.log('lỗi upload file')
    else {
      let name = req.body.tensp;
      let hinhanh = '/images/' + req.file.originalname;
      let data = { name: name, hinhanh: hinhanh };
      let sql = "INSERT INTO sanpham SET ?";
      let query = dbConn.query(sql, data, (err, results) => {
        if (err) throw err;
        res.redirect('/');
        console.log('Create success.');
      });
    }
  })
});
router.post('/edit', (req, res) => {
  let id = req.body.id;
  let name = req.body.tensp;
  let hinhanh = '/images/' + req.body.hinhanh;
  let password = req.body.password;
  let data = { name: name, hinhanh: hinhanh };
  let sql = "update sanpham set ? where id = " + id;
  let query = dbConn.query(sql, data, (err, product) => {
    if (err) throw err;
    res.redirect('/product/listproduct');
  });
});
router.post('/search', (req, res) => {
  let name = req.body.tensp;
  let sql = "select * from sanpham where name like ? ";
  let query = dbConn.query(sql, '%' + name + '%', (err, products) => {
    if (err) throw err;
    res.render('listproduct', {
      products: products
    });
  });
});
router.post('/delete', (req, res) => {
  let id = req.body.id;
  let sql = "delete from sanpham where id = " + id;
  let query = dbConn.query(sql, (err, product) => {
    if (err) throw err;
    console.log('delete');
    res.redirect('/listproduct');
  });
});
module.exports = router;