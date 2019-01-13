$(function() {
	var container = $("#business-amount-enrolment");

	$("#preloader").fadeOut("fast");
	container.on("click","a.zl-edit-btn",function(e){
		e.stopPropagation();
		e.preventDefault();
		$(this).parent().find(".zl-save-btn").show();
		$(this).parent().find(".zl-cancel-btn").show();
		$(this).hide();
		$(this).closest(".charger-group").find("input").addClass("editing");
		$(this).closest(".charger-group").find("input").removeAttr("readonly");
	});


	container.on("click","a.zl-save-btn,a.zl-cancel-btn",function(e){
		e.stopPropagation();
		e.preventDefault();
		$(this).parent().find(".zl-save-btn").hide();
		$(this).parent().find(".zl-cancel-btn").hide();
		$(this).parent().find(".zl-edit-btn").show();
		$(this).closest(".charger-group").find("input").removeClass("editing");
		$(this).closest(".charger-group").find("input").attr("readonly","readonly");
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

	$(".opening-date-confirmation .zl-datetimepicker").on("click",function(e){
		e.stopPropagation();
		e.preventDefault();
		$(this).find("input").datetimepicker("show");
	});

	container.on("click","a.confirm-btn",function(e){
		e.stopPropagation();
		e.preventDefault();
		container.find(".opening-date-confirmation").modal("show");
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

});