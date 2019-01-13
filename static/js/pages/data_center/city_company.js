var dubSumit = 0;
(function(){
    $("#preloader").fadeOut("fast");
/*
    var page = $("#city-company");

    page.on("click",".zl-panel-row",function(e){
        e.stopPropagation();
        e.preventDefault();
        $(this).next().collapse("show");
    });*/


  /*  page.on("click","button.zl-edit-collapse-btn",function(e){
        e.stopPropagation();
        e.preventDefault();
        $(this).closest(".zl-collapse-wrapper").collapse("hide");
    });*/



})();

/*##################################分页###############################################*/

$("#city-company").on("click", ".zl-paginate", function (e) {
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

// $("#gotoPageNum").on("blur", function (e) {
//     if (!isNumberss($(this).val()) || parseInt($(this).val()) == 0) {
//         alert("请输入合法数字！");
//         return false;
//     }
//     if(regeMatch($(this).val())){
//         alert("请勿输入特殊字符！");
//         return false;
//     }
//     if (parseInt($(this).val()) > parseInt($("#pages").val())) {
//         alert("超过总页数！");
//         $(this).val($("#pages").val());
//         return false;
//     }
// });

$("#gotoPage").on("click", function (e) {
    if (!isNumberss($("#gotoPageNum").val()) || parseInt($("#gotoPageNum").val()) == 0) {
        alert("请输入合法数字！");
        return false;
    }
    if(regeMatch($("#gotoPageNum").val())){
        alert("请勿输入特殊字符！");
        return false;
    }
    if(regeMatch($("#gotoPageNum").val())){
        alert("请勿输入特殊字符！");
        return false;
    }
    if(verifyPagination(parseInt($("#gotoPageNum").val()), parseInt($("#pages").val()))){
        $("#searchBsAreaForm").find("input[name=page]").val($("#gotoPageNum").val());
        $("#searchBsAreaForm").trigger("submit");
    }else{
        $("#gotoPageNum").val($("#pages").val());
    }
});

$(".zl-page-num-input").bind("keypress",function(event){
    if(event.keyCode == "13")
    {
        $("#gotoPage").trigger("click");
    }
});

/*$("#searchBsFormBtn").on("click", function (e) {
    $("#searchBsAreaForm").find("input[name=page]").val(1);
    $("#searchBsAreaForm").trigger("submit");
});*/
$("#searchBsAreaForm").submit(function () {
    var self = $(this);
    //var areaName = $.trim($(this).find("input[name=areaName]").val());
    //self.find("input[name=areaNameEncode]").val(encodeURI(areaName));
    self.attr("action", enrolmentWeb_Path + "area/index.htm");
});
/*##################################分页###############################################*/

/*##################################添加###############################################*/
$("#addBsAreaBtn").on("click", function (e) {
    if (dubSumit > 0) {
        alert("请勿重复提交表单！");
        return false;
    }
    if (!validateForm($('#addBsAreaForm'))) {
        return false;
    }

    dubSumit++;
    var params = $('#addBsAreaForm').serialize();
    $.ajax({
        type: "POST",
        url: enrolmentWeb_Path + "area/add.htm",
        data: params,
        async: false,
        error: function (request) {
            alert("系统异常");
        }, success: function (response) {
            var obj =JSON.parse(response);
            alert(obj.msg,"","",function(){
                loadPage();
            });
        }
    });
});

function loadPage(){
    location.href=enrolmentWeb_Path + "area/index.htm";
}
/*##################################添加###############################################*/
/*##################################修改###############################################*/
$("[name=updateBsAreaBtn]").on("click", function () {
    var bsAreaId = $(this).attr("entityId");
    if (!validateForm($('#updateBsAreaForm_' + bsAreaId))) {
        return false;
    }
    confirm("确认修改提交？", "", "", function (type) {
        if (type == "dismiss") return;
        $.ajax({
            type: "POST",
            url: enrolmentWeb_Path + "area/update.htm",
            data: $('#updateBsAreaForm_' + bsAreaId).serialize(),
            error: function (request) {
                alert("系统异常");
            }, success: function (response) {
                var obj = JSON.parse(response);
                alert(obj.msg, "", "", function () {
                    location.reload();
                });
            }
        });
    });
});
/*##################################修改###############################################*/

/*##################################删除###############################################*/
$("[name=deleteBsAreaBtn]").on("click", function () {
    var bsAreaId = $(this).attr("entityId");
    confirm("确认要删除吗？","","",function(type){
        if (type == "dismiss") return;
        $.ajax({
            cache: true,
            type: "POST",
            url: enrolmentWeb_Path + "area/delete.htm?id=" + bsAreaId,
            async: false,
            error: function (request) {
                alert("系统异常");
            },
            success: function (resultData) {
                var obj =JSON.parse(resultData);
                alert(obj.msg,"","",function(){
                    location.reload();
                });
            }
        });
    });
});
/*##################################删除###############################################*/

/*##################################字段校验###############################################*/
function validateForm(obj) {
    var areaName = $.trim($(obj).find("input[name=areaName]").val());
    var areaCode = $.trim($(obj).find("input[name=areaCode]").val());
    var shortName = $.trim($(obj).find("input[name=shortName]").val());
    var parentName = $.trim($(obj).find("input[name=parentName]").val());
    var address = $.trim($(obj).find("input[name=address]").val());

    if (areaName == "" || areaName == null) {
        alert("城市公司名称不能为空！");
        $(obj).find("input[name=areaName]").focus();
        return false;
    }
    if(regeMatch(areaName)){
        alert("请勿输入特殊字符！");
        $(obj).find("input[name=areaName]").focus();
        return false;
    }
    if (areaCode == "" || areaCode == null) {
        // alert("城市公司编号不能为空！");
        // $(obj).find("input[name=areaCode]").focus();
        // return false;
    }/*else if(!isNumberss(areaCode)){
        alert("城市公司编号只能填写数字！");
        $(obj).find("input[name=areaCode]").focus();
        return false;
    }*/
    if(regeMatch(areaCode)){
        alert("请勿输入特殊字符！");
        $(obj).find("input[name=areaCode]").focus();
        return false;
    }
    if(shortName =="" || shortName == null){
        alert("城市公司简称不能为空！");
        $(obj).find("input[name=shortName]").focus();
        return false;
    }
    if(regeMatch(shortName)){
        alert("请勿输入特殊字符！");
        $(obj).find("input[name=shortName]").focus();
        return false;
    }
 /*   if(address =="" || address == null){
        alert("城市公司地址不能为空！");
        $(obj).find("input[name=address]").focus();
        return false;
    }*/
    if(regeMatch(address)){
        alert("请勿输入特殊字符！");
        $(obj).find("input[name=address]").focus();
        return false;
    }
    if (parentName == "" || parentName == null) {
        // alert("上级城市公司不能为空！");
        // $(obj).find("input[name=parentName]").focus();
        // return false;
    }
    return true;
}


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

function verifyPagination(value,total) {
    if(total===0) return true;
    if(!isNumber(value)){
        alert('请输入正确的页码');
        return  false;
    }
    if(value>total){
        alert('超过总页数,请重新输入 ');
        return false;
    }
    return true;
}
function query(){
    $("#searchBsAreaForm").find("input[name=page]").val(1);
    $("#searchBsAreaForm").trigger("submit");
}
/*##################################字段校验###############################################*/