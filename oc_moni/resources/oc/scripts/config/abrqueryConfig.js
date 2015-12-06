seajs.config({
	base : '../resources/oc/scripts/sea-modules/',
	alias : {
		'jquery' : 'jquery/jquery/1.10.1/jquery-1.8.2.js',
		'tuiValidator' : 'tui/tuiValidate/tui_validator.js',
		'datepicker' : 'tui/tuiDatepicker/datepicker.js',
		'tuiDialog' : 'tui/tuiDialog/tui_dialog.js'
	}
});
if (location.href.indexOf('?dev') > 0) {
	seajs.use('../src/abrqueryMain');
}
// For production
else {
	seajs.use('fare/oc/1.0.0/abrqueryMain');
}