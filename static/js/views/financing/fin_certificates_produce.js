var pageView=(function($){
    var pageView={};  
    pageView.init=function(){
        $("#preloader").fadeOut("fast");
        var ys_main_swiper = new Swiper('#zl-floor-main-table', {
            scrollbar: '.swiper-scrollbar-a',
            direction: 'horizontal',
            slidesPerView: 'auto',
            //mousewheelControl: true,
            freeMode: true,
            scrollbarHide:false,
            preventClicksPropagation:false
        });
    };

    return pageView;

})(jQuery);


$(document).ready(function(){
    pageView.init();
});