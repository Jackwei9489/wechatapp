var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
	openId: {
		unique : true,
		type : String
	},
	account: String,
	password: String,
	meta:{
		createAt:{
			type:Date,
			default: Date.now()
		},
		updateAt:{
			type:Date,
			default: Date.now()
		}
	}
});

UserSchema.pre('save',function(next){
	var user = this;
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	 next();
});
UserSchema.statics = {
	fetch : function(cb){
		return this
		.find({})
		.sort('meta.updateAt')
		.exec(cb);
	},
	findById : function(id,cb){
		return this
		.findOne({_id: id})
		.exec(cb);
	}
}
module.exports=UserSchema;