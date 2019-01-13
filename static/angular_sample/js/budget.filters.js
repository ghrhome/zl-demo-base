/**
 * Created by whobird on 17/11/21.
 */
var filters= angular.module("app.filters",[]);
filters.filter("default",function(){
    return function(data,str){
        if(typeof str==="undefined"){
            return data;
        }else{
            if(typeof data==="undefined" || data=="" || data==null){
                return str;
            }
            return data;
        }
    }
});