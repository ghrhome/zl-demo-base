/**
 * Created by whobird on 2018/4/11.
 */

var pageView=(function($){
    var pageView={};
    var container=$("#energy_consumption_enrolment");

    pageView.dateInit=function(){
        var datepickerDay=$(".js-date-day").find("input").datetimepicker({
            format:"yyyy-mm-dd",
            todayBtn:"linked",
            startView:2,
            minView:2,
            autoclose: true,
            language:"zh-CN",
        }).on('changeDate', function(e){
            //console.log(e)

        });

        var datepickerMonth=$(".js-date-month").find("input").datetimepicker({
            format:"yyyy-mm",
            todayBtn:"linked",
            startView:3,
            minView:3,
            autoclose: true,
            language:"zh-CN",
        }).on('changeDate', function(e){
            //console.log(e)
        });

    };

    pageView.dropdownInit=function(){
        $("#js-eq-type").ysdropdown({
            callback:function(val,$elem){
                //console.log(val);
                if(val==1){
                    location.href="energy_consumption_enrolment_water.html"

                }else if(val==2){
                    location.href="energy_consumption_enrolment_electric.html"
                }
            }
        });
    }
    pageView.init=function(){
        $("#preloader").fadeOut("fast");
        var ys_main_swiper = new Swiper('#zl-floor-main-table', {
            scrollbar: '.swiper-scrollbar-a',
           direction: 'horizontal',
            slidesPerView: 'auto',
            mousewheelControl: true,
            freeMode: true,
            scrollbarHide:false,

            scrollbarDraggable:true,
            preventClicksPropagation:false,

        });
        bindEvent();
        pageView.dateInit();
        pageView.dropdownInit();
    };


    function bindEvent(){
    	container.on("click",".js-link-history",function(e){
    		e.stopPropagation();
        	e.preventDefault();
        	var _targetUrl=$(this).data("href");
        	window.location = _targetUrl;
    	});

        $(".zl-table-wrapper-swiper").on("mouseenter","tbody tr",function(e){
            var _index=$(this).index();

            $(".zl-table-static").find("tbody tr").eq(_index).addClass('hover');
            $(".swiper-container").find("tbody tr").eq(_index).addClass('hover');

            //console.log(_index)
        });

        $(".zl-table-wrapper-swiper").on("mouseleave","tbody tr",function(e){
            var _index=$(this).index();

            $(".zl-table-static").find("tbody tr").eq(_index).removeClass('hover');
            $(".swiper-container").find("tbody tr").eq(_index).removeClass('hover');

            //console.log(_index)
        })

    }
    return pageView;

})(jQuery);


$(document).ready(function(){
    pageView.init();
});