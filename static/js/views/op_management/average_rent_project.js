var pageView=(function($){
    var pageView={};
    var container=$("#average-rent-project");
    pageView.init=function(){
        $("#preloader").fadeOut("fast");
        createLineChart();
    };
    function createLineChart(){
        var options = {
            grid: {
                top:"40",
                left: "10",
                right: "20",
                bottom: "40",
                containLabel: true
            },
            tooltip:{show:true,formatter:"{a}<br/>{b}:{c}"},
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
                    {name: "平均租金", icon: "rect"}
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
                    name:"平均租金",
                    type: 'line',
                    symbolSize:6,
                    lineStyle: {normal: {color: "#5ab46e"}},
                    itemStyle: {normal: {color: "#5ab46e",borderWidth:2}},
                    data: [46.03,41.66,33.66,52.66,29.66,35.66,,,,,,,]
                }
            ]
        };
        var chartContainer = $(container).find(".chart-block .chart-content");
        var myChart = echarts.init(chartContainer[0]);
        myChart.setOption(options)
    };

    return pageView;

})(jQuery);


$(document).ready(function(){
    pageView.init();
});