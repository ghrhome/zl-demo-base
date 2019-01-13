/**
 * Created by whobird on 2018/6/9.
 */
function formatText(str,size,delimiter){
    var _str=str.toString();
    var _size=size||3,_delimiter=delimiter||',';
    /*
    如果_size是3
    "\d{1,3}(?=(\d{3})+$)"
    */
    var regText='\\d{1,'+_size+'}(?=(\\d{'+_size+'})+$)';
    /*
    /\d{1,3}(?=(\d{3})+$)/g 这个正则的意思：匹配连续的三个数字，但是这些三个数字不能是字符串的开头1-3个字符
    */
    var reg=new RegExp(regText,'g');
    /*
    (-?) 匹配前面的-号 (\d+)匹配中间的数字 ((\.\d+)?)匹配小数点后面的数字
    //$0-匹配结果，$1-第一个括号返回的内容----(-?) $2,$3如此类推
    */
    return _str.replace(/^(-?)(\d+)((\.\d+)?)$/, function ($0, $1, $2, $3) {
        return $1 + $2.replace(reg, '$&,') + $3;
    })
}