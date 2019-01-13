$(document).ready(function(){
    initializeCompanysSelect();
    $(".zl-datetime-range").find("input").datetimepicker({
        format:"yyyy-mm-dd",
        todayBtn:"linked",
        startView:2,
        minView:2,
        autoclose: true,
        language:"zh-CN",
        clearBtn:true,
    }).on('changeDate', function(e){
        $("form").find("input[name=page]").val(1);
        $("form").find("input[name=closeDateBegin]").val($(".js-date-start").val());
        $("form").find("input[name=closeDateEnd]").val($(".js-date-end").val());
        // $("form").submit();
    });

    $("#saveButton").on("click",function () {
        if(dubSumit==1){
            saveFile();
        }
    })

})

function initializeCompanysSelect() {
    $("#js-dropdown-companys").ysSearchSelect({
        source:function( request, response ) {
            $.ajax( {
                url: merchantWeb_Path + 'fine/findCompany.htm',
                type:"POST",
                dataType: "json",
                data: {
                    mallId: $("#mallId").val(),
                    contNo:request.term
                },
                success: function( data ) {
                    // if (data.length === 0) {
                    //     alert('此项目下没租户,请先添加租户或者选择别的项目');
                    //     return;
                    // }
                    response( $.map( data, function( item ) {
                        return {
                            brandName: item.brandName,
                            storeNos: item.storeNos,
                            label: item.name,
                            value: item.id
                        }
                    }));
                }
            } );
        },
        callback:function(value,ui){
            $("#clerkOpenId").val(ui.item.value);
            $('#brandName').val(ui.item.brandName);
            $('#storeNos').val(ui.item.storeNos);
        },
    });
    $(".zl-dropdown-inline").ysdropdown({

    });
}
//重复提交
var dubSumit = 1;
/**
 * 新增保存
 */
function saveFile(){

    if (!valitateForm($('#saveFineForm'))) {
        return false;
    }

    $.ajax({
        cache: true,
        type: "POST",
        url: merchantWeb_Path + 'fine/saveFine.htm',
        data: $('#saveFineForm').serialize(),
        async: false,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            dubSumit = 0;
            alert("系统异常");
        },
        success: function (resultData) {
            dubSumit = 0;
            window.location = merchantWeb_Path + 'fine/index.htm';
        }
    });

}

function valitateForm(obj) {
    var mallId = $.trim($(obj).find("input[name=mallId]").val());
    if (mallId == "" || mallId == null) {
        alert("请选择项目");
        return false;
    }
    var clerkOpenId = $.trim($(obj).find("input[name=clerkOpenId]").val());
    if (clerkOpenId == "" || clerkOpenId == null) {
        alert("请选择租户");
        return false;
    }
    var type = $.trim($(obj).find("input[name=type]").val());
    if (type == "" || type == null) {
        alert("请选择收款项目");
        return false;
    }
    var receivableDate = $.trim($(obj).find("input[name=receivableDate]").val());
    if (receivableDate == "" || receivableDate == null) {
        alert("请选择应收日期");
        return false;
    }
    var fineReason = $.trim($(obj).find("input[name=fineReason]").val());
    if (fineReason == "" || fineReason == null) {
        alert("请选择罚款原因");
        return false;
    }
    return true;
}