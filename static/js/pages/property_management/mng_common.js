String.prototype.replaceAll  = function(s1,s2){
    return this.replace(new RegExp(s1,"gm"),s2);
};

function isNumber(n) {
    return !isNaN(n) && isFinite(n);
}

/**
 *
 * @method clearNoNum
 * @param _this dom对象
 * @param num {number} 正整数限制多少位
 * @desc 限制用户只能输入数字并且只能输入8位正整数
 */
function clearNoNum(_this,num) {
    _this.value=_this.value.replace(/\D/g,'').replace(/^0+/,'0').replace(new RegExp('^(\\d{1,'+num+'}).*$'),'$1');
}
/**
 * @param _this dom对象
 * @param num {number} 正整数限制多少位
 * @desc 限制用户输入
 */
function clearNoFloat(_this,num) {
    _this.value=_this.value.replace(/^\.*/,'').replace(/[^\d.]/g,'')
        .replace(/^[0]+(.)?/,'0$1')
        .replace(new RegExp('(\\d{1,'+num+'})\\d*(\\.\\d{0,2})?.*','g'),'$1$2');
}

function getUrlParam(){
    var _arr = location.search.substr(1).split('&');
    var _obj = {};
    for (var i = 0; i < _arr.length; i++) {
        _obj[_arr[i].split('=')[0]] = _arr[i].split('=')[1]
    }
    return _obj;
}




