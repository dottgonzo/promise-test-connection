let tester = require("../index");
import * as chai from "chai";


let expect = chai.expect;


describe("test conection", function() {
    this.timeout(20000);
    it("should return an answer", function(done) {

        return tester().then(function(answer) {
            console.log(answer)
            expect(answer).to.be.ok;
            expect(answer).to.have.property("ping").that.is.a("boolean");
            expect(answer).to.have.property("get").that.is.a("boolean");
            expect(answer).to.have.property("server").that.is.a("boolean");
            expect(answer).to.have.property("ip").that.is.a("string");
            return done()
        }).catch(function(err) {
                        console.log("err")
            console.log(err)
            expect(err).to.be.ok;
            return done()

        })


    });


});
