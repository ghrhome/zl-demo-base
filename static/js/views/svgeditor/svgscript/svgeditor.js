/*globals $ bootstrape snap*/
/*svg editor module */
// Dependencies:
// 1. jQuery
// 2. snap
// 3. bootstrape

/**
 * Created by cheng on 2016/3/9.
 */
//editor-interface 定义全局的命名空间

//addon：做图时注意最后把图形群组下，这样，可以把群组标签<g>解析成root-group标签，其下的<g>标签作为遍历的终点mousetarget
//初始化化时，也根据<g>标签把相应的子元素默认样式和class删除。
var svg_editor = (function (sv){

    sv.default={};
    sv.snap=null;
    //根据不同的模式执行不同的操作，目前主要开发的操作模式为
    //合铺，拆铺，查看,绑定信息
    sv.curMode="view";
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
                '<label for="shopID" class="col-sm-4 control-label">店铺ID</label>',
                '<div class="col-sm-8">',
                    '<input type="text" class="form-control" id="shopID" placeholder="请输入">',
                '</div>',
            '</div>',//end div

            '<div class="form-group">',
                '<label for="shopArea" class="col-sm-4 control-label">店铺位置</label>',
                '<div class="col-sm-8">',
                '<input type="text" class="form-control" id="shopArea" placeholder="请输入">',
                '</div>',
            '</div>',//end div


            '<div class="form-group">',
                '<label for="shopName" class="col-sm-4 control-label">店铺名称</label>',
                '<div class="col-sm-8">',
                '<input type="text" class="form-control" id="shopName" placeholder="请输入">',
                '</div>',
            '</div>',//end div

        '<div class="form-group">',
        '<label for="noSelectArea" class="col-sm-4 control-label">公共区域</label>',
        '<div class="col-sm-8">',
        '<input type="checkbox" name="noSelectArea" value="noSelect" id="no-select-area">标记(不可选择区域)',
        '</div>',
        '</div>',//end div
            /*
            '<div class="form-group">',
                '<label for="shopType" class="col-sm-4 control-label">店铺类型</label>',
                '<div class="col-sm-8">',
                    '<select class="form-control">',
                        '<option disabled="disabled">请选择</option>',
                    '</select>',
                '</div>',
            '</div>',//end div
            */
            '<div class="form-group">',
                '<div class="col-sm-offset-2 col-sm-10" style="text-align: right;">',
                    '<button type="submit" class="btn btn-default" id="zl-edit-submit">保存</button>',
                '</div>',
            '</div>',//end submit
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
    function handle_before_modChange(){
        $(".cur-select-mask").popover("destroy").remove();
        $(".cur-select").each(function(i,e){
            this.classList.remove("cur-select");
        });
    }
    sv.changeMode=function(opt){
      handle_before_modChange();
      switch(opt){
          case "svg-viewer":
              sv.curMode="view";
              $(".zl-svg-editor").attr("id","view-mod");
              break;
          case "shop-edit":
              sv.curMode="edit";
              $(".zl-svg-editor").attr("id","edit-mod");
              break;
          case "shop-graphic":
              sv.curMode="draw";
              $(".zl-svg-editor").attr("id","draw-mod");
              break;
          case "shop-compressed":
              sv.curMode="compressed";
              $(".zl-svg-editor").attr("id","compressed-mod");
              break;
          case "shop-split":
              sv.curMode="split";
              $(".zl-svg-editor").attr("id","split-mod");
              break;
          case "svg-import":
              sv.curMode="import";
              $(".zl-svg-editor").attr("id","import-mod");
              break;
          case "svg-export":
              sv.curMode="export";
              $(".zl-svg-editor").attr("id","export-mod");
              break;
          case "check-svg-code":
              sv.curMode="code";
              sv.handler.codeHandler();
              $(".zl-svg-editor").attr("id","code-mod");
              break;
          default :
              sv.curMode="view";
              $(".zl-svg-editor").attr("id","view-mod");
      }

        return sv.curMode;
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
        console.log(mouseTarget);
        shop_data['shop_id']=$mouseTarget.attr("data-shopid");
        shop_data['shop_pos']=$mouseTarget.attr("data-shoppos");
        shop_data['shop_name']=$mouseTarget.attr("data-shopname");
        //todo:
        shop_data['no_select']=$mouseTarget.attr("data-no-select");
        return shop_data;
    }
    /**
     * 设置数据时 $curSelect 为getCurSelect方法返回值，时一个jquery选择器对象，考虑了compressed和group的情况
     * @param $curSelect
     */
    var setShopData=function($curSelect){
        console.log($curSelect);
        var shop_id=$("#shopID").val();
        var shop_POS=$("#shopArea").val();
        var shop_name=$("#shopName").val();
        var no_select=$("#no-select-area").prop("checked");
        $curSelect.each(function(i,e){
            console.log($(this));
            $(this).attr({
                "data-shopid":shop_id,
                "data-shoppos":shop_POS,
                "data-shopname":shop_name,
                "data-no-select":no_select
            });
        });
    }
    /**
     * popView根据鼠标点击位置弹出店铺的信息页面
     * @type {popView}
     */
    var popView=sv.popView=function(evt,mouseTarget) {
        //todo:
        console.log($(mouseTarget).attr("data-no-select"));
        console.log(typeof($(mouseTarget).attr("data-no-select")));
        if($(mouseTarget).attr("data-no-select")==true||$(mouseTarget).attr("data-no-select")=='true'){
            return;
        }
        var mouseTarget = mouseTarget;
        var targetId = $(mouseTarget).attr("id");
        if (targetId == "svgRoot" || targetId == "svgRoot") {
            $(".cur-select-mask").popover("destroy").remove();
        } else {
            //这里考虑compressed的情况。
            var $cur_select = sv.getSelect(mouseTarget);
            $cur_select.each(function (i, e) {
                this.classList.add("cur-select");
            });
            //mouseTarget.classList.add("cur-select");
            //var offsetX = evt.offsetX;
            //var offsetY = evt.offsetY;
            var offsetX=evt.pageX-$("#zl-svg").offset().left;
            var offsetY=evt.pageY-$("#zl-svg").offset().top;
            $(".cur-select-mask").popover("destroy").remove();

            var data=getTargetData(mouseTarget);
            var data_str="";
            var shop_NS={
                "shop_id":"商铺ID",
                "shop_pos":"商铺位置",
                "shop_name":"商铺名称"
            }
            $.each(data,function(k,v){
                //todo:
                if(shop_NS[k]){

                    data_str+= ['<tr>',
                        '<th>',
                        shop_NS[k],
                        '</th>',
                        '<td>',
                        v!=undefined?v:"暂无信息",
                        '</td>',
                        '</tr>'].join("");
                }

            });

            console.log("offset-----------------------------"+offsetX+"----------y"+offsetY);
            $("<div class='cur-select-mask'><em class='glyphicon glyphicon-map-marker'></em></div>").css({
                top: parseInt(offsetY - 22) + "px",
                left: parseInt(offsetX - 11) + "px"
            }).appendTo(".zl-mainpanel-inner").popover({
                container: "body",
                title: "商铺信息",
                content: svg_editor.view_template,
                placement: "auto",
                html: true,
                trigger: "manual",
            });
            $(".cur-select-mask").popover("show");
            var $view_temp=$("#svg-data-view tbody");
            $view_temp.append(data_str);
        }
    }
    /**
     * popEditor根据鼠标点击位置弹出店铺的编辑页面
     * @type {popEditor}
     */
    var popEditor=sv.popEditor=function(evt,mouseTarget) {
        var mouseTarget= mouseTarget;
        var targetId=$(mouseTarget).attr("id");
        if (targetId== "svgRoot" || targetId=="svgRoot") {
            if($("#zl-edit-submit")){
                $("#zl-edit-submit").off("click");
            }
            $(".cur-select-mask").popover("destroy").remove();
        } else {
            //这里考虑compressed的情况。
            var $cur_select=sv.getSelect(mouseTarget);
            $cur_select.each(function(i,e){
               this.classList.add("cur-select");
            });

            //mouseTarget.classList.add("cur-select");
            //var offsetX = evt.offsetX;
            //var offsetY = evt.offsetY;
            var offsetX=evt.pageX-$("#zl-svg").offset().left;
            var offsetY=evt.pageY-$("#zl-svg").offset().top;
            /**
             * old 用snap.svg增加样式
             */
            /*
            s.select(".cur-select").attr({
                fill: "#fc0",
                stroke: "#000",
                strokeWidth: 18, // CamelCase...
                "fill-opacity": 0.5, // or dash-separated names

            });
            */
            $("#zl-edit-submit").off("click");
            $(".cur-select-mask").popover("destroy").remove();
            // $(".cur-select-mask").remove();


            $("<div class='cur-select-mask'><em class='glyphicon glyphicon-map-marker'></em></div>").css({
                top: parseInt(offsetY - 22) + "px",
                left:parseInt(offsetX-11) + "px"
            }).appendTo(".zl-mainpanel-inner").popover({
                container: "body",
                title: "编辑信息",
                content: svg_editor.edit_form_template,
                placement: "auto",
                html: true,
                trigger: "manual",
            });
            var data=getTargetData(mouseTarget);

            $(".cur-select-mask").popover("show");
            $("#shopID").val(data['shop_id']);
            $("#shopArea").val(data['shop_pos']);
            $("#shopName").val(data["shop_name"]);
            $("#shopName").val(data["shop_name"]);
            //shop_data['no_select']=$mouseTarget.attr("no-select");
            console.log(data['no_select']);
            if(typeof data['no_select']=="undefined"||data['no_select']==null||data['no_select']==false){
                var checked=false;
            }else{
                var checked=true;
            }

            console.log(checked)
            $("#no-select-area").prop("checked",checked);

            $("#zl-edit-submit").on("click",function(e){
                e.preventDefault();
                setShopData($cur_select);
                $("#zl-edit-submit").off("click");
                $(".cur-select-mask").popover("destroy").remove();
            });
        }
    }//end popEditor

    var splitEditor=sv.splitEditor=function(evt,mouseTarget){
        var targetId = $(mouseTarget).attr("id");

        $(".cur-select").each(function (i, e) {
            this.classList.remove("cur-select");
        });

        if (targetId == "svgRoot" || targetId == "svgRoot") {
            return;
        } else {
            var $cur_select = sv.getSelect(mouseTarget);
            //var $cur_select = sv.getSelect(mouseTarget);
            $cur_select.each(function (i, e) {
                this.classList.add("cur-select");
            });
        }
    }//end splitEditor

    var compressedEditor=sv.compressedEditor=function(evt,mouseTarget){

        var mouseTarget= mouseTarget;
        var targetId=$(mouseTarget).attr("id");
        //根据鼠标按下时有没有按住Shift判断全选还是重选
        //重构时取消操作curSelectSet中元素，只根据元素状态来操作会更简单；
        if (targetId== "svgRoot" || targetId=="svgRoot") {
            if(evt.shiftKey==false) {
                $(".cur-select").each(function (i, e) {
                    this.classList.remove("cur-select");
                });
                //curSelectSet = [];
            }else{ //(e.shiftKey==true)
               // curSelectSet.push(mouseTarget);
            }
        } else {
            if(evt.shiftKey==false) {
                $(".cur-select").each(function (i, e) {
                    this.classList.remove("cur-select");
                });
                //curSelectSet = [];
                //这里考虑compressed的情况。
                var $cur_select=sv.getSelect(mouseTarget);
                $cur_select.each(function(i,e){
                    this.classList.add("cur-select");
                });
            }else{ //(e.shiftKey==true)
                if(mouseTarget.classList.contains("cur-select")){
                    mouseTarget.classList.remove("cur-select");
                }else{
                    //这里考虑compressed的情况。
                    var $cur_select=sv.getSelect(mouseTarget);
                    $cur_select.each(function(i,e){
                        this.classList.add("cur-select");
                    });
                    //mouseTarget.classList.add("cur-select");
                }
                // curSelectSet.push(mouseTarget);
            }

        }//end if else

    };


    sv.addStyle=function(style){
        var $container= $("#zl-svg");
        var $style=$container.find("style");
        if($style.length==0){
            $container.find("defs").last().prepend(style);
        }else{
            $style.last().after(style);
        }
    };


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

    /**
     * 以下几个方法为本地保存svg的实用方法
     * @returns {XML|string|*|void}
     */

    function getFileNameFromTitle () {
       // var title = svgCanvas.getDocumentTitle();
        var title="svgDownload";//改成楼层和工程；
        return $.trim(title).replace(/[\/\\:*?"<>|]/g, '_');
    }
    function xhtmlEscape(str) {
        return str.replace(/&(?!amp;)/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    }
    function clientDownloadSupport (filename, suffix, uri) {
        var a,
            support = $('<a>')[0].download === '';
        if (support) {
            a = $('<a>hidden</a>').attr({download: (filename || 'image') + suffix, href: uri}).css('display', 'none').appendTo('body');
            a[0].click();
            return true;
        }
    }
    // Converts a string to base64
    encodeUTF8=sv.encodeUTF8=function(input){
        return unescape(encodeURIComponent(input));
    }
    encode64=sv.encode64 = function(input) {
        // base64 strings are 4/3 larger than the original string
        input = encodeUTF8(input); // convert non-ASCII characters
        // input = svgedit.utilities.convertToXMLReferences(input);
        if (window.btoa) {
            return window.btoa(input); // Use native if available
        }
        var output = [];
        output.length = Math.floor( (input.length + 2) / 3 ) * 4;
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0, p = 0;

        do {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output[p++] = KEYSTR.charAt(enc1);
            output[p++] = KEYSTR.charAt(enc2);
            output[p++] = KEYSTR.charAt(enc3);
            output[p++] = KEYSTR.charAt(enc4);
        } while (i < input.length);

        return output.join('');
    };

    sv.saveSVG=function(data) {
        var svg = '<?xml version="1.0" encoding="UTF-8"?>\n' + data, // Firefox doesn't seem to know it is UTF-8 (no matter whether we use or skip the clientDownload code) despite the Content-Disposition header containing UTF-8, but adding the encoding works
            filename = getFileNameFromTitle();

        if (clientDownloadSupport(filename, '.svg', 'data:image/svg+xml;charset=UTF-8;base64,' + sv.encode64(svg))) {
            return;
        }else{
            alert("浏览器不支持本地下载");
        }
    }//end savSVG

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


/**
 * 根据不同的操作模式响应不同的页面事件
 */
//svg操作 open,import,save, export,
var handler=svg_editor.handler= (function(){
    var hd={};
    if(!svg_editor){
        //handler依赖svg_eidtor;
        // alert("初始化失败，请检查网络链接");
        return false;
    }
    var sv=svg_editor;

    hd.saveHandler=function(){

    };

    hd.codeHandler=function(){
        if(sv.curMode=="code"){
            var svg=Snap("#svgRoot");
            var svg_string=svg.toString();
            $("#svg-code").val(svg_string);
            $("#zl-svg-code").modal("show");
        }
    };
    hd.exportHandler=function(e){
        if(sv.curMode=="export"){
            var svg=Snap("#svgRoot");
            var svg_string=svg.toString();
           sv.saveSVG(svg_string);
        }
    };
    hd.openHandler=function(){

    };
    hd.importHandler=function(){

    };
    hd.viewHandler=function(e){
        if(sv.curMode=="view"){
            $(".cur-select").each(function(i,e){
                this.classList.remove("cur-select");
            });
            var mouseTarget= svg_editor.getMouseTarget(e);
            svg_editor.popView(e,mouseTarget);
        }
    };
    hd.editHandler=function(e){

        if(sv.curMode=="edit"){
            $(".cur-select").each(function(i,e){
                this.classList.remove("cur-select");
            });
            var mouseTarget= svg_editor.getMouseTarget(e);
            svg_editor.popEditor(e,mouseTarget);
        }
        
    };

    hd.compressedHandler=function(e){
        if(sv.curMode=="compressed"){
            var mouseTarget= svg_editor.getMouseTarget(e);
            svg_editor.compressedEditor(e,mouseTarget);
        }
    };
    hd.splitHandler=function(e){
        if(sv.curMode=="split"){
            var mouseTarget= svg_editor.getMouseTarget(e);
            svg_editor.splitEditor(e,mouseTarget);
        }
    };
    return hd;
}());


/**
 *按项目 楼层 查找之前的平面图，编辑，或者替换
 * A.打开原有项目－－楼层
 *
 * B.新建项目－－楼层
 */

/**
 * Create New SVGMap
 * Mall={mallName:Mall名称,mallID:Mall标识， avgRentPrice:平均租金 , floors:楼层总数， createDate:创建日期，creator:创建人,
 *      updateHistory:[{updateDate:升级日期，responsible:责任人,updateCommits:升级说明}]
 * }
 *
 * 设计目的，页面加载后先读取相关的mall-floor数据，自行进行渲染，填充
 * 实现 svg渲染，数据， label状态标示 管理分离
 *
 * labelIndex={labelIndexName:label标示， createDate:创建日期, creator:创建人,
 *      labels:[{labelId:label标示，labelClass:对应标志的ClassName,//设计简单考虑，这里只使用一个标示？
 *               labelColor:标识颜色, labelStroke:标识描线,
 *               labelHoverColor:Hover颜色, labelHoverStroke:Hover描线，
 *               //other status
 *      },],
 *       updateHistory:[{updateDate:升级日期，responsible:责任人,updateCommits:升级说明},],
 *      }
 *
 * mapFloor={
 *          floorIndex:楼层， mall:商场名称, mapFloorIndex: 当前楼层, mapFloorSVG:svg地址，
 *          createDate:创建日期，creator:创建人,
 *          curfloorInfos：｛shopsCount:铺位总数, shopsRented:已租铺位， shopRendRate：开业率｝//curfloorInfos:地图无法体现，为后台维护数据
 *          avgRentPrice:平均租金，
 *          shops:[
 *              ｛shopID：shopID, shopPOS：商铺位置, shopArea: shop面积, merchant:商户名称,
 *                shopStatus://商铺状态－－对镜响应lableClass *****,
 *                shopType:商铺类型 -- 对应labelClass（多经？）
 *                rentAvgPrice:平均租金，rentPriceCount:租金总额,
  *               shopPhoto：点位效果图，
  *               shopDoc：｛docName:文档名称,docHref: #href}
  *
 *              ｝,
 *          ],//shop列表
 *
 *          updateHistory:[{updateDate:升级日期，responsible:责任人,updateCommits:升级说明}]，
 *    }
 */


//toolbar functions


//import open svg functions


//save svg function


//svg upload functions


//svg group ungroup functions

//svg drag select functions


//svg scale functions

//svg callback functions


//localstorage functions

//svg symbol libs


svg_editor.init=function(){

    $(document).on("click","#zl-svg",function(e){
        if(svg_editor.curMode){
            var curMod=svg_editor.curMode;
            switch(curMod){
                case "view":
                    console.log(e);
                    svg_editor.handler.viewHandler(e);
                    break;
                case "edit":
                    svg_editor.handler.editHandler(e);
                    break;
                case "compressed":
                    svg_editor.handler.compressedHandler(e);
                    break;
                case "split":
                    svg_editor.handler.splitHandler(e);
                    break;
                case "import":
                    break;
                case "export":
                    break;
                /*
                * 这里不需要从svg取得事件
                 */
                //case "code":
                //    svg_editor.handler.codeHandler(e);
                //    break;
                default:
                    //"view" 激活view mod

            }
        }else{
            svg_editor.curMode="view";
            svg_editor.handler.viewHandler(e);
            $("#svg-viewer").trigger("click");
        }
    });


};

svg_editor.zoomPan=function(){
    var svgZoom = $("#zl-svg>svg").svgPanZoom();
    svgZoom.events.mouseWheel= false;

    $("div#zoom-pan button").off().on("click",function(e){
        if ($(this).hasClass("btn-plus")){
            svgZoom.zoomIn()
        }

        if ($(this).hasClass("btn-minus")){
            svgZoom.zoomOut()
        }

        if ($(this).hasClass("btn-refresh")){
            svgZoom.reset()
        }
        $(".cur-select-mask").popover("destroy").remove();
    });
}
//svg加载后,刷新
svg_editor.refresh=function(){
    var sv=svg_editor;
    var root=sv.root=$("#zl-svg").children("svg").get(0);//checked
    $(root).attr("id","svgRoot");
    $(root).removeAttr("width height");
    $(root).find("#svg-legend-style").remove();
    var rootGroup=$(root).children("g");
    //初始化时对根元素下的直接元素进行一遍解析，add rootGroup to <g>,这部分内容是ai作图时的群组或者图层元素
    //getMouseTarget解析时，可以判断遇到rootGroup即停止向上遍历
    //重要的事情说三遍，svg的遍历之后要再检查，目前只根据业务逻辑采用了最简单的遍历条件，可能会有bug.
    $(rootGroup).each(function(i,e){
        e.classList.add("rootGroup");
    });

    $(".rootGroup").children("g").each(function(i,e){
        if(e.classList.length==0){
            e.classList.add("default");
        }
        console.log(!e.classList.contains("no-select")&& !$(e).attr("data-no-select")==true)
        if(!e.classList.contains("no-select")&& !$(e).attr("data-no-select")==true){
            console.log("---------------")
            $(e).children().removeAttr("fill stroke class");
        }

    });
    //svg加载后，再加入class，要么可能存在样式权限的问题
      svg_editor.addStyle(svg_editor.legendStyle);
    //切换至view mod
    $("#svg-viewer").trigger("click");
    svg_editor.zoomPan();

};

$(document).ready(function(){
    svg_editor.init();
});
/*增加全局滚轮时间*/
var addEvent = (function(window, undefined) {
    var _eventCompat = function(event) {
        var type = event.type;
        if (type == 'DOMMouseScroll' || type == 'mousewheel') {
            event.delta = (event.wheelDelta) ? event.wheelDelta / 120 : -(event.detail || 0) / 3;
        }
        //alert(event.delta);
        if (event.srcElement && !event.target) {
            event.target = event.srcElement;
        }
        if (!event.preventDefault && event.returnValue !== undefined) {
            event.preventDefault = function() {
                event.returnValue = false;
            };
        }
        /*
           ......其他一些兼容性处理 */
        return event;
    };
    if (window.addEventListener) {
        return function(el, type, fn, capture) {
            if (type === "mousewheel" && document.mozFullScreen !== undefined) {
                type = "DOMMouseScroll";
            }
            el.addEventListener(type, function(event) {
                fn.call(this, _eventCompat(event));
            }, capture || false);
        }
    } else if (window.attachEvent) {
        return function(el, type, fn, capture) {
            el.attachEvent("on" + type, function(event) {
                event = event || window.event;
                fn.call(el, _eventCompat(event));
            });
        }
    }
    return function() {};
})(window);

/*
addEvent(dom, "mousewheel", function(event) {
    if (event.delta < 0) { alert("鼠标向上滚了！"); }
});*/
