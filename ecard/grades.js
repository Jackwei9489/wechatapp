var util = require('../util')
var Promise = require('bluebird')
var url = 'http://115.159.106.236:8080/grade/servlet/get';

exports.query = function(iPlanetDirectoryPro,year){
	var param = {
		 iPlanetDirectoryPro: iPlanetDirectoryPro,
		 year: year
	}
	return util.post(url,'',param)
		.then(function(res){
			var data = res.text
			return JSON.parse(data);
		})	
}