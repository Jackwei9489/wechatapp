var util = require('../util')
var Promise = require('bluebird')
var email = {
    api: {
        apiUser: 'wz3622_test_orXSE0',
        apiKey: 'B3IDWEXQS4pIKGSO',
        url:'https://www.sendcloud.net/apiv2/mail/sendtemplate'
    },
    user: {
        from: 'test@sendcloud.org',
        to: '376528106@qq.com',
        templateInvokeName: 'nuist_scs_recurit'
    }
}

exports.send = function(applyData) {
    var xsmtpapi = {
        "to": [email.user.to],
        "sub": {
            "%name%": new Array(applyData.name),
            "%gender%": [applyData.gender],
            "%major%": [applyData.major + applyData.class],
            "%birth%": [applyData.birth],
            "%appearance%": [applyData.appearance],
            "%association%": ['学生会'],
            "%dep%": [applyData.dep1 + ',' + applyData.dep2],
            "%accept%": [applyData.accept],
            "%contact%": [applyData.contact],
            "%hobby%": [applyData.hobby],
            "%reward%": [applyData.reward],
            "%resume%": [applyData.resume],
            "%strength%": [applyData.strength],
            "%reason%": [applyData.reason],
            "%knowledge%": [applyData.knowledge],
            "%attitude%": [applyData.attitude]
        }
    }
    var param = {
    	apiUser: email.api.apiUser,
    	apiKey: email.api.apiKey,
    	from:email.user.from,
    	templateInvokeName: email.user.templateInvokeName,
    	xsmtpapi:JSON.stringify(xsmtpapi),
    	respEmailId:true
    }
    console.log(param)
    return util.post(email.api.url,'',param)
    	.then(function(res){ 
    		var data = res.text;
            return JSON.parse(data);
    	})
}
