var tester=require('../index');
var verb=require('verbo');
var timerdaemon=require('timerdaemon');

timerdaemon.pre(1000,function(){
  tester().then(function(){
    verb("online","info")
  }).catch(function(){
    verb("offline","error")
  })
})
