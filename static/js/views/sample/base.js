/**
 * Created by whobird on 2018/4/9.
 */

var pageView=(function($){
    var pageView={};

    pageView.eventInit=function(){
        $("#js-view").on("click",function(e){
            e.preventDefault();
            var _url="./pages/empty_receipt.html";
            ysPrint.view(_url);

        });

        $("#js-print").on("click",function(e){
            e.preventDefault();
            var _url="./pages/business_settlement_notice.html";
            ysPrint.print(_url);

        });


        $("#js-alert").on("click",function(e){
            e.preventDefault();
            //alert_fail,alert_ok,alert_warn
            alert("test","","alert_fail")
        });

        $("#js-confirm").on("click",function(e){
            e.preventDefault();
            confirm("删除","删除后不可找回","alert_warn",function(type){
                if(type=="dismiss") {
                    console.log("dismiss-------")
                }else if(type=="confirm"){
                    console.log("confirm-------")
                }
            })

        });

    }

    pageView.numInit=function(){

        $(".js-number").each(function(){
           var _val=$(this).val();
           _val=formatText(_val);

           $(this).val(_val);

        });

        $("body").on("focus","input.js-number",function(e){
            var _val=$(this).val();
            _val=_val.split(",").join("");
            $(this).val(_val);
        })

        $("body").on("blur","input.js-number",function(e){
            var _val=$(this).val();
            _val=formatText(_val);
            $(this).val(_val);
        })

    }


    pageView.init=function(){
        $("#preloader").fadeOut("fast");
        confirmAlert.init();
        pageView.eventInit();
        var num=1234567890.999999;
        num=formatText(num)
        console.log(num)

        pageView.numInit();

    };

    return pageView;

})(jQuery);


$(document).ready(function(){
    pageView.init();

});