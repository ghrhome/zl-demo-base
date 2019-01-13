
var pageView=(function($){
    var pageView={};
    var container = $("#page-announcement");

    pageView.init = function(){
        /* pageView.ysDropdownByType();*/
        pageView.loadingHide();
        // pageView.generalQueryBtn(true,1);
        //查询
        $(".zl-query-btn").unbind().on("click",function () {
            pageView.generalQueryBtn(true,1);
        })
        pageView.merClerkOpenAddModalShow();
        pageView.checks();
        pageView.clerkInfo();
        pageView.logOpenOrOff();
    };
    //增加租户界面显示
    pageView.merClerkOpenAddModalShow=function(){
        $(".but-merClerkOpen-Add").unbind().on("click",function () {
            $("#merClerkOpenAddModal").modal("show");
        })
    }
    //选择框选择
    pageView.checks=function(){
        $(".zl-checkbox").unbind().on("click",function () {
            //console.log("-------------"+$(this).is(".checked"));
            if($(this).is(".checked")){
                $(this).removeClass("checked");
            }else{
                $(this).addClass("checked");
            }

        })
    }
    //模糊查询
    pageView.loadSearch= function loadSearch() {
        //$("#brandIdFlag" + indx).val("");
        //$(".js-search_" + indx).val("");
        var mallId = $("#mallId").val();
        //console.log("===============================================" );
        $(".payee").autocomplete({
            source: function (request, response) {
                $.ajax({
                    url: "queryBscontList.htm",
                    type: "POST",
                    dataType: "json",
                    data: {
                        contNo: request.term,
                    },
                    success: function (data) {
                        //console.log(data)
                        response($.map(data["data"], function (item) {
                            return {
                                label:item.contNo+"  品牌："+item.brandName,
                                value: item.contNo,
                                mallId:item.mallId,
                                layoutCd:item.layoutCd

                            }
                        }));
                    }
                });
            },
            minLength: 1,
            select: function (event, ui) {
                this.value = ui.item.value;
                _this = $(this);
                //console.log(ui.item);
                $("#searchCountNo").val(ui.item.value);
                $("#searchMallId").val(ui.item.mallId);
                $("#layoutCd").val(ui.item.layoutCd);
                //根据合同号查询品类
                $.ajax({
                    url: "queryBscontCategoryList.htm",
                    type: "POST",
                    dataType: "json",
                    data: {
                        contNo: ui.item.value,
                    },
                    success: function (data) {
                        //console.log(data);
                        //console.log(data["data"]);
                        var htm="";
                        $.map(data["data"],function (item) {
                            if(item.categoryCode){
                                htm=htm+'<li style="margin-bottom:5px;"><em class="zl-checkbox" categoryCode="'+item.categoryCode+'" categoryName="'+item.categoryName+'" style="vertical-align:-2px;"></em><span style="margin-left:15px;">'+item.categoryName+'</span></li>'
                            }
                        })
                        $(".categoryLi").html(htm);
                        pageView.init();
                        /*response($.map(data["data"], function (item) {
                            return {
                                label: item.contNo,
                                value: item.id
                            }
                        }));*/
                    }
                });
                //console.log("设置", ui.item.value);
                return false;
            }
        });
        /*console.log("---"+$("#brandIdFlag"+indx).val());
         if($("#brandIdFlag"+indx).val()==""){
         $(".js-search_"+indx).text("");
         }*/
    }

    //检查是否为空
    pageView.checkIsEmpty= function checkIsEmpty(_this) {
            //console.log("----------------") ;
            //console.log($(_this).closest("td").html()) ;
            //console.log($(_this).closest("td").find("input.input-val").val()) ;
            if (!$(_this).closest("div").find("input.input-val").val() || $(_this).closest("div").find("input.input-val").val() == "") {
                $(_this).closest("div").find("input.payee").val("");
            }
        }
    //点击确定添加按钮点击事件
    pageView.addButtoClick =function addButtoClick(){
        $(".js-clerk-add-button").unbind().on("click",function () {
            confirm("确认要添加吗？", "", "", function (type) {
                if (type == "dismiss") {
                    return;
                }
                if(!$(".searchCountNo").val()&&$(".searchCountNo").val()==""){
                    alert("请选择输入选择合同信息！");
                    return;
                }
                var categorys =new Array();
                if($(".zl-checkbox").length>0){
                    $(".checked").each(function () {
                        categorys.push($(this).attr("categorycode")+"#@#"+$(this).attr("categoryname"));
                    })
                    if(categorys.length==0){
                        alert("未选择品类！");
                        return;
                    }
                }

                $.ajax({
                    url: "merClerkOpenSave.htm",
                    type: "POST",
                    dataType: "json",
                    data: {
                        searchCountNo: $("#searchCountNo").val(),
                        searchMallId:$("#searchMallId").val(),
                        layoutCd:$("#layoutCd").val(),
                        categorys:categorys
                    },
                    success: function (data) {
                        //console.log("11111");
                        $(".js-search_0").val("");
                        $(".categoryLi").html("");
                        alert(data.msg);
                        pageView.generalQueryBtn(true,1);
                        $("#merClerkOpenAddModal").modal("hide");
                    }
                });
            })
        })


    }
    //注销
    pageView.logOpenOrOff =function logOpenOrOff(){
        $(".zl-logout").unbind().on("click",function () {
            var id =$(this).attr("id");
                confirm("是否确认注销，此操作不可逆！", "", "", function (type) {
                if (type == "dismiss") {
                    return;
                }

                $.ajax({
                    url: "logOpenOrOff.htm",
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
    //点击跳转到租户员工
    pageView.clerkInfo =function(){
       $(".zl-clerl-infor").unbind().on("click",function () {
           console.log("----------------"+$(this).attr("companyName"));
          //$.post(  merchantWeb_Path+ 'clerkInfo/merClerkInfoIndex.htm', {clerkOpenId:$(this).attr("clerkOpenId"),contNo:$(this).attr("contNo")});
           location.href =merchantWeb_Path+ "clerkInfo/merClerkInfoIndex.htm?clerkOpenId=" + $(this).attr("clerkOpenId")+"&contNo="+$(this).attr("contNo");
           //+"&companyName="+ $(this).attr("companyName")+"&storeNos="+$(this).attr("storeNos")
               //+ "&clerkName="+$(this).attr("clerkName")+"&bindTel="+$(this).attr("bindTel");
       })
    }

    pageView.loadingShow = function () {
        $(".zl-loading").fadeIn();
    }

    pageView.loadingHide = function () {
        $(".zl-loading").fadeOut();
    }

    //得到详情数据
    pageView.getList=function() {
        pageView.generalQueryBtn(true,1);
    }
    //查询按钮点击
    pageView.butQuery=function(){
        $(".zl-query-btn").unbind().on("click",function () {
            pageView.generalQueryBtn(true,1);
        })
    }

    //回车事件查询
    pageView.keyups=function(){
        $("#searchWord").keydown(function (event) {
            if(event.keyCode ==13){
                pageView.generalQueryBtn(true,1);
            }
        })

    }
    //分页查询
    pageView.generalQueryBtn=function generalQueryBtn(flag,page){
        if(flag){
            pageView.loadingShow();
        }
        //获取查询条件 一次提交表单
        var fm = document.getElementById("clerkAll-condition");
        var formData = new FormData(fm);
        var url = "indexInformation.htm";
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
                //console.log("111111");
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



    return pageView;
})(jQuery);

$(document).ready(function(){
    pageView.butQuery();
    pageView.addButtoClick();
    pageView.getList();
    pageView.loadingHide();
    pageView.keyups();
    pageView.init();
});





