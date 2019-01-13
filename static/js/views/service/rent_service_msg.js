/**
 * Created by whobird on 17/12/18.
 */
define([
    'jquery',
    "jquery.bootstrap",
    //todo:replace the original slimScroll with iscroll
    "utils/jq/jq_plugin_dropdown",
    // "handlebars-v4.0.8",
    "views/common/selectUnit"

],function(jquery,handlebars,_){
    'use strict';

    console.log(_);
    var pageView=(function($,pv){
        var pageView=pv;

        var _selectedShops={
        "s01":{
            "id":"s01",
            "name":"S01",
            "value":"租金/2016-01/3,517.45元/3,517.45元"
        }
    };

        $.get("../common/unit_select_data.json",function(data,status){

            selectUnit.init(data,"multi");
        });

        pageView.dropdownInit=function(){
            $(".zl-dropdown").ysdropdown({
                callback:function(val){
                    console.log("===================")
                    console.log(val);
                }
            });
        }

        pageView.modalInit=function(){
            $("#js-user-select").on("click",function(e){
                // $("#userSelectFloorModal").modal("show");
                console.log($("input[name=selectPeopleType]:checked").attr("id"));
                var selectTypeId=$("input[name=selectPeopleType]:checked").attr("id");
                if(selectTypeId=="select-people-layout"){
                    $("#userSelectLayoutModal").modal("show");
                    return;
                }
                if(selectTypeId=="select-people-floor"){
                    $("#userSelectFloorModal").modal("show");
                    return;
                }
                selectUnit.modalShow(
                function(selectedShops){
                    _selectedShops=selectedShops;
                    _setInput(_selectedShops)
                },_selectedShops)
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