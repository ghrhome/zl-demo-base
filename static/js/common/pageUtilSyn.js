(function () {
    //搜索按钮
    $("#searchFormBtn").on("click", function () {
        $("#gotoPageNum").val(0);
        loadData();
    });
    //跳页按钮
    $("#gotoPage").on("click", function () {
        loadData();
    });
    //上一页
    $("#preBtn").on("click", function () {
        curPage = $("#page").val();
        $("#gotoPageNum").val(parseInt(curPage)-1);
        loadData();
    });
    //下一页
    $("#nextBtn").on("click", function () {
        curPage = $("#page").val();
        $("#gotoPageNum").val(parseInt(curPage)+1);
        loadData();
    });

}());
//设置分页数据
function setPageBtn(items,page,pages) {
    $("#pageMsg").html("共"+items+"条记录,当前"+page+"/"+pages+"页");
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
