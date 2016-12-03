//显隐
function hideDiv(divID){
	$('#' + divID).hide();
};
function showDiv(divID){
	$('#' + divID).show();
};

//滑入滑出
function slideToggleDiv(divID){
	$('#' + divID).slideToggle();
};
function slideUpDiv(divID){
	$('#' + divID).slideUp();
};
function slideDownDiv(divID){
	$('#' + divID).slideDown();
};

//淡入淡出
function fadeToggleDiv(divID){
	$('#' + divID).fadeToggle();
};
function fadeInDiv(divID){
	$('#' + divID).fadeIn();
};
function fadeOutDiv(divID){
	$('#' + divID).fadeOut();
};

//内容多时用省略号代替
$.fn.extend({  
    displayPart:function () {  
        var displayLength = 100;  
        displayLength = this.attr('displayLength') || displayLength;  
        var text = this.text();  
        if (!text) {
        	return '';
        }
        var result = '';  
        var count = 0;  
        for (var i = 0; i < displayLength; i++) {  
            var _char = text.charAt(i);  
            if (count >= displayLength)  break;  
            if (/[^x00-xff]/.test(_char))  count++;  //双字节字符，//[u4e00-u9fa5]中文  

            result += _char;  
            count++;  
        }  
        if (result.length < text.length) {  
            result += '...';  
        }  
        this.text(result);  
    }  
});


jQuery(function(){
	var win = $(window);
	var winWidth = win.width();
	
	$('.block_edit').css('width',(Math.abs(winWidth - 190)) + 'px');	//自动算查询结果中每个块的宽度
	$('.block_detail').css('width',(Math.abs(winWidth - 170)) + 'px');   //查看详细页面的块
	$('.max_width').css('width',(Math.abs(winWidth - 200 - 120)) + 'px');	//查看详细页面每项内容的宽度
	
	win.resize(function(){
		var win = $(window);
		var newWidth = win.width();
		
		$('.block_edit').css('width',(Math.abs(newWidth - 190)) + 'px');	//改变浏览器尺寸时，调整查询结果中每个块的宽度
		$('.block_detail').css('width',(Math.abs(newWidth - 170)) + 'px');   //查看详细页面的块
		$('.max_width').css('width',(Math.abs(newWidth - 200 - 120)) + 'px');	//查看详细页面每项内容的宽度
	});		
	
	$('.desinfo').displayPart(); //查询结果描述信息多时用省略号代替
});


 

//新增编辑界面，表格显隐控制
function showHideTable(id1,id2){
	var $alink = $('#' + id1);
	
	if($alink.hasClass('showtable')){
		slideDownDiv(id2);
		$alink.html('收起表格');
		$alink.removeClass('showtable');
	}else{
		slideUpDiv(id2);
		$alink.html('填写表格');
		$alink.addClass('showtable');
	}
};

function showHideTable178Loc(id1,id2){
	var $alink = $('#' + id1);
	var str = "";
	var geoSpecLocTypeStr= "";
	var geoSpecLocStr = "";
	var tbody="";
	if(id2=="F_TableNo178Loc1"||id2=="M_TableNo178Loc1"){
		str = "自定义区域1";
		if(id2=="F_TableNo178Loc1"){
			geoSpecLocTypeStr="s7_F_geoSpecLoc1Type";
			geoSpecLocStr="s7_F_geoSpecLoc1";
			tbody ="F_TableNo178Loc1_tbody"; 
		}else{
			geoSpecLocTypeStr="s7_M_geoSpecLoc1Type";
			geoSpecLocStr="s7_M_geoSpecLoc1";
			tbody ="M_TableNo178Loc1_tbody"; 
		}
	}else if(id2=="F_TableNo178Loc2"||id2=="M_TableNo178Loc2"){
		str = "自定义区域2";
		if(id2=="F_TableNo178Loc2"){
			geoSpecLocTypeStr="s7_F_geoSpecLoc2Type";
			geoSpecLocStr="s7_F_geoSpecLoc2";
			tbody ="F_TableNo178Loc2_tbody"; 
		}else{
			geoSpecLocTypeStr="s7_M_geoSpecLoc2Type";
			geoSpecLocStr="s7_M_geoSpecLoc2";
			tbody ="M_TableNo178Loc2_tbody"; 
		}
	}else if(id2=="F_TableNo178Loc3"||id2=="M_TableNo178Loc3"){
		str = "自定义经过区域";
		if(id2=="F_TableNo178Loc3"){
			geoSpecLocTypeStr="s7_F_geoSpecLoc3Type";
			geoSpecLocStr="s7_F_geoSpecLoc3";
			tbody ="F_TableNo178Loc3_tbody"; 
		}else{
			geoSpecLocTypeStr="s7_M_geoSpecLoc3Type";
			geoSpecLocStr="s7_M_geoSpecLoc3";
			tbody ="M_TableNo178Loc3_tbody"; 
		}
	}else{
		str = "自定义区域";
	}
	
	if($alink.hasClass('showtable')){
		slideDownDiv(id2);
		$alink.html('取消自定义');
		$alink.removeClass('showtable');
		if(geoSpecLocTypeStr!=""&&geoSpecLocStr!=""){
			$('#' + geoSpecLocTypeStr).val("");
			$('#' + geoSpecLocStr).val("");
			 $('#' + geoSpecLocTypeStr).attr("disabled","disabled"); 
			 $('#' + geoSpecLocStr).attr("disabled","disabled"); 
		}
	}else{
		slideUpDiv(id2);
		$alink.html(str);
		$alink.addClass('showtable');
		if(tbody!=""&&$alink.attr("disabled")!="disabled"){
			$('#'+tbody).find('tr').remove();
		}
		if(geoSpecLocTypeStr!=""&&geoSpecLocStr!=""&&$alink.attr("disabled")!="disabled"){
			 $('#' + geoSpecLocTypeStr).removeAttr("disabled");
			 $('#' + geoSpecLocStr).removeAttr("disabled");
			 $('#' + geoSpecLocStr).attr('readonly', true);
		}
	}
};

