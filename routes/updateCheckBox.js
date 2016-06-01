var models = require("../models");
var mongoose = require('mongoose');

exports.updateCheckBox = function(req, res){
	var first = [];
	var second = [];
	models.user.findOne({facebookID: req.session.passport.user.facebookID}, function(err, user){
		//console.log(req.params);
		//console.log(req.body);
		for(var name in req.body){
			for(var i = 0; i < user.checkList.length; i++){
				if(name === user.checkList[i].name){
					//console.log(user.checkList[i].isChecked);
					user.checkList[i].isChecked = true;
					break;
				}
			}	
		}
		console.log(user.checkList);
		user.markModified("checkList");
		user.save(function(err, saved){
           /* if(err){
                throw err;
                console.log(err);
            }else{
                //console.log(user.checkList);
                //res.render("home", {users: user, firstHalf: first, secondHalf: second});
            	res.redirect("home");
            }*/
            res.redirect("home");
        });
		
	});
}	