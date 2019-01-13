var pageView=(function($){
    var pageView={};
    var container = $("#service-apply-acceptance");

    pageView.init = function(){
        // 动态效果
        pageView.loadingHide();

        //初始化日期控件
        $(".zl-datetimepicker-query").find("input").datetimepicker({
            format: "yyyy-mm-dd",
            todayBtn: "linked",
            startView: 2,
            minView: 2,
            autoclose: true,
            language: "zh-CN",
            clearBtn: true
        });

        //查询按钮查询
        $(".zl-query-btn").on("click",function () {
            var startT = $("#startDate").val();
            var endT = $("#endDate").val();
            if (pageView.verifyQueryDate(startT, endT)) {
                pageView.generalQueryBtn(true, 1);
            }
        });

        //下拉框自动查询
        $(".btn-group").ysdropdown({
            callback : function () {
                var startT = $("#startDate").val();
                var endT = $("#endDate").val();
                if (pageView.verifyQueryDate(startT, endT)) {
                    pageView.generalQueryBtn(true, 1);
                }
            }
        });

        $("#js-export-new").on("click",function () {
            var startT = $("#startDate").val();
            var endT = $("#endDate").val();
            if (pageView.verifyQueryDate(startT, endT)) {
                pageView.exportBtn();
            }
        });
    }

    pageView.initTable = function(){
        //选中list条目
        $("#service-apply-acceptance").unbind("click", ".table tbody tr").on("click", ".table tbody tr", function (e) {
            e.preventDefault();
            var dataQuery={serviceId:$(this).find('input').eq(0).val(), mallId:$(this).find('input').eq(1).val()};
            formPost(merchantWeb_Path + "serviceAll/queryServiceDetail", dataQuery);
            pageView.loadingHide();
        });
    }

    //加载开始
    pageView.loadingShow = function () {
        $(".zl-loading").fadeIn();
    }

    //加载完成
    pageView.loadingHide = function () {
        $(".zl-loading").fadeOut();
    }

    //获取申请列表数据
    pageView.getList=function() {
        pageView.generalQueryBtn(true, 1);
    }

    //分页查询
    pageView.generalQueryBtn=function generalQueryBtn(flag,page){
        if(flag){
            pageView.loadingShow();
        }
        //获取查询条件 一次提交表单
        var fm = document.getElementById("service-apply-condition");
        var formData = new FormData(fm);
        var url = "queryServiceApply";
        if(page!=undefined&&page!=null&&page!=""){
            formData.append("page",page);
        }
        $.ajax({
            cache: false,
            type: "post",
            url:url,
            contentType: false,
            processData: false,
            data:formData,
            dataType: "html",
            async: false,
            error: function (request) {
                alert("系统异常");
                pageView.loadingHide();
            },
            success:function(data) {
                $(".zl-body-list").html("");
                $(".zl-body-list").append(data);
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
                pageView.initTable();
            }
        });
    }

    pageView.exportBtn=function exportBtn(){
        //获取查询条件 一次提交表单
        $("#service-apply-condition").submit();
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

    //验证查询时间
    pageView.verifyQueryDate=function verifyQueryDate(start, end) {
        if (start == '' || end == '') {
            return true;
        }
        var startTime = new Date(start);
        var endTime = new Date(end);
        if(startTime.getTime() > endTime.getTime()) {
            alert("查询开始日期不能小于结束日期");
            return false;
        }
        return true;
    }

    return pageView;
})(jQuery);

//页面初始化加载
$(document).ready(function(){
    pageView.getList();
    pageView.loadingHide();
    pageView.init();
});





