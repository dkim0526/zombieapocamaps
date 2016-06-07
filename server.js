// Node.js Dependencies
const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
var session = require("express-session");
const MongoStore = require("connect-mongo/es5")(session);

var mongoose = require("mongoose");
var passport = require("passport");
var handlebars = require("express-handlebars");

var parser = {
    body: require("body-parser")
};


require("dotenv").load();

app.use(passport.initialize());

var models = require("./models");
var db = mongoose.connection;

var router = {
  index: require("./routes/index"),
  user: require("./routes/user"),
  connect: require("./routes/connect"),
  check: require("./routes/updateCheckBox")
 };

var parser = {
    body: require("body-parser"),
    cookie: require("cookie-parser")
};

var conString = process.env.DATABASE_CONNECTION_URL;
var FacebookStrategy = require('passport-facebook').Strategy;

var local_database_uri  = 'mongodb://<dbuser>:<dbpassword>@ds017672.mlab.com:17672/heroku_g36s48g2';//'mongodb://stallen:hello@ds011258.mlab.com:11258/heroku_q93csxz1';
// Database Connection
var db = mongoose.connection;
mongoose.connect( process.env.MONGODB_URI || local_database_uri );
db.on('error', console.error.bind(console, 'Mongo DB Connection Error:'));
db.once('open', function(callback) {
    console.log("Database connected successfully.");
});

var SESSION_SECRET = '**Random string**' ;
// session middleware
var session_middleware = session({
    key: "session",
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
    store: new MongoStore({ mongooseConnection: db })
});

app.use(passport.session());


// Middleware
app.set("port", process.env.PORT || 3000);
app.engine('html', handlebars({ defaultLayout: 'layout', extname: '.html' }));
app.set("view engine", "html");
app.set("views", __dirname + "/views");
app.use(express.static(path.join(__dirname, "public")));
app.use(parser.cookie());
app.use(parser.body.urlencoded({ extended: true }));
app.use(parser.body.json());

app.use(session({
   secret: 'keyboard cat',
   saveUninitialized: true,
   resave: true
}));

app.use(require('method-override')());
app.use(session_middleware);

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "https://zombieapocamaps.herokuapp.com/auth/facebook/callback",
    profileFields: ['id', 'name','picture.type(large)', 'emails', 'displayName', 'about', 'gender'],
    auth_type: "requthenticate"

  },
  function(accessToken, refreshToken, res, profile, done) {
    models.user.findOne({ facebookID: profile.id }, function (err, user) {
      if(err)
        return done(err);
      if(!user){
        var checkListArray = [];
        var json = {
          name: String,
          className: String,
          isChecked: Boolean
        };
        var checkList = ["Water", "Food", "Medication", "First Aid Supplies", "Hygiene Items", "Lighter", "Flashlight", "Gasoline", "Batteries", "Alcohol", "Utility Knife", "Duct Tape", "Blankets", "Clothes", "Passport"];
        var classList = ["food_water", "food_water", "health", "health", "health", "supplies", "supplies", "supplies", "supplies", "supplies", "supplies", "supplies", "supplies", "supplies", "supplies"];
        for(var i = 0; i < checkList.length; i++){
          json = {};
          json.name = checkList[i];
          json.isChecked = false;
          json.className = classList[i];
          checkListArray.push(json);
        }
        var newUser = new models.user({
          facebookID: profile.id,
          token: accessToken,
          username: profile.givenName + " " + profile.middleName + " " + profile.familyName,
          picture: profile.photos ? profile.photos[0].value : '/img/faces/unknown-user-pic.jpg',
          displayName: profile.displayName,
          checkList: checkListArray
        });
       user = newUser;
        user.save(function(err){
          if(err)
            return handleError(err);
        });

        return done(null, user);
      } else{
        user.facebookID = profile.id;
        user.displayName = profile.displayName;
        user.token = accessToken;
        user.username = profile.givenName + " " + profile.middleName + " " + profile.familyName;
        user.picture = profile.photos ? profile.photos[0].value : '/img/faces/unknown-user-pic.jpg';
        // user.photo = profile.value;
        //console.log(user.checkList);
        process.nextTick(function(){
          return done(null, user);
        });
      }
    });
  }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    done(null, user);
});

app.get("/", router.index.view);
app.get("/auth/facebook", passport.authenticate("facebook"));
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/home',
                                      failureRedirect: '/login' }));
app.get("/logout", function(req, res){
  req.session.destroy();
  res.redirect("/");
});

app.get("/home", router.user.send);

app.post("/home", router.user.send);

app.post("/message", router.connect.send);
app.post("/answer", router.connect.answer);
app.post("/checkBox", router.check.updateCheckBox);

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

var health_query = 'SELECT HEALTH."CITY" as City, CASE WHEN HEALTH."ADDR" <> \'\' THEN HEALTH."ADDR" ELSE \'San Diego\' END AS ADDRESS FROM cogs121_16_raw.sandag_clinics_all_prj AS HEALTH';
var food_water_query = 'SELECT CASE WHEN FOOD_WATER."ADDRESS" <> \'\' THEN FOOD_WATER."ADDRESS" ELSE \'San Diego\' END AS ADDRESS, FOOD_WATER."CITY" AS CITY FROM cogs121_16_raw.sandag_foodbeverage_business_prj AS FOOD_WATER';
var supplies_query = 'SELECT CASE WHEN SUPPLIES."ADDRESS" <> \'\' THEN SUPPLIES."ADDRESS" ELSE \'San Diego\' END AS ADDRESS, SUPPLIES."CITY" AS CITY FROM cogs121_16_raw.sandag_foodgrocery_business_prj AS SUPPLIES'
var safe_zones_query = 'SELECT DEATHRATE."RegionName", POPULATION."Area" AS Cities, POPULATION."Total 2012 Population" AS POPULATION_DENSITY, CASE WHEN SUM(DEATHRATE."Total_Cases") IS NULL THEN 0 ELSE SUM(DEATHRATE."Total_Cases") END AS ZOMBIE_COUNT, CASE WHEN SUM(DEATHRATE."Total_Cases") IS NULL THEN POPULATION."Total 2012 Population" ELSE SUM(DEATHRATE."Total_Cases") + POPULATION."Total 2012 Population" END AS RATING FROM ' +
'cogs121_16_raw.hhsa_san_diego_demographics_county_population_2012 AS POPULATION INNER JOIN cogs121_16_raw.hhsa_ovarian_cancer_deaths_2010_2013 AS DEATHRATE ON UPPER(DEATHRATE."Geography") = UPPER(POPULATION."Area") GROUP BY DEATHRATE."RegionName", POPULATION."Area", POPULATION."Total 2012 Population" ORDER BY RATING';

var pgVar = require('pg');

function processQuery(req, res, pg, query){
    pg.connect(conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query(query, function(err, result) {
            done();

            if(err) {
              return console.error('error running query', err);
            }

            res.json(result.rows);
            client.end();

        });
    });
}

app.get('/delphidata_health', function (req, res) {
    processQuery(req, res, pgVar, health_query);
});

app.get('/delphidata_food_water', function (req, res) {
    processQuery(req, res, pgVar, food_water_query);
});

app.get('/delphidata_supplies', function (req, res) {
    processQuery(req, res, pgVar, supplies_query);
});

app.get('/delphidata_safe_zones', function (req, res) {
    processQuery(req, res, pgVar, safe_zones_query);
});

// Start Server
http.createServer(app).listen(app.get("port"), function() {
    console.log("Express server listening on port " + app.get("port"));
});
