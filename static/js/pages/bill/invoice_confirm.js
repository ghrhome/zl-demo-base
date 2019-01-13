var pageView=(function($){

    var pageView={};
    var page = $("#invoice-confirm");


    pageView.init=function() {

        // var params = {};
        //
        // $.ajax({
        //     url: "invalid.htm",
        //     data: params,
        //     type: "post",
        //     dataType: "json",
        //     error: function (request) {
        //         pageView.loadingHide();
        //         alert("系统异常");
        //     },
        //     success: function (response) {
        //         pageView.loadingHide();
        //         alert(response.msg, "", "", function () {
        //             if (response && response.code == 0) {
        //
        //             }
        //         });
        //     }
        // });
    }

    pageView.loadingShow=function(){
        $(".zl-loading").fadeIn();
    };

    pageView.loadingHide=function(){
        $(".zl-loading").fadeOut();
    };

    return pageView;

})(jQuery);


$(document).ready(function(){
    $("#preloader").fadeOut("fast");
    confirmAlert.init();
    pageView.init();
});