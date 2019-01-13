/*var baseView=(function($){
    var baseView={};
    baseView.init=function(){
        $("#preloader").fadeOut("fast");
    };

    return baseView;

})(jQuery);*/

$('.zl-dropdown-inline').on('click',function(){
    $(this).addClass("open");
});

$('.but-val').on('click',function(){
    var val = $(this).attr("data-value");
    var name = $(this).html();
    $(this).parent().parent().parent().find(".btn-default").html(name);
    $(this).parent().parent().parent().find(".btn-default").attr("select-val",val);
});


/*
$(document).ready(function(){
    baseView.init();
});
*/

$(".zl-datetimepicker").find("input").datetimepicker({
    format:"yyyy-mm-dd",
    todayBtn:"linked",
    startView:2,
    minView:2,
    autoclose: true,
    language:"zh-CN",
}).on('changeDate', function(e){
    //console.log(e)
});

/*================================图片上传==============================================*/
$('.zl-img-wrapper-1').magnificPopup({
    delegate: '.zl-thumbnail',
    type: 'image',
    gallery: {
        enabled: true
    },
});

$('.zl-img-wrapper-1').on("click",".zl-icon-btn-del",function(e){
    e.preventDefault();
    //ajax and warning callback
    $(this).closest("li").remove();

})

//var url = "localhost:1024/file_web";
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

function _preview(that,indx) {
    //接受files数组列表
    var _file = that,
        str = _getObjectURL(_file);
    var _tmp=
        " <li style='width: 92px;float:left;margin-right:15px; '>" +
        "   <div class=\"zl-thumbnail-wrapper\">" +
        "       <em class='zl-thumbnail' data-mfp-src='"+str+"' style='background-image:url( "+str+ ")'"+
        "        ></em>" +
        "       <a class=\"zl-icon-btn zl-icon-btn-del\"></a>" +
        "   </div>" +
        "</li>";


    //将图片动态添加到图片展示区
    if(indx==1){
        $(".zl-img-wrapper-1>ul").append(_tmp);
    }else if(indx==2){
        $(".zl-img-wrapper-2>ul").append(_tmp);
    }

}

$('#fileupload-1').fileupload({
    //url:url,
    dataType: 'json',
    add:function(e,data){
        $.each(data.files, function (index, file) {
            //console.log(file)
            //console.log(_getObjectURL(file))
            //_preview(file,1);
            uploadFiles(file,1);
        });
        data.submit();
    },
    done: function (e, data) {
        $.each(data.result.files, function (index, file) {
            $('<p/>').text(file.name).appendTo('#files');
        });

    },
    progressall: function (e, data) {
        var progress = parseInt(data.loaded / data.total * 100, 10);
        $('#progress .progress-bar').css(
            'width',
            progress + '%'
        );
    }
});



$('.zl-img-wrapper-2').magnificPopup({
    delegate: '.zl-thumbnail',
    type: 'image',
    gallery: {
        enabled: true
    },
});
$('.zl-img-wrapper-3').magnificPopup({
    delegate: '.zl-thumbnail',
    type: 'image',
    gallery: {
        enabled: true
    },
});
$('.zl-img-wrapper-4').magnificPopup({
    delegate: '.zl-thumbnail',
    type: 'image',
    gallery: {
        enabled: true
    },
});
$('.zl-img-wrapper-5').magnificPopup({
    delegate: '.zl-thumbnail',
    type: 'image',
    gallery: {
        enabled: true
    },
});
$('.zl-img-wrapper-6').magnificPopup({
    delegate: '.zl-thumbnail',
    type: 'image',
    gallery: {
        enabled: true
    },
});

$('.zl-img-wrapper-2').on("click",".zl-icon-btn-del",function(e){
    e.preventDefault();
    //ajax and warning callback
    $(this).closest("li").remove();

})
$('.zl-img-wrapper-3').on("click",".zl-icon-btn-del",function(e){
    e.preventDefault();
    //ajax and warning callback
    $(this).closest("li").remove();

})
$('.zl-img-wrapper-4').on("click",".zl-icon-btn-del",function(e){
    e.preventDefault();
    //ajax and warning callback
    $(this).closest("li").remove();

})
$('.zl-img-wrapper-5').on("click",".zl-icon-btn-del",function(e){
    e.preventDefault();
    //ajax and warning callback
    $(this).closest("li").remove();

})
$('.zl-img-wrapper-6').on("click",".zl-icon-btn-del",function(e){
    e.preventDefault();
    //ajax and warning callback
    $(this).closest("li").remove();

})

$('#fileupload-2').fileupload({
    dataType: 'json',
    add:function(e,data){
        $.each(data.files, function (index, file) {
            //console.log(file)
            //console.log(_getObjectURL(file))
            //_preview(file,2);
            uploadFiles(file,2);
        });
        data.submit();
    },
    done: function (e, data) {
        $.each(data.result.files, function (index, file) {
            $('<p/>').text(file.name).appendTo('#files');
        });

    },
    progressall: function (e, data) {
        var progress = parseInt(data.loaded / data.total * 100, 10);
        $('#progress .progress-bar').css(
            'width',
            progress + '%'
        );
    }
});

$('#fileupload-3').fileupload({
    dataType: 'json',
    add:function(e,data){
        $.each(data.files, function (index, file) {
            //console.log(file)
            //console.log(_getObjectURL(file))
            //_preview(file,3);
            uploadFiles(file,3);
        });
        data.submit();
    },
    done: function (e, data) {
        $.each(data.result.files, function (index, file) {
            $('<p/>').text(file.name).appendTo('#files');
        });

    },
    progressall: function (e, data) {
        var progress = parseInt(data.loaded / data.total * 100, 10);
        $('#progress .progress-bar').css( 'width',progress + '%');
    }
});


$('#fileupload-4').fileupload({
    dataType: 'json',
    add:function(e,data){
        $.each(data.files, function (index, file) {
            //console.log(file)
            //console.log(_getObjectURL(file))
            //_preview(file,3);
            uploadFiles(file,4);
        });
        data.submit();
    },
    done: function (e, data) {
        $.each(data.result.files, function (index, file) {
            $('<p/>').text(file.name).appendTo('#files');
        });

    },
    progressall: function (e, data) {
        var progress = parseInt(data.loaded / data.total * 100, 10);
        $('#progress .progress-bar').css( 'width',progress + '%');
    }
});


$('#fileupload-5').fileupload({
    dataType: 'json',
    add:function(e,data){
        $.each(data.files, function (index, file) {
            //console.log(file)
            //console.log(_getObjectURL(file))
            //_preview(file,3);
            uploadFiles(file,5);
        });
        data.submit();
    },
    done: function (e, data) {
        $.each(data.result.files, function (index, file) {
            $('<p/>').text(file.name).appendTo('#files');
        });

    },
    progressall: function (e, data) {
        var progress = parseInt(data.loaded / data.total * 100, 10);
        $('#progress .progress-bar').css( 'width',progress + '%');
    }
});


$('#fileupload-6').fileupload({
    dataType: 'json',
    add:function(e,data){
        $.each(data.files, function (index, file) {
            //console.log(file)
            //console.log(_getObjectURL(file))
            //_preview(file,3);
            uploadFiles(file,6);
        });
        data.submit();
    },
    done: function (e, data) {
        $.each(data.result.files, function (index, file) {
            $('<p/>').text(file.name).appendTo('#files');
        });

    },
    progressall: function (e, data) {
        var progress = parseInt(data.loaded / data.total * 100, 10);
        $('#progress .progress-bar').css( 'width',progress + '%');
    }
});

function uploadFiles(file,indx){
    var formData = new FormData();
    formData.append("action", "1002");
    formData.append("single", 1);
    formData.append("category", "FILE_ENROLMENT_MALL");
    formData.append("targetId", '');
    formData.append('file', file);
    $.ajax({
        //url: 'http://localhost:1024/file_web/sdk/platform/file',
        url:fileWeb_Path+'sdk/platform/file',
        type: 'POST',
        dataType: "json",
        cache: false,
        data: formData,
        processData: false,
        contentType: false
    }).done(function (response) {
        if (response.success) {
            var url = "https://devinamp.scpgroup.com/"+response.data.path
            var _tmp=
                " <li style='width: 92px;float:left;margin-right:15px; '>" +
                "   <div class=\"zl-thumbnail-wrapper\">" +
                "       <em class='zl-thumbnail' data-mfp-src"+indx+"='"+url+"' style='background-image:url("+url+")'"+
                "        ></em>" +
                "       <a class=\"zl-icon-btn zl-icon-btn-del\"></a>" +
                "   </div>" +
                "</li>";

            //将图片动态添加到图片展示区
            if(indx==1){
                $(".zl-img-wrapper-1>ul").append(_tmp);
            }else if(indx==2){
                $(".zl-img-wrapper-2>ul").append(_tmp);
            }else if(indx==3){
                $(".zl-img-wrapper-3>ul").append(_tmp);
            }else if(indx==4){
                $(".zl-img-wrapper-4>ul").append(_tmp);
            }else if(indx==5){
                $(".zl-img-wrapper-5>ul").append(_tmp);
            }else if(indx==6){
                $(".zl-img-wrapper-6>ul").append(_tmp);
            }
        } else {
            alert(response.message);
        }
    });
}

//保存图片的url地址
function sPathUrl(ind){
    var url ="";
    var cou = 0;
    $("[data-mfp-src"+ind+"]").each(function () {
        url = url+","+$(this).attr("data-mfp-src"+ind+"");
        cou = cou+1;
    });
    if(url!="" || url!=null){
        url = url.substring(1,url.length);
    }
    if(ind==1){
        $("#logo").val(url);
    }else if(ind==2){
        $("#storePic").val(url);
    }else if(ind==3){
        $("#checkReportImg").val(url);
    }else if(ind==4){
        $("#trademarkImg").val(url);
    }else if(ind==5){
        $("#fghi").val(url);
    }else if(ind==6){
        $("#elevation").val(url);
    }
    return cou;
}
/*================================图片上传==============================================*/


/*================================功能按钮============================================*/
//新增
$(".zl-toolbar .zl-btn-add-reviewer").on("click", function () {
    var checkFlag = validateForm($("#zl-merchant-creation-form"));
    if(sPathUrl(1)>=4){
        alert("LOGO图片不能超过4张");
        return false;
    }
    if(sPathUrl(2)>=4){
        alert("门店图片不能超过4张");
        return false;
    }
    if(sPathUrl(3)>=4){
        alert("产品质量检测报告不能超过4张");
        return false;
    }
    if(sPathUrl(4)>=4){
        alert("商标注册证不能超过4张");
        return false;
    }
    if(sPathUrl(5)>=4){
        alert("店面招牌不能超过4张");
        return false;
    }
    if(sPathUrl(6)>=4){
        alert("立面图不能超过4张");
        return false;
    }
    if (checkFlag) {
        $.ajax({
            url: ibrandWeb_Path + "brand/add.htm",
            type: "POST",
            data: $("#zl-merchant-creation-form").serialize(),
            success: function (resp) {
                var dataObj = JSON.parse(resp);
                if (dataObj.success == true) {
                    alert("操作成功！");
                    //window.location.href = netcommentWeb_Path + "netcomment/brand/toBillDetail.htm?brandId=" + resp.brandId + "&billType=11";
                    window.location.href =ibrandWeb_Path +"brand/addIndex.htm";
                } else {
                    alert(dataObj.message);
                }
            },
            error: function (resp) {
                //showMsg(resp);
            }
        })
    }
});



/*================================功能按钮============================================*/

/*================================校验============================================*/
function validateForm(obj) {
    var mallId = $(obj).find("#mallId").attr("select-val");
     if (mallId == "" || mallId == null) {
     alert("项目名称不能为空！");
     return false;
     }else {
         $("input[name=mallId]").val(mallId);
     }

    var layout = $(obj).find("#layout").attr("select-val");
    if (layout == "" || layout == null) {
        alert("业态不能为空！");
        return false;
    }else{
        $("input[name=layout]").val(layout);
    }

/*    var shopTypePrognosis = $(obj).find("#shopTypePrognosis").attr("select-val");
    if (shopTypePrognosis == "" || shopTypePrognosis == null) {
        alert("店型预判不能为空！");
        return false;
    }else{
        $("input[name='ibBrandDetail.shopTypePrognosis']").val(shopTypePrognosis);
    }*/

/*    var level = $(obj).find("#level").attr("select-val");
    if (level == "" || layout == null) {
        alert("合作等级不能为空！");
        return false;
    }else{
        $("input[name=level]").val(level);
    }*/

    /*var brandType = $(obj).find("input[name=brandType]").val();
    if (brandType == "" || brandType == null) {
        alert("商铺划分不能为空！");
        return false;
    }*/

    var brandName = $(obj).find("input[name=brandName]").val();
    if (brandName.trim() == "" || brandName == null) {
        alert("品牌名(中)不能为空！");
        return false;
    }

    var info = $(obj).find("textarea[id=info]").val();
    if (info == "" || info == null) {
        alert("品牌简介不能为空！");
        return false;
    }

    /*var brandCradleland = $(obj).find("input[id=brandCradleland]").val();
    if (brandCradleland == "" || brandCradleland == null) {
        alert("品牌发源地不能为空！");
        return false;
    }*/

    var standardStore = $(obj).find("#standardStore").attr("select-val");
    if (standardStore == "" || standardStore == null) {
        alert("标准店型(m²)不能为空！");
        return false;
    }else{
        $("input[name='ibBrandDetail.standardStore']").val(standardStore);
    }

    /*var shopNeeds = $(obj).find("select[id=shopNeeds]").val();
    if (shopNeeds == "" || shopNeeds == null) {
        alert("开店需求不能为空！");
        return false;
    }*/

    var chainType = $(obj).find("#chainType").attr("select-val");
    if (chainType == "" || chainType == null) {
        alert("连锁/单店不能为空！");
        return false;
    }else{
        $("input[name='ibBrandDetail.chainType']").val(chainType);
    }

    var shopMode = $(obj).find("#shopMode").attr("select-val");
    if (shopMode == "" || shopMode == null) {
        alert("开店方式不能为空！");
        return false;
    }else{
        $("input[name='ibBrandDetail.shopMode']").val(shopMode);
    }

    var busiType = $(obj).find("#busiType").attr("select-val");
    if (busiType == "" || busiType == null) {
        alert("可进驻商业类型不能为空！");
        return false;
    }else{
        $("input[name='ibBrandDetail.busiType']").val(busiType);
    }

    var theAudienceType = $(obj).find("#theAudienceType").attr("select-val");
    if (theAudienceType == "" || theAudienceType == null) {
        alert("受众类型不能为空！");
        return false;
    }else{
        $("input[name='ibBrandDetail.theAudienceType']").val(theAudienceType);
    }

    var brandGrades = $(obj).find("#brandGrades").attr("select-val");
    if (brandGrades == "" || brandGrades == null) {
        alert("品牌级次不能为空！");
        return false;
    }else{
        $("input[name='ibBrandDetail.brandGrades']").val(brandGrades);
    }

    var businessPreferences = $(obj).find("#businessPreferences").attr("select-val");
    if (businessPreferences == "" || businessPreferences == null) {
        alert("经营偏好不能为空！");
        return false;
    }else{
        $("input[name='ibBrandDetail.businessPreferences']").val(businessPreferences);
    }

    /*var competeBrand = $(obj).find("input[id=competeBrand]").val();
    if (null == competeBrand || "" == competeBrand) {
        alert("竞争品牌不能为空！");
        return false;
    }*/

 /*   var experience = $(obj).find("button[id=experience]").attr("select-val");
    if (null == experience || "" == experience) {
        alert("开店经验不能为空！");
        return false;
    }
    if (experience == "1" || experience == "3") {
        var shopAddress = $(obj).find("button[id=shopAddress]").attr("select-val");
        if (!shopAddress) {
            alert("店铺地址不能为空！");
            return false;
        }
    }*/

    var retFlag = true;
    $(obj).find(":input[checkType=number]").each(function () {
        if ($(this).val() != null && $(this).val() != "") {
            if (!isNum($(this).val(), $(this).attr("checkName"))) {
                retFlag = false;
                return false;
            }
        }
    });

    /*	$(obj).find(":input[checkType=tel]").each(function(){
     if($(this).val()!=null && $(this).val()!=""){
     if(!isTel($(this).val(), $(this).attr("checkName"))){
     retFlag = false;
     return false;
     }
     }
     });

     $(obj).find(":input[checkType=email]").each(function(){
     if($(this).val()!=null && $(this).val()!=""){
     if(!isEmail($(this).val(), $(this).attr("checkName"))){
     retFlag = false;
     return false;
     }
     }
     });*/

    return retFlag;
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
            var re = /^[0-9]*[1-9][0-9]*$/;
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

function isTel(num, msg) {
    if (!isNaN(num)) {
        var re = /^1\d{10}$/;
        if (re.test(num)) {
            return true;
        } else {
            alert("输入" + msg + "不合法！");
            return false;
        }

    } else {
        alert("输入" + msg + "不合法！");
        return false;
    }
}

function isEmail(num, msg) {
    var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
    if (re.test(num)) {
        return true;
    } else {
        alert("输入" + msg + "不合法！");
        return false;
    }
}

/*================================校验============================================*/
function setLyout(id,code){
    $("input[name=layout]").val(id);
    $("#layoutCode").val(code);
}
