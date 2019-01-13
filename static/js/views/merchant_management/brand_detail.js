var baseView=(function($){
    var baseView={};
    baseView.init=function(){
        $("#preloader").fadeOut("fast");
        echatShow();
    };
    function echatShow(){
    	$(".rent-sale-btn").click(function (e) {
		    e.stopPropagation();
		    e.preventDefault();
		    recreatChart();
		    $(".zl-rent-sale-percent").modal();
		});

		$(".arrears-btn").click(function (e) {
		    e.stopPropagation();
		    e.preventDefault();
		    // recreatChart2();
		    createArrearsQfeiChart();
		    $(".zl-arrears").modal();
		});
		function recreatChart() {
		    //var data = [(Math.random()*100).toFixed(2),(Math.random()*100).toFixed(2),(Math.random()*100).toFixed(2),(Math.random()*100).toFixed(2),(Math.random()*100).toFixed(2),(Math.random()*100).toFixed(2)];
		    var data = [425, 563, 670, 564, 600, 493];

		    function formatEchartsToolTip(params, ticket, callback) {
		        var seriesName = params[0].seriesName;
		        var pointIndex = params[0].dataIndex;
		        var value = params[0].series.data[pointIndex];
		        var html = seriesName + " : " + value + " %";
		        return html;
		    }

		    var gridOption = {
		        x: 50,
		        y: 60,
		        x1: 0,
		        y1: 50,
		        width: "450px",
		        height: "160px"
		    };

		    var option = {
		        color: ["#4ec1e8"],
		        title: {
		            subtext: '单位(元)'
		        },
		        grid: gridOption,
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
		                data: ['1月', '2月', '3月', '4月', '5月', '6月'],
		                axisLine: {
		                    lineStyle: {
		                        color: "#CCCCCC",
		                        width: 0.5,
		                        type: "solid"
		                    }
		                },
		                axisTick: {
		                    show: false
		                },
		                axisLabel: {show: true}
		            }
		        ],
		        yAxis: [
		            {
		                type: 'value',
		                show: true,
		                min:0,
		                max:1000,
		                splitNumber: 5,
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
		                    show: true
		                }
		            }
		        ],
		        series: [
		            {
		                //tooltip:{
		                //    formatter:formatEchartsToolTip
		                //},
		                name: '租售比',
		                type: 'line',
		                data: data,
		                symbol: "emptyCircle",
		                symbolSize: 4

		            }
		        ]
		    };

		    var myChart = echarts.init($(".zl-chart-line").get(0), 'default').setOption(option);
		}


		function recreatChart2() {
		    //var data = [(Math.random()*100).toFixed(2),(Math.random()*100).toFixed(2),(Math.random()*100).toFixed(2),(Math.random()*100).toFixed(2),(Math.random()*100).toFixed(2),(Math.random()*100).toFixed(2)];
		    var data = [0, 0, 0, 0, 0, 19390];

		    function formatEchartsToolTip(params, ticket, callback) {
		        var seriesName = params[0].seriesName;
		        var pointIndex = params[0].dataIndex;
		        var value = params[0].series.data[pointIndex];
		        var html = seriesName + " : " + value + " %";
		        return html;
		    }

		    var gridOption = {
		        x: 50,
		        y: 60,
		        x1: 0,
		        y1: 50,
		        width: "450px",
		        height: "160px"
		    };

		    var option = {
		        color: ["#4ec1e8"],
		        grid: gridOption,
		        title: {
		            subtext: '单位(元)'
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
		                data: ['1月', '2月', '3月', '4月', '5月', '6月'],
		                axisLine: {
		                    lineStyle: {
		                        color: "#CCCCCC",
		                        width: 0.5,
		                        type: "solid"
		                    }
		                },
		                axisTick: {
		                    show: false
		                },
		                axisLabel: {show: true}
		            }
		        ],
		        yAxis: [
		            {
		                type: 'value',
		                show: true,
		                splitNumber: 5,
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
		                    show: true
		                }
		            }
		        ],
		        series: [
		            {
		                tooltip: {
		                    formatter: formatEchartsToolTip
		                },
		                name: '租售比',
		                type: 'line',
		                data: data,
		                symbol: "emptyCircle",
		                symbolSize: 4

		            }
		        ]
		    };

		    var myChart = echarts.init($(".zl-chart-line2").get(0), 'default').setOption(option);
		}

		/* ======================================== zl-chart-qf======================================== */
		function createArrearsQfeiChart() {
		// 基于准备好的dom，初始化echarts实例
		    var ysChartQf = $(".zl-chart-qf");
		    var myChart = echarts.init(ysChartQf.get(0));
		    // 指定图表的配置项和数据
		    var option = {
		        grid: {
		            top: "40px",
		            left: '0px',
		            right: '5px;',
		            bottom: '0',
		            containLabel: true
		        },
		        tooltip: {show: true},
		        xAxis: [
		            {
		                type: 'category',
		                data: [""],
		                axisLine: {
		                    show: false
		                },
		                axisTick: {
		                    show: false
		                },
		                splitLine: {
		                    show: false
		                }
		            }
		        ],
		        yAxis: [
		            {
		                type: 'value',
		                axisTick: {
		                    show: false
		                },
		                axisLine: {
		                    show: false
		                },
		                min: 0,
		                max: 10000
		            },
		            {
		                type: 'value',
		                axisLine: {
		                    show: false
		                },
		                axisLabel: {show: false},
		                axisTick: {
		                    show: false
		                },
		                min: 0,
		                max: 10000

		            }
		        ],
		        series: [
		            {
		                name: "30天以下",
		                barGap: "0",
		                type: 'bar',
		                barWidth: 24,
		                data: [
		                    {value: 5200, itemStyle: {normal: {color: "#808d91"}}}
		                ]
		            },
		            {
		                name: "30-60天",
		                type: 'bar',
		                barGap: "0",
		                barWidth: 24,
		                data: [
		                    {value: 2500, itemStyle: {normal: {color: "#c0c7ca"}}}
		                ]
		            },
		            {
		                name: "60-90天",
		                type: 'bar',
		                barGap: "0",
		                barWidth: 24,
		                data: [
		                    {value: 7800, itemStyle: {normal: {color: "#808d91"}}}
		                ]
		            },
		            {
		                name: "90天以上",
		                type: 'bar',
		                barGap: "0",
		                barWidth: 24,
		                data: [
		                    {value: 3400, itemStyle: {normal: {color: "#c0c7ca"}}}
		                ]
		            },
		        ]
		    };

		    // 使用刚指定的配置项和数据显示图表。
		    myChart.setOption(option);
		    var html = "<div class='labelText clearfix'>" +
		        "<div><30</div>" +
		        "<div>30-60</div>" +
		        "<div>60-90</div>" +
		        "<div>>90</div>" +
		        "</div>";
		    ysChartQf.append(html);
		}
    }

    return baseView;

})(jQuery);


$(document).ready(function(){
    baseView.init();
});