	(function($) {

		$.suggest = function(input, options) {
			var $input = $(input).attr("autocomplete", "off");
			var $results;

			var timeout = false;		// hold timeout ID for suggestion results to appear	
			var prevLength = 0;			// last recorded length of $input.val()
			var cache = [];				// cache MRU list
			var cacheSize = 0;			// size of cache in chars (bytes?)
			
			if( ! options.attachObject )
				options.attachObject = $(document.createElement("ul")).appendTo('body');

			$results = $(options.attachObject);
			$results.addClass(options.resultsClass);
			
			resetPosition();
			$(window)
				.load(resetPosition)		// just in case user is changing size of page while loading
				.resize(resetPosition);

			$input.blur(function() {
				setTimeout(function() { $results.hide() }, 200);
			});
			
			$input.focus(function(){
				if($.trim($(this).val())=='中文/拼音'){
					$(this).val('').css('color','#000');
				}
				if($.trim($(this).val())==''){
					displayItems('');//显示热门城市列表
				}
				//马驰添加，为防止初始化DOM对象为不可见时，无法正确定位，因此在每次获得焦点时重新定位一次
				resetPosition();
			});
			//马驰添加，为input边上的按钮添加事件，让按钮也触发click事件
			$input.parent().find('.input_select_btn').click(function(){
				$input.trigger('focus');
			});
			
			$input.click(function(){
				var q=$.trim($(this).val());
				displayItems(q);
				$(this).select();
			});
						
			// help IE users if possible
			try {
				$results.bgiframe();
			} catch(e) { }

			$input.keyup(processKey);//
			
			function resetPosition() {
				// requires jquery.dimension plugin
				var offset = $input.position(),
					resW=($results.width()-$input.width())/2,
					top=offset.top+input.offsetHeight+10,
					left=offset.left-resW;
				//12-09-26马驰修改，由于新样式较宽，因此如果为负数，就必须要纠正
				top=top>=0?top:0;
				left=left>=4?left:4;//新样式边界要多出4px
				$results.css({
					top: top + 'px',
					left: left + 'px'
				});
			}
			
			
			function processKey(e) {
				
				// handling up/down/escape requires results to be visible
				// handling enter/tab requires that AND a result to be selected
				if ((/27$|38$|40$/.test(e.keyCode) && $results.is(':visible')) ||
					(/^13$|^9$/.test(e.keyCode) && getCurrentResult())) {
		            
		            if (e.preventDefault)
		                e.preventDefault();
					if (e.stopPropagation)
		                e.stopPropagation();

	                e.cancelBubble = true;
	                e.returnValue = false;
				
					switch(e.keyCode) {
	
						case 38: // up
							prevResult();
							break;
				
						case 40: // down
							nextResult();
							break;
						case 13: // return
							selectCurrentResult();
							break;
							
						case 27: //	escape
							$results.hide();
							break;
	
					}
					
				} else if ($input.val().length != prevLength) {

					if (timeout) 
						clearTimeout(timeout);
					timeout = setTimeout(suggest, options.delay);
					prevLength = $input.val().length;
					
				}			
					
				
			}
			
			function suggest() {
			
				var q = $.trim($input.val());
				displayItems(q);
			}		
			function displayItems(items) {
				var outerhtml='<div class="popup_top">\
										<div class="top_left"></div>\
										<div class="top_middle"></div>\
										<div class="top_right"></div>\
									</div>\
									<div class="popup_content">\
										<div class="content_left"></div>\
										<div class="content">';
				var html='';						
				if (items=='') {//热门城市遍历
					for(h in options.hot_list){
						//                                                                   箭头所指内容为石振中修改:↓,之前该处的索引为2,取机场拼音的值,这里改为0,取城市三字码
						html += '<li rel="' + options.hot_list[h][0]+'"><a href="#'+h+'"><span>'+options.hot_list[h][0]+'</span>'+ options.hot_list[h][1]+'</a></li>';
					}
					html='<div class="city_select_tip">请输入中文/拼音或者↑↓选择</div><ul>'+html+'</ul>';
				}
				else {
					/*if (!items)
					return;
					if (!items.length) {
						$results.hide();
						return;
					}*/
					for (var i = 0; i < options.source.length; i++) {//国内城市匹配
						// 石振中修改：将items中的三字码及’/‘号去掉，用于匹配
						var reg = new RegExp('^' + items + '.*$', 'im');
						if (reg.test(options.source[i][0]) || reg.test(options.source[i][1]) || reg.test(options.source[i][2]) || reg.test(options.source[i][3])) {
							//                                                                       箭头所指内容为石振中修改:↓,之前该处的索引为2,取机场拼音的值,这里改为0,取城市三字码
							html += '<li rel="' + options.source[i][0] + '"><a href="#' + i + '"><span>' + options.source[i][0] + '</span>' + options.source[i][1] + '</a></li>';
						}
					}
					if (html == '') {
						suggest_tip = '<div class="city_select_tip">对不起，找不到：' + items + '</div>';
					}
					else {
						suggest_tip = '<div class="city_select_tip">' + items + '，按拼音排序</div>';
					}
					html = suggest_tip + '<ul>' + html + '</ul>';
				}
				outerhtml+=html;
				outerhtml+='</div>\
                                    <div class="content_right"></div>\
									</div>\
										<div class="popup_bottom">\
										<div class="bottom_left"></div>\
										<div class="bottom_right"></div>\
									</div>';
				$results.html(outerhtml).show();
				//修改：1107，马驰，去掉下拉菜单的默认选项
				//$results.children('ul').children('li:first-child').addClass(options.selectClass);
				var $allLi=$results.find('.content').children('ul').children('li');
				$allLi.mouseover(function() {
					$allLi.removeClass(options.selectClass);
					$(this).addClass(options.selectClass);
				}).click(function(e) {
					e.preventDefault(); 
					e.stopPropagation();
					selectCurrentResult();
				});
				//120913，马驰添加，由于下拉城市选框左右边框不能自适应高度，因此需要通过js来控制高度
				var borderHeight=$results.find('.popup_content').height();
				$results.find('.content_left').css({height:(borderHeight-2)});
				$results.find('.content_right').css({height:(borderHeight-2)});
					
			}
						
			function getCurrentResult() {
			
				if (!$results.is(':visible'))
					return false;
				var $currentResult = $results.find('.content').children('ul').children('li.' + options.selectClass);
				if (!$currentResult.length)
					$currentResult = false;
				return $currentResult;

			}
			
			function selectCurrentResult() {
			
				$currentResult = getCurrentResult();
				if ($currentResult) {
					// 石振中注释掉该行,之前的显示内容为机场中文名
					//$input.val($currentResult.children('a').html().replace(/<span>.+?<\/span>/i,''));
					// 石振中添加该行,现在的显示内容为机场三字码
					$input.val($currentResult.children('a').html().replace(/^<span>/i,'').replace(/<\/span>.*?$/i, ''));
					$results.hide();

					if( $(options.dataContainer) ) {
						$(options.dataContainer).val($currentResult.attr('rel'));
					}
	
					if (options.onSelect) {
						options.onSelect.apply($input[0]);
					}
					$input.change();
				}
			
			}
			
			function nextResult() {
			
				$currentResult = getCurrentResult();
			
				if ($currentResult)
					$currentResult
						.removeClass(options.selectClass)
						.next()
							.addClass(options.selectClass);
				else
					$results.find('.content').children('ul').children('li:first-child').addClass(options.selectClass);
			
			}
			
			function prevResult() {
			
				$currentResult = getCurrentResult();
			
				if ($currentResult)
					$currentResult
						.removeClass(options.selectClass)
						.prev()
							.addClass(options.selectClass);
				else
					$results.find('.content').children('ul').children('li:last-child').addClass(options.selectClass);
			
			}
	
		}
		
		$.fn.suggest = function(source, options) {
		
			if (!source)
				return;
		
			options = options || {};
			options.source = source;
			options.hot_list=options.hot_list || [];
			options.delay = options.delay || 0;
			options.resultsClass = options.resultsClass || 'city_select';
			options.selectClass = options.selectClass || 'city_select_hover';
			options.matchClass = options.matchClass || 'ac_match';
			options.minchars = options.minchars || 1;
			options.delimiter = options.delimiter || '\n';
			options.onSelect = options.onSelect || false;
			options.dataDelimiter = options.dataDelimiter || '\t';
			options.dataContainer = options.dataContainer || '#SuggestResult';
			options.attachObject = options.attachObject || null;
	
			this.each(function() {
				new $.suggest(this, options);
			});
	
			return this;
			
		};
		
	})(jQuery);