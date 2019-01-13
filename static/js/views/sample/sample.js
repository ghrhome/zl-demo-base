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
    var sampleView=(function($,sv){
        var sampleView=sv;

        sampleView.init=function(){
            console.log("sample view---------------");
            var source   = $("#entry-template").html();
            var template = handlebars.compile(source);

            var context = {title: "My New Post", body: "This is my first post!"};
            var html    = template(context);


            $("#page-sample").append(html);

            $(".js-warn-text").tooltip();

           // $(".zl-dropdown").sample("init");

            $(".zl-dropdown").ysdropdown({
                callback:function(val,$elem){
                    console.log("===================")
                    console.log(val);
                    console.log($elem);
                }
            });

        }

        return sampleView;

    })(jquery,sampleView||{});

    return sampleView;
});