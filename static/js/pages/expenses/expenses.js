var dubSumit = 0;

(function(){
    $("#preloader").fadeOut("fast");
    var page = $("#floor-info");

    $(".form_date input").datetimepicker({
        language: 'zh-CN',
        format: "yyyy-mm-dd",
        todayBtn: "linked",
        startView: 2,
        minView: 2,
        weekStart: 1,
        autoclose: 1,
        todayHighlight: 1,
        forceParse: 0
    });

    $(".zl-dist-add").on("click", function () {
        ran1="LD"+show()+randomNum();    //“LD”+“当前时间”+"三位随机数"
    });

    //==========自动获取当前时间=====
    function show(){
        var nowDate = new Date();
        var year = nowDate.getFullYear();
        var month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1;
        var date = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
        return year  + month  + date;
    }

    //======生成不重复的三位随机数===
    function  randomNum(){
        var arr=[];
        for(var i=100;i<=999;i++)
            arr.push(i);
        arr.sort(function(){
            return 0.5-Math.random();
        });
        arr.length=1;
        return arr;
    }
/*====================================*/

    //=================================================
    $("#floor-info").on("click", ".zl-select ul.dropdown-menu>li>a", function (e) {
        //e.stopPropagation();
        //e.preventDefault();

        var key = $(this).attr("key");
        var value = $(this).html();

        $(this).closest("div").find("button span").html(value);
        $(this).closest("div").find("input").val(key);
        $(this).closest("div").removeClass("open");

        // 项目带出 物业类型

        if (typeof($(this).attr("data-buildingType")) != "undefined") {
            var buildingType = $(this).attr("data-buildingType");
            var buildingTypeShow = $(this).attr("data-buildingTypeShow");
            $(this).parents("form").find("input[name='buildingType']").val(buildingType);
            $(this).parents("form").find("input[name='buildingTypeShow']").val(buildingTypeShow);
        }

    });
    //================================================

    $('.zl-img-wrapper1').magnificPopup({
        delegate: '.zl-thumbnail',
        type: 'image',
        gallery: {
            enabled: true
        },
    });





    var url="${fileWeb_Path}sdk/platform/file";
    function _getObjectURL(file) {
        var url = "${fileWeb_Path}sdk/platform/file";
        if (window.createObjectURL != undefined) { // basic
            url = window.createObjectURL(file);
        } else if (window.URL != undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file);
        }
        return encodeURI(url);
    }

    //======================================================增加==========================
    $("#addBsContRoleBtn").on("click", function () {
        if (dubSumit > 0) {
            alert("请勿重复提交表单！");
            return false;
        }
        if (!valitateForm($('#addBsContRuleForm'))) {
            return false;
        }
        var isRe = false;
        var formData=$("#addBsContRuleForm").serialize();
        console.log(formData);
        dubSumit++;
        $.ajax({
            cache: true,
            type: "POST",
            url: expensesWeb_Path + "expenses/add.htm",
            data: formData,
            async: false,
            dataType:"json",
            success: function (resultData) {
                if(resultData.code==0){
                    alert(resultData.msg)
                    searchBsFormBtn.click();
                }
                alert(resultData.msg);
            }
        });
    });

    //=============================修改===================================================
    $("[name=updateBsFloorBtn]").on("click", function () {
        var bsBlockId = $(this).attr("bsBlockId");
        if (!valitateForm($('#updateBsFloorForm_' + bsBlockId))) {
            return false;
        }

        $(".upload-pic-item-list li a em").click(function(){
            console.log("修改");
        })
        confirm("确认要提交吗？","","",function (type) {
            if(type=="dismiss"){
                return;
            }
            $.ajax({
                cache: true,
                type: "POST",
                url: enrolmentWeb_Path + "block/update.htm?bsBlockId=" + bsBlockId,
                data: $('#updateBsFloorForm_' + bsBlockId).serialize(),
                async: false,
                dataType:"json",
                error: function (request) {
                    alert("系统异常");
                },
                success: function (resultData) {
                    if(resultData.code==0){
                        $("#searchBsFloorForm").trigger("submit");
                    }
                    alert(resultData.msg);

                }
            });
        });

    });

    //============================================删除====================
    $("[name=deleteBsFloorBtn]").on("click", function () {

        confirm("确认要删除吗？","","",function (type) {
            if(type=="dismiss"){
                return;
            }
            var bsBlockId = $(this).attr("bsBlockId");
            var bsMallId = $(this).attr("bsMallId");
            var attadId=$(this).attr("attadId");
            var isRe = false;
            $.ajax({
                cache: true,
                type: "POST",
                url: enrolmentWeb_Path + "block/veliBlockId.htm?bsBlockId=" + bsBlockId,
                // data: $('#updateBsFloorForm_' + bsBlockId).serialize(),
                async: false,
                dataType:"json",
                error: function (request) {
                    alert("系统异常");
                },
                success: function (resultData) {
                    if (resultData.success) {
                        // showMsg(resultData);
                        isRe = true;
                    } else {
                        alert("楼层引用了该数据,不允许删除！");
                    }

                }
            });
            if (isRe == false) {
                // alert("楼层引用了该数据,不允许删除！");
                return false;
            }

            //========================================
            $.ajax({
                cache: true,
                type: "POST",
                url: enrolmentWeb_Path + "block/delete.htm?bsBlockId=" + bsBlockId,
                async: false,
                dataType:"json",
                error: function (request) {
                    alert("系统异常");
                },
                success: function (resultData) {
                    if(resultData.code==0){
                        searchBsFormBtn.click();
                    }
                    alert(resultData.msg);
                }
            });
        });
    });
    //=====================
    //====================================
    $("#floor-info").on("click", ".zl-paginate", function (e) {
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

        $("#searchBsFloorForm").find("input[name=page]").val(page);
        $("#searchBsFloorForm").trigger("submit");
    });

    /*$("[name=blockNames]").on("keypress", function (e) {
        e.stopPropagation();
        if (e.keyCode == 13) {
            var blockNames = $(this).val();
            $("#searchBsFloorForm").find("input[name=blockName]").val(encodeURI(blockNames));
        }
    });*/

    function isNumberss(num) {
        var pat = new RegExp('^[0-9]+$');
        return pat.test(num)
    }
    $("#gotoPageNum").on("blur", function (e) {
        if (!isNumberss($(this).val()) || parseInt($(this).val()) == 0) {
            alert("请输入合法数字！");
            $("#gotoPageNum").val("");
            $("#gotoPageNum").val($("#page").val());
            return false;
        }
        if (parseInt($(this).val()) > parseInt($("#pages").val())) {
            alert("超过总页数！");
            $("#gotoPageNum").val("");
            $(this).val($("#page").val());
            return false;
        }
    });

    $("#gotoPage").on("click", function (e) {
        $("#searchBsFloorForm").find("input[name=page]").val($("#gotoPageNum").val());
        $("#searchBsFloorForm").trigger("submit");
    });
    //00
    $("#searchBsFormBtn").on("click", function (e) {
        var pp=$("#page").val();
        $("#searchBsFloorForm").find("input[name=page]").val(pp);
        $("#searchBsFloorForm").trigger("submit");
    });
    // 00
    $("#searchBsFloorForm").submit(function () {
        var self = $(this);
        // var blockName = $.trim($(this).find("input[name=blockName]").val());
        // self.find("input[name=floorNameEncode]").val(encodeURI(blockName));
        self.attr("action",expensesWeb_Path + "expenses/index.htm");
    });


    /*===============================================*/


    var isUp=false;
    var container = $("#floor-info");

    container.on("click", ".upload-pic-item-list li a", function (e) {
        //e.stopPropagation();
        e.preventDefault();
        var src = $(this).css("background-image");
        //src = src.replace("url(","").replace(")","");
        //container.find(".image-preview-dialog .dialog-content img").attr("src",src);
        container.find(".image-preview-dialog .dialog-content>div").css("background-image", src);
        container.find(".image-preview-dialog .dialog-content>div").attr("class", "abc");
        container.find(".image-preview-dialog").show();
    });

    container.on("click", ".image-preview-dialog .abc", function (e) {
        //e.stopPropagation();
        e.preventDefault();
        $(this).closest(".image-preview-dialog").hide();
    });

    /* page.on("click",".zl-panel-row",function(e){
         e.stopPropagation();
         e.preventDefault();
         $(this).next().collapse("show");
     });


     page.on("click","button.zl-edit-collapse-btn",function(e){
         e.stopPropagation();
         e.preventDefault();
         $(this).closest(".zl-collapse-wrapper").collapse("hide");
     });*/

})();

$("body").on('click','.but-val',function(){
    var val = $(this).attr("data-value");
    var name = $(this).html();
    $(this).parent().parent().parent().find(".btn-default").html(name);
    $(this).parent().parent().parent().parent().find(".input-val").val(val);
});

function isfoltNum(num) {
    var pat = new RegExp('^[0-9]+([.]{1}[0-9]+){0,1}$');
    return pat.test(num)
}
function valitateForm(obj) {
    var periodMode = $(obj).find("input[name=periodMode]").val();
    var payCycleMode = $(obj).find("input[name=payCycleMode]").val();
    var chargeDateMode = $(obj).find("input[name=chargeDateMode]").val();
    var freeMode = $(obj).find("input[name=freeMode]").val();
    var firstMonthMode = $(obj).find("input[name=firstMonthMode]").val();
    var firstMonthMode = $(obj).find("input[name=firstMonthMode]").val();
    var endMonthMode = $(obj).find("input[name=endMonthMode]").val();
    var otherMonthMode = $(obj).find("input[name=otherMonthMode]").val();
    var contYearMonthMode = $(obj).find("input[name=contYearMonthMode]").val();
    var calcExpression = $.trim($(obj).find("input[name=calcExpression]").val());

    if (periodMode == "" || periodMode == null) {
        alert("账期模式不能为空！");
        return false;
    }

    if (payCycleMode == "" || payCycleMode == null) {
        alert("支付周期模式不能为空！");
        return false;
    }

    if (chargeDateMode == "" || chargeDateMode == null) {
        alert("生成应收日期模式不能为空！");
        return false;
    }

    if (freeMode == "" || freeMode == null) {
        alert("免租期模式不能为空！");
        return false;
    }

    if (firstMonthMode == "" || firstMonthMode == null) {
        alert("首月单价模式不能为空！");
        return false;
    }

    if (firstMonthMode == "" || firstMonthMode == null) {
     alert("首月计费模式不能为空！");
     return false;
    }

    if (endMonthMode == "" || endMonthMode == null) {
        alert("尾月计费模式不能为空！");
        return false;
    }

    if (otherMonthMode == "" || otherMonthMode == null) {
        alert("其他月计费模式不能为空！");
        return false;
    }

    if (contYearMonthMode == "" || contYearMonthMode == null) {
        alert("合同月计费模式不能为空！");
        return false;
    }

    if (calcExpression == "" || calcExpression == null) {
        alert("计算表达式不能为空！");
        return false;
    }
    return true;
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
                    alert( msg + "值过大！");
                    return false;
                } else if (parseInt(num) < 0) {
                    alert(msg + "应大于0！");
                    return false;
                } else {
                    return true;
                }
            }
        } else {
            var re = /^(\-?)[0-9]*[0-9][0-9]*$/;
            if (re.test(num)) {
                if (parseInt(num) > 99999999) {
                    alert( msg + "值过大！");
                    return false;
                } else if (parseInt(num) <= 0) {
                    alert(msg + "应大于0！");
                    return false;
                }else {
                    return true;
                }
            } else {
                alert( msg + "格式错误！");
                return false;
            }
        }
    } else {
        alert( msg + "格式错误！");
        return false;
    }
}

function isNumber(value) {
    return /^(\-?)[0-9]+.?[0-9]*$/.test($.trim(value))
}
function isInt(str) {
    var reg = /^(-|\+)?\d+$/;
    return reg.test(str);
}

function searchMall(_this) {
    var mallId = $(_this).attr("key");
    $("#mallId").val(mallId);
   $(".pjspan").text($(_this).text());
    $("#searchBsFormBtn").click();
}

function searchBuild(_this) {
    var buildingType = $(_this).attr("key");
    $("#buildingType").val(buildingType);
    $("#searchBsFormBtn").click();
}

function searchtype(_this){
    var typeId = $(_this).attr("type");
    var mallCode=$(_this).attr("mallCode");
    $("#mallCode").val("");
    $("#mallCode").val(mallCode);
    //清空物业类型
    $(".form-buildingType").val("");
    $(".form-buildingType-value").val("");
    if(typeId==2){
         $(".form-buildingType").val("商业街");
         $(".form-buildingType-value").val(typeId);
     }else if(typeId==3){
         $(".form-buildingType").val("购物中心");
         $(".form-buildingType-value").val(typeId);
     }else if(typeId==4){
         $(".form-buildingType").val("写字楼");
         $(".form-buildingType-value").val(typeId);
     }else if(typeId==5){
         $(".form-buildingType").val("住宅底商");
         $(".form-buildingType-value").val(typeId);
     }else if(typeId==6){
         $(".form-buildingType").val("专业卖场");
         $(".form-buildingType-value").val(typeId);
     }else if(typeId==7){
         $(".form-buildingType").val("酒店");
         $(".form-buildingType-value").val(typeId);
     }
}

function searchAreaUpdate(_this,blockId) {
    console.log("城市公司选框");
    var areaId = $(_this).attr("key");
    $("#myMallId_"+blockId).val("");
    // var areaCode=$(_this).attr("areaCode");
    //
    // $("#areaCode").val("");
    // $("#areaCode").val(areaCode);
    //清空项目名称
    $("#mall-grop1").empty();
    $(".apan-area").html("请选择");
    //清空物业类型
    $(".form-buildingType").val("");
    $(".form-buildingType-value").val("");

    $.ajax({
        cache: true,
        type: "POST",
        url: enrolmentWeb_Path + "mall/arealist.htm?areaId=" + areaId,
        async: false,
        error: function (request) {
            alert("系统异常");
        },
        success: function (resultData) {
            console.log(resultData);
            var json=eval(resultData);
            var isMallId=true;
            $.each(json,function(index,item){
                $("#mall-grop1").append("<li><a key='"+item.id+"' type='"+item.type+"' mallCode='"+item.mallCode+"'  onclick='queryCode("+item.id+","+blockId+");' href='javascript:void(0)'>"+item.name+"</a></li>");
                isMallId=false;
            });
            if(isMallId){
                alert("该所属城市公司下没有项目！");
            }
        }
    });
}


/*------------------文件上传开始-----------------------------*/
var flagName="";
//(修改)验证图片格式和大小
function fileChangeUpdate(target) {
    flagName=$(target).attr("flagName");
    var fileSize = 0;
    var filetypes =[".jpg",".png",".bmp",".gif",".jpeg",".tiff",".psd",".swf",".svg",".pcx",".dxf",".wmf",".emf",".lic",".eps",".tga"];  //图片全部格式
    var filepath = target.value;
    var filemaxsize = 1024*20;  //20M
    if(filepath){
        var isnext = false;
        var fileend = filepath.substring(filepath.indexOf("."));
        if(filetypes && filetypes.length>0){
            for(var i =0; i<filetypes.length;i++){
                if(filetypes[i]==fileend){
                    isnext = true;
                    break;
                }
            }
        }
        if(!isnext){
            alert("不接受此文件类型！");
            target.value ="";
            return false;
        }
    }else{
        return false;
    }
    //alert("--------------"+flagName);
}
//上传
$('.fileupload').fileupload({
    // url: url,
    dataType: 'json',
    add:function(e,data){
        console.log(data);
        console.log(e);
        $.each(data.files, function (index, file) {
            uploadFilesUpdate(file);
            $('.zl-img-wrapper1').on("click",".zl-icon-btn-del",function(e){
                e.preventDefault();
                $(this).closest("li").remove();
            })
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
        $('#progress .progress-bar').css( 'width', progress + '%'
        );
    }
})

function uploadFilesUpdate(file){
    /* if (updateFile > 0) {
     alert("最多上传一张！");
     return false;
     }*/
    $("."+flagName+">ul>li").remove();
    /*
     updateFile++;
     */
    var formData = new FormData();
    formData.append("action", "1002");
    formData.append("single", 1);
    formData.append("category", "FILE_ENROLMENT_BLOCK");
    formData.append("targetId", '');
    formData.append('file', file);
    $.ajax({
        //url: 'http://localhost:1024/file_web/sdk/platform/file',
        url:fileWeb_Path +'sdk/platform/file',
        type: 'POST',
        dataType: "json",
        cache: false,
        data: formData,
        processData: false,
        contentType: false
    }).done(function (response) {
        if (response.success) {
            var url = fastdfs + response.data.path;
            var _tmp=
                " <li>" +
                "   <div class=\"zl-thumbnail-wrapper\">" +
                "  <input class=\"path\"  name=\"path\" type=\"hidden\" value='"+url+"'/> " +
                "       <em class='zl-thumbnail update-mfiles' data-mfp-src='"+url+"' style='background-image:url( "+url+ ")'"+
                "        ></em>" +
                "       <a class=\"zl-icon-btn zl-icon-btn-del\"></a>" +
                "   </div>" +
                "</li>";
            // alert("xianshi"+url);
            //将图片动态添加到图片展示区
            $("."+flagName+">ul").html(_tmp);

        } else {
            alert(response.message);
        }
    });
}
/*------------------文件上传完成-----------------------------*/
/**
 * 遮挡层
 */
pageView.loadingShow = function () {
    $(".zl-loading").fadeIn();
}

pageView.loadingHide = function () {
    $(".zl-loading").fadeOut();
}


$(document).ready(function(){
    pageView.loadingShow();
});




//页面加载完成
$(document).ready(function(){
    pageView.loadingHide();
    //图片删除按钮
    $('.delete-image-flag').on("click",".zl-icon-btn-del",function(e){
        e.preventDefault();
        $(this).closest("li").remove();
        /*addFile--;*/
    })
});

