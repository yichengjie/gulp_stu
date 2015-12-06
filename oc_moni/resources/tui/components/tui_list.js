/**                                                    
 * TUIList为TUI基本组件，该组件使用JS方法实现了链表的部分功能，具有链表的部分特性。该链表为双向链表，但是目前版本中的检索和查找都是按照单项实现的。
 *  该组件可以被其他模块使用，目前使用在首页的快捷栏中（dock），用于实现记录应用按钮的位置关系                     
 * Copyright: Copyright (c) 2012                       
 * Company: 中国民航信息网络股份有限公司               
 * @author  cma@travelsky.com 马驰                  
 * @version 0.9.1BETA 
 * @version 1.2 2012-12-26 覆盖为新的                        
 * @see                                                
 *	HISTORY                                            
 * 2012-5-29下午04:08:08 创建文件             
 **************************************************/
//TUINode节点数据结构，simple是用于dockbar时使用的特征数据
function TUINode(data,next,prev){
	this.data=data;
	this.next=next;
	this.prev=prev;
	this.simple=true;
}
//TUIList的链表结构
function TUIList(){
	this.head=new TUINode('',null);//头结点
	this.count=0;//个数
	this.last=this.head;
	this.cacheNode=null;//临时存储的节点
}
TUIList.prototype.getLast=function(){//获得最后一个节点
	var last=this.head;
	for(var i=0;i<this.count;i++){
		last=last.next;
	}
	return last;
}
TUIList.prototype.add=function(node){//在末尾添加一个节点
	if(!(node instanceof TUINode))
		return false;
	this.last.next=node;
	this.count++;
	node.prev=this.last;
	this.last=node;
}
TUIList.prototype.get=function(index){//获得某个节点
	if(index>=this.count)
		return null;
	var cur=this.head;
	for(var i=0;i<=index;i++){
		cur=cur.next;
	}
	return cur;
}
TUIList.prototype.deleteAt=function(index){//删除某个节点
	if(null==index||index>=this.count||index<0)
		return null;
	var cur=this.head;
	for(var i=0;i<index;i++){
		cur=cur.next;
	}
	var willDel=cur.next
	var afterTUINode=willDel.next;
	cur.next=afterTUINode;
	try{
		afterTUINode.prev=cur;
	}catch(e){}
	willDel=null;
	this.count--;
	this.last=this.getLast();
}
TUIList.prototype.deleteNode=function(data){//删除某个data值的节点
	this.deleteAt(this.findData(data));
}
TUIList.prototype.printNode=function(){//打印某个节点
	var cur=this.head;
	var info="";
	for(var i=0;i<this.count;i++){
		cur=cur.next;
		info+=i+":"+cur.data+"|";
	}
	return info;
}
TUIList.prototype.addAt=function(index,node){//在某个位置加上一个节点
	if(!(node instanceof TUINode))
		return null;
	if(index>this.count)
		return null;
	var cur=this.head;
	for(var i=0;i<index;i++){
		cur=cur.next;
	}
	var nextTUINode=cur.next;
	cur.next=node;
	node.next=nextTUINode;
	node.prev=cur;
	try{
		nextTUINode.prev=node;
	}catch(e){}
	this.count++;
	this.last=this.getLast();
}
TUIList.prototype.find=function(node){//找某个节点在链表中的位置
	if(!(node instanceof TUINode))
		return null;
	var cur=this.head;
	var f=-1;
	for(var i=0;i<this.count;i++){
		cur=cur.next;
		if(cur===node){
			f=i;
			break;
		}
	}
	return f;
}
TUIList.prototype.setCache=function(index){//设置一个需要临时保存的节点
	this.cacheNode=this.get(index);
}
TUIList.prototype.deleteCache=function(){//将缓存中所指向的节点删除
	var prev=this.cacheNode.prev;
	var next=this.cacheNode.next;
	prev.next=next;
	this.count--;
	try{//用try的原因是如果catch是最后一个节点时，不报错
		next.prev=prev;
	}catch(e){}
	this.cacheNode.prev=null;
	this.cacheNode.next=null;
	//this.cacheNode=null;
}
TUIList.prototype.changeCatchNode=function(index){//将缓存所指向的节点交换到index所指定的位置
	if(index>=this.count)
		return null;
	if(null==this.cacheNode)
		return null;
	this.deleteCache();
	this.addAt(index,this.cacheNode);
	//先判断index是在cache之前还是之后
}
TUIList.prototype.findData=function(str){//根据data部分找到节点，如果没有找到，则返回-1
	if(!str||str=="")
		return null;
	var cur=this.head;
	var i=-1;
	for(j=0;j<this.count;j++){
		cur=cur.next;
		if(cur.data==str){
			i=j;
			break;
		}
	}
	return i;
}
//以下由党会建扩展
TUIList.prototype.findNodeByData=function(str){//根据data部分找到节点，返回node,如果没有找到，则返回null
	if(!str||str=="")
		return null;
	var cur=this.head;
	for(var i=0;i<this.count;i++){
		cur=cur.next;
		if(cur.data==str){
		   return cur;
		}
	}
	return null;
}

//节点交换位置
TUIList.prototype.changePosition=function(data1,data2){
	var index1 = this.findData(data1);
	var node1  = this.findNodeByData(data1);
    var index2 = this.findData(data2);
	var node2  = this.findNodeByData(data2);
	if(!(node1 instanceof TUINode&&node2 instanceof TUINode))
		return null;
	if(index2>index1){
	  this.deleteAt(index2);
	  this.deleteAt(index1);//需要先删大的，
	  this.addAt(index1,node2);//加，先加小的
	  this.addAt(index2,node1);
	}else {
	  this.deleteAt(index1);
	  this.deleteAt(index2);
	  this.addAt(index2,node1);
	  this.addAt(index1,node2);
		}
	return{index1:index2,index2:index1};//返回交换后的位置。	
}