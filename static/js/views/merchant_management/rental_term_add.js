/**
 * Created by whobird on 2018/4/16.
 */

var pageView=(function($){
    var pageView={};

    pageView.eventInit=function(){
        //暂存
        $(".js-temp-save").on("click",function(e){

            e.preventDefault();
        });

        //附件
        $(".js-attachment").on("click",function(e){
            e.preventDefault();

        });
        //发起审批
        $(".js-save").on("click",function(e){
            e.preventDefault();

        });

    }

  /*  pageView.setSwiper=function(id){
        var id=id;
        var ys_main_swiper = new Swiper(id, {
            scrollbar: '.swiper-scrollbar-a',
            direction: 'horizontal',
            slidesPerView: 'auto',
            //mousewheelControl: true,
            freeMode: true,
            scrollbarHide:false,
            preventClicksPropagation:false
        });
    }*/

    pageView.swiperInit=function(){
        new Swiper('.swiper-container', {
            scrollbar: '.swiper-scrollbar-a',
            direction: 'horizontal',
            slidesPerView: 'auto',
            //mousewheelControl: true,
            freeMode: true,
            scrollbarHide:false,
            preventClicksPropagation:false,
            observer:true,
            observeParents:true,
            scrollbarDraggable : true ,
        });
    }
    pageView.init=function(){
        $("#preloader").fadeOut("fast");
        pageView.eventInit();

        pageView.swiperInit();

    };
    return pageView;

})(jQuery);


$(document).ready(function(){
    pageView.init();
});