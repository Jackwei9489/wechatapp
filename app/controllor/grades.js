var grades = require('../../ecard/grades')
//2013-2014
//2014-2015
//2015-2016
exports.get = function(req,res){
	var iPlanetDirectoryPro = req.session.msg;
	//var year = req.body.year;
	var year = req.body.select;
	grades.query(iPlanetDirectoryPro,year)
		.then(function(data){
			if(data.success){
				var point = data.obj.JD;
				res.render('error',{
					isSuccess:true,
					point: point
				})
			}else{
				res.render('error',{
					isSuccess:false,
					msg:data.msg
				})
			}
			
		})
}

exports.index = function(req,res){
	var openId = req.params.openId;
	res.render('grades',{
		openId:openId
	});
}