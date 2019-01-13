/**
 * Created by whobird on 17/7/27.
 */
Number.prototype.formatMoney = function (c, d, t) {
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};
var costChartRender = (function ($, cr) {
    var costChartRender = cr;
    costChartRender.data_init = {
        lineData: {
            labels: [],
            datasets: [
                {
                    stack:"111",
                    type: "bar",
                    name: "费效",
                    xAxisIndex: 0,
                    yAxisIndex: 0,
                    symbol: 'emptyCircle',
                    symbolSize: 6,
                    showSymbol: true,
                    barWidth:"20px",
                    label:{
                        normal:{
                            show:true,
                            position:"top",
                            textStyle:{
                                color:"#999"
                            }
                        }
                    },
                    lineStyle: {
                        show: true,
                        color: "#3aabf3",
                        width: 2,
                        type: "solid",
                    },
                    data: [],
                }
            ]
        },
        pieData: {
            datasets: [
                {
                    name: '',
                    type: 'pie',
                    radius : ['60%','86%'],
                    center: ['50%', '50%'],
                    selectedOffset:0,
                    data:[
                    ],
                    label:{
                        normal:{show:false}
                    },
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                },
            ]
        },//piedata
    };
    costChartRender.opt = {
        lineChartOpt: {
            title: {
                show: false,
            },
            legend: {
                show: false,
            },
            toolbox: {
                show: false,
            },
            grid: {
                top: 30,
                left: 80,
                right: 30,
                bottom: 50
            },
            xAxis: {
                position: "bottom",
                type: "category",
                /* name:"年",
                 nameLocation:"middle",
                 nameTextStyle:{
                 color:"#acadb0",
                 fontStyle:"normal",
                 fontSize:14
                 },
                 nameGap:25,*/
                boundaryGap: true,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: "#ececec",
                        width: 1,
                        type: "solid"
                    }
                },
                axisTick: {
                    show: false,
                    inside: true,
                    length: 3,
                    lineStyle: {
                        color: "#666",
                        width: 1,
                        type: "solid"
                    }
                },
                axisLabel: {
                    show: true,
                    //formatter:null,
                    formatter: '{value}月',
                    margin: 12,
                    textStyle: {
                        color: "#666",
                        fontStyle: "normal",
                        fontSize: 12
                    }
                },
                splitLine: {
                    show: false,
                    lineStyle: {
                        color: "#ececec",
                        width: 1,
                        type: "solid"
                    }
                },
                data: [],//labels
            },
            yAxis: {
                /*name:"万元",
                 nameLocation:"end",
                 nameGap:15,
                 nameTextStyle:{
                 color:"#acadb0",
                 fontStyle:"normal",
                 fontSize:14
                 },*/
                min: 0,
                //max:"auto",
                //splitNumber:7,
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: "#535861",
                        width: 1,
                        type: "solid"
                    }
                },
                axisTick: {
                    show: false,
                    inside: false,
                    length: 6,
                    linStyle: {
                        color: "#535861",
                        width: 1,
                        type: "solid"
                    }
                },
                axisLabel: {
                    show: true,
                    formatter: '{value}',
                    margin: 15,
                    textStyle: {
                        color: "#878787",
                        fontStyle: "normal",
                        fontSize: 12
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: "#ececec",
                        width: 1,
                        type: "solid"
                    }
                },

            },
            color: ['#3aabf3', '#70d3f7', '#66b56a', '#feb739', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
            backgroundColor: "transparent",
            tooltip: {
                show: true,
                showContent: true,
                //formatter:"{a}:<br/>{b}年:{c}万",
                formatter: function (params, ticket, callback) {
                    var value = parseFloat(params.data).formatMoney(0, ".", ",");
                    if (params.name.indexOf('费效') != -1) {
                        value = params.data.coord[1];
                        return params.seriesName + "<br/>" + params.name + " : " + value;
                    }
                    return params.seriesName + "<br/>" + params.name + "月 : " + value;
                },
                textStyle: {
                    fontSize: 12,
                    color: "#fff"
                }
            },
            series: [
                //dataset
            ]
        },
        pieChartOpt: {
            title : {
                text: '项目Dount',
                show:false,
            },
            tooltip : {
                show:true,
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} "
            },
            legend: {
                show:false
            },
            hoverAnimation:false,
            color:['#018def','#01b0f1', '#2cd9dd', '#a6ec67', '#ddf7a0','#adbaca',  '#45546b', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
            series : [
                {
                    name: '',
                    type: 'pie',
                    radius : ['60%','86%'],
                    center: ['62%', '50%'],
                    selectedOffset:0,
                    /*
                    * data:[{
                    *   name:'',
                    *   value:,
                    * }]
                    * */

                    data:[],
                    label:{
                        normal:{show:false}
                    },
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        }
    };

    costChartRender.setOption = function (chartType,data,labels) {
            if(chartType=="pie"){

                costChartRender.data_init[chartType+"Data"].datasets[0].name=data.name;
                costChartRender.data_init[chartType+"Data"].datasets[0].data=data.values;
                costChartRender.opt[chartType+"ChartOpt"].series[0]=costChartRender.data_init[chartType+"Data"].datasets[0];
            }

            if(chartType=="line"){
                $.each(costChartRender.data_init[chartType+"Data"].datasets,function(i,dataset){
                    dataset.data=data[i].values;
                });

                costChartRender.data_init[chartType+"Data"].labels=labels;
                costChartRender.opt[chartType+"ChartOpt"].xAxis.data=costChartRender.data_init[chartType+"Data"].labels;
                costChartRender.opt[chartType+"ChartOpt"].series=costChartRender.data_init[chartType+"Data"].datasets;


                var datasets = costChartRender.data_init[chartType+"Data"].datasets;
                datasets[0].markLine = {
                    label: {
                        normal: {
                            position: 'top',
                                distance:10,
                                formatter: '{b}',
                        }
                    },
                    data:[
                        [
                            {name:'费效的平均值', coord:[0, 20]},
                            {coord:[11, 20],}
                        ]
                    ]
                };

                datasets[0].markLine.data[0][0].coord[1] = $('#avgCost').val();
                datasets[0].markLine.data[0][1].coord[1] = $('#avgCost').val();
            }
            return costChartRender.opt[chartType+"ChartOpt"];
    };

    costChartRender.update=function(chart,data,chartType){
        var labels=data["labels"];
        var data=data["chart"];
        var opt=costChartRender.setOption(chartType,data,labels);
        chart.setOption(opt);
    };

    //init
    costChartRender.init = function (id,chartType) {

        //todo:chartType:pie,line
        var $elem=$(id);
        var chart=echarts.init($elem.get(0));
        var labels=$elem.data("labels");
        var data=$elem.data("chart");

        var opt=costChartRender.setOption(chartType,data,labels);
        chart.setOption(opt);
        return chart;
    };

    return costChartRender;
})(jQuery, costChartRender|| {})