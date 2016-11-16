var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var userSchema = Schema({
    facebook: {
        name: String,
        id: String,
        token: String,
        email: String
    }
});

var barSchema = Schema({
    name: String,
    coordinate: {
        latitude: Number,
        longitude: Number
    },
    attending: [
        { type : ObjectId, ref: 'User' }
    ]
});

var User = mongoose.model('User', userSchema);
var Bar = mongoose.model('Bar', barSchema);

module.exports = {
    User: User,
    Bar: Bar
};