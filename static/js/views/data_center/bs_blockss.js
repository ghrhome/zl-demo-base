var dubSumit = 0;
var addFile=0;
var updateFile=0;
(function(){
    $("#preloader").fadeOut("fast");
    var page = $("#floor-info");

    $(document).keydown(function (e) {
        if(e.keyCode===13){
            $('#searchBsFloorForm').trigger('click');
        }
    });


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

        $(this).parent().parent().prev().children("span").html(value);
        $(this).parent().parent().parent().children("input").val(key);
        $(this).parent().parent().parent().removeClass("open");

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



    $('#fileupload1').fileupload({
        // url: url,
        dataType: 'json',
        add:function(e,data){
            console.log(data);
            console.log(e);
            $.each(data.files, function (index, file) {
                console.log(file)
                console.log(_getObjectURL(file))
                // _preview(file)

                uploadFilesAdd(file);


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

    function uploadFilesAdd(file){
            if (addFile > 0) {
                alert("最多上传一张！");
                return false;
            }
            addFile++;
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
                var url = "//devinamp.scpgroup.com/" + response.data.path;
                var _tmp=
                    " <li>" +
                    "   <div class=\"zl-thumbnail-wrapper\">" +
                    "       <em class='zl-thumbnail add-mfiles' data-mfp-src1='"+url+"' style='background-image:url( "+url+ ")'"+
                    "        ></em>" +
                    "       <a class=\"zl-icon-btn zl-icon-btn-del\"></a>" +
                    "   </div>" +
                    "</li>";
                // alert(url);
                //将图片动态添加到图片展示区
                    $(".zl-img-wrapper1>ul").append(_tmp);

            } else {
                alert(response.message);
            }
        });
    }

    $('.zl-img-wrapper1').on("click",".zl-icon-btn-del",function(e){
        e.preventDefault();
        //ajax and warning callback
        $(this).closest("li").remove();
        addFile--;
    })
    // $('.zl-img-wrapper').on("click",".zl-icon-btn-del",function(e){
    //     e.preventDefault();
    //     //ajax and warning callback
    //     $(this).closest("li").remove();
    // })
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

    //保存图片的url地址
    function sPathUrl(){
         var url ="";
         // $("[data-mfp-src1]").each(function () {
           // url = url+","+$(this).attr("data-mfp-src");
            url = $(".add-mfiles").attr("data-mfp-src1");
         // });
         if(url!="" || url!=null){
             // url = url.substring(1,url.length);
             $("#path1").val(url);
         }

        /* if(florNum==1){
            $("#path1").val(url);
        }else{
             $("#path").val(url);
         }*/

    }
    //=================修改===========
    $('#fileupload2').fileupload({
        // url: url,
        dataType: 'json',
        add:function(e,data){
            console.log(data);
            console.log(e);
            $.each(data.files, function (index, file) {
                // console.log(file)
                // console.log(_getObjectURL(file))
                // _preview(file)
                // var paths=$("#path").val();
                // if(paths!=""){
                //     //alert("最多上传一张1！"+paths);
                //     updateFile=1;
                //     //alert("shuliang"+updateFile);
                // }
                uploadFilesUpdate(file);

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
        if (updateFile > 0) {
            alert("最多上传一张！");
            return false;
        }
        $(".zl-img-wrapper>ul>li").remove();
        updateFile++;

        var formData = new FormData();
        formData.append("action", "1002");
        formData.append("single", 1);
        formData.append("category", "FILE_ENROLMENT_BLOCK");
        formData.append("targetId", '');
        formData.append('file', file);
        $.ajax({
           // url: 'http://localhost:1024/file_web/sdk/platform/file',
            url:fileWeb_Path +'sdk/platform/file',
            type: 'POST',
            dataType: "json",
            cache: false,
            data: formData,
            processData: false,
            contentType: false
        }).done(function (response) {
            if (response.success) {
                var url = "//devinamp.scpgroup.com/" + response.data.path;
                var _tmp=
                    " <li>" +
                    "   <div class=\"zl-thumbnail-wrapper\">" +
                    "       <em class='zl-thumbnail update-mfiles' data-mfp-src='"+url+"' style='background-image:url( "+url+ ")'"+
                    "        ></em>" +
                    "       <a class=\"zl-icon-btn zl-icon-btn-del\"></a>" +
                    "   </div>" +
                    "</li>";
                // alert("xianshi"+url);
                //将图片动态添加到图片展示区
                $(".zl-img-wrapper>ul").append(_tmp);

            } else {
                alert(response.message);
            }
        });
    }

    $('.zl-img-wrapper').magnificPopup({
        delegate: '.zl-thumbnail',
        type: 'image',
        gallery: {
            enabled: true
        },
    });
    $('.zl-img-wrapper').on("click",".zl-icon-btn-del",function(e){
        e.preventDefault();
        //ajax and warning callback
        $(this).closest("li").remove();
        $("#path").val("");
        updateFile--;
    })

    // var url="${fileWeb_Path}sdk/platform/file";
    // function _getObjectURL(file) {
    //     var url = "${fileWeb_Path}sdk/platform/file";
    //     if (window.createObjectURL != undefined) { // basic
    //         url = window.createObjectURL(file);
    //     } else if (window.URL != undefined) { // mozilla(firefox)
    //         url = window.URL.createObjectURL(file);
    //     } else if (window.webkitURL != undefined) { // webkit or chrome
    //         url = window.webkitURL.createObjectURL(file);
    //     }
    //     return encodeURI(url);
    // }

    //保存图片的url地址
    function sPathUrlUpadate(){
         var url ="";
         // $("[data-mfp-src]").each(function () {
        // url = url+","+$(this).attr("data-mfp-src");
            url = $(".update-mfiles").attr("data-mfp-src");
            // alert("fuzhi"+url);
         // });
        // if(url!="" || url!=null){
        //     url = url.substring(1,url.length);
        // }
        if(url!="" || url!=null){
            // alert("tt"+url);
            $("#path").val(url);
        }

        /* if(florNum==1){
            $("#path1").val(url);
        }else{
             $("#path").val(url);
         }*/

    }

    //======================================================增加===
    $("#addBsFloorBtn").on("click", function () {
        if (dubSumit > 0) {
            alert("请勿重复提交表单！");
            return false;
        }
        sPathUrl();
        if (!valitateForm($('#addBsFloorForm'))) {
            return false;
        }
        var isRe = false;

        var formData=new FormData($("#addBsFloorForm")[0]);
        console.log(formData);
        console.log(formData.get("blockName"));

        $.ajax({
            cache: true,
            type: "POST",
            url: enrolmentWeb_Path + "block/velicateName.htm",
            data: $('#addBsFloorForm').serialize(),
            // contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            // contentType:false,
            // processData: false,
            async: false,
            error: function (request) {
                alert("系统异常");
            },
            success: function (resultData) {
                if (typeof resultData != 'undefined' && resultData != null) {
                    if (typeof resultData.msg != "undefined") {
                        showMsg(resultData);
                    } else {
                        isRe = true;
                    }
                }
            }
        });
        if (isRe == false) {
            return false;
        }

        // var imgs="";
        // $('#addBsFloorForm').find("#imgDiv").find("a").each(function () {
        //
        //     imgs=ids+","+targetIds+addUrls;
        // });
        //
        // if (addUrls.split(",").length-1 > 10) {
        //     alert("最多上传10张");
        //     return false;
        // }

        dubSumit++;
        $.ajax({
            cache: true,
            type: "POST",
            url: enrolmentWeb_Path + "block/add.htm",
            data: $('#addBsFloorForm').serialize(),
            async: false,
            error: function (request) {
                alert("系统异常");
                dubSumit = 0;
            },
            success: function (resultData) {
                //showMsg(resultData);
                alert("添加成功！");
                searchBsFormBtn.click();
            }
        });
    });
    //=============================修改=======================================================

    $("[name=updateBsFloorBtn]").on("click", function () {
        var bsBlockId = $(this).attr("bsBlockId");
        if (!valitateForm($('#updateBsFloorForm_' + bsBlockId))) {
            return false;
        }
        sPathUrlUpadate();
        var isRe = false;
        $.ajax({
            cache: true,
            type: "POST",
            url: enrolmentWeb_Path + "block/velicateName.htm",
            data: $('#updateBsFloorForm_' + bsBlockId).serialize(),
            async: false,
            error: function (request) {
                alert("系统异常");
            },
            success: function (resultData) {
                if (typeof resultData != 'undefined' && resultData != null) {
                    if (typeof resultData.msg != "undefined") {
                        showMsg(resultData);
                    } else {
                        isRe = true;
                    }
                }
            }
        });
        if (isRe == false) {
            return false;
        }
        $(".upload-pic-item-list li a em").click(function(){
            console.log("删除");
        })
        // var imgs = "";
        // $('#updateBsFloorForm_' + bsBlockId).find("#imgDiv").find("a").each(function () {
        //     imgs=ids+","+targetIds+urls;
        // });
        //
        // if (urls.split(",").length-1> 10) {
        //     alert("最多上传10张");
        //     return false;
        // }
        /*if(urls=="" && isshanchu){
            alert("未上传附件!");
            return false;
        }*/


        if (confirm("确认要提交吗？")) {
            $.ajax({
                cache: true,
                type: "POST",
                url: enrolmentWeb_Path + "block/update.htm?bsBlockId=" + bsBlockId,
                data: $('#updateBsFloorForm_' + bsBlockId).serialize(),
                async: false,
                error: function (request) {
                    alert("系统异常");
                },
                success: function (resultData) {
                    //showMsg(resultData);
                    //  searchBsFormBtn.click();
                    alert("修改成功！");
                    $("#searchBsFloorForm").trigger("submit");
                }
            });
        }
    });
    //============================================删除====================
    $("[name=deleteBsFloorBtn]").on("click", function () {
        if (confirm("确认要删除吗？")) {
            var bsBlockId = $(this).attr("bsBlockId");
            var bsMallId = $(this).attr("bsMallId");
            var  attadId=$(this).attr("attadId");
            //=============删附件===========
            // var formData = new FormData();
            // formData.append("action", "1003");
            // formData.append("id", $("#attadIds_"+bsBlockId).val());
            // //enrolmentWeb_Path + "block/velicateName.htm",
            // $.ajax({
            //     url:  fileWeb_Path + 'sdk/platform/file',
            //     // url: enrolmentWeb_Path + "block/file.htm",
            //     type: 'POST',
            //     dataType: "json",
            //     cache: false,
            //     data: formData,
            //     processData: false,
            //     contentType: false
            // }).done(function (response) {
            //     if (response.success) {
            //         // ids1=response.data.id;
            //         // urls1 = base_Path + response.data.path;
            //         // $("#files1_"+aa).append("<a href='" + urls1 + "' target='_blank'>" + urls1 + "</a><br/>");
            //     } else {
            //         alert(response.message);
            //     }
            // });
            //===============校验========
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
                error: function (request) {
                    alert("系统异常");
                },
                success: function (resultData) {
                    if (resultData.code == "1") {
                        showMsg(resultData);

                        return;
                    }
                    alert("删除成功！");
                    searchBsFormBtn.click();
                }
            });
        }
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
        var as=$("#blockNames").val();
        $("#searchBsFloorForm").find("input[name=blockName]").val(encodeURI(as));

        $("#searchBsFloorForm").find("input[name=page]").val(pp);
        $("#searchBsFloorForm").trigger("submit");
    });
    // 00
    $("#searchBsFloorForm").submit(function () {
        var self = $(this);
        // var blockName = $.trim($(this).find("input[name=blockName]").val());
        // self.find("input[name=floorNameEncode]").val(encodeURI(blockName));
        self.attr("action", enrolmentWeb_Path + "block/index.htm");
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
function isfoltNum(num) {
    var pat = new RegExp('^[0-9]+([.]{1}[0-9]+){0,1}$');
    return pat.test(num)
}
function valitateForm(obj) {
    var cityConpanyId = $(obj).find("input[name=cityConpanyId]").val();
    var mallId = $(obj).find("input[name=mallId]").val();
    var blockCode = $(obj).find("input[name=code]").val();
    var blockName = $.trim($(obj).find("input[name=blockName]").val());
    var buildingType = $(obj).find("input[name=buildingType]").val();
    var buildArea = $.trim($(obj).find("input[name=buildArea]").val());

    if (cityConpanyId == "" || cityConpanyId == null) {
        alert("所属城市公司不能为空！");
        return false;
    }

    if (mallId == "" || mallId == null) {
        alert("项目名称不能为空！");
        return false;
    }

    if (blockCode == "" || blockCode == null) {
        alert("编码不能为空！");
        return false;
    }

    if (blockName == "" || blockName == null) {
        alert("楼栋名称不能为空！");
        return false;
    }

    if (buildingType == "" || buildingType == null) {
        alert("物业类型不能为空！");
        return false;
    }


     if (buildArea == "" || buildArea == null) {
         alert("建筑面积不能为空！");
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
    $("#searchBsFormBtn").click();
}

function searchBuild(_this) {
    var buildingType = $(_this).attr("key");
    $("#buildingType").val(buildingType);
    $("#searchBsFormBtn").click();
}
function searchArea(_this) {
    console.log("城市公司选框");
    var areaId = $(_this).attr("key");

    $("#addMallId").val("");
    //清空项目名称
    $("#mall-grop").empty();
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
                $("#mall-grop").append("<li><a key='"+item.id+"' type='"+item.type+"' mallCode='"+item.mallCode+"'  href='javascript:void(0)'>"+item.name+"</a></li>");
                isMallId=false;
            });
            if(isMallId){
                alert("该所属城市公司下没有项目！");
            }

        }
    });

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
                $("#mall-grop1").append("<li><a key='"+item.id+"' type='"+item.type+"' mallCode='"+item.mallCode+"'  href='javascript:void(0)'>"+item.name+"</a></li>");
                isMallId=false;
            });
            if(isMallId){
                alert("该所属城市公司下没有项目！");
            }


        }
    });

}