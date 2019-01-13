var pageView = (function ($) {
    var pageView = {};

    pageView.dropdownInit = function () {
        $(".zl-dropdown-inline").ysdropdown({});
    };

    pageView.datepicker = function () {
        var datepicker = $(".zl-datetimepicker").find("input").datetimepicker({
            format: "yyyy-mm-dd",
            todayBtn: "linked",
            startView: 2,
            minView: 2,
            autoclose: true,
            language: "zh-CN",
        }).on('changeDate', function (e) {
            console.log(e)
        });

    }

    pageView.eventInit = function () {
        // 暂存事件
        $(".addButton").unbind("click").bind("click", function () {
            var url = "saveBill.htm";
            var data = pageView.creatData();
            if (data == null) {
                return;
            }
            if(!pageCommon.validateForm()){
                return;
            }
            pageCommon.ajaxSelect(url, data, function (data) {
                if (data.code == 200){
                    location.href = netcommentWeb_Path + "/netcomment/liquidation/index.htm?billType=42";
                } else {
                    pageCommon.handle(data)
                }
                var netcommentId = $("#zl-section-collapse-table-1").find("input[name=netcommentId]").val(data.data);
            })
        });
        // 发起
        $(".submitNetComment").unbind("click").bind("click", function () {
            // "send" 代表发起，需要检查数据是否合理
            var data = pageView.creatData();
            if(!pageCommon.validateForm()){
                return;
            }
            // 存储本地信息
            pageCommon.ajaxSelect("submitNetComment.htm", data, function (data) {
                if (data.code == 200) {
                    var netcommentId = data.data;
                    var areaCode = $("#mallCode").val();
                    areaCode = areaCode.substring(0, 8);
                    pageCommon.submitNetComment("inamp-leasecontractliquidation-" + areaCode, netcommentId, netcommentWeb_Path + "/netcomment/liquidation/index.htm?billType=42");
                } else {
                    pageCommon.handle(data);
                }
            })
        });

        $("#closeUploadModal").on("click", function (e) {
            $("#uploadModal").modal("hide");
        });
    }

    pageView.readTemp = function(contNo){
        pageCommon.ajaxSelect("getEnsure.htm", {contNo:contNo}, function (data) {
            var html1 = pageCommon._renderList(data.data, "ensure_temp");
            $("#zl-section-collapse-table-2 tbody").html(html1);
        });
        pageCommon.ajaxSelect("getPayable.htm", {contNo:contNo}, function (data) {
            var html1 = pageCommon._renderList(data.data, "payable_temp");
            $("#zl-section-collapse-table-3 tbody").html(html1);
        });
        var html = pageCommon._renderList(findList, "fine_temp");
        $("#zl-section-collapse-table-4 tbody").html(html);
        pageCommon.ajaxSelect("getBankAccount.htm", {contNo:contNo}, function (data) {
            for (var key in data.data) {
                $("#" + key).val(data.data[key]);
            }
        });
    }

    var findList = [{feeType:"48", chargeItemName:"违约罚款"},{feeType:"1008", chargeItemName:"保证金头款"}]

    pageView.selectAutoComplete = function () {
        var cookie = document.cookie;
        $(".zl-dropdown-search-select").ysSearchSelect({
            source: function (request, response) {
                $.ajax({
                    url: netcommentWeb_Path + "/netcomment/termination/getApprovedCont.htm?" + cookie,
                    type: "POST",
                    dataType: "json",
                    data: {
                        searchWord: request.term,
                        // 合同处于审批状态
                        bsContStatus: 2
                    },
                    success: function (data) {
                        response($.map(data["bisCont"], function (item) {
                            return {
                                label: item.contNo,
                                value: item.contNo,
                                data: item
                            }
                        }));
                    }
                });
            },
            callback: function (value, ui) {
                this.value = ui.item.label;
                ui.item.data['contFailDesc'] = cancelReason[ui.item.data.equityType];
                for (var key in ui.item.data) {
                    $("#" + key).val(ui.item.data[key]);
                }
                pageView.readTemp(value);
                pageView.datepicker();
            },
        });
    }

    //附件上传
    pageView.fileupload = function () {
        $("#uploadFile").fileupload({
            pasteZone: null,
            url: netcommentWeb_Path + "/netcomment/fileUpload.htm",
            dataType: 'json',
            add: function (e, data) {
                pageView.uploadFiles(data.files[0], function (item) {
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
                    '<span class="col-md-2" style="text-align: center;">' +
                    '<a onclick="pageView.deleteFile(this, ' + result.id + ')" class="zl-attach-del" style="cursor: pointer;">删除</ a></span>' +
                    '</li>';
                $(html).appendTo('#files');
                var attachments = "<input type='text' id='attachments_" + result.id + "' name='attachments' value='" + result.id + "' />";
                $(attachments).appendTo('#attachmentDiv');
            }
        }).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');
    }

    // 附件上传
    pageView.uploadFiles = function (file, callback) {
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
    pageView.deleteFile = function (_this, id) {
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

    pageView.creatData = function () {
        // 主表数据
        var liquidation = {};

        var liquidationTable1 = $("#zl-section-collapse-table-1 input").serializeArray();
        $.each(liquidationTable1, function (i, map) {
            if (!(map.name in liquidationTable1)) {
                liquidation[map.name] = map.value;
            }
        });

        var liquidationEnsures = [];
        $("#zl-section-collapse-table-2 tr").each(function () {
            var tmp = $(this).find("input").serializeArray();
            var obj = {};
            $.each(tmp, function (i, map) {
                if (!(map.name in obj)) {
                    obj[map.name] = map.value;
                }
            });
            if (!$.isEmptyObject(obj)) {
                liquidationEnsures.push(obj);
            }
        });

        var liquidationPayables = [];
        $("#zl-section-collapse-table-3 tr").each(function () {
            var tmp = $(this).find("input").serializeArray();
            var obj = {};
            $.each(tmp, function (i, map) {
                if (!(map.name in obj)) {
                    obj[map.name] = map.value;
                }
            });
            if (!$.isEmptyObject(obj)) {
                liquidationPayables.push(obj);
            }
        });

        var liquidationFines = [];
        $("#zl-section-collapse-table-4 tr").each(function () {
            var tmp = $(this).find("input").serializeArray();
            var obj = {};
            $.each(tmp, function (i, map) {
                if (!(map.name in obj)) {
                    obj[map.name] = map.value;
                }
            });
            if (!$.isEmptyObject(obj)) {
                liquidationFines.push(obj);
            }
        });

        liquidationTable1 = $("#zl-section-collapse-table-5 input").serializeArray();
        $.each(liquidationTable1, function (i, map) {
            if (!(map.name in liquidationTable1)) {
                liquidation[map.name] = map.value;
            }
        });
        // 附件
        var attachments = "";
        $("#attachmentDiv input").each(function () {
            var tmp = $(this).val();
            attachments += tmp + ","
        });

        var data = {
            // 主信息
            liquidation: JSON.stringify(liquidation),
            // 罚款信息
            liquidationFines: JSON.stringify(liquidationFines),
            // 保证金退款
            liquidationPayables: JSON.stringify(liquidationPayables),
            // 保证金
            liquidationEnsures: JSON.stringify(liquidationEnsures),
            // 附件表
            attachments: attachments
        };
        return data;
    }

    pageView.init = function () {
        $("#preloader").fadeOut("fast");
        pageView.dropdownInit();
        pageView.selectAutoComplete();
        pageView.eventInit();
        pageView.fileupload();
        pageView.datepicker();
        confirmAlert.init();
    };

    return pageView;

})(jQuery);


$(document).ready(function () {
    console.log("................")
    pageView.init();
});






