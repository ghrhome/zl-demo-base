/**
 * Created by whobird on 2018/4/9.
 */

var pageView=(function($){
    var pageView={};
    var _renterData=[];
    pageView.search=function () {
        $("#js-dropdown-companys").ysSearchSelect({
            source:function( request, response ) {
                $.ajax( {
                    url: financeWeb_Path + 'finance/receivepaper/ibCompanylist.htm',
                    dataType: "json",
                    data: {
                        mallId: $("#js-dropdown-projects-add").children('input').val(),
                        companyName:request.term
                    },
                    success: function( data ) {
                        // if (data.length === 0) {
                        //     alert('此项目下没租户,请先添加租户或者选择别的项目');
                        //     return;
                        // }
                        response( $.map( data, function( item ) {
                            return {
                                label: item.companyName,
                                value: item.id
                            }
                        }));
                    }
                } );
            },
            callback:function(value,ui){
                $("#companyId").val(ui.item.value);
                //$('#companyName').val(ui.item.label);
                //pageView.searchUpdate();
                _searchCb(ui.item.value);
            },
        });
    }

    function _searchCb(companyId) {
        $.getJSON(financeWeb_Path + 'finance/receivepaper/contlist.htm', {companyId: companyId}, function (res) {
            $('#js-dropdown-conts').children('button').html('');
            $('#js-dropdown-conts').children('input').val('');
            if (res.length === 0) {
                alert('此租户下没合同,请先添加合同或者选择别的租户');
                return;
            }
            $('#js-dropdown-conts').find(' .dropdown-menu').children('li').remove();
            for (var i = 0; i < res.length; i++) {
                var storeNos =  res[i].storeNos;
                var brandName =  res[i].brandName;
                if(storeNos != null && storeNos != "" && storeNos != undefined){
                    storeNos = "/"+storeNos;
                }else {
                    storeNos = "/";
                }
                if(brandName != null && brandName != "" && brandName != undefined){
                    brandName = "/"+brandName;
                }else{
                    brandName = "/";
                }

                $('#js-dropdown-conts').find(' .dropdown-menu').append("<li><a title='" + res[i].contNo +storeNos+brandName+"' key='" + res[i].contNo + "' href='javascript:void(0)'>" + res[i].contNo +storeNos+brandName+"</a></li>");

            }
        });
    }

    pageView.eventInit=function(){

        var page = $("#receipt-import");

        page.on("click",'.setothers li',function (e) {
            var accountNo = $(this).children('a').attr('accountNo');
            var accountName = $(this).children('a').attr('accountName');
            $('#receiveAccountName').val(accountName);
            $('#receiveAccount').val(accountNo);
        });
        page.on("click",'.dropdown-menu li',function (e) {
            var name=$(this).children('a').html();
            var id=$(this).children('a').attr('key');
            var btn=$(this).parents(".zl-dropdown").children('button');
            btn.html(name);
            var btn1=$(this).parents(".zl-dropdown-inline").children('button');
            btn1.html(name);

            var inputText = $(this).parents(".zl-dropdown").children('input');
            inputText.val(id);
            var inputText1 = $(this).parents(".zl-dropdown-inline").children('input');
            inputText1.val(id);
            if ("null" == id){
                inputText1.val(name);
                return ;
            }
            var mallValue = inputText1.val();
            if ($(this).parents('#js-dropdown-projects-add')[0]) {

                $.getJSON(financeWeb_Path + 'finance/receivepaper/ibCompanylist.htm', {mallId: mallValue}, function (res) {
                    $('#js-dropdown-companys').children('button').html('');
                    $('#js-dropdown-companys').children('input').val('');
                    $('#js-dropdown-conts').children('button').html('');
                    $('#js-dropdown-conts').children('input').val('');
                    if (res.length === 0) {
                        alert('此项目下没租户,请先添加租户或者选择别的项目');
                        return;
                    }
                    /*$('#js-dropdown-companys').find(' .dropdown-menu').children('li').remove();
                    for (var i = 0; i < res.length; i++) {
                        $('#js-dropdown-companys').find(' .dropdown-menu').append("<li><a key='" + res[i].id + "' href='javascript:void(0)'>" + res[i].companyName + "</a></li>");
                     }*/
                });

                /*if (parseInt(oldValue) !== parseInt(newValue)) {
                    var $blockContainer = $('#block-container');
                    $blockContainer.find('.dropdown-menu').empty();
                    $blockContainer.find('input').val('');
                    $blockContainer.find('button').html('请选择');
                    var $floor = $('#floor-container');
                    $floor.find('.dropdown-menu').empty();
                    $floor.find('input').val('');
                    $floor.find('button').html('请选择');
                }*/

            }
            if ($(this).parents('#js-dropdown-companys')[0]) {
                var companyId = $("#companyId").val();
                $.getJSON(financeWeb_Path + 'finance/receivepaper/contlist.htm', {companyId: companyId}, function (res) {
                    $('#js-dropdown-conts').children('button').html('');
                    $('#js-dropdown-conts').children('input').val('');
                    if (res.length === 0) {
                        alert('此租户下没合同,请先添加合同或者选择别的租户');
                        return;
                    }
                    $('#js-dropdown-conts').find(' .dropdown-menu').children('li').remove();
                    for (var i = 0; i < res.length; i++) {
                        $('#js-dropdown-conts').find(' .dropdown-menu').append("<li><a key='" + res[i].contNo + "' href='javascript:void(0)'>" + res[i].contNo + "</a></li>");
                    }
                });
            }

            if ($(this).parents('#js-dropdown-conts')[0]) {
                var contNo = $("#contNo").val();
                $.getJSON(financeWeb_Path + 'finance/receivepaper/banklist.htm', {mallId: $("#js-dropdown-projects-add").children('input').val(),contNo:contNo}, function (res) {
                    $('#js-dropdown-banks').children('button').html('请选择');
                    $('#js-dropdown-banks').children('input').val('');
                    $('#receiveAccountName').val('');
                    $('#receiveAccount').val('');
                    if (res.length === 0) {
                        alert('此项目合同下没收款银行,请先添加收款银行或者选择别的项目合同');
                        return;
                    }
                    $('#js-dropdown-banks').find(' .dropdown-menu').children('li').remove();
                    for (var i = 0; i < res.length; i++) {
                        $('#js-dropdown-banks').find(' .dropdown-menu')/*.append("<li><a key='" + res[i].id + "' href='javascript:void(0)'>" + res[i].bankName + "</a></li>");*/
                            .append("<li><a title='" + res[i].incomeBankName+ res[i].incomeAccountNo + "' key='" + null + "'  accountNo='" + res[i].incomeAccountNo +"'  accountName='" + res[i].payeeName + "' href='javascript:void(0)'>" + res[i].incomeBankName + "</a></li>");
                        //.append("<li><a key='" + res[i].id + "'  accountNo='" + res[i].fBankAccountNumber +"'  accountName='" + res[i].orgFName + "' href='javascript:void(0)'>" + res[i].fBankAccountName + "</a></li>");
                    }
                });

            }
        });

        page.on("click",".dropdown-menu .js-search",function (e) {
            pageView.search();
        });

        page.find(".zl-datetimepicker input").datetimepicker({
            endDate:new Date(),
            language: "zh-CN",
            format:"yyyy-mm-dd",
            todayBtn:"linked",
            startView:2,
            minView:2,
            weekStart: 1,
            autoclose: 1,
            todayHighlight: 1,
            forceParse: 0,
            clearBtn:true
        });

        page.on("click",".zl-datetimepicker",function(e){
            e.stopPropagation();
            e.preventDefault();
            $(this).find("input").datetimepicker("show");
        });

        $("#receipt-import").on("click", ".zl-paginate", function (e) {
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

            $("#searchPageForm").find("input[name=page]").val(page);
            $("#searchPageForm").trigger("submit");
        });

        $("#gotoPageNum").on("blur", function (e) {
            if (!isPositiveNum($(this).val()) || parseInt($(this).val()) == 0) {
                alert("请输入合法数字！");
                return false;
            }
            if (parseInt($(this).val()) > parseInt($("#pages").val())) {
                alert("超过总页数！");
                $(this).val($("#pages").val());
                return false;
            }
        });

        $("#gotoPage").on("click", function (e) {
            if (!isPositiveNum($("#gotoPageNum").val()) || parseInt($("#gotoPageNum").val()) == 0) {
                alert("请输入合法数字！");
                return false;
            }
            $("#searchPageForm").find("input[name=page]").val($("#gotoPageNum").val());
            $("#searchPageForm").trigger("submit");
        });

        function isPositiveNum(s) {//是否为正整数
            var re = /^[0-9]*[0-9][0-9]*$/;
            return re.test(s)
        }

        $(".zl-dist-add").on("click", function () {
            $(".zl-add-collapse").slideToggle("normal");
        });

        $(".search-btn").on("click", function (e) {
            if ($("#receiveMoneyStart").val()!= '' && !isPositiveMoney($("#receiveMoneyStart").val()) ) {
                alert("请输入合法收款金额！");
                return false;
            }
            if ($("#receiveMoneyEnd").val()!= '' &&  !isPositiveMoney($("#receiveMoneyEnd").val()) ) {
                alert("请输入合法收款金额！");
                return false;
            }
            /*if ($("#receiveMoneyStart").val()!= '' && $("#receiveMoneyEnd").val()!= '' && ($("#receiveMoneyEnd").val() < $("#receiveMoneyStart").val()) ) {
                alert("最大金额应大于或等于最小金额！");
                return false;
            }*/

            $("#searchPageForm").find("input[name=page]").val(1);
            $("#searchPageForm").trigger("submit");
        });

        $(".clean-btn").on("click", function (e) {
            $("#receiveMoneyStart").val('');
            $("#receiveMoneyEnd").val('');
            $("#receiveTimeStart").val('');
            $("#receiveTimeEnd").val('');
            $("#receivePaperNo").val('');
            $("#companyName").val('');
            $('#js-dropdown-high-receiveType').children('button').html('全部');
            $('#js-dropdown-high-receiveType').children('input').val('');
            $('#js-dropdown-high-receiveAccountName').children('input').val('');
        });
        /*$("#receiveMoney").on("input",function(){
            var receiveMoney = Number($("#receiveMoney").val());
            if(receiveMoney > 1000000000000000000){
                $("#receiveMoney").val("");
                alert("输入收款金额超长!");
                return;
            }
        })*/

        $("#searchPageForm").submit(function () {
            setSearchForm();
            var self = $(this);
            self.attr("action", financeWeb_Path + "finance/receivepaper/index.htm");
        });

        /*page.on("click",".expense_verification_add",function() {
            var orderId = $(this).attr("orderId");
            window.location = financeWeb_Path + "finance/expenseVerification/expense_verification_add.htm?orderId=" + orderId ;
        });*/
        $("[name=addExpenseVerificationBtn]").on("click", function () {
                showLoading();
            var finReceivePaperId = $(this).attr("finReceivePaperId");
            var receivePaperNo = $(this).attr("receivePaperNo");
            $.ajax({
                type: "POST",
                url: financeWeb_Path + "finance/receivepaper/isAdd.htm",
                data: {id: finReceivePaperId,
                    receivePaperNo: receivePaperNo},
                success: function (resultData) {
                    if (JSON.parse(resultData).success == "true") {
                        window.location = financeWeb_Path + "finance/expenseVerification/expense_verification_add.htm?orderId=" + finReceivePaperId;
                    } else {
                        alert(JSON.parse(resultData).msg);
                    }
                }
            });

        });

        $("[name=deleteFinanceReceivePaperBtn]").on("click", function () {
            var finReceivePaperId = $(this).attr("finReceivePaperId");
            var receivePaperNo = $(this).attr("receivePaperNo");
            var companyName = $(this).attr("companyName");
            confirm("确认是否删除？", "", "", function (type) {
                if (type == "dismiss") return;
                showLoading();
                $.ajax({
                    type: "POST",
                    url: financeWeb_Path + "finance/receivepaper/isAdd.htm",
                    data: {id: finReceivePaperId,
                        receivePaperNo: receivePaperNo},
                    success: function (resultData) {
                        if (JSON.parse(resultData).success == "true") {
                            $.ajax({
                                type: "POST",
                                url: financeWeb_Path + "finance/receivepaper/delete.htm",
                                data: {id: finReceivePaperId,
                                    receivePaperNo: receivePaperNo},
                                success: function (resultData) {
                                    //if (resultData.success == true) {
                                    //window.location.reload();
                                    var url = financeWeb_Path + "/finance/receivepaper/index.htm";
                                    //setSearchForm();
                                    $("#searchPageForm").attr("action", url).submit();
                                    //}else{
                                    //    hideLoading();
                                    //    alert("不允许删除");
                                    // }
                                }
                            });
                        } else {
                            alert(JSON.parse(resultData).msg);
                        }
                    }
                });
            });
        });

        $("#js-addnew-save").on("click", function (e) {
            var isChecked = checkForm($('#addFinanceReceiveForm'));
            if (isChecked) {
                //$(this).hide();
                pageView.loadingShow();
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    data: $("#addFinanceReceiveForm").serialize(),
                    url: financeWeb_Path + "/finance/receivepaper/add.htm",
                    success: function (resultData) {
                        pageView.loadingHide();
                        if (resultData.success == true) {
                            alert("保存成功","","",function(){
                                var url = financeWeb_Path + "/finance/receivepaper/index.htm";
                                setSearchForm();
                                $("#searchPageForm").attr("action", url).submit();
                            })
                        }else{
                            alert(resultData.msg);
                        }
                    }
                });
            }

        });

    };
    pageView.swiperInit=function(){

        var ys_main_swiper;
        ys_main_swiper = new Swiper('#js-swiper-main-table', {
            scrollbar: '.swiper-scrollbar-a',
            direction: 'horizontal',
            slidesPerView: 'auto',
            //mousewheelControl: true,
            freeMode: true,
            scrollbarHide:false,
            grabCursor:true,
            scrollbarDraggable : true ,
            preventClicksPropagation:false
        });


        $(".zl-table-wrapper-swiper").on("mouseenter","tbody tr",function(e){
            var _index=$(this).index();

            $(".zl-table-static").find("tbody tr").eq(_index).addClass('hover');
            $(".swiper-container").find("tbody tr").eq(_index).addClass('hover');

        });

        $(".zl-table-wrapper-swiper").on("mouseleave","tbody tr",function(e){
            var _index=$(this).index();

            $(".zl-table-static").find("tbody tr").eq(_index).removeClass('hover');
            $(".swiper-container").find("tbody tr").eq(_index).removeClass('hover');
        });
    };

    pageView.dateRangeInit=function(){
        var _startTimestamp=0,_endTimestamp=0;
        var dateStart=$("#js-date-range").find("input.js-date-start").datetimepicker({
            format:"yyyy-mm-dd",
            todayBtn:"linked",
            startView:2,
            minView:2,
            autoclose: true,
            language:"zh-CN",
        }).on('changeDate', function(e){

            var _startDate=$(this).val();
            _startTimestamp=e.timeStamp;
            if(_startDate){
                dateEnd.datetimepicker("setStartDate",_startDate);
            }else{
                dateEnd.datetimepicker("setStartDate",null);
            }
            if(_endTimestamp<_startTimestamp){
                dateEnd.val("");
            }
            dateEnd.datetimepicker("update");
        });

        var dateEnd=$("#js-date-range").find("input.js-date-end").datetimepicker({
            format:"yyyy-mm-dd",
            todayBtn:"linked",
            startView:2,
            minView:2,
            autoclose: true,
            language:"zh-CN",
        }).on('changeDate', function(e){
            _endTimestamp=e.timeStamp;
        });

    };

    pageView.init=function(){
        $("#preloader").fadeOut("fast");
        pageView.dateRangeInit();
        pageView.eventInit();
        pageView.swiperInit();
        pageView.search();
    };

    pageView.loadingShow=function(){
        $(".zl-loading").fadeIn();
    };

    pageView.loadingHide=function(){
        $(".zl-loading").fadeOut();
    }

    return pageView;

})(jQuery);


$(document).ready(function(){
    pageView.init();
    confirmAlert.init();
});

function showLoading(){
    if($(".zl-loader").length==0){
        $("body").append("<div class='zl-loader'></div>");
    }
    $(".zl-loader").show();
}

function searchMall(_this) {
    $("#searchPageForm").find("input[name=mallId]").val($(_this).attr("key"));
    $("#searchPageForm").find("input[name=page]").val(1);
    $("#searchPageForm").trigger("submit");
}

function searchReceiveSatus(_this) {
    $("#searchPageForm").find("input[name=receiveSatus]").val($(_this).attr("key"));
    $("#searchPageForm").find("input[name=page]").val(1);
    $("#searchPageForm").trigger("submit");
}

function setSearchForm(){
    var searchWord = $("#searchPageForm").find("input[name=searchWord]").val();
    // var mallId = $("#mallId").val();
    //var receiveSatus = $("#receiveSatus").val();
    var rightTime = $("#rightTime").val();
    var receiveMoneyStart = $("#receiveMoneyStart").val();
    var receiveMoneyEnd = $("#receiveMoneyEnd").val();
    var receiveTimeStart = $("#receiveTimeStart").val();
    var receiveTimeEnd = $("#receiveTimeEnd").val();

    $("#searchPageForm").find("input[name=searchWordNoEncode]").val(encodeURI(searchWord));
    //$("#searchPageForm").find("input[name=mallIdEncode]").val(encodeURI(mallId));
    //$("#searchPageForm").find("input[name=receiveSatusEncode]").val(encodeURI(receiveSatus));
    $("#searchPageForm").find("input[name=rightTimeEncode]").val(rightTime);
    $("#searchPageForm").find("input[name=receiveMoneyStartEncode]").val(receiveMoneyStart);
    $("#searchPageForm").find("input[name=receiveMoneyEndEncode]").val(receiveMoneyEnd);
    $("#searchPageForm").find("input[name=receiveTimeStartEncode]").val(receiveTimeStart);
    $("#searchPageForm").find("input[name=receiveTimeEndEncode]").val(receiveTimeEnd);
}

function isPositiveMoney(s) {//是否为正整数
    //var re = /^(([1-9][0-9]*\.[0-9][0-9]*)|([0]\.[0-9][0-9]*)|([1-9][0-9]*)|([0]{1}))*$/;
    var re = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
    return re.test(s)
}

function checkForm(_this) {
    var isChecked = true;
    var mallId =$("#addFinanceReceiveForm").find("input[name=mallId]").val();
    if(mallId== ''){
        alert("请选择项目！");
        return false;
    }
    var companyId =$("#addFinanceReceiveForm").find("input[name=companyId]").val();
    if(companyId== ''){
        alert("请选择租户！");
        return false;
    }
    var contNo =$("#addFinanceReceiveForm").find("input[name=contNo]").val();
    if(contNo== ''){
        alert("请选择合同编号！");
        return false;
    }
    var receiveTime =$("#addFinanceReceiveForm").find("input[name=receiveTime]").val();
    if(receiveTime== ''){
        alert("请选择收款日期！");
        return false;
    }
    var receiveType =$("#addFinanceReceiveForm").find("input[name=receiveType]").val();
    if(receiveType== ''){
        alert("请选择收款方式！");
        return false;
    }
    var receiveMoney = $("#receiveMoney").val();
    if (!isPositiveMoney(receiveMoney) || receiveMoney== '' ) {
        alert("请输入合法收款金额！");
        return false;
    }
    var receiveAccount = $("#receiveAccount").val();
    if(receiveAccount==''){
        alert("请选择收款银行！");
        return false;
    }
    return isChecked;
}


$("#daoru").click(function () {
    $("<input type='file' name='file' style='display: none'/>").appendTo("body").change(function () {
        var formData = new FormData();
        formData.append('file', $(this).get(0).files[0]);
        pageView.loadingShow();
        $.ajax({
            url: financeWeb_Path+'/finance/receivepaper/upload-excel.htm',
            type: 'POST',
            dataType: "json",
            cache: false,
            data: formData,
            processData: false,
            contentType: false
        }).done(function (response) {
            pageView.loadingHide();
            if (response.success) {
                alert("导入成功！");
                // var url = "/" + response.data.path;
                // $("p#files").append("<a href='" + url + "' target='_blank'>" + url + "</a><br/>");
            } else {
                alert(response.message);
            }
        });
    }).trigger("click");
})

$("#daoru-save").click( function () {
    $('.import-dialog').modal("hide");
    var url = financeWeb_Path + "/finance/receivepaper/index.htm";
    setSearchForm();
    $("#searchPageForm").attr("action", url).submit();
})

/*
$("#daoru").click(function () {
        $('.import-dialog').modal("hide");
        var formData = new FormData();
        formData.append('file', $("#uploadFile").get(0).files[0]);
        $.ajax({
            url: financeWeb_Path+'/finance/receivepaper/upload-excel.htm',
            type: 'POST',
            dataType: "json",
            cache: false,
            data: formData,
            processData: false,
            contentType: false
        }).done(function (response) {
            if (response.success) {
                alert("导入成功！");
                var url = financeWeb_Path + "/finance/receivepaper/index.htm";
                setSearchForm();
                $("#searchPageForm").attr("action", url).submit();
                // var url = "/" + response.data.path;
                // $("p#files").append("<a href='" + url + "' target='_blank'>" + url + "</a><br/>");
            } else {
                alert(response.message);
            }
        });
})*/
