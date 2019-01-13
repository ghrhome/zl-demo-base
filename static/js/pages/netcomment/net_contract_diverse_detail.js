var dubSumit = 0;
var feeListsize = $("#feeListsize").val();
var feeOtherListsize = $("#feeOtherListsize").val();
var change;
var _selectedCompany = {};
var _selectedStores = {};
var _feeTypeList = {};
var diverseBudget = 0;//多经预算
var tax = 0;//税率

var pageView = (function ($) {
    confirmAlert.init();

    var pageView = {};

    /**
     *租金方式
     * xiaozunh
     * */
    $("[name=feeTable]").find("[type='radio']").on("click", function (e) {
            changeFeeTitle();
            if ($(this).attr("name") == "rentUnit" || $(this).attr("name") == "rentUnitPrice") {  //点击记租单位或单价 此处发生租金计算变化
                $("[name=feeTable]").find("input[type='number']").each(function () {
                    var inputName = $(this).attr("name")
                    if (inputName.indexOf("standard") != -1) {
                        rentCalcul(this)
                    }
                })

                return;

            } else if ($(this).attr("name") == "rentType") {
                var rentType = $("input[name='rentType']:checked").val();//租金方式 :01-固定租金  05-一次性租金
                if (rentType == "01" || rentType == "03") {  //选择一次性租金时 隐藏单价 -日 -年
                    $("[name='rentUnitPrice']").each(function (e) {
                        $(this).parent().show()
                    })

                } else if (rentType == "05" || rentType == "02") {

                    $("[name='rentUnitPrice']").each(function (e) {
                        $(this).parent().hide();
                    })
                }
                if (rentType == "05") {//一次性租金时支付周期不可选 一次性租金时显示缴费日期
                    $("[name=rentPayCyc]").next().html("不可选择")
                    $("[name=rentPayCyc]").next().attr("disabled", true);
                    $("[name=rentPayCyc]").val("00");
                    $("#rentPaytime").show();
                    $("#rentPaytime").next().show();
                    $("#rentPaytime").next().next().hide();
                    $("#rentPaytime").next().next().next().hide();
                    $("#rentPaytime").next().find("input").attr("name", "rentLastestPaytime")
                    $("#rentPaytime").next().next().next().find("input").attr("name", "")

                } else {
                    $("[name=rentPayCyc]").next().html("选择支付周期")
                    $("[name=rentPayCyc]").val("");
                    $("[name=rentPayCyc]").next().attr("disabled", false);
                    $("#rentPaytime").hide();
                    $("#rentPaytime").next().hide();
                    $("#rentPaytime").next().next().show();
                    $("#rentPaytime").next().next().next().show();
                    $("#rentPaytime").next().find("input").attr("name", "")
                    $("#rentPaytime").next().next().next().find("input").attr("name", "rentLastestPaytime")
                }
                changeList()

            } else if ($(this).attr("name") == "chargeType") {
                changeTax();
            }
        }
    );
    $("[name='isOutside']").on("click", function (e) {  //含税不含税切换重新计算租金
        $("[name=feeTable]").find("input[type='number']").each(function () {
            var inputName = $(this).attr("name")
            if (inputName.indexOf("standard") != -1) {
                rentCalcul(this)
            }
        })

    })
    $("[name='feeFitupDeposit']").on("click", function (e) {  //允许合同期重叠或不允许
        contractDateCheck();
    })

    // 发起K2调用
    pageView.submitNetComment = function (code, netCommonId, rebake) {
        $app.workflow.submit(code, netCommonId).then(function ($response) {


            window.open($response.data.data);
            if (rebake != '') {
                location.href = rebake;
            }
        })
    }

    $("#postNetcomentButton").on("click", function (e) {//"+" 发起审批
        var imgs = "";
        $('#billForm').find(".zl-img-wrapper").find("a").each(function () {
            imgs = imgs + "," + $(this).attr("data-image")
        });
        // attachmentIds 附件id
        if ($("[name='netcommentId']").val() == undefined) {
            var attachmentIds = "";
            $("#uploadModal").find(".zl-attach-del").each(function () {
                attachmentIds = attachmentIds + "," + $(this).attr("data-date");
            })
            if (attachmentIds != "") {
                $("#attachments").val(attachmentIds.substring(attachmentIds.indexOf(",") + 1))
            }
        }
        if (valitateFormforNetconment($('#billForm'))) {
            $(".zl-loading").fadeIn()
            $.post(netcommentWeb_Path + '/netcomment/diverse/saveTemp.htm?k2status=submit&imgs=' + imgs, $('#billForm').serialize(), function (result) {
                var response = eval('(' + result + ')');
                if (response.code == "0") { //保存成功
                    $(".zl-loading").fadeOut()
                    var netcommentId = response.data
                    $("#masterId").val(netcommentId)
                    var areaCode = $("#mallCode").val().substring(0, 8);
                    pageView.submitNetComment("inamp-diversificationcontractformal-" + areaCode, netcommentId, "index.htm");

                } else if (response.code == "1") { //保存失败
                    $(".zl-loading").fadeOut()
                    alert(response.msg, "", "", function () {
                    })

                }
            });
        }
    });


    $("#netDiverseSaveButton").on("click", function (e) {//"+" 暂存
        var imgs = "";
        $('#billForm').find(".zl-img-wrapper").find("a").each(function () {
            imgs = imgs + "," + $(this).attr("data-image")
        });
        // 保存附件 新增合同时
        if ($("[name='netcommentId']").val() == "") {
            var attachmentIds = "";
            $("#uploadModal").find(".zl-attach-del").each(function () {
                attachmentIds = attachmentIds + "," + $(this).attr("data-date");
            })
            if (attachmentIds != "") {
                $("#attachments").val(attachmentIds.substring(attachmentIds.indexOf(",") + 1))
            }
        }
        var justMall = true
        if (valitateForm('#billForm', justMall)) {
            $(".zl-loading").fadeIn()
            $.post('saveTemp.htm?imgs=' + imgs, $('#billForm').serialize(), function (result) {
                var response2 = eval('(' + result + ')');
                if (response2.code == "0") { //审批成功
                    $(".zl-loading").fadeOut()
                    $("#masterId").val(response2.data)
                    alert(response2.msg, "", "", function () {
                        self.location = netcommentWeb_Path + '/netcomment/diverse/index.htm';
                    })

                } else if (response2.code == "1") { //审批失败
                    $(".zl-loading").fadeOut()
                    alert(response2.msg, "", "", function () {
                        self.location = netcommentWeb_Path + '/netcomment/diverse/index.htm';
                    })

                }
            })
        }
    });

    $("#multiple_contract_ledger_detail").on('click', ".zl-glyphicon-red", function (e) { //删除一行
        var id = $(this).closest("table").attr("id")
        if (id == "lateFeePlusTable" || id == "otherFeeTable") {//其他费用或滞纳金
            $(this).closest("tr").remove();
        } else {
            var isHide = $(this).next().is(":hidden")
            if (isHide && $(this).closest("tr").find("th").first().attr("year") != undefined) {//第一行
                var startTime = $(this).closest("tr").find("input").eq(2).val();
                $(this).closest("tr").next().find("input").eq(2).val(startTime)
                rentCalcul($(this).closest("tr").next().find("input").eq(3));
                var year = $(this).closest("tr").find("input").eq(1).val();
                var row = $(this).closest("tbody").find("th[year=" + year + "]").attr("rowspan");
                $(this).closest("tbody").find("th[year=" + year + "]").attr("rowspan", parseInt(row) - 1);
                $(this).closest("tr").next().prepend($(this).closest("tbody").find("th[year=" + year + "]"))
                $(this).closest("tr").remove();
            } else if (isHide) { //除开第一行与最后一行
                var startTime = $(this).closest("tr").find("input").eq(2).val();
                $(this).closest("tr").next().find("input").eq(2).val(startTime)
                rentCalcul($(this).closest("tr").next().find("input").eq(3));

                var year = $(this).closest("tr").find("input").eq(1).val();
                var row = $(this).closest("tbody").find("th[year=" + year + "]").attr("rowspan");
                $(this).closest("tbody").find("th[year=" + year + "]").attr("rowspan", parseInt(row) - 1);
                $(this).closest("tr").remove();

            } else {   //最后一行
                var year = $(this).closest("tr").find("input").eq(1).val();
                var row = $(this).closest("tbody").find("th[year=" + year + "]").attr("rowspan");
                if (row > 1) {
                    var endTime = $(this).closest("tr").find("input").eq(3).val();
                    $(this).closest("tr").prev("tr").find("em").eq(1).show()
                    $(this).closest("tr").prev("tr").find("input").eq(3).val(endTime)
                    rentCalcul($(this).closest("tr").prev("tr").find("input").eq(3));

                    $(this).closest("tbody").find("th[year=" + year + "]").attr("rowspan", parseInt(row) - 1);
                    $(this).closest("tr").remove();

                }
            }
            rentSumCalcul()
        }
    })


    $(".zl-glyphicon-blue").on("click", function (e) {//"+" 添加一行
        var buttName = $(this).attr("name");
        var index = feeListsize - 0;
        feeOtherListsize = feeOtherListsize - 0;
        if (buttName == "lateFeePlus") {

            var htm = "<tr><input type='hidden' value='03' name='rent.feeList[" + index + "].feeType'><input type='hidden' value='01' name='rent.feeList[" + index + "].billingType'>" + "<td class='zl-edit required'>  " + "<div class='zl-search-wrapper pull-left'>\n" + "<div class='zl-search'>\n" + "<input type='hidden' name='rent.feeList[" + index + "].lateFeeId' value='' tabindex='-1'>\n" + "<input maxlength='15'tablefeetype='late' type='text' name='rent.feeList[" + index + "].lateFeeName' class='form-control js-account-fee-types ui-autocomplete-input'  placeholder='费用项' tabindex='-1' autocomplete='off'>\n" + "</div>" + "</div>" + "</td>" +
                "<td class='zl-edit required'>    <div class='zl-input-wrapper-inline zl-input-wrapper-add-on clearfix'>" +
                "<input maxlength='15' type='number' class='form-control' tabindex='-1' name='rent.feeList[" + index + "].lateFeeProp' value=''>" +
                "<span class='zl-add-on'>%</span>    " +
                "</div></td>" +
                '<td class="zl-edit required"> <div class="zl-input-wrapper-inline zl-input-wrapper-add-on clearfix"> ' +
                ' <input maxlength="15" type="number" name="rent.feeList[' + index + '].lateFeeTimeApply"  class="form-control"><span class="zl-add-on">天</span></div></td>' +
                "<td class='text-right '>    <span>    <em class='glyphicon glyphicon-minus-sign zl-glyphicon zl-glyphicon-red'></em>    </span></td></tr>"


            $("#lateFeePlusTable").find("tbody").append(htm);
            bindAutoInput("rent.feeList[" + index + "].lateFeeName");
            feeListsize++;
        } else if (buttName == "otherFeePlus") {  //其他费用 ,去除费用周期
            var htm_lastPayTime = '<td style="display: none" class="zl-edit required"><div class="btn-group zl-dropdown-inline open">    <input type="hidden" name="rent.otherFeeList[' + feeOtherListsize + '].payCycleApply" >    <button type="button" class="btn btn-default dropdown-toggle zl-dropdown-btn" data-toggle="dropdown" aria-expanded="true">        选择最迟缴费日    </button>    <ul class="dropdown-menu" name="lastPayDate">\n' + '<li><a onclick="doSelect(this)" key="01">1日</a>            </li>\n' + '<li><a onclick="doSelect(this)" key="02">2日</a>            </li>\n' + '<li><a onclick="doSelect(this)" key="03">3日</a>            </li>\n' + '<li><a onclick="doSelect(this)" key="04">4日</a>            </li>\n' + '<li><a onclick="doSelect(this)" key="05">5日</a>            </li>\n' + '<li><a onclick="doSelect(this)" key="06">6日</a>            </li>\n' + '<li><a onclick="doSelect(this)" key="07">7日</a>            </li>\n' + '<li><a onclick="doSelect(this)" key="08">8日</a>            </li>\n' + '<li><a onclick="doSelect(this)" key="09">9日</a>            </li>\n' + '<li><a onclick="doSelect(this)" key="10">10日</a>            </li>\n' + '<li><a onclick="doSelect(this)" key="11">11日</a>            </li>\n' + '<li><a onclick="doSelect(this)" key="12">12日</a>            </li>\n' + '<li><a onclick="doSelect(this)" key="13">13日</a>            </li>\n' + '<li><a onclick="doSelect(this)" key="14">14日</a>            </li>\n' + '<li><a onclick="doSelect(this)" key="15">15日</a>            </li>\n' + '<li><a onclick="doSelect(this)" key="16">16日</a>            </li>\n' + '<li><a onclick="doSelect(this)" key="17">17日</a>            </li>\n' + '<li><a onclick="doSelect(this)" key="18">18日</a>            </li>\n' + '<li><a onclick="doSelect(this)" key="19">19日</a>            </li>\n' + '<li><a onclick="doSelect(this)" key="20">20日</a>            </li>\n' + '<li><a onclick="doSelect(this)" key="21">21日</a>            </li>\n' + '<li><a onclick="doSelect(this)" key="22">22日</a>            </li>\n' + '<li><a onclick="doSelect(this)" key="23">23日</a>            </li>\n' + '<li><a onclick="doSelect(this)" key="24">24日</a>            </li>\n' + '<li><a onclick="doSelect(this)" key="25">25日</a>            </li>\n' + '<li><a onclick="doSelect(this)" key="26">26日</a>            </li>\n' + '<li><a onclick="doSelect(this)" key="27">27日</a>            </li>\n' + '<li><a onclick="doSelect(this)" key="28">28日</a>            </li>\n' + '<li><a onclick="doSelect(this)" key="99">每月最后一天</a>            </li>                </ul></div>\n' + '</td>'
            var htm = "<tr>" + "<td class='zl-edit required'>" + "<div class='zl-search-wrapper pull-left'>\n" + "<div class='zl-search'>\n" + "<input type='hidden' name='rent.otherFeeList[" + feeOtherListsize + "].feeTypeCode' value='' tabindex='-1'>\n" + "<input type='text' name='rent.otherFeeList[" + feeOtherListsize + "].feeName' class='form-control js-account-fee-types ui-autocomplete-input' tablefeetype='other' placeholder='费用项' " + "tabindex='-1' autocomplete='off'>\n" + "</div>\n" + "</div></td>"
                + "<td class='zl-edit required'><div class='btn-group zl-dropdown-inline'>    " + "<input type='hidden' name='rent.otherFeeList[" + feeOtherListsize + "].accountType' value=''>    " + "<button type='button' class='btn btn-default dropdown-toggle zl-dropdown-btn' data-toggle='dropdown'></button>   " + " <ul class='dropdown-menu' name='otherPaytypeSelect'><li>    <a key='0'  onclick='doSelect(this)'>周期</a></li><li>    <a key='1'  onclick='doSelect(this)'>一次性</a></li></ul></div></td>" +
                "" +
                // "<td class='zl-edit'><div class='btn-group zl-dropdown-inline'>    <input type='hidden' name='rent.otherFeeList[" + feeOtherListsize + "].feeCycle' value=''>    <button type='button' class='btn btn-default dropdown-toggle zl-dropdown-btn' data-toggle='dropdown'>    </button>    <ul class='dropdown-menu'><li>    <a key='1'  onclick='doSelect(this)'>按月</a></li><li>    <a key='0'  onclick='doSelect(this)'>一次性</a></li></ul></div></td>" +
                "<td class='zl-edit required'>" +
                "<div class='input-group zl-datetimepicker' style='width:100%;'>\n" +
                "    <input readonly maxlength='15'type='text' class='form-control' name='rent.otherFeeList[" + feeOtherListsize + "].payCycleApply' value=''>\n" +
                "</div>\n" +
                "</td>" + htm_lastPayTime +
                "</td><td class='zl-edit required'><input maxlength='15' type='number' name='rent.otherFeeList[" + feeOtherListsize + "].feeStandard' value=''></td><td class='zl-edit'><input type='number' name='rent.otherFeeList[" + feeOtherListsize + "].taxRate' value='0' readonly></td><td class='text-right'><span><em class='glyphicon glyphicon-minus-sign zl-glyphicon zl-glyphicon-red'></em></td></tr>"


            $("#otherFeeTable").find("tbody").append(htm);
            bindAutoInput("rent.otherFeeList[" + feeOtherListsize + "].feeName");
            bindDatePicker("rent.otherFeeList[" + feeOtherListsize + "].payCycleApply");
            feeOtherListsize++;
        }
    });


    $(".dropdown-menu>li>a").on("click", function (e) {//下拉选项
        doSelect(this);
    });

    /**
     * 租赁开始时间与租赁结束时间选择
     * 生成租金年月
     * 生成物管费年月
     *
     *
     *
     * */
    $("#leaseBiginTime,#contractEndDate").datetimepicker({
        format: "yyyy-mm-dd",
        todayBtn: "linked",
        startView: 2,
        minView: 2,
        autoclose: true,
        language: "zh-CN"
    }).on('changeDate', function (event) {
        var dataName = $(event.target).parent().attr("data-name");
        var endTime = $("#contractEndDate").val();
        var biginTime = $("#leaseBiginTime").val();

        if (dataName == "leaseBiginTime") {//限制租赁结束时间加一天(已注释)
            contractDateSet("s", event.date)
            if (biginTime >= endTime) {  //开始时间小于结束时间时,清空结束时间
                $("#contractEndDate").val("");
                $("#tenancy").val("");
                $("[name=rent-main]").find("tbody").remove()//删除列表
                $("[name=rent-main]").find("colgroup").remove()//删除列表
            }
            var startTime = event.date;
            // startTime.setDate(startTime.getDate() + 1)
            $('#contractEndDate').datetimepicker('setStartDate', startTime);
        } else if (dataName == "leaseEndTime") {
            contractDateSet("e", new Date(biginTime), event.date)
            var startTime = event.date;
            if (biginTime == "") {
                alert("请选择租赁开始时间");
                $("#contractEndDate").val("");
                return;
            } else {
                // $('#leaseBiginTime').datetimepicker('setEndDate', startTime);
            }

        }

        if (endTime != "" && biginTime != "") { //开始时间与结束时间都不为空时,自动计算租赁日期
            var date1 = new Date(biginTime)
            var date2 = new Date(endTime)
            var s1 = date1.getTime(), s2 = date2.getTime();
            if (s2 >= s1) {
                changeList();
            } else {
                $("#tenancy").val("");
            }
        }

    }).on('hide', function (event) {

    });

    var container = $("#billForm");
    container.on("click", ".zl-thumbnail-wrapper em", function (e) {  //删除图片
        e.stopPropagation();
        e.preventDefault();
        var imgkk = "," + $(this).parents().closest("li").find("a").attr("data-image");
        $(this).closest("li").remove();

    })

    $("#imgFileUpload").ysSimpleUploadFile({ // 图片上传
        changeCallback: function (file) {
            var imgs = ""
            $('#billForm').find(".zl-img-wrapper").find("a").each(function () {
                imgs = imgs + "," + $(this).attr("data-image")
            });
            if (imgs.split(",").length > 5) {
                alert("平面图超出五张!");
                return
            }

            var fileReader = new FileReader();
            $(this).parent().height(136);
            var that = this;
            fileReader.onload = function () {
                $(that).next().css("display", "block");
                imgkkAll = $(that).attr("al");
                compressImage(1000, 1000, this.result, null, function (dataUrl) {
                    var html = "<li><div class='zl-thumbnail-wrapper'><em class='zl-icon-btn zl-icon-btn-del'></></em> <a  class='zl-thumbnail' style='background-image:url(" + dataUrl + ")'><em></em></a></div></li>";
                    $(that).next().children().append(html);
                    var formData = new FormData();
                    formData.append("action", "1002");
                    formData.append("single", 1);
                    formData.append("category", "FILE_ENROLMENT_DIVERSE");
                    formData.append("targetId", "LD" + show() + randomNum());
                    formData.append('file', file);

                    jQuery.ajax({
                        url: fileWeb_Path + 'sdk/platform/file',
                        type: 'POST',
                        data: formData,
                        dataType: 'json',
                        async: true,
                        cache: false,
                        contentType: false,
                        processData: false,
                        success: function (response) {
                            if (response.success) {
                                var myurls = accessUrl + response.data.path;
                                $(that).next().find("li:last-child a").attr("data-image", myurls);
                                $(that).next().find("li:last-child a").attr("data-image", myurls);
                            } else {
                                hideLoading(); // 隐藏 loading
                            }
                        },
                        error: function (data) {
                            alert("操作失败，请重试！");
                        }
                    })
                });
            };
            fileReader.readAsDataURL(file);
        }
    });

    //附件上传
    pageView.fileupload = function () {
        $("#uploadFile").fileupload({
            pasteZone: null,
            url: "uploadfile.htm",
            dataType: 'json',
            add: function (e, data) {
                pageView.uploadFiles(data.files[0], function (item) {
                    var formData = new FormData();
                    formData.append('path', item)
                    if ($("[name='netcommentId']").val() != undefined) formData.append('contractId', $("[name='netcommentId']").val())
                    // {path: item, contractId: $("[name='netcommentId']").val()};
                    data.formData = formData
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
                    '<span class="col-md-2" style="text-align: center;"><a data-date="' + result.id + '" onclick="deleteFile(this, ' + result.id + ')" class="zl-attach-del" style="cursor: pointer;">删除</a></span>' +
                    '</li>';
                $(html).appendTo('#files');

                var attachments = "<input type='text' id='attachments_" + result.id + "' name='attachmentId' value='" + result.id + "' />";
                $(attachments).appendTo('#attachmentDiv');
                // var attachmentSize = $("#attachmentSize_" + $("#uploadFile").attr("progressId"));
                // attachmentSize.text(parseInt(attachmentSize.text()) + 1);
            }
        }).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');
    };

    pageView.uploadFiles = function (file, callback) {
        var formData = new FormData();
        formData.append("action", "1002");
        formData.append("single", 1);
        formData.append("category", "net_diverse_contract");
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
        if (confirm("确认删除？")) {

            $.ajax({
                url: "delAttachmentFile.htm",
                type: "POST",
                data: {attachmentId: id},
                success: function (result) {
                    result = eval("(" + result + ")");
                    if (result.code == 0) {
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


    pageView.init = function () { //
        $("#preloader").fadeOut("fast");
        $('.zl-img-wrapper').magnificPopup({
            delegate: '.zl-thumbnail',
            type: 'image',
            /*  gallery: {
                  enabled: true
              },*/
        });
        $("#rentPaytime").next().find("input").datetimepicker({  //一次性租金缴费日期
            todayBtn: "linked",
            startView: 2,
            minView: 2,
            autoclose: true,
            language: "zh-CN",
            format: "yyyy-mm-dd"

        }).on('show', function (ev) {
        });
        pageView.fileupload();
    };

    return pageView;

})(window.jQuery);

$(document).ready(function () {
        pageView.init();
        changeFeeTitle();
        rentSumCalcul();
        bindDatePicker();
        changeTax();
        contractDateCheck()
        bindDatePicker("fitupLastestPaytime");
        selectShopList.init("", "single");
        selectUnit.init("", "multi");
        var biginTime = $("#leaseBiginTime").val();
        var endTime = $("#contractEndDate").val();
        var mallID = $("#mallId").val();
        if (mallID != "") { //点位与租户初始化
            initStoreAndCompanyInfo(mallID);
        }
        if (biginTime != "") { //限制结束时间
            var startTime = new Date(biginTime)
            $('#contractEndDate').datetimepicker('setStartDate', startTime);
        }

        $.ajax({ //费用项
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
                    _feeTypeList = availableTags;
                    $("body").data("_feeTypeList", availableTags);
                    bindAutoInput();
                }
            }

        });
        var storeIdsExt = $("#storeNos").val();
        if (storeIdsExt != undefined) {

            $.ajax({ //获取预算
                cache: true,
                type: "POST",
                dataType: "json",
                data: {diverseIds: storeIdsExt},
                url: "diverseBudget.htm",
                async: true,
                error: function (request) {
                    alert("系统异常");
                },
                success: function (resultData) {
                    if (resultData) {
                        diverseBudget = resultData.data.toFixed(2);
                    }
                }

            });
        }
        var companyId = $("#companyId").val(); //初始租户不为空时,加载品牌
        if (companyId != null && companyId != "") {
            // 查询品牌详情
            $.ajax({
                cache: false,
                type: "POST",
                dataType: "json",
                url: netcommentWeb_Path + "netcomment/getIbCompanyDetail.htm",
                data: {id: companyId},
                error: function (request) {
                    alert("系统异常");
                },
                success: function (resultData) {
                    var ibBrands = resultData.ibBrands;
                    var result = [];
                    if (ibBrands && ibBrands.length > 0) {
                        for (var i = 0; i < ibBrands.length; i++) {
                            var brand = ibBrands[i];
                            var option = {};
                            var key = brand.id;
                            var value = brand.brandName;
                            option['value'] = key;
                            option['text'] = value;
                            result.push(option);
                        }
                    }
                    //$("#companyName")
                    var html = "";
                    $(result).each(function () {
                        var value = this['value'];
                        var brandName = this['text'];
                        html += "<li><a onclick='doSelect(this)'data-id='" + value + "' key='" + key + "' data-name='" + brandName + "'>" + brandName + "</a></li>";
                    });
                    $("[name=brandSelect]").empty()
                    $("[name=brandSelect]").append(html);
                }
            });
        }

        if ($("[name=feeFitupDeposit]:checked").val() == undefined) {
            $("[name=feeFitupDeposit][value='1']").click()
        }

    }
);

//合同开始时间限制
/**
 *sb需求
 *flag: s 开始时间验证
 *flag： e 结束时间验证
 *
 * */
function contractDateSet(flag, date, endDate) {
    //合同开始时间限制
    if ($("[name=feeFitupDeposit]:checked").val() != "0") {//允许重合
        return
    }

    var storeIdsExt = $("[name=storeNos]").val();
    //合同开始时间限制
    if (storeIdsExt == "undefined" || storeIdsExt == "") {//无点位选择
        return
    }
    var netId = $("[name=netcommentId]").val() == "undefined" ? "" : $("[name=netcommentId]").val();
    if (storeIdsExt != undefined) {
        $.ajax({ //获取合同最早开始日
            cache: true,
            type: "POST",
            dataType: "json",
            data: {diverseIds: storeIdsExt, netId: netId, flag: flag, date: date, date2: endDate},
            url: "diverseLastContDate.htm",
            async: true,
            error: function (request) {
                alert("系统异常");
            },
            success: function (resultData) {
                if (resultData.data == undefined) {
                    console.log("return")
                    return
                }
                if (resultData.data.startDate) {
                    var _startTime = new Date(resultData.data.startDate);
                    var _endTime = new Date(resultData.data.endDate);
                    alert("已有该时间段的合同（" + _startTime.format('yyyy-MM-dd') + " ~ " + _endTime.format('yyyy-MM-dd') + ")，请返回修改合同期。");
                    if (flag == 's') {
                        $("#leaseBiginTime").val("");
                        $("#contractEndDate").val("");
                        $("[name=tenancy]").val("");

                    } else if (flag == "e") {
                        $("#contractEndDate").val("");

                    }

                } else {
                    if (flag == 's') {
                        var endTime = $("#contractEndDate").val();
                        var biginTime = $("#leaseBiginTime").val();
                        if (!isNaN(new Date(endTime)))
                            contractDateSet("e", new Date(biginTime), new Date(endTime))
                    }

                }
            }

        });
    }

}

function contractDateCheck() {
    //
    if ($("[name=feeFitupDeposit]:checked").val() != "0") {//允许重合
        return true;
    }
    var endTime = $("#contractEndDate").val();
    var biginTime = $("#leaseBiginTime").val();
    contractDateSet("s", new Date(biginTime), null)

}


function bindAutoInput(_thisName) {
    var _input = "";
    if (_thisName == undefined) {
        _input = ".js-account-fee-types"
    } else {
        _input = "[name='" + _thisName + "']";
    }
    var source
    if (_input.indexOf("rent.otherFeeList") != -1) { //其它费用项

        source = otherFeeSet();

    } else {

        source = _feeTypeList
    }
    $(_input).autocomplete({
        source: source,
        minLength: 0,
        select: function (event, ui) {
            var feeCode = ui.item.value;
            this.value = ui.item.label;
            var tableFeeType = $(this).attr("tablefeetype")
            $(this).prev().val(feeCode)
            $.ajax({
                cache: true,
                type: "POST",
                dataType: "json",
                data: {feeCode: feeCode, mallId: $("[name=mallId]").val(), tableFeeType: tableFeeType},
                url: netcommentWeb_Path + "netcomment/selectFeeInfoByCode.htm",
                async: true,
                error: function (request) {
                    alert("系统异常");
                },
                success: function (resultData) {
                    if ("late" == tableFeeType) {
                        $(event.target).parents("tr").find("input[type='number']").eq(0).val(resultData.data.value);
                        $(event.target).parents("tr").find("input[type='number']").eq(1).val(resultData.data.label);

                    }
                    if ("coll" == tableFeeType) {
                        $(event.target).parents("tr").find("input[type=text]").val(resultData.data.value);
                        $(event.target).parents("tr").find("input[name$=openBank]").val(resultData.data.label);
                        $(event.target).parents("tr").find("input[name$=bankAccountId]").val(resultData.data.proees);
                        $(event.target).parents("tr").find("input[name$=feeCode]").val(feeCode);
                    }
                    if ("other" == tableFeeType) {
                        if (resultData.data.tax * 0 != 0) resultData.data.tax = 0
                        $(event.target).parents("tr").find("input[name$=taxRate]").val(resultData.data.tax);
                    }

                }
            });
            return false;
        }
    });

}


function changeFeeTitle() {//申请租金的单位

    var rentType = $("input[name='rentType']:checked").val();//租金方式 :0-保底租金  1-纯扣租金 2-两者取高 3-一次性
    var rentUnit = $("input[name='rentUnit']:checked").val();//记租单位 :0-按单价  1-按面积
    var rentUnitPrice = $("input[name='rentUnitPrice']:checked").val();//单价 :0-日  1-周 2-月
    var rentUnitName = "申请租金(元/" + (rentUnitPrice == "0" ? "日" : (rentUnitPrice == "1" ? "月" : "年")) + (rentUnit == "0" ? "" : "/m<sup>2</sup>") + ")"
    $("#feeTypeTitle").html(rentType == "01" ? "固定租金" : (rentType == "02" ? "提成租金" : (rentType == "03" ? "两者取高" : "一次性租金")))

    if ($("[name=initRentUnit]") != undefined) {
        $("[name=initRentUnit]").html(rentUnitName)
    }

}

/**
 * 拆分开始时间与结束时间
 *1,租赁最终开始时间与结束时间不可改变
 *
 *
 *
 * */
function bindDatePicker(_name) {
    if (_name != undefined) {
        $("[name='" + _name + "']").datetimepicker({
            format: "yyyy-mm-dd",
            todayBtn: "linked",
            startView: 2,
            minView: 2,
            autoclose: true,
            language: "zh-CN"

        }).on('show', function (ev) {
        });
        return;
    }

    $(".js-date-start,.js-date-end").datetimepicker({
        format: "yyyy-mm-dd",
        todayBtn: "linked",
        startView: 2,
        minView: 2,
        autoclose: true,
        language: "zh-CN"

    }).on('show', function (ev) {

        var starttime = $(this).closest("td").find("input").eq(0).val()
        var endtime = $(this).closest("td").find("input").eq(1).val()

        var contractStarttime = $("#leaseBiginTime").val() //合同开始时间
        var contractEndtime = $("#contractEndDate").val()//合同结束时间

        if ($(this).attr("class").indexOf("js-date-end") != -1) { //结束时间
            if (endtime == contractEndtime) {
                $(this).datetimepicker('setStartDate', endtime);
                $(this).datetimepicker('setEndDate', endtime);
            } else {


                $(this).datetimepicker('setStartDate', contractStarttime);
                $(this).datetimepicker('setEndDate', contractEndtime);
            }
        } else {//开始时间  //限制同行结束时间的日期
            if (starttime == contractStarttime) {
                $(this).datetimepicker('setStartDate', starttime);
                $(this).datetimepicker('setEndDate', starttime);
            } else {
                $(this).datetimepicker('setStartDate', contractStarttime);
                $(this).datetimepicker('setEndDate', contractEndtime);
            }
            $(this).closest("td").find("input").eq(1).datetimepicker('setStartDate', starttime);


        }
    }).on('hide', function (event) {


    }).on('changeDate', function (event) {


        //一次性费用时不必计算金额
        var starttime = $(this).closest("td").find("input").eq(0).val()
        var endtime = $(this).closest("td").find("input").eq(1).val()
        var contractStarttime = $("#leaseBiginTime").val() //合同开始时间
        var contractEndtime = $("#contractEndDate").val()//合同结束时间

        if ($(event.target).attr("class").indexOf("js-date-end") != -1) { //结束时间
            if (endtime == contractEndtime) {
            } else {

                var time = $(event.target).val();
                var startTime = new Date(time)
                startTime.setDate(startTime.getDate() + 1)
                $(event.target).closest("tr").next().find(".js-date-start").val(startTime.format('yyyy-MM-dd'))
                rentCalcul($(event.target).closest("tr").next().find(".js-date-start"))
            }
        } else {//开始时间
            if (starttime == contractStarttime) {

            } else {
                var time = $(event.target).val();
                var startTime = new Date(time)
                startTime.setDate(startTime.getDate() - 1)
                $(event.target).closest("tr").prev().find(".js-date-end").val(startTime.format('yyyy-MM-dd'))
                rentCalcul($(event.target).closest("tr").prev().find(".js-date-end"))
            }

        }

        rentCalcul($(event.target));


    })
}


var tempSize = 0;//暂存feeListsize的大小,删除费项时设置初始大小
function changeList() { //当租赁时间发生改变时,或租赁条件变化时,改变租金列表项
    feeListsize = feeListsize - tempSize;
    var endTime = $("#contractEndDate").val();
    var biginTime = $("#leaseBiginTime").val();
    if (endTime == "" || biginTime == "") return;
    var years = setTables(biginTime, endTime)  //设置租赁日期

    var rentUnit = $("input[name='rentUnit']:checked").val();//记租单位 :0-按单价  1-按面积
    var rentType = $("input[name='rentType']:checked").val();//租金方式 :0-保底租金  1-纯扣租金 2-两者取高 3-一次性租金
    var chargeType = $("input[name='chargeType']:checked").val();//收费类型 :0-场地  1-仓库 2-广告位  3-临时场地
    var rentUnitPrice = $("input[name='rentUnitPrice']:checked").val();//单价 :0-日  1-周 2-月
    var rentUnitPriceName = $("input[name='rentUnitPrice']:checked").attr("data-name");//单价字符  日周月
    var rentUnitName = $("input[name='rentUnit']:checked").val() == "1" ? "/m<sup>2</sup>" : "";//记租单位字符  按单件"" 按面积"m2"
    // 保底租金单价头
    var html_bdRent_header = '<colgroup><col width="12%"> <col width="20%"> <col width="90px"> <col width="10%"> <col width="10%"> <col width="10%"><col width="10%"><col width="10%"><col width="10%"></colgroup>'
        + "<tbody><tr><th title='租赁年度' >租赁年度</th><th colspan='2'>租赁期间</th><th>预算</th> <th name='initRentUnit'>申请租金(元/" + rentUnitPriceName + rentUnitName + ")</th><th>租金总额(元)</th><th>含税总额(元)</th><th>不含税总额 (元)</th><th>税额(元)</th></tr>";
    //租金按单价-提成租金
    var html_extract_header = '<colgroup><col width="12%"> <col width="35%"> <col width="13%"> <col width="20%"> <col width="20%"></colgroup>'
        + "<tbody><tr><th title='租赁年度'>租赁年度</th><th <th colspan='2'>租赁期间</th><th>品类</th> <th>申请扣率 (%)</th></tr>";
    // 两者取高单价头
    var html_higherRent_header = '<colgroup><col width="8%"> <col width="30%"> <col width="90px"> <col width="9%"> <col width="10%"> <col width="11%"><col width="8%"><col width="8%"><col width="8%"><col width="8%"></colgroup>'
        + "<tbody><tr><th title='租赁年度' style='white-space:  normal;'>租赁年度</th><th colspan='2'>租赁期间</th><th>品类</th> <th style='white-space:  normal;'>申请扣率(%)</th> <th  name='initRentUnit' style='white-space:  normal;'>申请租金(元/" + rentUnitPriceName + rentUnitName + ")</th><th>申请总额(元)</th><th>含税总额(元)</th><th>不含税总额(元)</th><th>税额(元)</th></tr>";
    // 一次性租金头
    var html_oneRent_header = ' <colgroup><col width="10%"><col width="30%"><col width="8%"><col width="11%"><col width="11%"><col width="10%"><col width="10%"><col width="10%">  </colgroup>'
        + "<tbody><tr><th title='租赁年度'>租赁年度</th><th colspan='2'>租赁期间</th><th>预算(元/月)</th> <th>申请总额(元)</th><th>含税总额(元)</th><th>不含税总额(元)</th><th>税额(元)</th></tr>";

    var html_bdRent_end = "<tr><th> 合计</th><td class='zl-edit'  colspan='8'> <input type='text' id='rentSum' value='' name='' readonly ></tr></body>";
    $("[name=rent-main]").find("tbody").remove()//删除列表
    $("[name=rent-main]").find("colgroup").remove()//删除列表
    $("#zl-fixed-management-table tbody tr").remove(); //物管费
    var append = '';
    for (var i = 0; i < years; i++) {
        var startT = new Date(biginTime);//开始时间 1.第一年时开始时间是租赁开始时间,
        var endT = new Date(biginTime);//结束时间
        if (i != years - 1) {//不是最后一年
            endT.setFullYear(startT.getFullYear() + 1 + i);//时间加一年
            endT.setDate(startT.getDate() - 1);//时间加一年
// startT.setDate(startT.getDate() +1);//时间减一天
        } else {
            endT = new Date(endTime);
        }
        startT.setFullYear(startT.getFullYear() + i);


        var year = i + 1;
        var html_bdRent_body = "<tr> <th year='" + year + "'> 第 " + year + "年</th>\n" +
            "<input type='hidden' value='01' name='rent.feeList[" + feeListsize + "].feeType'><input type='hidden' value='" + year + "' name='rent.feeList[" + feeListsize + "].rentYear'>" +
            "<td colspan='1' class='zl-edit required'><div class='input-group zl-datepicker zl-datetime-range pull-left' data-type='month' data-start='2017-11' style='width:100%'>\n" +
            "<input readonly type='text' name='rent.feeList[" + feeListsize + "].startDate' class='form-control input-sm js-date-start' value='" + startT.format('yyyy-MM-dd') + "' tabindex='-1'>\n" +
            "<div class='input-group-addon input-xs'>~</div>\n" +
            "<input readonly type='text' name='rent.feeList[" + feeListsize + "].endDate' class='form-control input-sm js-date-end' value='" + endT.format('yyyy-MM-dd') + "' tabindex='-1'></div>\n" + "</td>" +
            "<th class='text-left'>\n" + "<span class='zl-add-minus-wrapper'>\n" +
            " <em class='glyphicon glyphicon-minus-sign zl-glyphicon zl-glyphicon-red' ></em>\n" +
            " <em class='glyphicon glyphicon-plus-sign zl-glyphicon zl-glyphicon-blue' onclick='addPeriodItem(this," + year + ")'></em></span></th>" +
            "<td class='zl-edit'><input type='number' value='" + diverseBudget + "' name='rent.feeList[" + feeListsize + "].rentBudget' readonly></td>\n" +
            "<td class='zl-edit required'><input type='number' value='' placeholder='-' onporpertychange='rentCalcul(this)' oninput='rentCalcul(this)' name='rent.feeList[" + feeListsize + "].standard' maxlength='15'></td>\n" +
            "<td class='zl-edit'><input type='number' value=''  placeholder='-' name='rent.feeList[" + feeListsize + "].totalMonth' readonly></td>" +
            "<td class='zl-edit'><input type='number' value='' placeholder='-' name='rent.feeList[" + feeListsize + "].apply' readonly></td>" +
            "<td class='zl-edit'><input type='number' value='' placeholder='-' name='rent.feeList[" + feeListsize + "].noTaxTotalMonth' readonly></td>" +
            "<td class='zl-edit'><input type='number' value=''  placeholder='-' name='rent.feeList[" + feeListsize + "].taxMonth' readonly></td>"


//一次性
        var html_one_body = "<tr> <th year='" + year + "'> 第 " + year + "年</th>\n" +
            "<input type='hidden' value='01' name='rent.feeList[" + feeListsize + "].feeType'><input type='hidden' value='" + year + "' name='rent.feeList[" + feeListsize + "].rentYear'>" +
            "<td colspan='1' class='zl-edit required'><div class='input-group zl-datepicker zl-datetime-range pull-left' data-type='month' data-start='2017-11' style='width:100%'>\n" +
            "<input readonly type='text' name='rent.feeList[" + feeListsize + "].startDate' class='form-control input-sm js-date-start' value='" + startT.format('yyyy-MM-dd') + "' tabindex='-1'>\n" +
            "<div class='input-group-addon input-xs'>~</div>\n" +
            "<input readonly type='text' name='rent.feeList[" + feeListsize + "].endDate' class='form-control input-sm js-date-end' value='" + endT.format('yyyy-MM-dd') + "' tabindex='-1'></div>\n" + "</td>" +
            "<th class='text-left'>\n" + "<span class='zl-add-minus-wrapper'>\n" +
            " <em class='glyphicon glyphicon-minus-sign zl-glyphicon zl-glyphicon-red' ></em>\n" +
            " <em class='glyphicon glyphicon-plus-sign zl-glyphicon zl-glyphicon-blue' onclick='addPeriodItem(this," + year + ")'></em></span></th>" +
            "<td class='zl-edit'><input type='number' value='" + diverseBudget + "' name='rent.feeList[" + feeListsize + "].rentBudget' readonly></td>\n" +
            "<td class='zl-edit required'><input type='number' value='0'  name='rent.feeList[" + feeListsize + "].totalMonth' onporpertychange='rentCalcul(this)' oninput='rentCalcul(this)'></td>" +
            "<td class='zl-edit required'><input readonly type='number' value='0'  name='rent.feeList[" + feeListsize + "].apply'></td>" +
            "<td class='zl-edit '><input readonly type='number' value='0'  name='rent.feeList[" + feeListsize + "].noTaxTotalMonth'></td>" +
            "<td class='zl-edit '><input readonly type='number' value='0'  name='rent.feeList[" + feeListsize + "].taxMonth'></td>"
//两者取高
        var html_higherRent_body = "<tr> <th year='" + year + "'> 第 " + year + "年</th>\n" +
            "<input type='hidden' value='01' name='rent.feeList[" + feeListsize + "].feeType'><input type='hidden' value='" + year + "' name='rent.feeList[" + feeListsize + "].rentYear'>" +
            "<td colspan='1' class='zl-edit'><div class='input-group zl-datepicker zl-datetime-range pull-left' data-type='month' data-start='2017-11' style='width:100%'>\n" +
            "<input readonly type='text' name='rent.feeList[" + feeListsize + "].startDate' class='form-control input-sm js-date-start' value='" + startT.format('yyyy-MM-dd') + "' tabindex='-1'>\n" +
            "<div class='input-group-addon input-xs'>~</div>\n" +
            "<input readonly type='text' name='rent.feeList[" + feeListsize + "].endDate' class='form-control input-sm js-date-end' value='" + endT.format('yyyy-MM-dd') + "' tabindex='-1'></div>\n" + "</td>" +
            "<th class='text-left'>\n" + "<span class='zl-add-minus-wrapper'>\n" +
            " <em class='glyphicon glyphicon-minus-sign zl-glyphicon zl-glyphicon-red' ></em>\n" +
            " <em class='glyphicon glyphicon-plus-sign zl-glyphicon zl-glyphicon-blue' onclick='addPeriodItem(this," + i + ")'></em></span></th>" +
            "<td class='zl-edit'><input type='text' value='全品类' name='rent.feeList[" + feeListsize + "].remark' readonly></td>\n" +
            "<td class='zl-edit required'><input type='number' value='' name='rent.feeList[" + feeListsize + "].discountRate'></td>" +
            "<td class='zl-edit required'><input type='number' value='' name='rent.feeList[" + feeListsize + "].standard' onporpertychange='rentCalcul(this)' oninput='rentCalcul(this)'></td>" +
            "<td class='zl-edit '><input readonly type='number' value='' name='rent.feeList[" + feeListsize + "].totalMonth'></td>" +
            "<td class='zl-edit'><input  readonly type='text' value='' name='rent.feeList[" + feeListsize + "].apply'></td>" +
            "<td class='zl-edit'><input  readonly type='text' value='' name='rent.feeList[" + feeListsize + "].noTaxTotalMonth'></td>" +
            "<td class='zl-edit'><input  readonly type='text' value='' name='rent.feeList[" + feeListsize + "].taxMonth'></td>"
        //提成
        var html_extract_body = "<tr> <th year='" + year + "'> 第 " + year + "年</th>\n" +
            "<input type='hidden' value='01' name='rent.feeList[" + feeListsize + "].feeType'>\n" +
            "<input type='hidden' value='" + year + "' name='rent.feeList[" + feeListsize + "].rentYear'>" +
            "<td colspan='1' class='zl-edit'><div class='input-group zl-datepicker zl-datetime-range pull-left' data-type='month' data-start='2017-11' style='width:100%'>\n" +
            "<input  readonly type='text' name='rent.feeList[" + feeListsize + "].startDate' class='form-control input-sm js-date-start' value='" + startT.format('yyyy-MM-dd') + "' tabindex='-1'>\n" +
            "<div class='input-group-addon input-xs'>~</div>\n" +
            "<input  readonly type='text' name='rent.feeList[" + feeListsize + "].endDate' class='form-control input-sm js-date-end' value='" + endT.format('yyyy-MM-dd') + "' tabindex='-1'></div>\n" +
            "<th class='text-left'>\n" + "<span class='zl-add-minus-wrapper'>\n" +
            " <em class='glyphicon glyphicon-minus-sign zl-glyphicon zl-glyphicon-red' ></em>\n" +
            " <em class='glyphicon glyphicon-plus-sign zl-glyphicon zl-glyphicon-blue' onclick='addPeriodItem(this," + i + ")'></em></span></th>" +
            "</td><td class='zl-edit'><input type='text' value='全品类' name='rent.feeList[" + feeListsize + "].remark' readonly></td>\n" +
            "<td class='zl-edit required'><input type='number' value='' name='rent.feeList[" + feeListsize + "].discountRate'></td>"
        feeListsize++;
        var html_manage_body = "<tr><input type='hidden' value='02' name='rent.feeList[" + feeListsize + "].feeType'>\n" +
            "<input type='hidden' value='01' name='rent.feeList[" + feeListsize + "].billingType'>\n" +
            "<input  type='hidden' value='" + startT.format('yyyy-MM-dd') + "' name='rent.feeList[" + feeListsize + "].startDate'>" +
            "<input type='hidden' value='" + endT.format('yyyy-MM-dd') + "' name='rent.feeList[" + feeListsize + "].endDate'>" +
            "<th> 第 " + year + "年 <input type='hidden' value='" + year + "' name='rent.feeList[" + feeListsize + "].rentYear'></th>\n" +
            "<td class='zl-edit'><input type='number' value='' name='rent.feeList[" + feeListsize + "].managRentBugget'></td>\n" +
            "<td class='zl-edit'><input type='number' value='' name='rent.feeList[" + feeListsize + "].managRentMonthStardard'></td>\n" +
            "<td class='zl-edit'><input type='number' value='' name='rent.feeList[" + feeListsize + "].managTurnoverMonthgApply'></td>\n" +
            "<td class='zl-edit'><input type='number' value='' name='rent.feeList[" + feeListsize + "].managRenDisgount'></td>\n" +
            "<td class='zl-edit'><input type='number' value='' name='rent.feeList[" + feeListsize + "].noTaxTotalMonth'></td>\n" +
            "<td class='zl-edit'><input type='number' value='' name='rent.feeList[" + feeListsize + "].taxMonth'></td></tr>"


        if (rentType == "01") {//保底租金单价:日周月
            append = append + html_bdRent_body
        } else if (rentType == "02") {//提成租金
            append = append + html_extract_body
        } else if (rentType == "03") {//两者取高
            append = append + html_higherRent_body
        } else if (rentType == "05") {//一次性租金
            append = append + html_one_body
        }
        $("#zl-fixed-management-table  tbody").append(html_manage_body); //物业管理费

        feeListsize++;
    }
    if (rentType == "01") {//保底租金单价:日周月
        $("[name=rent-main]").append(html_bdRent_header + append + html_bdRent_end);
    } else if (rentType == "02") {//纯扣租金
        $("[name=rent-main]").append(html_extract_header + append);
    } else if (rentType == "03") {//两者取高
        $("[name=rent-main]").append(html_higherRent_header + append);
    } else if (rentType == "05") {//一次性租金
        $("[name=rent-main]").append(html_oneRent_header + append);
    }

}


/**
 * 拆分一行租金
 * 1,只有最后一条有新增按键
 * 2,所有条目 需要删除按键
 * 3.新增的结束时间是上一条的结束时间,上一条的结束时间与这一条的开始时间一致
 *
 *
 * */
function addPeriodItem(button, year) {
    var clone = $(button).closest("tr").clone()
    var rentType = $("input[name='rentType']:checked").val();//租金方式 :0-保底租金  1-纯扣租金 2-两者取高
    $(button).hide();
    var endT = $(button).closest("tr").find("input[type='text']").eq(1).val();//新增条的结束时间
    $(button).closest("tr").find("input[type='text']").eq(1).val("")//清空本条结束时间
    $(button).closest("tr").find("input[type='text']").eq(1).attr("value", "")//清空本条结束时间
    var itemHtml = $(button).closest("tr").html();
    var index = itemHtml.substring(itemHtml.indexOf("[") + 1, itemHtml.indexOf("[") + 2) //索引
    var year = $(button).closest("tr").find("input").eq(1).val();
    var rowSpan = $("th[year=" + year + "]").attr("rowspan") == undefined ? 1 : $("th[year=" + year + "]").attr("rowspan")

    $("th[year=" + year + "]").attr("rowspan", parseInt(rowSpan) + 1)

    $(clone).find("input[type='text']").eq(0).attr("value", "")//开始时间
    $(clone).find("input[type='text']").eq(1).attr("value", endT)//结束时间
    $(clone).find("input[type='text']").eq(1).val(endT)//结束时间
    $(clone).find("[year='" + year + "']").remove()
    $(clone).find("input").each(function (e) {
        var attrName = $(this).attr("name")
        $(this).attr("name", attrName.replace("\[" + index + "\]", "\[" + feeListsize + "\]"))
    })
    $(button).closest("tr").after("<tr>" + $(clone).html() + "</tr>"); //添加一行
    feeListsize++;
    bindDatePicker()


}

var shopData;

function doSelect(that) {


    var key = $(that).attr("key");
    var value = $(that).html();

    $(that).parent().parent().prev().html(value);  //显示值
    $(that).parent().parent().parent().children("input").val(key);//input
    $(that).parent().parent().parent().removeClass("open");
    if ($(that).parent().parent().attr("name") == "mallSelect") {//项目带出项目简称与标题与商家库
        var name = $(that).attr("data-name")
        $(that).closest("tr").find("input").val(name);
        $("#malltitle").html(value);
        $("#mallName").val(value);
        $("#mallCode").val($(that).attr("mallcode"));
        initStoreAndCompanyInfo(key);
        $("[name=companyName]").val("")//租户
        $("[name=companyType]").val("")//业态
        $("[name=leaseSquare]").val("")//面积
        $("[name=brandName]").val("")//品牌
        $("[name=brandName]").next().html("")//品牌
        $("#storeNamesShow").val("")//铺位
        $("[name=leaseBunkName]").val("")//关联铺位
        $("[name=leaseBunkId]").val("")//关联铺位
        $("[name=brandName]").next().next().empty();//品牌选择
        changeTax(key)
    } else if ($(that).parent().parent().attr("name") == "brandSelect") {// 租户品牌选择

        // var layoutID = $(that).attr("data-value")  //品牌ID
        var layoutID = $(that).attr("key")  //品牌ID
        var brandName = $(that).attr("data-name")  //品牌ID
        $("#brandId").attr("value", layoutID)
        $("[name=brandName]").attr("value", brandName)
        $.ajax({
            url: netcommentWeb_Path + "netcomment/getIbBrandDetail.htm",
            type: "POST",
            data: {id: layoutID},
            cache: false,
            async: true,
            success: function (data) {
                data = data.replace(/\\n/g, "").replace(/\\r/g, "").replace(/\\v/g, "");

                try {
                    data = JSON.parse(data);
                } catch (e) {
                    data = JSON.parse(data.replace(/\\/g, ""));
                }
                $("[name=companyType]").val(data.bsLayoutDict.dictName);
            }
        });
    } else if ($(that).parent().parent().attr("name") == "otherPaytypeSelect") {// 其他费用类型选择
        if (key == "0") {//周期:显示下拉框
            $(that).closest("td").next().hide();
            $(that).closest("td").next().next().show();
            var name = $(that).closest("td").next().find("input").attr("name");

            $(that).closest("td").next().find("input").attr("name", "");
            $(that).closest("td").next().next().find("input").attr("name", name);
        } else if (key = "1") {                      //一次性:显示 时间控件
            $(that).closest("td").next().show();
            $(that).closest("td").next().next().hide();
            var name = $(that).closest("td").next().next().find("input").attr("name");
            $(that).closest("td").next().find("input").attr("name", name);
            $(that).closest("td").next().next().find("input").attr("name", "");
        }
    } else if ($(that).parent().parent().attr("name") == "storeSelect") {  //关联铺位

        // var key = $(that).attr("data-id");
        // $("[name=leaseBunkId]").val(key)
    }
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
            var re = /^[0-9]|^[0-9]*[1-9][0-9]*$/;
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


function valitateForm(obj, justMall) {
    var mallId = $(obj).find("input[name=mallId]").val();
    var companyName = $(obj).find("input[name=companyName]").val();//租户
    var brandName = $(obj).find("input[name=brandName]").val();//品牌
    var storeNames = $(obj).find("input[name=storeNames]").val();//租赁区域
    var contractBeginDate = $(obj).find("input[name=contractBeginDate]").val();//租赁开始时间
    var contractEndDate = $(obj).find("input[name=contractEndDate]").val();//租赁结束时间
    var diverseType = $(obj).find("input[name=diverseType]").val();//租赁结束时间

    if (mallId == "" || mallId == null) {
        alert("所属项目不能为空！");
        return false;
    }
    if (justMall) return true;

    if (companyName == "" || companyName == null) {
        alert("租户不能为空！");
        return false;
    }
    if (brandName == "" || brandName == null) {
        alert("品牌不能为空！");
        return false;
    }
    if (storeNames == "" || storeNames == null) {
        alert("租赁区域不能为空！");
        return false;
    }
    if (contractBeginDate == "" || contractBeginDate == null) {
        alert("租赁开始时间不能为空！");
        return false;
    }
    if (contractEndDate == "" || contractEndDate == null) {
        alert("租赁结束时间不能为空！");
        return false;
    }
    if (diverseType == "" || diverseType == null) {
        alert("请选择合同模板！");
        return false;
    }
    return true;
}

function valitateFormforNetconment(obj) {
    // if (!valitateForm(obj)) {
    //     return false
    // }
    var arr = obj.serialize().split("&");
    for (var i = 0; i < arr.length; i++) {
        var item = arr[i]
        var key = item.substring(0, item.indexOf("="))
        if (key != "contractNo" && key != "attachments" && key != "leaseBunkName" && key != "tenancy" && key != "companyType" && key != "brandName" && key.indexOf("remark") == -1 && key.indexOf("taxRate") == -1) {
            if (item.substring(item.indexOf("=") + 1) == "") {
                key = key.replace("%5B", "[").replace("%5D", "]")
                var title = $("[name='" + key + "']").attr("title") || "必填项";
                if ($("[name='" + key + "']").parent().find("ul").length == 1) { //下拉框
                    alert(title + "不能为空!", "", "", function (e) {
                        $("[name='" + key + "']").next().focus();
                        console.log(key)
                    });
                    return false;
                } else if ($("[name='" + key + "']").attr("type") != "hidden") {
                    alert(title + "不能为空!", "", "", function (e) {
                        $("[name='" + key + "']").focus();
                        console.log(key)
                    });
                    return false;

                } else {


                }
            } else if ($("[name='" + key + "']").attr("type") == "number") {
                var title = $("[name='" + key + "']").attr("title") || "必填项";
                var val = parseFloat($("[name='" + key + "']").val())
                if (val > 999999999999999) {
                    alert(title + "数值过大!", "", "", function (e) {
                        $("[name='" + key + "']").focus();
                    });
                    return false;

                } else if (val < 0) {
                    alert(title + "数值不能小于0!", "", "", function (e) {
                        $("[name='" + key + "']").focus();
                    });
                    return false;
                }
            }

        }
    }
    return true;
}

function isPositiveNum(s) {//是否为正整数
    var re = /^[0-9]*[1-9][0-9]*$/;
    return re.test(s)
}


//==========自动获取当前时间=====
function show() {
    var nowDate = new Date();
    var year = nowDate.getFullYear();
    var month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1;
    var date = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
    return year + month + date;
}

//======生成不重复的三位随机数===
function randomNum() {
    var arr = [];
    for (var i = 100; i <= 999; i++)
        arr.push(i);
    arr.sort(function () {
        return 0.5 - Math.random();
    });
    arr.length = 1;
    return arr;
}


//租金计算
//一次性租金 不参与租金计算
//input: <input/>
function rentCalcul(input) {
    // console.log(tax)
    var index = 2;
    var rentType = $("input[name='rentType']:checked").val()
    if (rentType == "05") {//一次性租金
        index = 1;
        var rentSum = $(input).closest("tr").find("input[type='number']").eq(index).val();
        rentCalculTax($(input).closest("tr").find("input[type='number']").eq(index), parseFloat(rentSum));
        return;
    }
    var rentUnit = $("input[name='rentUnit']:checked").val();//记租单位 :0-按单价  1-按面积
    var rentUnitPrice = $("input[name='rentUnitPrice']:checked").val();//单价 :0-日  1-周 2-年
    var biginTime = $(input).closest("tr").find("input[type='text']").eq(0).val();//租期阶段开始时间
    var endTime = $(input).closest("tr").find("input[type='text']").eq(1).val();//租期阶段结束时间
    var day = parseInt((new Date(endTime).getTime() - new Date(biginTime).getTime()) / 1000 / (24 * 60 * 60)) + 1; //头减尾+1

    var s = rentUnit == "0" ? 1 : $("[name=leaseSquare]").val();
    if (isNaN(s)) { //按面积计费时 面积为空
        s = 0;
    }
    var fee = $(input).closest("tr").find("input[type='number']").eq(1).val();
    if (parseInt(fee) < 0) {
        fee = 0;
    }
    var rentSum = 0;
    if (rentUnitPrice == "0") {  //日单价
        rentSum = day * fee * s;//租金总额 日*日单价*计价单位*面积leaseSquare
        if (!isNaN(rentSum)) {

            $(input).closest("tr").find("input[type='number']").eq(index).val(rentSum.toFixed(2));//两位小数

            rentCalculTax($(input).closest("tr").find("input[type='number']").eq(index), rentSum)
        }

    } else if (rentUnitPrice == "1") {  //月单价
        // var fee = $(input).closest("tr").find("input[type='number']").eq(1).val(); //月单价
        // var Month = setTables2(biginTime, endTime)


        //整月
        var biginDate = new Date(biginTime);
        var endDate = new Date(endTime);
        var Month = (endDate.getFullYear() - biginDate.getFullYear()) * 12 - (biginDate.getMonth() - endDate.getMonth())
//月份天数
        var biginDay = new Date(biginDate.getFullYear(), biginDate.getMonth() + 1, 0);
        var endDay = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);
        var rent;
        if (Month == 0) {// 不足一个月
            rent = (endDate.getDate() - biginDate.getDate() + 1) / endDay.getDate() * fee * s
        } else if ($("#tenancy").val().indexOf("月0天") != -1) { //足月
            var tenancy = $("#tenancy").val();
            var year = parseInt(tenancy.substring(0, tenancy.indexOf("年")));
            var month = parseInt(tenancy.substring(tenancy.indexOf("年") + 1, tenancy.indexOf("个月")));
            rent = (year * 12 + month) * fee * s

        } else {
            rent = fee * Month * s
            rent = rent - (biginDate.getDate() - 1) / biginDay.getDate() * fee * s
            rent = rent + endDate.getDate() / endDay.getDate() * fee * s
        }
        if (!isNaN(rent)) {

            $(input).closest("tr").find("input[type='number']").eq(index).val(rent.toFixed(2));
            rentCalculTax($(input).closest("tr").find("input[type='number']").eq(index), rent)

        }
    }
    if (rentType == "01") {//固定租金

        rentSumCalcul();
    }

}

//租金税额计算
//input: <input/>
function rentCalculTax(input, rentSum) {
    var hasTax = $("[name=isOutside]:checked").val()
    if (rentSum == 0) {
        $(input).closest("td").next().find("input").val("0.00")
        $(input).closest("td").next().next().find("input").val("0.00")
        $(input).closest("td").next().next().next().find("input").val("0.00")
        return;
    }

    if (hasTax == "0") { //含税
        $(input).closest("td").next().find("input").val(rentSum.toFixed(2))
        $(input).closest("td").next().next().find("input").val((rentSum / (1 + tax)).toFixed(2))
        $(input).closest("td").next().next().next().find("input").val((rentSum - rentSum / (1 + tax)).toFixed(2))

    } else if (hasTax == "1") {//不含税
        $(input).closest("td").next().find("input").val((rentSum * (1 + tax)).toFixed(2));
        $(input).closest("td").next().next().find("input").val(rentSum.toFixed(2))
        $(input).closest("td").next().next().next().find("input").val((rentSum * tax).toFixed(2))

    }

}

function rentSumCalcul() { //租金总计计算
    var rentType = $("input[name='rentType']:checked").val();//租金方式 :0-保底租金  1-纯扣租金 2-两者取高
    var sum = 0;
    if (rentType == 01) { //固定租金
        $("[name=feeTable]").find("input[type='number']").each(function () {
                var inputName = $(this).attr("name")

                if (inputName.indexOf("totalMonth") != -1) {

                    if (!isNaN(parseFloat($(this).val()))) sum = sum + parseFloat($(this).val());
                }
            }
        )
        $("#rentSum").attr("value", sum.toFixed(2))

    }
}


function workingDate(enroll_date, end_date) {
    if (enroll_date !== null && enroll_date !== undefined && enroll_date !== '') {
        var newDate = new Date(end_date);
        var enroll = new Date(enroll_date);
        var time = newDate.getTime() - enroll.getTime(); //计算时间差
        var day = parseInt(time / (24 * 60 * 60 * 1000)); //转换成天

//不足一月
        if (day < 30) {
            return day + "天";
        }

//足一月但不足一年
        if (day >= 30 && day < 365) {
            var year = parseInt(day % 365 / 30) + "月零" + parseInt(day % 365 % 30) + "天";
            if (parseInt(day % 365 % 30) == 0) {
                var year = parseInt(day % 365 / 30) + "个月";
                return year;
            }
            return year;
        }

//超过一年
        if (day >= 365 && parseInt(day % 365 / 30) < 12) {
            var year = parseInt(day / 365) + "年" + parseInt(day % 365 / 30) + "月" + parseInt(day % 365 % 30) + "日";
            if (day % 365 / 30 == 0) {
                year = parseInt(day / 365) + "年";
            }
            return year;
        }
    }
}

Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(),    //day
        "h+": this.getHours(),   //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}


/**
 * 主要是编辑话画面 初始化 商铺信息 和租赁区域
 *
 * @param beginDate
 * @param endDate
 */
function initStoreAndCompanyInfo(mallId) {
    // selectShopList.init("", "single");
    // selectUnit.init("", "multi");

    var data = {'mallId': mallId};
    $(".zl-loading").fadeIn();
    $.post(netcommentWeb_Path + 'netcomment/getCompanyTree.htm', data, function (result) {
        _selectedCompany = {};
        $(".zl-loading").fadeOut()
        shopData = eval('(' + result + ')');
        selectShopList.update(shopData, "single");
    });


    $("#companyName").on("click", function (e) {
        selectShopList.modalShow(
            function (selectedShops) {
                _selectedCompany = selectedShops;
                _setCompanyInput(_selectedCompany);

                //重新选择商铺之后清空品牌和业态
                $("[name=companyType]").val("")//业态
                $("[name=brandName]").next().html("")//品牌
                $("[name=brandName]").next().next().empty();//品牌选择

            }, _selectedCompany)
    });
    _selectedStores = {}
    $.post(netcommentWeb_Path + 'netcomment/diverse/getFloorList.htm', data, function (result) {
        var resultData = eval('(' + result + ')');
        // 楼层列表
        var listFloors = resultData.list;
        for (var i = 0; i < listFloors.length; i++) {
            var listStores = resultData["store_" + listFloors[i].id];

            for (var j = 0; j < listStores.length; j++) {
                $("body").data("_store_" + listStores[j].id, listStores[j]);
            }
        }
        selectUnit.update(resultData.data, "multi");
    });
    //加载 租赁区域数据
    //商铺选择事件注册
    $("#storeNamesShow").on("click", function (e) {
        selectUnit.modalShow(
            function (selectedShops) {
                _selectedStores = selectedShops;
                _setStoresInput(_selectedStores);

                //选择推广点位后  如果是按面积计费则重新计算金额
                if ($("[name=rentUnit]:checked").val() == "1") {
                    $("[name=feeTable]").find("input[type='number']").each(function () {
                        var inputName = $(this).attr("name")
                        if (inputName.indexOf("standard") != -1) {
                            rentCalcul(this)
                        }
                    })
                }
                contractDateCheck()
            }, _selectedStores)
    });
}

function _setStoresInput(_selectedShops) {
    var _nameList = [];
    var storeNames = "";
    var storeIdsExt = "";
    var structureSquareTotal = 0;
    var propertySquareTotal = 0;
    var propertySquare = 0;
    var structureSquare = 0;
    var issuingLayoutNames = "";
    var storeIdArr = [];
    $.each(_selectedShops, function (id, shop) {
        _nameList.push(shop.name);
        storeNames += shop.name + ";";
        storeIdsExt += shop.id + ",";
        propertySquare = shop.propertySquare;
        structureSquare = shop.structureSquare;
        propertySquareTotal += parseFloat(propertySquare);
        structureSquareTotal += parseFloat(structureSquare);
        //业态
        issuingLayoutNames = shop.issuingLayout;
        storeIdArr.push(shop.id);
        //console.log("structureSquare:" + shop.structureSquare);
    });
    $("#storeNos").val(storeIdsExt);
    $("#storeNames").val(storeNames);
    $("#storeNamesShow").val(storeNames);
    $("#structureSquare").val(structureSquareTotal.toFixed(2));
    $("#innerSquare").val(propertySquareTotal.toFixed(2));
    $("[name=leaseSquare]").val(propertySquareTotal.toFixed(2));
    $("#issuingLayout").val(issuingLayoutNames);
    $("body").data("_storeIds", storeIdArr);
    $.ajax({ //获取预算
        cache: true,
        type: "POST",
        dataType: "json",
        data: {diverseIds: storeIdsExt},
        url: "diverseBudget.htm",
        async: true,
        error: function (request) {
            alert("系统异常");
        },
        success: function (resultData) {
            if (resultData) {
                diverseBudget = resultData.data.toFixed(2);
                for (var i = 0; i <= feeListsize; i++) {
                    $("[name='rent.feeList[" + i + "].rentBudget']").val(diverseBudget)

                }

            }
        }

    });
}

function _setCompanyInput(_selectedCompany) {

    var companyId = "";
    $.each(_selectedCompany, function (id, company) {
        $("[name=companyName]").attr("value", company.name);
        $("[name=companyName]").val(company.name);
        $("[name=companyId]").val(company.id);
        companyId = company.id;
    });

    if (companyId != null && companyId != "") {
        // 查询品牌详情
        $.ajax({
            cache: false,
            type: "POST",
            dataType: "json",
            url: netcommentWeb_Path + "netcomment/getIbCompanyDetail.htm",
            data: {id: companyId},
            error: function (request) {
                alert("系统异常");
            },
            success: function (resultData) {
                var ibBrands = resultData.ibBrands;
                var result = [];
                if (ibBrands && ibBrands.length > 0) {
                    for (var i = 0; i < ibBrands.length; i++) {
                        var brand = ibBrands[i];
                        var option = {};
                        var key = brand.id;
                        var value = brand.brandName;
                        option['value'] = key;
                        option['text'] = value;
                        result.push(option);
                    }
                }
                //$("#companyName")
                var html = "";
                $(result).each(function () {
                    var value = this['value'];
                    var brandName = this['text'];
                    html += "<li><a onclick='doSelect(this)'data-id='" + value + "' key='" + key + "' data-name='" + brandName + "'>" + brandName + "</a></li>";
                });
                $("[name=brandName]").val("")//品牌
                $("[name=brandSelect]").empty()
                $("[name=brandSelect]").append(html);
                $("#brandNameShow").html("");
            }
        });
        // 查询关联铺位
        $("[name='leaseBunkName']").parent().find("ul").empty();
        $.ajax({
            cache: false,
            type: "POST",
            dataType: "json",
            url: "getStoreByCompany.htm",
            data: {companyId: companyId},
            error: function (request) {
                alert("系统异常");
            },
            success: function (resultData) {
                if (resultData.code == 0) { //查询成功
                    var ids = "";
                    var nos = "";
                    $.each(resultData.data, function (a, item) {
                        ids += "," + item.storeId
                        nos += "," + item.storeNo
                    })
                    if (ids != "") ids = ids.substring(1)
                    if (nos != "") nos = nos.substring(1)
                    $("[name='leaseBunkName']").val(nos)
                    $("[name='leaseBunkId']").val(ids)

                }
            }
        });
    }
}

function deleteFile(_this, id) {
    confirm("确认删除？")
    $(".zl-btn-wrapper .js-btn-confirm").on("click", function (e) {
        $.ajax({
            url: "delAttachmentFile.htm",
            type: "POST",
            data: {attachmentId: id},
            success: function (result) {
                result = eval("(" + result + ")");
                if (result.code == 0) {
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
    })
}

/**
 * 租金月单价
 *copy from 网批
 * @param beginDate
 * @param endDate
 */
function setTables2(beginDate, endDate) {  //
    var Month1, Month2, iYears = 0, iMonths = 0, iDays = 0;
    try {
        Month1 = parseInt(beginDate.split("-")[0], 10) * 12 + parseInt(beginDate.split("-")[1], 10);
        Month2 = parseInt(endDate.split("-")[0], 10) * 12 + parseInt(endDate.split("-")[1], 10);
        var day1 = parseInt(beginDate.split("-")[2], 10);
        var day2 = parseInt(endDate.split("-")[2], 10);

        //特殊处理, 开始日期为 1号，结束日期为当月最后一天时
        if (day1 == 1) {
            var endDateMonthDay = new Date(endDate.split("-")[0], endDate.split("-")[1], 0).getDate();
            if (day2 == endDateMonthDay) {
                day2 = 0;
                Month2 = Month2 + 1;
            }
        }

        iMonths = Month2 - Month1;
        iDays = day2 - day1 + 1;
        if (iDays < 0) {
            iMonths -= 1;
            iDays += 30;
        }
        iYears = parseInt(iMonths / 12);
        iMonths = parseInt(iMonths % 12);
        if (isNaN(iYears)) {
            iYears = 0;
        }
        if (isNaN(iMonths)) {
            iMonths = 0;
        }
        if (isNaN(iDays)) {
            iDays = 0;
        }
        return iYears * 12 + iMonths;
    }
    catch (e) {
        console.log(e);
    }
}

/**
 * 显示租期
 *
 * @param beginDate
 * @param endDate
 */
function setTables(beginDate, endDate) {
    var Month1, Month2, iYears = 0, iMonths = 0, iDays = 0;
    try {
        Month1 = parseInt(beginDate.split("-")[0], 10) * 12 + parseInt(beginDate.split("-")[1], 10);
        Month2 = parseInt(endDate.split("-")[0], 10) * 12 + parseInt(endDate.split("-")[1], 10);
        var day1 = parseInt(beginDate.split("-")[2], 10);
        var day2 = parseInt(endDate.split("-")[2], 10);

        //特殊处理, 开始日期为 1号，结束日期为当月最后一天时
        if (day1 == 1) {
            var endDateMonthDay = new Date(endDate.split("-")[0], endDate.split("-")[1], 0).getDate();
            if (day2 == endDateMonthDay) {
                day2 = 0;
                Month2 = Month2 + 1;
            }
        }

        iMonths = Month2 - Month1;
        iDays = day2 - day1 + 1;
        if (iDays < 0) {
            var d = new Date(beginDate.split("-")[0], beginDate.split("-")[1], 0);
            iMonths -= 1;
            iDays += d.getDate();
        }
        iYears = parseInt(iMonths / 12);
        iMonths = parseInt(iMonths % 12);
        if (isNaN(iYears)) {
            iYears = 0;
        }
        if (isNaN(iMonths)) {
            iMonths = 0;
        }
        if (isNaN(iDays)) {
            iDays = 0;
        }
        var years;
        if (iYears == 0) { //少于一年时
            years = 1;
        } else if (iMonths == 0 && iDays == 0) { //整年时 不含月日
            years = iYears;
        } else {// 一年以上不是整年时
            years = parseInt(iYears + 1);
        }

        $("#tenancy").val(iYears + "年" + iMonths + "个月" + iDays + "天");
        return years;

    }
    catch (e) {
        console.log(e);
    }
}


function changeTax(key) { //更改税率
    var chargeType = $("#billForm").find("[name=chargeType]:checked").val(); //租金类型 场地 花车 广告位 临时场地
    var rentType = $("#billForm").find("[name=rentType]:checked").val();//租金方式 固定 提成 两者取高 一次性
    var feeCode = chargeType;
    if (chargeType == "30" || chargeType == "1002") { //场地 或 临时场地

        if (rentType == "02") { //提成  不需要计算税率
            tax = 0;
            return;

        } else if (rentType == "01" || rentType == "03" || rentType == "05") { //固定,两者取高 一次性,需要税率计算
            feeCode = 1002;
        }
    }
    var mallId = (key == undefined) ? $("#mallId").val() : key
    $.ajax({
        cache: true,
        type: "POST",
        dataType: "json",
        data: {feeCode: feeCode, mallId: mallId, tableFeeType: "other"},
        url: netcommentWeb_Path + "netcomment/selectFeeInfoByCode.htm",
        async: true,
        error: function (request) {
            alert("系统异常");
        },
        success: function (resultData) { //租金计算
            if (resultData.data.tax * 0 != 0) tax = 0
            tax = resultData.data.tax / 100;

            $("[name=feeTable]").find("input[type='number']").each(function () {
                var inputName = $(this).attr("name")
                if (inputName.indexOf("standard") != -1) {
                    if ($(this).val() != "") {
                        rentCalcul(this)
                    }
                }
            })

        }
    });


}

function otherFeeSet() { //其他费用项
    var arr = new Array(2, 7, 9, 13, 14, 15, 16, 19, 20, 22, 23, 25, 26, 37, 39, 40, 43, 44, 46, 57, 58, 61, 62, 63, 65, 1003, 1004, 1007, 1020, 7, 2001, 2002, 2003, 2004)
    var returnArr = new Array();
    for (var i = 0; i < _feeTypeList.length; i++) {
        if (arr.contains(_feeTypeList[i].value)) {
            returnArr.push(_feeTypeList[i])
        }
    }
    return returnArr;

}

Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === parseInt(obj)) {
            return true;
        }
    }
    return false;
}
