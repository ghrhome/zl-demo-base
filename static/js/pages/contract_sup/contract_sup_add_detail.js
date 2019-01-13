/**
 * Created by whobird on 2018/4/16.
 */
var openDate;
var shopData;
var change = false;
var divs = ['rent-div', 'management-div', 'operate-div', 'rent-free-period-div', 'decoration-div', 'promotion-div'];
var tables = ['zl-fixed-rent-table', 'zl-deduct-rent-table', 'zl-both-rent-table', 'zl-fixed-management-table', 'zl-turnover-period-year-marketing-table'];
var allTables = ['zl-fixed-operate-table', 'zl-rent-free-period-table', 'zl-fixed-decoration-table', 'zl-fixed-promotion-table'].concat(tables);
var trs = ['zl-deco-free-tr', 'zl-turnover-period-tr', 'zl-turnover-period-year-tr', 'zl-deduct-management-tr', 'zl-both-management-tr'];
var _selectedCompany = {};
var _selectedStores = {};
var dateParams=[
    {"01":"1日"},{"02":"2日"},{"03":"3日"},{"04":"4日"},{"05":"5日"},{"06":"6日"},{"07":"7日"},{"08":"8日"},{"09":"9日"},
    {"10":"10日"},{"11":"11日"},{"12":"12日"},{"13":"13日"},{"14":"14日"},{"15":"15日"},{"16":"16日"},{"17":"17日"},{"18":"18日"},
    {"19":"19日"},{"20":"20日"},{"21":"21日"},{"22":"22日"},{"23":"23日"},{"24":"24日"},{"25":"25日"},{"26":"26日"},{"27":"27日"},
    {"28":"28日"},{"99":"每月最后一天"}
]
var pageView = (function ($) {

    var pageView = {};

    //$(".zl-select-reform").selectize();

    pageView.datepicker =function () {
        $(".zl-datetimepicker").find("input").datetimepicker({
            format: "yyyy-mm-dd",
            todayBtn: "linked",
            startView: 2,
            minView: 2,
            autoclose: true,
            language: "zh-CN",
            clearBtn: true
        }).on('changeDate', function (e) {
            if ($(this).attr('id') == "contractBeginDate") {
                $("#rentStartDate").val($(this).val());
            }
            console.log(e);
        });
    }

    pageView.loadingShow = function () {
        $(".zl-loading").fadeIn();
    };

    pageView.loadingHide = function () {
        $(".zl-loading").fadeOut();
    }

    pageView.eventInit = function () {
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
                    //feeTablesReset();
                } else {
                    /*var billId = $("#billId").val();
                    if (!(billId == null || billId == undefined || billId == "")) {
                        feeTablesReset();
                    }*/
                    setTables(contractBeginDate, contractEndDate);
                    console.log("===========通知租金生成表单===============");
                    $("body").trigger("timeRangeChange", [contractBeginDate, contractEndDate]);
                }
            }

            //直接将交付时间赋值给合同开始时间
            $('#releasedDate').val(contractBeginDate);
            //所有首期交付日期赋值
            $("input[name$=firstReleasedDate]").val(contractBeginDate);
            $("input[name$=decorateStartDate]").val(contractBeginDate);
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
                    //feeTablesReset();
                } else {
                    /*var billId = $("#billId").val();
                    if (!(billId == null || billId == undefined || billId == "")) {
                        feeTablesReset();
                    }*/
                    // 设置租期时长
                    setTables(contractBeginDate, contractEndDate);
                    $("body").trigger("timeRangeChange", [contractBeginDate, contractEndDate]);
                }
            }
        });

        /**
         * 装修开始日期
         */
        $('#decorateStartDate').datetimepicker().on('changeDate', function (ev) {
            var decorateStartDate = $("#decorateStartDate").val();
            var decorateEndDate = $("#decorateEndDate").val();
            var contractBeginDate = $("#contractBeginDate").val();
            var contractEndDate = $("#contractEndDate").val();

            if (null != decorateStartDate && "" != decorateStartDate) {
                if (decorateStartDate < contractBeginDate) {
                    alert("装修进场日期不能小于合同开始日期！");
                    $(this).val("");
                    $("#decoratePeriod").val("");
                } else if (decorateStartDate > contractEndDate) {
                    alert("装修进场日期不能大于合同结束日期！");
                    $(this).val("");
                    $("#decoratePeriod").val("");
                } else {
                    setPeriodValue(decorateStartDate, decorateEndDate,$("#decoratePeriod"));
                }
            }

        });

        /**
         * 装修结束日期
         */
        $('#decorateEndDate').datetimepicker().on('changeDate', function (ev) {
            var decorateStartDate = $("#decorateStartDate").val();
            var decorateEndDate = $("#decorateEndDate").val();
            var contractEndDate = $("#contractEndDate").val();

            if (null != decorateStartDate && "" != decorateStartDate && null != decorateEndDate && "" != decorateEndDate) {
                if (decorateEndDate < decorateStartDate) {
                    alert("装修结束日期不能小于开始日期！");
                    $(this).val("");
                    $("#decoratePeriod").val("");
                } else if(decorateEndDate > contractEndDate){
                    alert("装修进场日期不能大于合同结束日期！");
                    $(this).val("");
                    $("#openingDate").val("");
                } else {
                    // 设置租期时长
                    setPeriodValue(decorateStartDate, decorateEndDate,$("#decoratePeriod"));
                    var decorateEndDateAfterDay = new Date(decorateEndDate);
                    decorateEndDateAfterDay.setDate(decorateEndDateAfterDay.getDate() + 1);
                    $("#openingDate").val(unix_to_date(decorateEndDateAfterDay));
                    //获取商铺类型 1002为写字楼
                    var shopType = $("#shopType");
                    //物管费 第一个周期的开始时间为 装修结束日+1
                    if ($("#zl-fixed-management-tr tbody").find("tr").length > 0 && shopType != "1002") {
                        //设置了首期结束时间后 第一个区间的第一个间隔年的 起始时间设置为 首期租金结束日+1
                        $("#zl-fixed-management-tr tbody").find("tr").eq(0).find("td").eq(0).find("input[name$=startDate]").val(unix_to_date(decorateEndDateAfterDay));
                    }
                }
            }

        });

        //暂存
        $("#js-temp-save").on("click", function (e) {
            //$(".zl-loading").fadeIn();
            e.preventDefault();
            var mallId = $("#mallId").val();
            if (mallId == null || mallId == "") {
                //$(".zl-loading").fadeOut(); // 隐藏 loading
                alert("请先选择一个项目！");
            } else {
                //standardizeContractSup();
                $(".zl-loading").fadeIn();
                $.ajax({
                    cache: false,
                    type: "POST",
                    url: netcommentWeb_Path + "netcomment/busicond/saveBill.htm",
                    data: $('#billForm').serialize(),
                    dataType: "json",
                    async: true,
                    error: function (request) {
                        alert("系统异常");
                        $(".zl-loading").fadeOut();
                    },
                    success: function (resultData) {
                        console.log(resultData);
                        if (resultData.success) {
                            $(".zl-loading").fadeOut(); // 隐藏 loading
                            /*$("#infoMessage").addClass("active");
                            setTimeout(function () {
                                $("#infoMessage").removeClass("active");
                            },2000);*/
                            //跳转编辑画面
                            //formPost(netcommentWeb_Path + "/netcomment/busicond/toEditView.htm", {masterId: resultData.data,billType:"01"});
                            // formPost(netcommentWeb_Path + "/netcomment/busicond/toContractSupBillDetail.htm", {masterId: resultData.data,billType:"03"});
                        } else {
                            alert("保存失败!");
                            $(".zl-loading").fadeOut(); // 隐藏 loading
                        }
                    }
                });
            }
        });

        //附件
        $("#js-attachment").on("click", function (e) {
            e.preventDefault();
        });
        //发起审批
        $("#js-save").on("click",function(e){
            e.preventDefault();
            if (checkNetForm()) {
                $(".zl-loading").fadeIn();
                $.ajax({
                    cache: false,
                    dataType: "json",
                    type: "POST",
                    url: netcommentWeb_Path + "netcomment/busicond/saveBill.htm",
                    data: $('#billForm').serialize(),
                    async: true,
                    error: function (request) {
                        alert("系统异常!");
                        $(".zl-loading").fadeOut();  // 隐藏 loading
                    },
                    success: function (resultData) {
                        if (resultData.success) {
                            formPost(netcommentWeb_Path + "/netcomment/busicond/toContractSupBillDetail.htm", {masterId: resultData.data});
                        } else {
                            alert("保存失败!");
                            $(".zl-loading").fadeOut();  // 隐藏 loading
                        }
                    }
                });
            }

        });

        $("#lateFeePlus").on("click", function (e) {
            var html = "";
            var index = $("#lateFeePlus").closest("table").find("tbody").find("tr:last").attr("lateId") || 0;
            index = parseInt(index) + 1;
            html += "<tr lateId=" + index + ">"
                + "                        <td class='zl-edit'>"
                + "                            <div class='zl-search-wrapper pull-left'>"
                + "                                <div class='zl-search'>"
                + "                                    <input type='hidden' name='netBusiCondLateFeeList[" + index + "].feeCode' value=''>"
                + "                                    <input type='text' name='netBusiCondLateFeeList[" + index + "].feeName' class='form-control js-account-fee-types' tableFeeType='late' placeholder='费用项'>"
                + "                                </div>"
                + "                            </div>"
                + "                        </td>"
                + "                        <td class='zl-edit'>"
                + "                            <div class='zl-input-wrapper-inline zl-input-wrapper-add-on clearfix'>"
                + "                                <input type='text' name='netBusiCondLateFeeList[" + index + "].lateFeeRate' class='form-control'>"
                + "                                <span class='zl-add-on'>%</span>"
                + "                            </div>"
                + "                        </td>"
                + "                        <td class='zl-edit'>"
                + "                              <div class='zl-input-wrapper-inline zl-input-wrapper-add-on clearfix'>"
                + "                                  <input type='number' name='netBusiCondLateFeeList[" + index + "].gracePeriod' class='form-control'/>"
                + "                                  <span class='zl-add-on'>天</span>"
                + "                              </div>"
                + "                        </td>"
                + "                        <td  class='text-right'>"
                + "                            <span>"
                + "                                <em class='glyphicon glyphicon-minus-sign zl-glyphicon zl-glyphicon-red'></em>"
                + "                            </span>"
                + "                        </td>"
                + "                    </tr>";
            $("#lateFeePlus").closest("table").find("tbody").append(html);
            registerRemove($("#lateFeePlus").closest("table").find("tbody"));
            registerFeeType($("#lateFeePlus").closest("table").find("tbody"));
        });

        $("#collectionPlus").on("click", function (e) {
            var html = "";
            var index = $("#collectionPlus").closest("table").find("tbody").find("tr:last").attr("collectId") || 0;
            index = parseInt(index) + 1;
            html += "<tr collectId=" + index + ">"
                + "                        <td class='zl-edit'>"
                + "                            <div class='zl-search-wrapper pull-left'>"
                + "                                <div class='zl-search'>"
                + "                                    <input type='hidden' name='netBusiCondCollectList[" + index + "].feeCode' value='' >"
                + "                                    <input type='text' class='form-control js-account-fee-types' name='netBusiCondCollectList[" + index + "].feeName' tableFeeType='coll' placeholder='费用项'>"
                + "                                </div>"
                + "                            </div>"
                + "                        </td>"
                + "                        <td class='zl-edit '>"
                + "                            <div class='zl-input-wrapper-inline zl-input-wrapper-add-on clearfix'>"
                + "                                  <input type='text' name='netBusiCondCollectList[" + index + "].payeeName' class='form-control'> "
                + "                            </div>"
                + "                        </td>"
                + "                        <td class='zl-edit '>"
                + "                            <div class='zl-input-wrapper-inline zl-input-wrapper-add-on clearfix'>"
                + "                                  <input type='text' name='netBusiCondCollectList[" + index + "].openBank' class='form-control'>"
                + "                            </div>"
                + "                        </td>"
                + "                        <td class='zl-edit '>"
                + "                            <div class='zl-input-wrapper-inline zl-input-wrapper-add-on clearfix'>"
                + "                                  <input type='text' name='netBusiCondCollectList[" + index + "].bankAccountId' class='form-control'>"
                + "                            </div>"
                + "                        </td>"
                + "                        <td  class='text-right'>"
                + "                            <span>"
                + "                                <em class='glyphicon glyphicon-minus-sign zl-glyphicon zl-glyphicon-red' ></em>"
                + "                            </span>"
                + "                        </td>"
                + "                    </tr>";
            $("#collectionPlus").closest("table").find("tbody").append(html);
            registerRemove($("#collectionPlus").closest("table").find("tbody"));
            registerFeeType($("#collectionPlus").closest("table").find("tbody"));
            $("#collectionPlus").closest("table").find("tbody").find(".zl-dropdown-inline").ysdropdown("init");
        });

        $("#otherFeePlus").on("click", function (e) {

            var html = "";
            var index = $("#otherFeePlus").closest("table").find("tbody").find("tr:last").attr("otherId") || 0;
            index = parseInt(index) + 1;
            //下拉日期
            var str="";
            // var params=JSON.parse($("#params").val());
            console.log(params);
            $.map(dateParams,function (obj) {
                $.each(obj,function (key,value) {
                    if(key!=null&&key!=undefined&&key!=""){
                        str+="<li><a data-value="+key+">"+value+"</a></li>"
                    }
                });
            });
            html += "<tr otherId=" + index + ">"
                + "                            <td class='zl-edit'>"
                + "                            <div class='zl-search-wrapper pull-left'>"
                + "                                <div class='zl-search'>"
                + "                                    <input type='hidden' name='netBusiCondOtherFeeList[" + index + "].feeCode' value='' >"
                + "                                    <input type='text' class='form-control js-account-fee-types' name='netBusiCondOtherFeeList[" + index + "].feeName' tableFeeType='other' placeholder='费用项'>"
                + "                                </div>"
                + "                            </div>"
                + "                            </td>"
                + "                            <td class='zl-edit '>"
                + "                                <div class='btn-group zl-dropdown-inline'>"
                + "                                <input type='hidden' name='netBusiCondOtherFeeList[" + index + "].accountType' value='0'>"
                + "                                    <button type='button' class='btn btn-default dropdown-toggle zl-btn zl-dropdown-btn'"
                + "                                            data-toggle='dropdown'>"
                + "                                        周期<span class='span-more'></span>"
                + "                                    </button>"
                + "                                    <ul class='dropdown-menu'>"
                + "                                        <li><a  data-value='0' onclick='changeOtherAccountType(this);'>周期</a></li>"
                + "                                        <li><a  data-value='1' onclick='changeOtherAccountType(this);'>一次性</a></li>"
                + "                                    </ul>"
                + "                                </div>"
                + "                            </td>"
                /*+ "                            <td class='zl-edit '>"
                + "                                <div class='btn-group zl-dropdown-inline'>"
                + "                                <input type='hidden' name='netBusiCondOtherFeeList[" + index + "].feeCycle' >"
                + "                                    <button type='button' class='btn btn-default dropdown-toggle zl-btn zl-dropdown-btn' data-toggle='dropdown'>"
                + "                                        请选择<span class='span-more'></span>"
                + "                                    </button>"
                + "                                    <ul class='dropdown-menu'>"
                + "                                        <li><a  data-value='1'>按月</a></li>"
                + "                                        <li><a  data-value='0'>一次性</a></li>"
                + "                                    </ul>"
                + "                                </div>"
                + "                            </td>"*/
                + "                            <td class='zl-edit zl-form-group-datetime accountDateType' style='display: none'>"
                + "                                <div class='input-group zl-datetimepicker' style='width:100%;'>"
                + "                                    <input type='text' class='form-control' name='netBusiCondOtherFeeList[" + index + "].accountDate'>"
                + "                                </div>"
                + "                            </td>"
                + "                            <td class='zl-edit payCycleApplyType'>"
                + "                                <div class='btn-group zl-dropdown-inline'>"
                + "                                <input type='hidden' name='netBusiCondOtherFeeList[" + index + "].payCycleApply' value='0'>"
                + "                                    <button type='button' class='btn btn-default dropdown-toggle zl-btn zl-dropdown-btn' data-toggle='dropdown'>"
                + "                                        请选择<span class='span-more'></span>"
                + "                                    </button>"
                + "                                    <ul class='dropdown-menu'>"
                +                                           str
                + "                                    </ul>"
                + "                                </div>"
                + "                            </td>"
                + "                            <td class='zl-edit'>"
                + "                                <input type='number' name='netBusiCondOtherFeeList[" + index + "].accountMoney' placeholder='-' maxlength='9'>"
                + "                            </td>"
                + "                            <td class='zl-edit'>"
                + "                                <input type='text' name='netBusiCondOtherFeeList[" + index + "].taxRate' readonly='readonly' placeholder='-' >"
                + "                            </td>"
                + "                            <td class='text-right'>"
                + "                                  <span>"
                + "                                       <em class='glyphicon glyphicon-minus-sign zl-glyphicon zl-glyphicon-red'></em>"
                + "                                  </span>"
                + "                            </td>"
                + "                        </tr>";
            $("#otherFeePlus").closest("table").find("tbody").append(html);
            registerRemove($("#otherFeePlus").closest("table").find("tbody"));
            registerFeeType($("#otherFeePlus").closest("table").find("tbody"));
            //注册时间控件
            registerTimePicker($("#otherFeePlus").closest("table").find("tbody"));
            //注册下拉选择控件
            $("#otherFeePlus").closest("table").find("tbody").find(".zl-dropdown-inline").ysdropdown("init");
            //注册下拉选择
            // $(".zl-dropdown-inline").ysdropdown("init");
        });



        $(".zl-glyphicon-red").on("click", function (e) {
            $(this).parents("tr").remove();
        });

        //物管申请费用注册
        $("#zl-fixed-management-table tbody").on("input", "input[name$=apply],input[name$=taxRate]", function () {
            $(".removeDisabled").attr("disabled",false);
            calcFixedTable(this, "02");
            $(".removeDisabled").attr("disabled",true);
        });

        //固定租金事件注册
        $("#js-rental-table-wrapper").on("input", "input[name$=apply],input[name$=totalMonth]", function () {
            $(".removeDisabled").attr("disabled",false);
            calcFixedTable(this, "01");
            $(".removeDisabled").attr("disabled",true);
        });

        //空调服务费事件注册
        $("#zl-fixed-cond-table tbody").on("input", "input[name$=apply],input[name$=taxRate]", function () {
            $(".removeDisabled").attr("disabled",false);
            calcFixedTable(this, "07");
            $(".removeDisabled").attr("disabled",true);
        });

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

    pageView.swiperInit = function () {
        new Swiper('.swiper-container', {
            scrollbar: '.swiper-scrollbar-a',
            direction: 'horizontal',
            slidesPerView: 'auto',
            //mousewheelControl: true,
            freeMode: true,
            scrollbarHide: false,
            preventClicksPropagation: false,
            observer: true,
            observeParents: true
        });
    }

    pageView.dateRangeInit = function () {
        var _startTimestamp = 0, _endTimestamp = 0;
        var dateStart = $("#rental-term-add").find("input.js-date-start").datetimepicker({
            format: "yyyy-mm-dd",
            todayBtn: "linked",
            startView: 2,
            minView: 2,
            autoclose: true,
            language: "zh-CN",
            clearBtn: true
        }).on('changeDate', function (e) {

            var _startDate = $(this).val();
            _startTimestamp = e.timeStamp;
            if (_startDate) {
                dateEnd.datetimepicker("setStartDate", _startDate);
            } else {
                dateEnd.datetimepicker("setStartDate", null);
            }
            /*if(_endTimestamp<_startTimestamp){
                dateEnd.val("");
            }*/
            dateEnd.datetimepicker("update");
        });

        var dateEnd = $("#rental-term-add").find("input.js-date-end").datetimepicker({
            format: "yyyy-mm-dd",
            todayBtn: "linked",
            startView: 2,
            minView: 2,
            autoclose: true,
            language: "zh-CN",
            clearBtn: true
        }).on('changeDate', function (e) {
            _endTimestamp = e.timeStamp;
        });


        var decorationFreeStartDate = "";
        var decorationFreeEndDate = "";
        var decorationFreeStart = $("#decorationFreeRange").find("input.js-date-start").datetimepicker({
            format: "yyyy-mm-dd",
            todayBtn: "linked",
            startView: 2,
            minView: 2,
            autoclose: true,
            language: "zh-CN",
            clearBtn: true
        }).on('changeDate', function (e) {
            console.log($(this).val());
            decorationFreeStartDate = $(this).val();
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

        var decorationFreeEnd = $("#decorationFreeRange").find("input.js-date-end").datetimepicker({
            format: "yyyy-mm-dd",
            todayBtn: "linked",
            startView: 2,
            minView: 2,
            autoclose: true,
            language: "zh-CN",
            clearBtn: true
        }).on('changeDate', function (e) {
            decorationFreeEndDate = $(this).val();
            if (null != decorationFreeStartDate && "" != decorationFreeStartDate && null != decorationFreeEndDate && "" != decorationFreeEndDate) {
                if (decorationFreeEndDate < decorationFreeStartDate) {
                    alert("装修期免租结束日期不能小于开始日期！");
                    $(this).val("");
                } else {
                    // 设置装修免租期
                    var days = getFreeDays(decorationFreeStartDate, decorationFreeEndDate);
                    $("#decorationFreePeriod").val(days);
                    console.log(days);
                }
            }
        });
    }

    pageView.init = function () {
        $("#preloader").fadeOut("fast");
        pageView.datepicker();
        pageView.eventInit();
        pageView.dateRangeInit();
        pageView.swiperInit();
        pageView.fileupload();
        $(".zl-dropdown-inline").ysdropdown("init");

        //计租面积 选择框 选中事件
        $("#squareTypeChoose").ysdropdown({
            callback: function (value) {
                var structureSquare = $("#structureSquare").val();
                var innerSquare = $("#innerSquare").val();
                var contractBeginDate = $("#contractBeginDate").val();
                var contractEndDate = $("#contractEndDate").val();
                if (structureSquare != null && structureSquare != ""
                    && innerSquare != null && innerSquare != ""
                    && contractBeginDate != null && contractBeginDate != ""
                    && contractEndDate != null && contractEndDate != "") {
                    reComputerManager();
                    reComputerRent();
                    reComputerConditioner();
                    //重新计算推广费

                }
            }
        });

        //品牌选择注册事件
        $("#brandChoose").ysdropdown({
            callback: function (value, $elem) {
                //console.log(value);
                //console.log($elem.find("button").text());
                var brandId = value;
                if (brandId == "" || !brandId) {
                    return false;
                }
                $("#brandId").val(brandId);
                $("#brandName").val($elem.find("button").text());
                $.ajax({
                    url: netcommentWeb_Path + "netcomment/getIbBrandDetail.htm",
                    type: "POST",
                    data: {id: brandId},
                    cache: false,
                    async: true,
                    success: function (data) {
                        //console.log(data);
                        data = data.replace(/\\n/g, "").replace(/\\r/g, "").replace(/\\v/g, "");
                        try {
                            data = JSON.parse(data);
                        } catch (e) {
                            data = JSON.parse(data.replace(/\\/g, ""));
                        }
                        $("#brandLayout").val(data.bsLayoutDict.dictName);
                        $("#leaseLayout").val(data.bsLayoutDict.id);
                        $("#propertyCodes").val(data.bsLayoutDict.dictCode);
                    }
                })
            }
        });

    };

    //附件上传
    pageView.fileupload = function () {
        $("#uploadFile").fileupload({
            pasteZone: null,
            url: netcommentWeb_Path + "/netcomment/fileUpload.htm",
            dataType: 'json',
            add: function (e, data) {
                pageView.uploadFiles(data.files[0], function (item) {
                    data.formData = {path: item};
                    data.submit();
                });

            },
            progressall: function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $('#progress .progress-bar').css(
                    'width',
                    progress + '%'
                );
            },
            success: function (result, textStatus, jqXHR) {
                result = result.data;
                var html =
                    '<li class="row">' +
                    '<span class="col-md-4">' +
                    '<em class="zl-em-icon zl-icon-attachment"></em>' +
                    '<a href="' + accessUrl + result.attachmentPath + '" target="_blank" class="zl-attach-file-link">' + result.attachmentName + '</a>' +
                    '</span><span class="col-md-2">' + result.createrName + '</span>' +
                    '<span class="col-md-4">' + new Date(result.createdDate).toLocaleDateString() + '</span>' +
                    '<span class="col-md-2" style="text-align: center;"><a onclick="pageView.deleteFile(this, ' + result.id + ')" class="zl-attach-del" style="cursor: pointer;">删除</a></span>' +
                    '</li>';
                $(html).appendTo('#files');

                var attachments = "<input type='text' id='attachments_" + result.id + "' name='attachments' value='" + result.id + "' />";
                $(attachments).appendTo('#attachmentDiv');
                // var attachmentSize = $("#attachmentSize_" + $("#uploadFile").attr("progressId"));
                // attachmentSize.text(parseInt(attachmentSize.text()) + 1);
            }
        }).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');
    }


    pageView.uploadFiles = function (file, callback) {
        var formData = new FormData();
        formData.append("action", "1002");
        formData.append("single", 1);
        formData.append("category", "net_lease_contract");
        formData.append("targetId", '');
        formData.append('file', file);
        $.ajax({
            url: fileWeb_Path + 'sdk/platform/file',
            type: 'POST',
            dataType: "json",
            cache: false,
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.success) {
                    if (typeof callback === "function") {
                        callback(response.data.path);
                    }
                }
            }
        });
    }

    //附件删除
    pageView.deleteFile = function (_this, id) {
        if (confirm("确认删除？")) {
            $.ajax({
                //url: "delAttachmentFile.htm",
                url: netcommentWeb_Path + "netcomment/deleteFile.htm",
                type: "POST",
                data: {id: id},
                success: function (result) {
                    result = eval("(" + result + ")");
                    if (result.code == 0) {
                        $(_this).parent().parent().remove();
                        $("#attachments_" + id).remove();
                    } else {
                        alert("删除失败");
                    }
                },
                error: function (resp) {
                    showMsg(resp);
                }
            })
        }
    }

    return pageView;

})(jQuery);

// $(document).ready(function () {
//     initDiv([]);
//     pageView.init();
//     $.ajax({
//         cache: true,
//         type: "POST",
//         dataType: "json",
//         data: {mallId: ""},
//         url: netcommentWeb_Path + "netcomment/selectFeeType.htm",
//         async: true,
//         error: function (request) {
//             alert("系统异常");
//         },
//         success: function (resultData) {
//             if (resultData) {
//                 var availableTags = resultData.data;
//                 console.log(availableTags);
//                 $("body").data("_feeTypeList", availableTags);
//                 $(".js-account-fee-types").autocomplete({
//                     source: availableTags,
//                     minLength: 0,
//                     select: function (event, ui) {
//                         var feeCode = ui.item.value;
//                         console.log(feeCode);
//                         this.value = ui.item.label;
//                         return false;
//                     }
//                 });
//             }
//         }
//     });
//
//
//     //初始化选择租户和选择租赁区域控件
//     selectShopList.init("", "single");
//     selectUnit.init("", "multi");
//     // 编辑用  激活租户和选择租赁区域控件
//     var mallId = $("#mallId").val();
//     if (mallId != null && mallId != "") {
//         initStoreAndCompanyInfo(mallId);
//     }
// });


function  changeOtherAccountType (li) {
    var accountType = $(li).attr("data-value");
    if (accountType == "0") {
        //费用类型：周期
        $(li).parents("tr").find(".payCycleApplyType").css('display','block');
        $(li).parents("tr").find(".payCycleApplyType").find("input,select").removeAttr("disabled");
        $(li).parents("tr").find(".accountDateType").css('display','none');
        $(li).parents("tr").find(".accountDateType").find("input,select").attr("disabled", "disabled");
    } else {
        //费用类型：一次性
        $(li).parents("tr").find(".accountDateType").css('display','block');
        $(li).parents("tr").find(".accountDateType").find("input,select").removeAttr("disabled");
        $(li).parents("tr").find(".payCycleApplyType").css('display','none');
        $(li).parents("tr").find(".payCycleApplyType").find("input,select").attr("disabled", "disabled");
        //注册时间控件
        registerTimePicker($(li).parents("tr"));
    }
    //alert(accountType);
}

function registerRemove(panel) {
    $(panel).find(".zl-glyphicon-red").on("click", function (e) {
        $(this).parents("tr").remove();
    });
}

function registerFeeType(panel) {
    var availableTags = $("body").data("_feeTypeList");
    var mallId = $("#mallId").val();
    $(panel).find(".js-account-fee-types").autocomplete({
        source: availableTags,
        minLength: 0,
        select: function (event, ui) {
            var feeCode = ui.item.value;
            console.log(feeCode);
            this.value = ui.item.label;
            var tableFeeType = $(event.target).attr("tableFeeType");
            $.ajax({
                cache: true,
                type: "POST",
                dataType: "json",
                data: {feeCode: feeCode, mallId: mallId, tableFeeType: tableFeeType},
                url: netcommentWeb_Path + "netcomment/selectFeeInfoByCode.htm",
                async: true,
                error: function (request) {
                    alert("系统异常");
                },
                success: function (resultData) {
                    if ("late" == tableFeeType) {
                        $(event.target).parents("tr").find("input[name$=lateFeeRate]").val(resultData.data.value);
                        $(event.target).parents("tr").find("input[name$=gracePeriod]").val(resultData.data.label);
                        $(event.target).parents("tr").find("input[name$=feeCode]").val(feeCode);
                    }
                    if ("coll" == tableFeeType) {
                        $(event.target).parents("tr").find("input[name$=payeeName]").val(resultData.data.value);
                        $(event.target).parents("tr").find("input[name$=openBank]").val(resultData.data.label);
                        $(event.target).parents("tr").find("input[name$=bankAccountId]").val(resultData.data.proees);
                        $(event.target).parents("tr").find("input[name$=feeCode]").val(feeCode);
                    }
                    if ("other" == tableFeeType) {
                        $(event.target).parents("tr").find("input[name$=taxRate]").val(resultData.data.tax);
                        $(event.target).parents("tr").find("input[name$=feeCode]").val(feeCode);
                    }

                }
            });
            return false;
        }
    });
}

/**
 * 根据选择的项目，设置开业时间
 *
 * @param obj
 * @param text
 */
function selectMall(obj) {
    var mallId = $(obj).attr("key");
    var orgMallId = $("#mallId").val();

    /*if (mall != "" && orgMallId != "" && mallId != orgMallId) {
        //项目如果不一致 则清空页面详情数据

    }*/

    $("#mallName").val($(obj).text());
    $("#mallId").val(mallId);


    /*if (mallId != null && mallId != "") {
        $(".contract_change_radio_group").find("input[name$=Radio]").removeAttr("disabled");
    }*/
}

function _setStoresInput(_selectedShops) {
    var _nameList = [];
    var storeNames = "";
    var storeIdsExt = "";
    var structureSquareTotal = 0;
    var propertySquareTotal = 0;
    var propertySquare = 0;
    var structureSquare = 0;
    var issuingLayoutNames = "";
    var storeIdArr = [];
    $.each(_selectedShops, function (id, shop) {
        _nameList.push(shop.name);
        storeNames += shop.name + ";";
        storeIdsExt += shop.id + ",";
        propertySquare = shop.propertySquare;
        structureSquare = shop.structureSquare;
        propertySquareTotal += parseFloat(propertySquare);
        structureSquareTotal += parseFloat(structureSquare);
        //业态
        issuingLayoutNames = shop.issuingLayout;
        storeIdArr.push(shop.id);
        //console.log("structureSquare:" + shop.structureSquare);
    });
    $("#storeNos").val(storeIdsExt);
    $("#storeNames").val(storeNames);
    $("#storeNamesShow").val(storeNames);
    $("#structureSquare").val(structureSquareTotal.toFixed(2));
    $("#feechangestructureSquare").val(structureSquareTotal.toFixed(2));
    $("#innerSquare").val(propertySquareTotal.toFixed(2));
    $("#feechangeinnerSquare").val(propertySquareTotal.toFixed(2));
    $("#issuingLayout").val(issuingLayoutNames);
    $("body").data("_storeIds", storeIdArr);
    //console.log(_nameList);
    //验证铺位税率是否一样
    // storeTaxIsEqual($("#storeNos").val());
}

//验证铺位税率是否一样,不一样不允许添加
function storeTaxIsEqual(storeNos) {
    pageView.loadingShow();
    $.ajax({
        url: netcommentWeb_Path + "netcomment/busicond/getTaxRate.htm",
        type: "POST",
        dataType:"json",
        data: {storeId: storeNos},
        cache: false,
        async: true,
        success: function (data) {
            //console.log(data);
            // var resultData = eval('(' + data + ')');
            // $("#managementTaxRate").val(resultData.managerTaxRate);
            // $("#rentTaxRate").val(resultData.rentTaxRate);
            // $("#proTaxRate").val(resultData.proTaxRate);
            if(data.code==1){
                $("#storeNos").val("");
                $("#storeNames").val("");
                $("#storeNamesShow").val("");
                $("#structureSquare").val("");
                $("#innerSquare").val("");
                $("#issuingLayout").val("");
                $("body").data("_storeIds", "");
                alert(data.msg);
            }
            pageView.loadingHide();
        }
    });
}

function _setCompanyInput(_selectedCompany) {

    var companyId = "";
    //console.log(_selectedCompany.length);
    //console.log(_selectedCompany)

    $.each(_selectedCompany, function (id, company) {
        $("#companyName").val(company.name);
        $("#companyId").val(company.id);
        companyId = company.id;
    });

    if (companyId != null && companyId != "") {
        // 查询品牌详情
        $.ajax({
            cache: false,
            type: "POST",
            dataType: "json",
            url: netcommentWeb_Path + "netcomment/getIbCompanyDetail.htm",
            data: {id: companyId},
            error: function (request) {
                alert("系统异常");
            },
            success: function (resultData) {
                console.log(resultData);
                var ibBrands = resultData.ibBrands;
                var result = [];
                if (ibBrands && ibBrands.length > 0) {
                    for (var i = 0; i < ibBrands.length; i++) {
                        var brand = ibBrands[i];
                        var option = {};
                        var key = brand.id;
                        var value = brand.brandName;
                        option['value'] = key;
                        option['text'] = value;
                        result.push(option);
                    }
                }

                //乙方或者丙方开票信息
                // if (resultData.openingBank != null && resultData.openingBank != '') {
                    var creditCode = resultData.workTel;//ibCompanyPayeeList[0].tax;
                    var payee = resultData.businessLicense;//ibCompanyPayeeList[0].payee;
                    var bankName = resultData.openingBank;//ibCompanyPayeeList[0].bankName;
                    var accountNo = resultData.bankAccount;//ibCompanyPayeeList[0].accountNo;
                    var taxCategoryName = resultData.taxCategory == "1002" ? "一般纳税人":"小规模纳税人";
                    //initCompanyContBank(resultData);
                    if (typeof payee === 'undefined' ) {
                        payee = "";
                    }
                    if (typeof payee === 'undefined' ) {
                        bankName = "";
                    }
                    if (typeof payee === 'undefined') {
                        accountNo = "";
                    }
                    if (typeof payee === 'undefined') {
                        taxCategoryName = "";
                    }
                    $("#companyPayee").val(payee);
                    $("#companyBankName").val(bankName);
                    $("#companyCreditCode").val(creditCode);
                    $("#companyAccountNo").val(accountNo);
                    $("#companyAddress").val(accountNo);
                    $("#companyTel").val(accountNo);
                    //纳税类别
                    $("#companyTaxCategoryName").val(taxCategoryName);
                // }
                console.log(result);
                //$("#companyName")
                var html = "";
                $(result).each(function () {
                    var value = this['value'];
                    var brandName = this['text'];
                    html += "<li><a data-value='" + value + "'>" + brandName + "</a></li>";
                    console.log(html);
                });
                $("#brandChoose .dropdown-menu").html("");
                $("#brandChoose .dropdown-menu").append(html);
                $("#brandNameShow").html("");
                $("#brandId").val("");
                $("#brandName").val("");
                $("#brandLayout").val("");
                $("#leaseLayout").val("");
                $("#propertyCodes").val("");
                //重新注册 选择品牌事件
                $("#brandChoose").ysdropdown({
                    callback: function (value, $elem) {
                        //console.log(value);
                        //console.log($elem.find("button").text());
                        var brandId = value;
                        if (brandId == "" || !brandId) {
                            return false;
                        }
                        $("#brandId").val(brandId);
                        $("#brandName").val($elem.find("button").text());
                        $.ajax({
                            url: netcommentWeb_Path + "netcomment/getIbBrandDetail.htm",
                            type: "POST",
                            data: {id: brandId},
                            cache: false,
                            async: true,
                            success: function (data) {
                                //console.log(data);
                                data = data.replace(/\\n/g, "").replace(/\\r/g, "").replace(/\\v/g, "");
                                try {
                                    data = JSON.parse(data);
                                } catch (e) {
                                    data = JSON.parse(data.replace(/\\/g, ""));
                                }
                                $("#brandLayout").val(data.bsLayoutDict.dictName);
                                $("#leaseLayout").val(data.bsLayoutDict.id);
                                $("#propertyCodes").val(data.bsLayoutDict.dictCode);
                            }
                        })
                    }
                });
                //$("#brandNameShow")[0].selectize.clearOptions();
                //$("#brandNameShow")[0].selectize.addOption(result);
            }
        });
    }
}

function mallReset() {
    //清空商家
    $("#companyId").val("");
    $("#companyName").val("");
    //清空品牌
    $("#brandId").val("");
    $("#brandName").val("");
    $("#brandNameShow").html("");
    $("#brandChoose .dropdown-menu").html("");
    //$("#shopType").val("");
    $("#issuingLayout").val("");
    $("#signTypeShow").val("");
    $("#signType").val("");
    //$("[name=shopTypeShow]:checked").iCheck("uncheck");
    $("#brandLayout").val("");
    $("#storeNos").val("");
    $("#storeNames").val("");
    $("#storeNamesShow").val("");
    $("#propertyIds").val("");
    $("#propertyCodes").val("");
    $("#structureSquare").val("");
    $("#innerSquare").val("");
    $("#contractBeginDate").val("");
    $("#contractEndDate").val("");
    $("#rentStartDate").val("");
    $("#tenancy").val("");
    //$("#storeNamesShow").ysUnStoreSelect();
    $("#leaseLayout").val("");
    $("#releasedDate").val("");
    feeTablesReset();
}

function feeTablesReset() {
    for (var i = 0; i < allTables.length; i++) {
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
 * 铺位选择回调
 */
function storeSelectorCallBack() {
    var storeIds = $("body").data("_storeIds");
    if (storeIds == null || storeIds.length == 0) {
        if ($("#storeNos").val() && $("#storeNos").val() != "") {
            storeIds = $("#storeNos").val().split(",");
            storeIds = storeIds.slice(0, (storeIds.length - 1));
            $("body").data("_storeIds", storeIds);
        }
    }
    var contractBeginDate = $("#contractBeginDate").val();
    var contractEndDate = $("#contractEndDate").val();

    /*var structureSquareTotal = 0;

    if (!(storeIds && storeIds.length > 0 && contractBeginDate && contractEndDate)) {
        return false;
    }

    var storeId = 0;
    for (var i = 0; i < storeIds.length; i++) {
        var store = $("body").data("_store_" + storeIds[i]);
        if (!calcPackagePrice(store, contractBeginDate)) {
            return false;
        }
        if (!storeId) {
            storeId = storeIds[i];
        }
        structureSquareTotal += store.structureSquare;
    }*/
    var store = {};
    calcPackagePrice(store, contractBeginDate);


    /*$.ajax({
        url: netcommentWeb_Path + "netcomment/busicond/getTaxRate.htm",
        type: "POST",
        data: {storeId: storeId},
        cache: false,
        async: true,
        success: function (data) {
            //console.log(data);
            var resultData = eval('(' + data + ')');
            $("#managementTaxRate").val(resultData.managerTaxRate);
            $("#rentTaxRate").val(resultData.rentTaxRate);
            $("#proTaxRate").val(resultData.proTaxRate);
            $("#condTaxRate").val(resultData.condTaxRate);
        }
    });*/

    /*var contractAvgArr = [];
    var years = $("body").data("_store_" + storeIds[0]).contractArr.length;

    //根据面积加权求平均
    for (var i = 0; i < years; i++) {
        var rentStandardTotal = 0;
        var managementStandardTotal = 0;
        var contractAvg = {};

        //单位 元/平米/月
        contractAvg.rentStandard = rentStandardTotal / structureSquareTotal;
        contractAvg.managementStandard = managementStandardTotal / structureSquareTotal;
        contractAvgArr.push(contractAvg);
    }

    console.log(contractAvgArr);*/
    populateTables(store.contractArr);
    //displayDivs($("body").data("_showDivs"));
}

/**
 * 铺位选择回调 计算面积差异比
 */
function storeSelectorCallBackForSquareDiff() {
    //清空差异化 数值
    $("#structureSquareRemark").val("");
    var squareType = $("#squareType").val();
    var beforeStoreNames = $("#beforeChangeStoreNames").val();
    var storeNames = $("#storeNames").val();
    var beforeChangeStructureSquare = isNaN($("#beforeChangeStructureSquare").val())?0:parseFloat($("#beforeChangeStructureSquare").val());
    var structureSquare = isNaN($("#structureSquare").val())?0:parseFloat($("#structureSquare").val());
    var beforeChangeInnerSquare = isNaN($("#beforeChangeInnerSquare").val())?0:parseFloat($("#beforeChangeInnerSquare").val());
    var innerSquare = isNaN($("#innerSquare").val())?0:parseFloat($("#innerSquare").val());
    if (beforeStoreNames == storeNames) {
        var squareDiff = 0;
        //当铺位未发生变化时 计算面积差异
        if (squareType == 0) {
            squareDiff = (structureSquare - beforeChangeStructureSquare)/beforeChangeStructureSquare;
        } else {
            squareDiff = (innerSquare - beforeChangeInnerSquare)/beforeChangeInnerSquare;
        }
        squareDiff = squareDiff.toFixed(2);
        $("#structureSquareRemark").val(squareDiff);
    } /*else {
        $("#structureSquareRemark").parents("tr").remove();
    }*/
}

//重新计算各表单中的费用
function populateTables(contracts) {
    populateManager(contracts);
    populateConditioner(contracts);
}

function populateFixed(contracts) {

}

function populateBond(contracts) {
    //保证金
    var selector = "#zl-netcomment-bond-table tbody";
    $(selector).html("");
    var html = "";
    var index = 0;
    for (var i = 0; i < contracts.length; i++) {
        if (i == 0) {
            var str="";
            var params=JSON.parse($("#params").val());
            $.each(params,function (key,value) {
                if(key!=null&&key!=undefined&&key!=""){
                    str+="<li><a data-value="+key+">"+value+"</a></li>"
                }
            });
            html += "<tr class='rent-bond'>"
                + "<th>租赁保证金</th>"
                + "<td><span>第" + (i + 1) + "年</span></td>"
                + "<input type='hidden' name='netBusiCondBondList[" + i + "].year' value='" + (i + 1) + "' readonly/>"
                + "<td class='zl-edit required' title='保证金'>"
                + "<input type='text' class='form-control' name='netBusiCondBondList[" + i + "].bond' value='' placeholder='-' maxlength='10'>"
                + "<input type='hidden' class='form-control' name='netBusiCondBondList[" + index + "].bondCode' value='1006' placeholder='-'>"
                + "<input type='hidden' class='form-control' name='netBusiCondBondList[" + index + "].bondName' value='租赁保证金' placeholder='-'>"
                + "</td>"
                + "<th>应收日期</th>"
                // + "<td class=\"zl-edit required\" title=\"保证金应收日期\">\n"
                // + "<div class=\"btn-group zl-dropdown-inline\">\n"
                // + "<input name='netBusiCondBondList[" + i + "].receivableDate' type=\"hidden\">\n"
                // + "<button type=\"button\" class=\"btn btn-default dropdown-toggle zl-btn zl-dropdown-btn\" data-toggle=\"dropdown\" id=\"js-payment-deadline\">\n"
                // + "  请选择"
                // + " <span class=\"span-more\"></span>\n"
                // + "</button>\n"
                // + "<ul class=\"dropdown-menu\">"
                // +str
                // + "</ul>\n"
                // + "</div>\n"
                // + "</td>"
                // + "</tr>";
                + "<td class='zl-edit zl-form-group-datetime required' title='保证金应收日期'>"
                + "<div class='input-group zl-datetimepicker'  style='width:100%;'>"
                + "<input type='text' class='form-control' name='netBusiCondBondList[" + i + "].receivableDate' value=''></div>"
                + "</td>"
                + "</tr>";
        } else {
            var str="";
            var params=JSON.parse($("#params").val());
            $.each(params,function (key,value) {
                if(key!=null&&key!=undefined&&key!=""){
                    str+="<li><a data-value="+key+">"+value+"</a></li>"
                }
            });
            html += "<tr class='rent-bond'>"
                + "<th></th>"
                + "<td><span>第" + (i + 1) + "年</span></td>"
                + "<input type='hidden' name='netBusiCondBondList[" + i + "].year' value='" + (i + 1) + "' readonly/>"
                + "<td class='zl-edit required' title='保证金'>"
                + "<input type='text' class='form-control' name='netBusiCondBondList[" + i + "].bond' value='' placeholder='-' maxlength='10'>"
                + "<input type='hidden' class='form-control' name='netBusiCondBondList[" + index + "].bondCode' value='1006' placeholder='-'>"
                + "<input type='hidden' class='form-control' name='netBusiCondBondList[" + index + "].bondName' value='租赁保证金' placeholder='-'>"
                + "</td>"
                + "<th>应收日期</th>"
                // + "<td class=\"zl-edit required\" title=\"保证金应收日期\">\n"
                // + "<div class=\"btn-group zl-dropdown-inline\">\n"
                // + "<input name='netBusiCondBondList[" + i + "].receivableDate' type=\"hidden\">\n"
                // + "<button type=\"button\" class=\"btn btn-default dropdown-toggle zl-btn zl-dropdown-btn\" data-toggle=\"dropdown\" id=\"js-payment-deadline\">\n"
                // + "  请选择"
                // + " <span class=\"span-more\"></span>\n"
                // + "</button>\n"
                // + "<ul class=\"dropdown-menu\">\n"
                // + str
                // + "</ul>\n"
                // + "</div>\n"
                // + "</td>"
                // + "</tr>";
                + "<td class='zl-edit zl-form-group-datetime required' title='保证金应收日期'>"
                + "<div class='input-group zl-datetimepicker ' style='width:100%;'>"
                + "<input type='text' class='form-control' name='netBusiCondBondList[" + i + "].receivableDate' value=''></div>"
                + "</td>"
                + "</tr>";
        }
        index++;
    }
    var str="";
    var params=JSON.parse($("#params").val());
    $.each(params,function (key,value) {
        if(key!=null&&key!=undefined&&key!=""){
            str+="<li><a data-value="+key+">"+value+"</a></li>"
        }
    });
    html += "<tr>"
        + "<th>质量保证金</th>"
        + "<td class='zl-edit required' colspan='2' title='保证金'>"
        + "<input type='text' class='form-control' name='netBusiCondBondList[" + index + "].bond' value='' placeholder='-' maxlength='10'>"
        + "<input type='hidden' class='form-control' name='netBusiCondBondList[" + index + "].bondCode' value='9' placeholder='-'>"
        + "<input type='hidden' class='form-control' name='netBusiCondBondList[" + index + "].bondName' value='质量保证金' placeholder='-'>"
        + "</td>"
        + "<th>应收日期</th>"
        // + "<td class=\"zl-edit required\" title=\"保证金应收日期\">\n"
        // + "<div class=\"btn-group zl-dropdown-inline\">\n"
        // + "<input name='netBusiCondBondList[" + index + "].receivableDate' type=\"hidden\" >\n"
        // + "<button type=\"button\" class=\"btn btn-default dropdown-toggle zl-btn zl-dropdown-btn\" data-toggle=\"dropdown\" id=\"js-payment-deadline\">\n"
        // + "  请选择"
        // + " <span class=\"span-more\"></span>\n"
        // + "</button>\n"
        // + "<ul class=\"dropdown-menu\">\n"
        // + str
        // + "</ul>\n"
        // + "</div>\n"
        // + "</td>"
        // + "</tr>";
        + "<td class='zl-edit zl-form-group-datetime required' title='保证金应收日期'>"
        + "<div class='input-group zl-datetimepicker' style='width:100%;'>"
        + "<input type='text' class='form-control' name='netBusiCondBondList[" + index + "].receivableDate' value=''></div>"
        + "</div>"
        + "</td>"
        + "</tr>";
    var str="";
    var params=JSON.parse($("#params").val());
    $.each(params,function (key,value) {
        if(key!=null&&key!=undefined&&key!=""){
            str+="<li><a data-value="+key+">"+value+"</a></li>"
        }
    });
    index++;
    html += "<tr>"
        + "<th>公共事业费保证金</th>"
        + "<td class='zl-edit required' colspan='2' title='保证金'>"
        + "<input type='text' class='form-control' name='netBusiCondBondList[" + index + "].bond' value='' placeholder='-' maxlength='10'>"
        + "<input type='hidden' class='form-control' name='netBusiCondBondList[" + index + "].bondCode' value='1' placeholder='-'>"
        + "<input type='hidden' class='form-control' name='netBusiCondBondList[" + index + "].bondName' value='公共事业费保证金' placeholder='-'>"
        + "</td>"
        + "<th>应收日期</th>"
        // + "<td class=\"zl-edit required\" title=\"保证金应收日期\">\n"
        // + "<div class=\"btn-group zl-dropdown-inline\">\n"
        // + "<input name='netBusiCondBondList[" + index + "].receivableDate' type=\"hidden\">\n"
        // + "<button type=\"button\" class=\"btn btn-default dropdown-toggle zl-btn zl-dropdown-btn\" data-toggle=\"dropdown\" id=\"js-payment-deadline\">\n"
        // + "  请选择"
        // + " <span class=\"span-more\"></span>\n"
        // + "</button>\n"
        // + "<ul class=\"dropdown-menu\">\n"
        // + str
        // + "</ul>\n"
        // + "</div>\n"
        // + "</td>"
        // + "</tr>";
        + "<td class='zl-edit zl-form-group-datetime required' title='保证金应收日期'>"
        + "<div class='input-group zl-datetimepicker' style='width:100%;'>"
        + "<input type='text' class='form-control' name='netBusiCondBondList[" + index + "].receivableDate' value=''></div>"
        + "</div>"
        + "</td>"
        + "</tr>";
    $(selector).prepend(html);
    registerTimePicker($("#zl-netcomment-bond-table tbody"));
}

function populateTurnOver(contracts) {
    //营业额
    var selector = "#zl-turnover-period-year-tr tbody";
    $(selector).html("");
    var html = "";
    var sortIndex = 0;
    for (var i = 0; i < contracts.length; i++) {
        html += "<tr class='rent-turnover'>"
            + "<th>第" + (i + 1) + "年</th>"
            + "<input type='hidden' name='netBusiCondMarketingList[" + i + "].leaseYear' value='" + (i + 1) + "' placeholder='-'>"
            + "<td class='zl-edit'>"
            + "<input type='text' name='netBusiCondMarketingList[" + i + "].turnover' value='' placeholder='-'>"
            + "</td>"
            + "</tr>";
        sortIndex++;
    }
    $(selector).append(html);
}

function populateManager(contracts) {
    //物管费
    var selector = "#zl-fixed-management-tr tbody";
    $(selector).html("");
    var html = "";
    var sortIndex = 0;
    var contractBeginDateApply = $("#contractBeginDate").val();
    var contractEndDateApply = $("#contractEndDate").val();
    var decorateEndDate = $("#decorateEndDate").val();
    var rentEndOriginal = new Date(contractEndDateApply);
    var managementUnitType = $("#management-div :radio[name$=unitType]:checked:enabled").val();
    for (var i = 0; i < contracts.length; i++) {
        var accountStartDate = new Date(contractBeginDateApply);
        var accountEndDate = new Date(contractBeginDateApply);
        if (i == 0 && decorateEndDate != '' && decorateEndDate != null) {
            accountStartDate = new Date(decorateEndDate);
            accountStartDate = new Date(accountEndDate.setDate(accountEndDate.getDate() + 1));
        } else {
            accountStartDate = new Date(accountStartDate.setFullYear(new Date(contractBeginDateApply).getFullYear() + i))
        }
        accountEndDate = new Date(accountEndDate.setFullYear(accountStartDate.getFullYear() + 1));
        accountEndDate = accountEndDate.setDate(accountEndDate.getDate() - 1);
        if (new Date(accountEndDate).getTime() > rentEndOriginal.getTime()) {
            accountEndDate = rentEndOriginal;
        }
        var contract = contracts[i];
        //元/平米/月
        /*var standard = eval("contract.managementStandard");
        if (managementUnitType == 'd') {
            //月均价转成日均价
            standard = standard / 30.43;
        }
        standard = (standard || standard == 0) ? standard.toFixed(2) : "";*/
        html += "<tr>"
            + "<th>第" + (i + 1) + "年</th>"
            + "<input type='hidden' value='02' name='management.feeList[" + i + "].feeType'/>"
            + "<input type='hidden' value='" + (i + 1) + "' name='management.feeList[" + i + "].rentYear'/>"
            + "<input type='hidden' value='01' name='management.feeList[" + i + "].billingType'/>"
            + "<td class='zl-edit'>"
            + "                                <div class='input-group zl-datepicker zl-datetime-range pull-left' data-type='month' start-date='2017-11' end-date='' style='width:100%'>";
            if (i == 0) {
                html += "                                    <input type='text' name='management.feeList[" + i + "].startDate' value='"+ unix_to_date(accountStartDate) +"' onchange='' readonly class='form-control input-sm js-date-start' id='add-on-1'>";
            } else {
                html += "                                    <input type='text' name='management.feeList[" + i + "].startDate' value='"+ unix_to_date(accountStartDate) +"' onchange='' disabled class='form-control input-sm js-date-start' id='add-on-1'>";
            }
            html += "                                    <div class='input-group-addon input-xs'>~</div>"
            + "                                    <input type='text' name='management.feeList[" + i + "].endDate' value='"+ unix_to_date(accountEndDate) +"' disabled class='form-control input-sm js-date-end' id='add-on-2'>"
            + "                                </div>"
            + "                            </td>"
            /*+ "<td class='zl-edit'>"
            + "<input type='text' class='form-control' name='management.feeList[" + i + "].standard' value='" + standard + "' placeholder='-' readonly>"
            + "</td>"*/
            + "<td class='zl-edit required'>"
            + "<input type='text' class='form-control' name='management.feeList[" + i + "].apply' value='' placeholder='-'>"
            + "</td>"
            + "<td class='zl-edit'>"
            + "<input type='text' class='form-control' name='management.feeList[" + i + "].totalMonth' value='' placeholder='-' readonly>"
            + "</td>"
            /*+ "<td class='zl-edit'>"
            + "<input type='text' class='form-control' name='management.feeList[" + i + "].discountRate' value='' placeholder='-' readonly>"
            + "</td>"
            + "<td class='zl-edit'>"
            + "<input type='text' class='form-control' name='management.feeList[" + i + "].noTaxTotalMonth' value='' placeholder='-' readonly>"
            + "</td>"
            + "<td class='zl-edit required'>"
            + "<input type='text' class='form-control' name='management.feeList[" + i + "].taxMonth' value='' placeholder='-' readonly>"
            + "</td>"*/
            + "</tr>";
    }
    $(selector).append(html);
    registerDateRange($(selector));
}

//生成 空调装修费
function populateConditioner(contracts) {
    //物管费
    var selector = "#zl-fixed-cond-tr tbody";
    $(selector).html("");
    var html = "";
    var rentBeginDateApply = $("#contractBeginDate").val();
    var contractEndApply = $("#contractEndDate").val();
    var rentStart = new Date(rentBeginDateApply);
    var rentEnd = new Date(rentBeginDateApply);
    var rentEndOriginal = new Date(contractEndApply);
    for (var i = 0; i < contracts.length; i++) {
        rentStart.setFullYear(rentStart.getFullYear() + i);
        rentEnd.setFullYear(rentEnd.getFullYear() + (i+1));
        rentEnd.setDate(rentEnd.getDate() - 1);

        if (rentEnd.getTime() > rentEndOriginal.getTime()) {
            rentEnd = rentEndOriginal;
        }
        html += "<tr>"
            + "<th>第" + (i + 1) + "年</th>"
            + "<input type='hidden' value='07' name='conditioner.feeList[" + i + "].feeType'/>"
            + "<input type='hidden' value='" + (i + 1) + "' name='conditioner.feeList[" + i + "].rentYear'/>"
            + "<input type='hidden' value='01' name='conditioner.feeList[" + i + "].billingType'/>"
            + "<td class='zl-edit'>"
            + "<div>"
            + "<div class='input-group zl-datepicker zl-datetime-range pull-left ng-scope'>"
            + "<input type='text' name='conditioner.feeList[" + i + "].startDate' class='form-control input-sm' value='"+ unix_to_date(rentStart) +"' readonly>"
            + "<div class='input-group-addon input-xs'> ~ </div>"
            + "<input type='text' name='conditioner.feeList[" + i + "].endDate' class='form-control input-sm' value='"+ unix_to_date(rentEnd) +"' readonly>"
            + "</div>"
            + "</div>"
            + "</td>"
            + "<td class='zl-edit required' title='申请空调服务费'>"
            + "<input type='number' class='form-control' name='conditioner.feeList[" + i + "].apply' value='' placeholder='-'>"
            + "</td>"
            + "<td class='zl-edit'>"
            + "<input type='text' class='form-control' name='conditioner.feeList[" + i + "].totalMonth' value='' placeholder='-' readonly>"
            + "</td>"
            /*+ "<td class='zl-edit'>"
            + "<input type='text' class='form-control' name='conditioner.feeList[" + i + "].discountRate' value='' placeholder='-'>"
            + "</td>"*/
            /*+ "<td class='zl-edit'>"
            + "<input type='text' class='form-control' name='conditioner.feeList[" + i + "].noTaxTotalMonth' value='' placeholder='-' readonly>"
            + "</td>"
            + "<td class='zl-edit required'>"
            + "<input type='text' class='form-control' name='conditioner.feeList[" + i + "].taxMonth' value='' placeholder='-' readonly>"
            + "</td>"*/
            + "</tr>";
    }
    $(selector).append(html);
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

function registerDateRange(panel) {
    var _startTimestamp = 0, _endTimestamp = 0;
    $(panel).find("input.js-date-start").datetimepicker({
        format: "yyyy-mm-dd",
        todayBtn: "linked",
        startView: 2,
        minView: 2,
        autoclose: true,
        language: "zh-CN",
    }).on('changeDate', function (e) {

        //var _startDate=$(this).val();
        _startTimestamp = e.timeStamp;
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

    var dateEnd = $(panel).find("input.js-date-end").datetimepicker({
        format: "yyyy-mm-dd",
        todayBtn: "linked",
        startView: 2,
        minView: 2,
        autoclose: true,
        language: "zh-CN",
    }).on('changeDate', function (e) {
        _endTimestamp = e.timeStamp;
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

function dealChooseType() {
    for (var i = 0; i < trs.length; i++) {
        $("#" + trs[i]).find("input,select,textarea").attr("disabled", "disabled");
        $("#" + trs[i]).hide();
    }

    var rentalDecoFreeType = $(":radio[name=decoratePeriodIsFree]:checked:enabled").val();
    var turnoverType = $(":radio[name$=programme]:checked:enabled").val();
    if (rentalDecoFreeType) {
        var index = parseInt(rentalDecoFreeType);
        if (index == 1) {
            $("#" + trs[0]).find("input,select,textarea").removeAttr("disabled");
            $("#" + trs[0]).show();

            //注册时间空间和下拉列表
            $(".zl-dropdown-inline").ysdropdown("init");
        }
    }
    if (turnoverType) {
        var index = parseInt(turnoverType) + 1;
        $("#" + trs[index]).find("input,select,textarea").removeAttr("disabled");
        $("#" + trs[index]).show();
    }

    //物管只有固定 所以仅仅显示一个
    //$("#" + trs[3]).find("input,select,textarea").removeAttr("disabled");
    //$("#" + trs[3]).show();

}

//物管费单价  日单价和月单价切换
function reComputerManager() {
    var selector = "#zl-fixed-management-tr table";
    var thTr = $(selector).find("tr").eq(0);
    var managementUnitType = $("#management-div :radio[name$=unitType]:checked:enabled").val();
    if (managementUnitType == 'd') {
        var re = new RegExp("月", "g");
        var str = $(thTr).find("th").eq(1).html().replace(re, "日");
        $(thTr).find("th").eq(1).html(str);

        str = $(thTr).find("th").eq(2).html().replace(re, "日");
        $(thTr).find("th").eq(2).html(str);
    } else {
        var re = new RegExp("日", "g");
        var str = $(thTr).find("th").eq(1).html().replace(re, "月");
        $(thTr).find("th").eq(1).html(str);

        str = $(thTr).find("th").eq(2).html().replace(re, "月");
        $(thTr).find("th").eq(2).html(str);
    }

    $("#zl-fixed-management-tr tbody").find("tr").each(function () {
        //每一行tr中的 第二个td中的input元素
        calcFixedTable($(this).find("td").eq(1).find("input"), "02");
    });
}

//租金单价  日单价和月单价切换
function reComputerRent() {
    var selector = "#js-rental-table-wrapper .swiper-container table";
    var thTr = $(selector).find("tr").eq(0);
    var rentUnitType = $("#rent-table :radio[name$=unitType]:checked:enabled").val();
    if (rentUnitType == 'd') {
        var re = new RegExp("月", "g");
        var str = $(thTr).find("th").eq(1).html().replace(re, "天");
        $(thTr).find("th").eq(1).html(str);

        str = $(thTr).find("th").eq(2).html().replace(re, "天");
        $(thTr).find("th").eq(2).html(str);
    } else {
        var re = new RegExp("天", "g");
        var str = $(thTr).find("th").eq(1).html().replace(re, "月");
        $(thTr).find("th").eq(1).html(str);

        str = $(thTr).find("th").eq(2).html().replace(re, "月");
        $(thTr).find("th").eq(2).html(str);
    }

    $("#js-rental-table-wrapper .swiper-container tbody").find("tr").each(function () {
        //判断月总额 并且使月总额输入框和单价输入框 只读属性置换
        if (rentUnitType == 'a') {
            $(this).find("td").eq(2).find("input").unbind("input");
            $(this).find("td").eq(3).find("input").removeAttr("readonly");
            $(this).find("td").eq(2).find("input").attr("readonly","readonly");
            //每一行tr中的 第二个td中的input元素
            calcFixedTable($(this).find("td").eq(3).find("input"), "01");
        } else {
            $(this).find("td").eq(3).find("input").unbind("input");
            $(this).find("td").eq(2).find("input").removeAttr("readonly");
            $(this).find("td").eq(3).find("input").attr("readonly","readonly");
            //每一行tr中的 第二个td中的input元素
            calcFixedTable($(this).find("td").eq(2).find("input"), "01");
        }
    });
}

//空调服务费单价  日单价和月单价切换
function reComputerConditioner() {
    var selector = "#zl-fixed-cond-tr table";
    var thTr = $(selector).find("tr").eq(0);
    //var condUnitType = $("#cond-div :radio[name$=unitType]:checked:enabled").val();

    $("#zl-fixed-cond-tr tbody").find("tr").each(function () {
        //每一行tr中的 单价输入框
        calcFixedTable($(this).find("td").eq(1).find("input"), "07");
    });
}

function calcPackagePrice(store, confirmDate) {

    var contractBeginDate = $("#contractBeginDate").val();
    var contractEndDate = $("#contractEndDate").val();

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

        console.log(contractObj.start);
        console.log(contractObj.end);

        contractArr.push(contractObj);
    }

    store.contractArr = contractArr;
    console.log(contractArr);
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

$("input[name=decoratePeriodIsFree],input[name$=programme]").on("change", function () {
    dealChooseType();
});

$("#management-div input[name$=unitType]").on("change", function () {
    reComputerManager();
});


$("input[name=taxType]").on("change", function () {
    //物管
    reComputerManager();
    //租金
    reComputerRent();
    //空调服务费
    reComputerConditioner();
});

$("#rent-table input[name$=unitType]").on("change", function () {
    reComputerRent();
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
            var d = new Date(beginDate.split("-")[0],beginDate.split("-")[1],0);
            iMonths -= 1;
            iDays += d.getDate();
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
        var freeDate = parseInt((new Date(endDate).getTime() - new Date(beginDate).getTime()) / 1000 / 60 / 60 / 24) + 1;
        return freeDate;
    }
    catch (e) {
        console.log(e);
        return 0;
    }
}

function setDecoratePeriod(beginDate, endDate) {
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
            var d = new Date(beginDate.split("-")[0],beginDate.split("-")[1],0);
            iMonths -= 1;
            iDays += d.getDate();
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

function setPeriodValue(beginDate, endDate,obj) {
    try {
        var periodBeginDate = new Date(beginDate);
        var periodEndDate = new Date(endDate);
        var subDate = periodEndDate.getTime() - periodBeginDate.getTime();
        var days =Math.floor(subDate/(24*3600*1000)) + 1;
        // 显示的值
        //$(obj).val(iYears + "年" + iMonths + "个月" + iDays + "天");
        $(obj).val(days + "天");
    }
    catch (e) {
        console.log(e);
    }
}

function initDiv(indexArr) {
    //displayDivs(indexArr);
    dealChooseType();
}


/**
 * 主要是编辑话画面 初始化 商铺信息 和租赁区域
 *
 * @param beginDate
 * @param endDate
 */
function initStoreAndCompanyInfo(mallId) {
    var data = {'mallId': mallId};
    pageView.loadingShow();
    _selectedCompany = {};
    _selectedStores = {};
    $.post(netcommentWeb_Path + 'netcomment/getCompanyTree.htm', data, function (result) {
        shopData = eval('(' + result + ')');
        //change = true;
        selectShopList.update(shopData, "single");
        pageView.loadingHide();
    });

    $("#companyName").on("click", function (e) {
        selectShopList.modalShow(
            function (selectedShops) {
                _selectedCompany = selectedShops;
                console.log(_selectedCompany);
                _setCompanyInput(_selectedCompany);
            }, _selectedCompany)
    });

    //加载 租赁区域数据
    $.post(netcommentWeb_Path + 'netcomment/busicond/getFloorList.htm', data, function (result) {
        var resultData = eval('(' + result + ')');
        // 楼层列表
        var listFloors = resultData.list;
        for (var i = 0; i < listFloors.length; i++) {
            var listStores = resultData["store_" + listFloors[i].id];
            for (var j = 0; j < listStores.length; j++) {
                $("body").data("_store_" + listStores[j].id, listStores[j]);
            }
        }
        selectUnit.update(resultData.data, "multi");
    });

    //商铺选择事件注册
    $("#storeNamesShow").on("click", function (e) {
        selectUnit.modalShow(
            function (selectedShops) {
                _selectedStores = selectedShops;
                _setStoresInput(_selectedStores);
                storeSelectorCallBack();
                storeSelectorCallBackForSquareDiff();
            }, _selectedStores)
    });
}

function setDropdownToInput(obj) {
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

        if ((_this.val() == "" || _this.val() == undefined) && (_this.attr("name") != undefined && _this.attr("name").indexOf("bootstrapDropdown") == -1)) {
            var msg = title + "不能为空!";
            alert(msg);
            isChecked = false;
            _this.focus();
            return false;
        }

        //画面中的 下拉选择 必填项判断
        if ($(this).find(".zl-dropdown-btn").length > 0) {
            _this = $(this).find(".zl-dropdown-btn");
            if (_this.html() == "" || _this.html() == undefined || _this.html().indexOf("请选择") > 0) {
                var msg = title + "不能为空!";
                alert(msg);
                isChecked = false;
                _this.focus();
                return false;
            }
        }

    });

    //金额非负验证
    $('#billForm').find("input[type='number']:visible").each(function () {
        var title = $(this).attr("title") || "金额";
        var _this = $(this);
        if (parseFloat(_this.val()) < 0 && _this.attr('negative') != 'true') {
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

function formPost(url, params, target) {
    var temp = document.createElement("form");
    temp.enctype = "multipart/form-data";
    temp.action = url;
    temp.method = "post";
    temp.style.display = "none";

    if (target) {
        temp.target = target;
    } else {
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
            + "                                <div class='input-addon input-radio-addon pull-left'>"
            + "                                    <input type='radio' name='rentFree.feeList[" + i + "].freeType' id='js-all-freeType[" + i + "]' value='00' checked>"
            + "                                    <label for='js-all-freeType[" + i + "]'>全免</label>"
            + "                                </div>"
            + "                                <div class='input-addon input-radio-addon pull-left'>"
            + "                                    <input type='radio' name='rentFree.feeList[" + i + "].freeType' id='js-rent-freeType[" + i + "]' value='01'>"
            + "                                    <label for='js-rent-freeType[" + i + "]'>免租</label>"
            + "                                </div>"
            + "                                <div class='input-addon input-radio-addon pull-left'>"
            + "                                    <input type='radio' name='rentFree.feeList[" + i + "].freeType' id='js-manager-freeType[" + i + "]' value='02'>"
            + "                                    <label for='js-manager-freeType[" + i + "]'>免物管费</label>"
            + "                                </div>"
            + " </div>"
            + " </td>"
            + "<td class='zl-edit'>"
            + "                                <div class='input-group zl-datepicker zl-datetime-range pull-left' data-type='month' start-date='2017-11' end-date='' style='width:100%'>"
            + "                                    <input type='text' name='rentFree.feeList[" + i + "].startDate' value='' onchange='calcAllocationDate(this)' readonly='readonly' class='form-control input-sm js-date-start' id='add-on-1'>"
            + "                                    <div class='input-group-addon input-xs'>~</div>"
            + "                                    <input type='text' name='rentFree.feeList[" + i + "].endDate' value='' onchange='calcAllocationDate(this)' readonly='readonly' class='form-control input-sm js-date-end' id='add-on-2'>"
            + "                                </div>"
            + "                            </td>"
            + "<td class='zl-edit'><input type='text' name='rentFree.feeList[" + i + "].days'/></td>"
            + "<td class='text-right'>"
            + "                                <span class='zl-add-minus-wrapper'>"
            + "                                    <em class='glyphicon glyphicon-plus-sign zl-glyphicon zl-glyphicon-blue' onclick='addOrSubtractExempt(this)'></em>"
            + "                                </span>"
            + "                       </td>"
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
            + "                                <div class='input-addon input-radio-addon pull-left'>"
            + "                                    <input type='radio' name='rentFree.feeList[" + index + "].freeType' id='js-all-freeType[" + index + "]' value='00' checked>"
            + "                                    <label for='js-all-freeType[" + index + "]'>全免</label>"
            + "                                </div>"
            + "                                <div class='input-addon input-radio-addon pull-left'>"
            + "                                    <input type='radio' name='rentFree.feeList[" + index + "].freeType' id='js-rent-freeType[" + index + "]' value='01'>"
            + "                                    <label for='js-rent-freeType[" + index + "]'>免租</label>"
            + "                                </div>"
            + "                                <div class='input-addon input-radio-addon pull-left'>"
            + "                                    <input type='radio' name='rentFree.feeList[" + index + "].freeType' id='js-manager-freeType[" + index + "]' value='02'>"
            + "                                    <label for='js-manager-freeType[" + index + "]'>免物管费</label>"
            + "                                </div>"
            + " </div>"
            + "<input type='hidden' value='" + contractYear + "' name='rentFree.feeList[" + index + "].rentYear'>"
            + "</td>"
            + "<input type='hidden' name='rentFree.feeList[" + index + "].sortIndex' readonly/>"
            + "<input type='hidden' value='00' name='rentFree.feeList[" + index + "].feeType'/>"
            + "<td class='zl-edit'>"
            + "                                <div class='input-group zl-datepicker zl-datetime-range pull-left' data-type='month' start-date='2017-11' end-date='' style='width:100%'>"
            + "                                    <input type='text' name='rentFree.feeList[" + index + "].startDate' value='' onchange='calcAllocationDate(this)' readonly='readonly' class='form-control input-sm js-date-start' id='add-on-1'>"
            + "                                    <div class='input-group-addon input-xs'>~</div>"
            + "                                    <input type='text' name='rentFree.feeList[" + index + "].endDate' value='' onchange='calcAllocationDate(this)' readonly='readonly' class='form-control input-sm js-date-end' id='add-on-2'>"
            + "                                </div>"
            + "</td>"
            + "<td class='zl-edit'><input type='text'  name='rentFree.feeList[" + index + "].days'/></td>"
            + "<td class='text-right'>"
            + "                                <span class='zl-add-minus-wrapper'>"
            + "                                    <em class='glyphicon glyphicon-minus-sign zl-glyphicon zl-glyphicon-red' onclick='addOrSubtractExempt(this)'></em>"
            + "                                </span>"
            + "                       </td>"
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



/**
 * 首期租金开始日
 */
$('#firstRentBegin').datetimepicker().on('changeDate', function (ev) {
    var firstRentBegin = $("#firstRentBegin").val();
    var firstRentEnd = $("#firstRentEnd").val();

    if (null != firstRentBegin && "" != firstRentBegin && null != firstRentEnd && "" != firstRentEnd) {
        if (firstRentEnd < firstRentBegin) {
            alert("装修进场日不能大于结束日！");
            $(this).val("");
            $("#firstRentDay").val("");
        } else {
            // 设置租期时长
            setFirstRentDay(firstRentBegin, firstRentEnd);
        }
    }

});

/**
 * 首期租金结束日
 */
$('#firstRentEnd').datetimepicker().on('changeDate', function (ev) {
    var firstRentBegin = $("#firstRentBegin").val();
    var firstRentEnd = $("#firstRentEnd").val();

    if (null != firstRentBegin && "" != firstRentBegin && null != firstRentEnd && "" != firstRentEnd) {
        if (firstRentEnd < firstRentBegin) {
            alert("装修结束日不能小于开始日！");
            $(this).val("");
            $("#firstRentDay").val("");
        } else {
            // 设置租期时长
            setFirstRentDay(firstRentBegin, firstRentEnd);
            // 第一个区间年第一个区间设置 开始时间
            if ($("#js-rental-table-wrapper .swiper-container tbody").find("tr").length > 0) {
                var firstRentEndDate = new Date(firstRentEnd);
                var firstRentEndDateAfter = firstRentEndDate.setDate(firstRentEndDate.getDate() + 1);
                //设置了首期结束时间后 第一个区间的第一个间隔年的 起始时间设置为 首期租金结束日+1
                $("#js-rental-table-wrapper .swiper-container tbody").find("tr[ng-show!=false]").eq(0).find("td").eq(0).find("input[name$=start]").val(unix_to_date(firstRentEndDateAfter));
            }
        }
    }
});

/**
 * 首期租金天数
 */
function setFirstRentDay(beginDate, endDate) {
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
            var d = new Date(beginDate.split("-")[0],beginDate.split("-")[1],0);
            iMonths -= 1;
            iDays += d.getDate();
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
        $("#firstRentDay").val(iYears + "年" + iMonths + "个月" + iDays + "天");
    }
    catch (e) {
        console.log(e);
    }
}


function addChangeItem() {
    var html = "";
    var index = parseInt($("#maxItemIndex").val()) || 2;//$("div[data-id=contextChange]").find(".changeItem,.delItem").length;
    index = index < 2? 2 : index + 1;
    html += "<tr class='changeItem'>"
         + "<input type='hidden' name='netBusiCondSupItemList["+ index +"].itemType' value='0'>"
         + "<td class='zl-edit required' title='变更项'>"
         + "<input type='text' name='netBusiCondSupItemList["+ index +"].itemName' maxlength='100' value=''>"
         + "</td>"
         + "<td class='zl-edit required' title='条目'>"
         + "<input type='text' name='netBusiCondSupItemList["+ index +"].itemDetailName' maxlength='200' value=''>"
         + "</td>"
        + "<td class='zl-edit required' title='变更前内容'>"
        + "<input type='text' name='netBusiCondSupItemList["+ index +"].itemContent' value=''>"
        + "</td>"
        + "<td class='zl-edit required' title='条目'>"
        + "<input type='text' name='netBusiCondSupItemList["+ index +"].itemChangedDetailName' maxlength='200' value=''>"
        + "</td>"
        + "<td class='zl-edit required' title='变更后内容'>"
        + "<input type='text' name='netBusiCondSupItemList["+ index +"].itemChangedContent' value=''>"
        + "</td>"
        + "<td class='text-right'>"
        + "<span class='zl-add-minus-wrapper'>"
        + "<em class='glyphicon glyphicon-minus-sign zl-glyphicon zl-glyphicon-red'></em>"
        + "</span>"
        + "</td>"
        + "</tr>";
    $("#changeTypeItem").after(html);
    $("#maxItemIndex").val(index);
    $("div[data-id=contextChange]").find(".zl-glyphicon-red").on("click", function (e) {
        $(this).parents("tr").remove();
    });
}


function addRemoveItem() {
    var html = "";
    var index = parseInt($("#maxItemIndex").val()) || 2;//$("div[data-id=contextChange]").find(".changeItem,.delItem").length;
    index = index < 2 ? 2 : index + 1;
    html += "<tr class='delItem'>"
        + "<input type='hidden' name='netBusiCondSupItemList["+ index +"].itemType' value='1'>"
        + "<td class='zl-edit required' title='删除项'>"
        + "<input type='text' name='netBusiCondSupItemList["+ index +"].itemName' maxlength='100' value=''>"
        + "</td>"
        + "<td class='zl-edit required' title='条目'>"
        + "<input type='text' name='netBusiCondSupItemList["+ index +"].itemDetailName' maxlength='200' value=''>"
        + "</td>"
        + "<td class='zl-edit required' title='条款'>"
        + "<input type='text' name='netBusiCondSupItemList["+ index +"].itemContent' value=''>"
        + "</td>"
        + "<td class='text-right'>"
        + "<span class='zl-add-minus-wrapper'>"
        + "<em class='glyphicon glyphicon-minus-sign zl-glyphicon zl-glyphicon-red'></em>"
        + "</span>"
        + "</td>"
        + "</tr>";
    $("#delTypeItem").after(html);
    $("#maxItemIndex").val(index);
    $("div[data-id=contextChange]").find(".zl-glyphicon-red").on("click", function (e) {
        $(this).parents("tr").remove();
    });
}


// //暂存
// $("#js-temp-save").on("click",function(e){
//     e.preventDefault();
//     var mallId = $("#mallId").val();
//     if (mallId == null || mallId == "") {
//         alert("请先选择一个项目！");
//     } else {
//         //standardizeContractSup();
//         pageView.loadingShow();
//         $.ajax({
//             cache: false,
//             type: "POST",
//             url: netcommentWeb_Path + "netcomment/busicond/saveBill.htm",
//             data: $('#billForm').serialize(),
//             dataType: "json",
//             async: true,
//             error: function (request) {
//                 alert("系统异常");
//             },
//             success: function (resultData) {
//                 console.log(resultData);
//                 if (resultData.success) {
//                     pageView.loadingHide();
//                     $("#infoMessage").addClass("active");
//                     setTimeout(function () {
//                         $("#infoMessage").removeClass("active");
//                         //跳转编辑画面
//                         formPost(netcommentWeb_Path + "/netcomment/busicond/toContractSupBillDetail.htm", {masterId: resultData.data,billType:"03"});
//                     },2000);
//                 } else {
//                     alert("保存失败!");
//                     pageView.loadingHide(); // 隐藏 loading
//                 }
//
//             }
//         });
//     }
// });
//
// //附件
// $("#js-attachment").on("click",function(e){
//     e.preventDefault();
// });
// //发起审批
// $("#js-save").on("click",function(e){
//     e.preventDefault();
//     if (checkNetForm()) {
//         $(".zl-loading").fadeIn();
//         $.ajax({
//             cache: false,
//             dataType: "json",
//             type: "POST",
//             url: netcommentWeb_Path + "netcomment/busicond/saveBill.htm",
//             data: $('#billForm').serialize(),
//             error: function (request) {
//                 alert("系统异常!");
//                 $(".zl-loading").fadeOut();  // 隐藏 loading
//             },
//             success: function (resultData) {
//                 if (resultData.success) {
//                     formPost(netcommentWeb_Path + "/netcomment/busicond/toContractSupBillDetail.htm", {masterId: resultData.data});
//                 } else {
//                     alert("保存失败!");
//                     $(".zl-loading").fadeOut();  // 隐藏 loading
//                 }
//             }
//         });
//     }
//
// });