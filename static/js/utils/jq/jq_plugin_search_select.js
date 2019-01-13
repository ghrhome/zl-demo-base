/**
 * Created by whobird on 17/12/26.
 */
/*globals jQuery, define, module, exports, require, window, document, postMessage */

//todo: depends on ui-auto-complete;
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

    var namespace="ysSearchSelectNameSpace";

    function _innerFun(){

    }

    var methods={
        init:function(options) {
            var _that=this;
            var mergedOptions;

            mergedOptions = $.extend(
                true, {}, $.fn.ysSearchSelect.defaults, options,
                {
                    //内部附加的属性，比如获取到的子元素
                    current: 0,
                    $children: this.filter('.zl-dropdown-search-select')//获取子元素可绑定事件
                }
            );//end extend

            mergedOptions.$children.on("click",function(e){
                //do something
            });

            mergedOptions.$children.on('show.bs.dropdown', function (e) {
                // do something…
               setTimeout(function(){
                   if(mergedOptions.autoSearch===true){
                       console.log("key down")
                       $(e.target).find(".js-search").get(0).focus();
                       $(e.target).find(".js-search").trigger("keydown");
                   }else{
                       $(e.target).find(".js-search").get(0).focus();
                   }

               },50);

            })


            return _that.each(function(i,elem){
                var $elem=$(elem);
                var $search=$elem.find(".js-search");

                $elem.on("hidden.bs.dropdown",function(e){
                    $search.val("");
                    $elem.find(".js-loading").hide();
                    $elem.find(".js-no-result").hide();
                });

                if(typeof $.fn.autocomplete !=='undefined' && typeof $search!=='undefined'){
                    $search.autocomplete({
                        source: mergedOptions.source,
                        minLength: 0,
                        delay:200,
                        select: function( event, ui ) {

                            var _value= ui.item.label;
                            this.value=_value;

                            $elem.find("button.zl-dropdown-btn").text(_value);
                            $elem.children("input:first-child").val(ui.item.value);
                            mergedOptions.callback(_value,ui);

                            return false;
                        },
                        search:function(event,ui){
                            $elem.find(".js-loading").show();
                            $elem.find(".js-no-result").hide();
                        },
                        response: function( event, ui ) {
                            $elem.find(".js-loading").hide();
                            if(ui.content.length==0){
                                $elem.find(".js-no-result").show();
                            }
                        }
                    });
                }else{
                    console.log("ysSearchSelect plugin need ui-auto-complete!!!!");
                }

            });

        },//init
        destroy:function(){
            this.each(function(i,elem) {
                var $elem = $(elem);
                var $search = $elem.find(".js-search");
                $elem.off();
                $search.autocomplete("destroy");

            });
        }

    };

    $.fn.ysSearchSelect=function(method){
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if ($.type(method) === 'object') {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.jqiaPhotomatic');
        }
    };

    $.fn.ysSearchSelect.defaults={
        callback:function(value,ui){
            console.log(value);
            console.log(ui);
        },
        source:undefined,
        autoSearch:false,

    };
})