/**
 * Created by whobird on 2018/4/12.
 */
var pageView=(function($){
    var pageView={};

    pageView.eventInit=function(){
        var page = $("#margin-settlement-list");

        //初始化下拉
        $(".zl-dropdown").ysdropdown({
            callback:function(val, $elem){
                if ($elem.data("id") == "projects"){
                    $("#searchPageForm").find("input[name=mallId]").val(val);
                }
                if ($elem.data("id") == "status"){
                    $("#searchPageForm").find("input[name=status]").val(val);
                }
                page.find("a.search-btn").click();
            }
        });

        page.on("click",".zl-table-block tbody tr",function(){
            var settlementId =$(this).attr("settlementId");
            window.location = financeWeb_Path + "cashDeposit/settlement/detail.htm?masterId=" + settlementId
        });


        page.find(".zl-datetimepicker input").datetimepicker({
            language: "zh-CN",
            format:"yyyy-mm",
            todayBtn:"linked",
            startView:3,
            minView:3,
            weekStart: 1,
            autoclose: 1,
            todayHighlight: 1,
            forceParse: 0,
            clearBtn:true
        });


        page.on("click",".zl-datetimepicker",function(e){
            e.stopPropagation();
            e.preventDefault();
            $(this).find("input").datetimepicker("show");
        });


        $("#paginateForm").on("click", ".zl-paginate", function (e) {
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

            $("#searchPageForm").find("input[name=page]").val(page);
            $("#searchPageForm").trigger("submit");
        });

        $("#gotoPageNum").on("blur", function (e) {
            if (!isPositiveNum($(this).val()) || parseInt($(this).val()) == 0) {
                alert("请输入合法数字！");
                $(this).val($("#pages").val());
                return false;
            }
            if (parseInt($(this).val()) > parseInt($("#pages").val())) {
                alert("超过总页数！");
                $(this).val($("#pages").val());
                return false;
            }
        });

        $("#btn-save").on("click", function (e) {
            $("#searchPageForm").find("input[name=page]").val($("#gotoPageNum").val());
            $("#searchPageForm").trigger("submit");
        });

        $(".search-btn").on("click", function (_this) {
            $("#searchPageForm").find("input[name=page]").val(1);
            $("#searchPageForm").trigger("submit");
        });

        //回车搜索
        $('.zl-search input').bind('keypress', function (event) {
            if (event.keyCode == "13") {
                $("#searchPageForm").submit();
            }
        })

        function isPositiveNum(s) {//是否为正整数
            var re = /^[0-9]*[0-9][0-9]*$/;
            return re.test(s)
        }

        page.on("click", "button.clean-btn", function(){
            $("#search_collapse").find("input").val("");
        });

    };

    pageView.init=function(){
        $("#preloader").fadeOut("fast");
        pageView.eventInit();
    };

    return pageView;

})(jQuery);


$(document).ready(function(){
    pageView.init();
    confirmAlert.init();
});
