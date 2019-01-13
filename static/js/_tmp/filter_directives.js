/**
 * Created by limeiting on 16/11/18.
 */
angular.module('ampFilter').directive('monthPicker', [
    function() {
        return {
            restrict: 'A',
            scope: {
               monthSelect:"&",
                //curMonth:"@"

            },
            require:"ngModel",

            template:'<div class="toolbar-item item-month-filter" style="padding:0;">' +
            '<label for="month-filter">时间</label>' +
            '<div class="input-group date zl-datepicker" id="monthpicker">'+
            '<span class="input-group-btn">' +
            '<button class="btn btn-default" type="button" id="zl-date-pre"><em class="glyphicon glyphicon-arrow-left"></em></button>' +
            '</span>' +
            '<input size="16" type="text" value="" data-provide="datepicker" id="month-filter" name="month-filter" >' +
            '<span class="input-group-btn">' +
            '<button class="btn btn-default" type="button" id="zl-date-next"><em class="glyphicon glyphicon-arrow-right"></em></button>' +
            '</span>' +
            '</div>' +
            '</div>',
            link: function($scope, $element,attrs,ngModelCtrl) {
                function gd(year, month, day) {
                    return new Date(year, month, day).getTime();
                }

                function DateAdd(interval,number,dateStr){

                    // DateAdd(interval,number,date)
                    var date = new Date(dateStr);
                    var d="";
                    switch(interval)
                    {
                        case   "y"   :   {
                            date.setFullYear(date.getFullYear()+number);
                            break;
                        }
                        case   "q"   :   {
                            date.setMonth(date.getMonth()+number*3);
                            break;
                        }
                        case   "m"   :   {
                            date.setMonth(date.getMonth()+number);
                            d=  date.getFullYear()+"-"+(date.getMonth()<9?("0"+(date.getMonth()+1)):(date.getMonth()+1));
                            break;
                        }
                        case   "w"   :   {
                            date.setDate(date.getDate()+number*7);
                            d =date.getFullYear()+"-"+(date.getMonth()<9?("0"+(date.getMonth()+1)):(date.getMonth()+1))+"-"+(date.getDate()<9?("0"+date.getDate()):date.getDate());
                            break;
                        }
                        case   "d"   :   {
                            date.setDate(date.getDate()+number);
                            break;
                        }
                        case   "h"   :   {
                            date.setHours(date.getHours()+number);
                            break;

                        }
                        case   "mi"   :   {
                            date.setMinutes(date.getMinutes()+number);
                            break;
                        }
                        case   "s"   :   {
                            date.setSeconds(date.getSeconds()+number);
                            break;
                        }
                        default   :   {
                            date.setDate(date.getDate()+number);
                            break;
                        }

                    }//end switch
                    if(d!=""){
                        return d;
                    }else{
                        return date.getFullYear()+"-"+(date.getMonth()<9?("0"+(date.getMonth()+1)):(date.getMonth()+1))+"-"+(date.getDate()<9?("0"+date.getDate()):date.getDate());
                    }
                };

                var updateModel=function(dateText){

                    $scope.$apply(function(){

                        ngModelCtrl.$setViewValue(dateText);
                    });
                };



                ngModelCtrl.$render=function(){
                    //console.log("...")
                    //console.log(ngModelCtrl.$viewValue);
                    $element.find("input").val(ngModelCtrl.$viewValue);
                }

                //month Selector
                var mpicker;
                var monthSelector=function(){
                    /*var curDate=new Date();
                     var start_date=curDate.getFullYear()+"-"+(curDate.getMonth()+1);
                    */
                    mpicker=$element.find("input").datetimepicker({
                        format:"yyyy-mm",
                        todayBtn:"linked",
                        startView:3,
                        minView:3,
                        autoclose: true,
                        language:"zh-CN",
                    }).on('changeDate', function(e){

                        var dateStr=$element.find("input").val();
                        updateModel(dateStr);
                        if($scope.monthSelect){
                            //如果作用域有处理函数，
                            $scope.$apply(function(){
                                $scope.monthSelect({date:dateStr});
                            });
                        }

                    });

                    $element.find("button").on("click",function(e){
                        var curButton=$(this).attr("id");
                        var plus=1;
                        if(curButton=="zl-date-pre"){
                            plus=-1;
                        }
                        e.preventDefault();
                        //var dateStr=$element.find("input").val();
                        var dateStr=$element.find("input").val()||"";
                        if(dateStr==""){
                            var today=new Date();
                            var newDate=DateAdd("m",plus,today);
                            $element.find("input").val(newDate);
                            updateModel(newDate);
                            if($scope.monthSelect){
                                //如果作用域有处理函数，
                                $scope.$apply(function(){
                                    $scope.monthSelect({date:newDate});
                                });
                            }
                        }else{

                            var curDateStr= dateStr.split("-");
                            var curDate=gd(parseInt(curDateStr[0]),parseInt(curDateStr[1])-1,15);
                            var newDate=DateAdd("m",plus,curDate);
                            $element.find("input").val(newDate);

                            updateModel(newDate);

                            if($scope.monthSelect){
                                //如果作用域有处理函数，
                                $scope.$apply(function(){
                                    $scope.monthSelect({date:newDate});
                                });
                            }
                        }

                        //broadcast
                      /*  $scope.$emit("monthUpdate",{
                            date:"date 2016"
                        });*/

                    });


                };

                monthSelector();

                $element.find("input").on("focus",function(){
                        $(this).closest(".input-group").addClass("out-ring");
                    });
                $element.find("input").on("blur",function(){
                        $(this).closest(".input-group").removeClass("out-ring");
                    });

                //destroy
                $scope.$on("$destroy", function() {
                    //清除配置
                    //console.log("destroy");
                    $element.find("input").datetimepicker("remove");

                });
            }//end link
        };
    }]);