/**
 * Created by whobird on 2018/4/16.
 */
var openDate;
var shopData;
var change = false;
var divs = ['rent-div', 'management-div', 'operate-div', 'rent-free-period-div', 'decoration-div', 'promotion-div'];
var tables = ['zl-fixed-rent-table', 'zl-deduct-rent-table', 'zl-both-rent-table', 'zl-fixed-management-table', 'zl-turnover-period-year-marketing-table'];
var allTables = ['zl-fixed-operate-table','zl-rent-free-period-table','zl-fixed-decoration-table','zl-fixed-promotion-table'].concat(tables);
var trs = ['zl-deco-free-tr', 'zl-turnover-period-tr','zl-turnover-period-year-tr', 'zl-deduct-management-tr', 'zl-both-management-tr'];
var decorateIsHave = ["#zl-StartDate-has-tr", "#zl-turnover-period-tr", "#yx_decorate_oeriod", ".decoratePeriodIsFree", "#zl-deco-free-tr"];
var pageView=(function($){

    var pageView={};

    //$(".zl-select-reform").selectize();

    pageView.loadingShow=function(){
        $(".zl-loading").fadeIn();
    };

    pageView.loadingHide=function(){
        $(".zl-loading").fadeOut();
    }

    pageView.eventInit=function(){

        //发起审批
        /*$("#js-submit").on("click",function(e){
            $(".zl-loading").fadeIn();
            e.preventDefault();
            //$(".zl-loading").fadeIn();
            var billId = $("#billId").val();
            if (billId == null || billId == "") {
                $(".zl-loading").fadeOut();  // 隐藏 loading
                alert("该网批未包含关键数据！");
            } else {
                $.ajax({
                    cache: false,
                    dataType: "json",
                    type: "POST",
                    url: netcommentWeb_Path + "netcomment/busicond/submitNetComment.htm",
                    data: {billId:billId},
                    async:true,
                    error: function (request) {
                        alert("系统异常!");
                        $(".zl-loading").fadeOut();  // 隐藏 loading
                    },
                    success: function (resultData) {
                        if (resultData.success) {
                            // formPost(netcommentWeb_Path + "/netcomment/busicond/index.htm", {billType:"01"});
                            alert("发起审批成功!");
                        } else {
                            alert("发起审批失败!");
                            $(".zl-loading").fadeOut();  // 隐藏 loading
                        }
                        $(".zl-loading").fadeOut();  // 隐藏 loading
                        // K2审批添加
                        var areaCode = "G001Z003";
                        var netcommentId=$("#masterId").val();
                        pageCommon.submitNetComment("inamp-businesscondition-" + areaCode, netcommentId, netcommentWeb_Path + "/netcomment/busicond/index.htm");
                    }
                });
            }
        });*/

    }


  /*  pageView.setSwiper=function(id){
        var id=id;
        var ys_main_swiper = new Swiper(id, {
            scrollbar: '.swiper-scrollbar-a',
            direction: 'horizontal',
            slidesPerView: 'auto',
            //mousewheelControl: true,
            freeMode: true,
            scrollbarHide:false,
            preventClicksPropagation:false
        });
    }*/

    pageView.swiperInit=function(){
        new Swiper('.swiper-container', {
            scrollbar: '.swiper-scrollbar-a',
            direction: 'horizontal',
            slidesPerView: 'auto',
            //mousewheelControl: true,
            freeMode: true,
            scrollbarHide:false,
            preventClicksPropagation:false,
            observer:true,
            observeParents:true
        });
    }

    pageView.dateRangeInit=function(){
        var _startTimestamp=0,_endTimestamp=0;
        var dateStart=$("#rental-term-add").find("input.js-date-start").datetimepicker({
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
            /*if(_endTimestamp<_startTimestamp){
                dateEnd.val("");
            }*/
            dateEnd.datetimepicker("update");
        });

        var dateEnd=$("#rental-term-add").find("input.js-date-end").datetimepicker({
            format:"yyyy-mm-dd",
            todayBtn:"linked",
            startView:2,
            minView:2,
            autoclose: true,
            language:"zh-CN",
        }).on('changeDate', function(e){
            _endTimestamp=e.timeStamp;
        });
    }

    pageView.init=function(){
        $("#preloader").fadeOut("fast");
        pageView.eventInit();
        pageView.dateRangeInit();
        pageView.swiperInit();

        //$(".zl-dropdown-inline").ysdropdown("init");

    };

    return pageView;

})(jQuery);

$(document).ready(function(){
    initDiv([]);
    pageView.init();

    var mallId = $("#mallId").val();
    var contractBtn = $("#js-create-contract");

    //如果不是 嵌入到K2中的页面 则需要做合同模板初始化
    if (contractBtn.length > 0) {
        console.log("新建合同按钮");
        //合同模板类型 动态加载
        $.ajax({
            cache: true,
            type: "POST",
            dataType: "json",
            data: {mallId: mallId,contractTypeId:1},
            url: netcommentWeb_Path + "netcomment/getTemplateByMallIdAndType.htm",
            async: true,
            error: function (request) {
                alert("系统异常");
            },
            success: function (resultData) {
                if(resultData.data && resultData.data.length>0){
                    $("select[name=contractCategory]").html("");
                    var optionHtml = "";
                    for(var i = 0 ; i < resultData.data.length ; i++ ){
                        var temp = resultData.data[i];
                        var key = temp.id;
                        var value = temp.name;
                        console.log(key);
                        console.log(value);
                        optionHtml += "<option value='"+ key +"'>"+ value +"</option>";
                    }
                    $("select[name=contractCategory]").append(optionHtml);
                }
            }
        });
    }

});


function feeTablesReset() {
    for(var i = 0 ; i < allTables.length; i++){
        var selector = "#" + allTables[i] + " tbody";
        $(selector).empty();
    }
}

/**
 * 格式化日期 "yyyy-MM-dd"
 *
 * @param datetime_result
 * @returns {String}
 */
function unix_to_date(date) {
    var day2 = new Date(date);
    return day2.getFullYear() + "-"
        + ((day2.getMonth() > 8) ? (day2.getMonth() + 1) : "0" + (day2.getMonth() + 1))
        + "-" + ((day2.getDate() > 9) ? day2.getDate() : "0" + day2.getDate());
}

/**
 * 新建租赁合同弹窗
 */
function createContractModal() {
    $("#addContractModel").modal("show");
}

function createContract() {
    pageView.loadingShow();
    //商铺ID 名字看着像NO其实存的是ID
    var storeIds = $("#storeNos").val();
    $.ajax({
        cache: false,
        type: "POST",
        dataType: "json",
        url: netcommentWeb_Path + "netcomment/busicond/toCreateContract.htm",
        data:{billId : $("#billId").val(),
            contractCategory : $("select[name=contractCategory]").val(),
            storeIds:storeIds},
        async: false,
        error: function (request) {
            alert("系统异常");
            pageView.loadingHide();
        },
        success: function (resultData) {
            if (typeof resultData != 'undefined') {
                if (resultData.success == true) {
                    window.location.href = contract_Path + "/contract/detail.htm?contractNo=" + resultData.msg;
                    pageView.loadingHide();
                } else {
                    alert(resultData.msg);
                    pageView.loadingHide();
                }
            }
        }
    });
}


function registerTimePicker(panel) {
    $(panel).find(".zl-datetimepicker input").datetimepicker({
        language: 'zh-CN',
        format: "yyyy-mm-dd",
        todayBtn: "linked",
        startView: 2,
        minView: 2,
        weekStart: 1,
        autoclose: 1,
        todayHighlight: 1,
        forceParse: 0
    }).attr("readonly", "readonly");
}

function registerDateRange(panel){
    var _startTimestamp=0,_endTimestamp=0;
    $(panel).find("input.js-date-start").datetimepicker({
        format:"yyyy-mm-dd",
        todayBtn:"linked",
        startView:2,
        minView:2,
        autoclose: true,
        language:"zh-CN",
    }).on('changeDate', function(e){

        //var _startDate=$(this).val();
        _startTimestamp=e.timeStamp;
        /*if(_startDate){
            dateEnd.datetimepicker("setStartDate",_startDate);
        }else{
            dateEnd.datetimepicker("setStartDate",null);
        }
        /!*if(_endTimestamp<_startTimestamp){
         dateEnd.val("");
         }*!/
        dateEnd.datetimepicker("update");*/
    });

    var dateEnd=$(panel).find("input.js-date-end").datetimepicker({
        format:"yyyy-mm-dd",
        todayBtn:"linked",
        startView:2,
        minView:2,
        autoclose: true,
        language:"zh-CN",
    }).on('changeDate', function(e){
        _endTimestamp=e.timeStamp;
    });
}

function displayDivs(indexArr) {
    if (!indexArr || indexArr == "") {
        return false;
    }
    for (var i = 0; i < divs.length; i++) {
        $("#" + divs[i]).find("input,select,textarea").attr("disabled", "disabled");
        $("#" + divs[i]).hide();
    }

    if (typeof indexArr == "string") {
        indexArr = indexArr.split(",");
    }
    console.log(indexArr);
    for (var i = 0; i < divs.length; i++) {
        for (var j = 0; j < indexArr.length; j++) {
            if (i == indexArr[j]) {
                $("#" + divs[i]).find("input,select,textarea").removeAttr("disabled");
                $("#" + divs[i]).show();
                if (j == 0 || j == 1) {
                    dealChooseType();
                }
            }
        }
    }
}


//物管费单价  日单价和月单价切换
function reComputerManager () {
    var selector = "#zl-fixed-management-tr table";
    var thTr = $(selector).find("tr").eq(0);
    var managementUnitType = $("#management-div :radio[name$=unitType]:checked:enabled").val();
    if (managementUnitType == 'd') {
        var re = new RegExp("月", "g");
        var str  = $(thTr).find("th").eq(1).html().replace(re, "日");
        $(thTr).find("th").eq(1).html(str);

        str  = $(thTr).find("th").eq(2).html().replace(re, "日");
        $(thTr).find("th").eq(2).html(str);
    } else {
        var re = new RegExp("日", "g");
        var str  = $(thTr).find("th").eq(1).html().replace(re, "月");
        $(thTr).find("th").eq(1).html(str);

        str  = $(thTr).find("th").eq(2).html().replace(re, "月");
        $(thTr).find("th").eq(2).html(str);
    }

    $("#zl-fixed-management-tr tbody").find("tr").each(function(){
        //每一行tr中的 第二个td中的input元素
        calcFixedTable($(this).find("td").eq(1).find("input"), "02");
    });
}

//物管费单价  日单价和月单价切换
function reComputerRent () {
    var selector = "#js-rental-table-wrapper .swiper-container table";
    var thTr = $(selector).find("tr").eq(0);
    var rentUnitType = $("#rent-table :radio[name$=unitType]:checked:enabled").val();
    if (rentUnitType == 'd') {
        var re = new RegExp("月", "g");
        var str  = $(thTr).find("th").eq(1).html().replace(re, "天");
        $(thTr).find("th").eq(1).html(str);

        str  = $(thTr).find("th").eq(2).html().replace(re, "天");
        $(thTr).find("th").eq(2).html(str);
    } else {
        var re = new RegExp("天", "g");
        var str  = $(thTr).find("th").eq(1).html().replace(re, "月");
        $(thTr).find("th").eq(1).html(str);

        str  = $(thTr).find("th").eq(2).html().replace(re, "月");
        $(thTr).find("th").eq(2).html(str);
    }

    $("#js-rental-table-wrapper .swiper-container tbody").find("tr").each(function(){
        //每一行tr中的 第二个td中的input元素
        calcFixedTable($(this).find("td").eq(2).find("input"), "01");
    });
}

function calcPackagePrice(store, confirmDate) {

    if (!packageCheck(store, confirmDate)) {
        return false;
    }

    var contractBeginDate = $("#contractBeginDate").val();
    var contractEndDate = $("#contractEndDate").val();
    //var rentInfoList = store.bsStoreRentinfoList;

    var contractArr = [];

    var tmpDate = contractBeginDate;
    var yearIndex = 1;
    while (tmpDate <= contractEndDate) {
        var contractObj = {};

        contractObj.start = tmpDate;

        var end = new Date(tmpDate);
        end = new Date(end.setFullYear(end.getFullYear() + 1));
        tmpDate = unix_to_date(end);

        end = end.setDate(end.getDate() - 1);
        end = unix_to_date(end);
        if (end > contractEndDate) {
            end = contractEndDate;
        }

        contractObj.end = end;
        contractObj.year = yearIndex++;

        //console.log(contractObj.start);
        //console.log(contractObj.end);

        contractArr.push(contractObj);
    }

    //求租金包与合同年的交集，计算求全平均租金
    var contractIndex = 0;
    // for (var i = 0; i < rentInfoList.length; i++) {
    for (var i = 0; i < contractArr.length; i++) {

        //var rentInfo = rentInfoList[i] || {};

        var contractObj = contractArr[contractIndex];
        var contractStart = contractObj.start;
        var contractEnd = contractObj.end;

        //var packageYearStart = rentInfo.start;
        //var packageYearEnd = rentInfo.end;

        contractIndex++;

        contractObj.rentStandard = 0;//rentInfo.rentPrice || 0;
        contractObj.managementStandard = 0;// rentInfo.propertyManaPrice || 0;
        contractObj.operateStandard = 0;// rentInfo.bussOperaPrice || 0;
        contractObj.freeStandard = 0;//rentInfo.freePeriod || 0;
        contractObj.decorationStandard = 0;//rentInfo.decorationPrice || 0;
        contractObj.promotionStandard = 0;//rentInfo.marketingPrice || 0;
    }

    store.contractArr = contractArr;
    //console.log(contractArr);
    return true;
}

function packageCheck(store, confirmDate) {
    //var rentInfoList = store.bsStoreRentinfoList;
    /*if (!rentInfoList || rentInfoList.length == 0) {
        alert("铺位：" + store.storeNo + "未设置租金包！");
        $("#contractBeginDate").val("");
        $("#contractEndDate").val("");
        return false;
    }*/

    //var packageYear = rentInfoList.length;

    //租金包对应的开始结束时间
    var packageStart;
    var packageEnd;

    //计算租金包中每年的开始结束时间
    /*for (var i = 0; i < packageYear; i++) {
        var rentYearStart = new Date(confirmDate);
        rentYearStart = new Date(rentYearStart.setFullYear(rentYearStart.getFullYear() + i));
        rentYearStart = unix_to_date(rentYearStart);

        var rentYearEnd = new Date(confirmDate);
        rentYearEnd = new Date(rentYearEnd.setFullYear(rentYearEnd.getFullYear() + i + 1));
        rentYearEnd = rentYearEnd.setDate(rentYearEnd.getDate() - 1);
        rentYearEnd = unix_to_date(rentYearEnd);

        if (i == 0) {
            packageStart = rentYearStart;
        }

        if (i == (packageYear - 1)) {
            packageEnd = rentYearEnd;
        }

        rentInfoList[i].start = rentYearStart;
        rentInfoList[i].end = rentYearEnd;

        console.log(rentYearStart);
        console.log(rentYearEnd);
    }*/

    var contractBeginDate = $("#contractBeginDate").val();
    var contractEndDate = $("#contractEndDate").val();

    return true;
}

$("#companyName").on("click", function (e) {
    if (!$("#mallId").val()) {
        return false;
    }
    $("#companyName").ysBisShopTypeSelect({change: change, multipleSelect: false}, shopData);
});

$("input[name=decoratePeriodIsFree],input[name$=programme]").on("change", function () {
    dealChooseType();
});

$("#management-div input[name$=unitType]").on("change", function () {
    reComputerManager();
});

$("input[name=taxType],input[name=squareType]").on("change", function () {
    reComputerManager();
    reComputerRent();
});

$("#rent-table input[name$=unitType]").on("change", function () {
    reComputerRent();
});

/**
 * 合同开始日期
 */
$('#contractBeginDate').datetimepicker().on('changeDate', function (ev) {
    var contractBeginDate = $("#contractBeginDate").val();
    var contractEndDate = $("#contractEndDate").val();

    if (null != contractBeginDate && "" != contractBeginDate && null != contractEndDate && "" != contractEndDate) {
        if (contractEndDate < contractBeginDate) {
            alert("开始日期不能大于结束日期！");
            $(this).val("");
            feeTablesReset();
        } else {
            var billId = $("#billId").val();
            if(!(billId==null||billId==undefined||billId=="")){
                feeTablesReset();
            }
            setTables(contractBeginDate, contractEndDate);
            console.log("===========通知租金生成表单===============");
            $("body").trigger("timeRangeChange",[contractBeginDate,contractEndDate]);
        }
    }

    //直接将交付时间赋值给合同开始时间
    $('#releasedDate').val(contractBeginDate);
    //所有首期交付日期赋值
    $("input[name$=firstReleasedDate]").val(contractBeginDate);
});

/**
 * 合同结束日期
 */
$('#contractEndDate').datetimepicker().on('changeDate', function (ev) {
    var contractBeginDate = $("#contractBeginDate").val();
    var contractEndDate = $("#contractEndDate").val();
    if (null != contractBeginDate && "" != contractBeginDate && null != contractEndDate && "" != contractEndDate) {
        if (contractEndDate < contractBeginDate) {
            alert("合同结束日期不能小于合同开始日期！");
            $(this).val("");
            feeTablesReset();
        } else {
            var billId = $("#billId").val();
            if(!(billId==null||billId==undefined||billId=="")){
                feeTablesReset();
            }
            // 设置租期时长
            setTables(contractBeginDate, contractEndDate);
            $("body").trigger("timeRangeChange",[contractBeginDate,contractEndDate]);
        }
    }
});

/**
 * 装修期免租开始日期
 */
$('#decorationFreeStartDate').datetimepicker().on('changeDate', function (ev) {
    var decorationFreeStartDate = $("#decorationFreeStartDate").val();
    var decorationFreeEndDate = $("#decorationFreeEndDate").val();

    if (null != decorationFreeStartDate && "" != decorationFreeStartDate && null != decorationFreeEndDate && "" != decorationFreeEndDate) {
        if (decorationFreeEndDate < decorationFreeStartDate) {
            alert("装修期免租开始日期不能大于结束日期！");
            $(this).val("");
        } else {
            // 设置装修免租期
            var days = getFreeDays(decorationFreeStartDate, decorationFreeEndDate);
            $("#decorationFreePeriod").val(days);
            console.log(days);
        }
    }

});

/**
 * 装修期免租结束日期
 */
$('#decorationFreeEndDate').datetimepicker().on('changeDate', function (ev) {
    var decorationFreeStartDate = $("#decorationFreeStartDate").val();
    var decorationFreeEndDate = $("#decorationFreeEndDate").val();

    if (null != decorationFreeStartDate && "" != decorationFreeStartDate && null != decorationFreeEndDate && "" != decorationFreeEndDate) {
        if (decorationFreeEndDate < decorationFreeStartDate) {
            alert("装修期免租期结束日期不能小于开始日期！");
            $(this).val("");
        } else {
            // 设置装修免租期
            var days = getFreeDays(decorationFreeStartDate, decorationFreeEndDate);
            $("#decorationFreePeriod").val(days);
            console.log(days);
        }
    }
});


/**
 * 装修开始日期
 */
$('#decorateStartDate').datetimepicker().on('changeDate', function (ev) {
    var decorateStartDate = $("#decorateStartDate").val();
    var decorateEndDate = $("#decorateEndDate").val();

    if (null != decorateStartDate && "" != decorateStartDate && null != decorateEndDate && "" != decorateEndDate) {
        if (decorateEndDate < decorateStartDate) {
            alert("装修进场日不能大于结束日！");
            $(this).val("");
            $("#decoratePeriod").val("");
        } else {
            // 设置租期时长
            setDecoratePeriod(decorateStartDate, decorateEndDate);
        }
    }

});

/**
 * 装修结束日期
 */
$('#decorateEndDate').datetimepicker().on('changeDate', function (ev) {
    var decorateStartDate = $("#decorateStartDate").val();
    var decorateEndDate = $("#decorateEndDate").val();

    if (null != decorateStartDate && "" != decorateStartDate && null != decorateEndDate && "" != decorateEndDate) {
        if (decorateEndDate < decorateStartDate) {
            alert("装修结束日不能小于开始日！");
            $(this).val("");
            $("#decoratePeriod").val("");
        } else {
            // 设置租期时长
            setDecoratePeriod(decorateStartDate, decorateEndDate);
        }
    }
});

/**
 * 显示租期
 *
 * @param beginDate
 * @param endDate
 */
function setTables(beginDate, endDate) {
    var Month1, Month2, iYears = 0, iMonths = 0, iDays = 0;
    try {
        Month1 = parseInt(beginDate.split("-")[0], 10) * 12 + parseInt(beginDate.split("-")[1], 10);
        Month2 = parseInt(endDate.split("-")[0], 10) * 12 + parseInt(endDate.split("-")[1], 10);
        var day1 = parseInt(beginDate.split("-")[2], 10);
        var day2 = parseInt(endDate.split("-")[2], 10);

        //特殊处理, 开始日期为 1号，结束日期为当月最后一天时
        if (day1 == 1) {
            var endDateMonthDay = new Date(endDate.split("-")[0], endDate.split("-")[1], 0).getDate();
            if (day2 == endDateMonthDay) {
                day2 = 0;
                Month2 = Month2 + 1;
            }
        }

        iMonths = Month2 - Month1;
        iDays = day2 - day1 + 1;
        if (iDays < 0) {
            iMonths -= 1;
            iDays += 30;
        }
        iYears = parseInt(iMonths / 12);
        iMonths = parseInt(iMonths % 12);
        if (isNaN(iYears)) {
            iYears = 0;
        }
        if (isNaN(iMonths)) {
            iMonths = 0;
        }
        if (isNaN(iDays)) {
            iDays = 0;
        }
        // 显示的值
        $("#tenancy").val(iYears + "年" + iMonths + "个月" + iDays + "天");

        //填写表单
        storeSelectorCallBack();
    }
    catch (e) {
        console.log(e);
    }
}

/**
 * 设置两个时间的区间
 *
 * @param beginDate
 * @param endDate
 */
function getFreeDays(beginDate, endDate) {
    try {
        var freeDate = parseInt((new Date(endDate).getTime()-new Date(beginDate).getTime())/1000/60/60/24) + 1;
        return freeDate;
    }
    catch (e) {
        console.log(e);
        return 0;
    }
}

function setDecoratePeriod (beginDate, endDate) {
    var Month1, Month2, iYears = 0, iMonths = 0, iDays = 0;
    try {
        Month1 = parseInt(beginDate.split("-")[0], 10) * 12 + parseInt(beginDate.split("-")[1], 10);
        Month2 = parseInt(endDate.split("-")[0], 10) * 12 + parseInt(endDate.split("-")[1], 10);
        var day1 = parseInt(beginDate.split("-")[2], 10);
        var day2 = parseInt(endDate.split("-")[2], 10);

        //特殊处理, 开始日期为 1号，结束日期为当月最后一天时
        if (day1 == 1) {
            var endDateMonthDay = new Date(endDate.split("-")[0], endDate.split("-")[1], 0).getDate();
            if (day2 == endDateMonthDay) {
                day2 = 0;
                Month2 = Month2 + 1;
            }
        }

        iMonths = Month2 - Month1;
        iDays = day2 - day1 + 1;
        if (iDays < 0) {
            iMonths -= 1;
            iDays += 30;
        }
        iYears = parseInt(iMonths / 12);
        iMonths = parseInt(iMonths % 12);
        if (isNaN(iYears)) {
            iYears = 0;
        }
        if (isNaN(iMonths)) {
            iMonths = 0;
        }
        if (isNaN(iDays)) {
            iDays = 0;
        }
        // 显示的值
        $("#decoratePeriod").val(iYears + "年" + iMonths + "个月" + iDays + "天");
    }
    catch (e) {
        console.log(e);
    }
}

function initDiv(indexArr) {
    displayDivs(indexArr);
    dealChooseIsHave();
    dealChooseType();
}

function dealChooseType () {
    for (var i = 0; i < trs.length; i++) {
        $("#" + trs[i]).hide();
    }
    var rentalDecoFreeType = $(":radio[name=decoratePeriodIsFree]:checked").val();
    var decorateIsHaveInt = $(":radio[name=decorateIsHave]:checked").val();
    var turnoverType = $(":radio[name$=programme]:checked").val();
    if (rentalDecoFreeType) {
        var index = parseInt(rentalDecoFreeType);
        if (index == 1 && decorateIsHaveInt == 1) {
            $("#" + trs[0]).show();
            //注册时间空间和下拉列表
            $(".zl-dropdown-inline").ysdropdown("init");
        }
    }
    if (turnoverType) {
        var index = parseInt(turnoverType) + 1;
        $("#" + trs[index]).show();
    }

    //物管只有固定 所以仅仅显示一个
    //$("#" + trs[3]).find("input,select,textarea").removeAttr("disabled");
    //$("#" + trs[3]).show();

}

function dealChooseIsHave() {
    var decorateIsHaveInt = $(":radio[name=decorateIsHave]:checked").val();
    if (decorateIsHaveInt) {
        var index = parseInt(decorateIsHaveInt);
        if (index == 1) {
            for(var i = 0; i < decorateIsHave.length; i++){
                $(decorateIsHave[i]).show();
            }
            $(".decorateFill").hide();
            //注册时间空间和下拉列表
            $(".zl-dropdown-inline").ysdropdown("init");
        } else {
            for (var i = 0; i < decorateIsHave.length; i++) {
                $(decorateIsHave[i]).find("input,select,textarea").attr("disabled", "disabled");
                $(decorateIsHave[i]).hide();
            }
            $(".decorateFill").show();
        }
    }

}


/**
 * 主要是编辑话画面 初始化 商铺信息
 *
 * @param beginDate
 * @param endDate
 */
function initStoreInfo () {

}

function setDropdownToInput (obj) {
    console.log(111111111);
    //jQuery(obj).closest("input[type=hidden]").val(obj.attr("data-value"));
}

/**
 * 表单必输校验
 * @returns {boolean}
 */
function checkNetForm() {
    //必输项校验
    var isChecked = true;
    $('#billForm').find(".required:visible").each(function () {
        var title = $(this).attr("title") || "必填项";
        var _this;
        if ($(this).find("select").length > 0) {
            _this = $(this).find("select");
        } else if ($(this).find("input[type!='hidden'][type='radio']").length > 0) {
            _this = $($(this).find("input[type='radio']:checked"));
        } else if ($(this).find("input[type!='hidden']").length > 0) {
            _this = $(this).find("input[type!='hidden']");
        } else if ($(this).find("textarea").length > 0) {
            _this = $($(this).find("textarea"));
        } else {
            _this = $(this).find("input[type!='hidden']");
        }

        if ((_this.val() == "" || _this.val() == undefined) && _this.attr("name").indexOf("bootstrapDropdown") == -1) {
            var msg = title + "不能为空!";
            alert(msg);
            isChecked = false;
            _this.focus();
            return false;
        }

        //画面中的 下拉选择 必填项判断
        if ($(this).find(".zl-dropdown-btn").length > 0) {
            _this = $(this).find(".zl-dropdown-btn");
        }

        if (_this.html() == "" || _this.html() == undefined || _this.html().indexOf("请选择") > 0) {
            var msg = title + "不能为空!";
            alert(msg);
            isChecked = false;
            _this.focus();
            return false;
        }

    });

    //金额非负验证
    $('#billForm').find("input[type='number']:visible").each(function () {
        var title = $(this).attr("title") || "金额";
        var _this = $(this);
        if (parseFloat(_this.val()) < 0 && _this.attr('negative')!='true') {
            alert(title + "不能小于0");
            isChecked = false;
            _this.focus();
            return false;
        }
    });

    if (isChecked == true && typeof(checkNetBillForm) == "function") {
        if (checkNetBillForm() != true) {
            return false;
        }
    }
    return isChecked;
}

function formPost(url, params,target){
    var temp = document.createElement("form");
    temp.enctype = "multipart/form-data";
    temp.action = url;
    temp.method = "post";
    temp.style.display = "none";

    if(target){
        temp.target = target;
    }else{
        $(".zl-loading").fadeIn();
    }

    for (var x in params) {
        var opt = document.createElement("input");
        opt.name = x;
        opt.value = params[x];
        temp.appendChild(opt);
    }
    document.body.appendChild(temp);

    temp.submit();
}

function populateRentFree(contracts) {
    //免租期
    var selector = "#zl-rent-free-period-table tbody";
    $(selector).html("");
    var html = "";
    var sortIndex = 0;
    for (var i = 0; i < contracts.length; i++) {
        var contract = contracts[i];
        var standard = contract.freeStandard;
        standard = (standard || standard == 0) ? standard.toFixed(2) : "";
        //var standard = 10;
        html += "<tr contract-year='" + (i + 1) + "' first-td='first-td'>"
            + "<th>第 " + (i + 1) + " 年<input type='hidden' value='" + (i + 1) + "' name='rentFree.feeList[" + i + "].rentYear'></th>"
            + "<input type='hidden' name='rentFree.feeList[" + i + "].sortIndex' value='" + sortIndex + "' readonly/>"
            + "<input type='hidden' value='00' name='rentFree.feeList[" + i + "].feeType'/>"
            + "<input type='hidden' name='rentFree.feeList[" + i + "].periodCount' value='1'>"
            + "<td class='zl-edit'><input type='text' value='" + standard + "' name='rentFree.feeList[" + i + "].standard' readonly/></td>"
            + "<td class='zl-edit' style='white-space: nowrap;'>"
            + "<div class='raido-wrapper clearfix'>"
            +"                                <div class='input-addon input-radio-addon pull-left'>"
            +"                                    <input type='radio' name='rentFree.feeList[" + i + "].freeType' id='js-all-freeType[" + i + "]' value='00' checked>"
            +"                                    <label for='js-all-freeType[" + i + "]'>全免</label>"
            +"                                </div>"
            +"                                <div class='input-addon input-radio-addon pull-left'>"
            +"                                    <input type='radio' name='rentFree.feeList[" + i + "].freeType' id='js-rent-freeType[" + i + "]' value='01'>"
            +"                                    <label for='js-rent-freeType[" + i + "]'>免租</label>"
            +"                                </div>"
            +"                                <div class='input-addon input-radio-addon pull-left'>"
            +"                                    <input type='radio' name='rentFree.feeList[" + i + "].freeType' id='js-manager-freeType[" + i + "]' value='02'>"
            +"                                    <label for='js-manager-freeType[" + i + "]'>免物管费</label>"
            +"                                </div>"
            +" </div>"
            + " </td>"
            + "<td class='zl-edit'>"
            +"                                <div class='input-group zl-datepicker zl-datetime-range pull-left' data-type='month' start-date='2017-11' end-date='' style='width:100%'>"
            +"                                    <input type='text' name='rentFree.feeList[" + i + "].startDate' value='' onchange='calcAllocationDate(this)' readonly='readonly' class='form-control input-sm js-date-start' id='add-on-1'>"
            +"                                    <div class='input-group-addon input-xs'>~</div>"
            +"                                    <input type='text' name='rentFree.feeList[" + i + "].endDate' value='' onchange='calcAllocationDate(this)' readonly='readonly' class='form-control input-sm js-date-end' id='add-on-2'>"
            +"                                </div>"
            +"                            </td>"    
            + "<td class='zl-edit'><input type='text' name='rentFree.feeList[" + i + "].remark'/></td>"
            + "<td class='text-right'>"
            +"                                <span class='zl-add-minus-wrapper'>"
            +"                                    <em class='glyphicon glyphicon-plus-sign zl-glyphicon zl-glyphicon-blue' onclick='addOrSubtractExempt(this)'></em>"
            +"                                </span>"
            +"                       </td>"
            + "</tr>";
        sortIndex++;
    }
    $(selector).append(html);
    /*$(selector).find("input[type=radio]").iCheck({
        checkboxClass: 'icheckbox_minimal-red',
        radioClass: 'iradio_minimal-red',
        increaseArea: '20%'
    });*/
    //$(selector).find("input[type=radio][value='00']").iCheck("check");
    //registerTimePicker($("#zl-rent-free-period-table tbody"));
    registerDateRange($(selector));
    //pageView.dateRangeInit();
}

function addOrSubtractExempt(_obj) {
    var index = $(_obj).parents("tbody").attr("index");
    if (!index) {
        index = $("#zl-rent-free-period-table>tbody tr").length;
        $(_obj).parents("tbody").attr("index", index);
    }
    var _table = $(_obj).parents("table").eq(0);
    var _tr = $(_obj).parents("tr").eq(0);
    var contractYear = $(_tr).attr("contract-year");
    var length = $("tr[contract-year='" + contractYear + "']").length;
    var firstTr = $("tr[contract-year='" + contractYear + "'][first-td='first-td']");
    var lastTr = $("tr[contract-year='" + contractYear + "']:last");
    if ($(_obj).hasClass("glyphicon-plus-sign")) {
        $(_obj).parents("tbody").attr("index", parseInt(index) + 1);
        var trHtml = "<tr contract-year='" + contractYear + "'>"
            + "<td class='zl-edit' style='white-space: nowrap;'>"
            + "<div class='raido-wrapper clearfix'>"
            +"                                <div class='input-addon input-radio-addon pull-left'>"
            +"                                    <input type='radio' name='rentFree.feeList[" + index + "].freeType' id='js-all-freeType[" + index + "]' value='00' checked>"
            +"                                    <label for='js-all-freeType[" + index + "]'>全免</label>"
            +"                                </div>"
            +"                                <div class='input-addon input-radio-addon pull-left'>"
            +"                                    <input type='radio' name='rentFree.feeList[" + index + "].freeType' id='js-rent-freeType[" + index + "]' value='01'>"
            +"                                    <label for='js-rent-freeType[" + index + "]'>免租</label>"
            +"                                </div>"
            +"                                <div class='input-addon input-radio-addon pull-left'>"
            +"                                    <input type='radio' name='rentFree.feeList[" + index + "].freeType' id='js-manager-freeType[" + index + "]' value='02'>"
            +"                                    <label for='js-manager-freeType[" + index + "]'>免物管费</label>"
            +"                                </div>"
            +" </div>"
            + "<input type='hidden' value='" + contractYear + "' name='rentFree.feeList[" + index + "].rentYear'>"
            + "</td>"
            + "<input type='hidden' name='rentFree.feeList[" + index + "].sortIndex' readonly/>"
            + "<input type='hidden' value='00' name='rentFree.feeList[" + index + "].feeType'/>"
            + "<td class='zl-edit'>"
            +"                                <div class='input-group zl-datepicker zl-datetime-range pull-left' data-type='month' start-date='2017-11' end-date='' style='width:100%'>"
            +"                                    <input type='text' name='rentFree.feeList[" + index + "].startDate' value='' onchange='calcAllocationDate(this)' readonly='readonly' class='form-control input-sm js-date-start' id='add-on-1'>"
            +"                                    <div class='input-group-addon input-xs'>~</div>"
            +"                                    <input type='text' name='rentFree.feeList[" + index + "].endDate' value='' onchange='calcAllocationDate(this)' readonly='readonly' class='form-control input-sm js-date-end' id='add-on-2'>"
            +"                                </div>"
            + "</td>"
            + "<td class='zl-edit'><input type='text'  name='rentFree.feeList[" + index + "].remark'/></td>"
            + "<td class='text-right'>"
            +"                                <span class='zl-add-minus-wrapper'>"
            +"                                    <em class='glyphicon glyphicon-minus-sign zl-glyphicon zl-glyphicon-red' onclick='addOrSubtractExempt(this)'></em>"
            +"                                </span>"
            +"                       </td>"
            + "</tr>";

        $(lastTr).after(trHtml);
        var newTr = $("tr[contract-year='" + contractYear + "']:last");
        //$(newTr).find("input[type=radio][value='00']").iCheck("check");
        registerDateRange(newTr);
        firstTr.find("th").eq(0).attr("rowspan", (length + 1));
        firstTr.find("td").eq(0).attr("rowspan", (length + 1));
    } else {
        //如果删除的是第一行，将第二行的数据复制到第一行，删除第二行
        if (_tr.attr("first-td") == 'first-td') {
            var nextTr = _tr.next("tr");
            _tr.find("td:eq(3) input:not(:hidden)").val(nextTr.find("td:eq(1) input:not(:hidden)").val());
            _tr.find("td:eq(4) input:not(:hidden)").val(nextTr.find("td:eq(2) input:not(:hidden)").val());
            $(_obj).removeClass("glyphicon-plus-sign zl-glyphicon-blue");
            $(_obj).addClass("glyphicon-minus-sign zl-glyphicon-red");
            nextTr.remove();
        } else {
            _tr.remove();
        }
        firstTr.find("th").eq(0).attr("rowspan", (length - 1));
        firstTr.find("td").eq(0).attr("rowspan", (length - 1));
        //最后一行
        if (length == 2) {
            $(firstTr).find("span em").addClass("glyphicon-plus-sign zl-glyphicon-blue");
            $(firstTr).find("span em").removeClass("glyphicon-minus-sign zl-glyphicon-red");
        }
    }
    // 去掉自动赋值时间
    autoFixAllocationDate();
    calcPeriodCount();
}

function autoFixAllocationDate() {
    var rentBeginDateApply = $("#contractBeginDate").val();
    var contractEndApply = $("#contractEndDate").val();
    $("#zl-rent-free-period-table>tbody [first-td='first-td']").each(function () {
        var index = parseInt($(this).attr("contract-year"));
        var rentStart = new Date(rentBeginDateApply);
        var rentEnd = new Date(rentBeginDateApply);
        var rentEndOriginal = new Date(contractEndApply);

        rentStart.setFullYear(rentStart.getFullYear() + (index - 1));
        rentEnd.setFullYear(rentEnd.getFullYear() + index);
        rentEnd.setDate(rentEnd.getDate() - 1);

        if (rentEnd.getTime() > rentEndOriginal.getTime()) {
            rentEnd = rentEndOriginal;
        }

        $("[contract-year='" + index + "'] [name$=endDate][end-date='end-date']").val("").removeAttr("end-date");
        $("[contract-year='" + index + "']:first [name$=startDate]").val(unix_to_date(rentStart));
        $("[contract-year='" + index + "']:last [name$=endDate]").val(unix_to_date(rentEnd));
        $("[contract-year='" + index + "']:first").find("span em").addClass("glyphicon-plus-sign zl-glyphicon-blue");
        $("[contract-year='" + index + "']:first").removeClass("glyphicon-minus-sign zl-glyphicon-red");
    });
}

function calcPeriodCount() {
    $("#zl-rent-free-period-table>tbody [first-td='first-td']").each(function () {
        var index = parseInt($(this).attr("contract-year"));
        var selector = "[contract-year='" + index + "']";
        var periodCount = 0;
        $(selector).each(function () {
            if ($(this).find("[name$=startDate]").val() || $(this).find("[name$=endDate]").val()) {
                periodCount += 1;
            }
        });
        $(this).find("[name$=periodCount]").val(periodCount);
    });

    var sortIndex = 0;
    $("#zl-rent-free-period-table>tbody tr").each(function () {
        $(this).find("input[name$=sortIndex]").val(++sortIndex);
    });
}

function calcAllocationDate(_obj) {
    var _tr = $(_obj).parents("tr").eq(0);
    var startDate = $(_obj).parents("div").eq(0).find("input[name$=startDate]").val();
    var endDate = $(_obj).parents("div").eq(0).find("input[name$=endDate]").val();

    if (null != startDate && "" != startDate && null != endDate && "" != endDate) {
        if (endDate < startDate) {
            alert("免租开始日期不能大于结束日期！");
            $(this).val("");
        } else {
            // 设置免租期
            var days = getFreeDays(startDate, endDate);
            $(_tr).find("input[name$=days]").val(days);
            console.log(days);
        }
    }
    //calcPeriodCount();
}