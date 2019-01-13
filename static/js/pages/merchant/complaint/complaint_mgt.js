
$(function(){
    $('.zl-img-wrapper').magnificPopup({
        delegate: '.zl-thumbnail',
        type: 'image'
    });
})

$(document).ready(function(){

    initializeFileUpload();

    $(".zl-datetime-range").find("input").datetimepicker({
        format:"yyyy-mm-dd",
        todayBtn:"linked",
        startView:2,
        minView:2,
        autoclose: true,
        language:"zh-CN",
        clearBtn:true,
    }).on('changeDate', function(e){
        $("form").find("input[name=page]").val(1);
        $("form").find("input[name=closeDateBegin]").val($(".js-date-start").val());
        $("form").find("input[name=closeDateEnd]").val($(".js-date-end").val());
        // $("form").submit();
    });

    //查询
    $("#js-search-main").on("click",function () {
        $("#search").submit();
    });

    //翻页
    $(".zl-paginate").on("click", function (e) {
        var pageType = $(this).attr("pageType"); // last、next
        var page = parseInt($("#page").val()); // 当前页
        var pages = parseInt($("#pages").val()); // 总页
        var itemsPerPage = parseInt($("#itemsPerPage").val()); // 总页

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
        $("#search").find("input[name=page]").val(page);
        $("#search").find("input[name=itemsPerPage]").val(itemsPerPage);
        // $("#page").val(page);
        $("#search").submit();
    });
    //翻页
    $("#gotoPage").on("click", function (e) {
        var page = $("#gotoPageNum").val();
        var itemsPerPage = $("#itemsPerPage").val();
        if (!isPositiveNum(page) || parseInt(page) == 0) {
            alert("请输入合法数字！");
            return false;
        }
        if (parseInt(page) > parseInt($("#pages").val())) {
            page = $("#pages").val();
        }
        $("#search").find("input[name=page]").val(page);
        $("#search").find("input[name=itemsPerPage]").val(itemsPerPage);
        $("#search").submit();
    });

    //下拉框初始化
    $(".zl-dropdown").ysdropdown({
        callback:function(val, $elem){
            if ($elem.data("id") == "page-limit"){
                $("#search").find("input[name=page]").val(1);
                $("#search").find("input[name=itemsPerPage]").val(val);
            }
            $("#search").submit();
        }
    });

    $(".zl-dropdown-inline").ysdropdown({
        callback:function(val, $elem){

        }
    });

    //转交执行
    $("#js-deliver-button").on("click",function () {
        deliverSubject();
    });




})

/**
 * 初始化附件上传
 */
function initializeFileUpload(){
    var ran1 = "";
    var imgkkAll = "";
    var ids = "";     //附件id
    var urls = "";     //附件路径(删除)
    var addUrls = "";    //附件路径(添加)
    var targetIds = "";     //业务编号
    var isshanchu = false;
    var isAdd = false;
    $("#mya").click(function () {
        imgkkAll = "";
        isshanchu = true;
        isAdd = true;
    });

    var iszj = false;
    $(".fileinput-button").each(function () {
        $(this).ysSimpleUploadFile({
            changeCallback: function (file) {
                // showLoading(); // 显示loading
                var fileReader = new FileReader();
                $(this).parent().height(136);
                var that = this;
                fileReader.onload = function () {
                    //console.log($(that).parent().html());
                    //console.log($(that).parent().find(".zl-thumbnail-wrapper a").size());
                    if ($(that).parent().find(".zl-thumbnail-wrapper a").length >= 6) {
                        alert("最多上传6张图片");
                        return;
                    }
                    $(that).next().css("display", "block");
                    imgkkAll = $(that).attr("al");
                    compressImage(1000, 1000, this.result, null, function (dataUrl) {

                        var html = "<li><div class=\"zl-thumbnail-wrapper\"><em class='zl-icon-btn zl-icon-btn-del'></></em> <a  class='zl-thumbnail' style='background-image:url(" + dataUrl + ")'><em></em></a></div></li>";
                        $(that).next().children().append(html);
                        // alert($(that).next().children().html())
                        var formData = new FormData();
                        formData.append("action", "1002");
                        formData.append("single", 1);
                        // formData.append("category", "FILE_ENROLMENT_DIVERSE");
                        formData.append("category", "FILE_MERADVISE_COMPLAINT");
                        formData.append("targetId", "");
                        formData.append('file', file);

                        jQuery.ajax({
                            url: fileWeb_Path + '/sdk/platform/file',
                            type: 'POST',
                            data: formData,
                            dataType: 'json',
                            async: true,
                            cache: false,
                            contentType: false,
                            processData: false,
                            success: function (response) {
                                console.log("-----------------------------------"+JSON.stringify(response));
                                if (response.success) {
                                    targetIds = response.data.targetId;
                                    ids = response.data.id;
                                    var myurls = response.data.path;
                                    if (isshanchu == false && iszj == false) {
                                        urls = "," + imgkkAll;
                                        iszj = true;
                                    }
                                    if (isAdd) {
                                        addUrls += "," + myurls;
                                    } else if (isAdd == false) {
                                        urls += "," + myurls;
                                    }
                                    $(that).next().find("li:last-child a").attr("data-image", myurls);
                                    $(that).next().find("li:last-child a").attr("href", myurls);
                                    $('.zl-img-wrapper').magnificPopup({
                                        delegate: '.zl-thumbnail',
                                        type: 'image'
                                    });

                                } else {
                                    // alert(response.message);
                                    hideLoading(); // 隐藏 loading
                                }
                            },
                            error: function (data) {
                                console.log("data:"+JSON.stringify(data));
                                alert("操作失败，请重试！");
                                // hideLoading(); // 隐藏 loading
                            }
                        })
                    });
                };
                fileReader.readAsDataURL(file);
            }
        });
    });


    var isUp = false;
    var container = $("#complaint-mgt");
    container.on("click", ".zl-thumbnail-wrapper em", function (e) {
        e.stopPropagation();
        e.preventDefault();
        var imgkk = "," + $(this).parents().closest("li").find("a").attr("data-image");
        $(this).closest("li").remove();
        // var imgkk = "," + $(this).closest("a").attr("data-image");
        if (isAdd) {
            addUrls = addUrls.replace(imgkk, "");
            var last = addUrls.charAt(addUrls.length - 1);
            // var fiest=addUrls.charAt(0);
            if (last == ",") {
                addUrls = addUrls + ",";
                addUrls = addUrls.replace(",,", "");
            }
            // if(fiest==","){
            //     addUrls=","+addUrls;
            //     addUrls=addUrls.replace(",,","");
            // }
        } else {
            if (isUp) {
                imgkkAll = urls;
            } else {
                imgkkAll = "," + $(this).parents().closest("li").find("a").attr("al");
            }
            imgkkAll = imgkkAll.replace(imgkk, "");
            var last = imgkkAll.charAt(imgkkAll.length - 1);
            if (last == ",") {
                imgkkAll = imgkkAll + ",";
                imgkkAll = imgkkAll.replace(",,", "");
            }
            var fiest = imgkkAll.charAt(0);
            var er = imgkkAll.charAt(1);
            if (fiest == "," && er != ",") {
                imgkkAll = "," + imgkkAll;
                imgkkAll = imgkkAll.replace(",,", "");
            } else {
                imgkkAll = imgkkAll.replace(",,", "");
            }
            if (imgkkAll != "") {
                urls = "," + imgkkAll;
            } else {
                urls = "";
            }
            isshanchu = true;
            isUp = true;
        }

    });

}

/**
 * 详情查看
 * @param adviseId
 */
function getDetail(adviseId){
    console.log("adviseId:"+adviseId);
    $("#collapse1_"+adviseId).collapse('toggle');

    //初始化星星
    initializeStar(adviseId);

    $.ajax({
        url: merchantWeb_Path+"complaint/detial.htm",
        data: {"adviseId":adviseId},
        type: "post",
        dataType: "json",
        error: function (request) {
            // pageView.loadingHide();
            alert("系统异常");
        },
        success: function (response) {
            // pageView.loadingHide();
            if(response && response.code == "0"){
                //投诉附件
                var adviseImgHtml = '';
                var adviseImgs =response.data.adviseImgs;
                for(var i=0; i<adviseImgs.length ;i++){
                    var path = adviseImgs[i].path;
                    var liStr = '<li><div class="zl-thumbnail-wrapper">';
                    liStr += '<a class="zl-thumbnail" style="background-image:url( '+path+' )" href="'+path+'" data-image="'+path+'"><em></em></a></div></li>';
                    adviseImgHtml += liStr;
                }
                $("#advise_img_"+adviseId).html(adviseImgHtml);

                //回复附件拼装
                var replyImgHtml = '';
                var replyImgs =response.data.replyImgs;
                for(var i=0; i<replyImgs.length ;i++){
                    var path = replyImgs[i].path;
                    var liStr = '<li><div class="zl-thumbnail-wrapper">';
                    liStr += '<a class="zl-thumbnail" style="background-image:url( '+path+' )" href="'+path+'" data-image="'+path+'"><em></em></a></div></li>';
                    replyImgHtml += liStr;
                }
                $("#reply_img_"+adviseId).html(replyImgHtml);

            }else{
                // alert("查询失败");
            }
        }
    });
}

/**
 * 投诉处理
 */
function addReply(adviseId,serviceId){

    var content = $("#replyContent_"+adviseId).val();
    if(content == null || content == "" || content == undefined){
        alert("请填写处理内容");
        return;
    }

    //附件
    var imgs = "";
    $("#reply_img_"+adviseId).find("a").each(function(n,i){
        if($(this).attr("data-image") != undefined){
            if($("#reply_img_"+adviseId).find("a").length == i){
                imgs += $(this).attr("data-image") ;
            }else{
                imgs += $(this).attr("data-image")+"," ;
            }
        }
    })
    // if(confirm("确认要受理吗？")){
    confirm("确认要受理吗？","","",function(type){
        if (type == "dismiss") return;
        $.ajax({
            url: merchantWeb_Path+"complaint/addReply.htm",
            data: {"adviseId":adviseId,"serviceId":serviceId,"replyContent":content, "imgs":imgs},
            type: "post",
            dataType: "json",
            error: function (request) {
                // pageView.loadingHide();
                alert("系统异常");
            },
            success: function (response) {
                $("#search").submit();
            }
        });
    })
}

//转交modal
function showDeliverModal(id,mallId) {
    $("#adviseId").val(id);
    $("#mallId").val(mallId);
    $("#deliverSubject").modal("show");
}

/**
 * 转交
 */
function deliverSubject() {
    var adviseId = $("#adviseId").val();

    var mallId = $("#mallId").val();
    if(mallId==null || mallId==""){
        alter("项目id不能为空");
        return;
    }
    var subject = $("#subject").val();
    if(subject==null || subject==""){
        alter("请选择要转交的类型");
        return;
    }


    // if(confirm("确认要转交吗？")){
    confirm("确认要转交吗？","","",function(type){
        if (type == "dismiss") return;
        $.ajax({
            url: merchantWeb_Path+"complaint/deliver.htm",
            data: {"adviseId":adviseId,"subject":subject,"mallId":mallId},
            type: "post",
            dataType: "json",
            error: function (request) {
                // pageView.loadingHide();
                alert("系统异常");
            },
            success: function (response) {
                if(response.code == 1){
                    alter(response.msg);
                }else{
                    $("#search").submit();
                }
            }
        });
    })

}

function initializeStar(adviseId) {
    var respond = $("#respond_"+adviseId).val();
    var quality = $("#quality_"+adviseId).val();
    var attitude = $("#attitude_"+adviseId).val();
    var score = $("#score_"+adviseId).val();
    $('#star_'+adviseId).find('.respond').children('span').each(function(index){
        if (index < respond) {
            $(this).addClass('checked');
        }
    });
    $('#star_'+adviseId).find('.quality').children('span').each(function(index){
        if (index < quality) {
            $(this).addClass('checked');
        }
    });
    $('#star_'+adviseId).find('.attitude').children('span').each(function(index){
        if (index < attitude) {
            $(this).addClass('checked');
        }
    });
    if (score == '1') {
        $('#score_span_'+adviseId).addClass('notWellx');
    } else if (score == '3') {
        $('#score_span_'+adviseId).addClass('wellx');
    } else if (score == '5') {
        $('#score_span_'+adviseId).addClass('veryWellx');
    }
}