function isNumber(n) {
    return !isNaN(n) && isFinite(n);
}

var buildingType = [{id: 2, name: "商业街"}, {id: 3, name: "购物中心"}, {id: 4, name: "写字楼"}, {id: 5, name: "住宅底商"},
    {id: 6, name: "专业卖场"}, {id: 7, name: "酒店"}];

var ids=['#js-area-group','#js-mall-group','#js-block-group'];
// function queryMall(_this){
//     //console.log('=======>>>>>>>>>>>>>>查询项目信息');
//     var count=$(_this).parent().attr('id').split('_')[1];
//     var level2=$(ids[1]+'_'+count),
//         level3=$(ids[2]+'_'+count);
//
//     //$(ids[0]+'_'+count).prev().attr('title',$(_this).data('title'));
//     $(ids[0]+'_'+count).closest("div").find("button").text($(_this).data('title'));
//     level2.empty();
//     level2.prev().html('请选择');
//     level3.empty();
//     level3.prev().html('请选择');
//
//     level2.prevAll('input').val('');
//     level3.prevAll('input').val('');
//
//     $.getJSON(enrolmentWeb_Path+'/mall/list.htm',{'areaId':$(_this).data('id')},function (res) {
//         if(res.length===0) alert('所属城市公司下没有项目,请重新选择或者添加项目');
//         $.each(res,function (index, element) {
//             var fullName=element.shortName;
//             var $li=$("<li data-id='"+element.id+"' data-type='"+element.mallType+"' onclick='queryBlock(this)' ></li>");
//             var $a=$("<a data-id='"+element.id+"' href='javascript:void(0)'>"+fullName+"</a>");
//             if(fullName.length>15){
//                 element.shortName=fullName.substring(0,15)+'...';
//                 $a.html(element.shortName);
//             }
//             $li.attr('data-title',fullName);
//             $li.append($a);
//             level2.append($li);
//         });
//     });
// }

function queryBlock(_this) {
    //console.log('===========>>>>查询楼栋信息');
    var count=$(_this).parent().attr('id').split('_')[1];
    var level3=$(ids[2]+'_'+count);
    level3.empty();
    level3.prev().html('请选择');
    level3.prevAll('input').val('');

    //$(ids[1]+'_'+count).prev().attr('title',$(_this).data('title'));
    $(ids[1]+'_'+count).closest("div").find("button").text($(_this).data('title'));
    $.getJSON(enrolmentWeb_Path+'/block/list.htm',{"mallId":$(_this).data('id')},function (res) {
        if(res.length===0) alert('所属项目下没有楼栋,请重新选择或者添加楼栋');
        $.each(res,function (index,element) {
            /*level3.append("<li data-type='"+element.buildingType+"' onclick='queryBuildType(this)'  data-id='"+element.id+"'>" +
                "<a data-id='"+element.id+"' href='javascript:void(0)'>"+element.blockName+"</a></li>");*/
            var fullName=element.blockName;
            var $li=$("<li data-id='"+element.id+"' data-type='"+element.buildingType+"' onclick='queryBuildType(this)' ></li>");
            var $a=$("<a data-id='"+element.id+"' href='javascript:void(0)'>"+fullName+"</a>");
            if(fullName.length>15){
                element.blockName=fullName.substring(0,15)+'...';
                $a.html(element.blockName);
            }
            $li.attr('data-title',fullName);
            $li.append($a);
            level3.append($li);
        });
    });
}
function queryBuildType(_this) {
    var count=$(_this).parent().attr('id').split('_')[1];
    $(ids[2]+'_'+count).closest("div").find("button").text($(_this).data('title'));
    var $buildType=$('#js-buildType-group');
    /*if(!$buildType.prevAll('input').val()){

    }*/
    var str='';
    switch(parseInt($(_this).data('type'))) {
        case 2:
            str='商业街';
            break;
        case 3:
            str='购物中心';
            break;
        case 4:
            str='写字楼';
            break;
        case 5:
            str='住宅底商';
            break;
        case 6:
            str='专业卖场';
            break;
        case 7:
            str='酒店';
            break;
        default:
            str='未知';
            break;
    }
    $buildType.prevAll('button').html(str);
    $buildType.prevAll('input').val($(_this).data('type'));
}


var floor = {
    url: {
        add: '/floor/add',
        delete: '/floor/delete',
        update: '/floor/update',
        list: '/floor/index',
        getMallList: enrolmentWeb_Path+'/mall/all.htm',
        getBlockByMallId:enrolmentWeb_Path+'/block/list.htm',
        getAreaList:enrolmentWeb_Path+'area/all.htm'
    },
    query:function (path) {
        return path.enrolmentWebPath+this.url.list+'?'+$('#js-floor-form').serialize();
    },
    queryArea:function (url) {
        $.getJSON(url,function (res) {
            $.each(res,function (index,element) {
                var $li=$("<li data-id='"+element.id+"' onclick='queryMall(this)'></li>");
                var $a=$("<a data-id='"+element.id+"' href='javascript:void(0)'>"+element.areaName+"</a>");
                var fullName=element.areaName;
                if(fullName.length>15){
                    // console.log('=============>超长字符'+fullName);
                    element.shortName=fullName.substring(0,15)+'...';
                    $a.html(element.shortName);
                }
                $li.attr('data-title',fullName);
                $li.append($a);
                $('[id^=js-area-group_]').append($li);
            });
        });
    },
    render:function () {
        $.getJSON(this.url.getMallList, function (res) {
            $.each(res,function (index, element) {
                $('#js-query-mall-menu').append("<li><a data-id='"+element.id+"' href='javascript:void(0)'>"+element.shortName+"</a></li>");
            });
        });

    },
    init: function (path) {
        var _that = this;

        //_that.queryArea(_that.url.getAreaList);

        var page = $("#data_floors");

        //_that.render();

        // //分页=====================================>>>>>
        // $('#btn-pre-bottom').on('click',function () {
        //     if(!$(this).hasClass('zl-btn-disable')){
        //         location.href=_that.query(path)+'&page='+ (parseInt($('.page-index').html())-1);
        //     }
        // });
        // $('#btn-next-bottom').on('click',function () {
        //     console.log(1);
        //     if(!$(this).hasClass('zl-btn-disable')){
        //         console.log(2);
        //         location.href=_that.query(path)+'&page='+ (parseInt($('.page-index').html())+1);
        //     }
        // });
        // $('#btn-save').on('click',function () {
        //     var value= parseInt($(this).parent().find('.zl-page-num-input').val());
        //     if(_that.verifyPagination(value, parseInt($('.page-all').html()))){
        //         location.href=_that.query(path)+'&page='+ value;
        //     }
        // });
        // //分页<<<<<<=====================================

        // var queryMallId=$('#js-dropdown-projects').find('input[type=hidden]').val();
        // if(queryMallId){
        //     $.getJSON(_that.url.getBlockByMallId,{mallId:queryMallId},function (res) {
        //         console.log(res); //TODO
        //         $.each(res,function (index,element) {
        //             $('#js-query-block-menu').append("<li><a data-id="+element.id+" href='javascript:void(0)'>"+element.blockName+"</a></li>");
        //         });
        //     });
        // }

        // page.on("click", ".btn-group li", function () {
        //     var child = $(this).children('a'),
        //         btn = $(this).closest("div").find("button"),
        //         //$(this).parent('ul').prev('button'),
        //         //$(this).closest("div").find("button")
        //         input = $(this).parent('ul').prevAll('input[type=hidden]');
        //     var text=child.html();
        //     if(text.length>10){
        //         text=text.substring(0,10)+'...';
        //     }
        //     btn.html(text);
        //     input.val(child.data('id'));
        //
        //     if($(this).parents('#js-dropdown-projects')[0]){
        //         $('#js-dropdown-block').find('input[name=blockId]').val('');
        //         window.location.href=_that.query(path);
        //     }
        //     if($(this).parents('#js-dropdown-block')[0]){
        //         window.location.href=_that.query(path);
        //     }
        //
        //     if($(this).parents('#js-dropdown-managementType')[0]){
        //         window.location.href=_that.query(path);
        //     }
        // });

        //查询按钮
        page.on("click", "#js-floor-query", function () {
            // window.location.href=_that.query(path);
            generalQueryBtn(true);
        });

        //编辑保存按钮
        page.on("click","[id^=updateBtn_]",function () {
            var count = this.id.split('_')[1];
            var $form = $('#updateForm_'+count);
            //console.log($form.serialize());
            if(_that.verify($form)){
                $.post(path.enrolmentWebPath+_that.url.update,$form.serialize(),function (res) {
                    console.log(res);
                    if(res.code==='0'){
                        alert(res.data, "", "", function () {
                            generalQueryBtn(true);
                        });
                    }else if(res.code==='1'){
                        alert(res.msg);
                    }else{
                        alert(res.message)
                    }
                },"json").error(function (xhr, errorText, errorType) {
                    alert('系统出错');
                });
            }
        });
        //添加保存按钮
        //===========================>>>添加 event
        page.on("click", "#js-add-btn", function () {
            var _self=$(this);
            _self.attr('disabled',true);

            var $form = $('#js-add-form');
            if( _that.verify($form)){
                $.post(path.enrolmentWebPath+_that.url.add,$form.serialize(),function (res) {
                    console.log(res);
                    if(res.code==='0'){
                        alert(res.data, "", "", function () {
                            generalQueryBtn(true);
                        });
                    }else if(res.code==='1'){
                        alert(res.msg);
                    }else{
                        alert(res.message)
                    }
                    _self.attr('disabled',false);
                },'json').error(function (xhr, errorText, errorType) {
                    alert('系统出错');
                    _self.attr('disabled',false);
                });
            }else{
                _self.attr('disabled',false);
            }
        });
        // <<<==========================

        //编辑删除按钮
        //============================>>>delete event
        page.on("click",".js-floor-delete",function () {
            var id=$(this).attr("data-value");
            confirm("确认是否删除？", "", "", function (type) {
                if (type == "dismiss") return;
                $.getJSON(path.enrolmentWebPath+_that.url.delete,{id: id},function (res) {
                    // console.log(res);  //TODO
                    if(res.code==='0'){
                        alert(res.data, "", "", function () {
                            generalQueryBtn(true);
                        });
                    }else if(res.code==='1'){
                        alert(res.msg);
                    }else{
                        alert(res.message)
                    }
                }).error(function (xhr, errorText, errorType) {
                    alert('系统出错');
                });
            });

        });
        // <<<===========================
    },
    verify: function ($form) {
        var allInput = $form.find('input').not('input[name=useSquare],input[name=floorNo]');
        for (var i = 0; i < allInput.length; i++) {
            var item = $(allInput[i]);
            if (!item.val().trim()) {
                alert(floor.tips[item.attr('name')]);
                return false;
            }
        }
        if(!/^(\d{1,8})(\.\d{1,2})?$/.test($form.find('input[name=fixedSquare]').val())){
            alert('请输入正确的建筑面积');
            return false;
        }

        return true;
    },
    tips: {
        "areaId":"请选择所属城市公司",
        "mallId": "请选择项目名称",
        "blockId": "请选择楼栋名称",
        "floorName": "请输入楼层名称",
        "fixedSquare": "请输入建筑面积",
        "floorNo": "请选择楼层编码",
        "buildingType":"请选择物业类型"
    }
};
(function () {
    $("#preloader").fadeOut("fast");

    floor.init({staticPath: base_Path, enrolmentWebPath: enrolmentWeb_Path});
    //楼栋查询
    $(".queryForm-mall-dropdown").ysdropdown({
        callback:function(val,$elem){
                $.getJSON(enrolmentWeb_Path+'/block/list.htm',{mallId:val},function (res) {
                    console.log(res); //TODO
                    $(".queryForm-block-dropdown").find("ul").empty();
                    $(".queryForm-block-dropdown").find("ul").append("<li><a href='javascript:void(0)'>所有楼栋</a></li>");
                    if(val&&val!=""){
                        $.each(res,function (index,element) {
                            $(".queryForm-block-dropdown").find("ul").append("<li><a data-value="+element.id+" data-id="+element.id+" href='javascript:void(0)'>"+element.blockName+"</a></li>");
                            //$('#js-query-block-menu').append("<li><a data-id="+element.id+" href='javascript:void(0)'>"+element.blockName+"</a></li>");
                        });
                    }

                    generalQueryBtn(true);
                });

        }
    });
    //项目查询
    $(".areaSelect").ysdropdown({
        callback:function(val,$elem){
            //console.log("===================")
            console.log(val);
            console.log($elem);
            $(".queryForm-mall-dropdown").find("ul").empty();
            $(".queryForm-mall-dropdown").find("ul").append("<li><a href='javascript:void(0)'>所有项目</a></li>");
            $(".queryForm-mall-dropdown").find("input").val("");
            $(".queryForm-mall-dropdown").find("button").html("所有项目")
            $(".queryForm-block-dropdown").find("ul").empty();
            $(".queryForm-block-dropdown").find("ul").append("<li><a href='javascript:void(0)'>所有楼栋</a></li>");
            $(".queryForm-block-dropdown").find("input").val("");
            $(".queryForm-block-dropdown").find("button").html("所有楼栋")
            $.getJSON(enrolmentWeb_Path+'/block/mallList.htm',{areaId:val},function (res) {
                //console.log(res); //TODO
                //console.log("++++++++++++++++++++++"); //TODO ;
                //console.log($(".queryForm-block-dropdown").find("button").html()); //TODO ;
                $.each(res,function (key,value) {
                    console.log(key,value);
                    $(".queryForm-mall-dropdown").find("ul").append("<li><a data-value="+key+" data-id="+key+" href='javascript:void(0)'>"+value+"</a></li>");
                    //$('#js-query-block-menu').append("<li><a data-id="+element.id+" href='javascript:void(0)'>"+element.blockName+"</a></li>");
                });
            });
            generalQueryBtn(true);
        }
    });

    generalQueryBtn(false);
})();



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
    var fm = document.getElementById("js-floor-form");
    var formData = new FormData(fm);
    var url = enrolmentWeb_Path + "floor/query.htm";
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
                    console.log("===================")
                    console.log(val);
                    console.log($elem);
                }
            });

            //注册分页事件
            //分页=====================================>>>>>
            $('#btn-pre-bottom').on('click',function () {
                if(!$(this).hasClass('zl-btn-disable')){
                    //location.href=query(path)+'&page='+ (parseInt($('.page-index').html())-1);
                    generalQueryBtn(true,(parseInt($('.page-index').html())-1));
                }
            });
            $('#btn-next-bottom').on('click',function () {
                if(!$(this).hasClass('zl-btn-disable')){
                    //location.href=query(path)+'&page='+ (parseInt($('.page-index').html())+1);
                    generalQueryBtn(true,(parseInt($('.page-index').html())+1));
                }
            });
            $('#btn-save').on('click',function () {
                var value= parseInt($(this).parent().find('.zl-page-num-input').val());
                if(verifyPagination(value, parseInt($('.page-all').html()))){
                    //location.href=query(path)+'&page='+ value;
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
            //分页<<<<<<=====================================


            if(flag) {
                loadingHide();
            }
        }
    });
}


function queryMall(_this) {
    console.log("城市公司选框");
    var areaId = $(_this).attr("data-value");


    //清空项目名称 $(_this).closest("div.zl-collapse-content").find("ul.mall-grop")
    $(_this).closest("div.zl-collapse-content").find("div.mall-dropdown").find("ul").empty();
    $(_this).closest("div.zl-collapse-content").find("div.mall-dropdown").find("button").html("请选择");


    $.getJSON(enrolmentWeb_Path + "common/getMallListByAreaId.htm", {"areaId": areaId}, function (res) {
        var isMallId=true;
        console.log(res);
        $.each(res, function (key,value) {
            isMallId=false;
            $(_this).closest("div.zl-collapse-content").find("div.mall-dropdown").find("ul").append("<li><a key='"+key+"' data-value='"+key+"' class='but-val' onclick='queryBlock(this)'  href='javascript:void(0)' >"+value+"</a></li>");
        });
        if(isMallId){
            alert("未找到项目！");
        }
    });
}

function queryBlock(_this) {
    var mallId = $(_this).attr("data-value");
    console.log(111111);
    //清空楼栋
    $(_this).closest("div.zl-collapse-content").find("div.block-dropdown").find("ul").empty();
    $(_this).closest("div.zl-collapse-content").find("div.block-dropdown").find("button").html("请选择");

    $.getJSON(enrolmentWeb_Path + "block/list.htm", {"mallId": mallId}, function (res) {
        var isBlockId=true;
        console.log(res);
        $.each(res, function (index,element) {
            isBlockId=false;
            $(_this).closest("div.zl-collapse-content").find("div.block-dropdown").find("ul").append("<li><a data-value='"+element.id+"' class='but-val'  href='javascript:void(0)' >"+element.blockName+"</a></li>");
        });
        if(isBlockId){
            alert("未找到楼栋！");
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
//验证数字
function clearNoNum(obj) {
    obj.value = obj.value.replace(/[^\d.]/g,""); //清除"数字"和"."以外的字符
    obj.value = obj.value.replace(/^\./g,""); //验证第一个字符是数字而不是
    obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
    obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数

};

//楼栋
$(".queryForm-block-dropdown").ysdropdown({
    callback:function(val,$elem){
        console.log("===================")
        console.log(val);
        console.log($elem);

        generalQueryBtn(true);
    }
});
//物业类型
$("#js-dropdown-managementType").ysdropdown({
    callback:function(val,$elem){
        console.log("===================")
        console.log(val);
        console.log($elem);

        generalQueryBtn(true);
    }
});

