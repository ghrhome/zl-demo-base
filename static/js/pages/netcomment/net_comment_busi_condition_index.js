var pageView=(function($){
    var pageView={};


    pageView.pageInit=function(){
        $(".js-date-start,.js-date-end").datetimepicker({
            format: "yyyy-mm-dd",
            todayBtn: "linked",
            startView: 2,
            minView: 2,
            autoclose: true,
            language: "zh-CN",
            clearBtn:true
        }).on('changeDate', function (event) {


        }).on('show', function (e) {
            // $(".table-condensed").find(".clear").show();
        });
        //查看明细
        $("tbody tr").on("click", function(){
            var billStatus = $(this).find("td[bill-status]").attr("bill-status");
            if(billStatus == "01" || billStatus == "05" || billStatus == "07"){
                formPost("toEditView.htm", {masterId:$(this).attr("dataId"), billType: "01"});
            } else {
                formPost("toBillDetail.htm", {masterId:$(this).attr("dataId"), billType: "01"});
            }
        });

        //新增
        $("#addButton").on("click", function(){
            formPost("toNewAdd.htm", {billType: "01"});
        });

        $(".zl-query-info").click(function () {
            var url="index.htm";
            var inputVal=$(".submit").serializeArray();
            $.post(url,inputVal,function (result) {
                alert(result);
            });
        });

        $("#bs_cont_list_detail").on("click",".zl-check-btn",function () {
            var _this=$(this);
            $(".zl-check-btn").each(function () {
                $(this).removeClass("active");
            });
            _this.addClass("active");
            $("#searchType").val(_this.attr("dataType"));
            setTimeout(function () {
                $("#paginateForm").find("input[name=page]").val(1);
                $("#paginateForm").attr("action","index.htm").submit();
            },100);
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

            $("#paginateForm").find("input[name=page]").val(page);
            pageView.loadingShow();
            setTimeout(function () {
                $("#paginateForm").attr("action","index.htm").submit();
            },100);
        });

        $("#gotoPageNum").on("blur", function (e) {
            if (!isPositiveNum($(this).val()) || parseInt($(this).val()) == 0) {
                alert("请输入合法数字！");
                $(this).val($("#page").val());
                return false;
            }
            if (parseInt($(this).val()) > parseInt($("#pages").val())) {
                alert("超过总页数！");
                $(this).val($("#pages").val());
                return false;
            }
        });

        $("#gotoPage").on("click", function (e) {
            $("#paginateForm").find("input[name=page]").val($("#gotoPageNum").val());
            $("#paginateForm").attr("action", "index.htm").submit();
        });


        $("#querySearch").click(function () {
            pageView.loadingShow();
            setTimeout(function () {
                $("#paginateForm").find("input[name=page]").val(1);
                $("#paginateForm").attr("action","index.htm").submit();
            },100);
        });

        $(".dropdown-menu>li>a").on("click", function (e) {//下拉选项
            $(this).closest("div").find("button").html($(this).html())
            $(this).closest("div").find("input").val($(this).attr("key"))
            $("#page").val(1)
            $('#querySearch').trigger('click')
        });
    };

    pageView.dropdownInit=function(){

        $(".zl-dropdown").ysdropdown({
        });
    };

    pageView.loadingShow=function(){
        $(".zl-loading").fadeIn();
    };

    pageView.loadingHide=function(){
        $(".zl-loading").fadeOut();
    };

    pageView.init=function(){
        $("#preloader").fadeOut("fast");
        // confirmAlert.init();
        pageView.pageInit();
        pageView.dropdownInit();
    };
    return pageView;
})(jQuery);


$(document).ready(function(){
    console.log("................")
    pageView.init();
});