var pageView = (function ($) {

    var container = $("#store-split-merge-add");

    var pageView = {};

    pageView.init = function () {
        pageView.swiperInit();
    };

    // 滑动窗口初始化
    pageView.swiperInit = function () {
        new Swiper('.swiper-container', {
            scrollbar: '.swiper-scrollbar-a',
            direction: 'horizontal',
            slidesPerView: 'auto',
            mousewheelControl: true,
            freeMode: true,
            scrollbarHide:false,
            scrollbarDraggable:true,
            preventClicksPropagation:false,

        });
    }

    return pageView;
})(jQuery);


$(document).ready(function () {
    pageView.init();
});