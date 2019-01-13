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
        $(".zl-table-wrapper-swiper").on("mouseenter","tbody tr",function(e){
                var _index=$(this).index();

                $(".zl-table-static").find("tbody tr").eq(_index).addClass('hover');
                $(".swiper-container").find("tbody tr").eq(_index).addClass('hover');

            });

            $(".zl-table-wrapper-swiper").on("mouseleave","tbody tr",function(e){
                var _index=$(this).index();

                $(".zl-table-static").find("tbody tr").eq(_index).removeClass('hover');
                $(".swiper-container").find("tbody tr").eq(_index).removeClass('hover');

            })
    };

    return pageView;

})(jQuery);


$(document).ready(function(){
    pageView.init();
});