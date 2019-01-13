/**
 * Created by user on 2016/3/10.
 */

//菜单操作－－与svgeditor的curMode绑定，以实现不同的操作；
$(document).ready(function(){
  window.lastOpt=null;

  //menu 切换
  $("a.zl-menu-context").on("click",function(e){
      e.preventDefault();
      last_opt="edit";
      if(!$(this).hasClass("active")){
          $("a.zl-menu-context").removeClass("active");
          var opt=$(this).attr("id");
          //按照id传入操作参数
          var curMode=svg_editor.changeMode(opt);
          $("#svg-mod>span").text($(this).attr("alt"));
          $(this).addClass("active");
      }
  });

    //编辑legend着色
    $("#legend-panel").on("click","li",function(e){
        e.preventDefault();
        if(svg_editor.curMode=="edit"){

            var cur_legend=$(this).attr("id");
            if(cur_legend=="all"){
                return;
            }

            var $cur_select=$(".cur-select");
            if($cur_select.length>0){
                $cur_select.each(function(i,e){
                    var old_legend=$(this).attr("data-legend");
                    if(old_legend){
                        this.classList.remove(old_legend);
                    }
                    this.classList.add(cur_legend);
                    $(this).attr("data-legend",cur_legend);
                });
            }
        }
        //todo: curMode=="view"
        if(svg_editor.curMode=="view"){
            var cur_legend=$(this).attr("id");

            $("#legend-panel .legend-panel-item").removeClass("active");
            $(this).addClass("active");
            //清除当前选择
            $(".cur-select").each(function(i,e){
                this.classList.remove("cur-select");
            });

            $("[data-legend]").each(function(i,e){
                var item_legend=$(this).attr("data-legend");
                 if(cur_legend=="all"){
                     this.classList.add(item_legend);
                 }else if(item_legend==cur_legend){
                     this.classList.add(item_legend);
                 }else{
                     this.classList.remove(item_legend);
                 }
            });

            /*
            var $cur_select=$(".cur-select");
            if($cur_select.length>0){
                $cur_select.each(function(i,e){
                    var old_legend=$(this).attr("data-legend");
                    if(old_legend){
                        this.classList.remove(old_legend);
                    }
                    this.classList.add(cur_legend);
                    $(this).attr("data-legend",cur_legend);
                });
            }*/
        }


    });
    //拆铺操作
    $("#split-button").on("click",function(e){
        e.preventDefault();

        if($("#compressed-show").hasClass("active")){
            alert("每次只能对单一合铺进行拆铺！");
            return;
        }
        var $cur_select=$(".cur-select");

        if($cur_select.length>0 && $cur_select.get(0).classList.contains("compressed")){
           var compressed_class="compressed-"+$cur_select.data("compressed");
            $cur_select.each(function(i,e){
                this.classList.remove("compressed");
                this.classList.remove(compressed_class);
                this.classList.remove("cur-select");
            });
            alert("拆铺完成");
        }else{
            alert("没有可进行的拆铺操作");
        }
    });

    $("#compressed-show").on("click",function(e){
        e.preventDefault();
        if($(this).hasClass("active")){
            $(".compressed").each(function(i,e){
                this.classList.remove("cur-select");
            });
            $(this).removeClass("active");
        }else{
           $(this).addClass("active");
            $(".compressed").each(function(i,e){
                this.classList.add("cur-select");
            });
        }
    });

   //合铺操作
  $("#compressed-button").on("click",function(e){
      e.preventDefault();
      var set_class=$("#compressed-info input").val();
      var cur_select_set=$(".cur-select");
      if(set_class=="" ||set_class==null){
          alert("请先输入合铺ID");
          return;
      }
      if(cur_select_set.length <=1){
          alert("至少选择两个独立店铺进行合铺");
          return;
      }
      $(".cur-select").each(function(i,e){
          $(this).attr("data-compressed",set_class);
          var curClassList=this.classList;
          curClassList.add("compressed");
          curClassList.add("compressed-"+set_class);
          curClassList.remove("cur-select");
      });

      //合铺id input 归零
      $("#compressed-info input").val("");
  });

    //save svg
    $("#zl-svg-save").on("click",function(e){
        e.preventDefault();
        last_opt="save";
    });

    if(lastOpt!="save"){
        window.onbeforeunload=function(e){
            return "尚未保存，确认关闭？";
        }
    }

    //本地导出svg
    $("#svg-export").on("click",function(e){
        e.preventDefault();
        svg_editor.handler.exportHandler();
    });

    //svg－code modal隐藏后状态重置
    $('#zl-svg-code').on('hidden.bs.modal', function (e) {
        // do something...
        $("#check-svg-code").removeClass("active");
    });

  /*
  //滑动或者修改input值，设定svg视口宽高
    $("#h-slider").slider({
        orientation: "vertical",
        range: "min",
        min: 0,
        max: 100,
        value: 60,
        slide: function (event, ui) {
            $("#h-amount").val(ui.value);
        }
    });
    $("#h-amount").val($("#h-slider").slider("value"));
    $("#w-slider").slider({
       // orientation: "horizenta",
        range: "min",
        min: 0,
        max: 100,
        value: 60,
        slide: function (event, ui) {
            $("#w-amount").val(ui.value);
        }
    });
    $("#w-amount").val($("#w-slider").slider("value"));
    */
});