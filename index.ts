import * as child_process from "child_process";
import * as http from "http";
import * as Promise from "bluebird";
import * as async from "async";


export =function(obj: { server: any, ping: boolean, get: boolean }) {


    let response: { ping?: boolean, get?: boolean, server?: boolean, ip?: string } = {};
    let tests = [];
    let kernelserverFn = function(callback) {
        console.log("server")

        let callbacked = false;
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
                callbacked = true;
            });

        }).on('error', function(e) {
            response.server = false;
            callbacked = true;
            response.ip = "none";
            callback(new Error(e))
        });


        setTimeout(function() {
            if (!callbacked) {
                response.ip = "none";
                response.server = false;
                callback(new Error("no response from server"))
            }
        }, 10000)

    };

    let googleFn = function(callback) {
        console.log("get")
        let callbacked = false;
        http.get("http://www.google.com/index.html", function() {

            
            // consume response body
            
            response.get = true;
            callbacked = true;
            callback()
        }).on('error', function(e) {
            response.get = false;
            callbacked = true;
            callback(new Error(e))
        });
        setTimeout(function() {
            if (!callbacked) {
                response.get = false;
                callback(new Error("no response from google"))
            }
        }, 10000)

    };

    let pingFn = function(callback) {
        let callbacked = false;
        console.log("ping")
        child_process.exec(__dirname + "/ping.sh", { timeout: 10000 }, function(error, stdout, stderr) {
            if (error != null) {
                response.ping = false;
                callbacked = true;
                callback(new Error(error + ""))
            } else if (stderr && stderr != null) {
                response.ping = false;
                callbacked = true;
                callback(new Error(stderr + ""))
            } else {
                callbacked = true;
                response.ping = true;
                callback()
            }
        });

        setTimeout(function() {
            if (!callbacked) {
                response.ping = false;
                callback(new Error("no ping"))
            }
        }, 10000)
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

                    let callbacked = false;


                    setTimeout(function() {
                        if (!callbacked) {
                            response.ip = "none";
                            response.server = false;
                            callback(new Error("no response"))
                        }
                    }, 10000)

                    http.get(obj.server, function(res) {
                        response.server = true;
                        callbacked = true;
                        callback()
                    }).on('error', function(e) {
                        response.server = false;
                        callbacked = true;
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
