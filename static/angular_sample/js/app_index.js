/**
 * Created by whobird on 17/12/26.
 */
define(['require',
    'jquery',
    'angular',
    "jquery.bootstrap",
    "jquery.datetimepicker",
    "jquery.datetimepicker.zh",
    //'angular-animate',
    'swiper',
    'pin',
    //"js/controllers/app.controllers",
    "./budget/index"

],function(require,$,angular){
    'use strict';
    require(['domReady!'],function(document){
        angular.bootstrap(document,["app"]);
    });

});
