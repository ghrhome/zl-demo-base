var pageView=(function($){
    var pageView={};

    pageView.printInit=function(){
        $(".zl-print5").click(function () {
            var detailId = $(this).attr("detailId");
            var url="certificateManagementQuery.htm?detailIds=" + detailId;
            ysPrint.print(url);
        });
        $(".zl-print2").click(function () {
            function _cb(value){

            }
            if(confirm("确认冲销?")){

            }
        });
    }

    pageView.pageInit=function(){

        $(".zl-query-info").click(function () {
            var url="certificateModelSave.htm";
            var inputVal=$(".submit").serializeArray();
            $.post(url,inputVal,function (result) {
                alert(result);
            });
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
                $("#paginateForm").attr("action","certificateModelList.htm").submit();
            },2000);
        });


        $("#gotoPageNum").on("blur", function (e) {
            if (!isPositiveNum($(this).val()) || parseInt($(this).val()) == 0) {
                alert("请输入合法数字！");
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
            $("#paginateForm").attr("action", "certificateModelList.htm").submit();
        });


        $("#querySearch").click(function () {
            pageView.loadingShow();
            setTimeout(function () {
                $("#paginateForm").find("input[name=page]").val(1);
                $("#paginateForm").attr("action","certificateModelList.htm").submit();
            },3000);
        });

    }

    pageView.dropdownInit=function(){

        $(".zl-dropdown").ysdropdown({
        });
    }


    pageView.loadingShow=function(){
        $(".zl-loading").fadeIn();
    };

    pageView.loadingHide=function(){
        $(".zl-loading").fadeOut();
    }

    pageView.init=function(){
        $("#preloader").fadeOut("fast");
        //confirmAlert.init();
        pageView.printInit();
        pageView.pageInit();
        pageView.dropdownInit();
    };

    return pageView;

})(jQuery);


$(document).ready(function(){
    console.log("................")
    pageView.init();
});