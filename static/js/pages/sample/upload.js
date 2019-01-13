/**
 * Created by whobird on 17/12/18.
 */
define([
    'jquery',
    'handlebars',
    "underscore",
    "jquery.bootstrap",
    "jquery.datetimepicker",
    "jquery.datetimepicker.zh",
    //todo:replace the original slimScroll with iscroll
    'swiper',
    'pin',
    "utils/ys/uploader"
],function(jquery){
    'use strict';

    var sampleView=(function($,sv){
        var sampleView=sv;
        var url="http://localhost:8888";
        sampleView.init=function(){
            $('#fileupload').fileupload({
                url: url,
                dataType: 'json',
                add:function(e,data){
                    console.log(data);
                    console.log(e);
                    data.submit();
                },
                done: function (e, data) {
                    $.each(data.result.files, function (index, file) {
                        $('<p/>').text(file.name).appendTo('#files');
                    });

                },
                progressall: function (e, data) {
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    $('#progress .progress-bar').css(
                        'width',
                        progress + '%'
                    );
                }
            }).prop('disabled', !$.support.fileInput)
                .parent().addClass($.support.fileInput ? undefined : 'disabled');
        }

        return sampleView;

    })(jquery,sampleView||{});

    return sampleView;
});