var models = require('../models');
var mongoose = require('mongoose');


function getCurrentDate(){
    var d = new Date();
    var dateNum = d.getDate();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var date = month + "/" + dateNum + "/" + year;

    return date.toString();
}

exports.send = function(req, res) {
    var message =  mongoose.model('Question'); //mongoose.model('Message', Message);
    var new_message = new message();
    var date = getCurrentDate();
    new_message.author = (req.body.author)? req.body.author: "Anonymous";
    new_message.photo = req.body.photo;
    new_message.answers = [];
    new_message.question = req.body.question;
    new_message.category = req.body.category;
    new_message.date = date;
    new_message.location = req.body.location;
    new_message.save(function(err, saved){
        if(err){
        throw err;
            alert(err);
        }else{
            res.redirect("/home");
        }
    });
};

exports.answer = function(req, res) {
     var message =  mongoose.model('Question');
     message.findOne({_id: req.body.questionid}, function(err, question){
        if(err){
            throw err;
            alert(err);
        }else{
            var date = getCurrentDate();
            var answer_schema =  mongoose.model('Answer');
            var answer = answer_schema();
            answer.author = (req.body.author)? req.body.author: "Anonymous";
            answer.photo = req.body.photo;
            answer.answer = req.body.answer;
            answer.date = date;
            answer.location = req.body.location;
            console.log(answer);
            question.answers.addToSet(answer);
            question.save(function(err, saved){
                if(err){
                    throw err;
                    alert(err);
                }else{
                    res.redirect("/home");
                }
            });
        }
     });
};
