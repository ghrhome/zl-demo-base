/**
 * Created by whobird on 17/12/26.
 */
/*globals jQuery, define, module, exports, require, window, document, postMessage */
(function (factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    }
    else if(typeof module !== 'undefined' && module.exports) {
        module.exports = factory(require('jquery'));
    }
    else {
        factory(jQuery);
    }
})(function ($, undefined) {
    "use strict";

    var nameSpace="bootstrapDropdown_"+new Date().getTime();
    //var mergedOptions;


    function renderDom(data,index_prefix,selectedItems,$elem,mergedOptions){


        function _checkSelected(itemId,selectedItems){
            return selectedItems.indexOf(itemId+"");
        };
        function _createDom(data,prefix){
            var items=[];
            var sub_li=[];


            $.each(data,function(i,e){

                if(typeof e.children!=="undefined" && e.children!==null && (e.children.length>0)){
                    index_prefix=prefix+i+"_";
                    var child=_createDom(e.children,index_prefix);


                    var li="<li data-index='"+prefix+i+"' data-value='"+e.nodeValue+"' data-name='"+e.nodeName+"' data-id='"+e[mergedOptions.nodeNameSpace]+"' class='zl-tree-item parent"+(e.expanded ? ' open' : '')+"'>"+ "<span>"+e.nodeName+"</span>"+
                        child +
                        "</li>";

                }else{
                    var _active=_checkSelected(e[mergedOptions.nodeNameSpace],selectedItems)==-1 ? false : true;
                    var li=( "<li data-index='"+prefix+i+"' data-value='"+e.nodeValue+"' data-name='"+e.nodeName+"' data-id='"+e[mergedOptions.nodeNameSpace]+"' class='zl-tree-item"+(e.expanded ? ' open' : '')+(_active ? ' active' : '')+"'>"+ "<span>"+e.nodeName+"</span>"+ "</li>");

                }
                items.push(li);
            });

            return "<ul class='zl-list-tree'>"+items.join("")+"</ul>"
        }

        function _render(){
            var ulDom= _createDom(data,index_prefix);

            $elem.html(ulDom);

            if(mergedOptions.wrapperClass){
                $elem.addClass(mergedOptions.wrapperClass);
            }

        };

       _render();
    }

    var methods={
         init:function(options) {

             var _that=this;
             var mergedOptions;



             mergedOptions = $.extend(
                 true, {}, $.fn.ysListTree.defaults, options,
                 {
                     //内部附加的属性，比如获取到的子元素
                     current: 0,
                 }
             );//end extend

             return _that.each(function(i,elem){
                var $elem=$(elem);
                 var index_prefix="";
                 var _selectedItems=[];

                 function _checkSelected(itemId){
                     return _selectedItems.indexOf(itemId);
                 };

                 //所有内部操作由_selectedItem判断
                 /*if(mergedOptions.multiple && mergedOptions.multiple=="true"){

                     if(mergedOptions.selectedItems){
                         _selectedItems=_selectedItems.concat(mergedOptions.selectedItems);
                     }
                 }*/

                 if(mergedOptions.selectedItems){
                     _selectedItems=_selectedItems.concat(mergedOptions.selectedItems);
                 }

                 renderDom(mergedOptions.data,index_prefix,_selectedItems,$elem,mergedOptions);

                 $elem.off("click","li.zl-tree-item");
                 $elem.on("click","li.zl-tree-item",function(e){
                     e.preventDefault();
                     e.stopPropagation();
                     if($(this).hasClass("parent")){

                         $(this).toggleClass("open");

                         if(!$(this).hasClass("open")){
                             $(this).find(".zl-tree-item").removeClass("open");
                         }

                     }else{

                         //判断支持多选
                         if(mergedOptions.multiple && mergedOptions.multiple==true){
                             //如果支持多选，就不必判断选定条件了。

                             if($(this).hasClass("active")){
                                 $(this).removeClass("active");

                                 var itemIndex=$(this).data("index");
                                 var itemName=$(this).data("name");
                                 var itemId=$(this).data("id");
                                 var _index=_checkSelected(itemId);
                                 _selectedItems.splice(_index,1);
                                 mergedOptions.callback({name:itemName,id:itemId,selectItems:_selectedItems,opt:'del'});

                             }else{

                                 $(this).addClass("active");
                                 var itemIndex=$(this).data("index");
                                 var itemName=$(this).data("name");
                                 var itemId=$(this).data("id");

                                 if(_checkSelected(itemId)==-1){
                                     //addItem to __selectedItems
                                     _selectedItems.push(itemId);
                                 }

                                 mergedOptions.callback({name:itemName,id:itemId,selectItems:_selectedItems});
                             }

                         }else{

                             if($(this).hasClass("active")){
                                 $(this).removeClass("active");

                                 var itemIndex=$(this).data("index");
                                 var itemName=$(this).data("name");
                                 var itemId=$(this).data("id");

                                 var _index=_checkSelected(itemId);
                                 _selectedItems.splice(_index,1);

                                 mergedOptions.callback({name:itemName,id:itemId,selectItems:_selectedItems,opt:'del'});

                             }else{
                                 $elem.find(".zl-tree-item").removeClass("active");
                                 $(this).addClass("active");

                                 var itemIndex=$(this).data("index");
                                 var itemName=$(this).data("name");
                                 var itemId=$(this).data("id");
                                 var itemValue=$(this).data("value");
                                 _selectedItems[0]=itemId;

                                 mergedOptions.callback({name:itemName,value:itemValue,id:itemId,selectItems:_selectedItems});

                             }
                         }//else
                     }
                 });

                 $elem.on("setTreeItem",function($event,item){

                     var _index=_checkSelected(item[mergedOptions.nodeNameSpace]);

                     if(_index!==-1){
                         if(mergedOptions.multiple && mergedOptions.multiple==true){
                             _selectedItems.push(item);
                         }else{
                             _selectedItems[0]=item;

                         }

                     }
                     var _selectorElm="[data-id='"+item[mergedOptions.nodeNameSpace]+"']";
                     $elem.find(_selectorElm).addClass("active");
                 });

                 //删除item;
                 $elem.on("delItem",function($event,item){

                    /* $.each(items,function(i,item){
                        console.log(item[mergedOptions.nodeNameSpace])

                     });*/
                     var _index=_checkSelected(item[mergedOptions.nodeNameSpace]);

                     if(_index!==-1){
                         _selectedItems.splice(_index,1);
                     }
                     var _selectorElm="[data-id='"+item[mergedOptions.nodeNameSpace]+"']";
                     $elem.find(_selectorElm).removeClass("active");
                 });


             });

         },//init
        destroy:function(){
            this.each(function(i,elem){
                var $elem=$(elem);
                $elem.off();
                $elem.remove();
            });
        }

    };

    $.fn.ysListTree=function(method){

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if ($.type(method) === 'object') {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jqListTree');
        }
    };

    $.fn.ysListTree.defaults={
        multiple:false,
        //hasCheck:false,
        nodeNameSpace:"id",
        wrapperClass:"zl-list-tree-wrapper",
        selectedItems:[],
        callback:function(value){
            //console.log(value);
        }
    };
})