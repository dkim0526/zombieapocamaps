var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
	facebookID: String,
    token: String,
    username: String,
    displayName: String,
    picture: String
});


module.exports.user = mongoose.model('user', userSchema);

