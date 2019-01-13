var minHeightContent = $(window).height()-160-41;
$(".zl-content-left").css("min-height",minHeightContent+"px");

function adaptSearchResultWrapperHeight(){
    var totalHeight = parseInt($(".zl-content-left").css("height"));

    var searchBarHeight = parseInt($("#zl-floor-ichnography .zl-content>.zl-content-right .zl-search-bar-grey").css("height"));
    var searchResultStatement = parseInt($("#zl-floor-ichnography .zl-content>.zl-content-right .zl-search-result .zl-search-result-statement").css("height"));
    var searchResultFirstDiv = parseInt($("#zl-floor-ichnography .zl-content>.zl-content-right .zl-search-result>div:first-child").css("height"));

    var height = totalHeight-searchBarHeight-searchResultStatement-searchResultFirstDiv-40;
    $(".zl-search-result-wrapper").height(height);
}



$("#zl-floor-ichnography .zl-content-right .zl-search-result ul.zl-search-result-list li").click(function(e){
    e.stopPropagation();
    e.preventDefault();

    if($(this).hasClass("active")){
        $(this).removeClass("active");
        $("#zl-floor-ichnography .zl-content-right .zl-search-result ul.zl-search-result-list").css("top","0");
        $(".zl-search-result-detail").fadeOut();
    }else{
        $("#zl-floor-ichnography .zl-content-right .zl-search-result ul.zl-search-result-list li.active").removeClass("active");
        $(this).addClass("active");
        var index = $("#zl-floor-ichnography .zl-content-right .zl-search-result ul.zl-search-result-list li").index($(this));
        $("#zl-floor-ichnography .zl-content-right .zl-search-result ul.zl-search-result-list").css("top","-"+index*82+"px");


        $(".zl-search-result-detail").fadeIn();
        echarts.init($(".zl-chart").get(1)).setOption(option);
    }



});
/* ============================== echarts ============================== */
var option = {
//        color: ["#50c5ec", "#ff7c27", "#19be9b"],
    grid: {
        x: 40,
        y: 50,
        x1: 0,
        y1: 0,
        width: "85%",
        height: "70%"
    },

    title: {
        subtext: '万元',
        subtextStyle: {
            fontSize: 12
        }
    },
    legend: {
        data: ['一铺一价','租金包', '合同应收','实收'],
        x: "center",
        y: 30,
        itemWidth:20,
//            itemHeight:0,
        itemGap:5
    },

    tooltip: {
        trigger: 'axis',
        axisPointer: {
            crossStyle: {
                color: "red"
            }
        }
    },
    calculable: false,
    xAxis: [
        {
            type: 'category',
            boundaryGap: false,
            data: ['年 13', '14', '15', '16', '17','18'],
            axisLine: {
                lineStyle: {
                    color: "#CCCCCC",
                    width: 0.5,
                    type: "solid"
                }
            },
            axis: {
                show: true
            },
            axisLabel: {
                textStyle: {
                    align: "right",
                    fontSize: 12,
                    color: "#757575"
                }

            },
            axisTick:{
                show:false
            }
        }
    ],
    yAxis: [
        {
            type: 'value',
            show: true,
            min: 0,
            max: 300,
            splitNumber: 6,
            axisLine: {
                lineStyle: {
                    color: "#CCCCCC",
                    width: 1,
                    type: "solid"
                }
            },
            splitLine: {
                show: true
            },
            splitArea: {
                show: false
            },
            axisLabel: {
                show: true,
                formatter: function (value) {
                    if (value == 0) {
                        return "";
                    }
                    return value;
                },
                textStyle: {
                    align: "right",
                    fontSize: 12,
                    color: "#757575"
                }
            }
        }
    ],
    series: [
        {

            name: '一铺一价',
            type: 'line',
            data: [60, 70, 75, 80, 85,100],
            symbol: "emptyCircle",
            symbolSize: 4

        },
        {

            name: '租金包',
            type: 'line',
            data: [80, 90, 120, 140, 165,180],
            symbol: "emptyCircle",
            symbolSize: 4

        },

        {

            name: '合同应收',
            type: 'line',
            data: [0, 0, 170, 200, 220/*,260*/],
            symbol: "emptyCircle",
            symbolSize: 4

        },
        {

            name: '实收',
            type: 'line',
            data: [0,0,98,160],
            symbol: "emptyCircle",
            symbolSize: 4

        }
    ]
};

//echarts.init($("#chart").get(0), 'macarons').setOption(option);




$("img").click(function(e){
    //e.preventDefault();
    //e.stopPropagation();

    //if(Math.random()*100>50){
    //    $(".zl-blank-block").hide();
    //    $(".zl-store-info").hide();
    //    $(".zl-search-result").hide();
    //    $(".zl-fixed-point-position").show();
    //}else{
    //    $(".zl-blank-block").hide();
    //    $(".zl-fixed-point-position").hide();
    //    $(".zl-search-result").hide();
    //    $(".zl-store-info").show();
    //    echarts.init($(".zl-chart").get(0)).setOption(option);
    //}

});

//$(".zl-search-bar-grey span").click(function(e){
//    e.preventDefault();
//    e.stopPropagation();
//    $(".zl-blank-block").hide();
//    $(".zl-fixed-point-position").hide();
//    $(".zl-store-info").hide();
//    $(".zl-search-result").show();
//    adaptSearchResultWrapperHeight();
//});

$(".zl-location").click(function(e){
    e.stopPropagation();
    e.preventDefault();
    if(!$("[data-href=current-img]").hasClass("active")){return;}
    $(".zl-location").addClass("visibility-hidden");
    $(this).removeClass("visibility-hidden");




        //$(".zl-fixed-point-position").hide();
        //$(".zl-search-result").hide();
        $(".multiple-location").addClass("visibility-hidden");
        $(".zl-blank-block").hide();
        $(".zl-store-info-2").hide();
        $(".zl-store-info-1").show();
        echarts.init($(".zl-store-info-1 .zl-chart").get(0)).setOption(option);
});



/* ======================================== 多经 按钮点击事件 start ======================================== */
$(".multiple-location").click(function(e){
    e.stopPropagation();
    e.preventDefault();
    $(".zl-location.zl-location-1").addClass("visibility-hidden");
    $(".multiple-location").addClass("visibility-hidden");
    $(this).removeClass("visibility-hidden");

    $(".zl-blank-block").hide();
    $(".zl-store-info-1").hide();
    $(".zl-store-info-2").show();
    //echarts.init($(".zl-store-info-2 .zl-chart").get(0)).setOption(option);
});
/* ======================================== 多经 按钮点击事件 end ======================================== */

$("#zl-floor-ichnography").on("click",".zl-checkbox-multiple",function(){


    $(this).toggleClass("checked");
    var href = $(".zl-enabled.active").attr("data-href");


    if($(this).hasClass("checked")){

        $(".multiple-location").removeClass("display-hide");
        $("#zl-floor-ichnography [data-id="+href+"]").removeClass("display-hide");
        $("#zl-floor-ichnography [data-id="+href+"]:not(.multiple-img)").addClass("display-hide");
    }else{
        $(".multiple-location").addClass("display-hide");
        $("#zl-floor-ichnography [data-id="+href+"]").addClass("display-hide");
        $("#zl-floor-ichnography [data-id="+href+"]:not(.multiple-img)").removeClass("display-hide");
    }
});

$("#zl-floor-ichnography").on("click",".zl-check-btn-group>a.zl-check-btn",function(e){
    e.stopPropagation();
    e.preventDefault();
    $(this).closest(".zl-check-btn-group").find(".active").removeClass("active");


    $(this).addClass("active");

    $(".zl-checkbox-multiple").removeClass("checked");
    $(".multiple-img").addClass("display-hide");
    $(".multiple-location").addClass("display-hide");

    var href = $(this).attr("data-href");

    $(".zl-graphy img").addClass("display-hide");
    $(".zl-commercial-types>ul").addClass("display-hide");



    $("#zl-floor-ichnography [data-id="+href+"]:not(.multiple-img)").removeClass("display-hide");
    $("#zl-floor-ichnography [data-name="+href+"]").removeClass("display-hide");
    $("#zl-floor-ichnography .zl-location").addClass("visibility-hidden");
    $("#zl-floor-ichnography .zl-location").addClass("display-hide");

    if(href=="current-img"){
        $("#zl-floor-ichnography .zl-location").removeClass("display-hide");
    }

});
