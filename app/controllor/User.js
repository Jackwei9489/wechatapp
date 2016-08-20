var util = require('../../util')
var targetUrl = 'http://www.chsi.com.cn/cet/query';
var cheerio = require('cheerio')
var Ecard = require('../../ecard/ecard')
var User = require('../models/user')
var Msg = require('../models/msg')
var Promise = require('bluebird')
var cookie ='JSESSIONID=50F76FAFA24AD751051A5199F4BD3FEC; __utmt=1; __utma=65168252.1624584341.1470207339.1471506560.1471573372.4; __utmb=65168252.381.10.1471573372; __utmc=65168252; __utmz=65168252.1471573372.4.3.utmcsr=baidu|utmccn=(organic)|utmcmd=organic|utmctr=%E5%AD%A6%E4%BF%A1%E7%BD%91';
exports.query = function(req, res) {
    var response = res;
    var zkzh = req.body.zkzh;
    var xm = req.body.xm;
    var param = {
        zkzh: zkzh,
        xm: xm
    }
    util.get(targetUrl, 'cookie', param)
        .then(function(res) {
            var $ = cheerio.load(res.text);
            var courseData = util.format($);
            if (courseData) {
                if(courseData == 1){
                    return response.render('error', {
                    isSuccess: false,
                    msg: '当前人数过多，请稍后再试'
                })
                }
                return response.render('success', {
                    resultData: courseData
                })
            } else {
                return response.render('error', {
                    isSuccess: false,
                    msg: '查询失败，请确认您的准考证号和密码'
                })
            }
        })
}
exports.index = function(req, res) {
    res.render('index')
}
exports.ecard = function(req, res) {
        var openId = req.params.openId;
        res.render('bound', {
            openId: openId
        })
}
exports.transferIndex = function(req, res){
     var openId = req.params.openId;
        res.render('transfer', {
            openId: openId
        });
}
exports.building = function(req,res){
    var msg = req.session.msg;
    console.log(msg)
        res.render('utilities',{
            msg:msg
        })
}
    //ecard
exports.login = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    var openId = req.params.openId || req.body.openId;
    var ecard = new Ecard({
        openId: openId
    });
    if (req.body.account && req.body.password) {
        var account = req.body.account;
        var password = req.body.password;
        ecard.login(account, password)
            .then(function(data) {
                if (!data.success) {
                    //密码不对
                    return res.render('error', {
                        isSuccess: false,
                        msg: '学号或密码错误'
                    })
                } else {
                    ency_pass = util.encrypt({
                        alg: 'des-cbc', //3des-cbc  
                        autoPad: true,
                        key: 'synjones',
                        plaintext: password + '',
                        iv: 'synjones'
                    })
                    var user = new User({
                        openId: openId + '',
                        account: account + '',
                        password: ency_pass
                    })
                    return User.findOne({openId: openId},function(err,result){
						if(err) console.log(err)
						if(result){
							return res.render('error',{
								isSuccess: false,
								msg: '您已经绑定过了，无需绑定'
							})
						}else{
							var msg = new Msg({
							openId:openId + '',
							msg: data.msg
						})

						user.save(function(err,user){
						if(err) console.log(err);
						})
						msg.save(function(err,msg){
							if(err) console.log(err);
						})
						return res.render('error',{
								isSuccess: true,
								msg: '绑定成功'
							})
						}
					})
                }
            })
    } else {
        return User.findOne({
                openId: openId
            }).exec()
            .then(function(result) {
                if (result) {
                    return Promise.resolve(result);
                } else {
                    return Promise.reject(new Error('未绑定'))
                        //res.json({success:false,msg:'未绑定'});
                }
            })
            .then(function(user) {
                req.session.account = user.account;
                return ecard.fetchMsg(user.account, user.password);
            })
            .then(function(msg) {
                console.log("User.js 113" + msg.msg);
                req.session.msg = msg.msg;
                next();
            })
            .catch(function(err) {
                return res.json({success:false,msg:err.message});
            })
    }
}

exports.isLogin = function(req,res) {
    var openId = req.params.openId;
    User.findOne({
        openId: openId
    }).exec()
        .then(function(result) {
             if (result) {
                return res.json({success:true,msg:'已绑定'})
            } else {
                return res.json({success:false,msg:'未绑定'});
            }
        })
    }

exports.getScore = function(req, res) {
    var openId = req.params.openId;
    var ecard = new Ecard({
        openId: openId
    })
    ecard.getScore(req.session.msg, 1, '1')
        .then(function(data) {
            return res.json({
                success: data.success,
                msg: data.msg,
                object: data.obj
            })
        })
}

exports.getProfile = function(req,res){
    var openId = req.params.openId;
    var ecard = new Ecard({
        openId: openId
    })
    ecard.getProfile(req.session.msg,req.session.account)
        .then(function(data){
            return res.json({
                success: data.success,
                msg: data.msg,
                object: data.obj
            })
        })
}

exports.getBalance = function(req,res){
    var openId = req.params.openId;
    var ecard = new Ecard({
        openId: openId
    })
    ecard.getProfile(req.session.msg)
        .then(function(data){
           return res.json({
                success: data.success,
                msg: data.msg,
                object: data.obj
            })
        })
}

exports.getNotice = function(req,res){
    var ecard = new Ecard({openId:''});
    ecard.getNotice()
        .then(function(data){
           return res.json({
                success: data.success,
                msg: data.msg,
                object: data.obj
            })
        })
}

exports.transfer = function(req,res){
    var password = req.body.password;
    var amount = req.body.amount;
    var ecard = new Ecard({openId:''});
    ecard.transfer(req.session.msg,amount,password)
        .then(function(data){
           return res.json({
                success: data.success,
                msg: data.msg,
                object: data.obj
            })
        })
}

exports.getBuilding = function(req,res){
     var ecard = new Ecard({openId:''});
     var zone = req.body.zone;
     var msg = req.body.msg;
     ecard.getBuilding(msg,zone)
        .then(function(data){
           return res.json({
                success: data.success,
                msg: data.msg,
                object: data.obj
            })
        })
}

exports.powerFeePay = function(req,res){
    var ecard = new Ecard({openId:''});
    var iPlanetDirectoryPro = req.body.iPlanetDirectoryPro;
    var amount = req.body.amount;
    var xiaoqu = req.body.xiaoqu;
    var xiaoquname = req.body.xiaoquname;
    var building = req.body.building;
    var buildingname = req.body.buildingname;
    var room = req.body.room;
    var password = req.body.password;

    ecard.powerFeePay(iPlanetDirectoryPro,amount, xiaoqu, xiaoquname, building, buildingname, room, password)
        .then(function(data){
           return res.json({
                success: data.success,
                msg: data.msg,
                object: data.obj
            })
        })
}

exports.getPowerFeeBalance = function(req,res){
    var ecard = new Ecard({openId:''});
    var iPlanetDirectoryPro = req.body.iPlanetDirectoryPro;
    var xiaoqu = req.body.xiaoqu;
    var building = req.body.building;
    var buildingname = req.body.buildingname;
    var room = req.body.room;
    ecard.getPowerFeeBalance(xiaoqu, building, buildingname,room, iPlanetDirectoryPro)
        .then(function(data){
               return res.json({
                    success: data.success,
                    msg: data.msg,
                    object: data.obj
                })
            })
}

