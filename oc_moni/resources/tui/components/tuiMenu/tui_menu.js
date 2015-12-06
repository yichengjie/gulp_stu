/*
 * 该方法是TUI中负责处理二级菜单的方法。菜单的格式需要在页面上输出基本的样式和结构。
 * 该方法只负责必要的样式处理和部分JS动画
 * @Copyright: Copyright (c) 2011
 * @Company: 中国民航信息网络股份有限公司
 * @author: 马驰  
 * @version 0.10.3
 * @see 
 *	HISTORY
 *  2012/11/28  创建文件
 *  2013/03/12  优化了事件效率。添加选中后的样式
 *  2013/05/02  版本更新。修改了核心架构。目前的menu框架支持了多级菜单的需求。
 *  说明：完全兼容之前版本的DOM结构和写法，对于已经使用该方法的代码，无需修改。
 *   想实现2级以上的菜单，需要在dl外部容器中添加tui_multi_level的class。另外，需要在每个dt和dd元素中添加level="数字"来代表所需的层级。
 *   如：level="3"代表是数结构的第三层。
 *   针对初始化时就需要关闭的菜单，只需要在dt或dd上添加close样式即可。
 *  2013/05/06  版本更新，修改了默认的鼠标点击事件，现在对于已经选中的menu项，再次点击不会去掉选中状态了。
 *   修正了tui_multi_level读取错误的bug。
 *   修正了没有返回this导致的无法链式调用的bug
 *  2013/05/23  版本更新，现在不仅仅是只有叶子节点可以进行点击选中了。带有子节点的父节点也可以被选中。
 *  2013/06/20  版本更新，所有节点都增加了新的class：tui_deactivated，带有该class的节点将不触发该插件中的选中事件。注：不会影响自己绑定的事件
 */
(function($){
	$.fn.tuiMenu=function(){
		var ANIMATETIME=300;//默认动画效果的持续时间
		//参数准备
		var $this=$(this),
			$dl=$('dl',$this),
			$dt=$('dt',$dl),
			$dd=$('dd',$dl),
			$dtdd=$('dt,dd',$dl);
			menuAdv=$('.tui_menu_panel',$this).add($this).hasClass('tui_multi_level');
		//关闭自己的所有子节点的方法
		var closeItem=function($item){
			var $this=$item,
				thisL=$this.attr('level')>>>0,
				isLeaf=$this.hasClass('leaf'),
				$next=$this.next();
				nextL=$next?$next.attr('level')>>>0:0;
			if(!isLeaf){
				$this.removeClass('open close').addClass('close');
				while($next&&nextL>thisL){//关闭所有子节点
					if($next.is(':animated')) return;//如果正在进行动画，则返回，防止出现多次事件
					$next.slideUp(ANIMATETIME);
					$next=$next.next();
					nextL=$next?$next.attr('level')>>>0:0;
				}
			}
			return true;//返回一个true告诉调用者该方法不是因为中间出现问题执行结束了。
		}
		//打开自己的子节点方法，注：该方法会自动递归打开应该打开的所有节点
		var openItem=function($item){
			var $this=$item,
				thisL=$this.attr('level')>>>0,
				isLeaf=$this.hasClass('leaf'),
				$next=$this.next();
				nextL=$next?$next.attr('level')>>>0:0;
			if(!isLeaf){
				if($this.hasClass('open')){//根据当前的状态，来判断当前节点的子节点是否应该被打开，只有被设置为open的才能被打开
					while($next&&nextL>thisL){
						if(nextL==thisL+1){//只有自己的第一层子节点才能被打开，子节点的子节点交给子节点来处理
							if($next.is(':animated')) return;//如果正在进行动画，则返回，防止出现多次事件
							$next.slideDown(ANIMATETIME);
							openItem($next);
						}
						$next=$next.next();
						nextL=$next?$next.attr('level')>>>0:0;
					}
				}
			}
			return true;//返回一个true告诉调用者该方法不是因为中间出现问题执行结束了。
		}
		//添加open和close的样式。对于叶子节点，添加leaf
		var dealLeaf=function($dtdd){
			if(!$dtdd) return;
			for(var i=0;i<$dtdd.length-1;i++){//循环每个节点
				var $this=$dtdd.eq(i),
					thisL=$this.attr('level')>>>0,//当前的level
					$next=$dtdd.eq(i+1),
					nextL=$next.attr('level')>>>0;//下一个的level
				//默认都是打开的。
				if(thisL>=nextL){
					$this.addClass('leaf');
					if($next.is('dt')){//由于样式问题，需要在dt的上一个dd添加一个class来显示边线
						$this.addClass('menu_border_bottom');
					}
				}else{
					$this.addClass('open');//open用于标记该项是非叶子节点菜单，并且该节点是打开的，用于样式的显示
				}
			}
			$dtdd.eq(i).addClass('leaf open');//最后一个必定是叶子节点
		}
		//处理需要默认关闭的非叶子节点，在执行该方法时，必须要执行dealLeaf方法。
		var openOrClose=function($dl){
			var $closes=$('.close',$dl);
			$closes.each(function(){
				var $this=$(this),
					thisL=$this.attr('level')>>>0,
					closeL=thisL+1,
					$next=$this.next(),//用于指向下一个节点
					nextL=$next?$next.attr('level')>>>0:0;
				$this.removeClass('open close').addClass('close');
				while($next&&nextL>thisL){
					if(nextL==closeL){
						$next.hide();
					}
					$next=$next.next();
					nextL=$next?$next.attr('level')>>>0:0;
				}
			});
		}
		//处理默认的鼠标点击事件
		var bindDefault=function($dl){
			$dl.children().off('click.tuiMenu').on('click.tuiMenu',function(){
				var $this=$(this);
				if($this.hasClass('tui_deactivated')){//添加了这个class的节点，将不会做任何事件。
					return;
				}
				//不对是否已经选中进行判断了
				$dl.children().removeClass('selected');
				$this.addClass('selected');
			});
		}
		//处理非叶子节点的点击事件
		var bindClick=function($dl){
			//绑定一级菜单的事件
			$dl.filter(':not(.leaf)').find('.tui_menu_list_icon').off('click.tuiMenu').on('click.tuiMenu',function(){
				var $this=$(this).parent(),
					thisL=$this.attr('level')>>>0,
					closeL=thisL+1,
					$next=$this.next(),//用于指向下一个节点
					nextL=$next?$next.attr('level')>>>0:0,
					isOpen=$this.hasClass('open');
				if(isOpen){//执行收起
					$this.removeClass('open close').addClass('close');
					if(!closeItem($this)){
						$this.removeClass('open close').addClass('open');
					}
				}else{//执行打开
					$this.removeClass('open close').addClass('open');
					if(!openItem($this)){
						$this.removeClass('open close').addClass('close');
					}
				}
			});
		}
		//处理菜单样式，每一个2级菜单添加节点样式
		if(menuAdv){
			//给不同层级菜单增加样式
			$dtdd.each(function(){
				var $this=$(this),
					level=$this.attr('level');
				$this.addClass('level'+level);
			});
		}else{
			$dt.attr('level','1');
			$dd.attr('level','2');
		}
		//---------主方法开始---------
		/*
		 * 处理流程
		 *  通过dealLeaf方法来实现添加叶子节点和非叶子节点的样式。
		 *  通过openOrClose方法来实现需要初始关闭的非叶子节点。
		 *  通过bindDefault方法来实现默认的鼠标点击事件。
		 *  通过bindClick方法来实现各个节点的点击事件。
		 */
		dealLeaf($dtdd);
		openOrClose($dl);
		bindDefault($dl);
		bindClick($dl);
		//-------------------------
		return this;
	}
})(jQuery)