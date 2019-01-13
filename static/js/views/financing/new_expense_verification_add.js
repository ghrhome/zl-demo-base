var pageView=(function($){
    var pageView={};
    var container=$("#new_expense_verification_add");


    var data={
        "expenseTypes":[
            {
                name:"收款单",
                type:"receipts",
                items:[
                    {
                        id:"PM-0725006",
                        total:2000.00,
                        balance:1000.00,
                        feeList:[
                            {
                                type:'fixed-rental',
                                name:'固定租金',
                                value:0,//当前操作  不用传
                                veri:1000.00,//已收金额
                                total:2000.00,//应收金额
                                balance:1000.00,//欠款
                            },{
                                type:'commission-rental',
                                name:'提成租金',
                                value:0,
                                veri:1000.00,//已收金额
                                total:2000.00,
                                balance:1000.00,
                            }
                        ]
                    },{
                        id:"PM-0725008",
                        total:3000.00,
                        balance:1800.00,
                        feeList:[
                            {
                                type:'fixed-rental',
                                name:'固定租金',
                                value:0,
                                veri:1000.00,//已收金额
                                total:2000.00,
                                balance:1000.00,
                            },{
                                type:'commission-rental',
                                name:'提成租金',
                                value:0,
                                veri:1000.00,//已收金额
                                total:2000.00,
                                balance:1000.00,
                            }
                        ]
                    },{
                        id:"PM-0725066",
                        total:5000.00,
                        balance:3000.00,
                        feeList:[
                            {
                                type:'fixed-rental',
                                name:'固定租金',
                                value:0,
                                veri:1000.00,//已收金额
                                total:2000.00,
                                balance:1000.00,
                            },{
                                type:'commission-rental',
                                name:'提成租金',
                                value:0,
                                veri:1000.00,//已收金额
                                total:2000.00,
                                balance:1000.00,
                            }
                        ]
                    }
                ]
            },{
                name:"冲抵",
                type:"veri",
                items:[
                    {
                        id:"CD-0725006",
                        total:2000.00,
                        balance:1000.00,
                        feeList:[
                            {
                                type:'fixed-rental',
                                name:'固定租金',
                                value:0,
                                veri:1000.00,//已收金额
                                total:2000.00,
                                balance:1000.00,
                            }
                        ]
                    },{
                        id:"CD-0725008",
                        total:3000.00,
                        balance:1800.00,
                        feeList:[
                           {
                                type:'commission-rental',
                                name:'提成租金',
                                value:0,
                               veri:1000.00,//已收金额
                               total:2000.00,
                               balance:1000.00,
                            }
                        ]
                    },{
                        id:"CD-0725066",
                        total:5000.00,
                        balance:3000.00,
                        feeList:[
                            {
                                type:'fixed-rental',
                                name:'固定租金',
                                value:0,
                                veri:1000.00,//已收金额
                                total:2000.00,
                                balance:1000.00,
                            },{
                                type:'commission-rental',
                                name:'提成租金',
                                value:0,
                                veri:1000.00,//已收金额
                                total:2000.00,
                                balance:1000.00,
                            }
                        ]
                    }
                ]
            },{
                name:"应收冲抵",
                type:"receiptVeri",
                items:[
                    {
                        id:"GS-0725006",
                        total:2000.00,
                        balance:1000.00,
                        feeList:[
                            {
                                type:'fixed-rental',
                                name:'固定租金',
                                value:0,
                                veri:1000.00,//已收金额
                                total:1000.00,
                                balance:500.00,
                            },{
                                type:'commission-rental',
                                name:'提成租金',
                                value:0,
                                veri:1000.00,//已收金额
                                total:1000.00,
                                balance:500.00,
                            }
                        ],

                    },{
                        id:"GS-0725008",
                        total:3000.00,
                        balance:1800.00,
                        feeList:[
                            {
                                type:'fixed-rental',
                                name:'固定租金',
                                value:0,
                                veri:1000.00,//已收金额
                                total:1000.00,
                                balance:600.00,


                            },{
                                type:'commission-rental',
                                name:'提成租金',
                                value:0,
                                total:2000.00,
                                balance:1200.00,
                            }
                        ]

                    },{
                        id:"GS-0725066",
                        total:5000.00,
                        balance:3000.00,
                        feeList:[
                            {
                                type:'fixed-rental',
                                name:'固定租金',
                                value:0,
                                veri:1000.00,//已收金额
                                total:2000.00,
                                balance:1200.00,
                            },{
                                type:'commission-rental',
                                name:'提成租金',
                                value:0,
                                total:2000.00,
                                balance:1200.00,
                            }
                        ]
                    }
                ]
            }

        ],
        history:[
           /*  {
                 timeStamp:(new Date()).getTime(),
                 value:0,
                 type:"fixed-rental",
                 name:"固定租金",
                 feeId:"GS-0725006",
                 veriId:"VR-0725006"

             }*/
        ]
    }

    pageView.eventInit=function(){

    }

    pageView.datetimeInit=function(){
        $(".zl-datetimepicker input").datetimepicker({
            format:"yyyy-mm",
            todayBtn:"linked",
            startView:3,
            minView:3,
            autoclose: true,
            language:"zh-CN"
        }).on("changeDate",function(){
            console.log(123);
        })
    }

    pageView.swiperInit=function(){

    }

    pageView.agInit=function(){
        var app = angular.module('myApp', []);
        app.controller('expenseVerificationCtrl', function($scope) {
            var _ev=this;
            this.vData=data;
            this.curItem=undefined;
            this.modalTableType=undefined;
            console.log(this.vData)

            this.editVerifications=function(vType,item){
                console.log(this.curItem)
                console.log(item)
                if(this.curItem &&this.curItem.id==item.id){
                    //this.curItem=undefined;
                    this.resetVeri();
                }else{
                    //this.curItem=angular.copy(item);
                   this.curItem=item;

                }

            }

            this.updateFee=function(){
               var curItem=this.curItem;

                $.each(curItem.feeList,function(i,fee){

                    if(parseFloat(fee.value)!==0){
                        fee.veri=parseFloat(fee.veri)+parseFloat(fee.value)
                        fee.balance=parseFloat(fee.total)-parseFloat(fee.veri);
                        curItem.balance=parseFloat(curItem.balance)-parseFloat(fee.value);

                        //push history
                        _ev.vData.history.unshift({
                            timeStamp:(new Date()).getTime(),
                            value:fee.value,
                            type:fee.type,
                            name:fee.name,
                            feeId:curItem.id,
                            veriId:fee.id||"-"
                        })

                        fee.value=0;

                    }
                });

                this.curItem=undefined;

            }
            this.resetVeri=function(){

                var curItem=this.curItem;
                $.each(curItem.feeList,function(i,fee){
                    fee.value=0;
                });

                this.curItem=undefined;
            }

            this.recover=function(historyItem){
                console.log(historyItem);
            }

            this.save=function(){
                console.log("save------------")
            }

            this.undoAll=function(){
                console.log("undo-------------")
            }


            this.showDetail=function($event,vType,item){
                $event.preventDefault();
                $event.stopPropagation();
                console.log(item);
                this.modalTableType=vType.type;

                $("#veriModal").modal("show");
            }

            this.closeModal=function(){
                $("#veriModal").modal("hide");
            }



        });
        angular.bootstrap(document,["myApp"]);
    }

    pageView.init=function(){
        $("#preloader").fadeOut("fast");
        pageView.eventInit();
        pageView.swiperInit();
        pageView.datetimeInit();

        pageView.agInit();

    };
    return pageView;

})(jQuery);


$(document).ready(function(){
    pageView.init();
});

