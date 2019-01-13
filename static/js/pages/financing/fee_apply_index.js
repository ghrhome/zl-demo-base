var pageView=(function($){

    var pageView = {};
    var container = $("#fee_apply_index");

    pageView.init= function(){
        $("#preloader").fadeOut("fast");

        $(".btn-group").ysdropdown({
            callback : function (val, $elem) {
                if($elem.data("id") == "page-limit"){
                    $("input[name=itemsPerPage]").val(val);
                    $("input[name=page]").val(1);
                }
                pageView.search();
            }
        });

        $("button.clear-btn").on("click", function(){
            $("#collapse-search").find("input").val("");
        });

        $(".detail-btn").on("click", function () {
            var id = $(this).attr("data-id");
            if (id) window.location = "detail.htm?id=" + id;
        });
        $(".delete-btn").on("click", function () {
            var id = $(this).attr("data-id");
            if (id) {
                confirm("确认删除？","","", function (type) {
                    if (type == "dismiss") return;
                    pageView.loadingShow();
                    $.ajax({
                        type : 'post',
                        url : financeWeb_Path + 'apply2/delete.htm',
                        data : {id : id},
                        dataType : 'json',
                        error : function () {
                            pageView.loadingHide();
                            alert('系统异常');
                        },
                        success : function (res) {
                            pageView.loadingHide();
                            if (res.code == "0") {
                                alert(res.msg, "", "", function () {
                                    window.location = window.location;
                                });
                            } else {
                                alert(res.msg);
                            }
                        }
                    });
                });
            }
        });

        $(".search-btn").on("click", function () {
            pageView.search();
        });
        //翻页
        $(".zl-paginate").on("click", function (e) {
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
            pageView.search(page);
        });

        //翻页
        $("#gotoPage").on("click", function (e) {
            var page = $("#gotoPageNum").val();
            if (!isPositiveNum(page) || parseInt(page) == 0) {
                alert("请输入合法数字！");
                return false;
            }
            if (parseInt(page) > parseInt($("#pages").val())) {
                page = $("#pages").val();
            }
            pageView.search(page);
        });
        $('.zl-search input').bind('keypress', function (event) {
            if (event.keyCode == "13") {
                pageView.search();
            }
        })
        function isPositiveNum(s) {//是否为正整数
            var re = /^[0-9]*[0-9][0-9]*$/;
            return re.test(s)
        }
    };

    pageView.search = function (page) {
        pageView.loadingShow();
        if (!page) page = 1;
        $("form").find("input[name=page]").val(page);
        $("form").trigger("submit");
    }

    pageView.dateRangeInit=function(){
        $(".zl-datetime-range").find("input").datetimepicker({
            format:"yyyy-mm-dd",
            todayBtn:"linked",
            clearBtn:"linked",
            startView:2,
            minView:2,
            autoclose: true,
            language:"zh-CN",
        }).on('changeDate', function(){
            //pageView.search();
        });
    }
    pageView.loadingShow = function () {
        $(".zl-loading").fadeIn();
    }
    pageView.loadingHide = function () {
        $(".zl-loading").fadeOut();
    }

    return pageView;

})(jQuery);

$(document).ready(function(){
    confirmAlert.init();
    pageView.init();
    pageView.dateRangeInit();
});