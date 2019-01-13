
//下拉框事件
$(function(){
    $(".dropdown-menu li a").click(function(e){
        //e.stopPropagation();
        //e.preventDefault();

        var value = $(this).html();
        var key = $(this).attr("key");

        //$(this).parent().parent().prev().prev().text(value);
        //
        //console.log($(this).parent().parent().prev());
        //$(this).closest(".zl-select").find("button span").text(value);
        //console.log("value=" + value);
        //console.log("key=" + key);
        /*$(this).parent().parent().prev().text(value);
        $(this).parent().parent().prev().prev(":input").val(key);*/
        $(this).closest(".zl-select").find("button span").text(value);
        $(this).parent().parent().parent().children("input").val(key);
        $(this).parent().parent().parent().removeClass("open");

    });


    /**
     * 快速搜索 li 上的 searchKey 属性，按首字母大写匹配
     * 下拉快速选择
     * 要求： dropdown 的div 增加searchKey 属性，该属性用来做选择器
     *        ul下的li增加searchKey属性，该属性要来定位
     */
    var dropdownSearchTime;
    $("div.dropdown[searchKey]").on("keyup", function(e){
        var _that = $(this);
        var ulMenu = $(this).find("ul.dropdown-menu");
        var search = $(_that).attr("searchKey") + e.key.toUpperCase();

        $(this).attr("searchKey", search);
        var liList = $(ulMenu).find("li[searchKey^='" + search + "']");
        if(liList && liList.length>0){
            $(ulMenu).scrollTop($(liList[0]).offset().top - $(ulMenu).find("li:eq(0)").offset().top);
        }

        clearTimeout(dropdownSearchTime);
        dropdownSearchTime = setTimeout(function(){
            $(_that).attr("searchKey", "");
        }, 1200)
    });


    //渐变加载
    $('#preloader').delay(200).fadeOut(function(){
        //start
    });


    //控制最大长度
    $(":input[maxlength]").on("input", function(){
        var maxlength = $(this).attr("maxlength");
        if(maxlength!=null && maxlength>0){
            if($(this).val().length>maxlength){
                $(this).val($(this).val().slice(0,maxlength));
            }
        }
    })
});

//消息提示
function showMsg(resultData){
    if(typeof resultData != 'undefined'&&typeof resultData.msg !="undefined"){
        if( typeof resultData == 'string' ) {
            var bool = resultData.indexOf("html");
            if (bool) {
                alert("会话超时！");
                window.location.reload();
                return false;
            }
        }

        if(resultData.msg!=null && resultData.msg!=""){
            alert(resultData.msg);
            return false;
        }

    }

    alert("操作失败，请重试！");

}


// function formPost(url, params, target){
//     var temp = document.createElement("form");
//     temp.enctype = "multipart/form-data";
//     temp.action = url;
//     temp.method = "post";
//     temp.style.display = "none";
//
//     if(target){
//         temp.target = target;
//     }else{
//         showLoading();
//     }
//
//     for (var x in params) {
//         var opt = document.createElement("input");
//         opt.name = x;
//         opt.value = params[x];
//         temp.appendChild(opt);
//     }
//     document.body.appendChild(temp);
//
//     temp.submit();
// }



//是否为正整数
function isPositiveNum(s){
    var re = /^[0-9]*[1-9][0-9]*$/ ;
    return re.test(s)
}


// 压缩图片方法
function compressImage(maxWidth,maxHeight,srcOriginalImage,orientation,callback){
    // 创建 canvas
    var canvasId ="canvas_"+new Date().getTime()+""+parseInt(Math.random());
    $("<canvas></canvas>").hide().attr("id",canvasId).appendTo("body");

    var c=$("#"+canvasId)[0];
    var ctx=c.getContext("2d");

    // 释放canvas
    function releaseCanvas(){
        $("#"+canvasId).remove();
    }


    // 创建要绘制的Image对象
    var img = new Image();
    img.src = srcOriginalImage;
    // 等待img加载完毕
    img.onload = function(){
        // 与backgournd-size:contain效果相同
        if(img.width/img.height<maxWidth/maxHeight){
            c.height = img.height;
            if(img.height>maxHeight){
                c.height = maxHeight;
            }
            c.width = img.width/img.height*c.height;
        }else{
            c.width = img.width;
            if(img.width>maxWidth){
                c.width = maxWidth;
            }
            c.height = img.height/img.width*c.width;
        }


        var compressImageWidth = c.width;
        var compressImageHeight = c.height;

        if(orientation==6){
            // canvas 高度 宽度 互换
            var tmp = c.width;
            c.width = c.height;
            c.height= tmp;

            ctx.translate(c.width,0);
            ctx.rotate(Math.PI/180*90);
        }

        ctx.drawImage(img,0,0,img.width,img.height,0,0,compressImageWidth,compressImageHeight);

        callback(c.toDataURL());

        releaseCanvas();
    };
}


function uploadImgCallback(file){
    var fileReader = new FileReader();
    $(this).parent().height(136);
    var that = this;

    fileReader.onload = function(){
        $(that).next().css("display","block");
        $(that).next().attr("src",this.result);

        compressImage(1000,800,this.result, null, function(dataUrl){
            jQuery.ajax({
                url: ibrandWeb_Path + "/common/uploadImg.htm",
                type: 'POST',
                data: {base64:dataUrl,name:file.name},
                async: false,
                dataType:'json',
                cache: false,
                success: function (data) {
                    if (data.success == true) {
                        $(that).parent().parent().find("input.imgUrl").val(data.path);
                    } else {
                        alert(data.message);
                    }
                },
                error: function (data) {

                }
            });
        });
    };
    fileReader.readAsDataURL(file);
}


//收起
function hideDiv(obj){
    $(obj).parent().parent().parent().parent().slideUp();
    $(obj).parent().parent().parent().parent().parent().find("ul").eq(0).removeClass("zl-table-row-selected")
}

function digit_uppercase(n) {
    var fraction = ['角', '分'];
    var digit = [
        '零', '壹', '贰', '叁', '肆',
        '伍', '陆', '柒', '捌', '玖'
    ];
    var unit = [
        ['元', '万', '亿'],
        ['', '拾', '佰', '仟']
    ];
    var head = n < 0? '欠': '';
    n = Math.abs(n);
    var s = '';
    for (var i = 0; i < fraction.length; i++) {
        s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
    }
    s = s || '整';
    n = Math.floor(n);
    for (var i = 0; i < unit[0].length && n > 0; i++) {
        var p = '';
        for (var j = 0; j < unit[1].length && n > 0; j++) {
            p = digit[n % 10] + unit[1][j] + p;
            n = Math.floor(n / 10);
        }
        s = p.replace(/(零.)*零$/, '')
                .replace(/^$/, '零')
            + unit[0][i] + s;
    }
    return head + s.replace(/(零.)*零元/, '元')
            .replace(/(零.)+/g, '零')
            .replace(/^整$/, '零元整');
}


/**
 * 校验值是否为空
 * 不为空 返回 true 否则返回 false
 *
 * @param params
 * @returns {Boolean}
 */
function checkNotNull(params) {
    if (null !== params && "" !== params && typeof params != "undefined") {
        return true;
    }
    else {
        return false;
    }
}



/**
 * 打开合同文本明细
 * @param params
 */
function openContractDetail(contractNo) {
    formPost(enrolmentWeb_Path + "contract/detail.htm", {contractNo: contractNo}, '_blank');
}
/**
 * 打开网批明细
 * @param params
 */
function openNetDetail(masterId) {
    formPost(netcommentWeb_Path + "netcomment/openBillDetailByMasterId.htm", {masterId: masterId}, '_blank');
}
/**
 * 打开商家明细
 * @param params
 */
function openBrandDetail(brandId){
    formPost(ibrandWeb_Path + "brand/detail.htm", {id: brandId}, "_blank");
}