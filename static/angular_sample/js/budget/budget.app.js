/**
 * Created by whobird on 17/11/21.
 */
define(["angular","./budget.directive","./budget.filters"],function(angular){
    var app=angular.module("app",["app.directives","app.filters"]);

    app.service("dataMenuService",["$rootScope","$http",function($rootScope,$http) {
        var service = {
            getData: function (url,search,cb) {
                if(typeof search==="undefined"){
                    search="";
                }
                return $http.get(url+"?search="+search, {cache: false,'Content-Type':'application/x-www-form-urlencoded',withCredentials:true}).then(function (res) {
                    if(typeof cb!=="undefined"){
                        cb(res.data);
                    }else{
                        return res.data;
                    }

                },function(errr){
                    // location.href=$rootScope.plink;
                });
            },
        };
        return service;
    }]);

    app.service("dataPreloadService",["$rootScope","$http",function($rootScope,$http) {
        var service = {
            getData: function (url,search,cb) {
                if(typeof search==="undefined"){
                    search="";
                }
                //todo:把dataPreloadService作为一个通用的api 根据search的传参，后台返回页面渲染数据，实现页面的预加载
                return $http.get(url+"?search="+search, {cache: false,'Content-Type':'application/x-www-form-urlencoded',withCredentials:true}).then(function (res) {
                    if(typeof cb!=="undefined"){
                        cb(res.data);
                    }else{
                        return res.data;
                    }

                },function(errr){
                    // location.href=$rootScope.plink;
                });
            },
        };
        return service;
    }]);

    app.service("dataSaveService",["$rootScope","$http",function($rootScope,$http) {
        var service = {
            saveData: function (url,postData,cb,subType) {
                $rootScope.loading_show();

                return $http({
                    url: url,
                    data: postData,
                    method: 'post',
                    cache: false,
                    headers: {
                        'Content-Type': subType === 'json' ? 'application/json' : 'application/x-www-form-urlencoded'
                    },
                    withCredentials:true
                }).then(function (res) {
                    if(typeof cb!=="undefined"){
                        cb(res.data);
                    }else{
                        return res.data;
                    }
                    $rootScope.loading_hide();

                },function(err){
                    // location.href=$rootScope.plink;
                    alert("网络错误，请稍后再试");
                    $rootScope.loading_hide();
                });
            }
        };
        return service;
    }]);

    return app;

})
