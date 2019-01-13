
var pageView=(function($){
    var pageView={};
    var container = $("#page-announcement");

    pageView.init = function(){
        pageView.loadingHide();
        //审批按钮click
        $("#js-approve-yes-btn").on("click", function () {
            confirm("是否确认通过","","alert_warn",function(type) {
                if(type=="dismiss") {
                    console.log("dismiss-------");
                }else if(type=="confirm"){
                    pageView.approve(1);
                }
            });
        });
        $("#js-approve-no-btn").on("click", function () {
            confirm("是否确认拒绝","","alert_warn",function(type) {
                if(type=="dismiss") {
                    console.log("dismiss-------");
                }else if(type=="confirm"){
                    pageView.approve(2);
                }
            });
        });
    };
    pageView.loadingShow = function () {
        $(".zl-loading").fadeIn();
    }

    pageView.loadingHide = function () {
        $(".zl-loading").fadeOut();
    }

    pageView.approve=function approveBtn(flag){
        $.ajax({
            cache: false,
            type: "POST",
            url: merchantWeb_Path + "serviceAll/audit.htm",
            data: {serviceLogId:$("#serviceLogId").val(), status:flag},
            async: false,
            beforeSend: function () {
                //让提交按钮失效，以实现防止按钮重复点击
                $(this).attr('disabled', 'disabled');
            },
            complete: function () {
                //让提交按钮重新有效
                $(this).removeAttr('disabled');
            },
            error: function () {
                alert("系统异常");
            },
            success: function (msg) {
                if(msg=="0") {
                    alert("异常的审核状态");
                }else if(msg=="1"){
                    alert("处理成功");
                    var dataQuery={serviceId:$("#serviceId").val(), mallId:$("#mallId").val()};
                    formPost(merchantWeb_Path + "serviceAll/queryServiceDetail", dataQuery);
                }else if(msg=="2"){
                    alert("后台异常");
                }else {
                    alert("流程已被处理，请刷新页面!");
                }
            }
        });
    }

    return pageView;
})(jQuery);


$(document).ready(function(){
    pageView.loadingHide();
    pageView.init();
});





