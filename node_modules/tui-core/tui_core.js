/*!
 * tui核心基础组件
 * 2013-12-03 增加了isMobile方法，用于判断浏览器是否在ios的移动端
 * 2014-02-08 修改了win8下的IE11判断方法。
 */
;(function( $, undefined ) {

// prevent duplicate loading
// this is only a problem because we proxy existing functions
// and we don't want to double proxy them
$.tui = $.tui || {};
if ( $.tui.version ) {
	return "1.5.0" ;
}
if(!window.console){
	window.console={
		log:function(e){return ;},
		warn:function(e){return;}
	};
}
$.extend( $.tui, {
	version: "1.5.0",//版本控制，在前端eico上线时，发布1.0版本。每个功能修改，测试通过后，发布小数点后一位版本
	keyCode: {
		ALT: 18,
		BACKSPACE: 8,
		CAPS_LOCK: 20,
		COMMA: 188,
		COMMAND: 91,
		COMMAND_LEFT: 91, // COMMAND
		COMMAND_RIGHT: 93,
		CONTROL: 17,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		INSERT: 45,
		LEFT: 37,
		MENU: 93, // COMMAND_RIGHT
		NUMPAD_ADD: 107,
		NUMPAD_DECIMAL: 110,
		NUMPAD_DIVIDE: 111,
		NUMPAD_ENTER: 108,
		NUMPAD_MULTIPLY: 106,
		NUMPAD_SUBTRACT: 109,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SHIFT: 16,
		SPACE: 32,
		TAB: 9,
		UP: 38,
		WINDOWS: 91 // COMMAND
	}
});

// plugins
$.fn.extend({
	//propAttr: $.fn.prop || $.fn.attr,
	_focus: $.fn.focus,//保留原来jquery的focus方法。
	//从新改写focus方法。扩展了jquery focus的方法。传入延迟多长时间，执行函数
	tuiFocus: function( delay, fn ) {
		return typeof delay === "number" ?
			this.each(function() {
				var elem = this;
				setTimeout(function() {
					$( elem ).focus();
					if ( fn ) {
						fn.call( elem );
					}
				}, delay );
			}) :
			this._focus.apply( this, arguments );
	},
 //获取设置滚动属性的 父元素
 //curCSS取得当前的css的值，属于jquery内部的函数，没有在api中体现 // DEPRECATED in 1.3, Use jQuery.css() instead jQuery.curCSS = jQuery.css;
 //// 读取样式值css: function( elem, name, extra )  jQuery.css() 
	tuiScrollParent: function() {
		var scrollParent;
	if (($.browser.msie && (/(static|relative)/).test(this.css('position'))) || (/absolute/).test(this.css('position'))) {//ie同时相对定位或者绝对定位
			scrollParent = this.parents().filter(function() {
				return (/(relative|absolute|fixed)/).test($.curCSS(this,'position',1)) && (/(auto|scroll)/).test($.curCSS(this,'overflow',1)+$.curCSS(this,'overflow-y',1)+$.curCSS(this,'overflow-x',1));//fucntion里面的函数，当前的css是否有定位和滚动
			}).eq(0);
		} else {
			scrollParent = this.parents().filter(function() {
				return (/(auto|scroll)/).test($.curCSS(this,'overflow',1)+$.curCSS(this,'overflow-y',1)+$.curCSS(this,'overflow-x',1));
			}).eq(0);
		}
		
		return (/fixed/).test(this.css('position')) || !scrollParent.length ? $(document) : scrollParent;//如果是fixed，不找父元素，无论他有没有
	},
  //设置或获取元素的垂直坐标
	tuiZIndex: function( zIndex ) {
		if ( zIndex !== undefined ) {
			return this.css( "zIndex", zIndex );
		}

		if ( this.length ) {
			var elem = $( this[ 0 ] ), position, value;
			while ( elem.length && elem[ 0 ] !== document ) {
				// Ignore z-index if position is set to a value where z-index is ignored by the browser
				// This makes behavior of this function consistent across browsers
				// WebKit always returns auto if the element is positioned
				position = elem.css( "position" );
				if ( position === "absolute" || position === "relative" || position === "fixed" ) {
					// IE returns 0 when zIndex is not specified
					// other browsers return a string
					// we ignore the case of nested elements with an explicit value of 0
					// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
					value = parseInt( elem.css( "zIndex" ), 10 );
					if ( !isNaN( value ) && value !== 0 ) {
						return value;
					}
				}
				elem = elem.parent();//不断循环找父元素，可以取得父元素的zindex
			}
		}

		return 0;
	},
 //设置元素不支持被选择
	tuiDisableSelection: function() {
		return this.bind( ( $.support.selectstart ? "selectstart" : "mousedown" ) +
			".tui-disableSelection", function( event ) {
				event.preventDefault();
			});
	},
 //设置元素支持被选择
	tuiEnableSelection: function() {
		return this.unbind( ".tui-disableSelection" );
	}
});//$.fn.extend结束
//不需要调用，全局的执行从新定义了innerHeight、innerWidth、outerHeight、outerWidth的方法，可以设置上面的值
$.each( [ "Width", "Height" ], function( i, name ) {
	var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
		type = name.toLowerCase(),//设置css的名称
		orig = {//系统原来的方法
			innerWidth: $.fn.innerWidth,//包括补白不包括边框
			innerHeight: $.fn.innerHeight,
			outerWidth: $.fn.outerWidth,//补白不包括边框
			outerHeight: $.fn.outerHeight
		};
     //返回需要设置的值，是当前元素padding,border上left right top  bottom的值
	function reduce( elem, size, border, margin ) {
		$.each( side, function() {//side是如果宽度是left right，高度是top bottom,就是调整padding,border上left right top  bottom的值
			size -= parseFloat( $.curCSS( elem, "padding" + this, true) ) || 0;
			if ( border ) {
				size -= parseFloat( $.curCSS( elem, "border" + this + "Width", true) ) || 0;
			}
			if ( margin ) {
				size -= parseFloat( $.curCSS( elem, "margin" + this, true) ) || 0;
			}
		});
		return size;
	}
     //从新定义，允许设置值。通过更改传入元素css的"Width", "Height"的值来达到目的， 
	$.fn[ "tuiInner" + name ] = function( size ) {
		if ( size === undefined ) {
			return orig[ "inner" + name ].call( this );
		}
        //inner,仅仅是补白 padding的距离
		return this.each(function() {
			$( this ).css( type, reduce( this, size ) + "px" );
		});
	};
    //outer,是补白和边框，如果设置margin了，就加上margin的距离
	$.fn[ "tuiOuter" + name] = function( size, margin ) {
		if ( typeof size !== "number" ) {
			return orig[ "outer" + name ].call( this, size );
		}

		return this.each(function() {
			$( this).css( type, reduce( this, size, true, margin ) + "px" );
		});
	};
});//each结束

// 内部方法，下面extend会用
function focusable( element, isTabIndexNotNaN ) {
	var nodeName = element.nodeName.toLowerCase();
	if ( "area" === nodeName ) {
		var map = element.parentNode,
			mapName = map.name,
			img;
		if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
			return false;
		}
		img = $( "img[usemap=#" + mapName + "]" )[0];
		return !!img && visible( img );
	}
	return ( /input|select|textarea|button|object/.test( nodeName )
		? !element.disabled
		: "a" == nodeName
			? element.href || isTabIndexNotNaN
			: isTabIndexNotNaN)
		// the element and all of its ancestors must be visible
		&& visible( element );
}
//内部方法
function visible( element ) {
	return !$( element ).parents().andSelf().filter(function() {
		return $.curCSS( this, "visibility" ) === "hidden" ||
			$.expr.filters.hidden( this );
	}).length;
}
//jQuery.expr[":"] = jQuery.expr.filters; 扩展jQuery.expr.filters 的筛选方法，在jquery-1.4.1.js中有其他方法
$.extend( $.expr[ ":" ], {
	data: function( elem, i, match ) {
		return !!$.data( elem, match[ 3 ] );
	},

	focusable: function( element ) {
		return focusable( element, !isNaN( $.attr( element, "tabindex" ) ) );
	},

	tabbable: function( element ) {
		var tabIndex = $.attr( element, "tabindex" ),
			isTabIndexNaN = isNaN( tabIndex );
		return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
	}
});
// 支持信息，扩展support方法
$(function() {
	var body = document.body,
		div = body.appendChild( div = document.createElement( "div" ) );

	// access offsetHeight before setting the style to prevent a layout bug
	// in IE 9 which causes the elemnt to continue to take up space even
	// after it is removed from the DOM (#8026)
	div.offsetHeight;

	$.extend( div.style, {
		minHeight: "100px",
		height: "auto",
		padding: 0,
		borderWidth: 0
	});

	$.support.minHeight = div.offsetHeight === 100;
	$.support.selectstart = "onselectstart" in div;

	// set display to none to avoid a layout bug in IE
	// http://dev.jquery.com/ticket/4014
	body.removeChild( div ).style.display = "none";
});
//自己补充的方法，与原来的jquer ui没有关系。
// 由于win8下的IE11的userAgent字符串变了，所以isIE,isIE11这两个方法的判断依据都需要修改。
$.extend($.tui,{
	isIE:function(){
	   return /MSIE (\d)\./i.test(navigator.userAgent) || /Trident/i.test(navigator.userAgent); //IE浏览器
		},
	isIE6:function(){
	   return /MSIE (\d)\./i.test(navigator.userAgent) && parseInt(RegExp.$1) == 6;
	   },
	isIE7:function(){
		return /MSIE (\d)\./i.test(navigator.userAgent) && parseInt(RegExp.$1) == 7;
	   },
	isIE8:function(){
		return /MSIE (\d)\./i.test(navigator.userAgent) && parseInt(RegExp.$1) == 8;
	   },
	isIE9:function(){
	   return /MSIE (\d)\./i.test(navigator.userAgent) && parseInt(RegExp.$1) == 9;
	   },
	isIE10:function(){
	   return /MSIE (\d*)\./i.test(navigator.userAgent) && parseInt(RegExp.$1) == 10;
	   },
    isIE11:function(){
	   return /rv:(\d*)/i.test(navigator.userAgent) && parseInt(RegExp.$1) == 11;
	   },
	isIE678:function(){
	   return /MSIE (\d)\./i.test(navigator.userAgent) && parseInt(RegExp.$1) < 9;
	   },
	isFirefox:function(){
	   return /firefox\/([\d.]+)/i.test(navigator.userAgent);
	   },
	isChrome:function(){
	   return /chrome\/([\d.]+)/i.test(navigator.userAgent);
	   },
	isSafari:function(){
	   return /safari\/([\d.]+)/i.test(navigator.userAgent);
	   },
	isMobile:function (){//is browser in ipad, iphone, ipod, itouch
		return /ipad|ipod|itouch|iphone/i.test(navigator.userAgent.toLowerCase()) ? true : false;
		},
	showMask:function(maskId,zIndex,top,left,appendObject,eventType,eventFunction,addClass){//显示遮罩，可以给遮罩上绑定事件
		var $doc=$(document);
		var $mask;
		if($('#'+maskId).length<1){//如果没有遮罩
			var maskHTML='<div id="'+maskId+'"style="position:absolute;z-index:'+zIndex+';top:'+top+'px;left:'+left+'px;"></div>';
			$mask= $(maskHTML).appendTo(appendObject);
			if(addClass){
				$mask.addClass(addClass);
			}
		}else {$mask=$('#'+maskId);}
		$mask.css({width:$doc.width()+'px',height:$doc.height()+'px'});
		$mask.show();//显示遮罩层，由于可能是已经存在并且隐藏了。
		$('#'+maskId).off(eventType).on(eventType,eventFunction);//bind事件结束
		return $mask;
		}//showMask方法结束			
	});//自己补充的方法结束
})( jQuery );