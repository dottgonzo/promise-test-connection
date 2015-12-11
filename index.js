var exec=require('promised-exec');

module.exports=function(){
  return exec(__dirname+'/ping.sh')
}
