var improveView = (function ($) {
    var improveView = {};

    $("#preloader").fadeOut("fast");

    var page = $("#improve-warp");

    var areaCode=$('#areaCode').val();

    var url = {
        index: managementWeb_Path + '/sale/improve/index.htm'
    };

    var _params=getUrlParam();

    improveView.init=function(){
      this.bindEvent();
    };

    improveView.bindEvent = function () {
        page.on('click','#k2-review',function () {
            pageCommon.submitNetComment("inamp-salesadjustment-"+areaCode, _params.id, url.index);
        });

    };

    improveView.loadingShow = function () {
        $(".zl-loading").fadeIn();
    };
    improveView.loadingHide = function () {
        $(".zl-loading").fadeOut();
    };

    return improveView;
})(jQuery);


$(document).ready(function () {
    improveView.init();
});


