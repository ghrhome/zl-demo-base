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
                scrollbarDraggable:true,
                preventClicksPropagation:false
            });
        }

        return swiperView;

    })(jquery,swiperView||{});

    return swiperView;
});