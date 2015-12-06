// Set configuration
seajs.config({
	base : '../resources/oc/scripts/sea-modules/',
	alias : {
		'jquery' : 'jquery/jquery/1.10.1/jquery-1.8.2.js',
		'tuiValidator' : 'tui/tuiValidate/tui_validator.js',
		'datepicker' : 'tui/tuiDatepicker/datepicker.js',
		'tuiDialog' : 'tui/tuiDialog/tui_dialog.js',
		'underscore':'underscore/1.7.0/underscore.js'
	}
});

// For development
if (location.href.indexOf('?dev') > 0) {
	seajs.use('../src/s7queryMain');
}
// For production
else {
	seajs.use('fare/oc/1.0.0/s7queryMain');
}
