
var pageView=(function($){
    var pageView={};
    var container = $("#page-announcement");

    pageView.init = function(){
        pageView.ysdropdowns();
        pageView.extentDate();
        pageView.add();
        deleteFileImag();
    };
    pageView.loadingShow = function () {
        $(".zl-loading").fadeIn();
    }

    pageView.loadingHide = function () {
        $(".zl-loading").fadeOut();
    }
    //文件上传
    pageView.addFile= function addFile(indexs,flag) {
        $('#fileupload-' + indexs).fileupload({
            dataType: 'json',
            add: function (e, data) {
                console.log(data);
                console.log(e);
                $.each(data.files, function (index, file) {
                    //console.log(file)
                    uploadFiles(file, indexs,flag);
                });
                data.submit();
            },
            done: function (e, data) {
            },
            progressall: function (e, data) {
            }
        });

        $('.zl-img-wrapper-' + indexs).magnificPopup({
            delegate: '.zl-thumbnail',
            type: 'image',
            gallery: {
                enabled: true
            },
        });


    }
    function uploadFiles(file, ind,flag) {
        var _this = $(this);
        var formData = new FormData();
        //console.log(_this.html());
        var _index =0;


        formData.append("action", "1002");
        formData.append("single", 1);
        formData.append("category", "FILE_ENROLMENT_COMPANY");
        formData.append("targetId", '');
        formData.append('file', file);
        $.ajax({
            url: fileWeb_Path+'sdk/platform/file',
            type: 'POST',
            dataType: "json",
            cache: false,
            data: formData,
            processData: false,
            contentType: false
        }).done(function (response) {
            if (response.success) {
                var url = "https:"+accessUrl + response.data.path;
                /*var _tmp =
                        " <li>" +
                        "<input type=\"hidden\" id=\"licenseImgUrl\" name=\"ibCompanyLicenseList[" + ind + "].licenseImgUrl\" value=" + url + ">" +
                        "   <div class=\"zl-thumbnail-wrapper\">" +
                        "       <em class='zl-thumbnail' data-mfp-src='" + url + "' style='background-image:url(" + url + ")'" +
                        "        ></em>" +
                        "       <a class=\"zl-icon-btn zl-icon-btn-del\"></a>" +
                        "   </div>" +
                        "</li>";*/
                if(ind==1){
                    var numbers=0;
                    //得到最后一张图片的序号
                    $("#clerkPhotoListFlag a").each(function (i) {
                        if($(this).attr("numberFlag")){
                            numbers=Number($(this).attr("numberFlag"))+1;
                        };
                        /*if ($(this).is(_this.closest("tr"))) {
                            _index = i;
                            return false;
                        }*/
                    });

                    var html = '<a class="zl-file-inline" href="' + url + '" download target="_blank"  numberFlag='+numbers+'>\n' +
                        '<input type="hidden" name="clerkPhotoList[' +numbers +'].path"  class="clearVal_input" value="' + url + '">' +
                        '<input type="hidden" name="clerkPhotoList[' +numbers +'].name"  class="clearVal_input" value="' + response.data.originalName + '">' +
                        '<span class="clearVal_other">' + response.data.originalName + '</span>\n' +
                        '<em class="zl-icon zl-icon-del-file zl-icon-del-file-imgUrl"></em>\n' +
                        '</a>';
                }else if(ind==2){
                    var numbers=0;
                    //得到最后一张图片的序号
                    $("#cardPhotoFlag a").each(function (i) {
                        if($(this).attr("numberFlag")){
                            numbers=Number($(this).attr("numberFlag"))+1;
                        };
                        /*if ($(this).is(_this.closest("tr"))) {
                            _index = i;
                            return false;
                        }*/
                    });
                    var html = '<a class="zl-file-inline" href="' + url + '" download target="_blank"  numberFlag='+numbers+'>\n' +
                        '<input type="hidden" name="cardPhoto[' +numbers +'].path"  class="clearVal_input" value="' + url + '">' +
                        '<input type="hidden" name="cardPhoto[' +numbers +'].name"  class="clearVal_input" value="' + response.data.originalName + '">' +
                        '<span class="clearVal_other">' + response.data.originalName + '</span>\n' +
                        '<em class="zl-icon zl-icon-del-file zl-icon-del-file-imgUrl"></em>\n' +
                        '</a>';
                }else if(ind==3){
                    var numbers=0;
                    //得到最后一张图片的序号
                    $("#healthCardListFlag a").each(function (i) {
                        if($(this).attr("numberFlag")){
                            numbers=Number($(this).attr("numberFlag"))+1;
                        };
                        /*if ($(this).is(_this.closest("tr"))) {
                            _index = i;
                            return false;
                        }*/
                    });
                    var html = '<a class="zl-file-inline" href="' + url + '" download target="_blank"  numberFlag='+numbers+'>\n' +
                        '<input type="hidden" name="healthCardList[' +numbers +'].path"  class="clearVal_input" value="' + url + '">' +
                        '<input type="hidden" name="healthCardList[' +numbers +'].name"  class="clearVal_input" value="' + response.data.originalName + '">' +
                        '<span class="clearVal_other">' + response.data.originalName + '</span>\n' +
                        '<em class="zl-icon zl-icon-del-file zl-icon-del-file-imgUrl"></em>\n' +
                        '</a>';
                }

                //将图片添加到展示区
                /*console.log("-----");
                console.log(response.data);
                console.log("111");*/
                //console.log(ind);
                // console.log($(".zl-img-wrapper-" + ind).parent().html());
                /*  $(".zl-img-wrapper-" + ind + ">ul").append(_tmp);*/
                $(".zl-img-wrapper-" + ind).parent().append(html);
                deleteFileImag();
            } else {
                alert(response.message);
            }
        });
    }
    //文件删除
    function deleteFileImag() {
        $(".zl-icon-del-file-imgUrl").on("click", function (event) {
            event.stopPropagation();
            event.preventDefault();
            $(this).closest("a").remove()
            //console.log($(this).closest("a").remove());
        })
    }

    //职位下拉框
    pageView.ysdropdowns = function () {
        $(".btn-group-role").ysdropdown({
            callback:function(val,$elem){
                //选择店长时默认录入销售额和服务申请都默认选中
                if(val=="1"){
                    console.log("===================")
                   /* $("#js-tax-include-2").prop("checked",false);
                    $("#js-tax-include-4").prop("checked",false);*/

                    $("#js-tax-include-3").prop("checked",false);
                    $("#js-tax-include-5").prop("checked",false);
                    $("#js-tax-include-2").prop("checked",true);
                    $("#js-tax-include-4").prop("checked",true);
                    $(".isSalesFlag").hide();
                }else{
                    $("#js-tax-include-3").prop("checked",true);
                    $("#js-tax-include-5").prop("checked",true);
                    $("#js-tax-include-2").prop("checked",false);
                    $("#js-tax-include-4").prop("checked",false);
                    $(".isSalesFlag").show();
                }
                console.log(val);
                console.log($elem);
            }
        });
    }
    //发送日期初始化
    pageView.extentDate=function() {
        $(".input-group").find("input").datetimepicker({
            language: 'zh-CN',
            format:"yyyy-mm-dd",
            todayBtn:"linked",
            startView:2,
            minView:2,
            weekStart: 1,
            autoclose: 1,
            todayHighlight: 1,
            forceParse: 0,
             clearBtn: true,
           /* startDate : new Date("2017/01/01"),
            endDate:new Date(),*/
        });
    }
    //点击增加按钮
    pageView.add=function () {
        $(".save-btn").on("click",function () {
            if(!pageView.dataVerify()){
                var fm = document.getElementById("addForm");
                var formData = new FormData(fm);
                var url = "merClerkInfoSave.htm";
                $.ajax({
                    cache: true,
                    type: "post",
                    url:url,
                    contentType: false,
                    processData: false,
                    data:formData,
                    //dataType: "html",
                    dataType: "json",
                    async: false,
                    /*  cache: true,
                      type: "post",
                      url: "getAnnouncementInformation.htm",
                      data: formData,
                      dataType: "html",*/
                    error: function (request) {
                        alert("系统异常");
                        pageView.loadingHide();
                    },
                    success:function(data) {
                        //console.log(data);
                        //console.log("================="+data.code);

                        //debugger;
                        if(Number(data.code)==1){
                            alert(data.msg);
                            return;
                        }

                        javascript:history.back();
                        //console.log("-----------------------------------------------");
                    }
                });
            };

        })
    }
    //数据验证
    pageView.dataVerify=function () {
        var flag=false;

        //员工姓名
        var clerkName = $("input[name=clerkName]").val();
        if(!clerkName||clerkName==null||clerkName==""){
            alert("员工姓名不能为空");
            return true;
        }
        if(clerkName.length>50){
            alert("员工姓名不能为空");
            return true;
        }
        //身份证
        var idNo = $("input[name=idNo]").val();
        if(!idNo||idNo==null||idNo==""){
            alert("身份证不能为空");
            return true;
        }
        var pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if(!pattern.test(idNo)){
            alert("身份证格式错误！");
            return true;
        };
        //关联手机
        var bindTel = $("input[name=bindTel]").val();
        if(!bindTel||bindTel==null||bindTel==""){
            alert("关联手机不能为空");
            return true;
        }
        var pattern = /^1[34578]\d{9}$/;
        if(!pattern.test(bindTel)){
            alert("请填写正确电话号码！");
            return true;
        } ;
        //职位
        var clerkRole = $("input[name=clerkRole]").val();
        if(!clerkRole||clerkRole==null||clerkRole==""){
            alert("职位不能为空");
            return true;
        }

       /* //在职状态
        var clerkStatus = $("input[name=clerkStatus]").val();
        if(!clerkStatus||clerkStatus==null||clerkStatus==""){
            flag=true;
            alert("在职状态不能为空");
        }*/
        //入职日期
        var entryTime = $("input[name=entryTime]").val();
        if(!entryTime||entryTime==null||entryTime==""){
            alert("入职日期不能为空");
            return true;
        }
        //onsole.log(clerkName);
        return false;

    }
    return pageView;
})(jQuery);


$(document).ready(function(){
    pageView.loadingHide();
    pageView.init();
});



