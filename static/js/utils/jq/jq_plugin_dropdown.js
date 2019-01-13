/**
 * Created by whobird on 17/12/26.
 */
/*globals jQuery, define, module, exports, require, window, document, postMessage */
(function (factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    }
    else if(typeof module !== 'undefined' && module.exports) {
        module.exports = factory(require('jquery'));
    }
    else {
        factory(jQuery);
    }
})(function ($, undefined) {
    "use strict";

    var nameSpace="bootstrapDropdown_"+new Date().getTime();


    function _innerFunc(){

    }

    var methods={
         init:function(options) {

             var _that=this;
             var mergedOptions;
             mergedOptions = $.extend(
                 true, {}, $.fn.ysdropdown.defaults, options,
                 {
                     //内部附加的属性，比如获取到的子元素
                     current: 0,
                 }
             );//end extend

             return _that.each(function(i,elem){
                var $elem=$(elem);
                if($elem.find("input").length==0){
                    var _input=$("<input value='' hidden/>");
                    $elem.append(_input);
                }

                 var _$children= $elem.find("ul.dropdown-menu");//获取子元素可绑定事件
                 var _$button=$elem.find(".btn");
                 var _$input=$elem.find("input");

                if(!_$input.attr("name")){
                    _$input.attr("name",mergedOptions.nameSpace||nameSpace);
                }

                    _$children.on("click","a",function(e){
                        e.preventDefault();
                        //do something
                        /* if(e.target.tagName.toLowerCase()=='a'){
                         }*/
                        var _value=$(e.target).data('value');
                        var _text=$(e.target).text();
                        _$button.text(_text);
                        _$input.val(_value);
                        mergedOptions.callback(_value,$elem);
                    })


            });

         },//init
        destroy:function(){
            this.each(function(i,elem){
                var $elem=$(elem);
                $elem.off();
            });
        }

    };

    $.fn.ysdropdown=function(method){

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if ($.type(method) === 'object') {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jq_dropdwon');
        }
    };

    $.fn.ysdropdown.defaults={
        callback:function(value){
            console.log(value);
        }
    };
})