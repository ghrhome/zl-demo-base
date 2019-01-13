var pageView=(function($){
    var pageView={};

    function formPost(url, params, target){
        var temp = document.createElement("form");
        temp.enctype = "multipart/form-data";
        temp.action = url;
        temp.method = "post";
        temp.style.display = "none";

        if(target){
            temp.target = target;
        }else{
            // showLoading();
        }

        for (var x in params) {
            var opt = document.createElement("input");
            opt.name = x;
            opt.value = params[x];
            temp.appendChild(opt);
        }
        document.body.appendChild(temp);

        temp.submit();
    }

    pageView.printInit=function(){
    }

    pageView.pageInit=function(){

        // 查询
        $("#querySearch").click(function () {
            pageView.loadingShow();
            setTimeout(function () {
                $("#paginateForm").find("input[name=page]").val(1);
                $("#paginateForm").attr("action","index.htm").submit();
            },100);
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

        $("#querySearch").click(function () {
            var url="index.htm";
            var inputVal=$(".submit").serializeArray();
            $.post(url,inputVal,function (result) {

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
                $("#paginateForm").attr("action","index.htm").submit();
            },100);
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
            $("#paginateForm").attr("action", "index.htm").submit();
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

	$("tbody tr").on("click", function(){
	    formPost("detail.htm", {id:$(this).attr("dataId"),contNo:$(this).attr("contNo") });
	});
	function formPost(url, params, target){
    var temp = document.createElement("form");
    temp.enctype = "multipart/form-data";
    temp.action = url;
    temp.method = "post";
    temp.style.display = "none";

    if(target){
        temp.target = target;
    }else{
        // showLoading();
    }

    for (var x in params) {
        var opt = document.createElement("input");
        opt.name = x;
        opt.value = params[x];
        temp.appendChild(opt);
    }
    document.body.appendChild(temp);

    temp.submit();
}