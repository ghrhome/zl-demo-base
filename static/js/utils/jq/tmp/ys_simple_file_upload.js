//这个用fileuploader的简洁模式替代
(function($){

    var defaultSettings = {
        acceptTypes:["jpg","png","JPG","PNG","bmp","BMP","svg","SVG"], // 接受的上传文件类型
        changeCallback:function(file){

        } // 自定义input[type=file] change事件
    };

    var renderHtml = "<input type='file' style='display:none;'/>";

    // 添加隐藏的
    function renderInputFile(target,settings){
        // 生成dialog唯一标识
        var id = "ys_simple_file_upload_"+new Date().getTime()+""+parseInt(Math.random()*10000);
        $(target).attr("ys_simple_file_upload",id);
        $(renderHtml).attr("id",id).appendTo("html"); // 添加到文档中去
        return $("#"+id);
    }

    function bindEventHandlers(target,container,settings){
        var changeCallback = settings.changeCallback;

        $(container).change(function(e){
            e.preventDefault();
            e.stopPropagation();
            var file = e.target.files[0];

            if(file==null){
                return;
            }

            if(!validateFileType(file,settings)){
                alert("文件类型不正确!");
                // 清除value
                $(this).val("");
                return;
            }
            changeCallback.call(target,file);

            // 清除value
            $(this).val("");
        });
    }

    // 验证文件类型
    function validateFileType(file,settings){
        var acceptTypes = settings.acceptTypes;
        var name = file.name;
        var fileSuffix = name.substr(name.lastIndexOf(".")+1);
        for(var i=0;i<acceptTypes.length;i++){
            var acceptType = acceptTypes[i];
            if(acceptType==fileSuffix){
                return true;
            }
        }
        return false;
    }

    var options = {
        ysSimpleUploadFile:function(settings) {
            var mergedSettings = {};
            $.extend(mergedSettings,defaultSettings,settings);

            $(this).each(function(){
                var container = renderInputFile(this,mergedSettings);

                bindEventHandlers(this,container,mergedSettings);

                $(this).click(function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    $(container).click();
                });
            });


        }
    };
    $.fn.extend(options);
})(jQuery);