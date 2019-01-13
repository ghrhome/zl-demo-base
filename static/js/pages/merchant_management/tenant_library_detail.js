//Updated by liuqq at 2018-07-20
//优化品牌授权保存问题

var pageView = (function($){
    var pageView = {};

    pageView.init = function () {

        $(".zl-dropdown-inline").ysdropdown("init");

        $("tbody").on('click', '.but-val', function () {
            var val = $(this).attr("data-value");
            var name = $(this).html();
            $(this).parent().parent().parent().find(".btn-default").html(name);
            $(this).parent().parent().parent().parent().find(".input-val").val(val);
            if (val == '1001') {
                $("#workTel").attr("readonly", false);
                $("#workAddress").attr("readonly", false);
                $("#workTel").parent().attr("class", 'zl-edit required');
                $("#workAddress").parent().attr("class", 'zl-edit required');
            }
            if (val == '1002') {
                $("#workTel").val('');
                $("#workAddress").val('');
                $("#workTel").attr("readonly", true);
                $("#workTel").parent().attr("class", 'zl-edit');
                $("#workAddress").attr("readonly", true);
                $("#workAddress").parent().attr("class", 'zl-edit');
            }
        });


        $("#saveBtn").on("click", function () {
            var flag=false;
            //校验上传授权书的时候是否填写了日期

            //校验上传图片的时候是否填写了日期
            $("body .check-image-flag").each(function () {
                if($(this).find(".clearVal_input").val()){
                    //console.log($(this).find(".clearVal_input").val());
                    if($(this).prev().prev().prev().find(".input-val").val()==""){
                        alert("当前有证照图片已经上传，请选择证照类型！！！");
                        flag=true;
                        return;
                    }
                    if($(this).prev().prev().find(".form-control").val()==""){
                        alert("当前有证照图片已经上传，请选择证照有效的开始时间！！！");
                        flag=true;
                        return;
                    }
                    if($(this).prev().find(".form-control").val()==""){
                        alert("当前有证照图片已经上传，请选择证照有效的结束时间！！！");
                        flag=true;
                        return;
                    }
                }
            })
            if(flag){
                return;
            }
            var data = {};
            //租户信息
            var tmp = $("#zl-section-collapse-table-1").find("input").serializeArray();
            var ibCompany = {};
            $.each(tmp, function (i, map) {
                if(!(map.name in ibCompany)){
                    ibCompany[map.name] = map.value;
                }
            });
            data.ibCompany = JSON.stringify(ibCompany);

            //品牌授权列表
            var ibBrandCompanyRelList = [];
            $("#zl-section-collapse-table-3 tr").each(function () {
                var tmp = $(this).find("input").serializeArray();
                var obj = {};
                $.each(tmp, function (i, map) {
                    if(!(map.name in obj)){
                        obj[map.name] = map.value;
                    }
                });
                if(!$.isEmptyObject(obj)){
                    ibBrandCompanyRelList.push(obj);
                }
            });
            data.ibBrandCompanyRelList = JSON.stringify(ibBrandCompanyRelList);
            //证照列表
            var ibCompanyLicenseList = [];
            $("#zl-section-collapse-table-4 tr").each(function () {
                var tmp = $(this).find("input").serializeArray();
                var obj = {};
                $.each(tmp, function (i, map) {
                    if(!(map.name in obj)){
                        obj[map.name] = map.value;
                    }
                });
                if(!$.isEmptyObject(obj)){
                    ibCompanyLicenseList.push(obj);
                }
            });
            data.ibCompanyLicenseList = JSON.stringify(ibCompanyLicenseList);

            var tmp = $("#zl-section-collapse-table-5").find("input").serializeArray();
            var taxpayer = {};
            $.each(tmp, function (i, map) {
                if(!(map.name in ibCompany)){
                    taxpayer[map.name] = map.value;
                }
            });
            data.taxpayer = JSON.stringify(taxpayer);
            data.ibCompany = JSON.stringify($.extend(ibCompany, taxpayer));
            console.log(data);
            pageView.loadingShow();
            $.ajax({
                url: 'save.htm',
                type: 'post',
                data: data,
                dataType: 'json',
                error: function () {
                    pageView.loadingHide();
                    alert('系统异常');
                },
                success: function (res) {
                    pageView.loadingHide();
                    if (res.code == '0') {
                        alert(res.msg, "", "", function () {
                            window.location = "index.htm";
                        });
                    } else {
                        alert(res.msg);
                    }
                }
            });
        });
        $("#delBtn").on("click", function (e) {
            var companyId = $("#companyId").val();
            confirm("确认删除该租户？", "", "", function (type) {
                if (type == "confirm") {
                    $.ajax({
                        cache: true,
                        type: "POST",
                        url: ibrandWeb_Path + "company/delCompany.htm",
                        data: {id: companyId},
                        async: false,
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            alert("系统异常");
                        },
                        success: function (result) {
                            var obj = eval('(' + result + ')');
                            alert(obj.msg, "", "", function () {
                                window.location = ibrandWeb_Path + "company/index.htm";
                            });
                        }
                    });
                }
            })
        });
    }
    pageView.datetimepicker = function () {
        $(".zl-datetimepicker").find("input").datetimepicker({
            format: "yyyy-mm-dd",
            todayBtn: "linked",
            startView: 2,
            minView: 2,
            autoclose: true,
            language: "zh-CN",
        }).on('changeDate', function (e) {
            var $_this = $(this);
            var endDate = $_this.closest("tr").find("input[name*='endDate']").val();
            var startTime = $_this.closest("tr").find("input[name*='startDate']").val();
            if (endDate == "" || startTime == "") {
                return;
            }
            if (endDate < startTime) {
                alert("结束时间小于开始时间！");
                $_this.closest("input").val("");
            }
        });
    }
    pageView.addTr = function () {
        //添加行
        $(".zl-glyphicon-blue").on("click", function(){
            var _tr =  $(this).parents("table").find("tr:hidden").clone().removeAttr("id").removeAttr("hidden");
            $(this).parents("table").find("tbody").append(_tr);
            pageView.datetimepicker();
            pageView.delTr();
            pageView.searchBrand();
            $(".zl-dropdown-inline").ysdropdown("init");
        });
    }
    pageView.delTr = function () {
        $(".zl-glyphicon-red").on("click", function(){
            $(this).parents("tr")[0].remove();
        });
    };

    pageView.searchBrand = function () {
        var mallId = $("#mallId").val();
        var _this;
        $(".js-dropdown-brand").ysSearchSelect({
            source:function( request, response ) {

                if ($.trim(request.term) == '') {
                    $(".js-loading").hide();
                    return;
                }
                $.ajax({
                    url: 'queryBrankByBrandName.htm',
                    type:"post",
                    dataType: "json",
                    data: {
                        brandName: request.term,
                        mallId: mallId
                    },
                    success: function( data ) {
                        response( $.map( data.data, function( item ) {
                            return {
                                label: item.brandName,
                                value: item.id
                            }
                        }));
                    }
                });
            },
            callback:function(value, ui){
            }
        });
    }
    pageView.loadingShow = function () {
        $(".zl-loading").fadeIn();
    }
    pageView.loadingHide = function () {
        $(".zl-loading").fadeOut();
    }
    return pageView;
})(jQuery);
$(document).ready(function(){
    confirmAlert.init();
    pageView.datetimepicker();
    pageView.addTr();
    pageView.delTr();
    pageView.searchBrand();
});


function validateForm() {
    var flag = true,i,label;
    var $selectRequired = $(".required").find(".zl-dropdown-btn,input:not(:hidden)");
    for (i = 0; i < $selectRequired.length; i++) {
        var $required = $($selectRequired[i]);
        var val=$required.html()||$required.val();
        if (!val || $required.html().indexOf("请选择") > 0) {
            label = $required.parents("td").prev();
            if (label[0].localName !== "th") {
                alert("必填项不能为空");
            } else {
                (function ($required) {
                    alert(label.html() + "不能为空", "", "", function () {
                        $required.focus();
                    });
                })($required);

            }
            return false;
        }
    }
    return flag;
}


function valitateForm() {
    return true;
}

