/**
 * Created by ghrhome on 16/3/20.
 */

/**
 * svg viewer 实现
 * 连接svg图形与相应的数据绑定
 * 用户自定的callback与自定义事件的绑定
 *
 */
var svg_viewer=(function (sv){
    sv.curMode="view";
    sv.mouseTarget=null;
    //svg container ID
    var container=sv.container=$("#zl-svg").get(0);//checked
    var root=sv.root=$("#zl-svg").children("svg").get(0);//checked
    $(root).attr("id","svgRoot");
    var rootGroup=$(root).children("g");

    var curSelect,lastSelect,curRootGroup;//如果在ai作图时，分过图层或者自行做过群组，取mouseTarget时，以curRootGroup作为搜索终点


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
        //var sv=svg_editor;
        var sv=svg_viewer;
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
        //console.log(mouseTarget);
        shop_data['shop_id']=$mouseTarget.attr("data-shopid");
        shop_data['shop_pos']=$mouseTarget.attr("data-shoppos");
        shop_data['shop_name']=$mouseTarget.attr("data-shopname");
        return shop_data;
    }

    /**
     * popView根据鼠标点击位置弹出店铺的信息页面---pd根据逻辑实现
     * @type {popView}
     */
    var popView=sv.popView=function(evt,mouseTarget,callback) {
        var mouseTarget = mouseTarget;
        var targetId = $(mouseTarget).attr("id");
        if (targetId == "svgRoot" || targetId == "svgRoot") {
            //$(".cur-select-mask").popover("destroy").remove();
            //callback(evt,mouseTarget);
        } else {
            //这里考虑compressed的情况。
            var $cur_select = sv.getSelect(mouseTarget);
            $cur_select.each(function (i, e) {
                this.classList.add("cur-select");
            });
            var data=getTargetData(mouseTarget);
            callback(evt,mouseTarget);

        }
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

    return sv;
})(svg_viewer || {});

var handler=svg_viewer.handler= (function() {
    var hd = {};
    if (!svg_viewer) {
        //handler依赖svg_viewer;
        // alert("初始化失败，请检查网络链接");
        return false;
    }
    var sv = svg_viewer;
    hd.viewHandler=function(e,callback){
        if(sv.curMode=="view"){
            $(".cur-select").each(function(i,e){
                this.classList.remove("cur-select");
            });
            var mouseTarget= svg_editor.getMouseTarget(e);
            svg_editor.popView(e,mouseTarget,callback);

        }
    };
    return hd;
}());

svg_viewer.init=function(callback){

    $(document).on("click","#zl-svg",function(e){
        if(svg_viewer.curMode){
            var curMod=svg_viewer.curMode;
            switch(curMod){
                case "view":
                    svg_viewer.handler.viewHandler(e,callback);
                    break;
                default:
                //"view" 激活view mod
            }
        }else{
            svg_viewer.curMode="view";
            svg_viewer.handler.viewHandler(e);
           // $("#svg-viewer").trigger("click");
        }
    });
};

//svg加载后,刷新
svg_viewer.refresh=function(){
    var sv=svg_viewer;
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
    svg_viewer.addStyle(svg_viewer.legendStyle);
    //切换至view mod
    //$("#svg-viewer").trigger("click");
};


/**
 * svg_viewer legend
 * @param url
 */
svg_viewer.default={
    name:"legend",
    labels:[
        {"name":"未签署", "class":"default", "color":"#a4b5bd"},
        {"name":"超市", "class":"super-market",  "color":"#f1dcbd"},
        {"name":"服饰", "class":"suit",  "color":"#ffabd4"},
        {"name":"配套", "class":"mating",  "color":"#b56d00"},
        {"name":"餐饮", "class":"food",  "color":"#ffe700"}
    ]
};
svg_viewer.legend={

    render_style:function(labels){
        /**
         * 根据id=svg-legend-style判断是否已经存在相应的style，如果存在，先删除，再添加
         */
        var legend_style=$("#svg-legend-style");
        if(legend_style.length>0){
            $("#svg-legend-style").remove();
        }

        var style_elm_before='<style type="text/css" id="svg-legend-style">' ;
        var style_elm_after='</style>';

        $.each(labels,function(i,label){
            var style_item=render_style_item(label['name'],label["class"],label["color"],label);
            style_elm_before+=style_item;
        });
        svg_viewer.legendStyle=style_elm_before+style_elm_after;
        //console.log(svg_viewer.legendStyle);
        function render_style_item(name,cls,color,label) {
            var style_template = [
                ".",
                cls,
                '{fill:',
                color,
                ';fill-opacity:',
                label["fill-opacity"]?label['fill-opacity']:1,
                ';stroke-width:',
                label["stroke-width"]?label["stroke-width"]:0,
                ";stroke:",
                label["stroke"]?label["stroke"]: "none",
                ";stroke-dasharray:",
                label["stroke-dasharray"]?label["stroke-dasharray"]:"none",
                ";cursor:",
                label["cursor"]?label["cursor"]:"default",
                ';}'
            ];
            return style_template.join("");
        };
    }//end render_style
};

svg_viewer.legend_init=function(url){
    var sv=svg_viewer;
    var legend=svg_viewer.legend;

    $.getJSON(url,function(data){
        //console.log(data);
        var legend_data= $.extend(svg_viewer.default,data);
        //console.log(legend_data);
        legend.render_style(legend_data.labels);
    });
};

$(document).ready(function(){
    //用户自定的callback,处理传入的svg图形data(商铺id）
    function callback(evt,mouseTarget){

    };

    svg_viewer.init(callback);
    svg_viewer.legend_init("legend_json.json");

});