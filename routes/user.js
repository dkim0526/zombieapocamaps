var models = require("../models");
var mongoose = require('mongoose');

exports.send = function(req, res) {
  var first = [];
  var second = [];
  models.user.findOne({facebookID: req.session.passport.user.facebookID}, renderUser);

  function renderUser(err, user){
     models.Question.find().exec(renderMessage);
      function renderMessage(err, messages){
          if(typeof(messages) == 'undefined'){
              messages = [];
          }else{
              var counter = 0;
              var array;
              for(var i = 0; i < messages.length; i++){
                  array = new Array(messages[i].answers.length);
                  for(var j = messages[i].answers.length - 1; j >= 0; j--){
                      array[counter] = messages[i].answers[j];
                      counter++;
                      if(j == 0){
                          messages[i].answers = array;
                      }
                  }
                  counter = 0;
              }
              counter = 0;
              var array2 = new Array(messages.length);
              for(var i = messages.length-1; i >= 0 ; i--){
                  array2[counter] = messages[i];
                  counter++;
              }

              for(var i = 0; i < user.checkList.length; i++){
                if(i < user.checkList.length/2){
                  first.push(user.checkList[i]);
                }
                else{
                  second.push(user.checkList[i]);
                }
              } 
              messages = array2;
              res.render("home", {users: user, questions: messages, firstHalf: first, secondHalf: second});
          }
        }
  }
};