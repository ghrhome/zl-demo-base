$(document).on("click",".annotationBtn",function(){
    // 获取批注内容
    if(container.getSelection().rangeCount==0){
        alert("请选择要批注的文本");
        return;
    }
    reSelect();
    var html = getSelectedHtml();
    if(html.indexOf("<ins>")>0){
        alert("不能包含已修订项!");
        return;
    }
    //$(".annotationTarget").html(html);
    //console.log(html);
    //console.log("the html content is below");
    //CKEDITOR.instances["editor"].insertHtml(html);
    $($("#editor").next().find("iframe").contents()[0]).find("body").html(html);
    $(".zl-annotation-dialog").modal("show");

});

$(document).on("click",".zl-annotation-dialog .zl-save",function(e){
    e.stopPropagation();
    e.preventDefault();

    var html = "<ins >"+CKEDITOR.instances["editor"].getData()+"</ins>";
    var range = getSelectedRange();
    range.deleteContents();
    //console.log(html);
    range.insertNode($(html)[0]);
    $(".zl-annotation-dialog").modal("hide");
});

$(document).on("click",".saveBtn",function(){
    // 获取批注内容
    var html = "<ins >"+$(".annotationTarget").html()+"</ins>";
    //var html = $(".annotationTarget").html();

    var range = getSelectedRange();
    range.deleteContents();
    range.insertNode($(html)[0]);
});

// window.onload=function(){$(".zl-editor>iframe").contents()[0].designMode="on";};

var container = $(".zl-editor>iframe").contents()[0]; // iframe container
window.onload = function(){
    container = $(".zl-editor>iframe").contents()[0]; // iframe container
    $(container).on("click","ins",function(e){
        e.preventDefault();
        e.stopPropagation();
        //console.log($(this).html());
    });
};


function getSelectedHtml(){
    var selectedHtml = "";
    var documentFragment = null;
    try{
        if(container.getSelection){
            documentFragment =  container.getSelection().getRangeAt(0).cloneContents();
        }else if(container.selection){
            documentFragment =  container.selection.createRange().HtmlText;
        }

        for(var i=0;i<documentFragment.childNodes.length;i++){
            var childNode = documentFragment.childNodes[i];
            if(childNode.nodeType==3){ // Text 节点
                selectedHtml+=childNode.nodeValue;
            }else{
                var nodeHtml = childNode.outerHTML;
                selectedHtml+=nodeHtml;
            }

        }

    }catch(err){

    }

    return selectedHtml;
}

function reSelect(){
   //try{
       var selectedRange = getSelectedRange();
       var fullSelectedRange =  getFullSelectedRange(selectedRange);

       if(container.getSelection){
           container.getSelection().removeAllRanges();
           container.getSelection().addRange(fullSelectedRange);
       }else if(container.selection){
           container.selection.removeAllRanges();
           container.selection.addRange(fullSelectedRange);
       }
   //}catch(err){
   //    console.log(err);
   //}
}

function getSelectedRange(){
    //try{
        if(container.getSelection){
            return container.getSelection().getRangeAt(0);
        }else if(container.selection){
            return container.selection.createRange();
        }
    //}catch(error){
    //    console.log(error);
    //}
}

function containNode(parentNode,childNode){
    var nodeList = parentNode.childNodes;
    for(var i=0;i<nodeList.length;i++){
        if(childNode==nodeList[i]){
            return true;
        }
    }
    return false;
}

function getLatestAncestorNode(commonAncestorContainer,node){
    var hasContainer = containNode(commonAncestorContainer,node);
    if(hasContainer){
        return node;
    }
    return getLatestAncestorNode(commonAncestorContainer,node.parentNode);
}

function getFullSelectedRange(selectedRange){
    var selectedStartContainer = selectedRange.startContainer;
    var selectedStartOffset = selectedRange.startOffset;
    var selectedEndContainer = selectedRange.endContainer;
    var selectedEndOffset = selectedRange.endOffset;
    var commonAncestorContainer = selectedRange.commonAncestorContainer;
    if(selectedStartContainer==selectedEndContainer){
        return selectedRange;
    }

    var newRange = container.createRange();
    //console.log("isSpecialTag one ....");
    if(isSpecialTag(commonAncestorContainer)){
        newRange.selectNode(commonAncestorContainer);
        return newRange;
    }

    if(selectedStartContainer!=commonAncestorContainer){
        var ancestorContainer = getLatestAncestorNode(commonAncestorContainer,selectedStartContainer);
        ancestorContainer = getFullTag(ancestorContainer);
        //console.log("isSpecialTag two ....");
        //console.log(ancestorContainer);
        //console.log("isSpecialTag two end ....");
        if(isSpecialTag(ancestorContainer)){
            newRange.setStartBefore(ancestorContainer);
        }else{
            newRange.setStart(selectedStartContainer,selectedStartOffset);
        }
    }else{
        newRange.setStart(selectedStartContainer,selectedStartOffset);
    }

    if(selectedEndContainer!=commonAncestorContainer){
        var ancestorContainer = getLatestAncestorNode(commonAncestorContainer,selectedEndContainer);
        ancestorContainer = getFullTag(ancestorContainer);
        //console.log("isSpecialTag three ....");
        //console.log(ancestorContainer);
        //console.log("isSpecialTag three end ....");
        if(isSpecialTag(ancestorContainer)){
            newRange.setEndAfter(ancestorContainer);
        }else{
            newRange.setEnd(selectedEndContainer,selectedEndOffset);
        }
    }else{
        newRange.setEnd(selectedEndContainer,selectedEndOffset);
    }
    return newRange;
}



function isSpecialTag(node){
    if(node.nodeName=="TABLE"){
       return true;
    }
    if(node.nodeName=="UL"){
        return true;
    }
    return false;
}

function getFullTag(ancestorContainer){
    if(ancestorContainer.nodeName=="TD"||ancestorContainer.nodeName=="TH"){
        if(ancestorContainer.parentNode.parentNode.nodeName=="TABLE"){
            return ancestorContainer.parentNode.parentNode;
        }

        if(ancestorContainer.parentNode.parentNode.parentNode.nodeName=="TABLE"){
            return ancestorContainer.parentNode.parentNode.parentNode;
        }
    }
    return ancestorContainer;
}







