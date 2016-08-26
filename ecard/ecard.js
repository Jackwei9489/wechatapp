var User = require('../app/models/user')
var util = require('../util')
var Promise = require('bluebird')
var Msg = require('../app/models/msg')

function Ecard(opts) {
    var that = this;
    this.openId = opts.openId;
}
Ecard.prototype.login = function(account, password, update) {
    var ency_pass = password;
    var openId = this.openId;
    var url = "http://202.195.231.13:8070/Api/Account/SignInAndGetUserPlus";
    if (!update) {
        ency_pass = util.encrypt({
            alg: 'des-cbc', //3des-cbc  
            autoPad: true,
            key: 'synjones',
            plaintext: password + '',
            iv: 'synjones'
        })
    }
    var param = {
        account: account,
        password: ency_pass,
        clientType: 'Android',
        signType: 'SynSno',
        schoolCode: 'nuist'
    }
    console.log("ecard.js 28行：" + param)
    return util.post(url, '', param)
        .then(function(res) {
            console.log("ecard.js 30行：")
            var data = res.text;
            return JSON.parse(data);
        })
}
Ecard.prototype.updateMsg = function(account, password) {
    var _this = this;
    return this.login(account, password, true)
        .then(function(data) {
            console.log("39行+" + data);
            if (data.success) {
                var msg = {
                    openId: _this.openId,
                    msg: data.msg,
                    isSuccess:true
                };
                Msg.update({
                        openId: _this.openId
                    }, {
                        "$set": {
                            msg: data.msg,
                            meta: {
                                createAt: Date.now(),
                                expireIn: Date.now() + 20 * 60 * 1000
                            }
                        }
                    },
                    function(err, msg) {})
            }else{
                if(data.msg === '密钥加密错误'){
                    var msg = {
                        isSuccess: false,
                        openId: _this.openId,
                        msg: '密码错误，改密码啦？'
                    };
                }else{
                    var msg = {
                        isSuccess: false,
                        openId: _this.openId,
                        msg: '系统异常请稍后再试'
                    };
                }
            }

            return Promise.resolve(msg);
        })
}
Ecard.prototype.fetchMsg = function(account, password) {
    var _this = this;
    return util.queryMsg(this.openId)
        .then(function(msg) {
            console.log("ecard.js 59行：" + msg)
            if (_this.isValidMsg(msg)) {
                console.log('返回校验成功的msg' + msg)
                msg.isSuccess = true;
                return Promise.resolve(msg);
            } else {
                console.log('返回查询不成功的msg')
                return _this.updateMsg(account, password)
            }
        })
        .catch(function(err) {
            return Promise.reject(err);
        })
}
Ecard.prototype.isValidMsg = function(data) {
    if (!data || !data.msg || !data.meta.expireIn) {
        return false;
    }
    var msg = data.msg;
    var expireIn = data.meta.expireIn.getTime();
    var now = Date.now();
    console.log(now < expireIn)
    if (now < expireIn) {
        return true;
    } else {
        return false;
    }
}
Ecard.prototype.getScore = function(iPlanetDirectoryPro, pageIndex, semester) {
    var url = "http://202.195.231.13:8070/Api/Score/Query";
    var param = {
        iPlanetDirectoryPro: iPlanetDirectoryPro + '',
        pageIndex: pageIndex,
        schoolCode: 'nuist'
    }
    return util.post(url, '', param)
        .then(function(res) {
            var data = res.text;
            return JSON.parse(data);
        })
}

Ecard.prototype.getProfile = function(iPlanetDirectoryPro, account) {
    var url = 'http://202.195.231.13:8070/Api/Card/GetCardEaccInfo';
    var param = {
        iPlanetDirectoryPro: iPlanetDirectoryPro,
        sno: account,
        schoolCode: 'nuist'
    }
    return util.post(url, '', param)
        .then(function(res) {
            var data = res.text;
            return JSON.parse(data);
        })
}

Ecard.prototype.getBalance = function(iPlanetDirectoryPro) {
    url = 'http://202.195.231.13:8070/Api/Card/GetCardBalance';
    var param = {
        iPlanetDirectoryPro: iPlanetDirectoryPro,
        schoolCode: 'nuist'
    }
    return util.post(url, '', param)
        .then(function(res) {
            var data = res.text;
            return JSON.parse(data);
        })
}

Ecard.prototype.getNotice = function() {
    url = 'http://202.195.231.13:8070/Api/SynNotice/GetCardNoticeList';
    var param = {
        pageSize: 10,
        pageIndex: 1,
        schoolCode: 'nuist'
    }
    return util.post(url, '', param)
        .then(function(res) {
            var data = res.text;
            return JSON.parse(data);
        })
}

Ecard.prototype.transfer = function(iPlanetDirectoryPro, amount, password) {
    url = 'http://202.195.231.13:8070/Api/Card/BankTransfer';
    var param = {
        amount: amount,
        password: password,
        clientType: 'Android',
        iPlanetDirectoryPro: iPlanetDirectoryPro,
        schoolCode: 'nuist',
        toaccount: 'card'
    }
    return util.post(url, '', param)
        .then(function(res) {
            var data = res.text;
            return JSON.parse(data);
        })
}

Ecard.prototype.getBuilding = function(iPlanetDirectoryPro, zone) {
    url = 'http://202.195.231.13:8070/Api/PowerFee/GetBuild';
    var param = {
        xiaoqu: zone,
        paytypecode: 'PowerFeeSims',
        schoolCode: 'nuist',
        iPlanetDirectoryPro: iPlanetDirectoryPro
    }
    return util.post(url, '', param)
        .then(function(res) {
            var data = res.text;
            return JSON.parse(data);
        })
}

Ecard.prototype.powerFeePay = function(iPlanetDirectoryPro, amount, xiaoqu, xiaoquname, building, buildingname, room, password) {
    var url = 'http://202.195.231.13:8070/Api/PowerFee/DoPay';
    var param = {
        amount: amount,
        xiaoqu: xiaoqu,
        xiaoquName: xiaoquname,
        build: building,
        buildName: buildingname,
        pwd: password,
        room: room,
        iPlanetDirectoryPro: iPlanetDirectoryPro,
        schoolCode: 'nuist',
        clientType: 'Android',
        paytypecode: 'PowerFeeSims'
    }
    return util.post(url, '', param)
        .then(function(res) {
            var data = res.text;
            return JSON.parse(data);
        })
}

Ecard.prototype.getPowerFeeBalance = function(xiaoqu, building, buildingname, room, iPlanetDirectoryPro) {
    var url = 'http://202.195.231.13:8070/Api/PowerFee/GetBanlace';
    var param = {
        xiaoqu: xiaoqu,
        build: building,
        buildName: buildingname,
        room: room,
        iPlanetDirectoryPro: iPlanetDirectoryPro,
        paytypecode: 'PowerFeeSims',
        schoolCode: 'nuist'

    }
    return util.post(url, '', param)
        .then(function(res) {
            var data = res.text;
            return JSON.parse(data);
        })
}
module.exports = Ecard;
