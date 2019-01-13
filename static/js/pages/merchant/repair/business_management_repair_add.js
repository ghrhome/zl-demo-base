var pageView = (function ($) {
    var pageView = {};

    //初始化
    pageView.init = function () {
        pageView.nweData();
        pageView.loaunitIn();
        pageView.dropDown();
        pageView.bindingSubmit();
        pageView.ajaxSelect();
        pageView.loggedInInformation();
        $("#sourceTypeDiv").find("ul li:last-child").remove()
        $(".btn-group").ysdropdown({
            callback: function () {
            }
        });
    };

    //绑定增加提交按钮
    pageView.bindingSubmit = function () {
        $("#submit").on("click", pageView.eventInit);
    }

    //给申请人赋值
    pageView.loggedInInformation = function () {
        dataQuery = {
            mallId: $('#mallId').val(),
            departmentName: $("#sourceTypeButton").val()
        };
        $.ajax({
            cache: false,
            type: "POST",
            url: merchantWeb_Path + "repair/loggedInInformation",
            data: dataQuery,
            async: false,
            dataType: "JSON",
            async: false,
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("系统异常");
            },
            success: function (authorization) {
                $('#applyIdDiv').find('ul li').remove();
                $('#applyIdDiv').find('.zl-dropdown-btn')[0].innerHTML = authorization.realname;
                $('#applyIdDiv').find('.zl-dropdown-btn')[0].disabled = 'ture';
                $("#applyId").val(authorization.id);

            }
        });
    }

    //增加方法
    pageView.eventInit = function () {
        var dataQuery = $('#add_form').serialize();
        var imgUrl = new Array()
        $("#zl-img-id").find('em').each(function () {
            imgUrl.push($(this).attr("data-mfp-src"));
        });
        if ($($('#applyIdDiv').find('input')[0]).val() != '') {
            dataQuery = dataQuery + "&applyName=" + $('#applyIdDiv').find('.zl-dropdown-btn')[0].innerHTML;
        } else {
            dataQuery = dataQuery + "&applyName=";
        }
        dataQuery = dataQuery + '&imgUrl=' + imgUrl;
        var url = "repairAdd";
        $.ajax({
            cache: true,
            type: "POST",
            url: url,
            data: dataQuery,
            async: false,
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("系统异常");
            },
            success: function (resultData) {
                if (resultData == 0) {
                    alert("新增成功");
                    window.location = merchantWeb_Path + "repair/businessManagementRepairInit";
                } else {
                    alert("新增失败！");
                    window.location = merchantWeb_Path + "repair/businessManagementRepairInit";
                }
            }
        });
    };

    pageView.loadingShow = function () {
        $(".zl-loading").fadeIn();
    }

    pageView.loadingHide = function () {
        $(".zl-loading").fadeOut();

    }

    //弹出层
    pageView.loaunitOut = function () {
        $('#unitSelectModal').slideDown();
        $('.modal-backdrop').show();

    }

    //隐蔽
    pageView.loaunitIn = function () {
        $('#unitSelectModal').slideUp();
        $('.modal-backdrop').hide();
    }

    pageView.nweData = function () {
        $(".zl-repair-date-add").find("input").datetimepicker({
            format: "yyyy-mm-dd",
            todayBtn: "linked",
            startView: 2,
            minView: 2,
            autoclose: true,
            language: "zh-CN",
        });

        $(".zl-repair-date-add").find("input").datetimepicker({
            format: "yyyy-mm-dd ",
            todayBtn: "linked",
            startView: 0,
            minView: 0,
            autoclose: true,
            language: "zh-CN",
        });
    }
    //下拉选项
    pageView.dropDown = function () {
        $('#zl-section-collapse-table-1').on('click', function (event) {
            var target = $(event.target);
            if (target.is('a') && target.attr('data-id') != undefined) {
                var txt = target.text();
                var id = target.attr('data-value');
                target.parents('ul').prev().text(txt);
                target.parents('ul').prev().prev().val(id);
            }
        })
    }

    //内容改变时查询商铺号
    $("#textboxID").bind("input propertychange", function () {
        alert($(this).val());
    });


    pageView.ajaxSelect = function (url, data, callback) {
        $.ajax({
            cache: true,
            type: "POST",
            dataType: "json",
            data: {mallId: ""},
            url: netcommentWeb_Path + "netcomment/selectFeeType.htm",
            async: true,
            error: function (request) {
                alert("系统异常");
            },
            success: function (resultData) {
                if (resultData) {
                    var availableTags = resultData.data;
                    $("body").data("_feeTypeList", availableTags);
                    $(".js-account-fee-types").autocomplete({
                        source: availableTags,
                        minLength: 0,
                        select: function (event, ui) {
                            var feeCode = ui.item.value;
                            this.value = ui.item.label;
                            return false;
                        }
                    });
                }
            }
        });
    }

    return pageView;

})(jQuery);


$(document).ready(function () {
    pageView.init();

    $('.zl-img-wrapper').on("click", ".zl-icon-btn-del", function (e) {
        e.preventDefault();
        //ajax and warning callback
        $(this).closest("li").remove();
    })

    function _getObjectURL(file) {
        var url = null;
        if (window.createObjectURL != undefined) { // basic
            url = window.createObjectURL(file);
        } else if (window.URL != undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file);
        }
        return url;
    }

    $('#fileupload').fileupload({
        //url: url,
        dataType: 'json',
        add: function (e, data) {
            $.each(data.files, function (index, file) {
                //_preview(file)
                uploadFiles(file);
            });
            data.submit();
        },
        done: function (e, data) {
            $.each(data.result.files, function (index, file) {
                //$('<p/>').text(file.name).appendTo('#files');
            });
        },
        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress .progress-bar').css('width', progress + '%'
            );
        }
    })

    function uploadFiles(file) {
        var formData = new FormData();
        formData.append("action", "1002");
        formData.append("single", 1);
        formData.append("category", "FILE_MER_REPAIR_APPLY");
        formData.append("targetId", '');
        formData.append('file', file);
        $.ajax({
            //url: 'http://localhost:1024/file_web/sdk/platform/file',
            url: fileWeb_Path + '/sdk/platform/file',
            type: 'POST',
            dataType: "json",
            cache: false,
            async: true,
            data: formData,
            processData: false,
            contentType: false
        }).done(function (response) {
            if (response.success) {
                var url = accessUrl + response.data.path;
                var _tmp =
                    " <li>" +
                    "   <div class=\"zl-thumbnail-wrapper\">" +
                    "       <em class='zl-thumbnail' data-mfp-src='" + url + "' style='background-image:url( " + url + ")'" +
                    "        ></em>" +
                    "       <a class=\"zl-icon-btn zl-icon-btn-del\" href='javascript:void(0)'></a>" +
                    "   </div>" +
                    "</li>";

                //将图片动态添加到图片展示区
                $(".zl-img-wrapper>ul").append(_tmp);
                $('.zl-thumbnail').magnificPopup({
                    type: 'image',
                });
            } else {
                alert(response.message);
            }
        });
    }

});

