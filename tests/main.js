var tester=require('../index');
var verb=require('verbo');
var timerdaemon=require('timerdaemon');


tester().then(function(){
  verb("online","info")
}).catch(function(){
  verb("offline","error")
})
