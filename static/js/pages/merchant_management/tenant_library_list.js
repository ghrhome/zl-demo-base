var tenantLibraryListView = (function(){
    var tenantLibraryListView = {};


    var page = $("#tenant-library-list");
    function bindPageEvents(){
        page.on("click"," .zl-table-block tbody tr",function(e){
            e.stopPropagation();
            e.preventDefault();
            //window.location = ibrandWeb_Path+"company/detail.htm?";
        });
    }

    tenantLibraryListView.init = function(){
        $("#preloader").fadeOut("fast");
        //bindPageEvents();
    };
    return tenantLibraryListView;

})();

$('.but-val').on('click',function(){
    var val = $(this).attr("data-value");
    var name = $(this).html();
    $(this).parent().parent().parent().find(".btn-default").html(name);
    $(this).parent().parent().parent().find(".btn-default").attr("select-val",val);
});

$('.but-val-mallId').on('click',function(){
    var daVal = $(this).attr("data-value");
   // var name = $(this).html();
   // $(this).parent().parent().parent().find(".btn-default").html(name);
    $("#mallIds").val(daVal);
    query();
});
//下拉点击

$('.but-val-mallId-companyTypeMap').on('click',function(){
    var daVal = $(this).attr("data-value");
    $("#type").val(daVal);
    console.log(daVal);
    query();
});


$('.but-val-mallId-companyTypeSubMap').on('click',function(){
    var daVal = $(this).attr("data-value");
    $("#typeSub").val(daVal);
    query();
});


$('.zl-dropdown-inline').on('click',function(){
    $(this).addClass("open");
});

function editView(id){
    window.location = ibrandWeb_Path+"company/detail.htm?id="+id;
}

$(function(){
    tenantLibraryListView.init();
});


/*##################################分页###############################################*/

$("#tenant-library-list").on("click", ".zl-paginate", function (e) {
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
    if (!isNumberss($(this).val()) || parseInt($(this).val()) == 0) {
        alert("请输入合法数字！");
        return false;
    }
    if(regeMatch($(this).val())){
        alert("请勿输入特殊字符！");
        return false;
    }
    if (parseInt($(this).val()) > parseInt($("#pages").val())) {
        alert("超过总页数！");
        $(this).val($("#pages").val());
        return false;
    }
});

$("#gotoPage").on("click", function (e) {
    if (!isNumberss($("#gotoPageNum").val()) || parseInt($("#gotoPageNum").val()) == 0) {
        alert("请输入合法数字！");
        return false;
    }
    if(regeMatch($("#gotoPageNum").val())){
        alert("请勿输入特殊字符！");
        return false;
    }
    if(regeMatch($("#gotoPageNum").val())){
        alert("请勿输入特殊字符！");
        return false;
    }
    $("#searchPageForm").find("input[name=page]").val($("#gotoPageNum").val());
    $("#searchPageForm").trigger("submit");
});

/*$("#searchPageForm").submit(function () {
    self.attr("action", ibrandWeb_Path + "company/index.htm");
});*/
/*##################################分页###############################################*/



//特殊字符校验 存在特殊字符返回true
function regeMatch(strs){
    var pattern = new RegExp("[~'!@#$%^&*()-+_=:]");
    if(strs != "" && strs != null){
        if(pattern.test(strs)){
            //alert("非法字符！");
            return true;
        }else{
            return false;
        }
    }
}

//数字校验
function isNumberss(num) {
    var pat = new RegExp('^[0-9]+$');
    return pat.test(num)
}

function isNumber(value) {
    return /^(\-?)[0-9]+.?[0-9]*$/.test($.trim(value))
}
function isInt(str) {
    var reg = /^(-|\+)?\d+$/;
    return reg.test(str);
}

//查询
function query() {
    $("#searchPageForm").find("input[name=page]").val(1);
	$('#searchPageForm').submit();
}

