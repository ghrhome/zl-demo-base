/**
 * Created by whobird on 2018/4/13.
 */
var selectAccountList=(function($,selectAccountList){
    var su=selectAccountList;

    var selectCallback=undefined;
    var itemTemp;
    var dataOri={};
    var accountSelectMod;

    var selectedAccounts={};


    function _insertTemp(){
        $.get("../common/accountPeriodSelectModal.html",function(tmpl){
            $("body").append(tmpl);
            var _itemTempHtml=$("#account-item-template").html();
            itemTemp=Handlebars.compile(_itemTempHtml);
            _render();
            su.eventInit();
        });
    }

    function _render(){

        var source   = $("#account-period-template").html();
        var template = Handlebars.compile(source)
        var context = {
            accountList:dataOri.accountPeriodList
        };

        //console.log(context)
        var html = template(context);
        $(".zl-page").append(html);

    }


    function _setAccountsChecked(){

        var _accountsList= dataOri.accountPeriodList;

        //当渲染完accountlist后，根据selectedAccounts渲染当前item的selected状态
        $.each(_accountsList,function(i,account){
            if(account.id && typeof selectedAccounts[account.id]!=="undefined"){
                var _index=i;
                //console.log(_index);
                $(".js-account-list").find("li").eq(_index).addClass("selected");
            }
        })

    };

    function _setSelectedAccounts(selectedAccounts){
        var _accountList=[];

        $.each(selectedAccounts,function(accountId,account){
            _accountList.push(account);
        });

        var _html=itemTemp({
            accountList:_accountList
        });

        $(".js-account-selected").empty().append(_html);
    };

    su.eventInit=function(){

        //选取账期，单选/多选形式
        $("body").on("click",".js-account-list>li",function(e){
            e.preventDefault();

            if($(this).hasClass("selected")){
                var _id=$(this).data("id");
                delete selectedAccounts[_id];

                if(accountSelectMod=="single"){
                    $(".js-account-list>li").removeClass("selected");
                }else{
                    $(this).removeClass("selected");
                }

            }else{
                var _id=$(this).data("id");
                var _index=$(this).data("index");
                var _name=$(this).data("name");
                var _value=$(this).find("span").text();

                if(accountSelectMod=="single"){
                    selectedAccounts={};
                    $(".js-shop-list>li").removeClass("selected");
                }
                selectedAccounts[_id]={
                    id:_id,
                    name:_name,
                    index:_index,
                    value:_value
                }

                $(this).addClass("selected");
            }


            _setSelectedAccounts(selectedAccounts);

        });

        //删除账期
        $("body").on("click",".js-account-selected>li",function(e){
            e.preventDefault();
            var $item=$(this);

            var _id=$item.data("id");

            var item=selectedAccounts[_id];

            delete selectedAccounts[_id];
            $item.remove();

            $(".js-account-list").find("li").each(function(i,item){
                if($(this).data("id")==_id){
                    $(this).removeClass("selected");
                }
            })

        });

        //确定
        $("body").on("click","#accountPeriodSelectModal .js-submit",function(e){
            e.preventDefault();
            var _selectedAccounts=$.extend(true,{},selectedAccounts);
            selectCallback(_selectedAccounts);
            su.modalHide();
        })

        //取消
        $("body").on("click","#accountPeriodSelectModal .js-cancel",function(e){
            e.preventDefault();
            su.modalHide();
        })

        //重置
        $("body").on("click","#accountPeriodSelectModal .js-reset",function(e){
            e.preventDefault();
            su.reset();
        })

    }

    su.modalShow=function(callback,data){
        $("#accountPeriodSelectModal").modal("show");

        if(typeof callback!=="undefined"){
            selectCallback=callback;
        }
        if(typeof data !=='undefined'){
            selectedAccounts=$.extend(selectedAccounts,data);
            _setSelectedAccounts(selectedAccounts);
            _setAccountsChecked();
        }

    }
    
    
    su.reset=function(){
        selectedAccounts={};
        //$(".js-account-list").empty();
        $(".js-account-selected").empty();
        //_setAccountsChecked();
        $(".js-account-list").find("li").removeClass("selected");
    }
    su.modalHide=function(){
        $("#accountPeriodSelectModal").modal("hide");
        su.reset();
        selectCallback=undefined;
    }


    su.update=function(data,mod){
        dataOri=$.extend(true,{},data);
        if(typeof mod !=='undefined' && (mod=='single'||mod=='multi')){
            accountSelectMod=mod
        }else{
            accountSelectMod="single";
        }

        $("#accountPeriodSelectModal").remove();

        var _itemTempHtml=$("#account-item-template").html();
        itemTemp=Handlebars.compile(_itemTempHtml);
        _render();

    }

    su.init=function(data,mod){
        dataOri=$.extend(true,{},data);
        if(typeof mod !=='undefined' && (mod=='single'||mod=='multi')){
            accountSelectMod=mod
        }else{
            accountSelectMod="single";
        }
        _insertTemp();
    };

    return su;
})(jQuery,selectAccountList||{});

