/**
 * Created by whobird on 17/5/12.
 */
define(["angular","./app.directives"],function(angular,directives){

    directives.directive('listTreeMulti', [
        function() {
            return {
                restrict: 'A',
                scope: {
                    itemSelect:"&",
                    //curMonth:"@"
                    //listData:"="
                    multiple:"@",
                    selectedItems:"=",
                    nameSpace:"="
                },
                require:"ngModel",

                template: "<div class='zl-list-tree'>"+
                                /*"<li ng-repeat='item in listData' data-id='item.id'>"+
                                    "<span>"+item.name+"</span>"+
                                    '<div ng-if="item.children.length!==0"  list-tree list-data="item.children" item-select="itemSelect(item)">'+
                                    '</div>'+
                                 "</li>"+*/
                            "</div>",

                link: function($scope, $element,attrs,ngModelCtrl) {
                    var index_prefix="";
                    var _selectedItems=[];

                    if(!$scope.nodeNameSpace){
                        $scope.nodeNameSpace="id";
                    }
                    //所有内部操作由_selectedItem判断
                    if($scope.multiple && $scope.multiple=="true"){

                        if($scope.selectedItems){
                            _selectedItems=_selectedItems.concat($scope.selectedItems);
                        }

                    }

                    function _checkSelected(itemId){
                        return _selectedItems.indexOf(itemId);
                    };

                    function _createDom(data,prefix){
                        var items=[];
                        var sub_li=[];

                        $.each(data,function(i,e){

                           if(typeof e.children!=="undefined" && (e.children.length>0)){
                               index_prefix=prefix+i+"_";
                              var child=_createDom(e.children,index_prefix);

                               var li="<li data-index='"+prefix+i+"' data-name='"+e.nodeName+"' data-id='"+e[$scope.nodeNameSpace]+"' class='zl-tree-item parent"+(e.expanded ? ' open' : '')+"'>"+ "<span>"+e.nodeName+"</span>"+
                                   child +
                                   "</li>";

                           }else{
                               var _active=_checkSelected(e[$scope.nodeNameSpace])==-1 ? false : true;
                               var li=( "<li data-index='"+prefix+i+"' data-name='"+e.nodeName+"' data-id='"+e[$scope.nodeNameSpace]+"' class='zl-tree-item"+(e.expanded ? ' open' : '')+(_active ? ' active' : '')+"'>"+ "<span>"+e.nodeName+"</span>"+ "</li>");

                           }
                           items.push(li);
                        });

                        return "<ul class='zl-list-tree'>"+items.join("")+"</ul>"
                    }


                    ngModelCtrl.$render=function(){

                        var data=ngModelCtrl.$viewValue;
                        var ulDom= _createDom(data,index_prefix);
                        $element.html(ulDom);

                    };

                    /* var ulDom= _createDom(data).html();*/
                    $element.off("click","li.zl-tree-item");
                    $element.on("click","li.zl-tree-item",function(e){
                        e.preventDefault();
                        e.stopPropagation();
                       if($(this).hasClass("parent")){

                           $(this).toggleClass("open");

                           if(!$(this).hasClass("open")){
                               $(this).find(".zl-tree-item").removeClass("open");
                           }

                       }else{

                           //判断支持多选
                           if($scope.multiple && $scope.multiple=="true"){
                               //如果支持多选，就不必判断选定条件了。

                               if($(this).hasClass("active")){
                                   $(this).removeClass("active");

                                   var itemIndex=$(this).data("index");
                                   var itemName=$(this).data("name");
                                   var itemId=$(this).data("id");
                                  var _index=_checkSelected(itemId);
                                   _selectedItems.splice(_index,1);
                                   $scope.itemSelect({name:itemName,id:itemId,opt:'del'});

                               }else{

                                   $(this).addClass("active");
                                   var itemIndex=$(this).data("index");
                                   var itemName=$(this).data("name");
                                   var itemId=$(this).data("id");

                                   if(_checkSelected(itemId)==-1){
                                       //addItem to __selectedItems
                                       _selectedItems.push(itemId);
                                   }

                                   $scope.$apply(function() {
                                       $scope.itemSelect({name:itemName,id:itemId});
                                   });
                               }

                           }else{
                                //console.log(".........")
                               if($(this).hasClass("active")){
                                   $(this).removeClass("active");

                                   var itemIndex=$(this).data("index");
                                   var itemName=$(this).data("name");
                                   var itemId=$(this).data("id");
                                   var _index=_checkSelected(itemId);
                                   //_selectedItems.splice(_index,1);
                                   $scope.itemSelect({name:itemName,id:itemId,opt:'del'});

                               }else{

                                   $(this).closest("div[list-tree-multi]").find(".zl-tree-item").removeClass("active");
                                   $(this).addClass("active");

                                   var itemIndex=$(this).data("index");
                                   var itemName=$(this).data("name");
                                   var itemId=$(this).data("id");

                                   $scope.$apply(function() {
                                       $scope.itemSelect({name:itemName,id:itemId});
                                   });

                               }
                           }//else
                       }
                    });

                    //删除item;
                    $scope.$on("delItem",function($event,items){

                        $.each(items,function(i,item){

                            var _index=_checkSelected(item.id)

                            if(_index!==-1){
                                _selectedItems.splice(_index,1);
                            }
                            var _selectorElm="[data-id='"+item.id+"']";
                            $element.find(_selectorElm).removeClass("active");
                        });
                    });

                    $scope.$on("$destroy", function() {

                        //清除配置
                        //console.log("destroy");
                        //todo: 这里有个bug, 就是当页面有两个listTree的时候，页面销毁后，前一个页面的listTree事件也取消了。。
                        $element.off("click","li.zl-tree-item");

                    });
                }//end link
            };
        }]);
});