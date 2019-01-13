var pageView=(function($){
    var pageView={};
    pageView.printInit=function(){
        $(".zl-print5").click(function () {
            var detailId = $(this).attr("detailId");
            var url="certificateManagementQuery.htm?detailIds=" + detailId;
            ysPrint.print(url);
        });
        $(".zl-print2").click(function () {
            function _cb(value){

            }
            if(confirm("确认冲销?")){

            }
        });
    }

    //附件上传
    pageView.fileupload=function () {
        $("#uploadFile").fileupload({
            pasteZone:null,
            url: "uploadfile.htm",
            dataType: 'json',
            add:function (e,data) {
                pageView.uploadFiles(data.files[0],function (item) {
                    data.formData = { path:item,contractId:$("#contractId").val()};
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
                console.log()
                result=result.data;
                var html =
                    '<li class="row">' +
                    '<span class="col-md-4">' +
                    '<em class="zl-em-icon zl-icon-attachment"></em>' +
                    '<a href="' + accessUrl + result.path + '" target="_blank" class="zl-attach-file-link">' + result.fileName + '</a>' +
                    '</span><span class="col-md-2">' + result.uploadUserName + '</span>' +
                    '<span class="col-md-4">' + new Date(result.uploadDate).toLocaleDateString() + '</span>' +
                    '<span class="col-md-2" style="text-align: center;"><a onclick="pageView.deleteFile(this, ' + result.id + ')" class="zl-attach-del" style="cursor: pointer;">删除</a></span>' +
                    '</li>';
                $(html).appendTo('#files');

                var attachments = "<input type='text' id='attachments_" + result.id + "' name='attachmentId' value='" + result.id + "' />";
                $(attachments).appendTo('#attachmentDiv');
                // var attachmentSize = $("#attachmentSize_" + $("#uploadFile").attr("progressId"));
                // attachmentSize.text(parseInt(attachmentSize.text()) + 1);
            }
        }).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');
    }


    pageView.uploadFiles=function (file,callback){
        var formData = new FormData();
        formData.append("action", "1002");
        formData.append("single", 1);
        formData.append("category", "net_lease_contract");
        formData.append("targetId", '');
        formData.append('file', file);
        $.ajax({
            url:fileWeb_Path+'sdk/platform/file',
            type: 'POST',
            dataType: "json",
            cache: false,
            data: formData,
            processData: false,
            contentType: false,
            success:function (response) {
                if (response.success) {
                    if (typeof callback === "function"){
                        callback(response.data.path);
                    }
                }
            }
        });
    }

    //附件删除
    pageView.deleteFile=function(_this, id) {
        if (confirm("确认删除？")) {
            $.ajax({
                url: "delAttachmentFile.htm",
                type: "POST",
                data: {attachmentId: id},
                success: function (result) {
                    result=eval("("+result+")");
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


    //发起、暂存
    pageView.pageSave=function () {
        $(".tmpSave").click(function () {
            var url=netcommentWeb_Path+"netcomment/saveBill.htm";
            var data=$("input").serializeArray();
            $.post(url,data,function (result) {
                result=eval("("+result+")");
                alert(result.msg);
            });
        });
        $(".submitSave").click(function () {
        });
        // 撤回操作
        $("#js-invalidNetComment").click(function () {
            var url=contractWeb_Path+"contract/invalidNetComment.htm";
            var commonId = $("#netCommontId").val();
            var id = $("#id").val();
            var mallId = $("#mallId").val();
            var data={code:"inamp-standardcontractformal-",mallId:mallId, commonId:commonId, common:"合同已废弃", id:id}
            $.post(url,data,function (result) {
                result=eval("("+result+")");
                alert(result.message);
                location.href = contractWeb_Path+"contract/index.htm";
            });
        })
    }

    // 回退按钮
    pageView.returnContractDetail = function () {
        $("#returnContractDetail").on("click",function () {
            var contractNo = $("#contractNo").val();
            formPost(contractWeb_Path + 'contract/index.htm', '', '');
        });
    }

    // 合同模版更换
    pageView.selectModel = function () {
        $(".zl-button-selectModel").click(function () {
            $("#addContractModel").modal("show");
        });
    }

    // 初始化合同模版
    pageView.selectModelInit = function () {
        var mallId = $("#mallId").val();
        if (isNaN(mallId)) {
            return false;
        }
        $.ajax({
            cache: true,
            type: "POST",
            dataType: "json",
            data: {mallId: mallId,contractTypeId:1},
            url: netcommentWeb_Path + "netcomment/getTemplateByMallIdAndType.htm",
            async: true,
            error: function (request) {
                alert("系统异常");
            },
            success: function (resultData) {
                if(resultData.data && resultData.data.length>0){
                    $("select[name=contractCategory]").html("");
                    var optionHtml = "";
                    for(var i = 0 ; i < resultData.data.length ; i++ ){
                        var temp = resultData.data[i];
                        var key = temp.id;
                        var value = temp.name;
                        console.log(key);
                        console.log(value);
                        optionHtml += "<option value='"+ key +"'>"+ value +"</option>";
                    }
                    $("select[name=contractCategory]").append(optionHtml);
                }
            }
        });
    }

    pageView.createContract = function () {
        var contractNo = $("#contractNo").val();
        var contractCategory = $("select[name=contractCategory]").val();
        var url = netcommentWeb_Path+ "netcomment/busicond/updateContractModel.htm";
        var data = "";
        if (isNaN(contractNo) || isNaN(contractCategory)) {
            return false;
        }
        data = {
                    contractNo:contractNo,
                    contractCategory:contractCategory
               }
        $.post(url,data,function (res) {
            alert(res.msg);
            if (res.success) {
                formPost(enrolmentWeb_Path + "detail.htm", {contractNo: contractNo});
            }
        },"json");
    }

    // 附件上传重新加载页面
    pageView.reload = function () {
        var contractNo = $("#contractNo").val();
        if (isNaN(contractNo)) {
            return false;
        }
        $("#attachmentSave").click(function () {
            formPost(enrolmentWeb_Path + "detail.htm", {contractNo: contractNo});
        });
    }

    // 发起合同评审
    pageView.contractToK2 = function () {
        // var termsCondition = $("#netCommontId").val();
        var contractNo = $("#contractNo").val();
            $("#contractToK2").on("click",function () {
                if (confirm("提交K2前请确认合同模版及文本准确无误！")) {
                    pageView.saveToContract();
                }
            });
    }

    pageView.saveToContract = function () {
        $(".updateType").val("01");
        var html = "";
        var toBillEditUrl = netcommentWeb_Path + "netcomment/contract/toBillEdit.htm";
        var toNewAddUrl = netcommentWeb_Path + "netcomment/contract/toNewAdd.htm";
        if (document.getElementById("contract_reference")) {
            if(document.getElementById("contract_reference").contentDocument.head){
                html += document.getElementById("contract_reference").contentDocument.head.innerHTML;
            }
            html += document.getElementById("contract_reference").contentDocument.body.innerHTML;
        }
        html = encodeURI(html);
        var contractId = $("#contractId").val();
        var businessCondition = $("#businessCondition").val();
        var termsCondition = $("#netCommontId").val();
        var review = $("#review").val();
        var updateType = $(".updateType").val();
        var contractType = $("#contractType").val();
        var mallContBankId = $("#mallContBankId").val();
        var contractNo = $("#contractNo").val();
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
                                    // formPost(enrolmentWeb_Path + "contract/detail.htm", {contractNo: data.data});
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
                        // formPost("detail.htm", {contractNo: data.data},"");
                        if (termsCondition == "" || termsCondition == undefined || termsCondition == null) {
                            formPost(toNewAddUrl,{contractNo:contractNo},'');
                        } else {
                            formPost(toBillEditUrl,{masterId:termsCondition},'');
                        }
                    } else {
                        // alert("","","","");
                        alert(data.msg);
                    }
                }
            })
        }
    }

    // 合同文本作废
    pageView.contractCancel = function () {
        var url = contractWeb_Path + "contract/contractCancel.htm";
        var contractNo = $("#contractNo").val();
        var data ;
        $(".zl-button-contractCancel").on("click",function () {
            if (confirm("请确认作废？")) {
                data = {
                    contractNo : contractNo
                }
                $.post(url,data,function (res) {
                    alert(res.msg);
                    if (res.success) {
                        formPost(enrolmentWeb_Path + "detail.htm", {contractNo: contractNo});
                    }
                },"json");
            }
        });
    }

    // 合同文本冻结
    pageView.contractFreeze = function () {
        var url = contractWeb_Path + "contract/contractFreeze.htm";
        var contractNo = $("#contractNo").val();
        var data ;
        $(".zl-button-freeze").on("click",function () {
            if (confirm("请确认冻结该文本？")) {
                data = {
                    contractNo : contractNo
                }
                $.post(url,data,function (res) {
                    alert(res.msg);
                    if (res.success) {
                        formPost(enrolmentWeb_Path + "detail.htm", {contractNo: contractNo});
                    }
                },"json");
            }
        });
    }

    // 合同文本解冻
    pageView.contractUnFreeze = function () {
        var url = contractWeb_Path + "contract/contractUnFreeze.htm";
        var contractNo = $("#contractNo").val();
        var data ;
        $(".zl-button-unFreeze").on("click",function () {
            if (confirm("请确认解冻该文本？")) {
                data = {
                    contractNo : contractNo
                }
                $.post(url,data,function (res) {
                    alert(res.msg);
                    if (res.success) {
                        formPost(enrolmentWeb_Path + "detail.htm", {contractNo: contractNo});
                    }
                },"json");
            }
        });
    }

    pageView.search=function () {
        $( "#js-search" ).autocomplete({
            // source: availableTags,
            source: function( request, response ) {
                $.ajax( {
                    url: netcommentWeb_Path+"netcomment/contract/getApprovedCont.htm",
                    dataType: "json",
                    data: {
                        contNo: request.term
                    },
                    success: function( data ) {
                        response( $.map( data["bisCont"], function( item ) {
                            return {
                                label: item.contNo+"&&"+item.storeNos ,
                                value: {projectName:item.mallId,contName:item.storeNos,tenant:item.companyName,
                                    brandName:item.brandName,layOut:item.layoutName,contNo:item.contNo,
                                    leaseArea:item.storeNos,totalRental:"",contStartDate:item.contBeginDate,
                                    contEndDate:item.contEndDate,contUrl:item.contUrl}
                            }
                        }));
                    }
                } );
            },

            minLength: 2,
            select: function( event, ui ) {
                this.value = ui.item.value.contNo;
                $("#projectName").val(ui.item.value.projectName);
                $("#contName").val(ui.item.value.contName);
                $("#tenant").val(ui.item.value.tenant);
                $("#brandName").val(ui.item.value.brandName);
                $("#layOut").val(ui.item.value.layOut);
                $("#leaseArea").val(ui.item.value.leaseArea);
                $("#totalRental").val(ui.item.value.totalRental);
                $("#contStartDate").val(ui.item.value.contStartDate);
                $("#contEndDate").val(ui.item.value.contEndDate);
                $("#contUrl").attr("src",accessUrl+ui.item.value.contUrl);
                $("#contPath").val(accessUrl+ui.item.value.contUrl);
                return false;
            }
        });
    }

    pageView.pageInit=function(){

        $(".zl-query-info").click(function () {
            var url="certificateModelSave.htm";
            var inputVal=$(".submit").serializeArray();
            $.post(url,inputVal,function (result) {
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
            pageView.loadingShow();
            setTimeout(function () {
                $("#paginateForm").attr("action","certificateModelList.htm").submit();
            },2000);
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
            pageView.loadingShow();
            setTimeout(function () {
                $("#paginateForm").find("input[name=page]").val(1);
                $("#paginateForm").attr("action","certificateModelList.htm").submit();
            },3000);
        });

        // $.ajaxSetup({
        //     type : 'POST',
        //     beforeSend:function () {
        //         pageView.loadingShow();
        //     },
        //     error : function(){
        //         pageView.loadingHide();
        //     },complete:function(){
        //         pageView.loadingHide();
        //     }
        // });

    }

    pageView.dropdownInit=function(){

        $(".zl-dropdown").ysdropdown({
        });
    }


    pageView.loadingShow=function(){
        $(".zl-loading").fadeIn();
    };

    pageView.loadingHide=function(){
        $(".zl-loading").fadeOut();
    }

    pageView.init=function(){
        $("#preloader").fadeOut("fast");
        // confirmAlert.init();
        pageView.printInit();
        pageView.pageInit();
        pageView.dropdownInit();
        pageView.pageSave();
        pageView.search();
        pageView.fileupload();
        pageView.selectModel();
        pageView.selectModelInit();
        pageView.reload();
        pageView.contractToK2();
        pageView.contractCancel();
        pageView.contractFreeze();
        pageView.contractUnFreeze();
        pageView.returnContractDetail();
    };

    return pageView;

})(jQuery);

$(document).ready(function(){
    console.log("................")
    pageView.init();
});