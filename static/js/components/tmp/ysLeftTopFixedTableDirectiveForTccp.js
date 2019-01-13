/**
 * Created by whobird on 17/5/12.
 */
define(["angular","./app.directives","jquery","swiper"],function(angular,directives){

    directives.directive('ysLeftTopFixedTableForTccp', ["$timeout",
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

                        $top.pin({
                            containerSelector: container,
                            padding: {top: 0, bottom: 50}
                        });
                    }

                    $scope.$on("initSwiper",function(){
                        _initSwiper();
                        $top.width($(mainTable.parentNode).width());
                        _bindPageEvent(main_swiper);
                    });

                    $scope.$on("$destroy", function() {
                        //清除配置
                        if(head_swiper){
                            head_swiper.destroy(true,true);
                        }
                        if(main_swiper){
                            main_swiper.destroy(true,true);
                        }
                        //unbind
                        _unbindPageEvent();
                    });

                    //update by zhanghongen 17-11-10
                    $(window).resize(function(){
                        $top.width($(mainTable.parentNode).width());
                    })

                }//end link
            };
        }]);
});

function _bindPageEvent(main_swiper){
    //页面事件
    //这里暂时先禁掉 table的 tab键
    document.onkeydown = function(){
        console.log(event.keyCode);
        if(event.keyCode == 13||event.keyCode == 9) {
            return false;
        }
    };
    $(".zl-table-wrapper-swiper").find("input").attr("tabIndex","-1");

    //页面事件
    $(".zl-table-wrapper-swiper").on("click",function(e){
        // e.stopPropagation();
        if($(e.target).closest("div").hasClass("zl-input-wrapper")){
            return
        }else{
            $(".zl-table-wrapper-swiper .zl-input-wrapper").removeClass("active");
        }
    });

    $(".zl-input-wrapper").on("keydown",function(e){
        if(e.keyCode==9&& e.target.nodeName.toLowerCase()==="input"){
            var $curInput=$(e.target);
            $(e.target).closest(".table-tree-cell").next(".table-tree-cell").find(".zl-input-wrapper").trigger("click");
        }
    });
    $(".zl-input-wrapper").on("click","",function(e){
        e.stopPropagation();
        $cell=$(this).closest(".table-tree-cell");

        var td_width=parseInt($cell.css("width"));
        var td_offset=parseInt($cell.position().left);
        var translate=main_swiper.translate;
        var cont_width=main_swiper.width;

        if(td_offset+td_width+translate>cont_width){
            main_swiper.setWrapperTranslate(translate-180);
        }else{

        }
        $(".zl-table-wrapper-swiper .zl-input-wrapper").removeClass("active");
        $(this).addClass("active");
        $(this).find("input").focus();
    });

}

function _unbindPageEvent( main_swiper){
    $(".zl-table-wrapper-swiper").off("click",".zl-input-wrapper");
    $(".zl-table-wrapper-swiper").off();
    $(".zl-input-wrapper").off();

}