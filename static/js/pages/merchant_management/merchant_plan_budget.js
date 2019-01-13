/**
 * 招商计划
 * xiaozunh
 *
 *
 * */


$(function () {
    /**
     * 查询
     *
     * */
    $("#doSearch").on('click', function () {
        $("[name=page]").val(1) //第一页
        doSearch()

    });
    $(".zl-dropdown").ysdropdown({
        callback: function (val, $elem) {
            var thisName = $elem.find("input").prop("name");
            if (thisName == "mallId") {
                $elem.next().find("button").html("所有楼栋")
                $elem.next().next().find("button").html("所有楼层")
                $elem.next().find("input").val("")
                $elem.next().next().find("input").val("")

            } else if (thisName == "blockId") {
                $elem.next().find("button").html("所有楼层");
                $elem.next().find("input").val("")
            }
            $("[name=page]").val(1) //第一页
           doSearch()
        }
    });

    $("[data-name=getPlanDiscuss]").on("click", function (e) {

        var storeId = $(this).closest("ul").find("input").val()


    })

    $("[data-id=js-date-next]").on("click", function (e) {  //下一年
        var year = parseInt($(this).closest("div").find("input").val()) + 1;
        $(this).closest("div").find("input").val(year)
       doSearch()

    })
    $("[data-id=js-date-prev]").on("click", function (e) {//上一年
        var year = parseInt($(this).closest("div").find("input").val()) - 1;
        $(this).closest("div").find("input").val(year)
       doSearch()
    })
    var formData = new FormData();
    $("[name=excelImport]").ysSimpleUploadFile({ // Excel导入上传
        acceptTypes: ["xls", "xlsx"],
        changeCallback: function (file) {
            $(".zl-loading").fadeIn();
            formData.append("file", file);
            jQuery.ajax({
                url: ibrandWeb_Path + 'budget/excelImport.htm',
                type: 'POST',
                data: formData,
                dataType: 'json',
                async: true,
                cache: false,
                contentType: false,
                processData: false,
                success: function (response) {
                    //console.log(response)
                    if (response.code == 0) { //成功
                        alert(response.msg, "", "", function () {
                            location.reload()
                        })
                    } else if (response.code == 1) {

                        alert(response.msg, "", "", function () {

                            $('.import-dialog').modal('hide');
                            // location.reload()
                        })
                    }
                    // baseView.loadingHide();
                    $(".zl-loading").fadeOut();

                },
                error: function (data) {
                    alert("操作失败，请重试！");
                }
            })
        }
    });

    $("#btn-next-bottom").on("click", function () {//下一页
        var page = $("#searchForm").find($("[name='page']")).attr("value")
        var pages = $("#searchForm").find($("[name='pages']")).attr("value")
        if (parseInt(page) < parseInt(pages)) {
            $("#searchForm").find($("[name='page']")).attr("value", parseInt(page) + 1);
           doSearch()
        }
    });
    $("#btn-pre-bottom").on("click", function () {//上一页
        var page = $("#searchForm").find($("[name='page']")).attr("value")
        var pages = $("#searchForm").find($("[name='pages']")).attr("value")
        if (parseInt(page) > 1) {
            $("#searchForm").find($("[name='page']")).attr("value", page - 1);
           doSearch()
        }

    });
    $("#btn-save").on("click", function (e) {
        var this_ = $(".zl-page-num-input")

        if (parseInt($(this_).val()) == 0) {
            alert("请输入合法数字！");
            return false;
        }
        if (parseInt($(this_).val()) > parseInt($("[name=pages]").val())) {
            alert("超过总页数！");
            $(this_).val($("[name='page']").val());
            return false;
        }
        if (parseInt($(this_).val()) == parseInt($("[name=page]").val()))
            return false
        $("[name='page']").attr("value", $(this_).val());
        doSearch()

    });


});


function doSearch() {
    $(".zl-loading").fadeIn();
    $("#searchForm").submit()
}