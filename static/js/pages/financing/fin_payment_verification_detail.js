var baseView=(function($){
    var baseView={};
    var flag=true;


    baseView.init=function(){
        var container=$("#fin_payment_verification_detail");
        $("#preloader").fadeOut("fast");
        console.log("-------------状态"+$("#verificationStatus").val())

        checkVerification($("#verificationStatus").val());

        var ys_main_swiper_2 = new Swiper('#zl-floor-main-table-2', {
	        scrollbar: '.swiper-scrollbar-b',
	        slidesPerView: 'auto',
	        freeMode: true,
	        scrollbarHide:false
    	});
    	var ys_main_swiper = new Swiper('#zl-floor-main-table', {
	        scrollbar: '.swiper-scrollbar-a',
	        slidesPerView: 'auto',
	        freeMode: true,
	        scrollbarHide:false
    	});

        $(".cancel-btn").on("click", function (e) {
            window.history.back();
        });

        container.find(".zl-dropdown-inline").ysdropdown({
            callback: function (val, $elem) {
                if ($elem.data("id") == "payOther") {
                    $("saveForm").find("input[name=payOther]").val(val);
                }
            }
        })

        // $(".payOtherStatus li a").on("click", function (e) {
        //     $(this).parents("tr").find("input[name=payOther]").val($(this).attr("data-value"));
        // });

        $(".save-btn").on("click", function (e) {
            if (!validateForm($('#saveForm'))) {
                return false;
            }
            confirm("确认执行保存？","","",function(type){
                if(type=="dismiss"){
                    return;
                }
                $.ajax({
                    // cache: true,
                    type: "POST",
                    url: financeWeb_Path + "finance/paymentVerification/save.htm",
                    dataType:"json",
                    data: $('#saveForm').serialize(),

                    error: function (request) {
                        alert("系统异常");
                    }, success: function (response) {
                        if(response.code == 0){
                            flag=false;
                            alert("保存成功")
                            // alert(obj.msg,"","",function(){
                            //     // loading();
                            //     window.location = financeWeb_Path + "finance/paymentVerification/index.htm" ;
                            // })
                        }else{
                            alert(response.msg);
                        }
                    }
                });
            });
        });

        $(".check-btn").on("click", function (e) {
            // if (!validateForm($('#saveForm'))) {
            //     return false;
            // }
            if(flag){
                isChanged(flag);
                return;
            }
            var verificationId = parseInt($("#verificationId").val());
            confirm("确认执行审核？","","",function(type){
                if(type=="dismiss"){
                    return;
                }
                baseView.loadingShow();
                $.ajax({
                    // cache: true,
                    type: "POST",
                    url: financeWeb_Path + "finance/paymentVerification/verification.htm",
                    data: {verificationId:verificationId},
                    // async: false,
                    dataType:"json",
                    error: function (request) {
                        alert("系统异常","","");
                        baseView.loadingHide();
                    }, success: function (response) {
                        if(response.code == 0){
                            // alert("保存成功")
                            alert(response.msg,"","",function(){
                                window.location = financeWeb_Path + "finance/paymentVerification/index.htm" ;
                            })
                        }else{
                            alert(response.msg);
                        }
                        baseView.loadingHide();

                    }
                });
            });
            // alert("核销")
        });
        $(".uncheck-btn").on("click", function (e) {
            var verificationId = parseInt($("#verificationId").val());
            confirm("确认执行反审核？","","",function(type){
                if(type=="dismiss"){
                    return;
                }
                // loading();
                baseView.loadingShow();
                $.ajax({
                    cache: true,
                    type: "POST",
                    url: financeWeb_Path + "finance/paymentVerification/reverseVerification.htm",
                    data: {verificationId:verificationId},
                    async: false,
                    dataType:"json",
                    error: function (request) {
                        alert("系统异常","","");
                        baseView.loadingHide();
                    }, success: function (response) {
                        if(response.code == 0){
                            // alert("保存成功")
                            alert("成功","","",function(){
                                window.location = financeWeb_Path + "finance/paymentVerification/index.htm" ;
                            })
                        }else{
                            alert(response.msg);
                        }
                        baseView.loadingHide();
                    }
                });
            });
            // alert("核销")
        });


        baseView.loadingShow=function(){
            $(".zl-loading").fadeIn();
        };

        baseView.loadingHide=function(){
            $(".zl-loading").fadeOut();
        }


    };

    return baseView;

})(jQuery);


$(document).ready(function(){
    baseView.init();
    // baseView.dropdownInit();
    confirmAlert.init();
});

function checkVerification(param){
    if(param == 2){
        $(".payOther-btn").attr("disabled", true);
        $(".remark-input").attr("readonly", true);
        $(".uncheck-btn").show();
    }
    if(param == 1){
        $(".check-btn").show();
        $(".save-btn").show();
    }
    if(param == 4 || param == 0){
        $(".payOther-btn").attr("disabled", true);
        $(".remark-input").attr("readonly", true);
    }

}

function validateForm () {
    var flag = true;
    $("#zl-floor-main-table").find("input[name^=itemList][name$=payOther]").each(function(i) {
        if (!$(this).val() || $(this).val()=='') {
            flag = false;
            alert("是否代付不能为空");
            return false;
        }

    });

    return flag;
}

function isChanged(flag){
    alert("请先执行保存");
}

