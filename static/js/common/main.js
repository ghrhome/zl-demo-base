/**
 * Created by whobird on 17/6/19.
 */
requirejs.config({
    baseUrl: '../static',
    paths: {
        jquery:"dist/js/jQuery/jquery-2.2.3.min",
        "jquery.bootstrap": "dist/bootstrap/js/bootstrap.min",
        "dom_onload":"js/main/dom_onload",//dom onload
        "jquery.datetimepicker": "dist/js/datetimepicker/bootstrap-datetimepicker",
        "jquery.datetimepicker.zh": "dist/js/datetimepicker/locales/bootstrap-datetimepicker.zh-CN",
        //'jquery.ui':'js/plugins/jquery-ui',
        "swiper":"dist/js/swiper.jquery.min",
        "pin":"dist/js/jquery.pin",

        utils:"js/utils",
        uploader:"dist/js/uploader",

        main:"js/main",
        views:"js/views",
        domReady:"dist/js/domReady",

    },
    shim: {

        "jquery.bootstrap": {
            deps: ["jquery"]
        },
        "jquery.datetimepicker":{
            deps: ["jquery"]
        },
        "jquery.datetimepicker.zh":{
            deps: ["jquery","jquery.datetimepicker"]
        },
        "swiper":{
            deps:["jquery"]
        },
        "uploader":{
            deps:["jquery","jquery.bootstrap"]
        },
        "pin":{
            deps:["jquery"]
        }
    },
    urlArgs: "bust=" + (new Date()).getTime() //防止读取缓存，调试用
});

define(['require',
    'jquery',
    "views/sample/sample",

    "jquery.bootstrap",
    "jquery.datetimepicker",
    "jquery.datetimepicker.zh",
    //todo:replace the original slimScroll with iscroll
    'swiper',
    'pin',
    "dom_onload",
    //"js/controllers/app.controllers",


],function(require,$,sample){
    'use strict';
    require(['domReady!'],function(document){
        sample.init();
    });

});
