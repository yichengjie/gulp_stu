/**
 * 双向选择列表控件
 * @author TanDong
 */
/**
 * 添加选择的项
 * @param objSource 元数据
 * @param objTarget 目标数据
 */   
function addItem(objSource, objTarget, objTargetHidden, addHidden) {   
   if(objSource.val() ==null) {
	   if($.showTsInfoDialog){
		   $.showTsInfoDialog("请至少选择一项。");
	   }else if($.showTuiMessageDialog){
		   $.showTuiMessageDialog('请至少选择一项');
	   }
	   return;    // 如果没有选择则退出函数，无这句话的话IE6会报错
   }   
   $.each(objSource.find("option:selected"), function(){
	   // 不存在此项则添加
	   if(checkOption(objTarget, $(this).val()) == false){
			var html = "<option value='" + $(this).val() + "'>" + $(this).text() + "</option>";
			objTarget.append(html);
			
			$("#"+objTarget.attr("id")+"Btn").removeAttr("disabled");
			$("#all"+objTarget.attr("id")+"Btn").removeAttr("disabled");
			
			if(addHidden == true){
				var htmlHidden = "<option selected value='" + $(this).val() + "'>" + $(this).text() + "</option>"; 
				objTargetHidden.append(htmlHidden); 
			}else{
				objTargetHidden.find("option[value="+$(this).val()+"]").remove();
			}
			objSource.find("option:selected").remove();  // 原列表中选中的值删除 
			
			if(objSource.find("option").length <= 0){
				$("#"+objSource.attr("id")+"Btn").attr("disabled", "true");
				$("#all"+objSource.attr("id")+"Btn").attr("disabled", "true");
			}
	   }
		
   }); 
};   

/**
 * 检查是否存在某项
 * @param s select元素
 * @param v option的值
 * @returns {Boolean} 是否存在此项
 */
function checkOption(s, v){
	var opts = s.find("option[value="+v+"]");
	if(opts.length > 0){
		return true;
	}else{
		return false;
	}
};

/**
 * 添加全部
 * @param objSource 元数据
 * @param objTarget 目标数据
 */  
function addAllItem(objSource, objTarget, objTargetHidden, addHidden) {  
	$.each(objSource.find("option"), function(i,n){
		if(checkOption(objTarget, $(this).val()) == false){
			var html = "<option value='" + $(this).val() + "'>" + $(this).text() + "</option>";
			objTarget.append(html);
		}
		
		$("#"+objTarget.attr("id")+"Btn").removeAttr("disabled");
		$("#all"+objTarget.attr("id")+"Btn").removeAttr("disabled");
		
		if(addHidden == true){
			if(checkOption(objTargetHidden, $(this).val()) == false){
				var htmlHidden = "<option selected value='" + $(this).val() + "'>" + $(this).text() + "</option>";
				objTargetHidden.append(htmlHidden);
			}
		}else{
			objTargetHidden.find("option[value="+$(this).val()+"]").remove();
		}
	});
	
	objSource.empty();  // 原列表清空  
	
	$("#"+objSource.attr("id")+"Btn").attr("disabled", "true");
	$("#all"+objSource.attr("id")+"Btn").attr("disabled", "true");
} 