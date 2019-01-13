
/**
 * Created by whobird on 17/6/19.
 */
requirejs(["../../common/require_config"],function(){
    requirejs(["views/sample/sample","dom_onload"],function(sample){
        sample.init();
    });
})
