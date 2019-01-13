/**
 * Created by jiangyi on 2018/7/30.
 */
$(function(){
    confirmAlert.init();
    init();
});


function init(){
    $(".zl-loading").fadeIn();

    var param = {contNo: $("input[name=contNo]").val()};

    $.ajax({
        url : "incomeTypeListQuery.htm",
        type : 'post',
        async : false,
        data : param,
        dataType : 'json',
        error: function () {
            $(".zl-loading").fadeOut();
            alert("系统繁忙");
        },
        success: function (res) {
            if(res && res.success){
                // console.log(res.data);
                var _target= $("#income-type-dialog").find("select[name=incomeType]");
                $("#incomeTypeTpl").tmpl(res.data).appendTo(_target);

                if(res.data){
                    for(var item in res.data){
                        var obj = res.data[item];
                        if(obj.attribute1 == "pickmeup"){
                            $("td.income-type").text(obj.incomeName);
                            break;
                        }
                    }
                }

            }
            $(".zl-loading").fadeOut();
        }
    });
}

$("a.invoice-type-btn").on("click", function(){
    $("#income-type-dialog").modal("show");
});


$("button.income-type-save-btn").on("click", function(){

    $(".zl-loading").fadeIn();

    var param = {
        contNo: $("input[name=contNo]").val(),
        incomeType : $("select[name=incomeType]").val()
    };

    $.ajax({
        url : "incomeTypeSet.htm",
        type : 'post',
        data : param,
        dataType: 'json',
        error: function () {
            $(".zl-loading").fadeOut();
            alert("系统繁忙");
        },
        success: function (res) {
            $(".zl-loading").fadeOut();
            alert(res.message, "", "", function(){
                window.location = "detail.htm?contNo="+$("input[name=contNo]").val();
            });
        }
    });

});