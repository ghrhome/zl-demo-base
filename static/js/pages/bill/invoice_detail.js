var pageView=(function($){
    var pageView={};

    pageView.init=function() {

        $("#preloader").fadeOut("fast");
        var page = $("#bill_list_detail");

        //搜索
        // page.on("click", "a.preview-invoice", function () {
        //     var path = $(this).attr("data-value");
        //     window.open(financeWeb_Path + "bill/invoice/preview.htm?filePath=" + path, "about:blank", " width=800,height=800,  top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
        // });
        page.on("click", ".download-invoice", function() {
            window.open($(this).attr("data-value"), "newwindow");
        });
        page.on("click", ".red-flush", function() {
            var redNotificationNo = $(this).parent("span").prev().val();
            if(redNotificationNo=="") alert("请填写红字信息表编号")
            var invoiceNo = $(this).attr("data-invoiceNo");
            var invoiceCode = $(this).attr("data-invoiceCode");
            confirm("确认红冲？","","", function (type) {
                if (type == 'dismiss') return;
                $.ajax({
                    url : financeWeb_Path + "/bill/invoice/redChong.htm",
                    type: 'post',
                    data:{redNotificationNo:redNotificationNo,invoiceNo:　invoiceNo,invoiceCode:invoiceCode},
                    dataType: 'json',
                    error: function () {
                        alert("系统异常");
                    },
                    success: function (res) {
                        alert(res.msg);
                        window.location = financeWeb_Path + "/bill/invoice/index.htm";
                    }
                });
            });
        });

    }
    return pageView;

})(jQuery);


$(document).ready(function(){
    confirmAlert.init();
    pageView.init();
});