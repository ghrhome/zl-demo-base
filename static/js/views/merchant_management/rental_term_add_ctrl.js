/**
 * Created by whobird on 2018/4/18.
 */

var app=angular.module("app",["appDirective"]);

app.controller("rentalCtrl",["$rootScope","$scope","$timeout","dataloadService",
    function($rootScope,$scope,$timeout,dataloadService){
        var self=this;
        self.categoryList={};
        self.tableData={};
        self.modelData={
            rentalType:"fixed",
            rentalUnitPrice:"日",
            rentalPointType:"static",
            salesTax:"tax",
            marketingPointType:"static"
        };

        self.rentalTableDataDist={
            "fixed":[{
                "year": 1,
                "rental_period":[
                    {
                        "start": "",
                        "end": "",
                        "budget":0,
                        "apply":0,
                        "totalMonth":0,
                        "discountRate":0,
                        "noTaxTotalMonth":0,
                        "taxMonth":0
                    }
                ]
            }],
            "point_static":[{
                "year": 1,
                "budget":0,
                "rental_period":[
                    {
                        "start": "",
                        "end": "",

                        "category":[
                            {
                                "type":"",
                                "name":"",
                                "mFee": 0,
                                "pred_sales":0,
                                "ground_effect":0
                            }
                        ]
                    }
                ]
            }],
            "point_ladder":[{
                "year": 1,
                "budget":0,
                "rental_period":[
                    {
                        "start": "",
                        "end": "",

                        "category":[
                            {
                                "type":"",
                                "name":"",
                                "saleRange":[
                                    {
                                        "start": 0,
                                        "end": 0,
                                        "mFee": 0

                                    }
                                ],
                                "pred_sales":0,
                                "ground_effect":0
                            }
                        ]
                    }
                ]
            }],
            "point_high_static":[{
                "year": 1,
                "budget":0,
                "apply":0,
                "totalMonth":0,
                "discountRate":0,
                "noTaxTotalMonth":0,
                "taxMonth":0,
                "rental_period":[
                    {
                        "start": "",
                        "end": "",

                        "category":[
                            {
                                "type":"",
                                "name":"",
                                "mFee": 0,
                                "pred_sales":0,
                                "ground_effect":0,
                            }
                        ]
                    }
                ]
            }],
            "point_high_ladder":[{
                "year": 1,
                "budget":0,
                "apply":0,
                "totalMonth":0,
                "discountRate":0,
                "noTaxTotalMonth":0,
                "taxMonth":0,
                "rental_period":[
                    {
                        "start": "",
                        "end": "",
                        "category":[
                            {
                                "type":"",
                                "name":"",
                                "saleRange":[
                                    {
                                        "start": 0,
                                        "end": 0,
                                        "mFee": 0

                                    }
                                ],
                                "mFee": 0,
                                "pred_sales":0,
                                "ground_effect":0
                            }
                        ]
                    }
                ]
            }],
            "marketing_static":[{
                "year": 1,
                "budget":0,
                "rental_period":[
                    {
                        "start": "",
                        "end": "",

                        "category":[
                            {
                                "type":"",
                                "name":"",
                                "mFee": 0,
                                "pred_sales":0
                            }
                        ]
                    }
                ]
            }],
            "marketing_point_static":[{
                "year": 1,
                "budget":0,
                "rental_period":[
                    {
                        "start": "",
                        "end": "",

                        "category":[
                            {
                                "type":"",
                                "name":"",
                                "saleRange":[
                                    {
                                        "start": 0,
                                        "end": 0,
                                        "mFee": 0

                                    }
                                ],
                                "pred_sales":0
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
                        "totalMonth":0,
                        "discountRate":0,
                        "noTaxTotalMonth":0,
                        "taxMonth":0
                    }
                ]
            }
        ];
        /*====================set rental Table =====================*/
        self.rentalTable="rental-fixed";

        self.setRentalTable=function(){

            var _rentalType=self.modelData.rentalType;//point-high-pm,point-high,point,fixed
            var _rentalPointType=self.modelData.rentalPointType; //static ladder

            if(_rentalType=="fixed"){
                self.rentalTable="rental-fixed";
            }else if(_rentalType=="point"){

                if(_rentalPointType=="static"){
                    self.rentalTable="rental-point-static";
                }else if(_rentalPointType=="ladder"){
                    self.rentalTable="rental-point-ladder";
                }

            }else if(_rentalType=="point-high"||_rentalType=="point-high-pm"){

                if(_rentalPointType=="static"){
                    self.rentalTable="rental-point-high-static";
                }else if(_rentalPointType=="ladder"){
                    self.rentalTable="rental-point-high-static-pm";
                }

            }

            console.log( self.rentalTable)

            $timeout(function(){
                $rootScope.$broadcast("initSwiper");
            },100)


        };
        /*--------------------------end rental Table*/

        /*====================set marketing Table =====================*/
        self.marketingTable="point-static";

        self.setMarketingTable=function(){

            var _marketingPointType=self.modelData.marketingPointType; //static ladder

            if(_marketingPointType=="static"){
                self.marketingTable="point-static";
            }else if(_marketingPointType=="ladder"){
                self.marketingTable="point-ladder";
            }
        }

        console.log( self.marketingTable)

        /*--------------------------end rental Table*/

        self.dateSelect=function(date,type){

        }

        self.getIndex=function(obj,arr){
            if(typeof obj=='undefined' ||typeof arr=='undefined'){
                return 0;
            }
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
                type="year"
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
        }


        //添加租赁区间
        self.addPeriodItem=function(year){

            var _dataItem=$.extend(true,{},self.rantalTableDataDefault[0].rental_period[0]);

            _dataItem.timestamp=new Date().getTime();

            year.rental_period.push(_dataItem)

        }

        //删除租赁区间removePeriodItem(period,year.rental_period)
        self.removePeriodItem=function(period,year){

            var _arrLength=year.rental_period.length;

            if(_arrLength>1){
                var _index=self.getIndex(period,year.rental_period);
                year.rental_period.splice(_index,1);

            }else{

                var _dataItem=angular.copy(self.rantalTableDataDefault[0].rental_period);
                year.rental_period=_dataItem;


            }
        }


        //添加品类
        self.addCategoryItem=function(period){
            var _dataItem=$.extend(true,{},self.rantalTableDataDefault[0].rental_period[0].category[0]);
            _dataItem.timestamp=new Date().getTime();
            period.category.push(_dataItem)
        }
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
        }


        //添加营业区间
        self.addSaleRangeItem=function(category){
            var _dataItem=$.extend(true,{},self.rantalTableDataDefault[0].rental_period[0].category[0].saleRange[0]);
            _dataItem.timestamp=new Date().getTime();
            category.saleRange.push(_dataItem)
        }
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
        }
        //modal click
        self.dismissModalCategory=function(){
            $("#modal-category").modal("hide");
            self.tmpCategorySelected=undefined;
        }
        self.setCategory=function(){
            _category.type=self.tmpCategorySelected;
            _category.name=self.categoryList[self.tmpCategorySelected];
            _cateCB();
            self.dismissModalCategory();
        }


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
            console.log(data);
            self.tableData=angular.copy(data.data);
            self.tableType=data.type;
        }
        dataloadService.getData("./rental_data.json","",function(data){
            _cb(data);
        });
        //=====================初始化数据
        function _init(){
            //页面事件
            //这里暂时先禁掉 table的 tab键
            document.onkeydown = function(){
                if(event.keyCode == 13||event.keyCode == 9) {
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
                var mainTable=$element.find(".swiper-container").get(0);

                console.log("-----------------------")

                // console.log(mainTable)
                function _initSwiper(){
                    amp_main_swiper = new Swiper(mainTable, {
                        scrollbar: '.swiper-scrollbar',
                        direction: 'horizontal',
                        slidesPerView: 'auto',
                        mousewheelControl: false,
                        freeMode: true,
                        scrollbarHide:false,
                        preventClicksPropagation:true,
                        scrollbarDraggable : true
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