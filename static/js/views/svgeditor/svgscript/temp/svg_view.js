/*globals $ bootstrape snap*/
/*svg editor module */
// Dependencies:
// 1. jQuery
// 2. snap
// 3. bootstrape

/**
 * Created by cheng on 2016/3/9.
 */

/* 兼容IE9 ---------------------------------------- classList start ---------------------------------------- */

var arrays = [SVGPolygonElement, SVGEllipseElement, SVGPathElement, SVGRectElement, SVGCircleElement];

$.each(arrays,function(i,e){
    if (!("classList" in e.prototype)){
        Object.defineProperty(e.prototype, 'classList', {
            get: function() {
                var self = this;
                function update(fn) {
                    return function(value) {
                        var classes = self.className.baseVal.split(/\s+/g),
                            index = classes.indexOf(value);

                        fn(classes, index, value);
                        self.className.baseVal = classes.join(" ");
                    }
                }

                return {
                    add: update(function(classes, index, value) {
                        if (!~index) classes.push(value);
                    }),

                    remove: update(function(classes, index) {
                        if (~index) classes.splice(index, 1);
                    }),

                    toggle: update(function(classes, index, value) {
                        if (~index)
                            classes.splice(index, 1);
                        else
                            classes.push(value);
                    }),

                    contains: function(value) {
                        var className = self.className;
                        return !!~+className.baseVal.split(/\s+/g).indexOf(value);
                    },

                    item: function(i) {
                        return self.className.baseVal.split(/\s+/g)[i] || null;
                    }
                };
            }
        });
    }
});

/*if (!("classList" in SVGPolygonElement.prototype)){
    Object.defineProperty(SVGPolygonElement.prototype, 'classList', {
        get: function() {
            var self = this;
            function update(fn) {
                return function(value) {
                    var classes = self.className.baseVal.split(/\s+/g),
                        index = classes.indexOf(value);

                    fn(classes, index, value);
                    self.className.baseVal = classes.join(" ");
                }
            }

            return {
                add: update(function(classes, index, value) {
                    if (!~index) classes.push(value);
                }),

                remove: update(function(classes, index) {
                    if (~index) classes.splice(index, 1);
                }),

                toggle: update(function(classes, index, value) {
                    if (~index)
                        classes.splice(index, 1);
                    else
                        classes.push(value);
                }),

                contains: function(value) {
                    var className = self.className;
                    return !!~+className.baseVal.split(/\s+/g).indexOf(value);
                },

                item: function(i) {
                    return self.className.baseVal.split(/\s+/g)[i] || null;
                }
            };
        }
    });
}*/
/* 兼容IE9 ---------------------------------------- classList end ---------------------------------------- */

//editor-interface 定义全局的命名空间
var svg_editor = (function (sv){

    sv.default={};
    sv.snap=null;
    //根据不同的模式执行不同的操作，目前主要开发的操作模式为
    //合铺，拆铺，查看,绑定信息
    sv.curMode="edit";
    //页面的最后一次操作，如果不是save,提醒用户需要保存当前页面
    sv.lastOpt=null;
    sv.mouseTarget=null;
    //svg container ID
    var container=sv.container=$("#zl-svg").get(0);//checked
    var root=sv.root=$("#zl-svg").children("svg").get(0);//checked
    $(root).attr("id","svgRoot");
    var rootGroup=$(root).children("g");

    var curSelect,lastSelect,curRootGroup;//如果在ai作图时，分过图层或者自行做过群组，取mouseTarget时，以curRootGroup作为搜索终点
    var curSelectSet=[];

    /**
     *   shops:[
     *              ｛shopID：shopID, shopPOS：商铺位置, shopArea: shop面积, merchant:商户名称,
     *                shopStatus://商铺状态－－对镜响应lableClass *****,
     *                shopType:商铺类型 -- 对应labelClass（多经？）
     *                rentAvgPrice:平均租金，rentPriceCount:租金总额,
     *               shopPhoto：点位效果图，
     *               shopDoc：｛docName:文档名称,docHref: #href}
     *
     *              ｝,
     * @type {string[]}
     */
    sv.edit_form_template=[
        '<div class="zl-form-wrapper">',
        '<form class="form-horizontal" id="zl-edit-form">',
            '<div class="form-group">',
                '<label for="shopID" class="col-sm-4 control-label">铺位号</label>',
                '<div class="col-sm-8">',
                    '<input type="text" class="form-control" id="shopID" placeholder="请输入">',
                '</div>',
            '</div>',//end div

            '<div class="form-group">',
                '<label for="shopArea" class="col-sm-4 control-label"> 计租面积</label>',
                '<div class="col-sm-8">',
                '<input type="text" class="form-control" id="shopArea" placeholder="自动带入">',
                '</div>',
            '</div>',//end div


            '<div class="form-group">',
                '<label for="shopName" class="col-sm-4 control-label">签批业态</label>',
                '<div class="col-sm-8">',
                '<input type="text" class="form-control" id="shopName" placeholder="自动带入">',
                '</div>',
            '</div>',//end div
        '</form>',
     '</div>'//end wrapper
    ].join("");

    sv.view_template=[
        '<table class="table" id="svg-data-view">',
            '<tbody>',

            '</tbody>',
        '</table>'
    ].join("");

    //初始化时对根元素下的直接元素进行一遍解析，add rootGroup to <g>,这部分内容是ai作图时的群组或者图层元素
    //getMouseTarget解析时，可以判断遇到rootGroup即停止向上遍历
    //重要的事情说三遍，svg的遍历之后要再检查，目前只根据业务逻辑采用了最简单的遍历条件，可能会有bug.
    $(rootGroup).each(function(i,e){
        e.classList.add("rootGroup");
    });

    var currentGroup=sv.currentGroup=null;
    // common namepaces constants
    var NS=sv.NS= {
            HTML: 'http://www.w3.org/1999/xhtml',
            MATH: 'http://www.w3.org/1998/Math/MathML',
            SE: 'http://svg-edit.googlecode.com',
            SVG: 'http://www.w3.org/2000/svg',
            XLINK: 'http://www.w3.org/1999/xlink',
            XML: 'http://www.w3.org/XML/1998/namespace',
            XMLNS: 'http://www.w3.org/2000/xmlns/' // see http://www.w3.org/TR/REC-xml-names/#xmlReserved
        }

    // return the svgedit.NS with key values switched and lowercase
    sv.getReverseNS = function() {'use strict';
        var reverseNS = {};
        $.each(this.NS, function(name, URI) {
            reverseNS[URI] = name.toLowerCase();
        });
        return reverseNS;
    };


    /**
     * 取得目标元素的逻辑处理要考虑相当多情况，目前没有经过完全测试：
     * 按照个人理解的svg结构：
     * 目标元素需要向上遍历至最外层的<g>
     * 如果目标元素的父级元素为根元素，则判断目标元素为 mouseTarget
     */
    var getMouseTarget = sv.getMouseTarget = function(evt) {
        var sv=svg_editor;
        var root=sv.root;
        var container=sv.container;
        //每次重置curRootGroup
        curRootGroup=null;
        if (evt == null) {
            return null;
        }
        var mouse_target = evt.target;

        // <use>元素--应该目前程序处理不到, Opera and WebKit return the SVGElementInstance
        if (mouse_target.correspondingUseElement) {mouse_target = mouse_target.correspondingUseElement;}
        // foreign Content, 向上遍历直到找到foreign object
        // ？ WebKit browsers set the mouse target to the svgcanvas div
        if ([NS.MATH, NS.HTML].indexOf(mouse_target.namespaceURI) >= 0 &&
            mouse_target.id != 'svgcanvas')
        {
            while (mouse_target.nodeName != 'foreignObject') {
                mouse_target = mouse_target.parentNode;
                if (!mouse_target) {return root;}
            }
        }

        // 以下原则 If it's root-like, select the root
        if ([root, container].indexOf(mouse_target) >= 0) {
            return root;
        }
        var $target = $(mouse_target);
        // 如果在ai作图时，分过图层或者自行做过群组，取mouseTarget时，以curRootGroup作为搜索终点
        if ($target.closest('.rootGroup').length) {
            curRootGroup=$target.closest(".rootGroup").get(0);
        }

        while (mouse_target.parentNode !== (curRootGroup || root)) {
            mouse_target = mouse_target.parentNode;
        }

        return mouse_target;
    };//end getMouseTarget

    /**
     * 加入getSelect 主要是为了处理合铺的状态，合铺时要给所有的铺位加入cur-select,以显示。
     * @type {getSelect}
     */


    var getSelect=sv.getSelect=function(mouseTarget){
        var mt=mouseTarget;
        console.log("mt=" + mt);
        var $cur_select;
        if(mt.classList.contains("compressed")){
            var cur_compressed_cls=$(mouseTarget).data("compressed");
            $cur_select=$(".compressed-"+cur_compressed_cls);
        }else{
            $cur_select=$(mouseTarget);
        }
            return $cur_select;
    };


    /**
     * 取得当前数据时，考虑到合铺情况，目前策略是在绑定时，把每个合铺的图形均绑定data信息，
     * 所以取得data时可以根据任何点击来取得，不用遍历数据。
     * @param mouseTarget
     */
    var getTargetData=function(mouseTarget){
        var $mouseTarget=$(mouseTarget);
        var shop_data={};
        shop_data['storeId']=$mouseTarget.attr("storeid");
        shop_data['storeNo']=$mouseTarget.attr("storeno");
        shop_data['rentSquare']=$mouseTarget.attr("rentsquare");
        shop_data['issuingLayout']=$mouseTarget.attr("issuinglayout");
        return shop_data;
    }


    var showInfo=function(data){
        //$(".zl-search-result")  //搜索信息

        $("div.zl-content-info").hide().empty();

        if(data!=null && typeof data != "undefined" ){
            var storeId = data['storeId'];
            var storeType = data['storeType']; //1商铺 2为多经，默认为商铺
            if(typeof storeId != "undefined" && storeId!=null && storeId!=""){
                if(storeType == "2"){
                    $(".zl-fixed-point-position").show();  //多经
                }else{
                    //加载项目
                    $.ajax({
                        url: enrolmentWeb_Path + "svg/getSvgStoreDetail.htm",
                        type: "post",
                        dataType: "json",
                        data:{storeId:storeId},
                        success: function(responseText){
                            if (responseText.isRent == "true") {
                                //已出租商铺信息
                                $("div.zl-content-info").empty().append($("#zl-store-info").tmpl(responseText)).fadeIn(300);
                                var maxY = Math.max.apply(null, [Math.max.apply(null, responseText.rentPackage), Math.max.apply(null, responseText.receivableMap), Math.max.apply(null, responseText.receivedMap)])
                                option.init(responseText.yearList, responseText.rentPackage, responseText.receivableMap, responseText.receivedMap, maxY);
                                echarts.init($(".zl-chart").get(0)).setOption(option);
                            } else {
                                //未出租商铺信息
                                $("div.zl-content-info").empty().append($("#zl-store-info-base").tmpl(responseText)).fadeIn(300);
                            }
                        }
                    });
                }

            }else{
                $("div.zl-content-info").append($("#zl-sel-no-store").tmpl()).fadeIn(300); ///未绑定商铺
                $("div.zl-content-info").empty().append($("#zl-store-info").tmpl()).fadeIn(300);
                option.init(['年 13', '14', '15', '16', '17','18'],[80, 90, 120, 140, 165,180],[140, 155, 170, 200, 220,260],[120,130,98,160,110,98],210);
                echarts.init($(".zl-chart").get(0)).setOption(option);
            }
        }else{
            $("div.zl-content-info").append($("#zl-sel-blank").tmpl()).fadeIn(300); //空态
        }


    }

    /**
     * popEditor根据鼠标点击位置弹出店铺的编辑页面
     * @type {popEditor}
     */
    var clickSvg=sv.clickSvg=function(evt) {

        $(".cur-select").each(function(){
            this.classList.remove("cur-select");
        });

        var mouseTarget= svg_editor.getMouseTarget(evt);
        //todo: 点击表示
        if($(mouseTarget).attr("data-no-select")==true||$(mouseTarget).attr("data-no-select")=='true'){
            return;
        }
        var targetId=$(mouseTarget).attr("id");
        if (targetId== "svgRoot" || targetId=="svgRoot") {

            $(".cur-select-mask").popover("destroy").remove();

            showInfo();
        } else {
            //这里考虑compressed的情况。
            var $cur_select=sv.getSelect(mouseTarget);
            $cur_select.each(function(){
               this.classList.add("cur-select");
            });

            showInfo(getTargetData(mouseTarget));

            $(".cur-select-mask").popover("destroy").remove();

            var clientWidth = $(window).width();

            //var offsetX = evt.pageX-40-(clientWidth-1280)/2-11;
            //var offsetY = evt.pageY-$(".zl-graphy").offset().top-10-11;

            var offsetX = evt.clientX-$(".zl-graphy").offset().left-12;
            var offsetY = evt.pageY-$(".zl-graphy").offset().top-11-12;


            $("<div class='cur-select-mask'><em class='glyphicon glyphicon-map-marker'></em></div>").css({
                top: parseInt(offsetY) + "px",
                left:parseInt(offsetX) + "px"
            }).appendTo(".zl-mainpanel-inner");

            /*  弹出框
            .popover({
                container: "body",
                title: "商铺信息",
                content: svg_editor.edit_form_template,
                placement: "auto",
                html: true,
                trigger: "manual",
            });

            $(".cur-select-mask").popover("show");
            ;*/

        }
    }//end clickSvg

    sv.addStyle=function(style){
        var $container= $("#zl-svg");
        var $style=$container.find("style");
        if($style.length==0){
            $container.find("defs").last().prepend(style);
        }else{
            $style.last().after(style);
            console.log("fuck");
        }
    };

    sv.initDataAndStyle=function(type){
        $("#legend-panel  li").hide();
        $("#legend-panel li[id='layout_000']").show();
        // 移除单位显示
        $("#price").remove();
        if(type=="3"){
            $("#legend-panel li[id^='campare_']").show();
            $("#datepicker").css("display", "none");
        } else if (type=="4") {
            $("#legend-panel li[id^='rent_']").show();
            $("#datepicker").css("display", "block");
            // 显示单位
            $(".legend-panel-wrapper").append("<ul id='price' style='float: left; margin-top: 5px;'>(单位  元/㎡/月)</ul>");
        }
        else{
            if($("#mallType").val() == "6"){
                $("#legend-panel li[mallType='6']").show();
            }else{
                $("#legend-panel li[mallType='default']").show();
            }
            $("#datepicker").css("display", "none");
        }

        // 平均租金
        if (type=="4") {
            var floorId = $("#floorId").val();
            var mallId = $("#mallId").val();
            var date = $("#dateMonth").val();
            $.ajax({
                url: enrolmentWeb_Path + "svg/getSvgFloorStoreAverageRentInfo.htm",
                type: "get",
                dataType: "json",
                data:{floorId:floorId, mallId:mallId, date:date},
                success: function(responseText){
                    $(".rent-range").each(function(i,e){
                        e.classList.remove("rent-range");
                        e.classList.remove("rent_0-50");
                        e.classList.remove("rent_50-100");
                        e.classList.remove("rent_100-200");
                        e.classList.remove("rent_200-300");
                        e.classList.remove("rent_300");
                    });

                    $("[storeid]").each(function(){
                        var storeId = $(this).attr("storeid");
                        if(typeof storeId != "undefined" && storeId!=null && storeId!="" && typeof responseText[storeId]!= "undefined"){
                            var result = responseText[storeId];
                            var layoutCur = "";
                            if (result.CONT_NO == null || result.CONT_NO == "") {
                                layoutCur = "layout_000";
                            }
                            else {
                                if (typeof result.APPLY_FEE != "undefined" && result.APPLY_FEE != null && result.APPLY_FEE != "") {
                                    var applyFee = parseFloat(result.APPLY_FEE).toFixed(2);
                                    console.log("applyFee==" + applyFee);
                                    if ( 0< applyFee && applyFee <= 50) {
                                        layoutCur = "rent_0-50";
                                    } else if ( 50 < applyFee && applyFee <= 100) {
                                        layoutCur = "rent_50-100";
                                    } else if ( 100 < applyFee && applyFee <= 200) {
                                        layoutCur = "rent_100-200";
                                    } else if ( 200 < applyFee && applyFee <= 300) {
                                        layoutCur = "rent_200-300";
                                    } else if ( 300 < applyFee) {
                                        layoutCur = "rent_300";
                                    } else {
                                        layoutCur = "layout_000";
                                    }
                                }
                            }
                            $(this).attr("style", "");
                            $(this)[0].classList.add("rent-range");
                            $(this)[0].classList.add(layoutCur);
                        }
                    })
                },
                error: function(responseText){
                    console.log("该项目暂无楼层数据！");
                }
            });
        } else {
            $.ajax({
                url: enrolmentWeb_Path + "svg/getSvgFloorStoreInfo.htm",
                type: "post",
                dataType: "json",
                data:{floorId:$("#floorId").val()},
                success: function(responseText){
                    $("[storeid]").each(function(){
                        var storeId = $(this).attr("storeid");
                        if(typeof storeId != "undefined" && storeId!=null && storeId!="" && typeof responseText[storeId]!= "undefined"){
                            var result = responseText[storeId];

                            var layoutCur="";
                            if(result.layout!=""&&result.layout!=null&&typeof result.layout != "undefined"){
                                if($("#mallType").val() == "6"){
                                    layoutCur = result.layout.substring(0, 4)
                                }else{
                                    layoutCur = result.layout.substring(0, 3)
                                }

                            }
                            var layoutDef = result.issuingLayout;

                            //签批业态
                            $(this).attr("def_layout", result.issuingLayout);
                            $(this).attr("def_layoutName", result.issuingLayoutName);

                            //当前业态
                            $(this).attr("cur_layout", result.layout);
                            $(this).attr("cur_layoutName", result.layoutName);

                            $(this).attr("style", "");
                            if(type=="2"){
                                //签批业态
                                $(this)[0].classList.add("layout_" + layoutDef);
                            }else if(type=="3"){
                                if(typeof result.contNo != "undefined" && result.contNo!=null && result.contNo!=""){
                                    //对比
                                    if(layoutCur == layoutDef){
                                        $(this)[0].classList.add("campare_equal");
                                    }else{
                                        $(this)[0].classList.add("campare_diff");
                                    }
                                }else{
                                    //未签约
                                    $(this)[0].classList.add("layout_000");
                                }
                            }else{
                                //当前业态
                                if(typeof result.contNo != "undefined" && result.contNo!=null && result.contNo!=""){
                                    $(this)[0].classList.add("layout_" + layoutCur);
                                }else{
                                    //未签约
                                    $(this)[0].classList.add("layout_000");
                                }
                            }
                        }
                    })


                },
                error: function(responseText){
                    //alert("该项目暂无楼层数据！");
                    console.log("该项目暂无楼层数据！");
                }
            });
        }

        // 保持原tab选择不变
        // $(".tab.active").removeClass("active");
        // $("#tab_" + type).addClass("active");

    }


    /**
     * 以下逻辑从语意上处理更合理，
     * 但实际操作，对图层的遮挡比较难处理，目前采用了比较简单的逻辑，对页面实际元素不做更改做作，只通过增加相应的class实现
     * ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
     * 合铺操作时，如果所选元素的rootGroup一致或者均为直接元素，
     * 则直接创建<g>包围，
     * 如果rootGroup不同，需要另外创建一个rootGroup,再把新元素添加进去
     */

    sv.releaseSelector=function(){

    }//end releaseSelector

    //常用色彩定义
    sv.colorSet={
    };

    //商铺状态定义
    sv.shopStatusSet={

    };

    //svgMap对应图示
    //
    sv.labels={

    };
    sv.symbols=[

    ];
    //界面初始化
    sv.interface={};
    //事件，功能处理
    sv.handler={
    };
    return sv;
})(svg_editor || {});



//svg加载后,刷新
svg_editor.reload=function(svg, type){
    $(".cur-select-mask").popover("destroy").remove();
    console.log("svg step=======================");
    // console.log($("#zl-svg"));
    // console.log(svg);


    $("#zl-svg").empty().html(svg).prepend("<defs></defs>");

    var sv=svg_editor;
    var root=sv.root=$("#zl-svg").children("svg").get(0);//checked
    $(root).attr("id","svgRoot");
    var rootGroup=$(root).children("g");
    //初始化时对根元素下的直接元素进行一遍解析，add rootGroup to <g>,这部分内容是ai作图时的群组或者图层元素
    //getMouseTarget解析时，可以判断遇到rootGroup即停止向上遍历
    //重要的事情说三遍，svg的遍历之后要再检查，目前只根据业务逻辑采用了最简单的遍历条件，可能会有bug.
    $(rootGroup).each(function(i,e){
        e.classList.add("rootGroup");
    });
    //svg加载后，再加入class，要么可能存在样式权限的问题
    svg_editor.addStyle(svg_editor.legendStyle);

    svg_editor.initDataAndStyle(type);

};


svg_editor.init=function(){
    $("div.zl-content-info").empty().append($("#zl-sel-blank").tmpl()); //空态

    $(document).on("click","#zl-svg",function(e){
        svg_editor.clickSvg(e);
    });

};


$(document).ready(function(){
    svg_editor.init();
});


