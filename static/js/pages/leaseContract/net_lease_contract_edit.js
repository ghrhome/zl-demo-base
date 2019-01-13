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
            url: netcommentWeb_Path + "netcomment/fileUpload.htm",
            dataType: 'json',
            add:function (e,data) {
                pageView.uploadFiles(data.files[0],function (item) {
                    data.formData = { path:item};
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
                result=result.data;
                var html =
                    '<li class="row">' +
                    '<span class="col-md-4">' +
                    '<em class="zl-em-icon zl-icon-attachment"></em>' +
                    '<a href="' + accessUrl + result.attachmentPath + '" target="_blank" class="zl-attach-file-link">' + result.attachmentName + '</a>' +
                    '</span><span class="col-md-2">' + result.createrName + '</span>' +
                    '<span class="col-md-4">' + new Date(result.createdDate).toLocaleDateString() + '</span>' +
                    '<span class="col-md-2" style="text-align: center;"><a onclick="pageView.deleteFile(this, ' + result.id + ')" class="zl-attach-del" style="cursor: pointer;">删除</a></span>' +
                    '</li>';
                $(html).appendTo('#files');

                var attachments = "<input type='text' id='attachments_" + result.id + "' name='attachments' value='" + result.id + "' />";
                $(attachments).appendTo('#attachmentDiv');
                // var attachmentSize = $("#attachmentSize_" + $("#uploadFile").attr("progressId"));
                // attachmentSize.text(parseInt(attachmentSize.text()) + 1);
                pageView.loadingHide();
            },
            error:function () {
                pageView.loadingHide();
            }
        }).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');
    }


    pageView.uploadFiles=function (file,callback){
        pageView.loadingShow();
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

    pageView.returnContractDetail = function () {
        $("#returnContractDetail").on("click",function () {
            var contractNo = $("#contractNo").val();
            formPost(contract_Path + 'contract/detail.htm', {contractNo: contractNo},'')
        });
    }

    //附件删除
    pageView.deleteFile=function(_this, id) {
        if (confirm("确认删除？")) {
            $.ajax({
                url: netcommentWeb_Path + "netcomment/deleteFile.htm",
                type: "POST",
                data: {id: id},
                success: function (result) {
                    result=eval("("+result+")");
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

    //发起、暂存
    pageView.pageSave=function () {
        $(".tmpSave").click(function () {
            pageView.loadingShow();
            var url=netcommentWeb_Path+"netcomment/saveBill.htm";
            var data=$("input").serializeArray();
            $.post(url,data,function (result) {
                pageView.loadingHide();
                result=eval("("+result+")");
                alert(result.msg);
                $("#masterId").val(result.data);
                formPost(contract_Path+"contract/detail.htm?contractNo="+result.contractNo,"","");
            });
        });
        $(".submitSave").click(function () {
            pageView.loadingShow();
            if (pageView.checkNetForm()) {
                var url= netcommentWeb_Path+"netcomment/saveBill.htm";
                var data=$("input").serializeArray();
                var masterId;
                $.post(url,data,function (result) {
                    result=eval("("+result+")");
                    pageView.loadingHide();
                    if(result.success==true){
                        masterId=result.data;
                        $("#masterId").val(result.data);
                        var areaCode = $("#areaCode").val();
                        var contractType = $("#contractType").val();
                        var category = $("#category").val();
                        var code = "";
                        if(contractType == 1 || contractType == undefined){
                            if(category == "00" ){
                                code = "inamp-standardcontractformal-";
                            }
                            if(category == "01" ){
                                code = "inamp-nonstandardcontractformal-"
                            }
                        }
                        if(contractType == 2){
                            code = "inamp-diversificationcontractformal-contract-";
                        }
                        pageCommon.submitNetComment(code + areaCode, masterId, contract_Path + "/contract/index.htm");
                    }
                });
            }else {
                pageView.loadingHide();
            }

        });
    }

    /**
     * 表单必输校验
     * @returns {boolean}
     */
    pageView.checkNetForm=function () {
        //必输项校验
        var isChecked = true;
        $('body').find(".required:visible").each(function () {
            var title = $(this).attr("title") || "必填项";
            var _this;
            if ($(this).find("select").length > 0) {
                _this = $(this).find("select");
            } else if ($(this).find("input[type!='hidden'][type='radio']").length > 0) {
                _this = $($(this).find("input[type='radio']:checked"));
            } else if ($(this).find("input[type!='hidden']").length > 0) {
                _this = $(this).find("input[type!='hidden']");
            } else if ($(this).find("textarea").length > 0) {
                _this = $($(this).find("textarea"));
            } else {
                _this = $(this).find("input[type!='hidden']");
            }

            if ((_this.val() == "" || _this.val() == undefined) && (_this.attr("name") != undefined && _this.attr("name").indexOf("bootstrapDropdown") == -1)) {
                var msg = title + "不能为空!";
                alert(msg);
                isChecked = false;
                _this.focus();
                return false;
            }

            //画面中的 下拉选择 必填项判断
            if ($(this).find(".zl-dropdown-btn").length > 0) {
                _this = $(this).find(".zl-dropdown-btn");
                if (_this.html() == "" || _this.html() == undefined || _this.html().indexOf("请选择") > 0) {
                    var msg = title + "不能为空!";
                    alert(msg);
                    isChecked = false;
                    _this.focus();
                    return false;
                }
            }

        });

        //金额非负验证
        $('body').find("input[type='number']:visible").each(function () {
            var title = $(this).attr("title") || "金额";
            var _this = $(this);
            if (parseFloat(_this.val()) < 0 && _this.attr('negative') != 'true') {
                alert(title + "不能小于0");
                isChecked = false;
                _this.focus();
                return false;
            }
        });
        return isChecked;
    }

    pageView.loadingData=function(){
        if($("#contractNo").val()!=null&&$("#contractNo").val()!=''&&$("#contractNo").val()!=undefined){
            var url= netcommentWeb_Path+"netcomment/contract/getApprovedCont.htm";
            var data={
                searchWord:$("#contractNo").val()
            }
            $.post(url,data,function (result) {
                $.map(result.bisCont,function (item) {
                    $("#js-search").val(item.contNo);
                    $("#mallId").val(item.mallId);
                    $("#projectName").val(item.itemName);
                    $("#contName").val(item.storeNos);
                    $("#tenant").val(item.companyName);
                    $("#brandName").val(item.brandName);
                    $("#layOut").val(item.layoutName);
                    $("#leaseArea").val(item.storeNos);
                    $("#totalRental").val(item.totalRental);
                    $("#contStartDate").val(item.contBeginDate);
                    $("#contEndDate").val(item.contEndDate);
                    $("#contUrl").attr("src",accessUrl+item.contUrl);
                    $("#contPath").val(accessUrl+item.contUrl);
                    $("#contractId").val(item.contractId);
                    $("#contractType").val(item.contractType);
                    $("#category").val(item.category);
                    pageCommon.initMallCode();
                });
            },"json");
        }
    }

    pageView.search=function () {
        $( "#js-search" ).autocomplete({
            // source: availableTags,
            source: function( request, response ) {
                $.ajax( {
                    url: netcommentWeb_Path+"netcomment/contract/getApprovedCont.htm",
                    dataType: "json",
                    data: {
                        searchWord: request.term
                    },
                    success: function( data ) {
                        response( $.map( data["bisCont"], function( item ) {
                            return {
                                label: item.contNo+"&&"+item.storeNos ,
                                value: {projectName:item.itemName,contName:item.storeNos,tenant:item.companyName, mallId:item.mallId,
                                    brandName:item.brandName,layOut:item.layoutName,contNo:item.contNo,
                                    leaseArea:item.storeNos,totalRental:"",contStartDate:item.contBeginDate,
                                    contEndDate:item.contEndDate,contUrl:item.contUrl,contractId:item.contractId, contractType:item.contractType,
                                    category:item.category
                                }
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
                $("#mallId").val(ui.item.value.mallId);
                $("#contractType").val(ui.item.value.contractType);
                $("#category").val(ui.item.value.category);
                pageCommon.initMallCode();
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
        pageView.loadingData();
        pageView.returnContractDetail();
    };

    return pageView;

})(jQuery);

$(document).ready(function(){
    console.log("................")
    pageView.init();
});