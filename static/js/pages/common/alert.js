/**
 * Created by whobird on 2018/4/12.
 */
//alert("test","hello world","alert_fail",function(){console.log("xxx")})
var confirmAlert=(function($,confirmView){
    var cv=confirmView;

    var alertMsg = '';
    var warnText = '';
    var alertMsgType = '';//'confirm','alert'
    var callback=undefined;

    //var callback=$.callback();

    function _insertTemp(){
         // $.get("../common/alert.html",function(data){
         //    $("body").append(data);
         // });
        // $.get(base_Path+"scpStatic/views/common/alert.html",function(data){
        //     $("body").append(data);
        $.get(base_Path + "scpStatic/static/js/views/common/alert.html", function(data){
           $("body").append(data);
        });
    }
    //注册一个比较大小的Helper,判断alertMsgType
    Handlebars.registerHelper("compare",function(alertMsgType,options){
        //console.log(arguments)
        if(alertMsgType=="confirm"){
            //满足添加继续执行
            return options.fn(this);
        }else{
            //不满足条件执行{{else}}部分
            //console.log(options)
            return options.inverse(this);
        }
    });
    function _render(alertMsg,warnText,icon,alertMsgType){

        var source   = $("#alert-template").html();
        var template = Handlebars.compile(source)
        var context = {
            alertMsgType:alertMsgType,
            alertMsg:alertMsg,
            warnText:warnText,
            icon:icon
        };

        var html = template(context);
        $("body").append(html);
        //点击不关闭模态框
        $('#modal-confirm-alert').modal({backdrop:'static', keyboard: false});
    }

    function _dismiss(cb,type) {
        $('#modal-confirm-alert').off().one('hidden.bs.modal', function (e) {
            // do something...
            $(this).remove();

            if (type == "dismiss" && typeof cb !== 'undefined') {
                cb("dismiss");
            } else if (type == "confirm" && typeof cb !== 'undefined') {
                cb("confirm");
            }

            alertMsg = '';
            warnText = '';
            alertMsgType = '';//'confirm','alert'
            sid = '';//sid用来确认confirm来源
            cb = undefined;


        });

        $("#modal-confirm-alert").modal("hide");
    }
    cv.init=function(){
        _insertTemp()
        window.alert = function (msg, warnText,icon,cb) {
            var msg = msg || '';
            var warnText = warnText || "";
            msg = msg.toString();
            warnText = warnText.toString();
            alertMsg = msg.trim();
            warnText = warnText.trim();
            alertMsgType = 'alert';
            callback=cb;

            _render(alertMsg,warnText,icon,alertMsgType);

            $("#modal-confirm-alert").modal("show");
        };

        window.confirm = function (msg, warnText,icon,cb) {
            var msg = msg || '';
            var warnText = warnText || "";

            msg = msg.toString();
            warnText = warnText.toString();

            alertMsg = msg.trim();
            warnText = warnText.trim();

            alertMsgType = 'confirm';
            //$scope.$apply();
            callback=cb;
            _render(alertMsg,warnText,icon,alertMsgType);

            $("#modal-confirm-alert").modal("show");
        };

        $("body").on("click","#modal-confirm-alert .js-btn-dismiss",function(){
            //console.log("==============")
            _dismiss(callback,"dismiss")
        });

        $("body").on("click","#modal-confirm-alert .js-btn-confirm",function(){
            //console.log("==============")
            _dismiss(callback,"confirm")
        });
    };

    return cv;
})(jQuery,confirmAlert||{});

