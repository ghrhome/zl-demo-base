/**
 * Created by wenhs on 2018/6/26.
 */

var pageView=(function($){
    var pageView={};
    var container = $("#activity-mgt");
    var _selectedShops={};
    /**
     * 查询
     */
    pageView.queryCondition=function (){
        //查询
        $(".query-btn").on("click",function () {
            pageView.generalQueryBtn(true,1);
            $("#company").ysdropdown({
                callback:function(val,$elem) {
                    $("#clerkOpen").val(val);
                }
            });
        })
    }

    pageView.init = function(){
        pageView.dropdownInit();
    };

    pageView.export=function(){
        $("#export").on("click",function () {
            var fm = document.getElementById("searchForm");
            $("#searchForm").attr("action","exportExcel");
            $("#searchForm").submit();
        })
    }

    pageView.loadData = function(){
        container.find("#searchForm").submit();
    };

    // 下拉框初始化
    pageView.dropdownInit = function(){
        container.off("click");
        container.on('click', "div.zl-dropdown ul.dropdown-menu li a", function(){
            var key = $(this).attr("data-value");
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
        var formData = new FormData(fm);
        var url = "signUpIndex.htm";
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
    pageView.export();
    $("#company").ysdropdown({
        callback:function(val,$elem) {
            $("#clerkOpen").val(val);
        }
    });
    $("#add").click(function(){
        var val = $("#activityId").val();
        if (!valitateForm($('#sigupForm'))) {
            return false;
        }
        var data = $("#sigupForm").serialize();
        confirm("确认要提交吗？", "", "", function (type) {
            if (type == "dismiss") {
                return;
            }
            $.ajax({
                type: "post",
                url: "addSigu.htm",
                data: data,
                async: false,
                success: function (data) {
                    var parsedJson = jQuery.parseJSON(data);
                    if(parsedJson.code==0){
                        alert(parsedJson.data);
                        setTimeout(function(){window.location = merchantWeb_Path + "activity/signUpToIndex.htm?activityId="+val+"&signUpStatus="+$("#signUpStatus").val();},500);
                    }else{
                        alert(parsedJson.msg);
                    }
                }
            });
        });
    });
    var value = $("#mallId").val();
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
            selectUnit.init(data,"multi");
            var _selectedShops={};
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
    $("#contNos").val(contractIdStr);//要获取到业态id和合同号。
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

function valitateForm(obj) {
    var contNos = $(obj).find("input[name=contNos]").val();
    var activitySubIds = $("input[type=checkbox]").is(":checked");
    if (contNos == "" || contNos == null) {
        alert("报名品牌不能为空！");
        return false;
    }
    if (!activitySubIds) {
        alert("参加子活动不能为空！");
        return false;
    }
    return true;
}

