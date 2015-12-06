define(function(require) {
  var S7Query = require('./s7query');
  new S7Query();
  
  var S7Publish = require('./s7publish');
  var s7publish = new S7Publish();
  s7publish.init();
  
  var S7Delete = require('./s7delete');
  var s7delete = new S7Delete();
  s7delete.init();
});