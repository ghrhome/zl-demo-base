$(function() {
	var container = $("#business-amount-enrolment");

	$("#preloader").fadeOut("fast");

	//销售预算
	container.on('click','#import-budget-btn',function (e) {
        e.stopPropagation();
        e.preventDefault();
        $("#modal-budget").modal("show");
    });
    $("#budget-btn").ysSimpleUploadFile({ // Excel导入上传
        acceptTypes: ["xls", "xlsx"],
        changeCallback: function (file) {
            $(".zl-loading").fadeIn();
            var formData = new FormData();
            formData.append("file", file);
            $.ajax({
                url: managementWeb_Path + 'budget/import/excel.htm',
                type: 'POST',
                data: formData,
                dataType: 'json',
                async: true,
                contentType: false,
                processData: false,
                success: function (res) {
                    if(res.msg==='success'){
                        $("#modal-budget").modal("hide");
                        alert('导入成功', "", "", function () {
                            location.reload(true);
                        });
                    }else  if(res.msg==='nothing'){
                        alert('没有数据需要导入');
                    }else{
                        $('#modal-budget').find('.modal-body-tips').empty().append("<p>提示:</p>");
                        var msgArray=res.msg.split('.');
                        $.each(msgArray,function (index, element) {
                            if(element==='nothing') {
                                return;
                            }
                            $('#modal-budget').find('.modal-body-tips').append("<p style='text-indent: 15px;'>"+element+"</p>");
                        });

                    }
                    $(".zl-loading").fadeOut();
                },
                error: function () {
                    alert("操作失败，请重试！");
                }
            })
        }
    });

	container.on("click","a.zl-edit-btn",function(e){
		e.stopPropagation();
		e.preventDefault();

		var _div = $(this).closest(".charger-group");
		_div.find(".zl-save-btn").show();
        _div.find(".zl-cancel-btn").show();
		_div.find(".zl-edit-btn").hide();
        _div.find("button.zl-dropdown-btn").removeAttr("disabled");
	});


	container.on("click","a.zl-save-btn",function(e){
		e.stopPropagation();
		e.preventDefault();

		var _this = $(this);
		var _div = _this.closest("div.content-middle");
        var index = _this.closest('div.charger-group').find('div.btn-group').attr("index") || "";

        var params = {
			id : _this.closest("div.panel-default").find('input[name=businessId]').val(),
			contNo : _this.closest("div.panel-default").find('input[name=contNo]').val(),
		};
		params["manager"+index] = _div.find("input[name=manager"+index+"]").val();
		params["managerName"+index] = _div.find("input[name=managerName"+index+"]").val();

		save(params);
	});
	container.on("click","a.zl-cancel-btn",function(e){
		e.stopPropagation();
		e.preventDefault();
        var _div = $(this).closest(".charger-group");
        _div.find(".zl-save-btn").hide();
        _div.find(".zl-cancel-btn").hide();
        _div.find(".zl-edit-btn").show();
        _div.find("button.zl-dropdown-btn").attr("disabled", true);
	});

	/* ======================================== init the page view ======================================== */

	/* ======================================== bind the event ======================================== */
	$(".opening-date-confirmation .zl-datetimepicker input").datetimepicker({
		language: "zh-CN",
		format: "yyyy-mm-dd",
		todayBtn: "linked",
		startView: 2,
		minView: 2,
		weekStart: 1,
		todayHighlight: 1,
		autoclose: 1,
		forceParse: 0
	});

	container.on("click","a.confirm-btn",function(e){
		e.stopPropagation();
		e.preventDefault();

		var _div = $(this).closest('div.div-collapse');
		var modal = container.find(".opening-date-confirmation");

		modal.find('input[name=businessId]').val(_div.find('input[name=businessId]').val());
		modal.find('input[name=contNo]').val(_div.find('input[name=contNo]').val());
		modal.find('span#storeNos').text(_div.find('input[name=storeNos]').val());
		modal.find('span#brandName').text(_div.find('input[name=brandName]').val());
		modal.find('span#deliverDate').text(_div.find('input[name=deliverDate]').val());
		modal.find('span#contBeginDate').text(_div.find('input[name=contBeginDate]').val());

		modal.modal("show");
	});

    /**
	 * 保存按钮
     */
	container.on('click', "a.open-date-save-btn", function(e){
		var _modal = $(this).closest('div.zl-dialog');
		var params = {
			id : _modal.find('input[name=businessId]').val(),
			contNo : _modal.find('input[name=contNo]').val(),
			openDate : _modal.find('input[name=openDate]').val(),
		};
		save(params);
	});
    /**
	 * 取消
     */
    container.on('click', "open-date-cancel-btn", function(e){
        container.find(".opening-date-confirmation").modal("hide");
    });

	$(".operation-toolbar .zl-date-selector input").datetimepicker({
		language: "zh-CN",
		format: "yyyy-mm",
		todayBtn: "linked",
		startView: 3,
		minView: 3,
		weekStart: 1,
		todayHighlight: 1,
		autoclose: 1,
		forceParse: 0
	});

	$(".sale-dialog .zl-date-selector input").datetimepicker({
		language: "zh-CN",
		format: "yyyy-mm",
		todayBtn: "linked",
		startView: 3,
		minView: 3,
		weekStart: 1,
		todayHighlight: 1,
		autoclose: 1,
		forceParse: 0
	});

	$("#salenum").click(function(){
		$(".sale-dialog").show();

	});

	$(".sale-dialog-close-btn").click(function() {
		$(".sale-dialog").hide();
	});

	$("#close-sales").click(function() {
		$("#bomb-box-sales").css({
			"display": "none"
		});
	});
	$("#close-sales").click(function() {
		$("#bomb-box-sales").css({
			"display": "none"
		});
		$("body").css({
			"overflow": "scroll"
		});
	});


	$("div.div-collapse").on('click', function(e){

		var _this = $(this);
		var target = $(_this.attr("href"));
		if(!target || target.text().trim()!=''){
			return;
		}
		var contNo = $(this).find('input[name=contNo]').val();

        $.ajax({
            cache: true,
            type: "POST",
            url: managementWeb_Path + "businessAmountEnrolment/getDetail.htm",
            dataType: "json",
            data: {mallId : 1, contNo : contNo, qryDate : $("#currentDate").val()},
            async: false,
            error: function (request) {
                alert("系统繁忙...");
            },
            success: function (rdata) {
                console.log(rdata);

                if(rdata && rdata.code=='0'){

                	var obj = rdata.data;
                    _this.find('input[name=deliverDate]').val(timeStampConvert(obj.deliverDate, "yyyy-MM-dd"));
                    _this.find('input[name=contBeginDate]').val(timeStampConvert(obj.contBeginDate, "yyyy-MM-dd"));

                    $("#detailTpl").tmpl(
                        obj,
						{
                    		formatDate : function(key){
                    			return timeStampConvert(this.data[key], "yyyy-MM-dd");
							},
							formatAmt : function(key){
                    			var val = this.data[key];
                                return val==null ? "-" : fmtAmt(val);
							}
						}
					).appendTo(target);
                    return;
                }
                alert('经营详情加载失败');
            }
        });
	});

    /**
	 * 绩效报表
     */
	$("#performance-btn").on('click', function(){
		var params = {
			qryDate : $("#currentDate").val(),
			mallId : $("input[name=mallId]").val()
		};
        formPost(managementWeb_Path + "businessAmountEnrolment/toPerformanceReports.htm", params);
	});
    /**
	 * 导出
     */
	$("#export-btn").on('click', function(){
        formPost(managementWeb_Path + "businessAmountEnrolment/export.htm", $("from").serialize());
        $(".zl-loading").fadeOut("fast");
	});

    //上一月点击事件
    $("button[data-id=js-date-pre]").on("click", function (e) {
        e.preventDefault();
        skip(-1);
    });
    //下一月点击事件
    $("button[data-id=zl-date-next]").on("click", function (e) {
        e.preventDefault();
        skip(1);
    });

    $("#submitBtn").on('click', function(){
    	var url = managementWeb_Path + "businessAmountEnrolment/index.htm";
        $("#searchPageForm").attr('action', url).submit();
	});

    $('#currentDate').datetimepicker({
        todayBtn: "linked",
        language:'zh-CN',
        format:'yyyy-mm',
        minView:3,
        startView:3,
        todayHighlight:true,
        endDate:new Date()
    }).on('changeDate',function () {
        $("#submitBtn").click();
    });

});

function addMonth(value, month) {
    var date = new Date(value);
    date.setMonth(date.getMonth() + month);
    var num = date.getMonth() + 1;
    if (num < 10) num = 0 + "" + num;
    return date.getFullYear() + '-' + num;
}

function skip(step) {
    var value = $('#currentDate').val();
    if (!/^\d{4}-\d{1,2}$/.test(value)) {
        alert('非法日期格式');
        return false;
    }
    var saleYm = addMonth(value, step);
    var addValue = new Date(saleYm.replace(/-/g, "\/"));
    var currentDate = new Date();
    if (addValue.getTime() > currentDate.getTime()) {
        alert('不能选择未来时间');
        return false;
    }

    $("#currentDate").val(saleYm);
    $("#submitBtn").click();
}



function save(params) {

	if(params==null || params.length==0){
		alert("参数异常...");
		return;
	}

    $.ajax({
        cache: true,
        type: "POST",
        url: managementWeb_Path + "businessAmountEnrolment/save.htm",
        dataType: "json",
        data: params,
        async: false,
        error: function (request) {
            alert("系统繁忙...");
        },
        success: function (rdata) {
            if(rdata && rdata.code=='0'){
                $("#submitBtn").click();
            	return;
            }
            alert('保存失败');
        }
    });
}

function selectManager(_this){
    var userId = $(_this).attr('key');
    var userName = $(_this).text();

    var _div = $(_this).closest('div.dropdownSelect');
    var index = _div.attr('index');
    var _outDiv = _div.closest('div.content-middle');

    _outDiv.find('input[name=manager'+index+']').val(userId);
    _outDiv.find('input[name=managerName'+index+']').val(userName);
    _div.find('span.span-more').text(userName);
}

function searchMall(_this){
    var _div = $(_this).closest('div.btn-group')
    var mallId = $(_this).attr("data-value");
    _div.find("input[name=mallId]").val(mallId);
    var mallName = $(_this).text();
    _div.find("input[name=mallName]").val(mallName);
    $("#submitBtn").click();
}

function searchFloor(_this){
	var _div = $(_this).closest('div.btn-group')
	var floorId = $(_this).attr("data-value");
	_div.find("input[name=floorId]").val(floorId);
	var floorName = $(_this).text();
	_div.find("input[name=floorName]").val(floorName);
    $("#submitBtn").click();
}

function searchLayout(_this){
    var _div = $(_this).closest("div.zl-dropdown");
    var layout = $(_this).attr("data-value");
    _div.find('input[name=layout]').val(layout);
    var layoutName = $(_this).text();
    _div.find('input[name=layoutName]').val(layoutName);
    $("#submitBtn").click();
}

function searchManager(_this){
    var _div = $(_this).closest("div.zl-dropdown");
    var managerId = $(_this).attr("data-value");
    _div.find('input[name=managerId]').val(managerId);
    var managerName = $(_this).text();
    _div.find('input[name=managerName]').val(managerName);
    $("#submitBtn").click();
}