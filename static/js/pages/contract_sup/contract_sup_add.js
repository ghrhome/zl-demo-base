var supDivs = ['companyChange', 'positionChange', 'termChange', 'feeChange', 'contextChange'];
var myPageView = (function ($) {
    var myPageView = {};
    myPageView.printInit = function () {
        $(".zl-print5").click(function () {
            var detailId = $(this).attr("detailId");
            var url = "certificateManagementQuery.htm?detailIds=" + detailId;
            ysPrint.print(url);
        });
        $(".zl-print2").click(function () {
            function _cb(value) {
            }

            if (confirm("确认冲销?")) {
            }
        });
    }

    myPageView.addEventListener = function () {
        window.addEventListener("click", function (e) {
            myPageView.deleteDisabled();
        });
    }

    //附件上传
    myPageView.fileupload = function () {
        $("#fileupload").fileupload({
            pasteZone: null,
            url: netcommentWeb_Path + "netcomment/fileUpload.htm",
            dataType: 'json',
            add: function (e, data) {
                myPageView.uploadFiles(data.files[0], function (item) {
                    data.formData = {path: item};
                    data.submit();
                });

            },
            progressall: function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $('#progress .progress-bar').css(
                    'width',
                    progress + '%'
                );
            },
            success: function (result, textStatus, jqXHR) {
                result = result.data;
                var html =
                    '<li class="row">' +
                    '<span class="col-md-4">' +
                    '<em class="zl-em-icon zl-icon-attachment"></em>' +
                    '<a href="' + accessUrl + result.attachmentPath + '" target="_blank" class="zl-attach-file-link">' + result.attachmentName + '</a>' +
                    '</span><span class="col-md-2">' + result.createrName + '</span>' +
                    '<span class="col-md-4">' + new Date(result.createdDate).toLocaleDateString() + '</span>' +
                    '<span class="col-md-2" style="text-align: center;"><a onclick="myPageView.deleteFile(this, ' + result.id + ')" class="zl-attach-del" style="cursor: pointer;">删除</a></span>' +
                    '</li>';
                $(html).appendTo('#files');

                var attachments = "<input type='text' id='attachments_" + result.id + "' name='attachments' value='" + result.id + "' />";
                $(attachments).appendTo('#attachmentDiv1');
                // var attachmentSize = $("#attachmentSize_" + $("#uploadFile").attr("progressId"));
                // attachmentSize.text(parseInt(attachmentSize.text()) + 1);
                myPageView.loadingHide();
            },
            error: function () {
                myPageView.loadingHide();
            }
        }).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');
    }


    myPageView.uploadFiles = function (file, callback) {
        myPageView.loadingShow();
        var formData = new FormData();
        formData.append("action", "1002");
        formData.append("single", 1);
        formData.append("category", "net_lease_contract");
        formData.append("targetId", '');
        formData.append('file', file);
        $.ajax({
            url: fileWeb_Path + 'sdk/platform/file',
            type: 'POST',
            dataType: "json",
            cache: false,
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.success) {
                    if (typeof callback === "function") {
                        callback(response.data.path);
                    }
                }
            }
        });
    }

    //附件删除
    myPageView.deleteFile = function (_this, id) {
        if (confirm("确认删除？")) {
            $.ajax({
                url: netcommentWeb_Path + "netcomment/deleteFile.htm",
                type: "POST",
                data: {id: id},
                success: function (result) {
                    result = eval("(" + result + ")");
                    if (result.success == true) {
                        $(_this).parent().parent().remove();
                        $("#attachments_" + id).remove();
                    } else {
                        alert("删除失败");
                    }
                },
                error: function (resp) {
                    showMsg(resp);
                }
            })
        }
    }

    //统一移除disabled
    myPageView.deleteDisabled = function () {
        var changeTypes = "";
        $(".contract_change_radio_group").find("input[name$=Radio]:checked:enabled").each(function () {
            var id = $(this).attr("id");
            changeTypes += id + ",";
        });
        $(".removeDisabled").attr("disabled", false);
        $("div[disabled=disabled]").find("input,select,textarea").attr("disabled", "disabled");
        $("#netCommentSupTypes").val(changeTypes);
        if ($("#contractBeginDate[disabled!=disabled]").length > 0) {
            $("#defaultContractBeginDate").remove();
        }
        if ($("#contractEndDate[disabled!=disabled]").length > 0) {
            $("#defaultContractEndDate").remove();
        }
        if ($("#brandNameShow:visible").length > 0) {
            $("#topBrandName").attr("disabled", "disabled");
        }
    }


    //发起、暂存
    myPageView.pageSave = function () {
        //暂存
        $("#js-temp-save1").on("click", function (e) {
            //$(".zl-loading").fadeIn();
            e.preventDefault();
            var mallId = $("#mallId").val();
            var contNo = $("#js-search").val();
            if (mallId == null || mallId == ""
                || contNo == null || contNo == "") {
                //$(".zl-loading").fadeOut(); // 隐藏 loading
                alert("请先选择一个变更合同！");
            } else {
                //standardizeContractSup();
                $(".zl-loading").fadeIn();
                myPageView.deleteDisabled();
                $.ajax({
                    cache: false,
                    type: "POST",
                    url: netcommentWeb_Path + "netcomment/busicond/saveBill.htm",
                    data: $('#billForm').serialize(),
                    dataType: "json",
                    async: true,
                    error: function (request) {
                        alert("系统异常");
                        $(".zl-loading").fadeOut();
                        $("#billId").val(resultData.data);
                    },
                    success: function (resultData) {
                        //console.log(resultData);
                        if (resultData.success) {
                            $(".zl-loading").fadeOut(); // 隐藏 loading
                            //跳转编辑画面
                            formPost(netcommentWeb_Path + "/netcomment/contractSup/index.htm", {
                                masterId: resultData.data,
                                billType: "03"
                            });
                        } else {
                            alert("保存失败!");
                            $(".zl-loading").fadeOut(); // 隐藏 loading
                        }
                    }
                });
            }
        });

        //附件
        $("#js-attachment1").on("click", function (e) {
            e.preventDefault();
        });
        //发起审批
        $("#js-save1").on("click", function (e) {
            e.preventDefault();
            if (checkNetForm()) {
                $(".zl-loading").fadeIn();
                myPageView.deleteDisabled();
                $.ajax({
                    cache: false,
                    dataType: "json",
                    type: "POST",
                    url: netcommentWeb_Path + "netcomment/busicond/saveBill.htm",
                    data: $('#billForm').serialize(),
                    async: true,
                    error: function (request) {
                        alert("系统异常!");
                        $(".zl-loading").fadeOut();  // 隐藏 loading
                    },
                    success: function (resultData) {
                        if (resultData.success) {
                            formPost(netcommentWeb_Path + "/netcomment/contractSup/submitNetComment.htm", {masterId: resultData.data});
                        } else {
                            alert("保存失败!");
                            $(".zl-loading").fadeOut();  // 隐藏 loading
                        }
                    }
                });
            }

        });

        // 对接K2
        $("#submitNetComment").click(function () {
            $(".zl-loading").fadeIn();
            if (checkNetForm()) {
                var mallId = $("#mallId").val();
                if (mallId == null || mallId == "") {
                    alert("请先选择一个项目！");
                } else {
                    myPageView.deleteDisabled();
                    $.ajax({
                        cache: false,
                        type: "POST",
                        url: netcommentWeb_Path + "netcomment/busicond/saveBill.htm",
                        data: $('#billForm').serialize(),
                        dataType: "json",
                        async: false,
                        error: function (request) {
                            alert("系统异常");
                            $(".zl-loading").fadeOut();
                        },
                        success: function (resultData) {
                            //console.log(resultData);
                            $(".zl-loading").fadeOut(); // 隐藏 loading
                            if (resultData.success) {
                                // 调用K2
                                var mallCode = $("#mallCode").val();
                                var areaCode = mallCode.substring(0, 8);
                                var netcommentId = resultData.data;
                                $("#masterId").val(resultData.data);
                                $("#netcommentContractSupId").val(resultData.data);
                                if (resultData.bsContractEntity != undefined) {
                                    $("#category").val(resultData.bsContractEntity.category);
                                }
                                $("#billId").val(resultData.billId);
                                var category = $("#category").val();
                                if (category == "01") {
                                    //非标合同 流程
                                    $app.workflow.submit("inamp-nonstandardcontractchange-" + areaCode, netcommentId).then(function ($response) {
                                        window.open($response.data.data);
                                        location.href = netcommentWeb_Path + "/netcomment/contractSup/index.htm";
                                    })
                                } else {
                                    $app.workflow.submit("inamp-standardcontractchange-" + areaCode, netcommentId).then(function ($response) {
                                        window.open($response.data.data);
                                        location.href = netcommentWeb_Path + "/netcomment/contractSup/index.htm";
                                    })
                                }
                            } else {
                                alert("保存失败!");
                            }
                        }
                    });
                }
            }
            $(".zl-loading").fadeOut();
        });
    }

    myPageView.loadingData = function () {
        if ($("#contNo").val() != null && $("#contNo").val() != '' && $("#contNo").val() != undefined) {
            myPageView.loadingShow();
            var url = netcommentWeb_Path + "netcomment/busicond/toContractSupAddView.htm";
            var data = {
                contNo: $("#contNo").val()
            }
            $.post(url, data, function (result) {
                $("#contract_sup_add_detail").empty();
                $("#contract_sup_add_detail").append(result);
                //需要重新带出合同模版
                $("#netContractNo").val("");
                myPageView.getTemplate();
                myPageView.loadingHide();
                myPageView.displaySupDivs();
                //激活 变更按钮
                $(".contract_change_radio_group").find("input[name$=Radio]").removeAttr("disabled");
            }, "html");
        }
    }

    myPageView.loadingEditData = function () {
        if ($("#netcommentContractSupId").val() != "" && $("#netcommentContractSupId").val() != null) {
            myPageView.loadingShow();
            var contNo = $("#js-search").val();
            var url = netcommentWeb_Path + "netcomment/busicond/toContractSupEditView.htm";
            var data = {
                masterId: $("#netcommentContractSupId").val(),
                contNo: contNo
            }
            $.post(url, data, function (result) {
                $("#contract_sup_add_detail").empty();
                $("#contract_sup_add_detail").append(result);
                myPageView.getTemplate();
                myPageView.loadingHide();
                myPageView.displaySupDivs();
                //激活 变更按钮
                $(".contract_change_radio_group").find("input[name$=Radio]").removeAttr("disabled");
            }, "html");
        }
    }

    myPageView.getTemplate = function () {
        var mallId = $("#mallId").val();
        var nowContryctNo = $("#js-search").val();
        var newContryctNo = $("#netContractNo").val();
        var netcommentId = $("#masterId").val();
        if(netcommentId == '' || netcommentId == undefined){
            netcommentId = 0;
        }
        pageCommon.ajaxSelect(netcommentWeb_Path + "netcomment/contractSup/getTemplateByMallId.htm", {mallId: mallId, netcommentId:netcommentId}, function (data) {
            var html = pageCommon._renderList({"dataList":data.data.templateEntities, "templateName": data.data.templateName, "templateId" :  data.data.templateId}, "contract_select_temp");
            $("#zl-section-collapse-table-20").find(".templateId").html(html);
            myPageView.dropdownInit();
        });
        var html = " <a target=\"view_window\" style=\"margin-left: 20px;\" href=" + contract_Path + "/contract/detail.htm?contractNo=" + newContryctNo + ">     " + newContryctNo + "</a>";
        $("#zl-section-collapse-table-20").find(".contractNo").html(html);
    }

    myPageView.setDropdown = function () {
        $(".zl-dropdown-inline").ysdropdown({
            callback: function (data) {
                // 重置自动带出数据
                $(".autoInput input").val("");
                $("#zl-dropdown-contNo").html("");
                //重置 变更选择区域
                $("input[name$=contractChangeRadio]").prop("checked", false);
                $("#showDivIndexs").val("");
                for (var i = 0; i < supDivs.length; i++) {
                    $("div[data-id='" + supDivs[i] + "']").addClass("hiddenDiv");
                }
            }
        });
    }


    myPageView.search = function () {
        $("#js-dropdown-contractSup").ysSearchSelect({
            source: function (request, response) {
                var mallId = $("#mallId").val();
                if (mallId == null || mallId == "") {
                    alert("请先选择项目！");
                }
                //重置 变更选择区域
                $("input[name$=contractChangeRadio]").prop("checked", false);
                //$("input[name$=contractChangeRadio]").attr("disabled","disabled");
                $("#showDivIndexs").val("");
                for (var i = 0; i < supDivs.length; i++) {
                    $("div[data-id='" + supDivs[i] + "']").addClass("hiddenDiv");
                }
                $.ajax({
                    url: netcommentWeb_Path + "netcomment/contract/getApprovedCont.htm",
                    dataType: "json",
                    data: {
                        searchWord: request.term,
                        mallId: mallId,
                        bsContStatus: 1,
                        bsCont: true
                    },
                    success: function (data) {
                        response($.map(data["bisCont"], function (item) {
                            return {
                                label: item.contNo,
                                value: {
                                    projectName: item.mallId, contName: item.storeNos, tenant: item.companyName,
                                    brandName: item.brandName, layOut: item.layoutName, contNo: item.contNo,
                                    leaseArea: item.storeNos, totalRental: "", contStartDate: item.contBeginDate,
                                    contEndDate: item.contEndDate, contUrl: item.contUrl, contractId: item.contractId
                                }
                            }
                        }));
                    }
                });
            },
            callback: function (value, ui) {
                this.value = ui.item.value.contNo;
                $("#projectName").val(ui.item.value.projectName);
                $("#contName").val(ui.item.value.contName);
                $("#topCompanyName").val(ui.item.value.tenant);
                $("#topBrandName").val(ui.item.value.brandName);
                $("#topLayOut").val(ui.item.value.layOut);
                $("#topLeaseArea").val(ui.item.value.leaseArea);
                $("#totalRental").val(ui.item.value.totalRental);
                $("#topContStartDate").val(ui.item.value.contStartDate);
                $("#topContEndDate").val(ui.item.value.contEndDate);
                $("#contUrl").attr("src", accessUrl + ui.item.value.contUrl);
                $("#contPath").val(accessUrl + ui.item.value.contUrl);
                $("#contNo").val(ui.item.value.contNo);
                $("#js-search").val(ui.item.value.contNo);

                // $("#contractId").val(item.value.contractId)


                myPageView.loadingData();
                myPageView.getTemplate();
                return false;
            },
        });
    }

    myPageView.pageInit = function () {
        $(".zl-query-info").click(function () {
            var url = "certificateModelSave.htm";
            var inputVal = $(".submit").serializeArray();
            $.post(url, inputVal, function (result) {
                alert(result);
            });
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
            myPageView.loadingShow();
            setTimeout(function () {
                $("#paginateForm").attr("action", "certificateModelList.htm").submit();
            }, 2000);
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
            $("#paginateForm").attr("action", "certificateModelList.htm").submit();
        });


        $("#querySearch").click(function () {
            myPageView.loadingShow();
            setTimeout(function () {
                $("#paginateForm").find("input[name=page]").val(1);
                $("#paginateForm").attr("action", "certificateModelList.htm").submit();
            }, 3000);
        });

        // $.ajaxSetup({
        //     type : 'POST',
        //     beforeSend:function () {
        //         myPageView.loadingShow();
        //     },
        //     error : function(){
        //         myPageView.loadingHide();
        //     },complete:function(){
        //         myPageView.loadingHide();
        //     }
        // });
        // myPageView.addEventListener();


    }

    myPageView.dropdownInit = function () {
        $(".zl-dropdown-inline").ysdropdown({});
    }


    myPageView.loadingShow = function () {
        $(".zl-loading").fadeIn();
    };

    myPageView.loadingHide = function () {
        $(".zl-loading").fadeOut();
    }

    myPageView.init = function () {
        $("#preloader").fadeOut("fast");
        myPageView.printInit();
        myPageView.pageInit();
        myPageView.dropdownInit();
        myPageView.pageSave();
        myPageView.search();
        myPageView.setDropdown();
        myPageView.fileupload();
        myPageView.loadingEditData();

        //初始化选择租户和选择租赁区域控件
        selectShopList.init("", "single");
        selectUnit.init("", "multi");
    };

    myPageView.displaySupDivs = function () {
        var indexArr = $("#showDivIndexs").val();
        if (!indexArr || indexArr == "") {
            return false;
        }
        for (var i = 0; i < supDivs.length; i++) {
            //$("div[data-id='"+supDivs[i]+"']").attr("disabled", "disabled");
            $("div[data-id='" + supDivs[i] + "']").addClass("hiddenDiv");
            //$("div[data-id='"+supDivs[i]+"']").hide();
        }

        if (typeof indexArr == "string") {
            indexArr = indexArr.split(",");
        }

        for (var j = 0; j < indexArr.length; j++) {
            var index = indexArr[j];
            $("div[data-id='" + supDivs[index] + "']").removeAttr("disabled");
            $("div[data-id='" + supDivs[index] + "']").removeClass("hiddenDiv");
            //初始化选中
            $("#" + supDivs[index] + "").attr("checked", "checked");
            //$("div[data-id='"+supDivs[index]+"']").show();
        }
    }

    return myPageView;

})(jQuery);

$(document).ready(function () {
    //console.log("................")
    myPageView.init();
    //补充协议 checkbox的点击事件
    $("input[name='contractChangeRadio']").on("click", function () {
        var dataId = $(this).attr("id");
        var checkBoxObj = $(this);
        $("div[data-id='" + dataId + "']").toggleClass(function () {
            var _this = $(this);
            if ($(checkBoxObj).is(':checked')) {
                _this.attr("disabled", false);
            } else {
                _this.attr("disabled", true);
            }
            return "hiddenDiv";
        });
    });
});


