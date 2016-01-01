import * as child_process from "child_process";
import * as http from "http";
import * as Promise from "bluebird";
import * as async from "async";


export =function(obj?: { server?: any, ping?: boolean, get?: boolean }) {

    let response: { ping?: boolean, get?: boolean, server?: boolean, ip?: string } = {};
    let tests = [];
    let kernelserverFn = function(callback) {
        console.log("server")


        http.get("http://ingecotech.com:9090/ip", function(res) {

            res.setEncoding('utf8');

            res.on("data", function(body) {
                if (body && JSON.parse(body) && JSON.parse(body).ip) {
                    response.server = true;
                    response.ip = JSON.parse(body).ip;
                } else {
                    response.server = false;
                    response.ip = "none";
                }
            });
            res.on('end', function() {
                callback()
            });

        }).on('error', function(e) {

            response.server = false;
            response.ip = "none";
            callback(new Error(e))
        });




    };

    let googleFn = function(callback) {
        console.log("get")
        http.get("http://www.google.com/index.html", function() {

            
            // consume response body
            response.get = true;

            callback()
        }).on('error', function(e) {
            response.get = false;

            callback(new Error(e))
        });


    };

    let pingFn = function(callback) {
        let callbacked = false;
        let timo = setTimeout(function() {
            if (!callbacked) {
                response.ping = false;
                callback(new Error("no ping"))
            }
        }, 10000)
        console.log("ping")
        child_process.exec(__dirname + "/ping.sh", { timeout: 10000 }, function(error, stdout, stderr) {
            if (error != null) {
                callbacked = true;
                clearTimeout(timo);
                response.ping = false;
                callback(new Error(error + ""))
            } else if (stderr && stderr != null) {
                callbacked = true;
                clearTimeout(timo);
                response.ping = false;
                callback(new Error(stderr + ""))
            } else {
                callbacked = true;
                clearTimeout(timo);
                response.ping = true;
                callback()
            }
        });


    }


    if (!obj) {
        tests.push(pingFn, googleFn, kernelserverFn)
    } else {
        if (obj.ping) {
            tests.push(pingFn)
        }

        if (obj.get) {
            tests.push(googleFn)
        }

        if (obj.server) {
            if (obj.server == true) {
                tests.push(kernelserverFn)
            } else {
                let serverFn = function(callback) {


                    http.get(obj.server, function(res) {
                        response.server = true;
                        callback()
                    }).on('error', function(e) {
                        response.server = false;
                        callback(new Error(e))
                    });
                };
                tests.push(serverFn)
            }
        };
    }

    return new Promise(function(resolve, reject) {
        async.series(tests,
            // optional callback
            function(err, results) {

                if (err) {
                    reject(response)
                } else {
                    resolve(response)
                }
                // the results array will equal ['one','two'] even though
                // the second function had a shorter timeout.
            });

    })
}
