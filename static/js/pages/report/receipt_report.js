var receipt_pageView=(function($){
    /*confirmAlert.init();*/
    var receipt_pageView={};
    $("#preloader").fadeOut("fast");
    receipt_pageView.eventInit=function(){
        receipt_pageView.getList();
    }
    //项目切换
    // pageView.searchMall=function(_this) {
    //     var mallId = $(_this).attr("key");
    //     $("#projectViewName").text($(_this).text());
    //     $("#mallId").val(mallId);
    //     $("#searchBsFormBtn").click();
    // }
    //修改按钮
    //     $("#subUpdate").on("click",function(){
    //         updateData();
    //     })
    /**
     * 遮挡层
     */
    receipt_pageView.loadingShow = function () {
        $(".zl-loading").fadeIn();
    }

    receipt_pageView.loadingHide = function () {
        $(".zl-loading").fadeOut();
    }
    receipt_pageView.loadingShow();



    receipt_pageView.getList=function() {
        receipt_pageView.loadingShow();
        var params = {};
        /*var status = $("#status").val();
         var searchWord = $("#searchWord").val();
         var contractType = $("#contractType").val();
         var category=$("#category").val();
         var mallId=$("#mallId").val();
         var netcommentId=$("#netcommentId").val();
         if($("#netcommentRef").val()){
         netcommentId = $("#netcommentRef").val();
         $("#netcommentRef").val("");
         }
         //var net_status=$("#net_status  option:selected").val();
         if (mallId) {
         params.mallId = mallId;
         }
         if (status && status != "07") {
         params.status = status;
         }
         if (searchWord) {
         params.searchWord = searchWord;
         }
         params.page =  $("#page").val();
         if (contractType) {
         params.contractType = $("#contractType").val();
         }
         if (category) {
         params.category = category;
         }
         if (netcommentId) {
         params.netcommentId = netcommentId;
         }*/

        $.ajax({
            cache: true,
            type: "post",
            url: "reportDetail.htm",
            data: params,
            dataType: "html",
            //async: false,
            error: function (request) {
                alert("系统异常");
                receipt_pageView.loadingHide();
            },
            success: function (data) {
                receipt_pageView.loadingHide();
                $("#canvass_business_detail").html(data);
                var ys_main_swiper = new Swiper('#zl-floor-main-table', {
                    scrollbar: '.swiper-scrollbar-a',
                    direction: 'horizontal',
                    slidesPerView: 'auto',
                    //mousewheelControl: true,
                    freeMode: true,
                    scrollbarHide:false,
                    preventClicksPropagation:false
                });

                $("#receipt-report").on("click", ".zl-paginate", function (e) {
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
                    $("#page").val(page);
                    query();
                });

                $("#gotoPage").on("click", function (e) {
                    //console.log("==========================");
                    if (!isNumberss($("#gotoPageNum").val()) || parseInt($("#gotoPageNum").val()) == 0) {
                        alert("请输入合法数字！");
                        return false;
                    }
                    if(regeMatch($("#gotoPageNum").val())){
                        alert("请勿输入特殊字符！");
                        return false;
                    }

                    if(verifyPagination(parseInt($("#gotoPageNum").val()), parseInt($("#pages").val()))){
                        $("#receipt-report").find("input[name=page]").val($("#gotoPageNum").val());
                        query();
                    }else{
                        $("#gotoPageNum").val($("#pages").val());
                    }

                });

                $(".zl-page-num-input").bind("keypress",function(event){
                    if(event.keyCode == "13")
                    {
                        $("#gotoPage").trigger("click");
                    }
                });

            }
        });
    }
    return receipt_pageView;

})(jQuery);


$(document).ready(function(){
    receipt_pageView.loadingShow();
    receipt_pageView.eventInit();

    $(".date-month input").datetimepicker({
        language: "zh-CN",
        format:"yyyy-mm",
        todayBtn:"linked",
        startView:3,
        minView:3,
        weekStart: 1,
        autoclose: 1,
        todayHighlight: 1,
        forceParse: 0,
        clearBtn:true
    });

    $(".zl-dropdown").ysdropdown({
        callback:function(val,$elem){
        }
    });
    //城市公司
    $(".areaSelect").ysdropdown({
        callback:function(val,$elem){
            $.getJSON('mallList.htm',{areaId:val},function (res) {
                $(".queryForm-mall-dropdown").find("ul").empty();
                $(".queryForm-mall-dropdown").find("ul").append("<li><a  href='javascript:void(0)'>所有项目</a></li>");
                $.each(res,function (key,value) {
                    $(".queryForm-mall-dropdown").find("ul").append("<li><a data-value="+key+" data-id="+key+" href='javascript:void(0)'>"+value+"</a></li>");
                    //$('#js-query-block-menu').append("<li><a data-id="+element.id+" href='javascript:void(0)'>"+element.blockName+"</a></li>");
                });
            });
            //generalQueryBtn(true);
        }
    });
});

/*$(function () {
 /!*loadData();*!/

 });
 function searchMall(_this) {
 var mallId = $(_this).attr("key");
 $("#projectViewName").text($(_this).text());
 $("#mallId").val(mallId);
 $("#searchBsFormBtn").click();
 }
 //修改按钮
 $("#subUpdate").on("click",function(){
 updateData();
 })

 //修改方法
 function updateData() {
 $.ajax({
 url : financeWeb_Path + "easBaseOrgUnit/updateData.htm",  //请求地址
 type : "post",   //请求方式
 dataType : "json",  //数据类型
 contentType: 'application/json',
 data : JSON.stringify(getParam("formTypeFrom")),
 success : function(res){
 if (res.code === '100') {
 $('#ac-modal').modal('hide');
 loadData();
 alert("修改成功");
 } else {
 alert(res.msg);
 }
 },
 //请求失败
 error: function(json){
 }
 })
 }*/

function query(){
    loadingshow();
    var params = {mallId:$("#mallId").val(),chargeYM:$("#chargeYM").val(),searchWords:$("#searchWords").val(),actionType:$("#actionType").val(),page:$("#page").val()};
    $.ajax({
        cache: true,
        type: "post",
        url: "reportDetail.htm",
        data: params,
        dataType: "html",
        //async: false,
        error: function (request) {
            alert("系统异常");
            receipt_pageView.loadingHide();
        },
        success: function (data) {
            receipt_pageView.loadingHide();
            $("#canvass_business_detail").html(data);
            var ys_main_swiper = new Swiper('#zl-floor-main-table', {
                scrollbar: '.swiper-scrollbar-a',
                direction: 'horizontal',
                slidesPerView: 'auto',
                //mousewheelControl: true,
                freeMode: true,
                scrollbarHide:false,
                preventClicksPropagation:false
            });

            $("#receipt-report").on("click", ".zl-paginate", function (e) {
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
                $("#page").val(page);
                query();
            });

            $("#gotoPage").on("click", function (e) {
                //console.log("==========================");
                if (!isNumberss($("#gotoPageNum").val()) || parseInt($("#gotoPageNum").val()) == 0) {
                    alert("请输入合法数字！");
                    return false;
                }
                if(regeMatch($("#gotoPageNum").val())){
                    alert("请勿输入特殊字符！");
                    return false;
                }

                if(verifyPagination(parseInt($("#gotoPageNum").val()), parseInt($("#pages").val()))){
                    $("#receipt-report").find("input[name=page]").val($("#gotoPageNum").val());
                    query();
                }else{
                    $("#gotoPageNum").val($("#pages").val());
                }

            });
            $(".zl-page-num-input").bind("keypress",function(event){
                if(event.keyCode == "13")
                {
                    $("#gotoPage").trigger("click");
                }
            });

            loadingHide();

        }
    });
}


function regeMatch(strs){
    var pattern = new RegExp("[~'!@#$%^&*()-+_=:]");
    if(strs != "" && strs != null){
        if(pattern.test(strs)){
            //alert("非法字符！");
            return true;
        }else{
            return false;
        }
    }
}
//数字校验
function isNumberss(num) {
    var pat = new RegExp('^[0-9]+$');
    return pat.test(num)
}
function isNumber(value) {
    return /^(\-?)[0-9]+.?[0-9]*$/.test($.trim(value))
}
function isInt(str) {
    var reg = /^(-|\+)?\d+$/;
    return reg.test(str);
}

function verifyPagination(value,total) {
    if(!isNumber(value)){
        alert('请输入正确的页码');
        return  false;
    }
    if(value>total){
        alert('超过总页数,请重新输入 ');
        return false;
    }
    return true;
}

function loadingshow(){
    $(".zl-loading").fadeIn();
};

function loadingHide(){
    $(".zl-loading").fadeOut();
}