function isNumber(n) {
    return !isNaN(n) && isFinite(n);
}
var store = {
    url: {
        getMallAll: enrolmentWeb_Path + 'mall/all.htm',
        list: enrolmentWeb_Path + 'store/index.htm',
        getBlockByMallId:enrolmentWeb_Path+'block/list.htm',
        getFloorByBlockId:enrolmentWeb_Path+'floor/list.htm',
        addPage:enrolmentWeb_Path + 'store/add/info.htm',
        updatePage:enrolmentWeb_Path+'store/update/info.htm',
        svgeEditPage:enrolmentWeb_Path + "svg/index.htm",
        svgeViewPage:enrolmentWeb_Path + "store/getStoreMap.htm"
    },
    query: function (path, $form) {
        return path + '?' + $form.serialize();
    },
    init: function () {
        var _that = this, page = $("#data-shops-list");
        //项目下拉
        // $.getJSON(this.url.getMallAll, function (res) {
        //     for (var i = 0; i < res.length; i++) {
        //         $('#js-dropdown-projects').find(' .dropdown-menu')
        //             .append("<li><a data-id='" + res[i].id + "' href='javascript:void(0)'>" + res[i].shortName + "</a></li>");
        //     }
        // });

        var mallValue = $('#js-dropdown-projects').find('input[type=hidden]').val();
        //楼栋下拉
        // if(mallValue){
        //     $.getJSON(this.url.getBlockByMallId,{mallId:mallValue},function (res) {
        //         for (var i = 0; i < res.length; i++) {
        //         $('#js-dropdown-block').find(' .dropdown-menu')
        //             .append("<li><a data-id='" + res[i].id + "' href='javascript:void(0)'>" + res[i].blockName + "</a></li>");
        //         }
        //     });
        // }

        var blockValue = $('#js-dropdown-block').find('input[type=hidden]').val();
        //楼层下拉
        // if(blockValue){
        //     $.getJSON(this.url.getFloorByBlockId,{blockId:blockValue},function (res) {
        //         console.log(res); //TODO
        //         for (var i = 0; i < res.length; i++) {
        //             $('#js-dropdown-floor').find(' .dropdown-menu')
        //                 .append("<li><a data-id='" + res[i].id + "' href='javascript:void(0)'>" + res[i].floorNo + "</a></li>");
        //         }
        //     });
        // }

        //回车查询
        // $(document).keydown(function (e) {
        //     if(e.keyCode===13){
        //         $('#btn-save').trigger('click');
        //     }
        // });


        //选择框==========================================>>>>>
        // page.on("click", ".btn-group li", function () {
        //     var child = $(this).children('a'),
        //         btn = $(this).parent('ul').prev('button'),
        //         input = $(this).parent('ul').prevAll('input[type=hidden]'),value=input.val();
        //     btn.html(child.html());
        //     input.val(child.data('id'));
        //
        //     if ($(this).parents('#js-dropdown-projects')[0]) {
        //         if(parseInt(value)!==parseInt(child.data('id'))){
        //             $('#js-dropdown-block').find('input[name=blockId]').val('');
        //             $('#js-dropdown-floor').find('input[name=floorId]').val('');
        //         }
        //         window.location.href = _that.query(_that.url.list, $('#js-store-form'));
        //     }
        //     if ($(this).parents('#js-dropdown-block')[0]) {
        //         if(parseInt(value)!==parseInt(child.data('id'))){
        //             $('#js-dropdown-floor').find('input[name=floorId]').val('');
        //         }
        //         window.location.href = _that.query(_that.url.list, $('#js-store-form'));
        //     }
        //     if ($(this).parents('#js-dropdown-floor')[0]) {
        //         window.location.href = _that.query(_that.url.list, $('#js-store-form'));
        //     }
        //
        // });
        //<<<<<==============================================
        // //分页=====================================>>>>
        // $('#btn-pre-bottom').on('click', function () {
        //     if (!$(this).hasClass('zl-btn-disable')) {
        //         location.href = _that.query(_that.url.list,$('#js-store-form')) + '&page=' + (parseInt($('.page-index').html()) - 1);
        //     }
        // });
        // $('#btn-next-bottom').on('click', function () {
        //     if (!$(this).hasClass('zl-btn-disable')) {
        //         location.href = _that.query(_that.url.list,$('#js-store-form')) + '&page=' + (parseInt($('.page-index').html()) + 1);
        //     }
        // });
        // $('#btn-save').on('click', function () {
        //     var value = parseInt($(this).parent().find('.zl-page-num-input').val());
        //     if (_that.verifyPagination(value, parseInt($('.page-all').html()))) {
        //         location.href = _that.query(_that.url.list,$('#js-store-form')) + '&page=' + value;
        //     }
        // });
        // //分页<<<<=====================================

        $("#js-add-new").on("click", function (e) {
            e.preventDefault();
            location.href = _that.url.addPage;
        });
        //导出
        $("#js-export-new").on("click", function (e) {
            e.preventDefault();
            //获取查询条件 一次提交表单
            //var fm = document.getElementById("js-store-form");
            //console.log( document.getElementById("js-store-form"))
            var formData = new FormData("js-store-form");
            //console.log("=====================")
            //console.log($(".zl-dropdown-group #status").val())
            //console.log($("#area").val()&&$("#area").val()!=null)
            var dataQuery={area:$(".zl-dropdown-group #area").val(),mallId:$(".zl-dropdown-group #mallId").val(),blockId:$(".zl-dropdown-group #blockId").val(),floorId:$(".zl-dropdown-group #floorId").val()
            ,status:$(".zl-dropdown-group #status").val(),storeType:$(".zl-dropdown-group #storeType").val(),storeNo:$("[name='storeNo']").val(),propertyType:$("[name='propertyType']").val(),rentStatus:$("[name='rentStatus']").val()};
           /* if($("#area").val()&&$("#area").val()!=null){
                formData.append(
                    "area",$("#area").val()
                );
            }
            if($("#mallId").val()&&$("#mallId").val()!=null){
                formData.append(
                    "mallId",$("#mallId").val()
                );
            }
            if($("#blockId").val()&&$("#blockId").val()!=null){
                formData.append(
                    "blockId",$("#blockId").val()
                );
            }
            if($("#floorId").val()&&$("#floorId").val()!=null){
                formData.append(
                    "floorId",$("#floorId").val()
                );
            }

            if($("#status").val()&&$("#status").val()!=null){
                formData.append(
                    "status",$("#status").val()
                );
            }
            if($("#storeType").val()&&$("#storeType").val()!=null){
                formData.append(
                    "storeType",$("#storeType").val()
                );
            }*/

            console.log(formData);
            formPost(enrolmentWeb_Path + "store/export.htm", dataQuery);
            loadingHide();
        });
        //查询按钮
        $('#js-store-query').on('click',function () {
        //     window.location.href = _that.query(_that.url.list, $('#js-store-form'));
            generalQueryBtn(true);
        });

       page.on("click", ".table tbody tr", function (e) {
            e.preventDefault();
            location.href = _that.url.updatePage+'?id='+$(this).find('input').val();
        });
        //SVG落位图编辑
        $(".zl-dist-edit-svg").on("click", function (e) {
            e.preventDefault();
            location.href = _that.url.svgeEditPage;
        });
        //SVG落位图查看
        $(".zl-dist-view-svg").on("click", function (e) {
            e.preventDefault();
            location.href = _that.url.svgeViewPage;
        });

    }, verifyPagination: function (value, total) {
        if(total===0) return true;
        if (!isNumber(value)) {
            alert('请输入正确的页码');
            return false;
        }
        if (value > total) {
            alert('超过总页数,请重新输入 ');
            return false;
        }
        return true;
    }
};

$(document).ready(function () {
    $("#preloader").fadeOut("fast");
    store.init();
    //城市公司
    $(".areaSelect").ysdropdown({
        callback:function(val,$elem){
            //项目
            $(".queryForm-mall-dropdown").find("ul").empty();
            $(".queryForm-mall-dropdown").find("ul").append("<li><a  href='javascript:void(0)'>所有项目</a></li>");
            $(".queryForm-mall-dropdown").find("button").html("所有项目")
            $(".queryForm-mall-dropdown").find("input").val("");
            //楼栋
            $(".queryForm-block-dropdown").find("ul").empty();
            $(".queryForm-block-dropdown").find("ul").append("<li><a  href='javascript:void(0)'>所有楼栋</a></li>");
            $(".queryForm-block-dropdown").find("button").html("所有楼栋")
            $(".queryForm-block-dropdown").find("input").val("");
            //楼层
            $(".queryForm-floor-dropdown").find("ul").empty();
            $(".queryForm-floor-dropdown").find("ul").append("<li><a  href='javascript:void(0)'>所有楼层</a></li>");
            $(".queryForm-floor-dropdown").find("button").html("所有楼层")
            $(".queryForm-floor-dropdown").find("input").val("");
            $.getJSON(enrolmentWeb_Path+'/floor/mallList.htm',{areaId:val},function (res) {
                //console.log(res); //TODO
                $.each(res,function (key,value) {
                    //console.log(key,value);
                    $(".queryForm-mall-dropdown").find("ul").append("<li><a data-value="+key+" data-id="+key+" href='javascript:void(0)'>"+value+"</a></li>");
                    //$('#js-query-block-menu').append("<li><a data-id="+element.id+" href='javascript:void(0)'>"+element.blockName+"</a></li>");
                });
            });
            generalQueryBtn(true);
        }
    });
    //表单项目
    $(".queryForm-mall-dropdown").ysdropdown({
        callback:function(val,$elem){
            //楼栋
            $(".queryForm-block-dropdown").find("ul").empty();
            $(".queryForm-block-dropdown").find("ul").append("<li><a  href='javascript:void(0)'>所有楼栋</a></li>");
            $(".queryForm-block-dropdown").find("button").html("所有楼栋")
            $(".queryForm-block-dropdown").find("input").val("");
            //楼层
            $(".queryForm-floor-dropdown").find("ul").empty();
            $(".queryForm-floor-dropdown").find("ul").append("<li><a  href='javascript:void(0)'>所有楼层</a></li>");
            $(".queryForm-floor-dropdown").find("button").html("所有楼层")
            $(".queryForm-floor-dropdown").find("input").val("");
            $.getJSON(enrolmentWeb_Path+'/block/list.htm',{mallId:val},function (res) {

                if(val&&val!=""){

                    $.each(res,function (index,element) {
                        $(".queryForm-block-dropdown").find("ul").append("<li><a data-value="+element.id+" data-id="+element.id+" href='javascript:void(0)'>"+element.blockName+"</a></li>");
                        //$('#js-query-block-menu').append("<li><a data-id="+element.id+" href='javascript:void(0)'>"+element.blockName+"</a></li>");
                    });
                }

            });
            generalQueryBtn(true);
        }
    });

    //表单楼栋
    $(".queryForm-block-dropdown").ysdropdown({
        callback:function(val,$elem){
            //楼层
            $(".queryForm-floor-dropdown").find("ul").empty();
            $(".queryForm-floor-dropdown").find("ul").append("<li><a  href='javascript:void(0)'>所有楼层</a></li>");
            $(".queryForm-floor-dropdown").find("button").html("所有楼层")
            $(".queryForm-floor-dropdown").find("input").val("");
            $.getJSON(enrolmentWeb_Path+'floor/list.htm',{blockId:val},function (res) {
                $.each(res,function (index,element) {
                    $(".queryForm-floor-dropdown").find("ul").append("<li><a data-value="+element.id+" data-id="+element.id+" href='javascript:void(0)'>"+element.floorName+"</a></li>");
                    //$('#js-query-block-menu').append("<li><a data-id="+element.id+" href='javascript:void(0)'>"+element.blockName+"</a></li>");
                });
            });
            generalQueryBtn(true);
        }
    });
    //楼层选择
    $(".queryForm-floor-dropdown").ysdropdown({
        callback:function(val,$elem){
            //console.log("===================")
            //console.log(val);
            //console.log($elem);
            generalQueryBtn(true);
        }
    });

    //商铺状态
    $(".queryForm-status-dropdown").ysdropdown({
        callback:function(val,$elem){
            //console.log("===================")
            //console.log(val);
            //console.log($elem);
            generalQueryBtn(true);
        }
    });
    generalQueryBtn(false);
});

function loadingshow(){
    $(".zl-loading").fadeIn();
};

function loadingHide(){
    $(".zl-loading").fadeOut();
}
function generalQueryBtn(flag,page){
    if(flag){
        loadingshow();
    }
    //获取查询条件 一次提交表单
    var fm = document.getElementById("js-store-form");
    var formData = new FormData(fm);
    var url = enrolmentWeb_Path + "store/query.htm";
    if(page!=undefined&&page!=null&&page!=""){
        formData.append("page",page);
    }
    $.ajax({
        type: "POST",
        url:url,
        contentType: false,
        processData: false,
        data:formData,
        async: false,
        success:function(data) {
            $(".zl-content").empty();
            $(".zl-content").append(data);
            $(".zl-dropdown-inline").ysdropdown({
                callback:function(val,$elem){
                    //console.log("===================")
                    //console.log(val);
                    //console.log($elem);
                }
            });
            //分页=====================================>>>>
            $('#btn-pre-bottom').on('click', function () {
                if (!$(this).hasClass('zl-btn-disable')) {
                    //location.href = _that.query(_that.url.list,$('#js-store-form')) + '&page=' + (parseInt($('.page-index').html()) - 1);
                    generalQueryBtn(true,(parseInt($('.page-index').html())-1));
                }
            });
            $('#btn-next-bottom').on('click', function () {
                if (!$(this).hasClass('zl-btn-disable')) {
                    //location.href = _that.query(_that.url.list,$('#js-store-form')) + '&page=' + (parseInt($('.page-index').html()) + 1);
                    generalQueryBtn(true,(parseInt($('.page-index').html())+1));
                }
            });
            $('#btn-save').on('click', function () {
                var value = parseInt($(this).parent().find('.zl-page-num-input').val());
                if (verifyPagination(value, parseInt($('.page-all').html()))) {
                    //location.href = _that.query(_that.url.list,$('#js-store-form')) + '&page=' + value;
                    generalQueryBtn(true,value);
                }else{
                    $(".zl-page-num-input").val($('.page-all').html());
                }
            });
            $(".zl-page-num-input").bind("keypress",function(event){
                if(event.keyCode == "13")
                {
                    $('#btn-save').click();
                }
            });
            //分页<<<<=====================================
            if(flag) {
                loadingHide();
            }
        }
    });
}

function verifyPagination(value,total) {
    if(total===0) return true;
    if(!isNumber(value)){
        alert('请输入正确的页码');
        return  false;
    }
    if(value>total){
        alert('超过总页数,请重新输入 ');
        return false;
    }
    return true;
}