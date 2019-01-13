/**
 * Created by whobird on 2018/4/18.
 */

var app=angular.module("app",["appDirective"]);

app.controller("rentalCtrl",["$rootScope","$scope","$timeout","dataloadService",
    function($rootScope,$scope,$timeout,dataloadService){
        var self=this;
        self.categoryList={};
        self.tableData={};
        self.promotion = {};
        self.modelData={
            rentalType:"fixed",
            rentalUnitPrice:"m",
            rentalPointType:"static",
            salesTax:"tax",
            marketingPointType:"static",
            rentalUnitPriceWord:"月",
            managementPriceType:"m",
            managementBillingType:"01"
        };
        self.saleTaxType='0';
        self.firstRentType = '0';
        self.promotion.taxRate = 0;
        self.decorateIsHave = '1';
        self.firstPeriodIsHave = '1';

        $("body").on("otherChange", function (e, data) {
            $scope.VAR=data.data;
            $scope.$apply();
        });

        $("body").on("timeRangeChange",function(e,start,end){
            console.log("=============================");
            console.log(start);
            console.log(end);

            //var rentalType = $(":radio[name=rental-type]:checked:enabled").val();
            var _rentalType = self.modelData.rentalType || "";
            var _pointType =  self.modelData.rentalPointType || "";
            var rentType = "rental-" + _rentalType + "-" + _pointType;
            if ("fixed" == _rentalType) {
                rentType = "rental-fixed";
            }

            var _marketingType = self.modelData.marketingPointType || "";
            console.log(_rentalType + "||" + _pointType);

            var dataRange= "&contractBeginDate=" + start + "&contractEndDate=" + end;
            var searchWord = "1";
            searchWord += "&rentType="+ rentType;
            searchWord += "&marketingType="+_marketingType;
            searchWord += dataRange;
            $("body").data("_rentInitJsonInfo"+"rental-fixed","");
            $("body").data("_rentInitJsonInfo"+"rental-point-static","");
            $("body").data("_rentInitJsonInfo"+"rental-point-ladder","");
            $("body").data("_rentInitJsonInfo"+"rental-point-high-static","");
            $("body").data("_rentInitJsonInfo"+"rental-point-high-static-pm","");
            $("body").data("_rentInitJsonInfo"+"rental-point-high-ladder","");
            $("body").data("_rentInitJsonInfo"+"rental-point-high-ladder-pm","");
            $("body").data("_marketingInitJsonInfostatic","");
            $("body").data("_marketingInitJsonInfoladder","");

            dataloadService.getData(netcommentWeb_Path + "netcomment/busicond/getRentalInitData.htm",searchWord,function(result){
                console.log(result.data);
                _cb(result.data);
            });

        });

        $("#proTaxRate").on("change",function(e, val){
            if (val == null || val == "" || val == undefined) {
                self.promotion.taxRate = "-";
            } else {
                self.promotion.taxRate = val;
            }
        });
        self.rentalTableDataDist={
            "fixed":[{
                "year": 1,
                "rental_period":[
                    {
                        "start": "",
                        "end": "",
                        "budget":"",
                        "apply":"",
                        "totalMonth":"",
                        "discountRate":"",
                        "noTaxTotalMonth":"",
                        "taxMonth":"",
                        "rentUnitPrice":""
                    }
                ]
            }],
            "point_static":[{
                "year": 1,
                "rental_period":[
                    {
                        "start": "",
                        "end": "",
                        "budget":"",
                        "rentUnitPrice":"",
                        "category":[
                            {
                                "type":"",
                                "name":"",
                                "mFee":"",
                                "pred_sales":"",
                                "ground_effect":""

                            }
                        ]
                    }
                ]
            }],
            "point_ladder":[{
                "year": 1,
                "rental_period":[
                    {
                        "start": "",
                        "end": "",
                        "budget":"",
                        "rentUnitPrice":"",
                        "category":[
                            {
                                "type":"",
                                "name":"",
                                "saleRange":[
                                    {
                                        "start": "",
                                        "end": "",
                                        "mFee": "",
                                        "pred_sales":"",
                                        "ground_effect":""
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }],
            "point_high_static":[{
                "year": 1,
                "rental_period":[
                    {
                        "start": "",
                        "end": "",
                        "budget":"",
                        "apply":"",
                        "totalMonth":"",
                        "discountRate":"",
                        "noTaxTotalMonth":"",
                        "taxTotalMonth":"",
                        "rentUnitPrice":"",
                        "category":[
                            {
                                "type":"",
                                "name":"",
                                "mFee": "",
                                "pred_sales":"",
                                "ground_effect":""
                            }
                        ]
                    }
                ]
            }],
            "point_high_ladder":[{
                "year": 1,
                "rental_period":[
                    {
                        "budget":"",
                        "apply":"",
                        "totalMonth":"",
                        "discountRate":"",
                        "noTaxTotalMonth":"",
                        "taxTotalMonth":"",
                        "rentUnitPrice":"",
                        "start": "",
                        "end": "",
                        "category":[
                            {
                                "type":"",
                                "name":"",
                                "saleRange":[
                                    {
                                        "start": "",
                                        "end": "",
                                        "mFee": "",
                                        "pred_sales":"",
                                        "ground_effect":""
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }],
            "marketing_static":[{
                "year": 1,
                "rental_period":[
                    {
                        "start": "",
                        "end": "",
                        "budget":"",
                        "apply":"",
                        "totalMonth":"",
                        "discountRate":"",
                        "noTaxTotalMonth":"",
                        "taxMonth":""
                    }
                ]
            }],
            "marketing_point_static":[{
                "year": 1,
                "rental_period":[
                    {
                        "start": "",
                        "end": "",
                        "budget":"",
                        "category":[
                            {
                                "type":"",
                                "name":"",
                                "mFee": "",
                                "pred_sales":""
                            }
                        ]
                    }
                ]
            }],
            "management_static":[{
                "year": 1,
                "rental_period":[
                    {
                        "start": "",
                        "end": "",
                        "budget":"",
                        "apply":"",
                        "totalMonth":"",
                        "discountRate":"",
                        "noTaxTotalMonth":"",
                        "taxMonth":""
                    }
                ]
            }]
        }
        //todo：self.rantalTableDataDefault根据当前的列表更新到对应的初始值( self.rentalTableDataDist 维护)
        self.rantalTableDataDefault=[
            {
                "year": 1,
                "rental_period":[
                    {
                        "start": "",
                        "end": "",
                        "budget":"",
                        "apply":"",
                        "totalMonth":"",
                        "discountRate":"",
                        "noTaxTotalMonth":"",
                        "taxMonth":""
                    }
                ]
            }
        ];

        self.marketingTableDataDefault=[
            {
                "year": 1,
                "rental_period":[
                    {
                        "start": "",
                        "end": "",
                        "budget":"",
                        "apply":"",
                        "totalMonth":"",
                        "discountRate":"",
                        "noTaxTotalMonth":"",
                        "taxMonth":""
                    }
                ]
            }
        ];

        self.managementTableDataDefault=[
            {
                "year": 1,
                "rental_period":[
                    {
                        "start": "",
                        "end": "",
                        "budget":"",
                        "apply":"",
                        "totalMonth":"",
                        "discountRate":"",
                        "noTaxTotalMonth":"",
                        "taxMonth":""
                    }
                ]
            }
        ];

        /*===========品类==============*/
        self.categoryTableDataDefault = [
            {
                "categoryCode":"",
                "categoryName":"",
                "mFee": "",
                "pred_sales":""
            }
        ];

        /*===========其他费用==============*/
        self.otherFeeTableDataDefault = [
            {
                "feeCode":"",
                "feeName":"",
                "feeType":"",
                "startDate":"",
                "endDate":"",
                "accountDate":"",
                "accountMoney":"",
                "accountMonth":"",
                "taxRate":"",
                "accountTypeName":"",
                "accountType":"",
                "isShow":false
            }
        ];

        /*===========首期==============*/
        self.firstPeriodTableDataDefault = [
            {
                "firstRentBegin":"",
                "firstRentEnd":"",
                "firstPayment":"",
                "firstRentTotal":"",
            }
        ];

        /*===========装修==============*/
        self.decorateTableDataDefault = [
            {
                "decorateStartDate":"",
                "decorateEndDate":"",
                "decorateBond":"",
                "decorateManageFee":"",
            }
        ];

        /*====================set rental Table =====================*/
        self.rentalTable="rental-fixed";

        self.setRentalTable=function(){

            var _rentalType=self.modelData.rentalType;//point-high-pm,point-high,point,fixed
            var _rentalPointType=self.modelData.rentalPointType; //static ladder

            var contractBeginDate = $("#contractBeginDate").val();
            var contractEndDate = $("#contractEndDate").val();
            var searchWord="";
            var dataRange="";

            if (null != contractBeginDate && "" != contractBeginDate && null != contractEndDate && "" != contractEndDate) {
                dataRange = "&contractBeginDate=" + contractBeginDate + "&contractEndDate=" + contractEndDate;
            }

            if(_rentalType=="fixed"){
                self.rentalTable="rental-fixed";
                self.rantalTableDataDefault=self.rentalTableDataDist["fixed"];
            }else if(_rentalType=="point"){
                self.rentalTable="rental-" + _rentalType + "-" + _rentalPointType;
                if(_rentalPointType=="static"){
                    self.rantalTableDataDefault=self.rentalTableDataDist["point_static"];
                }else if(_rentalPointType=="ladder"){
                    self.rantalTableDataDefault=self.rentalTableDataDist["point_ladder"];
                }
            }else if(_rentalType=="point-high"||_rentalType=="point-high-pm"){
                self.rentalTable="rental-" + _rentalType + "-" + _rentalPointType;
                if(_rentalPointType=="static"){
                    self.rantalTableDataDefault=self.rentalTableDataDist["point_high_static"];
                }else if(_rentalPointType=="ladder"){
                    self.rantalTableDataDefault=self.rentalTableDataDist["point_high_ladder"];
                }
            }

            var jsonData = $("body").data("_rentInitJsonInfo"+self.rentalTable);
            if (jsonData == null || jsonData.length == 0) {
                searchWord = "1&rentType="+ self.rentalTable + "" + dataRange;
                dataloadService.getData(netcommentWeb_Path + "netcomment/busicond/getRentalInitData.htm",searchWord,function(result){
                    console.log(result.data);
                    _cbForRent(result.data, _rentalType);
                });
            } else {
                _cbForRent(jsonData, _rentalType);
            }
            console.log( self.rentalTable);
            $timeout(function(){
                $rootScope.$broadcast("initSwiper");
            },100)
            self.modelData.rentalUnitPriceWord=self.modelData.rentalUnitPrice=="m"?"月":"天";

        };
        /*--------------------------end rental Table*/

        /*====================set marketing Table =====================*/
        self.marketingTable="point-static";

        self.setMarketingTable=function(){

            var _marketingPointType=self.modelData.marketingPointType; //static ladder
            var searchWord="";
            var contractBeginDate = $("#contractBeginDate").val();
            var contractEndDate = $("#contractEndDate").val();
            var dataRange="";

            if (null != contractBeginDate && "" != contractBeginDate && null != contractEndDate && "" != contractEndDate) {
                dataRange = "&contractBeginDate=" + contractBeginDate + "&contractEndDate=" + contractEndDate;
            }
            if(_marketingPointType=="static"){
                self.marketingTableDataDefault=self.rentalTableDataDist["marketing_static"];
                self.marketingTable="point-static";

            }else if(_marketingPointType=="ladder"){
                self.marketingTableDataDefault=self.rentalTableDataDist["marketing_point_static"];
                self.marketingTable="point-ladder";
            }

            var jsonData = $("body").data("_marketingInitJsonInfo"+_marketingPointType);
            console.log(jsonData);
            if (jsonData == null || jsonData.length == 0) {
                searchWord = "1&marketingType="+ _marketingPointType + "" + dataRange;
                dataloadService.getData(netcommentWeb_Path + "netcomment/busicond/getRentalInitData.htm",searchWord,function(result){
                    console.log(result.data);
                    _cbForMarketing(result.data);
                });
            } else {
                _cbForMarketing(jsonData);
            }

            $timeout(function(){
                $rootScope.$broadcast("initSwiper");
            },100)

            console.log( self.marketingTable);
        };

        /*--------------------------end rental Table*/

        /*-------------------------manageStart-------------------------*/
        self.managementTable="management_static";
        self.setManagementTable = function () {
            var contractBeginDate = $("#contractBeginDate").val();
            var contractEndDate = $("#contractEndDate").val();
            self.managementTableDataDefault = self.rentalTableDataDist["management_static"];
            dataloadService.getData(netcommentWeb_Path + "netcomment/busicond/getRentalInitData.htm","",function(result){
                _cbForManagemnet(result);
            });
        }
        /*-------------------------manageEnd-------------------------*/

        self.dateSelect=function(date, type, year, yearIndex, peroidIndex, list){
            // console.log(type);
            var period = year.rental_period[peroidIndex];
            var start = period.start;
            var end = period.end;
            var hasError = false;

            var contractBeginDateStr = $("#contractBeginDate").val();
            var contractEndDateStr = $("#contractEndDate").val();
            //新增首期租金结束日
            var firstRentEndStr = $("#firstRentEnd").val();
            var contractEndDate = new Date(contractEndDateStr);

            var rentYearStart = "";
            if (yearIndex == 0 && firstRentEndStr != "" && firstRentEndStr != null && peroidIndex == 0) {
                var firstRentEnd = new Date(firstRentEndStr);
                rentYearStart = firstRentEnd.setDate(firstRentEnd.getDate() + 1);
            } else {
                rentYearStart = new Date(contractBeginDateStr);
                rentYearStart = new Date(rentYearStart.setFullYear(rentYearStart.getFullYear() + parseInt(yearIndex)));
            }
            var rentYearStartStr = unix_to_date(rentYearStart);

            // var rentYearEnd = new Date(contractBeginDateStr);
            // rentYearEnd = new Date(rentYearEnd.setFullYear(rentYearEnd.getFullYear() + parseInt(yearIndex) + 1));
            // rentYearEnd = rentYearEnd.setDate(rentYearEnd.getDate() - 1);
            // if (contractEndDate < rentYearEnd) {
            //     rentYearEnd = contractEndDate;
            // }
            // var rentYearEndStr = unix_to_date(rentYearEnd);

            var inputDate = new Date(date);
            if (inputDate > contractEndDate) {
                period.end = "";
                alert("选择时间不能大于合同结束时间！");
                return;
            }
            //判断是否有超过范围
            if (type == "end") {
                var tableDataList = list;
                // var _rentalType = self.modelData.rentalType || "";
                // var _pointType =  self.modelData.rentalPointType || "";
                // var rentType = "rental-" + _rentalType + "-" + _pointType;
                // if (feeType == null || feeType == "" || feeType == undefined) {
                //     // 目前是租金
                //     if ("fixed" == _rentalType) {
                //         rentType = "rental-fixed";
                //     }
                //     if (rentType == "rental-fixed") {
                //         tableDataList = self.tableData.fixed;
                //     } else if (rentType == "rental-point-static") {
                //         tableDataList = self.tableData.pointstatic;
                //     } else if (rentType == "rental-point-high-static" || rentType == "rental-point-high-pm-static") {
                //         tableDataList = self.tableData.pointhighstatic;
                //     } else if (rentType == "rental-point-ladder") {
                //         tableDataList = self.tableData.pointladder;
                //     } else if (rentType == "rental-point-high-ladder" || rentType == "rental-point-high-pm-ladder") {
                //         tableDataList = self.tableData.pointhighladder;
                //     }
                // } else if (feeType == "management") {
                //     // 物管
                //     tableDataList = self.tableData.managementfixed;
                // } else if (feeType == "lastTurnover") {
                //     // 最低营业额
                //     tableDataList = list;
                // }

                if (tableDataList.length == 0 || (parseInt(yearIndex) + 1 == tableDataList.length && parseInt(peroidIndex) == year.rental_period.length - 1)) {
                    return;
                }

                if (inputDate < new Date(start)) {
                    period.end = "";
                    alert("选择时间不能小于该区间开始时间！");
                    return;
                }
                if ((year.rental_period.length > 1 && peroidIndex == year.rental_period.length - 1) || year.rental_period.length == 1) {
                    period = tableDataList[parseInt(yearIndex) + 1].rental_period[0];
                } else if (year.rental_period.length > 1 && peroidIndex < year.rental_period.length-1){
                    period = year.rental_period[parseInt(peroidIndex) + 1];
                    // period.start = unix_to_date(inputDate.setDate(inputDate.getDate()));
                }
                period.start = unix_to_date(inputDate.setDate(inputDate.getDate() + 1));
                if (period.end !=null && period.end !="" && period.start >= period.end) {
                    period.start = "";
                    tableDataList[parseInt(yearIndex)].rental_period[0].end = "";
                    alert("该区间开始时间不能大于该区间结束时间！");
                    return;
                }
                // $(".js-date-start").trigger("change");
                hasError = true;
                // if (inputDate > rentYearEnd) {
                //     alert("结束时间超过了当前合同年区间结束时间！");
                //     period.end = "";
                //     if (peroidIndex == year.rental_period.length - 1) {
                //         period.end = rentYearEndStr;
                //     }
                //     hasError = true;
                // } else if (inputDate == rentYearEnd && peroidIndex != year.rental_period.length - 1) {
                //     //最后一个区间
                //     alert("该区间结束时间不能等于当前合同年区间结束时间！");
                //     period.end = "";
                //     hasError = true;
                // } else if (inputDate < rentYearEnd && peroidIndex == year.rental_period.length - 1) {
                //     alert("该区间结束时间不能小于当前合同年区间结束时间！");
                //     period.end = rentYearEndStr;
                //     hasError = true;
                // } else if (new Date(start) > new Date(end)) {
                //     alert("该区间结束时间不能小于该区间开始时间！");
                //     period.end = "";
                //     hasError = true;
                // }
            } else {
                if (inputDate < rentYearStart) {
                    alert("该区间结开始时间不能小于当前合同年区间开始时间！");
                    period.start = "";
                    if (peroidIndex == 0) {
                        period.start = rentYearStartStr;
                    }
                    hasError = true;
                } else if (inputDate == rentYearStart && peroidIndex != 0) {
                    //第一个区间
                    alert("该区间开始时间不能等于当前合同年区间开始时间！");
                    period.start = "";
                    hasError = true;
                } else if (inputDate > rentYearStart && peroidIndex == 0) {
                    alert("该区间开始时间不能小于当前合同年区间开始时间！");
                    period.start = rentYearStartStr;
                    hasError = true;
                } else if (new Date(start) > new Date(end)) {
                    alert("该区间开始时间不能大于该区间结束时间！");
                    period.start = "";
                    hasError = true;
                }
            }

            if (hasError) {
                //纠正值的函数  暂时未写
                return;
            }

            if (year.rental_period.length > parseInt(peroidIndex)) {
                if (type == "end") {
                    year.rental_period[parseInt(peroidIndex) + 1].start = unix_to_date(inputDate.setDate(inputDate.getDate() + 1));
                    if(inputDate == "" || inputDate == "NaN"){
                        year.rental_period[parseInt(peroidIndex) + 1].start = undefined;
                    }
                } else {
                    year.rental_period[parseInt(peroidIndex) - 1].end = unix_to_date(inputDate.setDate(inputDate.getDate() - 1));
                    if(inputDate == "" || inputDate == "NaN"){
                        year.rental_period[parseInt(peroidIndex) - 1].end = undefined;
                    }
                }
            } else if (type == "start" && parseInt(peroidIndex) != 0) {
                //选择最后一条区间的 开始时间
                year.rental_period[parseInt(peroidIndex) - 1].end = unix_to_date(inputDate.setDate(inputDate.getDate() - 1));
            }

            console.log(inputDate);
        };


        self.getListIndex = function(object,arr) {
            var _index;
            $.each(arr, function (index, obj) {
                if (angular.equals(object, obj)) {
                    _index = index
                }
            });
            return _index;
        }

        self.getIndex=function(obj,arr){
            var _arrLen=arr.length;
            var _indexArr=_.range(_arrLen);
            var _obj=_.object(_indexArr,arr);
            var _index;
           $.each(_obj,function(k,_item){
               var isEqual=_.isEqual(obj,_item);
               if(isEqual){
                  _index=k;
               }
            });
            return _index;
            //_.isEqual(ojb,)

        };

        self.getListType=function(year,period,category,saleRange, test){
            if ("test" == test) {
                console.log("");
            }
            var type='';

            if(typeof period=='undefined'){
                type="year";
                return;
            }
            var periodIndex=self.getIndex(period,year.rental_period);

            if(typeof category=='undefined'){
                var categoryIndex=0;
            }else{
                var categoryIndex=self.getIndex(category,period.category);
            }

            if(typeof saleRange=='undefined'){
                var rangeIndex=0;
            }else{
                var rangeIndex=self.getIndex(saleRange,category.saleRange);
            }

            if(periodIndex==0 && categoryIndex==0 && rangeIndex==0){
                type="year";
            }else if(periodIndex>0 && categoryIndex==0 && rangeIndex==0){
                type="period"
            }else if(categoryIndex>0 && rangeIndex==0){
                type="category"
            }
            if(rangeIndex>0){
                type="saleRange"
            }

            return type;
        };

        self.setAccountType = function () {
        }

        // 品类选中触发
        self.selectCategoryItem = function (list, obj, index) {
            obj.name = list[index].categoryName;
        }

        self.selectDateTime = function (obj, showProp, hiddenProp, key, value) {
            obj[showProp] = value;
            obj[hiddenProp] = key;
        }

        // 获取其他费用中的保证金
        // dataloadService.postData(netcommentWeb_Path + "netcomment/busicond/getOtherFeeInitData.htm",{},function(resultData){
        //     console.log(resultData);
        //     if (resultData) {
        //         _cbOtherFee(resultData.data);
        //     }
        // });

        self.autocompleteOtherFee = function (list, index) {
            var availableTags = $("body").data("_feeTypeList");
            var mallId = $("#mallId").val();
            var feeCode = "";
            $(".js-account-fee-types").autocomplete({
                source: availableTags,
                minLength: 0,
                select: function (event, ui) {
                    feeCode = ui.item.value;
                    list[index].feeCode = feeCode;
                    console.log(feeCode);
                    this.value = ui.item.label;
                    var tableFeeType = $(event.target).attr("tableFeeType");
                    var data = {feeCode: feeCode, mallId: mallId, tableFeeType: tableFeeType};
                    dataloadService.postData(netcommentWeb_Path + "netcomment/selectFeeInfoByCode.htm", $.param(data), function(resultData) {
                        if (resultData) {
                            list[index].taxRate = resultData.data.tax;
                            $scope.$apply();
                        }
                    });
                    return false;
                }
            });
        }

        // 选择其他费用类型
        self.selectOtherFeeType = function (accountType, accountTypeName, obj) {
            obj.accountType = accountType;
            obj.accountTypeName = accountTypeName;
        }

        // 增加最低营业额
        self.addPeriodItem = function (list, obj, index) {
            var _dataItem = $.extend(true,{},obj);
            var newItem = {};
            // var newItemList = [];
            // self.recursive(_dataItem, newItem, newItemList);
            $.each(_dataItem, function (key, value) {
                if (jQuery.type(value) === "array") {
                    var newItem1 = {};
                    var newItemList = [];
                    $.each(value[0], function (key) {
                        newItem1[key] = null;
                    });
                    newItemList.push(newItem1);
                    newItem[key] = newItemList;
                } else {
                    newItem[key] = null;
                }
            });

            if (list != null && list.length > 0) {
                var upPeriod = obj.rental_period[0];
                newItem.rental_period[0].end = upPeriod.end;
                upPeriod.end = "";
                // list.push(newItem);
                list.splice(index+1, 0, newItem);
            }
        }

        // 遍历递归体
        self.recursive = function (_dataItem, newItem, newItemList) {
            $.each(_dataItem, function (key, value) {
                newItemList = [];
                if (value != null && jQuery.type(value) === "array") {
                    self.recursive(value[0], newItem, newItemList);
                } else {
                    newItem[key] = null;
                    newItemList.push(newItem);
                }
                newItem[key] = newItemList;
            });
            return newItem
        }

        // 删除最低营业额
        self.removePeriodItem = function (list, index) {
            list.splice(index, 1);
        }

        // 增加其他费用
        self.addOtherFee = function (list) {
            var _dataItem=$.extend(true,{},self.otherFeeTableDataDefault[0]);
            if (list == null || list.length == 0) {
                self.tableData.otherFee = angular.copy(self.otherFeeTableDataDefault);
            } else {
                list.push(_dataItem);
            }
        }

        // 删除其他费用
        self.removeOtherFee = function (list, index) {
            list.splice(index, 1);
        }

        // 添加品类
        self.addCategoryPeriodItem = function () {
            var _dataItem=$.extend(true,{},self.categoryTableDataDefault[0]);
            self.tableData.categoryList.push(_dataItem);
        }

        // 删除品类
        self.removeCategoryPeriodItem = function (list, index) {
            $.each(self.tableData.pointstatic, function (m, m_obj) {
                $.each(m_obj.rental_period[0].category, function (n, n_obj) {
                    if (n_obj.name == list[index].categoryName) {
                        n_obj.name = "";
                    }
                });
            });
            list.splice(index, 1);
        }

        // 添加物管区间
        self.addManagementPeriodItem = function (list, index) {
            var _dataItem=$.extend(true,{},self.managementTableDataDefault[0]);
            if (list != null && list.length > 0) {
                var upPeriod = list[index].rental_period[0];
                _dataItem.rental_period[0].end = upPeriod.end;
                upPeriod.end = "";
            }
            list.splice(index+1, 0, _dataItem);
        }

        //删除物管区间(period,year.rental_period)
        self.removeManagementPeriodItem = function(list, index){
            // 判断删除的上一行与下一行开始时间是不是有空的
            if (!list[index + 1].rental_period[0].start && list[index - 1].rental_period[0].end) {
                var endDate = new Date(list[index - 1].rental_period[0].end);
                list[index + 1].rental_period[0].start = unix_to_date(endDate.setDate(endDate.getDate() + 1));
            }
            list.splice(index, 1);
        };

        // 添加租赁区间
        self.addTCPeriodItem = function (list, index) {
            var _dataItem=$.extend(true,{},self.rentalTableDataDist.point_high_ladder[0]);
            if (list != null && list.length > 0) {
                var upPeriod = list[index].rental_period[0];
                _dataItem.rental_period[0].end = upPeriod.end;
                upPeriod.end = "";
            }
            list.splice(index+1, 0, _dataItem);
        }

        //删除租赁区间(period,year.rental_period)
        // self.removePeriodItem = function(list, index){
        //     var _arrLength=list.length;
        //     if(_arrLength > 1) {
        //         var _index = index;
        //         list.splice(_index, 1);
        //         if (year.rental_period.length == 1) {
        //             if (_index == 0) {
        //                 //删除的是 第一个区间
        //                 year.rental_period[0].start = period.start;
        //             } else {
        //                 year.rental_period[0].end = period.end;
        //             }
        //         } else {
        //             if (_index == 0) {
        //                 //删除的是 第一个区间
        //                 year.rental_period[0].start = period.start;
        //             } else if (_index == year.rental_period.length) {
        //                 //删除的是 最后区间
        //                 year.rental_period[year.rental_period.length - 1].end = period.end;
        //             } else {
        //                 //删除中间节点
        //                 year.rental_period[_index].start = period.start;
        //             }
        //         }
        //     }else{
        //         var _dataItem=angular.copy(self.rantalTableDataDefault[0].rental_period);
        //         year.rental_period=_dataItem;
        //     }
        // };

        // //添加租赁区间
        // self.addPeriodItem=function(year){
        //
        //     var _dataItem=$.extend(true,{},self.rantalTableDataDefault[0].rental_period[0]);
        //
        //     //_dataItem.timestamp=new Date().getTime();
        //     if (year.rental_period != null && year.rental_period.length > 0) {
        //         var upPeriod = year.rental_period[year.rental_period.length - 1];
        //         _dataItem.end = upPeriod.end;
        //         year.rental_period[year.rental_period.length - 1].end = "";
        //     }
        //     year.rental_period.push(_dataItem);
        //     //year.rental_period=[].concat(year.rental_period);
        // };
        //
        // //删除租赁区间removePeriodItem(period,year.rental_period)
        // self.removePeriodItem=function(period,year){
        //
        //     var _arrLength=year.rental_period.length;
        //
        //     if(_arrLength>1){
        //         var _index=self.getIndex(period,year.rental_period);
        //         year.rental_period.splice(_index,1);
        //         if (year.rental_period.length == 1) {
        //             if (_index == 0) {
        //                 //删除的是 第一个区间
        //                 year.rental_period[0].start = period.start;
        //             } else {
        //                 year.rental_period[0].end = period.end;
        //             }
        //         } else {
        //             if (_index == 0) {
        //                 //删除的是 第一个区间
        //                 year.rental_period[0].start = period.start;
        //             } else if (_index == year.rental_period.length) {
        //                 //删除的是 最后区间
        //                 year.rental_period[year.rental_period.length - 1].end = period.end;
        //             } else {
        //                 //删除中间节点
        //                 year.rental_period[_index].start = period.start;
        //             }
        //         }
        //
        //     }else{
        //
        //         var _dataItem=angular.copy(self.rantalTableDataDefault[0].rental_period);
        //         year.rental_period=_dataItem;
        //
        //
        //     }
        // };

        //添加品类
        self.addCategoryItem=function(period){
            var _dataItem=$.extend(true,{},self.rantalTableDataDefault[0].rental_period[0].category[0]);
            _dataItem.timestamp=new Date().getTime();
            period.category.push(_dataItem)
        };
        //删除品类
        self.removeCategoryItem=function(category,period){
            var _arrLength= period.category.length;

            if(_arrLength>1){
                var _index=self.getIndex(category,period.category);
                period.category.splice(_index,1);

            }else{

                var _dataItem=angular.copy(self.rantalTableDataDefault[0].rental_period[0].category);
                period.category=_dataItem;
            }
        };


        //添加营业区间
        self.addSaleRangeItem=function(category){
            var _dataItem=$.extend(true,{},self.rantalTableDataDefault[0].rental_period[0].category[0].saleRange[0]);
            _dataItem.timestamp=new Date().getTime();
            category.saleRange.push(_dataItem)
        };
        //删除营业区间
        self.removeSaleRangeItem=function(saleRange,category){
            var _arrLength=category.saleRange.length;

            if(_arrLength>1){
                var _index=self.getIndex(saleRange,category.saleRange);
                category.saleRange.splice(_index,1);

            }else{
                var _dataItem=angular.copy(self.rantalTableDataDefault[0].rental_period[0].category[0].saleRange);

                category.saleRange.splice(0,1,_dataItem);
            }
        };

        //===========================负责租金一套方法 作为推广费的方法
        //添加租赁区间
        self.addMKPeriodItem=function(year){

            var _dataItem=$.extend(true,{},self.marketingTableDataDefault[0].rental_period[0]);

            _dataItem.timestamp=new Date().getTime();

            year.rental_period.push(_dataItem)

        };

        //删除租赁区间removePeriodItem(period,year.rental_period)
        self.removeMKPeriodItem=function(period,year){

            var _arrLength=year.rental_period.length;

            if(_arrLength>1){
                var _index=self.getIndex(period,year.rental_period);
                year.rental_period.splice(_index,1);

            }else{

                var _dataItem=angular.copy(self.marketingTableDataDefault[0].rental_period);
                year.rental_period=_dataItem;

            }
        };

        //添加品类
        self.addMKCategoryItem=function(period){
            var _dataItem=$.extend(true,{},self.marketingTableDataDefault[0].rental_period[0].category[0]);
            _dataItem.timestamp=new Date().getTime();
            period.category.push(_dataItem)
        };
        //删除品类
        self.removeMKCategoryItem=function(category,period){
            var _arrLength= period.category.length;

            if(_arrLength>1){
                var _index=self.getIndex(category,period.category);
                period.category.splice(_index,1);

            }else{

                var _dataItem=angular.copy(self.marketingTableDataDefault[0].rental_period[0].category);
                period.category=_dataItem;
            }
        };


        //添加营业区间
        self.addMKSaleRangeItem=function(category){
            var _dataItem=$.extend(true,{},self.marketingTableDataDefault[0].rental_period[0].category[0].saleRange[0]);
            _dataItem.timestamp=new Date().getTime();
            category.saleRange.push(_dataItem)
        };
        //删除营业区间
        self.removeMKSaleRangeItem=function(saleRange,category){
            var _arrLength=category.saleRange.length;

            if(_arrLength>1){
                var _index=self.getIndex(saleRange,category.saleRange);
                category.saleRange.splice(_index,1);

            }else{
                var _dataItem=angular.copy(self.marketingTableDataDefault[0].rental_period[0].category[0].saleRange);

                category.saleRange.splice(0,1,_dataItem);
            }
        };

        //销售额含税、不含税、净销售额
        self.setSaleTaxType=function(){
            var _saleTaxType=self.saleTaxType;
            if(_saleTaxType!='1'){
                $("#saleTaxRate").attr("disabled",true);
                $("#saleTaxRate").val("");
                $("#saleTaxRate").parent("td").removeClass("required");
            }else {
                $("#saleTaxRate").attr("disabled",false);
                $("#saleTaxRate").parent("td").addClass("required");
            }
        }

        self.calExpenseList = function (tableData, feeType) {
            $.each(tableData, function (index, obj) {
                self.calExpense(obj.rental_period[0], feeType);
            });
        }


        //费用计算
        self.calExpense = function (period, feeType) {
            if (!period.apply) {
                period.noTaxTotalMonth = "";
                period.taxMonth = "";
                period.totalMonth = "";
                return;
            }
            var result=self.calcFixedTable(period.apply,feeType);
            period.noTaxTotalMonth=result.noTaxTotalMonth;
            period.taxMonth=result.taxMonth;
            period.totalMonth=result.totalMonth;
        }

        //费用计算公式
        self.calcFixedTable = function (apply,feeType) {
            var result = {};
            var unitType = "";
            // if (feeType == "02") {
            //     unitType = self.modelData.managementPriceType;
            // }
            //根据计租面积选择类型 获取面积
            var squareType = $("input[name=squareType]").val() == null ? 0 : $("input[name=squareType]").val();
            var square = parseFloat($("#structureSquare").val());
            if ($("#contractSupType").length > 0) {
                square = parseFloat($("#feechangestructureSquare").val());
                if (squareType == '1') {
                    square = parseFloat($("#feechangeinnerSquare").val());
                }
            } else if (squareType == '1') {
                square = parseFloat($("#innerSquare").val());
            }

            if (isNaN(square)) {
                alert("面积数值不符合规范！");
            }


            var taxRate;
            if (isNaN(taxRate)) {
                //默认税率为6%
                if ("01" == feeType) {
                    // 租金
                    taxRate = parseFloat($("#rentTaxRate").val()) || 0;
                } else if ("02" == feeType) {
                    // 物管
                    taxRate = parseFloat($("#managementTaxRate").val()) || 0;
                    unitType = self.modelData.managementPriceType;
                } else if ("07" == feeType) {
                    // 空调服务费
                    taxRate = parseFloat($("#condTaxRate").val()) || 0;
                } else if ("05" == feeType) {
                    // 宣传推广费
                    taxRate = parseFloat($("#proTaxRate").val()) || 0;
                    unitType = 'm';//月付
                } else {
                    taxRate = 17;
                }
            }


            var monthRatio = 365/12;
            var monthApply = 0;
            monthApply = parseFloat(apply) || 0;
            if (unitType == "d") {
                // 日单价
                monthApply = monthApply * monthRatio;
            } else if (unitType == "m") {
                // 月单价
                monthApply = monthApply;
            } else {
                // 月单价
                monthApply = monthApply;
            }
            var totalMonth = monthApply * square;
            var noTaxTotalMonth = taxRate > 0 ? totalMonth / (1 + taxRate / 100) : totalMonth ;
            var taxMonth = 0;
            // 0 含税 1不含税
            var taxType = $(":radio[name$=taxType]:checked:enabled").val();
            switch (taxType){
                case "0":
                    taxMonth = totalMonth - noTaxTotalMonth;
                    break;
                case "1":
                    taxMonth = totalMonth * (taxRate/100);
                    noTaxTotalMonth = totalMonth;
                    totalMonth = noTaxTotalMonth + taxMonth;
                    break;
            }
            // 不含税总额
            result.noTaxTotalMonth = Number(noTaxTotalMonth).toFixed(2);
            // 税额
            result.taxMonth = Number(taxMonth).toFixed(2);
            // 含税总额
            result.totalMonth = Number(totalMonth).toFixed(2);
            return result;
        }


        /*--------------------------rental Table*/

        //=====================设置品类
        var _category={};
        self.tmpCategorySelected=undefined;
        var _cateCB=function(){};
        self.selectCategory=function(category){
            var _type=category.type;
            self.tmpCategorySelected=_type;
            $("#modal-category").modal("show");

            _cateCB=function(){
               category=$.extend(category,_category);
               _category={};

           }
        };
        //modal click
        self.dismissModalCategory=function(){
            $("#modal-category").modal("hide");
            self.tmpCategorySelected=undefined;
        };
        self.setCategory=function(){
            _category.type=self.tmpCategorySelected;
            _category.name=self.categoryList[self.tmpCategorySelected];
            _cateCB();
            self.dismissModalCategory();
        };


        //todo:设置品类初始化的时候带入
        self.categoryList={
            "A":"品类1",
            "B":"品类2",
            "C":"品类3"
        };
        self.setTmpCategory=function(item){
           /* self.tmpCategorySelected=item;*/
           console.log(item);
        };



        //=====================初始化数据
        function _cb(data){
            //租金
            _cbForRent(data);
            //推广费
            _cbForMarketing(data);
            // 物管费
            _cbForManagemnet(data);
            // 最低营业额
            _cbLastTurnover(data);
            // 其他费用
            _cbOtherFee(data);
            // 品类
            _cbCategoryList(data);
            // 装修期
            _cbDecoratePeriod(data);
            // 首期
            _cbFirstPeriod(data);

            console.log(".................");
            $timeout(function(){
                $rootScope.$broadcast("initSwiper");
            },100)

        }

        function _cbDecoratePeriod(data) {
            // 装修期
            self.tableData.decoratePeriod = angular.copy(data.decoratePeriod);
        }

        function _cbFirstPeriod(data) {
            // 首期
            self.tableData.firstPeriod = angular.copy(data.firstPeriod);
        }

        function _cbCategoryList(data) {
            if (data.categoryList.length > 0) {
                self.tableData.categoryList = angular.copy(data.categoryList);
            } else {
                self.tableData.categoryList = angular.copy(self.categoryTableDataDefault);
            }
        }

        function _cbForRent(data){
            var dataRentType = data.rentType;
            $("body").data("_rentInitJsonInfo"+dataRentType, data);

            // self.tableData.fixed=angular.copy(data.rentData);
            // self.tableData.pointstatic=angular.copy(data.rentData);

            if (dataRentType=="rental-fixed") {
                // 固定
                self.tableData.fixed=angular.copy(data.rentData);
            } else if (dataRentType=="rental-point-static") {
                // 提成、固定扣
                if (data.isOldData) {
                    self.tableData.pointstatic=angular.copy(data.rentData);
                } else {
                    self.tableData.pointstatic=angular.copy(data.rentPointData);
                }
                // self.tableData.categoryItem = angular.copy(data.rentData);
            } else if (dataRentType=="rental-point-high-static" || dataRentType=="rental-point-high-pm-static") {
                // 两者取高、含物管两者取高、固定扣
                if (data.isOldData) {
                    self.tableData.fixed=angular.copy(data.rentData);
                    self.tableData.pointstatic=angular.copy(data.rentData);
                } else {
                    self.tableData.fixed=angular.copy(data.rentData);
                    self.tableData.pointstatic=angular.copy(data.rentPointData);
                }
                // self.tableData.pointhighstatic=angular.copy(data.rentData);
            } else if (dataRentType=="rental-point-ladder") {
                // 提成、阶梯扣
                if (data.isOldData) {
                    self.tableData.pointstatic=angular.copy(data.rentData);
                } else {
                    self.tableData.pointstatic=angular.copy(data.rentPointData);
                }
                // self.tableData.pointladder=angular.copy(data.rentData);
            } else if (dataRentType=="rental-point-high-ladder" || dataRentType=="rental-point-high-pm-ladder") {
                // 两者取高、含物管两者取高、阶梯扣
                if (data.isOldData) {
                    self.tableData.fixed=angular.copy(data.rentData);
                    self.tableData.pointstatic=angular.copy(data.rentData);
                } else {
                    self.tableData.fixed=angular.copy(data.rentData);
                    self.tableData.pointstatic=angular.copy(data.rentPointData);
                }
                // self.tableData.pointhighladder=angular.copy(data.rentData);
            }

            //self.tableType=data.type;
        }

        // 生成最低营业额
        function _cbLastTurnover(data) {
            self.tableData.lastTurnover = angular.copy(data.lastTurnover);
        }

        function _cbOtherFee(data) {
            self.tableData.otherFee = angular.copy(data.otherFeeData);
        }

        function _cbForManagemnet(data) {
            self.tableData.managementfixed = angular.copy(data.managementData);
        }

        function _cbForMarketing(data){
            var dataMarketingType = data.marketingType;
            $("body").data("_marketingInitJsonInfo"+dataMarketingType, data);
            if ("static" == dataMarketingType) {
                self.tableData.marketingfixed=angular.copy(data.marketingData);
            } else {
                self.tableData.marketingladder=angular.copy(data.marketingData);
            }

            //self.tableType=data.type;
        }

        function initRentalArea() {

            var _rentalType = self.modelData.rentalType;
            var _rentalPointType = self.modelData.rentalPointType;
            if(_rentalType=="fixed"){
                self.rentalTable="rental-fixed";
                self.rantalTableDataDefault=self.rentalTableDataDist["fixed"];
            }else if(_rentalType=="point"){
                self.rentalTable="rental-" + _rentalType + "-" + _rentalPointType;
                if(_rentalPointType=="static"){
                    self.rantalTableDataDefault=self.rentalTableDataDist["point_static"];
                }else if(_rentalPointType=="ladder"){
                    self.rantalTableDataDefault=self.rentalTableDataDist["point_ladder"];
                }
            }else if(_rentalType=="point-high"|| _rentalType=="point-high-pm"){
                self.rentalTable="rental-" + _rentalType + "-" + _rentalPointType;
                if(_rentalPointType=="static"){
                    self.rantalTableDataDefault=self.rentalTableDataDist["point_high_static"];
                }else if(_rentalPointType=="ladder"){
                    self.rantalTableDataDefault=self.rentalTableDataDist["point_high_ladder"];
                }
            }
        }

        var masterId = $("#masterId").val();
        if ($("#contractSupType").length > 0 && $("#js-search").val()) {
            //用于补充协议 加载数据使用
            dataloadService.getData(netcommentWeb_Path + "netcomment/busicond/getRentalInitDataForSupInit.htm","sup&operationType=sup&id="+masterId+"&contNo="+$("#js-search").val(),function(data){
                console.log(data);
                self.saleTaxType=data.initInfo.saleTaxType;
                _cb(data.data);
                console.log(data.initInfo);
                self.modelData={
                    rentalType:data.initInfo.rentalType,
                    rentalUnitPrice:data.initInfo.rentalUnitPrice,
                    rentalPointType:data.initInfo.rentalPointType,
                    salesTax:data.initInfo.salesTax,
                    marketingPointType:data.initInfo.marketingPointType,
                    rentalUnitPriceWord:data.initInfo.rentalUnitPrice=="m"?"月":"天"
                };
                //self.rentalTable = data.initInfo.rentType;
                initRentalArea();
                self.marketingTable = "point-" + data.initInfo.marketingPointType;
            });
        } else {
            if (masterId == null || masterId == undefined || masterId=="") {
                //新增画面 初始
                dataloadService.getData(netcommentWeb_Path + "netcomment/busicond/getRentalInitData.htm","default",function(data){
                    console.log(data);
                    _cb(data.data);
                });

                // 获取首期的list
                // var _dataItem=$.extend(true,{},self.firstPeriodTableDataDefault[0]);
                // self.tableData.firstPeriod = [];
                // self.tableData.firstPeriod.push(_dataItem);
                // 获取其他费用
                dataloadService.getData(netcommentWeb_Path + "netcomment/selectFeeType.htm",{mallId: ""},function(resultData){
                    console.log(resultData);
                    if (resultData) {
                        var availableTags = resultData.data;
                        console.log(availableTags);
                        $("body").data("_feeTypeList", availableTags);
                    }
                });
                // 品类
                self.tableData.categoryList = angular.copy(self.categoryTableDataDefault);
                // 首期
                self.tableData.firstPeriod = angular.copy(self.firstPeriodTableDataDefault);
                // 装修期
                self.tableData.decoratePeriod = angular.copy(self.decorateTableDataDefault);
                // 其他费用：装修管理费
                // var _dataItem=$.extend(true,{},self.otherFeeTableDataDefault[0]);
                // var _dataList = [];
                // _dataItem.isShow = true;
                // _dataItem.feeName = "装修管理费";
                // _dataList.push(_dataItem);
                // self.tableData.otherFee1 = angular.copy(self.otherFeeTableDataDefault);
            } else {
                //编辑画面 加载数据库数据
                dataloadService.getData(accessUrl + "/netcomment_web/netcomment/busicond/getRentalInitData.htm","edit&id="+masterId,function(data){
                    console.log(data);
                    self.saleTaxType=data.initInfo.saleTaxType;
                    self.decorateIsHave = data.initInfo.decorateIsHave;
                    self.firstPeriodIsHave = data.initInfo.firstPeriodIsHave;
                    _cb(data.data);
                    console.log(data.initInfo);
                    self.modelData={
                        rentalType:data.initInfo.rentalType,
                        rentalUnitPrice:data.initInfo.rentalUnitPrice,
                        rentalPointType:data.initInfo.rentalPointType,
                        salesTax:data.initInfo.salesTax,
                        marketingPointType:data.initInfo.marketingPointType,
                        rentalUnitPriceWord:data.initInfo.rentalUnitPrice=="m"?"月":"天",
                        managementPriceType:data.initInfo.managementPriceType,
                        managementBillingType:data.initInfo.managementBillingType
                    };
                    //self.rentalTable = data.initInfo.rentType;
                    initRentalArea();
                    self.marketingTable = "point-" + data.initInfo.marketingPointType;
                });
            }
        }


        //滚动条 初始化
        $timeout(function(){
            $rootScope.$broadcast("initSwiper");
        },100);

        //=====================初始化数据
       function _init(){
           //页面事件
           //这里暂时先禁掉 table的 tab键
           document.onkeydown = function(){
               var event=arguments.callee.arguments[0]||window.event
               if(event.keyCode == 13|| event.keyCode == 9) {
                   return false;
               }
           };
           $(".table").find("input").attr("tabIndex","-1");
       }
       _init();

}]);

app.service("dataloadService",["$rootScope","$http",function($rootScope,$http) {
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
        postData: function (url, data, cb) {
            if(typeof data==="undefined"){
                search = {};
            }
            return $http.post(url, data, {headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' }}).then(function (res) {
                if(typeof cb!=="undefined"){
                    cb(res.data);
                }else{
                    return res.data;
                }
            },function(errr){
                // location.href=$rootScope.plink;
            });
        }
    };
    return service;
}]);
app.filter("default",function(){
    return function(data,str){
        if(typeof str==="undefined"){
            return data;
        }else{
            if(typeof data==="undefined" || data=="" || data==null){
                return str;
            }
            return data;
        }
    }
});

// app.directive('upload', function () {
//     return {
//         restrict: 'A', //attribute or element
//         scope: {},
//         replace: true,
//         require: 'ngModel',
//         link: function ($scope, elem, attr, ngModel) {
//             $scope.$watch(ngModel, function (nv, ov) {
//                 console.log("**********ngUpdateDom*************" + nv,ov);
//                 elem.val(nv);
//             });
//             elem.bind('input',function () { //bind the change event to hidden input
//                 console.log("**********ngModel.$setViewValue*************" + elem.val());
//                 $scope.$apply(function () {
//                     console.log("**********ngModel.$setViewValue*************" + elem.val());
//                     ngModel.$setViewValue(elem.val());
//                 });
//             });
//         }
//     };
// });

// app.directive('updateSelect',function(){
//     return {
//         restrict:"A",
//         scope:{},
//         require:'ngModel',
//         link:function(scope,elem,attr,ngModel){
//             alert(123);
//             scope.$watch('otherFee.accountType', function (nv) {
//                 alert(2345);
//             });
//         }
//     }
// });

// app.directive('upload', function ($parse) {
//     return {
//         link: function ($scope, iElement, iAttrs, controller) {
//             $(iElement).upload({
//                 success: function(data, self) {
//                     $parse(iAttrs['ngModel']).assign($scope, data);
//                     $scope.$apply();
//                 }
//             });
//         }
//     };
// });

app.directive('ysLeftFixedTable', ["$timeout",
    function($timeout) {
        return {
            restrict: 'A',
            scope: {
                //inputCheck:"&",
            },
            //require:"ngModel",
            transclude:true,
            replace:true,
            template: "<div ng-transclude></div>",
            link: function($scope, $element,attrs,ngModelCtrl) {
                var amp_main_swiper;
                var mainTable=$($element).find(".swiper-container").get(0);

                console.log("swiper init-----------------------")

                // console.log(mainTable)
                function _initSwiper(){
                    amp_main_swiper = new Swiper(mainTable, {
                        scrollbar: '.swiper-scrollbar',
                        direction: 'horizontal',
                        slidesPerView: 'auto',
                        mousewheelControl: false,
                        freeMode: true,
                        scrollbarHide:false,
                        preventClicksPropagation:true
                    });


                    $scope.$on("$destroy", function() {
                        //清除配置
                        amp_main_swiper.destroy(true,true);
                    });
                }

                $scope.$on("initSwiper",function() {
                    _initSwiper();
                    //页面事件
                    //这里暂时先禁掉 table的 tab键
                    document.onkeydown = function(){
                        var event=arguments.callee.arguments[0]||window.event
                        if(event.keyCode == 13||event.keyCode == 9) {
                            return false;
                        }
                    };
                    $(".table").find("input").attr("tabIndex","-1");

                });

                function _eventInit(){
                    $("#js-rental-table-wrapper").on("mouseenter",".zl-add-minus-wrapper",function(e){
                        $(this).closest("th").addClass("hover").prev("td").addClass("hover");
                    });

                    $("#js-rental-table-wrapper").on("mouseleave",".zl-add-minus-wrapper",function(e){
                        $(this).closest("th").removeClass("hover").prev("td").removeClass("hover");
                    });
                }
                _eventInit();


            }//end link
        };
    }]);