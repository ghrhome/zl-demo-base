function ReportApi(id, repHea, num) {
    this.num=num==undefined?false:num;
    //控件容器
    this.ID = id;
    //..
    this.pages = 1;
    this.reportWh=0;
    this.bool=true;
    //表头
    this.repHea = repHea;
    //url链接
    this.rePurl = null;
    this.heada = null;
    this.newt = null;
}

ReportApi.prototype.init = function (url, data, reportData, newTitles) {
    let _this = this;
    this.rePurl = url;
    this.heada = reportData;
    this.newt = newTitles;
    this.Ajax(url, data, reportData, newTitles).then((result) => {
        _this.handsontable(result, _this.dataHeader(result).resObj);
    }).catch((result) => {
        result.reportD = _this.dataHeader(result).rejArr;
        _this.handsontable(result, _this.dataHeader(result).resObj);
    })

};

ReportApi.prototype.again = function (data) {
    let _this = this;
    this.Ajax(this.rePurl, data, this.heada, this.newt).then((result) => {
        _this.handsontable(result, _this.dataHeader(result).resObj);
    }).catch((result) => {
        result.reportD = _this.dataHeader(result).rejArr;
        _this.handsontable(result, _this.dataHeader(result).resObj);
    })
}


//..页数
ReportApi.prototype.page = function (res) {
    $('#rows').html(res.data.rows);
    $('#page').html(res.data.page);
    $('#pages').html(res.data.pages);
    $('#indexPage').val(res.data.page);
}
//ajax方法                          链接地址   数据   表头
ReportApi.prototype.Ajax = function (url, data, reportData, newTitles) {
    let _this = this;
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            type: 'POST',
            data: data,
            // async: false,
            dataType: 'json',
            success: function (res) {
                _this.pages = res.data.pages;
                let resObj = {};
                if (typeof (newTitles) == 'string') {
                    resObj = {reportD: res.data[reportData], newT: res.data[newTitles]};
                } else {
                    resObj = {reportD: res.data[reportData], newT: newTitles};
                }
                if (Number(res.code) == 0 || Number(res.code) == 500 || res.data[reportData].length < 1) {
                    _this.page(res);
                    reject(resObj);
                } else {
                    _this.page(res);
                    resolve(resObj);
                }


            }
        })

    })
};
//获取数据的key
ReportApi.prototype.dataHeader = function (result) {
    let rejArr = [];
    let rejObj = {};
    let resObj = [];
    let data = null;
    let dataRep = result.reportD;

    if (dataRep.length < 1) {
        this.bool=false;
        data = this.repHea;
        data.map((index, elm) => {
            let res = {};
            rejObj[elm] = null;
            res.data = elm;
            res.type = 'text';
            resObj.push(res);
        })

    } else {
        data = result.reportD[0];
        for (let i in data) {
            let res = {};
            rejObj[i] = null;
            res.data = i;
            res.type = 'text';
            resObj.push(res);
        }
    }

    rejArr.push(rejObj);
    //   没数据时表头  有数据时表头
    return {rejArr, resObj}
};
//..
ReportApi.prototype.wh=function (neT,data) {
    let arr=[];
    let sta='';
    neT.map((elm,ind)=>{
        sta+=elm;
    });
    arr.push(sta);

    data.map((item,index)=>{
        let str='';
        let fun=(function (item) {
            for(let i in item){
                str+=item[i];
            }
        })(item);
        arr.push(str)
        fun=null;
    });
    let num=arr[0].length;
    let stc=arr[0];
    arr.map((e,i)=>{
        if(e.length>num){
            num=e.length;
            stc=e;
        }
    })
    // 字母的个数

    let countE = this.countEnglish(stc);
    // 非字母的个数
    let countC = num - countE;
    return (Number(countE) * 10) + (Number(countC) * 20);
}
// 统计一个字符串中字母的个数
ReportApi.prototype.countEnglish = function(str) {
    // let valueLength = 0;
    // let english = "[\u0391-\uFFE5]";
    // for (let i = 0; i < value.length(); i++) {
    //     // 获取一个字符
    //     let temp = value.substring(i, i + 1);
    //     // 判断是否为字母
    //     if (temp.test(english)) {
    //         valueLength++;
    //     }
    // }
    let arr = str.match(/[a-z]/ig);
    if (null == arr) {
        return 0;
    }
    return arr.length;
}

//报表控件
ReportApi.prototype.handsontable = function (result, dataHea) {
    let _this = this;
    var hotElement = this.ID;
    if(this.reportWh==0||this.wh(result.newT,result.reportD)>this.reportWh){
        this.reportWh=this.wh(result.newT,result.reportD);
        $(this.ID).css('width',this.wh(result.newT,result.reportD)+'px');
    }else{
        $(this.ID).css('width',this.reportWh+'px');
    }
    console.log(this.reportWh);
    $(hotElement).html('');
    // var hotElementContainer = hotElement.parentNode;
    var hotSettings = {
        data: result.reportD,
        language: 'zh-CN',//语言
        contextMenu: ['copy'],//启用右键菜单
        readOnly: true,
        columns: dataHea,
        // fixedRowsTop: 0,//定影第一行
        fixedColumnsLeft: _this.num,//开启列的定影但必须先冻结该列
        columnSorting: true,
        // sortIndicator: true,//开启排序
        UndoRedo: true,//撤销操作
        manualColumnFreeze: true,//开启冻结
        dropDownMenu: true,
        wordWrap: false,
        // columnSummary: [
        //     {
        //         // destinationRow: 2,
        //         destinationColumn: 14,
        //         reversedRowCoords: true,
        //         type: 'sum',
        //         forceNumeric: true
        //     },
        // ],
        // stretchH: 'all',//延伸所有列
        // width: 2500,
        // hiddenColumns:[0,1],
        // autoWrapRow: true,
        // height: (result.data.length*45),
        // ManualColumnFreeze:true,//解冻或冻结
        rowHeaders: _this.bool,//当值为true时显示行头，当值为数组时，行头为数组的值
        colHeaders: result.newT,
        maxRows: 2000,//最大行数
        minSpareRows: false,
        // maxCols:20,//最大列数
        // filters: true,//过滤器
        // observeChanges:true,
        // manualRowResize: true,//允许拖动行
        // manualColumnResize: true,//允许拖动列
        // manualRowMove: true,//行可拖拽至指定行
        // manualColumnMove: true,//列可拖拽至指定行
        // trimRows: [1, 2, 5],//修剪行
        // exportFile:true
    };
    var hot = new Handsontable(hotElement, hotSettings);
    // pageView.getTop();
    // pageView.getDev();
    // pageView.tableCsv(hot);
    // pageView.locaHide();

    if(!this.bool){
        $('#hot').find('.htCore tbody').addClass('nobod');
    }

    this.getDir(hot);
    setTimeout(() => {
        this.swiper();
        // $('#report_query').css('height',2000+'px');
    }, 1000);

    this.locaHide();

};
//定影
ReportApi.prototype.getDir = function (hot) {
    let divLeft = '';
    let divH = 0;
    let divW = 0;
    if ($('.cloneDir')) {
        $('.cloneDir').remove();
    }
    $(this.ID).find('div').each((index, elm) => {
        if ($(elm).hasClass('ht_clone_left')) {
            divLeft = elm;
            divH = $(elm).height();
            divW = $(elm).width();
            $(elm).css('z-index', 1);
        }
    })
    let num = $(divLeft).find('th').length;
    let div = $('<div class="cloneDir"></div>');
    div.css({'height': divH + 'px', 'width': divW + 'px', 'z-index': 10});
    div.html(divLeft);
    $(this.ID).parents('.zl-table-main').prepend(div);
};
//swiper
ReportApi.prototype.swiper = function () {
    let _this=this;
    var ys_main_swiper = new Swiper('#zl-floor-main-table', {
        scrollbar: '.swiper-scrollbar-a',
        direction: 'horizontal',
        slidesPerView: 'auto',
        observer: true,
        observeParents: true,
        mousewheelControl: true,
        freeModeMomentum:false,
        freeMode: true,
        scrollbarHide: false,
        scrollbarDraggable: true,
        preventClicksPropagation:true,
        // onTouchMove:function(e){
        //     e.update();
        // },
        onTouchStart:function (swiper,even) {
            swiper.update();
        }

    });
    ys_main_swiper.on('setTranslate',function (translate) {
        let le=ys_main_swiper.getWrapperTranslate()>0?0:ys_main_swiper.getWrapperTranslate();
        $('.swiper-wrapper').css('transform', "translate3d(" + le + "px, 0px, 0px)")
    })

};
//显示
ReportApi.prototype.locaHide = function () {
    $('#preloader').fadeOut('slow');
};
//隐藏
ReportApi.prototype.locaShow = function () {
    $('#preloader').fadeIn('slow');
}