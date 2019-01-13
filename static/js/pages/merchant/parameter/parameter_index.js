/**
 * Created by hegx on 2018/7/26.
 */
var pageView=(function($){

    var pageView={};

    pageView.init = function(){
        // 动态效果
        pageView.$POST();
        pageView.loadingHide();
        pageView.dropdownInit();
    };
    // 头部下拉框初始化
    pageView.dropdownInit = function(){
        var selector = $("#addForm");
        var container = $("#searchForm");
        container.on('click', "ul.dropdown-menu li a", function(){
            var key = $(this).attr("data-value");
            $(this).closest('div.zl-dropdown').find("input[type=hidden]").val(key);
            var value = $(this).text();
            $(this).closest('div.zl-dropdown').find("button").text(value);
            var formData = document.getElementById("searchForm");
            formData = new FormData(formData);
            pageView.$POST(true,formData);
        });
        selector.on('click', "ul.dropdown-menu li a", function(){
            console.log("---------------------");
            var key = $(this).attr("data-value");
            $(this).closest('div.zl-dropdown-inline').find("input[type=hidden]").val(key);
            var value = $(this).text();
            $(this).closest('div.zl-dropdown-inline').find("button").text(value);
        });
    };

    pageView.loadingShow = function () {
        $(".zl-loading").fadeIn();
    };

    pageView.loadingHide = function () {
        $(".zl-loading").fadeOut();
    };

    //分页查询
    pageView.generalQueryBtn=function generalQueryBtn(flag,page){
        $("#pageHeader").val(page);
        var formData = document.getElementById("searchForm");
        formData = new FormData(formData);
        pageView.$POST(true,formData);
    };
    //数字校验
    pageView.isNumberss= function isNumberss(num) {
        var pat = new RegExp('^[0-9]+$');
        return pat.test(num)
    };
    //发起异步请求
    pageView.$POST=function(flag,formData) {
        if(flag){
            pageView.loadingShow();
        }
        $.ajax({
            cache: false,
            type: "POST",
            url:'queryMerParametersByPage',
            contentType: false,
            processData: false,
            data:formData,
            dataType: "html",
            async: false,
            error: function () {
                alert("系统异常");
                pageView.loadingHide();
            },
            success:function(data) {
                $(".zl-body-list").html("").append(data);
                $('#btn-pre-bottom').on('click', function () {
                    if (!$(this).hasClass('zl-btn-disable')) {
                        //location.href = _that.query(_that.url.list,$('#js-store-form')) + '&page=' + (parseInt($('.page-index').html()) - 1);
                        pageView.generalQueryBtn(true,(parseInt($('.page-index').html())-1));
                    }
                });
                $('#btn-next-bottom').on('click', function () {
                    if (!$(this).hasClass('zl-btn-disable')) {
                        //location.href = _that.query(_that.url.list,$('#js-store-form')) + '&page=' + (parseInt($('.page-index').html()) + 1);
                        pageView.generalQueryBtn(true,(parseInt($('.page-index').html())+1));
                    }
                });
                // 主题部分-添加-下拉框初始化
                $('#gotoPage').on('click', function () {
                    var value = parseInt($(this).parent().find('.zl-page-num-input').val());
                    if (pageView.verifyPagination(value, parseInt($('.page-all').html()))) {
                        //location.href = _that.query(_that.url.list,$('#js-store-form')) + '&page=' + value;
                        pageView.generalQueryBtn(true,value);
                    }else{
                        $(".zl-page-num-input").val($('.page-all').html());
                    }
                });
            }});
    };
    //添加
    pageView.add=function(){
        var addParamFloorBtn = $("#addParamFloorBtn");
        addParamFloorBtn.click(function () {
        var mallId = $("#mallIdAdd").val();
        if(mallId==null ||  mallId === ""){
            addParamFloorBtn.removeAttr("data-toggle");
            alert("配置的项目不能为空！");
            return false;
        }
        var parameterType = $("#parameterTypeAdd").val();
        if(parameterType==null ||  parameterType === ""){
            addParamFloorBtn.removeAttr("data-toggle");
            alert("营运参数类型不能为空！");
            return false;
        }
        var value = $.trim($("#valueAdd").val());
        if(value==null ||  value === ""){
            addParamFloorBtn.removeAttr("data-toggle");
            alert("参数值不能为空！");
            return false;
        }

        var flag = pageView.reg(parameterType,value);
        if (!flag){
            return false;
        }else {
        addParamFloorBtn.removeAttr("data-toggle");
        var formData = document.getElementById("addForm");
        formData = new FormData(formData);
        var url = "add";
        $.ajax({
            cache: false,
            type: "post",
            url:url,
            contentType: false,
            processData: false,
            data:formData,
            dataType: "json",
            async: false,
            error: function () {
                alert("系统出错");
                pageView.loadingHide();
            },
            success:function(data) {
                if (data.code==1){
                    alert(data.msg);
                }else if(data.code==0) {
                    addParamFloorBtn.attr("data-toggle","collapse");
                    alert("添加成功");
                    $("#addForm")[0].reset();
                    $("#button-01").html("");
                    $("#mallIdAdd").val("");
                    $("#parameterTypeAdd").val("");
                    $("#parameterType-select").html("");
                    setTimeout(function(){
                        var formData = document.getElementById("searchForm");
                        formData = new FormData(formData);
                        pageView.$POST(true,formData);
                    },1000);
                }
            }});
        }
        });
    };

    //正则校验参数
    pageView.reg = function(parameterType,value){
        if (parameterType==1){
            var reg = /^[0-9]*$/;
            if (!reg.test(value)) {
                alert('包含不是数字的字符');
                return false;
            }else if(value>28){
                alert('日期不能大于28');
                return false;
            }
            return true;
        }
        if(parameterType==2|| parameterType==3||parameterType==4){
            var _reTimeReg = /^[0-2][0-9]:[0-5][0-9]$/;
            if(!_reTimeReg.test(value)){
                alert("请输入正确的时间范围且格式为00:00的时分");
                return false;
            }
            return true;
        }
        if(parameterType==5){
            if ('Y'===value || 'N'===value ){
                return true;
            }else {
                alert("请输入‘Y’或者‘N'");
                return false;
            }
        }
        if(parameterType==6){
            var _reTimeReg = /^((\d+\.?\d*)|(\d*\.\d+))\%$/;
            if(!_reTimeReg.test(value)){
                alert("请输入正确的百分比！");
                return false;
            }
            return true;
        }
    };

    //编辑
    pageView.editForParam=function(id,mallId,itemName,typeName,parameterType,value) {
        // 主题部分-编辑-下拉框初始化
        $("#editForm-"+id+"").on('click', "ul.dropdown-menu li a", function(){
            var key = $(this).attr("data-value");
            $(this).closest('div.zl-dropdown-inline').find("input[type=hidden]").val(key);
            var value = $(this).text();
            $(this).closest('div.zl-dropdown-inline').find("button").text(value);
        });
        var url = "update";
        $("#mallIdEditId-"+id+"").val(mallId);
        $("#editId-"+id+"").val(id);
        $("#buttonMallIdEdit-"+id+"").html(itemName);
        $("#parameterTypeEditId-"+id+"").val(parameterType);
        $("#buttonParameterType-"+id+"").html(typeName);
        $("#valueEdit-"+id+"").val(value);
        $("#editSave-"+id+"").removeAttr("data-toggle");
        $("#editSave-"+id+"").click(function () {
            var mallId_new = $("#mallIdEditId-"+id+"").val();
            var parameterType_new = $("#parameterTypeEditId-"+id+"").val();
            var value_new = $("#valueEdit-"+id+"").val();
            var formData = document.getElementById("editForm-"+id+"");
            formData = new FormData(formData);
            if (mallId_new===mallId && parameterType_new===parameterType && value_new===value){
                alert("未编辑");
                return false;
            }else {
                var flag = pageView.reg(parameterType_new,value_new);
                if (!flag){
                    return false;
                }else {
                    $.ajax({
                        cache: false,
                        type: "POST",
                        url: url,
                        data: formData,
                        contentType: false,
                        processData: false,
                        dataType: "json",
                        async: false,
                        error: function () {
                            alert("系统出错");
                            pageView.loadingHide();
                        },
                        success: function (data) {
                            if (data.code==1){
                                alert(data.msg);
                            }else if(data.code==0) {
                                $("#editSave-"+id+"").attr("data-toggle", "collapse");
                                alert("编辑成功");
                                setTimeout(function () {
                                    var formData = document.getElementById("searchForm");
                                    formData = new FormData(formData);
                                    pageView.$POST(true, formData);
                                }, 1000);
                            }

                        }
                    });
                }
            }
        });


    }
    //删除记录
    pageView.deleteById=function(id) {
        var url = "deleteById/"+id;
        confirm("你确认要删除当前添空信息吗?", "", "", function (type) {
            if (type == "dismiss") {
                return;
            }else {
                $.ajax({
                    cache: false,
                    type: "GET",
                    url:url,
                    contentType: false,
                    processData: false,
                    dataType: "json",
                    async: false,
                    error: function () {
                        alert("系统出错");
                        pageView.loadingHide();
                    },
                    success:function() {
                        alert("删除成功!    ");
                        setTimeout(function(){
                            var formData = document.getElementById("searchForm");
                            formData = new FormData(formData);
                            pageView.$POST(true,formData);
                        },1000);
                    }});
            }
        });
    };
    //验证页数
    pageView.verifyPagination=function verifyPagination(value,total) {
        if(total===0) return true;
        if(!pageView.isNumberss(value)){
            alert('请输入正确的页码');
            return  false;
        }
        if(value>total){
            alert('超过总页数,请重新输入 ');
            return false;
        }
        return true;
    };
    //加载开始
    pageView.loadingShow = function () {
        $(".zl-loading").fadeIn();
    };
    //加载完成
    pageView.loadingHide = function () {
        $(".zl-loading").fadeOut();
    };
    return pageView;
})(jQuery);

$(document).ready(function(){
    pageView.loadingHide();
    var formData = document.getElementById("searchForm");
    formData = new FormData(formData);
    pageView.$POST(true,formData);
    pageView.init();
});


