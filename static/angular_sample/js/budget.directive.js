/**
 * Created by whobird on 17/11/21.
 */
var directives= angular.module("app.directives",[]);

directives.directive('ysLeftTopFixedTable', ["$timeout",
    function($timeout) {
        return {
            restrict: 'A',
            scope: {
                //inputCheck:"&",
                onSetTranslate: '&'
            },
            //require:"ngModel",
            transclude:true,
            replace:true,
            template: "<div ng-transclude></div>",
            link: function($scope, $element,attrs,ngModelCtrl) {
                var pin,main_swiper,head_swiper;
                var $top=$element.find(".zl-table-fixed-top");
                var container=$element.get(0);
                var topTable=$element.find(".zl-table-fixed-top .swiper-container").get(0);
                var mainTable=$element.find(".zl-table-main .swiper-container").get(0);

                function _initSwiper(){
                    head_swiper = new Swiper(topTable, {
                        //scrollbar: '.swiper-scrollbar',
                        direction: 'horizontal',
                        slidesPerView: 'auto',
                        //mousewheelControl: true,
                        freeMode: true,
                        scrollbarHide:true,
                        preventClicksPropagation:true
                    });
                    main_swiper = new Swiper(mainTable, {
                        scrollbar: '.swiper-scrollbar',
                        direction: 'horizontal',
                        slidesPerView: 'auto',
                        //mousewheelControl: true,
                        freeMode: true,
                        scrollbarHide:false,
                        preventClicksPropagation:true

                    });

                    head_swiper.params.control = main_swiper;
                    main_swiper.params.control = head_swiper;

                    pin=$top.pin({
                        containerSelector: container,
                        padding: {top: 0, bottom: 50}
                    });
                }

                $scope.$on("initSwiper",function(){
                    _initSwiper();

                    $top.width($(mainTable.parentNode).width());
                    //页面事件
                    //这里暂时先禁掉 table的 tab键
                    document.onkeydown = function(){
                        if(event.keyCode == 13||event.keyCode == 9) {
                            return false;
                        }
                    };
                    $(".table").find("input").attr("tabIndex","-1");

                    //update by cheng
                   /* var defer=null;
                    function _swiperUpdate(){
                        $top.width($(mainTable.parentNode).width());
                        pin.refresh();
                    };

                    $(window).resize(function(){
                        if(!defer){
                            defer=setTimeout(function(){
                                _swiperUpdate();
                                defer=null;
                            },200);
                        }else{
                            clearTimeout(defer);
                            defer=setTimeout(function(){
                                _swiperUpdate();
                                defer=null;
                            },200);
                        }

                    });
                    */
                });

                $scope.$on("$destroy", function() {
                    //清除配置
                    if(head_swiper){
                        head_swiper.destroy(true,true);
                    }
                    if(main_swiper){
                        main_swiper.destroy(true,true);
                    }

                });



                //update 17-11-10
                $(window).resize(function(){
                    $top.width($(mainTable.parentNode).width());
                })

            }//end link
        };
    }]);


directives.directive('menuDropdown', [
    function() {
        return {
            restrict: 'A',
            scope: {
                itemSelect:"&",
                index:"@"
            },
            require:"ngModel",
            transclude:true,
            template: '<div ng-transclude></div>',
            link: function($scope, $element,attrs,ngModelCtrl) {
                $element.on("click","a",function(){
                    var item=$(this).data("item");
                    ngModelCtrl.$setViewValue(item);
                    if($scope.itemSelect){
                       // $scope.itemSelect({item:item});
                        $scope.itemSelect();
                    }
                });
                $scope.$on("$destroy", function() {
                    //清除配置
                    //console.log("destroy");
                    // $("body").off("click","li.zl-tree-item");
                });
            }//end link
        };
    }]);