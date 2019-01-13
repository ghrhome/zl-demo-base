/**
 * 同步数据用的util
 * @param url
 */
function synchro(url,msg) {
    $.ajax({
        url : url,  //请求地址
        type : "post",   //请求方式
        dataType : "json",  //数据类型
        contentType: 'application/json',
        success : function(res){
            if (res.code === '100') {
                alert(msg);
            } else {
                alert(res.msg);
            }
        },
        //请求失败
        error: function(json){
        }
    })
}