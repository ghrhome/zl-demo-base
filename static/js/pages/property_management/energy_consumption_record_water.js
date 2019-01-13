var dubSumit = 0;
var isAddFile=false;
var map={
    list:[],
    sumUseCount:"",
    sumMoneyReceivable:"",
    alertMsg:""
};
var pageView=(function($){
    var pageView={};
    var container=$("#energy_consumption_enrolment");
    pageView.init=function(){
        var ys_swiper = new Swiper('#zl-floor-table', {
            scrollbar: '.swiper-scrollbar-a',
            slidesPerView: 'auto',
            freeMode: true,
            scrollbarHide: false,
            observer:true,
            observeParents:true
        });
         //loadingshow();
        $("#preloader").fadeOut("fast");
        var container = $("#energy_consumption_enrolment");
        /*=======================================================================*/
        container.find(".latePayCost input").datetimepicker({
            language: "zh-CN",
            format:"yyyy-mm-dd",
            todayBtn:"linked",
            startView:2,
            minView:2,
            weekStart: 1,
            autoclose: 1,
            todayHighlight: 1,
            forceParse: 0,
            clearBtn:true,
        });
        container.find(".date-day input").datetimepicker({
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
        $("#js-month-picker-chargeym").find("input.form-control").datetimepicker({
            language: "zh-CN",
            format: "yyyy-mm",
            clearBtn: "清除",
            startView: 3,
            minView: 3,
            weekStart: 1,
            autoclose: true,
            todayHighlight: true,
            forceParse: false
        });
        $("#js-month-picker-finym").find("input.form-control").datetimepicker({
            language: "zh-CN",
            format: "yyyy-mm",
            clearBtn: "清除",
            startView: 3,
            minView: 3,
            weekStart: 1,
            autoclose: true,
            todayHighlight: true,
            forceParse: false
        });
        $("#js-month-picker-chargeym").ysDatepicker({
            dateType:"month",//year,day
            callback:function(value){
                $("form").find("input[name=chargeYM]").val(value);
            }
        });
        $("#js-month-picker-finym").ysDatepicker({
            dateType:"month",//year,day
            callback:function(value){
                $("form").find("input[name=finYm]").val(value);
            }
        });
        container.on("click",".zl-datetimepicker",function(e){
            e.stopPropagation();
            e.preventDefault();
            $(this).find("input").datetimepicker("show");
        });
        //日期插件初始化
        $('#datetimeStart').datetimepicker({
            language:  'zh-CN',
            format:"yyyy-mm-dd hh:ii",
            startView: 0,
            weekStart: 1, /*以星期一为一星期开始*/
            todayBtn:  1,
            autoclose: 1,
            forceParse:true,
            pickerPosition: "bottom-left",
            clearBtn: true
        }).on("changeDate",function(ev){  //值改变事件
            //选择的日期不能大于第二个日期控件的日期
            if(ev.date){
                $("#datetimeEnd").datetimepicker('setStartDate', new Date(ev.date.valueOf()));
            }
        });
        $('#datetimeEnd').datetimepicker({
            language:  'zh-CN',
            format:'yyyy-mm-dd hh:ii',
            startView: 0,
            weekStart: 1, /*以星期一为一星期开始*/
            todayBtn:  1,
            autoclose: 1,
            forceParse:true,
            pickerPosition: "bottom-left",
            clearBtn: true
        }).on("changeDate",function(ev){
            //选择的日期不能小于第一个日期控件的日期
            if(ev.date){
                $("#datetimeStart").datetimepicker('setEndDate', new Date(ev.date.valueOf()));
            }
        });


        /*  container.on("click", ".zl-linkable", function (e) {
         $('.import-dialog').modal("hide");
         });
         */

        $("#searchType").unbind('click').on("click", function (e) {
            loadingshow();
            location.href=managementWeb_Path + "energyConsumptionRecord/electric/index.htm";
            //$(window).attr("location",managementWeb_Path + "electricrate/index.htm");
        });

        //==============================
        $("#dist-add").unbind('click').on("click", function () {

            $(".zl-add-collapse").slideToggle("normal");
        });

        
        //=================
        //导入水表
        $("#daoru").unbind('click').click(function () {
            $("<input type='file' name='file' style='display: none'/>").appendTo("body").change(function () {
                $('.import-dialog').modal("hide");
                loadingshow();
                var formData = new FormData();
                formData.append('file', $(this).get(0).files[0]);
                $.ajax({
                    url: managementWeb_Path+'energyConsumptionRecord/water/upload-excel.htm',
                    type: 'POST',
                    dataType: "json",
                    cache: false,
                    data: formData,
                    processData: false,
                    contentType: false
                }).done(function (response) {
                    if (response.success) {
                        loadingHide();
                        $('.data-import-dialog').modal("show");
                        map = response.data;
                        console.log(map);
                        //清空内容
                        $('#sumUseCount').empty();
                        $('#sumMoneyReceivable').empty();
                        $('#sumCount').empty();
                        $('#alertMsg').empty();
                        $("#tableAppend").empty();
                        //赋值
                        $('#sumUseCount').html("总用量:"+thousandBitSeparator(map.sumUseCount.toFixed(2)));
                        $('#sumMoneyReceivable').html("总金额:"+thousandBitSeparator(map.sumMoneyReceivable.toFixed(2)));
                        $('#sumCount').html("总记录:"+map.list.length);
                        if(!!map.alertMsg){
                            $('#alertMsg').html(map.alertMsg);
                        }
                        for (var i = 0; i < map.list.length; i++) {
                            var  storeNo = map.list[i].storeNo==null?"":map.list[i].storeNo;
                            var  brandName = map.list[i].brandName==null?"":map.list[i].brandName;
                            var  companyName = map.list[i].companyName==null?"":map.list[i].companyName;
                            var  noMoneyRate = "";
                            if(map.list[i].noMoneyRate==null||map.list[i].noMoneyRate==""){
                                noMoneyRate = "";
                            }else{
                                noMoneyRate = thousandBitSeparator(map.list[i].noMoneyRate.toFixed(2));
                            }
                            var  tax = "";
                            if(map.list[i].tax==null||map.list[i].tax==""){
                                tax = "";
                            }else{
                                tax = thousandBitSeparator(map.list[i].tax.toFixed(2));
                            }
                            $("#tableAppend").append(
                                "<tr>"
                                +   "<td class=\"text-center\" title=\"" + map.list[i].waterrateCode+"\">\n" +map.list[i].waterrateCode+"\n</td>"//设备编号
                                +   "<td class=\"text-center\" title=\"" + storeNo +"\">\n" + storeNo +"\n</td>"//商铺号
                                +   "<td class=\"text-center\" title=\"" + brandName+"\">\n" + brandName +"\n</td>"//租户品牌
                                +   "<td class=\"text-center\" title=\"" + companyName+"\">\n" + companyName +"\n</td>"//租户名称
                                +   "<td class=\"text-center\" title=\"" + map.list[i].contNo+"\">\n" +map.list[i].contNo+"\n</td>"//合同编号
                                +   "<td class=\"text-center\" title=\"" + map.list[i].chargeYM+"\">\n" +map.list[i].chargeYM+"\n</td>"//业务月
                                +   "<td class=\"text-center\" title=\"" + map.list[i].finYm+"\">\n" +map.list[i].finYm+"\n</td>"//财务月
                                +   "<td class=\"text-center\" title=\"" + timeGetDate(map.list[i].latePayCost)+"\">\n" +timeGetDate(map.list[i].latePayCost)+"\n</td>"//最后付款日
                                +   "<td class=\"text-center\" title=\"" + thousandBitSeparator(map.list[i].contractPrice.toFixed(2))+"\">\n" +thousandBitSeparator(map.list[i].contractPrice.toFixed(2))+"\n</td>"//单价
                                +   "<td class=\"text-center\" title=\"" + map.list[i].rate+"\">\n" +map.list[i].rate+"\n</td>"//倍率
                                +   "<td class=\"text-center\" title=\"" + timeGetDate(map.list[i].readingDate)+"\">\n" +timeGetDate(map.list[i].readingDate)+"\n</td>"//抄表日期
                                +   "<td class=\"text-center\" title=\"" + thousandBitSeparator(map.list[i].priorCount.toFixed(2))+"\">\n" +thousandBitSeparator(map.list[i].priorCount.toFixed(2))+"\n</td>"//上期读数
                                +   "<td class=\"text-center\" title=\"" + thousandBitSeparator(map.list[i].readnum.toFixed(2))+"\">\n" + thousandBitSeparator(map.list[i].readnum.toFixed(2))+"\n</td>"//本期读数
                                +   "<td class=\"text-center\" title=\"" + thousandBitSeparator(map.list[i].useCount.toFixed(2))+"\">\n" +thousandBitSeparator(map.list[i].useCount.toFixed(2))+"\n</td>"//用量
                                +   "<td class=\"text-center\" title=\"" + thousandBitSeparator(map.list[i].moneyRate.toFixed(2))+"\">\n" +thousandBitSeparator(map.list[i].moneyRate.toFixed(2))+"\n</td>"//含税金额
                                // +   "<td class=\"text-center\" title=\"" + noMoneyRate +"\">\n" + noMoneyRate +"\n</td>"//不含税金额
                                // +   "<td class=\"text-center\" title=\"" + tax +"\">\n" + tax + "\n</td>"//税额
                                +   "<td class=\"text-center\" title=\"" + thousandBitSeparator(map.list[i].moneyAdjust.toFixed(2))+"\">\n" +thousandBitSeparator(map.list[i].moneyAdjust.toFixed(2))+"\n</td>"//调整金额
                                +   "<td class=\"text-center\" title=\"" + thousandBitSeparator(map.list[i].moneyLoss.toFixed(2))+"\">\n" +thousandBitSeparator(map.list[i].moneyLoss.toFixed(2))+"\n</td>"//损耗金额
                                +   "<td class=\"text-center\" title=\"" + thousandBitSeparator(map.list[i].moneyReceivable.toFixed(2))+"\">\n" +thousandBitSeparator(map.list[i].moneyReceivable.toFixed(2))+"\n</td>"//应收金额
                                +   "</tr>"
                            )
                        }
                        $('#showExeclData').modal("show");
                        // alert("导入成功！");
                        // searchBsFormBtn.click();
                        // var url = "/" + response.data.path;
                        // $("p#files").append("<a href='" + url + "' target='_blank'>" + url + "</a><br/>");
                    } else {
                        loadingHide();
                        alert(response.message);
                    }
                });
            }).trigger("click");
        })
        //=======================
        $("#saveExcel").unbind('click').on("click", function (e) {
            $.ajax({
                headers: {'Content-Type': 'application/json'},
                url: managementWeb_Path+'energyConsumptionRecord/water/addAllOrUpdateAll.htm',
                type: 'POST',
                dataType: "json",
                cache: false,
                data: JSON.stringify(map.list),
                processData: false,
                contentType: false
            }).done(function (response) {
                if (response.success) {
                    alert("保存成功！");
                    searchBsFormBtn.click();
                } else {
                    loadingHide();
                    alert(response.message);
                }
            });
        });

        //=================================================

        $("#energy_consumption_enrolment").unbind('click').on("click", ".zl-select ul.dropdown-menu>li>a", function (e) {
            //e.stopPropagation();
            //e.preventDefault();

            var key = $(this).attr("key");
            var value = $(this).html();

            $(this).parent().parent().prev().children("span").html(value);
            $(this).parent().parent().parent().children("input").val(key);
            $(this).parent().parent().parent().removeClass("open");

            // 项目带出 物业类型

            // if (typeof($(this).attr("data-buildingType")) != "undefined") {
            //     var buildingType = $(this).attr("data-buildingType");
            //     var buildingTypeShow = $(this).attr("data-buildingTypeShow");
            //     $(this).parents("form").find("input[name='buildingType']").val(buildingType);
            //     $(this).parents("form").find("input[name='buildingTypeShow']").val(buildingTypeShow);
            // }

        });
        //=============================修改=======================================================

        $("[name=updateBsFloorBtn]").unbind("click").on("click", function () {
            var mngHydroelectricId = $(this).attr("mngHydroelectricId");
            var readingDate=$.trim($("#readingDate_"+mngHydroelectricId).val());
            var readnum=$.trim($("#readnum_"+mngHydroelectricId).val());
            var moneyRate=$.trim($("#moneyRate_"+mngHydroelectricId).val());
            var useCount=$.trim($("#useCount_"+mngHydroelectricId).val());
            var latePayCost=$.trim($("#latePayCost_"+mngHydroelectricId).val());
            if (readingDate == "" || readingDate == null) {
                alert("抄表日期不能为空！");
                return false;
            }
            if (readnum == "" || readnum == null) {
                alert("读数不能为空！");
                return false;
            }
            if (moneyRate == "" || moneyRate == null) {
                alert("金额不能为空！");
                return false;
            }
            if(moneyRate.length>20||moneyRate=='NaN'){
                alert("金额错误！");
                return false;
            }
            if (useCount == "" || useCount == null||useCount=='NaN'||Number(useCount)<0) {
                alert("用量信息错误！");
                return false;
            }
            if (latePayCost == "" || latePayCost == null) {
                alert("最后付款日不能为空！");
                return false;
            }
            $(".upload-pic-item-list li a em").click(function(){
                //console.log("添加");
            })
            confirm("确认要提交吗？","","",function (type) {
                if(type=="dismiss"){
                    return;
                }
                loadingshow();
                $.ajax({
                    cache: true,
                    type: "POST",
                    url: managementWeb_Path + "energyConsumptionRecord/water/addOrUpdate.htm",
                    data: $('#updateBsFloorForm_' + mngHydroelectricId).serialize(),
                    async: false,
                    error: function (request) {
                        loadingHide();
                        alert("系统异常");
                    },
                    success: function (resultData) {
                        loadingHide();
                        if(JSON.parse(resultData).code=='1'){
                            alert(JSON.parse(resultData).msg);
                        }else{
                            alert("添加成功");
                            $("#searchBsFloorForm").trigger("submit");
                        }
                    }
                });
            });
        });
        //============================================历史详情====================
        $(".lookLis").on("click", function (e) {
            e.stopPropagation()
            var mngHydroelectricEntityId = $(this).attr("mngHydroelectricEntityId");
            window.location.href=managementWeb_Path +"energyConsumptionRecord/water/rates.htm?mngHydroelectricId=" + mngHydroelectricEntityId;
        });
        //====================================

        $("[name=electric]").on("keypress", function (e) {
            e.stopPropagation();
            if (e.keyCode == 13) {
                searchBsFormBtn.click();
            }
        });
//00

//00
        $("#searchBsFormBtn").unbind('click').on("click", function (e) {
            $("#searchBsFloorForm").trigger("submit");
        });

        $(".zl-senior-search").unbind('click').on("click", function (e) {
            $("#searchBsFloorForm").trigger("submit");
        });

        //清空
        $(".zl-search-clear").on("click",function (e) {
            e.stopPropagation();
            e.preventDefault();
            $("#layoutCode").val('');
            $('#searchFormDetail :input')
                .not(' :submit, :reset, :hidden')
                .val('')
                .removeAttr('checked')
                .removeAttr('selected');
            $("#searchFormDetail .dropdown-menu").each(function () {
                $(this).find("li:first a").click();
            })
        });

        //pageView.dropdownInit();
    };
    /**
     * 下拉初始化
     */
    $(".zl-dropdown").ysdropdown({
        callback:function(val, $elem){
            if ($elem.data("id") == "isPropertyAudit"){
                $("#searchForm").find("input[name=isPropertyAudit]").val(val);
            }
            if ($elem.data("id") == "isFinancialAudit"){
                $("#searchForm").find("input[name=isFinancialAudit]").val(val);
            }
        }
    });
    //审批
    $("#examineButton").on("click",function (e) {
        confirm("确认要审核吗？","","",function (type) {
            if(type=="dismiss"){
                return;
            }
            loadingshow();
            if(!$("#mallId").val()){
                alert("请选择项目！");
                loadingHide();
                return;
            };
            loadingshow();
            $.ajax({
                cache: true,
                type: "POST",
                dataType: "json",
                url: managementWeb_Path + "auditingController/allAuditing.htm",
                data: $("#searchBsFloorForm").serialize(),
                //async: false,
                error: function (request) {
                    loadingHide();
                    alert("系统异常");
                },
                success: function (resultData) {
                    loadingHide();
                    //showMsg(resultData);
                    //  searchBsFormBtn.click();
                    //console.log(resultData)
                    alert(resultData.msg);
                }
            });
        });

    })
    return pageView;

})(jQuery);
$("#searchBsFloorForm").submit(function () {
    var self = $(this);
    var electric = $.trim($(this).find("input[name=electric]").val());
    self.find("input[name=electric]").val(encodeURI(electric));
    self.attr("action", managementWeb_Path + "energyConsumptionRecord/water/index.htm");
});
function valitateForm(obj) {
    var mallId = $(obj).find("input[name=mallId]").val();
    var blockName = $.trim($(obj).find("input[name=blockName]").val());
    var status = $(obj).find("input[name=status]").val();
    var remark = $.trim($(obj).find("textarea[name=remark]").val());
    var openDate = $.trim($(obj).find("input[name=openDate]").val());
    if (mallId == "" || mallId == null) {
        alert("项目名称不能为空！");
        return false;
    }

    if (blockName == "" || blockName == null) {
        alert("楼栋名称不能为空！");
        return false;
    }

    if (openDate == "" || openDate == null) {
        alert("开业日期不能为空！");
        return false;
    }

    if (status == "" || status == null) {
        alert("状态不能为空！");
        return false;
    }

    if (remark == "" || remark == null) {
        alert("备注不能为空！");
        return false;
    }

    return true;
}

function isNum(num, msg) {
    if (!isNaN(num)) {
        var dot = num.indexOf(".");
        if (dot != -1) {
            var dotCnt = num.substring(dot + 1, num.length);
            if (dotCnt.length > 2) {
                alert(msg + "小数位已超过2位！");
                return false;
            } else {
                if (parseInt(num) > 99999999) {
                    alert( msg + "值过大！");
                    return false;
                } else if (parseInt(num) < 0) {
                    alert(msg + "应大于0！");
                    return false;
                } else {
                    return true;
                }
            }
        } else {
            var re = /^(\-?)[0-9]*[0-9][0-9]*$/;
            if (re.test(num)) {
                if (parseInt(num) > 99999999) {
                    alert( msg + "值过大！");
                    return false;
                } else if (parseInt(num) <= 0) {
                    alert(msg + "应大于0！");
                    return false;
                }else {
                    return true;
                }
            } else {
                alert( msg + "格式错误！");
                return false;
            }
        }
    } else {
        alert( msg + "格式错误！");
        return false;
    }
}

function isNumber(value) {
    return /^(\-?)[0-9]+.?[0-9]*$/.test($.trim(value))
}
function isInt(str) {
    var reg = /^(-|\+)?\d+$/;
    return reg.test(str);
}

function searchMall(_this) {
    var mallId = $(_this).attr("key");
    $("#projectId").val($(_this).attr("key"));
    $("#mallId").val(mallId);
    $("#searchBsFormBtn").click();
}

function searchBuild(_this) {
    var hydroelectricType = $(_this).attr("key");
    $("#hydroelectricType").val(hydroelectricType);
    $("#searchBsFormBtn").click();
}
//輸入框失去焦點后的操作
function calculateUseCount(_this) {
    if($("#readnum_"+_this).val()==null||$("#readnum_"+_this).val()==""){
        return
    }
    var useCount=Number($("#readnum_"+_this).val()) - Number($("#priorCount_"+_this).val()) ;
    $("#useCount_"+_this).val(useCount.toFixed(2));
    console.log($("#contractPrice_"+_this).text())
    console.log($("#rate_"+_this).text())
    //含税金额
    var moneyRate=Number($("#contractPrice_"+_this).text())*(Number($("#readnum_"+_this).val()) - Number($("#priorCount_"+_this).val()))*Number($("#rate_"+_this).text());
    $("#moneyRate_"+_this).val(moneyRate.toFixed(2));
    /**
     * 算税额和不含税金额公式
     * 税额=含税金额-（含税金额/（1+税率））
     * 不含税金额=含税金额/（1+税率）
     * 税额=不含税金额*税率
     */
    if($("#taxRate_"+_this).val()!=null&&$("#taxRate_"+_this).val()!=""){
        //税额
        var tax=moneyRate-(moneyRate/(1+(Number($("#taxRate_"+_this).val())/100)));
        $("#tax_"+_this).val(tax.toFixed(2));
        //不含税金额
        var noMoneyRate=moneyRate-tax;
        $("#noMoneyRate_"+_this).val(noMoneyRate.toFixed(2));
    }
}
/**
 * 输入框保留两位小数
 * @param obj
 */
function clearNoNum(obj) {
    obj.value = obj.value.replace(/[^\d.]/g,""); //清除"数字"和"."以外的字符
    obj.value = obj.value.replace(/^\./g,""); //验证第一个字符是数字而不是
    obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
    obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数

}
function loadingshow(){
    $(".zl-loading").fadeIn();
};

function loadingHide(){
    $(".zl-loading").fadeOut();
}
function isNumberss(num) {
    var pat = new RegExp('^[0-9]+$');
    return pat.test(num)
}

/**
 * 千分位分隔
 * @param num
 * @returns {*|string}
 */
function thousandBitSeparator(num) {
    return num && (num.toString().indexOf('.') != -1 ? num.toString().replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
        return $1 + ",";
    }) : num.toString().replace(/(\d)(?=(\d{3}))/g, function($0, $1) {
        return $1 + ",";
    }));
}

/**
 * 时间戳转换时间格式
 * @param time
 * @returns {*}
 */
function timeGetDate(time){
    // 比如需要这样的格式 yyyy-MM-dd
    var date = new Date(time);
    Y = date.getFullYear() + '-';
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    D = date.getDate() + ' ';
    return Y+M+D;
}
$(document).ready(function(){
    //alert标签样式初始化
    //confirmAlert.init();
    pageView.init();
    console.log($('#zl-floor-main-table'))
});
window.onload=function(){
/*
    $(".zl-loading").fadeOut();
*/
}