var superagent = require('superagent');
var crypto = require('crypto');
var Msg = require('./app/models/msg')
var Promise = require('bluebird')
exports.get = function (url,cookie,param) {
  return new Promise(function(resolve, reject){
    superagent.get(url)
    .query(param)
    .set('Cookie', cookie)
    .set('Host','www.chsi.com.cn')
    .set('Referer','http://www.chsi.com.cn/cet/')
    .end(function(err, res){
      if(err) reject(err);
      resolve(res);
    });
  }); 
};
exports.post = function(url,cookie,param){
	return new Promise(function(resolve,reject){
		superagent.post(url)
		.set('Cookie',cookie)
		.set('Content-Type', 'application/x-www-form-urlencoded')
		.send(param)
		.end(function(err,res){
			if(err) reject(err);
      		resolve(res);
		})
	});
}


exports.format = function($){
	var resultData = {}
		if($('.error').text() == '无法找到对应的分数，请确认你输入的准考证号及姓名无误'){
			return undefined;
		}
		if($('.error').text() == '请输入验证码'){
			//console.log($('#yzm'));
			$('#yzm').attr('value',1);
			var code = $('#yzm').next();
			console.log(code.html())
			console.log($('#yzm').text())
			return 1;
		}
		
	
	var trs = $('.cetTable tr');
	for(var i = 0;i<trs.length;i++){
		if(i !== trs.length - 1){
			var key = $(trs[i]).children('th').text().trim();
			var value = $(trs[i]).children('td').text().trim();
			switch(key){
				case '姓名：': resultData.name = value;break;
				case '学校：': resultData.school = value;break;
				case '考试类别：':resultData.type = value;break;
				case '准考证号：': resultData.number = value;break;
				case '考试时间：': resultData.year = value;break;
			}
		}else{
			 var key = $(trs[i]).children('th').text();
			 if(key =='总分：'){
			 	resultData.totalScore = $('.colorRed').text().trim().replace(/[\r\n\t]/g,"");
			 }
		}
				
	}
	var tr = $('.color666');
	var keys = Object.keys(tr);
	 for(var k =0;k<keys.length;k++){
		if(Number(keys[k])!=NaN){
			var k = keys[k];
			var obj = tr[k];
			var key = obj.children[0].data;
			var value = obj.next.data.trim().replace(/[\r\n\t]/g,"");
			switch(key){
				case '听力：':resultData.listening = value;break;
				case '阅读：':resultData.reading = value;break;
				case '写作与翻译：':resultData.writingAndTranslation = value;break;
			}
			
		}
		if(k==2) break;
	}
	return resultData;
}

exports.encrypt = function(param){
	var key = new Buffer(param.key);  
    var iv = new Buffer(param.iv ? param.iv : 0)  
    var plaintext = param.plaintext  
    var alg = param.alg  
    var autoPad = param.autoPad  
    var cipher = crypto.createCipheriv(alg, key, iv);  
    cipher.setAutoPadding(autoPad)  //default true  
    var ciph = cipher.update(plaintext, 'utf8', 'hex');  
    ciph += cipher.final('hex');  
  	return ciph;
}
exports.queryMsg = function(openId){
	return Msg.findOne({openId: openId}).exec()
		.then(function(msg){
			return msg;
		})
}
