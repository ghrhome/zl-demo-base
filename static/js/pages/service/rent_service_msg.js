/**
 * Created by whobird on 17/12/18.
 */
define([
    'jquery',
    "jquery.bootstrap",
    //todo:replace the original slimScroll with iscroll
    "utils/jq/jq_plugin_dropdown"

],function(jquery,handlebars,_){
    'use strict';

    console.log(_);
    var pageView=(function($,pv){
        var pageView=pv;

        pageView.dropdownInit=function(){
            $(".zl-dropdown").sample({
                callback:function(val){
                    console.log("===================")
                    console.log(val);
                }
            });
        }

        pageView.modalInit=function(){
            $("#js-user-select").on("click",function(e){
                $("#userSelectModal").modal("show");
            });
        }

        pageView.treeInit=function(){

            var $element=$(".zl-list-tree-wrapper")
            $element.on("click","li.zl-tree-item",function(e){
                e.preventDefault();
                e.stopPropagation();
                if($(this).hasClass("parent")){
                    $(this).toggleClass("open");
                    if(!$(this).hasClass("open")){
                        $(this).find(".zl-tree-item").removeClass("open");
                    }
                }else{
                    if($(this).hasClass("active")){
                        return;
                    }else{

                        $(this).closest(".zl-list-tree").find(".zl-tree-item").removeClass("active");
                        $(this).addClass("active");

                    }

                }
            });
        }

        pageView.init=function(){
           // $(".zl-dropdown").sample("init");
            pageView.dropdownInit();
            pageView.modalInit();
            pageView.treeInit();
        };



        return pageView;

    })(jquery,pageView||{});

    return pageView;
});