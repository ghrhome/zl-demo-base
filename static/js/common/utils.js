/**
 * 通过时间戳格式化时间 参数时间戳1
 * @param timestamp
 * @returns {string}
 */
function timeStampConvert(timestamp,fmt){
    if(timestamp == ''||null==timestamp)
        return '';
    var newDate = new Date();
    newDate.setTime(timestamp);
    Date.prototype.format = function(format) {
        var date = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S+": this.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in date) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1
                    ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
            }
        }
        return format;
    }
    return newDate.format(fmt);
}
/**
 * 格式化时间，参数Date
 * @param v
 * @param format
 * @returns {string}
 */
function getLocalTime(v,fmt) {
    if(v == ''||null==v)
        return '';
    var newDate = new Date(v);
    Date.prototype.format = function(format) {
        var date = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S+": this.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in date) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1
                    ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
            }
        }
        return format;
    }
    return newDate.format(fmt);
}

//转化页面字符，防止sql注入
function escapeString(str){
    if(str && str!="" && typeof str==='string'){
        str = str.replace(/</g,"&lt;");//把小于号转化为&lt;
        str = str.replace(/>/g,"&gt;");//把大于号转化为&gt;
        str = str.replace(/\"/g,"&quot;");//把"号转化为&quot;
        str = str.replace(/\'/g,"&#39;");//把'号转化为&#39;
        str = str.replace(/\//g,"&#47;");//把/号转化为&#47;
    }
    return str;
}

//设置图片的最大最大值，超出进行等比压缩
function AutoSize(src, maxWidth, maxHeight){
    var array =new Array(2);
    var image = new Image();
    //原图片原始地址（用于获取原图片的真实宽高，当<img>标签指定了宽、高时不受影响）
    image.src = src;
    // 当图片比图片框小时不做任何改变
    if (image.width < maxWidth&& image.height < maxHeight) {
        if(image.width<160){
            array[0] = 200;
            array[1] = 200*(image.height / image.width);
        }else{
            array[0] = image.width;
            array[1] = image.height;
        }
    }else{
        var b = false;
        if(image.width> maxWidth ){
            if(image.height<= maxHeight){
                b = true;
            }else if(image.height> maxHeight&& maxWidth/image.width < maxHeight/image.height ){
                b = true;
            }
        }
        if(b){
            array[0] = maxWidth;
            array[1] = maxWidth*(image.height / image.width);
        }else{
            array[0] = maxHeight*(image.width / image.height);
            array[1] = maxHeight;
        }
    }
    return array;
}

//扩展jquer方法，按照name序列化input
$.fn.toJson = function (flag) {
    var json = {};//新建json对象
    var fields = this.serializeArray();
    $.each(fields, function () {
        if (json[this.name]) {//判断是否存在这个json属性
            if (!json[this.name].push) {//如果这个属性是数组对象
                json[this.name] = [json[this.name]];//就初始化对象
            }
            if (flag || (!flag && this.value != "")) {//给这个属性赋上值
                json[this.name].push(this.value || "");//给这个属性赋上值
            }
        } else {//如果不存在这个属性
            if (flag || (!flag && this.value != "")) {
                json[this.name] = this.value || "";//新建属性，这个属性赋上值
            }
        }
    });
    return json;
};

function setFiscfReeze(fiscfReeze) {
    var fiscfReezeStr = '';
    switch(fiscfReeze){
        case 0:
            fiscfReezeStr="正常";break;
        case 1:
            fiscfReezeStr="冻结";break;
        default:
            fiscfReezeStr='';
    }
    return fiscfReezeStr;
}

function setOperationByReeze(fiscfReeze) {
    var fiscfReezeStr = '';
    switch(fiscfReeze){
        case 0:
            fiscfReezeStr="冻结";break;
        case 1:
            fiscfReezeStr="解冻";break;
        default:
            fiscfReezeStr='';
    }
    return fiscfReezeStr;
}

function setStr(tem) {
    if (null==tem||typeof(tem) == "undefined"){
        return "";
    }
    return tem;
}



/**
 * 数值为0 字符串格式化
 * @param str
 * @param def
 * @returns {*}
 */
function zeroStrFormat(str, def, pre){
    pre = pre || "";
    if(!isNaN(str) && Number(str) == 0){
        return def;
    }
    return str + pre;
}

/**
 * 金额格式化保留2位小数点
 * @param s
 * @returns {*}
 */
function fmtAmt(s) {
    try {
        return fmtMoney(1.0 * s, 2, ".", ",");
    } catch (e) {
        //console.log(e);
        return "0.00";
    }
};
/**
 * 格式化金额
 * @param v
 * @param c
 * @param d
 * @param t
 * @returns {string}
 */
function fmtMoney(v, c, d, t) {
    v *= 1;
    var p = v < 0 ? '-' : '';
    v = v.toFixed(c);
    c = Math.abs(c) + 1 ? c : 2;
    d = d || '.';
    t = t || ',';
    var m = (/(\d+)(?:(\.\d+)|)/.exec(v + ''));
    x = m[1].length > 3 ? m[1].length % 3 : 0;
    return p + (x ? m[1].substr(0, x) + t : '')
        + m[1].substr(x).replace(/(\d{3})(?=\d)/g, '$1' + t)
        + (c ? d + (+m[2] || 0).toFixed(c).substr(2) : '');
};

/**
 * 金额去格式化
 * @param s
 * @returns {string}
 */
function unFmtAmt(s) {
    s = (s + "").trim()+"";
    s = s.replace(/,/g,"");
    s = Number(s).mul(100);
    s += "";
    if(s.indexOf(".") != -1) {
        s = s.substr(0,s.indexOf("."));
    }
    return s;
};