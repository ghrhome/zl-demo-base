/**
 * Created by whobird on 2018/4/12.
 */
var pageView=(function($){
    var pageView={};
    var ys_main_swiper;

    pageView.swiperInit=function(){
         ys_main_swiper= new Swiper('#zl-pol-main-table', {
            scrollbar: '.swiper-scrollbar-a',
            slidesPerView: 'auto',
            freeMode: true,
            scrollbarHide:false
        });
    };

    pageView.eventInit=function(){
        var page = $("#payment-order-list");

        page.on("click",".zl-table-block tbody tr",function(){
            window.location = "payment_order_detail.html";
        });
    };

    pageView.init=function(){
        $("#preloader").fadeOut("fast");
        pageView.swiperInit();
        pageView.eventInit();
    };

    return pageView;

})(jQuery);


$(document).ready(function(){
   pageView.init();
});