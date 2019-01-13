/**
 * Created by plocc on 16/3/24.
 */
svg_editor.default={
    name:"legend",
    labels:[
        {"name":"全部", "class":"all",  "color":"#a4b5bd"},
        {"name":"未签署", "class":"default",  "color":"#a4b5bd",},
        {"name":"超市", "class":"super-market",  "color":"#f1dcbd"},
        {"name":"服饰", "class":"suit",  "color":"#ffabd4"},
        {"name":"配套", "class":"mating",  "color":"#b56d00"},
        {"name":"餐饮", "class":"food",  "color":"#ffe700"}
    ]
};
svg_editor.legend={
    render_table:function(labels){
        var $container=$("#legend tbody");
        $container.empty();
        $.each(labels,function(i,label){
            var table_item=render_table_item(label['name'],label["class"],label["color"]);
            $container.append(table_item);
        });

        function render_table_item(name,cls,color) {
            var table_template = [
                '<tr>',
                '<td><em class="zl-em-icon zl-icon-legend" style="background-color:',
                color,
                '"></em></td>',
                '<td><input type="text" disabled value="',
                color,
                '" class="zl-legend-color">',
                '</td>',
                '<td><input type="text" disabled value="',
                name,
                '" placeholder="/" class="zl-legend-name">',
                '</td>',
                '<td><input type="text" disabled value="',
                cls,
                '" placeholder="/" class="zl-legend-class">',
                '</td>',
                '<td><a href="" class="zl-legend-del">删除</a><a href="" class="zl-lengend-edit">编辑</a></td>',
                '</tr>'
            ];
            return table_template.join("");

        };
    },//end render-table
    render_panel:function(labels){

        var $container=$("#legend-panel");

        $container.empty();
        $.each(labels,function(i,label){
            var panel_item=render_panel_item(label['name'],label["class"],label["color"]);
            $container.append(panel_item);
        });

        function render_panel_item(name,cls,color) {
            var panel_template = [
                '<li id="',
                cls,
                '" class="legend-panel-item"><em class="zl-em-icon zl-icon-legend" style="background-color:',
                 color,
                '"></em>',
                name,
                '</li>'
            ];
            return panel_template.join("");
        };

    },//end render_panel

    render_style:function(labels){
        /**
         * 根据id=svg-legend-style判断是否已经存在相应的style，如果存在，先删除，再添加
         */
        var legend_style=$("#svg-legend-style");
        if(legend_style.length>0){
            $("#svg-legend-style").remove();
        }

        var style_elm_before='<style type="text/css" id="svg-legend-style">' ;

        var style_plus="[data-shopid]{fill:#DCEFF4}";
        style_elm_before+=style_plus;

        var style_elm_after='</style>';

        $.each(labels,function(i,label){
            var style_item=render_style_item(label['name'],label["class"],label["color"],label);
            style_elm_before+=style_item;
        });

        svg_editor.legendStyle=style_elm_before+style_elm_after;
        //console.log(svg_editor.legendStyle);
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

svg_editor.legend_init=function(url){
    var sv=svg_editor;
    var legend=svg_editor.legend;

    $.getJSON(url,function(data){
        //console.log(data);
        var legend_data= $.extend(svg_editor.default,data);
        //console.log(legend_data.labels);
        legend.render_table(legend_data.labels);
        legend.render_panel(legend_data.labels);
        legend.render_style(legend_data.labels);
    });
};

svg_editor.legend_init("legend_json.json");