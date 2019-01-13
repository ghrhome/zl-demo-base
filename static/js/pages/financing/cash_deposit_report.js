/**
 * Created by whobird on 2018/4/12.
 */
var pageView=(function($){

    var pageView={};
    var container = $("#cash-deposit-report-list");

    pageView.swiperInit=function(){
        new Swiper('.zl-floor-main-table', {
            scrollbar: '.swiper-scrollbar-a',
            slidesPerView: 'auto',
            mousewheelControl: true,
            freeMode: true,
            scrollbarHide:false,
            scrollbarDraggable:true,
            grabCursor:true,
            preventClicksPropagation:false,
            observer:true,
            observeParents:true
        });
    };

    pageView.eventInit=function(){

        container.on("mouseenter",".zl-table-wrapper-swiper tbody tr",function(e){
            var _index=$(this).index();
            $(".zl-table-static").find("tbody tr").eq(_index).addClass('hover');
            $(".swiper-container").find("tbody tr").eq(_index).addClass('hover');
        });
        container.on("mouseleave",".zl-table-wrapper-swiper tbody tr",function(e){
            var _index=$(this).index();
            $(".zl-table-static").find("tbody tr").eq(_index).removeClass('hover');
            $(".swiper-container").find("tbody tr").eq(_index).removeClass('hover');
        });

        container.on('click', "div.zl-dropdown-group ul.dropdown-menu li a", function(){
            var key = $(this).attr("data-value");
            $(this).closest('div.zl-dropdown-group').find("input[type=hidden]").val(key);

            var value = $(this).text();
            $(this).closest('div.zl-dropdown-group').find("button").text(value);

            $("#searchPageForm").find("input[name=page]").val("1");
            $("#searchPageForm").submit();
        });

        container.on('click', "a.search-btn", function(){
            $("#searchPageForm").find("input[name=page]").val("1");
            $("#searchPageForm").submit();
        });

        $("#paginateForm").on("click", ".zl-paginate", function (e) {
            var pageType = $(this).attr("pageType"); // last、next
            var page = parseInt($("#page").val()); // 当前页
            var pages = parseInt($("#pages").val()); // 总页

            if (pageType == "last") {
                page -= 1;
            } else if (pageType == "next") {
                page += 1;
            } else {
                return;
            }

            if (page == 0 || page > pages) { return; }

            $("#searchPageForm").find("input[name=page]").val(page);
            $("#searchPageForm").submit();
        });

        $("#btn-save").on("click", function (e) {

            var page = $("#gotoPageNum").val();
            if (!isPositiveNum(page) || parseInt(page) == 0) {
                alert("请输入合法数字！");
                $("#gotoPageNum").val($("#pages").val());
                return false;
            }
            if (parseInt(page) > parseInt($("#pages").val())) {
                $("#gotoPageNum").val($("#pages").val());
            }

            $("#searchPageForm").find("input[name=page]").val($("#gotoPageNum").val());
            $("#searchPageForm").submit();
        });

    };

    pageView.init=function(){
        $("#preloader").fadeOut("fast");
        pageView.eventInit();
        pageView.swiperInit();
    };

    return pageView;

})(jQuery);


$(document).ready(function(){
    pageView.init();
    confirmAlert.init();
});

function isPositiveNum(s) {//是否为正整数
    var re = /^[0-9]*[0-9][0-9]*$/;
    return re.test(s)
}
