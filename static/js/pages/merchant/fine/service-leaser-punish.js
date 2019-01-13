$(document).ready(function(){
    $(".zl-datetime-range").find("input").datetimepicker({
        format:"yyyy-mm-dd",
        todayBtn:"linked",
        startView:2,
        minView:2,
        autoclose: true,
        language:"zh-CN",
        clearBtn:true,
    }).on('changeDate', function(e){
        // $("form").submit();
    });

    $("#js-search-main").on("click",function () {
        $("#search").submit();
    });

    //翻页
    $(".zl-paginate").on("click", function (e) {
        var pageType = $(this).attr("pageType"); // last、next
        var page = parseInt($("#page").val()); // 当前页
        var pages = parseInt($("#pages").val()); // 总页
        var itemsPerPage = parseInt($("#itemsPerPage").val()); // 总页

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
        $("#search").find("input[name=page]").val(page);
        $("#search").find("input[name=itemsPerPage]").val(itemsPerPage);
        // $("#page").val(page);
        $("#search").submit();
    });
    //翻页
    $("#gotoPage").on("click", function (e) {
        var page = $("#gotoPageNum").val();
        var itemsPerPage = $("#itemsPerPage").val();
        if (!isPositiveNum(page) || parseInt(page) == 0) {
            alert("请输入合法数字！");
            return false;
        }
        if (parseInt(page) > parseInt($("#pages").val())) {
            page = $("#pages").val();
        }
        $("#search").find("input[name=page]").val(page);
        $("#search").find("input[name=itemsPerPage]").val(itemsPerPage);
        $("#search").submit();
    });

    //应收打印初始化下拉
    $(".zl-dropdown").ysdropdown({
        callback:function(val, $elem){
            if ($elem.data("id") == "page-limit"){
                $("#search").find("input[name=page]").val(1);
                $("#search").find("input[name=itemsPerPage]").val(val);
            }
            $("#search").submit();
        }
    });

})

function updateFine(e,id,status,msg) {
    e.stopPropagation();
    if(id==""||id==undefined||status==""||status==undefined){
        alert(msg+"失败");
    }
    // if(confirm("确认要"+msg+"吗？")){
    confirm("确认要"+msg+"吗？","","",function(type){
        if (type == "dismiss") return;
        $.ajax({
            cache: true,
            type: "POST",
            url: merchantWeb_Path + 'fine/updateFine.htm',
            data: {"id":id,"status":status},
            dataType: "json",
            async: false,
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                dubSumit = 0;
                alert("系统异常");
            },
            success: function (resultData) {
                if(resultData.code == "0"){
                    $("#search").submit();
                }else{
                    alert(msg+"失败");
                }

            }
        });
    })

}