var mongoose = require('mongoose');
var MsgSchema = new mongoose.Schema({
	openId: {
		unique : true,
		type : String
	},
	msg: String,
	meta:{
		createAt:{
			type:Date,
			default: Date.now()
		},
		expireIn:{
			type:Date,
			default: Date.now() + 20 * 60 * 1000
		}
	}
});

MsgSchema.pre('save',function(next){
	var user = this;
	if(this.isNew){
		this.meta.createAt = Date.now(); 
		this.meta.expireIn = Date.now() + 20 * 60 * 1000
	}
	 next();
});
MsgSchema.statics = {
	fetch : function(cb){
		return this
		.find({})
		.sort('meta.expireIn')
		.exec(cb);
	},
	findById : function(id,cb){
		return this
		.findOne({_id: id})
		.exec(cb);
	}
}
module.exports=MsgSchema;