var email = require('../../ecard/email')
function validate(applyData){
	var res = true;
	var keySet = Object.keys(applyData);
	for(var i in keySet){
		var value = applyData[keySet[i]]
		if(!value){
			res = false;
		}else if(value.length == 0){
			res = false;
		}
	}
	return res;
}
exports.apply = function(req,res){
	var applyData = req.body.applyData;
	if(!validate(applyData)){
			return res.render('error',{
					isSuccess:false,
					msg:'提交失败，请确保数据正确完整'
				})
	}
	email.send(applyData)
		.then(function(data){
			console.log(data)
			if(data.result){
				return res.render('error',{
					isSuccess:true,
					msg:'提交成功！我们会尽快审核，请注意查收面试通知'
				})
			}else{
				return res.render('error',{
					isSuccess:false,
					msg:data.message
				})
			}
		})
}

exports.index = function(req,res){
	res.render('apply')
}