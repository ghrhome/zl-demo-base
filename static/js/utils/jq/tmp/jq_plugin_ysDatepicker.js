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

    var namespace="sampleNameSpace";
    var mergedOptions;

    function _innerFun(){

    }

    var methods={
         init:function(options) {
             mergedOptions = $.extend(
                 true, {}, $.fn.jqiaPhotomatic.defaults, options,
                 {
                     //内部附加的属性，比如获取到的子元素
                     current: 0,
                     $children: this.filter('img')//获取子元素可绑定事件
                 }
             );//end extend

             mergedOptions.$children.on("click",function(e){
                 //do something
             })

         },//init
        destroy:function(){

        }

    };

    $.fn.sample=function(method){
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if ($.type(method) === 'object') {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.jqiaPhotomatic');
        }
    };

    $.fn.sample.defaults={

    };
})