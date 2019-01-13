/**
 * Created by whobird on 17/11/21.
 */
define(["angular",'./budget.app'],function(angular,viewModule){
    viewModule.controller("budgetCtrl",["$rootScope","$scope","$timeout","dataPreloadService","dataSaveService",
        function($rootScope,$scope,$timeout,dataPreloadService,dataSaveService){
            var self=this;

            self.editMod=false;
            self.monthArr=["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
            self.dropdownMenu={
                "budgetMod":{}
            }

            self.tableData_ori=[];
            self.bcList=[];

            //modified data;
            //self.sumData=[];
            self.tableData=[];

            self.modifiedData={
                project:"",
                year:"", //location.href中取
                data:{}
            }

            self.setBidMode=function(monthData,$index){
                self.setModified(monthData,$index);
            }

            self.edit=function($event){
                $event.preventDefault();
                self.editMod=true;
            };

            self.cancel=function($event){
                $event.preventDefault();
                self.tableData=angular.copy(self.tableData_ori);
                self.modifiedData.data={};
                self.editMod=false;
            };

            function _saveCB(){
                self.tableData_ori=angular.copy(self.tableData);
                self.modifiedData.data={};
                self.editMod=false;
            }
            self.save=function($event){
                $event.preventDefault();
                //ajax here
                dataSaveService.saveData("test.html",self.modifiedData,_saveCB,"json");
                //成功回调
            };



            self.getMonthlyCount=function($index){
                var _sum=0;

                $.each(self.tableData,function(i,e){
                    var _v=e.data[$index].value;
                    _sum+=_v;
                })

                return _sum;
            };

            self.setModified=function(item,$index){
                var _data=self.modifiedData.data;
                var _shopId=item.shopId;
                if(_data[_shopId]){
                    _data[_shopId][$index]=item;
                }else{
                    _data[_shopId]={};
                    _data[_shopId][$index]=item;
                }
            }

            function _init(data){

                self.bcList=angular.copy(data.bcList);
                self.dropdownMenu.budgetMod=angular.copy(data.menuData.budgetTypes);
                //self.sumData=angular.copy(data.sum);
                self.tableData=angular.copy(data.tableData);
                self.tableData_ori=angular.copy(data.tableData);

                self.modifiedData.year=data.year;
                self.modifiedData.project=data.project;

                $rootScope.$broadcast("initSwiper");

                $("#preloader").fadeOut(300);
            }
            dataPreloadService.getData("../../static/angular_sample/data/initdata.json","",_init);

            /*loading part*/
            self.loadingShow=false;

            $rootScope.loading_show=function(){
                self.loadingShow=true;
            };
            $rootScope.loading_hide=function(){
                self.loadingShow=false;
            };

            $scope.$on("loadingShow",function(){
                $rootScope.loading_show();
            });
            $scope.$on("loadingHide",function(){
                $rootScope.loading_hide();
            });

        }]);
});

