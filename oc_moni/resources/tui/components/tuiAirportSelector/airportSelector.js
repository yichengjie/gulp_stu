/**
 * @author 石 振中
 */

/**
 * 
 */
function AirportSelector(url) 
{
	this.url = url;
	this.cityInputs;
	this.allCities = new Array();
	this.hotCities = new Array();
	// 热点城市
	this.commonCities = {
					'PEK':1,
			        'SHA':2,
		        	'CAN':3,
					'SZX':4,
					'CTU':5,
					'HGH':6,
					'CSX':7,
					'XIY':8,
					'CKG':9,
					'TAO':10,
					'NKG':11,
					'WUH':12,
					'SYX':13,
					'KMG':14,
					'HRB':15
					};
};
/**
 * 绑定需要使用该工具的输入项
 * 
 * @param cities 包含输入项id的数组
 */
AirportSelector.prototype.bind = function(cities)
{
	this.cityInputs = cities;
	if(this.cityInputs && this.cityInputs.length && this.cityInputs.length > 0)
	{
		this.getCityDict();
	}
};

/**
 * 通过AJAX从数据字典中获取机场信息
 */
AirportSelector.prototype.getCityDict = function()
{ 	var acities = this.allCities;
	var hcities = this.hotCities;
	var cinputs = this.cityInputs;
	var ccities = this.commonCities;
	var url = this.url;
	$.ajax({ 				
		url: url, 			  	 
		type: "GET", 				 
		dataType:"json",
		success: function(result)
		{
			var airports = result.airports;
			for(var i in airports)
			{
				var airport = airports[i];
				
				acities.push(new Array(airport.dictCode, airport.dictName, airport.py, airport.py4Short));
				if(ccities[airport.dictCode])
				{
					hcities[ccities[airport.dictCode]]=new Array(airport.dictCode, airport.dictName, airport.py, airport.py4Short);
					//hcities.push(new Array(airport.dictCode, airport.dictName, airport.py, airport.py4Short));
				}
			}
			for(var i in cinputs)
			{
				var cityId = cinputs[i];
				var divId = cityId + "Suggest";
				$('#' + cityId).after('<div id=\'' + divId + '\' class=\'ac_results\' style=\'min-width:200;_width:200px;\'></div>');
				$("#" + cityId).suggest(acities,{
					hot_list:hcities,
					attachObject:"#" + divId
				});
			}
		}
	}); 		
};
