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


    $("[data-name=getPlanDiscuss]").on("click", function (e) { //查看洽谈记录

        var hasInfo = $(this).closest("ul").find("input").eq(1).val()
        var storeId = $(this).closest("ul").find("input").eq(0).val()
        if (hasInfo == "true") {
            return
        } else {
            e.stopPropagation();
            e.preventDefault()
            $(".zl-loading").fadeIn();
            $(this).closest("ul").find("input").eq(1).val("true")

        }
        var formData = new FormData()
        $("#js-collapse-" + storeId).find("tbody").empty();
        formData.append("storeId", storeId);
        var this_ = this;
        $.ajax({
            url: 'getPlanDiscuss.htm',
            type: 'POST',
            data: formData,
            dataType: 'json',
            async: true,
            cache: false,
            contentType: false,
            processData: false,
            success: function (response) {
                $.each(response, function (index, obj) {
                    var date = new Date(obj.discussTime)
                    var appened = ' <tr>\n' +
                        '                                                    <td class="text-center">' + date.toLocaleString() + '</td>\n' +
                        '                                                    <td class="text-center">' + obj.discussPerson + '</td>\n' +
                        '                                                    <td class="text-center"><a data-path="' + obj.discussPath + '" data-name="selectDiscuss" href="#">意向单</a></td>\n' +
                        '                                                </tr>'

                    $("#js-collapse-" + storeId).find("tbody").append(appened)

                });

                if (response.length == 0) {//没有时

                }

                $(".zl-loading").fadeOut();
                $("#js-collapse-" + storeId).find("[data-toggle=collapse]").click()
            },
            error: function (res) {
                //console.log(res)

                $(".zl-loading").fadeOut();
            }

        })


    })

    $("#discuss-main").on("click", "[data-name=addDiscuss]", function (e) { //新增洽谈
        var storeid = $(this).attr("storeid");
        var path = base_Path + "/scpStatic/views/merchant_management/rental_intention_form.html"
        $("#discussHtml").attr("isReadOnly_", "false");
        $("#discussHtml").attr("src", path);
        $("[data-name=saveDiscuss]").attr("storeid", storeid)
        $("[data-name=saveDiscuss]").show()

    })
    $("#discuss-main").on("click", "[data-name= 'selectDiscuss']", function (e) { //查看洽谈详细
        $("[data-name=saveDiscuss]").hide()
        var path = $(this).attr("data-path");
        $("#discussHtml").attr("isReadOnly_", "true");
        $("#discussHtml").attr("src", path);
        $("#discussHtml").closest(".discuss-dialog").modal("show");
    })

    $("[data-name=saveDiscuss]").on("click", function (e) {  //保存洽谈
        e.stopPropagation();
        e.preventDefault();
        var storeId = ($("[data-name=saveDiscuss]").attr("storeid"))
        var formData = new FormData();
        formData.append("storeId", storeId)
        formData.append("storeId", storeId)
        formData.append("discussHtml", $("#discussHtml").contents().find("html").html())
        //console.log($("#discussHtml").contents().find("html").html())
        jQuery.ajax({
            url: 'discussImport.htm',
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
                    alert(response.msg, "", "", function (e) {
                        $(".zl-loading").fadeIn();
                        location.reload()
                    })
                } else if (response.code == 1) {
                    alert(response.msg, "", "", function () { //保存失败
                    })
                }

            },
            error: function (data) {
                alert("操作失败，请重试！");
            }

        })
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
        if (page > 1) {
            $("#searchForm").find($("[name='page']")).attr("value", page - 1);
            doSearch()
        }

    });
    $("#btn-save").on("click", function (e) {  //页码选择
        var this_ = $(".zl-page-num-input")

        if (parseInt($(this_).val()) == 0) {
            alert("请输入合法数字！");
            $(this_).attr("value", $("[name='page']").val());
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
                    $(".zl-loading").fadeOut();
                    alert("操作失败，请重试！");
                }
            })
        }
    });


    function _collapseInit(){
        $("body").on("show.bs.collapse",".panel-collapse",function(){

            $(this).closest(".panel").find(".panel-heading>div").attr("aria-expanded",true);

        });

        $("body").on("hide.bs.collapse",".panel-collapse",function(){

            $(this).closest(".panel").find(".panel-heading>div").attr("aria-expanded",false);

        });
    }


    _collapseInit();
});

function doSearch() {
    $(".zl-loading").fadeIn();
    $("#searchForm").submit()
}