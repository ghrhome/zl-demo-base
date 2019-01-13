/**
 * Created by whobird on 2018/4/13.
 */
var ysPrint=(function($,ysPrint){
    var yp=ysPrint;

    yp.view=function(url){
        var width = $(window).width();
        var height = $(window).height();
        var features = "width='"+width+"',height='"+height+"'";
        window.open(url,"_blank",features);
    }

    yp.print=function(url){
        var screenWidth = (screen.availWidth - 10);
        var screenHeight = (screen.availHeight-50);
        var subWin = window.open(url, "newwindow", " width="+screenWidth+",height="+screenHeight+",  top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
        subWin.onload=function(){
            setTimeout(function(){
                subWin.print();
            },100);
        };
    }

    return yp;

})(jQuery,ysPrint||{});

