/**
 * Created by whobird on 2018/4/18.
 */

var app=angular.module("app",["appDirective"]);

app.controller("rentalCtrl",["$rootScope","$scope","$timeout","dataloadService",
    function($rootScope,$scope,$timeout,dataloadService){
        var self=this;
        self.categoryListo={};
        self.tableData={};
        self.modelData={
            rentalType:"fixed",
            rentalUnitPrice:"m",
            rentalPointType:"static",
            salesTax:"tax",
            marketingPointType:"static",
            rentalUnitPriceWord:"月"
        };
        self.saleTaxType='0';
        console.log("-----------------++------------"+self.modelData.saleTaxType);
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
        self.rentalTableDataDist={
            "fixed":[{
                "year": 1,
                "rental_period":[
                    {
                        "start": "",
                        "end": "",
                        "budget":0,
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
                        "budget":0,
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
                        "budget":0,
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
                        "budget":0,
                        "apply":0,
                        "totalMonth":"",
                        "discountRate":"",
                        "noTaxTotalMonth":"",
                        "taxTotalMonth":"",
                        "rentUnitPrice":"",
                        "category":[
                            {
                                "type":"",
                                "name":"",
                                "mFee": 0,
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
                        "budget":0,
                        "apply":0,
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
                                        "mFee": 0,
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
                        "budget":0,
                        "apply":0,
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
                        "budget":0,
                        "category":[
                            {
                                "type":"",
                                "name":"",
                                "mFee": 0,
                                "pred_sales":""
                            }
                        ]
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
                        "budget":0,
                        "apply":0,
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
                        "budget":0,
                        "apply":0,
                        "totalMonth":"",
                        "discountRate":"",
                        "noTaxTotalMonth":"",
                        "taxMonth":""
                    }
                ]
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

        self.dateSelect=function(date,type,year,yearIndex,peroidIndex){
            console.log(type);
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

            var rentYearEnd = new Date(contractBeginDateStr);
            rentYearEnd = new Date(rentYearEnd.setFullYear(rentYearEnd.getFullYear() + parseInt(yearIndex) + 1));
            rentYearEnd = rentYearEnd.setDate(rentYearEnd.getDate() - 1);
            if (contractEndDate < rentYearEnd) {
                rentYearEnd = contractEndDate;
            }
            var rentYearEndStr = unix_to_date(rentYearEnd);

            var inputDate = new Date(date);
            //判断是否有超过范围
            if (type == "end") {
                if (inputDate > rentYearEnd) {
                    alert("结束时间超过了当前合同年区间结束时间！");
                    period.end = "";
                    if (peroidIndex == year.rental_period.length - 1) {
                        period.end = rentYearEndStr;
                    }
                    hasError = true;
                } else if (inputDate == rentYearEnd && peroidIndex != year.rental_period.length - 1) {
                    //最后一个区间
                    alert("该区间结束时间不能等于当前合同年区间结束时间！");
                    period.end = "";
                    hasError = true;
                } else if (inputDate < rentYearEnd && peroidIndex == year.rental_period.length - 1) {
                    alert("该区间结束时间不能小于当前合同年区间结束时间！");
                    period.end = rentYearEndStr;
                    hasError = true;
                } else if (new Date(start) > new Date(end)) {
                    alert("该区间结束时间不能小于该区间开始时间！");
                    period.end = "";
                    hasError = true;
                }
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

        self.getListType=function(year,period,category,saleRange){
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


        //添加租赁区间
        self.addPeriodItem=function(year){

            var _dataItem=$.extend(true,{},self.rantalTableDataDefault[0].rental_period[0]);

            //_dataItem.timestamp=new Date().getTime();
            if (year.rental_period != null && year.rental_period.length > 0) {
                var upPeriod = year.rental_period[year.rental_period.length - 1];
                _dataItem.end = upPeriod.end;
                year.rental_period[year.rental_period.length - 1].end = "";
            }
            year.rental_period.push(_dataItem);
            //year.rental_period=[].concat(year.rental_period);
        };

        //删除租赁区间removePeriodItem(period,year.rental_period)
        self.removePeriodItem=function(period,year){

            var _arrLength=year.rental_period.length;

            if(_arrLength>1){
                var _index=self.getIndex(period,year.rental_period);
                year.rental_period.splice(_index,1);
                if (year.rental_period.length == 1) {
                    if (_index == 0) {
                        //删除的是 第一个区间
                        year.rental_period[0].start = period.start;
                    } else {
                        year.rental_period[0].end = period.end;
                    }
                } else {
                    if (_index == 0) {
                        //删除的是 第一个区间
                        year.rental_period[0].start = period.start;
                    } else if (_index == year.rental_period.length) {
                        //删除的是 最后区间
                        year.rental_period[year.rental_period.length - 1].end = period.end;
                    } else {
                        //删除中间节点
                        year.rental_period[_index].start = period.start;
                    }
                }

            }else{

                var _dataItem=angular.copy(self.rantalTableDataDefault[0].rental_period);
                year.rental_period=_dataItem;


            }
        };

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

        //推广费的计算
        self.calPromotionExpense=function (period) {

            console.log("=======================");
            console.log(period);
            console.log(period.apply);
            var result=self.calcFixedTable(period.apply,'05');
            period.noTaxTotalMonth=result.noTaxTotalMonth;
            period.taxMonth=result.taxMonth;
            period.totalMonth=result.totalMonth;
        }

        //推广费计算公式
        self.calcFixedTable = function (apply,feeType) {
            var result = {};
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
            var taxRate = $("#proTaxRate").val();
            var unitType = "";
            var monthRatio = 30.41667;
            var monthApply = 0;
            monthApply = parseFloat(apply) || 0;
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
            result.noTaxTotalMonth = Number(noTaxTotalMonth).toFixed(2);
            result.taxMonth = Number(taxMonth).toFixed(2);
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

            console.log(".................");
            $timeout(function(){
                $rootScope.$broadcast("initSwiper");
            },100)

        }

        function _cbForRent(data){
            var dataRentType = data.rentType;
            $("body").data("_rentInitJsonInfo"+dataRentType, data);
            console.log("********** supRent start ************");
            console.log(data.rentData);
            console.log("********** supRent end ************");
            if (dataRentType=="rental-fixed") {
                self.tableData.fixed=angular.copy(data.rentData);
            } else if (dataRentType=="rental-point-static") {
                self.tableData.pointstatic=angular.copy(data.rentData);
            } else if (dataRentType=="rental-point-high-static" || dataRentType=="rental-point-high-pm-static") {
                self.tableData.pointhighstatic=angular.copy(data.rentData);
            } else if (dataRentType=="rental-point-ladder") {
                self.tableData.pointladder=angular.copy(data.rentData);
            } else if (dataRentType=="rental-point-high-ladder" || dataRentType=="rental-point-high-pm-ladder") {
                self.tableData.pointhighladder=angular.copy(data.rentData);
            }

            //self.tableType=data.type;
        }

        function _cbForMarketing(data){
            var dataMarketingType = data.marketingType;
            $("body").data("_marketingInitJsonInfo"+dataMarketingType, data);
            console.log("********** sup start ************");
            console.log(data.marketingData);
            console.log("********** sup end ************");
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
                self.saleTaxType=data.data.saleTaxType;
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
            } else {
                //编辑画面 加载数据库数据
                dataloadService.getData(accessUrl + "/netcomment_web/netcomment/busicond/getRentalInitData.htm","edit&id="+masterId,function(data){
                    console.log(data);
                    self.saleTaxType=data.data.saleTaxType;
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