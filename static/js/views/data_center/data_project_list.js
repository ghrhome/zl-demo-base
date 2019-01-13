var dubSumit = 0;
var isAddFile=false;
var ran1="";
var imgkkAll="";
var ids="";     //附件id
var urls="";     //附件路径(删除)
var addUrls="";    //附件路径(添加)
var targetIds="";     //业务编号
var isshanchu=false;
/*##################################分页###############################################*/

$("#data-project-list").on("click", ".zl-paginate", function (e) {
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
    $("#searchBsAreaForm").find("input[name=page]").val(page);
    $("#searchBsAreaForm").trigger("submit");
});

$("[name=areaName]").on("keypress", function (e) {
    e.stopPropagation();
    if (e.keyCode == 13) {
        var areaName = $(this).val();
        $("#searchBsAreaForm").find("input[name=areaNameEncode]").val(encodeURI(areaName));
    }
});

$("#gotoPageNum").on("blur", function (e) {
    if (!isNumberss($(this).val()) || parseInt($(this).val()) == 0) {
        alert("请输入合法数字！");
        return false;
    }
    if(regeMatch($(this).val())){
        alert("请勿输入特殊字符！");
        return false;
    }
    if (parseInt($(this).val()) > parseInt($("#pages").val())) {
        alert("超过总页数！");
        $(this).val($("#pages").val());
        return false;
    }
});

$("#gotoPage").on("click", function (e) {
    if(regeMatch($("#gotoPageNum").val())){
        alert("请勿输入特殊字符！");
        return false;
    }
    $("#searchBsAreaForm").find("input[name=page]").val($("#gotoPageNum").val());
    $("#searchBsAreaForm").trigger("submit");
});

/*$("#searchBsFormBtn").on("click", function (e) {
    $("#searchBsAreaForm").find("input[name=page]").val(1);
    $("#searchBsAreaForm").trigger("submit");
});*/
$("#searchBsAreaForm").submit(function () {
    var self = $(this);
    //var areaName = $.trim($(this).find("input[name=areaName]").val());
    //self.find("input[name=areaNameEncode]").val(encodeURI(areaName));
    self.attr("action", enrolmentWeb_Path + "mall/index.htm");
});
/*##################################分页###############################################*/

/*##################################字段校验###############################################*/

//特殊字符校验 存在特殊字符返回true
function regeMatch(strs){
    var pattern = new RegExp("[~'!@#$%^&*()-+_=:]");
    if(strs != "" && strs != null){
        if(pattern.test(strs)){
            //alert("非法字符！");
            return true;
        }else{
            return false;
        }
    }
}

//数字校验
function isNumberss(num) {
    var pat = new RegExp('^[0-9]+$');
    return pat.test(num)
}

function isNumber(value) {
    return /^(\-?)[0-9]+.?[0-9]*$/.test($.trim(value))
}
function isInt(str) {
    var reg = /^(-|\+)?\d+$/;
    return reg.test(str);
}
/*##################################字段校验###############################################*/





/*##################################增加附件###############################################*/

var isAdd=false;
$("#mya").click(function () {
    imgkkAll="";
    isshanchu=true;
    isAdd=true;
})

var enrolmentWeb_Path = "http://localhost:8087/file_web/";
var iszj=false;
$(".zl-text-outstanding").ysSimpleUploadFile({
    changeCallback: function (file) {
        var fileReader = new FileReader();
        $(this).parent().height(136);
        var that = this;
        fileReader.onload = function () {
            $(that).next().css("display", "block");
            imgkkAll=$(that).attr("al");
            compressImage(1000, 1000, this.result, null, function (dataUrl) {
                var html = "<li><a style='background-image:url(" + dataUrl + ")'><em></em></a></li>";
                $(that).next().append(html);
                var formData = new FormData();
                formData.append("action", "1002");
                formData.append("single", 1);
                formData.append("category", "FILE_ENROLMENT_MALL");
                formData.append("targetId", ran1);
                formData.append('file', file);
                $.ajax({
                    url:   enrolmentWeb_Path+'sdk/platform/file',
                    type: 'POST',
                    dataType: "json",
                    async: true,
                    cache: false,
                    data: formData,
                    processData: false,
                    contentType: false
                }).done(function (response) {
                    alert(response);
                    if (response.success) {
                        targetIds=response.data.targetId;
                        ids=response.data.id;
                        var  myurls = accessUrl + response.data.path;
                        if(isshanchu==false && iszj==false){
                            urls=","+imgkkAll;
                            iszj=true;
                        }
                        if(isAdd){
                            addUrls+=","+myurls;
                        }else if(isAdd==false){
                            urls+=","+myurls;
                        }
                        $(that).next().find("li:last-child a").attr("data-image", myurls);
                    } else {
                        alert(response.message);
                    }
                });
            });
        };
        fileReader.readAsDataURL(file);
    }
});

var isUp=false;
var container = $("#project-info");
container.on("click", ".upload-pic-item-list li a em", function (e) {
    e.stopPropagation();
    e.preventDefault();
    $(this).closest("li").remove();
    var imgkk=","+$(this).closest("a").attr("data-image");

    if(isAdd){
        addUrls=addUrls.replace(imgkk,"");
        var last=addUrls.charAt(addUrls.length - 1);
        if(last==","){
            addUrls=addUrls+",";
            addUrls=addUrls.replace(",,","");
        }
    }else{
        if(isUp){
            imgkkAll=urls;
        }else{
            imgkkAll=","+$(this).closest("a").attr("al");
        }
        imgkkAll=imgkkAll.replace(imgkk,"");
        var last=imgkkAll.charAt(imgkkAll.length - 1);
        if(last==","){
            imgkkAll=imgkkAll+",";
            imgkkAll=imgkkAll.replace(",,","");
        }
        var fiest=imgkkAll.charAt(0);
        var er=imgkkAll.charAt(1);
        if(fiest=="," && er!=","){
            imgkkAll=","+imgkkAll;
            imgkkAll=imgkkAll.replace(",,","");
        }else{
            imgkkAll=imgkkAll.replace(",,","");
        }
        if(imgkkAll!=""){
            urls=","+imgkkAll;
        }else{
            urls="";
        }
        isshanchu=true;
        isUp=true;
    }

});

/*##################################增加附件###############################################*/

/*##################################收款单位信息###############################################*/
/*function addContInfo(obj) {
    var contInfoList = $(obj).parents(".cont-info-container").find(".cont-info-list");
    %(".zl-block").append(contInfoList);




}*/



//通过ajax加载银行信息
function renderPropertyAutoComplete(element) {
    return $(element).select2({
        placeholder: '请输入甲方开户帐号',
        language: 'zh-CN',
        dropdownCssClass: "bigdrop",
        escapeMarkup: function (m) {
            return m;
        },
        minimumInputLength: 1,
        ajax: {
            url: enrolmentWeb_Path + 'store/getBsBankAccountList.htm',
            data: function (params) {
                return {term: params.term};
            },
            processResults: function (data) {
                return {results: data};
            }
        },
        templateResult: function (item) {
            return item.accountNo;
        },
        templateSelection: function (selection) {
            return selection.text ? selection.text : selection.accountNo;
        },
        initSelection: function (element, callback) {
            if (!element.val()) {
                callback([])
            } else {
                var id = $(element).val();
                if (id !== "") {
                    $.ajax(enrolmentWeb_Path + 'store/getBsBankAccountList.htm', {dataType: "json", data: {id: id}}).done(function (data) {
                        callback(data);
                    });
                }
            }
        }
    }).on("select2:select", function (event, data) {
        //$(this).parents(".contInfo").find("select[name=accountNo]").attr("title", event.params.data.accountNo);
        $(this).parents(".contInfo").find(".select3").find("span").attr("title", event.params.data.accountNo);
        $(this).parents(".contInfo").find("input[name=bankAccountId]").val(event.params.data.id);
        $(this).parents(".contInfo").find("input[name=accountName]").val(event.params.data.accountName);
        $(this).parents(".contInfo").find("input[name=accountName]").attr("title", event.params.data.accountName);
        $(this).parents(".contInfo").find("input[name=bankName]").val(event.params.data.bankName);
        $(this).parents(".contInfo").find("input[name=bankName]").attr("title", event.params.data.bankName);
    });
}





/*##################################收款单位信息###############################################*/


