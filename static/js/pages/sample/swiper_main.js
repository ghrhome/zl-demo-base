
/**
 * Created by whobird on 17/6/19.
 */
requirejs(["../../common/require_config"],function(){
    requirejs(["views/sample/swiperView","dom_onload"],function(sw){
        sw.init();
    });
})
