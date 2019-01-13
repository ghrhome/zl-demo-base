var pageView=(function($){
    var pageView={};
    $("#preloader").fadeOut("fast");
    pageView.eventInit=function(){
        pageView.getList();
    }
    /**
     * 遮挡层
     */
    pageView.loadingShow = function () {
        $(".zl-loading").fadeIn();
    }

    pageView.loadingHide = function () {
        $(".zl-loading").fadeOut();
    }

    pageView.getList=function() {
        pageView.loadingShow();
        var params = {};
        /* $.ajax({
         cache: true,
         type: "post",
         url: "getCanvassBusinessReports.htm",
         data: params,
         dataType: "html",
         //async: false,
         error: function (request) {
         alert("系统异常");
         pageView.loadingHide();
         },
         success: function (data) {
         pageView.loadingHide();
         $("#canvass_business_detail").html(data);
         var ys_main_swiper = new Swiper('#zl-floor-main-table', {
         scrollbar: '.swiper-scrollbar-a',
         direction: 'horizontal',
         slidesPerView: 'auto',
         //mousewheelControl: true,
         freeMode: true,
         scrollbarHide:false,
         preventClicksPropagation:false
         });
         }
         });*/
    }
    return pageView;
})(jQuery);


$(document).ready(function(){
    $("#preloader").fadeOut("fast");
    pageView.loadingHide();
   /* pageView.loadingShow();*/
    //pageView.eventInit();
    //pageView.loadingHide();
});




