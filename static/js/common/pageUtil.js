(function () {
    //填写页码
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
    $(".zl-pagination-toolbar").on("click",".zl-paginate",function(e){
        var pageType = $(this).attr("pageType"); // last、next
        var page = parseInt($("#page").val()); // 当前页
        var pages = parseInt($("#pages").val()); // 总页
        var formId = $(this).attr("formId");
        if(pageType == "last"){
            page -= 1;
        }
        else if(pageType == "next"){
            page += 1;
        }
        else{
            return;
        }
        if(page < 1){
            page = 1;
        }
        if(page > pages){
            page = pages;
        }
        $("#page").val(page);
        selectInfo(formId,'');
    });
}());
//提交表单
function selectInfo(formId,isGopage){
    //如果是翻页按钮，需要带上当前页搜索，否则搜索第一页
    if("goto"==isGopage)
        $("#page").val($("#gotoPageNum").val());
    else if("serch"==isGopage)
        $("#page").val(1);
    //提交到后台
    $("#"+formId).submit();
    return false;
}