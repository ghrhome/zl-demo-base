(function(){
    $("#preloader").fadeOut("fast");

    $(".js-btn-edit").on("click",function(e){
        e.preventDefault();

        $(this).css({"display":"none"}).next(".js-btn-wrapper").css("display","block");
        var _tr = $(this).closest("tr");
        _tr.find("button.zl-dropdown-btn").removeAttr("disabled");
        _tr.find('div.dropdownSelect').show();
    });


    $(".js-btn-save").on("click",function(e){
        e.preventDefault();

        var _trObj = $(this).closest("tr");

        var manager1 = _trObj.find('input[name=manager1]').val();
        var managerName1 = _trObj.find('input[name=managerName1]').val();
        if(!checkNotNull(manager1) || !checkNotNull(managerName1)){
            alert("请选择负责人1");
            return;
        }
        var manager2 = _trObj.find('input[name=manager2]').val();
        var managerName2 = _trObj.find('input[name=managerName2]').val();
        if(!checkNotNull(manager2) || !checkNotNull(managerName2)){
            alert("请选择负责人2");
            return;
        }

        var _this = $(this);
        var _trObj = _this.closest('tr');

        var params = {
            id : _trObj.find('input[name=id]').val(),
            mallId : _trObj.find('input[name=mallId]').val(),
            blockId : _trObj.find('input[name=blockId]').val(),
            blockName : _trObj.find('input[name=blockName]').val(),
            floorId : _trObj.find('input[name=floorId]').val(),
            floorName : _trObj.find('input[name=floorName]').val(),
            layout : _trObj.find('input[name=layout]').val(),
            layoutName : _trObj.find('input[name=layoutName]').val(),
            manager1 : manager1,
            managerName1 : managerName1,
            manager2 : manager2,
            managerName2 : managerName2,
            parent : _trObj.find('input[name=parent]').val(),
            level : _trObj.find('input[name=level]').val(),
        };

        $.ajax({
            cache: true,
            type: "POST",
            url: managementWeb_Path + "floorManager/save.htm",
            dataType: "json",
            data: params,
            async: false,
            error: function (request) {
                alert("系统繁忙...");
            },
            success: function (rdata) {
                // console.log(rdata);
                if(rdata && rdata.code=='0'){
                    $("#searchBsFormBtn").click();
                    return;
                }

                alert('保存失败');
            }
        });
    });

    $(".js-btn-cancel").on("click",function(e){
        e.preventDefault();
        var _tr = $(this).closest("tr");
        _tr.find("button.zl-dropdown-btn").attr("disabled", true);
        _tr.find(".js-btn-wrapper").hide();
        _tr.find(".js-btn-edit").show();
    });

    $.ajax({
        cache: true,
        type: "POST",
        url: managementWeb_Path + "floorManager/getManagerList.htm",
        dataType: "json",
        data: {mallId : $("#mallId").val()},
        async: false,
        error: function (request) {
            alert("系统繁忙...");
        },
        success: function (rdata) {

            console.log(rdata);

            if(rdata && rdata.code=='0'){
                $("#managersTpl").tmpl(rdata.data).appendTo($('ul.managers-select'));
                return;
            }
            // alert('请求楼管负责人失败');
        }
    });


})();




function searchMall(_this) {
    var mallId = $(_this).attr("key");
    if($("#mallId").val() != mallId){
        $("#blockId").val("");
        $("#blockName").val("");
    }

    $("#mallId").val(mallId);
    $("#searchBsFormBtn").click();
}

function searchBlock(_this) {
    var blockId = $(_this).attr("key");
    $("#blockId").val(blockId);
    var blockName = $(_this).text();
    $("#blockName").val(blockName);
    $("#searchBsFormBtn").click();
}

$("#searchBsFormBtn").on("click", function (e) {
    $("#searchBsFloorForm").attr("action", managementWeb_Path + "floorManager/index.htm").submit();
});

function selectManager(_this){
    var userId = $(_this).attr('key');
    var userName = $(_this).text();

    var _div = $(_this).closest('div.dropdownSelect');
    var index = _div.attr('index');
    var _tr = _div.closest('tr');

    _tr.find('input[name=manager'+index+']').val(userId);
    _tr.find('input[name=managerName'+index+']').val(userName);
    $(_this).closest('td').find('span.span-more').text(userName);
}


function checkNotNull(params) {
    if (null !== params && "" !== params && typeof params != "undefined") {
        return true;
    }
    else {
        return false;
    }
}