/**
 * Created by whobird on 17/5/12.
 */
define(["angular","./app.directives","jquery","swiper"],function(angular, directives){

    directives.directive('ysLeftFixedTable', ["$timeout",
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
                            if(event.keyCode == 13||event.keyCode == 9) {
                                return false;
                            }
                        };
                        $(".table").find("input").attr("tabIndex","-1");

                    });


                }//end link
            };
        }]);
});