/**
 * Created by whobird on 17/5/12.
 */

var directive=angular.module("appDirective",[]);


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


directive.directive('datePicker', [
        function() {
            return {
                restrict: 'A',
                scope: {
                    dateSelect:"&",
                    //curMonth:"@",
                    startDate: '=',
                    dateDirectiveName:"@",
                    startView: '@',
                    minView: '@',
                    format: '@'
                },
                require:"ngModel",

                template: '<div class="input-group date zl-datetimepicker">'+
                            '<input class="form-control" type="text" value="" data-provide="datepicker" name="date- {{dateDirectiveName}}'+
                            '" id="date-{{dateDirectiveName}}'+
                            '" readonly>' +
                            '</div>',
                link: function($scope, $element,attrs,ngModelCtrl) {

                    var updateModel=function(dateText){
                        $scope.$apply(function(){
                            ngModelCtrl.$setViewValue(dateText);
                        });
                    };

                    ngModelCtrl.$render=function(){
                        $element.find("input").val(ngModelCtrl.$viewValue);
                    }

                    //month Selector
                    var dpicker;

                    $scope.$watch('startDate',function(){
                        if($scope.startDate) {
                            //dpicker.setDisabledBefore($scope.disabledBefore);
                            //dpicker.fill();
                            //dpicker.update();
                            $element.find("input").datetimepicker('setStartDate', $scope.startDate);

                            $element.find("input").datetimepicker('setInitialDate', $scope.startDate);


                        }

                    })

                    var dateSelector=function(){
                        /*var curDate=new Date();
                         var start_date=curDate.getFullYear()+"-"+(curDate.getMonth()+1);
                         */
                        dpicker=$element.find("input").datetimepicker({
                            format:$scope.format||"yyyy-mm-dd",
                            todayBtn:"linked",
                            startView:$scope.startView||2,
                            minView:$scope.minView||2,
                            autoclose: true,
                            language:"zh-CN",
                            pickerPosition:"bottom-left",
                            clearBtn:true,
                            //disabledBefore: $scope.disabledBefore,
                            startDate:$scope.startDate
                        }).on('changeDate', function(e){

                            var dateStr=$element.find("input").val();
                            updateModel(dateStr);

                            if($scope.dateSelect){
                                //如果作用域有处理函数，
                                $scope.dateSelect({date:dateStr});
                            }

                        });

                    };

                    dateSelector();

                   /* $element.find("input").on("focus",function(){
                        $(this).closest(".input-group").addClass("out-ring");
                    });
                    $element.find("input").on("blur",function(){
                        $(this).closest(".input-group").removeClass("out-ring");
                    });*/

                    //destroy
                    $scope.$on("$destroy", function() {
                        //清除配置
                        $element.find("input").datetimepicker("remove");

                    });
                }//end link
            };
        }]);

directive.directive('dateRangePicker', ["$timeout",
    function($timeout) {
        return {
            restrict: 'A',
            scope: {
                dateSelect:"&",
                //curMonth:"@",
                startDate: '=',
                endDate:"=",
                //dateDirectiveName:"@",
                startView: '@',
                minView: '@',
                format: '@'
            },
            //require:"ngModel",
            transclude:true,
            replace:false,
            template: "<div ng-transclude></div>",
            /*<div class="input-group zl-datepicker zl-datetime-range pull-left" style="width:100%">
            <input type="text" class="form-control input-sm js-date-start" value="1">
            <div class="input-group-addon input-xs">~</div>
            <input type="text" class="form-control input-sm js-date-end" value="2">
            </div>*/
            link: function($scope, $element,attrs,ngModelCtrl) {

                //month Selector
                var dstartpicker,dendpicker;
                var _startTimestamp=0;
                var _endTimestamp=0;

                _startTimestamp=new Date($scope.startDate).getTime();
                _endTimestamp=new Date($scope.endDate).getTime();

                function updateScope(dateStr,type){
                    if(type=="start"){
                        $scope.startDate=dateStr;
                    }else if(type=="end"){
                        $scope.endDate=dateStr;
                    }

                    if($scope.dateSelect){
                        //如果作用域有处理函数，
                        $scope.$apply(function(){
                            if(type=='start'){
                                $timeout(function(){
                                    $scope.dateSelect({date:$scope.startDate,type:type}),100
                                });
                            }else if(type=='end'){
                                $timeout(function(){
                                    $scope.dateSelect({date:$scope.endDate,type:type}),100
                                });

                            }

                        })

                    }
                }

                $scope.$watch('startDate',function(){
                    if($scope.startDate) {
                        $element.find("input.js-date-start").datetimepicker('setStartDate', $scope.startDate);
                        $element.find("input.js-date-start").datetimepicker('setInitialDate', $scope.startDate);
                    }

                });
                $scope.$watch('endDate',function(){
                    if($scope.endDate) {
                        //dpicker.setDisabledBefore($scope.disabledBefore);
                        //dpicker.fill();
                        //dpicker.update();
                        $element.find("input.js-date-end").datetimepicker('setStartDate', $scope.endDate);
                        $element.find("input.js-date-end").datetimepicker('setInitialDate', $scope.endDate);

                    }

                });
                console.log($scope.startDate)
                var dateSelector=function(){
                    /*var curDate=new Date();
                     var start_date=curDate.getFullYear()+"-"+(curDate.getMonth()+1);
                     */
                    dstartpicker=$element.find("input.js-date-start").datetimepicker({
                        format:$scope.format||"yyyy-mm-dd",
                        todayBtn:"linked",
                        startView:$scope.startView||2,
                        minView:$scope.minView||2,
                        autoclose: true,
                        language:"zh-CN",
                        pickerPosition:"bottom-left",
                        //clearBtn:true,
                        //disabledBefore: $scope.disabledBefore,
                    }).on('changeDate', function(e){
                       //_startTimestamp=e.timeStamp;

                        var dateStr=$element.find("input.js-date-start").val();



                        if(dateStr){

                            dendpicker.datetimepicker("setStartDate",dateStr);
                        }else{
                            dendpicker.datetimepicker("setStartDate",null);
                        }

                        _startTimestamp=new Date(dateStr).getTime();
                        console.log(_endTimestamp);
                        console.log(_startTimestamp)
                        if(_endTimestamp<_startTimestamp){
                            console.log("......")
                            dendpicker.val("");
                            updateScope("","end");
                        }

                        dendpicker.datetimepicker("update");

                        updateScope(dateStr,"start");

                    });

                    dendpicker=$element.find("input.js-date-end").datetimepicker({
                        format:$scope.format||"yyyy-mm-dd",
                        todayBtn:"linked",
                        startView:$scope.startView||2,
                        minView:$scope.minView||2,
                        autoclose: true,
                        language:"zh-CN",
                        pickerPosition:"bottom-left",
                        clearBtn:true,
                        //disabledBefore: $scope.disabledBefore,
                        startDate:$scope.startDate
                    }).on('changeDate', function(e){
                        console.log(e);


                        console.log("end:"+_endTimestamp)
                        var dateStr=$element.find("input.js-date-end").val();

                        _endTimestamp=new Date(dateStr).getTime();

                        updateScope(dateStr,"end");

                    });
                    dstartpicker.val($scope.startDate);
                    dendpicker.val($scope.endDate);
                    dstartpicker.datetimepicker("update");
                    dendpicker.datetimepicker("update");
                };

                dateSelector();

                /* $element.find("input").on("focus",function(){
                     $(this).closest(".input-group").addClass("out-ring");
                 });
                 $element.find("input").on("blur",function(){
                     $(this).closest(".input-group").removeClass("out-ring");
                 });*/

                //destroy
                $scope.$on("$destroy", function() {
                    //清除配置
                    $element.find("input").datetimepicker("remove");

                });
            }//end link
        };
    }]);


directive.directive('menuDropdownKv', [
    function() {
        return {
            restrict: 'A',
            scope: {
                itemSelect:"&",
                ngModel:"=",
                menuList:"=",
            },
            require:"ngModel",
            transclude:true,
            template: '<div class="dropdown zl-dropdown-inline">' +
            ' <button class="btn btn-default dropdown-toggle zl-btn  zl-dropdown-btn" type="button" data-toggle="dropdown">' +
            '   {{menuList[ngModel]|default:"请选择"}}' +
            '<span class="span-more"></span>'+
            ' </button>' +
            '<ul class="dropdown-menu">' +
            '   <li ng-repeat="(key,val) in menuList track by $index" ng-class="{active:(key==ngModel)}">' +
            '        <a ng-click="setItem(key)">{{val}}</a> ' +
            '   </li>' +
            '</ul>' +
            '</div>',

            link: function($scope, $element,attrs,ngModelCtrl) {

                $scope.setItem=function(item){
                    ngModelCtrl.$setViewValue(item);
                    $scope.itemSelect({item:item});
                }

                $scope.$on("$destroy", function() {
                    //清除配置
                    //console.log("destroy");
                    // $("body").off("click","li.zl-tree-item");
                });
            }//end link
        };
    }]);
