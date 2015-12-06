// Set configuration
seajs.config({
	base : '/oc/scripts/sea-modules',
	alias : {
		'jquery' : 'jquery/jquery/1.10.1/jquery-1.8.2.js',
		'tuiValidator' : 'tui/tuiValidate/tui_validator.js',
		'jqueryuicore' : 'jquery/jquery/1.10.1/jquery-ui-core.js',
		'jqueryuiwidget' : 'jquery/jquery/1.10.1/jquery-ui-widget.js',
		'jqueryuislider' : 'jquery/jquery/1.10.1/jquery-ui-slider.js',
		'jqueryuimouse' : 'jquery/jquery/1.10.1/jquery-ui-mouse.js',
		'angular':'angular/angularjs/1.4.3/angular.js',
		'angular-route':'angular/angularjs/1.4.3/angular-route.js',
		'ui-router':'angular/angularjs/1.4.3/angular-ui-router.js',
		'angular-resource':'angular/angularjs/1.4.3/angular-resource.js',
		'seajs-text': 'seajs/seajs/2.1.1/seajs-text-debug.js',
		'tuiDialog' : 'tui/tuiDialog/tui_dialog.js',
		'datepicker' : 'tui/tuiDatepicker/datepicker.js',
		'jqueryuitimepickeraddon' : 'jquery/jquery/1.10.1/jquery-ui-timepicker-addon.js',
		'underscore':'underscore/1.7.0/underscore.js'
	},
	preload: ['seajs-text'],
	debug: true
});
//console.info('------------------------------------------') ;
//console.log(require.resolve('sea-modules/src/main'));
//console.info(require.resolve('../')) ;
//console.info('------------------------------------------') ;
// For development
if (location.href.indexOf('?dev') > 0) {
	 seajs.use('/oc/scripts/src/edit/main',function(app){
	 	app.init() ;
	 });
}else {
	seajs.use('fare/oc/1.0.0/edit/main',function(app){
		app.init() ; 
	});
}


