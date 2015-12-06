define(function(require) {
  var abrQuery = require('./abrquery');
  new abrQuery();
  
  var abrDelete = require('./abrdelete');
  var abrdelete = new abrDelete();
  abrdelete.init();
});