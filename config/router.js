var user = require('../app/controllor/User');
var student = require('../app/controllor/student');
var grades = require('../app/controllor/grades')
module.exports = function(app){
	app.get('/ecard/cet46/index',user.index);
	app.post('/ecard/cet46/query',user.query);
	app.get('/ecard/:openId/center',user.center)
	app.get('/ecard/:openId/bound',user.ecard);
	app.post('/ecard/:openId/login',user.login);
	app.get('/ecard/:openId/isLogin',user.isLogin)
	app.get('/ecard/:openId/score',user.login,user.getScore)
	app.get('/ecard/:openId/profile',user.login,user.getProfile)
	app.get('/ecard/:openId/balance',user.login,user.getBalance)
	app.get('/ecard/notice',user.getNotice)
	app.post('/ecard/:openId/unbound',user.unbound)
	app.get('/ecard/:openId/transfer',user.login,user.transferIndex)
	app.post('/ecard/transfer',user.login,user.transfer)

	app.get('/ecard/:openId/update',user.updateIndex)
	app.post('/ecard/:openId/repassword',user.update)
	app.post('/ecard/:openId/switch',user.switch)
	app.get('/ecard/:openId/building',user.login,user.building)
	app.post('/ecard/building',user.getBuilding)

	app.post('/ecard/powerFeePay',user.powerFeePay)
	app.post('/ecard/powerbalance',user.getPowerFeeBalance)

	app.get('/ecard/student/apply/index',student.index)
	app.post('/ecard/student/apply',student.apply)

	app.post('/ecard/:openId/points',user.login,grades.get)
	app.get('/ecard/:openId/grades',grades.index)
}
