$().ready(function() {//start ready

 var validator = $("#signupForm").validate({
    meta : "validate",
    submitHandler:function(form){
       alert('提交表单') ;
       //form.submit();
    }
   //,onsubmit:false//Onubmit：类型 Boolean，默认 true，指定是否提交时验证
   ,ignore:".ignore"
 });


 $("#reset").bind("click", function(e){
    console.info('重置表单') ;
    var target = $(e.target);
    if(target.is(':reset')){
      console.info('我是reset') ;
    }else if (target.is(':button')){
      console.info('我是button') ;
    }else if(target.is(':input')){
      console.info('我是input') ;
    }else{
      console.info('我是other') ;
    }
    //把前面验证的 FORM 恢复到验证前原来的状态。
    validator.resetForm() ;
 });

 $("#valid2").bind("click",function (e) {
   console.info('手动校验表单') ;
  //直接用来校验表单 同 下面的  validator.form()函数
  var flag = $("#signupForm").valid() ;
  console.info(flag) ;
  //返回元素的校验规则
  //var rules = $("#email").rules() ;
  //console.info(rules) ;
  //验证表单是否校验通过
  //var flag2 = validator.form() ;
  //console.info(flag2) ;
  //验证单个元素成功或失败
  //var flag3 = validator.element($("#email")) ;
  //console.info(flag3) ;
  //把前面验证的 FORM 恢复到验证前原来的状态。
  //validator.resetForm() ;
 })  ;

});//end ready

