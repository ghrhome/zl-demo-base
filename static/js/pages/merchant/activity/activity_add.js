/**
 * Created by wenhs on 2018/6/26.
 */
/**
 *
 * 获取当前时间
 */
function p(s) {
    return s < 10 ? '0' + s: s;
}
var pageView=(function($){
    var pageView={};
    var container = $("#activity-mgt-add");
    var _selectedShops={};
    pageView.init = function(){
        pageView.eventInit();
    };
    pageView.eventInit=function(){
        var mydata={

        };
        selectUnit.init(mydata,"multi");
        $(".zl-datetimepicker-query").find("input").datetimepicker({
            format: "yyyy-mm-dd hh:mm",
            todayBtn: "linked",
            startView: 2,
            minView: 2,
            autoclose: true,
            minuteStep: 1,
            language: "zh-CN",
        });
        var endDate = $('#new_end_time').val();
        var mydate = new Date();
        var yearm=mydate.getFullYear();
        var monthm=mydate.getMonth()+1;
        var datem=mydate.getDate();
        var nowm=yearm+'-'+p(monthm)+"-"+p(datem)+" "+00+':'+00;
        $("#new_start_time").datetimepicker({
            format: "yyyy-mm-dd",
            todayBtn: "linked",
            startView:2,
            startDate: nowm,
            endDate:endDate,
            minView: 2,
            autoclose: true,
            language: "zh-CN",
        }).on('changeDate',function(e){
            var startTime = e.date;
            $('#new_end_time').datetimepicker('setStartDate',startTime);
            var year=startTime.getFullYear();
            var month=startTime.getMonth()+1;
            var date=startTime.getDate();
            var h=startTime.getHours();
            var m=startTime.getMinutes();
            var now=year+'-'+p(month)+"-"+p(date)+" "+00+':'+00;
            var nows=year+'-'+p(month)+"-"+(p(date)-1)+" "+00+':'+00;
            $('#new_signUp_time').datetimepicker('setEndDate',nows);
            $(".zl-datetimepicker-adds").find("input").datetimepicker('setStartDate',now);
        });
        $("#new_signUp_time").datetimepicker({
            format: "yyyy-mm-dd",
            todayBtn: "linked",
            endDate:endDate,
            startView:2,
            minView: 2,
            autoclose: true,
            language: "zh-CN",
        });
        var startDate = $('#new_start_time').val();
        $("#new_end_time").datetimepicker({
            format: "yyyy-mm-dd",
            todayBtn: "linked",
            startView:2,
            startDate:startDate,
            minView: 2,
            autoclose: true,
            language: "zh-CN",
        }).on('changeDate',function(e){
            var startTime = e.date;
            $('#new_start_time').datetimepicker('setEndDate',startTime);
            var year=startTime.getFullYear();
            var month=startTime.getMonth()+1;
            var date=startTime.getDate();
            var h=startTime.getHours();
            var m=startTime.getMinutes();
            var now=year+'-'+p(month)+"-"+p(date)+" "+23+':'+59;
            $(".zl-datetimepicker-adds").find("input").datetimepicker('setEndDate',now);
        });
        var now="";
        var nows="";
        if(startDate!=null && startDate!='' && endDate!='' && endDate!=null){
            now=startDate+" "+00+':'+00;
            nows=endDate+" "+23+':'+59;
        }
        $(".zl-datetimepicker-adds").find("input").datetimepicker({
            format: "yyyy-mm-dd hh:ii",
            todayBtn: "linked",
            startView: 2,
            minView: 0,
            startDate:now,
            endDate:nows,
            autoclose: true,
            minuteStep: 15,
            language: "zh-CN",
        });
        $(".zl-dropdown-inline").ysdropdown({
            callback:function(val,$elem) {
            }
        });
        $("#mall").ysdropdown({
            callback:function(val,$elem){
                $("[name='mallId']").val(val);
                $("[name='mallName']").val($elem[0].innerText.split("\n")[0]);
                $("#companyNames").val("");
                $("#jsons").val("");
                $("#companyIds").val("");
                jsonData(val);
            }
        });
        container.on("click",".save-btn",function(e){
        	/*if(!validateForm($('#addForm'))){
        		return false;
        	}*/
        confirm("确认要发布吗？", "", "", function (type) {
            if (type == "dismiss") {
                return;
            }
            $("#sta").val("1");
            var value = "";
            $(".tdsubactivity input").each(function () {
                var val = $(this).val();
                if (val != null && val != "" && val != " ") {
                    value += val + ",";
                }
            });
            var text = "";
            $("#tdsubactivity textarea").each(function () {
                var val = $(this).val();
                if (val != null && val != "" && val != " ") {
                    text += val + ",";
                }

            });
            $("#subactivity_activityName").val(value);
            $("#subactivity_activityDesc").val(text);
            if (!valitateForm($('#addForm'))) {
                return false;
            }
            var operating = $("#operating").val();
            $.ajax({
                cache: true,
                type: "POST",
                dataType: "json",
                url: merchantWeb_Path + "activity/" + operating,
                data: $('#addForm').serialize(),
                async: false,
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("系统异常");
                },
                success: function (resultData) {
                    if (resultData.code == 0) {
                        alert("发布成功");
                        setTimeout(function(){window.location = merchantWeb_Path + "activity/toIndex.htm";},500);
                    } else {
                        alert(resultData.msg);
                    }
                }
            });
        });
        });
        container.on("click",".temporarilySave-btn",function(e){
            /*if(!validateForm($('#addForm'))){
                return false;
            }*/
            confirm("确认要暂存吗？", "", "", function (type) {
                if (type == "dismiss") {
                    return;
                }
                $("#sta").val("0");
                var value = "";
                $(".tdsubactivity input").each(function () {
                    var val = $(this).val();
                    if (val != null && val != "" && val != " ") {
                        value += val + ",";
                    }
                });
                var text = "";
                $("#tdsubactivity textarea").each(function () {
                    var val = $(this).val();
                    if (val != null && val != "" && val != " ") {
                        text += val + ",";
                    }

                });
                $("#subactivity_activityName").val(value);
                $("#subactivity_activityDesc").val(text);
                var operating = $("#operating").val();
                $.ajax({
                    cache: true,
                    type: "POST",
                    dataType: "json",
                    url: merchantWeb_Path + "activity/" + operating,
                    data: $('#addForm').serialize(),
                    async: false,
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert("系统异常");
                    },
                    success: function (resultData) {
                        if (resultData.code == 0) {
                            alert("暂存成功！");
                            setTimeout(function(){window.location = merchantWeb_Path + "activity/toIndex.htm";},500);
                        } else {
                            alert(resultData.msg);
                        }
                    }
                });
            });
        });
        container.on("click","#deleteBsAreaBtn",function(e){
            /*if(!validateForm($('#addForm'))){
                return false;
            }*/
            confirm("确认要删除吗？", "", "", function (type) {
                if (type == "dismiss") {
                    return;
                }
                $("#sta").val("0");
                var value = "";
                $(".tdsubactivity input").each(function () {
                    var val = $(this).val();
                    if (val != null && val != "" && val != " ") {
                        value += val + ",";
                    }
                });
                var text = "";
                $("#tdsubactivity textarea").each(function () {
                    var val = $(this).val();
                    if (val != null && val != "" && val != " ") {
                        text += val + ",";
                    }

                });
                $("#subactivity_activityName").val(value);
                $("#subactivity_activityDesc").val(text);
                var operating = $("#operating").val();
                $.ajax({
                    cache: true,
                    type: "POST",
                    dataType: "json",
                    url: merchantWeb_Path + "activity/deleteData.htm",
                    data: $('#addForm').serialize(),
                    async: false,
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert("系统异常");
                    },
                    success: function (resultData) {
                        if (resultData.code == 0) {
                            alert("删除成功！");
                            setTimeout(function(){window.location = merchantWeb_Path + "activity/toIndex.htm";},500);
                        } else {
                            alert(resultData.msg);
                        }
                    }
                });
            });
        });
        $("#preloader").fadeOut("fast");
        $(".refer_layout").on("click",function(){
            $("#userSelectLayoutModal").modal("show");
            var length = $("#userSelectLayoutModal em").length-1;
            var val = $("[name='layoutCodes']").val();
            if(val!=null && val!=''){
                var split = val.split(',');
                if(split.length==length){
                    $(".modal-body em").addClass("checked");
                    return;
                }
                var name = '';
                for(var i = 0;i<split.length;i++){
                    if(i==0){
                        name="[data-value-code='"+split[i]+"']";
                    }else{
                        name+=","+"[data-value-code='"+split[i]+"']";
                    }
                }
                $(name).addClass("checked");
            }

        });

        $(".layout-submit").on("click",function(){
            var layoutDictCodes = "";
            var layoutDictNames = "";
            var flag = true;
            $(".zl-checkbox-dict").each(function(i, obj) {
                if($(this).hasClass("checked")){
                    if(flag){
                        layoutDictCodes += $(this).attr("data-value-code");
                        layoutDictNames += $(this).attr("data-value-name");
                        flag=false;
                    }else{
                        layoutDictCodes += ","+$(this).attr("data-value-code");
                        layoutDictNames += ","+$(this).attr("data-value-name");
                    }

                }
            });
            $("#addForm").find("input[name=layoutCodes]").val(layoutDictCodes);
            $("#addForm").find("input[name=layoutNames]").val(layoutDictNames);
            $("#userSelectLayoutModal").modal("hide");
        });

        $(".layout-cancel").on("click",function(){
            $("#userSelectLayoutModal").modal("hide");
        });

        $(".zl-checkbox-dict-all").on("click",function(){
            if($(this).hasClass("checked")){
                $(this).removeClass("checked");
                $(".zl-checkbox-dict").removeClass("checked");
            }else{
                $(this).addClass("checked");
                $(".zl-checkbox-dict").addClass("checked");
            }
        });

        $(".zl-checkbox-dict").on("click",function(){
            if($(this).hasClass("checked")){
                $(this).removeClass("checked");
            }else{
                $(this).addClass("checked");
            }
        });

        /*$.get("../common/unit_select_data.json",function(data,status){
            selectUnit.init(data,"multi");
        });*/
        var val = $("#contNo").val();
        var companyNames = $("#companyNames").val();
        var _selectedShops={

        };
        if(companyNames!=null && companyNames!='' && val != '' && val!=null){
            var contNo = val.split(",");
            var companyName = companyNames.split(",");
            for(var i=0;i<companyName.length;i++){
                _selectedShops
            }
        }
        $('body').on('click' , '.subactivityremove' , function() {
            var length = $("#tdsubactivity .clearfix").length;
            if(length>1){
                $(this).parent().remove();
            }
        });


//上传
        $('#fileupload').fileupload({
            // url: url,
            dataType: 'json',
            add:function(e,data){
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



        $("#subactivityadd").click(function () {
            var html = "<div style=\"padding:10px 10px 0;border:1px solid #ddd;margin-bottom:10px;position:relative;\" class=\"clearfix\">"+$("#tdsubactivity div:first").html()+"</div>";
            $("#tdsubactivity").append(html);
            $("#tdsubactivity .clearfix:last input").val("");
            $("#tdsubactivity .clearfix:last textarea").text("")
            $(".zl-datetimepicker-adds").find("input").datetimepicker({
                format: "yyyy-mm-dd hh:mm",
                todayBtn: "linked",
                startView: 1,
                minView: 1,
                autoclose: true,
                language: "zh-CN",
            });
        });
    };


    pageView.loadingShow = function () {
        $(".zl-loading").fadeIn();
    }

    pageView.loadingHide = function () {
        $(".zl-loading").fadeOut();
    }



    return pageView;

})(jQuery);



$(document).ready(function(){
    if($("#statuss").val()!=1){
        pageView.init();
    }else{
        $('input').attr("disabled","disabled");
        $('button').attr("disabled","disabled");
        $('textarea').attr("disabled","disabled");
        $('a').attr("disabled","disabled");
    }

    $('body').on("click",".zl-icon-btn-del",function(e){
        e.preventDefault();
        $(this).closest("li").remove();
        /*addFile--;*/
    });
    $('body').on("click",".js-submit",function(e){
        e.preventDefault();
        $(this).closest("li").remove();
        /*addFile--;*/
    });
    var val = $("#mallIds").val();
    if(val!='' && val!=null){
        jsonData(val);
    }
});

//json回调事件
function _setInput(a){
    var contractIdStr="";
    var i=0;
    for(var key in a){
        if(i==0){
            contractIdStr+=key;
            i++;
            continue;
        }
        contractIdStr+=","+key;
    }
    $("#companyIds").val(contractIdStr);//要获取到业态id和合同号。
    var str="";
    var i=0;
    for(var key in a){
        if(i == 0){
            str+=a[key].name;
            i++;
            continue;
        }
        str+=","+a[key].name;
    }
    $("#companyNames").removeAttr("readonly");
    $("#companyNames").val(str);
    $("#companyNames").attr("readonly","readonly");


}
function jsonData(value){
    $.ajax({
        cache: true,
        type: "post",
        url: merchantWeb_Path +"merAnnouncement/tenantListAjaxNew2.htm",
        data: {'mallId':value},
        dataType: "json",
        error: function (request) {
            alert("系统异常");
        },
        success: function (data) {
            //$(".zl-body-list").append(data);
            selectUnit.update(data,"multi");
            var _selectedShops={};
            if($("#jsons").val()!=null && $("#jsons").val()!='' && $("#jsons").val()!='undefined'){
                _selectedShops=JSON.parse($("#jsons").val().replace(/=/g, '"'));
            }else{
                selectUnit.reset();
            }
            $(".refer_rental").on("click",function(){
                selectUnit.modalShow(
                    function(selectedShops){
                        _selectedShops=selectedShops;
                        _setInput(_selectedShops)
                    },_selectedShops);
            });
            // console.log($('#addAnnouncementForm').serialize())
            // alert(data.data);
            // pageView.loadingHide();
            // selectUnit.init(data,"multi");
        }
    });
}
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
        url:'http://localhost:80/file_web/sdk/platform/file',
        //url:fileWeb_Path +'sdk/platform/file',
        type: 'POST',
        dataType: "json",
        cache: false,
        data: formData,
        processData: false,
        contentType: false
    }).done(function (response) {
        if (response.success) {
            var url = "http:"+accessUrl + response.data.path;
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
            $("."+flagName+">ul").html(_tmp);
            $("#path").val(url);
            //将图片路径添加到输入框
        } else {
            alert(response.message);
        }
    });
}
/*------------------文件上传完成-----------------------------*/
/*------------------文件上传开始-----------------------------*/
var flagName="";
//(修改)验证图片格式和大小
function fileChangeUpdate(target) {
    flagName=$(target).attr("flagName");
    var fileSize = 0;
    var filetypes =[".jpg",".png",".bmp",".gif",".jpeg",".tiff",".psd",".swf",".svg",".pcx",".dxf",".wmf",".emf",".lic",".eps",".tga"];  //图片全部格式
    var filepath = target.value;
    var filemaxsize = 1048576*20;  //20M
    var widths = $("#fileupload").width;
    var heights = $("#fileupload").height;
    var fileSizes = target.files[0].size;
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
        var filePic = target.files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = e.target.result;
            //加载图片获取图片真实宽度和高度
            var image = new Image();
            image.onload=function(){
               var width = image.width;
                var height = image.height;
                if(width!=750 || height!=488 || fileSizes>filemaxsize){
                    alert("请上传750*488像素，最大不超过20M的图片!");
                    target.value ="";
                    $("#path").val("");
                    $("#imgs").remove();
                }
            };
            image.src= data;
        };
        reader.readAsDataURL(filePic);
    }else{
        return false;
    }
    //alert("--------------"+flagName);
}

function valitateForm(obj) {
    var contNO = $(obj).find("input[name=contNO]").val();
    var mallId = $(obj).find("input[name=mallId]").val();
    var activityName = $(obj).find("input[name=activityName]").val();
    var startTime = $.trim($(obj).find("input[name=startTime]").val());
    var endTime = $(obj).find("input[name=endTime]").val();
    var signUpDate = $.trim($(obj).find("input[name=signUpDate]").val());
    var activityDesc = $.trim($(obj).find("textarea[name=activityDesc]").val());
    var path = $.trim($(obj).find("input[name=path]").val());
    var activityNames = $(obj).find("input[name=activityNames]").val();
    var activityDescs = $.trim($(obj).find("input[name=activityDescs]").val());
    var endDates = $(obj).find("input[name=endDates]").val();
    var startDates = $.trim($(obj).find("input[name=startDates]").val());
    if (mallId == "" || mallId == null) {
        alert("项目公司不能为空！");
        return false;
    }

    if (activityName == "" || activityName == null) {
        alert("活动主题不能为空！");
        return false;
    }

    if (startTime == "" || startTime == null) {
        alert("开始时间不能为空！");
        return false;
    }

    if (endTime == "" || endTime == null) {
        alert("结束时间不能为空！");
        return false;
    }

    if (signUpDate == "" || signUpDate == null) {
        alert("报名截止时间不能为空！");
        return false;
    }


    if (activityDesc == "" || activityDesc == null) {
        alert("活动介绍不能为空！");
        return false;
    }

    if (path == "" || path == null) {
        alert("活动图片不能为空！");
        return false;
    }
    if (activityNames == "" || activityNames == null) {
        alert("子活动名称不能为空！");
        return false;
    }
    if (activityDescs == "" || activityDescs == null) {
        alert("子活动描述不能为空！");
        return false;
    }
    if (endDates == "" || endDates == null) {
        alert("子活动开始时间不能为空！");
        return false;
    }

    if (startDates == "" || startDates == null) {
        alert("子活动结束时间不能为空！");
        return false;
    }
    return true;
}
