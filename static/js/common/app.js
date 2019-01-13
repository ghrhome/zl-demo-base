(function ($app) {

    /**
     * 提交审批
     * @param code          流程
     * @param bisId         业务
     * @param parameter     参数
     */
    function submit(code, bisId, parameter) {
        return $app.injector.invoke(["RequestService", "$q", "$timeout", function (requestService, $q, $timeout) {
            var deferred = $q.defer();
            $app.msgbox.confirm({message: "确认提交审批？"}).then(function ($response) {
                if ($response.execute) {
                    $app.loading(true);
                    requestService.jsonp("integration_web/workflow/submit", {
                        params: {
                            code: code,
                            bisId: bisId,
                            parameter: angular.toJson(parameter || {})
                        }
                    }).then(function ($response) {
                        $app.loading(false);
                        if (!$response.data.success) {
                            $app.tip.error({message: $response.data.message});
                        } else {
                            $app.tip.success({message: "提交成功!"});
                            $timeout(function () {
                                deferred.resolve($response);
                            }, 300)
                        }
                    });
                }
            })
            return deferred.promise;
        }]);
    }

    $app.workflow = {
        submit: submit
    }
})($app)