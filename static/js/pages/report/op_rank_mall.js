$(function(){
    var container = $("#sale-project");
    $("#preloader").fadeOut("fast");
    /* ======================================== init the page view ======================================== */
    createLineChart();

    $.getJSON(reportWeb_Path+'/sale/rank/layout.htm',function (res) {
        var source=$('#layout-tpl').html();
        var template = Handlebars.compile(source);
        var html=template(res);
        $('#js-layout').append(html);
    });

    $.getJSON(reportWeb_Path+'/sale/rank/block.htm',function (res) {
        console.log(res);
        var source=$('#block-tpl').html();
        var template = Handlebars.compile(source);
        var html=template(res);
        $('#js-block').append(html);
    });




    /* ======================================== bind the event ======================================== */
    container.find(".zl-date-selector input").datetimepicker({
        language: 'zh-CN',
        format:"yyyy",
        todayBtn:"linked",
        startView:4,
        minView:4,
        weekStart: 1,
        autoclose: 1,
        todayHighlight: 1,
        forceParse: 0
    });

    container.on("click",".zl-date-selector .glyphicon-arrow-left",function(e){
        e.stopPropagation();
        e.preventDefault();
        var date = $(this).closest(".zl-date-selector").find("input").val();
        date = parseInt(date);
        date--;

        $(this).closest(".zl-date-selector").find("input").val(date);
        container.find(".zl-date-selector input").datetimepicker("update");
    });

    container.on("click",".zl-date-selector .glyphicon-arrow-right",function(e){
        e.stopPropagation();
        e.preventDefault();
        var date = $(this).closest(".zl-date-selector").find("input").val();

        date = parseInt(date);
        date++;
        $(this).closest(".zl-date-selector").find("input").val(date);
        container.find(".zl-date-selector input").datetimepicker("update");
    });



    /* ======================================== methods ======================================== */
    function createLineChart(){
        var options = {
            grid: {
                top:"40",
                left: "10",
                right: "10",
                bottom: "40",
                containLabel: true
            },
            tooltip:{show:true},
            legend:{
                orient: 'horizontal', // 'vertical'
                x: 'center', // 'center' | 'left' | {number},
                y: 'bottom', // 'center' | 'bottom' | {number}
                padding: 5,    // [5, 10, 15, 20]
                itemGap: 20,
                itemWidth: 15,
                temHeight: 10,
                textStyle: {color: '#757575'},
                data: [
                    {name: "月销售额", icon: "rect"},
                    {name: "坪效", icon: "rect"}
                ]
            },
            xAxis: [
                {
                    boundaryGap:false,
                    type: 'category',
                    data: ["1月", "2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
                    axisTick: {show: false},
                    axisLine: {
                        show:false
                    },
                    splitLine: {
                        show: false,
                        lineStyle: {color: "#eaeaea"}
                    },
                    axisLabel:{textStyle:{fontSize:12,color:"#8592a3"}}
                }
            ],
            yAxis: [
                {
                    splitNumber:5,
                    max:20000,
                    type: 'value',
                    axisTick: {
                        show: false,
                        alignWithLabel: true
                    },
                    axisLine: {
                        show:false
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {color: "#eaeaea"}
                    },

                    axisLabel:{
                        textStyle:{fontSize:14,color:"#757575"}
                    }
                },
                {
                    splitNumber:5,
                    max:2000,
                    type: 'value',
                    axisTick: {
                        show: false,
                        alignWithLabel: true
                    },
                    axisLine: {
                        show:false
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {color: "#eaeaea"}
                    },

                    axisLabel:{
                        textStyle:{fontSize:14,color:"#757575"}
                    }
                }

            ],
            series: [
                {
                    name:"月销售额",
                    type: 'line',
                    symbolSize:6,
                    lineStyle: {normal: {color: "#5ab46e"}},
                    itemStyle: {normal: {color: "#5ab46e",borderWidth:2}},
                    data: [16136.09,2957.84,1957.84,3557.84,2557.82,1557.84,,,,,,,]
                },
                {
                    yAxisIndex:1,
                    name:"坪效",
                    type: 'line',
                    symbolSize:6,
                    lineStyle: {normal: {color: "#5dd5f5"}},
                    itemStyle: {normal: {color: "#5dd5f5",borderWidth:2}},
                    data: [1160.89,221.72,121.72,421.72,321.72,521.72,,,,,,,]
                }
            ]
        };


        var chartContainer = $(container).find(".chart-block .chart-content");
        var myChart = echarts.init(chartContainer[0]);
        myChart.setOption(options)
    }
    container.on("click",".zl-table-block table tbody tr",function(e){
        e.stopPropagation();
        e.preventDefault();
        window.location = "sale_project_detail.html";
    });
});