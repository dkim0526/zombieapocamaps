var models = require("../models");
var mongoose = require('mongoose');

exports.send = function(req, res) {
  models.user.findOne({facebookID: req.session.passport.user.facebookID}, renderUser);
  function renderUser(err, user){
    res.render("home", {users: user});
  }
};