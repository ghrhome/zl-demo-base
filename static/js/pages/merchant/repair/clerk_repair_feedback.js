var pageView = (function ($) {
    var pageView = {};
    let bool=false;
    let mark = true;
    //初始化
    pageView.init = function () {
        pageView.nweData();
        pageView.bindingSubmit();
        pageView.mark(mark);

        $("#zl-section-collapse-table-1").on('click' ,function(e){
            var target=$(e.target);
            if(target.is('a')&&target.attr!=undefined&&target.text()=='第三方'){
                bool=true;
                pageView.bool(bool);
                pageView.mark(mark);
            }else if(target.is('a')&&target.attr!=undefined&&target.text()=='工程物业部'){
                bool=false;
                pageView.bool(bool);
                pageView.mark(mark);
            }
            if(target.is('a')&&target.attr!=undefined&&target.text()=='无偿维修'){
                mark=true;
                pageView.mark(mark);
            }else if(target.is('a')&&target.attr!=undefined&&target.text()=='有偿维修'){
                mark=false;
                pageView.mark(mark);
            }

        })

        //下拉框自动查询
        $(".btn-group").ysdropdown({
            callback: function () {

            }
        });
    };
    pageView.bool=function(bool){
        if(bool){
            $('#repairerName').attr('type','hidden');
            $('#isCharge').parent().css('display','none');
            // $('#chargeAmt').attr('type','hidden');
            $('#repairResult').attr('readonly','');
            $('#fileupload').attr('type','text');
            $('#mantenancePhone').attr('type','hidden');
        }else{
            $('#repairerName').attr('type','text');
            $('#isCharge').parent().css('display','block');
            $('#isCharge').parent().find('ul').css('top',35+'px');
            // $('#chargeAmt').attr('type','text');
            $('#repairResult').removeAttr('readonly');
            $('#mantenancePhone').attr('type','text');
            $('#fileupload').attr('type','file');
        }
    }

    pageView.mark=function(mark){
        if(mark){
            $('#chargeAmt').attr('type','hidden');
        }else{
            $('#chargeAmt').attr('type','text');
        }
    }


    //绑定反馈提交按钮
    pageView.bindingSubmit=function(){
        $(".feedback_submit").on("click", pageView.eventInit);

    }


    //反馈
    pageView.eventInit = function () {
        var dataQuery = $('#feedback_form').serialize();

        var maintenanceAccessories=new Array()
        $("#zl-img-id").find('em').each(function(){
            maintenanceAccessories.push($(this).attr("data-mfp-src"));
        });
        dataQuery =dataQuery+ '&maintenanceAccessories='+ maintenanceAccessories;
        var url = "repairFeedback";
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
                var obj = JSON.parse(resultData);
                if (obj.code == 0) {
                    alert("成功");
                    window.location = merchantWeb_Path + "repair/clerkRepairInit";
                } else {
                    alert("失败");
                    window.location = merchantWeb_Path + "repair/clerkRepairInit";
                }
            }
        });
    };
    pageView.num = function (obj){
        obj.value = obj.value.replace(/[^\d.]/g,""); //清除"数字"和"."以外的字符
        obj.value = obj.value.replace(/^\./g,""); //验证第一个字符是数字
        obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个, 清除多余的
        obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
        obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数
        // $(this).val(parseFloat($(this).val()).toFixed(2));
    }

    pageView.loadingShow = function () {
        $(".zl-loading").fadeIn();
    }

    pageView.loadingHide = function () {
        $(".zl-loading").fadeOut();

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

    $("#textboxID").bind("input propertychange", function () {

    });

    return pageView;
})(jQuery);


$(document).ready(function () {
    pageView.init();

    $('.zl-img-wrapper').on("click",".zl-icon-btn-del",function(e){
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
        add:function(e,data){
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
            $('#progress .progress-bar').css( 'width', progress + '%'
            );
        }
    })


    function uploadFiles(file){
        var formData = new FormData();
        formData.append("action", "1002");
        formData.append("single", 1);
        formData.append("category", "FILE_MER_REPAIR_APPLY");
        formData.append("targetId", '');
        formData.append('file', file);
        $.ajax({
            //url: 'http://localhost:1024/file_web/sdk/platform/file',
            url:fileWeb_Path+'/sdk/platform/file',
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
                var _tmp=
                    " <li>" +
                    "   <div class=\"zl-thumbnail-wrapper\">" +
                    "       <em class='zl-thumbnail' data-mfp-src='"+url+"' style='background-image:url( "+url+ ")'"+
                    "        ></em>" +
                    "       <a class=\"zl-icon-btn zl-icon-btn-del\"></a>" +
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

