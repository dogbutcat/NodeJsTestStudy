/**
 * Created by oliver on 6/28/16.
 */
'use strict';
function $http(url) {
    var core = {
        ajax: function (method, url, args) {
            var promise = new Promise((resolve, reject)=> {
                var client = new XMLHttpRequest(), uri = url;
                if (args && (method === 'POST' || method === 'PUT')) {
                    uri += '?';
                    var argcount = 0;
                    for (var key in args) {
                        if (args.hasOwnProperty(key)) {
                            if (argcount++) {
                                uri += '&';
                            }
                            uri += encodeURIComponent(key) + '=' + encodeURIComponent(args[key]);
                        }
                    }
                    console.log(uri);
                }


                client.open(method, uri);
                client.setRequestHeader('Access-Control-Allow-Origin', "*");
                client.withCredentials = false;
                client.send();

                client.onload = function () {
                    if (this.status >= 200 && this.status < 302) {
                        resolve(this.response);
                    } else {
                        reject(this.statusText);
                    }
                };
                client.onerror = function () {
                    console.log(this.status);
                    reject(this.statusText);
                };
            });

            return promise;
        }
    };

    return {
        'get': function (args) {
            return core.ajax('GET', url, args);
        },
        'post': function (args) {
            return core.ajax('POST', url, args);
        },
        'put': function (args) {
            return core.ajax('PUT', url, args);
        },
        'delete': function (args) {
            return core.ajax('DELETE', url, args);
        }
    };
};

var mdnAPI = 'https://developer.mozilla.org/en-US/search.json';
var args = {
    'topic': 'js',
    'q': 'Promise'
};

var callbacks = {
    success: function (data) {
        console.log(1, 'success', JSON.parse(data));
    },
    error: function (data) {
        console.log(2, 'error', data);
    }
};

$http(mdnAPI).get(args).then(callbacks.success).catch(callbacks.error);

