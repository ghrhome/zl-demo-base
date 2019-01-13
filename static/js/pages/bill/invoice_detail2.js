var pageView=(function($){
    var pageView={};

    var page = $("#bill_list_detail");
    var _modal = $("#red-flush-dialog");

    pageView.loadingShow=function(){
        $("#preloader").fadeIn();
    };
    pageView.loadingHide=function(){
        $("#preloader").fadeOut();
    };

    pageView.init=function(){
        $("#preloader").fadeOut();
        pageView.eventInit();
    };

    pageView.eventInit = function(){
        page.on('click', "a.hongchong", function(){

            var _div = $(this).closest("div.zl-section");

            _modal.find("input").val("");
            _modal.find("input[name=invoiceCode]").val(_div.find("input[name=invoiceCode]").val());
            _modal.find("input[name=invoiceNo]").val(_div.find("input[name=invoiceNo]").val());
            _modal.modal("show");
        });

        page.on('click', ".save-btn", function(){

            var redCode = _modal.find("input[name=redCode]").val().trim();
            if(redCode == ""){
                alert("请输入红字信息表编号");
                return;
            }

            var invoiceNo = _modal.find("input[name=invoiceNo]").val();
            var invoiceCode = _modal.find("input[name=invoiceCode]").val();

            confirm("请确认是否红冲？","","", function (type) {
                if (type == 'dismiss') return;

                pageView.loadingShow();

                $.ajax({
                    url : financeWeb_Path + "/bill/invoice/redChong2.htm",
                    type: 'post',
                    data:{
                        redNotificationNo:redCode,
                        invoiceNo:invoiceNo,
                        invoiceCode:invoiceCode
                    },
                    dataType: 'json',
                    error: function () {
                        pageView.loadingHide();
                        alert("系统繁忙");
                    },
                    success: function (res) {
                        pageView.loadingHide();
                        alert(res.msg, "", "", function () {
                            if(res && res.code=='0'){
                                history.go(-1);
                            }
                        });
                    }
                });
            });
        });
    };

    return pageView;
})(jQuery);


$(document).ready(function(){
    confirmAlert.init();
    pageView.init();
});