// JavaScript Document
;(function (){
	$.fn.imageMonitor = function (data){
		var $this = $(this).addClass('monitor_panel'),
			panelW = $this.width(),
			panelH = $this.height(),
			panelR = panelW / panelH;
			$inner = $('<div class="inner_panel"></div>').appendTo($this),
			images = [],
			imgCount = data.length;
		
		var prevHtml = '<div class="prev_btn"></div>',
			nextHtml = '<div class="next_btn"></div>',
			loadHtml = '<div class="loading"></div>',
			infoHtml = '<div class="info"></div>',
			$prev = $(prevHtml).appendTo($this),
			$next = $(nextHtml).appendTo($this),
			$load = $(loadHtml).appendTo($this),
			$info = $(infoHtml).appendTo($this);
			
		var infoTimeout;
		
		var iDir,
			maxT = 0,//最多有多少个手指触控了。
			iOrignX = 0, 
			iOrignY = 0;//for ipad
			
		var showInfo = function (str){
			clearTimeout(infoTimeout);
			$info.html(str).fadeIn(300, function (){
				infoTimeout = setTimeout(function (){
					$info.fadeOut(300);
				}, 1000);
			});
		};
		
		var loadPic = function (type){
			var index = $.fn.imageMonitor.currentIndex,
				img = new Image();
			if (imgCount <= 1) {
				return;
			}
			if (index < 0) {
				//index = imgCount - 1;
				index = 0;
				showInfo('已经是最前面的一张了');
				$.fn.imageMonitor.currentIndex = index;
				return;
				
			} else if (index >= imgCount) {
				//index = 0;
				index = imgCount - 1;
				showInfo('已经是最后面的一张了');
				$.fn.imageMonitor.currentIndex = index;
				return;
			}
			$load.show();
			img.onload = function () {
				var imgW = this.width,
					imgH = this.height,
					imgR = imgW / imgH,
					panelW = $this.width(),
					panelH = $this.height(),
					panelR = panelW / panelH,
					width, height;
					
				if (imgR > panelR){
					width = panelW;
					height = width / imgR;
				} else {
					height = panelH;
					width = height * imgR;
				}
				
				var $current = $('.pic_panel.current');
				
				if ($current.length){
					var imgHtml = '<div class="pic_panel">\
									<img src="' + data[index] + '" width="' + width + '" height="' + height + '" />\
								   </div>',
						$newPic = $(imgHtml).appendTo($inner);
					pCenter($('img', $newPic), $inner);
					$current.fadeOut(300,function(){
						$('.pic_panel.current').remove();
						$newPic.addClass('current');
					});
				} else {
					var imgHtml = '<div class="pic_panel current">\
									<img src="' + data[index] + '" width="' + width + '" height="' + height + '" />\
								   </div>';
					$inner.html('').append(imgHtml);
					pCenter($('img', $this), $inner);
				}
				$load.hide();
			}
			img.src = data[index];
			$.fn.imageMonitor.currentIndex = index;
		}
		var pCenter = function ($inner, $panel){
			var iW = $inner.width(),
				iH = $inner.height(),
				pW = $panel.width(),
				pH = $panel.height();
			var left = (pW - iW) / 2,
				top = (pH - iH) / 2;
			left = left > 0 ? left :0;
			top = top > 0 ? top :0;
			$inner.css({left:left, top:top});
		}
		
		$prev.off('click.tuiImageMonitor').on('click.tuiImageMonitor', function () {
			$.fn.imageMonitor.currentIndex--;
			loadPic();
		}).hover(function (){
			$(this).addClass('hover').animate({opacity:1},300);
		}, function (){
			$(this).addClass('hover').animate({opacity:0},300);
		});
		$next.off('click.tuiImageMonitor').on('click.tuiImageMonitor', function () {
			$.fn.imageMonitor.currentIndex++;
			loadPic();
		}).hover(function (){
			$(this).addClass('hover').animate({opacity : 1},300);
		}, function (){
			$(this).addClass('hover').animate({opacity : 0},300);
		});
		
		
		loadPic();
		/*
		 * 在start，move，end的事件中，手指触控的数量可能随时在变。
		 * 例如双手同时接触到屏幕上时，touches的length有可能是1，而如果两个手指稍微有一点时间差，length就是2
		 * 因此，要在这三个事件中都要计算touches数量，以保证正确区分是一个手指还是两个手指
		 */
		var iStart = function (event){
			var c = event.touches.length;
			iOrignX = event.touches[0].pageX;
			iDir = '';
			if (c > maxT){
				maxT = c;
			}
			document.addEventListener("touchmove", iMove);
			document.addEventListener("touchend", iEnd);
		};
		var iMove =function (event){
			var c = event.touches.length;
			var x = event.touches[0].pageX,
				offset = x - iOrignX;
			if (c > maxT){
				maxT = c;
			}
			if (offset > 10) {
				iDir = 'right';
			} else if(offset < -10) {
				iDir = 'left';
			}
		}
		var iEnd = function (event){
			var c = event.touches.length;
			if (c > maxT){
				maxT = c;
			}
			if (maxT == 1){
				if (iDir === 'left') {
					$next.trigger('click');
				} else if (iDir === 'right') {
					$prev.trigger('click');
				}
				iRemoveE();
				maxT = 0;
			} else {
				if (c == 0){
					maxT = 0;
				}
			}
			
		}
		//取消move和end的事件
		var iRemoveE = function (){
			document.removeEventListener('touchmove', iMove);
			document.removeEventListener('touchend', iEnd);
		}
		//绑定ipad事件
		document.addEventListener("touchstart", iStart);
		
	};
	
	$.fn.imageMonitor.currentIndex = 0;
	
	/*var data = [
		'http://www.baidu.com'
	]*/
})($);
