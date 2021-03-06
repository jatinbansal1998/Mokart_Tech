var express = require('express');
var fs=require('fs');
var router = express.Router();
var db=require('../db');
/* GET home page. */
router.get('/',(req,res,next)=>{
    res.render('signup',{'title':'choose signup'});
});

router.get('/customer', function(req, res, next) {
    res.render('signup_cust', { title: 'Customer SignUp' });
});
router.post('/customer', function(req, res, next) {
    console.log(req.body);
    // var re = /^(([^<>()[]\.,;:s@"]+(.[^<>()[]\.,;:s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/;
    // var create_table_customers=`CREATE TABLE IF NOT EXISTS
    //     customers (
    //         custid VARCHAR(40) NOT NULL UNIQUE,
    //         cname VARCHAR(20) NOT NULL,
    //         password VARCHAR(100) NOT NULL,
    //         dob DATE NOT NULL,
    //         age INT,
    //         PRIMARY KEY (custid)
    //     )`;
    // // console.log(create_table_customers);
    // db.query(create_table_customers,function(err,result){
    //     if(err) console.log(err);
    //     else console.log(result);
    // });

    // // var droptrigger='drop trigger if exists check_name';
    // // db.query(droptrigger,function(err,result){
    // //     if(err) console.log(err);
    // //     else{
    // //         console.log('trigger hat gaya');
    // //         console.log(result);
    //         var age_trigger=`create trigger check_name before insert on customers for each row
    //         begin
    //         declare age int;
    //         set age=datediff(now(),new.dob)/365.25;
    //         if age < 18 then
    //         signal sqlstate '45000'
    //         SET message_text='customer age less than 18';
    //         else
    //         set new.age=age;
    //         END IF;
    //         END;`;

    //         db.query(age_trigger,function(err,result){
    //             if(err) console.log(err);
    //             else{
    //                 console.log('trigger set hai');
    //                 console.log(result);
    //             }
    //         });
    //     // }
    // // });

    // var create_table_custphone=`CREATE TABLE IF NOT EXISTS 
    //     custphone (
    //         custid VARCHAR(40) NOT NULL,
    //         cphone VARCHAR(20) NOT NULL,
    //         PRIMARY KEY (custid,cphone),
    //         FOREIGN KEY (custid) REFERENCES customers(custid)
    //     )`;
    // // console.log(create_table_cphone);
    // db.query(create_table_custphone,function(err,result){
    //     if(err) console.log(err);
    //     else console.log(result);
    // });

    // var create_table_state=`CREATE TABLE IF NOT EXISTS 
    //     state (
    //         city VARCHAR(20) NOT NULL UNIQUE,
    //         state VARCHAR(20) NOT NULL,
    //         PRIMARY KEY (city)
    //     )`;
    // // console.log(create_table_state);
    // db.query(create_table_state,function(err,result){
    //     if(err) console.log(err);
    //     else console.log(result);
    // });

    // var create_table_city=`CREATE TABLE IF NOT EXISTS 
    //     city (
    //         pincode VARCHAR(6) NOT NULL UNIQUE,
    //         city VARCHAR(20) NOT NULL,
    //         PRIMARY KEY (pincode),
    //         FOREIGN KEY (city) REFERENCES state(city)
    //     )`;
    // // console.log(create_table_city);
    // db.query(create_table_city,function(err,result){
    //     if(err) console.log(err);
    //     else console.log(result);
    // });

    // var create_table_caddress=`CREATE TABLE IF NOT EXISTS 
    //     caddress (
    //         custid VARCHAR(40) NOT NULL,
    //         houseno VARCHAR(50) NOT NULL,
    //         streetno VARCHAR(50) NOT NULL,
    //         pincode VARCHAR(6) NOT NULL,
    //         PRIMARY KEY (custid,houseno,streetno,pincode),
    //         FOREIGN KEY (pincode) REFERENCES city(pincode),
    //         FOREIGN KEY (custid) REFERENCES customers(custid)
    //     )`;
    // // console.log(create_table_address);
    // db.query(create_table_caddress,function(err,result){
    //     if(err) console.log(err);
    //     else console.log(result);
    // });

//....................insert queries..................................................o...................................
    
    let errstr='';
    var insert_cust="INSERT INTO customers (custid,cname,password,dob) values ('" + req.body.email+ "','"+req.body.cname+"','"+req.body.password+"','"+req.body.dob+"')";
    // console.log(insert_cust);
    db.query(insert_cust,function(err,result){
        if(err) {
            console.log(err.sqlMessage);
            let cerr=''+err.sqlMessage;
            console.log(cerr);
            cerr=cerr.search('less than 18');
            console.log(cerr);
            console.log('there is error in adding into customers table');
            if(cerr!=-1){
                errstr+='<div style="color:red;font-size:12;padding:5px;padding-left:10px;">age is less than 18</div>';
                console.log(errstr);
                delete req.body.dob;
            }
            cerr=''+err.sqlMessage;
            cerr=cerr.search('Duplicate entry');
            if(cerr!=-1){
                errstr+='<br><div style="color:red;font-size:12;padding:5px;padding-left:10px;">email id is already registered</div>';
                console.log(errstr);
            }
            console.log('there is some error\nha\nha\nhaah\n');
            res.render('signup_cust',{title:'customer signup',loggedin:false,result:req.body,err:errstr});
        }
        else {
            console.log(result);

        //...........all the queries after inserting in customers
        req.body.address.forEach(addr=>{
            var insert_state="INSERT INTO state (city,state) values ('" + addr.city+ "','"+addr.state+"')";
            // console.log(insert_state);
            db.query(insert_state,function(err,result){
                if(err) console.log(err);
                else console.log(result);
            });
            
            var insert_city="INSERT INTO city (pincode,city) values ('" + addr.pincode+ "','"+addr.city+"')";
            console.log(insert_state);
            db.query(insert_city,function(err,result){
                if(err) console.log(err);
                else console.log(result);
            });
    
            var insert_caddress="INSERT INTO caddress (custid,houseno,streetno,pincode) values ('" + req.body.email+ "','"+addr.houseno+"','"+addr.streetno+"','"+addr.pincode+"')";
            // console.log(insert_caddress);
            db.query(insert_caddress,function(err,result){
                if(err) console.log(err);
                else console.log(result);
            });
        });
    
        req.body.phone.forEach(phone => {
            var insert_custphone="INSERT INTO custphone (custid,cphone) values ('" + req.body.email+ "','"+phone+"')";
            // console.log(insert_state);
            db.query(insert_custphone,function(err,result){
                if(err) console.log(err);
                else console.log(result);
            });            
        });
        var cartid=req.body.email+'0';
        var cart='insert into shoppingcart (cartid,custid) values ("'+cartid+'","'+req.body.email+'")';
        db.query(cart,(err,result)=>{
            if(err) console.log(err);
            else console.log(result);
        });
        console.log('no error');
        res.redirect('/signin');
        }
    });

});
router.get('/seller', function(req, res, next) {
    res.render('signup_seller', { title: 'Seller SignUp' });
});
router.post('/seller',function(req,res,next){
    // var create_table_sellers=`CREATE TABLE IF NOT EXISTS 
    //     sellers (
    //         sellerid VARCHAR(40) NOT NULL UNIQUE,
    //         sname VARCHAR(20) NOT NULL,
    //         password VARCHAR(100) NOT NULL,
    //         dob DATE NOT NULL,
    //         age INT,
    //         address VARCHAR(100) NOT NULL,
    //         PRIMARY KEY (sellerid))`;
    // db.query(create_table_sellers,function(err,result){
    //     if(err) console.log(err);
    //     else console.log(result);
    // });

    // var age_trigger=`create trigger check_age_seller before insert on sellers for each row
    //         begin
    //         declare age int;
    //         set age=datediff(now(),new.dob)/365.25;
    //         if age < 18 then
    //         signal sqlstate '45000'
    //         SET message_text='sellers age less than 18';
    //         else
    //         set new.age=age;
    //         END IF;
    //         END;`;

    //     db.query(age_trigger,function(err,result){
    //         if(err) console.log(err);
    //         else{
    //             console.log('trigger set hai');
    //             console.log(result);
    //         }
    //     });

    // var create_table_sellerphone=`CREATE TABLE IF NOT EXISTS 
    //     sellerphone (
    //         sellerid VARCHAR(40) NOT NULL,
    //         sphone VARCHAR(20) NOT NULL,
    //         PRIMARY KEY (sellerid,sphone),
    //         FOREIGN KEY (sellerid) REFERENCES sellers(sellerid))`;
    // db.query(create_table_sellerphone,function(err,result){
    //     if(err) console.log(err);
    //     else console.log(result);
    // });

    // var additem=`CREATE TABLE IF NOT EXISTS 
    //     items (
    //         itemid VARCHAR(40) NOT NULL UNIQUE,
    //         iname VARCHAR(20) NOT NULL,
    //         price FLOAT NOT NULL,
    //         description VARCHAR(100) NOT NULL,
    //         shipcost FLOAT NOT NULL,
    //         sellerid VARCHAR(40) NOT NULL,
    //         iquantity INT NOT NULL,
    //         dateofadd DATETIME NOT NULL,
    //         type VARCHAR(100) NOT NULL,
    //         PRIMARY KEY (itemid),
    //         FOREIGN KEY (sellerid) REFERENCES sellers(sellerid))`; 
    // db.query(additem,(err,result)=>{
    //     if(err) console.log(err);
    //     else console.log(result);
    // });
    // var electronics=`CREATE TABLE IF NOT EXISTS 
    //     electronics (
    //         itemid VARCHAR(40) NOT NULL UNIQUE,
    //         warrenty VARCHAR(20) NOT NULL,
    //         PRIMARY KEY (itemid),
    //         FOREIGN KEY (itemid) REFERENCES items(itemid))`;
    // db.query(electronics,(err,result)=>{
    //     if(err) console.log(err);
    //     else console.log(result);
    // });
    // var fashion=`CREATE TABLE IF NOT EXISTS 
    //     fashion (itemid VARCHAR(40) NOT NULL UNIQUE,
    //         size VARCHAR(20) NOT NULL,
    //         PRIMARY KEY (itemid),
    //         FOREIGN KEY (itemid) REFERENCES items(itemid))`;
    // db.query(fashion,(err,result)=>{
    //     if(err) console.log(err);
    //     else console.log(result);
    // });
    // var sports=`CREATE TABLE IF NOT EXISTS
    //     sports (
    //         itemid VARCHAR(40) NOT NULL UNIQUE,
    //         size VARCHAR(20) NOT NULL,
    //         PRIMARY KEY (itemid),
    //         FOREIGN KEY (itemid) REFERENCES items(itemid))`;
    // db.query(sports,(err,result)=>{
    //     if(err) console.log(err);
    //     else console.log(result);
    // });
    // var books=`CREATE TABLE IF NOT EXISTS 
    //     books (
    //         itemid VARCHAR(40) NOT NULL UNIQUE,
    //         author VARCHAR(20) NOT NULL,
    //         publisher VARCHAR(20) NOT NULL,
    //         PRIMARY KEY (itemid),
    //         FOREIGN KEY (itemid) REFERENCES items(itemid))`;
    // db.query(books,(err,result)=>{
    //     if(err) console.log(err);
    //     else console.log(result);
    // });

    //...................insert data of seller...............................ooooo.....................................

    let errstr='';
    var insert_seller="INSERT INTO sellers (sellerid,sname,password,dob,address) values ('" + req.body.email+ "','"+req.body.sname+"','"+req.body.password+"','"+req.body.dob+"','"+req.body.address+"')";
    db.query(insert_seller,function(err,result){
        if(err) {
            console.log(err.sqlMessage)
            let cerr=''+err.sqlMessage;
            console.log(cerr);
            cerr=cerr.search('less than 18');
            console.log(cerr);
            console.log('there is error in adding into sellers table');
            if(cerr!=-1){
                errstr+='<div style="color:red;font-size:12;padding:10px">age is less than 18</div>';
                console.log(errstr);
                delete req.body.dob;
            }
            cerr=''+err.sqlMessage;
            cerr=cerr.search('Duplicate entry');
            if(cerr!=-1){
                errstr+='<br><div style="color:red;font-size:12;padding:10px">email id is already registered</div>';
                console.log(errstr);
            }
            console.log('there is some error\nha\nha\nhaah\n');
            res.render('signup_seller',{title:'seller signup',loggedin:false,result:req.body,err:errstr});
        }
        else {
            console.log(result);
            req.body.phone.forEach(phone => {
                var insert_sellerphone="INSERT INTO sellerphone (sellerid,sphone) values ('" + req.body.email+ "','"+phone+"')";
                db.query(insert_sellerphone,function(err,result){
                    if(err) console.log(err);
                    else {
                        console.log(result);
                    }
                });
            });
            var dir='./public/images/'+req.body.email;
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir);
            }
            res.redirect('/signin');
        }
    });
});
module.exports = router;
