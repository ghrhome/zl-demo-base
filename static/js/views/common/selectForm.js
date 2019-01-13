/**
 * Created by whobird on 2018/4/13.
 */
var selectForm=(function($,selectForm){
    var sf=selectForm;

    var selectCallback=undefined;
    var itemTemp;
    var dataOri={};
    var treeData=[];

    var formSelectMod;
    var $treeElem;
    var selectedForms={};

    var autoSearchArr=[]


    function _insertTemp(){
        $.get("../common/formSelectModal.html",function(tmpl){
            $("body").append(tmpl);
            var _itemTempHtml=$("#select-item-template").html();
            itemTemp=Handlebars.compile(_itemTempHtml);
            _render();
            sf.eventInit();
            sf.autoSearch(treeData);
        });
    }

    function _render(){

        var source   = $("#form-select-template").html();
        var template = Handlebars.compile(source);
        var context = {
            //formList:dataOri.formList
        };
        var html = template(context);
        $(".zl-page").append(html);

        $treeElem=$("#formSelectModal").find(".zl-list-tree-wrapper");
    }

    function _cb(data){

        //选取，单选/多选形式
        if(data.opt=="del"){
            var id=data.id;
            delete selectedForms[id];

        }else{
            if(formSelectMod=="single"){
                selectedForms={};

            }
            selectedForms[data.id]={
                nodeId:data.id,
                nodeName:data.name
            }
        }
        _setSelectedForms(selectedForms);

    }
    function _renderFormTree(selectedItems){

        var _selectedFormList=[];

        $.each(selectedForms,function(formId,form){
            _selectedFormList.push(formId);
        });

        $treeElem.ysListTree({
            callback:_cb,
            nodeNameSpace:"nodeId",
            data:treeData,
            selectedItems: _selectedFormList,
            multiple:formSelectMod=="multi"?true:false
        })
    }

    function _setSelectedForms(selectedForms){

        //选染已经选中的表单
        var _formList=[];

        $.each(selectedForms,function(formId,form){
            _formList.push(form);
        });

        var _html=itemTemp({
            formList:_formList
        });

        $(".js-form-selected").empty().append(_html);

    };

    sf.eventInit=function(){

        //删除业态
        $("body").on("click",".js-form-selected>li",function(e){
            e.preventDefault();
            var $item=$(this);

            var _id=$item.data("id");

            var item=selectedForms[_id];
            var _list=[]
            _list.push(item)
            delete selectedForms[_id];
            $item.remove();
            $treeElem.trigger("delItem",item);

        });

        //确定
        $("body").on("click","#formSelectModal .js-submit",function(e){
            e.preventDefault();
            var _selectedForms=$.extend(true,{},selectedForms);
            selectCallback(_selectedForms);
            sf.modalHide();
        })

        //取消
        $("body").on("click","#formSelectModal .js-cancel",function(e){
            e.preventDefault();
            sf.modalHide();
        });

        //重置
        /*$("body").on("click","#formSelectModal .js-reset",function(e){
            e.preventDefault();
            sf.reset();
        });*/

    }

    function _createSearchArr(treeData){
        $.each(treeData,function(i,item){
            if(item.children&& item.children.length>0){

                _createSearchArr(item.children);
            }else{

                var _obj={
                    label:item.nodeName,
                    value:item.nodeId
                }

                autoSearchArr.push(_obj);

            }
        })
    }

    function _createSearchSource(treeData){
        autoSearchArr=[];
        _createSearchArr(treeData);
    }

    sf.autoSearch=function(treeData){
        _createSearchSource(treeData);

        $("#formSelectModal .js-form-search").autocomplete({
            source: autoSearchArr ,
            minLength: 0,
            select: function( event, ui ) {

                var _nodeName=ui.item.label;
                var _nodeId=ui.item.value;

                if(formSelectMod=="single"){
                    $(".js-form-selected").find("li").click();
                    selectedForms={};
                }

                selectedForms[_nodeId]={
                    nodeId:_nodeId,
                    nodeName:_nodeName
                }

                _setSelectedForms(selectedForms);

                var _item=selectedForms[_nodeId];

                $treeElem.trigger("setTreeItem",_item);

               this.value="";

                return false;
            }
        });
    }




    sf.modalShow=function(callback,data){
        $("#formSelectModal").modal("show");

        if(typeof callback!=="undefined"){
            selectCallback=callback;
        }
        if(typeof data !=='undefined'){
            selectedForms=$.extend(selectedForms,data);
            _renderFormTree(selectedForms);
            _setSelectedForms(selectedForms);
        }

    }
    
    
    sf.reset=function(){
        selectedForms={};
        //$(".js-account-list").empty();
        $treeElem.destroy();
        $(".js-form-selected").empty();
    }

    sf.modalHide=function(){
        $("#formSelectModal").modal("hide");
        sf.reset();
        selectCallback=undefined;
    }


    sf.init=function(data,mod){
        dataOri=$.extend(true,{},data);
        treeData=dataOri.formList;

        if(typeof mod !=='undefined' && (mod=='single'||mod=='multi')){
            formSelectMod=mod
        }else{
            formSelectMod="single";
        }
        _insertTemp();

    };

    return sf;
})(jQuery,selectForm||{});

