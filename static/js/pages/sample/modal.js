/**
 * Created by whobird on 17/12/18.
 */
define([
    'jquery',
    "jquery.bootstrap",
],function(jquery){
    'use strict';

    var sampleView=(function($,sv){
        var sampleView=sv;

        sampleView.loadingShow=function(){
          $(".zl-loading").fadeIn();
        };

        sampleView.loadingHide=function(){
            $(".zl-loading").fadeOut();
        }

        //event
        sampleView.event_init=function(){
            $("#js-show-loading").on("click",function(e){
                e.preventDefault();
                sampleView.loadingShow();

                setTimeout(function(){
                    sampleView.loadingHide();
                },1000);
            });
        }

        sampleView.init=function(){
            console.log("sample view---------------");
            sampleView.event_init();
        }

        return sampleView;

    })(jquery,sampleView||{});

    return sampleView;
});