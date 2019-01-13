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

    "utils/jq/jq_plugin_datepicker"


],function(jquery,handlebars,_){
    'use strict';

    console.log(_);

    var pageView=(function($,pv){
        var pageView=pv;

        pageView.dateRangeInit=function(){
            var _startTimestamp=0,_endTimestamp=0;

            var dateStart=$("#js-date-range").find("input.js-date-start").datetimepicker({
                format:"yyyy-mm-dd",
                todayBtn:"linked",
                startView:2,
                minView:2,
                autoclose: true,
                language:"zh-CN",
            }).on('changeDate', function(e){

                var _startDate=$(this).val();
                _startTimestamp=e.date.getTime();
                if(_startDate){
                    dateEnd.datetimepicker("setStartDate",_startDate);
                }else{
                    dateEnd.datetimepicker("setStartDate",null);
                }

                if(_endTimestamp<_startTimestamp){
                    dateEnd.val("");
                }
                dateEnd.datetimepicker("update");

            }).on("click",function(){

            });

            var dateEnd=$("#js-date-range").find("input.js-date-end").datetimepicker({
                format:"yyyy-mm-dd",
                todayBtn:"linked",
                startView:2,
                minView:2,
                autoclose: true,
                language:"zh-CN",
            }).on('changeDate', function(e){
                _endTimestamp=e.date.getTime();

            });


          /*  $('#js-date-range').on("click","input",function(e){
                if($(this).data("show")=="show"){
                    $(this).datetimepicker("hide");
                    $(this).data("show","hide")
                }else{
                    $(this).datetimepicker("show");
                    $(this).data("show","show")
                }
            });*/
        }

        var datepicker=$("#js-date-picker").find("input").datetimepicker({
            format:"yyyy-mm-dd",
            todayBtn:"linked",
            startView:2,
            minView:2,
            autoclose: true,
            language:"zh-CN",
        }).on('changeDate', function(e){
            console.log(e)

        })

        pageView.ysDateInit=function(){
            $("#js-month-picker").ysDatepicker({
                dateType:"month",//year,day
                callback:function(value){
                    console.log("======================")
                    console.log(value);
                }
            })
        }

        pageView.init=function(){
            pageView.dateRangeInit();
            pageView.ysDateInit();
        }

        return pageView;

    })(jquery,pageView||{});

    return pageView;
});