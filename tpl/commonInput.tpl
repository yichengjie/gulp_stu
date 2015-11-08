<div class="form-group col-sm-6 has-feedback" ng-class="{true:'has-error'}[ocForm.fareBasis.$invalid&&ocForm.fareBasis.$dirty]">
    <label  class="col-sm-3 control-label">基础运价</label>
    <div class="col-sm-5">
        <span>
            <input type="text"  upper-input="" name="fareBasis" alphanumeric ng-maxlength="20"
                   ng-model="data.fareBasis" class="form-control input-sm"  placeholder="字母或数字">
        </span>
        <oc-input-valid name = "ocForm.fareBasis"></oc-input-valid>
    </div>
    <div class="col-sm-3 pt_tip" ng-transclude="">
        <span class = "text-danger" ng-show="ocForm.fareBasis.$error.maxlength&&ocForm.fareBasis.$dirty"><small>最大程度超过20位</small></span>
        <span class = "text-danger" ng-show="ocForm.fareBasis.$error.alphanumeric&&ocForm.fareBasis.$dirty"><small>输入字母数字</small></span>
    </div>
</div>