var selectModalView = (function ($) {

    var selectModalView = {};

    var _selectedForms = {};

    selectModalView.eventInit = function () {
        $("input[name=layoutName]").on("click", function (e) {
            var _self = this;
            e.stopPropagation();
            e.preventDefault();
            selectForm.modalShow(function (selectedForms) {
                if (selectedForms) {
                    $(_self).val(selectedForms.nodeName);
                    $('input[name=layout]').val(selectedForms.nodeId);
                    $('input[name=layoutCode]').val(selectedForms.nodeValue);
                }
            }, _selectedForms);
        });
    };

    selectModalView.init = function () {
        $.getJSON(ibrandWeb_Path + '/layout/list/tree.htm', function (data) {
            data = {'formList': data};
            selectForm.init(data, "single");
        });
        selectModalView.eventInit();
    };

    return selectModalView;
})(jQuery);

$(document).ready(function () {
    selectModalView.init();
    //下拉
    $(".zl-dropdown-inline").ysdropdown({
        callback: function (val, $elem) {
            var $dataCode = $elem.closest("td").find("a[data-value=" + val + "]");
            if (!$dataCode) {
                return false;
            }
            console.log($dataCode);
            var mallCode = $dataCode.attr("data-code");
            if (!mallCode) {
                return false;
            }
            var areaCode = mallCode.substring(0, 8);
            $("#areaCode").val(areaCode);
        }
    });

    //新增
    $(".zl-toolbar .zl-btn-add-reviewer").on("click", function () {
        if (!checkImgNum()) {
            return false;
        }
        var $form = $("#zl-merchant-creation-form");
        var checkFlag = validateForm4saveTemp($form);
        if (checkFlag) {
            $.ajax({
                url: ibrandWeb_Path + "brand/add.htm",
                type: "POST",
                data: $form.serialize(),
                success: function (resp) {
                    var dataObj = JSON.parse(resp);
                    if (dataObj.success == true) {
                        alert("操作成功！");
                    } else {
                        alert(dataObj.message);
                    }
                    window.location.href = ibrandWeb_Path + "brand/index.htm";
                },
                error: function (resp) {
                    //showMsg(resp);
                }
            })
        }
    });

});

$(".zl-datetimepicker").find("input").datetimepicker({
    format: "yyyy-mm-dd",
    todayBtn: "linked",
    startView: 2,
    minView: 2,
    autoclose: true,
    language: "zh-CN",
}).on('changeDate', function (e) {
    console.log(e)
});

/*================================图片上传==============================================*/

$('.zl-img-wrapper').magnificPopup({
    delegate: '.zl-thumbnail',
    type: 'image',
    gallery: {
        enabled: true
    },
});

$('.zl-img-wrapper').on("click", ".zl-icon-btn-del", function (e) {
    e.preventDefault();
    //ajax and warning callback
    $(this).closest("li").remove();

})

$('.fileupload').fileupload({
    //url:url,
    dataType: 'json',
    add: function (e, data) {
        var el = $(e.target);
        $.each(data.files, function (index, file) {
            if (file.name.length > 64) {
                alert("文件名过长!")
                return
            }
            uploadImage(file, el);
        });
        data.submit();
    },
    done: function (e, data) {
        $.each(data.result.files, function (index, file) {
            $('<p/>').text(file.name).appendTo('#files');
        });
    },
    progressall: function (e, data) {
        var progress = parseInt(data.loaded / data.total * 100, 10);
        $('#progress .progress-bar').css(
            'width',
            progress + '%'
        );
    }
});

function uploadImage(file, $this) {
    var formData = new FormData();
    formData.append("action", "1002");
    formData.append("single", 1);
    formData.append("category", "FILE_ENROLMENT_MALL");
    formData.append("targetId", '');
    formData.append('file', file);
    $.ajax({
        //url: 'http://localhost:1024/file_web/sdk/platform/file',
        url: fileWeb_Path + 'sdk/platform/file',
        type: 'POST',
        dataType: "json",
        cache: false,
        data: formData,
        processData: false,
        contentType: false
    }).done(function (response) {
        if (response.success) {
            var url = accessUrl + response.data.path
            var _tmp =
                " <li style='width: 92px;float:left;margin-right:15px; '>" +
                "   <div class=\"zl-thumbnail-wrapper\">" +
                "       <em class='zl-thumbnail' data-mfp-src='" + url + "' style='background-image:url(" + url + ")'" +
                "        ></em>" +
                "       <a class=\"zl-icon-btn zl-icon-btn-del\"></a>" +
                "   </div>" +
                "</li>";
            //将图片动态添加到图片展示区
            $this.parents("td").find("ul").append(_tmp);
        } else {
            alert(response.message);
        }
    });
}

//保存图片的url地址
function sPathUrl(inputName) {
    var url = "";
    var cou = 0;
    var $ul = $("#" + inputName).parents("td").find("ul");
    $ul.find("li").each(function () {
        var $em = $(this).find("[data-mfp-src]");
        url = url + "," + $em.attr("data-mfp-src");
        cou = cou + 1;
    });
    if (url != "" || url != null) {
        url = url.substring(1, url.length);
    }
    $("#" + inputName).val(url);
    return cou;
}

/*================================附件上传==============================================*/

$("#uploadFile").fileupload({
    pasteZone: null,
    url: "fileUpload.htm",
    dataType: 'json',
    add: function (e, data) {
        uploadFile(data.files[0], function (item) {
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
        console.log(result)
        var html =
            '<li class="row">' +
            '<span class="col-md-4">' +
            '<em class="zl-em-icon zl-icon-attachment"></em>' +
            '<a href="' + accessUrl + result.attachmentPath + '" target="_blank" class="zl-attach-file-link">' + result.attachmentName + '</a>' +
            '</span><span class="col-md-2">' + result.createrName + '</span>' +
            '<span class="col-md-4">' + new Date(result.createdDate).toLocaleDateString() + '</span>' +
            '<span class="col-md-2" style="text-align: center;">' +
            '<a onclick="deleteFile(this, ' + result.id + ')" class="zl-attach-del" style="cursor: pointer;">删除</ a></span>' +
            '</li>';
        $(html).appendTo('#files');
        var attachments = "<input type='text' id='attachments_" + result.id + "' name='attachments' value='" + result.id + "' />";
        $(attachments).appendTo('#attachmentDiv');
    }
}).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');

function uploadFile(file, callback) {
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

function deleteFile(_this, id) {
    $.ajax({
        url: "deleteFile.htm",
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


/*================================功能按钮===============================*/
function checkImgNum() {
    if (sPathUrl("logo") >= 4) {
        alert("LOGO图片不能超过4张");
        return false;
    }
    if (sPathUrl("storePic") >= 4) {
        alert("门店图片不能超过4张");
        return false;
    }
    if (sPathUrl("checkReportImg") >= 4) {
        alert("产品质量检测报告不能超过4张");
        return false;
    }
    if (sPathUrl("trademarkImg") >= 4) {
        alert("商标注册证不能超过4张");
        return false;
    }
    if (sPathUrl("fghi") >= 4) {
        alert("店面招牌不能超过4张");
        return false;
    }
    if (sPathUrl("elevation") >= 4) {
        alert("立面图不能超过4张");
        return false;
    }
    return true;
}

/*================================提交审批============================================*/

// 发起
$(".submitNetComment").unbind("click").bind("click", function () {
    var checkFlag = validateForm($("#zl-merchant-creation-form"));
    if (checkFlag) {
        $.ajax({
            url: ibrandWeb_Path + "brand/add.htm",
            type: "POST",
            data: $("#zl-merchant-creation-form").serialize(),
            success: function (data) {
                var dataObj = JSON.parse(data);
                if (dataObj.success == true) {
                    var brandId = dataObj.brandId;
                    var areaCode = $("#areaCode").val();
                    pageCommon.submitNetComment("inamp-brandinstock-" + areaCode, brandId, ibrandWeb_Path + "brand/index.htm");
                } else {
                    alert(dataObj.message);
                }

            },
            error: function (resp) {
                //showMsg(resp);
            }
        })
    }
});


/*================================校验============================================*/
function validateForm(obj) {
    var mallId = $("#mallId").val();
    if (!mallId) {
        alert("项目名称不能为空！");
        return false;
    }
    var layout = $(obj).find("input[name=layout]");
    if (!layout.val()) {
        alert("业态不能为空！");
        return false;
    }
    var brandName = $(obj).find("input[name=brandName]").val();
    if (!brandName.trim()) {
        alert("品牌中文名不能为空！");
        return false;
    }
    var brandOtherName = $(obj).find("input[name=brandOtherName]").val();
    if (!brandOtherName.trim()) {
//        alert("品牌英文名不能为空！");
//        return false;
    }
    return true;
}

/*================================暂存校验============================================*/
function validateForm4saveTemp(obj) {
    var mallId = $("#mallId").val();
    if (!mallId) {
        alert("项目名称不能为空！");
        return false;
    }
    return true;
}

function isNum(num, msg) {
    if (!isNaN(num)) {
        var dot = num.indexOf(".");
        if (dot != -1) {
            var dotCnt = num.substring(dot + 1, num.length);
            if (dotCnt.length > 2) {
                alert(msg + "小数位已超过2位！");
                return false;
            } else {
                if (parseInt(num) > 99999999) {
                    alert("输入" + msg + "值过大！");
                    return false;
                } else {
                    return true;
                }
            }
        } else {
            var re = /^[0-9]*[1-9][0-9]*$/;
            if (re.test(num)) {
                if (parseInt(num) > 99999999) {
                    alert("输入" + msg + "值过大！");
                    return false;
                } else {
                    return true;
                }
            } else {
                alert("输入" + msg + "不合法！");
                return false;
            }
        }
    } else {
        alert("输入" + msg + "不合法！");
        return false;
    }
}

function isTel(num, msg) {
    if (!isNaN(num)) {
        var re = /^1\d{10}$/;
        if (re.test(num)) {
            return true;
        } else {
            alert("输入" + msg + "不合法！");
            return false;
        }

    } else {
        alert("输入" + msg + "不合法！");
        return false;
    }
}

function isEmail(num, msg) {
    var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
    if (re.test(num)) {
        return true;
    } else {
        alert("输入" + msg + "不合法！");
        return false;
    }
}
