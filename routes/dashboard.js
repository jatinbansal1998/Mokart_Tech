var express = require('express');
var router = express.Router();
var db = require('../db');

router.get('/:id', (req, res, next) => {


    if (req.session.user && req.params.id === req.session.user.sellerid) {
        var countquery = "select * from items as i where i.sellerid='" + req.session.user.sellerid + "'";
        db.query(countquery, (err, result) => {
            res.render('sellerDashboard', {title: 'Dashboard', items: result, loggedin: true, user: req.session.user});
        });
    }
    else if (req.session.user && req.params.id === req.session.user.custid) {
        res.render('customerDashboard', {title: 'Dashboard', items: result, loggedin: true, user: req.session.user});
    }

});

module.exports = router;