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

    //console.log(_);
    var sampleView=(function($,sv){
        var sampleView=sv;

        var funTransitionHeight = function(element, time) { // time, 数值，可缺省
            if (typeof window.getComputedStyle == "undefined") return;

            var height = window.getComputedStyle(element).height;

            element.style.transition = "none"; // 本行2015-05-20新增，mac Safari下，貌似auto也会触发transition, 故要none下~

            element.style.height = "auto";
            var targetHeight = window.getComputedStyle(element).height;
            element.style.height = height;
            //element.offsetWidth = element.offsetWidth;
            if (time) element.style.transition = "height "+ time +"ms";
            element.style.height = targetHeight;
        };

        sampleView.init=function(){
            $("#js-show-menu").on("click",function(){
                var $elem=$(this).next("ul")
                if($elem.hasClass("collapsing")){
                    return;
                }
                if($elem.hasClass("in")){
                    var _height=$elem.css("height");
                    $elem.css("height",_height);
                     var _targetHeight=0;
                     $elem.one("transitionend",function(){
                         $elem.removeClass("collapsing").addClass("collapse").height("");
                     }).addClass("collapsing").removeClass("collapse in").height(_targetHeight);
                }else{
                    $elem.removeClass("collapse in");
                    var _targetHeight=$elem.css("height");
                    var _height=0;

                    $elem.height(_height);

                    $elem.addClass("collapsing").height(_targetHeight);

                    $elem.one("transitionend",function(){
                        $elem.removeClass("collapsing").addClass("collapse in").height("");

                    });
                }
            })
        }

        return sampleView;

    })(jquery,sampleView||{});

    return sampleView;
});