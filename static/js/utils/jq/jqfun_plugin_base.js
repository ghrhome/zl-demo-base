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


    function _innerFun(){

    }

    /*
    $.extend({
       sample:function(){

       }
    })
    */

    $.sample=function(data){
         //do something with data;
         //return;
    };

    $.sample.opts={

    };

})