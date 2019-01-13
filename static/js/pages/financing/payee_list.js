/**
 * 收款单位
 */
var pageView=(function($){
    var pageView={};
    var page = $("#payee-unit-index");
    
    pageView.init=function(){

        page.on("click", ".zl-dropdown ul.dropdown-menu li a", function(){

            var _div = $(this).closest("div.zl-dropdown");

            var text = $(this).text();
            _div.find("button").text(text);
            var val = $(this).data("value");
            _div.find("input[type=hidden]").val(val);

            page.find(".search-btn").click();
        });

        //搜索
        page.on("click", ".search-btn", function() {
            $("form").find("input[name=page]").val(1);
            $("form").submit();
        });

        //到明细页
        page.on("click", ".zl-linkable", function () {
            var mallId = $(this).data("id");
            if (mallId && parseInt(mallId))
                pageView.loadingShow();
                window.location = financeWeb_Path + "payeeUnit2/toDetail.htm?mallId=" + mallId;
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
            $("form").find("input[name=page]").val(page);
            $("form").trigger("submit");
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
                $("#gotoPageNum").val(page);
            }
            $("form").find("input[name=page]").val(page);
            $("form").trigger("submit");
        });

        $('#gotoPageNum').bind('keypress', function (event) {
            if (event.keyCode == "13") {
                $("#gotoPage").click();
            }
        });

        //回车搜索
        $('.zl-search input').bind('keypress', function (event) {
            if (event.keyCode == "13") {
                $("form").find("input[name=page]").val(1);
                $("form").trigger("submit");
            }
        });
        function isPositiveNum(s) {//是否为正整数
            var re = /^[0-9]*[0-9][0-9]*$/;
            return re.test(s)
        }
    };

    pageView.loadingShow=function(){
        $(".zl-loading").fadeIn();
    };

    pageView.loadingHide=function(){
        $(".zl-loading").fadeOut();
    }

    return pageView;

})(jQuery);


$(document).ready(function(){
    $("#preloader").fadeOut("fast");
    confirmAlert.init();
    pageView.init();
});