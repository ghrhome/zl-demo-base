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

        var pin;
        var sample_head_swiper,sample_main_swiper;

        swiperView.init=function(){

            sample_head_swiper = new Swiper('#js-main-table-head', {
                //scrollbar: '.swiper-scrollbar',
                direction: 'horizontal',
                slidesPerView: 'auto',
                //mousewheelControl: true,
                freeMode: true,
                scrollbarHide:true,
                //watchSlidesProgress:true,
            });
            sample_main_swiper = new Swiper('#js-main-table', {
                scrollbar: '.swiper-scrollbar',
                direction: 'horizontal',
                slidesPerView: 'auto',
                //mousewheelControl: true,
                freeMode: true,
                scrollbarHide:false,
                //watchSlidesProgress:true,
            });

            sample_head_swiper.params.control = sample_main_swiper;
            sample_main_swiper.params.control = sample_head_swiper;

            pin=$(".zl-table-fixed-top").pin({
                containerSelector: "#js-main-table-wrapper",
                padding: {top: 44, bottom: 50}
            });
        }

        return swiperView;

    })(jquery,swiperView||{});

    return swiperView;
});