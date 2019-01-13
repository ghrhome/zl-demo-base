var _selectedStores = {};
var _selectedForms = {};
var buildingList = [];
var floorList = [];
var rentArr = [
    {index:'0',month:'1'}, {index:'1',month:'2'}, {index:'2',month:'3'}, {index:'3',month:'4'},
    {index:'4',month:'5'}, {index:'5',month:'6'}, {index:'6',month:'7'}, {index:'7',month:'8'},
    {index:'8',month:'9'}, {index:'9',month:'10'}, {index:'10',month:'11'}, {index:'11',month:'12'},
    {index:'12',month:'13'},
];
var manaArr = [
    {index:'13',month:'1'}, {index:'14',month:'2'}, {index:'15',month:'3'},
    {index:'16',month:'4'}, {index:'17',month:'5'}, {index:'18',month:'6'},
    {index:'19',month:'7'}, {index:'20',month:'8'}, {index:'21',month:'9'},
    {index:'22',month:'10'}, {index:'23',month:'11'}, {index:'24',month:'12'},
    {index:'25',month:'13'},
];
var pageView = (function ($) {

    var container = $("#store-split-merge-add");

    var pageView = {};

    pageView.loadingShow = function () {
        $(".zl-loading").fadeIn();
    };

    pageView.loadingHide = function () {
        $(".zl-loading").fadeOut();
    };

    // 下拉框初始化
    pageView.dropdownInit = function(){
        container.on('click', "div.zl-dropdown-inline ul.dropdown-menu li a", function(){
            var key = $(this).attr("data-value");
            $(this).closest('div.zl-dropdown-inline').find("input[type=hidden]").val(key);

            var value = $(this).text();
            $(this).closest('div.zl-dropdown-inline').find("button").text(value);
        });
    };

    pageView.eventInit = function () {

        // 原铺位
        container.on('click', 'em.store-selected-btn', function(){
            selectUnit.modalShow(
                function (selectedShops) {
                    _selectedStores = selectedShops;
                    _storeSelectorCallBack(_selectedStores);
                }, _selectedStores)
        });

        // 删除新铺位
        container.on('click', 'em.store-del-btn', function(){
            $(this).closest('table').remove();
        });

        // 增加新铺位
        container.on('click', 'em.store-add-btn', function(){

            var mallId = container.find("input[name=mallId]").val();
            if(mallId==null || mallId==""){
                alert("请先选择项目");
                return;
            }
            
            var target = $("#zl-section-collapse-table-4");
            var index = Number(target.find("table.new-store-table:last").attr("index"));
            $("#newStoreTpl").tmpl({
                blockTpl : $("#blockTpl").html(),
                floorTpl : $("#floorTpl").html(),
                storeTypeTpl : $("#storeTypeTpl").html(),
                storePositionTpl : $("#storePositionTpl").html(),
                rentArr : rentArr,
                manaArr : manaArr,
            }, {
                index : function(){
                    return index;
                },
                indexAdd : function(){
                    index++;
                    return "";
                },
            }).appendTo(target);

            pageView.swiperInit();
        });

        // 铺位预算输入累加
        container.on('input', "input[name$=budget]", function(){
            var _tr = $(this).closest('tr');
            var tot = 0;
            _tr.find("input[name$=budget]:not(.tot-budget-input)").each(function (){
                var val = isNaN($(this).val()) ? 0 : Number($(this).val());
                tot = tot + val;
            });
            _tr.find("input[name$=budget].tot-budget-input").val(tot);
        });

        //暂存
        container.on("click", "#js-temp-save", function (e) {
            e.preventDefault();
            submitForm(function(rdata){
                window.location.href = netcommentWeb_Path + "/netcomment/storeSplitMerge/index.htm";
            });
        });

        //发起审批
        container.on("click", "#js-save", function (e) {
            e.preventDefault();
            submitForm(function (netCommentId) {
                // 调用K2
                var mallCode = $("input[name=mallCode]").val();
                var areaCode = mallCode.substring(0, 8);
                $app.workflow.submit("inamp-shopdismantlemerge-" + areaCode, netCommentId).then(function ($response) {
                    window.open($response.data.data);
                    location.href = netcommentWeb_Path + "/netcomment/storeSplitMerge/index.htm";
                });
            });
        });

        // 使用面积/得房率输入事件
        container.on('input', "input[name$=propertySquare],input[name$=obtainAreaRatio]", function(){
            var _table = $(this).closest('table');

            if(!/^(\d{1,8})(\.\d{1,2})?$/.test($(this).val())){
                $(this).val("");
                return;
            }

            var propertySquare = _table.find("input[name$=propertySquare]").val();
            var obtainAreaRatio = _table.find("input[name$=obtainAreaRatio]").val();
            if(!obtainAreaRatio||obtainAreaRatio>100||obtainAreaRatio<=0){
                _table.find("input[name$=obtainAreaRatio]").val("");
                return;
            }

            _table.find('input[name$=structureSquare]').val((parseFloat(propertySquare)/(obtainAreaRatio/100)).toFixed(2));

            calcSquareDifferent();
        });
    };

    pageView.init = function () {
        $("#preloader").fadeOut("fast");
        pageView.eventInit();
        pageView.fileupload();
        pageView.swiperInit();
        pageView.layoutInit();
        pageView.dropdownInit(); // 下拉框选择
        // $(".zl-dropdown-inline").ysdropdown("init");
        selectUnit.init("", "multi"); // 初始化铺位选择控件
    };

    // 附件上传
    pageView.fileupload = function () {
        $("#uploadFile").fileupload({
            pasteZone: null,
            url: netcommentWeb_Path + "netcomment/fileUpload.htm",
            dataType: 'json',
            add: function (e, data) {
                pageView.uploadFiles(data.files[0], function (item) {
                    data.formData = {path: item};
                    data.submit();
                });

            },
            progressall: function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $('#progress .progress-bar').css(
                    'width',
                    progress + '%'
                );
            },
            success: function (result, textStatus, jqXHR) {
                result = result.data;
                var html =
                    '<li class="row">' +
                    '<span class="col-md-4">' +
                    '<em class="zl-em-icon zl-icon-attachment"></em>' +
                    '<a href="' + accessUrl + result.attachmentPath + '" target="_blank" class="zl-attach-file-link">' + result.attachmentName + '</a>' +
                    '</span><span class="col-md-2">' + result.createrName + '</span>' +
                    '<span class="col-md-4">' + new Date(result.createdDate).toLocaleDateString() + '</span>' +
                    '<span class="col-md-2" style="text-align: center;"><a onclick="pageView.deleteFile(this, ' + result.id + ')" class="zl-attach-del" style="cursor: pointer;">删除</a></span>' +
                    '</li>';
                $(html).appendTo('#files');

                var attachments = "<input type='text' id='attachments_" + result.id + "' name='attachments' value='" + result.id + "' />";
                $(attachments).appendTo('#attachmentDiv');
            }
        }).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');
    }

    pageView.uploadFiles = function (file, callback) {
        var formData = new FormData();
        formData.append("action", "1002");
        formData.append("single", 1);
        formData.append("category", "net_store_split_merge");
        formData.append("targetId", '');
        formData.append('file', file);
        $.ajax({
            url: fileWeb_Path + 'sdk/platform/file',
            type: 'POST',
            dataType: "json",
            cache: false,
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.success) {
                    if (typeof callback === "function") {
                        callback(response.data.path);
                    }
                }
            }
        });
    };
    // 滑动窗口初始化
    pageView.swiperInit = function () {
        new Swiper('.swiper-container', {
            scrollbar: '.swiper-scrollbar-a',
            direction: 'horizontal',
            slidesPerView: 'auto',
            mousewheelControl: true,
            freeMode: true,
            scrollbarHide:false,
            scrollbarDraggable:true,
            preventClicksPropagation:false,

        });
    }
    // 附件删除
    pageView.deleteFile = function (_this, id) {
        if (confirm("确认删除？")) {
            $.ajax({
                //url: "delAttachmentFile.htm",
                url: netcommentWeb_Path + "netcomment/deleteFile.htm",
                type: "POST",
                data: {id: id},
                success: function (result) {
                    result = eval("(" + result + ")");
                    if (result.code == 0) {
                        $(_this).parent().parent().remove();
                        $("#attachments_" + id).remove();
                    } else {
                        alert("删除失败");
                    }
                },
                error: function (resp) {
                    showMsg(resp);
                }
            });
        }
    }
    // 业态控件初始化
    pageView.layoutInit = function () {
        $.getJSON(netcommentWeb_Path + 'netcomment/storeSplitMerge/getLayoutTree.htm', function (rdata) {
            if(rdata && rdata.code=='0'){
                selectForm.init({'formList':rdata.data}, "single");
            }
        });
        pageView.layoutSelect();
    };
    // 业态选择
    pageView.layoutSelect = function () {
        container.on("click", 'input[name$=layoutName]', function (e) {
            var _self = $(this);
            e.stopPropagation();
            e.preventDefault();
            selectForm.modalShow(function (selectedForms) {
                console.log(selectedForms);
                if(selectedForms){
                    _self.val(selectedForms.nodeName);
                    _self.closest('td').find('input[name$=issuingLayout]').val(selectedForms.nodeId);
                    _self.closest('td').find('input[name$=layoutCode]').val(selectedForms.nodeValue);
                }
            }, _selectedForms);
        });
    };

    return pageView;
})(jQuery);


$(document).ready(function () {
    pageView.init();

    // 铺位初始化
    var mallId = $("input[name=mallId]").val();
    if (mallId != null && mallId != "") {
        initStore(mallId);
        floorTplInit();
    }
});

/**
 * 项目选择
 * @param _this
 */
function selectMall(_this){
    var mallId = $(_this).attr("data-value");
    //项目选择的时候清空 原铺位信息
    $("em.store-selected-btn").find("input[name=oriStoreIds]").val("");
    $("em.store-selected-btn").find("input[name=oriStoreNos]").val("");
    _selectedStores={};
    //console.log(_selectedStores);
    if($("input[name=mallId]").val() == mallId){
        return;
    }

    var mallCode = $(_this).attr("data-key");
    $(_this).closest('td').find('input[name=mallCode]').val(mallCode);
    var malllName = $(_this).text();
    $(_this).closest('td').find("input[name=mallName]").val(malllName);


    initMall();
    initBlock();
    initFloor();
    initStore(mallId);
}

/**
 * 项目信息初始化
 * @param mallId
 */
function initMall(){
    $("#zl-section-collapse-table-2").find("input").val("");
    $("#zl-section-collapse-table-3").empty();
    $("#zl-section-collapse-table-4").find("table.new-store-table:not([index=0])").remove();
    $("#zl-section-collapse-table-4").find("input:not(div.swiper-container input[type=hidden])").val("");
}

/**
 * 楼栋初始化
 */
function initBlock(){
    $("ul.block-ul").closest("div.btn-group").find("input[type=hidden]").val("");
    $("ul.block-ul").closest("div.btn-group").find("button").text("请选择");
    $("ul.block-ul").empty();
}
/**
 * 楼层初始化
 */
function initFloor(){
    $("ul.floor-ul").closest("div.btn-group").find("input[type=hidden]").val("");
    $("ul.floor-ul").closest("div.btn-group").find("button").text("请选择");
    $("ul.floor-ul").empty();
}
/**
 * 铺位初始化
 * @param mallId
 */
function initStore(mallId){

    $.ajax({
        cache: true,
        type: "POST",
        url: netcommentWeb_Path + 'netcomment/storeSplitMerge/getFloorList.htm',
        dataType: "json",
        data: {'mallId': mallId},
        async: false,
        error: function (request) {
            // alert("系统繁忙...");
            console.log(shop.id+"铺位查询异常...");
        },
        success: function (rdata) {
            // var rdata = eval('(' + result + ')');
            if(rdata && rdata.code=='0'){

                console.log(rdata.data);

                // 楼栋初始化
                buildingList = rdata.data.buildingList;
                floorList = rdata.data.buildings;
                buildingTplInit();


                // 铺位选择控件
                selectUnit.update(rdata.data, "multi");
            }
        }
    });
}
/**
 * 铺位选择回调
 * @param _selectedStores
 * @private
 */
function _storeSelectorCallBack(_selectedStores){
    // console.log(_selectedStores);
    var storeIds = "";
    var storeNos = "";
    var target = $("#zl-section-collapse-table-3");
    target.empty();

    var structureSquareOldTotal = 0;
    var propertySquareOldTotal = 0;
    $.each(_selectedStores, function (id, shop) {
        storeIds += shop.id+",";
        storeNos += shop.name+";";

        $.ajax({
            cache: true,
            type: "POST",
            url: netcommentWeb_Path + "netcomment/storeSplitMerge/getStoreInfo.htm",
            dataType: "json",
            data: {storeId : shop.id},
            async: false,
            error: function (request) {
                // alert("系统繁忙...");
                console.log(shop.id+"铺位查询异常...");
            },
            success: function (rdata) {
                // console.log(rdata);
                if(rdata && rdata.code=='0' && rdata.data){

                    var store = rdata.data;
                    // console.log(store);
                    structureSquareOldTotal = structureSquareOldTotal + (isNaN(store.structureSquare) ? 0 : store.structureSquare);
                    propertySquareOldTotal = propertySquareOldTotal + (isNaN(store.propertySquare) ? 0 : store.propertySquare);
                    //console.log("---------------------------------------------------");
                    //console.log(store);
                    //blockName
                    //blockId
                    //floorId
                    //floorName
                    //storeType
                    /*console.log("store.blockName:"+store.blockName);
                    console.log("store.blockId:"+store.blockId);
                    console.log("store.floorId:"+store.floorId);
                    console.log("store.floorName:"+store.floorName);
                    console.log("store.storeType:"+store.storeType);*/
                    $("#oriStoreTpl").tmpl(store, {
                        fmtAmt : function(key){
                            return fmtAmt(key);
                        },
                        fmtStoreType : function(){
                            return storeTypeMap[this.data.storeType] || "";
                        },
                        fmtStorePosition : function(){
                            return storePositionMap[this.data.storePosition] || "";
                        },
                    }).appendTo(target);
                    // 初始化
                    pageView.swiperInit();
                    return;
                }
            }
        });
    });
    //console.log("==================================================================");
    $("input[name=oriStoreIds]").val(storeIds);
    $("input[name=oriStoreNos]").val(storeNos);

    // 面积差额计算
    $("input[name=structureSquareOld]").val(structureSquareOldTotal.toFixed(2));
    $("input[name=propertySquareOld]").val(propertySquareOldTotal.toFixed(2));
    calcSquareDifferent();
}


/**
 * 楼栋初始化
 */
function buildingTplInit(){

    $("#blockTpl").empty();

    $("#sourceSelectedTpl").tmpl(buildingList,{
        getFuncName : function () {
            return "selectBlock(this)";
        }
    }).appendTo($("#blockTpl"));

    $("ul.block-ul").html($("#blockTpl").html());
}
/**
 * 楼层初始化
 */
function floorTplInit(){
    var _tables = $("#zl-section-collapse-table-4").find('table.new-store-table');

    _tables.each(function(){
        var _table = $(this);
        // 清空楼层
        _table.find("ul.floor-ul").empty();

        // 添加楼层模板
        var blockId = _table.find("input[name$=blockId]").val();
        var building = floorList[blockId];
        if(building && building.floors) {
            $("#sourceSelectedTpl").tmpl(building.floors, {
                getFuncName: function () {
                    return "selectFloor(this)";
                }
            }).appendTo(_table.find("ul.floor-ul"));
        }
    });
}


/**
 * 楼栋选择
 */
function selectBlock(_this){

    var _table = $(_this).closest('table');
    var blockName = $(_this).text();
    _table.find("input[name$=blockName]").val(blockName);


    // 清空楼层
    _table.find("ul.floor-ul").empty();
    
    // 添加楼层模板
    var blockId = $(_this).attr("data-value");
    var building = floorList[blockId];
    if(building && building.floors){
        $("#sourceSelectedTpl").tmpl(building.floors,{
            getFuncName : function () {
                return "selectFloor(this)";
            }
        }).appendTo(_table.find("ul.floor-ul"));
    }
}
/**
 * 楼层选择
 * @param _this
 */
function selectFloor(_this) {
    var _table = $(_this).closest('table');
    var floorName = $(_this).text();
    _table.find("input[name$=floorName]").val(floorName);
}



/**
 * 表单必输校验
 * @returns {boolean}
 */
function checkNetForm() {
    //必输项校验
    var isChecked = true;
    $('#billForm').find(".zl-section-content.collapse").each(function () {
        if($(this).attr("aria-expanded") == "false"){
            $(this).closest("div.zl-section").find("a.zl-section-collapse-btn").click();
        }
    });

    $('#billForm').find(".required:visible").each(function () {
        var title = $(this).attr("title") || "必填项";
        var _this;
        if ($(this).find("select").length > 0) {
            _this = $(this).find("select");
        } else if ($(this).find("input[type!='hidden'][type='ibhradio']").length > 0) {
            _this = $($(this).find("input[type='radio']:checked"));
        } else if ($(this).find("input[type!='hidden']").length > 0) {
            _this = $(this).find("input[type!='hidden']");
        } else if ($(this).find("textarea").length > 0) {
            _this = $($(this).find("textarea"));
        } else {
            _this = $(this).find("input[type!='hidden']");
        }

        if ((_this.val() == "" || _this.val() == undefined) && (_this.attr("name") != undefined && _this.attr("name").indexOf("bootstrapDropdown") == -1)) {
            var msg = title + "不能为空!";
            alert(msg);
            isChecked = false;
            _this.focus();
            return false;
        }

        //画面中的 下拉选择 必填项判断
        if ($(this).find(".zl-dropdown-btn").length > 0) {
            _this = $(this).find(".zl-dropdown-btn");
            if (_this.html() == "" || _this.html() == undefined || _this.html().indexOf("请选择") > 0) {
                var msg = title + "不能为空!";
                alert(msg);
                isChecked = false;
                _this.focus();
                return false;
            }
        }

    });

    //金额非负验证
    $('#billForm').find("input[type='number']:visible").each(function () {
        var title = $(this).attr("title") || "金额";
        var _this = $(this);
        if (parseFloat(_this.val()) < 0 && _this.attr('negative') != 'true') {
            alert(title + "不能小于0");
            isChecked = false;
            _this.focus();
            return false;
        }
    });

    if (isChecked == true && typeof(checkNetBillForm) == "function") {
        if (checkNetBillForm() != true) {
            return false;
        }
    }
    return isChecked;
}
/**
 * 表单提交
 * @param callback
 */
function submitForm(callback){
    var mallId = $("input[name=mallId]").val();
    if (mallId == null || mallId == "") {
        alert("请先选择一个项目！");
        return;
    }

    var oriStoreIds = $("input[name=oriStoreIds]").val();
    if(!checkNotNull(oriStoreIds)){
        alert("请选择原商铺");
        return;
    }

    if(!checkNetForm()){
        return;
    }

    var msg = "";
    var storeInputs = $("#zl-section-collapse-table-4").find("input[name$=storeNo]");
    var k = 0;
    storeInputs.each(function(){
        var flag = true;
        var storeNo = $(this).val().trim();
        // 表单中是否有重复铺位号检查
        var l = 0;
        storeInputs.each(function(){
            var _storeNo = $(this).val().trim();
            if(k!=l && storeNo == _storeNo){
                flag = false;
                msg = "铺位号[" + storeNo + "]重复,请检查";
                return false;
            }
            l++;
        });
        k++;

        if(!flag){
            return false;
        }

        $.ajax({
            cache: false,
            type: "POST",
            url: netcommentWeb_Path + 'netcomment/storeSplitMerge/storeNoCheck.htm',
            data: {storeNo : storeNo},
            dataType: "json",
            async: false,
            error: function (request) {
                alert("系统繁忙......");
            },
            success: function (rdata) {
                if(!rdata || rdata.code=="1"){
                    flag = false;
                    msg = rdata.msg;
                }
            }
        });
        return flag;
    });
    if(msg && msg!=""){
        alert(msg);
        return;
    }

    pageView.loadingShow(); // 隐藏 loading
    $.ajax({
        cache: false,
        type: "POST",
        url: netcommentWeb_Path + "netcomment/storeSplitMerge/saveBill.htm",
        data: $('#billForm').serialize(),
        dataType: "json",
        async: true,
        error: function (request) {
            pageView.loadingHide(); // 隐藏 loading
            alert("系统繁忙...");
        },
        success: function (rdata) {
            pageView.loadingHide(); // 隐藏 loading
            if (rdata && rdata.code=="0") {
                if (typeof callback === "function") {
                    var obj = rdata.data;
                    $("input[name=id]").val(obj.id);
                    $("input[name=netcommentId]").val(obj.netcommentId);
                    callback(obj.netcommentId);
                    return;
                }
                alert(rdata.msg);
                return;
            }
            alert(rdata.msg);
        }
    });
}

/**
 * 总铺位面积差额计算
 */
function calcSquareDifferent(){
    var _tableNew = $("#zl-section-collapse-table-4").find("table.new-store-table");

    var structureSquareNewTotal = 0;
    var propertySquareNewTotal = 0;
    _tableNew.each(function(){
        var _structureSquare = $(this).find("input[name$=structureSquare]").val();
        structureSquareNewTotal = structureSquareNewTotal + (isNaN(_structureSquare) ? 0 : Number(_structureSquare));
        var _propertySquare = $(this).find("input[name$=propertySquare]").val();
        propertySquareNewTotal = propertySquareNewTotal + (isNaN(_propertySquare) ? 0 : Number(_propertySquare));
    });

    $("input[name=structureSquareNew]").val(structureSquareNewTotal.toFixed(2));
    $("input[name=propertySquareNew]").val(propertySquareNewTotal.toFixed(2));

    var structureSquareOld = $("input[name=structureSquareOld]").val();
    var structureSquareDiff = structureSquareNewTotal - (isNaN(structureSquareOld) ? 0 : structureSquareOld);
    $("input[name=structureSquareDiff]").val(structureSquareDiff.toFixed(2));
    var propertySquareOld = $("input[name=propertySquareOld]").val();
    var propertySquareDiff = propertySquareNewTotal - (isNaN(propertySquareOld) ? 0 : propertySquareOld);
    $("input[name=propertySquareDiff]").val(propertySquareDiff.toFixed(2));
}

