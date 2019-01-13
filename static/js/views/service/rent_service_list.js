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

    "utils/jq/jq_plugin_dropdown"

],function(jquery,handlebars,_){
    'use strict';

    console.log(_);
    var pageView=(function($,pv){
        var pageView=pv;

        pageView.init=function(){
           // $(".zl-dropdown").sample("init");

            $(".zl-dropdown").sample({
                callback:function(val){
                    console.log("===================")
                    console.log(val);
                }
            });
        };




        return pageView;

    })(jquery,pageView||{});

    return pageView;
});