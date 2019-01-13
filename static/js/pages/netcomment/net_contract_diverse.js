var dubSumit = 0;
$(function () {
    $(".tableItem").on("click", function (e) {  //查看详情
        $(this).attr("aria-expanded", true)
        $(".zl-loading").fadeIn();
        location.href = 'toBillDetail.htm?masterId=' + $(this).data("value") + '&billType=1';
    })
    $(".addNetcomment").on("click", function (e) { //新增
        $(".zl-loading").fadeIn();
        location.href = 'toNewAdd.htm';
    })
    $("#searchBsFormBtn").on('click', function () { //提交查询
        $(".zl-loading").fadeIn();
        $("#searchnetDiverseForm").submit()

    });
    $(".zl-dropdown").ysdropdown({  //下拉选项
        callback: function (val, $elem) {
            $("#searchBsFormBtn").click();
        }
    });
    $("[data-id=js-date-prev]").on("click", function (e) {//上一页
        var year = parseInt($(this).closest("div").find("input").val()) - 1;
        $(this).closest("div").find("input").val(year)
        $("#searchBsFormBtn").click();
    })

    $("#btn-next-bottom").on("click", function () {//下一页
        var page = $("#searchnetDiverseForm").find($("[name='page']")).attr("value")
        var pages = $("#searchnetDiverseForm").find($("[name='pages']")).attr("value")
        if (parseInt(page) < parseInt(pages)) {
            $("#searchnetDiverseForm").find($("[name='page']")).attr("value", parseInt(page) + 1);
            $("#searchBsFormBtn").click();
        }
    });
    $("#btn-pre-bottom").on("click", function () {//上一页
        var page = $("#searchnetDiverseForm").find($("[name='page']")).attr("value")
        var pages = $("#searchnetDiverseForm").find($("[name='pages']")).attr("value")
        if (page > 1) {
            $("#searchnetDiverseForm").find($("[name='page']")).attr("value", page - 1);
            $("#searchBsFormBtn").click();
        }

    });
    $("#gotoPage").on("click", function (e) {  //页码选择
        var this_ = $(".zl-page-num-input")

        if (!isPositiveNum($(this_).val()) || parseInt($(this_).val()) == 0) {
            alert("请输入合法数字！");
            return false;
        }
        if (parseInt($(this_).val()) > parseInt($("[name=pages]").val())) {
            alert("超过总页数！");
            $(this).val($("#pages").val());
            return false;
        }
        $("[name='page']").attr("value", $(this_).val());
        $("#searchBsFormBtn").click();

    });
    $(".js-date-start,.js-date-end").datetimepicker({
        format: "yyyy-mm-dd",
        todayBtn: "linked",
        startView: 2,
        minView: 2,
        autoclose: true,
        language: "zh-CN",
        clearBtn:true
    }).on('changeDate', function (event) {


    }).on('show', function (e) {
        // $(".table-condensed").find(".clear").show();
    });


})
