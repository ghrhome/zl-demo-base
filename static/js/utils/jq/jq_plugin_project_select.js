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

    var namespace="ysProjectSelectNameSpace";


    function _innerFun(){

    }

    function _createHtml(listData,selectedID){
        var _str='';
           /* <li data-index="0" data-id="c-01" class="zl-select-item selected">
                    <span>广深</span>
                    </li>*/
        $.each(listData,function(i,item){

            _str+="<li data-index='"+i+"' data-id='"+ item.nodeId+"' class='zl-select-item "+(selectedID==item.nodeId?"selected":"")+"'>" +
                "                    <span>"+item.nodeName+"</span>" +
                " </li>";
        });

        return _str;
    }

    var methods={
         init:function(options) {

             var _that=this;
             var mergedOptions;

             mergedOptions = $.extend(
                 true, {}, $.fn.ysProjectSelect.defaults, options,
                 {
                     //内部附加的属性，比如获取到的子元素
                     current: 0,
                     $children: this.filter('.zl-dropdown-project-select')//获取子元素可绑定事件
                 }
             );//end extend

             mergedOptions.$children.on("click",".dropdown-menu",function(e){
                 //do something
                 e.preventDefault();
                 e.stopPropagation();
             });

             return _that.each(function(i,elem){
                 var $elem=$(elem);
                 var $search=$elem.find(".js-project-search");

                 var _searchList=[];
                 var _projectList=[]

                 var $cityList=$elem.find(".js-city-list");
                 var $projectList=$elem.find(".js-project-list");

                 var _data=$.extend(true,[],mergedOptions.listData);

                 var _selectedCid,_tempCid;

                 var _selectedItem = $.extend(true,{},mergedOptions.selectedItem);

                 _selectedCid=_selectedItem.cityId;

                //渲染城市菜单
                 function _render(){
                     var _cHtml=_createHtml(_data,_selectedItem.cityId);
                     $cityList.empty().html(_cHtml);

                     if(_selectedItem.cityId){
                         $.each(_data,function(i,item){
                             if(item.nodeId==_selectedItem.cityId){
                                 _projectList=$.extend(true,[],item.children);
                                 return;
                             }
                         });
                         var _pHtml=_createHtml(_projectList,_selectedItem.projectId);
                         $projectList.empty().html(_pHtml);

                         /*  $elem.find(".js-city_list li[data-id='"+_selectedItem.cityId+"']").addClass("selected");
                           $elem.find(".js-project_list li[data-id='"+_selectedItem.projectId+"']").addClass("selected");*/
                     }
                 }

                 _render();

                 $elem.on("click",".js-city-list li",function(e){

                     e.preventDefault();
                     $elem.find(".js-city-list li").removeClass("selected");
                     $(this).addClass("selected");

                     $elem.find(".js-project-search").val("");
                     _searchList=[];


                     var _curCIndex=$(this).data("index");
                     var _curCid=$(this).data("id");

                     _tempCid=_curCid;
                     _projectList= _projectList=$.extend(true,[],_data[_curCIndex].children);

                     var _pHtml=_createHtml(_projectList,_selectedItem.projectId);
                     $projectList.empty().html(_pHtml);

                 });

                 $elem.on("click",".js-project-list li",function(e){
                     e.preventDefault();
                     $elem.find(".js-project-list li").removeClass("selected");
                     $(this).addClass("selected");


                     //var _curPIndex=$(this).data("index");

                     var _nodeName=$(this).text().trim();
                     var _nodeId=$(this).data("id");


                     if(_searchList.length>0){
                         var _index=$(this).index();
                         _tempCid=_searchList[_index].cid;
                     }

                     _selectedCid=_tempCid;

                     _selectedItem=$.extend(true,{},{
                         cityId:_selectedCid,
                         projectId:_nodeId,
                         projectName:_nodeName
                     });

                     mergedOptions.callback(_selectedItem);

                     $elem.find(".zl-dropdown-btn").text(_nodeName).dropdown("toggle");

                     _reset();

                 });

                 $elem.on("click",".zl-dropdown-btn",function(e){
                     e.preventDefault();
                     //$(this).dropdown("toggle");

                 });

                 function _reset(){
                     $elem.find(".js-project-search").val("");
                     _searchList=[];
                     _projectList=[];

                     _render();
                 }


                 var defer=undefined;
                 var $search=$elem.find(".js-project-search");

                 var _search=function(){

                     if(typeof defer!=="undefined"){
                         clearTimeout(defer);
                         defer=undefined;
                     }

                     defer=setTimeout(function(){
                         clearTimeout(defer);
                         defer=undefined;
                         var _input=$search.val().trim();

                         if(_input==""){
                             _searchList=[];

                         }else{

                             var _patt = new RegExp(_input);
                             _searchList=[];
                             $.each(_data,function(i,city){
                                 var _cid=city.nodeId;
                                 $.each(city.children,function(i,project){
                                     if(_patt.test(project.nodeName)){
                                         project.cid=_cid;
                                         _searchList.push(project);
                                     }
                                 })
                             });

                         }
                         var _pHtml=_createHtml(_searchList,_selectedItem.projectId);

                         $cityList.find("li").removeClass("selected");
                         $projectList.data("cid","").empty().html(_pHtml);

                     },300);
                 }

                 if(typeof $search!=='undefined'){

                     $elem.on("input",".js-project-search",function(e){
                         _search();
                     })

                 }else{

                 }

             });

         },//init
        destroy:function(){
            var _that=this;
            _that.each(function(i,elem) {
                var $elem = $(elem);
                $elem.off();
            });
        }

    };

    $.fn.ysProjectSelect=function(method){
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if ($.type(method) === 'object') {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.jqiaPhotomatic');
        }
    };

    $.fn.ysProjectSelect.defaults={
        callback:function(value){
            console.log(value);
        },
        listData:[],
        selectedItems:[],//目前只考虑单选
        selectedItem:{}//CityId, projectId,projetName(可选)

    };
})