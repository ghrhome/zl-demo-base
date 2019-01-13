/**
 * Created by whobird on 17/12/18.
 */
define([
    'jquery',
    'handlebars',
    "underscore",
    "jquery.bootstrap",
    "jquery.datetimepicker",
    "jquery.datetimepicker.zh",
    //todo:replace the original slimScroll with iscroll
    'swiper',
    'pin',


],function(jquery,handlebars,_){
    'use strict';
    var swiperView=(function($,sv){
        var swiperView=sv;

        swiperView.init=function(){
            var ys_main_swiper;
            ys_main_swiper = new Swiper('#zl-floor-main-table', {
                scrollbar: '.swiper-scrollbar-a',
                direction: 'horizontal',
                slidesPerView: 'auto',
                //mousewheelControl: true,
                freeMode: true,
                scrollbarHide:false,
                grabCursor:true,
                scrollbarDraggable : true ,
                preventClicksPropagation:true
            });


            $(".zl-table-wrapper-swiper").on("mouseenter","tbody tr",function(e){
                var _index=$(this).index();

                $(".zl-table-static").find("tbody tr").eq(_index).addClass('hover');
                $(".swiper-container").find("tbody tr").eq(_index).addClass('hover');

                console.log(_index)
            });

            $(".zl-table-wrapper-swiper").on("mouseleave","tbody tr",function(e){
                var _index=$(this).index();

                $(".zl-table-static").find("tbody tr").eq(_index).removeClass('hover');
                $(".swiper-container").find("tbody tr").eq(_index).removeClass('hover');

                console.log(_index)
            });

        }

        return swiperView;

    })(jquery,swiperView||{});

    return swiperView;
});