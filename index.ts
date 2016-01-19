import * as child_process from "child_process";
import * as http from "http";
import * as https from "https";
import * as Promise from "bluebird";
import * as async from "async";


export =function(obj?: { server?: any, ping?: boolean, get?: boolean }) {

    let response: { ping?: boolean, get?: boolean, server?: boolean, ip?: string } = {};
    let tests = [];
    let kernelserverFn = function(callback) {
        let callbacked = false;
        let timo = setTimeout(function() {
            console.log("timeout server");
            if (!callbacked) {
                response.ip = "none";
                response.server = false;
                callback(new Error("no response from server"));
            }
        }, 10000);

        https.get("https://io.kernel.online/ip", function(res) {

            res.setEncoding("utf8");

            res.on("data", function(body) {


                try {
                    if (JSON.parse(body).ip) {
                        response.server = true;
                        response.ip = JSON.parse(body).ip;
                        callbacked = true;
                        clearTimeout(timo);
                        callback();
                    } else {
                        response.server = false;
                        response.ip = "none";
                        callbacked = true;
                        clearTimeout(timo);
                        callback(new Error("check server offline"));
                    }
                } catch (e) {
                    response.server = false;
                    response.ip = "none";
                    callbacked = true;
                    clearTimeout(timo);
                    callback(new Error(e));
                }
            });


        }).on("error", function(e) {
            callbacked = true;
            clearTimeout(timo);
            response.server = false;
            response.ip = "none";
            callback(new Error(e));
        });




    };

    let googleFn = function(callback) {

        let callbacked = false;
        let timo = setTimeout(function() {
            console.log("timeout get");
            if (!callbacked) {
                response.get = false;
                callback(new Error("no response from google"));
            }
        }, 10000);
        http.get("http://www.google.com/index.html", function(res) {


            // consume response body
            callbacked = true;
            clearTimeout(timo);
            response.get = true;

            callback();
            res.resume();
        }).on("error", function(e) {
            callbacked = true;
            clearTimeout(timo);
            response.get = false;
            callback(new Error(e));
        });


    };

    let pingFn = function(callback) {
        let callbacked = false;
        let timo = setTimeout(function() {
            console.log("timeout ping");
            if (!callbacked) {
                response.ping = false;
                callback(new Error("no ping"));
            }
        }, 10000);

        child_process.exec(__dirname + "/ping.sh", { timeout: 9000 }, function(error, stdout, stderr) {
            if (error != null) {
                callbacked = true;
                clearTimeout(timo);
                response.ping = false;
                callback(new Error(error + ""));
            } else if (stderr && stderr != null) {
                callbacked = true;
                clearTimeout(timo);
                response.ping = false;
                callback(new Error(stderr + ""));
            } else {
                callbacked = true;
                clearTimeout(timo);
                response.ping = true;
                callback();
            }
        });


    };


    if (!obj) {
        tests.push(pingFn, googleFn, kernelserverFn);
    } else {
        if (obj.ping) {
            tests.push(pingFn);
        }

        if (obj.get) {
            tests.push(googleFn);
        }

        if (obj.server) {
            if (obj.server == true) {
                tests.push(kernelserverFn);
            } else {
                let serverFn = function(callback) {

                    let callbacked = false;


                    let timo = setTimeout(function() {
                        console.log("timeout custom server");
                        if (!callbacked) {
                            response.ip = "none";
                            response.server = false;
                            callback(new Error("no response"));
                        }
                    }, 10000);

                    http.get(obj.server, function(res) {
                        callbacked = true;
                        clearTimeout(timo);
                        response.server = true;
                        callback();
                    }).on("error", function(e) {
                        callbacked = true;
                        clearTimeout(timo);
                        response.server = false;
                        callback(new Error(e));
                    });
                };
                tests.push(serverFn);
            }
        };
    }

    return new Promise(function(resolve, reject) {
        async.series(tests,
            // optional callback
            function(err, results) {

                if (err) {
                    reject(response);
                } else {
                    resolve(response);
                }
                // the results array will equal ['one','two'] even though
                // the second function had a shorter timeout.
            });

    });
}
