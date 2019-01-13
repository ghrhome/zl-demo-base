/**
 * Created by whobird on 2018/4/12.
 */
var pageView=(function($){
    var pageView={};
    var ys_main_swiper;

    pageView.swiperInit=function(){
        ys_main_swiper = new Swiper('.zl-floor-main-table', {
            scrollbar: '.swiper-scrollbar-a',
            slidesPerView: 'auto',
            mousewheelControl: true,
            freeMode: true,
            scrollbarHide:false,
            scrollbarDraggable:true,
            grabCursor:true,
            preventClicksPropagation:false,
            observer:true,
            observeParents:true
        });
    };


    pageView.eventInit=function(){

        var page = $("#cost-account-receivable");

        var layoutList = [];
        try {
            layoutMap = JSON.parse(layoutMapJson)
            for (var key in layoutMap)  layoutList.push({"code" : key , "label" : layoutMap[key]});
        } catch (e) { }

        $( "#js-layout" ).autocomplete({
            source: layoutList,
            minLength: 1,
            select: function( event, ui ) {
                this.value = ui.item.label;
                $("#searchForm").find("input[name=layoutCode]").val(ui.item.code);
                return false;
            }
        });

        $( "#js-layout" ).on("input", function() {
            $("#searchForm").find("input[name=layoutCode]").val('');
        });

        page.on("click","a.view-receipt-btn",function(e){
            e.stopPropagation();
            e.preventDefault();
            var width = $(window).width();
            var height = $(window).height();
            var features = "width='"+width+"',height='"+height+"'";
            window.open(base_Path+"scpStatic/static/pages/finance/scp/empty_receipt.html","_blank",features);
        });

        page.find(".print-btn,.global_print-btn").on("click", function(e) {

            var printContNos = "";
            //是否是全局打印
            var isGlobal = 0;
            var ids = "";
            e.stopPropagation();
            e.preventDefault();
            // $("#receipt-dialog").modal("hide");
            if ($(this).hasClass("zl-btn-disable")) return;
            $("em[id^=cont-rece-]").each(function () {
                if ($(this).hasClass("checked")) {
                    var _this = this;
                    var status = $(this).attr("deStatus");
                    if (status == 1 || status == 2 ) {
                        $(_this).removeClass("checked");
                        // alert("已开票，不能重复开票")
                    }
                }
            });
            // console.log($(this).parent("div").parent("div").parent("div").find("em[id^=cont-rece-]").eq(0).attr("data-id"));
            //区分全局打印和单个打印
            if($(this).hasClass("print-btn")){
                //局部打印
                $(this).parent("div").parent("div").parent("div").find("em[id^=cont-rece-]").each(function () {
                    if ($(this).hasClass("checked")) {
                        var dataId = $(this).attr("data-id");
                        ids += dataId + ",";
                    }
                });
            }else{
                //全局打印
                isGlobal = 1;
                //查询所有合同id，后台查询相关能打印应收
                $("#accordions").find("ul").each(function (i) {
                    if($(this).find("em").hasClass("cont") && $(this).find("em").hasClass("checked")){
                        var em = $(this).find("em").eq(0);
                        var dataContNo = em.attr("data-id");

                        if(dataContNo != null){
                            console.log($("#table-cont-rece-"+dataContNo).find("em[id^=cont-rece-]").length)
                            if($("#table-cont-rece-"+dataContNo).find("em[id^=cont-rece-]").length > 0 ){
                                $("#table-cont-rece-"+dataContNo).find("em[id^=cont-rece-]").each(function () {
                                    if ($(this).hasClass("checked")) {
                                        var dataId = $(this).attr("data-id");
                                        ids += dataId + ",";
                                    }
                                });
                            }else{
                                printContNos += dataContNo + ",";
                            }
                        }
                    }
                })
            }
            if (ids == "" && printContNos == "" ) {
                alert("请选择后再执行该操作");
                return;
            }
            ids = ids.substring(0,ids.lastIndexOf(","));
            printContNos = printContNos.substring(0,printContNos.lastIndexOf(","));

            //如选择一个 为打开详情应收去后台判断，是否存在有需要打印的
            // if(printContNos.indexOf(",") < 0){
            if(ids == "" && printContNos != ""){
                var params = {
                    contNos :  printContNos,
                    feeType : $("#searchForm").find("input[name=feeType]").val(),
                    receNo : $("#searchForm").find("input[name=receNo]").val(),
                    queryDate : $("#searchForm").find("input[name=queryDate]").val(),
                    deStatus : $("#searchForm").find("input[name=deStatus]").val(),
                    sendStatus : $("#searchForm").find("input[name=sendStatus]").val(),
                    printStatus : $("#searchForm").find("input[name=printStatus]").val(),
                    inStatus : $("#searchForm").find("input[name=inStatus]").val(),
                    isIncludeArrearage : $("#isIncludeArrearage").val(),
                };
                $.ajax({
                    url: financeWeb_Path + "feeReceivable/findFeeIdsByContNos.htm",
                    data: params,
                    type: "post",
                    dataType: "json",
                    error: function (request) {
                        pageView.loadingHide();
                        alert("系统异常");
                    },
                    success: function (response) {
                        pageView.loadingHide();
                        if(response && response.success){
                            $("#print-dialog").find("input[name=printIds]").val(ids);
                            $("#print-dialog").find("input[name=printContNos]").val(printContNos);
                            $("#print-dialog").find("input[name=isGlobal]").val(isGlobal);
                            $("#print-dialog").modal("show");
                        }else{
                            alert("请选择后再执行该操作");
                        }
                    }
                });
            }else{
                $("#print-dialog").find("input[name=printIds]").val(ids);
                $("#print-dialog").find("input[name=printContNos]").val(printContNos);
                $("#print-dialog").find("input[name=isGlobal]").val(isGlobal);
                $("#print-dialog").modal("show");
            }
                console.log("nos:"+printContNos+",ids:"+ids);
        });

        $("#print-dialog li").on("click",function(e){
            e.stopPropagation();
            e.preventDefault();
            var $elem=$(this).find(".zl-fake-radio")
            if($elem.hasClass("checked")){
                $elem.removeClass("checked")
            }else{
                $elem.closest("ul").find(".zl-fake-radio").removeClass("checked");
                $elem.addClass("checked");
            }
            $("#print-dialog").find("input[name=printType]").val($elem.data("value"));
        });


        $("#print-dialog button.save-btn").on('click', function () {
            var _model = $("#print-dialog");

            var printType = _model.find("input[name=printType]").val();
            if(printType==null || printType==""){
                alert("请选择打印账单类型");
                return;
            }
            var isGlobal = _model.find("input[name=isGlobal]").val();
            var ids = _model.find("input[name=printIds]").val();
            var contNos = _model.find("input[name=printContNos]").val();
            // if( isGlobal == "1"){
            //     ids = _model.find("input[name=printContNos]").val();
            //     if(ids==null || ids==""){
            //         alert("数据传输异常...");
            //         return;
            //     }
            // }else{
            //     ids = _model.find("input[name=printIds]").val();
            //     if(ids==null || ids==""){
            //         alert("数据传输异常...");
            //         return;
            //     }
            // }

            pageView.loadingShow();
            var params = {
                id : ids,
                printType : printType,
                isGlobal : isGlobal,
                contNos :  contNos,
                feeType : $("#searchForm").find("input[name=feeType]").val(),
                receNo : $("#searchForm").find("input[name=receNo]").val(),
                queryDate : $("#searchForm").find("input[name=queryDate]").val(),
                deStatus : $("#searchForm").find("input[name=deStatus]").val(),
                sendStatus : $("#searchForm").find("input[name=sendStatus]").val(),
                printStatus : $("#searchForm").find("input[name=printStatus]").val(),
                inStatus : $("#searchForm").find("input[name=inStatus]").val(),
                isIncludeArrearage : $("#isIncludeArrearage").val()
            };
            $.ajax({
                url: financeWeb_Path + "feeReceivable/print/pre.htm",
                // data: {id : ids, printType : printType,isGlobal : isGlobal},
                data: params,
                type: "post",
                dataType: "json",
                error: function (request) {
                    pageView.loadingHide();
                    alert("系统异常");
                },
                success: function (response) {
                    pageView.loadingHide();

                    // alert("保存成功","","");
                    // var obj =JSON.parse(response);
                    if(response && response.success){
                        window.open(financeWeb_Path + "feeReceivable/print.htm?id="+response.data.uuid+"&status=page&feeIds="+response.data.ids);
                    }else{
                        alert(response.message);
                    }
                }
            });
        });

        /**
         * 打印账单
         */
        // page.on("click", ".print-btn", function(e) {
        //     var ids = "";
        //     e.stopPropagation();
        //     e.preventDefault();
        //     if ($(this).hasClass("zl-btn-disable")) return;
        //     $("em[id^=cont-rece-]").each(function () {
        //         if ($(this).hasClass("checked")) {
        //             var _this = this;
        //             var status = $(this).attr("printStatus");
        //             if (status == 1) {
        //                 $(_this).removeClass("checked");
        //                 // alert("已开票，不能重复开票")
        //             }
        //         }
        //     });
        //
        //     $("em[id^=cont-rece-]").each(function () {
        //         if ($(this).hasClass("checked")) {
        //             var dataId = $(this).attr("data-id");
        //             ids += dataId + ",";
        //         }
        //     });
        //     if (ids == "") {
        //         alert("请选择后执行此操作")
        //     }else{
        //         // pageView.loadingShow();
        //         $.ajax({
        //             url: financeWeb_Path + "feeReceivable/print/pre.htm",
        //             data: {id : ids },
        //             type: "post",
        //             dataType: "json",
        //             error: function (request) {
        //                 alert("系统异常");
        //             }, success: function (response) {
        //                 console.log(response);
        //                 if(response && response.success){
        //                     window.open(financeWeb_Path + "feeReceivable/print.htm?id="+response.data+"&status=page");
        //                 }else{
        //                     alert(response.message);
        //                 }
        //             }
        //         });
        //     }
        // });

        $("#js-month-picker").find("input.form-control").datetimepicker({
            language: "zh-CN",
            format: "yyyy-mm",
            // todayBtn: true,
            clearBtn: "清除",
            startView: 3,
            minView: 3,
            weekStart: 1,
            autoclose: true,
            todayHighlight: true,
            forceParse: false
        });

        $("#js-month-picker").ysDatepicker({
            dateType:"month",//year,day
            callback:function(value){
                $("form").find("input[name=queryDate]").val(value);
            }
        });

        $(".zl-datetimepicker").on("click",function(e){
            e.stopPropagation();
            e.preventDefault();
            $(this).find("input").datetimepicker("show");
        });

        // $('.zl-collapse-wrapper').on('hide.bs.collapse', function () {
        //     $(this).find("em.zl-checkbox").removeClass("checked");
        // });

        //应收打印初始化下拉
        $(".zl-dropdown").ysdropdown({
            callback:function(val, $elem){
                if ($elem.data("id") == "projects"){
                    $("#searchForm").find("input[name=mallId]").val(val);
                    $("#searchForm").find("input[name=blockId]").val(null);
                    $("#searchForm").find("input[name=floorId]").val(null);
                    $("#searchForm").find("button[id=blockName]").html("所有楼栋");
                    $("#searchForm").find("button[id=floorName]").html("所有楼层");
                    if (val != null && val != "" && val != undefined) {
                        $("div[data-id=js-block]").find("ul").empty().html("<li><a>所有楼栋</a></li>");
                        $("div[data-id=js-floor]").find("ul").empty().html("<li><a>所有楼层</a></li>");
                        selectMall(val);
                    } else {
                        $("div[data-id=js-block]").find("ul").empty().html("<li><a>所有楼栋</a></li>");
                        $("div[data-id=js-floor]").find("ul").empty().html("<li><a>所有楼层</a></li>");
                    }
                }
                if ($elem.data("id") == "js-block"){
                    $("#searchForm").find("input[name=blockId]").val(val);
                    $("#searchForm").find("input[name=floorId]").val(null);
                    $("#searchForm").find("button[id=floorName]").html("所有楼层");
                    if (val != null && val != "" && val != undefined) {
                        selectBlock(val);
                    }
                }
                if ($elem.data("id") == "js-floor"){
                    $("#searchForm").find("input[name=floorId]").val(val);
                }
                if ($elem.data("id") == "feeType"){
                    $("#searchForm").find("input[name=feeType]").val(val);
                }
                if ($elem.data("id") == "layoutCode"){
                    $("#searchForm").find("input[name=layoutCode]").val(val);
                }
                if ($elem.data("id") == "page-limit"){
                    $("#searchForm").find("input[name=page]").val(1);
                    $("#searchForm").find("input[name=itemsPerPage]").val(val);
                }
            }
        });

        //应收打印 下拉初始化
        $(".zl-dropdown-inline").ysdropdown({
            callback:function(val, $elem){
                if ($elem.data("id") == "projects"){
                    $("#searchForm").find("input[name=mallId]").val(val);
                    $("#searchForm").find("input[name=blockId]").val(null);
                    $("#searchForm").find("input[name=floorId]").val(null);
                    $("#searchForm").find("button[id=blockName]").html("所有楼栋");
                    $("#searchForm").find("button[id=floorName]").html("所有楼层");
                    if (val != null && val != "" && val != undefined) {
                        selectMall(val);
                    } else {
                        $("div[data-id=js-block]").find("ul").empty().html("<li><a>所有楼栋</a></li>");
                        $("div[data-id=js-floor]").find("ul").empty().html("<li><a>所有楼层</a></li>");
                    }
                }
                if ($elem.data("id") == "js-block"){
                    $("#searchForm").find("input[name=blockId]").val(val);
                    $("#searchForm").find("input[name=floorId]").val(null);
                    $("#searchForm").find("button[id=floorName]").html("所有楼层");
                    if (val != null && val != "" && val != undefined) {
                        selectBlock(val);
                    }
                }
                if ($elem.data("id") == "js-floor"){
                    $("#searchForm").find("input[name=floorId]").val(val);
                }
                if ($elem.data("id") == "feeType"){
                    $("#searchForm").find("input[name=feeType]").val(val);
                }
                if ($elem.data("id") == "layoutCode"){
                    $("#searchForm").find("input[name=layoutCode]").val(val);
                }
                if ($elem.data("id") == "sendStatus"){
                    $("#searchFormDetail").find("input[name=sendStatus]").val(val);
                }
                if ($elem.data("id") == "deStatus"){
                    $("#searchFormDetail").find("input[name=deStatus]").val(val);
                }
                if ($elem.data("id") == "printStatus"){
                    $("#searchFormDetail").find("input[name=printStatus]").val(val);
                }
                if ($elem.data("id") == "inStatus"){
                    $("#searchFormDetail").find("input[name=inStatus]").val(val);
                }

                //pageView.loadingShow();
                //$("#searchForm").submit();
            }
        });

        //翻页
        $(".zl-paginate").on("click", function (e) {
            var pageType = $(this).attr("pageType"); // last、next
            var page = parseInt($("#page").val()); // 当前页
            var pages = parseInt($("#pages").val()); // 总页
            var itemsPerPage = parseInt($("#itemsPerPage").val()); // 总页

            if (pageType == "last") {
                page -= 1;
            }
            else if (pageType == "next") {
                page += 1;
            }
            else {
                return;
            }
            if (page == 0 || page > pages) {
                return;
            }
            $("#searchForm").find("input[name=page]").val(page);
            $("#searchForm").find("input[name=itemsPerPage]").val(itemsPerPage);
            // $("#page").val(page);
            $("#searchForm").submit();
        });
        //翻页
        $("#gotoPage").on("click", function (e) {
            var page = $("#gotoPageNum").val();
            var itemsPerPage = $("#itemsPerPage").val();
            if (!isPositiveNum(page) || parseInt(page) == 0) {
                alert("请输入合法数字！");
                return false;
            }
            if (parseInt(page) > parseInt($("#pages").val())) {
                page = $("#pages").val();
            }
            $("#searchForm").find("input[name=page]").val(page);
            $("#searchForm").find("input[name=itemsPerPage]").val(itemsPerPage);
            $("#searchForm").submit();
        });

        //查询
        $(".btn-search").on("click", function() {
            pageView.loadingShow();
            $("#searchForm").submit();
        });

        //回车搜索
        $('.zl-search input').bind('keypress', function (event) {
            if (event.keyCode == "13") {
                pageView.loadingShow();
                $("#searchForm").trigger("submit");
            }
        });

        //高级查询
        $(".zl-senior-search").on("click", function () {
            pageView.loadingShow();
            var url = financeWeb_Path + "feeReceivable/index2.htm";
            $("#searchForm").attr("action", url).submit();
            $("#searchForm").submit();
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
        //合同全选
        $(".zl-checkbox.all").on("click", function() {
            if ($(this).hasClass("checked")) {
                $(this).removeClass("checked");
                $("em[id^=cont-]").removeClass("checked");
                $("em[id^=head-cont-]").removeClass("checked");
                $("em[id^=cont-rece-]").removeClass("checked");
            } else {
                $(this).addClass("checked");
                $("em[id^=cont-]:not(.zl-btn-disable)").addClass("checked");
                $("em[id^=head-cont-]:not(.zl-btn-disable)").addClass("checked");
                $("em[id^=cont-rece-]:not(.zl-btn-disable)").addClass("checked");
            }
            // $(this).toggleClass("checked");
        });

        //应收全选
        $(".zl-checkbox.cont").on("click", function(e) {
            e.stopPropagation();
            e.preventDefault();
            var dataId = $(this).attr("data-id");
            if ($(this).hasClass("checked")) {
                $("em[id^=head-cont-"+ dataId +"]").removeClass("checked");
                $("em[id^=cont-rece-"+ dataId +"-]").removeClass("checked");
            } else {
                $("em[id^=head-cont-"+ dataId +"]:not(.zl-btn-disable)").addClass("checked");
                $("em[id^=cont-rece-"+ dataId +"-]:not(.zl-btn-disable)").addClass("checked");
            }
            $(this).toggleClass("checked");

        });
        //应收明细全选
        $(".zl-checkbox.head").on("click", function(e) {
            e.stopPropagation();
            e.preventDefault();
            var dataId = $(this).attr("data-id");
            if ($(this).hasClass("checked")) {
                $("em[id^=cont-rece-"+ dataId +"-]").removeClass("checked");
            } else {
                $("em[id^=cont-rece-"+ dataId +"-]:not(.zl-btn-disable)").addClass("checked");
            }
            $(this).toggleClass("checked");
            $("em[id^=cont-rece-]").each(function () {
                if ($(this).hasClass("checked")) {
                    var _this = this;
                    // $(_this).addClass("checked");
                    $(_this).closest("div.panel").find("em[id^=cont-]:not(.zl-btn-disable)").addClass("checked");
                    return;
                }else{
                    var _this = this;
                    $(_this).closest("div.panel").find("em[id^=cont-]").removeClass("checked");
                    return;
                }
            });
        });

        //明细单选
        $("body").on("click","em.zl-checkbox.detail",function() {
            if($(this).hasClass("zl-btn-disable")){
                return;
            }
            $(this).toggleClass("checked");
            var head_cont_flag=true;
            var cont_add_flag =false;
            var cont_remove_flag =true;
            $(this).closest("tbody").find(".zl-checkbox.detail").each(function(){
                if ($(this).hasClass("checked")) {
                    cont_add_flag=true;
                    cont_remove_flag=false;
                }else{
                    $(this).parents("div.panel").find("em[id^=head-cont-]").removeClass("checked");
                    head_cont_flag=false;
                    return;
                }
            });
            if(head_cont_flag){
                $(this).parents("div.panel").find("em[id^=head-cont-]").addClass("checked");
            }
            if(cont_add_flag){
                $(this).parents("div.panel").find(".zl-checkbox.cont").addClass("checked");
            }
            if(cont_remove_flag){
                $(this).parents("div.panel").find(".zl-checkbox.cont").removeClass("checked");
            }

        });


        function _render(rowData, $elem){

            var _left = $elem.parents("div.panel").find(".zl-table-static tbody");
            var _right = $elem.parents("div.panel").find(".swiper-container tbody");


            var list = rowData.list || [];
            var feeTypeMap = rowData.feeTypeMap || {};
            var paperStatusMap = rowData.paperStatusMap || {};


            $("#js-fixed-table-template").tmpl(list, {
                fmtDate : function (key) {
                    return timeStampConvert(this.data[key], "yyyy-MM-dd");
                },
                fmtFeeType : function(){
                    return feeTypeMap[this.data.feeType] || "";
                },
            }).appendTo(_left);
            $("#js-swiper-table-template").tmpl(list, {
                fmtAmt : function(key){
                    return fmtAmt(this.data[key]);
                },
                fmtDeStatus : function(){
                    return paperStatusMap[this.data.deStatus] || "";
                },
            }).appendTo(_right);

            var isPrintModel = $("#isPrintModel").val();
            if (isPrintModel == "1") {
                //选明细时 默认选中下面所有明细
                $elem.parents("div.panel").find(".zl-checkbox.head").addClass("checked");
                $elem.closest("div.panel").find("em[id^=cont-]:not(.zl-btn-disable)").addClass("checked");
                $elem.parents("div.panel").find("em[id^=head-cont-]:not(.zl-btn-disable)").addClass("checked");
                $elem.parents("div.panel").find("em[id^=cont-rece-]:not(.zl-btn-disable)").addClass("checked");
            }
        }

        $("#accordions").on("click",".panel-heading", function(){
            var $elem=$(this);
            if ($elem.data("hasData")=="true" ||
                $elem.closest(".panel").hasClass("zl-panel-thead")) {
                return;
            }

            pageView.loadingShow();
            var params = {
                contNo : $elem.next(".panel-collapse").attr("data-contNo"),
                feeType : $("#searchForm").find("input[name=feeType]").val(),
                receNo : $("#searchForm").find("input[name=receNo]").val(),
                queryDate : $("#searchForm").find("input[name=queryDate]").val(),
                deStatus : $("#searchForm").find("input[name=deStatus]").val(),
                sendStatus : $("#searchForm").find("input[name=sendStatus]").val(),
                printStatus : $("#searchForm").find("input[name=printStatus]").val(),
                inStatus : $("#searchForm").find("input[name=inStatus]").val(),
                isIncludeArrearage : $("#isIncludeArrearage").val(),
                receivableAmountAll : $elem.next(".panel-collapse").attr("data-receivableAmountAll"),
            };
            $.ajax({
                url: financeWeb_Path + "feeReceivable/getReceivableDetail.htm",
                data: params,
                type: "get",
                dataType: "json",
                error: function (request) {
                    pageView.loadingHide();
                    alert("系统异常");
                }, success: function (response) {
                    pageView.loadingHide();
                    if(response && response.code=="0"){
                        _render(response.data, $elem);
                        $elem.data("hasData","true");
                    }
                }
            });
        });

        function isPositiveNum(s) {//是否为正整数
            var re = /^[0-9]*[0-9][0-9]*$/;
            return re.test(s)
        }

        $("#searchForm").submit(function () {
            var self = $(this);
            self.attr("action", financeWeb_Path + "feeReceivable/index2.htm");
        });

        var arrearageMod=false;
        $("#js-arrearage").on("click", function(){
            var $checkbox = $(this).find(".zl-fake-checkbox");
            if($checkbox.hasClass("checked")){
                $checkbox.removeClass("checked");
                $("#isIncludeArrearage").val("0");
                arrearageMod=false;
            }else{
                $checkbox.addClass("checked");
                $("#isIncludeArrearage").val("1");
                arrearageMod=true;
            }
        });

    };

    pageView.loadingShow=function(){
        $(".zl-loading").fadeIn();
    };

    pageView.loadingHide=function(){
        $(".zl-loading").fadeOut();
    };


    var printMod=false;
    pageView.init=function(){
        $("#preloader").fadeOut("fast");
        pageView.swiperInit();
        var _printMod=$("#isPrintModel").val();
        if(_printMod==1){
            printMod = true;
            $("#js-toolbar-filters").hide();
            $("#js-arrearage").show();
            $(".js-print-mod").show();
        }else{
            printMod = false;
            $("#js-toolbar-filters").show();
            $("#js-arrearage").hide();
            $(".js-print-mod").hide();
        }
        pageView.eventInit();
    };

    return pageView;

})(jQuery);


$(document).ready(function(){
    pageView.init();
    confirmAlert.init();
});

function selectMall(mallId){
    $.ajax({
        url: financeWeb_Path + "feeReceivable/getBlockList.htm",
        data: {mallId : mallId},
        type: "post",
        dataType: "json",
        error: function (request) {
            alert("楼栋查询异常");
        },
        success: function (response) {
            if(response){
                var _target = $("div[data-id=js-block]").find("ul");
                _target.html("<li><a>所有楼栋</a></li>");
                $("#dropdownTpl").tmpl(response).appendTo(_target);

                return;
            }
            $("div[data-id=js-block]").find("ul").empty();
            $("div[data-id=js-floor]").find("ul").empty();
        }
    });
}
function selectBlock(blockId){
    $.ajax({
        url: financeWeb_Path + "feeReceivable/getFloorList.htm",
        data: {blockId : blockId},
        type: "post",
        dataType: "json",
        error: function (request) {
            alert("楼层查询异常");
        }, success: function (response) {
            if(response){

                var _target = $("div[data-id=js-floor]").find("ul");
                _target.html("<li><a>所有楼层</a></li>");
                $("#dropdownFloors").tmpl(response).appendTo(_target);

            } else {
                $("div[data-id=js-floor]").find("ul").empty();
            }
        }
    });
}

