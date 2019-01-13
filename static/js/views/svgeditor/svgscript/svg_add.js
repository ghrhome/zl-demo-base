/**
 * Created by plocc on 16/3/21.
 */

/*新建svg 项目 上传svg */
var svg_add=(function(sv){
    var svg_add=sv;

    var svg_mainInfo;
    if(!svg_editor){
        window.svg_editor={};
    }
    if(!svg_editor.svg_mainInfo){
        svg_mainInfo=svg_editor.svg_mainInfo={}
    }

    svg_add.select_opt=function(el){
        var cur_val=$(el).data("id");
        var cur_name=$(el).text();
        $(el).parent("li").addClass("active").closest(".zl-dropdown-menu").find("button>em").text(cur_name).parent().data("id",cur_val);
    };

    //svg_add.url="";
    svg_add.handleFiles=function(files){
        if(files.length){
            //不处理多选
            var file = files[0];

            if ((file.type.indexOf('image') != -1) &&  (file.type.indexOf('image') != -1)) {
                var reader = new FileReader();
                reader.onload = function(){
                    //插入“.zl-svg” 放入保存操作处理
                    $("#zl-svg-filename").text(file.name);
                    svg_editor.svg=this.result;
                    console.log(this.result);
                };
                reader.readAsText(file);
            }else{
               alert("请上传svg文件！");

            }
        }

    };

    svg_add.upload=function(url,callback,opts){
       //later check with ajax online_data
        if(!url){
            var project_id=$("#zl-project-select>button").data("id");
            var floor_id=$("#zl-floor-select>button").data("id");
            var svg_map_title=$("#svg-map-title").val();
            var svg_map_creator=$("#zl-svg-map-creator").val();
            var svg_map_comments=$("#zl-svg-map-comments").val();
            var svg_prefix=$("#zl-svg-prefix").val();

            if(!svg_editor.svg){
                alert("请先上传svg文件！");
                /*$.get("http://localhost:63342/business_system_2016_03_28-svg-update/business_system_2015_11_05/t3.svg",function(data,status){
                    console.log(data);
                    alert("...");
                    svg_editor.svg=parseXML(data);

                    $("#zl-btn-add-svg").text("编辑");
                    $("#zl-svg-save").fadeIn();

                    $(".zl-svg-creator-inputs").slideUp(
                        function(){
                            console.log($("#zl-svg"));
                            console.log( $("#zl-svg").html());
                           // $("#zl-svg").html(data);
                            $(data).find("svg").appendTo("#zl-svg");
                            $("#zl-svg").append(data);
                            //页面加载后,刷新
                            svg_editor.refresh();
                            $(".zl-svg-editor").slideDown();
                        }
                    );
                });*/
                /*  Snap.load("http://localhost:63342/business_system_2016_03_28-svg-update/business_system_2015_11_05/t3.svg",function(data){

                      $("#zl-btn-add-svg").text("编辑");
                      $("#zl-svg-save").fadeIn();
                      $(".zl-svg-editor").slideDown();
                      $(".zl-svg-creator-inputs").slideUp(
                          function(){
                              $("#zl-svg").html(svg_editor.svg).prepend("<defs></defs>");
                              //页面加载后,刷新
                              var svg=Snap("#zl-svg");
                              console.log(svg);
                              svg.append(data);
                              svg_editor.refresh();

                          }
                      );
                      //svg.add(data);

                  });
      */
            }else{
                svg_mainInfo["project_id"]=project_id;
                svg_mainInfo["floor_id"]=floor_id;
                svg_mainInfo["svg_map_title"]=svg_map_title;
                svg_mainInfo["svg_map_creator"]=svg_map_creator;
                svg_mainInfo["svg_map_comments"]=svg_map_comments;
                svg_mainInfo["svg_prefix"]=svg_prefix;
                svg_mainInfo["svg"]=svg_editor.svg;
                //保存相关svg信息
                //$.ajax()
                $("#zl-btn-add-svg").text("编辑");
                $("#zl-svg-save").fadeIn();

                $(".zl-svg-creator-inputs").slideUp(
                    function(){
                        $("#zl-svg").html(svg_editor.svg).prepend("<defs></defs>");
                        //页面加载后,刷新
                        svg_editor.refresh();
                        $(".zl-svg-editor").slideDown();
                    }
                );
            }
        }else{
            Snap.load(url,function(data){

                $("#zl-btn-add-svg").text("编辑");
                $("#zl-svg-save").fadeIn();
                $(".zl-svg-editor").slideDown();
                $(".zl-svg-creator-inputs").slideUp(
                    function(){
                        $("#zl-svg").html(svg_editor.svg).prepend("<defs></defs>");
                        //页面加载后,刷新
                        var svg=Snap("#zl-svg");
                        console.log(svg);
                        svg.append(data);
                        svg_editor.refresh();

                    }
                );
                //svg.add(data);

            });
        }

    };
    return svg_add;
}(svg_add ||{}));

$(document).ready(function(){
    $("#zl-btn-add-svg").on("click",function(e){
        e.preventDefault();
        var project_id=$("#zl-project-select>button").data("id");
        var floor_id=$("#zl-floor-select>button").data("id");
        if(!project_id || !floor_id){
            alert("请先选择项目和楼层！");
        }else{
            $(".zl-svg-creator-inputs").slideDown();
        }
    });
    //选定项目， 楼层
    $(".zl-svg-creator-edit").on("click","a",function(e){
        e.preventDefault();
        svg_add.select_opt(this);

    });

    $("#zl-svg-uploader").fileupload({
        change: function (e, data) {
            svg_add.handleFiles(data.files);
        }
    }).prop('disabled', !$.support.fileInput)
        .parent().addClass($.support.fileInput ? undefined : 'disabled');


    $("#btn-svg-edit-cancel").on("click",function(e){
        e.preventDefault();
        $(this).closest(".zl-svg-creator-inputs").slideUp();
    });
    //表单保存
    $("#btn-svg-edit-submit").on("click",function(e){
        e.preventDefault();
        svg_add.upload();
    });
    //svg_add.upload()

    svg_add.upload("../svg_file/4.svg", function(){

    });
});
