/**
 * Created by wenhs on 2018/6/26.
 */

var pageView=(function($){
    var pageView={};
    var container = $("#activity-mgt");
    /**
     * 查询
     */
    pageView.queryCondition=function (){
        //查询
        $(".query-btn").on("click",function () {
            pageView.generalQueryBtn(true,1);
        })
    }
    pageView.init = function(){
        pageView.dropdownInit();
    };

    pageView.loadData = function(){
        container.find("#searchForm").submit();
    };

    // 下拉框初始化
    pageView.dropdownInit = function(){
        container.off("click");
        container.on('click', "div.zl-dropdown ul.dropdown-menu li a", function(){
            var key = $(this).attr("data-value");
            console.log(key);
            $(this).closest('div.zl-dropdown').find("input[type=hidden]").val(key);

            var value = $(this).text();
            $(this).closest('div.zl-dropdown').find("button").text(value);
            if($(this).hasClass("form-li")){
                //只执行一遍
                var flag = true;
                if(flag==true){
                    $("#searchForm").find("input[name=page]").val(1);
                    container.find("a.query-btn").click();
                    flag=false;
                }

            }
        });
    };

    $(".zl-datetimepicker-query").find("input").datetimepicker({
        format: "yyyy-mm-dd",
        todayBtn: "linked",
        startView: 2,
        minView: 2,
        autoclose: true,
        language: "zh-CN",
        clearBtn:true
    });
    
    pageView.loadingShow = function () {
        $(".zl-loading").fadeIn();
    }

    pageView.loadingHide = function () {
        $(".zl-loading").fadeOut();
    }
    //分页查询
    pageView.generalQueryBtn=function generalQueryBtn(flag,page){
        if(flag){
            pageView.loadingShow();
        }
        //获取查询条件 一次提交表单
        var fm = document.getElementById("searchForm");
        if(page!=undefined&&page!=null&&page!=""){
            $("#page").val(page);
        }
        console.log($("#page").val());
        var formData = new FormData(fm);
        var url = "index.htm";
        console.log(formData)
        $.ajax({
            cache: true,
            type: "POST",
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
                //console.log("111111");
                $(".zl-body-list").html("");
                $(".zl-body-list").append(data);
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
    return pageView;
     
})(jQuery);
//跳转页面
function viewDetail(id) {
    formPost(ibrandWeb_Path + "activity/toAdd.htm", {id:id});
}
/**
 * 加载修改页面
 * @param mallId
 */
function loadDetail(id) {
    location.href = "toAdd.htm?id=" + id;
}

$(document).ready(function(){
    pageView.generalQueryBtn(true,1);
    pageView.queryCondition();
});


