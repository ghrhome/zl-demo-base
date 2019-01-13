
var pageView=(function($){
    var pageView={};
    var container = $("#page-announcement");
    var formData;

    pageView.init = function() {
        console.log("==================22222222222222222222==========================");
        pageView.ysDropdownByType();
        pageView.detailNews();
        pageView.extentDate();
        pageView.loadingHide();
        pageView.oncilcks();
        pageView.onbutton();
        pageView.ondelete();
    }

    //===============修改成功的方法========================================  $("body").on("click",".saveUpdate",function () {
    pageView.onbutton=function () {
        $("body").on("click",".saveUpdate",function () {
            var that=this;

            confirm("确认修改吗？","","",function(type){
                // 修改取消的方法
                if(type==="dismiss"){
                    return
                }
              //这个获取到的是个form表单对象，
         var temp = $(that).parent().parent().parent().find("form").serialize();
           //temp=temp.split("&");
          /* var tempJson={};
            $.each(temp,function(i,v){
                tempJson[v.split("=")[0]]=v.split("=")[1];
            });*/
                console.log("====================获取数据=====================");
                console.log(temp);
         $.ajax({
                cache: true,
                type: "POST",
                url: "updateAnnouncement.htm",
                data: temp,
                async: false,
                error: function (data) {
                    alert("系统异常");
                },
                success: function (data) {
                    console.log("====================返回数据=====================");
                    console.log(data);
                    alert("修改成功");
                    window.location.href="merAnnouncementIndex"
                }
            });
        });
        });
    };

    //===============删除的方法========================================
    pageView.ondelete=function () {
        $("body").on("click",".delete",function () {
            var that=this;
            confirm("确认删除吗？","","",function(type){
                if(type=="dismiss") return;
                //这个获取到的是个form表单对象，
                var temp = $(that).parent().parent().parent().find("form").serialize();
                console.log("====================获取数据=====================");
                console.log(temp);
                $.ajax({
                    cache: true,
                    type: "POST",
                    url: "deleteAnnouncement.htm",
                    data: temp,
                    async: false,
                    error: function (data) {
                        alert("系统异常");
                    },
                    success: function (data) {
                        console.log("====================返回数据=====================");
                        console.log(data);
                        alert("删除成功");
                        window.location.href="merAnnouncementIndex.htm";
                    }
                });
            });
        });
    };

    pageView.loadingShow = function () {
        $(".zl-loading").fadeIn();
    };

    pageView.loadingHide = function () {
        $(".zl-loading").fadeOut();
    }

    //消息类型下拉框
    pageView.ysDropdownByType = function () {
            $(".zl-dropdown-byType").ysdropdown({
                callback:function(val,$elem){
                    console.log("===================")
                    console.log(val);
                    console.log($elem);
                    $("#announcement-condition").submit();
                }
            });
    }
     //在详情页面中选中消息类型改
    pageView.detailNews = function () {
     //        $(".zl-dropdown-byType").ysdropdown({
     //            callback:function(val,$elem){
     //                console.log("===================")
     //                console.log(val);
     //                console.log($elem);
     //            }
     //        });}


        //下拉框选中方法
        $(".zl-dropdown-inline").ysdropdown({
            callback:function(val,$elem){
                console.log("===================")
                console.log(val);
                console.log($elem);
            }
        });
    };

    //得到公告详情数据
    pageView.getList=function() {
        pageView.generalQueryBtn(true,1);
    }

    //发送日期初始化
    pageView.extentDate=function() {
        $(".zl-datetime-send-extent").find("input").datetimepicker({
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
            startDate : new Date("2017/01/01"),
            endDate:new Date(),
        }).on('changeDate', function(ev){
            if(!pageView.dateValidate()){
                // $(this).val("");
                return;
            }
        });
    };

    //模糊条件查询
    pageView.oncilcks =function(){
        $('#js-search-main').on('click', function () {
            console.log("关键字"+$('#keywords').val());
            pageView.generalQueryBtn(true,1);
        });

        $('.zl-checkbox').on('click', function () {
            $(this).toggleClass("checked");
            if($(this).hasClass("checked")){
                $("#checked").val("checked");
            }else{
                $("#checked").val("");
            }
            $("#announcement-condition").submit();
        });
    }

    //日期插件限制
    pageView.dateValidate=function dateValidate(){
        var start = $("input[name=start]").val().replace(/-/g, "\/");
        var end = $("input[name=end]").val().replace(/-/g, "\/");
        var startDate = new Date(start);
        var endDate = new Date(end);

        if(startDate > endDate){
            alert("开始时间应小于结束时间");
            return false;
        }
        return true;
    }

    //分页查询
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
                pageView.detailNews();
                //console.log(data);
                //分页=====================================>>>>

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

                $('#gotoPage').on('click', function () {
                    var value = parseInt($(this).parent().find('.zl-page-num-input').val());
                    if (pageView.verifyPagination(value, parseInt($('.page-all').html()))) {
                        //location.href = _that.query(_that.url.list,$('#js-store-form')) + '&page=' + value;
                        pageView.generalQueryBtn(true,value);
                    }else{
                        $(".zl-page-num-input").val($('.page-all').html());
                        /*试试*/
                    }
                });

                $(".zl-page-num-input").bind("keypress",function(event){
                    if(event.keyCode == "13")
                    {
                        $('#gotoPage').click();
                    }
                });
                //分页<<<<=====================================
                if(flag) {
                    pageView.loadingHide();
                }
            }
        });
    }

    //验证页数
    pageView.verifyPagination=function verifyPagination(value,total) {
        if(!pageView.isNumberss(value)){
            alert('请输入正确的页码');
            return  false;
        }
        if(value>total){
            alert('超过总页数,请重新输入 ');
            return false;
        }

        if(total===0) return true;
        return true;
    }
    //数字校验
    pageView.isNumberss= function isNumberss(num) {
        var pat = new RegExp('^[0-9]+$');
        return pat.test(num)
    }
    return pageView;
})(jQuery);


$(document).ready(function(){
    pageView.getList();
    pageView.loadingHide();
    pageView.init();
});




