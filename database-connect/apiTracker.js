/*
#     CloudBoost - Core Engine that powers Bakend as a Service
#     (c) 2014 HackerBay, Inc. 
#     CloudBoost may be freely distributed under the Apache 2 License
*/

var q = require('q');
var request = require('request');

var obj = {};
var config = require('../config/config');
var winston = require('winston');

obj.log = function (appId, actionName, url, sdk, checkReleaseRequest) {

    try {
        if (checkReleaseRequest) {
            url = config.analyticsUrl + "/app/isReleased";
        } else {
            url = config.analyticsUrl + "/api/store";
        }
        var post_data = JSON.stringify({
            host: config.secureKey,
            appId: appId,
            category: actionName.split('/')[0] || null,
            subCategory: actionName.split('/')[1] || null,
            sdk: sdk || "REST"
        });

        request.post({
            url: url,
            headers: {
                'content-type': 'application/json',
                'content-length': post_data.length
            },
            body: post_data
        }, function (err, response, body) {
            if (!err) {
                try {
                    body = JSON.parse(body);
                    if (body.limitExceeded) {
                        obj.blockApp(body.appId).then(function () {

                        }, function () {

                        });
                    } else {
                        obj.releaseApp(body.appId).then(function () {

                        }, function () {


                        });
                    }
                } catch (e) {
                    winston.log('error', {
                        "error": String(e),
                        "stack": new Error().stack
                    });
                    obj.releaseApp(body.appId).then(function () {

                    }, function () {


                    });
                }

            }


        });
    } catch (err) {
        winston.log('error', {
            "error": String(err),
            "stack": new Error().stack
        });
    }
};


//Description : Checks weather the current app is in the Plan Limit. 
// Params : appId - ID of the App. 
//Returns : Promise - True for yes, It is in the plan limit. False if it exceeded.
obj.isInPlanLimit = function (appId) {
    var deferred = q.defer();

    try {
        config.redisClient.hget("_CB_API_PLAN", appId, function (err, res) {
            if (err)
                deferred.reject(err);
            else {
                if (res === null || res === 'undefined') {
                    deferred.resolve(true);
                } else {
                    if (res === "true") {
                        deferred.resolve(true);
                    } else {
                        deferred.resolve(false);
                    }
                }
            }
        });

    } catch (err) {
        winston.log('error', {
            "error": String(err),
            "stack": new Error().stack
        });
        deferred.reject(err);
    }

    return deferred.promise;
};

//Description : Blocks the app
// Params : appId - ID of the App. 
//Returns : Promise (void)
obj.blockApp = function (appId) {
    var deferred = q.defer();

    try {
        config.redisClient.hset("_CB_API_PLAN", appId, false, function (err) {
            if (err)
                deferred.reject(err);
            deferred.resolve();
        });
    } catch (err) {
        winston.log('error', {
            "error": String(err),
            "stack": new Error().stack
        });
        deferred.reject(err);
    }

    return deferred.promise;
};

//Description : Releases the App.
// Params : appId - ID of the App. 
//Returns : Promise (void)
obj.releaseApp = function (appId) {
    var deferred = q.defer();
    try {
        config.redisClient.hset("_CB_API_PLAN", appId, true, function (err) {
            if (err)
                deferred.reject(err);
            deferred.resolve();
        });

    } catch (err) {
        winston.log('error', {
            "error": String(err),
            "stack": new Error().stack
        });
        deferred.reject(err);
    }
    return deferred.promise;
};


module.exports = obj;