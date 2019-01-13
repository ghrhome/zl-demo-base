var pageView = (function ($) {
    var pageView = {};

    pageView.objToNum = function (number) {
        return isNaN(number) ? 0 : Number(number);
    }
    function _numFixed2(number) {
        var number = parseFloat(number);
        return number.toFixed(2);
    }

    pageView.autocomplete = function () {
        $("#js-search").autocomplete({
            source: function (request, response) {
                $.ajax({
                    url: netcommentWeb_Path + "/netcomment/contract/getApprovedCont.htm",
                    type: "POST",
                    dataType: "json",
                    data: {
                        searchWord: request.term,
                        // 合同处于审批状态
                        bsContStatus: 1
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
            minLength: 2,
            select: function (event, ui) {
                this.value = ui.item.label;
                for (var key in ui.item.data) {
                    $("#" + key).val(ui.item.data[key]);
                }
                $("#zl-section-collapse-table-3 input[name=contractNo]").val('')
                pageView.getTemplate();
                pageCommon.initMallCode();
                return false;
            }
        });
    }
    pageView.getTemplate = function () {
        var mallId = $("#zl-section-collapse-table-1").find("#mallId").val();
        var netcommentId = $("#netcommentId").val();
        if(netcommentId == '' || netcommentId == undefined){
            netcommentId = 0;
        }
        if (mallId != "") {
            pageCommon.ajaxSelect("getTemplateByMallId.htm", { mallId: mallId, netcommentId:netcommentId},
                function (data) {
                if( data.data.templateName == undefined ){
                    data.data.templateName = "请选择";
                    data.data.templateId = "0";
                }
                var html = pageCommon._renderList({"dataList":data.data.templateEntities, "templateName": data.data.templateName, "templateId" :  data.data.templateId}, "contract_select_temp");
                $("#zl-section-collapse-table-3").find(".templateId").html(html);
                if(data.data.entity != undefined && data.data.entity.contractNo != null){
                    var html = "<a target=\"view_window\" style=\"margin-left: 20px;\" href=" + contract_Path + "/contract/detail.htm?contractNo=" +  data.data.entity.contractNo + ">     " + data.data.entity.contractNo + "</a>";
                    $("#zl-section-collapse-table-3").find(".contractNo").html(html);
                }
                pageView.dropdownInit();
            });
        }
    }

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
                        // bsContStatus: 1
                        isTermination:1
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
                for (var key in ui.item.data) {
                    $("#" + key).val(ui.item.data[key]);
                }
                $("#zl-section-collapse-table-3 input[name=contractNo]").val('')
                $("#contFailDate").val("");
                pageView.getTemplate();
                pageCommon.initMallCode();
            },
        });
    }

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
                    '<span class="col-md-4">' + dateFormat(result.createdDate) + '</span>' +
                    '<span class="col-md-2" style="text-align: center;">' +
                    '<a onclick="pageView.deleteFile(this, ' + result.id + ')" class="zl-attach-del" style="cursor: pointer;">删除</ a></span>' +
                    '</li>';
                $(html).appendTo('#files');
                var attachments = "<input type='text' id='attachments_" + result.id + "' name='attachments' value='" + result.id + "' />";
                $(attachments).appendTo('#attachmentDiv');
                // var attachmentSize = $("#attachmentSize_" + $("#uploadFile").attr("progressId"));
                // attachmentSize.text(parseInt(attachmentSize.text()) + 1);
            }
        }).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');
    }

    function dateFormat(date,flag) {
        if(!date){
            return "";
        }
        var date = new Date(date);
        var year = date.getFullYear();
        var month = (date.getMonth() + 1) < 10  ? '0' + (date.getMonth() + 1) :(date.getMonth() + 1);
        var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        if(flag){
            return month + "-" + day ;
        }
        return year + "-" + month + "-" + day ;
    }

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

    pageView.tmpSave = function () {
        $("#addButton").click(function () {
            var url = "saveBill.htm";
            var data = $('#addBsAreaForm').serialize();
            if (!pageCommon.validateForm()) {
                return false;
            }
            pageCommon.ajaxSelect(url, data, function (data) {
                if (data.code == 200) {
                    var netcommentId = $("#netcommentId").val(data.data.netcommentId);
                    if (data.data.contNo != undefined) {
                        $("#zl-section-collapse-table-3").find("input[name=contractNo]").val(data.data.contNo);
                        pageView.getTemplate();
                    }
                    location.href = netcommentWeb_Path + "/netcomment/termination/index.htm?billType=10";
                } else {
                    pageCommon.handle(data);
                }
            });
        });
        $("#submitNetComment").click(function () {
            var data = $('#addBsAreaForm').serialize();
            var templateId = $("input[name=templateId]").val();
            var contractNo = $("#zl-section-collapse-table-3").find("input[name=contractNo]").val();
            if ((templateId == undefined || templateId == '') && contractNo == "") {
                alert("请选择合同模板");
                return;
            }
            if (!pageCommon.validateForm()) {
                return false;
            }
            // 存储本地信息 1201800827
            pageCommon.ajaxSelect("submitNetComment.htm", data, function (data) {
                if (data.code == 200) {
                    var netcommentId = data.data.netcommentId;
                    var category = data.data.category;
                    $("#netcommentId").val(netcommentId);
                    $("#category").val(category);
                    var areaCode = $("#areaCode").val();
                    var code = "inamp-standardcontractterminated-";
                    if (category == "01") {
                        code = "inamp-nonstandardcontractterminated-"
                    }
                    // 发起调用
                    pageCommon.submitNetComment(code + areaCode, netcommentId, netcommentWeb_Path + "/netcomment/termination/index.htm?billType=10");
                } else {
                    pageCommon.handle(data);
                }
            });
        });
    }

    pageView.pageInit = function () {
        $("#gotoPage").on("click", function (e) {
            $("#paginateForm").find("input[name=page]").val($("#gotoPageNum").val());
            $("#paginateForm").attr("action", "index.htm").submit();
        });
        $("#closeUploadModal").on("click", function (e) {
            $("#uploadModal").modal("hide");
        });
        $("input[data-type=number]").change("input", function () {
            pageCommon.decimal();
        })
        $("#contFailDate").change("input", function () {
            pageView.getCaiWuFinData();
        });
        $("input[id*=Month]").trigger("change");
        $("input[data-type=number]").trigger("change");
    };

    pageView.getCaiWuFinData = function () {
        var contNo = $("#contNo").val();
        var contFailDate = $("#contFailDate").val();
        pageCommon.ajaxSelect("getCancelFinData.htm", {contNo: contNo, contFailDate: contFailDate}, function (data) {
            for (var key in data) {
                $("#" + key).val(data[key]);
                $("div[data-feeType-name=" + key + "]").html(data[key] );
                console.log("div[data-feeType-name=" + key + "]");
            }
            $("input[data-type=number]").trigger("change");
            $("input[id*=Month]").trigger("change");
        });
    }

    pageView.dropdownInit = function () {
        $(".zl-dropdown-inline").ysdropdown({});
    };

    pageView.loadingShow = function () {
        $(".zl-loading").fadeIn();
    };

    pageView.loadingHide = function () {
        $(".zl-loading").fadeOut();
    };

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

    pageView.init = function () {
        $("#preloader").fadeOut("fast");
        confirmAlert.init();
        pageView.pageInit();
        pageView.dropdownInit();
        // pageView.autocomplete();
        pageView.selectAutoComplete();
        pageView.uploadFiles();
        pageView.fileupload();
        pageView.tmpSave();
        pageView.getTemplate();
        pageCommon.initMallCode();
    };
    return pageView;
})(jQuery);


$(document).ready(function () {
    console.log("................")
    pageView.init();
});