//图片弹出显示
$('.zl-thumbnail').magnificPopup({
    type: 'image',
});

//初始化进度条
$('.ampslider').slider({
    min: 0,
    max: 100,
    value: 0,
    tooltip: 'hide'
});

//初始化时间控件
$(".zl-date").find("input").datetimepicker({
    format:"yyyy-mm-dd hh:ii",
    todayBtn:"linked",
    startView:1,
    minView:0,
    maxView:1,
    minuteStep:5,
    autoclose: true,
    language:"zh-CN"
}).on('changeDate', function(e){
});

//组装突发事件图片表单数据
function sPathUrl(id){
    var ind = 1;
    $('#img_ul_'+id).find('em').each(function () {
        if (ind < 5) {
            if (ind == 1) {
                $("#p_1_"+id).val($(this).attr("data-mfp-src"));
            } else if (ind == 2) {
                $("#p_2_"+id).val($(this).attr("data-mfp-src"));
            } else if (ind == 3) {
                $("#p_3_"+id).val($(this).attr("data-mfp-src"));
            } else if (ind == 4) {
                $("#p_4_"+id).val($(this).attr("data-mfp-src"));
            }
            ind++;
        }
    });
}

function _getObjectURL(file) {
    var url = null;
    if (window.createObjectURL != undefined) { // basic
        url = window.createObjectURL(file);
    } else if (window.URL != undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
}

//注册删除图片
function registerDetelImg() {
    $('.zl-img-wrapper').off("click").on("click", ".zl-icon-btn-del", function (e) {
        e.preventDefault();
        //移除图片
        $(this).closest('li').remove();
    });
}

// 修改商场营业开始时间的小时
function changeStartHour(obj) {
    var hour = obj.innerHTML;
    $("#startHour")[0].innerHTML = hour;
}

// 修改商场营业开始时间的分钟
function changeStartMinute(obj) {
    var minute = obj.innerHTML;
    $("#startMinute")[0].innerHTML = minute;
}

// 修改商场营业开始时间的小时
function changeEndHour(obj) {
    var hour = obj.innerHTML;
    $("#endHour")[0].innerHTML = hour;
}

// 修改商场营业开始时间的分钟
function changeEndMinute(obj) {
    var minute = obj.innerHTML;
    $("#endMinute")[0].innerHTML = minute;
}

//注册上传文件
function registerFileUpload(id) {
    $('#fileupload_'+id).fileupload({
        dataType: 'json',
        add:function(e,data){
            if($('#img_ul_'+id).find('li').length == 4) {
                alert("最多只能上传4张图片");
                return false;
            }
            $.each(data.files, function (index, file) {
                uploadFiles(file, id);
            });
            data.submit();
        },
        done: function (e, data) {
        }
    })
}