/**
 * 分页标签的处理函数
 */
var PageNavigation = {
		
		/**
		 * 跳转到指定页
		 */
		goToPage:function(func, totalPage, obj){
			var page;
			if (obj) {
				page = $('input:text', $(obj).parent()).val();
			} else {
				page = $("#toPage").val();
			}
			if(isNaN(page)){
				page = 0;
			}
			// 输入页数大于总页数时跳转的最后一页
			if(page > totalPage){
				$("#toPage").val(totalPage);
				page = totalPage;
			}
			func(page);
		}
};