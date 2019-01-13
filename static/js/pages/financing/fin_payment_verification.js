var baseView=(function($){
    var baseView={};


      function bindEvent(){
          var container=$("#fin_payment_verification");
          container.on("click","tbody tr",function(){
              var verificationId = $(this).attr("verificationId");
              // window.location="./fin_payment_verification_detail.html";
              window.location = financeWeb_Path + "finance/paymentVerification/detail.htm?verificationId=" + verificationId ;
          })


          $(".zl-dropdown").ysdropdown({
              callback:function(val,$elem){
                  if ($elem.data("id") == "verificationStatus"){

                      $("#searchPageForm").find("input[name=verificationStatus]").val(val);
                      // $("#searchPageForm").trigger("submit");
                  }

              }
          });


          $("#paginateForm").on("click", ".zl-paginate", function (e) {
            var pageType = $(this).attr("pageType"); // last、next
            var page = parseInt($("#page").val()); // 当前页
            var pages = parseInt($("#pages").val()); // 总页

            if (pageType == "last") {
                page -= 1;
            }
            else if (pageType == "next") {
                page += 1;
            }
            else {
                return;
            }

            if (page == 0 || page > pages) {
                return;
            }

            $("#searchPageForm").find("input[name=page]").val(page);
            $("#searchPageForm").trigger("submit");
        });

        $("#gotoPageNum").on("blur", function (e) {
            if (!isPositiveNum($(this).val()) || parseInt($(this).val()) == 0) {
                alert("请输入合法数字！");
                $(this).val($("#pages").val());
                return false;
            }
            if (parseInt($(this).val()) > parseInt($("#pages").val())) {
                alert("超过总页数！");
                $(this).val($("#pages").val());
                return false;
            }
        });

        $("#btn-save").on("click", function (e) {
            $("#searchPageForm").find("input[name=page]").val($("#gotoPageNum").val());
            $("#searchPageForm").trigger("submit");
        });

        $(".search-btn").on("click", function (_this) {
            // $("#searchPageForm").find("input[name=verificationStatus]").val($(_this).attr("key"));
            $("#searchPageForm").find("input[name=searchWordNoEncode]").val();
            $("#searchPageForm").find("input[name=page]").val(1);
            $("#searchPageForm").trigger("submit");
        });

          //回车搜索
          $('.zl-search input').bind('keypress', function (event) {
              if (event.keyCode == "13") {
                  $("#searchPageForm").submit();
              }
          })

        function isPositiveNum(s) {//是否为正整数
            var re = /^[0-9]*[0-9][0-9]*$/;
            return re.test(s)
        }

          $("#searchPageForm").submit(function () {
              var self = $(this);
              var searchWord = $("#searchPageForm").find("input[name=contNo]").val();
              $("#searchPageForm").find("input[name=searchWordNoEncode]").val(encodeURI(searchWord));
              self.attr("action", financeWeb_Path + "finance/paymentVerification/index.htm");
          });

    }

    baseView.dateRangeInit=function(){
        var _startTimestamp=0,_endTimestamp=0;
        var dateStart=$("#js-date-range").find("input.js-date-start").datetimepicker({
            format:"yyyy-mm-dd",
            todayBtn:"linked",
            startView:2,
            minView:2,
            autoclose: true,
            language:"zh-CN",
        }).on('changeDate', function(e){

            var _startDate=$(this).val();
            _startTimestamp=e.timeStamp;
            if(_startDate){
                dateEnd.datetimepicker("setStartDate",_startDate);
            }else{
                dateEnd.datetimepicker("setStartDate",null);
            }
            if(_endTimestamp<_startTimestamp){
                dateEnd.val("");
            }
            dateEnd.datetimepicker("update");
        });

        var dateEnd=$("#js-date-range").find("input.js-date-end").datetimepicker({
            format:"yyyy-mm-dd",
            todayBtn:"linked",
            startView:2,
            minView:2,
            autoclose: true,
            language:"zh-CN",
        }).on('changeDate', function(e){
            _endTimestamp=e.timeStamp;
        });

    };

    baseView.init=function(){
        $("#preloader").fadeOut("fast");
        baseView.dateRangeInit();
        bindEvent();
    };

    return baseView;

})(jQuery);


$(document).ready(function(){
    baseView.init();
    confirmAlert.init();
});

function searchMall(_this) {
    $("#searchPageForm").find("input[name=mallId]").val($(_this).attr("key"));
    $("#searchPageForm").find("input[name=page]").val(1);
    $("#searchPageForm").trigger("submit");
}

function searchCompany(_this) {
    $("#searchPageForm").find("input[name=companyId]").val($(_this).attr("key"));
    $("#searchPageForm").find("input[name=page]").val(1);
    $("#searchPageForm").trigger("submit");
}

function searchVerificationStatus(_this) {
    var verificationStatus = $(_this).attr("key");
    $("#verificationStatus").val(verificationStatus);
    $(".search-btn").click();
    // $("#searchPageForm").find("input[name=verificationStatus]").val($(_this).attr("key"));
    // $("#searchPageForm").find("input[name=page]").val(1);
    // $("#searchPageForm").trigger("submit");
}


