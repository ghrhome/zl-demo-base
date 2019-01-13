var pageView = (function ($) {
    var pageView = {};


    pageView.eventInit = function () {
        $("#js-confirmLiquidation").unbind("click").bind("click", function () {
            var url = "confirmLiquidation.htm";
            var masterId = $("#masterId").val();
            pageCommon.ajaxSelect(url, {"masterId":masterId}, function (data) {
                if(data.code == 200){
                    location.href = netcommentWeb_Path + "/netcomment/liquidation/index.htm?billType=42";
                } else {
                    pageCommon.handle(data);
                }
            })
        });
    }

    pageView.init = function () {
        $("#preloader").fadeOut("fast");
        pageView.eventInit();
        confirmAlert.init();
    };

    return pageView;

})(jQuery);

$(document).ready(function () {
    console.log("................")
    pageView.init();
});






