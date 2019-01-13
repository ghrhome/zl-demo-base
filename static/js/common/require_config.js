/**
 * Created by whobird on 17/12/18.
 */
/**
 * Created by whobird on 17/6/19.
 */
/**
 * Created by whobird on 17/6/19.
 */
requirejs.config({
    baseUrl: '../../static',
    paths: {
        jquery:"dist/js/jQuery/jquery-2.2.3.min",
        "jquery.bootstrap": "dist/bootstrap/js/bootstrap.min",
        "dom_onload":"js/common/dom_onload",//dom onload
        "jquery.datetimepicker": "dist/js/datetimepicker/bootstrap-datetimepicker",
        "jquery.datetimepicker.zh": "dist/js/datetimepicker/locales/bootstrap-datetimepicker.zh-CN",
        //'jquery.ui':'js/plugins/jquery-ui',
        "swiper":"dist/js/swiper.jquery.min",
        "pin":"dist/js/jquery.pin",

        "angular":"dist/js/angular/angular.min",

        agSample:"angular_sample/js",
        common:"js/common",
        views:"js/views",
        utils:"js/utils",
        uploader:"dist/js/uploader",

        domReady:"dist/js/domReady",
        handlebars:"dist/js/handlebars-v4.0.8",
        underscore:"dist/js/underscore-min"

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
        "angular":{
            exports:'angular',
            deps: ["jquery"]
        },
        "swiper":{
            deps:["jquery"]
        },
        "pin":{
            deps:["jquery"]
        }
    },

    waitSeconds:0,

    urlArgs: "bust=" + (new Date()).getTime() //防止读取缓存，调试用


});
