var pageView=(function($){
    var pageView={};
    pageView.init=function(){

        $("#preloader").fadeOut("fast");
        var page = $("#tax-rate-creation");

        $( "#js-block" ).on("click",function(e){
            $(this).autocomplete({
                source: blocksJson,
                minLength: 1,
                select: function( event, ui ) {
                    this.value = ui.item.label;
                    $("#blockId").val(ui.item.id);
                    $("#blockName").val(ui.item.blockName);
                    return false;
                }
            });
        });

        $( "#js-mall" ).on("click",function(e){
            $(this).autocomplete({
                source: mallJson,
                minLength: 1,
                select: function( event, ui ) {
                    this.value = ui.item.label;
                    $("#mallId").val(ui.item.id);
                    $("#mallName").val(ui.item.mallName);
                    setBlockBtnGroup(ui.item.id);
                    return false;
                }
            });
        })

        //税率类型下拉
        $(".btn-group").ysdropdown({
            callback:function(val, $elem){
                if ($elem.data("id") == "rate-type"){
                    $("form").find("input[name=rateType]").val(val);
                }
            }
        });

        //新增费项
        $("body").on("click",".add-taxRateItem",function(){
            $("#notWater").append($("#addTaxRateItem").html());
            $(".btn-group").ysdropdown("init");
        });

        //新增费项-水费
        $("body").on("click",".add-taxRateItemWater",function(){
            $("#water").append($("#addWaterTaxRateItem").html());
            $(".btn-group").ysdropdown("init");
        });

        //删除按钮
        $("body").on("click",".delete-taxRateItem",function(){
            var remDiv = $(this).parent().parent();
            remDiv.remove();
        });
        var datepicker=$("#js-date-picker").find("input").datetimepicker({
            format:"yyyy-mm-dd",
            todayBtn:"linked",
            startView:2,
            minView:2,
            autoclose: true,
            language:"zh-CN",
        }).on('changeDate', function(e){
            // $("form").find("input[name=effectiveDate]").val(e.timeStamp);
            $("form").find("input[name=effectiveDate]").val($(this).val());
        });

        //保存按钮
        $("body").on("click","#saveData",function(){
            var entity = $("#taxRateForm").toJson(true);
            if(!entity||!entity.mallId){
                alert("请选择项目");
                return false;
            }
            if (!entity.blockId) {
                alert("请选择楼栋");
                return false;
            }
            if ($.trim(entity.rateType) == '') {
                alert("请选择税率类型");
                return;
            }
            if ($.trim(entity.effectiveDate) == '') {
                alert("请选择生效时间");
                return;
            }
            var jNotWater = $("#notWater").children().eq(0).siblings();
            if(jNotWater.length < 1){
                alert("请添加费项信息");
                return false;
            }
            var jWater = $("#water").children().eq(0).siblings();
            if(jWater.length < 1){
                alert("请添加水费信息");
                return false;
            }
            //最终参数
            var resultParm = {};
            resultParm.entity=entity;
            //修改非水费集合
            var notWaterItems = [];
            jNotWater.each(function(){
                var _this = $(this);
                var notWater = checkParam(_this,false);
                if(!notWater)
                    throw "";
                notWaterItems.push(notWater);
            })
            resultParm.notWaterItems=notWaterItems;
            //新增水费集合
            var waterItems = [];
            jWater.each(function(){
                var _this = $(this);
                var water = checkParam(_this,true);
                if(!water)
                    throw "";
                waterItems.push(water);
            })
            resultParm.waterItems=waterItems;
            submitItem(resultParm);
        });

        $("input.tax").on("input", function() {
            var val = parseInt($(this).val());
            $(this).val(isNaN(val) ? '' : val);
        });
    };

    function setBlockBtnGroup(mallId) {
        $("form").find("input[name=blockId]").val('');
        $("form").find("input[name=blockName]").val('');
        $("#block-group button").html("");
        if (!mallId) return;
        pageView.loadingShow();
        $.ajax({
            url: financeWeb_Path + 'taxRateEdit/selectBlockByMallId.htm',
            type: 'post',
            data:{mallId : mallId},
            dataType: 'json',
            error: function () {
                pageView.loadingHide();
                alert("系统异常");
            },
            success: function (res) {
                pageView.loadingHide();
                if (res.code == '100') {
                    if (res.data.length == 0) {
                        alert("当前选择的项目没有楼栋，请先添加楼栋。");
                        $("#block-group ul").html('');
                    } else {
                        var hm = '';
                        for (var i=0; i<res.data.length; i++) {
                            hm += '<li><a data-value='+ res.data[i].id +'>'+ res.data[i].blockName +'</a></li>';
                        }
                        $("#block-group button").html("请选择");
                        $("#block-group ul").html(hm);
                        //税率类型下拉
                        $(".btn-group").ysdropdown({
                            callback:function(val, $elem){
                                if ($elem.data("id") == "block-group"){
                                    $("form").find("input[name=blockId]").val(val);
                                    $("form").find("input[name=blockName]").val($elem.find("button").html());
                                }
                            }
                        });
                    }
                }
            }
        });

    }
    //整理参数
    function checkParam(_this,isWater){
        var itemType = _this.find("td>input").eq(0).val();
        var dictId = _this.find("td>input").eq(0).data("value");
        var dictCode = _this.find("td>input").eq(0).data("code");
        var general = _this.find("input.tax").val();
        // var newRate = _this.find("td>input").eq(2).val();
        if(!itemType||!dictId){
            alert("费项类型必填");
            return false;
            // }else if(!general){
            //     alert("一般征收必填");
            //     return false;
            // }else if(!simple){
            //     alert("简易征收必填");
            //     return false;
        }
        if(!general)
            general=0;
        // if(!newRate)
        //     newRate=0;
        var item = {};
        item.itemType = itemType;
        item.dictId = dictId;
        item.dictCode = dictCode;
        item.general = general;
        // item.newRate = newRate;
        if(isWater)
            item.isWaterRate=0;
        else
            item.isWaterRate=1;
        return item;
    }

    //提交到后台
    function submitItem(resultParm){
        var id = $("#id").val();
        var url = financeWeb_Path + "taxRateEdit/subDetail.htm?id="+id;
        pageView.loadingShow();
        $.ajax({
            url : url,  //请求地址
            type : "post",   //请求方式
            dataType : "json",  //数据类型
            contentType: 'application/json',
            data : JSON.stringify(resultParm),
            success : function(res){
                pageView.loadingHide();
                if("100"==res.code){
                    alert("操作成功","","",function () {
                        window.location.href= financeWeb_Path + "taxRate/index.htm";;
                    });
                }else
                    alert(res.message);
            },
            //请求失败
            error: function(json){
                pageView.loadingHide();
            }
        })
    }

    pageView.loadingShow=function(){
        $(".zl-loading").fadeIn();
    };

    pageView.loadingHide=function(){
        $(".zl-loading").fadeOut();
    }

    return pageView;

})(jQuery);

$(document).ready(function(){
    confirmAlert.init();
    pageView.init();
});
