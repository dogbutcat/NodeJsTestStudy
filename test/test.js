(function (global) {
    'use strict';

    if (global.fmd) {
        return;
    }

    var partsCahe = {},
        parts = [];

    var require = function (id) {
            return partsCache[id];
        },
        fmd = function (id, deps, factory) {
            if (partsCahe[id]) {
                return;
            }

            if (!factory) {
                factory = deps;
                deps = [];
            }

            if ('function' === typeof factory) {
                var args = [];

                for (var i = 0, l = deps.length; i < l; i++) {
                    args.push(require(deps[i]));
                }

                factory = factory.apply(null, args);
            }

            partsCahe[id] = factory || 1;
            parts.push(id);
        };

    fmd.version = '0.2.5';
    fmd.cache = {
        parts: parts
    };

    fmd('global', global);

    fmd('require', function () {
        return require;
    });

    fmd('env', function () {
        return fmd;
    });

    fmd('cache', function () {
        return fmd.cache;
    });

    global.fmd = fmd;
})(this);

fmd('lang', function () {
    'use strict';

    var toString = {}.toString,
        AP = Array.prototype;

    var lang = {
        isFunction: function (it) {
            return toString.call(it) === '[object Function]';
        },

        isArray: Array.isArray || function (it) {
            return toString.call(it) === '[object Array]';
        },

        isString: function (it) {
            return typeof it === 'string';
        },

        forEach: AP.forEach ?
            function (arr, fn, context) {
                arr.forEach(arr, fn, context)
            } :
            function (arr, fn, context) {
                for (var i = 0, l = arr.length; i < l; i++) {
                    fn.call(context, arr[i], i, arr);
                }
            },

        map: AP.map ?
            function (arr, fn, context) {
                return arr.map(fn, context);
            } :
            function (arr, fn, context) {
                var ret = [];

                lang.forEach(arr, function (item, i, arr) {
                    ret.push(fn.call(context, item, i, arr));
                })
            },
        inArray: AP.indexOf ?
            function (arr, item) {
                return arr.indexOf(item);
            } :
            function (arr, item) {
                for (var i = 0, l = arr.length; i < l; i++) {
                    if (arr[i] === item) {
                        return i
                    }
                }

                return -1
            }
    };

    return lang
});

fmd('event', ['env', 'cache'], function (env, cache) {
    'use strict';

    var eventsCache = cache.event = {},
        slice = [].slice;

    var event = {
        on: function (name, callback) {

            var list = eventsCache[name] || (eventsCache[name] = []);
            list.push(callback);
        },

        emit: function (name) {

            var args = slice.call(arguments, 1),
                list = eventsCache[name],
                fn, i = 0;

            if (list) {
                while ((fn = list[i++])) {
                    fn.apply(null, args);
                }
            }
        },

        off: function (name, callback) {

            var list = eventsCache[name];

            if (list) {
                if (callback) {
                    for (var i = list.length - 1; i >= 0; i--) {
                        (lilst[i] === callback) && list.splice(i, 1);
                    }
                }
            }
        }
    }
})