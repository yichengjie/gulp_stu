<div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
            <h4 class="modal-title" id="myModalLabel" ng-bind="title"></h4>
        </div>
        <div class="modal-body">
            <form  name = "ocModelForm" class="form-horizontal" role="form">
            <%if("tb170.html"==value){%>
                <div class="form-group has-feedback" ng-class="{true:'has-error'}[ocModelForm.saleGeographicPointType.$invalid&&ocModelForm.saleGeographicPointType.$dirty]">
                    <label  class="col-sm-3 control-label">销售地类型</label>
                    <div class="col-sm-6">
                        <select ng-model="rowData.saleGeographicPointType"
                                class="form-control input-sm"
                                ng-options="o.value as o.name for o in selectList.geoLocTypeList">
                        </select>
                    </div>
                </div>
                <div class="form-group  has-feedback" ng-class="{true:'has-error'}[ocModelForm.saleGeographicPoint.$invalid&&ocModelForm.saleGeographicPoint.$dirty]">
                    <label  class="col-sm-3 control-label">销售地代码</label>
                    <div class="col-sm-6">
                        <input type="text"  name="saleGeographicPoint" ng-required="true" ng-model="rowData.saleGeographicPoint" class="form-control input-sm"  >
                        <oc-input-valid name = "ocModelForm.saleGeographicPoint"></oc-input-valid>
                    </div>
                    <div class="col-sm-3 pt_tip" ng-show="ocModelForm.saleGeographicPoint.$dirty">
                        <span class = "text-danger" ng-show="ocModelForm.saleGeographicPoint.$error.required">必填项</span>
                    </div>
                </div>
                <div class="form-group  has-feedback" ng-class="{true:'has-error'}[ocModelForm.specFeeAmount.$invalid&&ocModelForm.specFeeAmount.$dirty]">
                    <label  class="col-sm-3 control-label">金额</label>
                    <div class="col-sm-6">
                        <input type="text" integer="true" ng-maxlength="7"  ng-required="true" name ="specFeeAmount" ng-model="rowData.specFeeAmount" class="form-control input-sm" >
                        <oc-input-valid name = "ocModelForm.specFeeAmount"></oc-input-valid>
                    </div>
                    <div class="col-sm-3 pt_tip" ng-show="ocModelForm.specFeeAmount.$dirty">
                        <span class = "text-danger" ng-show="ocModelForm.specFeeAmount.$error.integer">必须输入正整数</span>
                        <span class = "text-danger" ng-show="ocModelForm.specFeeAmount.$error.required">必填项</span>
                        <span class = "text-danger" ng-show="ocModelForm.specFeeAmount.$error.maxlength">超过7位</span>
                    </div>
                </div>
                <div class="form-group  has-feedback" ng-class="{true:'has-error'}[ocModelForm.specFeeCurrency.$invalid&&ocModelForm.specFeeCurrency.$dirty]">
                    <label  class="col-sm-3 control-label">货比类型</label>
                    <div class="col-sm-6">
                        <input type="text" ng-maxlength="3" ng-required="true" name="specFeeCurrency" ng-model="rowData.specFeeCurrency" upper-input="" class="form-control input-sm">
                        <oc-input-valid name = "ocModelForm.specFeeCurrency"></oc-input-valid>
                    </div>
                    <div class="col-sm-3 pt_tip" ng-show="ocModelForm.specFeeCurrency.$dirty">
                        <span class = "text-danger"  ng-show="ocModelForm.specFeeCurrency.$error.required">必填项</span>
                        <span class = "text-danger"  ng-show="ocModelForm.specFeeCurrency.$error.maxlength">超过3位</span>
                    </div>
                </div>
            <%}else if("tb172.html"==value){%>
                <div class="form-group   has-success has-feedback">
                    <label  class="col-sm-3 control-label">大客户编码</label>
                    <div class="col-sm-6">
                        <input type="text" ng-model="rowData.accountCode" class="form-control input-sm"  aria-describedby="inputSuccess2Status">
                        <span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
                    </div>
                    <div class="col-sm-3 pt_tip">
                        <span class = "text-danger">必填项</span>
                    </div>
                </div>
            <%}else if("tb173Ticket.html"==value){%>
                <div class="form-group   has-success has-feedback">
                    <label  class="col-sm-3 control-label">指定客票</label>
                    <div class="col-sm-6">
                        <input type="text" ng-model="rowData.ticketDesignator" class="form-control input-sm"  aria-describedby="inputSuccess2Status">
                        <span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
                    </div>
                    <div class="col-sm-3 pt_tip">
                        <span class = "text-danger">必填项</span>
                    </div>
                </div>
            <%}else if("tb183.html"==value){%>
                <div class="form-group   has-success has-feedback">
                    <label  class="col-sm-3 control-label">旅行社</label>
                    <div class="col-sm-6">
                        <input type="text" ng-model="rowData.travelAgency" class="form-control input-sm"  aria-describedby="inputSuccess2Status">
                        <span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
                    </div>
                    <div class="col-sm-3 pt_tip">
                        <span class = "text-danger">必填项</span>
                    </div>
                </div>
                <div class="form-group   has-success has-feedback">
                    <label  class="col-sm-3 control-label">航空公司、分销商</label>
                    <div class="col-sm-6">
                        <input type="text" ng-model="rowData.carrierGds" class="form-control input-sm"  aria-describedby="inputSuccess2Status">
                        <span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
                    </div>
                    <div class="col-sm-3 pt_tip">
                        <span class = "text-danger">必填项</span>
                    </div>
                </div>
                <div class="form-group   has-success has-feedback">
                    <label  class="col-sm-3 control-label">职责、功能码</label>
                    <div class="col-sm-6">
                        <input type="text" ng-model="rowData.dutyFunctionCode" class="form-control input-sm"  aria-describedby="inputSuccess2Status">
                        <span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
                    </div>
                    <div class="col-sm-3 pt_tip">
                        <span class = "text-danger">必填项</span>
                    </div>
                </div>
                <div class="form-group   has-success has-feedback">
                    <label  class="col-sm-3 control-label">区域类型</label>
                    <div class="col-sm-6">
                        <input type="text" ng-model="rowData.geographicSpecificationType" class="form-control input-sm"  aria-describedby="inputSuccess2Status">
                        <span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
                    </div>
                    <div class="col-sm-3 pt_tip">
                        <span class = "text-danger">必填项</span>
                    </div>
                </div>
                <div class="form-group   has-success has-feedback">
                    <label  class="col-sm-3 control-label">区域代码</label>
                    <div class="col-sm-6">
                        <input type="text" ng-model="rowData.geographicSpecification" class="form-control input-sm"  aria-describedby="inputSuccess2Status">
                        <span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
                    </div>
                    <div class="col-sm-3 pt_tip">
                        <span class = "text-danger">必填项</span>
                    </div>
                </div>
                <div class="form-group   has-success has-feedback">
                    <label  class="col-sm-3 control-label">发布对象类型</label>
                    <div class="col-sm-6">
                        <input type="text" ng-model="rowData.codeType" class="form-control input-sm"  aria-describedby="inputSuccess2Status">
                        <span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
                    </div>
                    <div class="col-sm-3 pt_tip">
                        <span class = "text-danger">必填项</span>
                    </div>
                </div>
                <div class="form-group   has-success has-feedback">
                    <label  class="col-sm-3 control-label">发布对象代码</label>
                    <div class="col-sm-6">
                        <input type="text" ng-model="rowData.code" class="form-control input-sm"  aria-describedby="inputSuccess2Status">
                        <span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
                    </div>
                    <div class="col-sm-3 pt_tip">
                        <span class = "text-danger">必填项</span>
                    </div>
                </div>
                <div class="form-group   has-success has-feedback">
                    <label  class="col-sm-3 control-label">权限</label>
                    <div class="col-sm-6">
                        <input type="text" ng-model="rowData.viewBookTkt" class="form-control input-sm"  aria-describedby="inputSuccess2Status">
                        <span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
                    </div>
                    <div class="col-sm-3 pt_tip">
                        <span class = "text-danger">必填项</span>
                    </div>
                </div>
            <%}else{%>
                <h2>表格不支持修改</h2>
            <%}%>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
            <button type="button" ng-click="submitFunc()" ng-disabled = "ocModelForm.$invalid" class="btn btn-primary">提交更改</button>
        </div>
    </div>
</div>



