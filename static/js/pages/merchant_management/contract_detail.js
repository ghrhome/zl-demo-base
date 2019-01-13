var myDate = new Date();
$(function () {

    // 注册打印事件
    $(".zl-print").click(function () {
        var screenWidth = (screen.availWidth - 10);
        var screenHeight = (screen.availHeight - 50);
        var id = $("#id").val();
        var subWin = window.open("printView.htm?id=" + id, "newwindow", " width=" + screenWidth + ",height=" + screenHeight + ",  top=0, left=0, toolbar=no, menubar=no, scrollbars=yes, resizable=no, location=no, status=no");


        subWin.onload = function () {

            $(subWin.document).find("[input-edit]").css("background-color", "#ffffff");
            setTimeout(function () {
                $(".updateType").val("05");
                updateStatus ("contract/printLock.htm");
                subWin.print();
            }, 100);
        };
    });

    // 删除
    $(".zl-contract-block-title .zl-delete").click(function () {
        if (confirm("确认要删除吗？")) {
            var contractId = $("#contractId").val();
            $.ajax({
                type: "POST",
                url: enrolmentWeb_Path + "contract/delete.htm",
                data: {id: contractId},
                success: function (data) {
                    if (data.code == 0) {
                        window.location.href = enrolmentWeb_Path + "contract/index.htm";
                    } else {
                        alert(data.msg);
                    }
                }
            })
        }
    });

    $("[role=dialog]").on("shown.bs.modal", function (e) {
        e.preventDefault();
        e.stopPropagation();
        $("body").removeClass("modal-open");
    });

    $(".zl-button-save").click(function () {
        $(".updateType").val("01");
        var html = "";
        if (document.getElementById("contract_reference")) {
            if(document.getElementById("contract_reference").contentDocument.head){
                html += document.getElementById("contract_reference").contentDocument.head.innerHTML;
            }
            html += document.getElementById("contract_reference").contentDocument.body.innerHTML;
        }
        html = encodeURI(html);
        var contractId = $("#contractId").val();
        var businessCondition = $("#businessCondition").val();
        var termsCondition = $("#termsCondition").val();
        var review = $("#review").val();
        var updateType = $(".updateType").val();
        var contractType = $("#contractType").val();
        var mallContBankId = $("#mallContBankId").val();
        if(mallContBankId){
            $.ajax({
                type: "POST",
                url: "getMallContBankToBsContract.htm",
                data: {
                    businessCondition: businessCondition, contractType: contractType, mallContBankId: mallContBankId
                },
                success: function (data) {
                    if (data.code == 0) {
                        $.ajax({
                            type: "POST",
                            url: "update.htm",
                            data: {
                                html: html, id: contractId, businessCondition: businessCondition,
                                termsCondition: termsCondition, review: review, updateType: updateType
                            },
                            success: function (data) {
                                if (data.code == 0) {
                                    formPost(enrolmentWeb_Path + "contract/detail.htm", {contractNo: data.data});
                                } else {
                                    alert(data.msg);
                                }
                            }
                        })
                    } else {
                        alert(data.msg);
                    }
                }
            })
        }else{
            $.ajax({
                type: "POST",
                url: "update.htm",
                data: {
                    html: html, id: contractId, businessCondition: businessCondition,
                    termsCondition: termsCondition, review: review,updateType:updateType
                },
                success: function (data) {
                    data=eval("("+data+")");
                    if (data.code == 0) {
                        alert(data.msg);
                        formPost("detail.htm", {contractNo: data.data},"");
                    } else {
                        // alert("","","","");
                        alert(data.msg);
                    }
                }
            })
        }
    });
    $(".zl-button-cancel").click(function () {
        if (confirm("确认要作废吗？")) {
            $(".updateType").val("06");
            updateStatus ("contract/cancel.htm");
        }
    });
    $(".zl-button-audit").click(function () {
        $(".updateType").val("03");
        updateStatus ("contract/approve.htm");
    });
    $(".zl-button-cancleAudit").click(function () {
        $(".updateType").val("01");
        updateStatus ("contract/cancleApprove.htm");
    });

    $(".zl-button-print").click(function () {
        $(".updateType").val("04");
        updateStatus ("contract/canPrint.htm");
    });
    $(".zl-button-printLock").click(function () {
        $(".updateType").val("05");
        updateStatus ("contract/printLock.htm");
    });
    function updateStatus (url) {
        var html = "";
        var path="";
        if (document.getElementById("contract_reference")) {
            html = document.getElementById("contract_reference").contentDocument.body.innerHTML;
            html = encodeURI(html);
            var src=$("#contract_reference").attr("src");
            var path=src.substring((src.indexOf("path=")+5),src.indexOf("&"));
        }
        var contractId = $("#contractId").val();
        var businessCondition = $("#businessCondition").val();
        var termsCondition = $("#termsCondition").val();
        var review = $("#review").val();
        var updateType = $(".updateType").val();
        $.ajax({
            type: "POST",
            url: enrolmentWeb_Path + url,
            data: {
                path: path, id: contractId, businessCondition: businessCondition,
                termsCondition: termsCondition, review: review,updateType:updateType
            },
            success: function (data) {
                if (data.code == 0) {
                    //window.location.reload();
                    //window.location.href = enrolmentWeb_Path + "contract/index.htm";
                    formPost(enrolmentWeb_Path + "contract/detail.htm", {contractNo: data.data});
                } else {
                    // alert(data.msg);
                }
            }
        })
    }



    $(".zl-history-version").click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        var id = $("#id").val();
        $.ajax({
            cache: false,
            type: "POST",
            url: enrolmentWeb_Path + "contract/getContractHisList.htm",
            data: {contractId: id},
            async: false,
            error: function (request) {
                alert("system异常");
            },
            success: function (resultData) {
                // var result = eval("(" +resultData+ ")")
                //window.location.href = netcommentWeb_Path + "netcomment/index.htm";
                //e.preventDefault();
                //e.stopPropagation();
                var strPrint = "";
                var strSave = "";
                var index1 = 0;
                var index2 = 0;
                if (resultData.contractHisList != null) {
                    for (var i = 0; i < resultData.contractHisList.length; i++) {
                        if (resultData.contractHisList[i].updateType == '2') {
                            index1++;
                            var str1 = "<ul class='zl-table-row'>" +
                                "<li class='zl-table-cell' >" + index1 + "</li>" +
                                "<li class='zl-table-cell''>" + resultData.contractHisList[i].remarks + "</li>" +
                                "<li class='zl-table-cell' >" + resultData.hisUsers[resultData.contractHisList[i].updater] + "</li>" +
                                "<li class='zl-table-cell' style='width: 25%'>" + resultData.contractHisList[i].updateTime + "</li>" +
                                "<li class='zl-table-cell' style='width: 10%'>" +
                                "<a path=" + resultData.contractHisList[i].path + " href='#' onclick='getview(this)' class='zl-font-color-blue zl-annotation-tooltip-btn'><em></em>查看</a>"
                                + "</li></ul>";
                            strPrint = strPrint + str1;
                        } else {
                            index2++;
                            var str2 = "<ul class='zl-table-row'>" +
                                "<li class='zl-table-cell'>" + index2 + "</li>" +
                                "<li class='zl-table-cell'>" + resultData.hisUsers[resultData.contractHisList[i].updater] + "</li>" +
                                "<li class='zl-table-cell'>" + getOpTypeName(resultData.contractHisList[i].updateType) + "</li>" +
                                "<li class='zl-table-cell' style='width: 25%'>" + resultData.contractHisList[i].updateTime + "</li>" +
                                "<li class='zl-table-cell' style='width: 10%'>" +
                                "<a path=" + resultData.contractHisList[i].path + " href='#' onclick='getview(this)' class='zl-font-color-blue zl-annotation-tooltip-btn'><em></em>查看</a>"
                                + "</li></ul>";
                            strSave = strSave + str2;
                        }


                    }
                }

                $("#up").html("");
                $("#down").html("");
                $("#up").prepend(strPrint);
                $("#down").prepend(strSave);
                $(".zl-history-version-dialog").modal({});
            }
        });


    });


    $("body").on("keydown", function(e){
        if(e.keyCode == 192){
            e.preventDefault();

            $(".zl-contract-text div.col-contract-edit").toggle();
            $(".zl-contract-text div.col-contract-text").toggleClass("col-xs-8 col-xs-12");
            $(".zl-contract-attachment").slideToggle();
            $(".zl-contract-basic-info").slideToggle();
            $(".zl-content-header").slideToggle();
        }
    })


});

function getOpTypeName(type) {
    if (type == "0") {
        return "新增";
    }

    if (type == "1") {
        return "编辑";
    }

    if (type == "2") {
        return "打印";
    }

    if (type == "3") {
        return "作废";
    }
    if (type == "4") {
        return "允许打印";
    }
    if (type == "5") {
        return "打印锁定";
    }
    if (type == "6") {
        return "审核";
    }
    if (type == "7") {
        return "取消审核";
    }
}


function getview(obj) {
    var screenWidth = (screen.availWidth - 10);
    var screenHeight = (screen.availHeight - 50);

    var thisPath = $(obj).attr("path");
    var templateId = $("#templateId").val();
    console.log(thisPath);
    console.log(templateId);

    window.open("contract_reference.htm?path=" + thisPath + "&templateId=" + templateId, "newwindow", " width=" + screenWidth + ",height=" + screenHeight + ",  top=0, left=0, toolbar=no, menubar=no, scrollbars=yes, resizable=no, location=no, status=no");
}

// 以下是合同文本的核心操作
window.onload = function () {
    /* ======================================== 页面渲染 ======================================== */
    // CKEDITOR 初始化
    CKEDITOR.replace('editor', {
        enterMode: CKEDITOR.ENTER_BR,
        shiftEnterMode: CKEDITOR.ENTER_P,
        toolbar: [
            {name: "bold", items: ["Bold"]},
            {name: "image", items: ["Image"]},
            {name: "table", items: ["Table"]}
        ] // 设置toolbar
    });

    /*$("#businessCondition").click(function(){
        if($(this).val()){
            openNetBussDetail({masterId: $(this).val()});
        }
    });

    $("#termsCondition").click(function(){
        if($(this).val()){
            openNetBussDetail({masterId: $(this).val()});
        }
    });*/

    // iframe 初始化
    var container = $(".zl-contract-text-content>iframe").contents()[0]; // iframe container

    // 初始化 iframe中 input-edit 默认样式
    $(container).find("[input-edit]").css({"min-height": "16px"});

    var fullSelectedRange = null;

    // 动态添加的标签
    $(container).find("body").append("<a anchor-trigger style='display:none;'>跳转</a>"); // 动态添加到 合同文本库 用于锚点跳转

    var style = "<style>" +
        "ins{background-color:yellow;cursor:pointer;}" +
        "ins *{background-color:yellow;cursor:pointer;}" +
        "ins.active{background-color:tomato}" +
        "ins.active *{background-color:tomato}" +
        "</style>";
    $(container).find("body").append(style);


    // 刷新 填空列表
    $("#zl-contract-detail .zl-contract-block-content .zl-contract-text .zl-contract-text-input-list ul").empty();
    $(container).find("[input-edit]").each(function () {
        var id = $(this).attr("id");
        var html = "<li href='" + id + "'><span>" + $(this).html() + "</span><em class='edit'>编辑</em></li>";
        $("#zl-contract-detail .zl-contract-block-content .zl-contract-text .zl-contract-text-input-list ul").append(html);
    });

    // 刷新 修订原内容列表
    refreshContractTextAnnotationContent();

    /* ======================================== 事件绑定 ======================================== */
    // ======================================== 左边iframe区域事件 ========================================
    // 注册修订按钮事件
    $(".zl-annotation-btn").click(function () {
        // 获取修订内容
        if (container.getSelection().rangeCount == 0) {
            alert("请选择要修订的文本");
            return;
        }
        reSelect();

        var html = getSelectedHtml();
        if (html.length == 0) {
            alert("请选择要修订的文本");
            return;
        }

        if (html.indexOf("<ins") > -1 || html.indexOf("</ins") > -1) {
            alert("不能包含已修订项!");
            return;
        }

        if (html.indexOf("input-edit") > 0 || html.indexOf("input-comm") > 0) {
            alert("不能包含填空项!");
            return;
        }

        $($("#editor").next().find("iframe").contents()[0]).find("body").html(html);
        $(".zl-annotation-dialog").modal("show");

    });

    // 注册 iframe 中 input-edit 点击事件
    $(container).on("click", "[input-edit]", function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(container).find("[input-edit]").css("background-color", "rgb(203, 203, 203)");
        $(container).find("ins").removeClass("active");
        $(this).css("background-color", "#18b0e2");

        var id = $(this).attr("id");
        $("#zl-contract-detail .zl-contract-block-content .zl-contract-text .zl-contract-text-input-list ul li").removeClass("active");
        $("#zl-contract-detail .zl-contract-block-content .zl-contract-text .zl-contract-text-input-list ul li[href=" + id + "]").addClass("active");


    });

    // 注册 iframe 中 input-edit 双击事件
    $(container).on("dblclick", "[input-edit]", function (e) {
        e.stopPropagation();
        e.preventDefault();
        var title = $(this).attr("title");
        var html = $(this).html().replace(/&nbsp;/g, "");
        if($(this).attr("id") == 2006){
            var mallId = $("#mallId").val();
            // 根据项目id查询项目信息
            $.ajax({
                type: "POST",
                url: enrolmentWeb_Path + "contract/getMallTitle.htm",
                data: { mallId: mallId},
                success: function (data) {
                    if (data.code == 0) {
                        var selectionStr = "";
                        console.log(data.data);
                        document.getElementById("mallSelect").options.length = 1;
                        $(data.data).each(function(i,mall){
                            selectionStr += "<option value='"+mall.id+"'>" + mall.bsBankAccount.accountName + " / " + mall.bsBankAccount.accountNo + "</option>";
                        });
                        $("#mallSelect").append(selectionStr);
                        $(".zl-input-edit-dialog1").data("input-edit-id", 27);
                        $(".zl-input-edit-dialog1").modal();
                    } else {
                        if (data.msg) {
                            alert(data.msg);
                        } else {
                            alert("请确认账号权限！");
                        }
                    }
                }
            });
        }else{
            if (title != null && title.length > 0) {
                $(".zl-input-edit-dialog .modal-body label").html(title);
            }
            $(".zl-input-edit-dialog .modal-body input").val(html);

            var id = $(this).attr("id");
            $(".zl-input-edit-dialog").data("input-edit-id", id);
            $(".zl-input-edit-dialog").modal();
        }
    });

    $(".zl-input-edit-dialog").on("shown.bs.modal",function(){

        $(".zl-input-edit-dialog input").focus();
    });

    // 注册 iframe 中 ins 点击事件
    $(container).on("click", "ins", function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(container).find("ins").removeClass("active");
        $(this).addClass("active");
        $(container).find("[input-edit]").css("background-color", "rgb(203, 203, 203)");
    });

    // 注册 iframe 中 ins 双击事件
    $(container).on("dblclick", "ins", function (e) {
        e.stopPropagation();
        e.preventDefault();
        fullSelectedRange = container.createRange();
        fullSelectedRange.selectNode($(this)[0]);
        container.getSelection().removeAllRanges();
        container.getSelection().addRange(fullSelectedRange);
        var html = $(this).html();
        $($("#editor").next().find("iframe").contents()[0]).find("body").html(html);
        $(".zl-annotation-dialog").modal("show");
    });


    /* 修订弹出框中的相关事件 */
    /* 修订弹出框中的保存按钮事件 */
    $(".zl-annotation-dialog .zl-save").click(function (e) {
        e.stopPropagation();
        e.preventDefault();

        if (container.getSelection) {
            if (container.getSelection().rangeCount == 0) {
                container.getSelection().addRange(fullSelectedRange);
            }
        }

        //var html = "<ins>"+CKEDITOR.instances["editor"].getData()+"</ins>";

        var ins = container.createElement("ins");
        ins.innerHTML = CKEDITOR.instances["editor"].getData();
        $(ins).css("text-decoration", "none");

        var html = getSelectedHtml();
        var originalSource = null;
        var loginUserName=$("#loginUserName").val();
        debugger;

        if (html.indexOf("<ins") > -1) {
            ins.setAttribute("originalSource", $(html).attr("originalSource"));
            ins.setAttribute("userName",loginUserName);
            ins.setAttribute("id", $(html).attr("id"));
        } else {
            ins.setAttribute("originalSource", html);
            ins.setAttribute("userName",loginUserName);
            var newId = new Date().getTime() + "" + parseInt(Math.random() * 1000);
            ins.setAttribute("id", newId);
        }


        var range = getSelectedRange();
        range.deleteContents();
        range.insertNode(ins);

        $(".zl-annotation-dialog").modal("hide");

        refreshContractTextAnnotationContent();
    });

    /* 修订弹出框中的消失的回调处理 */
    $(".zl-annotation-dialog").on("hidden.bs.modal", function (e) {
        e.stopPropagation();
        e.preventDefault();

        if (container.getSelection) {
            if (container.getSelection().rangeCount == 0) {
                container.getSelection().addRange(fullSelectedRange);
            }
        }
    });

    /* 填空弹出框的相关事件 */
    /* 填空弹出框的确认事件 */
    $(".zl-input-edit-dialog .zl-ok").click(function (e) {
        e.stopPropagation();
        e.preventDefault();

        var inputEditId = $(".zl-input-edit-dialog").data("input-edit-id");
        var val = $(".zl-input-edit-dialog .modal-body input").val();

        $(container).find("#" + inputEditId).html(val);
        $("#zl-contract-detail .zl-contract-block-content .zl-contract-text .zl-contract-text-input-list ul li[href=" + inputEditId + "] span").html(val);

        $(".zl-input-edit-dialog").modal("hide");

    });

    /* 填空弹出框的确认事件 */
    $(".zl-input-edit-dialog1 .zl-ok").click(function (e) {
        e.stopPropagation();
        e.preventDefault();

        var inputEditId = $(".zl-input-edit-dialog1").data("input-edit-id");
        var val = $(".zl-input-edit-dialog1 .modal-body select").val();
        var contractType = $("#contractType").val();
        // 根据BsMallContBank的主键查询银行账户等信息
        if (val) {
            if(val=="x"){
                $(container).find("#" + 2006).html("");
                $(container).find("#" + 2007).html("");
                $(container).find("#" + 2008).html("");
                $(container).find("#" + 2005).html("");
                $(container).find("#" + 2000).html("");
                $(container).find("#" + 2001).html("");
                $(container).find("#" + 2002).html("");
                $(container).find("#" + 2003).html("");
                $(container).find("#" + 2004).html("");
                $("#mallContBankId").val("");
            }else{
                $.ajax({
                    type: "POST",
                    url: enrolmentWeb_Path + "contract/getMallContBank.htm",
                    data: {id: val},
                    success: function (data) {
                        if (data.code == 0) {
                            if (contractType == "28") {
                                $(container).find("#" + 2006).html(data.data.bsBankAccount.accountName);
                            } else {
                                $(container).find("#" + 2006).html(data.data.bsContTitle.contTitle);
                            }
                            $(container).find("#" + 2007).html(data.data.bsContTitle.contAddress);
                            $(container).find("#" + 2008).html(data.data.bsContTitle.contMoblie);
                            $(container).find("#" + 2005).html(data.data.bsContTitle.contTitle);
                            $(container).find("#" + 2000).html(data.data.bsBankAccount.accountName);
                            $(container).find("#" + 2001).html(data.data.bsBankAccount.bankName);
                            $(container).find("#" + 2002).html(data.data.bsBankAccount.accountNo);
                            $(container).find("#" + 2003).html(data.data.bsContTitle.contAddress);
                            $(container).find("#" + 2004).html(data.data.bsContTitle.contMoblie);
                            $("#mallContBankId").val(data.data.id);
                        } else {
                            alert(data.msg);
                        }
                    }
                });
            }
            $(".zl-input-edit-dialog1").modal("hide");
        }
        /*$(container).find("#" + inputEditId).html(val);
        $("#zl-contract-detail .zl-contract-block-content .zl-contract-text .zl-contract-text-input-list ul li[href=" + inputEditId + "] span").html(val);

        $(".zl-input-edit-dialog1").modal("hide");*/

    });
    /* 填空弹出框的删除事件 */
    $(".zl-input-edit-dialog .zl-delete").click(function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(this).parent().parent().find("input").val("/");
        //if (confirm("删除不可恢复,你确认要删除当前添空信息吗？")) {
        //    var inputEditId = $(".zl-input-edit-dialog").data("input-edit-id");
        //    $(container).find("#" + inputEditId).remove();
        //    $("#zl-contract-detail .zl-contract-block-content .zl-contract-text .zl-contract-text-input-list ul li[href=" + inputEditId + "]").remove();
        //    $(".zl-input-edit-dialog").modal("hide");
        //}
    });

    /* 填空弹出框的消失事件 */
    $(".zl-input-edit-dialog").on("hidden.bs.modal", function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(this).find(".modal-body label").html("请输入数据");
        $(this).find(".modal-body input").val("");
    });


    // ======================================== 右边iframe区域事件 ========================================
    // 填空按钮 点击事件
    $(".zl-contract-text-input-list-btn").click(function (e) {
        e.stopPropagation();
        e.preventDefault();

        $(".zl-contract-text-annotation-content-btn").removeClass("active");
        $(".zl-contract-text-input-list-btn").addClass("active");

        $(".zl-contract-text-annotation-content").hide();
        $(".zl-contract-text-input-list").show();
    });

    // 注册填空列表 编辑 点击事件
    $("#zl-contract-detail").on("click", " .zl-contract-block-content .zl-contract-text .zl-contract-text-input-list ul li em.edit", function (e) {
        e.stopPropagation();
        e.preventDefault();
        var href = $(this).parent().attr("href");
        $("#zl-contract-detail .zl-contract-block-content .zl-contract-text .zl-contract-text-input-list ul li[href=" + href + "]").click();
        $("#zl-contract-detail .zl-contract-block-content .zl-contract-text .zl-contract-text-input-list ul li[href=" + href + "]").dblclick();
    });

    // 注册填空列表 点击事件
    $("#zl-contract-detail").on("click", " .zl-contract-block-content .zl-contract-text .zl-contract-text-input-list ul li", function (e) {
        e.stopPropagation();
        e.preventDefault();
        $("#zl-contract-detail .zl-contract-block-content .zl-contract-text .zl-contract-text-input-list ul li").removeClass("active");
        $(this).addClass("active");

        var href = $(this).attr("href");
        $(container).find("[anchor-trigger]").attr("href", "#" + href);
        $(container).find("[anchor-trigger]")[0].click();

        $(container).find("[input-edit]").css("background-color", "rgb(203, 203, 203)");
        $(container).find("[input-edit][id=" + href + "]").css("background-color", "#18b0e2");
        $(container).find("ins").removeClass("active");
    });

    // 注册填空列表 双击事件
    $("#zl-contract-detail").on("dblclick", " .zl-contract-block-content .zl-contract-text .zl-contract-text-input-list ul li", function (e) {
        e.stopPropagation();
        e.preventDefault();
        var href = $(this).attr("href");
        $(container).find("#" + href).dblclick();
    });

    // 注册修订原内容按钮 点击事件
    $(".zl-contract-text-annotation-content-btn").click(function (e) {
        e.stopPropagation();
        e.preventDefault();

        $(".zl-contract-text-annotation-content-btn").addClass("active");
        $(".zl-contract-text-input-list-btn").removeClass("active");

        $(".zl-contract-text-annotation-content").show();
        $(".zl-contract-text-input-list").hide();
    });

    // 注册修订原内容列表 编辑 点击事件
    $("#zl-contract-detail").on("click", " .zl-contract-block-content .zl-contract-text .zl-contract-text-annotation-content ul li em.edit", function (e) {
        e.stopPropagation();
        e.preventDefault();
        var href = $(this).parent().parent().attr("href");
        $("#zl-contract-detail .zl-contract-block-content .zl-contract-text .zl-contract-text-annotation-content ul li[href=" + href + "]").click();
        $("#zl-contract-detail .zl-contract-block-content .zl-contract-text .zl-contract-text-annotation-content ul li[href=" + href + "]").dblclick();
    });

    // 注册修订原内容列表 删除 点击事件
    $("#zl-contract-detail").on("click", " .zl-contract-block-content .zl-contract-text .zl-contract-text-annotation-content ul li em.delete", function (e) {
        e.stopPropagation();
        e.preventDefault();
        var href = $(this).parent().parent().attr("href");

        var originalSource = $(container).find("ins[id=" + href + "]").attr("originalSource");
        $(container).find("ins[id=" + href + "]")[0].outerHTML = originalSource;
        $(this).parent().parent().remove();
    });

    // 注册修订原内容列表 点击事件
    $("#zl-contract-detail").on("click", " .zl-contract-block-content .zl-contract-text .zl-contract-text-annotation-content ul li", function (e) {
        e.stopPropagation();
        e.preventDefault();
        $("#zl-contract-detail .zl-contract-block-content .zl-contract-text .zl-contract-text-annotation-content ul li").removeClass("active");
        $(this).addClass("active");

        var href = $(this).attr("href");
        $(container).find("[anchor-trigger]").attr("href", "#" + href);
        $(container).find("[anchor-trigger]")[0].click();

        $(container).find("ins").removeClass("active");
        $(container).find("ins[id=" + href + "]").addClass("active");
        $(container).find("[input-edit]").css("background-color", "rgb(203, 203, 203)");
        //$(container).find("ins").css("background-color","yellow");
        //$(container).find("ins[id="+href+"]").css("background-color","tomato");
    });

    $("#zl-contract-detail").on("dblclick", " .zl-contract-block-content .zl-contract-text .zl-contract-text-annotation-content ul li", function (e) {
        e.stopPropagation();
        e.preventDefault();
        var href = $(this).attr("href");
        $(container).find("#" + href).dblclick();
    });

    /* ======================================== common methods ======================================== */
    // 刷新 修订原内容列表
    function refreshContractTextAnnotationContent() {

        var annotationContent = $("#zl-contract-detail .zl-contract-block-content .zl-contract-text .zl-contract-text-annotation-content ul");
        if (annotationContent.children().length == $(container).find("ins").length) {
            return;
        }

        annotationContent.empty();
        $(container).find("ins").each(function () {
            var originalSource = $(this).attr("originalSource");
            var id = $(this).attr("id");
            // var loginUserName = $("#loginUserName").val();
            var loginUserName = $(this).attr("userName");
            if(loginUserName=="undefined"|| loginUserName==''||loginUserName==null){
                loginUserName = $("#loginUserName").val();
            }
            var date = myDate.toLocaleDateString().substring(5, myDate.toLocaleDateString().length).replace("/", "-");
            var html = "<li href='" + id + "'>" +
                "<div>" +
                "<span>" + loginUserName + " " + date + "</span>" +
                "<em class='delete'>撤销</em>" +
                "<em class='edit'>编辑</em>" +
                "</div>" +
                "<div>" +
                originalSource +
                "</div>" +
                "</li>";
            annotationContent.append(html);
        });
    }


    /* ======================================== below is the related selection method ======================================== */
    function getSelectedHtml() {
        var selectedHtml = "";
        var documentFragment = null;
        try {
            if (container.getSelection) {
                documentFragment = container.getSelection().getRangeAt(0).cloneContents();
            } else if (container.selection) {
                documentFragment = container.selection.createRange().HtmlText;
            }

            for (var i = 0; i < documentFragment.childNodes.length; i++) {
                var childNode = documentFragment.childNodes[i];
                if (childNode.nodeType == 3) { // Text 节点
                    selectedHtml += childNode.nodeValue;
                } else {
                    var nodeHtml = childNode.outerHTML;
                    selectedHtml += nodeHtml;
                }

            }

        } catch (err) {

        }

        return selectedHtml;
    }

    function reSelect() {
        var selectedRange = getSelectedRange();
        fullSelectedRange = getFullSelectedRange(selectedRange);

        if (container.getSelection) {
            container.getSelection().removeAllRanges();
            container.getSelection().addRange(fullSelectedRange);
        } else if (container.selection) {
            container.selection.removeAllRanges();
            container.selection.addRange(fullSelectedRange);
        }
    }

    function getSelectedRange() {
        if (container.getSelection) {
            return container.getSelection().getRangeAt(0);
        } else if (container.selection) {
            return container.selection.createRange();
        }
    }

    function containNode(parentNode, childNode) {
        var nodeList = parentNode.childNodes;
        for (var i = 0; i < nodeList.length; i++) {
            if (childNode == nodeList[i]) {
                return true;
            }
        }
        return false;
    }

    function getLatestAncestorNode(commonAncestorContainer, node) {
        var hasContainer = containNode(commonAncestorContainer, node);
        if (hasContainer) {
            return node;
        }

        if (isSpecialTag(node.parentNode)) {
            return node.parentNode;
        }

        return getLatestAncestorNode(commonAncestorContainer, node.parentNode);
    }

    function getFullSelectedRange(selectedRange) {
        var selectedStartContainer = selectedRange.startContainer;
        var selectedStartOffset = selectedRange.startOffset;
        var selectedEndContainer = selectedRange.endContainer;
        var selectedEndOffset = selectedRange.endOffset;
        var commonAncestorContainer = selectedRange.commonAncestorContainer;
        if (selectedStartContainer == selectedEndContainer) {
            return selectedRange;
        }

        var newRange = container.createRange();

        // 如果最近祖先commonAncestorContainer是特殊节点，直接使用最新祖先节点
        if (isSpecialTag(commonAncestorContainer)) {
            newRange.selectNode(commonAncestorContainer);
            return newRange;
        }

        if (selectedStartContainer != commonAncestorContainer) {
            var ancestorContainer = getLatestAncestorNode(commonAncestorContainer, selectedStartContainer);
            ancestorContainer = getFullTag(ancestorContainer);

            if (isSpecialTag(ancestorContainer)) {
                newRange.setStartBefore(ancestorContainer);
            } else {
                newRange.setStart(selectedStartContainer, selectedStartOffset);
            }
        } else {
            newRange.setStart(selectedStartContainer, selectedStartOffset);
        }

        if (selectedEndContainer != commonAncestorContainer) {
            var ancestorContainer = getLatestAncestorNode(commonAncestorContainer, selectedEndContainer);
            ancestorContainer = getFullTag(ancestorContainer);
            if (isSpecialTag(ancestorContainer)) {
                newRange.setEndAfter(ancestorContainer);
            } else {
                newRange.setEnd(selectedEndContainer, selectedEndOffset);
            }
        } else {
            newRange.setEnd(selectedEndContainer, selectedEndOffset);
        }
        return newRange;
    }

    function isSpecialTag(node) {
        if (node.nodeName == "TABLE") {
            return true;
        }
        if (node.nodeName == "UL") {
            return true;
        }
        return false;
    }

    function getFullTag(ancestorContainer) {
        if (ancestorContainer.nodeName == "TD" || ancestorContainer.nodeName == "TH") {
            if (ancestorContainer.parentNode.parentNode.nodeName == "TABLE") {
                return ancestorContainer.parentNode.parentNode;
            }

            if (ancestorContainer.parentNode.parentNode.parentNode.nodeName == "TABLE") {
                return ancestorContainer.parentNode.parentNode.parentNode;
            }
        }

        if (ancestorContainer.nodeName == "TR") {
            if (ancestorContainer.parentNode.nodeName == "TABLE") {
                return ancestorContainer.parentNode;
            }

            if (ancestorContainer.parentNode.parentNode.nodeName == "TABLE") {
                return ancestorContainer.parentNode.parentNode;
            }
        }
        return ancestorContainer;
    }

};

//上传附件
var myDate = new Date();
// $(function () {
//     window.initUpload = function () {
//         //初始化
//         var btn = $(".zl-button-red");
//         ajxUpload(btn);
//     };
//
//     //上传文件
//     window.ajxUpload = function (btn) {
//         var button = btn;
//         new AjaxUpload(button, {
//             action: "uploadfile.htm",
//             data: {},
//             dataType: "json",
//             name: 'uploadFile',
//             onSubmit: function (file, ext) {
//                 this.setData({contractId: $("#contractId").val()});
//             },
//             onComplete: function (file, result) {
//                 var obj = new Function("return" + result)();
//                 if (obj.code == 0) {
//                     var data = obj.data;
//                     var baseHtml = "<li>" +
//                         "<div style='width: 50%;text-overflow: ellipsis;overflow: hidden;' id='uploadFileName'><a href='" + accessUrl + data.path + "'>" + file + "</a></div>" +
//                         "<div style='width: 25%;' id='uploadUserName'>" + data.uploadUserName + "</div>" +
//                         "<div style='width: 12%;'>" + (myDate.getMonth() + 1)+"-"+(myDate.getDate()) + "</div>" +
//                         "<div style='width: 13%;'><a href='javascript:void(0)' id='" + data.id + "' onclick='delAttachment(this);' style='text-decoration: none'>删除</a></div>" +
//                         "<input type='hidden' id='uploadPath' value='" + data.path + "'>";
//                     "</li>";
//                     $("#contractUploadFile").append(baseHtml);
//                 } else {
//                     alert(obj.msg)
//                 }
//             }
//         });
//     };
//
//     initUpload();
//
// });

//删除附件
function delAttachment(_this) {
    $.ajax({
        type: "POST",
        url: enrolmentWeb_Path + "contract/delAttachmentFile.htm",
        data: {attachmentId: _this.id},
        success: function (data) {
            if (data.code == 0) {
                $(_this).parent().parent().remove();
            } else {
                alert(data.msg)
            }
        }
    })
}

function openNetBussDetail(params) {
    formPost(netcommentWeb_Path + "/netcomment/openBillDetailByMasterId.htm", params, '_blank');
}
