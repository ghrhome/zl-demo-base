/**
 * Created by whobird on 17/12/29.
 */
define(["jquery","jquery.datetimepicker","jquery.datetimepicker.zh"],function(jquery){
    var ysDatePicker=(function($,ydp){
        /*
        * 扩展使用jquery插件的使用方式，不封装成另外的jquery插件，采用模块模式
        * ysDatePicker.init(args);
        * */
        var ysDatePicker=ysp;





        ysDatePicker.init=function(elem,type,format,cb){

        };

        ysDatePicker.destroy=function(elem){
            $(elem).datetimepicker("remove");
        };

        return ysDatePicker

    })(jquery,ysDatePicker||{});

    return ysDatePicker;

});