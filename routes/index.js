var express = require('express');
var passport = require('passport');
var router = express.Router();
var yelp = require('../configs/yelpConfig');

var User = require('../models/index').User;
var Bar = require('../models/index').Bar;

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
      title: 'Nightlife',
      user: req.user
  });
});

router.get('/search', function(req, res){

    yelp.search({ term: 'bar', location: req.query.keywords })
        .then(function (data) {
            // pre process data, adding how many people going
            var yelpBars = data.businesses;
            Bar.find({}, function(err, dbBars){
                if(err) throw err;

                yelpBars.forEach(function(yelpBar){
                    yelpBar.attending = 0;
                    dbBars.forEach(function(dbBar){
                        if(dbBar.coordinate.latitude == yelpBar.location.coordinate.latitude &&
                            dbBar.coordinate.longitude == yelpBar.location.coordinate.longitude){
                            yelpBar.attending ++;
                        }
                    })
                });

                res.render('barlist', {
                    title: 'bar List',
                    keywords: req.query.keywords,
                    bars: yelpBars
                })
            });
        })
        .catch(function (err) {
            res.send(err)
        });
});

//router.get('/cancel', ensureAuthenticated, function(req, res){
//    var latitude = req.query.latitude;
//    var longitude = req.query.longitude;
//    var name = req.query.name;
//
//    Bar.findOne({'coordinate.latitude': latitude, 'coordinate.longitude': longitude}, function(err, bar){
//        if(err){
//            res.status(500).send(err)
//        }else{
//            if(bar){
//                Bar.remove({_id: bar._id}, function(err){
//                    if(err){
//                        res.status(500).send(err);
//                    }else{
//                        res.redirect('back');
//                    }
//                })
//            }else{
//                res.redirect('back');
//            }
//        }
//    })
//});

router.get('/going', ensureAuthenticated, function(req, res){
    var latitude = req.query.latitude;
    var longitude = req.query.longitude;
    var name = req.query.name;

    Bar.findOne({'coordinate.latitude': latitude, 'coordinate.longitude': longitude}, function(err, bar){
        if(err){
            res.status(500).send(err)
        }else{
            if(bar){// the bar has already in our db
                if(bar.attending.indexOf(req.user._id)== -1){
                    bar.attending.push(req.user._id);
                    bar.save(function(err){
                        if(err) throw err;
                        res.redirect('back');
                    })
                }else{

                    var index = bar.attending.indexOf(req.user._id);
                    if(index != -1){
                        bar.attending.splice(index,1);
                    }

                    bar.save(function(err){
                        if(err){
                            console.log(err)
                            res.redirect('back');
                        }

                        if(bar.attending.length == 0){
                            Bar.remove({_id: bar._id}, function(err){
                                if(err){
                                    res.status(500).send(err);
                                }else{
                                    res.redirect('back');
                                }
                            })
                        }
                    })
                }
            }else{//barlist has no such bar
                var attending = [req.user._id];

                var newBar = new Bar({
                    name: name,
                    coordinate: {
                        latitude: latitude,
                        longitude: longitude
                    },
                    attending: attending
                });

                newBar.save(function(err){
                    if(err) throw err;
                    res.redirect('back');
                })
            }
        }
    });
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }else{
        res.redirect('/');
    }
}

module.exports = router;
