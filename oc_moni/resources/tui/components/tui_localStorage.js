/**                                                    
 * TUI localStorage为TUI基本组件，该组件主要是封装本地存储方法
 * 目前用到本地存储地方是
   1、记录桌面widget移动的位置               
 * Copyright: Copyright (c) 2012                       
 * Company: 中国民航信息网络股份有限公司               
 * @author  hjdang@travelsky.com 党会建                  
 * @version 0.1 BETA    2012-12-13 
 * @version 1.0     2012-1-18 增加cookie存储                      
 * @see                                                
 *	HISTORY                                            
 * 2012-12-13下午04:08:08 创建文件             
 **************************************************/
;(function($){
	$.tui=$.tui||{};//命名空间
	$.extend($.tui,{
		tuiLocalStorage:function(option){
			var _defaults={//创建新的tab页
				isCookie:false,//使用cookie进行存储
				storageName:"",//存储对象的名称
				storageObject:{},//存储的对象
				verifyObject:{},//验证传入的值是否和本地存储一致
				verifyAttr:[],//需要验证的关键属性，如果不全传入则是全部属性
				id:"",//update 和remove 必须。对象用的索引值
				handle:"set"//一共5个值，set、remove、get、add、update、clear。add是在原有对象上增加一条.clear删除制定的全部存储
			};
			var settings=$.extend({},_defaults,option);//读取默认参数参数
			var storageName=settings.storageName;
			var storageObject=settings.storageObject;
			var verifyObject=settings.verifyObject;
			var verifyAttr=settings.verifyAttr;
			var handle=settings.handle;
			var id=settings.id;
			var isLocalStorage=window.localStorage?true:false;
			if(!isLocalStorage){//不支持则返回,跳转到使用cookie
				return $.tui.tuiLocalStorageCookie({storageName:storageName,storageObject:storageObject,verifyObject:verifyObject,verifyAttr:verifyAttr,id:id,handle:handle});
			}
			if(settings.isCookie){//直接使用cookie
				return $.tui.tuiLocalStorageCookie({storageName:storageName,storageObject:storageObject,verifyObject:verifyObject,verifyAttr:verifyAttr,id:id,handle:handle});
			}
			//验证是否为json对象
			var isJSON=function(obj){
				var result=false;
				if(obj&&Object.prototype.toString.call(obj)==="[object Object]"&&!obj.length){
				 	result=true;	
				}
				return result;
			};
			//内部函数开始
			var addObjcet=function(){
				var localStorageVlaue=window.localStorage.getItem(storageName);
				if(!localStorageVlaue){
					window.localStorage.setItem(storageName,JSON.stringify(storageObject));
				}else {
					try{
						var allObject=JSON.parse(localStorageVlaue);
						for (var index in storageObject){
							allObject[index]=storageObject[index];
						}
						window.localStorage.setItem(storageName,JSON.stringify(allObject));
					}
					catch(e){
						
						return null;
					}
				}
			};//addObjcet结束
			//升级对象，需要传入索引值
			var updateObjcet=function(){
				var localStorageVlaue=window.localStorage.getItem(storageName);
				if(!localStorageVlaue||!id){
					return null;
				}else {
					try{
						var allObject=JSON.parse(localStorageVlaue);
						if(!isJSON(storageObject)){
							allObject[id]=storageObject;
						}else {
							for(var i  in storageObject){
								allObject[id][i]=storageObject[i];
							}
						}
						window.localStorage.setItem(storageName,JSON.stringify(allObject));
					}
					catch(e){
						return null;
					}
				}
			};//updateObjcet结束
			//删除对象，直接传入索引就行
			var removeObjcet=function(){
				var localStorageVlaue=window.localStorage.getItem(storageName);
				if(!localStorageVlaue||!id){
					return null;
				}else {
					try{
						var allObject=JSON.parse(localStorageVlaue);
						delete allObject[id];
						window.localStorage.setItem(storageName,JSON.stringify(allObject));
					}
					catch(e){
						return null;
					}
				}
			};//removeObjcet结束
			var getObjcet=function(){
				var localStorageVlaue=window.localStorage.getItem(storageName);
				if(!localStorageVlaue){
					return null;
				}
				try{
					return JSON.parse(localStorageVlaue);
				}catch(e){
					return null;
				}
				
			};//getObjcet结束
			var getObjcetById=function(){
				var localStorageVlaue=window.localStorage.getItem(storageName);
				if(!localStorageVlaue||!id){
					return null;
				}
				try{
					var storageObject=JSON.parse(localStorageVlaue);
					var result =new Object;
					result[id] =new Object;
					result[id] =storageObject[id];
					return result;
				}catch(e){
					return null;
				}
			};//getObjcet结束
			var setObjcet=function(){
				try{
					window.localStorage.setItem(storageName,JSON.stringify(storageObject));
					return 1;
				}
				catch(e){
					return null;
				}
				
			};//setObjcet结束
			var clearObjcet=function(){
				try{
					window.localStorage.removeItem(storageName);
					return 1;
				}
				catch(e){
					return null;
				}
				
			};//clearObjcet结束
			var  isConsistent=function(){
				if(!verifyObject){
					return false;
				}
				var localStorageVlaue=window.localStorage.getItem(storageName);
				try{
					var local=JSON.parse(localStorageVlaue);
				}catch(e){
					return false;
				}
				//验证是否和数据库中的id值一致
				if(local){//调整窗口时不执行
					var i=0;
					for(var localId in local){
						i++;
					}
					var j=0;
					for(var verifyId in verifyObject){
						j++;
						try{
							if(verifyAttr){
								for(var jj=0;jj<verifyAttr.length;jj++){
									var attr=verifyAttr[jj];
									if(local[verifyId][attr]!==verifyObject[verifyId][attr]){
										return false;
										break;	
									}	
								}
							}else {
								if(local[verifyId]!==verifyObject[verifyId]){
									return false;
									break;	
								}	
							}
						}catch(e){
							return false;
							break;
						}
					}
					if(i!=j){
						return false;
					}
				}else {return false;}
				
				return true;
				
			};
			//执行函数
			switch (handle){
				case "add":
				return addObjcet();
				break;
				;
				case "update":
				return updateObjcet();
				break;
				;
				case "set":
				return setObjcet();
				break;
				;
				case "remove":
				return removeObjcet();
				break;
				;
				case "get":
				return getObjcet();
				break;
				case "getById":
				return getObjcetById();
				break;
				case "clear":
				return clearObjcet();
				break;
				;
				case "consistent"://验证传入的数据关键值是否一样
				return isConsistent();
				break;
			}
			/****如果不支持本地存在则使用cookie*****/			
		},//tuiLocalStorage结束
		tuiLocalStorageCookie:function(option){
			var _defaults={//创建新的tab页
				storageName:"",//存储对象的名称
				storageObject:{},//存储的对象
				verifyObject:{},//验证传入的值是否和本地存储一致
				verifyAttr:[],//需要验证的关键属性，如果不全传入则是全部属性
				id:"",//update 和remove 必须。对象用的索引值
				handle:"set"//一共5个值，set、remove、get、add、update、clear。add是在原有对象上增加一条.clear删除制定的全部存储
			};
			var settings=$.extend({},_defaults,option);//读取默认参数参数
			var storageName=settings.storageName;
			var storageObject=settings.storageObject;
			var verifyObject=settings.verifyObject;
			var verifyAttr=settings.verifyAttr;
			var id=settings.id;
			//添加cookie
			var setCookie=function(c_name,value,expiredays)
			{
				var exdate=new Date()
				if(expiredays==null){
					expiredays=30;//默认是30天
				}
				exdate.setDate(exdate.getDate()+expiredays)
				cookieVal=c_name+ "=" +escape(value)+";expires="+exdate.toGMTString();
				document.cookie=cookieVal;
				console.log(document.cookie);
			};
			//获取cookie
			function getCookie(c_name)
			{
				if (document.cookie.length>0)
				  {
				  c_start=document.cookie.indexOf(c_name + "=")
				  if (c_start!=-1)
					{ 
					c_start=c_start + c_name.length+1 
					c_end=document.cookie.indexOf(";",c_start)
					if (c_end==-1) c_end=document.cookie.length
			//        document.write(document.cookie.substring(c_start,c_end)+"<br>");
					return unescape(document.cookie.substring(c_start,c_end))
					} 
				  }
				return ""
			};
						//删除cookies
			function delCookie(name)
			{
			   var exp = new Date();
			   exp.setTime(exp.getTime() - 1);
			   var cval=getCookie(name);
			   if(cval!=null)
				  document.cookie= name + "="+cval+";expires="+exp.toGMTString();
			}
			//验证是否为json对象
			var isJSON=function(obj){
				var result=false;
				if(obj&&Object.prototype.toString.call(obj)==="[object Object]"&&!obj.length){
				 	result=true;	
				}
				return result;
			};
			//内部函数开始
			var addObjcet=function(){
				var localStorageVlaue=getCookie(storageName);
				if(!localStorageVlaue){
					setCookie(storageName,JSON.stringify(storageObject));
				}else {
					try{
						var allObject=JSON.parse(localStorageVlaue);
						for (var index in storageObject){
							allObject[index]=storageObject[index];
						}
					
						setCookie(storageName,JSON.stringify(allObject));
					}
					catch(e){
						return null;
					}
				}
			};//addObjcet结束
			//升级对象，需要传入索引值
			var updateObjcet=function(){
				var localStorageVlaue=getCookie(storageName);
				if(!localStorageVlaue||!id){
					return null;
				}else {
					try{
						var allObject=JSON.parse(localStorageVlaue);
						if(!isJSON(storageObject)){
							allObject[id]=storageObject;
						}else {
							for(var i  in storageObject){
								allObject[id][i]=storageObject[i];
							}
						}
						setCookie(storageName,JSON.stringify(allObject));
					}
					catch(e){
						return null;
					}
				}
			};//updateObjcet结束
			//删除对象，直接传入索引就行
			var removeObjcet=function(){
				var localStorageVlaue=getCookie(storageName);
				if(!localStorageVlaue||!id){
					return null;
				}else {
					try{
						var allObject=JSON.parse(localStorageVlaue);
						delete allObject[id];
						setCookie(storageName,JSON.stringify(allObject));
					}
					catch(e){
						return null;
					}
				}
			};//removeObjcet结束
			var getObjcet=function(){
				var localStorageVlaue=getCookie(storageName);
				if(!localStorageVlaue){
					return null;
				}
				try{
					return JSON.parse(localStorageVlaue);
				}catch(e){
					return null;
				}
				
			};//getObjcet结束
			var getObjcetById=function(){
				var localStorageVlaue=getCookie(storageName);
				if(!localStorageVlaue||!id){
					return null;
				}
				try{
					var storageObject=JSON.parse(localStorageVlaue);
					var result =new Object;
					result[id] =new Object;
					result[id] =storageObject[id];
					return result;
				}catch(e){
					return null;
				}
			};//getObjcet结束
			var setObjcet=function(){
				try{
					setCookie(storageName,JSON.stringify(storageObject));
					return 1;
				}
				catch(e){
					return null;
				}
				
			};//setObjcet结束
			var clearObjcet=function(){
				try{
					delCookie(storageName);
					return 1;
				}
				catch(e){
					return null;
				}
				
			};//clearObjcet结束
			var  isConsistent=function(){
				if(!verifyObject){
					return false;
				}
				var localStorageVlaue=getCookie(storageName);
				try{
					var local=JSON.parse(localStorageVlaue);
				}catch(e){
					return false;
				}
				//验证是否和数据库中的id值一致
				if(local){//调整窗口时不执行
					var i=0;
					for(var localId in local){
						i++;
					}
					var j=0;
					for(var verifyId in verifyObject){
						j++;
						try{
							if(verifyAttr){
								for(var jj=0;jj<verifyAttr.length;jj++){
									var attr=verifyAttr[jj];
									if(local[verifyId][attr]!==verifyObject[verifyId][attr]){
										return false;
										break;	
									}	
								}
							}else {
								if(local[verifyId]!==verifyObject[verifyId]){
									return false;
									break;	
								}	
							}
						}catch(e){
							return false;
							break;
						}
					}
					if(i!=j){
						return false;
					}
				}else {return false;}
				
				return true;
				
			};
			//执行函数
			var handle=settings.handle;
			switch (handle){
				case "add":
				return addObjcet();
				break;
				;
				case "update":
				return updateObjcet();
				break;
				;
				case "set":
				return setObjcet();
				break;
				;
				case "remove":
				return removeObjcet();
				break;
				;
				case "get":
				return getObjcet();
				break;
				case "getById":
				return getObjcetById();
				break;
				case "clear":
				return clearObjcet();
				break;
				;
				case "consistent"://验证传入的数据关键值是否一样
				return isConsistent();
				break;
			}
		}//tuiLocalStorageCookie结束
	});//extend结束
})(jQuery);