/**
 * Created by whobird on 2018/4/16.
 */

var pageView=(function($){
    var pageView={};

    pageView.eventInit=function(){
        var container = $("#discount_list");

        //下拉
        $(".zl-dropdown").ysdropdown({
            callback:function(val, $elem){
                if ($elem.data("id") == "projects") $("form").find("input[name=mallId]").val(val);
                if ($elem.data("id") == "reduce-status") $("form").find("input[name=status]").val(val);

                if($elem.data("id") == "page-limit"){
                    $("input[name=itemsPerPage]").val(val);
                }

                $("form").find("input[name=page]").val(1);
                $("form").trigger("submit");
            }
        });

        // container.on("click","table tbody tr",function(e){
        //     e.stopPropagation();
        //     e.preventDefault();
        //     var reductionId =$(this).attr("reductionId");
        //     window.location = financeWeb_Path + "finance/reduce/detail.htm?masterId=" + reductionId
        // });

        container.on("click","a.view-update",function(e){
            e.stopPropagation();
            e.preventDefault();
            var href = $(this).attr("data-href");
            window.location = href;
        });
        container.on("click","a.delete-btn",function(e){
            e.stopPropagation();
            e.preventDefault();
            var reductionId = $(this).attr("reductionId");
            confirm("确认删除吗？", "", "", function(type){
                if (type == 'dismiss') return;
                pageView.loadingShow();
                $.ajax({
                    url: 'delete.htm',
                    method: 'post',
                    data: {id : reductionId},
                    dataType: 'json',
                    error: function () {
                        pageView.loadingHide();
                        alert('系统异常');
                    },
                    success: function (res) {
                        pageView.loadingHide();
                        if (res.code == '0') {
                            alert(res.msg, "", "", function () {
                                window.location = window.location;
                            });
                        } else {
                            alert(res.msg);
                        }
                    }
                });
            });
        });
        //搜索
        container.on("click", ".search-btn", function() { $("form").submit(); });
        //提交
        container.on("click", ".submit-btn", function() {
            var areaCode ="G001Z003";
            // var areaCode =$(this).attr("areaCode");
            var reduceId = $(this).attr("data-id");
            $app.workflow.submit("inamp-feewaiver-"+areaCode, reduceId).then(function ($response) {
                window.open($response.data.data);
                // location.href = financeWeb_Path + "finance/reduce/index.htm" ;
                location.href
            })
                // alert("提交到K2")
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
            $("#searchFrom").find("input[name=page]").val(page);
            // $("#_page").val(page);
            $("#searchFrom").submit();
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
            $("#searchFrom").find("input[name=page]").val(page);
            $("#searchFrom").submit();
        });

        function isPositiveNum(s) {//是否为正整数
            var re = /^[0-9]*[0-9][0-9]*$/;
            return re.test(s)
        }

    }

    pageView.dateRangeInit=function(){
        $(".zl-datetime-range").find("input").datetimepicker({
            format:"yyyy-mm-dd",
            todayBtn:"linked",
            startView:2,
            minView:2,
            autoclose: true,
            language:"zh-CN",
            clearBtn:true,
        }).on('changeDate', function(e){
            $("form").find("input[name=page]").val(1);
            $("form").find("input[name=applicationDateStart]").val($(".js-date-start").val());
            $("form").find("input[name=applicationDateEnd]").val($(".js-date-end").val());
            // $("form").submit();
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
        pageView.eventInit();
        pageView.dateRangeInit();

    };
    return pageView;

})(jQuery);


$(document).ready(function(){
    pageView.init();
    confirmAlert.init();
});

