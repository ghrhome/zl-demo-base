/**
 * Created by cheng on 16/3/21.
 */
// Dependencies:
// 1. jQuery
// 2. bootstrape
// 3. svgeditor

/*legend操作实际逻辑需要对用户权限严格显示，建议后台保存相关配置，对legend的更改需要同步至svg map渲染 */
$(document).ready(function(){
   var legend_item=[
    '<tr>',
        '<td><em class="zl-em-icon zl-icon-legend" style="background-color:#ddd;"></em></td>',
        '<td><input type="text" disabled value="#ddd" class="zl-legend-color"></td>',
        '<td><input type="text" disabled value="" placeholder="/" class="zl-legend-name"></td>',
        '<td><input type="text" disabled value="" placeholder="/" class="zl-legend-class"></td>',
        '<td><a href="" class="zl-legend-del">删除</a><a href="" class="zl-lengend-edit">编辑</a></td>',
    '</tr>'
  ];

    var lengend_panel=[];

    //删除操作
   $("#legend").on("click","a.zl-legend-del",function(e){
       e.preventDefault();
       var confirm = window.confirm("确认删除？");
       if(confirm){
           $(this).closest("tr").remove();
       }
   });

   //新增
    $(".zl-legend-add").on("click",function(e){
        e.preventDefault();
        $("#legend tbody").append(legend_item.join(""));
    });

    //编辑
    $("#legend").on("click","a.zl-lengend-edit",function(e){
        e.preventDefault();
        var confirm = window.confirm("确认修改？");
        if(confirm){
            $("#legend").find("input").attr("disabled","true");
            $(this).closest("tr").find("input").removeAttr("disabled");
        }
    });

    //色值绑定--有时间的话更新成选择颜色---还有做色值的校验
    $("#legend").on("change","input.zl-legend-color",function(e){
        var target_color=$(this).val();
        $(this).closest("tr").find(".zl-icon-legend").css("background-color",target_color);
    });
    //提交保存
});