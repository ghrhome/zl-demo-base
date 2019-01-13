
var pageView=(function($){
    var pageView={};
    var container = $("#page-announcement");
    var formData;

    pageView.init = function() {
        pageView.ysDropdownByType();
        pageView.addbut();
        pageView.examdel();
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
                    var html = '<a class="zl-file-inline" href="' + url + '" download target="_blank"  >\n' +
                        '<input type="hidden"  name="qrCode" class="clearVal_input qrCode" value="' + url + '">' +
                      /*  '<input type="hidden"   class="clearVal_input" value="' + response.data.originalName + '">' +*/
                        '<span class="clearVal_other">' + response.data.originalName + '</span>\n' +
                        '<em class="zl-icon zl-icon-del-file zl-icon-del-file-imgUrl"></em>\n' +
                        '</a>';
                $(".zl-img-wrapper").html(html);
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


    pageView.loadingShow = function () {
        $(".zl-loading").fadeIn();
    };

    pageView.loadingHide = function () {
        $(".zl-loading").fadeOut();
    }

    //消息类型下拉框
    pageView.ysDropdownByType = function () {
            $(".zl-dropdown").ysdropdown({
                callback:function(val,$elem){
                    console.log("===================")
                    console.log(val);
                    console.log($elem);
                    $(".mallId").val(val);
                    $("#announcement-condition").submit();
                }
            });
    }
    //考试增加
    pageView.addbut=function(){
        $(".zl-btn-exam-add").unbind().on('click',function () {
           var mallId= $(".mallId").val();
            var title=$(".title").val();
            var qrCode=$(".qrCode").val();
            console.log("---------------"+mallId);
            if(mallId==null||mallId==""){
                alert("请先选择项目！");
                return;
            }
            if(title==null||title==""){
                alert("主题不能为空！");
                return;
            }
            if(!qrCode||qrCode==null||qrCode==""){
                alert("请上传图片！");
                return;
            }
            //获取查询条件 一次提交表单 提交失败，重新提交。
            var fm = document.getElementById("form-horizontal");
            formData = new FormData(fm);
                $.ajax({
                    cache: true,
                    type: "post",
                    url:'addExam.htm',
                    contentType: false,
                    processData: false,
                    data:formData,
                    //dataType: "html",
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
                        alert("新增成功");
                        window.location.reload();
                    }
                })
        })
    }
    pageView.examdel=function(){
        $(".exam-del").unbind().on('click',function () {



            var id=$(this).attr("id");
            $.ajax({
                cache: true,
                type: "post",
                url:'delExam.htm',
                //contentType: false,
                // processData: false,
                data:{"id":id},
                //dataType: "html",
                //async: false,
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
                    alert("新增成功");
                    window.location.reload();
                }
            })
        })
    }
    
    //页面查询
    pageView.generalQueryBtn=function (flag,page){
        if(flag){
            pageView.loadingShow();
        }
        //获取查询条件 一次提交表单 提交失败，重新提交。
        var fm = document.getElementById("announcement-condition");
        formData = new FormData(fm);
        var url = "getAnnouncementInformation.htm";
        if(page!=undefined&&page!=null&&page!=""){
            formData.append("page",page);
        }
        $.ajax({
            cache: true,
            type: "post",
            url:url,
            contentType: false,
            processData: false,
            data:formData,
            dataType: "html",
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
                console.log("type"+formData.get("type"));
                console.log("start"+formData.get("start"));
                console.log("end"+formData.get("end"));
                $(".zl-body-list").html("");
                $(".zl-body-list").append(data);

            }
        });
    }
    return pageView;
})(jQuery);


$(document).ready(function(){
    pageView.init();
});




