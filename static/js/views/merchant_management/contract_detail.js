$(function(){

    // 注册打印事件
    $(".zl-print").click(function(){
        //var screenWidth = (screen.availWidth - 10);
        //var screenHeight = (screen.availHeight-50);
        //var subWin = window.open("contract_reference.html", "newwindow", " width="+screenWidth+",height="+screenHeight+",  top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
        //
        //subWin.onload=function(){
        //    $(subWin.document).find("[input-edit]").css("background-color","#ffffff");
        //    setTimeout(function(){
        //        subWin.print();
        //    },100);
        //};


        $(".zl-print-dialog").modal();
    });



   /*patch by cheng 2018-03-27*/
    $("#js-review").on("click",function(e){
        e.preventDefault();
        //console.log(".....")
        location.href="./pages/investment_origin/lease_contract_review.html"
    })



    $("[role=dialog]").on("shown.bs.modal",function(e){
        e.preventDefault();
        e.stopPropagation();
        $("body").removeClass("modal-open");
    });


    $(".zl-annotation-tooltip-btn").click(function(e){
        e.preventDefault();
        e.stopPropagation();
        $(".zl-annotation-tooltip-dialog").modal({});
    });

    $(".zl-history-record-btn").click(function(e){
        e.preventDefault();
        e.stopPropagation();
        $(".zl-history-version-dialog").modal({});
    });

});

// 以下是合同文本的核心操作

window.onload= function(){
    /* ======================================== 页面渲染 ======================================== */
    //console.log(CKEDITOR.version)
    // CKEDITOR 初始化
    CKEDITOR.replace( 'editor',{
        enterMode : CKEDITOR.ENTER_BR,
        shiftEnterMode : CKEDITOR.ENTER_P,
        toolbar: [
            {name: "bold", items: ["Bold"]},
            {name: "image", items: ["Image"]},
            {name: "table", items: ["Table"]}
        ] // 设置toolbar
    });

    // iframe 初始化
    var container = $(".zl-contract-text-content>iframe").contents()[0]; // iframe container
    var fullSelectedRange = null;

    // 动态添加的标签
    $(container).find("body").append("<a anchor-trigger style='display:none;'>跳转</a>"); // 动态添加到 合同文本库 用于锚点跳转

    var style = "<style>" +
        "ins{background-color:yellow;cursor:pointer;}"+
        "ins *{background-color:yellow;cursor:pointer;}"+
        "ins.active{background-color:tomato}"+
        "ins.active *{background-color:tomato}"+
        "</style>";
    $(container).find("body").append(style);



    // 刷新 填空列表
    $("#zl-contract-detail .zl-contract-block-content .zl-contract-text .zl-contract-text-input-list ul").empty();
    $(container).find("[input-edit]").each(function(){
        var id = $(this).attr("id");
        var html = "<li href='"+id+"'><span>"+ $(this).html()+"</span><em class='edit'>编辑</em></li>";
        $("#zl-contract-detail .zl-contract-block-content .zl-contract-text .zl-contract-text-input-list ul").append(html);
    });

    // 刷新 批注原内容列表
    refreshContractTextAnnotationContent();

    /* ======================================== 事件绑定 ======================================== */
    // ======================================== 左边iframe区域事件 ========================================
    // 注册批注按钮事件
    $(".zl-annotation-btn").click(function(){
        // 获取批注内容
        if(container.getSelection().rangeCount==0){
            alert("请选择要批注的文本");
            return;
        }
        reSelect();

        var html = getSelectedHtml();
        if(html.length==0){
            alert("请选择要批注的文本");
            return;
        }

        if(html.indexOf("<ins")>-1||html.indexOf("</ins")>-1){
            alert("不能包含已修订项!");
            return;
        }

        if(html.indexOf("input-edit")>0){
            alert("不能包含填空项!");
            return;
        }

        $($("#editor").next().find("iframe").contents()[0]).find("body").html(html);
        $(".zl-annotation-dialog").modal("show");

    });

    // 注册 iframe 中 input-edit 点击事件
    $(container).on("click","[input-edit]",function(e){
        e.stopPropagation();
        e.preventDefault();
        $(container).find("[input-edit]").css("background-color","rgb(203, 203, 203)");
        $(container).find("ins").removeClass("active");
        $(this).css("background-color","#18b0e2");

        var id = $(this).attr("id");
        $("#zl-contract-detail .zl-contract-block-content .zl-contract-text .zl-contract-text-input-list ul li").removeClass("active");
        $("#zl-contract-detail .zl-contract-block-content .zl-contract-text .zl-contract-text-input-list ul li[href="+id+"]").addClass("active");



    });

    // 注册 iframe 中 input-edit 双击事件
    $(container).on("dblclick","[input-edit]",function(e){
        e.stopPropagation();
        e.preventDefault();
        var title = $(this).attr("title");
        var html = $(this).html();

        if(title!=null&&title.length>0){
            $(".zl-input-edit-dialog .modal-body label").html(title);
        }
        $(".zl-input-edit-dialog .modal-body input").val(html);

        var id = $(this).attr("id");
        $(".zl-input-edit-dialog").data("input-edit-id",id);
        $(".zl-input-edit-dialog").modal();
    });

    // 注册 iframe 中 ins 点击事件
    $(container).on("click","ins",function(e){
        e.preventDefault();
        e.stopPropagation();
        $(container).find("ins").removeClass("active");
        $(this).addClass("active");
        $(container).find("[input-edit]").css("background-color","rgb(203, 203, 203)");
    });

    // 注册 iframe 中 ins 双击事件
    $(container).on("dblclick","ins",function(e){
        e.stopPropagation();
        e.preventDefault();
        fullSelectedRange = container.createRange();
        fullSelectedRange.selectNode($(this)[0]);
        container.getSelection().removeAllRanges();
        container.getSelection().addRange(fullSelectedRange);
        var html = $(this).html();
        $($("#editor").next().find("iframe").contents()[0]).find("body").html(html);
        $(".zl-annotation-dialog").modal("show");
    });



    /* 批注弹出框中的相关事件 */
    /* 批注弹出框中的保存按钮事件 */
    $(".zl-annotation-dialog .zl-save").click(function(e){
        e.stopPropagation();
        e.preventDefault();

        if (container.getSelection) {
            if(container.getSelection().rangeCount==0){
                container.getSelection().addRange(fullSelectedRange);
            }
        }

        //var html = "<ins>"+CKEDITOR.instances["editor"].getData()+"</ins>";

        var ins = container.createElement("ins");
        ins.innerHTML=CKEDITOR.instances["editor"].getData();
        $(ins).css("text-decoration","none");

        var html = getSelectedHtml();
        console.log(html);
        var originalSource = null;

        if(html.indexOf("<ins")>-1){
            ins.setAttribute("originalSource",$(html).attr("originalSource"));
            ins.setAttribute("id",$(html).attr("id"));
        }else{
            ins.setAttribute("originalSource",html);
            var newId = new Date().getTime()+""+parseInt(Math.random()*1000);
            ins.setAttribute("id",newId);
        }


        var range = getSelectedRange();
        range.deleteContents();
        range.insertNode(ins);

        $(".zl-annotation-dialog").modal("hide");

        refreshContractTextAnnotationContent();
    });

    /* 批注弹出框中的消失的回调处理 */
    $(".zl-annotation-dialog").on("hidden.bs.modal",function(e){
        e.stopPropagation();
        e.preventDefault();

        if (container.getSelection) {
            if(container.getSelection().rangeCount==0){
                container.getSelection().addRange(fullSelectedRange);
            }
        }
    });

    /* 填空弹出框的相关事件 */
    /* 填空弹出框的确认事件 */
    $(".zl-input-edit-dialog .zl-ok").click(function(e){
        e.stopPropagation();
        e.preventDefault();

        var inputEditId = $(".zl-input-edit-dialog").data("input-edit-id");
        var val = $(".zl-input-edit-dialog .modal-body input").val();

        $(container).find("#"+inputEditId).html(val);
        $("#zl-contract-detail .zl-contract-block-content .zl-contract-text .zl-contract-text-input-list ul li[href="+inputEditId+"] span").html(val);

        $(".zl-input-edit-dialog").modal("hide");

    });
    /* 填空弹出框的删除事件 */
    $(".zl-input-edit-dialog .zl-delete").click(function(e){
        e.stopPropagation();
        e.preventDefault();

        if(confirm("删除不可恢复,你确认要删除当前添空信息吗？")){
            var inputEditId = $(".zl-input-edit-dialog").data("input-edit-id");
            $(container).find("#"+inputEditId).remove();
            $("#zl-contract-detail .zl-contract-block-content .zl-contract-text .zl-contract-text-input-list ul li[href="+inputEditId+"]").remove();
            $(".zl-input-edit-dialog").modal("hide");
        }
    });
    /* 填空弹出框的消失事件 */
    $(".zl-input-edit-dialog").on("hidden.bs.modal",function(e){
        e.stopPropagation();
        e.preventDefault();
        $(this).find(".modal-body label").html("请输入数据");
        $(this).find(".modal-body input").val("");
    });

    // ======================================== 右边iframe区域事件 ========================================
    // 填空按钮 点击事件
    $(".zl-contract-text-input-list-btn").click(function (e) {
        e.stopPropagation();
        e.preventDefault();

        $(".zl-contract-text-annotation-content-btn").removeClass("active");
        $(".zl-contract-text-input-list-btn").addClass("active");

        $(".zl-contract-text-annotation-content").hide();
        $(".zl-contract-text-input-list").show();
    });

    // 注册填空列表 编辑 点击事件
    $("#zl-contract-detail").on("click"," .zl-contract-block-content .zl-contract-text .zl-contract-text-input-list ul li em.edit",function(e){
        e.stopPropagation();
        e.preventDefault();
        var href = $(this).parent().attr("href");
        $("#zl-contract-detail .zl-contract-block-content .zl-contract-text .zl-contract-text-input-list ul li[href="+href+"]").click();
        $("#zl-contract-detail .zl-contract-block-content .zl-contract-text .zl-contract-text-input-list ul li[href="+href+"]").dblclick();
    });

    // 注册填空列表 点击事件
    $("#zl-contract-detail").on("click"," .zl-contract-block-content .zl-contract-text .zl-contract-text-input-list ul li",function(e){
        e.stopPropagation();
        e.preventDefault();
        $("#zl-contract-detail .zl-contract-block-content .zl-contract-text .zl-contract-text-input-list ul li").removeClass("active");
        $(this).addClass("active");

        var href = $(this).attr("href");
        $(container).find("[anchor-trigger]").attr("href","#"+href);
        $(container).find("[anchor-trigger]")[0].click();

        $(container).find("[input-edit]").css("background-color","rgb(203, 203, 203)");
        $(container).find("[input-edit][id="+href+"]").css("background-color","#18b0e2");
        $(container).find("ins").removeClass("active");
    });

    // 注册填空列表 双击事件
    $("#zl-contract-detail").on("dblclick"," .zl-contract-block-content .zl-contract-text .zl-contract-text-input-list ul li",function(e){
        e.stopPropagation();
        e.preventDefault();
        var href = $(this).attr("href");
        $(container).find("#"+href).dblclick();
    });

    // 注册批注原内容按钮 点击事件
    $(".zl-contract-text-annotation-content-btn").click(function (e) {
        e.stopPropagation();
        e.preventDefault();

        $(".zl-contract-text-annotation-content-btn").addClass("active");
        $(".zl-contract-text-input-list-btn").removeClass("active");

        $(".zl-contract-text-annotation-content").show();
        $(".zl-contract-text-input-list").hide();
    });

    // 注册批注原内容列表 编辑 点击事件
    $("#zl-contract-detail").on("click"," .zl-contract-block-content .zl-contract-text .zl-contract-text-annotation-content ul li em.edit",function(e){
        e.stopPropagation();
        e.preventDefault();
        var href = $(this).parent().parent().attr("href");
        $("#zl-contract-detail .zl-contract-block-content .zl-contract-text .zl-contract-text-annotation-content ul li[href="+href+"]").click();
        $("#zl-contract-detail .zl-contract-block-content .zl-contract-text .zl-contract-text-annotation-content ul li[href="+href+"]").dblclick();
    });

    // 注册批注原内容列表 删除 点击事件
    $("#zl-contract-detail").on("click"," .zl-contract-block-content .zl-contract-text .zl-contract-text-annotation-content ul li em.delete",function(e){
        e.stopPropagation();
        e.preventDefault();
        var href = $(this).parent().parent().attr("href");

        var originalSource = $(container).find("ins[id="+href+"]").attr("originalSource");
        $(container).find("ins[id="+href+"]")[0].outerHTML=originalSource;
        $(this).parent().parent().remove();
    });

    // 注册批注原内容列表 点击事件
    $("#zl-contract-detail").on("click"," .zl-contract-block-content .zl-contract-text .zl-contract-text-annotation-content ul li",function(e){
        e.stopPropagation();
        e.preventDefault();
        $("#zl-contract-detail .zl-contract-block-content .zl-contract-text .zl-contract-text-annotation-content ul li").removeClass("active");
        $(this).addClass("active");

        var href = $(this).attr("href");
        $(container).find("[anchor-trigger]").attr("href","#"+href);
        $(container).find("[anchor-trigger]")[0].click();

        $(container).find("ins").removeClass("active");
        $(container).find("ins[id="+href+"]").addClass("active");
        $(container).find("[input-edit]").css("background-color","rgb(203, 203, 203)");
        //$(container).find("ins").css("background-color","yellow");
        //$(container).find("ins[id="+href+"]").css("background-color","tomato");
    });

    $("#zl-contract-detail").on("dblclick"," .zl-contract-block-content .zl-contract-text .zl-contract-text-annotation-content ul li",function(e){
        e.stopPropagation();
        e.preventDefault();
        var href = $(this).attr("href");
        $(container).find("#"+href).dblclick();
    });

    /* ======================================== common methods ======================================== */
    // 刷新 批注原内容列表
    function refreshContractTextAnnotationContent(){

        var annotationContent = $("#zl-contract-detail .zl-contract-block-content .zl-contract-text .zl-contract-text-annotation-content ul");
        if(annotationContent.children().length==$(container).find("ins").length){
            return;
        }

        annotationContent.empty();
        $(container).find("ins").each(function(){
            var originalSource = $(this).attr("originalSource");
            var id = $(this).attr("id");

            var html =  "<li href='"+id+"'>" +
                "<div>"+
                "<span>郑某某哦 11-03</span>"+
                "<em class='delete'>删除</em>"+
                "<em class='edit'>编辑</em>"+
                "</div>"+
                "<div>"+
                originalSource+
                "</div>"+
                "</li>";
            annotationContent.append(html);
        });
    }






    /* ======================================== below is the related selection method ======================================== */
    function getSelectedHtml() {
        var selectedHtml = "";
        var documentFragment = null;
        try {
            if (container.getSelection) {
                documentFragment = container.getSelection().getRangeAt(0).cloneContents();
            } else if (container.selection) {
                documentFragment = container.selection.createRange().HtmlText;
            }

            for (var i = 0; i < documentFragment.childNodes.length; i++) {
                var childNode = documentFragment.childNodes[i];
                if (childNode.nodeType == 3) { // Text 节点
                    selectedHtml += childNode.nodeValue;
                } else {
                    var nodeHtml = childNode.outerHTML;
                    selectedHtml += nodeHtml;
                }

            }

        } catch (err) {

        }

        return selectedHtml;
    }

    function reSelect() {
        var selectedRange = getSelectedRange();
        fullSelectedRange = getFullSelectedRange(selectedRange);

        if (container.getSelection) {
            container.getSelection().removeAllRanges();
            container.getSelection().addRange(fullSelectedRange);
        } else if (container.selection) {
            container.selection.removeAllRanges();
            container.selection.addRange(fullSelectedRange);
        }
    }

    function getSelectedRange() {
        if (container.getSelection) {
            return container.getSelection().getRangeAt(0);
        } else if (container.selection) {
            return container.selection.createRange();
        }
    }

    function containNode(parentNode, childNode) {
        var nodeList = parentNode.childNodes;
        for (var i = 0; i < nodeList.length; i++) {
            if (childNode == nodeList[i]) {
                return true;
            }
        }
        return false;
    }

    function getLatestAncestorNode(commonAncestorContainer, node) {
        var hasContainer = containNode(commonAncestorContainer, node);
        if (hasContainer) {
            return node;
        }

        if(isSpecialTag(node.parentNode)){
            return node.parentNode;
        }

        return getLatestAncestorNode(commonAncestorContainer, node.parentNode);
    }

    function getFullSelectedRange(selectedRange) {
        console.log(selectedRange);
        var selectedStartContainer = selectedRange.startContainer;
        var selectedStartOffset = selectedRange.startOffset;
        var selectedEndContainer = selectedRange.endContainer;
        var selectedEndOffset = selectedRange.endOffset;
        var commonAncestorContainer = selectedRange.commonAncestorContainer;
        if (selectedStartContainer == selectedEndContainer) {
            return selectedRange;
        }

        var newRange = container.createRange();

        // 如果最近祖先commonAncestorContainer是特殊节点，直接使用最新祖先节点
        if (isSpecialTag(commonAncestorContainer)) {
            newRange.selectNode(commonAncestorContainer);
            return newRange;
        }

        if (selectedStartContainer != commonAncestorContainer) {
            var ancestorContainer = getLatestAncestorNode(commonAncestorContainer, selectedStartContainer);
            ancestorContainer = getFullTag(ancestorContainer);

            if (isSpecialTag(ancestorContainer)) {
                newRange.setStartBefore(ancestorContainer);
            } else {
                newRange.setStart(selectedStartContainer, selectedStartOffset);
            }
        } else {
            newRange.setStart(selectedStartContainer, selectedStartOffset);
        }

        if (selectedEndContainer != commonAncestorContainer) {
            var ancestorContainer = getLatestAncestorNode(commonAncestorContainer, selectedEndContainer);
            ancestorContainer = getFullTag(ancestorContainer);
            if (isSpecialTag(ancestorContainer)) {
                newRange.setEndAfter(ancestorContainer);
            } else {
                newRange.setEnd(selectedEndContainer, selectedEndOffset);
            }
        } else {
            newRange.setEnd(selectedEndContainer, selectedEndOffset);
        }
        return newRange;
    }

    function isSpecialTag(node) {
        if (node.nodeName == "TABLE") {
            return true;
        }
        if (node.nodeName == "UL") {
            return true;
        }
        return false;
    }

    function getFullTag(ancestorContainer) {
        if (ancestorContainer.nodeName == "TD" || ancestorContainer.nodeName == "TH") {
            if (ancestorContainer.parentNode.parentNode.nodeName == "TABLE") {
                return ancestorContainer.parentNode.parentNode;
            }

            if (ancestorContainer.parentNode.parentNode.parentNode.nodeName == "TABLE") {
                return ancestorContainer.parentNode.parentNode.parentNode;
            }
        }

        if(ancestorContainer.nodeName == "TR"){
            if (ancestorContainer.parentNode.nodeName == "TABLE") {
                return ancestorContainer.parentNode;
            }

            if (ancestorContainer.parentNode.parentNode.nodeName == "TABLE") {
                return ancestorContainer.parentNode.parentNode;
            }
        }
        return ancestorContainer;
    }

};


$(".zl-contract-template-btn").click(function(e){
    e.stopPropagation();
    e.preventDefault();
    $(".zl-contract-template-dialog").modal();
});




$(".static-tree").click(function(e){
    e.stopPropagation();
    e.preventDefault();
    $(this).toggleClass("open");
});

$(".static-tree li").click(function(e){
    e.stopPropagation();
    e.preventDefault();
    //$(this).closest(".static-tree").find("ul li").removeClass("checked");
    $(".static-tree li").removeClass("checked");
    $(this).addClass("checked");

    var title = $(this).attr("title");

    $(".template-container-right>div.template-bar span.selected-tempate-name").html(title);

    $(".zl-contract-template-dialog iframe").show();

    $(".zl-contract-template-dialog [name=empty-text]").hide();

    $(".template-container").animate({"padding-left":"0px"},"fast");
    $(".template-container-left").animate({"margin-left":"-300px"},"fast",function(){
        $(".template-bar a").show();
    });

    var dataHref = $(this).attr("data-href");
    if(dataHref==null){
        dataHref = "reference/contract_template_ref.html";
    }
    $(".zl-contract-template-dialog iframe").attr("src",dataHref);
});

$(".zl-contract-template-dialog .template-bar a").click(function(e){
    e.stopPropagation();
    e.preventDefault();
    $(".template-container").animate({"padding-left":"300px"},"fast");
    $(".template-container-left").animate({"margin-left":"0"},"fast",function(){
        $(".template-bar a").hide();
    });



});


$(document).ready(function(){
    $("#preloader").fadeOut();
})