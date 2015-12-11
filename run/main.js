var tester=require('../index');

tester().then(function(v){
console.log('online')
}).catch(function(){
  console.log('offline')
})
