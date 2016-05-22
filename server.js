// Node.js Dependencies
const express = require("express");
const app = express();
const http = require("http");
const io = require("socket.io")(http);
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
  user: require("./routes/user")
 };

var parser = {
    body: require("body-parser"),
    cookie: require("cookie-parser")
};

var conString = process.env.DATABASE_CONNECTION_URL;
var FacebookStrategy = require('passport-facebook').Strategy;

var local_database_uri  = 'mongodb://stallen:hello@ds011258.mlab.com:11258/heroku_q93csxz1';
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
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['id', 'name','picture.type(large)', 'emails', 'displayName', 'about', 'gender'],
    auth_type: "requthenticate"

  },
  function(accessToken, refreshToken, res, profile, done) {
    models.user.findOne({ facebookID: profile.id }, function (err, user) {
      if(err)
        return done(err);
      if(!user){
        var newUser = new models.user({
          facebookID: profile.id,
          token: accessToken,
          username: profile.givenName + " " + profile.middleName + " " + profile.familyName,
          picture: profile.photos ? profile.photos[0].value : '/img/faces/unknown-user-pic.jpg',
          displayName: profile.displayName
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

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

io.use(function(socket, next) {
    session_middleware(socket.request, {}, next);
});


var query = 'SELECT INCOME."Area", CASE WHEN INCOME."Median Household Income" BETWEEN \'$40000.00\' AND \'$49000.00\' THEN 40000 WHEN INCOME."Median Household Income" BETWEEN \'$50000.00\' AND \'$59000.00\' THEN 50000 WHEN INCOME."Median Household Income" BETWEEN \'$60000.00\' AND \'$69000.00\' THEN 60000 WHEN INCOME."Median Household Income" BETWEEN \'$70000.00\' AND \'$79000.00\' THEN 70000 WHEN INCOME."Median Household Income" BETWEEN \'$80000.00\' AND \'$89000.00\' THEN 80000 WHEN INCOME."Median Household Income" BETWEEN \'$90000.00\' AND \'$99000.00\' THEN 90000 WHEN INCOME."Median Household Income" BETWEEN \'$100000.00\' AND \'$109000.00\' THEN 100000 WHEN INCOME."Median Household Income" BETWEEN \'$110000.00\' AND \'$119000.00\' THEN 110000 WHEN INCOME."Median Household Income" BETWEEN \'$120000.00\' AND \'$129000.00\' THEN 1200000 ELSE 150000 END AS "Avg Income",  HOME_VALUE."Median house value", POVERTY."Total population below poverty" AS "Poverty_Count", COUNT(CRIMES."zip") AS "Number_of_Crimes" FROM cogs121_16_raw.hhsa_san_diego_demographics_median_income_2012_norm AS INCOME INNER JOIN cogs121_16_raw.hhsa_san_diego_demographics_home_value_2012 AS HOME_VALUE ON INCOME."Area" = HOME_VALUE."Area" INNER JOIN cogs121_16_raw.hhsa_san_diego_demographics_poverty_2012 AS POVERTY ON POVERTY."Area" = INCOME."Area" LEFT OUTER JOIN cogs121_16_raw.arjis_crimes AS CRIMES ON LOWER(CRIMES."community") = LOWER(INCOME."Area") GROUP BY INCOME."Area", "Avg Income", HOME_VALUE."Median house value", POVERTY."Total population below poverty"';

app.get('/delphidata', function (req, res) {
  console.log("TEST");

    var pg = require('pg');

    pg.connect(conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        console.log("TEST123");

        client.query(query, function(err, result) {
            done();


            if(err) {
              return console.error('error running query', err);
            }
            res.json(result.rows);
        client.end();
        });
    });
});
console.log("TEST123456");
// Start Server
http.createServer(app).listen(app.get("port"), function() {
    console.log("Express server listening on port " + app.get("port"));
});
