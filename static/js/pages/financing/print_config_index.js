var pageView=(function($){

    var pageView={};

    pageView.init=function() {

        $("#preloader").fadeOut("fast");

        var page = $("#print-config-index");

        page.on("click", "div.btn-group ul li a", function(){
            var _div = $(this).closest("div.btn-group");

            var val = $(this).data("value");
            _div.find("input[type=hidden]").val(val);
            var text = $(this).text();
            _div.find("button").text(text);

            // page.find(".search-btn").click();
        });

        page.on("click",".save-btn", function () {

            var _form = $(this).closest('form');
            if(!fromCheck(_form)){
                return;
            }

            pageView.loadingShow();
            $.ajax({
                url : "save.htm",
                type : "post",
                dataType : "json",
                data : _form.serialize(),
                success : function(res){
                    pageView.loadingHide();
                    if(res && res.code=="0"){
                        page.find("a.search-btn").click();
                    }else{
                        alert(res.msg);
                    }
                },
                //请求失败
                error: function(json){
                    pageView.loadingHide();
                }
            });
        });

        page.on("click",".del-btn", function () {
            var id = $(this).data('id');
            if(!id || id == ""){
                alert("数据异常");
                return;
            }

            confirm("确定要删除吗？", "", "", function(type){

                if (type == "dismiss") {
                    return;
                }

                pageView.loadingShow();
                $.ajax({
                    url : "delete.htm",
                    type : "post",
                    dataType : "json",
                    data : {id : id},
                    success : function(res){
                        pageView.loadingHide();
                        if(res && res.code=="0"){
                            page.find("a.search-btn").click();
                        }else{
                            alert(res.msg);
                        }
                    },
                    //请求失败
                    error: function(json){
                        pageView.loadingHide();
                    }
                });
            });

        });

        //搜索
        page.on("click", ".search-btn", function() {
            $("#searchForm").find("input[name=page]").val(1);
            $("#searchForm").submit();
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
            $("#searchForm").find("input[name=page]").val(page);
            $("#searchForm").trigger("submit");
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
            $("#searchForm").find("input[name=page]").val(page);
            $("#searchForm").trigger("submit");
        });

        $('#gotoPageNum').bind('keypress', function (event) {
            if (event.keyCode == "13") {
                $("#gotoPage").click();
            }
        });

        //回车搜索
        $('.zl-search input').bind('keypress', function (event) {
            if (event.keyCode == "13") {
                $("#searchForm").find("input[name=page]").val(1);
                $("#searchForm").submit();
            }
        });
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



function isPositiveNum(s) {//是否为正整数
    var re = /^[0-9]*[0-9][0-9]*$/;
    return re.test(s)
}

function fromCheck (_form) {

    var flag = true;
    _form.find("div.zl-input-required").each(function(){
        var title = $(this).attr("title") || "必填项";
        var _this;

        if($(this).find("input[type!=hidden]").length > 0){
            _this = $(this).find("input[type!=hidden]");
        }else if($(this).find("div.zl-dropdown-inline").length > 0){
            _this = $(this).find("input[type=hidden]");
        }

        if(_this.val().trim() == ""){
            flag = false;
            alert(title+"不可为空");
            _this.focus();
            return false;
        }

    });

    return flag;
}