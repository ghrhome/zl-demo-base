$(function () {
    /**
     * 查询
     *
     * */
    var formData = new FormData();
    $("[name=excelImport]").ysSimpleUploadFile({ // Excel导入上传
        acceptTypes: ["xls", "xlsx"],
        changeCallback: function (file) {
            $(".zl-loading").fadeIn();
            formData.append("file", file);
            jQuery.ajax({
                url: enrolmentWeb_Path + 'diverse/excelImport.htm',
                type: 'POST',
                data: formData,
                dataType: 'json',
                async: true,
                cache: false,
                contentType: false,
                processData: false,
                success: function (response) {
                    console.log(response)
                    if (response.code == 0) { //成功
                        alert(response.msg, "", "", function () {
                            $('.import-dialog').modal('hide');
                            $(".zl-loading").fadeOut();
                            location.reload()
                        })

                    } else if (response.code == 1) {
                        alert(response.msg, "", "", function () {
                            $('.import-dialog').modal('hide');
                        })
                    }
                    $(".zl-loading").fadeOut();
                },
                error: function (data) {
                    alert("操作失败，请重试！");
                    $(".zl-loading").fadeOut();
                }
            })
        }
    });

    $("#doSearch").on('click', function () {
        $(".zl-loading").fadeIn();
        $("#searchForm").submit();

    });

    $(".dropdown-menu>li>a").on("click", function (e) {//下拉选项
        $(this).closest("div").find("button").html($(this).html())
        $(this).closest("div").find("input").val($(this).attr("key"))
        $("[name='page']").val(1)
        $("#doSearch").click();
    });

    $("[data-id=js-date-next]").on("click", function (e) {  //下一年
        var year = parseInt($(this).closest("div").find("input").val()) + 1;
        $(this).closest("div").find("input").val(year)
        $("#doSearch").click();

    })
    $("[data-id=js-date-prev]").on("click", function (e) {//上一年
        var year = parseInt($(this).closest("div").find("input").val()) - 1;
        $(this).closest("div").find("input").val(year)
        $("#doSearch").click();
    })
    $("#btn-next-bottom").on("click", function () {//下一页
        var page = $("#searchForm").find($("[name='page']")).attr("value");
        var pages = $("#searchForm").find($("[name='pages']")).attr("value");
        page=parseInt(page);
        pages=parseInt(pages);
        if (page < pages) {
            $("#searchForm").find($("[name='page']")).attr("value", parseInt(page) + 1);
            $("#doSearch").click();
        }
    });
    $("#btn-pre-bottom").on("click", function () {//上一页
        var page = $("#searchForm").find($("[name='page']")).attr("value");
        var pages = $("#searchForm").find($("[name='pages']")).attr("value");
        page=parseInt(page);
        pages=parseInt(pages);
        if (page > 1) {
            $("#searchForm").find($("[name='page']")).attr("value", page - 1);
            $("#doSearch").click();
        }

    });
    $("#btn-save").on("click", function (e) {  //页码输入
        var this_ = $(".zl-page-num-input")

        if (parseInt($(this_).val()) == 0) {
            alert("请输入合法数字！");
            $(this_).val($("[name=page]").val());
            return false;
        }
        if (parseInt($(this_).val()) > parseInt($("[name=pages]").val())) {
            alert("超过总页数！");
            $(this_).val($("[name=page]").val());
            return false;
        }
        $("[name='page']").attr("value", $(this_).val());
        $("#doSearch").click();

    });


});

