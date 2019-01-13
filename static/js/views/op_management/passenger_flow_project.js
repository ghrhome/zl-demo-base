$(function(){
    var container = $("#passenger-flow-project");
    $("#preloader").fadeOut("fast");
    /* ======================================== init the page view ======================================== */
    createLineChart();




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

    /* ======================================== methods ======================================== */
    function createLineChart(){
        var options = {
            grid: {
                top:"40",
                left: "10",
                right: "20",
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
                    {name: "当月客流指标", icon: "rect"},
                    {name: "当月实际客流", icon: "rect"}
                ]
            },
            xAxis: [
                {
                    boundaryGap:false,
                    type: 'category',
                    data:  ["1月", "2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
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
                    name:"当月客流指标",
                    type: 'line',
                    symbolSize:6,
                    lineStyle: {normal: {color: "#5ab46e"}},
                    itemStyle: {normal: {color: "#5ab46e",borderWidth:2}},
                    data: [205.32,149.55,55.21,80.21,44.21,88.21,,,,,,,]
                },
                {
                    name:"当月实际客流",
                    type: 'line',
                    symbolSize:6,
                    lineStyle: {normal: {color: "#5dd5f5"}},
                    itemStyle: {normal: {color: "#5dd5f5",borderWidth:2}},
                    data: [200.73,51.44,61.21,71.21,66.21,65.22,,,,,,,]
                }
            ]
        };


        var chartContainer = $(container).find(".chart-block .chart-content");
        var myChart = echarts.init(chartContainer[0]);
        myChart.setOption(options)
    }

});