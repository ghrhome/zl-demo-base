var dubSumit = 0;
(function(){
    $("#preloader").fadeOut("fast");

    var page = $("#floor-info");
    $("#mya").click(function () {
        imgkkAll="";
        isshanchu=true;
        isAdd=true;
    })

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
    //==========================增加附件===========================
    var ran1="";
    var imgkkAll="";
    var ids="";     //附件id
    var urls="";     //附件路径(删除)
    var addUrls="";    //附件路径(添加)
    var targetIds="";     //业务编号
    var isshanchu=false;
    var isAdd=false;
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
    //======================================================增加===
    $("#addBsFloorBtn").on("click", function () {
        if (dubSumit > 0) {
            alert("请勿重复提交表单！");
            return false;
        }

        if (!valitateForm($('#addBsFloorForm'))) {
            return false;
        }


        var isRe = false;

        var formData=new FormData($("#addBsFloorForm")[0]);
        //console.log(formData);
        //console.log(formData.get("blockName"));

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

        var imgs="";
        $('#addBsFloorForm').find("#imgDiv").find("a").each(function () {
            if (addUrls=="" ) {
                imgs=ids+","+ran1+","+addUrls;
                /*alert("没有");*/
            }else{
                imgs=ids+","+targetIds+addUrls;
               /* alert("有");*/
            }
        });

        if (addUrls.split(",").length-1 > 10) {
            alert("最多上传10张");
            return false;
        }

        dubSumit++;
        $.ajax({
            cache: true,
            type: "POST",
            url: enrolmentWeb_Path + "block/add.htm?imgs=" + imgs,
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
            //console.log("删除");
        })
        var imgs = "";
        $('#updateBsFloorForm_' + bsBlockId).find("#imgDiv").find("a").each(function () {
            imgs=ids+","+targetIds+urls;
        });

        if (urls.split(",").length-1> 10) {
            alert("最多上传10张");
            return false;
        }
        /*if(urls=="" && isshanchu){
            alert("未上传附件!");
            return false;
        }*/


        if (confirm("确认要提交吗？")) {
            $.ajax({
                cache: true,
                type: "POST",
                url: enrolmentWeb_Path + "block/update.htm?imgs=" + imgs,
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
            var formData = new FormData();
            formData.append("action", "1003");
            formData.append("id", $("#attadIds_"+bsBlockId).val());
            //enrolmentWeb_Path + "block/velicateName.htm",
            $.ajax({
                url:  fileWeb_Path + 'sdk/platform/file',
                // url: enrolmentWeb_Path + "block/file.htm",
                type: 'POST',
                dataType: "json",
                cache: false,
                data: formData,
                processData: false,
                contentType: false
            }).done(function (response) {
                if (response.success) {
                    // ids1=response.data.id;
                    // urls1 = base_Path + response.data.path;
                    // $("#files1_"+aa).append("<a href='" + urls1 + "' target='_blank'>" + urls1 + "</a><br/>");
                } else {
                    alert(response.message);
                }
            });
            //=======================
            $.ajax({
                cache: true,
                type: "POST",
                url: enrolmentWeb_Path + "block/delete.htm?bsBlockId=" + bsBlockId + "&bsMallId=" + bsMallId,
                async: false,
                error: function (request) {
                    alert("系统异常");
                },
                success: function (resultData) {
                    if (resultData.code == "1") {
                        showMsg(resultData);
                        return;
                    }
                    searchBsFormBtn.click();
                }
            });
        }
    });
    //=====================
    //====================================
    $("#zl-enrolment-floor").on("click", ".zl-paginate", function (e) {
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
    $("#gotoPageNum").on("blur", function (e) {
        if (!isPositiveNum($(this).val()) || parseInt($(this).val()) == 0) {
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
    var iszj=false;
    $(".zl-text-file").ysSimpleUploadFile({
        changeCallback: function (file) {
            // showLoading(); // 显示loading
            var fileReader = new FileReader();
            $(this).parent().height(136);
            var that = this;
            fileReader.onload = function () {
                $(that).next().css("display", "block");
                // $(that).next().attr("src", this.result);
                // $(that).next().find("a").css("background-image","url("+this.result+")");
                imgkkAll=$(that).attr("al");
                compressImage(1000, 1000, this.result, null, function (dataUrl) {
                    var html = "<li><a style='background-image:url(" + dataUrl + ")'><em></em></a></li>";
                    $(that).next().append(html);
                    var formData = new FormData();
                    formData.append("action", "1002");
                    formData.append("single", 1);
                    formData.append("category", "FILE_ENROLMENT_BLOCK");
                    formData.append("targetId", ran1);
                    formData.append('file', file);
                    $.ajax({
                        url: fileWeb_Path + 'sdk/platform/file',
                        type: 'POST',
                        dataType: "json",
                        async: true,
                        cache: false,
                        data: formData,
                        processData: false,
                        contentType: false
                    }).done(function (response) {
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
    var container = $("#floor-info");
    container.on("click", ".upload-pic-item-list li a em", function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(this).closest("li").remove();
        var imgkk=","+$(this).closest("a").attr("data-image");
        if(isAdd){
            addUrls=addUrls.replace(imgkk,"");
            var last=addUrls.charAt(addUrls.length - 1);
            // var fiest=addUrls.charAt(0);
            if(last==","){
                addUrls=addUrls+",";
                addUrls=addUrls.replace(",,","");
            }
            // if(fiest==","){
            //     addUrls=","+addUrls;
            //     addUrls=addUrls.replace(",,","");
            // }
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

function valitateForm(obj) {

    var mallId = $(obj).find("input[name=mallId]").val();
    var blockName = $.trim($(obj).find("input[name=blockName]").val());
    var status = $(obj).find("input[name=status]").val();
/*
    var remark = $.trim($(obj).find("textarea[name=remark]").val());
*/
    var buildingType = $(obj).find("input[name=buildingType]").val();
    var openDate = $.trim($(obj).find("input[name=openDate]").val());

    if (mallId == "" || mallId == null) {
        alert("项目名称不能为空！");
        return false;
    }

    if (buildingType == "" || buildingType == null) {
        alert("物业类型不能为空！");
        return false;
    }

    if (blockName == "" || blockName == null) {
        alert("楼栋名称不能为空！");
        return false;
    }

    if (openDate == "" || openDate == null) {
        alert("开业日期不能为空！");
        return false;
    }

    if (status == "" || status == null) {
        alert("状态不能为空！");
        return false;
    }



    // if (remark == "" || remark == null) {
    //     alert("备注不能为空！");
    //     return false;
    // }

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