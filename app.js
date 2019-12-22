const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverrride = require('method-override');
const expressSanitizer  = require('express-sanitizer');
const localStrategy = require("passport-local")     ;
const passportLocalMongoose = require("passport-local-mongoose");
const passport = require("passport");
const Location = require('./models/location');
const User = require('./models/user');
const Rating = require('./models/rating');
const ObjectCheck=require('./models/objectCheck');
const ObjectId = mongoose.Schema.ObjectId;
const port =5000;


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public")); //"public" folder contains js, imgs, css files
app.set('view engine', 'ejs');
app.use(expressSanitizer());
app.use(methodOverrride("_method"));
app.use(require("express-session")({
    secret: "It is a secret.",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(
    {usernameField:'email'},
    function(email, password, done) {
      User.findOne({email}, function (err, user) {
        if (err) { return done(err); console.log("error"); }
        if (!user) { return done(null, false); console.log("user does not exist");}
        if (user.password != password) { return done(null, false); console.log("wrong password");}
        console.log(email);
        return done(null, user);
      });
    }   
  ));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
   
  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

// passport.use(new localStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());



mongoose.connect('mongodb://localhost/local-landingsdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//show home
app.get('/', (req,res) =>{
    var randNum = Math.floor((Math.random() * 5) + 1);
    Location.find({"index":randNum},(err, place)=>{
        if(err){
            console.log("error in retrieving");
        }else{
            Location.find({},(err,location) =>{
                if(err){
                    console.log("error in retrieving data");
                }else{
                    res.render('index',{location: location, isLogged:req.isAuthenticated(),generated:place});
                    console.log("BELOW IS THE PLACE" + randNum);
                    console.log(place);
                }
            });
        }
    });
   
    // Location.find({},(err,location) =>{
    //     if(err){
    //         console.log("error in retrieving data");
    //     }else{
    //         res.render('index',{location: location, isLogged:req.isAuthenticated()});
    //         console.log(location);
    //     }
    // });
    // res.render('index');
});


//route to secret page
app.get('/secret',isLoggedIn, (req,res)=>{
    // Location.find({},(err,location) =>{
    //     if(err){
    //         console.log("error in retrieving data");
    //     }else{
    //         if(req.email=="admin@LL.com"){
    //             res.render('admin');
    //         }else{
    //             res.render('index',{location: location, isLogged:req.isAuthenticated(),user:req.user,generated:place});
    //             console.log(location);
    //         }
    //         // console.log(req.isAuthenticated());
    //     }
    // })
    var randNum = Math.floor((Math.random() * 8) + 1);
    Location.find({"index":randNum},(err, place)=>{
        if(err){
            console.log("error in retrieving");
        }else{
            Location.find({},(err,location) =>{
                if(err){
                    console.log("error in retrieving data");
                }else{
                    res.render('index',{location: location, isLogged:req.isAuthenticated(),generated:place});
                    console.log("BELOW IS THE PLACE" + randNum);
                    console.log(place);
                }
            });
        }
    });
});

//show list of places
app.get('/places', (req,res) =>{
    // res.render('places');
    Location.find({},(err,location) =>{
        if(err){
            console.log("error in retrieving data");
        }else{
            res.render('places',{location: location,isLogged:req.isAuthenticated()});
            console.log(location);
        }
    });
});

//show location
app.get("/places/:id", (req, res) => {
    Location.findById(req.params.id, (error, location) => {
        if(error) {
            res.redirect("/places");
        } else {
            Location.find({},(err,locationList)=>{
                if(err){
                    console.log("error in retrieving data");
                }else{
                    // console.log(req.user.visitedLocations.length);
                    res.render("locationPage", {location: location, locationList:locationList,location,isLogged:req.isAuthenticated()});
                }
                
            });
           
        }
    });

    // res.render("locationPage");
});

//secretPlacesLocationPage
app.get("/secretPlaces/:id", isLoggedIn,(req, res) => {
    Location.findById(req.params.id, (error, location) => {
        if(error) {
            res.redirect("/secretPlaces");
        } else {
            res.render("secretLocationPage", {location: location});
        }
    });

    // res.render("locationPage");
});

//show about
app.get('/about', (req,res) =>{
    res.render('about');
});
//show contact
app.get('/contact', (req,res) =>{
    res.render('contact');
});

//show signup
app.get('/signup', (req,res) =>{
    res.render('signup');
});

//add data from forms to db
app.post('/signup', (req,res)=>{
     User.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        birthDate: bDay={
            month:req.body.month,
            day: req.body.day,
            year: req.body.year
        },
        email:req.body.email,
        phone: req.body.phone,
        password:req.body.password,
        gender: req.body.gender,
    },(err,user)=>{
        if(err){
            res.send("Error in adding to database");
            console.log("error in adding to database");
            console.log(req.body);
        }else{
            console.log(user);
            res.redirect('/');
        }
        
    });
});

//show login
app.get('/login', (req,res) =>{
    res.render("login");
});


//authenticate
// app.post("/login", passport.authenticate("local", {
//     successRedirect: "/secret",
//     failureRedirect: "/login"
// }),(req, res) => {});

// app.post("/login", (req, res) => {
//     if(req.body.email=='admin@LL.com'){
//         res.redirect('/adminHome');
//     }else{
//         passport.authenticate("local", {
//             successRedirect: "/secret",
//             failureRedirect: "/login"
//      });
//     }
// });

app.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.redirect('/login'); }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        if(user.role==='admin'){
            return res.redirect('/adminHome');
        }else{
            return res.redirect('/secret');
        }
        
      });
    })(req, res, next);
  });

app.get('/logout', (req,res)=>{
    req.logout();
    res.redirect('/');
})

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }

    res.redirect("/login");
}


app.get('/adminHome',isLoggedIn,(req,res)=>{
    Location.find({},(err,location)=>{
        if(err){
            console.log("error in retrieving data");
        }else{
            res.render('admin', {location:location});
            console.log(location);
        }
    });
});

app.get('/addLocation',isLoggedIn,(req,res)=>{
    res.render('addLocation');
});

app.post('/addLocation',isLoggedIn, (req,res)=>{
    var data = req.body;
    Location.create({
        locationName: data.locationName,
        address: Address={
        town: data.town, 
        city: data.city,
        province: data.province,
        country: data.country
    },
    estimateCost: data.estimateCost,
    description: data.description,
    index: data.index, 
    splashImage: data.splashImage,
    numFavorites: 0
    },(err,location)=>{
        if(err){
            res.send("Error in adding to database");
            console.log("error in adding to database");
        }else{
            console.log(location);
            res.redirect('/adminHome');
        }
        
    });
})

app.get('/places/:id/edit',isLoggedIn, (req,res)=>{
    Location.findById(req.params.id, (err,location)=>{
        if(err){
            res.redirect('/places');
        }else{
            res.render("editLocation",{location:location});
            // console.log(location.address.town);
        }
    });
});

//update
app.put("/places/:id/edit",isLoggedIn, (req, res) => {
    // req.body.location.body = req.sanitize(req.body.location.body);
    Location.findByIdAndUpdate(req.params.id, {$set : {
         locationName:req.body.locationName,
         address: Address={
            town: req.body.town, 
            city: req.body.city,
            province: req.body.province,
            country: req.body.country
        },
        estimateCost: req.body.estimateCost,
        description: req.body.description,
        index: req.body.index,
        splashImage: req.body.splashImage
        }
    }, (error, location) => {
        if(error) {
            res.redirect("/adminHome");
        } else {
            res.redirect("/adminHome");
        }
    });
});

//delete
app.get("/places/:id/delete",isLoggedIn, (req, res) => {
    Location.findByIdAndRemove(req.params.id, (error) => {
        if(error) {
            res.redirect("/adminHome");
        } else {
            res.redirect("/adminHome");
        }
    });
});

// app.get('/edit', (req,res)=>{
//     // Location.find({}, (err,location)=>{
//     //     //5de9f12a2138d53e149a05e7
//     //     if(err){
//     //         res.redirect('/places');
//     //         console.log("hello");
//     //     }else{
//     //         res.render("editLocation",{location,location});
//     //     }
//     // }).limit(1);
//     res.render('editLocation');
// });


app.get('/places/:id/markVisited',isLoggedIn,(req,res)=>{
    // User.findById({_id:req.user._id}, (err,user)=>{
    //     if(err){
    //         console.log('error in retrieving user');
    //     }else{
    //         User.update()
    //     }
    // });,{visitedLocations:req.params.id}
    User.findById(req.user.id, (err,user)=>{
        console.log("COMPARING BELOW");
        var locationId = user.visitedLocations.slice();
        var x,y;
        for(x=0;x<locationId.length && locationId[x]!=req.params.id;x++){}
        if(x<locationId.length){
             y=locationId[x];
            console.log(y);
        }
        // console.log(x);
        // console.log(locationId+" == " + req.params.id);
        if(err){
            console.log("error in retrieving data");
        }else if(y==req.params.id){
            User.findByIdAndUpdate(req.user.id, {$pull : {visitedLocations: req.params.id}}, (err,user)=>{
                if(err){
                    console.log('error in marking location as visited');
                }else{
                    res.redirect('/places/'+req.params.id);
                }
            });
        }else{
            User.findByIdAndUpdate(req.user.id, {$addToSet : {visitedLocations: req.params.id}}, (err,user)=>{
                if(err){
                    console.log('error in marking location as visited');
                }else{
                    res.redirect('/places/'+req.params.id);
                }
            });
        }
    })

    // User.findByIdAndUpdate(req.user.id, {$addToSet : {visitedLocations: req.params.id}}, (err,user)=>{
    //     if(err){
    //         console.log('error in marking location as visited');
    //     }else{
    //         res.redirect('/places/'+req.params.id);
    //     }
    // });
});

app.get('/places/:id/markFavorite',isLoggedIn,(req,res)=>{
    User.findById(req.user.id, (err,user)=>{
        console.log("COMPARING BELOW");
        var locationId = user.favoriteLocations.slice();
        var x,y;
        for(x=0;x<locationId.length && locationId[x]!=req.params.id;x++){}
        if(x<locationId.length){
             y=locationId[x];
            console.log(y);
        }
        if(err){
            console.log("error in retrieving data");
        }else if(y==req.params.id){
            User.findByIdAndUpdate(req.user.id, {$pull : {favoriteLocations: req.params.id}}, (err,user)=>{
                if(err){
                    console.log('error in marking location as visited');
                }else{
                    res.redirect('/places/'+req.params.id);
                }
            });
        }else{
            User.findByIdAndUpdate(req.user.id, {$addToSet : {favoriteLocations: req.params.id}}, (err,user)=>{
                if(err){
                    console.log('error in marking location as visited');
                }else{
                    res.redirect('/places/'+req.params.id);
                }
            });
        }
    })
});

app.get('/visited',isLoggedIn,(req,res)=>{
    Location.find({_id:{$in:req.user.visitedLocations}},(err,location)=>{
        if(err){
            console.log('error in retrieving data');
        }else{
            console.log("VISITED LOCATIONS");
            res.render('userprof',{location:location});
            console.log(location);
        }
    });
    // res.render('visited');
});

app.get('/favorites',isLoggedIn,(req,res)=>{
    Location.find({_id:{$in:req.user.favoriteLocations}},(err,location)=>{
        if(err){
            console.log('error in retrieving data');
        }else{
            console.log("VISITED LOCATIONS");
            res.render('userprof',{location:location});
            console.log(location);
        }
    });
    // res.render('visited');
});


app.listen(port, ()=>{
    console.log("Server is running at port " + port);
});