/**
 * Created by whobird on 2018/4/27.
 */

function formPost(url, params, target){
    var _form=document.createElement("form");
    _form.enctype = "multipart/form-data";
    _form.action = url;
    _form.method = "post";
    _form.style.display = "none";

    if(target){
        _form.target = target;
    }else{
        $(".zl-loading").fadeIn();
    }

    for (var x in params) {
        var opt = document.createElement("input");
        opt.name = x;
        opt.value = params[x];
        _form.appendChild(opt);
    }
    document.body.appendChild(_form);

    _form.submit();
}


// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());
