$(function(){

    var container = $("#op-daily-table");

    container.on('click', '.qry-btn', function(){

        if(!formValidate()){
            return;
        }

        var url = managementWeb_Path + "dailyReport/index.htm";
        $("#submitForm").attr("action", url).submit();
    });

    $(".zl-datepicker").find("input").datetimepicker({
        language: 'zh-CN',
        format:"yyyy-mm-dd",
        todayBtn:"linked",
        startView:2,
        minView:2,
        weekStart: 1,
        autoclose: 1,
        todayHighlight: 1,
        forceParse: 0,
        // clearBtn: true,
        startDate : new Date("2017/01/01"),
        endDate:new Date(),
    }).on('changeDate', function(ev){
        if(!dateValidate()){
            // $(this).val("");
            return;
        }
    });

});



function formValidate(){
    var mallId = $("input[name=mallId]").val()
    if(mallId==null || mallId==""){
        alert("请选择项目");
        return false;
    }

    // return dateValidate();
    return true;
}

function dateValidate(){
    var start = $("input[name=start]").val().replace(/-/g, "\/");
    var end = $("input[name=end]").val().replace(/-/g, "\/");

    var startDate = new Date(start);
    var endDate = new Date(end);

    if(startDate.getFullYear()!=endDate.getFullYear() &&
        startDate.getMonth() != endDate.getMonth()){
        alert("仅支持月内查询");
        return false;
    }

    if(startDate > endDate){
        alert("开始时间应小于结束时间");
        return false;
    }
    return true;
}

function selectMall(_this){
    var mallId = $(_this).attr("data-value");
    $("input[name=mallId]").val(mallId);

    $(".qry-btn").click();
}