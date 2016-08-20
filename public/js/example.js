$('form').submit(function(){
    //$('#button').on('click', function(e){
        var pairs = $('form').serialize().split(/&/gi);
        var data = {};
        pairs.forEach(function(pair) {
            pair = pair.split('=');

            data[pair[0]] = decodeURIComponent(pair[1] || '');
        });
        
        if(!data.xm ){
            $.weui.topTips('请输入姓名');
            return false;
        }
        if(!(/[\u4e00-\u9fa5]{2,4}/.test(data.xm))){
            $.weui.topTips('请输入正确姓名');
             return false;
        }
        if(!data.zkzh || !/^(\d{15})$/.test(data.zkzh)){
            $.weui.topTips('请输入合法的15位准考证号码');
            return false;
        }
        return true;
    //})
})
// $('#back').click(function(){
//      window.location.href="/";
// })