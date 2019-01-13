/*下拉菜单*/
$(".zl-dropdown-inline").ysdropdown({
    callback:function(val,$elem){
    }
});

/*--------------------------------------------添加---------------------------------------------------------------------*/
/*表单提交*/
var dubSumit = 0;
$("#addBsFloorBtn").on("click", function () {
    if (dubSumit > 0) {
        alert("请勿重复提交表单！");
        return false;
    }
    /*if (!valitateForm($('#addBsFloorForm'))) {
        return false;
    }*/

    /*$.ajax({
        cache: true,
        type: "POST",
        url: expensesWeb_Path + "expenses/add.htm",
        data: $('#addBsContRuleForm').serialize(),
        async: false,
        error: function (request) {
            alert("系统异常");
        },
        success: function (resultData) {
            if (typeof resultData != 'undefined' && resultData != null) {
                if (typeof resultData.msg != "undefined") {
                    showMsg(resultData);
                } else {
                    isRe = true;
                }
            }
        }
    });*/

    dubSumit++;
    $.ajax({
        cache: true,
        type: "POST",
        url: expensesWeb_Path + "expenses/add.htm",
        data: $('#addBsContRuleForm').serialize(),
        async: false,
        dataType:"json",
        error: function (request) {
            alert("系统异常");
            dubSumit = 0;
        },
        success: function (resultData) {
            if(resultData){
                window.location.reload();
            }else{
            }
        }
    });
});

/*--------------------------------------------修改---------------------------------------------------------------------*/
$("[name=updateBsFloorBtn]").on("click", function () {
    var id = $(this).attr("id");
        $.ajax({
            cache: true,
            type: "POST",
            url: expensesWeb_Path + "expenses/update.htm?id=" + id,
            data: $('#updateBsFloorForm_' + id).serialize(),
            async: false,
            dataType:"json",
            error: function (request) {
                alert("系统异常");
            },
            success: function (resultData) {
                if(resultData){
                    window.location.reload();
                }else{
                }
            }
        });
});

/*--------------------------------------------删除---------------------------------------------------------------------*/
$("[name=deleteBsFloorBtn]").on("click", function () {
    var id = $(this).attr("id");
    $.ajax({
        cache: true,
        type: "POST",
        url: expensesWeb_Path + "expenses/delete.htm?id=" + id,
        async: false,
        dataType: "json",
        error: function (request) {
            alert("系统异常");
        },
        success: function (resultData) {
            if (resultData) {
                window.location.reload();
            } else {
            }
        }
    });
});

function valitateForm() {
    var periodMode = $('input[name="periodMode"]').val();
    var payCycleMode = $('input[name="payCycleMode"]').val();
    var chargeDateMode = $('input[name="chargeDateMode"]').val();
    var freeMode = $('input[name="freeMode"]').val();
    var firstMonthMode = $('input[name="firstMonthMode"]').val();
    var endMonthMode = $('input[name="endMonthMode"]').val();
    var otherMonthMode = $('input[name="otherMonthMode"]').val();
    var contYearMonthMode = $('input[name="contYearMonthMode"]').val();
    var calcDateMode = $('input[name="calcDateMode"]').val();
    var calcExpression = $('input[name="calcExpression"]').val();

    if (periodMode == "" || periodMode == null) {
        alert("账期模式不能为空！");
        return false;
    }

    if (payCycleMode == "" || payCycleMode == null) {
        alert("支付周期模式不能为空！");
        return false;
    }

    if (chargeDateMode == "" || chargeDateMode == null) {
        alert("生成应收日期模式不能为空！");
        return false;
    }

    if (freeMode == "" || freeMode == null) {
        alert("免租期模式不能为空！");
        return false;
    }

    if (firstMonthMode == "" || firstMonthMode == null) {
        alert("首月单价模式不能为空！");
        return false;
    }

    if (calcDateMode == "" || calcDateMode == null) {
        alert("首月计费模式不能为空！");
        return false;
    }

    if (endMonthMode == "" || endMonthMode == null) {
        alert("尾月计费模式不能为空！");
        return false;
    }

    if (otherMonthMode == "" || otherMonthMode == null) {
        alert("其他月计费模式不能为空！");
        return false;
    }
    if (contYearMonthMode == "" || contYearMonthMode == null) {
        alert("合同月计费模式不能为空！");
        return false;
    }

    if (calcExpression == "" || calcExpression == null) {
        alert("计算表达式不能为空！");
        return false;
    }


    return true;
}

function isPositiveNum(s){
    var re = /^[0-9]*[1-9][0-9]*$/ ;
    return re.test(s)
}

var pageView=(function($){
    var pageView={};


    pageView.pageInit=function(){


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
        confirmAlert.init();
        pageView.pageInit();
        pageView.dropdownInit();
    };
    return pageView;
})(jQuery);