
var pageView=(function($){
    var pageView={};
    var container = $("#page-announcement");

    pageView.init = function(){
        /* pageView.ysDropdownByType();*/
        pageView.loadingHide();
        // pageView.generalQueryBtn(true,1);
        pageView.updateBtn();
        pageView.logOpenOrOffBtn();
        //查询
        $(".zl-query-btn").unbind().on("click",function () {
            pageView.generalQueryBtn(true,1);
        })
    };
    pageView.loadingShow = function () {
        $(".zl-loading").fadeIn();
    }

    pageView.loadingHide = function () {
        $(".zl-loading").fadeOut();
    }

    //编辑
    pageView.updateBtn=function(){
        $(".update-btn").unbind().on("click",function () {
           var id= $(this).attr("ids");
            window.location = merchantWeb_Path + "/clerkInfo/toAdd.htm?id=" + id;
        })
    }
    //注销
    pageView.logOpenOrOffBtn=function(){
        $(".logOpenOrOff-btn").unbind().on("click",function () {
            var id=$(this).attr("ids");
            confirm("是否确认注销，此操作不可逆！", "", "", function (type) {
                if (type == "dismiss") {
                    return;
                }

                $.ajax({
                    url: merchantWeb_Path+"/clerkInfo/merClerkInfoDel.htm",
                    type: "POST",
                    dataType: "json",
                    data: {
                        id : id
                    },
                    success: function (data) {
                        //console.log("11111");
                        alert(data.msg);
                        pageView.generalQueryBtn(true,1);
                    }
                });
            })
        })
    }
    //得到详情数据
    pageView.getList=function() {
        pageView.generalQueryBtn(true,1);
    }
    //分页查询
    pageView.generalQueryBtn=function generalQueryBtn(flag,page){
        if(flag){
            pageView.loadingShow();
        }
        //获取查询条件 一次提交表单
        var fm = document.getElementById("searchForm");
        var formData = new FormData(fm);
        var url = "merClerkInfoIndexInformation.htm";
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
                $(".zl-body-list").html("");
                $(".zl-body-list").append(data);
                //console.log(data);
                //分页=====================================>>>>
                $('#btn-pre-bottom').unbind().on('click', function () {
                    if (!$(this).hasClass('zl-btn-disable')) {
                        //location.href = _that.query(_that.url.list,$('#js-store-form')) + '&page=' + (parseInt($('.page-index').html()) - 1);
                        pageView.generalQueryBtn(true,(parseInt($('.page-index').html())-1));
                    }
                });
                $('#btn-next-bottom').unbind().on('click', function () {
                    if (!$(this).hasClass('zl-btn-disable')) {
                        //location.href = _that.query(_that.url.list,$('#js-store-form')) + '&page=' + (parseInt($('.page-index').html()) + 1);
                        pageView.generalQueryBtn(true,(parseInt($('.page-index').html())+1));
                    }
                });
                $('#gotoPage').unbind().on('click', function () {
                    var value = parseInt($(this).parent().find('.zl-page-num-input').val());
                    if (pageView.verifyPagination(value, parseInt($('.page-all').html()))) {
                        //location.href = _that.query(_that.url.list,$('#js-store-form')) + '&page=' + value;
                        pageView.generalQueryBtn(true,value);
                    }else{
                        $(".zl-page-num-input").val($('.page-all').html());
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
                pageView.init();
            }
        });
    }

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
    }
    //数字校验
    pageView.isNumberss= function isNumberss(num) {
        var pat = new RegExp('^[0-9]+$');
        return pat.test(num)
    }
    //回车事件查询
    pageView.keyups=function(){
        $("#searchWord").keydown(function (event) {
            if(event.keyCode ==13){
                pageView.generalQueryBtn(true,1);
            }
        })

    }
    return pageView;
})(jQuery);


$(document).ready(function(){
    pageView.getList();
    pageView.loadingHide();
    pageView.init();
    pageView.keyups();
});





