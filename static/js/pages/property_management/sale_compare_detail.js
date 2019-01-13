var saleCompareDetailView=(function ($) {

    var saleCompareDetailView={};

    $("#preloader").fadeOut("fast");

    var saleYm=$('#saleYm').val();


    saleCompareDetailView.init=function () {
        render();
    };
    
    function render() {
        var i,arr=[];
        var inputYear=parseInt(saleYm.substring(0,4));
        var inputMonth=parseInt(saleYm.substring(5));
        var date=new Date();
        var year=date.getFullYear();
        var month=date.getMonth()+1;
        var inputDate=new Date(inputYear,inputMonth,0);
        var dayOfMonth;
        if(year===inputYear&&month===inputMonth){
            dayOfMonth=date.getDate();
        }else{
            dayOfMonth=inputDate.getDate();
        }
        for(i=1;i<=dayOfMonth;i++){
            arr.push({day:});
        }

    }


    return saleCompareDetailView;
})(jQuery);


$(function () {
    saleCompareDetailView.init();
});