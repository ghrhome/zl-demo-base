

var pageView = (function($){
    var pageView = {};
    pageView.init = function(){
        $("#preloader").fadeOut("fast");

        var page = $("#certificate-source");

        var ys_main_swiper = new Swiper('#zl-floor-main-table', {
            scrollbar: '.swiper-scrollbar-a',
            slidesPerView: 'auto',
            freeMode: true,
            scrollbarHide:false
        });

        //翻页
        page.on("click", ".zl-paginate", function (e) {
            var pageType = $(this).attr("pageType"); // last、next
            var page = parseInt($("#page").val()); // 当前页
            var pages = parseInt($("#pages").val()); // 总页

            if (pageType == "last") {
                page -= 1;
            }
            else if (pageType == "next") {
                page += 1;
            }
            else {
                return;
            }
            if (page == 0 || page > pages) {
                return;
            }
            search(page);
        });

        //翻页
        page.on("click", "#gotoPage", function (e) {
            var page = $("#gotoPageNum").val();
            if (!isPositiveNum(page) || parseInt(page) == 0) {
                alert("请输入合法数字！");
                return false;
            }
            if (parseInt(page) > parseInt($("#pages").val())) {
                page = $("#pages").val();
            }
            $("form").find("input[name=page]").val(page);
            $("form").trigger("submit");
        });

        $('#gotoPageNum').bind('keypress', function (event) {
            if (event.keyCode == "13") {
                $("#gotoPage").click();
            }
        });

        //下拉
        $(".zl-dropdown").ysdropdown({
            callback:function(val, $elem){
                if ($elem.data("id") == "page-limit") {
                    $("form").find("input[name=itemsPerPage]").val(val);
                }
                search();
            }
        });
        function isPositiveNum(s) {//是否为正整数
            var re = /^[0-9]*[0-9][0-9]*$/;
            return re.test(s)
        }

        function search(page) {
            pageView.loadingShow();
            if (!page) page = 1;
            $("form").find("input[name=page]").val(page);
            //$("form").find("input[name^=bootstrapDropdown]").remove();
            $("form").trigger("submit");
        }
    };
    pageView.ysDateInit=function(){
        $("#js-month-picker").ysDatepicker({
            dateType:"year",//year,day
            callback:function(value){
                console.log("======================")
                console.log(value);
            }
        })
    };

    pageView.loadingShow=function(){
        $(".zl-loading").fadeIn();
    };

    pageView.loadingHide=function(){
        $(".zl-loading").fadeOut();
    };

    return pageView;

})(jQuery);


$(document).ready(function(){
    confirmAlert.init();
    pageView.init();
});