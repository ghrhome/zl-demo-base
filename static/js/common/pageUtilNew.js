(function () {
    //搜索按钮
    $("#searchFormBtn").on("click", function () {
        $("#gotoPageNum").val(0);
        pageView.loadData();
    });
    //跳页按钮
    $("#gotoPage").on("click", function () {
        pageView.loadData();
    });
    //上一页
    $("#preBtn").on("click", function () {
        curPage = $("#page").val();
        $("#gotoPageNum").val(parseInt(curPage)-1);
        pageView.loadData();
    });
    //下一页
    $("#nextBtn").on("click", function () {
        curPage = $("#page").val();
        $("#gotoPageNum").val(parseInt(curPage)+1);
        pageView.loadData();
    });
    $("#gotoPageNum").on("blur", function () {
        var cPage = $("#page").val();
        if (!isPositiveNum($(this).val()) || parseInt($(this).val()) == 0) {
            alert("请输入合法数字！");
            $(this).val(cPage);
            return false;
        }
        if (parseInt($(this).val()) > parseInt($(".page-all").html())) {
            alert("超过总页数！");
            $(this).val(cPage);
            return false;
        }
        loadData();
    });

}());
//设置分页数据
function setPageBtn(items,page,pages) {
    $(".page-records").html(items);
    $(".page-index").html(page);
    $(".page-all").html(pages);
    $("#gotoPageNum").val(page);
    $("#page").val(page);
    if(page<= 1){
        $("#preBtn").addClass("zl-btn-disable");
        $("#preBtn").attr("disabled","disabled");
    }else{
        $("#preBtn").removeClass("zl-btn-disable");
        $("#preBtn").removeAttr("disabled");
    }
    if(page >= pages){
        $("#nextBtn").addClass("zl-btn-disable");
        $("#nextBtn").attr("disabled","disabled");
    }else{
        $("#nextBtn").removeClass("zl-btn-disable");
        $("#nextBtn").removeAttr("disabled");
    }

}
//获取表单参数
function getParam(formId){
    var entity = $("#"+formId).toJson(true);
    return $.isEmptyObject(entity)?null:entity;
}

function isPositiveNum(s) {//是否为正整数
    var re = /^[0-9]*[0-9][0-9]*$/;
    return re.test(s)
}

function keyOnClick() {
    var theEvent = window.event || e;
    var code = theEvent.keyCode || theEvent.which;
    if (code==13) {  //回车键的键值为13
        pageView.loadData();
    }
}