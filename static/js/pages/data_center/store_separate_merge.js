$("body").on('click','.but-val',function(){
    var val = $(this).attr("data-value");
    var name = $(this).html();
    $(this).parent().parent().parent().find(".btn-default").html(name);
    $(this).parent().parent().parent().parent().find(".input-val").val(val);
});


$( ".js-search_1" ).autocomplete({
    source: function(request,response){
        var mallIds = $("#mallId").val();
        $.ajax({
            url: "getData.htm",
            type:"POST",
            dataType:"json",
            data:{
                storeNo: request.term,
                mallId:mallIds
            },
            success: function(data){
                response($.map( data["data"], function(item){
                    return {
                        label: item.storeNo ,
                        value: item.originalStoreNo
                    }
                }));
            }
        });
    },
    minLength: 1,
    select: function(event,ui) {
        this.value = ui.item.label;
        _this=$(this);
        $.ajax({
            url: "selectByEntity.htm",
            type:"POST",
            dataType:"json",
            data:{
                storeNo: ui.item.label
            },
            success: function(data){
                console.log(data)
                var obj = data.data;
                //alert(obj.storeNo);
                //原始数据
                queryFloorById(obj.id);
                //传入商铺编号 查询租金标准
                standardRent(obj.storeCode);
            }
        });
        return false;
    }
});

function queryFloorById(id) {
    var $floor = $('#floor-container');
    $floor.find('.dropdown-menu').empty();
    $floor.find('button').html('请选择');
    $.ajax({
        url: "selectByStoreSeparate.htm",
        type:"POST",
        dataType:"json",
        data:{id:id},
        success: function(res){
            var obj = res.data;
            $("#floorName_1").val(obj.floorName);
            $("#issuingLayout_1").val(obj.issuingLayout);
            $("#structureSquare_1").val(obj.structureSquare);
            $("#propertySquare_1").val(obj.propertySquare);
            queryFloor(obj.blockId); //新数据
        }
    });
}

//新数据
function queryFloor(blockId) {
    var $floor = $('#floor-container');
    $floor.find('.dropdown-menu').empty();
    $floor.find('button').html('请选择');
    $.getJSON(enrolmentWeb_Path + '/floor/list.htm', {blockId: blockId}, function (res) {
        if (res.length === 0) {
            alert('此楼栋下没楼层,请先添加楼层或者选择别的项目');
            return;
        }
        $.each(res,function (index,element) {
            $('#floor-container').find(' .dropdown-menu').append("<li><a class='but-val' data-value='"+element.id+"' data-id='" + element.id + "' href='javascript:void(0)'>" + element.floorName + "</a></li>");
        });

    });
}
//租金标准
function standardRent(storeCode){
    $.ajax({
        url: "selectByStoreCode.htm",
        type:"POST",
        dataType:"json",
        data:{storeCode:storeCode},
        success: function(res){
            var objL = res["data"];
            var ind = 1;
            $.each(objL,function (index,element) {
            var trHtml = "<tr id=\"tr1-index-0\">"+
                            "<th>第"+ind+"年</th>"+
                            "<td class=\"zl-edit\" colspan=\"2\"><input type=\"text\" value='"+element.rentAvg+"'></td>"+
                            "<td class=\"zl-edit\" colspan=\"2\"><input type=\"text\" value='"+element.managFeeAvg+"'></td>"+
                            "<td class=\"zl-edit\" colspan=\"2\"><input type=\"text\" value='"+element.budgetFreeMonth+"'></td>"+
                         "</tr>";
            $("#tbody1_tr0").append(trHtml);
                ind = ind+1;
            });
        }
    });
}


//添加行
var cou1 =0;
var cou2 =0;
var bool = true;
function addTr(el,ind,trInd){
    var trIndex = $("#tbody"+trInd+"_tr"+ind+" tr").length;
    //var cou = parseInt(trIndex)+parseInt(1);
    var cou = parseInt(2018)+parseInt(1);
    var temp = $("#"+el+"0").html();
    temp = temp.replace("addTr('"+el+"','0','"+trInd+"')","delTr('"+el+"','"+cou+"','"+trInd+"')");
    temp = temp.replace("添加","删除");
    temp = temp.replace("<th>第1年</th>","<th>第"+cou+"年</th>");

    if("1"==trInd){
        cou1 = parseInt(trIndex)+parseInt(1);
    }else if("2"==trInd){
        cou2 = parseInt(trIndex)+parseInt(1);
        temp=temp.replace('bsStoreRentList[0].unitMonth','bsStoreRentList['+cou+'].unitMonth');
        temp=temp.replace('bsStoreRentList[0].unitManaeMonth','bsStoreRentList['+cou+'].unitManaeMonth');
        temp=temp.replace('bsStoreRentList[0].budgetFreeMonth','bsStoreRentList['+cou+'].budgetFreeMonth');
       /* temp=temp.replace('bsStoreRentList[0].merchantMonth','bsStoreRentList['+cou+'].merchantMonth');
        temp=temp.replace('bsStoreRentList[0].merchantManaeMonth','bsStoreRentList['+cou+'].merchantManaeMonth');
        temp=temp.replace('bsStoreRentList[0].merchantFreeMonth','bsStoreRentList['+cou+'].merchantFreeMonth');*/
    }
    $("#tbody"+trInd+"_tr"+ind).append("<tr id='tr"+trInd+"-index-"+cou+"'>"+temp+"</tr>");
}

//删除行
function delTr(el,ind,trInd){
    if(ind!=0) {
        if(trInd=="1" && cou1==ind){
            cou1 = cou1-1;
            $("#"+el+ind).remove();
        }else if(trInd=="2" && cou2==ind){
            cou2 = cou2-1;
            $("#"+el+ind).remove();
        }else{
            alert("请从最后一条开始删除!");
        }
    }else{
        alert("不能删除！");
    }
}

function clearVal(){
    $("#storeNo_1").val("");
    $("#floorName_1").val("");
    $("#issuingLayout_1").val("");
    $("#structureSquare_1").val("");
    $("#propertySquare_1").val("");
    var $floor = $('#floor-container');
    $floor.find('.dropdown-menu').empty();
}

function saveInfo(){
    if(validata()){
        confirm("确认暂存提交？", "", "", function (type) {
            if (type == "dismiss") return;
            $.ajax({
                cache: true,
                type: "POST",
                url: "storeSeparate.htm",
                data: $('#searchSeparateForm').serialize(),
                async: false,
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("系统异常");
                },
                success: function (resultData) {
                    //showMsg(resultData);
                    dubSumit = 0;
                    window.location = "index.htm";
                }
            });
            //$("#searchSeparateForm").submit();
        });
    }
}

function validata(){
    var storeNo_1 = $.trim($("#storeNo_1").val());
    if(storeNo_1=="" || storeNo_1==null){
        alert("原商铺位号不能为空！");
        $("#storeNo_1").focus();
        return false;
    }

    var storeNo = $.trim($("#storeNo").val());
    if(storeNo=="" || storeNo==null){
        alert("新铺位号不能为空！");
        $("#storeNo").focus();
        return false;
    }
    var floorId = $.trim($("#floorId").val());
    if(floorId=="" || floorId==null){
        alert("楼层不能为空！");
        $("#floorId").focus();
        return false;
    }
    var issuingLayoutId = $.trim($("#issuingLayoutId").val());
    if(issuingLayoutId=="" || issuingLayoutId==null){
        alert("规划业态不能为空！");
        $("#issuingLayoutId").focus();
        return false;
    }
    var structureSquare = $.trim($("#structureSquare").val());
    if(structureSquare=="" || structureSquare==null){
        alert("建筑面积不能为空！");
        $("#structureSquare").focus();
        return false;
    }
    var propertySquare = $.trim($("#propertySquare").val());
    if(propertySquare=="" || propertySquare==null){
        alert("实用面积不能为空！");
        $("#propertySquare").focus();
        return false;
    }
    var obtainAreaRatio = $.trim($("#obtainAreaRatio").val());
    if(obtainAreaRatio=="" || obtainAreaRatio==null){
        alert("得房率不能为空！");
        $("#obtainAreaRatio").focus();
        return false;
    }

    var unitMonth=$(".unitMonth");
    for(var i=0;i<unitMonth.length;i++){
        var a = i+1;
        var value10 = $(unitMonth[i]).val();
        if($.trim(value10)=="" || $.trim(value10)==null){
            alert("第"+a+"行预算租金不能为空！");
            return false;
        }
    }
    var unitManaeMonth=$(".unitManaeMonth");
    for(var i=0;i<unitManaeMonth.length;i++){
        var a = i+1;
        var value10 = $(unitManaeMonth[i]).val();
        if($.trim(value10)=="" || $.trim(value10)==null){
            alert("第"+a+"行预算物管费不能为空！");
            return false;
        }
    }
    var budgetFreeMonth=$(".budgetFreeMonth");
    for(var i=0;i<budgetFreeMonth.length;i++){
        var a = i+1;
        var value10 = $(budgetFreeMonth[i]).val();
        if($.trim(value10)=="" || $.trim(value10)==null){
            alert("第"+a+"行免租期上限不能为空！");
            return false;
        }
    }

    return true;
}