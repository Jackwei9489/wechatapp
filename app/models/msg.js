var mongoose = require('mongoose');
var MsgSchema = require('../schemas/msg');
var Msg = mongoose.model('Msg',MsgSchema);

module.exports= Msg;