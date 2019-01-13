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

    var sampleView=(function($,sv){
        var sampleView=sv;
        //抽象出插件
        sampleView.collapse_init=function(){
            $(".zl-table-collapse").on("click",".zl-table-row",function(e){
               e.preventDefault();
               //$(this).toggleClass("zl-table-row-selected");
               if($(this).hasClass("zl-table-row-selected")){
                   $(this).removeClass("zl-table-row-selected");
                   $(this).next(".zl-row-collapse").slideUp();
               }else{
                   $(this).addClass("zl-table-row-selected");
                   $(this).next(".zl-row-collapse").slideDown();
               }
            });
        };
        sampleView.init=function(){
            //推荐使用bootstrape默认的collapse实现。不另外定义js
            //sampleView.collapse_init();
        };

        return sampleView;

    })(jquery,sampleView||{});

    return sampleView;
});