var tester=require('../index'),
expect=require('chai').expect;



describe("test conection", function(){
  this.timeout(20000);

  before(function() {
    return tester().then(function(){
var tester=true;
    }).catch(function(){
      var tester=false;
    })
  });


  it("should return an answer", function(){
    expect(tester).to.be.ok;
  });









  });
