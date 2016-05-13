/**
 * Created by oliver on 5/4/16.
 */
define("shark/lang/observer", function() {
    "use strict";
    var a = {}.toString
        , b = function(b) {
            return "[object Function]" === a.call(b)
        }
        , c = Array.isArray || function(b) {
                return "[object Array]" === a.call(b)
            }
        , d = function(a) {
            return "string" == typeof a
        }
        , e = Array.prototype.slice
        , f = function(a, b) {
            var d;
            if (c(a))
                for (; d = a.shift(); )
                    b(d);
            else
                b(a)
        }
        , g = function(a, b, c, e) {
            if (d(b)) {
                var f = a[b] || (a[b] = []);
                f.push({
                    listener: c,
                    context: e
                })
            }
        }
        , h = function(a, b, c, e) {
            var f, g;
            if (d(b) && (f = a[b]))
                if (c || e)
                    for (var h = 0; h < f.length; )
                        g = f[h],
                            c && g.listener === c || e && g.context === e ? f.splice(h, 1) : h++;
                else
                    delete a[b]
        }
        , i = function(a, b, c) {
            var e, f;
            if (d(b) && (e = a[b]))
                for (var g = 0, h = e.length; h > g; g++)
                    f = e[g],
                        f.listener.apply(f.context || this._observer_context || this, c)
        }
        , j = function(a, b, c) {
            var e, f;
            return d(b) && (e = a[b]) ? (f = e[0],
                f.listener.apply(f.context || this._observer_context || this, c)) : void 0
        }
        , k = function(a) {
            this._observer_context = a
        }
        ;
    k.prototype = {
        attach: function(a, c, d) {
            var e;
            return b(c) ? (e = this._observer_group || (this._observer_group = {}),
                f(a, function(a) {
                    g(e, a, c, d)
                }),
                this) : this
        },
        detach: function(a, b, c) {
            var d;
            return (d = this._observer_group) ? a ? (f(a, function(a) {
                h(d, a, b, c)
            }),
                this) : (delete this._observer_group,
                this) : this
        },
        notify: function(a) {
            var b, c, d;
            return (b = this._observer_group) ? (c = e.call(arguments, 1),
                d = this,
                f(a, function(a) {
                    i.call(d, b, a, c)
                }),
                this) : this
        },
        notifyOne: function(a) {
            var b, c, d;
            return (b = this._observer_group) ? (c = e.call(arguments, 1),
                d = this,
                j.call(d, b, a, c)) : this
        }
    },
        k.prototype.on = k.prototype.attach,
        k.prototype.off = k.prototype.detach,
        k.prototype.trigger = k.prototype.notify,
        k.prototype.fire = k.prototype.notifyOne;
    var l = new k(window);
    return l.create = function(a) {
        return new k(a)
    }
        ,
        l.mixTo = function(a) {
            a = a || {};
            var b = k.prototype;
            for (var c in b)
                a[c] = b[c];
            return a
        }
        ,
        l
});
