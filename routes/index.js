var models = require('../models');
var mongoose = require('mongoose');

exports.view = function(req, res) {
	var data = {data: []};
    res.render("index", data);
};
