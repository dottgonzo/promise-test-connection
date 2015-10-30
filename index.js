var tester=require('connection-tester'),
Promise=require('promise');


module.exports=function(){
  return new Promise(function (resolve, reject) {
    tester.test('www.yahoo.com', 80, function (err, output) {

      if(err||!output.success){
        tester.test('www.google.com', 80, function (err, output) {
          if(err||!output.success){
            tester.test('www.wikipedia.org', 80, function (err, output) {
              if(err||!output.success){
                reject();

              } else{
                resolve();

              }
            })
          } else{

            resolve();


          }
        })
      } else{
        resolve();


      }


    });

  })
}
