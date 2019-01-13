var pageView=(function($){
    var pageView={};
    $("#preloader").fadeOut("fast");
    pageView.loadInitialData=function(){
        pageView.getList();
    }

    /**
     * 遮挡层
     */
    pageView.loadingShow = function () {
        $(".zl-loading").fadeIn();
    }

    pageView.loadingHide = function () {
        $(".zl-loading").fadeOut();
    }
    pageView.initSelect=function () {
        $(".zl-dropdown").ysdropdown({
            callback:function(val,$elem){
                // console.log("===================")
                // console.log(val);
                // console.log($elem);
                window.location = reportWeb_Path+"operations/index.htm?mallId="+val;
            }
        });
    }
    pageView.getList = function () {
        pageView.loadingShow();
        var params = {areaId:$("#areaId").val(),mallId:$("#mallId").val(),type:2};
        $.ajax({
            cache: true,
            type: "post",
            url: "initialCityDeskTopData.htm",
            data: params,
            dataType: "html",
            //async: false,
            error: function (request) {
                alert("系统异常");
                pageView.loadingHide();
            },
            success: function (data) {
                pageView.loadingHide();
                console.log(data);
                var json=eval('(' +data+ ')');
                $(".availableSquare").html(json.availableSquare+"<em class=\"em-unit\">m&sup2</em>");
                $(".rentalRate").html(json.rentalRate+"<em class=\"em-unit\">%</em>");
                $(".openRate").html(json.openRate+"<em class=\"em-unit\">%</em>");
                $(".signContract").html(json.signContract+"<em class=\"em-unit\">个</em>");

                // 欠费
                $(".receivedRate").html(getVal(json.arrearsMap, 'receivedRate')+"<em class=\"em-unit\">%</em>");
                $(".arrearsNum").html(getVal(json.arrearsMap, 'arrearsNum')+"<em class=\"em-unit\"></em>");
                $(".arrearsAmt").html(getVal(json.arrearsMap, 'arrearsAmt')+"<em class=\"em-unit\">万元</em>");

                // 昨日销售额
                $(".yesterdaySales").html((json.yesterdaySales||"")+"<em class=\"em-unit\">(万元)</em>");
                $(".yesterdaySalesNoAnchor").html((json.yesterdaySalesNoAnchor||"")+"<em class=\"em-unit\">(万元)</em>");

                // 本月
                $(".month-sales").html(getVal(json.currentMonth, 'sales')+"<em class=\"em-unit\">(万元)</em>");
                $(".month-sales-complete").html(getVal(json.currentMonth, 'saleCompleteRate')+"<em class=\"em-unit\">%</em>");

                $(".month-sales-no-anchor").html(getVal(json.currentMonthNoAnchor, 'sales')+"<em class=\"em-unit\">(万元)</em>");
                $(".month-sales-complete-no-anchor").html(getVal(json.currentMonthNoAnchor, 'saleCompleteRate')+"<em class=\"em-unit\">%</em>");

                // 上月
                $(".last-month-sales").html(getVal(json.lastMonth, 'sales')+"<em class=\"em-unit\">(万元)</em>");
                $(".last-month-sales-complete").html(getVal(json.lastMonth, 'saleCompleteRate')+"<em class=\"em-unit\">%</em>");
                $(".last-month-income-square").html(getVal(json.lastMonth, 'incomeSquare')+"<em class=\"em-unit\">(元)</em>");
                $(".last-month-income-square-compare").html(getVal(json.lastMonth, 'isCompareRate')+"<em class=\"em-unit\">%</em>");

                $(".last-month-sales-no-anchor").html(getVal(json.lastMonthNoAnchor, 'sales')+"<em class=\"em-unit\">(万元)</em>");
                $(".last-month-sales-complete-no-anchor").html(getVal(json.lastMonthNoAnchor, 'saleCompleteRate')+"<em class=\"em-unit\">%</em>");
                $(".last-month-income-square-no-anchor").html(getVal(json.lastMonthNoAnchor, 'incomeSquare')+"<em class=\"em-unit\">(元)</em>");
                $(".last-month-income-square-compare-no-anchor").html(getVal(json.lastMonthNoAnchor, 'isCompareRate')+"<em class=\"em-unit\">%</em>");

                // 本年
                $(".year-sales").html(getVal(json.currentYear, 'sales')+"<em class=\"em-unit\">(万元)</em>");
                $(".year-sales-complete").html(getVal(json.currentYear, 'saleCompleteRate')+"<em class=\"em-unit\">%</em>");
                // $(".year-sales-complete-tot").html(getVal(json.currentYear, 'totSaleCompleteRate')+"<em class=\"em-unit\">%</em>");
                $(".year-income-square").html(getVal(json.currentYear, 'incomeSquare')+"<em class=\"em-unit\">(元)</em>");
                $(".year-income-square-compare").html(getVal(json.currentYear, 'isCompareRate')+"<em class=\"em-unit\">%</em>");

                $(".year-sales-no-anchor").html(getVal(json.currentYearNoAnchor, 'sales')+"<em class=\"em-unit\">(万元)</em>");
                $(".year-sales-complete-no-anchor").html(getVal(json.currentYearNoAnchor, 'saleCompleteRate')+"<em class=\"em-unit\">%</em>");
                // $(".year-sales-complete-tot-no-anchor").html(getVal(json.currentYearNoAnchor, 'totSaleCompleteRate')+"<em class=\"em-unit\">%</em>");
                $(".year-income-square-no-anchor").html(getVal(json.currentYearNoAnchor, 'incomeSquare')+"<em class=\"em-unit\">(元)</em>");
                $(".year-income-square-compare-no-anchor").html(getVal(json.currentYearNoAnchor, 'isCompareRate')+"<em class=\"em-unit\">%</em>");
            }
        });
    }
    return pageView;
})(jQuery);


function getVal(obj, key){
    if(obj==null){
        return "-";
    }
    return obj[key] || "-";
}

$(document).ready(function(){
    $("#preloader").fadeOut("fast");
    console.log("xxxxx");
    pageView.loadInitialData();
    pageView.initSelect();
    //项目查询

});




