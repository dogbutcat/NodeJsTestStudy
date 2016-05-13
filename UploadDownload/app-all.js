var CryptoJS = CryptoJS || function (a, b) {
        var c = {}
            , d = c.lib = {}
            , e = function () {
        }
            , f = d.Base = {
            extend: function (a) {
                e.prototype = this;
                var b = new e;
                return a && b.mixIn(a),
                b.hasOwnProperty("init") || (b.init = function () {
                        b.$super.init.apply(this, arguments)
                    }
                ),
                    b.init.prototype = b,
                    b.$super = this,
                    b
            },
            create: function () {
                var a = this.extend();
                return a.init.apply(a, arguments),
                    a
            },
            init: function () {
            },
            mixIn: function (a) {
                for (var b in a)
                    a.hasOwnProperty(b) && (this[b] = a[b]);
                a.hasOwnProperty("toString") && (this.toString = a.toString)
            },
            clone: function () {
                return this.init.prototype.extend(this)
            }
        }
            , g = d.WordArray = f.extend({
            init: function (a, c) {
                a = this.words = a || [],
                    this.sigBytes = c != b ? c : 4 * a.length
            },
            toString: function (a) {
                return (a || i).stringify(this)
            },
            concat: function (a) {
                var b = this.words
                    , c = a.words
                    , d = this.sigBytes;
                if (a = a.sigBytes,
                        this.clamp(),
                    d % 4)
                    for (var e = 0; a > e; e++)
                        b[d + e >>> 2] |= (c[e >>> 2] >>> 24 - 8 * (e % 4) & 255) << 24 - 8 * ((d + e) % 4);
                else if (65535 < c.length)
                    for (e = 0; a > e; e += 4)
                        b[d + e >>> 2] = c[e >>> 2];
                else
                    b.push.apply(b, c);
                return this.sigBytes += a,
                    this
            },
            clamp: function () {
                var b = this.words
                    , c = this.sigBytes;
                b[c >>> 2] &= 4294967295 << 32 - 8 * (c % 4),
                    b.length = a.ceil(c / 4)
            },
            clone: function () {
                var a = f.clone.call(this);
                return a.words = this.words.slice(0),
                    a
            },
            random: function (b) {
                for (var c = [], d = 0; b > d; d += 4)
                    c.push(4294967296 * a.random() | 0);
                return new g.init(c, b)
            }
        })
            , h = c.enc = {}
            , i = h.Hex = {
            stringify: function (a) {
                var b = a.words;
                a = a.sigBytes;
                for (var c = [], d = 0; a > d; d++) {
                    var e = b[d >>> 2] >>> 24 - 8 * (d % 4) & 255;
                    c.push((e >>> 4).toString(16)),
                        c.push((15 & e).toString(16))
                }
                return c.join("")
            },
            parse: function (a) {
                for (var b = a.length, c = [], d = 0; b > d; d += 2)
                    c[d >>> 3] |= parseInt(a.substr(d, 2), 16) << 24 - 4 * (d % 8);
                return new g.init(c, b / 2)
            }
        }
            , j = h.Latin1 = {
            stringify: function (a) {
                var b = a.words;
                a = a.sigBytes;
                for (var c = [], d = 0; a > d; d++)
                    c.push(String.fromCharCode(b[d >>> 2] >>> 24 - 8 * (d % 4) & 255));
                return c.join("")
            },
            parse: function (a) {
                for (var b = a.length, c = [], d = 0; b > d; d++)
                    c[d >>> 2] |= (255 & a.charCodeAt(d)) << 24 - 8 * (d % 4);
                return new g.init(c, b)
            }
        }
            , k = h.Utf8 = {
            stringify: function (a) {
                try {
                    return decodeURIComponent(escape(j.stringify(a)))
                } catch (b) {
                    throw Error("Malformed UTF-8 data")
                }
            },
            parse: function (a) {
                return j.parse(unescape(encodeURIComponent(a)))
            }
        }
            , l = d.BufferedBlockAlgorithm = f.extend({
            reset: function () {
                this._data = new g.init,
                    this._nDataBytes = 0
            },
            _append: function (a) {
                "string" == typeof a && (a = k.parse(a)),
                    this._data.concat(a),
                    this._nDataBytes += a.sigBytes
            },
            _process: function (b) {
                var c = this._data
                    , d = c.words
                    , e = c.sigBytes
                    , f = this.blockSize
                    , h = e / (4 * f)
                    , h = b ? a.ceil(h) : a.max((0 | h) - this._minBufferSize, 0);
                if (b = h * f,
                        e = a.min(4 * b, e),
                        b) {
                    for (var i = 0; b > i; i += f)
                        this._doProcessBlock(d, i);
                    i = d.splice(0, b),
                        c.sigBytes -= e
                }
                return new g.init(i, e)
            },
            clone: function () {
                var a = f.clone.call(this);
                return a._data = this._data.clone(),
                    a
            },
            _minBufferSize: 0
        });
        d.Hasher = l.extend({
            cfg: f.extend(),
            init: function (a) {
                this.cfg = this.cfg.extend(a),
                    this.reset()
            },
            reset: function () {
                l.reset.call(this),
                    this._doReset()
            },
            update: function (a) {
                return this._append(a),
                    this._process(),
                    this
            },
            finalize: function (a) {
                return a && this._append(a),
                    this._doFinalize()
            },
            blockSize: 16,
            _createHelper: function (a) {
                return function (b, c) {
                    return new a.init(c).finalize(b)
                }
            },
            _createHmacHelper: function (a) {
                return function (b, c) {
                    return new m.HMAC.init(a, c).finalize(b)
                }
            }
        });
        var m = c.algo = {};
        return c
    }(Math);
!function (a) {
    function b(a, b, c, d, e, f, g) {
        return a = a + (b & c | ~b & d) + e + g,
        (a << f | a >>> 32 - f) + b
    }

    function c(a, b, c, d, e, f, g) {
        return a = a + (b & d | c & ~d) + e + g,
        (a << f | a >>> 32 - f) + b
    }

    function d(a, b, c, d, e, f, g) {
        return a = a + (b ^ c ^ d) + e + g,
        (a << f | a >>> 32 - f) + b
    }

    function e(a, b, c, d, e, f, g) {
        return a = a + (c ^ (b | ~d)) + e + g,
        (a << f | a >>> 32 - f) + b
    }

    for (var f = CryptoJS, g = f.lib, h = g.WordArray, i = g.Hasher, g = f.algo, j = [], k = 0; 64 > k; k++)
        j[k] = 4294967296 * a.abs(a.sin(k + 1)) | 0;
    g = g.MD5 = i.extend({
        _doReset: function () {
            this._hash = new h.init([1732584193, 4023233417, 2562383102, 271733878])
        },
        _doProcessBlock: function (a, f) {
            for (var g = 0; 16 > g; g++) {
                var h = f + g
                    , i = a[h];
                a[h] = 16711935 & (i << 8 | i >>> 24) | 4278255360 & (i << 24 | i >>> 8)
            }
            var g = this._hash.words
                , h = a[f + 0]
                , i = a[f + 1]
                , k = a[f + 2]
                , l = a[f + 3]
                , m = a[f + 4]
                , n = a[f + 5]
                , o = a[f + 6]
                , p = a[f + 7]
                , q = a[f + 8]
                , r = a[f + 9]
                , s = a[f + 10]
                , t = a[f + 11]
                , u = a[f + 12]
                , v = a[f + 13]
                , w = a[f + 14]
                , x = a[f + 15]
                , y = g[0]
                , z = g[1]
                , A = g[2]
                , B = g[3]
                , y = b(y, z, A, B, h, 7, j[0])
                , B = b(B, y, z, A, i, 12, j[1])
                , A = b(A, B, y, z, k, 17, j[2])
                , z = b(z, A, B, y, l, 22, j[3])
                , y = b(y, z, A, B, m, 7, j[4])
                , B = b(B, y, z, A, n, 12, j[5])
                , A = b(A, B, y, z, o, 17, j[6])
                , z = b(z, A, B, y, p, 22, j[7])
                , y = b(y, z, A, B, q, 7, j[8])
                , B = b(B, y, z, A, r, 12, j[9])
                , A = b(A, B, y, z, s, 17, j[10])
                , z = b(z, A, B, y, t, 22, j[11])
                , y = b(y, z, A, B, u, 7, j[12])
                , B = b(B, y, z, A, v, 12, j[13])
                , A = b(A, B, y, z, w, 17, j[14])
                , z = b(z, A, B, y, x, 22, j[15])
                , y = c(y, z, A, B, i, 5, j[16])
                , B = c(B, y, z, A, o, 9, j[17])
                , A = c(A, B, y, z, t, 14, j[18])
                , z = c(z, A, B, y, h, 20, j[19])
                , y = c(y, z, A, B, n, 5, j[20])
                , B = c(B, y, z, A, s, 9, j[21])
                , A = c(A, B, y, z, x, 14, j[22])
                , z = c(z, A, B, y, m, 20, j[23])
                , y = c(y, z, A, B, r, 5, j[24])
                , B = c(B, y, z, A, w, 9, j[25])
                , A = c(A, B, y, z, l, 14, j[26])
                , z = c(z, A, B, y, q, 20, j[27])
                , y = c(y, z, A, B, v, 5, j[28])
                , B = c(B, y, z, A, k, 9, j[29])
                , A = c(A, B, y, z, p, 14, j[30])
                , z = c(z, A, B, y, u, 20, j[31])
                , y = d(y, z, A, B, n, 4, j[32])
                , B = d(B, y, z, A, q, 11, j[33])
                , A = d(A, B, y, z, t, 16, j[34])
                , z = d(z, A, B, y, w, 23, j[35])
                , y = d(y, z, A, B, i, 4, j[36])
                , B = d(B, y, z, A, m, 11, j[37])
                , A = d(A, B, y, z, p, 16, j[38])
                , z = d(z, A, B, y, s, 23, j[39])
                , y = d(y, z, A, B, v, 4, j[40])
                , B = d(B, y, z, A, h, 11, j[41])
                , A = d(A, B, y, z, l, 16, j[42])
                , z = d(z, A, B, y, o, 23, j[43])
                , y = d(y, z, A, B, r, 4, j[44])
                , B = d(B, y, z, A, u, 11, j[45])
                , A = d(A, B, y, z, x, 16, j[46])
                , z = d(z, A, B, y, k, 23, j[47])
                , y = e(y, z, A, B, h, 6, j[48])
                , B = e(B, y, z, A, p, 10, j[49])
                , A = e(A, B, y, z, w, 15, j[50])
                , z = e(z, A, B, y, n, 21, j[51])
                , y = e(y, z, A, B, u, 6, j[52])
                , B = e(B, y, z, A, l, 10, j[53])
                , A = e(A, B, y, z, s, 15, j[54])
                , z = e(z, A, B, y, i, 21, j[55])
                , y = e(y, z, A, B, q, 6, j[56])
                , B = e(B, y, z, A, x, 10, j[57])
                , A = e(A, B, y, z, o, 15, j[58])
                , z = e(z, A, B, y, v, 21, j[59])
                , y = e(y, z, A, B, m, 6, j[60])
                , B = e(B, y, z, A, t, 10, j[61])
                , A = e(A, B, y, z, k, 15, j[62])
                , z = e(z, A, B, y, r, 21, j[63]);
            g[0] = g[0] + y | 0,
                g[1] = g[1] + z | 0,
                g[2] = g[2] + A | 0,
                g[3] = g[3] + B | 0
        },
        _doFinalize: function () {
            var b = this._data
                , c = b.words
                , d = 8 * this._nDataBytes
                , e = 8 * b.sigBytes;
            c[e >>> 5] |= 128 << 24 - e % 32;
            var f = a.floor(d / 4294967296);
            for (c[(e + 64 >>> 9 << 4) + 15] = 16711935 & (f << 8 | f >>> 24) | 4278255360 & (f << 24 | f >>> 8),
                     c[(e + 64 >>> 9 << 4) + 14] = 16711935 & (d << 8 | d >>> 24) | 4278255360 & (d << 24 | d >>> 8),
                     b.sigBytes = 4 * (c.length + 1),
                     this._process(),
                     b = this._hash,
                     c = b.words,
                     d = 0; 4 > d; d++)
                e = c[d],
                    c[d] = 16711935 & (e << 8 | e >>> 24) | 4278255360 & (e << 24 | e >>> 8);
            return b
        },
        clone: function () {
            var a = i.clone.call(this);
            return a._hash = this._hash.clone(),
                a
        }
    }),
        f.MD5 = i._createHelper(g),
        f.HmacMD5 = i._createHmacHelper(g)
}(Math);
var CryptoJS = CryptoJS || function (a, b) {
        var c = {}
            , d = c.lib = {}
            , e = function () {
        }
            , f = d.Base = {
            extend: function (a) {
                e.prototype = this;
                var b = new e;
                return a && b.mixIn(a),
                b.hasOwnProperty("init") || (b.init = function () {
                        b.$super.init.apply(this, arguments)
                    }
                ),
                    b.init.prototype = b,
                    b.$super = this,
                    b
            },
            create: function () {
                var a = this.extend();
                return a.init.apply(a, arguments),
                    a
            },
            init: function () {
            },
            mixIn: function (a) {
                for (var b in a)
                    a.hasOwnProperty(b) && (this[b] = a[b]);
                a.hasOwnProperty("toString") && (this.toString = a.toString)
            },
            clone: function () {
                return this.init.prototype.extend(this)
            }
        }
            , g = d.WordArray = f.extend({
            init: function (a, c) {
                a = this.words = a || [],
                    this.sigBytes = c != b ? c : 4 * a.length
            },
            toString: function (a) {
                return (a || i).stringify(this)
            },
            concat: function (a) {
                var b = this.words
                    , c = a.words
                    , d = this.sigBytes;
                if (a = a.sigBytes,
                        this.clamp(),
                    d % 4)
                    for (var e = 0; a > e; e++)
                        b[d + e >>> 2] |= (c[e >>> 2] >>> 24 - 8 * (e % 4) & 255) << 24 - 8 * ((d + e) % 4);
                else if (65535 < c.length)
                    for (e = 0; a > e; e += 4)
                        b[d + e >>> 2] = c[e >>> 2];
                else
                    b.push.apply(b, c);
                return this.sigBytes += a,
                    this
            },
            clamp: function () {
                var b = this.words
                    , c = this.sigBytes;
                b[c >>> 2] &= 4294967295 << 32 - 8 * (c % 4),
                    b.length = a.ceil(c / 4)
            },
            clone: function () {
                var a = f.clone.call(this);
                return a.words = this.words.slice(0),
                    a
            },
            random: function (b) {
                for (var c = [], d = 0; b > d; d += 4)
                    c.push(4294967296 * a.random() | 0);
                return new g.init(c, b)
            }
        })
            , h = c.enc = {}
            , i = h.Hex = {
            stringify: function (a) {
                var b = a.words;
                a = a.sigBytes;
                for (var c = [], d = 0; a > d; d++) {
                    var e = b[d >>> 2] >>> 24 - 8 * (d % 4) & 255;
                    c.push((e >>> 4).toString(16)),
                        c.push((15 & e).toString(16))
                }
                return c.join("")
            },
            parse: function (a) {
                for (var b = a.length, c = [], d = 0; b > d; d += 2)
                    c[d >>> 3] |= parseInt(a.substr(d, 2), 16) << 24 - 4 * (d % 8);
                return new g.init(c, b / 2)
            }
        }
            , j = h.Latin1 = {
            stringify: function (a) {
                var b = a.words;
                a = a.sigBytes;
                for (var c = [], d = 0; a > d; d++)
                    c.push(String.fromCharCode(b[d >>> 2] >>> 24 - 8 * (d % 4) & 255));
                return c.join("")
            },
            parse: function (a) {
                for (var b = a.length, c = [], d = 0; b > d; d++)
                    c[d >>> 2] |= (255 & a.charCodeAt(d)) << 24 - 8 * (d % 4);
                return new g.init(c, b)
            }
        }
            , k = h.Utf8 = {
            stringify: function (a) {
                try {
                    return decodeURIComponent(escape(j.stringify(a)))
                } catch (b) {
                    throw Error("Malformed UTF-8 data")
                }
            },
            parse: function (a) {
                return j.parse(unescape(encodeURIComponent(a)))
            }
        }
            , l = d.BufferedBlockAlgorithm = f.extend({
            reset: function () {
                this._data = new g.init,
                    this._nDataBytes = 0
            },
            _append: function (a) {
                "string" == typeof a && (a = k.parse(a)),
                    this._data.concat(a),
                    this._nDataBytes += a.sigBytes
            },
            _process: function (b) {
                var c = this._data
                    , d = c.words
                    , e = c.sigBytes
                    , f = this.blockSize
                    , h = e / (4 * f)
                    , h = b ? a.ceil(h) : a.max((0 | h) - this._minBufferSize, 0);
                if (b = h * f,
                        e = a.min(4 * b, e),
                        b) {
                    for (var i = 0; b > i; i += f)
                        this._doProcessBlock(d, i);
                    i = d.splice(0, b),
                        c.sigBytes -= e
                }
                return new g.init(i, e)
            },
            clone: function () {
                var a = f.clone.call(this);
                return a._data = this._data.clone(),
                    a
            },
            _minBufferSize: 0
        });
        d.Hasher = l.extend({
            cfg: f.extend(),
            init: function (a) {
                this.cfg = this.cfg.extend(a),
                    this.reset()
            },
            reset: function () {
                l.reset.call(this),
                    this._doReset()
            },
            update: function (a) {
                return this._append(a),
                    this._process(),
                    this
            },
            finalize: function (a) {
                return a && this._append(a),
                    this._doFinalize()
            },
            blockSize: 16,
            _createHelper: function (a) {
                return function (b, c) {
                    return new a.init(c).finalize(b)
                }
            },
            _createHmacHelper: function (a) {
                return function (b, c) {
                    return new m.HMAC.init(a, c).finalize(b)
                }
            }
        });
        var m = c.algo = {};
        return c
    }(Math);
!function (a) {
    function b(a, b, c, d, e, f, g) {
        return a = a + (b & c | ~b & d) + e + g,
        (a << f | a >>> 32 - f) + b
    }

    function c(a, b, c, d, e, f, g) {
        return a = a + (b & d | c & ~d) + e + g,
        (a << f | a >>> 32 - f) + b
    }

    function d(a, b, c, d, e, f, g) {
        return a = a + (b ^ c ^ d) + e + g,
        (a << f | a >>> 32 - f) + b
    }

    function e(a, b, c, d, e, f, g) {
        return a = a + (c ^ (b | ~d)) + e + g,
        (a << f | a >>> 32 - f) + b
    }

    for (var f = CryptoJS, g = f.lib, h = g.WordArray, i = g.Hasher, g = f.algo, j = [], k = 0; 64 > k; k++)
        j[k] = 4294967296 * a.abs(a.sin(k + 1)) | 0;
    g = g.MD5 = i.extend({
        _doReset: function () {
            this._hash = new h.init([1732584193, 4023233417, 2562383102, 271733878])
        },
        _doProcessBlock: function (a, f) {
            for (var g = 0; 16 > g; g++) {
                var h = f + g
                    , i = a[h];
                a[h] = 16711935 & (i << 8 | i >>> 24) | 4278255360 & (i << 24 | i >>> 8)
            }
            var g = this._hash.words
                , h = a[f + 0]
                , i = a[f + 1]
                , k = a[f + 2]
                , l = a[f + 3]
                , m = a[f + 4]
                , n = a[f + 5]
                , o = a[f + 6]
                , p = a[f + 7]
                , q = a[f + 8]
                , r = a[f + 9]
                , s = a[f + 10]
                , t = a[f + 11]
                , u = a[f + 12]
                , v = a[f + 13]
                , w = a[f + 14]
                , x = a[f + 15]
                , y = g[0]
                , z = g[1]
                , A = g[2]
                , B = g[3]
                , y = b(y, z, A, B, h, 7, j[0])
                , B = b(B, y, z, A, i, 12, j[1])
                , A = b(A, B, y, z, k, 17, j[2])
                , z = b(z, A, B, y, l, 22, j[3])
                , y = b(y, z, A, B, m, 7, j[4])
                , B = b(B, y, z, A, n, 12, j[5])
                , A = b(A, B, y, z, o, 17, j[6])
                , z = b(z, A, B, y, p, 22, j[7])
                , y = b(y, z, A, B, q, 7, j[8])
                , B = b(B, y, z, A, r, 12, j[9])
                , A = b(A, B, y, z, s, 17, j[10])
                , z = b(z, A, B, y, t, 22, j[11])
                , y = b(y, z, A, B, u, 7, j[12])
                , B = b(B, y, z, A, v, 12, j[13])
                , A = b(A, B, y, z, w, 17, j[14])
                , z = b(z, A, B, y, x, 22, j[15])
                , y = c(y, z, A, B, i, 5, j[16])
                , B = c(B, y, z, A, o, 9, j[17])
                , A = c(A, B, y, z, t, 14, j[18])
                , z = c(z, A, B, y, h, 20, j[19])
                , y = c(y, z, A, B, n, 5, j[20])
                , B = c(B, y, z, A, s, 9, j[21])
                , A = c(A, B, y, z, x, 14, j[22])
                , z = c(z, A, B, y, m, 20, j[23])
                , y = c(y, z, A, B, r, 5, j[24])
                , B = c(B, y, z, A, w, 9, j[25])
                , A = c(A, B, y, z, l, 14, j[26])
                , z = c(z, A, B, y, q, 20, j[27])
                , y = c(y, z, A, B, v, 5, j[28])
                , B = c(B, y, z, A, k, 9, j[29])
                , A = c(A, B, y, z, p, 14, j[30])
                , z = c(z, A, B, y, u, 20, j[31])
                , y = d(y, z, A, B, n, 4, j[32])
                , B = d(B, y, z, A, q, 11, j[33])
                , A = d(A, B, y, z, t, 16, j[34])
                , z = d(z, A, B, y, w, 23, j[35])
                , y = d(y, z, A, B, i, 4, j[36])
                , B = d(B, y, z, A, m, 11, j[37])
                , A = d(A, B, y, z, p, 16, j[38])
                , z = d(z, A, B, y, s, 23, j[39])
                , y = d(y, z, A, B, v, 4, j[40])
                , B = d(B, y, z, A, h, 11, j[41])
                , A = d(A, B, y, z, l, 16, j[42])
                , z = d(z, A, B, y, o, 23, j[43])
                , y = d(y, z, A, B, r, 4, j[44])
                , B = d(B, y, z, A, u, 11, j[45])
                , A = d(A, B, y, z, x, 16, j[46])
                , z = d(z, A, B, y, k, 23, j[47])
                , y = e(y, z, A, B, h, 6, j[48])
                , B = e(B, y, z, A, p, 10, j[49])
                , A = e(A, B, y, z, w, 15, j[50])
                , z = e(z, A, B, y, n, 21, j[51])
                , y = e(y, z, A, B, u, 6, j[52])
                , B = e(B, y, z, A, l, 10, j[53])
                , A = e(A, B, y, z, s, 15, j[54])
                , z = e(z, A, B, y, i, 21, j[55])
                , y = e(y, z, A, B, q, 6, j[56])
                , B = e(B, y, z, A, x, 10, j[57])
                , A = e(A, B, y, z, o, 15, j[58])
                , z = e(z, A, B, y, v, 21, j[59])
                , y = e(y, z, A, B, m, 6, j[60])
                , B = e(B, y, z, A, t, 10, j[61])
                , A = e(A, B, y, z, k, 15, j[62])
                , z = e(z, A, B, y, r, 21, j[63]);
            g[0] = g[0] + y | 0,
                g[1] = g[1] + z | 0,
                g[2] = g[2] + A | 0,
                g[3] = g[3] + B | 0
        },
        _doFinalize: function () {
            var b = this._data
                , c = b.words
                , d = 8 * this._nDataBytes
                , e = 8 * b.sigBytes;
            c[e >>> 5] |= 128 << 24 - e % 32;
            var f = a.floor(d / 4294967296);
            for (c[(e + 64 >>> 9 << 4) + 15] = 16711935 & (f << 8 | f >>> 24) | 4278255360 & (f << 24 | f >>> 8),
                     c[(e + 64 >>> 9 << 4) + 14] = 16711935 & (d << 8 | d >>> 24) | 4278255360 & (d << 24 | d >>> 8),
                     b.sigBytes = 4 * (c.length + 1),
                     this._process(),
                     b = this._hash,
                     c = b.words,
                     d = 0; 4 > d; d++)
                e = c[d],
                    c[d] = 16711935 & (e << 8 | e >>> 24) | 4278255360 & (e << 24 | e >>> 8);
            return b
        },
        clone: function () {
            var a = i.clone.call(this);
            return a._hash = this._hash.clone(),
                a
        }
    }),
        f.MD5 = i._createHelper(g),
        f.HmacMD5 = i._createHmacHelper(g)
}(Math),
    function () {
        var a = CryptoJS
            , b = a.enc.Utf8;
        a.algo.HMAC = a.lib.Base.extend({
            init: function (a, c) {
                a = this._hasher = new a.init,
                "string" == typeof c && (c = b.parse(c));
                var d = a.blockSize
                    , e = 4 * d;
                c.sigBytes > e && (c = a.finalize(c)),
                    c.clamp();
                for (var f = this._oKey = c.clone(), g = this._iKey = c.clone(), h = f.words, i = g.words, j = 0; d > j; j++)
                    h[j] ^= 1549556828,
                        i[j] ^= 909522486;
                f.sigBytes = g.sigBytes = e,
                    this.reset()
            },
            reset: function () {
                var a = this._hasher;
                a.reset(),
                    a.update(this._iKey)
            },
            update: function (a) {
                return this._hasher.update(a),
                    this
            },
            finalize: function (a) {
                var b = this._hasher;
                return a = b.finalize(a),
                    b.reset(),
                    b.finalize(this._oKey.clone().concat(a))
            }
        })
    }(),
"object" != typeof JSON && (JSON = {}),
    function () {
        function f(a) {
            return 10 > a ? "0" + a : a
        }

        function quote(a) {
            return escapable.lastIndex = 0,
                escapable.test(a) ? '"' + a.replace(escapable, function (a) {
                    var b = meta[a];
                    return "string" == typeof b ? b : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                }) + '"' : '"' + a + '"'
        }

        function str(a, b) {
            var c, d, e, f, g, h = gap, i = b[a];
            switch (i && "object" == typeof i && "function" == typeof i.toJSON && (i = i.toJSON(a)),
            "function" == typeof rep && (i = rep.call(b, a, i)),
                typeof i) {
                case "string":
                    return quote(i);
                case "number":
                    return isFinite(i) ? String(i) : "null";
                case "boolean":
                case "null":
                    return String(i);
                case "object":
                    if (!i)
                        return "null";
                    if (gap += indent,
                            g = [],
                        "[object Array]" === Object.prototype.toString.apply(i)) {
                        for (f = i.length,
                                 c = 0; f > c; c += 1)
                            g[c] = str(c, i) || "null";
                        return e = 0 === g.length ? "[]" : gap ? "[\n" + gap + g.join(",\n" + gap) + "\n" + h + "]" : "[" + g.join(",") + "]",
                            gap = h,
                            e
                    }
                    if (rep && "object" == typeof rep)
                        for (f = rep.length,
                                 c = 0; f > c; c += 1)
                            "string" == typeof rep[c] && (d = rep[c],
                                e = str(d, i),
                            e && g.push(quote(d) + (gap ? ": " : ":") + e));
                    else
                        for (d in i)
                            Object.prototype.hasOwnProperty.call(i, d) && (e = str(d, i),
                            e && g.push(quote(d) + (gap ? ": " : ":") + e));
                    return e = 0 === g.length ? "{}" : gap ? "{\n" + gap + g.join(",\n" + gap) + "\n" + h + "}" : "{" + g.join(",") + "}",
                        gap = h,
                        e
            }
        }

        "function" != typeof Date.prototype.toJSON && (Date.prototype.toJSON = function () {
                return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
            }
                ,
                String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function () {
                    return this.valueOf()
                }
        );
        var cx, escapable, gap, indent, meta, rep;
        "function" != typeof JSON.stringify && (escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                meta = {
                    "\b": "\\b",
                    "	": "\\t",
                    "\n": "\\n",
                    "\f": "\\f",
                    "\r": "\\r",
                    '"': '\\"',
                    "\\": "\\\\"
                },
                JSON.stringify = function (a, b, c) {
                    var d;
                    if (gap = "",
                            indent = "",
                        "number" == typeof c)
                        for (d = 0; c > d; d += 1)
                            indent += " ";
                    else
                        "string" == typeof c && (indent = c);
                    if (rep = b,
                        b && "function" != typeof b && ("object" != typeof b || "number" != typeof b.length))
                        throw new Error("JSON.stringify");
                    return str("", {
                        "": a
                    })
                }
        ),
        "function" != typeof JSON.parse && (cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                JSON.parse = function (text, reviver) {
                    function walk(a, b) {
                        var c, d, e = a[b];
                        if (e && "object" == typeof e)
                            for (c in e)
                                Object.prototype.hasOwnProperty.call(e, c) && (d = walk(e, c),
                                    void 0 !== d ? e[c] = d : delete e[c]);
                        return reviver.call(a, b, e)
                    }

                    var j;
                    if (text = String(text),
                            cx.lastIndex = 0,
                        cx.test(text) && (text = text.replace(cx, function (a) {
                            return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                        })),
                            /^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, "")))
                        return j = eval("(" + text + ")"),
                            "function" == typeof reviver ? walk({
                                "": j
                            }, "") : j;
                    throw new SyntaxError("JSON.parse")
                }
        )
    }(),
    function (a) {
        a.easing.jswing = a.easing.swing,
            a.extend(a.easing, {
                def: "easeOutQuad",
                swing: function (b, c, d, e, f) {
                    return a.easing[a.easing.def](b, c, d, e, f)
                },
                easeInQuad: function (a, b, c, d, e) {
                    return d * (b /= e) * b + c
                },
                easeOutQuad: function (a, b, c, d, e) {
                    return -d * (b /= e) * (b - 2) + c
                },
                easeInOutQuad: function (a, b, c, d, e) {
                    return (b /= e / 2) < 1 ? d / 2 * b * b + c : -d / 2 * (--b * (b - 2) - 1) + c
                },
                easeInCubic: function (a, b, c, d, e) {
                    return d * (b /= e) * b * b + c
                },
                easeOutCubic: function (a, b, c, d, e) {
                    return d * ((b = b / e - 1) * b * b + 1) + c
                },
                easeInOutCubic: function (a, b, c, d, e) {
                    return (b /= e / 2) < 1 ? d / 2 * b * b * b + c : d / 2 * ((b -= 2) * b * b + 2) + c
                },
                easeInQuart: function (a, b, c, d, e) {
                    return d * (b /= e) * b * b * b + c
                },
                easeOutQuart: function (a, b, c, d, e) {
                    return -d * ((b = b / e - 1) * b * b * b - 1) + c
                },
                easeInOutQuart: function (a, b, c, d, e) {
                    return (b /= e / 2) < 1 ? d / 2 * b * b * b * b + c : -d / 2 * ((b -= 2) * b * b * b - 2) + c
                },
                easeInQuint: function (a, b, c, d, e) {
                    return d * (b /= e) * b * b * b * b + c
                },
                easeOutQuint: function (a, b, c, d, e) {
                    return d * ((b = b / e - 1) * b * b * b * b + 1) + c
                },
                easeInOutQuint: function (a, b, c, d, e) {
                    return (b /= e / 2) < 1 ? d / 2 * b * b * b * b * b + c : d / 2 * ((b -= 2) * b * b * b * b + 2) + c
                },
                easeInSine: function (a, b, c, d, e) {
                    return -d * Math.cos(b / e * (Math.PI / 2)) + d + c
                },
                easeOutSine: function (a, b, c, d, e) {
                    return d * Math.sin(b / e * (Math.PI / 2)) + c
                },
                easeInOutSine: function (a, b, c, d, e) {
                    return -d / 2 * (Math.cos(Math.PI * b / e) - 1) + c
                },
                easeInExpo: function (a, b, c, d, e) {
                    return 0 == b ? c : d * Math.pow(2, 10 * (b / e - 1)) + c
                },
                easeOutExpo: function (a, b, c, d, e) {
                    return b == e ? c + d : d * (-Math.pow(2, -10 * b / e) + 1) + c
                },
                easeInOutExpo: function (a, b, c, d, e) {
                    return 0 == b ? c : b == e ? c + d : (b /= e / 2) < 1 ? d / 2 * Math.pow(2, 10 * (b - 1)) + c : d / 2 * (-Math.pow(2, -10 * --b) + 2) + c
                },
                easeInCirc: function (a, b, c, d, e) {
                    return -d * (Math.sqrt(1 - (b /= e) * b) - 1) + c
                },
                easeOutCirc: function (a, b, c, d, e) {
                    return d * Math.sqrt(1 - (b = b / e - 1) * b) + c
                },
                easeInOutCirc: function (a, b, c, d, e) {
                    return (b /= e / 2) < 1 ? -d / 2 * (Math.sqrt(1 - b * b) - 1) + c : d / 2 * (Math.sqrt(1 - (b -= 2) * b) + 1) + c
                },
                easeInElastic: function (a, b, c, d, e) {
                    var f = 1.70158
                        , g = 0
                        , h = d;
                    if (0 == b)
                        return c;
                    if (1 == (b /= e))
                        return c + d;
                    if (g || (g = .3 * e),
                        h < Math.abs(d)) {
                        h = d;
                        var f = g / 4
                    } else
                        var f = g / (2 * Math.PI) * Math.asin(d / h);
                    return -(h * Math.pow(2, 10 * (b -= 1)) * Math.sin((b * e - f) * (2 * Math.PI) / g)) + c
                },
                easeOutElastic: function (a, b, c, d, e) {
                    var f = 1.70158
                        , g = 0
                        , h = d;
                    if (0 == b)
                        return c;
                    if (1 == (b /= e))
                        return c + d;
                    if (g || (g = .3 * e),
                        h < Math.abs(d)) {
                        h = d;
                        var f = g / 4
                    } else
                        var f = g / (2 * Math.PI) * Math.asin(d / h);
                    return h * Math.pow(2, -10 * b) * Math.sin((b * e - f) * (2 * Math.PI) / g) + d + c
                },
                easeInOutElastic: function (a, b, c, d, e) {
                    var f = 1.70158
                        , g = 0
                        , h = d;
                    if (0 == b)
                        return c;
                    if (2 == (b /= e / 2))
                        return c + d;
                    if (g || (g = e * (.3 * 1.5)),
                        h < Math.abs(d)) {
                        h = d;
                        var f = g / 4
                    } else
                        var f = g / (2 * Math.PI) * Math.asin(d / h);
                    return 1 > b ? -.5 * (h * Math.pow(2, 10 * (b -= 1)) * Math.sin((b * e - f) * (2 * Math.PI) / g)) + c : h * Math.pow(2, -10 * (b -= 1)) * Math.sin((b * e - f) * (2 * Math.PI) / g) * .5 + d + c
                },
                easeInBack: function (a, b, c, d, e, f) {
                    return void 0 == f && (f = 1.70158),
                    d * (b /= e) * b * ((f + 1) * b - f) + c
                },
                easeOutBack: function (a, b, c, d, e, f) {
                    return void 0 == f && (f = 1.70158),
                    d * ((b = b / e - 1) * b * ((f + 1) * b + f) + 1) + c
                },
                easeInOutBack: function (a, b, c, d, e, f) {
                    return void 0 == f && (f = 1.70158),
                        (b /= e / 2) < 1 ? d / 2 * (b * b * (((f *= 1.525) + 1) * b - f)) + c : d / 2 * ((b -= 2) * b * (((f *= 1.525) + 1) * b + f) + 2) + c
                },
                easeInBounce: function (b, c, d, e, f) {
                    return e - a.easing.easeOutBounce(b, f - c, 0, e, f) + d
                },
                easeOutBounce: function (a, b, c, d, e) {
                    return (b /= e) < 1 / 2.75 ? d * (7.5625 * b * b) + c : 2 / 2.75 > b ? d * (7.5625 * (b -= 1.5 / 2.75) * b + .75) + c : 2.5 / 2.75 > b ? d * (7.5625 * (b -= 2.25 / 2.75) * b + .9375) + c : d * (7.5625 * (b -= 2.625 / 2.75) * b + .984375) + c
                },
                easeInOutBounce: function (b, c, d, e, f) {
                    return f / 2 > c ? .5 * a.easing.easeInBounce(b, 2 * c, 0, e, f) + d : .5 * a.easing.easeOutBounce(b, 2 * c - f, 0, e, f) + .5 * e + d
                }
            })
    }(jQuery),
    function (a, b, c) {
        function d(a) {
            var b = {}
                , d = /^jQuery\d+$/;
            return c.each(a.attributes, function (a, c) {
                c.specified && !d.test(c.name) && (b[c.name] = c.value)
            }),
                b
        }

        function e(a, b) {
            var d = this
                , e = c(d);
            if (d.value == e.attr("placeholder") && e.hasClass("placeholder"))
                if (e.data("placeholder-password")) {
                    if (e = e.hide().next().show().attr("id", e.removeAttr("id").data("placeholder-id")),
                        a === !0)
                        return e[0].value = b;
                    e.focus()
                } else
                    d.value = "",
                        e.removeClass("placeholder"),
                    d == g() && d.select()
        }

        function f() {
            var a, b = this, f = c(b), g = this.id;
            if ("" == b.value) {
                if ("password" == b.type) {
                    if (!f.data("placeholder-textinput")) {
                        try {
                            a = f.clone().attr({
                                type: "text"
                            })
                        } catch (h) {
                            a = c("<input>").attr(c.extend(d(this), {
                                type: "text"
                            }))
                        }
                        a.removeAttr("name").data({
                            "placeholder-password": f,
                            "placeholder-id": g
                        }).bind("focus.placeholder", e),
                            f.data({
                                "placeholder-textinput": a,
                                "placeholder-id": g
                            }).before(a)
                    }
                    f = f.removeAttr("id").hide().prev().attr("id", g).show()
                }
                f.addClass("placeholder"),
                    f[0].value = f.attr("placeholder")
            } else
                f.removeClass("placeholder")
        }

        function g() {
            try {
                return b.activeElement
            } catch (a) {
            }
        }

        var h, i, j = "[object OperaMini]" == Object.prototype.toString.call(a.operamini), k = "placeholder" in b.createElement("input") && !j, l = "placeholder" in b.createElement("textarea") && !j, m = c.fn, n = c.valHooks, o = c.propHooks;
        k && l ? (i = m.placeholder = function () {
            return this
        }
            ,
            i.input = i.textarea = !0) : (i = m.placeholder = function () {
            var a = this;
            return a.filter((k ? "textarea" : ":input") + "[placeholder]").not(".placeholder").bind({
                "focus.placeholder": e,
                "blur.placeholder": f
            }).data("placeholder-enabled", !0).trigger("blur.placeholder"),
                a
        }
            ,
            i.input = k,
            i.textarea = l,
            h = {
                get: function (a) {
                    var b = c(a)
                        , d = b.data("placeholder-password");
                    return d ? d[0].value : b.data("placeholder-enabled") && b.hasClass("placeholder") ? "" : a.value
                },
                set: function (a, b) {
                    var d = c(a)
                        , h = d.data("placeholder-password");
                    return h ? h[0].value = b : d.data("placeholder-enabled") ? ("" == b ? (a.value = b,
                    a != g() && f.call(a)) : d.hasClass("placeholder") ? e.call(a, !0, b) || (a.value = b) : a.value = b,
                        d) : a.value = b
                }
            },
        k || (n.input = h,
            o.value = h),
        l || (n.textarea = h,
            o.value = h),
            c(function () {
                c(b).delegate("form", "submit.placeholder", function () {
                    var a = c(".placeholder", this).each(e);
                    setTimeout(function () {
                        a.each(f)
                    }, 10)
                })
            }),
            c(a).bind("beforeunload.placeholder", function () {
                c(".placeholder").each(function () {
                    this.value = ""
                })
            }))
    }(this, document, jQuery),
    function (a) {
        a.fn.qrcode = function (b) {
            function c(a) {
                this.mode = h,
                    this.data = a
            }

            function d(a, b) {
                this.typeNumber = a,
                    this.errorCorrectLevel = b,
                    this.modules = null ,
                    this.moduleCount = 0,
                    this.dataCache = null ,
                    this.dataList = []
            }

            function e(a, b) {
                if (void 0 == a.length)
                    throw Error(a.length + "/" + b);
                for (var c = 0; c < a.length && 0 == a[c];)
                    c++;
                this.num = Array(a.length - c + b);
                for (var d = 0; d < a.length - c; d++)
                    this.num[d] = a[d + c]
            }

            function f(a, b) {
                this.totalCount = a,
                    this.dataCount = b
            }

            function g() {
                this.buffer = [],
                    this.length = 0
            }

            var h;
            c.prototype = {
                getLength: function () {
                    return this.data.length
                },
                write: function (a) {
                    for (var b = 0; b < this.data.length; b++)
                        a.put(this.data.charCodeAt(b), 8)
                }
            },
                d.prototype = {
                    addData: function (a) {
                        this.dataList.push(new c(a)),
                            this.dataCache = null
                    },
                    isDark: function (a, b) {
                        if (0 > a || this.moduleCount <= a || 0 > b || this.moduleCount <= b)
                            throw Error(a + "," + b);
                        return this.modules[a][b]
                    },
                    getModuleCount: function () {
                        return this.moduleCount
                    },
                    make: function () {
                        if (1 > this.typeNumber) {
                            for (var a = 1, a = 1; 40 > a; a++) {
                                for (var b = f.getRSBlocks(a, this.errorCorrectLevel), c = new g, d = 0, e = 0; e < b.length; e++)
                                    d += b[e].dataCount;
                                for (e = 0; e < this.dataList.length; e++)
                                    b = this.dataList[e],
                                        c.put(b.mode, 4),
                                        c.put(b.getLength(), i.getLengthInBits(b.mode, a)),
                                        b.write(c);
                                if (c.getLengthInBits() <= 8 * d)
                                    break
                            }
                            this.typeNumber = a
                        }
                        this.makeImpl(!1, this.getBestMaskPattern())
                    },
                    makeImpl: function (a, b) {
                        this.moduleCount = 4 * this.typeNumber + 17,
                            this.modules = Array(this.moduleCount);
                        for (var c = 0; c < this.moduleCount; c++) {
                            this.modules[c] = Array(this.moduleCount);
                            for (var e = 0; e < this.moduleCount; e++)
                                this.modules[c][e] = null
                        }
                        this.setupPositionProbePattern(0, 0),
                            this.setupPositionProbePattern(this.moduleCount - 7, 0),
                            this.setupPositionProbePattern(0, this.moduleCount - 7),
                            this.setupPositionAdjustPattern(),
                            this.setupTimingPattern(),
                            this.setupTypeInfo(a, b),
                        7 <= this.typeNumber && this.setupTypeNumber(a),
                        null == this.dataCache && (this.dataCache = d.createData(this.typeNumber, this.errorCorrectLevel, this.dataList)),
                            this.mapData(this.dataCache, b)
                    },
                    setupPositionProbePattern: function (a, b) {
                        for (var c = -1; 7 >= c; c++)
                            if (!(-1 >= a + c || this.moduleCount <= a + c))
                                for (var d = -1; 7 >= d; d++)
                                    -1 >= b + d || this.moduleCount <= b + d || (this.modules[a + c][b + d] = c >= 0 && 6 >= c && (0 == d || 6 == d) || d >= 0 && 6 >= d && (0 == c || 6 == c) || c >= 2 && 4 >= c && d >= 2 && 4 >= d)
                    },
                    getBestMaskPattern: function () {
                        for (var a = 0, b = 0, c = 0; 8 > c; c++) {
                            this.makeImpl(!0, c);
                            var d = i.getLostPoint(this);
                            (0 == c || a > d) && (a = d,
                                b = c)
                        }
                        return b
                    },
                    createMovieClip: function (a, b, c) {
                        for (a = a.createEmptyMovieClip(b, c),
                                 this.make(),
                                 b = 0; b < this.modules.length; b++)
                            for (var c = 1 * b, d = 0; d < this.modules[b].length; d++) {
                                var e = 1 * d;
                                this.modules[b][d] && (a.beginFill(0, 100),
                                    a.moveTo(e, c),
                                    a.lineTo(e + 1, c),
                                    a.lineTo(e + 1, c + 1),
                                    a.lineTo(e, c + 1),
                                    a.endFill())
                            }
                        return a
                    },
                    setupTimingPattern: function () {
                        for (var a = 8; a < this.moduleCount - 8; a++)
                            null == this.modules[a][6] && (this.modules[a][6] = 0 == a % 2);
                        for (a = 8; a < this.moduleCount - 8; a++)
                            null == this.modules[6][a] && (this.modules[6][a] = 0 == a % 2)
                    },
                    setupPositionAdjustPattern: function () {
                        for (var a = i.getPatternPosition(this.typeNumber), b = 0; b < a.length; b++)
                            for (var c = 0; c < a.length; c++) {
                                var d = a[b]
                                    , e = a[c];
                                if (null == this.modules[d][e])
                                    for (var f = -2; 2 >= f; f++)
                                        for (var g = -2; 2 >= g; g++)
                                            this.modules[d + f][e + g] = -2 == f || 2 == f || -2 == g || 2 == g || 0 == f && 0 == g
                            }
                    },
                    setupTypeNumber: function (a) {
                        for (var b = i.getBCHTypeNumber(this.typeNumber), c = 0; 18 > c; c++) {
                            var d = !a && 1 == (b >> c & 1);
                            this.modules[Math.floor(c / 3)][c % 3 + this.moduleCount - 8 - 3] = d
                        }
                        for (c = 0; 18 > c; c++)
                            d = !a && 1 == (b >> c & 1),
                                this.modules[c % 3 + this.moduleCount - 8 - 3][Math.floor(c / 3)] = d
                    },
                    setupTypeInfo: function (a, b) {
                        for (var c = i.getBCHTypeInfo(this.errorCorrectLevel << 3 | b), d = 0; 15 > d; d++) {
                            var e = !a && 1 == (c >> d & 1);
                            6 > d ? this.modules[d][8] = e : 8 > d ? this.modules[d + 1][8] = e : this.modules[this.moduleCount - 15 + d][8] = e
                        }
                        for (d = 0; 15 > d; d++)
                            e = !a && 1 == (c >> d & 1),
                                8 > d ? this.modules[8][this.moduleCount - d - 1] = e : 9 > d ? this.modules[8][15 - d - 1 + 1] = e : this.modules[8][15 - d - 1] = e;
                        this.modules[this.moduleCount - 8][8] = !a
                    },
                    mapData: function (a, b) {
                        for (var c = -1, d = this.moduleCount - 1, e = 7, f = 0, g = this.moduleCount - 1; g > 0; g -= 2)
                            for (6 == g && g--; ;) {
                                for (var h = 0; 2 > h; h++)
                                    if (null == this.modules[d][g - h]) {
                                        var j = !1;
                                        f < a.length && (j = 1 == (a[f] >>> e & 1)),
                                        i.getMask(b, d, g - h) && (j = !j),
                                            this.modules[d][g - h] = j,
                                            e--,
                                        -1 == e && (f++,
                                            e = 7)
                                    }
                                if (d += c,
                                    0 > d || this.moduleCount <= d) {
                                    d -= c,
                                        c = -c;
                                    break
                                }
                            }
                    }
                },
                d.PAD0 = 236,
                d.PAD1 = 17,
                d.createData = function (a, b, c) {
                    for (var b = f.getRSBlocks(a, b), e = new g, h = 0; h < c.length; h++) {
                        var j = c[h];
                        e.put(j.mode, 4),
                            e.put(j.getLength(), i.getLengthInBits(j.mode, a)),
                            j.write(e)
                    }
                    for (h = a = 0; h < b.length; h++)
                        a += b[h].dataCount;
                    if (e.getLengthInBits() > 8 * a)
                        throw Error("code length overflow. (" + e.getLengthInBits() + ">" + 8 * a + ")");
                    for (e.getLengthInBits() + 4 <= 8 * a && e.put(0, 4); 0 != e.getLengthInBits() % 8;)
                        e.putBit(!1);
                    for (; !(e.getLengthInBits() >= 8 * a || (e.put(d.PAD0, 8),
                    e.getLengthInBits() >= 8 * a));)
                        e.put(d.PAD1, 8);
                    return d.createBytes(e, b)
                }
                ,
                d.createBytes = function (a, b) {
                    for (var c = 0, d = 0, f = 0, g = Array(b.length), h = Array(b.length), j = 0; j < b.length; j++) {
                        var k = b[j].dataCount
                            , l = b[j].totalCount - k
                            , d = Math.max(d, k)
                            , f = Math.max(f, l);
                        g[j] = Array(k);
                        for (var m = 0; m < g[j].length; m++)
                            g[j][m] = 255 & a.buffer[m + c];
                        for (c += k,
                                 m = i.getErrorCorrectPolynomial(l),
                                 k = new e(g[j], m.getLength() - 1).mod(m),
                                 h[j] = Array(m.getLength() - 1),
                                 m = 0; m < h[j].length; m++)
                            l = m + k.getLength() - h[j].length,
                                h[j][m] = l >= 0 ? k.get(l) : 0
                    }
                    for (m = j = 0; m < b.length; m++)
                        j += b[m].totalCount;
                    for (c = Array(j),
                             m = k = 0; d > m; m++)
                        for (j = 0; j < b.length; j++)
                            m < g[j].length && (c[k++] = g[j][m]);
                    for (m = 0; f > m; m++)
                        for (j = 0; j < b.length; j++)
                            m < h[j].length && (c[k++] = h[j][m]);
                    return c
                }
                ,
                h = 4;
            for (var i = {
                PATTERN_POSITION_TABLE: [[], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54], [6, 32, 58], [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90], [6, 28, 50, 72, 94], [6, 26, 50, 74, 98], [6, 30, 54, 78, 102], [6, 28, 54, 80, 106], [6, 32, 58, 84, 110], [6, 30, 58, 86, 114], [6, 34, 62, 90, 118], [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126], [6, 26, 52, 78, 104, 130], [6, 30, 56, 82, 108, 134], [6, 34, 60, 86, 112, 138], [6, 30, 58, 86, 114, 142], [6, 34, 62, 90, 118, 146], [6, 30, 54, 78, 102, 126, 150], [6, 24, 50, 76, 102, 128, 154], [6, 28, 54, 80, 106, 132, 158], [6, 32, 58, 84, 110, 136, 162], [6, 26, 54, 82, 110, 138, 166], [6, 30, 58, 86, 114, 142, 170]],
                G15: 1335,
                G18: 7973,
                G15_MASK: 21522,
                getBCHTypeInfo: function (a) {
                    for (var b = a << 10; 0 <= i.getBCHDigit(b) - i.getBCHDigit(i.G15);)
                        b ^= i.G15 << i.getBCHDigit(b) - i.getBCHDigit(i.G15);
                    return (a << 10 | b) ^ i.G15_MASK
                },
                getBCHTypeNumber: function (a) {
                    for (var b = a << 12; 0 <= i.getBCHDigit(b) - i.getBCHDigit(i.G18);)
                        b ^= i.G18 << i.getBCHDigit(b) - i.getBCHDigit(i.G18);
                    return a << 12 | b
                },
                getBCHDigit: function (a) {
                    for (var b = 0; 0 != a;)
                        b++,
                            a >>>= 1;
                    return b
                },
                getPatternPosition: function (a) {
                    return i.PATTERN_POSITION_TABLE[a - 1]
                },
                getMask: function (a, b, c) {
                    switch (a) {
                        case 0:
                            return 0 == (b + c) % 2;
                        case 1:
                            return 0 == b % 2;
                        case 2:
                            return 0 == c % 3;
                        case 3:
                            return 0 == (b + c) % 3;
                        case 4:
                            return 0 == (Math.floor(b / 2) + Math.floor(c / 3)) % 2;
                        case 5:
                            return 0 == b * c % 2 + b * c % 3;
                        case 6:
                            return 0 == (b * c % 2 + b * c % 3) % 2;
                        case 7:
                            return 0 == (b * c % 3 + (b + c) % 2) % 2;
                        default:
                            throw Error("bad maskPattern:" + a)
                    }
                },
                getErrorCorrectPolynomial: function (a) {
                    for (var b = new e([1], 0), c = 0; a > c; c++)
                        b = b.multiply(new e([1, j.gexp(c)], 0));
                    return b
                },
                getLengthInBits: function (a, b) {
                    if (b >= 1 && 10 > b)
                        switch (a) {
                            case 1:
                                return 10;
                            case 2:
                                return 9;
                            case h:
                                return 8;
                            case 8:
                                return 8;
                            default:
                                throw Error("mode:" + a)
                        }
                    else if (27 > b)
                        switch (a) {
                            case 1:
                                return 12;
                            case 2:
                                return 11;
                            case h:
                                return 16;
                            case 8:
                                return 10;
                            default:
                                throw Error("mode:" + a)
                        }
                    else {
                        if (!(41 > b))
                            throw Error("type:" + b);
                        switch (a) {
                            case 1:
                                return 14;
                            case 2:
                                return 13;
                            case h:
                                return 16;
                            case 8:
                                return 12;
                            default:
                                throw Error("mode:" + a)
                        }
                    }
                },
                getLostPoint: function (a) {
                    for (var b = a.getModuleCount(), c = 0, d = 0; b > d; d++)
                        for (var e = 0; b > e; e++) {
                            for (var f = 0, g = a.isDark(d, e), h = -1; 1 >= h; h++)
                                if (!(0 > d + h || d + h >= b))
                                    for (var i = -1; 1 >= i; i++)
                                        0 > e + i || e + i >= b || 0 == h && 0 == i || g == a.isDark(d + h, e + i) && f++;
                            f > 5 && (c += 3 + f - 5)
                        }
                    for (d = 0; b - 1 > d; d++)
                        for (e = 0; b - 1 > e; e++)
                            f = 0,
                            a.isDark(d, e) && f++,
                            a.isDark(d + 1, e) && f++,
                            a.isDark(d, e + 1) && f++,
                            a.isDark(d + 1, e + 1) && f++,
                            (0 == f || 4 == f) && (c += 3);
                    for (d = 0; b > d; d++)
                        for (e = 0; b - 6 > e; e++)
                            a.isDark(d, e) && !a.isDark(d, e + 1) && a.isDark(d, e + 2) && a.isDark(d, e + 3) && a.isDark(d, e + 4) && !a.isDark(d, e + 5) && a.isDark(d, e + 6) && (c += 40);
                    for (e = 0; b > e; e++)
                        for (d = 0; b - 6 > d; d++)
                            a.isDark(d, e) && !a.isDark(d + 1, e) && a.isDark(d + 2, e) && a.isDark(d + 3, e) && a.isDark(d + 4, e) && !a.isDark(d + 5, e) && a.isDark(d + 6, e) && (c += 40);
                    for (e = f = 0; b > e; e++)
                        for (d = 0; b > d; d++)
                            a.isDark(d, e) && f++;
                    return a = Math.abs(100 * f / b / b - 50) / 5,
                    c + 10 * a
                }
            }, j = {
                glog: function (a) {
                    if (1 > a)
                        throw Error("glog(" + a + ")");
                    return j.LOG_TABLE[a]
                },
                gexp: function (a) {
                    for (; 0 > a;)
                        a += 255;
                    for (; a >= 256;)
                        a -= 255;
                    return j.EXP_TABLE[a]
                },
                EXP_TABLE: Array(256),
                LOG_TABLE: Array(256)
            }, k = 0; 8 > k; k++)
                j.EXP_TABLE[k] = 1 << k;
            for (k = 8; 256 > k; k++)
                j.EXP_TABLE[k] = j.EXP_TABLE[k - 4] ^ j.EXP_TABLE[k - 5] ^ j.EXP_TABLE[k - 6] ^ j.EXP_TABLE[k - 8];
            for (k = 0; 255 > k; k++)
                j.LOG_TABLE[j.EXP_TABLE[k]] = k;
            return e.prototype = {
                get: function (a) {
                    return this.num[a]
                },
                getLength: function () {
                    return this.num.length
                },
                multiply: function (a) {
                    for (var b = Array(this.getLength() + a.getLength() - 1), c = 0; c < this.getLength(); c++)
                        for (var d = 0; d < a.getLength(); d++)
                            b[c + d] ^= j.gexp(j.glog(this.get(c)) + j.glog(a.get(d)));
                    return new e(b, 0)
                },
                mod: function (a) {
                    if (0 > this.getLength() - a.getLength())
                        return this;
                    for (var b = j.glog(this.get(0)) - j.glog(a.get(0)), c = Array(this.getLength()), d = 0; d < this.getLength(); d++)
                        c[d] = this.get(d);
                    for (d = 0; d < a.getLength(); d++)
                        c[d] ^= j.gexp(j.glog(a.get(d)) + b);
                    return new e(c, 0).mod(a)
                }
            },
                f.RS_BLOCK_TABLE = [[1, 26, 19], [1, 26, 16], [1, 26, 13], [1, 26, 9], [1, 44, 34], [1, 44, 28], [1, 44, 22], [1, 44, 16], [1, 70, 55], [1, 70, 44], [2, 35, 17], [2, 35, 13], [1, 100, 80], [2, 50, 32], [2, 50, 24], [4, 25, 9], [1, 134, 108], [2, 67, 43], [2, 33, 15, 2, 34, 16], [2, 33, 11, 2, 34, 12], [2, 86, 68], [4, 43, 27], [4, 43, 19], [4, 43, 15], [2, 98, 78], [4, 49, 31], [2, 32, 14, 4, 33, 15], [4, 39, 13, 1, 40, 14], [2, 121, 97], [2, 60, 38, 2, 61, 39], [4, 40, 18, 2, 41, 19], [4, 40, 14, 2, 41, 15], [2, 146, 116], [3, 58, 36, 2, 59, 37], [4, 36, 16, 4, 37, 17], [4, 36, 12, 4, 37, 13], [2, 86, 68, 2, 87, 69], [4, 69, 43, 1, 70, 44], [6, 43, 19, 2, 44, 20], [6, 43, 15, 2, 44, 16], [4, 101, 81], [1, 80, 50, 4, 81, 51], [4, 50, 22, 4, 51, 23], [3, 36, 12, 8, 37, 13], [2, 116, 92, 2, 117, 93], [6, 58, 36, 2, 59, 37], [4, 46, 20, 6, 47, 21], [7, 42, 14, 4, 43, 15], [4, 133, 107], [8, 59, 37, 1, 60, 38], [8, 44, 20, 4, 45, 21], [12, 33, 11, 4, 34, 12], [3, 145, 115, 1, 146, 116], [4, 64, 40, 5, 65, 41], [11, 36, 16, 5, 37, 17], [11, 36, 12, 5, 37, 13], [5, 109, 87, 1, 110, 88], [5, 65, 41, 5, 66, 42], [5, 54, 24, 7, 55, 25], [11, 36, 12], [5, 122, 98, 1, 123, 99], [7, 73, 45, 3, 74, 46], [15, 43, 19, 2, 44, 20], [3, 45, 15, 13, 46, 16], [1, 135, 107, 5, 136, 108], [10, 74, 46, 1, 75, 47], [1, 50, 22, 15, 51, 23], [2, 42, 14, 17, 43, 15], [5, 150, 120, 1, 151, 121], [9, 69, 43, 4, 70, 44], [17, 50, 22, 1, 51, 23], [2, 42, 14, 19, 43, 15], [3, 141, 113, 4, 142, 114], [3, 70, 44, 11, 71, 45], [17, 47, 21, 4, 48, 22], [9, 39, 13, 16, 40, 14], [3, 135, 107, 5, 136, 108], [3, 67, 41, 13, 68, 42], [15, 54, 24, 5, 55, 25], [15, 43, 15, 10, 44, 16], [4, 144, 116, 4, 145, 117], [17, 68, 42], [17, 50, 22, 6, 51, 23], [19, 46, 16, 6, 47, 17], [2, 139, 111, 7, 140, 112], [17, 74, 46], [7, 54, 24, 16, 55, 25], [34, 37, 13], [4, 151, 121, 5, 152, 122], [4, 75, 47, 14, 76, 48], [11, 54, 24, 14, 55, 25], [16, 45, 15, 14, 46, 16], [6, 147, 117, 4, 148, 118], [6, 73, 45, 14, 74, 46], [11, 54, 24, 16, 55, 25], [30, 46, 16, 2, 47, 17], [8, 132, 106, 4, 133, 107], [8, 75, 47, 13, 76, 48], [7, 54, 24, 22, 55, 25], [22, 45, 15, 13, 46, 16], [10, 142, 114, 2, 143, 115], [19, 74, 46, 4, 75, 47], [28, 50, 22, 6, 51, 23], [33, 46, 16, 4, 47, 17], [8, 152, 122, 4, 153, 123], [22, 73, 45, 3, 74, 46], [8, 53, 23, 26, 54, 24], [12, 45, 15, 28, 46, 16], [3, 147, 117, 10, 148, 118], [3, 73, 45, 23, 74, 46], [4, 54, 24, 31, 55, 25], [11, 45, 15, 31, 46, 16], [7, 146, 116, 7, 147, 117], [21, 73, 45, 7, 74, 46], [1, 53, 23, 37, 54, 24], [19, 45, 15, 26, 46, 16], [5, 145, 115, 10, 146, 116], [19, 75, 47, 10, 76, 48], [15, 54, 24, 25, 55, 25], [23, 45, 15, 25, 46, 16], [13, 145, 115, 3, 146, 116], [2, 74, 46, 29, 75, 47], [42, 54, 24, 1, 55, 25], [23, 45, 15, 28, 46, 16], [17, 145, 115], [10, 74, 46, 23, 75, 47], [10, 54, 24, 35, 55, 25], [19, 45, 15, 35, 46, 16], [17, 145, 115, 1, 146, 116], [14, 74, 46, 21, 75, 47], [29, 54, 24, 19, 55, 25], [11, 45, 15, 46, 46, 16], [13, 145, 115, 6, 146, 116], [14, 74, 46, 23, 75, 47], [44, 54, 24, 7, 55, 25], [59, 46, 16, 1, 47, 17], [12, 151, 121, 7, 152, 122], [12, 75, 47, 26, 76, 48], [39, 54, 24, 14, 55, 25], [22, 45, 15, 41, 46, 16], [6, 151, 121, 14, 152, 122], [6, 75, 47, 34, 76, 48], [46, 54, 24, 10, 55, 25], [2, 45, 15, 64, 46, 16], [17, 152, 122, 4, 153, 123], [29, 74, 46, 14, 75, 47], [49, 54, 24, 10, 55, 25], [24, 45, 15, 46, 46, 16], [4, 152, 122, 18, 153, 123], [13, 74, 46, 32, 75, 47], [48, 54, 24, 14, 55, 25], [42, 45, 15, 32, 46, 16], [20, 147, 117, 4, 148, 118], [40, 75, 47, 7, 76, 48], [43, 54, 24, 22, 55, 25], [10, 45, 15, 67, 46, 16], [19, 148, 118, 6, 149, 119], [18, 75, 47, 31, 76, 48], [34, 54, 24, 34, 55, 25], [20, 45, 15, 61, 46, 16]],
                f.getRSBlocks = function (a, b) {
                    var c = f.getRsBlockTable(a, b);
                    if (void 0 == c)
                        throw Error("bad rs block @ typeNumber:" + a + "/errorCorrectLevel:" + b);
                    for (var d = c.length / 3, e = [], g = 0; d > g; g++)
                        for (var h = c[3 * g + 0], i = c[3 * g + 1], j = c[3 * g + 2], k = 0; h > k; k++)
                            e.push(new f(i, j));
                    return e
                }
                ,
                f.getRsBlockTable = function (a, b) {
                    switch (b) {
                        case 1:
                            return f.RS_BLOCK_TABLE[4 * (a - 1) + 0];
                        case 0:
                            return f.RS_BLOCK_TABLE[4 * (a - 1) + 1];
                        case 3:
                            return f.RS_BLOCK_TABLE[4 * (a - 1) + 2];
                        case 2:
                            return f.RS_BLOCK_TABLE[4 * (a - 1) + 3]
                    }
                }
                ,
                g.prototype = {
                    get: function (a) {
                        return 1 == (this.buffer[Math.floor(a / 8)] >>> 7 - a % 8 & 1)
                    },
                    put: function (a, b) {
                        for (var c = 0; b > c; c++)
                            this.putBit(1 == (a >>> b - c - 1 & 1))
                    },
                    getLengthInBits: function () {
                        return this.length
                    },
                    putBit: function (a) {
                        var b = Math.floor(this.length / 8);
                        this.buffer.length <= b && this.buffer.push(0),
                        a && (this.buffer[b] |= 128 >>> this.length % 8),
                            this.length++
                    }
                },
            "string" == typeof b && (b = {
                text: b
            }),
                b = a.extend({}, {
                    render: "canvas",
                    width: 256,
                    height: 256,
                    typeNumber: -1,
                    correctLevel: 2,
                    background: "#ffffff",
                    foreground: "#000000"
                }, b),
                this.each(function () {
                    var c;
                    if ("canvas" == b.render) {
                        c = new d(b.typeNumber, b.correctLevel),
                            c.addData(b.text),
                            c.make();
                        var e = document.createElement("canvas");
                        e.width = b.width,
                            e.height = b.height;
                        for (var f = e.getContext("2d"), g = b.width / c.getModuleCount(), h = b.height / c.getModuleCount(), i = 0; i < c.getModuleCount(); i++)
                            for (var j = 0; j < c.getModuleCount(); j++) {
                                f.fillStyle = c.isDark(i, j) ? b.foreground : b.background;
                                var k = Math.ceil((j + 1) * g) - Math.floor(j * g)
                                    , l = Math.ceil((i + 1) * g) - Math.floor(i * g);
                                f.fillRect(Math.round(j * g), Math.round(i * h), k, l)
                            }
                    } else
                        for (c = new d(b.typeNumber, b.correctLevel),
                                 c.addData(b.text),
                                 c.make(),
                                 e = a("<table></table>").css("width", b.width + "px").css("height", b.height + "px").css("border", "0px").css("border-collapse", "collapse").css("background-color", b.background),
                                 f = b.width / c.getModuleCount(),
                                 g = b.height / c.getModuleCount(),
                                 h = 0; h < c.getModuleCount(); h++)
                            for (i = a("<tr></tr>").css("height", g + "px").appendTo(e),
                                     j = 0; j < c.getModuleCount(); j++)
                                a("<td></td>").css("width", f + "px").css("background-color", c.isDark(h, j) ? b.foreground : b.background).appendTo(i);
                    c = e,
                        jQuery(c).appendTo(this)
                })
        }
    }(jQuery),
    function (a) {
        a.fn.zclip = function (b) {
            if ("object" == typeof b && !b.length) {
                var c = a.extend({
                    path: "ZeroClipboard.swf",
                    copy: null,
                    beforeCopy: null,
                    afterCopy: null,
                    clickAfter: !0,
                    setHandCursor: !0,
                    setCSSEffects: !0
                }, b);
                return this.each(function () {
                    var b = a(this);
                    if (b.is(":visible") && ("string" == typeof c.copy || a.isFunction(c.copy))) {
                        ZeroClipboard.setMoviePath(c.path);
                        var d = new ZeroClipboard.Client;
                        a.isFunction(c.copy) && b.bind("zClip_copy", c.copy),
                        a.isFunction(c.beforeCopy) && b.bind("zClip_beforeCopy", c.beforeCopy),
                        a.isFunction(c.afterCopy) && b.bind("zClip_afterCopy", c.afterCopy),
                            d.setHandCursor(c.setHandCursor),
                            d.setCSSEffects(c.setCSSEffects),
                            d.addEventListener("mouseOver", function (a) {
                                b.trigger("mouseenter")
                            }),
                            d.addEventListener("mouseOut", function (a) {
                                b.trigger("mouseleave")
                            }),
                            d.addEventListener("mouseDown", function (e) {
                                b.trigger("mousedown"),
                                    a.isFunction(c.copy) ? d.setText(b.triggerHandler("zClip_copy")) : d.setText(c.copy),
                                a.isFunction(c.beforeCopy) && b.trigger("zClip_beforeCopy")
                            }),
                            d.addEventListener("complete", function (d, e) {
                                a.isFunction(c.afterCopy) ? b.trigger("zClip_afterCopy") : (e.length > 500 && (e = e.substr(0, 500) + "...\n\n(" + (e.length - 500) + " characters not shown)"),
                                    b.removeClass("hover"),
                                    alert("Copied text to clipboard:\n\n " + e)),
                                c.clickAfter && b.trigger("click")
                            }),
                            d.glue(b[0], b.parent()[0]),
                            a(window).bind("load resize", function () {
                                d.reposition()
                            })
                    }
                })
            }
            return "string" == typeof b ? this.each(function () {
                var c = a(this);
                b = b.toLowerCase();
                var d = c.data("zclipId")
                    , e = a("#" + d + ".zclip");
                "remove" == b ? (e.remove(),
                    c.removeClass("active hover")) : "hide" == b ? (e.hide(),
                    c.removeClass("active hover")) : "show" == b && e.show()
            }) : void 0
        }
    }(jQuery);
var ZeroClipboard = {
    version: "1.0.7",
    clients: {},
    moviePath: "ZeroClipboard.swf",
    nextId: 1,
    $: function (a) {
        return "string" == typeof a && (a = document.getElementById(a)),
        a.addClass || (a.hide = function () {
                this.style.display = "none"
            }
                ,
                a.show = function () {
                    this.style.display = ""
                }
                ,
                a.addClass = function (a) {
                    this.removeClass(a),
                        this.className += " " + a
                }
                ,
                a.removeClass = function (a) {
                    for (var b = this.className.split(/\s+/), c = -1, d = 0; d < b.length; d++)
                        b[d] == a && (c = d,
                            d = b.length);
                    return c > -1 && (b.splice(c, 1),
                        this.className = b.join(" ")),
                        this
                }
                ,
                a.hasClass = function (a) {
                    return !!this.className.match(new RegExp("\\s*" + a + "\\s*"))
                }
        ),
            a
    },
    setMoviePath: function (a) {
        this.moviePath = a
    },
    dispatch: function (a, b, c) {
        var d = this.clients[a];
        d && d.receiveEvent(b, c)
    },
    register: function (a, b) {
        this.clients[a] = b
    },
    getDOMObjectPosition: function (a, b) {
        var c = {
            left: 0,
            top: 0,
            width: a.width ? a.width : a.offsetWidth,
            height: a.height ? a.height : a.offsetHeight
        };
        return a && a != b && (c.left += a.offsetLeft,
            c.top += a.offsetTop),
            c
    },
    Client: function (a) {
        this.handlers = {},
            this.id = ZeroClipboard.nextId++,
            this.movieId = "ZeroClipboardMovie_" + this.id,
            ZeroClipboard.register(this.id, this),
        a && this.glue(a)
    }
};
ZeroClipboard.Client.prototype = {
    id: 0,
    ready: !1,
    movie: null,
    clipText: "",
    handCursorEnabled: !0,
    cssEffects: !0,
    handlers: null,
    glue: function (a, b, c) {
        this.domElement = ZeroClipboard.$(a);
        var d = 99;
        this.domElement.style.zIndex && (d = parseInt(this.domElement.style.zIndex, 10) + 1),
            "string" == typeof b ? b = ZeroClipboard.$(b) : "undefined" == typeof b && (b = document.getElementsByTagName("body")[0]);
        var e = ZeroClipboard.getDOMObjectPosition(this.domElement, b);
        this.div = document.createElement("div"),
            this.div.className = "zclip",
            this.div.id = "zclip-" + this.movieId,
            $(this.domElement).data("zclipId", "zclip-" + this.movieId);
        var f = this.div.style;
        if (f.position = "absolute",
                f.left = "" + e.left + "px",
                f.top = "" + e.top + "px",
                f.width = "" + e.width + "px",
                f.height = "" + e.height + "px",
                f.zIndex = d,
            "object" == typeof c)
            for (addedStyle in c)
                f[addedStyle] = c[addedStyle];
        b.appendChild(this.div),
            this.div.innerHTML = this.getHTML(e.width, e.height)
    },
    getHTML: function (a, b) {
        var c = ""
            , d = "id=" + this.id + "&width=" + a + "&height=" + b;
        if (navigator.userAgent.match(/MSIE/)) {
            var e = location.href.match(/^https/i) ? "https://" : "http://";
            c += '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="' + e + 'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="' + a + '" height="' + b + '" id="' + this.movieId + '" align="middle"><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="' + ZeroClipboard.moviePath + '" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="' + d + '"/><param name="wmode" value="transparent"/></object>'
        } else
            c += '<embed id="' + this.movieId + '" src="' + ZeroClipboard.moviePath + '" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="' + a + '" height="' + b + '" name="' + this.movieId + '" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="' + d + '" wmode="transparent" />';
        return c
    },
    hide: function () {
        this.div && (this.div.style.left = "-2000px")
    },
    show: function () {
        this.reposition()
    },
    destroy: function () {
        if (this.domElement && this.div) {
            this.hide(),
                this.div.innerHTML = "";
            var a = document.getElementsByTagName("body")[0];
            try {
                a.removeChild(this.div)
            } catch (b) {
            }
            this.domElement = null ,
                this.div = null
        }
    },
    reposition: function (a) {
        if (a && (this.domElement = ZeroClipboard.$(a),
            this.domElement || this.hide()),
            this.domElement && this.div) {
            var b = ZeroClipboard.getDOMObjectPosition(this.domElement)
                , c = this.div.style;
            c.left = "" + b.left + "px",
                c.top = "" + b.top + "px"
        }
    },
    setText: function (a) {
        this.clipText = a,
        this.ready && this.movie.setText(a)
    },
    addEventListener: function (a, b) {
        a = a.toString().toLowerCase().replace(/^on/, ""),
        this.handlers[a] || (this.handlers[a] = []),
            this.handlers[a].push(b)
    },
    setHandCursor: function (a) {
        this.handCursorEnabled = a,
        this.ready && this.movie.setHandCursor(a)
    },
    setCSSEffects: function (a) {
        this.cssEffects = !!a
    },
    receiveEvent: function (a, b) {
        switch (a = a.toString().toLowerCase().replace(/^on/, "")) {
            case "load":
                if (this.movie = document.getElementById(this.movieId),
                        !this.movie) {
                    var c = this;
                    return void setTimeout(function () {
                        c.receiveEvent("load", null)
                    }, 1)
                }
                if (!this.ready && navigator.userAgent.match(/Firefox/) && navigator.userAgent.match(/Windows/)) {
                    var c = this;
                    return setTimeout(function () {
                        c.receiveEvent("load", null)
                    }, 100),
                        void (this.ready = !0)
                }
                this.ready = !0;
                try {
                    this.movie.setText(this.clipText)
                } catch (d) {
                }
                try {
                    this.movie.setHandCursor(this.handCursorEnabled)
                } catch (d) {
                }
                break;
            case "mouseover":
                this.domElement && this.cssEffects && (this.domElement.addClass("hover"),
                this.recoverActive && this.domElement.addClass("active"));
                break;
            case "mouseout":
                this.domElement && this.cssEffects && (this.recoverActive = !1,
                this.domElement.hasClass("active") && (this.domElement.removeClass("active"),
                    this.recoverActive = !0),
                    this.domElement.removeClass("hover"));
                break;
            case "mousedown":
                this.domElement && this.cssEffects && this.domElement.addClass("active");
                break;
            case "mouseup":
                this.domElement && this.cssEffects && (this.domElement.removeClass("active"),
                    this.recoverActive = !1)
        }
        if (this.handlers[a])
            for (var e = 0, f = this.handlers[a].length; f > e; e++) {
                var g = this.handlers[a][e];
                "function" == typeof g ? g(this, b) : "object" == typeof g && 2 == g.length ? g[0][g[1]](this, b) : "string" == typeof g && window[g](this, b)
            }
    }
},
    function (a) {
        "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof exports ? module.exports = a : a(jQuery)
    }(function (a) {
        function b(b) {
            var g = b || window.event
                , h = i.call(arguments, 1)
                , j = 0
                , l = 0
                , m = 0
                , n = 0
                , o = 0
                , p = 0;
            if (b = a.event.fix(g),
                    b.type = "mousewheel",
                "detail" in g && (m = -1 * g.detail),
                "wheelDelta" in g && (m = g.wheelDelta),
                "wheelDeltaY" in g && (m = g.wheelDeltaY),
                "wheelDeltaX" in g && (l = -1 * g.wheelDeltaX),
                "axis" in g && g.axis === g.HORIZONTAL_AXIS && (l = -1 * m,
                    m = 0),
                    j = 0 === m ? l : m,
                "deltaY" in g && (m = -1 * g.deltaY,
                    j = m),
                "deltaX" in g && (l = g.deltaX,
                0 === m && (j = -1 * l)),
                0 !== m || 0 !== l) {
                if (1 === g.deltaMode) {
                    var q = a.data(this, "mousewheel-line-height");
                    j *= q,
                        m *= q,
                        l *= q
                } else if (2 === g.deltaMode) {
                    var r = a.data(this, "mousewheel-page-height");
                    j *= r,
                        m *= r,
                        l *= r
                }
                if (n = Math.max(Math.abs(m), Math.abs(l)),
                    (!f || f > n) && (f = n,
                    d(g, n) && (f /= 40)),
                    d(g, n) && (j /= 40,
                        l /= 40,
                        m /= 40),
                        j = Math[j >= 1 ? "floor" : "ceil"](j / f),
                        l = Math[l >= 1 ? "floor" : "ceil"](l / f),
                        m = Math[m >= 1 ? "floor" : "ceil"](m / f),
                    k.settings.normalizeOffset && this.getBoundingClientRect) {
                    var s = this.getBoundingClientRect();
                    o = b.clientX - s.left,
                        p = b.clientY - s.top
                }
                return b.deltaX = l,
                    b.deltaY = m,
                    b.deltaFactor = f,
                    b.offsetX = o,
                    b.offsetY = p,
                    b.deltaMode = 0,
                    h.unshift(b, j, l, m),
                e && clearTimeout(e),
                    e = setTimeout(c, 200),
                    (a.event.dispatch || a.event.handle).apply(this, h)
            }
        }

        function c() {
            f = null
        }

        function d(a, b) {
            return k.settings.adjustOldDeltas && "mousewheel" === a.type && b % 120 === 0
        }

        var e, f, g = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"], h = "onwheel" in document || document.documentMode >= 9 ? ["wheel"] : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"], i = Array.prototype.slice;
        if (a.event.fixHooks)
            for (var j = g.length; j;)
                a.event.fixHooks[g[--j]] = a.event.mouseHooks;
        var k = a.event.special.mousewheel = {
            version: "3.1.12",
            setup: function () {
                if (this.addEventListener)
                    for (var c = h.length; c;)
                        this.addEventListener(h[--c], b, !1);
                else
                    this.onmousewheel = b;
                a.data(this, "mousewheel-line-height", k.getLineHeight(this)),
                    a.data(this, "mousewheel-page-height", k.getPageHeight(this))
            },
            teardown: function () {
                if (this.removeEventListener)
                    for (var c = h.length; c;)
                        this.removeEventListener(h[--c], b, !1);
                else
                    this.onmousewheel = null;
                a.removeData(this, "mousewheel-line-height"),
                    a.removeData(this, "mousewheel-page-height")
            },
            getLineHeight: function (b) {
                var c = a(b)
                    , d = c["offsetParent" in a.fn ? "offsetParent" : "parent"]();
                return d.length || (d = a("body")),
                parseInt(d.css("fontSize"), 10) || parseInt(c.css("fontSize"), 10) || 16
            },
            getPageHeight: function (b) {
                return a(b).height()
            },
            settings: {
                adjustOldDeltas: !0,
                normalizeOffset: !0
            }
        };
        a.fn.extend({
            mousewheel: function (a) {
                return a ? this.bind("mousewheel", a) : this.trigger("mousewheel")
            },
            unmousewheel: function (a) {
                return this.unbind("mousewheel", a)
            }
        })
    }),
    !function (a) {
        "function" == typeof define && define.amd ? define(["jquery"], a) : a("object" == typeof exports ? require("jquery") : jQuery)
    }(function (a) {
        function b(b, c) {
            function d() {
                return k.update(),
                    f(),
                    k
            }

            function e() {
                p.css(C, s / v),
                    m.css(C, -s),
                    y = p.offset()[C],
                    n.css(B, u),
                    o.css(B, u),
                    p.css(B, w)
            }

            function f() {
                A ? l[0].ontouchstart = function (a) {
                    1 === a.touches.length && (g(a.touches[0]),
                        a.stopPropagation())
                }
                    : (p.bind("mousedown", g),
                    o.bind("mouseup", i)),
                    c.wheel && window.addEventListener ? (b[0].addEventListener("DOMMouseScroll", h, !1),
                        b[0].addEventListener("mousewheel", h, !1)) : c.wheel && (b[0].onmousewheel = h)
            }

            function g(b) {
                a("body").addClass("noSelect"),
                    y = z ? b.pageX : b.pageY,
                    x = parseInt(p.css(C), 10) || 0,
                    A ? (document.ontouchmove = function (a) {
                        a.preventDefault(),
                            i(a.touches[0])
                    }
                        ,
                        document.ontouchend = j) : (a(document).bind("mousemove", i),
                        a(document).bind("mouseup", j),
                        p.bind("mouseup", j))
            }

            function h(b) {
                if (1 > t) {
                    var d = b || window.event
                        , e = d.wheelDelta ? d.wheelDelta / 120 : -d.detail / 3;
                    s -= e * c.wheelSpeed,
                        s = Math.min(r - q, Math.max(0, s)),
                        p.css(C, s / v),
                        m.css(C, -s),
                    (c.wheelLock || s !== r - q && 0 !== s) && (d = a.event.fix(d),
                        d.preventDefault())
                }
            }

            function i(a) {
                1 > t && (mousePositionNew = z ? a.pageX : a.pageY,
                    thumbPositionDelta = mousePositionNew - y,
                c.scrollInvert && (thumbPositionDelta = y - mousePositionNew),
                    thumbPositionNew = Math.min(u - w, Math.max(0, x + thumbPositionDelta)),
                    s = thumbPositionNew * v,
                    p.css(C, thumbPositionNew),
                    m.css(C, -s))
            }

            function j() {
                a("body").removeClass("noSelect"),
                    a(document).unbind("mousemove", i),
                    a(document).unbind("mouseup", j),
                    p.unbind("mouseup", j),
                    document.ontouchmove = document.ontouchend = null
            }

            var k = this
                , l = b.find(".viewport")
                , m = b.find(".overview")
                , n = b.find(".scrollbar")
                , o = n.find(".track")
                , p = n.find(".thumb")
                , q = 0
                , r = 0
                , s = 0
                , t = 0
                , u = 0
                , v = 0
                , w = 0
                , x = 0
                , y = 0
                , z = "x" === c.axis
                , A = "ontouchstart" in document.documentElement
                , B = z ? "width" : "height"
                , C = z ? "left" : "top";
            return this.update = function (a) {
                switch (sizeLabelCap = B.charAt(0).toUpperCase() + B.slice(1).toLowerCase(),
                    q = l[0]["offset" + sizeLabelCap],
                    r = m[0]["scroll" + sizeLabelCap],
                    t = q / r,
                    u = c.trackSize || q,
                    w = Math.min(u, Math.max(0, c.thumbSize || u * t)),
                    v = c.thumbSize ? (r - q) / (u - w) : r / u,
                    n.toggleClass("disable", t >= 1),
                    a) {
                    case "bottom":
                        s = r - q;
                        break;
                    case "relative":
                        s = Math.min(r - q, Math.max(0, s));
                        break;
                    default:
                        s = parseInt(a, 10) || 0
                }
                e()
            }
                ,
                d()
        }

        a.tiny = a.tiny || {},
            a.tiny.scrollbar = {
                options: {
                    axis: "y",
                    wheel: !0,
                    wheelSpeed: 40,
                    wheelLock: !0,
                    scrollInvert: !1,
                    trackSize: !1,
                    thumbSize: !1
                }
            },
            a.fn.tinyscrollbar = function (c) {
                var d = a.extend({}, a.tiny.scrollbar.options, c);
                return this.each(function () {
                    a(this).data("tsb", new b(a(this), d))
                }),
                    this
            }
            ,
            a.fn.tinyscrollbar_update = function (b) {
                return a(this).data("tsb").update(b)
            }
    }),
    function (a) {
        "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof exports ? module.exports = a(require("jquery")) : a(jQuery)
    }(function (a) {
        a.fn.jScrollPane = function (b) {
            function c(b, c) {
                function d(c) {
                    var f, h, j, k, l, o, p = !1, q = !1;
                    if (N = c,
                        void 0 === O)
                        l = b.scrollTop(),
                            o = b.scrollLeft(),
                            b.css({
                                overflow: "hidden",
                                padding: 0
                            }),
                            P = b.innerWidth() + ra,
                            Q = b.innerHeight(),
                            b.width(P),
                            O = a('<div class="jspPane" />').css("padding", qa).append(b.children()),
                            R = a('<div class="jspContainer" />').css({
                                width: P + "px",
                                height: Q + "px"
                            }).append(O).appendTo(b);
                    else {
                        if (b.css("width", ""),
                                p = N.stickToBottom && A(),
                                q = N.stickToRight && B(),
                                k = b.innerWidth() + ra != P || b.outerHeight() != Q,
                            k && (P = b.innerWidth() + ra,
                                Q = b.innerHeight(),
                                R.css({
                                    width: P + "px",
                                    height: Q + "px"
                                })),
                            !k && sa == S && O.outerHeight() == T)
                            return void b.width(P);
                        sa = S,
                            O.css("width", ""),
                            b.width(P),
                            R.find(">.jspVerticalBar,>.jspHorizontalBar").remove().end()
                    }
                    O.css("overflow", "auto"),
                        S = c.contentWidth ? c.contentWidth : O[0].scrollWidth,
                        T = O[0].scrollHeight,
                        O.css("overflow", ""),
                        U = S / P,
                        V = T / Q,
                        W = V > 1,
                        X = U > 1,
                        X || W ? (b.addClass("jspScrollable"),
                            f = N.maintainPosition && ($ || ba),
                        f && (h = y(),
                            j = z()),
                            e(),
                            g(),
                            i(),
                        f && (w(q ? S - P : h, !1),
                            v(p ? T - Q : j, !1)),
                            F(),
                            C(),
                            L(),
                        N.enableKeyboardNavigation && H(),
                        N.clickOnTrack && m(),
                            J(),
                        N.hijackInternalLinks && K()) : (b.removeClass("jspScrollable"),
                            O.css({
                                top: 0,
                                left: 0,
                                width: R.width() - ra
                            }),
                            D(),
                            G(),
                            I(),
                            n()),
                        N.autoReinitialise && !pa ? pa = setInterval(function () {
                            d(N)
                        }, N.autoReinitialiseDelay) : !N.autoReinitialise && pa && clearInterval(pa),
                    l && b.scrollTop(0) && v(l, !1),
                    o && b.scrollLeft(0) && w(o, !1),
                        b.trigger("jsp-initialised", [X || W])
                }

                function e() {
                    W && (R.append(a('<div class="jspVerticalBar" />').append(a('<div class="jspCap jspCapTop" />'), a('<div class="jspTrack" />').append(a('<div class="jspDrag" />').append(a('<div class="jspDragTop" />'), a('<div class="jspDragBottom" />'))), a('<div class="jspCap jspCapBottom" />'))),
                        ca = R.find(">.jspVerticalBar"),
                        da = ca.find(">.jspTrack"),
                        Y = da.find(">.jspDrag"),
                    N.showArrows && (ha = a('<a class="jspArrow jspArrowUp" />').bind("mousedown.jsp", k(0, -1)).bind("click.jsp", E),
                        ia = a('<a class="jspArrow jspArrowDown" />').bind("mousedown.jsp", k(0, 1)).bind("click.jsp", E),
                    N.arrowScrollOnHover && (ha.bind("mouseover.jsp", k(0, -1, ha)),
                        ia.bind("mouseover.jsp", k(0, 1, ia))),
                        j(da, N.verticalArrowPositions, ha, ia)),
                        fa = Q,
                        R.find(">.jspVerticalBar>.jspCap:visible,>.jspVerticalBar>.jspArrow").each(function () {
                            fa -= a(this).outerHeight()
                        }),
                        Y.hover(function () {
                            Y.addClass("jspHover")
                        }, function () {
                            Y.removeClass("jspHover")
                        }).bind("mousedown.jsp", function (b) {
                            a("html").bind("dragstart.jsp selectstart.jsp", E),
                                Y.addClass("jspActive");
                            var c = b.pageY - Y.position().top;
                            return a("html").bind("mousemove.jsp", function (a) {
                                p(a.pageY - c, !1)
                            }).bind("mouseup.jsp mouseleave.jsp", o),
                                !1
                        }),
                        f())
                }

                function f() {
                    da.height(fa + "px"),
                        $ = 0,
                        ea = N.verticalGutter + da.outerWidth(),
                        O.width(P - ea - ra);
                    try {
                        0 === ca.position().left && O.css("margin-left", ea + "px")
                    } catch (a) {
                    }
                }

                function g() {
                    X && (R.append(a('<div class="jspHorizontalBar" />').append(a('<div class="jspCap jspCapLeft" />'), a('<div class="jspTrack" />').append(a('<div class="jspDrag" />').append(a('<div class="jspDragLeft" />'), a('<div class="jspDragRight" />'))), a('<div class="jspCap jspCapRight" />'))),
                        ja = R.find(">.jspHorizontalBar"),
                        ka = ja.find(">.jspTrack"),
                        _ = ka.find(">.jspDrag"),
                    N.showArrows && (na = a('<a class="jspArrow jspArrowLeft" />').bind("mousedown.jsp", k(-1, 0)).bind("click.jsp", E),
                        oa = a('<a class="jspArrow jspArrowRight" />').bind("mousedown.jsp", k(1, 0)).bind("click.jsp", E),
                    N.arrowScrollOnHover && (na.bind("mouseover.jsp", k(-1, 0, na)),
                        oa.bind("mouseover.jsp", k(1, 0, oa))),
                        j(ka, N.horizontalArrowPositions, na, oa)),
                        _.hover(function () {
                            _.addClass("jspHover")
                        }, function () {
                            _.removeClass("jspHover")
                        }).bind("mousedown.jsp", function (b) {
                            a("html").bind("dragstart.jsp selectstart.jsp", E),
                                _.addClass("jspActive");
                            var c = b.pageX - _.position().left;
                            return a("html").bind("mousemove.jsp", function (a) {
                                r(a.pageX - c, !1)
                            }).bind("mouseup.jsp mouseleave.jsp", o),
                                !1
                        }),
                        la = R.innerWidth(),
                        h())
                }

                function h() {
                    R.find(">.jspHorizontalBar>.jspCap:visible,>.jspHorizontalBar>.jspArrow").each(function () {
                        la -= a(this).outerWidth()
                    }),
                        ka.width(la + "px"),
                        ba = 0
                }

                function i() {
                    if (X && W) {
                        var b = ka.outerHeight()
                            , c = da.outerWidth();
                        fa -= b,
                            a(ja).find(">.jspCap:visible,>.jspArrow").each(function () {
                                la += a(this).outerWidth()
                            }),
                            la -= c,
                            Q -= c,
                            P -= b,
                            ka.parent().append(a('<div class="jspCorner" />').css("width", b + "px")),
                            f(),
                            h()
                    }
                    X && O.width(R.outerWidth() - ra + "px"),
                        T = O.outerHeight(),
                        V = T / Q,
                    X && (ma = Math.ceil(1 / U * la),
                        ma > N.horizontalDragMaxWidth ? ma = N.horizontalDragMaxWidth : ma < N.horizontalDragMinWidth && (ma = N.horizontalDragMinWidth),
                        _.width(ma + "px"),
                        aa = la - ma,
                        s(ba)),
                    W && (ga = Math.ceil(1 / V * fa),
                        ga > N.verticalDragMaxHeight ? ga = N.verticalDragMaxHeight : ga < N.verticalDragMinHeight && (ga = N.verticalDragMinHeight),
                        Y.height(ga + "px"),
                        Z = fa - ga,
                        q($))
                }

                function j(a, b, c, d) {
                    var e, f = "before", g = "after";
                    "os" == b && (b = /Mac/.test(navigator.platform) ? "after" : "split"),
                        b == f ? g = b : b == g && (f = b,
                            e = c,
                            c = d,
                            d = e),
                        a[f](c)[g](d)
                }

                function k(a, b, c) {
                    return function () {
                        return l(a, b, this, c),
                            this.blur(),
                            !1
                    }
                }

                function l(b, c, d, e) {
                    d = a(d).addClass("jspActive");
                    var f, g, h = !0, i = function () {
                            0 !== b && ta.scrollByX(b * N.arrowButtonSpeed),
                            0 !== c && ta.scrollByY(c * N.arrowButtonSpeed),
                                g = setTimeout(i, h ? N.initialDelay : N.arrowRepeatFreq),
                                h = !1
                        }
                        ;
                    i(),
                        f = e ? "mouseout.jsp" : "mouseup.jsp",
                        e = e || a("html"),
                        e.bind(f, function () {
                            d.removeClass("jspActive"),
                            g && clearTimeout(g),
                                g = null ,
                                e.unbind(f)
                        })
                }

                function m() {
                    n(),
                    W && da.bind("mousedown.jsp", function (b) {
                        if (void 0 === b.originalTarget || b.originalTarget == b.currentTarget) {
                            var c, d = a(this), e = d.offset(), f = b.pageY - e.top - $, g = !0, h = function () {
                                    var a = d.offset()
                                        , e = b.pageY - a.top - ga / 2
                                        , j = Q * N.scrollPagePercent
                                        , k = Z * j / (T - Q);
                                    if (0 > f)
                                        $ - k > e ? ta.scrollByY(-j) : p(e);
                                    else {
                                        if (!(f > 0))
                                            return void i();
                                        e > $ + k ? ta.scrollByY(j) : p(e)
                                    }
                                    c = setTimeout(h, g ? N.initialDelay : N.trackClickRepeatFreq),
                                        g = !1
                                }
                                , i = function () {
                                    c && clearTimeout(c),
                                        c = null ,
                                        a(document).unbind("mouseup.jsp", i)
                                }
                                ;
                            return h(),
                                a(document).bind("mouseup.jsp", i),
                                !1
                        }
                    }),
                    X && ka.bind("mousedown.jsp", function (b) {
                        if (void 0 === b.originalTarget || b.originalTarget == b.currentTarget) {
                            var c, d = a(this), e = d.offset(), f = b.pageX - e.left - ba, g = !0, h = function () {
                                    var a = d.offset()
                                        , e = b.pageX - a.left - ma / 2
                                        , j = P * N.scrollPagePercent
                                        , k = aa * j / (S - P);
                                    if (0 > f)
                                        ba - k > e ? ta.scrollByX(-j) : r(e);
                                    else {
                                        if (!(f > 0))
                                            return void i();
                                        e > ba + k ? ta.scrollByX(j) : r(e)
                                    }
                                    c = setTimeout(h, g ? N.initialDelay : N.trackClickRepeatFreq),
                                        g = !1
                                }
                                , i = function () {
                                    c && clearTimeout(c),
                                        c = null ,
                                        a(document).unbind("mouseup.jsp", i)
                                }
                                ;
                            return h(),
                                a(document).bind("mouseup.jsp", i),
                                !1
                        }
                    })
                }

                function n() {
                    ka && ka.unbind("mousedown.jsp"),
                    da && da.unbind("mousedown.jsp")
                }

                function o() {
                    a("html").unbind("dragstart.jsp selectstart.jsp mousemove.jsp mouseup.jsp mouseleave.jsp"),
                    Y && Y.removeClass("jspActive"),
                    _ && _.removeClass("jspActive")
                }

                function p(c, d) {
                    if (W) {
                        0 > c ? c = 0 : c > Z && (c = Z);
                        var e = new a.Event("jsp-will-scroll-y");
                        if (b.trigger(e, [c]),
                                !e.isDefaultPrevented()) {
                            var f = c || 0
                                , g = 0 === f
                                , h = f == Z
                                , i = c / Z
                                , j = -i * (T - Q);
                            void 0 === d && (d = N.animateScroll),
                                d ? ta.animate(Y, "top", c, q, function () {
                                    b.trigger("jsp-user-scroll-y", [-j, g, h])
                                }) : (Y.css("top", c),
                                    q(c),
                                    b.trigger("jsp-user-scroll-y", [-j, g, h]))
                        }
                    }
                }

                function q(a) {
                    void 0 === a && (a = Y.position().top),
                        R.scrollTop(0),
                        $ = a || 0;
                    var c = 0 === $
                        , d = $ == Z
                        , e = a / Z
                        , f = -e * (T - Q);
                    ua == c && wa == d || (ua = c,
                        wa = d,
                        b.trigger("jsp-arrow-change", [ua, wa, va, xa])),
                        t(c, d),
                        O.css("top", f),
                        b.trigger("jsp-scroll-y", [-f, c, d]).trigger("scroll")
                }

                function r(c, d) {
                    if (X) {
                        0 > c ? c = 0 : c > aa && (c = aa);
                        var e = new a.Event("jsp-will-scroll-x");
                        if (b.trigger(e, [c]),
                                !e.isDefaultPrevented()) {
                            var f = c || 0
                                , g = 0 === f
                                , h = f == aa
                                , i = c / aa
                                , j = -i * (S - P);
                            void 0 === d && (d = N.animateScroll),
                                d ? ta.animate(_, "left", c, s, function () {
                                    b.trigger("jsp-user-scroll-x", [-j, g, h])
                                }) : (_.css("left", c),
                                    s(c),
                                    b.trigger("jsp-user-scroll-x", [-j, g, h]))
                        }
                    }
                }

                function s(a) {
                    void 0 === a && (a = _.position().left),
                        R.scrollTop(0),
                        ba = a || 0;
                    var c = 0 === ba
                        , d = ba == aa
                        , e = a / aa
                        , f = -e * (S - P);
                    va == c && xa == d || (va = c,
                        xa = d,
                        b.trigger("jsp-arrow-change", [ua, wa, va, xa])),
                        u(c, d),
                        O.css("left", f),
                        b.trigger("jsp-scroll-x", [-f, c, d]).trigger("scroll")
                }

                function t(a, b) {
                    N.showArrows && (ha[a ? "addClass" : "removeClass"]("jspDisabled"),
                        ia[b ? "addClass" : "removeClass"]("jspDisabled"))
                }

                function u(a, b) {
                    N.showArrows && (na[a ? "addClass" : "removeClass"]("jspDisabled"),
                        oa[b ? "addClass" : "removeClass"]("jspDisabled"))
                }

                function v(a, b) {
                    var c = a / (T - Q);
                    p(c * Z, b)
                }

                function w(a, b) {
                    var c = a / (S - P);
                    r(c * aa, b)
                }

                function x(b, c, d) {
                    var e, f, g, h, i, j, k, l, m, n = 0, o = 0;
                    try {
                        e = a(b)
                    } catch (p) {
                        return
                    }
                    for (f = e.outerHeight(),
                             g = e.outerWidth(),
                             R.scrollTop(0),
                             R.scrollLeft(0); !e.is(".jspPane");)
                        if (n += e.position().top,
                                o += e.position().left,
                                e = e.offsetParent(),
                                /^body|html$/i.test(e[0].nodeName))
                            return;
                    h = z(),
                        j = h + Q,
                        h > n || c ? l = n - N.horizontalGutter : n + f > j && (l = n - Q + f + N.horizontalGutter),
                    isNaN(l) || v(l, d),
                        i = y(),
                        k = i + P,
                        i > o || c ? m = o - N.horizontalGutter : o + g > k && (m = o - P + g + N.horizontalGutter),
                    isNaN(m) || w(m, d)
                }

                function y() {
                    return -O.position().left
                }

                function z() {
                    return -O.position().top
                }

                function A() {
                    var a = T - Q;
                    return a > 20 && a - z() < 10
                }

                function B() {
                    var a = S - P;
                    return a > 20 && a - y() < 10
                }

                function C() {
                    R.unbind(za).bind(za, function (a, b, c, d) {
                        ba || (ba = 0),
                        $ || ($ = 0);
                        var e = ba
                            , f = $
                            , g = a.deltaFactor || N.mouseWheelSpeed;
                        return ta.scrollBy(c * g, -d * g, !1),
                        e == ba && f == $
                    })
                }

                function D() {
                    R.unbind(za)
                }

                function E() {
                    return !1
                }

                function F() {
                    O.find(":input,a").unbind("focus.jsp").bind("focus.jsp", function (a) {
                        x(a.target, !1)
                    })
                }

                function G() {
                    O.find(":input,a").unbind("focus.jsp")
                }

                function H() {
                    function c() {
                        var a = ba
                            , b = $;
                        switch (d) {
                            case 40:
                                ta.scrollByY(N.keyboardSpeed, !1);
                                break;
                            case 38:
                                ta.scrollByY(-N.keyboardSpeed, !1);
                                break;
                            case 34:
                            case 32:
                                ta.scrollByY(Q * N.scrollPagePercent, !1);
                                break;
                            case 33:
                                ta.scrollByY(-Q * N.scrollPagePercent, !1);
                                break;
                            case 39:
                                ta.scrollByX(N.keyboardSpeed, !1);
                                break;
                            case 37:
                                ta.scrollByX(-N.keyboardSpeed, !1)
                        }
                        return e = a != ba || b != $
                    }

                    var d, e, f = [];
                    X && f.push(ja[0]),
                    W && f.push(ca[0]),
                        O.bind("focus.jsp", function () {
                            b.focus()
                        }),
                        b.attr("tabindex", 0).unbind("keydown.jsp keypress.jsp").bind("keydown.jsp", function (b) {
                            if (b.target === this || f.length && a(b.target).closest(f).length) {
                                var g = ba
                                    , h = $;
                                switch (b.keyCode) {
                                    case 40:
                                    case 38:
                                    case 34:
                                    case 32:
                                    case 33:
                                    case 39:
                                    case 37:
                                        d = b.keyCode,
                                            c();
                                        break;
                                    case 35:
                                        v(T - Q),
                                            d = null;
                                        break;
                                    case 36:
                                        v(0),
                                            d = null
                                }
                                return e = b.keyCode == d && g != ba || h != $,
                                    !e
                            }
                        }).bind("keypress.jsp", function (b) {
                            return b.keyCode == d && c(),
                                b.target === this || f.length && a(b.target).closest(f).length ? !e : void 0
                        }),
                        N.hideFocus ? (b.css("outline", "none"),
                        "hideFocus" in R[0] && b.attr("hideFocus", !0)) : (b.css("outline", ""),
                        "hideFocus" in R[0] && b.attr("hideFocus", !1))
                }

                function I() {
                    b.attr("tabindex", "-1").removeAttr("tabindex").unbind("keydown.jsp keypress.jsp"),
                        O.unbind(".jsp")
                }

                function J() {
                    if (location.hash && location.hash.length > 1) {
                        var b, c, d = escape(location.hash.substr(1));
                        try {
                            b = a("#" + d + ', a[name="' + d + '"]')
                        } catch (e) {
                            return
                        }
                        b.length && O.find(d) && (0 === R.scrollTop() ? c = setInterval(function () {
                            R.scrollTop() > 0 && (x(b, !0),
                                a(document).scrollTop(R.position().top),
                                clearInterval(c))
                        }, 50) : (x(b, !0),
                            a(document).scrollTop(R.position().top)))
                    }
                }

                function K() {
                    a(document.body).data("jspHijack") || (a(document.body).data("jspHijack", !0),
                        a(document.body).delegate('a[href*="#"]', "click", function (b) {
                            var c, d, e, f, g, h, i = this.href.substr(0, this.href.indexOf("#")), j = location.href;
                            if (-1 !== location.href.indexOf("#") && (j = location.href.substr(0, location.href.indexOf("#"))),
                                i === j) {
                                c = escape(this.href.substr(this.href.indexOf("#") + 1));
                                try {
                                    d = a("#" + c + ', a[name="' + c + '"]')
                                } catch (k) {
                                    return
                                }
                                d.length && (e = d.closest(".jspScrollable"),
                                    f = e.data("jsp"),
                                    f.scrollToElement(d, !0),
                                e[0].scrollIntoView && (g = a(window).scrollTop(),
                                    h = d.offset().top,
                                (g > h || h > g + a(window).height()) && e[0].scrollIntoView()),
                                    b.preventDefault())
                            }
                        }))
                }

                function L() {
                    var a, b, c, d, e, f = !1;
                    R.unbind("touchstart.jsp touchmove.jsp touchend.jsp click.jsp-touchclick").bind("touchstart.jsp", function (g) {
                        var h = g.originalEvent.touches[0];
                        a = y(),
                            b = z(),
                            c = h.pageX,
                            d = h.pageY,
                            e = !1,
                            f = !0
                    }).bind("touchmove.jsp", function (g) {
                        if (f) {
                            var h = g.originalEvent.touches[0]
                                , i = ba
                                , j = $;
                            return ta.scrollTo(a + c - h.pageX, b + d - h.pageY),
                                e = e || Math.abs(c - h.pageX) > 5 || Math.abs(d - h.pageY) > 5,
                            i == ba && j == $
                        }
                    }).bind("touchend.jsp", function (a) {
                        f = !1
                    }).bind("click.jsp-touchclick", function (a) {
                        return e ? (e = !1,
                            !1) : void 0
                    })
                }

                function M() {
                    var a = z()
                        , c = y();
                    b.removeClass("jspScrollable").unbind(".jsp"),
                        O.unbind(".jsp"),
                        b.replaceWith(ya.append(O.children())),
                        ya.scrollTop(a),
                        ya.scrollLeft(c),
                    pa && clearInterval(pa)
                }

                var N, O, P, Q, R, S, T, U, V, W, X, Y, Z, $, _, aa, ba, ca, da, ea, fa, ga, ha, ia, ja, ka, la, ma, na, oa, pa, qa, ra, sa, ta = this, ua = !0, va = !0, wa = !1, xa = !1, ya = b.clone(!1, !1).empty(), za = a.fn.mwheelIntent ? "mwheelIntent.jsp" : "mousewheel.jsp";
                "border-box" === b.css("box-sizing") ? (qa = 0,
                    ra = 0) : (qa = b.css("paddingTop") + " " + b.css("paddingRight") + " " + b.css("paddingBottom") + " " + b.css("paddingLeft"),
                    ra = (parseInt(b.css("paddingLeft"), 10) || 0) + (parseInt(b.css("paddingRight"), 10) || 0)),
                    a.extend(ta, {
                        reinitialise: function (b) {
                            b = a.extend({}, N, b),
                                d(b)
                        },
                        scrollToElement: function (a, b, c) {
                            x(a, b, c)
                        },
                        scrollTo: function (a, b, c) {
                            w(a, c),
                                v(b, c)
                        },
                        scrollToX: function (a, b) {
                            w(a, b)
                        },
                        scrollToY: function (a, b) {
                            v(a, b)
                        },
                        scrollToPercentX: function (a, b) {
                            w(a * (S - P), b)
                        },
                        scrollToPercentY: function (a, b) {
                            v(a * (T - Q), b)
                        },
                        scrollBy: function (a, b, c) {
                            ta.scrollByX(a, c),
                                ta.scrollByY(b, c)
                        },
                        scrollByX: function (a, b) {
                            var c = y() + Math[0 > a ? "floor" : "ceil"](a)
                                , d = c / (S - P);
                            r(d * aa, b)
                        },
                        scrollByY: function (a, b) {
                            var c = z() + Math[0 > a ? "floor" : "ceil"](a)
                                , d = c / (T - Q);
                            p(d * Z, b)
                        },
                        positionDragX: function (a, b) {
                            r(a, b)
                        },
                        positionDragY: function (a, b) {
                            p(a, b)
                        },
                        animate: function (a, b, c, d, e) {
                            var f = {};
                            f[b] = c,
                                a.animate(f, {
                                    duration: N.animateDuration,
                                    easing: N.animateEase,
                                    queue: !1,
                                    step: d,
                                    complete: e
                                })
                        },
                        getContentPositionX: function () {
                            return y()
                        },
                        getContentPositionY: function () {
                            return z()
                        },
                        getContentWidth: function () {
                            return S
                        },
                        getContentHeight: function () {
                            return T
                        },
                        getPercentScrolledX: function () {
                            return y() / (S - P)
                        },
                        getPercentScrolledY: function () {
                            return z() / (T - Q)
                        },
                        getIsScrollableH: function () {
                            return X
                        },
                        getIsScrollableV: function () {
                            return W
                        },
                        getContentPane: function () {
                            return O
                        },
                        scrollToBottom: function (a) {
                            p(Z, a)
                        },
                        hijackInternalLinks: a.noop,
                        destroy: function () {
                            M()
                        }
                    }),
                    d(c)
            }

            return b = a.extend({}, a.fn.jScrollPane.defaults, b),
                a.each(["arrowButtonSpeed", "trackClickSpeed", "keyboardSpeed"], function () {
                    b[this] = b[this] || b.speed
                }),
                this.each(function () {
                    var d = a(this)
                        , e = d.data("jsp");
                    e ? e.reinitialise(b) : (a("script", d).filter('[type="text/javascript"],:not([type])').remove(),
                        e = new c(d, b),
                        d.data("jsp", e))
                })
        }
            ,
            a.fn.jScrollPane.defaults = {
                showArrows: !1,
                maintainPosition: !0,
                stickToBottom: !1,
                stickToRight: !1,
                clickOnTrack: !0,
                autoReinitialise: !1,
                autoReinitialiseDelay: 500,
                verticalDragMinHeight: 0,
                verticalDragMaxHeight: 99999,
                horizontalDragMinWidth: 0,
                horizontalDragMaxWidth: 99999,
                contentWidth: void 0,
                animateScroll: !1,
                animateDuration: 300,
                animateEase: "linear",
                hijackInternalLinks: !1,
                verticalGutter: 4,
                horizontalGutter: 4,
                mouseWheelSpeed: 3,
                arrowButtonSpeed: 0,
                arrowRepeatFreq: 50,
                arrowScrollOnHover: !1,
                trackClickSpeed: 0,
                trackClickRepeatFreq: 70,
                verticalArrowPositions: "split",
                horizontalArrowPositions: "split",
                enableKeyboardNavigation: !0,
                hideFocus: !1,
                keyboardSpeed: 0,
                initialDelay: 300,
                speed: 30,
                scrollPagePercent: .8
            }
    }),
    function () {
        function set(str, value) {
            for (var p, cur = VARS.source, ps = str.split("."), ks = [], fns = "", i = 0, len = ps.length; len > i; i++)
                p = ps[i],
                    cur = cur[p],
                    ks.push('["' + ps[i] + '"]');
            fns = "VARS.source" + ks.join("") + '="' + value + '"',
                eval("(" + fns + ")")
        }

        function get(a) {
            for (var b = VARS.source, c = a.split("."), d = 0, e = c.length; e > d; d++)
                if (b = b[c[d]],
                    void 0 === b)
                    return;
            return b
        }

        for (var VARS = {
            prefix: "$",
            keys: ["SYS", "ROOM", "PAGE"],
            source: {},
            scope: window
        }, i = 0; i < VARS.keys.length; i++) {
            var key = VARS.keys[i]
                , fkey = VARS.prefix + key
                , obj = VARS.scope[fkey];
            obj && (VARS.source[key.toLowerCase()] = obj)
        }
        define("douyu/context", ["shark/util/cookie/1.0"], function (a) {
            location.host,
                a.config("keypre", get("sys.cookie_pre") || "");
            var b = {
                set: set,
                get: get
            };
            return b
        })
    }(),
    shark.config({
        resolve: function (a) {
            if (shark.helper.file.isAbsolute(a))
                return !1;
            var b = a.split("/")
                , c = b[0]
                , d = shark.helper.file.isCss(a) ? "css/" : "js/";
            switch (c) {
                case "douyu":
                    a = "app/douyu/" + d + b.slice(1).join("/");
                    break;
                case "douyu-activity":
                    a = "app/douyu/activity/" + d + b.slice(1).join("/")
            }
            return a
        }
    }),
    shark.on("createNode", function (a, b) {
        var c, d = shark.helper.file, e = "1.7";
        c = b.url,
            d.isCss(c) ? c.indexOf("?") > 0 ? a.href = c + "&" + e : a.href = c + "?" + e : c.indexOf("?") > 0 ? a.src = c + "&" + e : a.src = c + "?" + e
    }),
    shark.on("saved", function (a) {
        var b = new RegExp("^douyu//*");
        b.test(a.id) && shark.helper.domReady(function () {
            define([a.id], function (a) {
                a && "function" == typeof a.application && a.application.call(a)
            })
        })
    }),
    define("douyu/com/animate", ["jquery", "shark/class", "shark/util/lang/1.0", "shark/observer", "shark/util/template/2.0", "shark/util/cookie/1.0"], function (a, b, c, d, e, f) {
        var g = b({
            zfLinear: function (a, b, c, d) {
                return c * a / d + b
            },
            Quad: {
                easeIn: function (a, b, c, d) {
                    return c * (a /= d) * a + b
                },
                easeOut: function (a, b, c, d) {
                    return -c * (a /= d) * (a - 2) + b
                },
                easeInOut: function (a, b, c, d) {
                    return (a /= d / 2) < 1 ? c / 2 * a * a + b : -c / 2 * (--a * (a - 2) - 1) + b
                }
            },
            Cubic: {
                easeIn: function (a, b, c, d) {
                    return c * (a /= d) * a * a + b
                },
                easeOut: function (a, b, c, d) {
                    return c * ((a = a / d - 1) * a * a + 1) + b
                },
                easeInOut: function (a, b, c, d) {
                    return (a /= d / 2) < 1 ? c / 2 * a * a * a + b : c / 2 * ((a -= 2) * a * a + 2) + b
                }
            },
            Quart: {
                easeIn: function (a, b, c, d) {
                    return c * (a /= d) * a * a * a + b
                },
                easeOut: function (a, b, c, d) {
                    return -c * ((a = a / d - 1) * a * a * a - 1) + b
                },
                easeInOut: function (a, b, c, d) {
                    return (a /= d / 2) < 1 ? c / 2 * a * a * a * a + b : -c / 2 * ((a -= 2) * a * a * a - 2) + b
                }
            },
            Quint: {
                easeIn: function (a, b, c, d) {
                    return c * (a /= d) * a * a * a * a + b
                },
                easeOut: function (a, b, c, d) {
                    return c * ((a = a / d - 1) * a * a * a * a + 1) + b
                },
                easeInOut: function (a, b, c, d) {
                    return (a /= d / 2) < 1 ? c / 2 * a * a * a * a * a + b : c / 2 * ((a -= 2) * a * a * a * a + 2) + b
                }
            },
            Sine: {
                easeIn: function (a, b, c, d) {
                    return -c * Math.cos(a / d * (Math.PI / 2)) + c + b
                },
                easeOut: function (a, b, c, d) {
                    return c * Math.sin(a / d * (Math.PI / 2)) + b
                },
                easeInOut: function (a, b, c, d) {
                    return -c / 2 * (Math.cos(Math.PI * a / d) - 1) + b
                }
            },
            Expo: {
                easeIn: function (a, b, c, d) {
                    return 0 == a ? b : c * Math.pow(2, 10 * (a / d - 1)) + b
                },
                easeOut: function (a, b, c, d) {
                    return a == d ? b + c : c * (-Math.pow(2, -10 * a / d) + 1) + b
                },
                easeInOut: function (a, b, c, d) {
                    return 0 == a ? b : a == d ? b + c : (a /= d / 2) < 1 ? c / 2 * Math.pow(2, 10 * (a - 1)) + b : c / 2 * (-Math.pow(2, -10 * --a) + 2) + b
                }
            },
            Circ: {
                easeIn: function (a, b, c, d) {
                    return -c * (Math.sqrt(1 - (a /= d) * a) - 1) + b
                },
                easeOut: function (a, b, c, d) {
                    return c * Math.sqrt(1 - (a = a / d - 1) * a) + b
                },
                easeInOut: function (a, b, c, d) {
                    return (a /= d / 2) < 1 ? -c / 2 * (Math.sqrt(1 - a * a) - 1) + b : c / 2 * (Math.sqrt(1 - (a -= 2) * a) + 1) + b
                }
            },
            Elastic: {
                easeIn: function (a, b, c, d, e, f) {
                    if (0 == a)
                        return b;
                    if (1 == (a /= d))
                        return b + c;
                    if (f || (f = .3 * d),
                        !e || e < Math.abs(c)) {
                        e = c;
                        var g = f / 4
                    } else
                        var g = f / (2 * Math.PI) * Math.asin(c / e);
                    return -(e * Math.pow(2, 10 * (a -= 1)) * Math.sin((a * d - g) * (2 * Math.PI) / f)) + b
                },
                easeOut: function (a, b, c, d, e, f) {
                    if (0 == a)
                        return b;
                    if (1 == (a /= d))
                        return b + c;
                    if (f || (f = .3 * d),
                        !e || e < Math.abs(c)) {
                        e = c;
                        var g = f / 4
                    } else
                        var g = f / (2 * Math.PI) * Math.asin(c / e);
                    return e * Math.pow(2, -10 * a) * Math.sin((a * d - g) * (2 * Math.PI) / f) + c + b
                },
                easeInOut: function (a, b, c, d, e, f) {
                    if (0 == a)
                        return b;
                    if (2 == (a /= d / 2))
                        return b + c;
                    if (f || (f = d * (.3 * 1.5)),
                        !e || e < Math.abs(c)) {
                        e = c;
                        var g = f / 4
                    } else
                        var g = f / (2 * Math.PI) * Math.asin(c / e);
                    return 1 > a ? -.5 * (e * Math.pow(2, 10 * (a -= 1)) * Math.sin((a * d - g) * (2 * Math.PI) / f)) + b : e * Math.pow(2, -10 * (a -= 1)) * Math.sin((a * d - g) * (2 * Math.PI) / f) * .5 + c + b
                }
            },
            Back: {
                easeIn: function (a, b, c, d, e) {
                    return void 0 == e && (e = 1.70158),
                    c * (a /= d) * a * ((e + 1) * a - e) + b
                },
                easeOut: function (a, b, c, d, e) {
                    return void 0 == e && (e = 1.70158),
                    c * ((a = a / d - 1) * a * ((e + 1) * a + e) + 1) + b
                },
                easeInOut: function (a, b, c, d, e) {
                    return void 0 == e && (e = 1.70158),
                        (a /= d / 2) < 1 ? c / 2 * (a * a * (((e *= 1.525) + 1) * a - e)) + b : c / 2 * ((a -= 2) * a * (((e *= 1.525) + 1) * a + e) + 2) + b
                }
            },
            zfBounce: {
                easeIn: function (a, b, c, d) {
                    return c - this.zfBounce.easeOut(d - a, 0, c, d) + b
                },
                easeOut: function (a, b, c, d) {
                    return (a /= d) < 1 / 2.75 ? c * (7.5625 * a * a) + b : 2 / 2.75 > a ? c * (7.5625 * (a -= 1.5 / 2.75) * a + .75) + b : 2.5 / 2.75 > a ? c * (7.5625 * (a -= 2.25 / 2.75) * a + .9375) + b : c * (7.5625 * (a -= 2.625 / 2.75) * a + .984375) + b
                },
                easeInOut: function (a, b, c, d) {
                    return d / 2 > a ? .5 * this.zfBounce.easeIn(2 * a, 0, c, d) + b : .5 * this.zfBounce.easeOut(2 * a - d, 0, c, d) + .5 * c + b
                }
            }
        })
            , h = b({
            getDoms: function () {
                this.doms = {
                    $html: a("html"),
                    $body: a("body")
                }
            },
            init: function (b) {
                this.config = a.extend(!0, {}, {
                    nDuration: 400,
                    effectType: 2,
                    fnCallback: function () {
                    }
                }, b),
                    this.getDoms(),
                    this.render()
            },
            render: function () {
                var a = this;
                this.observer = d.create(this),
                    d.on("com.animate", function (b) {
                        a.animate(b)
                    })
            },
            toOffset: function (a) {
                switch (a) {
                    case "left":
                        var b = "offsetLeft";
                        break;
                    case "top":
                        var b = "offsetTop";
                        break;
                    case "width":
                        var b = "offsetWidth";
                        break;
                    case "height":
                        var b = "offsetHeight";
                        break;
                    default:
                        throw alert("不支持此方向的动画效果！"),
                            new Error("不支持此方向的动画效果！")
                }
                return b
            },
            animate: function (a) {
                function b() {
                    if (window.clearTimeout(d.timer),
                        l > t && n.length) {
                        t += u,
                        t / l >= 1 && (t = l);
                        for (var a in m)
                            if ("opacity" == a) {
                                var c = k(t, parseFloat(m[a]), parseFloat(n[a]), l);
                                d.style[a] = c,
                                    d.style.filter = "alpha(opacity=" + 100 * c + ")"
                            } else
                                d.style[a] = k(t, m[a], n[a], l) + "px";
                        d.timer = window.setTimeout(b, u)
                    } else
                        d.timer = null ,
                        h && h.call(d)
                }

                var c = this
                    , d = a.ele
                    , a = a.styleObj
                    , e = c.config.nDuration
                    , f = c.config.effectType
                    , h = c.config.fnCallback
                    , i = new g;
                if (!d || 1 != d.nodeType)
                    throw alert("第一个参数ele错误！"),
                        new Error("第一个参数ele错误！");
                if ("object" != typeof a)
                    throw alert("第二个参数obj错误！"),
                        new Error("参数obj错误！");
                var j = /^\d+$/;
                if (j.test(e))
                    ;
                else {
                    if ("undefined" != typeof e)
                        throw alert("第三个参数nDuration错误！"),
                            new Error("第三个参数nDuration错误！");
                    e = 700
                }
                if (f) {
                    if ("number" == typeof f)
                        switch (f) {
                            case 1:
                                var k = i.zfLinear;
                                break;
                            case 2:
                                var k = i.Quart.easeInOut;
                                break;
                            case 3:
                                var k = i.Elastic.easeOut;
                                break;
                            case 4:
                                var k = i.zfBounce.easeOut;
                                break;
                            default:
                                throw alert("目前不支持此数字类型的运动效果！"),
                                    new Error("目前不支持此数字类型的运动效果！")
                        }
                    else if (f instanceof Array)
                        if ("zfLinear" == f[0])
                            var k = i.zfLinear;
                        else
                            var k = i[f[0]][f[1]];
                    else if ("function" == typeof f) {
                        var k = i.zfLinear;
                        h = f
                    }
                } else
                    var k = i.zfLinear;
                var l = e
                    , m = {}
                    , n = {};
                n.length = 0;
                for (var o in a) {
                    if ("opacity" == o) {
                        if (a.opacity > 1 || a.opacity < 0)
                            throw alert("opacity的值超过范围！"),
                                new Error("opacity的值超过范围！");
                        if (d.currentStyle)
                            var p = d.currentStyle.opacity;
                        else
                            var p = window.getComputedStyle(d, null).opacity;
                        "undefined" != typeof p ? (d.style.opacity = p,
                            d.style.filter = "alpha(opacity=" + 100 * p + ")") : (d.style.opacity = 1,
                            d.style.filter = "alpha(opacity=100)");
                        var q = d.style.opacity
                            , r = a.opacity - q
                    } else
                        var s = c.toOffset(o)
                            , q = d[s]
                            , r = a[o] - q;
                    r && (n[o] = r,
                        m[o] = q,
                        n.length++)
                }
                var t = 0;
                if (document.all)
                    var u = 15;
                else
                    var u = 13;
                b()
            }
        })
            , i = {
            init: function (a) {
                return new h(a)
            }
        };
        return i
    }),
    define("douyu/com/header", ["jquery", "shark/class", "shark/observer", "shark/util/lang/1.0", "shark/util/template/2.0", "shark/util/cookie/1.0", "douyu/context", "douyu/com/sign", "douyu/com/header-dp"], function (a, b, c, d, e, f, g, h, i) {
        var j = function (a, b) {
            var c = a - b;
            return c >= 604800 ? "很久以前" : c >= 86400 ? Math.floor(c / 86400) + "天前" : c >= 3600 ? Math.floor(c / 3600) + "小时前" : c >= 1200 ? 15 * Math.floor(Math.floor(c / 60) / 15) + "分钟前" : c >= 900 ? "15分钟前" : c >= 60 ? Math.floor(c / 60) + "分钟前" : "刚刚"
        }
            , k = function (a) {
            return a = parseInt(a),
                1 > a ? 0 : a >= 1e4 ? (a / 1e4).toFixed(1) + "万" : a
        }
            , l = b({
            init: function (b) {
                this.config = a.extend(!0, {}, {
                    target: "#header",
                    onLogin: function () {
                    },
                    onReg: function () {
                    },
                    onExit: function () {
                    }
                }, b),
                    this.render(),
                    this.bindEvt()
            },
            render: function () {
                this.config.$el = a(this.config.target)
            },
            flanch: function () {
                var a = this.config.$el.find(".head-oth .o-search")
                    , b = a.find(".ipt")
                    , c = a.find("i");
                this.config.search || (this.config.search = {
                    boxw: a.width(),
                    iptw: b.width(),
                    icow: c.width()
                });
                var d = this.config.search
                    , e = d.boxw - d.iptw
                    , f = 20
                    , g = d.boxw + f
                    , h = g - e;
                a.animate({
                    width: g
                }),
                    b.animate({
                        width: h
                    })
            },
            narrowing: function () {
                if (this.config.search) {
                    var a = this.config.$el.find(".head-oth .o-search")
                        , b = a.find(".ipt")
                        , c = this.config.search;
                    a.animate({
                        width: c.boxw
                    }),
                        b.animate({
                            width: c.iptw
                        })
                }
            },
            search: function (b, c) {
                var d = "";
                return b = a.trim(b),
                    c = a.isFunction(c) ? c : function () {
                    }
                    ,
                    b ? (b = encodeURIComponent(b).replace(new RegExp("'", "g"), ""),
                        void (location.href = "/search/" + b + d)) : (a.dialog({
                        lock: !0,
                        content: "搜索关键词还没有填写",
                        icon: "warning",
                        ok: c,
                        close: c
                    }),
                        !1)
            },
            preLoadHistory: function () {
                var a = this.config.$el.find(".head-oth .o-history")
                    , b = a.find(".h-pop");
                b.removeClass("state-2 state-3").addClass("state-1"),
                    a.addClass("open"),
                    this.reqHistoryData()
            },
            reqHistoryData: function () {
                var b = function (a) {
                        this.resHistoryView(a)
                    }
                    ;
                a.ajax("/member/cp/get_user_history", {
                    type: "post",
                    dataType: "json",
                    success: a.proxy(b, this)
                })
            },
            resHistoryView: function (a) {
                var b = this.config.$el.find(".head-oth .o-history")
                    , c = b.find(".h-pop");
                if (!(a && a.nowtime && a.history_list && a.history_list.length))
                    return void c.removeClass("state-1 state-2").addClass("state-3");
                for (var f, g, h = a.history_list, i = a.nowtime, k = d.string.join("{{each list as item}}", "<li>", "<p>", '<a href="/{{item.rid}}" target="_blank">{{item.n}}</a>', "</p>", "<span>", '<a href="#" class="{{item.headCls}}">{{item.timegap}}</a>', '<a href="#" class="head-ico2">{{item.on}}</a>', '<a href="#" class="head-ico3">{{item.uc}}</a>', "</span>", "</li>", "{{/each}}"), l = e.compile(k), m = 0, n = h.length; n > m; m++)
                    g = h[m],
                        g.headCls = 0 == g.ls ? "head-ico4" : "head-ico1",
                        g.timegap = j(i, g.lt);
                f = l({
                    list: h
                }),
                    c.find(".h-list").html(f),
                    c.removeClass("state-1 state-3").addClass("state-2")
            },
            clsHistoryView: function () {
                var a = this.config.$el.find(".head-oth .o-history")
                    , b = a.find(".h-pop");
                a.removeClass("open"),
                    b.removeClass("state-1 state-2 state-3")
            },
            preLoadFollow: function () {
                var a = this.config.$el.find(".head-oth .o-follow")
                    , b = a.find(".f-pop");
                b.removeClass("state-2 state-3").addClass("state-1"),
                    a.addClass("open"),
                    this.reqFollowData()
            },
            reqFollowData: function () {
                var b = function (a) {
                        this.resFollowView(a)
                    }
                    ;
                a.ajax("/member/cp/get_follow_list", {
                    type: "post",
                    dataType: "json",
                    success: a.proxy(b, this)
                })
            },
            resFollowView: function (a) {
                var b = this.config.$el.find(".head-oth .o-follow")
                    , c = b.find(".f-pop");
                if (!(a && a.nowtime && a.room_list && a.room_list.length))
                    return void c.removeClass("state-1 state-2").addClass("state-3");
                for (var f, g, h = a.room_list, i = a.nowtime, j = d.string.join("{{each list as item}}", "<li>", "<p>", '<a href="/{{item.room_id}}" target="_blank">{{item.room_name}}</a>', "</p>", "<span>", '<a href="/{{item.room_id}}" class="head-ico1">已播{{item.minnum}}分钟</a>', '<a href="/{{item.room_id}}" class="head-ico2">{{item.nickname}}</a>', '<a href="/{{item.room_id}}" class="head-ico3">{{item.onlineStr}}</a>', "</span>", "</li>", "{{/each}}"), l = e.compile(j), m = 0, n = h.length; n > m; m++)
                    g = h[m],
                        g.minnum = parseInt((i - g.show_time) / 60),
                        g.onlineStr = k(g.online);
                f = l({
                    list: h
                }),
                    c.find(".f-list").html(f),
                    c.removeClass("state-1 state-3").addClass("state-2")
            },
            clsFollowView: function () {
                var a = this.config.$el.find(".head-oth .o-follow")
                    , b = a.find(".f-pop");
                a.removeClass("open"),
                    b.removeClass("state-1 state-2 state-3")
            },
            reqLetterData: function (b) {
                var c = this.config.autoReqLet
                    , d = (g.get("sys.uid"),
                    this);
                if (c) {
                    var e = "/lapi/member/userInfo/getInfo/";
                    this.config.autoReqLet = !1,
                        a.ajax(e, {
                            type: "post",
                            dataType: "json",
                            timeout: 3e3,
                            success: function (a) {
                                d.config.autoReqLet = !0,
                                    d.resLetterView1(a),
                                    d.reqLetterNext()
                            }
                        })
                } else
                    this.resLetterView2(),
                        this.reqLetterNext()
            },
            reqLetterDataFirst: function () {
                var b = (g.get("sys.uid"),
                    "/lapi/member/userInfo/getInfo/")
                    , c = this;
                a.ajax(b, {
                    type: "post",
                    dataType: "json",
                    timeout: 3e3,
                    success: function (a) {
                        c.resLetterView1(a),
                            c.reqLetterNext()
                    }
                })
            },
            reqLetterNext: function () {
                var a = this;
                setTimeout(function () {
                    a.config.autoReqLet = !0,
                        a.reqLetterData()
                }, 3e5)
            },
            resLetterView1: function (a) {
                var b = a.error;
                if (0 == b) {
                    var c = a.data;
                    if (c && c.pmNew && 0 == c.pmNew.code) {
                        var c = a.data
                            , d = c.pmNew.msg ? c.pmNew.msg : 0
                            , e = ""
                            , h = "userletnum" + g.get("sys.uid")
                            , i = this.config.$el.find(".head-oth .o-login")
                            , j = i.find(">b, ul b");
                        d > 0 ? (e = d > 99 ? "99+" : d,
                            j.html(e).removeClass("hide")) : j.html("").addClass("hide"),
                            f.set(h, d, 2592e3)
                    }
                }
            },
            resLetterView2: function () {
                var b = "userletnum" + g.get("sys.uid")
                    , c = f.get(b)
                    , d = ""
                    , e = this.config.$el.find(".head-oth .o-login");
                c = a.isNumeric(c) ? parseInt(c) : 0,
                    d = c > 99 ? "99+" : c,
                    c > 0 ? e.find(">b, ul b").html(d).removeClass("hide") : e.find(">b").addClass("hide")
            },
            login: function () {
                var a = g.get("sys.uid")
                    , b = g.get("sys.nickname")
                    , d = (g.get("sys.password"),
                    g.get("sys.own_room"));
                if (b && a) {
                    var e = this.config.$el.find(".head-oth .o-history")
                        , f = this.config.$el.find(".head-oth .o-follow")
                        , h = this.config.$el.find(".head-oth .o-unlogin")
                        , i = this.config.$el.find(".head-oth .o-login");
                    i.find(".l-pic").html('<img src="' + $SYS.res_url + 'douyu/images/defaultAvatar.png?20160310"/>'),
                        c.fire("douyu.avatar.get", a, "small", function (a) {
                            i.find(".l-pic img").attr("src", a)
                        }),
                        i.find(".l-txt").text(b),
                        i.find(".l-menu h4").text(b),
                        e.removeClass("hide"),
                        f.removeClass("hide"),
                        h.addClass("hide"),
                        i.removeClass("hide"),
                    0 == d && i.find(".l-menu ul li").eq(4).remove(),
                        this.reqLetterDataFirst()
                }
            },
            exit: function () {
                a.dialog.confirm("确认退出吗？", this.config.onExit)
            },
            bindEvt: function () {
                var b = this.config.$el.find(".head-nav .assort")
                    , c = this.config.$el.find(".head-oth .o-search")
                    , d = this.config.$el.find(".head-oth .o-history")
                    , e = this.config.$el.find(".head-oth .o-follow")
                    , f = this.config.$el.find(".head-oth .o-download")
                    , g = this.config.$el.find(".head-oth .o-unlogin")
                    , h = this.config.$el.find(".head-oth .o-login")
                    , i = this;
                this._evt_menu_toggle(b, f, h),
                    c.find("input").on("focus", function () {
                        i.flanch()
                    }).on("blur", function () {
                        i.narrowing()
                    }).on("keydown", function (b) {
                        if (13 === b.keyCode) {
                            var c = a(this)
                                , d = c.val();
                            i.search(d, function () {
                                c.focus()
                            })
                        }
                    }),
                    c.on("click", ".s-ico", function () {
                        var a = c.find("input")
                            , b = a.val();
                        return i.search(b, function () {
                            a.focus()
                        }),
                            !1
                    }),
                    d.on("mouseenter", function (b) {
                        var c = a(this)
                            , d = c.data("stop")
                            , e = c.data("timer");
                        e && clearTimeout(e),
                            e = setTimeout(function () {
                                return d ? c.data("stop", !1) : void i.preLoadHistory()
                            }, 100),
                            c.data("timer", e)
                    }).on("mouseleave", function (b) {
                        var c = a(this)
                            , e = {
                            x: b.screenX,
                            y: b.screenY
                        }
                            , f = c.data("stop")
                            , g = c.data("timer");
                        g && clearTimeout(g),
                            g = setTimeout(function () {
                                if (f) {
                                    var a = i._checkMousePointIsInArea(e, d, d.find(".h-pop"));
                                    return a || i.clsFollowView(),
                                        c.data("stop", !1)
                                }
                                i.clsHistoryView()
                            }, 100),
                            c.data("timer", g)
                    }),
                    d.on("mouseenter", ".h-pop", function () {
                        d.data("stop", !0),
                            setTimeout(function () {
                                d.data("stop", !1)
                            }, 100)
                    }).on("mouseleave", ".h-pop", function () {
                        i.clsHistoryView()
                    }),
                    e.on("mouseenter", function (b) {
                        var c = a(this)
                            , d = c.data("stop")
                            , e = c.data("timer");
                        e && clearTimeout(e),
                            e = setTimeout(function () {
                                return d ? c.data("stop", !1) : void i.preLoadFollow()
                            }, 100),
                            c.data("timer", e)
                    }).on("mouseleave", function (b) {
                        var c = a(this)
                            , d = {
                            x: b.screenX,
                            y: b.screenY
                        }
                            , f = c.data("stop")
                            , g = c.data("timer");
                        g && clearTimeout(g),
                            g = setTimeout(function () {
                                if (f) {
                                    var a = i._checkMousePointIsInArea(d, e, e.find(".f-pop"));
                                    return a || i.clsFollowView(),
                                        c.data("stop", !1)
                                }
                                i.clsFollowView()
                            }, 100),
                            c.data("timer", g)
                    }),
                    e.on("mouseenter", ".f-pop", function () {
                        e.data("stop", !0),
                            setTimeout(function () {
                                e.data("stop", !1)
                            }, 100)
                    }),
                    h.find("li").last().click(function () {
                        return i.exit(),
                            !1
                    }),
                    g.on("click", ".u-login", function () {
                        return a.isFunction(i.config.onLogin) ? (i.config.onLogin(),
                            !1) : void 0
                    }).on("click", ".u-reg", function () {
                        return a.isFunction(i.config.onReg) ? (i.config.onReg(),
                            !1) : void 0
                    })
            },
            _evt_menu_toggle: function () {
                for (var b, c = [].slice.call(arguments, 0), d = 0, e = c.length; e > d; d++)
                    b = c[d],
                        a(b).on("mouseenter", function () {
                            var b = a(this)
                                , c = b.data("timer");
                            c && clearTimeout(c),
                                c = setTimeout(function () {
                                    b.addClass("open")
                                }, 100),
                                b.data("timer", c)
                        }).on("mouseleave", function () {
                            var b = a(this)
                                , c = b.data("timer");
                            c && clearTimeout(c),
                                c = setTimeout(function () {
                                    b.removeClass("open")
                                }, 100),
                                b.data("timer", c)
                        })
            },
            _checkMousePointIsInArea: function () {
                var b = [].slice.call(arguments, 0)
                    , c = b[0]
                    , d = b.slice(1)
                    , e = !0;
                return a.each(d, function (a, b) {
                    var d = b.offset()
                        , f = {
                        w: b.width(),
                        h: b.height()
                    }
                        , g = {
                        s: d.left,
                        e: d.left + f.w
                    }
                        , h = {
                        s: d.top,
                        e: d.top + f.h
                    }
                        , i = c.x >= g.s && c.x <= g.e && c.y >= h.s && c.y <= h.e;
                    return i ? void 0 : (e = !1,
                        !1)
                }),
                    e
            }
        })
            , m = {
            init: function (b) {
                return h.aop("clean", "header-assort", function (b) {
                    if (b && 1 == b.id) {
                        var c = a(b.el);
                        c[c.html() ? "removeClass" : "addClass"]("hide")
                    }
                }),
                    new l(b)
            }
        };
        return m
    }),
    define("douyu/com/header-dp", ["jquery"], function (a) {
        function b() {
            var b = a("#header");
            c && b.length && (b.on("mousedown", ".head .head-nav .index", function () {
                c.submit({
                    point_id: c.point.page(-1, 1)
                })
            }),
                b.on("mousedown", ".head .head-nav .live", function () {
                    c.submit({
                        point_id: c.point.page(-1, 2)
                    })
                }),
                b.on("mousedown", ".head .head-nav .assort", function () {
                    c.submit({
                        point_id: c.point.page(-1, 3)
                    })
                }),
                b.on("mousedown", ".head .head-nav .funny", function () {
                    c.submit({
                        point_id: c.point.page(-1, 4)
                    })
                }),
                b.on("mousedown", ".head .head-nav .yuba", function () {
                    c.submit({
                        point_id: c.point.page(-1, 5)
                    })
                }),
                b.on("keydown", ".head .head-oth .s-ipt", function (b) {
                    if (13 === b.keyCode) {
                        var d = {};
                        d.v = a(this).val(),
                        window.$SYS && $SYS.uid && (d.uid = $SYS.uid),
                            c.submit({
                                point_id: c.point.page(-1, 6, 1),
                                ext: d
                            })
                    }
                }),
                b.on("mousedown", ".head .head-oth .s-ico", function () {
                    var a = b.find(".head .head-oth .s-ipt")
                        , d = {};
                    d.v = a.val(),
                    window.$SYS && $SYS.uid && (d.uid = $SYS.uid),
                        c.submit({
                            point_id: c.point.page(-1, 6, 2),
                            ext: d
                        })
                }),
                b.on("mouseenter", ".head .head-oth .o-history .h-ico, .head .head-oth .o-history .h-txt", function () {
                    c.queue.may({
                        point_id: c.point.page(-1, 7)
                    })
                }),
                b.on("mouseenter", ".head .head-oth .o-follow .f-ico, .head .head-oth .o-follow .f-txt", function () {
                    c.queue.may({
                        point_id: c.point.page(-1, 8)
                    })
                }),
                b.on("mousedown", ".head .head-oth .o-download>a", function () {
                    c.submit({
                        point_id: c.point.page(-1, 9)
                    })
                }),
                b.find(".head .head-oth .o-download .d-list a").eq(0).on("mousedown", function () {
                    c.submit({
                        point_id: c.point.page(-1, 9, 1)
                    })
                }),
                b.find(".head .head-oth .o-download .d-list a").eq(1).on("mousedown", function () {
                    c.submit({
                        point_id: c.point.page(-1, 9, 2)
                    })
                }),
                b.on("mousedown", ".head .head-oth .o-unlogin .u-login", function () {
                    c.submit({
                        point_id: c.point.page(-1, 10, 2)
                    })
                }),
                b.on("mousedown", ".head .head-oth .o-unlogin .u-reg", function () {
                    c.submit({
                        point_id: c.point.page(-1, 11, 2)
                    })
                }),
                b.on("mouseenter", ".head .head-oth .o-login .l-pic, .head .head-oth .o-login .l-txt", function () {
                    c.queue.may({
                        point_id: c.point.page(-1, 12)
                    })
                }),
                b.on("mousedown", ".head .head-oth .o-login .l-menu .user_icon1", function () {
                    c.submit({
                        point_id: c.point.page(-1, 13, 1)
                    })
                }),
                b.on("mousedown", ".head .head-oth .o-login .l-menu .user_icon2", function () {
                    c.submit({
                        point_id: c.point.page(-1, 13, 2)
                    })
                }),
                b.on("mousedown", ".head .head-oth .o-login .l-menu .user_icon7", function () {
                    c.submit({
                        point_id: c.point.page(-1, 13, 3)
                    })
                }),
                b.on("mousedown", ".head .head-oth .o-login .l-menu .user_icon3", function () {
                    c.submit({
                        point_id: c.point.page(-1, 13, 4)
                    })
                }),
                b.on("mousedown", ".head .head-oth .o-login .l-menu .user_icon4", function () {
                    c.submit({
                        point_id: c.point.page(-1, 13, 5)
                    })
                }),
                b.on("mousedown", ".head .head-oth .o-login .l-menu .user_icon_pay", function () {
                    c.submit({
                        point_id: c.point.page(-1, 13, 6)
                    });
                    try {
                        c.storage.save("_dypay_fp", 1)
                    } catch (a) {
                    }
                }))
        }

        var c = window.DYS;
        a(function () {
            try {
                b()
            } catch (a) {
            }
        })
    }),
    define("douyu/com/footer", ["jquery"], function (a) {
        var b = {
                check: function () {
                    var b = location.host
                        , c = a("#footer-company-info-1")
                        , d = a("#footer-company-info-2");
                    c.hide(),
                        d.hide(),
                        "www.douyutv.com" === b ? c.show() : "www.douyu.com" === b && d.show()
                }
            }
            , c = function () {
                b.check()
            }
            ;
        a(c)
    }),
    define("douyu/com/imgp", ["jquery"], function (a) {
        return function (a, b, c, d) {
            var e, f = a(b), g = 0, h = 0, i = 0, j = 0, k = null;
            a.fn.lazyload = function (l) {
                function m() {
                    var c = 0;
                    o.container === d || o.container === b || (g = e.offset().top,
                        h = e.offset().left,
                        i = e.width(),
                        j = e.height()),
                        n.each(function () {
                            var b = a(this);
                            if (!o.skip_invisible || b.is(":visible"))
                                if (a.abovethetop(this, o) || a.leftofbegin(this, o))
                                    ;
                                else if (a.belowthefold(this, o) || a.rightoffold(this, o)) {
                                    if (++c > o.failure_limit)
                                        return !1
                                } else
                                    b.trigger("appear"),
                                        c = 0
                        })
                }

                var n = this
                    , o = {
                    threshold: 0,
                    failure_limit: 0,
                    event: "scroll",
                    effect: "show",
                    container: b,
                    data_attribute: "original",
                    skip_invisible: !1,
                    appear: null,
                    load: null,
                    placeholder: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
                };
                return l && (d !== l.failurelimit && (l.failure_limit = l.failurelimit,
                    delete l.failurelimit),
                d !== l.effectspeed && (l.effect_speed = l.effectspeed,
                    delete l.effectspeed),
                    a.extend(o, l)),
                    e = o.container === d || o.container === b ? f : a(o.container),
                0 === o.event.indexOf("scroll") && e.bind(o.event, function () {
                    return m()
                }),
                    this.each(function () {
                        var b = this
                            , c = a(b);
                        b.loaded = !1,
                        c.attr("src") !== d && c.attr("src") !== !1 || c.is("img") && c.attr("src", o.placeholder),
                            c.one("appear", function () {
                                if (!this.loaded) {
                                    if (o.appear) {
                                        var d = n.length;
                                        o.appear.call(b, d, o)
                                    }
                                    var e = new Image;
                                    e.onload = function () {
                                        var d = c.attr("data-" + o.data_attribute);
                                        c.hide(),
                                            c.is("img") ? c.attr("src", d) : c.css("background-image", "url('" + d + "')"),
                                            c[o.effect](o.effect_speed),
                                            b.loaded = !0;
                                        var f = a.grep(n, function (a) {
                                            return !a.loaded
                                        });
                                        if (n = a(f),
                                                e = null ,
                                                o.load) {
                                            var g = n.length;
                                            o.load.call(b, g, o)
                                        }
                                    }
                                        ,
                                        e.src = c.attr("data-" + o.data_attribute)
                                }
                            }),
                        0 !== o.event.indexOf("scroll") && c.bind(o.event, function () {
                            b.loaded || c.trigger("appear")
                        })
                    }),
                    f.bind("resize", function () {
                        k && clearTimeout(k),
                            k = setTimeout(function () {
                                m(),
                                    k = null
                            }, 50)
                    }),
                /(?:iphone|ipod|ipad).*os 5/gi.test(navigator.appVersion) && f.bind("pageshow", function (b) {
                    b.originalEvent && b.originalEvent.persisted && n.each(function () {
                        a(this).trigger("appear")
                    })
                }),
                    a(c).ready(function () {
                        m()
                    }),
                    this
            }
                ,
                a.belowthefold = function (c, e) {
                    var h, i = a(c);
                    return h = e.container === d || e.container === b ? (b.innerHeight ? b.innerHeight : f.height()) + f.scrollTop() : g + j,
                    h <= i.offset().top - e.threshold
                }
                ,
                a.rightoffold = function (c, e) {
                    var g, j = a(c);
                    return g = e.container === d || e.container === b ? f.width() + f.scrollLeft() : h + i,
                    g <= j.offset().left - e.threshold
                }
                ,
                a.abovethetop = function (c, e) {
                    var h, i = a(c);
                    return h = e.container === d || e.container === b ? f.scrollTop() : g,
                    h >= i.offset().top + e.threshold + i.height()
                }
                ,
                a.leftofbegin = function (c, e) {
                    var g, i = a(c);
                    return g = e.container === d || e.container === b ? f.scrollLeft() : h,
                    g >= i.offset().left + e.threshold + i.width()
                }
                ,
                a.inviewport = function (b, c) {
                    return !(a.rightoffold(b, c) || a.leftofbegin(b, c) || a.belowthefold(b, c) || a.abovethetop(b, c))
                }
                ,
                a.extend(a.expr[":"], {
                    "below-the-fold": function (b) {
                        return a.belowthefold(b, {
                            threshold: 0
                        })
                    },
                    "above-the-top": function (b) {
                        return !a.belowthefold(b, {
                            threshold: 0
                        })
                    },
                    "right-of-screen": function (b) {
                        return a.rightoffold(b, {
                            threshold: 0
                        })
                    },
                    "left-of-screen": function (b) {
                        return !a.rightoffold(b, {
                            threshold: 0
                        })
                    },
                    "in-viewport": function (b) {
                        return a.inviewport(b, {
                            threshold: 0
                        })
                    },
                    "above-the-fold": function (b) {
                        return !a.belowthefold(b, {
                            threshold: 0
                        })
                    },
                    "right-of-fold": function (b) {
                        return a.rightoffold(b, {
                            threshold: 0
                        })
                    },
                    "left-of-fold": function (b) {
                        return !a.rightoffold(b, {
                            threshold: 0
                        })
                    }
                })
        }(a, window, document),
        {
            build: function (a) {
                $("img[data-original]").lazyload(a)
            }
        }
    }),
    define("douyu/com/user", ["jquery", "shark/util/lang/1.0", "shark/util/cookie/1.0", "shark/util/flash/bridge/1.0", "douyu/context", "shark/ext/swfobject", "douyu/com/vcode-user", "douyu/com/vcode9"], function (a, b, c, d, e, f, g, h) {
        var i = {
            view: {
                el: {
                    pop: "pop",
                    shadow: "shadow",
                    logform: "logform",
                    regform: "regform"
                },
                type: {
                    login: "login",
                    reg: "reg"
                }
            },
            client_id: 1,
            hmac_flash_ready: !1,
            salt: null
        }
            , j = {}
            , k = {}
            , l = document.domain;
        -1 != l.indexOf("douyutv.com") && (i.client_id = 2),
            j.init = function () {
                j.view.init(),
                    j.control.init()
            }
            ,
            j.view = {
                init: function () {
                    var b = j.view.make()
                        , c = a("body")
                        , d = a(b.pop)
                        , e = a(b.shadow);
                    j.view.$pop = d,
                        j.view.$shadow = e,
                        j.view.$logform = j.view.$pop.find("form").eq(0),
                        j.view.$regform = j.view.$pop.find("form").eq(1),
                        j.view.$pop.hide().removeClass("hide"),
                        j.view.$shadow.hide().removeClass("hide"),
                        c.append(j.view.$pop),
                        c.append(j.view.$shadow),
                        j.view._is_show = !1,
                        j.view._type = i.view.type.login,
                        setTimeout(function () {
                            j.view.checkStkToLogin(),
                                j.view.evt()
                        }, 50)
                },
                el: function (a) {
                    return a === i.view.el.pop ? j.view.$pop : a === i.view.el.shadow ? j.view.$shadow : a === i.view.el.logform ? j.view.$logform : a === i.view.el.regform ? j.view.$regform : void 0
                },
                make: function () {
                    return {
                        pop: a.trim(a("#dytemp-loginpop").html()),
                        shadow: a.trim(a("#dytemp-loginpop-shadow").html())
                    }
                },
                checkStkToLogin: function () {
                    c.get("ltkid") && c.get("nickname") && c.get("uid") && !c.get("stk") && this.show()
                },
                show: function (b, c, d) {
                    k.init(),
                        b = b ? b : i.view.type.login,
                        c = a.isPlainObject(c) ? c : {};
                    var e = j.view.$pop.find(".login-pop-tab .t-login")
                        , f = j.view.$pop.find(".login-pop-tab .t-reg")
                        , g = j.view.$pop.find(".c-item[data-type=login]")
                        , h = j.view.$pop.find('.c-item[data-type="reg"]');
                    b === i.view.type.login ? (e.addClass("current"),
                        g.removeClass("hide"),
                        f.removeClass("current"),
                        h.addClass("hide")) : (e.removeClass("current"),
                        g.addClass("hide"),
                        f.addClass("current"),
                        h.removeClass("hide")),
                        "reg" == b ? (c.redirect && (j.view._redirect = c.redirect),
                            j.view._type = b,
                            j.view.layout(),
                            j.view.$shadow.fadeIn(),
                            j.view.$pop.fadeIn(function () {
                                j.view._is_show = !0
                            })) : a.ajax({
                            url: passport_host + "iframe/auth",
                            type: "GET",
                            data: {
                                client_id: i.client_id,
                                t: (new Date).getTime()
                            },
                            dataType: "jsonp",
                            jsonp: "callback",
                            callback: "json_callback",
                            success: function (e) {
                                1 == e.error ? (c.redirect && (j.view._redirect = c.redirect),
                                    j.view._type = b,
                                    j.view.layout(),
                                    j.view.$shadow.fadeIn(),
                                    j.view.$pop.fadeIn(function () {
                                        j.view._is_show = !0
                                    })) : 0 == e.error && e.data.code ? a.ajax({
                                    url: "/api/passport/login",
                                    type: "GET",
                                    data: e.data,
                                    dataType: "json",
                                    success: function (b) {
                                        0 == b.error ? setTimeout(function () {
                                            return a.dialog.tips_black("登录成功！", 1.5),
                                                d ? void d() : void location.reload()
                                        }, 500) : a.dialog.tips_black(b.msg, 1.5)
                                    }
                                }) : a.dialog.tips_black(e.msg, 1.5)
                            }
                        })
                },
                hide: function () {
                    j.view.$pop.fadeOut(function () {
                        j.view._is_show = !1
                    }),
                        j.view.$shadow.fadeOut()
                },
                toggle: function () {
                    j.view._is_show ? j.view.hide() : j.view.show()
                },
                layout: function () {
                    var b, c = a("body"), d = a(window), e = c.height(), f = d.height(), g = j.view.$pop.outerHeight(!0), h = f > e ? f : e;
                    b = 100 >= f - g ? 0 : .3 * f,
                        j.view.$shadow.height(h),
                        j.view.$pop.css("top", b)
                },
                redirect: function (a) {
                    var b = j.view._redirect;
                    return b ? (j.view._redirect = void 0,
                        setTimeout(function () {
                            location.href = b
                        }, a || 50),
                        !0) : !1
                },
                submitLog: function () {
                    var b = j.view.$logform
                        , c = b.find(".btn-sub")
                        , d = b.find("[name]")
                        , e = !0
                        , f = null
                        , g = {};
                    if (!b.data("submit") && (d.each(function () {
                            return (e = j.validate.check(this)) ? void (g[this.name] = this.value) : !1
                        }),
                            e)) {
                        if (k.instance && k.instance.isFast() && !(f = k.instance.getFastResult()))
                            return a.dialog.tips_black("验证码错误！");
                        g = a.extend({}, g, f, i.salt),
                            b.data("submit", !0),
                            c.val("提交中…"),
                            j.control.enter(g, function (a) {
                                b.data("submit", a),
                                    c.val("登录")
                            })
                    }
                },
                submitReg: function () {
                    var a = j.view.$regform
                        , b = a.find(".btn-sub")
                        , c = a.find("[name]")
                        , d = a.find("[name=nickname]")
                        , e = !0
                        , f = {};
                    if (!a.data("submit") && (c.each(function () {
                            return (e = j.validate.check(this)) ? void (f[this.name] = this.value) : !1
                        }),
                            e)) {
                        var g = m.val();
                        g && (f.ditchName = g),
                            j.validate.ckRegNicknameAsync(d.get(0), function (c) {
                                c && (a.data("submit", !0),
                                    b.val("注册中…"),
                                    j.control.reg(f, function (c) {
                                        a.data("submit", c),
                                            b.val("注册")
                                    }))
                            })
                    }
                },
                evt: function () {
                    var b = j.view.$pop
                        , c = j.view.$shadow
                        , d = j.view.$logform
                        , e = j.view.$regform;
                    b.find(".login-pop-close").click(function (a) {
                        j.view._evt_stop(a),
                            j.view.hide()
                    }),
                        b.find(".login-pop-tab .t-login").click(function (a) {
                            j.view._evt_stop(a),
                                j.view.show(i.view.type.login)
                        }),
                        b.find(".login-pop-tab .t-reg").click(function (a) {
                            j.view._evt_stop(a),
                                j.view.show(i.view.type.reg)
                        }),
                        b.find(".login-pop-cont .toreg a").click(function (a) {
                            j.view._evt_stop(a),
                                j.view.show(i.view.type.reg)
                        }),
                        b.find(".login-pop-cont .tolog a").click(function (a) {
                            j.view._evt_stop(a),
                                j.view.show(i.view.type.login)
                        }),
                        c.on("dblclick", function (a) {
                            j.view._evt_stop(a),
                                j.view.hide()
                        }),
                        a(window).resize(function () {
                            j.view._is_show && j.view.layout()
                        }),
                        b.on("blur", "input", function () {
                            var a = j.validate.check(this);
                            a && ("username" === this.name || "nickname" === this.name && j.validate.ckRegNicknameAsync(this))
                        }),
                        d.submit(function () {
                            return j.view.submitLog(),
                                !1
                        }),
                        e.submit(function () {
                            return j.view.submitReg(),
                                !1
                        })
                },
                _evt_stop: function (a) {
                    a.stopPropagation(),
                        a.preventDefault()
                }
            },
            j.validate = {
                check: function (b) {
                    var c = a(b)
                        , d = c.attr("name")
                        , e = a.trim(c.val());
                    if (c.val(e),
                        "geetest_challenge" === d || "geetest_validate" === d || "geetest_seccode" === d)
                        return !0;
                    if ("captcha_word" === d) {
                        if (j.view._type === i.view.type.login && k.instance && k.instance.isFast())
                            return !0;
                        if (j.view._type === i.view.type.reg)
                            return !0
                    }
                    if ("" === e)
                        return j.validate._fx_err_ipt(b),
                            !1;
                    if (j.view._type === i.view.type.login) {
                        if ("username" === d)
                            return j.validate._ck_login_username(b);
                        if ("password" === d)
                            return j.validate._ck_login_password(b);
                        if ("captcha_word" === d)
                            return j.validate._ck_login_captcha(b)
                    } else if (j.view._type === i.view.type.reg) {
                        if ("nickname" === d)
                            return j.validate._ck_reg_nickname(b);
                        if ("password" === d)
                            return j.validate._ck_reg_password(b);
                        if ("password2" === d)
                            return j.validate._ck_reg_password2(b);
                        if ("email" === d)
                            return j.validate._ck_reg_email(b);
                        if ("protocol" === d)
                            return j.validate._ck_reg_protocol(b)
                    }
                    return j.validate._fx_rig_ipt(b),
                        !0
                },
                ckRegNicknameAsync: function (b, c) {
                    a.getJSON("/member/register/validate/nickname", {
                        data: encodeURIComponent(b.value)
                    }, function (d) {
                        var e = d.result
                            , f = 0 === e;
                        0 === e ? j.validate._fx_rig_ipt(b) : -2 === e ? j.validate._showerr(d.msg, b) : j.validate._showerr("用户昵称不合法或已被占用", b),
                        a.isFunction(c) && c(f)
                    })
                },
                _showerr: function (b, c) {
                    a.dialog.tips_black(b, 2),
                        j.validate._fx_err_ipt(c)
                },
                _fx_rig_ipt: function (b) {
                    a(b).removeClass("ipt-err")
                },
                _fx_err_ipt: function (b) {
                    var c = a(b);
                    c.hasClass("ipt-err") || (c.is(":text") || c.is(":password")) && (c.addClass("ipt-err"),
                        setTimeout(function () {
                            c.removeClass("ipt-err")
                        }, 2e3))
                },
                _ck_login_captcha: function (b) {
                    var c = a(b).val();
                    return 4 != c.length ? (j.validate._showerr("验证码不正确", b),
                        !1) : !0
                },
                _ck_login_username: function (c) {
                    var d = a(c).val();
                    if ("" == d)
                        return j.validate._showerr("用户昵称不能为空", c),
                            !1;
                    if (0 === d.indexOf("_"))
                        return j.validate._showerr("用户昵称不能以下划线开头", c),
                            !1;
                    var e = b.string.bytelen(d);
                    return 5 > e || e > 30 ? (j.validate._showerr("用户昵称长度只能5~30个字符", c),
                        !1) : !0
                },
                _ck_login_password: function (b) {
                    var c = a(b).val();
                    return c.length < 5 || c.length > 25 ? (j.validate._showerr("密码长度不正确，仅限5~25个字符", b),
                        !1) : !0
                },
                _ck_reg_nickname: function (c) {
                    var d = a(c).val();
                    if ("" == d)
                        return j.validate._showerr("用户昵称不能为空", c),
                            !1;
                    if (-1 != d.indexOf("_"))
                        return j.validate._showerr("用户昵称不能含有下划线", c),
                            !1;
                    var e = b.string.bytelen(d);
                    return 5 > e || e > 30 ? (j.validate._showerr("用户昵称长度只能5~30个字符", c),
                        !1) : !0
                },
                _ck_reg_password: function (a) {
                    return j.validate._ck_login_password(a)
                },
                _ck_reg_password2: function (b) {
                    var c = a(b)
                        , d = c.val()
                        , e = c.parents("form").find("[name=password]").val();
                    return d !== e ? (j.validate._showerr("两次密码输入不一致", b),
                        !1) : !0
                },
                _ck_reg_email: function (b) {
                    var c = /^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+.[a-zA-Z]{2,4}$/
                        , d = a(b).val();
                    return c.test(d) ? !0 : (j.validate._showerr("邮箱地址格式不正确", b),
                        !1)
                },
                _ck_reg_protocol: function (b) {
                    var c = a(b);
                    return c.prop("checked") ? !0 : (j.validate._showerr("您还没有同意注册协议", b),
                        !1)
                }
            },
            j.control = {
                _on_auto_login: function () {
                },
                init: function () {
                    j.control.auto()
                },
                check: function (a) {
                    var b = !!c.get("nickname");
                    return a !== !0 || b || c.remove(["auth", "auth_wl", "uid", "nickname", "username", "own_room", "groupid", "notification", "phonestatus"]),
                        !!c.get("uid")
                },
                enter: function (a, b) {
                    j.control._enter(a, b)
                },
                _enter: function (b, d) {
                    var e = function (b) {
                        var e = b.error
                            , g = 0 === e;
                        if (0 === e)
                            return void a.ajax({
                                url: "/api/passport/login",
                                type: "GET",
                                data: b.data,
                                dataType: "json",
                                success: function (b) {
                                    0 == b.error ? (c.set("auth_wl", i.md5_m, 2592e3),
                                        j.control._hmac(i.md5_m, i.md5_h),
                                        a.dialog.tips_black("登录成功！", 2),
                                    j.view.redirect(1e3) || setTimeout(function () {
                                        location.reload()
                                    }, 1e3),
                                        d(g)) : (a.dialog.tips_black(b.msg, 1.5),
                                        d(!1))
                                },
                                error: f
                            });
                        var h = "";
                        h = -1 === e ? "请把表单填写完整" : -2 === e ? "请填写密码" : -3 === e ? "密码错误" : -4 === e ? "该用户未注册，请检查" : -5 === e ? 0 == b.ban_time ? "系统检测到您的昵称存在异常行为，斗鱼已经对您的昵称启用冻结保护，如需要解除冻结，请联系人工客服申请解封" : "您的账户目前已经被封禁，有效期截止：" + json.ban_time : b.msg,
                            a.dialog.tips_black(h),
                            d(!1),
                        k.instance && k.instance.refresh()
                    }
                        , f = function () {
                        d(!1),
                            a.dialog.tips_black("登录过程中发生错误，请稍候再试！")
                    }
                        , g = b.password;
                    g && (i.md5_m = CryptoJS.MD5(g).toString(),
                        b.password = i.md5_m,
                        i.hmac_flash_ready),
                        b.redirect_url = location.href,
                        b.t = (new Date).getTime(),
                        b.client_id = i.client_id,
                        a.ajax({
                            url: passport_host + "iframe/login",
                            type: "GET",
                            data: b,
                            dataType: "jsonp",
                            jsonp: "callback",
                            callback: "json_callback",
                            success: function (a) {
                                e(a)
                            },
                            error: f
                        })
                },
                reg: function (b, d) {
                    var e = null
                        , f = function (f) {
                        var g = f.result;
                        if (d(g),
                            0 === g) {
                            var h = CryptoJS.MD5(b.password + f.data.s).toString();
                            j.control._hmac(b.password, h),
                                c.set("auth_wl", b.password, 2592e3),
                                a.dialog.tips_black("注册成功，正在登录…", 2),
                            j.view.redirect(1e3) || setTimeout(function () {
                                location.reload()
                            }, 1e3)
                        } else
                            2 === g ? (a.dialog.alert("当前ip输入验证码时错误次数过多，请等待一天后在重新尝试！"),
                                e.refresh()) : (a.dialog.tips_black("注册失败：" + f.error),
                                e.refresh())
                    }
                        , g = function () {
                        d(!1),
                            a.dialog.tips_black("注册过程中发生错误，请稍候再试！")
                    }
                        , i = b.password
                        , k = b.password2;
                    i && (b.password = CryptoJS.MD5(i).toString()),
                    k && (b.password2 = CryptoJS.MD5(k).toString()),
                        e = h.create({
                            lock: !0,
                            shadow: {
                                opacity: 0
                            },
                            onSelectOver: function (c) {
                                b.captcha_word = c,
                                    a.ajax("/member/register/ajax", {
                                        type: "post",
                                        data: b,
                                        dataType: "json",
                                        success: f,
                                        error: g
                                    })
                            },
                            onHide: function () {
                                d(!1)
                            }
                        })
                },
                exit: function (b) {
                    if (c.get("stk")) {
                        var d = navigator.userAgent;
                        -1 != d.indexOf("MSIE") || d.indexOf("Gecko") ? a.post("/member/logout/ajax", function () {
                            location.href = passport_host + "sso/logout?client_id=" + i.client_id
                        }, "json") : location.href = passport_host + "sso/logout?client_id=" + i.client_id
                    } else
                        c.get("nickname") ? location.href = "/member/logout" : location.reload()
                },
                auto: function () {
                    var a = j.control.check(!0);
                    a && (e.set("sys.uid", c.get("uid")),
                        e.set("sys.username", c.get("username")),
                        e.set("sys.nickname", c.get("nickname")),
                        e.set("sys.password", c.get("auth_wl")),
                        e.set("sys.own_room", c.get("own_room")),
                        e.set("sys.groupid", c.get("groupid")),
                        e.set("sys.notification", c.get("notification")),
                        e.set("sys.phonestatus", c.get("phonestatus")),
                        e.set("sys.stk", c.get("stk")),
                        e.set("sys.biz", c.get("biz")),
                        e.set("sys.ltkid", c.get("ltkid")),
                        e.set("sys.ct", c.get("ct"))),
                        j.control._on_auto_login(a)
                },
                logsalt: function (b, c, d) {
                    a.post("/member/login/checkUsername", {
                        username: b
                    }, function (b) {
                        b.c >= 0 && (i.salt = {
                            text: b.r
                        },
                        a.isFunction(c) && c.apply(window, d))
                    }, "json")
                },
                _hmac: function (a, b) {
                    try {
                        var c = d.asProxy("hmac_flash_proxy");
                        c && c.js_psalt && c.js_psalt(a + "@" + b)
                    } catch (e) {
                    }
                },
                _load_hmac: function () {
                    var b = {
                        url: $SYS.res_url + "simplayer/HTool.swf?" + $SYS.res_ver,
                        flashvars: {},
                        params: {
                            allowscriptaccess: "always",
                            wmode: "opaque"
                        },
                        attributes: {
                            id: "hmac_flash_proxy",
                            name: "hmac_flash_proxy"
                        }
                    };
                    a("body").append('<div style="position:absolute;width:0;overflow:hidden;bottom:0;"><div id="user_login_swf"></div></div>'),
                        f.embedSWF(b.url, "user_login_swf", "1px", "1px", "9", "", b.flashvars, b.params, b.attributes)
                }
            },
            k._is_init = !1,
            k.init = function () {
                if (!k._is_init && !j.control.check(!0)) {
                    var a = j.view.el(i.view.el.pop)
                        , b = !!a.find(".captcha").length;
                    b && (k._is_init = !0,
                        k.instance = g.init(a))
                }
            }
        ;
        var m = {
            check: function () {
                var a = c.get("ditchName");
                if (!a && location.search)
                    for (var b, d, e = location.search.replace("?", "").split("&"), f = 0, g = e.length; g > f; f++)
                        if (b = e[f],
                                d = b.split("="),
                            "ditchName" === d[0]) {
                            c.set("ditchName", d[1], 0);
                            break
                        }
            },
            val: function () {
                return c.get("ditchName")
            }
        }
            , n = {
            init: function (b) {
                b = b || {},
                a.isFunction(b.onAuto) && (j.control._on_auto_login = b.onAuto),
                    j.init()
            },
            show: j.view.show,
            hide: j.view.hide,
            toggle: j.view.toggle,
            exitif: j.view.exitif,
            check: j.control.check,
            enter: j.control.enter,
            exit: j.control.exit
        };
        return window.return_loadhmOk = function () {
            hmac_flash_ready = !0
        }
            ,
            a(j.control._load_hmac),
            a(m.check),
            n
    }),
    define("douyu/com/vcode9", ["jquery", "shark/class", "shark/util/lang/1.0", "shark/util/template/1.0", "shark/ui/dragdrop/1.0", "douyu/context", "douyu/com/sign"], function (a, b, c, d, e, f, g) {
        var h = {
            src: {
                log: "/member/login/captcha",
                reg: "/member/register/regcaptcha",
                task: "/member/task/captcha2"
            },
            vcode9: {
                allowParamKeys: ["onSelectOver"]
            },
            sign: null
        }
            , i = [[0, 0], [-55, 0], [-110, 0], [0, -40], [-55, -40], [-110, -40], [0, -80], [-55, -80], [-110, -80]]
            , j = b({
            init: function (b) {
                this.config = a.extend(!0, {}, {
                    sence: "reg",
                    title: "验证码",
                    auto: !0,
                    lock: !1,
                    shadow: {
                        opacity: .7
                    },
                    sign: !1,
                    onSelectOver: function () {
                    },
                    onShow: function () {
                    },
                    onHide: function () {
                    }
                }, b),
                    this.render(),
                    this.bindEvt(),
                this.config.auto && this.show(),
                    this.refresh(),
                this.config.sign && (this.config.ddProxy = e.create({
                    target: this.config.$pop,
                    trigger: ".vcode9-tit"
                }))
            },
            render: function () {
                var b = this.make()
                    , c = a("body");
                this.config.$pop = a(b.pop),
                    this.config.$shadow = a(b.shadow),
                    this.config.$pop.hide().removeClass("hide"),
                    this.config.$shadow.hide().removeClass("hide"),
                    this.config.$pop.find(".vcode9-tit h3").text(this.config.title),
                    this.config.$shadow.css({
                        opacity: this.config.shadow.opacity,
                        filter: "Alpha(Opacity=" + 100 * this.config.shadow.opacity + ")"
                    }),
                    c.append(this.config.$pop),
                    c.append(this.config.$shadow),
                    this.config._is_show = !1,
                    this.config.selected = []
            },
            make: function () {
                return {
                    pop: a.trim(a("#dytemp-vcode9").html()),
                    shadow: a.trim(a("#dytemp-vcode9-shadow").html())
                }
            },
            showSign: function () {
                var b = 30010
                    , d = f.get("room.user_best_cq")
                    , e = a("[data-dysign=" + b + "]").html();
                if (e && !(d > 0)) {
                    var g = c.string.join('<div class="vcode9-sign">', '<div class="s-cdown">', '<span class="closetxt"><em>0</em>s 后可关闭广告</span>', '<span class="closebtn" style="">关闭</span>', '<span class="cqnosign">酬勤用户免广告</span>', "</div>", '<div class="s-box"></div>', "</div>")
                        , h = this;
                    this.config.$sign = a(g),
                        this.config.$pop.append(this.config.$sign),
                        this.config.$sign.find(".s-box").html(e),
                        this.config.$sign.find(".s-cdown .closebtn").one("click", function () {
                            h.hideSign()
                        }),
                        this.cdownSign()
                }
            },
            cdownSign: function () {
                var a = this.config.$sign
                    , b = this;
                a && (this.config.signCount = 15,
                    a.show(),
                    a.find(".s-cdown .closetxt em").text(5),
                    a.find(".s-cdown .closetxt").show(),
                    a.find(".s-cdown .closebtn").hide(),
                    this.config.signTimer = setInterval(function () {
                        b.config.signCount--,
                        b.config.signCount < 0 && (b.hideSign(),
                            clearInterval(b.config.signTimer)),
                            b.config.signCount < 10 ? (a.find(".s-cdown .closetxt").hide(),
                                a.find(".s-cdown .closebtn").show()) : a.find(".s-cdown .closetxt em").text(b.config.signCount - 10)
                    }, 1e3))
            },
            hideSign: function () {
                this.config.$sign && this.config.$sign.hide(),
                this.config.signTimer && clearInterval(this.config.signTimer)
            },
            show: function () {
                var a = this;
                this.config.lock && this.config.$shadow.fadeIn(),
                    this.config.$pop.fadeIn(function () {
                        a.config._is_show = !0,
                            a.config.onShow(a),
                        a.config.sign && a.showSign()
                    })
            },
            hide: function () {
                var a = this;
                this.config.lock && this.config.$shadow.fadeOut(),
                    this.config.$pop.fadeOut(function () {
                        a.config._is_show = !1,
                            a.config.onHide.call(a),
                        a.config.sign && a.hideSign()
                    })
            },
            getCode: function () {
                for (var a = this.config.selected, b = "", c = 0, d = a.length; d > c; c++)
                    b += a[c].v;
                return b
            },
            getSrc: function () {
                return h.src[this.config.sence]
            },
            layout: function () {
            },
            destroy: function () {
                this.config.$pop.remove(),
                    this.config.$shadow.remove()
            },
            refresh: function () {
                var a = this.config.$pop
                    , b = a.find(".vcode9-preview>b").not(".p-delete")
                    , c = this.getSrc() + "?v=" + Math.random()
                    , d = "url(" + c + ")";
                this.config.selected = [],
                    a.find(".vcode9-preview>b").not(".p-delete").css("background-image", d),
                    a.find(".vcode9-guide>span").css("background-image", d),
                    a.find(".vcode9-input>a>b").css("background-image", d),
                    b.css("background-position", "-500px -500px")
            },
            param: function () {
                var b, c = [].slice.call(arguments);
                a.isPlainObject(c[0]) ? b = c[0] : (b = {},
                    b[c[0]] = c[1]);
                for (var d in b)
                    this._param(d, b[d])
            },
            pushCode: function (a) {
                var b = this.config.selected.length
                    , c = this.config.$pop.find(".vcode9-preview>b").not(".p-delete");
                b >= 4 || (this.config.selected.push(a),
                    c.eq(b).css({
                        "background-position-x": a.x + "px ",
                        "background-position-y": a.y + "px ",
                        "background-position": a.x + "px " + a.y + "px"
                    }),
                    b = this.config.selected.length,
                4 === b && this.config.onSelectOver.call(this, this.getCode()))
            },
            popCode: function () {
                var a = this.config.selected.length
                    , b = this.config.$pop.find(".vcode9-preview>b").not(".p-delete");
                a && (this.config.selected.pop(),
                    b.eq(a - 1).css({
                        "background-position": "-500px -500px"
                    }))
            },
            bindEvt: function () {
                function b(a) {
                    a.stopPropagation(),
                        a.preventDefault()
                }

                var c = this;
                this.config.$pop.find(".p-delete").click(function () {
                    c.popCode()
                }),
                    this.config.$pop.find(".vcode9-input>a").click(function (d) {
                        b(d);
                        var e, f, g, h = a(this), j = h.find("b"), k = parseInt(j.data("num")) || 0;
                        e = i[k],
                            f = e[0] - 3,
                            g = e[1] - 3,
                            c.pushCode({
                                v: k,
                                x: f,
                                y: g
                            })
                    }),
                    this.config.$pop.find(".vcode9-close").click(function () {
                        return c.hide(),
                            !1
                    }),
                    this.config.$pop.find(".vcode9-guide>a").click(function () {
                        return c.refresh(),
                            !1
                    })
            },
            _param: function (a, b) {
                for (var c = !1, d = h.vcode9.allowParamKeys, e = 0, f = d.length; f > e; e++)
                    if (a === d[e]) {
                        c = !0;
                        break
                    }
                c && (this.config[a] = b)
            }
        })
            , k = {
            create: function (a) {
                return new j(a)
            }
        };
        return k
    }),
    define("douyu/com/vcode-user", ["jquery", "shark/class"], function (a, b) {
        var c = {
            type: null,
            input: {
                codesrc: "/member/task/captcha"
            },
            fast: {
                idpre: "gt-captcha-",
                count: 0
            }
        }
            , d = b({
            init: function (b) {
                this.config = a.extend(!0, {}, {
                    target: null
                }, b),
                    this.render(),
                    this.bindEvt(),
                    this.refresh()
            },
            render: function () {
                this.config.$tar = a(this.config.target),
                    this.config.$el = this.config.$tar.find(".captcha"),
                    this.config.$ipt = this.config.$el.find("input"),
                    this.config.$img = this.config.$el.find("img")
            },
            show: function () {
                this.config.$el.show()
            },
            hide: function () {
                this.config.$el.hide()
            },
            refresh: function () {
                var a = passport_host + "api/captcha?v=" + (new Date).getTime();
                this.config.$img.attr("src", a),
                    this.config.$ipt.val("")
            },
            bindEvt: function () {
                var a = this;
                this.config.$img.click(function (b) {
                    b.stopPropagation(),
                        b.preventDefault(),
                        a.refresh()
                })
            }
        })
            , e = b({
            init: function (b) {
                this.config = a.extend(!0, {}, {
                    target: null
                }, b),
                    this.render()
            },
            nextId: function () {
                return c.fast.idpre + ++c.fast.count
            },
            getResult: function () {
                return this.config.result
            },
            check: function (b) {
                var c = function (c) {
                        0 === c.code ? this.buildAsync(a.trim(c.id)) : b(!1)
                    }
                    , d = function () {
                        b(!1)
                    }
                    ;
                a.ajax("/member/login/check_capcha_status", {
                    type: "post",
                    dataType: "json",
                    timeout: 5e3,
                    success: a.proxy(c, this),
                    error: a.proxy(d, this)
                })
            },
            render: function () {
                this.config.$tar = a(this.config.target),
                    this.config.$el = this.config.$tar.find(".captcha-gt")
            },
            build: function (a) {
                var b = this.nextId()
                    , c = this;
                this.config.$el.append('<div id="' + b + '"></div>'),
                    this.config.result = null ,
                    window.initGeetest({
                        gt: a,
                        product: "float"
                    }, function (a) {
                        a.appendTo("#" + b),
                            a.onSuccess(function () {
                                c.config.result = c.plugin.getValidate()
                            }),
                            a.onRefresh(function () {
                                c.config.result = null
                            }),
                            a.onError(function () {
                                c.config.result = null
                            }),
                            c.plugin = a
                    })
            },
            buildAsync: function (a) {
                var b = this;
                require.use(["http://static.geetest.com/static/tools/gt.js"], function () {
                    b.build(a)
                })
            },
            refresh: function () {
                this.plugin.refresh()
            },
            show: function () {
                this.config.$el.show()
            },
            hide: function () {
                this.config.$el.hide()
            }
        })
            , f = {
            init: function (a) {
                var b = new d({
                    target: a
                })
                    , f = new e({
                    target: a
                });
                c.type = "fast",
                    b.hide();
                try {
                    f.check(function (a) {
                        a === !1 && (c.type = "input",
                            b.show(),
                            f.hide())
                    })
                } catch (g) {
                    c.type = "input",
                        b.show(),
                    window.console && console.error(g)
                }
                return {
                    refresh: function () {
                        "input" === c.type ? b.refresh() : f.refresh()
                    },
                    isInput: function () {
                        return "input" === c.type
                    },
                    isFast: function () {
                        return "fast" === c.type
                    },
                    getType: function () {
                        return c.type
                    },
                    getFastResult: function () {
                        return f.getResult()
                    }
                }
            }
        };
        return f
    }),
    define("douyu/com/sign", ["jquery", "shark/class", "shark/util/lang/1.0", "shark/util/ready/1.0", "shark/util/flash/bridge/1.0", "shark/util/flash/data/1.0", "shark/ext/swfobject", "douyu/context"], function (a, b, c, d, e, f, g, h) {
        var i = (d.create(),
        {
            sign: {
                id_pre: "dysign-",
                dom_prop: "data-dysign",
                render_count: 0
            },
            aop: {
                optype: {
                    remove: "remove"
                },
                view: "view",
                clean: "clean",
                complete: "complete"
            },
            showAdPos: []
        })
            , j = {
            elementSign: function (b) {
                return a(b).attr(i.sign.dom_prop)
            },
            pageSigns: function () {
                var b, c = [];
                return a("[" + i.sign.dom_prop + "]").each(function () {
                    b = j.elementSign(this),
                        c.push(b)
                }),
                    c
            },
            innerPath: function (a) {
                return 0 === a.indexOf("http://") || 0 === a.indexOf("https://") ? a : h.get("sys.upload_url") + a
            },
            innerLink: function (a) {
                return a && a.adid && a.posid && a.proid ? c.string.format("/lapi/sign/signapi/click?roomid={0}&aid={1}&posid={2}&projid={3}", h.get("room.room_id") || 0, a.adid || 0, a.posid || 0, a.proid || 0) : void 0
            }
        }
            , k = 0;
        try {
            k = $ROOM.room_id
        } catch (l) {
        }
        var m = window._pageadvar || []
            , n = {
            build: function () {
                var b = a("[data-dysign]");
                m.length && o.response(m);
                var c = this.getAjaxPosList(b, m).join(",");
                c ? o.getAjaxPosListData(c) : (i.sign.render_count = 0,
                    p.completeCallback()),
                    o.exposureAd()
            },
            getAjaxPosList: function (b, c) {
                for (var d = [], e = 0, f = b.length; f > e; e++) {
                    var g = a(b[e])
                        , h = g.attr("data-dysign") - 0;
                    if (g.attr("data-dysign-show"))
                        i.showAdPos.push(h);
                    else {
                        for (var j = !1, k = 0, l = c.length; l > k; k++)
                            h == c[k].posid - 0 && (j = !0);
                        j || d.push(h)
                    }
                }
                return d
            }
        }
            , o = {
            request: function (a, b) {
                this.getAjaxPosListData(a)
            },
            response: function (a) {
                a && p.render(a)
            },
            _decodeFlashText: function (a) {
                var b, d, e, f, g = "ad_list@=";
                return !a || a.indexOf(g) < 0 ? void 0 : (b = a.replace(g, "").replace(/@AAS/g, "/").split("@S"),
                    e = [],
                    c.each(b, function (a) {
                        a.indexOf("@AS") >= 0 && (d = a.split("@AS"),
                            f = {},
                            c.each(d, function (a) {
                                a = a.split("@AA="),
                                a[0] && (f[a[0]] = a[1])
                            }),
                            e.push(f))
                    }),
                    e)
            },
            getAjaxPosListData: function (b) {
                var c = this
                    , d = "/lapi/sign/signapi/getinfo";
                a.ajax({
                    url: d,
                    type: "POST",
                    data: {
                        posid: b,
                        roomid: k
                    },
                    dataType: "json",
                    success: function (a) {
                        0 === a.error ? c.response(a.data) : (i.sign.render_count = 0,
                            p.completeCallback())
                    },
                    error: function () {
                        i.sign.render_count = 0,
                            p.completeCallback()
                    }
                })
            },
            exposureAd: function () {
                for (var b = [], c = 0, d = i.showAdPos.length; d > c; c++) {
                    var e = a("[data-dysign=" + i.showAdPos[c] + "]")
                        , f = {
                        adid: e.attr("data-dysign-adid") || "",
                        posid: e.attr("data-dysign") || "",
                        proid: e.attr("data-dysign-proid") || "",
                        roomid: k
                    };
                    b.push(f)
                }
                if (window._pageadvar)
                    for (var c = 0, d = _pageadvar.length; d > c; c++) {
                        var f = {
                            adid: _pageadvar[c].adid || "",
                            posid: _pageadvar[c].posid || "",
                            proid: _pageadvar[c].proid || "",
                            roomid: k
                        };
                        b.push(f)
                    }
                if (b.length) {
                    var g = "/lapi/sign/signapi/setinfo";
                    a.ajax({
                        url: g,
                        type: "POST",
                        dataType: "json",
                        data: {
                            data: JSON.stringify(b)
                        },
                        success: function (a) {
                        }
                    })
                }
            }
        }
            , p = {
            render: function (a) {
                var b, c, d, e = p.render.ways, f = e["default"];
                try {
                    for (var g = 0, h = a.length; h > g; g++)
                        if (b = a[g],
                                !(b.adid < 0)) {
                            d = !1;
                            for (var j in e)
                                if (c = e[j],
                                    "default" !== j && c(b) === !0) {
                                    d = !0;
                                    break
                                }
                            d !== !0 && f(b)
                        }
                } catch (k) {
                    window.console && console.error(k)
                }
                try {
                    p.clean()
                } catch (k) {
                    window.console && console.error(k)
                }
                1 === i.sign.render_count ? (i.sign.render_count = 0,
                    p.completeCallback()) : i.sign.render_count++
            },
            clean: function () {
                var b, c, d, e, f, g = p.clean.ways, h = g["default"], j = a("[" + i.sign.dom_prop + "]");
                j.each(function (a) {
                    b = j.eq(a),
                        c = b.attr(i.sign.dom_prop),
                        f = !1;
                    for (var k in g)
                        if (d = g[k],
                                e = {
                                    id: c,
                                    el: b.get(0)
                                },
                            "default" !== k && d(e) === !0) {
                            f = !0;
                            break
                        }
                    f !== !0 && h(e)
                })
            }
        };
        p.render.reg = function (a, b) {
            "default" !== a && (p.render.ways[a] = b)
        }
            ,
            p.render.remove = function (a) {
                if ("default" !== a) {
                    var b = {}
                        , c = p.render.ways;
                    for (var d in c)
                        a !== d && (b[d] = c[d]);
                    p.render.ways = b
                }
            }
            ,
            p.clean.reg = function (a, b) {
                "default" !== a && (p.clean.ways[a] = b)
            }
            ,
            p.clean.remove = function (a) {
                if ("default" !== a) {
                    var b = {}
                        , c = p.clean.ways;
                    for (var d in c)
                        a !== d && (b[d] = c[d]);
                    p.clean.ways = b
                }
            }
            ,
            p.render.ways = {
                "default": function (b) {
                    var d, e, f, l, m, n = (c.string.join,
                        c.string.format);
                    if (b.adid && !(b.adid <= 0) && b.srcid && (d = n("[{0}={1}]", i.sign.dom_prop, b.posid),
                            m = a(d),
                            m.length)) {
                        m.empty(),
                            f = b.link ? j.innerLink(b) : "",
                            b.srcid.indexOf(".swf") > 0 ? (l = {
                                id: i.sign.id_pre + b.posid,
                                cover: h.get("sys.web_url") + "app/douyu/res/flash/swfcover.gif",
                                path: j.innerPath(b.srcid),
                                params: {
                                    wmode: "opaque",
                                    menu: "false",
                                    allowFullScreen: "false",
                                    AllowScriptAccess: "never"
                                }
                            },
                                e = n('<div id="{0}"></div>', l.id)) : e = n('<img src="{0}" style="width:100%;height:100%">', j.innerPath(b.srcid));
                        var o = b && b.ec ? JSON.parse(b.ec).innerlink : 0;
                        if (l && o - 0 == 1) {
                            e = n('<div id="{0}"></div>', l.id),
                                m.append(e);
                            var p = "http://" + window.location.host + "/lapi/sign/signapi/click?roomid=" + k + "&aid=" + b.adid + "&posid=" + b.posid + "&projid=" + b.proid + "&callback=1";
                            return p = escape(p),
                                void g.embedSWF(l.path, l.id, "100%", "100%", "9.0.0", null, {
                                    adcl: p
                                }, l.params)
                        }
                        var q = h.get("sys.web_url") + "/app/douyu/res/flash/swfcover.gif";
                        m.is("a") ? m.prop("href", f).prop("href", "_blank") : e = l ? n('<a href="{0}" target="_blank" style="position: relative; display: block;width: 100%;height: 100%;">{1}<img src="' + q + '" width="100%" height="100%" style="position: absolute;top: 0;left: 0;z-index: 10;" onclick="this.parentNode.click(); return false;" /></a>', f, e) : n('<a href="{0}" target="_blank">{1}</a>', f, e),
                            m.append(e),
                        l && g.embedSWF(l.path, l.id, "100%", "100%", "9.0.0", null, null, l.params)
                    }
                }
            },
            p.clean.ways = {
                "default": function (a) {
                }
            },
            p.completeCallback = function () {
            }
        ;
        var q = function (b) {
                var c = [].slice.call(arguments, 1);
                b === i.aop.view && (c[0] === i.aop.optype.remove ? p.render.remove(c[1]) : p.render.reg(c[0], c[1])),
                b === i.aop.clean && (c[0] === i.aop.optype.remove ? p.clean.remove(c[1]) : p.clean.reg(c[0], c[1])),
                b === i.aop.complete && (p.completeCallback = a.isFunction(c[0]) ? c[0] : p.completeCallback)
            }
            ;
        return {
            request: function (a) {
                o.request(a)
            },
            requestPage: function () {
                n.build()
            },
            response: o.response,
            helper: {
                innerPath: j.innerPath,
                innerLink: j.innerLink,
                defview: p.render.ways["default"]
            },
            aop: q
        }
    }),
    define("douyu/com/avatar", ["jquery", "shark/observer", "shark/util/lang/1.0", "douyu/context", "shark/util/cookie/1.0"], function (a, b, c, d, e) {
        function f(b, c, d) {
            var e = m[b];
            a.isPlainObject(e) || (m[b] = {}),
                m[b][c] = d
        }

        function g(a, b) {
            var c = m[a];
            return c ? c[b] : ""
        }

        function h(b, d, g) {
            var h = e.get("avatar");
            if (h)
                return "_" == h.charAt(h.length - 1) && (h += d + ".jpg"),
                "=" == h.charAt(h.length - 1) && (h += d),
                g && g(h),
                    h;
            var i = "";
            return a.ajax({
                url: c.string.format("/lapi/member/userInfo/getInfo/{0}?size={1}&icon={2}", b, d, 1),
                type: "get",
                dataType: "json",
                success: function (a) {
                    if (0 === a.error)
                        if (a.data.icon)
                            if (0 == a.data.icon.code) {
                                i = c.string.format("{0}upload/{1}", k, a.data.icon.msg);
                                var h = -1
                                    , j = "";
                                -1 != i.indexOf("_small.jpg") ? h = i.indexOf("_small.jpg") : -1 != i.indexOf("_middle.jpg") ? h = i.indexOf("_middle.jpg") : -1 != i.indexOf("_big.jpg") ? h = i.indexOf("_big.jpg") : -1 != i.indexOf("size=") && (h = i.indexOf("size=") + 4),
                                -1 != h && (j = i.substring(0, h + 1),
                                    e.set("avatar", j, 0)),
                                    f(b, d, i)
                            } else
                                i = l;
                        else
                            i = l;
                    else
                        i = l;
                    g && g(i)
                },
                error: function () {
                    i = l,
                    g && g(i)
                }
            }),
                i
        }

        function i(b, d, e) {
            var g = "";
            return a.ajax({
                url: c.string.format("{0}lapi/member/avatar/getAvatar?uid={1}&size={2}", "/", b, d),
                type: "get",
                success: function (a) {
                    a ? (g = c.string.format("{0}upload/{1}", k, a),
                        f(b, d, g)) : g = l,
                    e && e(g)
                },
                error: function (a) {
                    g = l,
                    e && e(g)
                }
            }),
                g
        }

        var j = d.get("sys.res_url")
            , k = d.get("sys.avatar_url")
            , l = j + "douyu/images/defaultAvatar.png?20160303"
            , m = {};
        b.on("douyu.avatar.get", function (a, b, c) {
            var d;
            return k && a ? (b = b || "small",
                (d = g(a, b)) ? (c && c(d),
                    d) : d = $SYS.uid == a ? h(a, b, c) : i(a, b, c)) : (c && c(l),
                l)
        })
    }),
    define("douyu/com/left", ["jquery", "shark/class", "shark/observer", "shark/util/cookie/1.0", "douyu/context", "douyu/com/user", "douyu/com/left-dp"], function (a, b, c, d, e, f, g) {
        var h, i, j = {
            left: {
                cookie: "leftstate",
                state: {
                    open: "open",
                    close: "close"
                }
            }
        };
        i = b({
            init: function () {
                this.config = {
                    el: "#left",
                    sll: "#left-big-scroll",
                    state: j.left.state.open
                },
                    this.render(),
                    this.bindEvt()
            },
            render: function () {
                this.config.$el = a(this.config.el),
                    this.config.$sll = a(this.config.sll),
                    this.config.$cols = this.config.$el.find(".leftnav-cate .column-cont"),
                    this.config.$recs = this.config.$el.find(".leftnav-cate .recom-cont"),
                    this.observer = c.create(this),
                    this.renderCalc(),
                    this.renderSll(),
                    this.openCurColMenu(),
                    this.screenMedia(),
                    this.renderApplyDelay(),
                    this.checkDelay()
            },
            renderCalc: function () {
                this.config.$cols.find("dt").each(function (b) {
                    a(this).attr("data-index", b)
                }),
                    this.config.$cols.find("dd").each(function (b) {
                        var c = a(this)
                            , d = c.height();
                        c.removeClass("hide").attr({
                            "data-index": b,
                            "data-height": d
                        }),
                        0 !== b && c.hide()
                    })
            },
            renderSll: function () {
                this.config.$sll.tinyscrollbar({
                    axis: "y"
                }),
                    this.resetSllDelay()
            },
            resetSll: function () {
                var a = this.config.$el
                    , b = this.config.$sll
                    , c = a.find(".left-big .b-content")
                    , d = a.find(".left-footer")
                    , e = d.find(".btn-live")
                    , f = a.height() - d.outerHeight(!0);
                e.is(":hidden") || (f -= 10),
                    c.height(f),
                    b.tinyscrollbar_update()
            },
            resetSllDelay: function (b) {
                var c = this;
                setTimeout(function () {
                    c.resetSll(),
                    a.isFunction(b) && b()
                }, 500)
            },
            resetSllBot: function () {
                var a = this.config.$el
                    , b = this.config.$sll
                    , c = a.find(".left-big .b-content")
                    , d = a.find(".left-footer")
                    , e = d.find(".btn-live")
                    , f = a.height() - d.outerHeight(!0)
                    , g = b.find(".overview").outerHeight(!0) - b.height();
                e.is(":hidden") || (f -= 10),
                    g = g > 0 ? g : 0,
                    c.height(f),
                    b.tinyscrollbar_update(g)
            },
            resetSllBotDelay: function () {
                this.config.isOpenCalced = !0,
                    setTimeout(a.proxy(this.resetSllBot, this), 500)
            },
            renderApply: function () {
                var a = f.check()
                    , b = e.get("sys.own_room")
                    , c = this.config.$el.find(".left-big .btn-live a");
                a && "1" === b ? (c.attr({
                    href: "/room/my",
                    title: "进入直播间"
                }),
                    c.find("span").text("进入直播间")) : (c.attr({
                    href: "/room/apply",
                    title: "申请直播"
                }),
                    c.find("span").text("申请直播"))
            },
            renderApplyDelay: function () {
                setTimeout(a.proxy(this.renderApply, this), 500)
            },
            open: function () {
                var b = a(window)
                    , c = b.height()
                    , d = this;
                this.config.state = j.left.state.open,
                    this.save(),
                    this.config.$el.removeClass("small"),
                    !this.config.isOpenCalced && 768 > c ? (this.resetSllDelay(function () {
                        d.resetSllBotDelay()
                    }),
                        this.config.isOpenCalced = !0) : this.resetSllBotDelay(),
                    this.observer.trigger("toggle", this.config.state)
            },
            check: function () {
                var a = d.get(j.left.cookie);
                null !== a && (a = parseInt(a),
                0 === a && this.close())
            },
            checkDelay: function () {
                setTimeout(a.proxy(this.check, this), 500)
            },
            close: function () {
                this.config.state = j.left.state.close,
                    this.save(),
                    this.config.$el.addClass("small"),
                    this.observer.trigger("toggle", this.config.state)
            },
            closeDelay: function () {
                setTimeout(a.proxy(this.close, this), 300)
            },
            toggle: function () {
                this.config.state === j.left.state.open ? this.close() : this.open()
            },
            save: function () {
                var a = this.config.state === j.left.state.open ? 1 : 0;
                d.set(j.left.cookie, a)
            },
            openColMenu: function (a) {
                var b = this.config.$cols
                    , c = b.find("dt")
                    , d = b.find("dd")
                    , e = c.eq(a)
                    , f = d.eq(a);
                if (c.removeClass("cur"),
                        e.addClass("cur"),
                    0 === a) {
                    var g = f.data("height");
                    g ? (d.hide(),
                        f.height(g).show()) : (f.show(),
                        f.data("height", f.height()),
                        this.renderCalc())
                } else {
                    var h = d.eq(0)
                        , i = h.data("height");
                    d.each(function (a) {
                        return 0 === a ? !0 : void d.eq(a).hide()
                    }),
                        h.height(i - f.height() / 2),
                        f.show()
                }
                0 !== a && this.resetSllBot()
            },
            openCurColMenu: function () {
                var a = this.config.$cols.find("dd li a.current");
                if (!a.length)
                    return void this.openColMenu(0);
                var b = a.closest("dd");
                index = b.data("index"),
                index && this.openColMenu(index)
            },
            screenMedia: function (b) {
                var c = a(window)
                    , d = a("#header")
                    , e = this.config.$el
                    , f = e.find(".left-footer .btn-live")
                    , g = (e.height(),
                    c.width())
                    , h = c.height()
                    , i = d.outerHeight(!0)
                    , j = this;
                768 > h ? (f.hide(),
                    this.resetSllDelay(function () {
                        j.resetSllBotDelay()
                    })) : (f.show(),
                    this.resetSllDelay()),
                    e.css("height", h - i),
                !b && 1340 > g && this.closeDelay()
            },
            bindEvt: function () {
                function b(a) {
                    a.stopPropagation(),
                        a.preventDefault()
                }

                var c = this
                    , d = this.config.$el;
                d.on("click", ".left-big .follow, .left-small .follow", function (a) {
                    b(a);
                    var c = f.check()
                        , d = "/room/my_follow";
                    c ? location.href = d : f.show("login", {
                        redirect: d
                    })
                }),
                    d.on("click", ".left-big .btn-live a", function (a) {
                        var b = f.check();
                        return b ? void 0 : (f.show("login", {
                            redirect: "/room/apply"
                        }),
                            !1)
                    }),
                    d.on("click", ".left-btn", function () {
                        c.toggle()
                    }),
                    d.on("click", ".leftnav-cate .r-tit ul li", function () {
                        var b = a(this)
                            , d = b.index();
                        b.siblings("li").removeClass("cur"),
                            b.addClass("cur"),
                            0 === d ? (c.config.$cols.removeClass("hide"),
                                c.config.$recs.addClass("hide"),
                                c.openCurColMenu()) : (c.config.$cols.addClass("hide"),
                                c.config.$recs.removeClass("hide"))
                    }),
                    setTimeout(function () {
                        d.on("mouseenter", ".column-cont dl dt", function () {
                            c.openColMenu(a(this).data("index"))
                        }),
                            d.on("mouseenter", ".column-cont dl dd", function () {
                                c.openColMenu(a(this).data("index"))
                            }),
                            d.on("mouseleave", ".column-cont", function () {
                                c.openColMenu(0)
                            })
                    }, 300),
                    a(window).resize(function () {
                        c.config.isOpenCalced = !1,
                            c.screenMedia()
                    })
            }
        });
        var k = function () {
                h = new i
            }
            ;
        return a(k),
        {
            onToggle: function (a) {
                h && h.observer.on("toggle", a)
            }
        }
    }),
    define("douyu/com/zoom", ["jquery", "shark/observer", "shark/util/cookie/1.0", "douyu/context"], function (a, b, c, d) {
        var e = {
                cookieVal: "1",
                isPop: !1,
                init: function () {
                    this.pop(),
                        b.on("mod.layout.screen.change", function (a) {
                            e.detect() && e.pop()
                        })
                },
                detect: function () {
                    return this.ua = navigator.userAgent.toLowerCase(),
                        -1 == this.ua.indexOf("windows") ? !1 : !c.get("zoomtip")
                },
                cal: function () {
                    var a = 0
                        , b = window.screen;
                    return void 0 !== window.devicePixelRatio ? a = window.devicePixelRatio : ~this.ua.indexOf("msie") ? b.deviceXDPI && b.logicalXDPI && (a = b.deviceXDPI / b.logicalXDPI) : void 0 !== window.outerWidth && void 0 !== window.innerWidth && (a = window.outerWidth / window.innerWidth),
                    a && (a = Math.round(100 * a)),
                    99 !== a && 101 !== a || (a = 100),
                        a
                },
                resize: function () {
                    var b = this.cal();
                    if (this.isPop && b && 100 == b)
                        return void this.close();
                    var c = 540
                        , d = 440
                        , e = 100 * c / b
                        , f = 100 * d / b;
                    a(".pop-zoom-container").css({
                        width: e + "px",
                        height: f + "px",
                        marginLeft: -e / 2 + "px",
                        marginTop: -f / 2 + "px"
                    })
                },
                pop: function () {
                    var b = this.cal();
                    if (!this.isPop && 100 !== b) {
                        var c = d.get("sys.web_url") + "app/douyu/res/com/zoom-error.png"
                            , e = d.get("sys.web_url") + "app/douyu/res/com/zoom-hide-uncheck.png"
                            , f = d.get("sys.web_url") + "app/douyu/res/com/zoom-hide-checked.png"
                            , g = ['<div class="pop-zoom-container">', '<div class="pop-zoom">', '<img class="pop-zoom-bg" src="', c, '">', '<div class="pop-zoom-close">close</div>', '<div class="pop-zoom-hide">', '<img class="pop-zoom-hide-uncheck on" src="' + e + '">', '<img class="pop-zoom-hide-checked" src="' + f + '">', "</div>", "</div>", "</div>"].join("");
                        a("body").append(g),
                            this.bindEvt(),
                            this.isPop = !this.isPop
                    }
                    this.resize()
                },
                close: function () {
                    a(".pop-zoom-hide-checked").hasClass("on") && c.set("zoomtip", this.cookieVal, 86400),
                        a(".pop-zoom-container").remove(),
                        this.isPop = !this.isPop
                },
                bindEvt: function () {
                    var b = this;
                    a(".pop-zoom-close").on("click", function () {
                        b.close()
                    }),
                        a(".pop-zoom-hide").on("click", function () {
                            a(this).find(".on").removeClass("on").siblings().addClass("on")
                        })
                }
            }
            , f = function () {
                e.detect() && e.init()
            }
            ;
        a(f)
    }),
    define("douyu/page/room/base/api", ["jquery", "shark/util/flash/bridge/1.0"], function (a, b, c) {
        var d = {
            flash: {
                id: "room_flash_proxy"
            }
        }
            , e = ["room_dycookie_set", "room_dycookie_get", "room_login_show", "room_bus_login", "room_bus_login2", "room_bus_phobi", "room_bus_phock", "room_bus_pagescr", "room_bus_showwatchtip", "room_bus_showwatchtipdown", "room_data_sererr", "room_data_flaerr", "room_data_chat", "room_data_chat2", "room_data_schat", "room_data_sys", "room_data_brocast", "room_data_cqrank", "room_data_cqrankupdate", "room_data_olyw", "room_data_info", "room_data_login", "room_data_userc", "room_data_setadm", "room_data_gift", "room_data_buycq", "room_data_tasklis", "room_data_taskcou", "room_data_taskrec", "room_data_chest", "room_data_onekeyacc", "room_data_chatinit", "room_data_chatrep", "room_data_ycchange", "room_data_state", "room_data_nstip", "room_data_nstip2", "room_data_illchange", "room_data_getdid", "room_data_giftbat1", "room_data_ancpoints", "room_data_reg", "room_data_ulgrow", "room_data_ulico", "room_data_rankgap", "room_data_expchange", "room_data_beastrec", "room_data_beastrep", "room_data_petrec", "room_data_buytickets", "room_data_chargelive", "room_data_endchargelive", "room_bus_comcall", "room_data_admfail", "room_data_chatpri", "room_data_per", "room_data_giftbat2", "room_data_balance", "room_data_tasksign", "room_data_chestquery", "room_data_chatcd", "room_data_luckdrawcd"]
            , f = ["js_newuser_client", "js_userlogin", "js_verReque", "js_anotherlogin", "js_sendmsg", "js_blackuser", "js_userlogout", "js_setadmin", "js_sendsize", "js_barrage", "js_myblacklist", "adverment", "js_givePresent", "js_giveGift", "js_queryTask", "js_newQueryTask", "js_obtainTask", "js_roomSignUp", "js_keyTitles", "js_reportBarrage", "js_exitFullScreen", "js_rewardList", "js_pmFeedback", "js_query_giftPkg", "js_switchStream", "js_superDanmuClick", "js_GetHongbao", "js_effectVisible", "js_breakRuleTip", "js_timeLoginTip", "js_sendhandler"]
            , g = {
            fnIn: function (a, b) {
                for (var c = 0, d = a.length; d > c; c++)
                    if (b === a[c])
                        return b;
                return !1
            },
            fnInACJ: function (a) {
                return g.fnIn(e, a)
            },
            fnInJCA: function (a) {
                return g.fnIn(f, a)
            }
        }
            , h = {}
            , i = function (b, c) {
            if (b = g.fnInACJ(b),
                    !b)
                return !1;
            var d, e, f;
            return a.isFunction(c) ? (d = c,
                e = window) : (d = c.fn || function () {
                }
                ,
                f = c.data,
                e = c.scope || window),
            a.isArray(h[b]) || (h[b] = []),
                h[b].push({
                    fn: d,
                    data: f,
                    scope: e
                }),
                !0
        }
            , j = function (a) {
            var b, c = [], d = Array.prototype.slice.call(arguments, 1);
            if (a = g.fnInACJ(a),
                    !a)
                return !1;
            for (var e, f = h[a], i = 0, j = f.length; j > i; i++)
                e = f[i],
                e.data && (c.push(e.data),
                    b = c.concat(d)),
                    b = c.concat(d),
                    e.fn.apply(e.scope, b);
            return !0
        }
            , k = function (a) {
            var b, c = arguments[1], d = [].slice.call(arguments, 2), e = navigator.appName.indexOf("Microsoft") >= 0, f = e ? window[a] : document[a];
            f && (b = f[c]) && b.apply(f, d)
        }
            , l = function (a) {
            if (a = g.fnInJCA(a)) {
                var b = [d.flash.id, a]
                    , c = [].slice.call(arguments, 1)
                    , e = b.concat(c);
                k.apply(window, e)
            }
        }
            , m = function (a, b) {
            "flash.id" === a && (d.flash.id = b)
        }
            , n = function () {
            for (var a, c, d = 0, f = e.length; f > d; d++)
                a = e[d],
                    c = {
                        fn: function (a) {
                            var b = [a.name]
                                , c = Array.prototype.slice.call(arguments, 1)
                                , d = b.concat(c);
                            j.apply(window, d)
                        },
                        data: {
                            name: a
                        }
                    },
                    b.add(a, c)
        }
            , o = {
            application: n,
            set: m,
            reg: i,
            exe: l
        };
        return shark.config("debug") && (window.ACJ_C = h),
            o
    }),
    function () {
        var a = {};
        a._namespace = function (a) {
            for (var b, c = a.split("."), d = window, e = 0, f = c.length; f > e; e++)
                b = c[e],
                    d = d[b] = d[b] || {};
            return d
        }
            ,
            a.namespace = function () {
                var b, c, d = Array.prototype.slice.call(arguments, 0), e = d.length > 1;
                if (!e)
                    return a._namespace(d[0]);
                b = [];
                for (var f = 0, g = d.length; g > f; f++)
                    c = d[f],
                        b.push({
                            name: c,
                            vars: a._namespace(c)
                        });
                return b
            }
            ,
            a.interval = function (b, c, d) {
                setTimeout(function () {
                    b() !== !1 && a.interval(b, c)
                }, c),
                d === !0 && b()
            }
            ,
            a.templateSettings = {
                evaluate: /<%([\s\S]+?)%>/g,
                interpolate: /<%=([\s\S]+?)%>/g,
                escape: /<%-([\s\S]+?)%>/g
            },
            a.template = function (b, c, d) {
                var e = /\\|'|\r|\n|\u2028|\u2029/g
                    , f = function (a) {
                        return "\\" + escapes[a]
                    }
                    ;
                !c && d && (c = d),
                    c = $.extend({}, c, a.templateSettings);
                var g = RegExp([(c.escape || noMatch).source, (c.interpolate || noMatch).source, (c.evaluate || noMatch).source].join("|") + "|$", "g")
                    , h = 0
                    , i = "__p+='";
                b.replace(g, function (a, c, d, g, j) {
                    return i += b.slice(h, j).replace(e, f),
                        h = j + a.length,
                        c ? i += "'+\n((__t=(" + c + "))==null?'':_.escape(__t))+\n'" : d ? i += "'+\n((__t=(" + d + "))==null?'':__t)+\n'" : g && (i += "';\n" + g + "\n__p+='"),
                        a
                }),
                    i += "';\n",
                c.variable || (i = "with(obj||{}){\n" + i + "}\n"),
                    i = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + i + "return __p;\n";
                try {
                    var j = new Function(c.variable || "obj", "_", i)
                } catch (k) {
                    throw k.source = i,
                        k
                }
                var l = function (a) {
                    return j.call(this, a)
                }
                    , m = c.variable || "obj";
                return l.source = "function(" + m + "){\n" + i + "}",
                    l
            }
            ,
            a.flash = {
                Decode: function () {
                    var a = new Object
                        , b = new Array;
                    this.Parse = function (c) {
                        "/" != c.charAt(c.length - 1) && (c += "/");
                        for (var d = "", e = "", f = 0, g = 0; g < c.length; g++)
                            "/" == c.charAt(g) ? (a = {
                                key: e,
                                value: d
                            },
                                b[f] = a,
                                e = d = "",
                                f++) : "@" == c.charAt(g) ? (g++,
                                "A" == c.charAt(g) ? d += "@" : "S" == c.charAt(g) ? d += "/" : "=" == c.charAt(g) && (e = d,
                                    d = "")) : d += c.charAt(g);
                        return b
                    }
                        ,
                        this.GetItem = function (a) {
                            for (var c = "", d = 0; d < b.length; d++)
                                if (b[d].key == a) {
                                    c = b[d].value;
                                    break
                                }
                            return c
                        }
                        ,
                        this.GetItemByIndex = function (a) {
                            return a < b.length ? b[a].value : null
                        }
                        ,
                        this.GetItemAsInt = function (a) {
                            for (var c = 0, d = 0; d < b.length; d++)
                                if (b[d].key == a) {
                                    c = b[d].value;
                                    break
                                }
                            return c
                        }
                        ,
                        this.GetItemAsNumber = function (a) {
                            for (var c = 0, d = 0; d < b.length; d++)
                                if (b[d].key == a) {
                                    c = b[d].value;
                                    break
                                }
                            return c
                        }
                },
                Encode: function () {
                    var a = "";
                    this.AddItem = function (c, d) {
                        var e = "";
                        e = null != c ? b(c) + "@=" : "",
                            a += e + b(d) + "/"
                    }
                        ,
                        this.AddItem_int = function (c, d) {
                            var e = "";
                            e = null != c ? b(c) + "@=" : "",
                                a += e + b(d.toString()) + "/"
                        }
                        ,
                        this.Get_SttString = function () {
                            return a
                        }
                    ;
                    var b = function (a) {
                        for (var b = "", c = 0; c < a.length; c++)
                            b += "/" == a.charAt(c) ? "@S" : "@" == a.charAt(c) ? "@A" : a.charAt(c);
                        return b
                    }
                }
            },
        window.Helper || (window.Helper = a),
        window.define && define("Helper", function () {
            return a
        })
    }(),
    define("douyu/page/room/normal/widget/pager", ["jquery"], function (a) {
        var b = null
            , c = function (a) {
                this.init(a)
            }
            ;
        return c.create = function (a) {
            return new c(a)
        }
            ,
            a.extend(!0, c.prototype, {
                init: function (b) {
                    this.config = a.extend(!0, {
                        warp: null,
                        limit: 1,
                        offset: 0,
                        relate: 1,
                        step: 5,
                        showVertical: 1,
                        beforeSend: function () {
                        },
                        error: function () {
                        },
                        success: function () {
                        },
                        callback: function () {
                        },
                        wrongPageCall: function () {
                            alert("请输入正确的页码！")
                        }
                    }, b || {}),
                        this.$target = a(this.config.target),
                        this.currentIndex = 0,
                        this.bindEvent()
                },
                createItem: function (b) {
                    var c, d, e;
                    c = ["<% for(var i = 0, length = data.length; i < length; i++) { %>", "<% var item = data[i]; %>", "<% if ( item.push_vertical_screen == 1 ) { %>", '<li><a href="javascript:;" class="tag_trigger deepen" title="该分类为竖屏直播分类" data-short="<%= item.short_name || "" %>" data-pid="<%= item.parent_id || "" %>" data-id="<%= item.tag_id || item.id %>" data-total="<%= item.child_count || 0 %>"><%= item.tag_name || item.name %></a></li>', "<% } else { %>", '<li><a href="javascript:;" class="tag_trigger" data-short="<%= item.short_name || "" %>" data-pid="<%= item.parent_id || "" %>" data-id="<%= item.tag_id || item.id %>" data-total="<%= item.child_count || 0 %>"><%= item.tag_name || item.name %></a></li>', "<% } %>", "<% } %>"].join(""),
                        d = Helper.template(c),
                        e = d({
                            data: b.data.data
                        }),
                        a(b.contentBox).html(e)
                },
                createPager: function (b) {
                    var c, d, e, f, g = 0, h = 0, i = this.config.step, j = b.total, k = this.currentIndex, l = Math.floor((i - 2) / 2), m = l + 3, n = l + 1, o = new Array(j + 1).join("t,").replace(/t/g, function () {
                        return ++g
                    }).split(",");
                    o.pop(),
                        f = o.length,
                        h = k,
                    f > i && (m > k ? (o.splice(i - 1, f - i, ""),
                        h = k) : k >= m && j - n > k ? (o.splice(k + l, f - k - n, ""),
                        o.splice(1, k - m + 1, ""),
                        h = Math.round(i / 2)) : (o.splice(1, f - i, ""),
                        h = i + k - j)),
                        c = ['<a href="javascript:;" class="pager_item prev">上一页</a>', "<% for(var i = 0, length = data.length; i < length; i++) { %>", "<% var item = data[i] %>", "<% if (/^\\d+$/.test(item)) { %>", '<a href="javascript:;" class="pager_item"><%= item %></a>', "<% } else { %>", '<span class="pager_dot">...</span>', "<% } %>", "<% } %>", '<a href="javascript:;" class="pager_item next">下一页</a>', '<span class="pager_total">共 <%= total %> 页</span>', "<span>去第</span>", '<input type="text" name="" value="" class="pagerInput" />', "<span>页</span>"].join(""),
                        d = Helper.template(c),
                        e = d({
                            data: o,
                            total: b.total
                        }),
                        a(b.target).html(e),
                        a(b.target).find("a.pager_item").eq(h).addClass("current").siblings(".pagerInput").val(this.currentIndex),
                        this.setClass({
                            total: b.total,
                            target: b.target
                        })
                },
                setClass: function (b) {
                    a(".prev", a(b.target))[this.currentIndex <= 1 ? "addClass" : "removeClass"]("disable"),
                        a(".next", a(b.target))[this.currentIndex >= b.total ? "addClass" : "removeClass"]("disable")
                },
                goTo: function (c) {
                    this.config.callback.call(this, c);
                    var d = this
                        , e = c.index
                        , f = a.extend(!0, {
                        limit: d.config.limit,
                        offset: (e - 1) * d.config.limit,
                        showVertical: d.config.showVertical
                    }, c.data || {});
                    0 > e || e > c.total || (b && b.abort(),
                        b = a.ajax({
                            url: c.url,
                            type: "GET",
                            data: f,
                            dataType: "json",
                            beforeSend: function () {
                                d.config.beforeSend.call(d, e)
                            },
                            error: function () {
                                d.config.error.call(d, e)
                            },
                            success: function (b) {
                                0 === b.error ? (d.createItem({
                                    data: b,
                                    contentBox: c.contentBox
                                }),
                                    d.currentIndex = e,
                                    c.total > 1 ? d.createPager({
                                        total: c.total,
                                        target: c.target
                                    }) : a(c.target).html(""),
                                    d.config.success.call(d, b, e, c)) : alert(c.data.msg)
                            }
                        }))
                },
                bindEvent: function () {
                    var b = this;
                    a(this.config.warp).on("click", function (c) {
                        var d, e, f, g = a(c.target), h = g.closest(".tag_item"), i = "", j = {}, k = 0;
                        if (g.hasClass("tag_trigger")) {
                            switch (d = h.next(".tag_item").find(".tag_pager"),
                                e = h.next(".tag_item").find(".tag_control"),
                                k = 1,
                                f = parseInt(g.data("total"), 10),
                                i = h.next(".tag_item").data("url"),
                                String(h.data("index"))) {
                                case "0":
                                    j = {
                                        short_name: g.data("short"),
                                        relate: b.config.relate,
                                        column_id: g.data("id")
                                    };
                                    break;
                                case "1":
                                    j = {
                                        tagId: g.data("id")
                                    }
                            }
                            d.data("id", g.data("id")).data("short", g.data("short")).data("total", g.data("total"))
                        }
                        if (g.hasClass("pager_item")) {
                            if (d = h.find(".tag_pager"),
                                    e = h.find(".tag_control"),
                                    f = parseInt(d.data("total"), 10),
                                    i = h.data("url"),
                                g.hasClass("disable") || g.hasClass("current"))
                                return;
                            switch (k = g.hasClass("prev") ? --b.currentIndex : g.hasClass("next") ? ++b.currentIndex : parseInt(g.text(), 10),
                                String(h.data("index"))) {
                                case "1":
                                    j = {
                                        short_name: d.data("short"),
                                        relate: b.config.relate,
                                        column_id: d.data("id")
                                    };
                                    break;
                                case "2":
                                    j = {
                                        tagId: d.data("id")
                                    }
                            }
                        }
                        (g.hasClass("tag_trigger") || g.hasClass("pager_item")) && b.goTo({
                            url: i,
                            data: j,
                            index: k,
                            contentBox: e,
                            target: d,
                            total: Math.ceil(f / b.config.limit),
                            trigger: g
                        })
                    }).on("keyup", "input.pagerInput", function () {
                        var c = a(this);
                        if (this.value = this.value.replace(/^[0]|\D/g, ""),
                            13 == event.keyCode) {
                            var d = parseInt(this.value, 10)
                                , e = a(this).closest(".tag_item")
                                , f = e.find(".tag_pager")
                                , g = e.find(".tag_control")
                                , h = Math.ceil(parseInt(f.data("total"), 10) / b.config.limit)
                                , i = e.data("url");
                            switch (String(e.data("index"))) {
                                case "1":
                                    data = {
                                        short_name: f.data("short"),
                                        relate: b.config.relate,
                                        column_id: f.data("id")
                                    };
                                    break;
                                case "2":
                                    data = {
                                        tagId: f.data("id")
                                    }
                            }
                            if (1 > d || d > h)
                                return this.value = "",
                                    b.config.wrongPageCall.call(b, h, d),
                                    !1;
                            b.goTo({
                                url: i,
                                data: data,
                                index: d,
                                contentBox: g,
                                target: f,
                                total: h,
                                trigger: c
                            })
                        }
                    }),
                        a(this.config.warp).find("a.tag_trigger").eq(0).trigger("click")
                }
            }),
            c
    }),
    define("douyu/page/room/normal/mod/sign", ["douyu/com/sign"], function (a) {
        var b = {
            count: 0
        }
            , c = {}
            , d = {}
            , e = {};
        return c.down15 = function (c) {
            var d = parseInt(c.posid);
            return 15 === d || 18 === d ? (b.count++,
                a.helper.defview(c),
            2 === b.count && ($("[data-dysign=15]").removeClass("hide"),
                setTimeout(function () {
                    $("[data-dysign=15]").remove(),
                        $("[data-dysign=18]").removeClass("hide"),
                        setTimeout(function () {
                            $("[data-dysign=18]").remove()
                        }, 15e3)
                }, 15e3)),
                !0) : !1
        }
            ,
            d.roomTop = function (a) {
                if (a && 30009 == a.id) {
                    var b = $(a.el);
                    b[b.html() ? "removeClass" : "addClass"]("hide")
                }
            }
            ,
            d.roomVideoBottom = function (a) {
                if (a && 11 == a.id) {
                    var b = $(a.el);
                    b[b.html() ? "removeClass" : "addClass"]("hide")
                }
            }
            ,
            d.roomBottom = function (a) {
                if (a && 30008 == a.id) {
                    var b = $(a.el);
                    b[b.html() ? "removeClass" : "addClass"]("hide")
                }
            }
            ,
            e.room_15_18 = function () {
                var a = $("[data-dysign=15]").children().length > 0
                    , b = $("[data-dysign=18]").children().length > 0;
                a ? ($("[data-dysign=15]").removeClass("hide"),
                    setTimeout(function () {
                        $("[data-dysign=15]").remove(),
                        b && ($("[data-dysign=18]").removeClass("hide"),
                            setTimeout(function () {
                                $("[data-dysign=18]").remove()
                            }, 15e3))
                    }, 15e3)) : b && ($("[data-dysign=18]").removeClass("hide"),
                    setTimeout(function () {
                        $("[data-dysign=18]").remove()
                    }, 15e3))
            }
            ,
        {
            init: function () {
                a.aop("clean", "room-top", d.roomTop),
                    a.aop("clean", "room-video-bottom", d.roomVideoBottom),
                    a.aop("clean", "room-bottom", d.roomBottom),
                    a.aop("complete", e.room_15_18),
                    a.requestPage()
            }
        }
    }),
    define("douyu/page/room/normal/mod/center", ["jquery", "shark/observer", "shark/util/lang/1.0", "shark/util/cookie/1.0", "shark/util/flash/data/1.0", "shark/util/template/2.0", "douyu/context", "douyu/com/user", "douyu/page/room/base/api"], function (a, b, c, d, e, f, g, h, i) {
        var j = {
            usergroup: {},
            user_role: [],
            user_role_key: {
                visitor: 0,
                normal: 1,
                anchor: 2,
                room_admin: 3,
                super_admin: 4
            }
        }
            , k = {
            contSerLocTime: function (b) {
                var d = Math.round((new Date).getTime() / 1e3);
                if (Math.abs(b - d) > 600) {
                    var e = new Date(1e3 * b);
                    a.dialog({
                        icon: "warning",
                        lock: !0,
                        content: c.string.join("本机系统时间有误！", "错误的系统时间会导致flash播放器出现无限加载及其他不可预知的错误。<br>", "请校准本机系统时间后刷新页面。当前参考时间：", e.toLocaleString())
                    })
                }
            },
            initShowmore: function () {
                k.showmore = function () {
                    var b = function (b, c) {
                            a.ajax("/swf_api/get_more_video", {
                                type: "get",
                                dataType: "json",
                                data: {
                                    cate_id: g.get("room.cate_id")
                                },
                                success: b,
                                error: c || function () {
                                }
                            })
                        }
                        , d = function (b) {
                            if (b && b.room_list_info) {
                                var d, h, i, j, k, l, m = g.get("room.room_id");
                                j = b.room_list_info,
                                    k = {};
                                for (var n in j)
                                    n != m && (k[n] = j[n]);
                                j = k,
                                    k = {},
                                    l = 0;
                                for (var n in j) {
                                    if (l >= 8)
                                        break;
                                    k[n] = j[n],
                                        l++
                                }
                                d = c.string.join("{{each map as item}}", "<li>", '<a target="_blank" href="/{{item.room_id}}">', '<div class="pic">', '<img src="{{item.room_src}}">', "</div>", "<h3>{{item.name}}</h3>", "<p>", '<span class="icon2 fl">{{item.online}}</span>', '<span class="icon1 fl">{{item.nickname}}</span>', "</p>", "</a>", "</li>", "{{/each}}"),
                                    h = f.compile(d),
                                    i = h({
                                        map: k
                                    });
                                var o = a("#dialog-more-video")
                                    , p = o.find(".v-con ul")
                                    , q = o.find(".v-tit .close");
                                p.html(i),
                                    q.off().on("click", function () {
                                        var b = a("#dialog-more-video")
                                            , c = b.data("timer");
                                        b.hide(),
                                            clearTimeout(c)
                                    }),
                                    o.show(),
                                    e(1e3 * parseInt(16 * Math.random() + 10))
                            }
                        }
                        , e = function (b) {
                            var c, d = a("#dialog-more-video"), f = d.find(".v-con .info em");
                            return 0 >= b ? location.href = d.find(".v-con ul li a").eq(0).attr("href") || "/" : (f.text(b / 1e3),
                                c = setTimeout(function () {
                                    e(b - 1e3)
                                }, 1e3),
                                void d.data("timer", c))
                        }
                        ;
                    b(d)
                }
                    ,
                    b.on("mod.center.showmore", function () {
                        k.showmore()
                    })
            },
            initUserRole: function (c) {
                var d, e = [], f = h.check();
                d = function (a, b) {
                    for (var c = 0, d = a.length; d > c; c++)
                        if (b == a[c])
                            return !0;
                    return !1
                }
                    ,
                    f ? (e.push(j.user_role_key.normal),
                    g.get("sys.uid") == g.get("room.owner_uid") && e.push(j.user_role_key.anchor),
                    4 == c.roomgroup && e.push(j.user_role_key.room_admin),
                    5 == c.group && (g.set("sys.groupid", c.group),
                        e.push(j.user_role_key.super_admin))) : e.push(j.user_role_key.visitor),
                    k.userrole = function (a) {
                        for (var b = j.user_role, c = !1, d = 0, e = b.length; e > d; d++)
                            if (b[d] === a) {
                                c = !0;
                                break
                            }
                        c || j.user_role.push(a)
                    }
                    ,
                    j.user_role = e,
                    a.extend(j.user_role, {
                        isVistor: function () {
                            return d(this, j.user_role_key.visitor)
                        },
                        isNormal: function () {
                            return d(this, j.user_role_key.normal)
                        },
                        isAnchor: function () {
                            return d(this, j.user_role_key.anchor)
                        },
                        isRoomAdmin: function () {
                            return d(this, j.user_role_key.room_admin)
                        },
                        isSuperAdmin: function () {
                            return d(this, j.user_role_key.super_admin)
                        }
                    }),
                    b.on("mod.center.userrole.get", function () {
                        return j.user_role
                    }),
                    b.trigger("mod.center.userrole.ready", j.user_role)
            },
            initUsergroup: function () {
                k.usergroup = function () {
                    var b = [].slice.call(arguments)
                        , c = b.length;
                    if (1 === c)
                        return j.usergroup[b[0]];
                    if (2 === c) {
                        var d = b[0]
                            , e = b[1];
                        j.usergroup[d] = j.usergroup[d] || {},
                            a.extend(j.usergroup[d], e)
                    }
                }
                    ,
                    b.on("mod.center.usergroup.get", function (a) {
                        return k.usergroup(a)
                    }),
                    b.on("mod.center.usergroup.set", function (a, b) {
                        return k.usergroup(a, b)
                    })
            }
        };
        k.initShowmore(),
            k.initUsergroup(),
            b.on("mod.center.contserloctime", function (a) {
                k.contSerLocTime(a)
            }),
            i.reg("room_login_show", function () {
                var a = h.check();
                a || (i.exe("js_exitFullScreen"),
                    h.show())
            }),
            i.reg("room_dycookie_set", function (a, b, c) {
                d.set(a, b, c)
            }),
            i.reg("room_dycookie_get", function (a) {
                return d.get(a)
            }),
            i.reg("room_bus_login", function () {
                var a = "type@=loginreq/username@=" + (g.get("sys.username") || "") + "/password@=" + (d.get("auth_wl") || "") + "/roomid@=" + (g.get("room.room_id") || 0) + "/ltkid@=" + (d.get("ltkid") || "") + "/biz@=" + (d.get("biz") || "") + "/stk@=" + (d.get("stk") || "") + "/";
                i.exe("js_userlogin", a)
            }),
            i.reg("room_bus_login2", function (a) {
                var b = "type@=loginreq/username@=" + (g.get("sys.username") || "") + "/password@=" + (d.get("auth_wl") || "") + "/roomid@=" + (g.get("room.room_id") || 0) + "/ltkid@=" + (d.get("ltkid") || "") + "/biz@=" + (d.get("biz") || "") + "/stk@=" + (d.get("stk") || "") + "/";
                1 === a && i.exe("js_anotherlogin", b),
                0 === a && i.exe("js_userlogin", b)
            }),
            i.reg("room_data_login", function (a) {
                i.exe("js_rewardList"),
                    i.exe("js_newQueryTask"),
                    a = e.decode(a).too(),
                    g.set("room.user_best_cq", a.best_dlev),
                    k.initUserRole({
                        group: a.pg,
                        roomgroup: a.roomgroup
                    }),
                    k.usergroup(a.userid, {
                        pg: a.pg,
                        rg: a.roomgroup
                    }),
                    b.trigger("mod.video.showroomillega", {
                        flag: a.is_illegal,
                        data: {
                            startTime: 1e3 * a.ill_ts,
                            serverTime: 1e3 * a.now,
                            context: a.ill_ct
                        },
                        userrole: j.user_role
                    })
            }),
            i.reg("room_data_info", function (a) {
                b.trigger("mod.chat.gift.call", a),
                    b.trigger("mod.login.userinfo", a)
            }),
            i.reg("room_data_sererr", function (b) {
                var d;
                if (b = e.decode(b),
                        d = b.get("code"),
                    51 == d)
                    return a.dialog.tips_black("数据传输出错！");
                if (52 == d) {
                    var f = ""
                        , j = g.get("sys.uid") == g.get("room.owner_uid");
                    return f = j ? "您的房间已被关闭，详情请联系客服人员。" : "您观看的房间已被关闭，请选择其他直播进行观看哦！",
                        a.dialog({
                            icon: "warning",
                            title: "房间关闭提示",
                            content: '<p style="color:red">' + f + "</p>",
                            lock: !0,
                            init: function () {
                                var a = this
                                    , b = 8
                                    , d = function () {
                                        return a.title(b + "秒后关闭"),
                                            b ? void b-- : (a.close(),
                                                !1)
                                    }
                                    ;
                                c.interval(d, 1e3, !0)
                            },
                            ok: function () {
                                this.close()
                            },
                            close: function () {
                                location.href = j ? "/room/my" : "/"
                            }
                        })
                }
                return 53 == d ? a.dialog.tips_black("服务器繁忙！") : 54 == d ? a.dialog.tips_black("服务器维护中！") : 55 == d ? a.dialog.tips_black("用户满员！") : 56 == d ? (a.dialog.tips_black("您已被管理员做封号处理.您当前IP也被禁止登陆12小时！"),
                    a.post("/member/logout/ajax", function (a) {
                        try {
                            i.exe("js_userlogout")
                        } catch (b) {
                        }
                    }, "json"),
                    setTimeout(function () {
                        location.href = "/"
                    }, 3e3)) : 57 == d ? (a.dialog.tips_black("帐号被封禁！"),
                    setTimeout(function () {
                        location.href = "/"
                    }, 3e3)) : 58 == d ? a.dialog.tips_black("昵称密码错误！") : 59 == d ? a.dialog.tips_black("您的账号已在其他地方登录，请注意账号安全！") : 60 == d ? a.dialog.tips_black("聊天信息包含敏感词语！") : 203 == d ? a.dialog.tips_black("网络异常") : 252 == d ? (a.dialog.tips_black("您的登录已过期请重新登录！"),
                    setTimeout(function () {
                        h.show("login")
                    }, 3500)) : 287 == d ? a.dialog({
                    icon: "warning",
                    content: "服务器正在维护中，请重新刷新页面！",
                    okVal: "刷新",
                    ok: function () {
                        location.reload()
                    },
                    cancelVal: "确定",
                    cancel: function () {
                    }
                }) : void 0
            }),
            i.reg("room_data_sys", function (d) {
                var e = "系统广播: " + d;
                if (b.trigger("mod.chat.msg.add", e),
                    "全站禁言" === d) {
                    var f, g, h, i = 0;
                    g = function () {
                        return i >= 3 ? (a.dialog({
                            content: "服务器繁忙，请稍后再试.",
                            time: 3
                        }),
                            _destroy()) : (i++,
                            void a.ajax("/curl/smscp/chat_verify", {
                                type: "post",
                                dataType: "json",
                                success: function (b) {
                                    var c = b.result
                                        , d = b.error;
                                    return 0 === c ? (_destroy(),
                                        a.dialog({
                                            content: d,
                                            time: 3,
                                            okVal: "确定",
                                            ok: function () {
                                            },
                                            close: function () {
                                                location.reload()
                                            }
                                        })) : -1 === c || 101 === c || 102 === c || 103 === c || 105 === c ? (a.dialog({
                                        content: d,
                                        time: 3
                                    }),
                                        _destroy()) : void h()
                                }
                            }))
                    }
                        ,
                        h = function () {
                            setTimeout(request, 2e4)
                        }
                        ,
                        _destroy = function () {
                            f && f.close && f.close(),
                                f = null ,
                                i = 0
                        }
                        ,
                        f = a.dialog({
                            width: 640,
                            height: 170,
                            content: c.string.join("您最近的发言记录存在违规行为，发言权限已经被冻结。请使用当前账号绑定的手机号码<br/><br/>", "发送短信：danmu 至号码：+86 137 2032 1374  进行验证。发送完成后请点击我已发送"),
                            lock: !0,
                            okVal: "我已发送",
                            ok: function () {
                                return i > 0 ? void 0 : (g(),
                                    a(f.DOM.dialog).find(".aui_state_highlight").text("验证中..."),
                                    !1)
                            },
                            close: function () {
                                f = null
                            }
                        }),
                        a(f.DOM.dialog).find(".aui_icon").hide()
                }
            }),
            i.reg("room_bus_phock", function () {
                return h.check() ? void a.dialog.confirm("完成手机验证后才能进行弹幕发送", function () {
                    window.location.href = "/member/cp#phone"
                }) : h.show("login")
            }),
            i.reg("room_data_state", function (c) {
                if (c = e.decode(c).too(),
                    void 0 !== c.notify || void 0 !== c.rid) {
                    if (c.notify > 0 && c.rid == g.get("room.room_id")) {
                        var d = 2 == c.code ? "该主播涉嫌违规播放，本次直播已被管理员关闭" : "本次直播已经结束";
                        a.dialog.alert(d)
                    }
                    if (1 == c.code) {
                        var f = g.get("sys.uid")
                            , h = f == g.get("room.owner_uid")
                            , j = g.get("sys.groupid")
                            , l = k.usergroup(f)
                            , m = c.endtime - g.get("room.show_time");
                        !h && 5 > j && (!f || l.rg < 4) && m > 900 && (i.exe("js_exitFullScreen"),
                            b.trigger("mod.video.state.flashnorm"),
                            b.trigger("mod.center.showmore"))
                    }
                }
            }),
            i.reg("room_data_getdid", function (b) {
                if (b) {
                    var c;
                    b = e.decode(b).too(),
                        g.set("room.device_id", b.devid),
                        d.set("did", b.devid, 31536e3),
                        c = function (b) {
                            var c = b.room_info;
                            g.get("room.show_status"),
                            g.get("sys.uid") == g.get("room.owner_uid"),
                                !a(".live-group-buttons .btn-pushflow").hasClass("hide"),
                            void 0 !== c.unixtime && k.contSerLocTime(c.unixtime)
                        }
                        ,
                        a.ajax("/live_specific/get_room_show_info" + location.search, {
                            type: "get",
                            dataType: "json",
                            data: {
                                device: b.devid,
                                time: b.rt,
                                adv: b.adv,
                                roomid: g.get("room.room_id")
                            },
                            success: c
                        })
                }
            }),
            i.reg("room_data_brocast", function (c) {
                var d, f, g = a("#js-chat-notice");
                0 != g.length && (c = e.decode(c).too(),
                c && c.c && (f = function () {
                    var c = a("#js-chat-notice");
                    c.find("a").attr("href", "javascript:;").text(""),
                        c.addClass("hide"),
                        b.trigger("mod.chat.height.change")
                }
                    ,
                    d = g.find("a"),
                    d.text(c.c),
                    d.attr({
                        href: c.url ? c.url : "javascript:;"
                    }).css({
                        cursor: c.url ? "cursor" : "text"
                    }),
                    g.removeClass("hide"),
                    b.trigger("mod.chat.height.change"),
                    setTimeout(f, 2e4),
                    g.on("click", "a", function (a) {
                        "javascript:;" === this.href && a.preventDefault()
                    })))
            });
        var l = function (a) {
                for (var b = location.search.substr(1).split("&"), c = 0, d = b.length; d > c; c++) {
                    var e = b[c].split("=")
                        , f = e[0];
                    if (a == f)
                        return e[1]
                }
            }
            ;
        i.reg("room_data_flaerr", function (a) {
            if (4202 != a && 4203 != a && 4204 != a && 4208 != a || h.exit(),
                4205 == a || 4206 == a || 4207 == a) {
                var b = l("login_num") || 0;
                if (b - 0 > 3)
                    return;
                b++,
                    h.show("", "", function () {
                        var a = location.href;
                        -1 != a.indexOf("login_num") && (a = a.split("login_num")[0],
                            a = a.substring(0, a.length - 1)),
                            a += -1 != a.indexOf("&") ? "&login_num=" + b : -1 != a.indexOf("?") ? "&login_num=" + b : "?login_num=" + b,
                            a += "&t=" + (new Date).getTime(),
                            location.href = a
                    })
            }
        })
    }),
    define("douyu/page/room/normal/mod/layout", ["jquery", "shark/observer", "douyu/com/left"], function (a, b, c) {
        var d = {
            MIN_WIDTH: 1366,
            isLeftOpen: !0
        }
            , e = {}
            , f = {};
        return e.init = function () {
            e.$win = a(window),
                e.$con = a("#container"),
                e.$main = a("#mainbody"),
                e.$left = a("#left"),
                e.$mainLeft = a("#js-live-room-normal-left"),
                e.$mainRight = a("#js-live-room-normal-right"),
                e.$video = a("#js-room-video"),
                e.$actions = a("#js-stats-and-actions"),
                e.$rank = a("#js-fans-rank"),
                e.$chatCont = a("#js-chat-cont"),
                e.$chatNotice = a("#js-chat-notice"),
                e.$chatSpeak = a("#js-chat-speak"),
                e.$headline = e.$mainLeft.find(".headline"),
                e.$h1 = e.$headline.find("h1"),
                e.$tag = e.$headline.find(".head-room-tag"),
                e.$report = e.$headline.find(".feedback-report-button"),
                e.layout(),
                b.on("mod.video.state.change", function (a) {
                    a !== !0 && e.layout()
                }),
                b.on("mod.chat.height.change", function () {
                    e.$chatCont.css({
                        height: e.$video.height() + e.$actions.outerHeight(!0) - e.$rank.outerHeight(!0) - e.$chatNotice.outerHeight(!0) - e.$chatSpeak.outerHeight(!0)
                    }),
                        b.trigger("mod.chat.gift.layout")
                })
        }
            ,
            e.layout = function () {
                e.$win.width() <= d.MIN_WIDTH ? (e.$con.addClass("w1000").css({
                    width: d.MIN_WIDTH - 18
                }),
                    e.$main.css({
                        "padding-left": e.$left.width() + 26,
                        "padding-right": 0,
                        width: e.$con.width() - e.$left.width() - 26
                    }),
                    b.trigger("mod.layout.screen.change", "small")) : (e.$con.removeClass("w1000").css({
                    width: ""
                }),
                    d.isLeftOpen ? e.$main.css({
                        "padding-left": e.$left.width() + 26,
                        "padding-right": 75,
                        width: e.$con.width() - e.$left.width() - 105
                    }) : e.$main.css({
                        "padding-left": 170,
                        "padding-right": 170,
                        width: e.$con.width() - 340
                    }),
                    b.trigger("mod.layout.screen.change", "normal")),
                    e.$mainLeft.css({
                        width: e.$main.width() - e.$mainRight.outerWidth(!0)
                    }),
                    e.$headline.css({
                        "max-width": e.$mainLeft.width() - 300
                    }),
                    e.$h1.css({
                        "max-width": e.$mainLeft.width() - 450
                    });
                var a = e.$report.outerWidth(!0) || 0
                    , c = e.$tag.outerWidth(!0) || 0
                    , f = e.$mainLeft.width() - e.$h1.outerWidth(!0) - a - 360;
                c > f ? e.$tag.css({
                    "max-width": f
                }).addClass("ellipsis") : e.$tag.css({
                    "max-width": ""
                }).removeClass("ellipsis"),
                    b.trigger("mod.normal.achorinfo.layout"),
                    e.$video.css({
                        height: e.$video.width() / 16 * 9 + 42
                    }),
                    e.$chatCont.css({
                        height: e.$video.height() + e.$actions.outerHeight(!0) - e.$rank.outerHeight(!0) - e.$chatNotice.outerHeight(!0) - e.$chatSpeak.outerHeight(!0)
                    }),
                    b.trigger("mod.normal.recommand.layout"),
                    b.trigger("mod.normal.achorinfo.layout")
            }
            ,
            f.init = function () {
                e.$win.resize(function () {
                    e.layout()
                }),
                    c.onToggle(function (a) {
                        "open" === a ? d.isLeftOpen = !0 : d.isLeftOpen = !1,
                            e.layout()
                    })
            }
            ,
        {
            init: function () {
                e.init(),
                    f.init()
            }
        }
    }),
    define("douyu/page/room/normal/mod/menu", ["jquery", "shark/class", "shark/util/template/1.0", "shark/util/lang/1.0", "shark/observer", "shark/util/cookie/1.0", "douyu/page/room/normal/mod/room-point"], function (a, b, c, d, e, f, g) {
        var h, i = window.DYS, j = b({
            getDoms: function () {
                var b = a("#container")
                    , c = b.find(".live-group-buttons");
                this.doms = {
                    container: b,
                    liveGroupButtons: c,
                    superBox: c.find(".btn-super"),
                    btnPushflow: c.find(".btn-pushflow"),
                    btnLiveswitch: c.find(".btn-liveswitch"),
                    btnBroadcast: c.find(".btn-broadcast"),
                    sendAnchor: c.find("#js_remind_start"),
                    btnExtcode: c.find(".btn-extcode"),
                    liveBtn: c.find('[data-live-open="btn"]'),
                    tdcFrame: a("#js_tdc_frame"),
                    livecodeBut: a("#livecode-but"),
                    liveRemind: a(".live-remind"),
                    curVideo: a("#js-room-video"),
                    giftContent: a("#gift-content")
                }
            },
            init: function (b) {
                var c = this;
                this.loading = {
                    lock: !1,
                    dialog: null,
                    show: function (b) {
                        b || (b = "正在提交……"),
                        c.loading.dialog && c.loading.close(),
                            c.loading.dialog = a.dialog({
                                title: !1,
                                cancel: !1,
                                lock: c.loading.lock,
                                content: '<div class="infodrmation"><img src="' + $SYS.res_url + 'douyu/images/loading.gif?v=20160322" style="vertical-align: middle;" >&nbsp;' + b + "</div>"
                            })
                    },
                    close: function () {
                        c.loading.dialog && c.loading.dialog.close()
                    }
                },
                    this.ajax = {
                        password: "",
                        status: ""
                    },
                    this.userRole = b.role.join(),
                    this.isStartLive = 1 == $ROOM.show_status,
                    this.getDoms(),
                    this.liveCodeShowTpl(),
                    this.checkUserRole(),
                    this.addEvent()
            },
            checkUserRole: function () {
                var b = this
                    , c = this.doms;
                if (-1 != this.userRole.indexOf(4) && this.getSuperMenu(function () {
                        c.superBox.removeClass("hide"),
                            require.use(["douyu/page/room/normal/mod/super-menu"], function (a) {
                                a.init({
                                    content: c.superBox,
                                    role: b.userRole
                                })
                            })
                    }),
                    -1 != this.userRole.indexOf(2)) {
                    var d = a(".js_remind_fans").length > 0
                        , e = 1 === $ROOM.show_status;
                    c.btnLiveswitch.removeClass("hide"),
                        c.btnExtcode.removeClass("hide"),
                        c.btnBroadcast.removeClass("hide"),
                        c.curVideo.append(this.showSignRemindDialogTpl()),
                        this.doms.broadcast = a(".live-broadcast"),
                        this.doms.sendshadow = a(".sendshadow"),
                    d && e && this.return_showSignRemind({
                        notMoreRemindTime: 60,
                        startTime: 7,
                        endTime: 24
                    })
                }
                this.isStartLive && -1 != this.userRole.indexOf(2) && (c.btnPushflow.removeClass("hide"),
                    c.giftContent.remove()),
                -1 == this.userRole.indexOf(2) && -1 == this.userRole.indexOf(4) || (c.liveGroupButtons.removeClass("hide"),
                    c.container.addClass("options")),
                    g.init({
                        role: b.userRole
                    }),
                -1 != this.userRole.indexOf(2) && this.isStartLive && this.livePassShowTpl()
            },
            livePassShowTpl: function () {
                var b = this;
                a.ajax({
                    type: "GET",
                    url: "/room/my/getPlayerPassWord",
                    dataType: "json",
                    success: function (c) {
                        return 0 != c.error ? void a.dialog.tips_black("请求错误") : void (c.data && 2 != c.data.status && (b.ajax.password = c.data.msg,
                            b.renderPassBtn(c.data.status),
                            b.ajax.status = c.data.status))
                    },
                    error: function () {
                        a.dialog.tips_black("房间数据请求失败，请稍后重试")
                    }
                })
            },
            setState: function (a) {
                var b = this;
                a != b.ajax.status && e.trigger("mod.menu.renderPassBtn", a)
            },
            renderPassBtn: function (a) {
                var b = this
                    , e = d.string.join('<div class="btn-livepass fl">', "<% if(status==0) { %>", '<span>直播密码：<a class="css_pass" data-pass="set" id="js_setlivepass" title="用户观看视频需要输入密码才能观看">设置密码</a>', "</span>", "<% } %>", "<% if(status==1) { %>", '<span>直播密码：<a class="css_pass" data-pass="update" id="js_updatelivepass" title="用户观看视频需要输入密码才能观看">修改密码</a>', "</span>", "<% } %>", "</div>")
                    , f = c.compile(e)
                    , g = f({
                    status: a
                })
                    , h = b.doms.liveGroupButtons.find(".btn-livepass");
                h && h.length > 0 && h.remove(),
                    b.doms.liveGroupButtons.append(g),
                    b.ajax.status = a
            },
            openSetPassTpl: function () {
                var a = this
                    , b = d.string.join('<div class="editpass-content">', '<div class="wrap clearfix">', '<div class="pass-title" style="float:left;height: 32px;line-height: 32px;margin-right:5px;">密码：</div>', '<div class="inputbox" style="float:left;height: 32px;"><input type="password" placeholder="请输入1-8位纯数字密码"  value="<%= pass %>" style="padding:6px 5px;width: 188px;"/></div>', "</div>", '<div class="pass-tip clearfix" style="margin-top:26px;">', '<div class="tip-title" style="float:left;">提示：</div>', '<div class="spantext" style="float:left;">', "<p>用户输入正确的密码才能观看我的直播。</p>", "<p>若密码为空，将取消密码功能。</p>", "<p>直播开关关闭后，将取消密码功能。</p>", "</div>", "</div>", "</div>")
                    , e = c.compile(b)
                    , f = e({
                    pass: a.ajax.password
                });
                return f
            },
            editPass: function (b) {
                var c = this
                    , d = c.openSetPassTpl();
                b.title = "add" == b.type ? "设置密码" : "修改密码",
                    a.dialog({
                        title: b.title,
                        content: d,
                        okVal: "确定",
                        init: function () {
                        },
                        ok: function () {
                            var d = a(".editpass-content .inputbox input[type=password]").val();
                            if (b.con = d,
                                "" != d) {
                                var e = /^([0-9]{1,8})$/;
                                if (!e.test(d))
                                    return a.dialog.tips_black("密码必须为1-8位纯数字！"),
                                        !1;
                                if (c.ajax.password == d)
                                    return a.dialog.tips_black("密码必须和前一次密码不同！"),
                                        !1;
                                c.sendPassAjax(b)
                            } else
                                c.sendPassAjax(b)
                        },
                        cancelVal: "取消",
                        cancel: function () {
                        }
                    })
            },
            sendPassAjax: function (b) {
                i.submit({
                    point_id: i.point.page(13)
                });
                var c = this;
                c.loading.show(),
                    a.ajax({
                        type: "POST",
                        url: "/room/my/setPlayerPassword",
                        data: {
                            password: b.con
                        },
                        dataType: "json",
                        success: function (d) {
                            c.loading.close(),
                                0 == d.error ? (a.dialog.tips_black(d.msg.msg),
                                    c.ajax.password = b.con,
                                    c.setState(d.msg.status)) : a.dialog.alert("设置错误:<span style='color: red'>" + d.msg + "</span>")
                        }
                    })
            },
            getSuperMenu: function (b) {
                var c = this.doms;
                a.ajax({
                    url: "/room/my_admin/getShow",
                    type: "GET",
                    data: {
                        room_id: $ROOM.room_id,
                        isShow: 1
                    },
                    success: function (a) {
                        c.superBox.html(a),
                        b && b()
                    }
                })
            },
            addEvent: function () {
                var b = this.doms
                    , c = this;
                b.liveBtn.on("click", function (b) {
                    var d = b || window.event;
                    d.stopPropagation(),
                        d.preventDefault(),
                        c.startLive(a(this))
                }),
                    b.btnExtcode.find("a").on("click", function (b) {
                        var d = b || window.event;
                        d.stopPropagation(),
                            d.preventDefault(),
                            c.getExtCode(a(this))
                    }),
                    b.livecodeBut.on("click", function (a) {
                        var b = a || window.event;
                        b.stopPropagation(),
                            b.preventDefault(),
                            c.liveCodeShow()
                    }),
                    b.sendAnchor.on("click", function (a) {
                        var b = a || window.event;
                        b.stopPropagation(),
                            b.preventDefault(),
                            c.sendAnchorMsg()
                    }),
                    e.on("mod.menu.showLiveCodeTemplateAndInit", function (a) {
                        c.liveCodeShow()
                    }),
                b.liveRemind && (b.liveRemind.on("mouseenter", function () {
                    var b = a(this)
                        , c = b.find(".tip")
                        , d = b.find(".arrow-left");
                    c.html(b.attr("data-title")),
                        c.show(),
                        d.show()
                }),
                    b.liveRemind.on("mouseleave", function () {
                        a(this).find(".tip").hide(),
                            a(this).find(".arrow-left").hide()
                    })),
                    b.liveGroupButtons.on("click", "#js_updatelivepass", function () {
                        c.editPass({
                            type: "update"
                        })
                    }),
                    b.liveGroupButtons.on("click", "#js_setlivepass", function () {
                        c.editPass({
                            type: "add"
                        })
                    }),
                    e.on("mod.menu.renderPassBtn", function (a) {
                        c.renderPassBtn(a)
                    })
            },
            return_showSignRemind: function (b) {
                var c = this
                    , d = {
                    roomid: $ROOM.owner_uid,
                    notWarnTime: parseInt(e / 1e3)
                };
                if (f.get("notWarnTimeObj") && (d = JSON.parse(f.get("notWarnTimeObj")),
                    "[object Object]" == Object.prototype.toString.call(d) && d.roomid == $ROOM.owner_uid))
                    var e = d.notWarnTime;
                var g = new Date
                    , h = g.getHours()
                    , i = g.getMinutes()
                    , j = g.getSeconds()
                    , k = parseInt(g.getTime() / 1e3)
                    , l = 60 * h * 60 + 60 * i + j
                    , m = 60 * b.startTime * 60
                    , n = 60 * b.endTime * 60
                    , o = 24 * b.notMoreRemindTime * 60 * 60
                    , p = a(".js_remind_fans");
                l > m && n > l && (!e || k - e > o) && p.length && !p.hasClass("r_sendon") && c.showSignRemindDialog(g)
            },
            sendAnchorMsg: function (b, c) {
                var d = this;
                a.ajax({
                    type: "POST",
                    url: "/room/my/remind",
                    dataType: "json",
                    success: function (b) {
                        if (0 == b.error) {
                            a.dialog.tips_black("开播提醒发送成功"),
                                a("#js_remind_start").removeClass("r_send").addClass("r_sendon").html("已发送");
                            var c = new Date
                                , e = c.getFullYear()
                                , f = c.getMonth() + 1
                                , g = c.getDate();
                            return d.currentDaySetSignRemind = {
                                roomid: $ROOM.owner_uid,
                                year: e,
                                month: f,
                                day: g
                            },
                                void (window.location.href = "/" + $ROOM.room_id + "?_r=" + Math.random(1))
                        }
                        return void a.dialog.tips_black(b.msg)
                    },
                    error: function () {
                        a.dialog.tips_black("请求失败，请稍后重试")
                    }
                })
            },
            showSignRemindDialogTpl: function () {
                var a = this.doms.curVideo
                    , b = '<div class="sendshadow" style="width : ' + a.width() + "px;height:" + a.height() + 'px"></div>'
                    , c = '<div class="live-broadcast js_remind_fans"><div class="close lead-close"></div><p><a href="#" class="r-btn send">发送</a><a href="#" class="r-btn-no nomoreRemind">不再提示</a>   </p> </div>';
                return c + b
            },
            showSignRemindDialog: function (b) {
                var c = this
                    , d = this.doms;
                d.broadcast.show(),
                    d.sendshadow.show(),
                    a(".live-broadcast .close").bind("click", function (a) {
                        var e = a || window.event;
                        e.stopPropagation(),
                            e.preventDefault(),
                            d.broadcast.hide(),
                            d.sendshadow.hide(),
                            c.SignRemindDialogAction(b, 0)
                    }),
                    a(".live-broadcast .send").bind("click", function (a) {
                        var d = a || window.event;
                        d.stopPropagation(),
                            d.preventDefault(),
                            c.SignRemindDialogAction(b, 1)
                    }),
                    a(".live-broadcast .nomoreRemind").bind("click", function (a) {
                        var e = a || window.event;
                        e.stopPropagation(),
                            e.preventDefault(),
                            d.broadcast.hide(),
                            d.sendshadow.hide(),
                            c.SignRemindDialogAction(b, 2)
                    })
            },
            SignRemindDialogAction: function (b, c) {
                var d = this;
                if (2 == c) {
                    var e = b.getTime()
                        , g = {
                        roomid: $ROOM.owner_uid,
                        notWarnTime: parseInt(e / 1e3)
                    };
                    f.set("notWarnTimeObj", JSON.stringify(g), 5184e3)
                } else if (1 == c)
                    a.ajax({
                        type: "POST",
                        url: "/room/my/remind",
                        dataType: "json",
                        success: function (b) {
                            return 0 == b.error ? (a.dialog.tips_black("开播提醒发送成功"),
                                a("#js_remind_start").removeClass("r_send").addClass("r_sendon").html("已发送"),
                                d.doms.broadcast.show(),
                                d.doms.sendshadow.show(),
                                void (window.location.href = "/" + $ROOM.room_id + "?_r=" + Math.random(1))) : void a.dialog.tips_black(b.msg)
                        },
                        error: function () {
                            a.dialog.tips_black("请求失败，请稍后重试")
                        }
                    });
                else if (0 == c)
                    return
            },
            liveCodeShowTpl: function () {
                var b = '<div id="live_code" style="display:none"><div class="live_div"><span class="rtmp_title">rtmp地址:</span><input type="text" readonly class="rtmp_value" value="" id="rtmp_url"><a class="primary_button01" href="javascript:;" id="copy_rtmp_url">复制</a></div><div class="live_div"><span class="rtmp_title">直播码:</span><textarea type="text" readonly class="rtmp_value" id="rtmp_val" style="height:54px;"></textarea><a class="primary_button01"  href="javascript:;" id="copy_rtmp_val">复制</a></div><div class="live_div"><p style="width: 292px; margin-left: 51px;"><strong>注：</strong><br>1、每次点击获取推流码都会重新生成直播码，每个直播码的有效期为5分钟。<br>2、只有切换推流线路才会导致rtmp地址发生变化。</p></div></div>';
                a("body").append(b)
            },
            liveCodeShow: function () {
                var b = a.dialog.tips_black("正在加载直播信息，请稍后……", 15);
                a("#rtmp_url").val(""),
                    a("#rtmp_val").val(""),
                    a.ajax({
                        type: "POST",
                        url: "/specific/get_live_code",
                        data: {
                            room_id: $ROOM.room_id
                        },
                        dataType: "json",
                        success: function (c) {
                            b.close(),
                                a("#rtmp_url").val(c.rtmp_send.rtmp_url),
                                a("#rtmp_val").val(c.rtmp_send.rtmp_val),
                                a.dialog({
                                    content: document.getElementById("live_code"),
                                    id: "live_tips",
                                    title: "直播信息",
                                    cancelVal: "关闭",
                                    cancel: !0,
                                    lock: !0,
                                    padding: "10px 25px",
                                    init: function () {
                                        a("#rtmp_url").val(c.rtmp_send.rtmp_url),
                                            a("#rtmp_val").val(c.rtmp_send.rtmp_val),
                                            a("#copy_rtmp_url").zclip({
                                                path: "/common/images/ZeroClipboard.swf",
                                                copy: a("#rtmp_url").val(),
                                                afterCopy: function () {
                                                    a.dialog.tips_black("已成功复制rtmp地址", 1.5)
                                                }
                                            }),
                                            a("#copy_rtmp_val").zclip({
                                                path: "/common/images/ZeroClipboard.swf",
                                                copy: a("#rtmp_val").val(),
                                                afterCopy: function () {
                                                    a.dialog.tips_black("已成功复制直播码", 1.5)
                                                }
                                            })
                                    }
                                })
                        }
                    })
            },
            getExtCode: function (b) {
                var c = this;
                a("#js_tdc_frame").length <= 0 ? a.get("/Qrcodeprom/get_list", function (b) {
                    a("body").append(b),
                        c.reg_event()
                }) : a("#js_tdc_frame").show()
            },
            reg_event: function () {
                a("#js_tdc_frame .task_close").click(function () {
                    a("#js_tdc_frame").hide()
                });
                var b = 5;
                a("#js_tdc_frame div.task_box table tbody").on("click", "a", function () {
                    if (a(this).hasClass("exp_btn")) {
                        var c = a(this).data("expand");
                        if (null == c || 0 == c) {
                            var d = a(this).parents("div.task_box").find("div.task_matter");
                            d.removeClass("task_matter").addClass("task_tit"),
                                d.find("a").data("expand", 0).html("[展开]"),
                                a(this).parent("div").removeClass("task_tit").addClass("task_matter"),
                                a(this).html("[收起]"),
                                a(this).data("expand", 1),
                                a(this).parent().parent().css({
                                    "z-index": ++b
                                })
                        } else
                            a(this).parent("div").removeClass("task_matter").addClass("task_tit"),
                                a(this).data("expand", 0).html("[展开]")
                    }
                })
            },
            close_live_room: function () {
                var b = location.href.split("?")[0] + "?" + (new Date).getTime();
                a.dialog({
                    content: '直播已经关闭!<br /><span style=" display:block; width : 260px; color:red;font-size: 10px;font-weight:700;">请再次确认您已经关闭了OBS等推流软件！如推流软件没有关闭，仍然可在自己的直播间看到画面。</span>',
                    okVal: "确定",
                    ok: function () {
                        location.href = b
                    },
                    close: function () {
                        location.href = b
                    }
                })
            },
            startLive: function (b) {
                var c = this;
                b.hasClass("b-on") ? a.dialog({
                    content: '您确定要关闭直播吗？<br /><span style="color:red;font-size: 10px;font-weight:700;">请先关闭OBS等推流软件再关闭直播</span>',
                    icon: "question",
                    okVal: "确定",
                    ok: function () {
                        a.ajax({
                            url: "/room/my/close_show",
                            type: "POST",
                            dataType: "json",
                            data: {
                                ajax: 1
                            },
                            success: function (a) {
                                a.error - 0 === 0 ? c.close_live_room() : alert(a.msg)
                            }
                        })
                    },
                    cancelVal: "取消",
                    cancel: function () {
                    }
                }) : a.getJSON("/member/cp/get_phone_status", function (b) {
                    return -1 == b.result ? void a.dialog.alert("您还没有验证手机号，不能开启直播") : 2 == b.result ? (1 == b.error.ident_status && (a("#js_ident_name").html("正在审核中，请审核通过后再来开播……"),
                        a("#js_ident_button").html("确定")),
                        void a("#js_phone_div").show()) : void c.js_live_room()
                })
            },
            js_live_room: function () {
                var b = this;
                b.defaut_live_room(),
                    a("#inter_tags").hide(),
                    a("#js_phone_div").hide()
            },
            defaut_live_room: function () {
                var b = this
                    , c = a("#js_switch_live");
                return 1 == c.data("doing") ? !1 : (c.data("doing", 1),
                    b.loading.lock = !0,
                    b.loading.show("正在提交，请勿刷新页面……"),
                    void a.getJSON("/room/my/first_show", function (d) {
                        b.loading.close(),
                            c.data("doing", 0);
                        var e = "warning";
                        if (0 == d.error)
                            c.addClass("switch_on"),
                                e = "succeed";
                        else {
                            if (3 == d.error)
                                return void a.dialog.alert("异常关闭<br />原因：<b>" + d.msg.reason + "</b><br />剩余限时：<span style='color: red'>" + d.msg.open_time + "</span>");
                            e = "warning"
                        }
                        a.dialog({
                            icon: e,
                            content: d.msg,
                            lock: !0,
                            okVal: "确定",
                            ok: function () {
                                return "succeed" == e ? window.location.href = "/" + $ROOM.room_id + "?_r=" + Math.random(1) : 9 == d.error ? window.location.href = "/member#mod_email" : 10 == d.error ? window.location.href = "http://mail.qq.com" : 1 == d.error && (window.location.href = "/room/my"),
                                    !0
                            }
                        })
                    }))
            }
        });
        e.on("mod.center.userrole.ready", function (a) {
            h || (h = new j({
                role: a
            }))
        })
    }),
    define("douyu/page/room/normal/mod/title", ["jquery", "shark/class", "shark/observer", "shark/util/flash/data/1.0", "douyu/page/room/base/api", "douyu/com/user", "shark/util/cookie/1.0"], function (a, b, c, d, e, f, g) {
        var h = b({
            getDoms: function () {
                var b = a("#anchor-info");
                this.doms = {
                    anchorInfoContent: b,
                    fansNum: b.find('[data-anchor-info="nic"]'),
                    followBtn: b.find('[data-anchor-info="follow"]'),
                    followedBtn: b.find('[data-anchor-info="followed"]'),
                    weightBox: b.find('[data-anchor-info="weighttit"]'),
                    olUmBox: b.find('[data-anchor-info="ol-num"]'),
                    feedBackReportButton: b.find("#feedback-report-button"),
                    tips: b.find('[data-tip-title="tip"]'),
                    feedbackBtn: b.find(".feedback-report-button")
                }
            },
            init: function () {
                var a = this;
                this.getDoms(),
                    this.is_follow_loading = !1,
                    this.addEvent(),
                    this.getFlashData();
                var b = this.doms.anchorInfoContent.find(".relate-text").width()
                    , d = this.doms.anchorInfoContent.find(".anchor-pic").width()
                    , e = this.doms.anchorInfoContent.find(".sq-wrap").width();
                this.ffWidth = {
                    anchor_tag_w: b,
                    anchor_pic_w: d,
                    share_focus_w: e
                },
                    c.on("mod.normal.achorinfo.layout", function () {
                        a.setPos()
                    }),
                $ROOM.show_status && this.doms.feedbackBtn.show()
            },
            addEvent: function () {
                var b = this
                    , d = this.doms;
                d.followBtn.on("click", function () {
                    b.followRoom()
                }),
                    d.followedBtn.on("click", function () {
                        b.unFollowRoom()
                    }),
                    d.feedBackReportButton.on("click", function () {
                        var a = f.check();
                        return a ? void 0 : (f.show("login"),
                            !1)
                    }),
                    d.tips.hover(function () {
                        a(this).find(".tip").show()
                    }, function () {
                        a(this).find(".tip").hide()
                    }),
                    c.on("mod.titleinfo.change", function (a) {
                        a.weight && d.weightBox.html(b.weight_conversion(parseInt(a.weight)))
                    })
            },
            weight_conversion: function (a) {
                return 1e3 > a ? a + "g" : 1e6 > a ? a / 1e3 + "kg" : Math.round(a / 1e4) / 100 + "t"
            },
            followRoom: function () {
                var b = this
                    , c = this.doms;
                if (!isNaN(parseInt(c.fansNum.html().replace(/,/g, ""), 10)) && !b.is_follow_loading) {
                    if (!f.check())
                        return f.show("login"),
                            b.is_follow_loading = !1,
                            !1;
                    if ($SYS.uid == $ROOM.owner_uid)
                        return a.dialog.tips_black("不能关注自己的房间", 2),
                            !1;
                    b.is_follow_loading = !0,
                        a.ajax("/room/follow/add/" + $ROOM.room_id, {
                            type: "post",
                            data: {
                                room_id: $ROOM.room_id
                            },
                            success: function (d) {
                                if (b.is_follow_loading = !1,
                                    "ok" == d) {
                                    c.followBtn.addClass("hide"),
                                        c.followedBtn.removeClass("hide");
                                    var e;
                                    a.dialog({
                                        icon: "succeed",
                                        content: "成功加入您的关注列表",
                                        lock: !0,
                                        init: function () {
                                            var a = this
                                                , b = 3
                                                , c = function () {
                                                    a.title(b + "秒后关闭"),
                                                    !b && a.close(),
                                                        b--
                                                }
                                                ;
                                            e = setInterval(c, 1e3),
                                                c()
                                        },
                                        close: function () {
                                            clearInterval(e)
                                        }
                                    }).show();
                                    var f = c.fansNum.length ? parseInt(c.fansNum.html().replace(/,/g, "")) : 0;
                                    c.fansNum.html(f + 1)
                                } else
                                    "" != d ? a.dialog.alert(d) : a.dialog.alert("主播不能关注自己的房间")
                            }
                        })
                }
            },
            shareAnchorTpl: function () {
                var b = a(".share-lead");
                if (b.length)
                    b.show();
                else {
                    var c = '<div class="share-lead"><div class="lead-close"></div></div>';
                    this.doms.anchorInfoContent.append(c);
                    var b = a(".share-lead");
                    b.find(".lead-close").on("click", function () {
                        g.set("share-lead", "1", 86400),
                            a(".share-lead").hide()
                    })
                }
            },
            followAnchorTpl: function () {
                var b = a(".focus-lead");
                if (b.length)
                    b.show();
                else {
                    var c = '<div class="focus-lead"><div class="lead-close"></div></div>';
                    this.doms.anchorInfoContent.append(c),
                        a(".focus-lead .lead-close").on("click", function () {
                            g.set("followAnchor", "1", 86400),
                                a(".focus-lead").hide()
                        })
                }
            },
            giftAnchorTpl: function () {
                var b = '<div class="giftbox"><div class="giftbox-close"></div></div>';
                a("#gift-content").append(b),
                    a(".giftbox .giftbox-close").on("click", function () {
                        g.set("giftAnchor", "1", 86400),
                            a(".giftbox").hide()
                    })
            },
            unFollowRoom: function () {
                var b = this
                    , c = this.doms;
                return isNaN(parseInt(c.fansNum.html().replace(/,/g, ""), 10)) || b.is_rm_follow_loading ? void 0 : $SYS.uid ? void a.dialog({
                    content: "您是否取消关注？",
                    icon: "question",
                    okVal: "确定",
                    ok: function () {
                        b.is_rm_follow_loading = !0,
                            a.ajax("/room/follow/cancel/" + $ROOM.room_id, {
                                data: {
                                    room_id: $ROOM.room_id
                                },
                                success: function (d) {
                                    if (b.is_rm_follow_loading = !1,
                                        "ok" == d) {
                                        a.dialog.tips_black("已取消关注", 2),
                                            c.followBtn.removeClass("hide"),
                                            c.followedBtn.addClass("hide");
                                        var e = c.fansNum.length ? parseInt(c.fansNum.html().replace(/,/g, "")) : 0;
                                        c.fansNum.html(e - 1)
                                    } else
                                        "" != d ? a.dialog.alert(d) : a.dialog.alert("服务器错误！")
                                },
                                error: function () {
                                    b.is_rm_follow_loading = !1
                                }
                            })
                    },
                    cancelVal: "取消",
                    lock: !0,
                    cancel: function () {
                    }
                }) : (f.show("login"),
                    !1)
            },
            renderUserInfo: function (a) {
                var b = this
                    , e = this.doms;
                a = d.decode(a).too();
                var f = a.fans_count
                    , h = a.weight
                    , i = parseInt(a.fl)
                    , j = a.at;
                j && (j = d.isArray(j) ? d.decode(j) : [{
                    value: j
                }],
                    b.renderFishShow(j)),
                    i ? (e.followBtn.addClass("hide"),
                        e.followedBtn.removeClass("hide")) : (e.followBtn.removeClass("hide"),
                        e.followedBtn.addClass("hide")),
                    f = f > 0 ? f : 0,
                    e.fansNum.html(f),
                    e.weightBox.html(b.weight_conversion(parseInt(h))),
                g.get("followAnchor") || parseInt(f) < 5e4 && !i && $ROOM.owner_uid != $SYS.uid && setTimeout(function () {
                    b.followAnchorTpl()
                }, 3e5),
                g.get("giftAnchor") || setTimeout(function () {
                    c.trigger("mod.video.state.flashnorm"),
                        b.giftAnchorTpl()
                }, 6e5),
                    b.setPos()
            },
            setPos: function () {
                var b, c, d, e, f = this;
                b = f.doms.anchorInfoContent.width(),
                    c = f.doms.anchorInfoContent.find(".fishshow_con").width(),
                    e = f.doms.anchorInfoContent.find(".r-else-tag").find("dd"),
                    d = b - f.ffWidth.anchor_pic_w - f.ffWidth.share_focus_w - c - 20,
                    d < f.ffWidth.anchor_tag_w ? e.each(function (b, c) {
                        b > 2 && a(c).hide()
                    }) : e.each(function (b, c) {
                        a(c).show()
                    })
            },
            getFlashData: function () {
                var a = this
                    , b = this.doms;
                c.on("mod.login.userinfo", function (b) {
                    a.renderUserInfo(b)
                }),
                    e.reg("room_data_userc", function (a) {
                        b.olUmBox.html(parseInt(a))
                    })
            },
            renderFishShow: function (b) {
                for (var c, e = this, f = [], g = 0, h = b.length; h > g; g++)
                    c = d.decode(b[g].value),
                        f.push(c);
                for (var g = 0, h = f.length; h > g; g++)
                    c = f[g],
                        f[g] = d.too(c);
                a(".tag-fs-con .fishshow_con").remove(),
                    a(".tag-fs-con").append('<div class="fishshow_con"></div>');
                for (var g = 0; g < f.length; g++)
                    e.renderFishShowIcon(f[g])
            },
            getFishShowIcon: function (a) {
                var b = $ROOM.giftStarSetting
                    , c = b[a];
                return c ? c : null
            },
            renderFishShowIcon: function (b) {
                var c = this;
                if (b && b.gt && b.gn) {
                    var d = b.gt
                        , e = c.getFishShowIcon(d);
                    e && a(".fishshow_con").append('<img class="week_gift_img" title="鱼秀专区周星奖励，获得最多的' + b.gn + '。图标有效期7天。"  src="' + e.medal_icon + '" >');
                }
            }
        })
            , i = {
            init: function (a) {
                return new h(a)
            }
        };
        return i
    }),
    define("douyu/page/room/normal/mod/gift", ["jquery", "shark/class", "shark/observer", "shark/util/cookie/1.0", "shark/util/flash/data/1.0", "douyu/context", "douyu/com/vcode9", "douyu/page/room/base/api", "douyu/com/user"], function (a, b, c, d, e, f, g, h, i) {
        var j = {
            is_sending: !1,
            auto_send: !0,
            CGIFT: {},
            ERR: {
                207: "参数错误",
                218: "请先绑定手机！",
                284: "请稍后尝试。。",
                357: "没有找到礼物",
                291: "请稍后尝试。"
            }
        }
            , k = null
            , l = b({
            getDoms: function () {
                var b = a("#gift-content");
                this.doms = {
                    giftContent: b,
                    currentList: b.find("[data-point-2]"),
                    chouqinBtn: b.find("#room-cq-trigger")
                }
            },
            init: function () {
                return this.getDoms(),
                    f.get("sys.uid") == f.get("room.owner_uid") ? void this.doms.giftContent.hide() : void this.addEvent()
            },
            checkUser: function () {
                var a = i.check();
                return a ? !0 : (i.show("login"),
                    !1)
            },
            addEvent: function () {
                var b = this
                    , d = this.doms;
                d.currentList.on("mouseenter", function (b) {
                    a(this).find(".lw-item-hover").removeClass("hide")
                }),
                    d.currentList.on("mouseleave", function (b) {
                        a(this).find(".lw-item-hover").addClass("hide")
                    }),
                    d.chouqinBtn.on("click", function () {
                        return b.checkUser() ? (c.trigger("mod.gift.openCQWindowAndInit", {}),
                            !1) : !1
                    }),
                    d.currentList.on("click", function (c) {
                        var d, e = a(this);
                        if (b.checkUser()) {
                            if ($SYS.uid == $ROOM.owner_uid)
                                return a.dialog.tips_black("不能给自己赠送礼物");
                            d = {
                                gid: e.attr("data-giftid"),
                                send: e.attr("data-send"),
                                exp: e.attr("data-exp"),
                                num: 1,
                                sid: $SYS.uid,
                                did: $ROOM.owner_uid,
                                rid: $ROOM.room_id
                            },
                                j.CGIFT.current = d.gid,
                                b.send(d)
                        }
                    })
            },
            send: function (a) {
                a = a || {},
                1 == a.send && this.sendYW(a),
                2 == a.send && this.sendYC(a)
            },
            sendYW: function (a) {
                if (j.auto_send && !j.is_sending) {
                    var b = e.encode([{
                        name: "type",
                        value: "dn_s_gf"
                    }, {
                        name: "gfid",
                        value: a.gid
                    }, {
                        name: "num",
                        value: a.num
                    }]);
                    j.CGIFT[a.gid] = {
                        type: "dn_s_gf",
                        gid: a.gid,
                        sid: a.sid,
                        did: a.did,
                        rid: a.rid,
                        exp: a.exp,
                        dy: f.get("room.device_id"),
                        num: a.num
                    },
                        j.is_sending = !0,
                        h.exe("js_giveGift", b)
                }
            },
            sendYC: function (b) {
                if (j.auto_send && !j.is_sending) {
                    var e, g, h, i = this;
                    g = function () {
                        a.dialog.tips_black("赠送礼物失败！", 1.5)
                    }
                        ,
                        e = function (d) {
                            j.is_sending = !1;
                            var e = d.result;
                            0 == e ? (this.fxPopGX({
                                gid: b.gid,
                                num: $ROOM.giftBatterConfig[b.gid].pc / 10
                            }),
                                c.trigger("mod.userinfo.change", {
                                    current: {
                                        gold: d.data.sb / 100
                                    }
                                })) : 3 == e ? this.remindYCLow() : 363 == e ? this.sendVerify(j.CGIFT, function () {
                                i.sendYC(j.CGIFT[j.CGIFT.current])
                            }) : a.dialog.tips_black(d.msg, 1.5)
                        }
                        ,
                        h = {
                            gid: b.gid,
                            num: b.num,
                            sid: b.sid,
                            did: b.did,
                            rid: b.rid,
                            exp: b.exp,
                            dy: f.get("room.device_id")
                        },
                        h[$SYS.tn] = d.get($SYS.tvk) || "",
                        j.CGIFT[b.gid] = h,
                        j.is_sending = !0,
                        a.ajax("/member/gift/send", {
                            type: "post",
                            dataType: "json",
                            data: h,
                            success: a.proxy(e, this),
                            error: g
                        })
                }
            },
            sendVerify: function (b, c) {
                var d, e, f;
                f = b ? b[b.current] : {},
                    c = a.isFunction(c) ? c : function () {
                    }
                    ,
                    e = function (b) {
                        a.ajax("/member/gift/verify", {
                            type: "post",
                            dataType: "json",
                            data: {
                                dy: f.dy,
                                task_ca: b
                            },
                            error: function () {
                                DYS.submit({
                                    point_id: "5.11.2.0",
                                    ext: {
                                        s: "请求失败"
                                    }
                                }),
                                    d.destroy(),
                                    a.dialog.tips_black("赠送礼物失败！", 1.5)
                            },
                            success: function (b) {
                                var e = b.result;
                                0 == e ? (DYS.submit({
                                    point_id: "5.11.1.0"
                                }),
                                    d.destroy(),
                                    c()) : (DYS.submit({
                                    point_id: "5.11.2.0",
                                    ext: {
                                        s: b.msg
                                    }
                                }),
                                    d.refresh(),
                                    a.dialog.tips_black(b.msg, 1.5))
                            }
                        })
                    }
                    ,
                    d = g.create({
                        title: "请输入验证码",
                        sence: "task",
                        lock: !0,
                        onSelectOver: e
                    })
            },
            remindYWLow: function () {
                var b = this;
                b.isNoYWFloatHide || (b.isNoYWFloatHide = !0,
                    a.dialog({
                        title: "提示",
                        content: "<p>鱼丸不足！<br/>做任务可获取鱼丸哦~</p><i></i>",
                        okVal: "做任务",
                        lock: !0,
                        ok: function () {
                            c.trigger("mod.task.show")
                        },
                        skin: "gift-error",
                        cancelVal: "取消",
                        cancel: function () {
                            b.isNoYWFloatHide = !1
                        },
                        close: function () {
                            b.isNoYWFloatHide = !1
                        }
                    }))
            },
            remindYCLow: function () {
                a.dialog({
                    title: "提示",
                    content: "<p>赠送失败<br/>鱼翅不足，点击获取！</p><i></i>",
                    okVal: "充值",
                    skin: "gift-error",
                    lock: !0,
                    ok: function () {
                        try {
                            DYS.storage.save("_dypay_fp", 6)
                        } catch (a) {
                        }
                        window.open("/web_game/welcome/18")
                    },
                    cancelVal: "取消",
                    cancel: function () {
                    }
                })
            },
            fxPopGX: function (b) {
                var c, d, e, f = this.doms.currentList.filter("[data-giftid=" + b.gid + "]"), g = f.offset();
                c = a('<div class="gift-exp-pop-gx">贡献值 +' + b.num + "</div>"),
                    a("body").append(c),
                    d = g.top + f.height() - c.height(),
                    e = g.top - c.height(),
                    c.css({
                        top: d,
                        left: g.left - c.outerWidth(!0)
                    }).animate({
                        top: e
                    }, 1e3).fadeOut("slow", function () {
                        a(this).remove()
                    })
            }
        });
        c.on("mod.gift.yw.res", function (b) {
            k && (b = e.decode(b).too(),
            "dsgr" === b.type && (0 == b.r ? (k.fxPopGX({
                gid: b.gfid,
                num: .01 * b.ms
            }),
                c.trigger("mod.userinfo.update.yw", b.sb)) : 283 == b.r ? k.remindYWLow() : 363 == b.r ? k.sendVerify(j.CGIFT, function () {
                k.sendYW(j.CGIFT[j.CGIFT.current])
            }) : a.dialog.tips_black(j.ERR[b.r] || "未知错误：" + b.r, 1.5)))
        }),
            c.on("mod.gift.exp.up", function (a) {
                var b = j.CGIFT[a.gid];
                if (b && b.exp) {
                    var d = null;
                    a && (d = a.silver),
                        c.trigger("mod.userinfo.change", {
                            change: {
                                exp: b.exp,
                                silver: d,
                                type: "yuwan"
                            }
                        })
                }
            }),
            c.on("mod.gift.allowsend", function () {
                j.is_sending = !1
            }),
            c.on("mod.gift.auto.send.set", function (a) {
                j.auto_send = a
            });
        var m = {
            init: function (a) {
                return k = new l(a)
            }
        };
        return m
    }),
    define("douyu/page/room/normal/mod/userinfo", ["jquery", "shark/class", "shark/observer", "shark/util/flash/data/1.0", "douyu/page/room/base/api", "douyu/com/user", "douyu/context"], function (a, b, c, d, e, f, g) {
        var h = b({
            getDoms: function () {
                var b = a('[data-login-content="yes"]');
                this.doms = {
                    loginBox: b,
                    silverBox: b.find('[data-login-user="silver"]'),
                    goldBox: b.find('[data-login-user="gold"]'),
                    curExpBox: b.find('[data-login-user="exp"]'),
                    curExpBoxNum: b.find('[data-login-user="up-exp-num"]'),
                    curExpText: b.find('[data-login-user="exp-txt"]'),
                    expBarBtn: b.find('[data-exp-bar="btn"]'),
                    expBarTip: b.find('[data-exp-bar="box"]'),
                    headerHref: b.find("[data-login-user]"),
                    headerImg: b.find('[data-login-user="header-img"]'),
                    userName: b.find('[data-login-user="user-name"]'),
                    leaveImg: b.find('[data-login-user="level-img"]'),
                    skillIcon: b.find("[data-skill-icon]"),
                    chargeBtn: b.find(".getYc")
                }
            },
            init: function (b) {
                this.config = a.extend(!0, {}, {
                    highLevel: 60
                }, b),
                    this.getDoms(),
                    this.addEvent(),
                    this.checkLogin()
            },
            checkLogin: function () {
                var b = this
                    , d = this.doms
                    , e = f.check();
                e && (d.loginBox.removeClass("hide"),
                    d.headerImg.attr("src", c.fire("douyu.avatar.get", $SYS.uid, "middle")),
                    d.userName.html($SYS.nickname),
                    d.userName.attr("title", $SYS.nickname),
                    b.getFlashData(),
                    c.trigger("mod.room.diy.layout")),
                    a('[data-login-content="no"]')[e ? "addClass" : "removeClass"]("hide")
            },
            addEvent: function () {
                var b = this
                    , f = this.doms;
                f.skillIcon.on("mouseenter", function () {
                    var b = a(this).find(".sl-item-hover");
                    b.removeClass("hide")
                }),
                    f.skillIcon.on("mouseleave", function () {
                        var b = a(this).find(".sl-item-hover");
                        b.addClass("hide")
                    }),
                    f.expBarBtn.on("mouseenter", function () {
                        f.expBarTip.removeClass("hide")
                    }),
                    f.expBarBtn.on("mouseleave", function () {
                        f.expBarTip.addClass("hide")
                    }),
                    f.chargeBtn.on("mousedown", function () {
                        try {
                            DYS.storage.save("_dypay_fp", 2)
                        } catch (a) {
                        }
                    }),
                    c.on("mod.userinfo.change", function (a) {
                        if (a.current) {
                            var c = a.current;
                            void 0 !== c.silver && (b.silver = parseInt(c.silver),
                                f.silverBox.html(b.silver)),
                            void 0 !== c.gold && (b.gold = c.gold,
                                f.goldBox.html(b.gold))
                        }
                        if (a.change) {
                            var c = a.change;
                            if ("yuwan" == c.type && parseInt(c.silver) == b.silver)
                                return;
                            c.exp && (b.expUpN = c.exp,
                                b.userTotleExp += parseFloat(c.exp)),
                            c.silver && (b.silver = parseInt(b.silver) + parseInt(c.silver),
                                f.silverBox.html(b.silver)),
                            c.gold && (b.gold += parseInt(c.gold),
                                f.goldBox.html(b.gold))
                        }
                    }),
                    e.reg("room_data_ycchange", function (a) {
                        var c = d.decode(a)
                            , e = d.get(c, "b") / 100 + "";
                        e.indexOf(".") > -1 && (e = e.substring(0, e.indexOf(".") + 3)),
                            b.gold = parseFloat(e),
                            f.goldBox.html(b.gold)
                    }),
                    e.reg("room_data_expchange", function (a) {
                        d.decode(a).too(),
                            b.exprienceUpdate(a)
                    })
            },
            getFlashData: function () {
                var a = this;
                c.on("mod.login.userinfo", function (b) {
                    a.renderUserInfo(b)
                })
            },
            renderUserInfo: function (a) {
                var b = this
                    , e = this.doms
                    , f = d.decode(a);
                this.silver = d.get(f, "silver");
                var g = d.get(f, "gold") / 100 + "";
                g.indexOf(".") > -1 && (g = g.substring(0, g.indexOf(".") + 3)),
                    this.silver = parseFloat(this.silver),
                    this.gold = parseFloat(g),
                    e.silverBox.html(this.silver),
                    e.goldBox.html(this.gold),
                    b.exprienceUpdate(a),
                    c.trigger("mod.userinfo.userinfoready", {
                        msg: "用户信息初始化完成",
                        silver: b.silver,
                        gold: b.gold
                    })
            },
            getExpInfo: function (b) {
                var c = {};
                return a.each($ROOM.args.exp_level, function (a, d) {
                    return d.score = parseInt(a),
                        c.next = d,
                        b < parseInt(a) ? !1 : void (c.current = d)
                }),
                    c
            },
            exprienceUpdate: function (a) {
                var b = this.doms
                    , e = this
                    , f = d.decode(a);
                if (this.userId = d.get(f, "uid"),
                        this.userExp = d.get(f, "exp"),
                        this.userTotleExp = parseFloat(d.get(f, "exp")) / 100,
                        this.exp_json = this.getExpInfo(parseInt(this.userTotleExp, 10)),
                        this.currentLevel = parseInt(d.get(f, "level")),
                        this.nextUpExp = this.exp_json.next.score,
                        this.updateProgress(),
                    this.userLastExp && this.userExp - this.userLastExp >= 100) {
                    var g = (this.userExp - this.userLastExp) / 100;
                    this.ExpPopGX(g)
                }
                this.userLastExp = this.userExp,
                    b.leaveImg.attr("src", this.returnUlevelIcon(e.currentLevel)),
                    b.leaveImg.attr("title", "用户等级：" + (e.currentLevel < e.config.highLevel + 1 ? e.currentLevel : e.config.highLevel)),
                    this.unlockeSkill(),
                    this.userId ? $SYS.uid == this.userId && c.trigger("mod.chatrank.cqrankupdate", e.currentLevel) : c.trigger("mod.chatrank.cqrankupdate", e.currentLevel)
            },
            returnUlevelIcon: function (a) {
                var b = this;
                return g.get("sys.web_url") + "/app/douyu/res/page/room-normal/level/LV" + (a < b.config.highLevel + 1 ? a : b.config.highLevel) + (a >= 40 ? ".gif" : ".png") + "?" + Math.random()
            },
            updateProgress: function () {
                var a, b = this.doms, c = this.exp_json.current.score, d = (this.userTotleExp - c) / (this.nextUpExp - c) * 100;
                d += "";
                var e = d.indexOf(".");
                if (a = e > -1 ? "0" == d.substring(e + 1, e + 2) ? d.substr(0, e) : d.substr(0, e + 2) : d,
                    this.userTotleExp < this.nextUpExp) {
                    b.curExpBox.css({
                        width: a + "%"
                    }),
                        b.curExpText.text(a + "%");
                    var f = (this.nextUpExp - this.userTotleExp).toFixed(1).split(".");
                    0 === parseInt(f[1], 10) && (f = [f[0]]),
                        b.curExpBoxNum.html(f.join("."))
                } else
                    b.curExpBox.css({
                        width: "100%"
                    }),
                        b.curExpText.text("100%");
                return this.userTotleExp >= 34116628 ? void this.doms.curExpBoxNum.parent().html("您已经达到最高等级") : void 0
            },
            upLevel: function () {
                return this.userTotleExp >= 10036649 ? void this.doms.curExpBoxNum.parent().html("您已经达到最高等级") : void (this.userTotleExp >= this.nextUpExp && (this.currentLevel++,
                    this.exprienceUpdate()))
            },
            unlockeSkill: function () {
                for (var b = this, c = this.doms, d = c.skillIcon, e = 0, f = d.length; f > e; e++)
                    !function (c) {
                        var e = a(d[c]);
                        b.unlockeSkillList(e, c)
                    }(e)
            },
            unlockeSkillList: function (b, c) {
                for (var d = this, e = b.find("[data-unlocak-list] li"), f = b.find(".locked"), g = 0, h = e.length, i = 0; h > i; i++) {
                    var j = a(e[i])
                        , k = j.attr("data-unlocak-level");
                    if (parseInt(k) <= parseInt(d.currentLevel) && (g++,
                            j.addClass("unlocked-l"),
                            e.eq(i).removeClass("hide")),
                        g && e.eq(i + 1).length) {
                        e.eq(i + 1).removeClass("hide");
                        var l = e.eq(i + 1).attr("data-unlocak-level");
                        if (l > d.currentLevel)
                            break
                    }
                }
                0 === g ? e.eq(0).removeClass("hide") : f.html("已解锁" + g + "/" + h),
                g && b.addClass("skill-0" + (c + 1))
            },
            ExpPopGX: function (b) {
                var c, d, e, f = this.doms.curExpText.offset();
                c = a('<div class="exp-pop-gx">经验值 +' + b + "</div>"),
                    a("body").append(c),
                    d = f.top + this.doms.curExpText.height() - c.height(),
                    e = f.top - c.height(),
                    c.css({
                        top: d,
                        left: f.left - c.outerWidth(!0),
                        marginLeft: "112px"
                    }).animate({
                        top: e
                    }, 1e3).fadeOut("slow", function () {
                        a(this).remove()
                    })
            }
        })
            , i = {
            init: function (a) {
                return new h(a)
            }
        };
        return i
    }),
    define("douyu/page/room/normal/mod/task", ["jquery", "shark/class", "shark/observer", "shark/util/cookie/1.0", "douyu/context", "douyu/com/user", "douyu/com/vcode9", "douyu/page/room/base/api", "shark/util/flash/1.0/data"], function (a, b, c, d, e, f, g, h, i) {
        var j, k, l, m = window.DYS, n = {
            task: {
                cookie: "showtasktip",
                state: {
                    open: "open",
                    close: "close"
                }
            }
        }, o = [{
            name: "email",
            tid: "1",
            enable: 1,
            element: "tr.t_email"
        }, {
            name: "settx",
            tid: "2",
            enable: 1,
            element: "tr.t_settx"
        }, {
            name: "share",
            tid: "3",
            enable: 1,
            element: "tr.t_share",
            maxnum: 100,
            donum: 0
        }, {
            name: "sign",
            tid: "4",
            enable: 1,
            element: "tr.t_sign",
            maxnum: 2,
            donum: 0
        }, {
            name: "loginapp",
            tid: "5",
            enable: 0,
            element: "tr.t_loginapp"
        }, {
            name: "appcheck",
            tid: "10",
            enable: 1,
            element: "tr.t_appcheck"
        }, {
            name: "bindphone",
            tid: "14",
            enable: 1,
            element: "tr.t_bindphone"
        }, {
            name: "regold",
            tid: "59",
            enable: 1,
            element: "tr.t_regold"
        }, {
            name: "yeyou",
            tid: "11",
            enable: 1,
            element: "tr.t_game_tlzj_reg"
        }, {
            name: "yeyou",
            tid: "12",
            enable: 0,
            element: "tr.t_game_tlzj_sign"
        }, {
            name: "yeyou",
            tid: "13",
            enable: 0,
            element: "tr.t_game_tlzj_gold",
            iconcls: "t_dragon",
            maxnum: 5,
            donum: 0
        }, {
            name: "yeyou",
            tid: "9",
            enable: 0,
            element: "tr.t_game_wzzh_grade",
            iconcls: "wz_grade",
            maxnum: 4,
            donum: 0
        }, {
            name: "phone_game",
            tid: "15",
            enable: 1,
            element: "tr.t_game_phone_down"
        }, {
            name: "yeyou",
            tid: "16",
            enable: 1,
            element: "tr.t_game_sy_levelup"
        }, {
            name: "yeyou",
            tid: "17",
            enable: 1,
            element: "tr.t_game_sy_grade",
            iconcls: "sy_grade",
            maxnum: 3,
            donum: 0
        }, {
            name: "yeyou",
            tid: "18",
            enable: 1,
            element: "tr.t_game_sy_gold",
            iconcls: "t_cogold_lv",
            maxnum: 7,
            donum: 0
        }, {
            name: "yeyou",
            tid: "19",
            enable: 1,
            element: "tr.t_game_qjgl_login"
        }, {
            name: "yeyou",
            tid: "20",
            enable: 1,
            element: "tr.t_game_qjgl_gold",
            iconcls: "t_dragon",
            maxnum: 5,
            donum: 0
        }, {
            name: "yeyou",
            tid: "21",
            enable: 1,
            element: "tr.t_game_mycs_login"
        }, {
            name: "yeyou",
            tid: "22",
            enable: 1,
            element: "tr.t_game_mycs_gold",
            iconcls: "t_cogold_lv",
            maxnum: 7,
            donum: 0
        }, {
            name: "yeyou",
            tid: "23",
            enable: 1,
            element: "tr.t_game_mycs_levelup",
            iconcls: "t_mycs_lv",
            maxnum: 7,
            donum: 0
        }, {
            name: "yeyou",
            tid: "24",
            enable: 1,
            element: "tr.t_game_mycs_newlevelup",
            iconcls: "t_mycs_newlv",
            maxnum: 4,
            donum: 0
        }, {
            name: "yeyou",
            tid: "25",
            enable: 1,
            element: "tr.t_game_dhd_login"
        }, {
            name: "yeyou",
            tid: "26",
            enable: 1,
            element: "tr.t_game_dhd_gold",
            iconcls: "t_gcld_lv",
            maxnum: 7,
            donum: 0
        }, {
            name: "yeyou",
            tid: "27",
            enable: 1,
            element: "tr.t_game_dhd_level",
            iconcls: "t_dhd_grade",
            maxnum: 8,
            donum: 0
        }, {
            name: "yeyou",
            tid: "28",
            enable: 1,
            element: "tr.t_game_yxhg_login"
        }, {
            name: "yeyou",
            tid: "29",
            enable: 1,
            element: "tr.t_game_yxhg_gold",
            iconcls: "t_chero_rec",
            maxnum: 7,
            donum: 0
        }, {
            name: "yeyou",
            tid: "30",
            enable: 1,
            element: "tr.t_game_yxhg_levelup",
            iconcls: "t_chero_rank",
            maxnum: 4,
            donum: 0
        }, {
            name: "yeyou",
            tid: "31",
            enable: 1,
            element: "tr.t_game_yxhg_achieve",
            iconcls: "t_chero_achieve",
            maxnum: 3,
            donum: 0
        }, {
            name: "yeyou",
            tid: "32",
            enable: 1,
            element: "tr.t_game_yxhg_card"
        }, {
            name: "yeyou",
            tid: "33",
            enable: 1,
            element: "tr.t_game_yxhg_arm_levelup",
            iconcls: "t_chero_bhq",
            maxnum: 3,
            donum: 0
        }, {
            name: "yeyou",
            tid: "34",
            enable: 1,
            element: "tr.t_game_jtxc_login"
        }, {
            name: "yeyou",
            tid: "35",
            enable: 1,
            element: "tr.t_game_jtxc_gold",
            iconcls: "t_gcld_lv",
            maxnum: 5,
            donum: 0
        }, {
            name: "yeyou",
            tid: "36",
            enable: 1,
            element: "tr.t_game_jtxc_levelup",
            iconcls: "t_jtxc_grade",
            maxnum: 4,
            donum: 0
        }, {
            name: "yeyou",
            tid: "37",
            enable: 1,
            element: "tr.t_game_gcld_login"
        }, {
            name: "yeyou",
            tid: "38",
            enable: 1,
            element: "tr.t_game_gcld_gold",
            iconcls: "t_gcld_lv",
            maxnum: 5,
            donum: 0
        }, {
            name: "yeyou",
            tid: "39",
            enable: 1,
            element: "tr.t_game_gcld_levelup",
            iconcls: "t_gcld_grade",
            maxnum: 4,
            donum: 0
        }, {
            name: "yeyou",
            tid: "40",
            enable: 1,
            element: "tr.t_game_qwzb_login"
        }, {
            name: "yeyou",
            tid: "41",
            enable: 1,
            element: "tr.t_game_qwzb_level",
            iconcls: "t_qwzb_lv",
            maxnum: 6,
            donum: 0
        }, {
            name: "yeyou",
            tid: "42",
            enable: 1,
            element: "tr.t_game_qwzb_gold",
            iconcls: "t_qwzb_gold",
            maxnum: 6,
            donum: 0
        }, {
            name: "yeyou",
            tid: "43",
            enable: 1,
            element: "tr.t_game_dtszj_login"
        }, {
            name: "yeyou",
            tid: "44",
            enable: 1,
            element: "tr.t_game_dtszj_gold",
            iconcls: "t_qwzb_gold",
            maxnum: 6,
            donum: 0
        }, {
            name: "yeyou",
            tid: "45",
            enable: 1,
            element: "tr.t_game_dtszj_level",
            iconcls: "t_dtszj_lv",
            maxnum: 5,
            donum: 0
        }, {
            name: "yeyou",
            tid: "46",
            enable: 1,
            element: "tr.t_game_ltzn_login"
        }, {
            name: "yeyou",
            tid: "47",
            enable: 1,
            element: "tr.t_game_ltzn_gold",
            iconcls: "t_qwzb_gold",
            maxnum: 6,
            donum: 0
        }, {
            name: "yeyou",
            tid: "48",
            enable: 1,
            element: "tr.t_game_ltzn_level",
            iconcls: "t_ltzn_lv",
            maxnum: 5,
            donum: 0
        }, {
            name: "yeyou",
            tid: "49",
            enable: 1,
            element: "tr.t_game_sgws_login"
        }, {
            name: "yeyou",
            tid: "50",
            enable: 1,
            element: "tr.t_game_sgws_gold",
            iconcls: "t_qwzb_gold",
            maxnum: 6,
            donum: 0
        }, {
            name: "yeyou",
            tid: "51",
            enable: 1,
            element: "tr.t_game_sgws_levelup",
            iconcls: "t_sgws_lv",
            maxnum: 5,
            donum: 0
        }, {
            name: "yeyou",
            tid: "52",
            enable: 1,
            element: "tr.t_game_dymj_login"
        }, {
            name: "yeyou",
            tid: "53",
            enable: 1,
            element: "tr.t_game_dymj_gold",
            iconcls: "t_sgmj_lv",
            maxnum: 5,
            donum: 0
        }, {
            name: "yeyou",
            tid: "54",
            enable: 1,
            element: "tr.t_game_dymj_levelup",
            iconcls: "t_sgmj",
            maxnum: 5,
            donum: 0
        }, {
            name: "yeyou",
            tid: "55",
            enable: 1,
            element: "tr.t_game_cqby_login"
        }, {
            name: "yeyou",
            tid: "56",
            enable: 1,
            element: "tr.t_game_cqby_gold",
            iconcls: "t_qwzb_gold",
            maxnum: 6,
            donum: 0
        }, {
            name: "yeyou",
            tid: "57",
            enable: 1,
            element: "tr.t_game_cqby_level",
            iconcls: "t_cqby_lv",
            maxnum: 5,
            donum: 0
        }, {
            name: "yeyou",
            tid: "58",
            enable: 1,
            element: "tr.t_game_cqby_battle",
            iconcls: "t_cqby",
            maxnum: 10,
            donum: 0
        }, {
            name: "yeyou",
            tid: "60",
            enable: 1,
            element: "tr.t_game_60",
            iconcls: "t_cqby",
            maxnum: 2,
            donum: 0
        }];
        l = {
            sign_num: 0,
            rwreturn_stat: 0,
            outTime: !0,
            rwtimeoutobj: null,
            config: {
                taskid: "",
                ad_id: ""
            },
            number_format: function (b) {
                if (!a.isNumeric(b))
                    return b;
                if (b = String(b),
                    b.indexOf(".") <= 0)
                    return b;
                var c = b.split(".");
                return c[1] = c[1].substr(0, 2),
                    c.join(".")
            },
            get_task_stat: function () {
                this.rwreturn_stat = 0,
                    this.rwtimeoutobj = setTimeout(function () {
                        l.rwreturn_show()
                    }, 1e4),
                    h.exe("js_queryTask")
            },
            get_task_num: function () {
                this.rwreturn_stat = 0,
                    h.exe("js_newQueryTask")
            },
            return_sign: function (b) {
                var c = i.decode(b);
                if (0 == c[0].value && (a("#signbut").hide(),
                        a("#signbut2").show(),
                        this.sign_num++,
                    1 != a("#check_sign").attr("rel") && this.sign_num <= 1)) {
                    var d = parseInt(a(".task-btn .t-num").html());
                    (null == d || isNaN(d)) && (d = 0),
                        a(".task-btn .t-num").html(d + 1).show()
                }
            },
            rwreturn_show: function () {
                a(".task-load").hide(),
                0 == this.rwreturn_stat && this.outTime && (this.rwreturn_stat = 2,
                    this._showtip("任务列表加载失败，请手动点击任务按钮重新打开！"),
                this.rwtimeoutobj && this._clear()),
                    this.outTime = !0
            },
            return_task_list: function (b) {
                if (this._clear(),
                    2 == this.rwreturn_stat)
                    return !1;
                var c = i.decode(b)
                    , d = c[1].value
                    , e = i.decode(d)
                    , f = [];
                return a.each(e, function (a, b) {
                    var c = b.value;
                    f.push(i.decode(c))
                }),
                    f
            },
            return_task_num: function (b) {
                var c = i.decode(b)
                    , d = c[1].value;
                "undefined" != typeof d && d > 0 ? a(".task-btn .t-num").html(d).show() : a(".task-btn .t-num").hide()
            },
            return_reward: function (a) {
                var b = i.decode(a)
                    , c = [];
                return c.code = parseInt(b[0].value),
                    c.usergold = l.number_format(b[5].value),
                    c.tid = b[1].value,
                    c.aid = b[6].value,
                    c.reward = b[3].value,
                    c
            },
            reward_send: function (b, c) {
                return 1 != b && a("#js_task_id_1").length > 0 && 1 != a("#js_task_id_1").data("rel") ? (this._showtip("验证QQ邮箱后才能领取哦！"),
                    !1) : (this.config.taskid = b,
                    this.config.ad_id = c,
                    void this.reward_send_rpc())
            },
            reward_send_rpc: function () {
                var b = this
                    , c = function (c) {
                    var d = c.ret;
                    if (d > 0)
                        2 == d ? a.dialog({
                            content: "当前ip输入验证码时错误次数过多，请等待一天后在重新尝试！",
                            icon: "warning",
                            okVal: "确定",
                            ok: function () {
                            }
                        }) : (a.dialog.tips_black(c.str, 1),
                            e.refresh());
                    else {
                        b.config.taskid = "",
                            b.config.ad_id = "",
                            e.destroy();
                        var f = [{
                            name: "r",
                            value: 0
                        }, {
                            name: "tid",
                            value: c.tid
                        }, {
                            name: "mg",
                            value: c.data.mg
                        }, {
                            name: "ms",
                            value: c.data.ms
                        }, {
                            name: "gb",
                            value: c.data.gb
                        }, {
                            name: "sb",
                            value: c.data.sb
                        }, {
                            name: "aid",
                            value: c.aid
                        }]
                            , g = i.encode(f);
                        j.processRewardData(g)
                    }
                }
                    , d = function () {
                }
                    , e = g.create({
                    sence: "task",
                    lock: !0,
                    shadow: {
                        opacity: 0
                    },
                    onSelectOver: function (e) {
                        var f = {
                            task_ca: e,
                            task_roomid: $ROOM.room_id,
                            taskid: b.config.taskid,
                            ad_id: b.config.ad_id
                        };
                        a.ajax("/member/task/reward", {
                            type: "POST",
                            data: f,
                            dataType: "json",
                            success: c,
                            error: d
                        })
                    },
                    onHide: function () {
                    }
                })
            },
            _showtip: function (b) {
                a.dialog.tips_black(b, 3)
            },
            _clear: function () {
                clearTimeout(this.rwtimeoutobj)
            }
        },
            k = b({
                init: function () {
                    this.config = {
                        el: "#js_task_frame",
                        state: n.task.state.close,
                        islog: !1,
                        isBan: !1,
                        tasknum: {
                            psgold: void 0,
                            psnumtip: void 0,
                            psnum: 0
                        },
                        Top: {
                            item: 0,
                            content: 0,
                            hasNew: []
                        },
                        Left: {
                            lii: 0,
                            ddi: 0,
                            lastIndex: "",
                            isShow: !1
                        },
                        desc: {}
                    },
                        this.enable(),
                        this.render(),
                        this.bindEvt()
                },
                render: function () {
                    var b = this;
                    this.config.$el = a(this.config.el),
                        this.config.$items = this.config.$el.find(".task_tabs_item"),
                        this.config.$contents = this.config.$el.find(".task-content"),
                        this.config.$empty = this.config.$el.find(".task-content-empty"),
                        this.setTip(),
                        this.observer = c.create(this),
                        this.observer.on("login", this.isLog),
                        c.on("mod.task.toggleWindowAndInit", function () {
                            b.toggle()
                        }),
                        this.observer.on("tab", this.tab),
                        c.on("mod.task.show", function () {
                            b.open()
                        }),
                        c.on("mod.task.destroy", function (a) {
                            a = !a,
                                b.toggleBan(a)
                        }),
                        h.reg("room_data_tasklis", function (a) {
                            b.processListData(a)
                        }),
                        h.reg("room_data_taskcou", function (a) {
                            l.return_task_num(a)
                        }),
                        h.reg("room_data_taskrec", function (a) {
                            b.processRewardData(a)
                        }),
                        h.reg("room_data_tasksign", function (a) {
                            l.return_sign(a)
                        })
                },
                isLog: function () {
                    this.config.islog = !0
                },
                toggleBan: function (a) {
                    a ? (this.config.isBan = !0,
                        this.config.$el.hide(),
                        m.submit({
                            point_id: "5.3.2.0"
                        })) : this.config.isBan = !1
                },
                _findtask: function (a) {
                    for (var b in o)
                        if (Number(o[b].tid) == Number(a))
                            return o[b];
                    return null
                },
                processListData: function (b) {
                    var c = this
                        , d = 0
                        , e = this.config.tasknum.psgold || 0
                        , f = (this.config.tasknum.psnumtip || 0,
                        l.return_task_list(b));
                    if (a(".task-load").hide(),
                            f) {
                        l.outTime = !1,
                        l.rwtimeoutobj && l._clear();
                        for (var g = f.length - 1, h = 0; g >= h; h++) {
                            var i = f[h]
                                , j = i[0].value
                                , k = {
                                anum: parseInt(i[1].value),
                                ps: parseInt(i[2].value),
                                pgs: parseInt(i[3].value),
                                pss: parseInt(i[4].value),
                                pse: parseInt(i[5].value),
                                adid: parseInt(i[6].value)
                            };
                            e += k.pse;
                            var n = c._findtask(j);
                            n && null != n && ("phone_game" == n.name ? n.element = a("#js_task_id_" + j + "_" + k.adid) : n.element = a("#js_task_id_" + j),
                            15 == j && (n.maxnum = a(n.element).data("count"),
                                a(n.element).data("tid", j),
                                a(n.element).data("aid", k.adid),
                                a(n.element).data("donum", k.anum)),
                                n.maxnum && n.maxnum > 1 ? (n.donum = k.anum,
                                k.anum >= n.maxnum && k.ps <= 0 && a(n.element).remove(),
                                k.anum <= n.maxnum && k.ps > 0 && d++,
                                    a(n.element).show(),
                                    c._yytask_grade_process(n, k, n.iconcls)) : (k.anum > 0 && k.ps > 0 && d++,
                                    c._task_process(n, k)))
                        }
                        0 >= d && a(".task-btn .t-num").hide(),
                            this.config.$el.show(),
                            m.submit({
                                point_id: "5.3.1.0"
                            }),
                            this.config.tasknum.psgold = e,
                            this._remain(),
                            this.show(),
                            this.showtip(this.config.tasknum.psnumtip, e)
                    }
                },
                processRewardData: function (b) {
                    var d = l.return_reward(b);
                    switch (d.code) {
                        case 216:
                            return l._showtip("绑定手机和验证QQ邮箱后才能领取哦！"),
                                !1;
                        case 218:
                            return l._showtip("绑定手机之后才能领取鱼丸!"),
                                !1;
                        case 219:
                            return l._showtip("验证QQ邮箱后才能领取哦！"),
                                !1;
                        case 0:
                            var e = this._findtask(d.tid);
                            if (null == e)
                                return;
                            if (c.trigger("mod.userinfo.change", {
                                    current: {
                                        silver: d.usergold
                                    }
                                }),
                                    "phone_game" == e.name ? e.element = a("#js_task_id_" + d.tid + "_" + d.aid) : e.element = a("#js_task_id_" + d.tid),
                                    get_num = parseInt(a(e.element).data("rel")),
                                15 == d.tid && (e.maxnum = a(e.element).data("count"),
                                    e.donum = a(e.element).data("donum")),
                                e.maxnum && e.maxnum > 1)
                                if (e.donum >= e.maxnum)
                                    a(e.element).remove();
                                else {
                                    var f = a(e.element).data("remain_gold") - a(e.element).data("total_gold");
                                    if (a(e.element).data("remain_gold", f),
                                            a(e.element).removeClass("geted"),
                                            a(e.element).find(".state").html("(" + e.donum + "/" + e.maxnum + ")"),
                                        1 == e.is_new) {
                                        var g = e.donum > 0 ? e.donum : 1;
                                        a(".js_task_id_" + e.tid).hide(),
                                            a(".js_task_id_" + e.tid + "_" + g).show()
                                    } else {
                                        var g = e.iconcls + " " + e.iconcls + (e.donum + 1);
                                        a(e.element).find("span." + e.iconcls).removeClass("").addClass(g)
                                    }
                                }
                            else
                                a(e.element).remove();
                            l._showtip("恭喜您，已成功领取" + d.reward + "个鱼丸！"),
                                m.submit({
                                    point_id: "5.3.4.0",
                                    ext: {
                                        yw: d.reward
                                    }
                                });
                            var h = a(e.element).data("pse");
                            null != h && "" != h && (a(".js_total_gogle").html("+" + h),
                                a(e.element).data("remain_gold", h),
                                a(e.element).data("total_gold", h));
                            var i = parseInt(a(".task-btn .t-num").html());
                            i > 0 ? a(".task-btn .t-num").html(i) : a(".task-btn .t-num").html("").hide(),
                                a(e.element).removeClass("geted"),
                                a(e.element).data("rel", "");
                            var j = parseInt(parseInt(a(".task-btn .t-num").html()) - get_num);
                            "sign" == e.name && l.sign_num > 0 && j++,
                                a(".task-btn .t-num").html(j),
                                1 > j ? a(".task-btn .t-num").hide() : a(".task-btn .t-num").show(),
                                this._remain(),
                                this.reset(),
                                this.show(this.config.Top.item)
                    }
                },
                _task_process: function (b, c) {
                    return a(b.element).data("tid", b.tid),
                        a(b.element).data("aid", c.adid),
                        c.anum >= 1 && c.ps <= 0 ? void a(b.element).remove() : (a(b.element).show(),
                            void (c.anum > 0 && c.ps > 0 ? (a(b.element).addClass("geted"),
                                a(b.element).data("rel", 1),
                                a(b.element).find(".state").html("(1/1)")) : c.ps < 0 && (a(b.element).removeClass("geted"),
                                a(b.element).data("rel", ""),
                                a(b.element).find(".state").html("(0/1)"))))
                },
                _yytask_grade_process: function (b, c, d) {
                    a(b.element).data("tid", b.tid),
                        a(b.element).data("aid", b.aid),
                        a(b.element).data("pse", c.pse),
                        c.anum > 0 && c.ps > 0 ? (a(b.element).data("total_gold", c.pss),
                            a(b.element).addClass("geted"),
                            a(b.element).data("rel", c.ps)) : c.ps <= 0 && (a(b.element).data("total_gold", c.pse),
                            a(b.element).data("remain_gold", c.pse),
                            a(b.element).removeClass("geted"),
                            a(b.element).data("rel", "")),
                        a(b.element).find(".state").html("(" + b.donum + "/" + b.maxnum + ")");
                    var e = b.donum + 1 > b.maxnum ? b.maxnum : b.donum + 1;
                    if (1 != b.is_new) {
                        var f = d + " " + d + e;
                        a(b.element).find("span." + d).removeClass("").addClass(f)
                    } else {
                        var d = b.donum > 0 ? b.donum : 1;
                        a(".js_task_id_" + b.tid).hide(),
                            a(".js_task_id_" + b.tid + "_" + d).show()
                    }
                },
                _remain: function () {
                    var b = 0
                        , c = 0
                        , d = 0
                        , e = 0
                        , f = []
                        , g = ""
                        , h = this.config.$el
                        , i = h.find(".js_task_li");
                    i.each(function (h, i) {
                        var j = a(i).find(".task_tag")
                            , k = a(i).find("dd")
                            , l = 0;
                        if (c = k.length,
                            c > 0) {
                            b = a(i).find("dd.geted").length;
                            var m = a(this).closest(".task-content").index() - 1;
                            b > 0 && (f[m] = "true"),
                                g = c > 0 ? " (" + b + "/" + c + ")" : "",
                                a(i).find(".js_task_num").html(g),
                                d += b,
                                e += c,
                                0 !== b ? j.addClass("task_tag_new") : j.hasClass("task_tag_new") && j.removeClass("task_tag_new")
                        } else
                            a(i).remove();
                        k.each(function (b, c) {
                            l += a(c).data("remain_gold")
                        }),
                            a(i).find(".task-get-yw-num").html(l)
                    }),
                        this.config.Top.hasNew = f,
                        this.config.tasknum.psnumtip = e - d,
                        this.renderTop()
                },
                showtip: function () {
                    if ("1" !== this.check()) {
                        var b = a(".task-lead")
                            , c = this.config.tasknum.psgold
                            , d = this.config.tasknum.psnumtip;
                        "undefined" !== d && b.find(".num").html(d),
                        "undefined" !== c && ("function" == typeof l.number_format && (c = l.number_format(c)),
                            b.find(".gold").html(c)),
                        b.length && b.removeClass("hide").show(),
                            this.save()
                    }
                },
                setTip: function () {
                    var b = '<div class="task-lead" style="display:none;"><a href="javascript:;" class="lead-close" title="关闭"></a><p class="lead-txt"> <i class="num">15</i> <i class="gold">200,000</i></p></div>';
                    a(".task-btn").append(b)
                },
                check: function () {
                    var a = d.get(n.task.cookie);
                    return a
                },
                save: function () {
                    d.set(n.task.cookie, "1", 86400)
                },
                enable: function () {
                    "undefined" != typeof first_tasklist && (o = o.concat(first_tasklist));
                    for (var b in o)
                        o[b].enable ? a("#js_task_id_" + o[b].tid).length <= 0 ? o[b].enable = 0 : a(o[b].element).find("button.task_btn").attr("tid", o[b].tid) : a("#js_task_id_" + o[b].tid).remove()
                },
                reset: function () {
                    var a = this.config.$contents;
                    a.find(".js_task_li").removeClass("active").find(".js_task_li dd").removeClass("cur").end().find("dl").css({
                        display: "none"
                    }),
                        this.config.Left.isShow = !1
                },
                open: function () {
                    this.config.state = n.task.state.open,
                        a(".task-load").show(),
                        l.get_task_stat()
                },
                close: function () {
                    this.config.state = n.task.state.close,
                        this.reset(),
                        this.config.$el.hide()
                },
                toggle: function () {
                    this.config.state === n.task.state.open ? (this.close(),
                        m.submit({
                            point_id: "5.3.2.0"
                        })) : this.config.isBan || this.open()
                },
                empty: function (a) {
                    var b = (this.config.$items.eq(a),
                        this.config.$contents.eq(a))
                        , c = b.find(".js_task_li")
                        , d = !1;
                    return c && c.length ? b.data("empty", "0") : (b.data("empty", "1"),
                        d = !0),
                        d
                },
                show: function (a) {
                    var b = this
                        , c = (this.config.$items,
                        this.config.$contents)
                        , d = (this.config.$empty,
                    c.length - 1)
                        , a = 0 === a ? 0 : a ? a : d;
                    a === d ? (c.each(function (c, d) {
                        return b.empty(c) === !1 ? (a = c,
                            b.observer.trigger("tab", [a, a]),
                            !1) : void 0
                    }),
                    a === d && b.observer.trigger("tab", [0, a])) : b.empty(a) === !1 ? b.observer.trigger("tab", [a, a]) : b.observer.trigger("tab", [a, d])
                },
                tab: function (a) {
                    var b = a[0]
                        , c = a[1];
                    this.config.Top.item = b,
                        this.config.Top.content = c,
                        this.config.Left.lii = 0,
                        this.config.Left.ddi = 0,
                        this.config.Left.lastIndex = 0,
                        this.renderTop(),
                        this.renderLeft(),
                        this.renderRight()
                },
                storeDesc: function (a) {
                    this.config.desc = {
                        taskDesc: a.data("desc"),
                        geted: a.hasClass("geted"),
                        tid: a.data("tid"),
                        aid: a.data("aid"),
                        rel: a.data("rel"),
                        jurl: a.data("jurl"),
                        clickName: a.data("click_name")
                    },
                        this.config.desc.taskName = "<em>" + a.data("task_name") + "</em>",
                        this.config.desc.totalGogle = "+" + a.data("total_gold")
                },
                renderTop: function () {
                    var b = this.config.Top.item
                        , c = this.config.Top.content
                        , d = this.config.Top.hasNew
                        , e = this.config.$items
                        , f = this.config.$contents;
                    e.removeClass("active"),
                        f.removeClass("active"),
                        e.eq(b).addClass("active"),
                        f.eq(c).addClass("active"),
                        e.find(".task_yw_get").removeClass("task_yw_getting"),
                        a.each(d, function (a, b) {
                            b && e.eq(a).find(".task_yw_get").addClass("task_yw_getting")
                        })
                },
                renderLeft: function () {
                    var b = this.config.Top.item
                        , c = this.config.Top.content
                        , d = (this.config.$items.eq(b),
                        this.config.$contents.eq(c))
                        , e = d.find(".js_task_li")
                        , f = this.config.Left.lii
                        , g = this.config.Left.ddi
                        , h = this.config.Left.lastIndex
                        , i = this.config.Left.isShow
                        , j = e.eq(f)
                        , k = j.find("dl")
                        , l = d.find("dl").not(k)
                        , m = j.find("dd")
                        , n = j.find("dd").eq(g)
                        , o = []
                        , p = [];
                    this.config.$contents.each(function (b, c) {
                        if (p[b] = a(c).find(".js_task_scroll"),
                                !o[b]) {
                            var d = p[b].jScrollPane({
                                verticalGutter: -10,
                                horizontalGutter: -16,
                                showArrows: !0,
                                animateScroll: !0,
                                autoReinitialise: !0,
                                clickOnTrack: !1
                            });
                            o[b] = d.data("jsp")
                        }
                    }),
                        this.storeDesc(n),
                        m.removeClass("cur"),
                    k.is(":animated") || (i && h === f ? (j.removeClass("active"),
                        k.slideUp("fast", function () {
                            o[c].reinitialise()
                        }),
                        this.config.Left.isShow = !1) : (l.slideUp("fast", function () {
                        o[c].reinitialise()
                    }),
                        e.removeClass("active"),
                        j.addClass("active"),
                        k.slideDown("fast", function () {
                            o[c].reinitialise()
                        }),
                        n.addClass("cur"),
                        this.config.Left.isShow = !0)),
                        this.config.Left.lastIndex = f
                },
                renderRight: function () {
                    var b = this.config.$el
                        , c = this.config.Top.content
                        , d = this.config.$contents.eq(c)
                        , e = (this.config.$contents,
                        b.find(".task_des"))
                        , f = d.find(".task_des")
                        , g = f.find(".t_wrad_pic_desc")
                        , h = this.config.desc
                        , i = []
                        , j = [];
                    e.each(function (b, c) {
                        if (j[b] = a(c).find(".viewport"),
                                i[b])
                            i[b].reinitialise();
                        else {
                            var d = j[b].jScrollPane({
                                verticalGutter: 10,
                                horizontalGutter: -16,
                                showArrows: !0,
                                animateScroll: !0,
                                autoReinitialise: !0,
                                clickOnTrack: !1
                            });
                            i[b] = d.data("jsp")
                        }
                    }),
                        g.css({
                            top: "20px",
                            opacity: "0"
                        }),
                        f.find(".js_task_name").html(h.taskName),
                        f.find(".js_task_desc").html(h.taskDesc),
                        f.find(".js_total_gogle").html(h.totalGogle),
                        h.geted ? f.find(".js_task_btn").html("领取鱼丸").addClass("active").attr("jurl", "").attr("rel", h.rel).siblings().addClass("active") : f.find(".js_task_btn").html(h.clickName).removeClass("active").attr("jurl", h.jurl).attr("rel", "").siblings().removeClass("active"),
                        f.find(".js_task_btn").attr("tid", h.tid).attr("aid", h.aid),
                        g.stop().animate({
                            top: "0",
                            opacity: "1",
                            filter: "alpha(opacity=100)"
                        }, 500)
                },
                bindEvt: function () {
                    function b(a) {
                        a.stopPropagation(),
                            a.preventDefault()
                    }

                    var d = this
                        , e = this.config.$el;
                    e.on("click", ".task_lead_cont", function () {
                        a(this).hide()
                    }),
                        e.on("click", ".task_close", function () {
                            d.config.state = n.task.state.open,
                                c.trigger("mod.task.toggleWindowAndInit")
                        }),
                        e.on("click", ".task_tabs_item", function (c) {
                            b(c);
                            var e = a(this).index();
                            d.config.Left.lastIndex = "",
                                d.config.Left.isShow = !1,
                                d.reset(),
                                d.show(e)
                        }),
                        e.on("click", ".js_task_li", function (c) {
                            b(c);
                            var e = d.config.Top.content
                                , f = (d.config.$contents.eq(e),
                                a(this).index());
                            d.config.Left.lii = f,
                                d.config.Left.ddi = 0,
                                d.renderLeft(),
                                d.renderRight()
                        }),
                        e.find(".js_task_li").on("click", "dd", function (c) {
                            b(c),
                                d.config.Left.ddi = a(this).index(),
                                d.storeDesc(a(this)),
                                a(this).siblings().removeClass("cur"),
                                a(this).addClass("cur"),
                                d.renderRight()
                        }),
                        e.on("click", ".js_task_btn", function () {
                            if (!d.config.islog)
                                return !1;
                            var b = a(this).attr("rel")
                                , c = a(this).attr("jurl");
                            if (b)
                                l.reward_send(a(this).attr("tid"), a(this).attr("aid"));
                            else if (c) {
                                if (m.submit({
                                        point_id: "5.3.3.0",
                                        ext: {
                                            href: c
                                        }
                                    }),
                                    c.indexOf("welcome/18") > 0)
                                    try {
                                        m.storage.save("_dypay_fp", 7)
                                    } catch (e) {
                                    }
                                window.open(c)
                            }
                            return !1
                        }),
                        a(".task-lead").on("click", function () {
                            a(".task-lead").addClass("hide")
                        })
                }
            });
        var p = function () {
                var b = f.check();
                j || (j = new k,
                    b ? (j.observer.trigger("login"),
                        l.get_task_num()) : j.showtip(),
                    a("#room-task-trigger").on("click", function (a) {
                        a.stopPropagation(),
                            a.preventDefault(),
                            b ? c.trigger("mod.task.toggleWindowAndInit") : f.show()
                    }))
            }
            ;
        return a(p),
        {
            onToggle: function () {
                j && c.trigger("mod.task.toggleWindowAndInit")
            }
        }
    }),
    define("douyu/page/room/normal/mod/olyw", ["jquery", "shark/class", "shark/observer", "shark/util/lang/1.0", "shark/util/cookie/1.0", "douyu/context", "douyu/com/user", "douyu/com/vcode9", "douyu/page/room/base/api", "shark/util/flash/1.0/data", "douyu/page/room/normal/mod/chat-shield", "shark/util/template/1.0", "douyu/page/room/normal/mod/super-recommended"], function (a, b, c, d, e, f, g, h, i, j, k, l, m) {
        var n, o, p, q = window.DYS, r = {
            yw: {
                cookie: "boxtit",
                state: {
                    open: "open",
                    close: "close"
                },
                isShield: "false"
            }
        };
        n = b({
            init: function (b) {
                this.config = a.extend(!0, {}, {
                    islog: !1,
                    target: "#js-stats-and-actions .get-yw",
                    time: ".g-time",
                    pic: ".g-pic",
                    pop: ".get-yw .yw-collect-box",
                    personal_yw: '[data-login-user="silver"]',
                    state: r.yw.state.close,
                    firstLoad: !0,
                    level: "",
                    list: {
                        wait: {
                            timeText: "",
                            content: "别着急，鱼丸正在制作中，领取鱼丸还能涨经验呢……",
                            cls: "get-state-next",
                            pic: "wait-get",
                            cqPic: "w-cq-get",
                            btn: "next-btn",
                            text: "等待中",
                            cqText: "酬勤专享"
                        },
                        may: {
                            timeText: "可领取",
                            content: "鱼丸做好了，请点击领取您的鱼丸和经验值！",
                            cls: "get-state-udrw",
                            pic: "may-get",
                            cqPic: "cq-get",
                            btn: "may-btn",
                            text: "可领取"
                        },
                        yet: {
                            timeText: "",
                            content: "",
                            cls: "get-state-ard",
                            pic: "yet",
                            cqPic: "yet",
                            btn: "yet-btn",
                            text: "已领取"
                        },
                        over: {
                            timeText: "已完成",
                            content: '<span class="moretask" style="cursor: pointer;">做任务领取更多鱼丸！</span>',
                            cls: "get-state-ard",
                            pic: "yet-get",
                            cqPic: "yet-get",
                            btn: "yet-btn",
                            text: "已领取"
                        }
                    },
                    timer: !0,
                    userCq: -1,
                    userinfo: !1,
                    isBan: !1
                }, b),
                    this.render(),
                    this.bindEvt()
            },
            render: function () {
                var b = this;
                this.config.$el = a(this.config.target),
                    this.config.$time = a(this.config.time),
                    this.config.$pic = a(this.config.pic),
                    this.config.$pop = a(this.config.pop),
                    this.config.$personal_yw = a(this.config.personal_yw),
                    this.observer = c.create(this),
                    this.observer.on("login", this.isLog),
                    this.observer.on("toggle", this.toggle),
                    c.on("mod.userinfo.userinfoready", function () {
                        b.config.userinfo = !0
                    }),
                    c.trigger("mod.chouqin.change", function (a) {
                        b.config.userCq = a
                    }),
                    c.on("mod.olyw.destroy", function (a) {
                        a = !a,
                            b.toggleBan(a)
                    }),
                    i.reg("room_data_chest", function (a) {
                        b.showTime(a)
                    }),
                    i.reg("room_data_olyw", function (a) {
                        c.trigger("mod.chat.msg.res.olyw.luckburst", a)
                    })
            },
            isLog: function () {
                this.config.islog = !0
            },
            toggleBan: function (b) {
                b ? (this.config.isBan = !0,
                    a(".get-yw .g-time").hide(),
                    this.config.$pop.hide().addClass("hide")) : (this.config.isBan = !1,
                    a(".get-yw .g-time").show())
            },
            number_format: function () {
                if (!a.isNumeric(num))
                    return num;
                if (num = String(num),
                    num.indexOf(".") <= 0)
                    return num;
                var b = num.split(".");
                return b[1] = b[1].substr(0, 2),
                    b.join(".")
            },
            showTip: function () {
                "1" !== this.check() && (setTimeout(function () {
                    a(".get-fc").length && a(".get-fc").removeClass("hide").show()
                }, 2e4),
                    this.save())
            },
            check: function () {
                var a = e.get(r.yw.cookie);
                return a
            },
            save: function () {
                e.set(r.yw.cookie, "1", 28800)
            },
            open: function () {
                this.config.state = r.yw.state.open,
                    this.config.$pop.removeClass("hide").show(),
                    a("#js-yw-rmd-rooms").length <= 0 ? (this.config.$pop.find(".yw-app-des").eq(0).before('<div id="js-yw-rmd-rooms"></div>'),
                        m.ywinit()) : m.ywRmdRefresh()
            },
            close: function () {
                this.config.state = r.yw.state.close,
                    this.config.$pop.addClass("hide").hide()
            },
            toggle: function () {
                this.config.state === r.yw.state.open ? this.close() : this.config.isBan || this.open()
            },
            getData: function (a, b) {
                var c, d, e, f = this.config.userCq, g = this.config.level;
                if (a) {
                    var h = (h = Math.floor(a / 60)) < 10 ? "0" + h : h
                        , i = (i = a % 60) < 10 ? "0" + i : i
                        , j = h + ":" + i;
                    c = this.setConfig({
                        list: {
                            index: g - 1
                        },
                        text: {
                            content: this.config.list.wait.content,
                            cls: this.config.list.wait.cls
                        },
                        time: {
                            value: j
                        }
                    })
                } else
                    f && 6 >= g || !f ? (d = this.config.list[b] || this.config.list.may,
                        c = this.setConfig({
                            time: {
                                enable: !1,
                                value: d.timeText
                            },
                            list: {
                                index: g - 1,
                                pic: d.pic,
                                cqPic: d.cqPic,
                                btn: d.btn,
                                text: d.text
                            },
                            text: {
                                content: d.content,
                                cls: d.cls
                            }
                        })) : (e = this.config.list.over,
                        c = this.setConfig({
                            list: {
                                index: g - 1
                            },
                            time: {
                                over: !0,
                                enable: !0,
                                value: e.timeText
                            },
                            text: {
                                content: e.content,
                                cls: e.cls
                            }
                        }));
                return c
            },
            showTime: function (a) {
                var b = j.decode(a)
                    , c = Number(b[0].value)
                    , d = Number(b[1].value)
                    , e = Number(b[2].value);
                this.config.isBan || (this.config.newTime = d ? d + 60 : d,
                    this.config.userCq = e,
                    this.config.level = c,
                this.config.firstLoad && this.updateTime())
            },
            updateTime: function () {
                var a = this
                    , b = (this.config.$el,
                    this.config.$time,
                    this.config.newTime)
                    , c = this.getData(b)
                    , d = this.config.list.over.timeText;
                this.config.userCq && this.config.level > 6 && (c.time = {
                    over: !0,
                    enable: !1,
                    value: d
                },
                    c.text = {
                        content: this.config.list.over.content,
                        cls: this.config.list.over.cls
                    }),
                !this.config.userCq && this.config.level > 4 && (c.time.over = !0),
                this.config.firstLoad && (c.isFirst = !0,
                    c = this.setConfig(c),
                this.config.userCq || 5 !== this.config.level || (c.text.content = this.config.list.over.content,
                    c.text.cls = this.config.list.over.cls),
                    this.initList(),
                    this.renderList(c),
                    this.renderText(c),
                    this.config.firstLoad = !1),
                    this.renderTime(c),
                    a.config.newTime >= 1 ? a.config.newTime-- : (clearTimeout(a.config.timer),
                        a.config.timer = null ,
                        a.renderList(c),
                        a.renderText(c)),
                a.config.timer && (a.config.timer = setTimeout(function () {
                    a.updateTime()
                }, 1e3))
            },
            setConfig: function (b) {
                var b = b || {}
                    , c = this.config.list.wait
                    , d = a.extend(!0, {}, {
                    list: {
                        index: c.index,
                        pic: c.pic,
                        cqPic: c.cqPic,
                        btn: c.btn,
                        text: c.text,
                        cqText: c.cqText
                    },
                    text: {
                        context: c.context,
                        cls: c.cls
                    },
                    time: {
                        enable: "",
                        value: c.timeText
                    }
                }, b);
                return b.type && b.type in d ? d[type] : d
            },
            initList: function () {
                var b = this.config.$el
                    , c = b.find(".cb-list li")
                    , d = this.setConfig().list;
                c.each(function (b, c) {
                    3 >= b ? (a(c).find("span").removeClass().addClass(d.pic).end().find("a").removeClass().addClass(d.btn),
                        a(c).find("a").html(d.text)) : (a(c).find("span").removeClass().addClass(d.cqPic).end().find("a").removeClass().addClass(d.btn),
                        a(c).find("a").html(d.cqText))
                })
            },
            renderTime: function (a) {
                var b = this.config.$time
                    , c = this.config.$pic
                    , d = this.setConfig(a).time
                    , e = this.config.level
                    , f = this.config.list.may.timeText
                    , g = "g-pic close" + e;
                d.enable || "" === d.enable || (g = "g-pic get" + e),
                d.enable && (g = d.value === f ? "g-pic get" + e : "g-pic close" + e),
                d.over && (g = "g-pic close7"),
                    b.html(d.value),
                    c.removeClass().addClass(g)
            },
            renderList: function (b) {
                var c = this.config.$el
                    , d = c.find(".cb-list li")
                    , e = this.setConfig(b).list
                    , f = this.setConfig(b).time;
                (!f.enable && e.btn === this.config.list.may.btn || f.enable && e.btn !== this.config.list.may.btn) && (e.index <= 3 ? d.eq(e.index).find("span").removeClass().addClass(e.pic).end().find("a").removeClass().addClass(e.btn).html(e.text) : d.eq(e.index).find("span").removeClass().addClass(e.cqPic).end().find("a").removeClass().addClass(e.btn).html(e.text)),
                b.isFirst && (yet = this.config.list.yet,
                    e.index >= 1 && e.index < 6 ? yetAtt = d.eq(e.index).prevAll() : e.index >= 6 ? yetAtt = d : yetAtt = [],
                    a.each(yetAtt, function (b, c) {
                        a(c).find("span").removeClass().addClass(yet.pic),
                            a(c).find("a").removeClass().addClass(yet.btn).text(yet.text)
                    }))
            },
            renderText: function (a) {
                var b = this.config.$el
                    , c = b.find(".c-txt")
                    , d = this.setConfig(a).text;
                c.removeClass().addClass("c-txt").addClass(d.cls).html(d.content)
            },
            renderExp: function (a) {
                var b = this.config.$pop;
                b.append('<div class="exp-add"><div class="exprience1"><p><span>经验值 +' + a + "</span></p></div></div>");
                var c = b.find(".exprience1")
                    , d = (b.width() - c.width()) / 2;
                c.css({
                    position: "absolute",
                    left: d,
                    top: "80px",
                    "z-index": 200
                }),
                    c.stop().animate({
                        top: "5px"
                    }, 1e3).fadeOut("slow", function () {
                        c.remove()
                    })
            },
            checkTotalYw: function (b) {
                var c;
                return this.config.userinfo ? (c = this.config.$personal_yw.text(),
                    c > 2e3 ? a.dialog.alert("鱼丸存量超过2000啦! 暂时无法在线领鱼丸(其他获取鱼丸途径不受影响),<br>送点鱼丸给主播再来领取吧!") : b && b()) : b && b(),
                    c
            },
            handleReturn: function (b, d) {
                var e = b.result
                    , f = b.gift_count
                    , g = parseInt(b.leve)
                    , h = this.config.userCq
                    , i = (this.config.$personal_yw,
                    3 >= d ? 2 : 4);
                if (2 == b.ret)
                    a.dialog({
                        content: "当前ip输入验证码时错误次数过多，请等待一天后在重新尝试！",
                        icon: "warning",
                        okVal: "确定",
                        ok: function () {
                        }
                    });
                else if (1 == b.ret)
                    a.dialog.tips_black("验证码输入错误", 1),
                        p.refresh();
                else if (0 == e) {
                    p.destroy(),
                        q.submit({
                            point_id: "5.4.2.0"
                        }),
                        c.trigger("mod.userinfo.change", {
                            change: {
                                silver: f,
                                exp: i
                            }
                        }),
                        q.submit({
                            point_id: "5.4.5.0",
                            ext: {
                                yw: f
                            }
                        }),
                        this.config.level = g,
                        this.config.userCq = h;
                    var j = this.getData(0, "yet")
                        , k = parseInt(b.lack_time);
                    if (k) {
                        k += 60;
                        var l = (l = Math.floor(k / 60)) < 10 ? "0" + l : l
                            , m = (m = k % 60) < 10 ? "0" + m : m
                            , n = l + ":" + m
                    }
                    var o = k ? k : this.config.list.may.timeText;
                    j.time = {
                        enable: !0,
                        value: n || o
                    },
                        f >= 1e3 ? j.text = {
                            content: "幸运女神眷顾您，恭喜您领取了<b>" + f + "个鱼丸</b>！",
                            cls: "get-state-special"
                        } : !h && 4 >= g || h && 6 >= g ? j.text = {
                            content: "恭喜你领取了<b>" + f + "个鱼丸</b>和<b>" + i + "</b>点经验，领取酬勤专享鱼丸可获双倍经验！",
                            cls: this.config.list.yet.cls
                        } : j.text = {
                            content: "恭喜你领取了<b>" + f + "个鱼丸</b>和<b>" + i + "</b>点经验，领取酬勤专享鱼丸可获双倍经验！",
                            cls: this.config.list.yet.cls
                        },
                        this.renderExp(i),
                        this.config.newTime = k,
                        o = this.config.list.over.timeText,
                    h && 6 === g && (j.time = {
                        over: !0,
                        enable: !0,
                        value: o
                    }),
                    (!h || h && 6 > g) && (this.config.timer = !0,
                        this.updateTime()),
                        this.renderTime(j),
                        this.renderList(j),
                        this.renderText(j),
                        this.config.level = g + 1,
                    k || (j = this.getData(0, "may"),
                        j.text.content = this.config.list.over.content,
                        j.text.cls = this.config.list.over.cls,
                        j.time.over = !0,
                        this.renderTime(j),
                        this.renderList(j),
                        this.renderText(j))
                } else {
                    var r = ""
                        , s = "/member";
                    switch (e) {
                        case "216":
                            r = "需要绑定手机和邮箱才能领取鱼丸！",
                                s = "/member";
                            break;
                        case "218":
                            r = "需要绑定手机才能领取鱼丸!",
                                s = "/member#phone";
                            break;
                        case "219":
                            r = "需要绑定邮箱才能领取鱼丸!",
                                s = "/member#mod_email";
                            break;
                        case "270":
                            r = "请稍后再试!";
                            break;
                        case "283":
                            r = "鱼丸存量超过2000啦! 暂时无法在线领鱼丸(其他获取鱼丸途径不受影响),<br>送点鱼丸给主播再来领取吧!";
                            break;
                        case "212":
                            r = "非酬勤用户无法领取!";
                            break;
                        default:
                            r = "鱼丸领取失败！"
                    }
                    "363" == b.result ? a(".get-defeat").removeClass("hide").show() : "214" == b.result && a(".get-defeat2").removeClass("hide").show(),
                        "216" == e || "218" == e || "219" == e ? a.dialog({
                            content: r,
                            title: "提示",
                            icon: "warning",
                            cancelVal: "以后再说",
                            okVal: "立即绑定",
                            lock: !0,
                            ok: function () {
                                window.location.href = s
                            },
                            cancel: function () {
                                p.destroy(),
                                    q.submit({
                                        point_id: "5.4.2.0"
                                    })
                            }
                        }) : a.dialog.alert(r)
                }
            },
            toggleCqTip: function () {
                var b = arguments
                    , d = ""
                    , e = this;
                b.length && "open" === b[0] ? (d = '<div class="cq-dialog"><div class="cq-tit"><h3>提示</h3><a href="javascript:;" class="close">×</a></div><div class="cq-cont"><p class="yw-notic-des">噢，第五、六次领取机会为酬勤用户专享，快去给主播赠送一次酬勤来获得海量鱼丸的领取机会吧!</p></div><div class="cq-foot"><a href="javascript:;">赠送酬勤</a><a href="javascript:;" class="cancel">还是算了</a></div></div>',
                    a("body").append(d),
                    a(".cq-dialog").on("click", ".close", function () {
                        e.toggleCqTip()
                    }),
                    a(".cq-dialog").on("click", ".cancel", function () {
                        e.toggleCqTip()
                    }),
                    a(".cq-dialog").on("click", ".cq-foot a:first", function () {
                        c.trigger("mod.gift.openCQWindowAndInit"),
                            e.toggleCqTip()
                    })) : a(".cq-dialog").remove()
            },
            handleSubmit: function (b) {
                var c = this
                    , d = this.config.userCq
                    , e = "open";
                !d && b >= 4 ? this.toggleCqTip(e) : this.checkTotalYw(function () {
                    q.submit({
                        point_id: "5.4.1.0"
                    }),
                        p = h.create({
                            sence: "task",
                            sign: !0,
                            lock: !0,
                            shadow: {
                                opacity: 0
                            },
                            onSelectOver: function (d) {
                                q.submit({
                                    point_id: "5.4.4.0"
                                });
                                var e = {};
                                e.leve = c.config.level,
                                    e.task_ca = d,
                                    e.room_id = $ROOM.room_id,
                                    a.ajax("/member/cp/get_box_reward", {
                                        type: "POST",
                                        data: e,
                                        dataType: "json",
                                        success: function (a) {
                                            c.handleReturn(a, b)
                                        },
                                        error: function (a) {
                                        }
                                    })
                            }
                        })
                })
            },
            bindEvt: function () {
                function b(a) {
                    a.stopPropagation(),
                        a.preventDefault()
                }

                var d = this
                    , e = this.config.$el
                    , f = (this.config.$lead_close,
                    this.config.$pop);
                f.on("click", ".close", function (a) {
                    b(a),
                        d.observer.trigger("toggle")
                }),
                    e.on("click", ".may-btn", function (c) {
                        b(c),
                            q.submit({
                                point_id: "5.4.3.0"
                            });
                        var e = a(this).index(".yw-collect-box li a");
                        d.handleSubmit(e)
                    }),
                    a(".get-fc").click(function () {
                        return a(".get-fc").addClass("hide"),
                            !1
                    }),
                    e.children("a").on("click", function (a) {
                        b(a);
                        var c = d.config.islog;
                        c ? d.observer.trigger("toggle") : g.show()
                    }),
                    f.on("click", ".moretask", function () {
                        c.trigger("mod.task.toggleWindowAndInit")
                    })
            }
        });
        var s = function () {
                var b = g.check();
                o || (o = new n,
                    b ? (a(".get-yw").show(),
                        o.observer.trigger("login"),
                        o.showTip()) : a(".get-yw").hide())
            }
            ;
        return {
            init: function () {
                s()
            },
            onToggle: function () {
                o && o.observer.trigger("toggle")
            }
        }
    }),
    define("douyu/page/room/normal/mod/broadcast", ["jquery"], function (a) {
        return {
            init: function () {
            }
        }
    }),
    define("douyu/page/room/normal/mod/share", ["jquery", "shark/class"], function (a, b) {
        var c = b({
            getDoms: function () {
                var b = a("#share-content");
                this.doms = {
                    shareBtn: b,
                    shareContent: b.find('[data-share-content="content"]'),
                    sharePathBtn: b.find("[data-share-path]"),
                    sharePathInput: b.find('[data-share-input="path"]'),
                    copyBtn: b.find('[data-share-copy="btn"]'),
                    shareMoreBtn: b.find("[data-to]")
                }
            },
            init: function () {
                this.getDoms(),
                    $SYS.uid ? this.doms.sharePathInput.val($ROOM.share.video) : this.doms.sharePathInput.val($ROOM.share.video),
                    this.addEvent()
            },
            addEvent: function () {
                var b = this
                    , c = this.doms;
                c.shareBtn.on("mouseenter", function () {
                    b.hasCopy || (c.shareContent.removeClass("hide"),
                        c.copyBtn.zclip({
                            path: $SYS.res_url + "images/ZeroClipboard.swf",
                            copy: c.sharePathInput.val(),
                            afterCopy: function () {
                                a.dialog.tips_black("已成功复制到您的剪切板", 1.5)
                            }
                        }),
                        b.hasCopy = !0)
                }),
                    c.shareContent.on("mouseenter", function () {
                        clearTimeout(b.timer)
                    }),
                    c.shareContent.on("mouseleave", function () {
                        setTimeout(function () {
                            c.shareContent.addClass("hide"),
                                a(".zclip").remove(),
                                b.hasCopy = !1
                        }, 100)
                    }),
                    c.shareBtn.on("mouseleave", function () {
                        b.timer = setTimeout(function () {
                            c.shareContent.addClass("hide"),
                                a(".zclip").remove(),
                                b.hasCopy = !1
                        }, 100)
                    }),
                    c.sharePathBtn.on("click", function () {
                        c.sharePathBtn.removeClass("hover");
                        var d = a(this);
                        d.addClass("hover");
                        var e = d.attr("data-share-path");
                        b.renderPath(e),
                            a(".zclip").remove(),
                            c.copyBtn.zclip({
                                path: $SYS.res_url + "images/ZeroClipboard.swf",
                                copy: c.sharePathInput.val(),
                                afterCopy: function () {
                                    a.dialog.tips_black("已成功复制到您的剪切板", 1.5)
                                }
                            })
                    }),
                    c.shareMoreBtn.on("click", function (c) {
                        var d = a(this)
                            , e = d.attr("data-to");
                        b.shareToThird(e, d)
                    })
            },
            renderPath: function (a) {
                var b = this.doms
                    , c = "";
                switch (a) {
                    case "url":
                        c = $SYS.uid ? $ROOM.share.video : $ROOM.share.video;
                        break;
                    case "flash":
                        c = $ROOM.share.flash;
                        break;
                    case "embed":
                        c = $ROOM.share.common
                }
                b.sharePathInput.val(c)
            },
            shareToThird: function (a, b) {
                if (!a)
                    return !1;
                var c = "";
                "tsina" == a && (c = "&appkey=979098171&ralateuid=3982726153");
                var d = $ROOM.room_url;
                $SYS.uid && (d += "?fromuid=" + $SYS.uid);
                var e = "http://www.jiathis.com/send/?webid=" + a + "&url=" + encodeURIComponent(d) + "&title=&summary=" + encodeURIComponent("我正在 " + $ROOM.room_name + " 的房间观看直播 / 主播" + $ROOM.owner_name + "，欢迎大家前来围观 / 来自#斗鱼TV#游戏直播！") + "&uid=1896137&data_track_clickback=true&pic=" + encodeURIComponent($ROOM.room_pic) + c;
                b.attr("href", e)
            }
        })
            , d = {
            init: function (a) {
                return new c(a)
            }
        };
        return d
    }),
    define("douyu/page/room/normal/mod/qr-code", ["jquery", "shark/class", "douyu/context"], function (a, b, c) {
        var d = b({
            getDoms: function () {
                var b = a("#qrcode-content");
                this.doms = {
                    qrCodeBtn: b,
                    qrCodeContent: b.find('[data-qrcode-content="content"]'),
                    qrCodeImg: b.find('[data-qrcode-img="img"]'),
                    saoyisaoImg: b.find('[data-qrcode-img="saoyisao"]')
                }
            },
            init: function () {
                this.getDoms(),
                    this.saoYiSaoImgPath = c.get("sys.web_url") + "/app/douyu/res/page/room-normal/room-vactive-img1.png?v=20160322",
                    this.addEvent()
            },
            addEvent: function () {
                var a = this
                    , b = this.doms;
                b.qrCodeBtn.on("mouseenter", function () {
                    b.qrCodeContent.removeClass("hide"),
                        b.saoyisaoImg[0].src = a.saoYiSaoImgPath,
                        a.renderQRcode()
                }),
                    b.qrCodeBtn.on("mouseleave", function () {
                        a.timer = setTimeout(function () {
                            b.qrCodeContent.addClass("hide"),
                                b.qrCodeImg.html("")
                        }, 100)
                    }),
                    b.qrCodeContent.on("mouseenter", function () {
                        clearTimeout(a.timer)
                    })
            },
            renderQRcode: function () {
                if (!a.trim(this.doms.qrCodeImg.html())) {
                    var b = "canvas";
                    "Microsoft Internet Explorer" == navigator.appName && parseInt(navigator.userAgent.toLowerCase().match(/msie ([\d.]+)/)[1]) < 9 && (b = "table");
                    var c = $ROOM.room_url
                        , d = c.indexOf("?");
                    d > 0 && (c = c.substring(0, d)),
                        this.doms.qrCodeImg.qrcode({
                            render: b,
                            width: 100,
                            height: 100,
                            text: c
                        })
                }
            }
        })
            , e = {
            init: function (a) {
                return new d(a)
            }
        };
        return e
    }),
    define("douyu/page/room/normal/mod/chouqin", ["jquery", "shark/class", "douyu/context", "douyu/com/user", "shark/observer", "shark/ui/dragdrop/1.0/dragdrop", "douyu/com/vcode9"], function (a, b, c, d, e, f, g) {
        var h, i = window.DYS, j = {
            auto_send: !0,
            cq: {
                state: {
                    open: "open",
                    close: "close"
                }
            }
        };
        h = b({
            init: function () {
                if (1 == a("body").data("cq")) {
                    var b = d.check();
                    this.config = {
                        target: ".cq_layer",
                        personal_yc: ".personal-info .w-yc .gold",
                        state: j.cq.state.close,
                        islog: b,
                        type: -1
                    },
                        this.render(),
                        this.bindEvt()
                }
            },
            render: function () {
                var b = this;
                this.config.$el = a(this.config.target),
                    this.config.$personal_yc = a(this.config.personal_yc),
                    e.on("mod.gift.openCQWindowAndInit", function () {
                        b.toggle()
                    })
            },
            open: function () {
                var b = this.config.$el
                    , c = a(".personal-info .w-yc span").text();
                a("#cq-usergold").html(c),
                    this.config.state = j.cq.state.open,
                    this.renderProgress(),
                    b.removeClass("hide"),
                    b.show()
            },
            close: function () {
                var a = this.config.$el;
                this.config.state = j.cq.state.close,
                    a.hide()
            },
            toggle: function () {
                this.config.state === j.cq.state.open ? this.close() : this.open()
            },
            number_format: function (b) {
                if (!a.isNumeric(b))
                    return b;
                if (b = String(b),
                    b.indexOf(".") <= 0)
                    return b;
                var c = b.split(".");
                return c[1] = c[1].substr(0, 2),
                    c.join(".")
            },
            tipScroll: function () {
                var a = document.getElementById("cq-tscroll")
                    , b = !0;
                a && (a.innerHTML += a.innerHTML,
                        a.onmouseover = function () {
                            b = !1
                        }
                        ,
                        a.onmouseout = function () {
                            b = !0
                        }
                        ,
                        new function () {
                            var c = a.scrollTop % 20 == 0 && !b;
                            c || (a.scrollTop == parseInt(a.scrollHeight / 2) ? a.scrollTop = 0 : a.scrollTop++),
                                setTimeout(arguments.callee, a.scrollTop % 20 ? 10 : 2500)
                        }
                )
            },
            renderProgress: function () {
                e.fire("douyu.avatar.get", $ROOM.owner_uid, "middle", function (b) {
                    a(".cq_layer .title .pic img").attr("src", b)
                }),
                    a(".cq_layer").show(),
                    a("#cq-showtime").html(""),
                    a(".jsroomcq").html('<img src="' + $SYS.res_url + 'douyu/images/loading.gif?v=20160322"  />'),
                    a("#cq-cqbar").width(0),
                    a.ajax({
                        type: "POST",
                        url: "/member/cq/get_cq_show",
                        data: {
                            owner_uid: $ROOM.owner_uid,
                            room_id: $ROOM.room_id
                        },
                        dataType: "json",
                        success: function (b) {
                            a("#cq-usergold").html(b.user_gold);
                            var c = 0;
                            c = 0 == b.show_time ? 0 : b.show_time <= 1 ? 1 : Math.floor(b.show_time),
                                a("#cq-showtime").html("已直播" + c + "小时"),
                                a("#cq-cqbar").width(0),
                                c >= 60 ? (a("#cq-cqbar").animate({
                                    width: "592px"
                                }, 1e3, function () {
                                    a(this).css({
                                        "border-top-right-radius": "5px",
                                        "border-bottom-right-radius": "6px"
                                    })
                                }),
                                    a("#cq-lastcq").html("酬勤时长已足够，主播可获得观众送的所有酬勤了"),
                                    a(".cq_layer .sc1 i").css({
                                        "background-position": "0 -422px"
                                    }).attr("title", "主播已直播满30小时，可获得初级酬勤奖励"),
                                    a(".cq_layer .sc2 i").css({
                                        "background-position": "-155px -422px"
                                    }).attr("title", "主播已直播满40小时，可获得初级、中级酬勤奖励"),
                                    a(".cq_layer .sc3 i").css({
                                        "background-position": "-326px -422px"
                                    }).attr("title", "主播已直播满60小时，可获得所有酬勤奖励")) : c >= 40 ? (a("#cq-cqbar").animate({
                                    width: parseInt(592 * c / 60) + "px"
                                }, 1e3),
                                    a("#cq-lastcq").html("再直播" + (60 - c) + "小时，主播就可获得观众送的高级酬勤了"),
                                    a(".cq_layer .sc1 i").css({
                                        "background-position": "0 -422px"
                                    }).attr("title", "主播已直播满30小时，可获得初级酬勤奖励"),
                                    a(".cq_layer .sc2 i").css({
                                        "background-position": "-155px -422px"
                                    }).attr("title", "主播已直播满40小时，可获得初级、中级酬勤奖励")) : c >= 30 ? (a("#cq-cqbar").animate({
                                    width: parseInt(592 * c / 60) + "px"
                                }, 1e3),
                                    a("#cq-lastcq").html("再直播" + (40 - c) + "小时，主播就可获得观众送的中级酬勤了"),
                                    a(".cq_layer .sc1 i").css({
                                        "background-position": "0 -422px"
                                    }).attr("title", "主播已直播满30小时，可获得初级酬勤奖励")) : c >= 0 && (a("#cq-cqbar").animate({
                                    width: parseInt(592 * c / 60) + "px"
                                }, 1e3),
                                    a("#cq-lastcq").html("再直播" + (30 - c) + "小时，主播就可获得观众送的初级酬勤了")),
                                a(".progressbar .sc").each(function () {
                                    a(this).css("margin-left", "-" + Math.floor(a(this).width() / 2) + "px")
                                })
                        }
                    })
            },
            present: function () {
                if (j.auto_send) {
                    var b = this
                        , d = this.config.type
                        , f = c.get("room.device_id")
                        , g = {
                        gid: "",
                        did: "",
                        dy: f
                    }
                        , h = [{
                        type: 1,
                        yw: 1e3,
                        yc: 15,
                        exp: 150,
                        gx: 150
                    }, {
                        type: 2,
                        yw: 2e3,
                        yc: 30,
                        exp: 300,
                        gx: 300
                    }, {
                        type: 3,
                        yw: 4e3,
                        yc: 50,
                        exp: 500,
                        gx: 500
                    }];
                    return $SYS.uid == $ROOM.owner_uid ? (a.dialog.tips_black("不能给自己送酬勤", 2),
                        !1) : void a.ajax({
                        type: "POST",
                        url: "/member/cq/buy",
                        data: {
                            owner_uid: $ROOM.owner_uid,
                            lv: d,
                            dy: f
                        },
                        dataType: "json",
                        success: function (c) {
                            switch (c.ret.result) {
                                case "0":
                                    var f = (parseInt(b.config.$personal_yc),
                                        a(".cq_btn").eq(d - 1))
                                        , i = document.createElement("div");
                                    a(i).addClass("cq_contribute"),
                                        3 === parseInt(d) ? a(i).html('<div class="cq_contribution_p"></div><span>贡献值+500</span>') : a(i).html('<div class="cq_contribution_p"></div><span>贡献值+' + 150 * d + "</span>"),
                                        f.append(i),
                                        a(i).animate({
                                            top: "-93px"
                                        }, 1e3).fadeOut(400, function () {
                                            a(this).remove()
                                        }),
                                        e.trigger("mod.userinfo.change", {
                                            current: {
                                                gold: b.number_format(c.ret.balance / 100).replace(".00", "")
                                            },
                                            change: {
                                                silver: h[d - 1].yw
                                            }
                                        }),
                                        e.trigger("mod.chouqin.change", d),
                                        a("#cq-usergold").html(b.number_format(c.ret.balance / 100).replace(".00", ""));
                                    break;
                                case "283":
                                    a.dialog({
                                        content: "鱼翅余额不足，点击获取！",
                                        title: "提示",
                                        icon: "warning",
                                        cancelVal: "取消",
                                        okVal: "充值",
                                        lock: !0,
                                        ok: function () {
                                            window.open("/web_game/welcome/18")
                                        },
                                        cancel: function () {
                                        }
                                    });
                                    break;
                                case 363:
                                    b.sendVerify(g, function () {
                                        b.present()
                                    });
                                    break;
                                default:
                                    a.dialog.tips_black("酬勤赠送失败", 2)
                            }
                        }
                    })
                }
            },
            sendVerify: function (b, c) {
                var d, e, f;
                f = b ? b : {},
                    c = a.isFunction(c) ? c : function () {
                    }
                    ,
                    e = function (b) {
                        a.ajax("/member/gift/verify", {
                            type: "post",
                            dataType: "json",
                            data: {
                                dy: f.dy,
                                task_ca: b
                            },
                            error: function () {
                                i.submit({
                                    point_id: "5.11.2.0",
                                    s: ""
                                }),
                                    d.destroy(),
                                    a.dialog.tips_black("赠送礼物失败！", 1.5)
                            },
                            success: function (b) {
                                var e = b.result;
                                0 == e ? (i.submit({
                                    point_id: "5.11.1.0"
                                }),
                                    d.destroy(),
                                    c()) : (d.refresh(),
                                    a.dialog.tips_black(b.msg, 1.5),
                                    i.submit({
                                        point_id: "5.11.2.0",
                                        ext: {
                                            s: b.msg
                                        }
                                    }))
                            }
                        })
                    }
                    ,
                    d = g.create({
                        title: "请输入验证码",
                        sence: "task",
                        lock: !0,
                        onSelectOver: e
                    })
            },
            bindEvt: function () {
                var b = this
                    , c = this.config.$el;
                this.tipScroll(),
                    c.find(".close").on("click", function (a) {
                        a.stopPropagation(),
                            a.preventDefault(),
                            b.close()
                    }),
                    c.on("click", ".cqgm", function () {
                        return b.config.type = a(this).attr("data-lv"),
                            b.present(),
                            !1
                    })
            }
        });
        var k = {
            init: function (a) {
                return new h(a)
            }
        };
        return e.on("mod.chouqin.auto.send.set", function (a) {
            j.auto_send = a
        }),
            k
    }),
    define("douyu/page/room/normal/mod/chat-color", ["jquery", "shark/class", "shark/observer"], function (a, b, c) {
        var d = null
            , e = b({
            init: function (b) {
                this.config = a.extend(!0, {}, {
                    $el: a("#js-color-barrage"),
                    isColor: !1,
                    indexColor: 0
                }, b),
                    this.bindEvent()
            },
            bindEvent: function () {
                var b = this
                    , d = function (a) {
                        a.preventDefault(),
                            a.stopPropagation()
                    }
                    ;
                this.config.$el.on("click", '[data-type="cbt"]', function (e) {
                    d(e);
                    var f = a(this)
                        , g = b.config.$el.find('[data-type="cbl"]');
                    b.config.isColor ? (f.html('<i class="c-icon"></i>普通弹幕').removeClass("c-btn-on").removeAttr("style"),
                        b.config.isColor = !1,
                        b.config.indexColor = 0,
                        c.trigger("mod.chat.msg.color.set", null)) : g.toggleClass("hide"),
                        c.trigger("mod.chat.exp.hide")
                }).on({
                    click: function (e) {
                        d(e);
                        var f = a(this).css("backgroundColor");
                        b.config.$el.find('[data-type="cbl"]').addClass("hide"),
                            b.config.$el.find('[data-type="cbt"]').addClass("c-btn-on").html('<i class="c-icon"></i>彩色弹幕').css({
                                color: f
                            }),
                            b.config.isColor = !0,
                            b.config.indexColor = a(this).index() + 1,
                            c.trigger("mod.chat.msg.color.set", f)
                    },
                    mouseenter: function () {
                        a(this).css({
                            "border-color": a(this).css("backgroundColor")
                        })
                    },
                    mouseleave: function () {
                        a(this).removeAttr("style")
                    }
                }, '[data-type="cbli"]'),
                    a(document).on("click", function () {
                        b.config.$el.find('[data-type="cbl"]').addClass("hide")
                    })
            }
        });
        return c.on("mod.chat.msg.color.get", function () {
            return d.config.indexColor
        }),
            c.on("mod.chat.msg.color.hide", function () {
                d.config.$el.find('[data-type="cbl"]').addClass("hide")
            }),
        {
            init: function (a) {
                d = new e(a)
            },
            val: function () {
                return d.config.indexColor
            }
        }
    }),
    define("douyu/page/room/normal/mod/chat-exp", ["jquery", "shark/class", "shark/util/lang/1.0", "shark/observer", "shark/util/template/1.0", "douyu/com/user", "douyu/com/animate"], function (a, b, c, d, e, f, g) {
        var h, i, j = {
            exp: {
                cookie: "showExp",
                state: {
                    open: "open",
                    close: "close"
                }
            }
        };
        h = b({
            getDoms: function () {
                this.doms = {
                    $chatSpeak: a(".chat-speak"),
                    $el: a(".face-box"),
                    $html: a("html"),
                    $body: a("body")
                }
            },
            init: function (b) {
                this.config = a.extend(!0, {}, {
                    emw: 42,
                    emh: 42,
                    emb: 1,
                    row: 6,
                    col: 7,
                    defaultThumbTop: 2,
                    fullpageThumbMove: !0,
                    currPage: 1,
                    sumPage: 0,
                    firstPage: 0,
                    lastPage: 0,
                    pageInfo: [],
                    faceArr: [],
                    state: j.exp.state.open
                }, b),
                    this.config.faceNum = this.config.row * this.config.col,
                    this.config.thumbTop = this.config.defaultThumbTop,
                    this.config.faceLen = 0,
                    this.config.thumbH = 0,
                    this.getDoms(),
                    this.render(),
                    this.bindEvent()
            },
            render: function () {
                this.observer = d.create(this),
                    this.observer.on("toggle", this.toggle),
                    this.renderFace()
            },
            renderFace: function () {
                var b = this;
                b.config.faceArr = [{
                    className: "face_101",
                    relName: "dy101",
                    title: "666"
                }, {
                    className: "face_102",
                    relName: "dy102",
                    title: "发呆"
                }, {
                    className: "face_103",
                    relName: "dy103",
                    title: "拜拜"
                }, {
                    className: "face_104",
                    relName: "dy104",
                    title: "晕"
                }, {
                    className: "face_105",
                    relName: "dy105",
                    title: "弱"
                }, {
                    className: "face_106",
                    relName: "dy106",
                    title: "傲慢"
                }, {
                    className: "face_107",
                    relName: "dy107",
                    title: "开心"
                }, {
                    className: "face_108",
                    relName: "dy108",
                    title: "奋斗"
                }, {
                    className: "face_109",
                    relName: "dy109",
                    title: "很酷"
                }, {
                    className: "face_110",
                    relName: "dy110",
                    title: "流泪"
                }, {
                    className: "face_111",
                    relName: "dy111",
                    title: "鄙视"
                }, {
                    className: "face_112",
                    relName: "dy112",
                    title: "得意"
                }, {
                    className: "face_113",
                    relName: "dy113",
                    title: "抠鼻"
                }, {
                    className: "face_114",
                    relName: "dy114",
                    title: "亲亲"
                }, {
                    className: "face_115",
                    relName: "dy115",
                    title: "偷笑"
                }, {
                    className: "face_116",
                    relName: "dy116",
                    title: "口罩"
                }, {
                    className: "face_117",
                    relName: "dy117",
                    title: "委屈"
                }, {
                    className: "face_118",
                    relName: "dy118",
                    title: "难过"
                }, {
                    className: "face_119",
                    relName: "dy119",
                    title: "吐血"
                }, {
                    className: "face_120",
                    relName: "dy120",
                    title: "大怒"
                }, {
                    className: "face_121",
                    relName: "dy121",
                    title: "赞"
                }, {
                    className: "face_122",
                    relName: "dy122",
                    title: "睡觉"
                }, {
                    className: "face_123",
                    relName: "dy123",
                    title: "骷髅"
                }, {
                    className: "face_124",
                    relName: "dy124",
                    title: "调皮"
                }, {
                    className: "face_125",
                    relName: "dy125",
                    title: "惊讶"
                }, {
                    className: "face_126",
                    relName: "dy126",
                    title: "撇嘴"
                }, {
                    className: "face_127",
                    relName: "dy127",
                    title: "拥抱"
                }, {
                    className: "face_128",
                    relName: "dy128",
                    title: "背锅"
                }, {
                    className: "face_129",
                    relName: "dy129",
                    title: "闭嘴"
                }, {
                    className: "face_130",
                    relName: "dy130",
                    title: "吃药"
                }, {
                    className: "face_131",
                    relName: "dy131",
                    title: "可怜"
                }, {
                    className: "face_132",
                    relName: "dy132",
                    title: "呕吐"
                }, {
                    className: "face_133",
                    relName: "dy133",
                    title: "敲打"
                }, {
                    className: "face_134",
                    relName: "dy134",
                    title: "心碎"
                }, {
                    className: "face_135",
                    relName: "dy135",
                    title: "嘘"
                }, {
                    className: "face_136",
                    relName: "dy136",
                    title: "中箭"
                }, {
                    className: "face_137",
                    relName: "dy137",
                    title: "抓狂"
                }, {
                    className: "face_001",
                    relName: "dy001",
                    title: "流汗"
                }, {
                    className: "face_002",
                    relName: "dy002",
                    title: "丢药"
                }, {
                    className: "face_003",
                    relName: "dy003",
                    title: "白眼"
                }, {
                    className: "face_004",
                    relName: "dy004",
                    title: "火箭"
                }, {
                    className: "face_005",
                    relName: "dy005",
                    title: "色"
                }, {
                    className: "face_006",
                    relName: "dy006",
                    title: "点蜡"
                }, {
                    className: "face_007",
                    relName: "dy007",
                    title: "抽烟"
                }, {
                    className: "face_008",
                    relName: "dy008",
                    title: "可爱"
                }, {
                    className: "face_009",
                    relName: "dy009",
                    title: "炸弹"
                }, {
                    className: "face_010",
                    relName: "dy010",
                    title: "吃丸子"
                }, {
                    className: "face_011",
                    relName: "dy011",
                    title: "害怕"
                }, {
                    className: "face_012",
                    relName: "dy012",
                    title: "疑问"
                }, {
                    className: "face_013",
                    relName: "dy013",
                    title: "阴险"
                }, {
                    className: "face_014",
                    relName: "dy014",
                    title: "害羞"
                }, {
                    className: "face_015",
                    relName: "dy015",
                    title: "笑哭"
                }, {
                    className: "face_016",
                    relName: "dy016",
                    title: "猪头"
                }, {
                    className: "face_017",
                    relName: "dy017",
                    title: "困"
                }];
                var d = (b.config.emw + b.config.emb) * b.config.col
                    , f = (b.config.emh + b.config.emb) * b.config.row;
                b.config.sectionH = f,
                    b.config.scrollbarH = f - 16,
                    b.config.faceLen = b.config.faceArr.length;
                var g = parseInt(b.config.faceLen / b.config.faceNum)
                    , h = b.config.faceLen % b.config.faceNum;
                h > 0 && (g += 1),
                    b.config.sumPage = g,
                    b.config.firstPage = 0,
                    b.config.lastPage = b.config.sumPage - 1,
                    b.config.thumbH = 1 * b.config.scrollbarH / g;
                for (var i = [], j = 0; g > j; j++)
                    i.push({
                        stoe: {
                            sIndex: j * b.config.faceNum,
                            eIndex: j == g - 1 ? b.config.faceLen - 1 : j * b.config.faceNum + (b.config.faceNum - 1)
                        },
                        currPage: j
                    });
                b.config.pageInfo = i;
                var k = c.string.join('<div class="scrollbar" style="height:' + b.config.scrollbarH + 'px">', '<div class="track" style="height: ' + b.config.scrollbarH + 'px">', '<div class="thumb" style="top: ' + b.config.defaultThumbTop + "px; height:" + b.config.thumbH + 'px">', '<div class="face_page" style="display:none">', '<div class="pagenum">0/0</div>', "</div>", "</div>", "</div>", "</div>", '<div class="facePad" id="facePad">', '<div class="new_face_list clearfix viewport" id="new_face_list">', '<div class="face_container overview clearfix">', "<% for(var i=0;i<pageInfo.length;i++) { %>", '<section class="section">', "<% for(var j=0;j<faceArr.length;j++) { %>", "<%if(j>=(i*faceNum)&&j<=(i*faceNum+(faceNum-1))) { %>", '<em class="<%=faceArr[j].className%>" rel="<%=faceArr[j].relName%>" name="faceimg" ftype="chat" title="<%=faceArr[j].title%>">', "</em>", "<% } %>", "<% } %>", "</section>", "<% } %>", "</div>", "</div>", "</div>", '<div class="up"></div>', '<div class="down"></div>', '<span class="face-arrow face-arrow1"></span>', '<span class="face-arrow face-arrow2"></span>')
                    , l = e.compile(k)
                    , m = l({
                    faceArr: b.config.faceArr,
                    pageInfo: b.config.pageInfo,
                    scrollbarH: b.config.scrollbarH,
                    defaultThumbTop: b.config.defaultThumbTop,
                    thumbH: b.config.thumbH,
                    faceNum: b.config.faceNum,
                    row: b.config.row,
                    col: b.config.col
                });
                b.doms.$el.html(m),
                    a("#new_face_list .face_container .section").each(function (c, d) {
                        var e = b.config.row * (b.config.col - 1);
                        a(d).find("em").length,
                            a(d).find("em").each(function (c, d) {
                                (c + 1) % b.config.col == 0 && c + 1 >= e ? a(d).addClass("emBRN emBBN") : (c + 1) % b.config.col != 0 && c + 1 >= e ? a(d).addClass("emBBN") : (c + 1) % b.config.col == 0 && e > c + 1 ? a(d).addClass("emBRN") : (c + 1) % b.config.col != 0 && e > c + 1 && a(d).addClass("")
                            })
                    }),
                    b.doms.$el.css({
                        width: d + 24 + 2 + "px",
                        height: f + 2 + "px",
                        top: -(f + 20) + "px"
                    }),
                    b.doms.$el.find(".facePad").css({
                        width: d + "px",
                        height: f + "px"
                    }),
                    b.doms.$el.find(".new_face_list").css({
                        width: d + "px",
                        height: f + "px"
                    }),
                    b.doms.$el.find(".face_container").css({
                        width: d + "px"
                    }),
                    b.doms.$el.find(".section").css({
                        width: d + "px",
                        height: f + "px"
                    })
            },
            down: function (b) {
                var c = i;
                c.config.isExcute = !0;
                var d = b || window.event;
                c.config.startY = d.pageY,
                    c.config.thumbY = this.offsetTop,
                    c.Move = c.processFn(c.move, this),
                    c.Up = c.processFn(c.up, this),
                    a(document).bind("mousemove", c.Move),
                    a(document).bind("mouseup", c.Up),
                    a(".thumb").bind("mouseup", c.Up),
                    a(".track").bind("mouseup", c.Up)
            },
            move: function (a) {
                var b = i;
                b.config.fullpageThumbMove = !1,
                    b.doms.$html.css({
                        "user-select": "none"
                    }),
                    b.doms.$body.css({
                        "user-select": "none"
                    });
                var c = a || window.event;
                b.config.endY = c.pageY;
                var d = b.config.thumbH
                    , e = b.config.defaultThumbTop + d * b.config.lastPage
                    , f = b.config.thumbY + (b.config.endY - b.config.startY);
                f <= b.config.defaultThumbTop ? f = b.config.defaultThumbTop : f >= e && (f = e),
                    this.style.top = f + "px";
                var g = (b.config.currPage - 1) * d - .5 * d + b.config.defaultThumbTop
                    , h = (b.config.currPage - 1) * d + .5 * d + b.config.defaultThumbTop;
                return b.config.isExcute && (b.config.endY - b.config.startY < 0 ? g >= f && b.pageUp() : f >= h && b.pageDown()),
                    !1
            },
            up: function (b) {
                var c = i;
                c.config.fullpageThumbMove = !1;
                var d = b || window.event;
                if (c.config.endY = d.pageY,
                        c.config.isExcute) {
                    var e = c.config.thumbH
                        , f = c.config.defaultThumbTop + e * c.config.lastPage
                        , g = c.config.thumbY + (c.config.endY - c.config.startY);
                    g <= c.config.defaultThumbTop ? g = c.config.defaultThumbTop : g >= f && (g = f);
                    var h = (c.config.currPage - 1) * e - .5 * e + c.config.defaultThumbTop
                        , j = (c.config.currPage - 1) * e + .5 * e + c.config.defaultThumbTop;
                    c.config.endY - c.config.startY < 0 ? h >= g ? (c.pageUp(),
                        this.style.top = g + "px") : (c.config.thumbTop = c.config.defaultThumbTop + (c.config.currPage - 1) * e,
                        a(".thumb").css({
                            top: c.config.thumbTop + "px"
                        })) : g >= j ? (c.pageDown(),
                        this.style.top = g + "px") : (c.config.thumbTop = c.config.defaultThumbTop + (c.config.currPage - 1) * e,
                        a(".thumb").css({
                            top: c.config.thumbTop + "px"
                        })),
                        c.config.isExcute = !1
                }
                a(document).unbind("mousemove", c.Move),
                    a(document).unbind("mouseup", c.Up),
                    a(".thumb").unbind("mouseup", c.Up),
                    a(".track").unbind("mouseup", c.Up)
            },
            processFn: function (a, b) {
                return function (c) {
                    a.call(b, c)
                }
            },
            getPosition: function (a, b) {
                b = b || document.body;
                var c = a.offsetLeft
                    , d = a.offsetTop;
                for (p = a.offsetParent; (p != b || p != document.body) && p;)
                    window.navigator.userAgent.indexOf("MSIE 8.0") > -1 ? (c += p.offsetLeft,
                        d += p.offsetTop) : (c += p.offsetLeft + p.clientLeft,
                        d += p.offsetTop + p.clientTop),
                        p = p.offsetParent;
                var e = {};
                return e.x = c,
                    e.y = d,
                    e
            },
            face_page: function () {
                var b = this
                    , c = b.config.sumPage
                    , d = b.config.currPage
                    , e = b.config.thumbH;
                a(".face_page .pagenum").html(d + "/" + c);
                var f = (e - a(".pagenum").height()) / 2;
                a(".face_page").css({
                    display: "none"
                }),
                    a(".face_page").css({
                        top: f + "px"
                    }),
                    a(".face_page").stop().fadeIn(1500, function () {
                        a(".face_page").stop().fadeOut("fast", function () {
                            a(".face_page").css({
                                display: "none"
                            })
                        })
                    }),
                1 == b.config.fullpageThumbMove && (b.config.thumbTop = b.config.defaultThumbTop + (d - 1) * e,
                    a(".thumb").css({
                        top: b.config.thumbTop + "px"
                    }))
            },
            _addWheel: function (a, b) {
                function c(a) {
                    var c = a || event
                        , d = c.wheelDelta ? c.wheelDelta < 0 : c.detail > 0;
                    return b(d),
                    c.preventDefault && c.preventDefault(),
                        !1
                }

                a.onmousewheel = c,
                a.addEventListener && a.addEventListener("DOMMouseScroll", c, !1)
            },
            processWheel: function (a) {
                i.config.fullpageThumbMove = !0,
                    a ? i.pageDown() : i.pageUp()
            },
            moveSection: function () {
                var a = i.doms.$el.find(".face_container").get(0)
                    , b = -(i.config.currPage - 1) * i.config.sectionH;
                d.trigger("com.animate", {
                    ele: a,
                    styleObj: {
                        top: b
                    }
                })
            },
            pageUp: function () {
                var a = this;
                a.config.currPage <= 1 ? a.config.currPage = 1 : a.config.currPage--,
                    a.moveSection(),
                    a.face_page()
            },
            pageDown: function () {
                var a = this;
                a.config.currPage >= a.config.sumPage ? a.config.currPage = a.config.sumPage : a.config.currPage++,
                    a.moveSection(),
                    a.face_page()
            },
            toggle: function () {
                this.config.state === j.exp.state.open ? this.close() : this.open()
            },
            open: function () {
                this.config.state = j.exp.state.open,
                    this.doms.$el.show(),
                    d.trigger("mod.chat.msg.color.hide")
            },
            close: function () {
                this.config.state = j.exp.state.close,
                    this.doms.$el.hide()
            },
            bindEvent: function () {
                var b = this;
                this.doms,
                    a(document).on("click touchstart", ".face-box .up", function (a) {
                        i.config.fullpageThumbMove = !0,
                            i.pageUp()
                    }),
                    a(document).on("click touchstart", ".face-box .down", function (a) {
                        i.config.fullpageThumbMove = !0,
                            i.pageDown()
                    }),
                    b.config.isExcute = !1,
                    a(document).delegate(".thumb", "mousedown", function (a) {
                        b.down.call(this, a)
                    }),
                    a(".face-box .face_container em").on("click", function (c) {
                        var e = f.check();
                        if (c.preventDefault(),
                                e) {
                            "这里输入聊天内容" == a("#js-send-msg").find('[data-type="cont"]').val && a("#chart_content").val("");
                            var g = a(this).attr("ftype")
                                , h = a(this).attr("rel");
                            "chat" == g && (b.observer.trigger("toggle", b.config.state),
                                d.trigger("mod.chat.msg.exp", h))
                        } else
                            f.show()
                    }),
                    a(".face-box .face_container em").each(function (b, c) {
                        a(c).on("mouseover", function (b) {
                            a(this).addClass("hoverEm").siblings("em").removeClass("hoverEm")
                        }),
                            a(c).on("mouseout", function (b) {
                                a(this).removeClass("hoverEm")
                            })
                    }),
                    a(".track").on("click", function (c) {
                        i.config.fullpageThumbMove = !0;
                        var d = c || window.event
                            , e = d.pageY
                            , f = b.config.thumbTop + i.getPosition(a(".face-box").get(0), a("#room_container").get(0)).y;
                        "thumb" != c.target.className && (f > e ? i.pageUp() : i.pageDown())
                    }),
                    a(".expression .e-btn").removeAttr("href"),
                    a(".expression").on("click", ".e-btn", function (a) {
                        return i.observer.trigger("toggle", b.config.state),
                            a.preventDefault(),
                            a.stopPropagation(),
                            !1
                    });
                var c = a(".face_container");
                b._addWheel(c[0], function (a) {
                    b.processWheel(a)
                })
            }
        }),
            d.on("mod.chat.exp.hide", function () {
                i.close()
            });
        var k = {
            init: function (a) {
                return i = new h(a),
                    i.observer.trigger("toggle", i.config.state),
                    g.init(),
                    i
            },
            onToggle: function () {
                i && i.observer.trigger("toggle")
            }
        };
        return k
    }),
    define("douyu/page/room/normal/mod/chat-gift", ["jquery", "shark/observer", "shark/util/cookie/1.0", "shark/util/lang/1.0", "shark/util/template/1.0", "shark/util/flash/data/1.0", "douyu/context", "douyu/com/user", "douyu/page/room/base/api"], function (a, b, c, d, e, f, g, h, i) {
        var j = null
            , k = null
            , l = null
            , m = {
            runtimeStep: 500,
            autoStartListen: !1,
            evts: {
                empty: null
            }
        }
            , n = null
            , o = null;
        j = {
            emptyFn: function () {
            },
            emptyArr: [],
            emptyObj: {},
            nodeType: {
                gift: "gift",
                peck: "peck"
            },
            nodeStatus: {
                birth: "birth",
                render: "render",
                live: "live",
                destroy: "destroy",
                heart: "heart"
            },
            nodeBehavior: {
                render: "render",
                destroy: "destroy",
                heart: "heart"
            },
            listenStatus: {
                die: "die",
                live: "live"
            }
        },
            k = {
                isIE: navigator.appVersion.indexOf("MSIE") > 0 || navigator.appVersion.indexOf("Trident/7.0") > 0,
                isIE7: navigator.appVersion.indexOf("MSIE 7.0;") > 0,
                isFF: navigator.userAgent.indexOf("Firefox") > 0,
                supportCss3: function (a) {
                    var b, c = ["webkit", "Moz", "ms", "o"], d = [], e = document.documentElement.style, f = function (a) {
                            return a.replace(/-(\w)/g, function (a, b) {
                                return b.toUpperCase()
                            })
                        }
                        ;
                    for (b in c)
                        d.push(f(c[b] + "-" + a));
                    d.push(f(a));
                    for (b in d)
                        if (d[b] in e)
                            return !0;
                    return !1
                }
            },
            l = function (a) {
                this.init(a)
            }
            ,
            l.create = function (a) {
                return new l(a)
            }
            ,
            a.extend(!0, l.prototype, {
                init: function (b) {
                    this.config = a.extend(!0, m, b || {}),
                        this.config.queue = [],
                        this.config.listenStatus = j.listenStatus.die,
                    this.config.autoStartListen && this._startListen()
                },
                add: function (a) {
                    return this.config.queue.push(a),
                        this._execNodeBehavior(a, j.nodeBehavior.render, {
                            status: j.nodeStatus.birth,
                            index: this.config.queue.length,
                            node: a,
                            timeline: this
                        }),
                        !0
                },
                update: function (a) {
                    var b, c = this, e = this._getNodeId(a);
                    return d.each(this.config.queue, function (a, c) {
                        return e === a.id ? (b = c,
                            !1) : void 0
                    }),
                        void 0 === b ? !1 : (c.config.queue[b] = a,
                            this._execNodeBehavior(c.config.queue[b], j.nodeBehavior.render, {
                                status: j.nodeStatus.render,
                                index: b,
                                node: c.config.queue[b],
                                timeline: this
                            }),
                            !0)
                },
                heart: function (a, b) {
                    var c, e = this, f = this._getNodeId(a);
                    return d.each(this.config.queue, function (a, b) {
                        return f === a.id ? (c = b,
                            !1) : void 0
                    }),
                        void 0 === c ? !1 : (this._execNodeBehavior(e.config.queue[c], j.nodeBehavior.heart, {
                            status: j.nodeStatus.heart,
                            index: c,
                            node: e.config.queue[c],
                            now: b,
                            timeline: this
                        }),
                            !0)
                },
                destroy: function (a, b) {
                    var c, e = this, f = this._getNodeId(a);
                    return d.each(this.config.queue, function (a, b) {
                        return f === a.id ? (c = b,
                            e.config.queue[c].__die__ = !0,
                            !1) : void 0
                    }),
                        void 0 === c ? !1 : void this._execNodeBehavior(e.config.queue[c], j.nodeBehavior.destroy, {
                            status: j.nodeStatus.destroy,
                            index: c,
                            node: e.config.queue[c],
                            timeline: this
                        }, function () {
                            b === !0 && e.remove(a)
                        })
                },
                remove: function (a) {
                    var b = this._getNodeId(a)
                        , c = [];
                    d.each(this.config.queue, function (a, d) {
                        b !== a.id && c.push(a)
                    }),
                        this.config.queue = c
                },
                clear: function (a) {
                    a || (this.config.queue = []);
                    var b = []
                        , c = ""
                        , e = [];
                    d.each(a, function (a, c) {
                        b.push(a.id)
                    }),
                        c = b.join("-"),
                        d.each(this.config.queue, function (a, b) {
                            c.indexOf(a.id) < 0 && e.push(a)
                        }),
                        this.config.queue = e
                },
                each: function (a) {
                    d.each(this.config.queue, function (b, c) {
                        return b.__status === j.nodeStatus.destroy ? !0 : a(b, c) === !1 ? !1 : void 0
                    })
                },
                length: function () {
                    return this.config.queue.length
                },
                _runtime: function () {
                    var a = (new Date).getTime()
                        , b = []
                        , c = this;
                    return d.each(this.config.queue, function (d, e) {
                        return d.__die__ ? (b.push(d),
                            !0) : (c._isNodeTimeout(d, a) && c.destroy(d),
                            void c.heart(d, {
                                ntime: a
                            }))
                    }),
                        this.clear(b),
                    this.config.listenStatus === j.listenStatus.live
                },
                _startListen: function () {
                    var b = this
                        , c = function () {
                            b.config.listenStatus = j.listenStatus.live,
                                d.interval(a.proxy(b._runtime, b), b.config.runtimeStep, !0)
                        }
                        ;
                    this.config.listenStatus === j.listenStatus.live ? (this._stopListen(),
                        setTimeout(c, this.config.runtimeStep)) : c()
                },
                _stopListen: function () {
                    this.config.listenStatus = j.listenStatus.die
                },
                _execNodeBehavior: function (b, c, d, e) {
                    var f = b[c];
                    return b && a.isFunction(f) ? b.scope ? f.call(b.scope, d, e) : f(d, e) : void 0
                },
                _isNodeTimeout: function (a, b) {
                    return a.timeout ? b - a.createTime >= a.timeout : !1
                },
                _getNodeId: function (a) {
                    return "string" == typeof a ? a : a.id
                }
            }),
            n = {
                queue: [],
                cache: {},
                isRunling: !1,
                reg: function (a, b) {
                    n.cache[a] = b
                },
                use: function (a, b) {
                    var c = n.cache[a];
                    return c ? "function" == typeof c ? c(b) : c : void 0
                },
                run: function (a) {
                    return 0 === arguments.length ? n.isRunling : void (n.isRunling = a === !0)
                },
                push: function (a) {
                    n.queue.push(a)
                },
                next: function (a, b) {
                    return a ? this.query(a, b) : n.queue.shift()
                },
                hasNext: function (a, b) {
                    return a ? this.query(a, b) : n.queue.length > 0
                },
                query: function (a, b) {
                    for (var c, d, e, f = 0, g = n.queue.length, h = a.split("."), i = 0, j = h.length, k = []; g > f; f++) {
                        for (c = n.queue[f],
                                 i = 0; j > i && (c = c[h[i]]); i++)
                            ;
                        if (i === j && c === b) {
                            for (d = f,
                                     e = n.queue[f],
                                     f = 0; g > f; f++)
                                f !== d && k.push(n.queue[f]);
                            n.queue = k;
                            break
                        }
                    }
                    return e
                }
            };
        var p = null
            , q = function (a) {
            this.init(a)
        }
            , r = {
            target: "#js-chat-cont",
            cssbox: "#js-chat-cont",
            maxbatter: 9999
        };
        q.create = function (a) {
            return new q(a)
        }
            ,
            a.extend(!0, q.prototype, {
                init: function (b) {
                    this.config = a.extend(!0, r, b, {
                        giftNameMap: {
                            1: "100鱼丸",
                            2: "520",
                            3: "赞",
                            4: "666",
                            5: "飞机",
                            6: "火箭",
                            8: "初级酬勤",
                            9: "中级酬勤",
                            10: "高级酬勤"
                        },
                        autoAdd: !0,
                        supCss3Trans: k.supportCss3("transform")
                    }),
                        this.render(),
                        this.bindEvt()
                },
                render: function () {
                    this.$batter1 = a('<div class="giftbatter-box giftbatter-box1"></div>'),
                        this.$batter2 = a('<div class="giftbatter-box giftbatter-box2"></div>'),
                        this.$cssbox = a(this.config.cssbox),
                        this.$target = a(this.config.target),
                        this.$target.append(this.$batter1),
                        this.$target.append(this.$batter2)
                },
                target: function (b) {
                    return b ? (this.$target = a(b),
                        this.$target.append(this.$batter1),
                        void this.$target.append(this.$batter2)) : this.$target
                },
                cssbox: function (b) {
                    return b ? void (this.$cssbox = a(b)) : this.$cssbox
                },
                autoAdd: function (a) {
                    this.config.autoAdd = a === !0
                },
                add: function (b) {
                    if (this.config.autoAdd) {
                        var c, d, e = this;
                        if (l.each(function (a, d) {
                                return a.TYPE === j.nodeType.gift && b.viewc.name === a.viewc.name && b.viewc.style === a.viewc.style ? (c = a,
                                    !1) : void 0
                            }),
                                c) {
                            if (1 === b.viewc.effect) {
                                b.peckc.id = s._nextId();
                                var f = this.$batter2.find(".giftbatter-item-right")
                                    , g = "function" == typeof b.__renderCallback ? b.__renderCallback : function () {
                                    }
                                    ;
                                if (f.length > 1) {
                                    c.view.css("top", 20),
                                        this.$batter2.prepend(c.view);
                                    var h = c.view.outerHeight(!0);
                                    f.not(c.view).each(function (b) {
                                        a(this).animate({
                                            top: 20 + (h + 20) * (b + 1)
                                        }, 300)
                                    })
                                }
                                n.use("peckDown", {
                                    node: b.peckc
                                }),
                                    g()
                            }
                            d = this.findRes(c.type),
                                c = a.extend(!0, c, b, d, {
                                    createTime: (new Date).getTime() + 300,
                                    scope: this
                                }),
                                l.update(c)
                        } else if (c = this._makeNode(b),
                            1 === c.viewc.effect)
                            if (this.$batter2.append(c.view),
                                1 === c.viewc.ts && c.viewc.st > 0) {
                                var i = this.$batter2.find(".giftbatter-item-right");
                                if (i.length > 0) {
                                    var k = c.view.outerHeight(!0);
                                    i.each(function (b) {
                                        a(this).css({
                                            top: 20 + (k + 20) * b,
                                            left: 0
                                        })
                                    }),
                                        c.timeout = c.viewc.st,
                                        l.add(c)
                                }
                            } else {
                                var g = "function" == typeof c.__renderCallback ? c.__renderCallback : function () {
                                    }
                                    ;
                                c.view.css("top", (this.$cssbox.height() - c.view.height()) / 2).animate({
                                    left: 0
                                }, 300, function () {
                                    setTimeout(function () {
                                        c.view.animate({
                                            top: 20
                                        }, 1e3, function () {
                                            e.$batter2.prepend(c.view);
                                            var b = e.$batter2.find(".giftbatter-item-right");
                                            if (b.length > 1) {
                                                var d = c.view.outerHeight(!0);
                                                b.not(c.view).each(function (b) {
                                                    a(this).animate({
                                                        top: 20 + (d + 20) * (b + 1)
                                                    }, 300)
                                                }),
                                                    c.createTime = (new Date).getTime() + 300 * b.length
                                            } else
                                                c.createTime = (new Date).getTime();
                                            l.add(c),
                                                n.use("peckDown", {
                                                    node: c.peckc
                                                }),
                                                g()
                                        })
                                    }, 200)
                                })
                            }
                        else
                            this.$batter1.append(c.view),
                            1 === c.viewc.ts && (c.timeout = c.viewc.st),
                                l.add(c);
                        this.overflow()
                    }
                },
                remove: function (a) {
                    l.remove(a)
                },
                bindEvt: function () {
                    var c = this;
                    a(window).resize(function () {
                        c.overflow(),
                            c.relayout()
                    }),
                        b.on("mod.chat.gift.layout", function () {
                            c.overflow(),
                                c.relayout()
                        })
                },
                overflow: function () {
                    var b = 0
                        , c = this.$cssbox.height();
                    this.$batter2.find(".giftbatter-item-right").each(function (c) {
                        b += a(this).outerHeight(!0) + 25
                    }),
                        this.$batter2.css({
                            height: b > c ? c : "auto",
                            overflow: b > c ? "hidden" : "visible"
                        })
                },
                relayout: function () {
                    return this.$batter1.find(".giftbatter-item").length ? (this.$cssbox.length && this.$batter1.css({
                        "max-height": this.$cssbox.height()
                    }),
                        this.$batter1.show(),
                        this.$batter1.css("top", (this.$target.height() - this.$batter1.height()) / 2),
                        void this.$batter1.scrollTop(this.$batter1.get(0).scrollHeight)) : void this.$batter1.hide()
                },
                findRes: function (a) {
                    var b = this.config.resource[a];
                    return b ? {
                        viewc: {
                            gift: b.name,
                            back: b.bimg,
                            head: b.himg,
                            effect: b.ef,
                            uc: b.urgb,
                            gc: b.grgb,
                            bc: b.brgb,
                            dc: b.drgb
                        },
                        timeout: b.stay_time
                    } : {}
                },
                _nextId: function () {
                    return "gift-node-" + l.length() + "-" + (new Date).getTime()
                },
                _makeNode: function (b) {
                    var c = {
                        id: this._nextId(),
                        type: b.type,
                        render: a.proxy(this._nodeRender, this),
                        destroy: a.proxy(this._nodeDestroy, this),
                        scope: this
                    }
                        , d = this.findRes(c.type);
                    return c = a.extend(!0, {}, c, b, d),
                        c.view = this._makeNodeView(c),
                        c
                },
                _makeNodeView: function (b) {
                    var c, f, g, h;
                    return b.viewc.clsIdx = this._getNodeClassIndex(b),
                        b.viewc.gift = b.viewc.gift ? b.viewc.gift : this._getNodeGiftName(b),
                        b.viewc.countstrs = String(b.viewc.count).split(""),
                        b.viewc.dire = 1 === b.viewc.effect ? "right" : "left",
                        c = d.string.join('<div data-id="<%=id%>" class="giftbatter-item giftbatter-item-<%=item.dire%> item-<%=item.clsIdx%>" data-user="<%=item.name%>" data-clsidx="<%=item.clsIdx%>">', '<div class="item-back item-back-<%=item.clsIdx%>"><img src="<%=item.back%>" /></div>', "<% if (item.head) { %>", '<div class="item-head item-head-<%=item.clsIdx%>" style="border-color: <%=item.bc%>;"><img src="<%=item.head%>" /></div>', "<% } %>", '<div class="item-name item-name-<%=item.clsIdx%>" style="color: <%=item.uc%>;" title="<%=item.name%>"><%=item.name%></div>', '<div class="item-gift item-gift-<%=item.clsIdx%> clearfix"><span class="fl" style="color: <%=item.dc%>;">送出</span><span class="<%=item.clsIdx === 2 ? "gname" : ""%> fr" style="color: <%= item.gc %>;"><%=item.gift%></span></div>', '<div class="item-bat item-bat-<%=item.clsIdx%>"></div>', '<div class="item-count item-count-<%=item.clsIdx%> clearfix">', '<div class="nbox">', "<% for(var j=0; j<item.countstrs.length; j++) { %>", "<% var str = item.countstrs[j]; %>", '<span class="n n<%=str%>"></span>', "<% } %>", "</div>", "</div>", "</div>"),
                        f = e.compile(c),
                        g = f({
                            id: b.id,
                            item: b.viewc
                        }),
                        h = a(g)
                },
                _makeNodeContentHtml: function (a) {
                    var b, c, f;
                    return a.viewc.clsIdx = this._getNodeClassIndex(a),
                        a.viewc.gift = a.viewc.gift ? a.viewc.gift : this._getNodeGiftName(a),
                        a.viewc.countstrs = String(a.viewc.count).split(""),
                        b = d.string.join('<div class="item-back item-back-<%=item.clsIdx%>"><img src="<%=item.back%>" /></div>', "<% if (item.head) { %>", '<div class="item-head item-head-<%=item.clsIdx%>" style="border-color: <%=item.bc%>;"><img src="<%=item.head%>" /></div>', "<% } %>", '<div class="item-name item-name-<%=item.clsIdx%>" style="color: <%=item.uc%>;" title="<%=item.name%>"><%=item.name%></div>', '<div class="item-gift item-gift-<%=item.clsIdx%> clearfix"><span class="fl" style="color: <%=item.dc%>;">送出</span><span class="<%=item.clsIdx === 2 ? "gname" : ""%> fr" style="color: <%= item.gc %>;"><%=item.gift%></span></div>', '<div class="item-bat item-bat-<%=item.clsIdx%>"></div>', '<div class="item-count item-count-<%=item.clsIdx%> clearfix">', '<div class="nbox">', "<% for(var j=0; j<item.countstrs.length; j++) { %>", "<% var str = item.countstrs[j]; %>", '<span class="n n<%=str%>"></span>', "<% } %>", "</div>", "</div>"),
                        c = e.compile(b),
                        f = c({
                            item: a.viewc
                        })
                },
                _nodeRender: function (a) {
                    return a.status === j.nodeStatus.birth ? (1 !== a.node.viewc.effect && (1 === a.node.viewc.ts ? a.node.view.css({
                        left: 0
                    }) : a.node.view.animate({
                        left: 0
                    }, 300),
                        this.relayout()),
                    1 !== a.node.viewc.ts && this._nodeRenderFX(a),
                        !0) : a.status === j.nodeStatus.render ? (this._nodeReRender(a),
                    1 !== a.node.viewc.effect && this.relayout(),
                        this._nodeRenderFX(a),
                        !0) : !1
                },
                _nodeReRender: function (a) {
                    var b = a.node.view.data("clsidx")
                        , c = this._getNodeClassIndex(a.node)
                        , d = this._makeNodeContentHtml(a.node);
                    a.node.view.removeClass("item-" + b).addClass("item-" + c).data("clsidx", c),
                        a.node.view.html(d)
                },
                _nodeRenderFX: function (b) {
                    if (k.isIE) {
                        var c = b.node.view.find(".item-count .nbox")
                            , d = parseInt(c.css("right")) || 0
                            , e = d - 10
                            , f = parseInt(c.css("bottom")) || 0
                            , g = f + 10;
                        this.config.supCss3Trans ? c.css({
                            "-ms-transform": "scale(1.3)",
                            bottom: g,
                            right: e
                        }).animate({
                            "-ms-transform": "scale(1)",
                            bottom: f,
                            right: d
                        }, 300, function () {
                            a(this).removeAttr("style")
                        }) : (k.isIE7 && (e = d - 20,
                            g = f + 10),
                            c.css({
                                zoom: 1.3,
                                bottom: g,
                                right: e
                            }).animate({
                                zoom: 1,
                                bottom: f,
                                right: d
                            }, 300, function () {
                                a(this).removeAttr("style")
                            }))
                    } else {
                        var c = b.node.view.find(".item-count .nbox")
                            , d = parseInt(c.css("right")) || 0
                            , e = d - 22
                            , f = parseInt(c.css("bottom")) || 0
                            , g = f + 2
                            , h = 1.3
                            , i = 1;
                        k.isFF && (h = 1.1,
                            g = f + 10,
                            e = d - 10),
                            c.css({
                                zoom: h,
                                "-moz-transform": "scale(" + h + ")",
                                bottom: g,
                                right: e
                            }).animate({
                                zoom: i,
                                "-moz-transform": "scale(" + i + ")",
                                bottom: f,
                                right: d
                            }, 300, function () {
                                a(this).removeAttr("style")
                            })
                    }
                },
                _nodeDestroy: function (b, c) {
                    if (!(location.href.indexOf("giftdebug") > 0)) {
                        var d = this;
                        this.$target.find(".giftbatter-item[data-id=" + b.node.id + "]").animate({
                            left: this.$target.outerWidth()
                        }, 300, function () {
                            a(this).remove(),
                                d.relayout(),
                                d.overflow(),
                            a.isFunction(c) && c()
                        })
                    }
                },
                _getNodeId: function (a) {
                    return "string" == typeof a ? a : a.id
                },
                _getNodeClassIndex: function (a) {
                    return a.viewc.style
                },
                _getNodeGiftName: function (a) {
                    var b = this._getNodeClassIndex(a);
                    return this.config.giftNameMap[b]
                }
            });
        var s = null
            , t = function (a) {
            this.init(a)
        }
            , u = {
            target: ".chat",
            cssbox: "#js-chat-cont"
        };
        return t.create = function (a) {
            return new t(a)
        }
            ,
            a.extend(!0, t.prototype, {
                init: function (b) {
                    this.config = a.extend(!0, u, b, {
                        cookieName: "peck_ids",
                        isShow: !1,
                        isGet: !0
                    }),
                        this.render(),
                        this.bindEvt()
                },
                render: function () {
                    var c = d.string.join('<div class="peck peck-loading" id="right_col_peck">', '<div class="peck-num"><span>x</span><strong class="peck-number"></strong><i></i></div>', '<div class="peck-status"><div class="peck-cd"></div><div class="peck-cdn">loading...</div></div>', '<div class="peck-tip">', '<div><span><img class="peck-img" src="' + $SYS.res_url + 'douyu/images/defaultAvatar.png?20160310"/></span><strong class="peck-uname"></strong></div>', '<p class="peck-tip-status"></p>', '<i class="peck-tip-arrow"></i>', "</div>", "</div>");
                    this.$peck = a(c),
                        this.$target = a(this.config.target),
                        this.$cssbox = a(this.config.cssbox),
                        this.$target.append(this.$peck),
                        this.config.isBindShow = !1,
                        this.config.isUnbind = !1,
                        b.trigger("douyu.avatar.get", $SYS.uid, "small", function (b) {
                            a("#right_col_peck .peck-tip .peck-img").attr("src", b)
                        })
                },
                target: function (b) {
                    return b ? (this.$target = a(b),
                        void this.$target.append(this.$peck)) : this.$target
                },
                cssbox: function (b) {
                    return b ? void (this.$cssbox = a(b)) : this.$cssbox
                },
                add: function (b) {
                    for (var d = a.isArray(b) ? b : [b], e = [], f = d.length, g = c.get(this.config.cookieName), h = g ? g.split(",") : [], i = h.length, j = !0, k = 0; f > k; k++) {
                        j = !0;
                        for (var m = 0; i > m; m++)
                            if (d[k].pid == h[m]) {
                                j = !1;
                                break
                            }
                        j && e.push(d[k])
                    }
                    for (var n, k = 0, o = e.length; o > k; k++)
                        n = this.makeNode(e[k]),
                            l.add(n);
                    this.toggle()
                },
                isShow: function () {
                    return this.config.isShow
                },
                isGet: function () {
                    return this.config.isGet
                },
                show: function () {
                    this.config.isShow = !0,
                        this.$peck.css({
                            top: this.$target.outerHeight() - a("#js-fans-rank").outerHeight(!0) - this.$peck.height() - 20 - a("#js-chat-notice").outerHeight(!0)
                        }),
                        this.$peck.fadeIn("fast")
                },
                hide: function () {
                    this.config.isShow = !1,
                        this.$peck.fadeOut("slow")
                },
                toggle: function () {
                    var a = this.getSource();
                    a.length ? (this.show(),
                        this.changeView(a)) : this.hide()
                },
                save: function (a) {
                    var b = c.get(this.config.cookieName);
                    b && b.indexOf(a) >= 0 || (b = null === b ? "" : b,
                        b += a + ",",
                        c.set(this.config.cookieName, b, 360))
                },
                getSource: function () {
                    var a = [];
                    return l.each(function (b, c) {
                        b.TYPE === j.nodeType.peck && b.__die__ !== !0 && a.push(b)
                    }),
                        a
                },
                getLastDelayTime: function () {
                    var a = this.getSource();
                    return a.length ? a[a.length - 1].delayTime : 0
                },
                isUnbind: function (b) {
                    var c, f, g, h = this;
                    if (c = d.string.join("<% if ( status > 0 ) { %>", '<div class="peck-tips">', '<a href="javascript:;" data-type="close" class="peck-tips-close"></a>', "<p>", "绑定", "<% if ( status === 1 ) { %>", "<span>邮箱</span>和<span>手机</span>", "<% } else if ( status === 2 ) { %>", "<span>邮箱</span>", "<% } else if ( status === 3 ) { %>", "<span>手机</span>", "<% } %>", "后，才可以领取宝箱里的鱼丸哦！", "</p>", '<p class="link"><a href="<%= url %>">立即绑定</a></p>', "</div>", "<% } %>"),
                            f = e.compile(c),
                            g = f({
                                status: b.status,
                                url: b.url
                            }),
                            this.config.isBindShow = b.status > 0,
                            this.config.isUnbind = b.status > 0,
                        this.$peck.find(".peck-tips").length || this.$peck.append(g),
                            this.$peck.data("bind", b.status > 0)[b.status > 0 ? "addClass" : "removeClass"]("noBind").find(".peck-cdn")[b.status > 0 ? "addClass" : "removeClass"]("noBind"),
                            this.config.isBindShow) {
                        var i = this.$peck.find(".peck-tip")
                            , j = this.$peck.find(".peck-tips");
                        this.$peck.on("click", ".peck-tips", function (a) {
                            a.stopPropagation()
                        }).on("click", function (a) {
                            a.stopPropagation(),
                                "block" === j.css("display") ? (j.stop(!0, !0).fadeOut(400),
                                    h.config.isBindShow = !1) : (j.stop(!0, !0).fadeIn(400),
                                    h.config.isBindShow = !0,
                                    i.stop(!0, !0).fadeOut(400))
                        }),
                            a(document).on("click", function () {
                                j.stop(!0, !0).fadeOut(400),
                                    h.config.isBindShow = !1
                            }),
                            j.on("click", '[data-type="close"]', function (a) {
                                a.preventDefault(),
                                    a.stopPropagation(),
                                    j.stop(!0, !0).fadeOut(400),
                                    h.config.isBindShow = !1
                            })
                    }
                },
                changeView: function (a) {
                    var c = a[0]
                        , d = a.length
                        , e = this.$peck.find(".peck-num")
                        , f = this;
                    this.config.isUnbind && (this.$peck.find(".peck-tips").show(),
                        f.config.isBindShow = !0,
                        this.$peck.find(".peck-tip").stop(!0, !0).fadeOut(400)),
                        this.config.currentPid = c.pid,
                        this.$peck.css({
                            "background-image": "url(" + c.gci + ")"
                        }).data("switch", !0).data("pid", c.pid).removeClass("peck-open peck-close").addClass("peck-loading").find(".peck-cdn").text("loading..."),
                        e[d > 1 ? "show" : "hide"]().css({
                            "margin-left": -(e.outerWidth() / 2)
                        }).find(".peck-number").text(d),
                        b.trigger("douyu.avatar.get", c.uid, "small", function (a) {
                            f.$peck.find(".peck-img").attr("src", a)
                        }),
                        this.$peck.find(".peck-uname").text(c.uname).attr("title", c.uname),
                        this.$peck.removeClass("peck-open peck-close").find(".peck-cd").stop(!0, !0).css("width", 0).animate({
                            width: "100%"
                        }, c.delayTime, function () {
                            f.$peck.removeClass("peck-loading peck-open").addClass("peck-close")
                        }),
                        this.$peck.find(".peck-tip-status").html("领取未开始，请您耐心等待~"),
                        c.start > 0 ? this.config.isGet = !0 : this.config.isGet = !1
                },
                bindEvt: function () {
                    var a = this
                        , b = this.$peck.find(".peck-tip");
                    this.$peck.on("mouseenter", function () {
                        a.config.isBindShow || b.stop(!0, !0).fadeIn(400)
                    }).on("mouseleave", function () {
                        a.config.isBindShow || b.stop(!0, !0).fadeOut(400)
                    })
                },
                makeNode: function (b) {
                    return b = a.extend({}, b, {
                        TYPE: j.nodeType.peck,
                        id: this._nextId(),
                        ctime: (new Date).getTime(),
                        heart: a.proxy(this._nodeHeart, this),
                        destroy: a.proxy(this._nodeDestroy, this)
                    })
                },
                _nextId: function () {
                    return "peck-node-" + l.length() + "-" + (new Date).getTime()
                },
                _nodeHeart: function (b) {
                    var c = this.getSource().length
                        , d = this.$peck.find(".peck-num");
                    if (d[c > 1 ? "show" : "hide"]().css({
                            "margin-left": -(d.outerWidth() / 2)
                        }).find(".peck-number").text(c),
                            this.$peck.css({
                                top: this.$target.outerHeight() - a("#js-fans-rank").outerHeight(!0) - this.$peck.height() - 20 - a("#js-chat-notice").outerHeight(!0)
                            }),
                        !this.$peck.hasClass("peck-loading") && b.node.pid === this.config.currentPid) {
                        this.$peck.data("pid", b.node.pid);
                        var e = b.now.ntime - b.node.createTime;
                        if (e <= b.node.start) {
                            var f = this._timeFormat(b.node.start - e);
                            this.$peck.find(".peck-cdn").text(f)
                        } else
                            e > b.node.start && (this.$peck.css({
                                "background-image": "url(" + b.node.goi + ")"
                            }).removeClass("peck-close").addClass("peck-open").find(".peck-cdn").text("领取"),
                                this.$peck.find(".peck-tip-status").html("神秘宝箱已开启，手慢无！~"))
                    }
                },
                randomTime: function () {
                    return 1e3 * (Math.floor(5 * Math.random() + 0) + 1)
                },
                _nodeDestroy: function (b, c) {
                    a.isFunction(c) && c(),
                        this.toggle()
                },
                _timeFormat: function (a) {
                    var b, c;
                    return a > 6e4 ? (b = String(parseInt(a / 6e4)),
                        c = String(parseInt(a % 6e4 / 1e3))) : (b = "00",
                        c = String(parseInt(a / 1e3))),
                        b = b.length > 1 ? b : "0" + b,
                        c = c.length > 1 ? c : "0" + c,
                    b + ":" + c
                }
            }),
            o = function () {
                var c = g.get("room.giftBatterConfig");
                if (!c)
                    return void (window.console && console.info("[礼物系统]\n配置丢失，初始化失败。"));
                var d = ((new Date).getTime(),
                    a.extend({}, c, {
                        "cq-1": {
                            bimg: $SYS.web_url + "app/douyu/res/page/room-normal/gift/chouqin_1.gif?v=20160322",
                            himg: "",
                            name: "初级酬勤",
                            stay_time: 1e4
                        },
                        "cq-2": {
                            bimg: $SYS.web_url + "app/douyu/res/page/room-normal/gift/chouqin_2.gif?v=20160322",
                            himg: "",
                            name: "中级酬勤",
                            stay_time: 2e4
                        },
                        "cq-3": {
                            bimg: $SYS.web_url + "app/douyu/res/page/room-normal/gift/chouqin_3.gif?v=20160322",
                            himg: "",
                            name: "高级酬勤",
                            stay_time: 3e4
                        },
                        older100Balls: {
                            bimg: $SYS.web_url + "app/douyu/res/page/room-normal/gift/mobile-bg-100.png?v=20160322",
                            himg: $SYS.web_url + "app/douyu/res/page/room-normal/gift/mobile-head-100.png?v=20160322",
                            stay_time: 1e3
                        }
                    }));
                n.reg("planeSmall", function (b) {
                    var c, d = a('[data-giftid="' + b.node.type + '"]'), e = d.offset(), f = {
                        w: 40,
                        h: 25
                    }, g = {
                        x: (d.width() - f.w) / 2 + e.left + 2,
                        y: e.top - f.h
                    };
                    c = a('<div class="gift-smallPlane"></div>').css({
                        left: g.x,
                        top: g.y,
                        "background-image": "url(" + b.node.resurl.sei + ")"
                    }),
                        a("body").append(c),
                        c.animate({
                            top: g.y / 4,
                            left: 2 * -f.w
                        }, 2e3, "easeOutCubic", function () {
                            n.use("planeBig", b),
                                a(this).remove()
                        })
                }),
                    n.reg("planeBig", function (b) {
                        var c, d = p.target(), e = {
                            w: 91,
                            h: 50
                        }, f = {
                            x: d.width() - 20,
                            y: (d.height() - e.h) / 2
                        };
                        c = a('<div class="gift-bigPlane"></div>').css({
                            left: f.x,
                            top: f.y,
                            "background-image": "url(" + b.node.resurl.bei + ")"
                        }),
                            d.append(c),
                            c.animate({
                                left: -e.w
                            }, 3e3, function () {
                                a(this).remove(),
                                    p.add(b.node)
                            })
                    }),
                    n.reg("rocketSmall", function (b) {
                        var c, d = a('[data-giftid="' + b.node.type + '"]'), e = d.offset(), f = {
                            w: 30,
                            h: 105
                        }, g = {
                            x: (d.width() - f.w) / 2 + e.left + 2,
                            y: e.top - f.h
                        };
                        c = a('<div class="gift-small-rocket"></div>').css({
                            left: g.x,
                            top: g.y,
                            "background-image": "url(" + b.node.resurl.sei + ")"
                        }),
                            a("body").append(c),
                            c.animate({
                                top: 2 * -f.h
                            }, 1500, "swing", function () {
                                n.use("rocketBig", b),
                                    p.autoAdd(!1),
                                    a(this).remove()
                            })
                    }),
                    n.reg("rocketBig", function (b) {
                        if (n.run())
                            return void n.push(b);
                        n.run(!0);
                        var c, d, f, g, h, i = p.target(), k = a('<div class="rocket"></div>'), m = a(".giftbatter-box1"), o = a('<div class="rocket-info"><div><strong>' + b.node.viewc.name + "</strong></div><span>为主播发射了一枚火箭</span></div>"), q = {
                            w: 100,
                            h: 350
                        };
                        ({
                            x: (k.width() - q.w) / 2,
                            y: k.height() - 20
                        }),
                            i.append(k),
                            k.css({
                                width: i.width(),
                                height: p.cssbox().outerHeight(!0) - k.height(),
                                position: "absolute",
                                top: 0,
                                left: 0,
                                "z-index": 198,
                                overflow: "hidden"
                            }),
                            c = ['<div class="gift-big-rocket"></div>', '<div class="gift-frog">', '<object type="application/x-shockwave-flash" ', 'id="giftBatterFrog" ', 'name="giftBatterFrog" ', 'align="middle" ', 'allowscriptaccess="always" ', 'allowfullscreen="true" ', 'allowfullscreeninteractive="true" ', 'wmode="transparent" ', 'data="<%=frogurl%>" ', 'width="100%" ', 'height="100%">', '<param name="src" value="<%=frogurl%>">', '<param name="quality" value="high">', '<param name="bgcolor" value="#fff">', '<param name="allowscriptaccess" value="always">', '<param name="allowfullscreen" value="true">', '<param name="wmode" value="transparent">', '<param name="allowFullScreenInteractive" value="true">', '<param name="flashvars" value="">', "</object>", "</div>"].join(""),
                            d = e.compile(c),
                            f = d({
                                frogurl: b.node.resurl.frog
                            }),
                            k.append(f),
                            k.append(o),
                            g = k.find(".gift-big-rocket"),
                            h = k.find(".gift-frog"),
                            g.css({
                                top: k.height(),
                                left: (k.width() - g.width()) / 2,
                                "background-image": "url(" + b.node.resurl.bei + ")"
                            }),
                            h.css({
                                bottom: 0
                            }),
                            o.css({
                                left: 10,
                                top: k.height() - o.height()
                            }).fadeIn(800),
                            g.animate({
                                top: k.height() - q.h
                            }, {
                                duration: 1e3,
                                easing: "easeOutCirc",
                                step: function (a, b) {
                                    var c = m.position()
                                        , d = m.height()
                                        , e = parseInt(g.css("top"), 10);
                                    c && e <= c.top + d && m.css("top", e - d)
                                },
                                complete: function () {
                                    var c = b.node;
                                    m.stop(!0, !0),
                                        setTimeout(function () {
                                            setTimeout(function () {
                                                h.remove(),
                                                    o.fadeOut(400, function () {
                                                        a(this).remove()
                                                    })
                                            }, 500),
                                                g.animate({
                                                    top: -q.h
                                                }, {
                                                    duration: 1e3,
                                                    easing: "easeInExpo",
                                                    step: function (a, b) {
                                                        var c = m.position()
                                                            , d = m.height()
                                                            , e = parseInt(g.css("top"), 10);
                                                        c && e <= c.top + d && m.css("top", e - d)
                                                    },
                                                    complete: function () {
                                                        var b = [];
                                                        c.__renderCallback = function () {
                                                            n.run(!1);
                                                            var a;
                                                            (a = n.hasNext("node.viewc.effect", 1)) && n.use("rocketBig", a)
                                                        }
                                                            ,
                                                            m.stop(!0, !0).removeAttr("style").html(""),
                                                            a(this).parent().remove(),
                                                            l.each(function (a, c) {
                                                                a.TYPE === j.nodeType.gift && 1 !== a.viewc.effect && b.push(a)
                                                            }),
                                                            l.clear(b),
                                                            p.autoAdd(!0),
                                                            p.add(c)
                                                    }
                                                })
                                        }, 1e3)
                                }
                            })
                    }),
                    n.reg("peckDown", function (b) {
                        function c(a) {
                            s.getSource().length ? l.add(s.makeNode(a)) : s.add(a)
                        }

                        var d = b.node;
                        if (d.createTime = (new Date).getTime(),
                                s.isShow())
                            c(d);
                        else {
                            var e = a('<div class="peck peck-down"></div>')
                                , f = s.target();
                            f.append(e),
                                e.show().css({
                                    top: 0,
                                    "background-image": "url(" + d.gci + ")"
                                }).animate({
                                    top: f.outerHeight() - a("#js-fans-rank").outerHeight(!0) - e.height() - 20 - a("#js-chat-notice").outerHeight(!0)
                                }, 1e3, function () {
                                    a(this).remove(),
                                        c(d)
                                })
                        }
                    });
                var k = function (c) {
                        var e, h = f.decode(c).too();
                        if ("dgb" === h.type) {
                            if (h.uid != g.get("sys.uid") && b.fire("mod.chat.msg.shield").effect)
                                return !1;
                            if (e = {
                                    TYPE: j.nodeType.gift,
                                    type: parseInt(h.gfid, 10),
                                    createTime: (new Date).getTime() + 600,
                                    viewc: {
                                        count: h.hits ? parseInt(h.hits, 10) : 1,
                                        name: h.nn,
                                        style: h.gs ? parseInt(h.gs, 10) : 0
                                    }
                                },
                                    e.viewc.effect = d[e.type].ef,
                                e.viewc.count <= 1 && 1 === e.viewc.style)
                                return;
                            0 === e.viewc.effect ? p.add(e) : 2 === e.viewc.effect ? (e.resurl = {
                                sei: d[e.type].small_effect_icon ? d[e.type].small_effect_icon : $SYS.web_url + "app/douyu/res/page/room-normal/gift/planeSmall.png?v=20160322",
                                bei: d[e.type].big_effect_icon ? d[e.type].big_effect_icon : $SYS.web_url + "app/douyu/res/page/room-normal/gift/plane.png?v=20160322"
                            },
                                n.use($SYS.uid === h.uid ? "planeSmall" : "planeBig", {
                                    node: e
                                })) : 1 === e.viewc.effect && (e.resurl = {
                                sei: d[e.type].small_effect_icon ? d[e.type].small_effect_icon : $SYS.web_url + "app/douyu/res/page/room-normal/gift/rocketSmall.png?v=20160322",
                                bei: d[e.type].big_effect_icon ? d[e.type].big_effect_icon : $SYS.web_url + "app/douyu/res/page/room-normal/gift/rocket.gif?v=20160322",
                                frog: d[e.type].swf ? d[e.type].swf : "/common/douyu/images/giftbatter/frog.swf?v=20160322"
                            },
                                e.peckc = {
                                    TYPE: j.nodeType.peck,
                                    createTime: (new Date).getTime(),
                                    pid: void 0 !== h.rpid ? parseInt(h.rpid, 10) : 0,
                                    start: void 0 !== h.slt ? parseInt(h.slt, 10) : 0,
                                    end: void 0 !== h.elt ? parseInt(h.elt, 10) : 0,
                                    delayTime: s.randomTime(),
                                    uid: h.uid,
                                    uname: h.nn,
                                    gci: d[e.type].gift_icon ? d[e.type].gift_icon : $SYS.web_url + "app/douyu/res/page/room-normal/gift/peck-close.png?v=20160322",
                                    goi: d[e.type].gift_open_icon ? d[e.type].gift_open_icon : $SYS.web_url + "app/douyu/res/page/room-normal/gift/peck-open.gif?v=20160322"
                                },
                                e.peckc.start = 1e3 * e.peckc.start,
                                e.peckc.end = 1e3 * e.peckc.end,
                                e.peckc.timeout = e.peckc.end + s.getLastDelayTime(),
                                n.use($SYS.uid === h.uid ? "rocketSmall" : "rocketBig", {
                                    node: e
                                }))
                        }
                        if ("dgn" === h.type) {
                            if (h.sid != g.get("sys.uid") && b.fire("mod.chat.msg.shield").effect)
                                return !1;
                            if (e = {
                                    TYPE: j.nodeType.gift,
                                    type: parseInt(h.gfid, 10),
                                    createTime: (new Date).getTime() + 600,
                                    viewc: {
                                        count: h.hits ? parseInt(h.hits, 10) : 0,
                                        name: h.src_ncnm,
                                        style: h.gs ? parseInt(h.gs, 10) : 0
                                    }
                                },
                                    e.viewc.effect = d[e.type].ef,
                                e.viewc.count <= 1 && 1 === e.viewc.style)
                                return;
                            0 === e.viewc.effect ? p.add(e) : 2 === e.viewc.effect ? (e.resurl = {
                                sei: d[e.type].small_effect_icon ? d[e.type].small_effect_icon : $SYS.web_url + "app/douyu/res/page/room-normal/gift/planeSmall.png?v=20160322",
                                bei: d[e.type].big_effect_icon ? d[e.type].big_effect_icon : $SYS.web_url + "app/douyu/res/page/room-normal/gift/plane.png?v=20160322"
                            },
                                n.use($SYS.uid === h.sid ? "planeSmall" : "planeBig", {
                                    node: e
                                })) : 1 === e.viewc.effect && (e.resurl = {
                                sei: d[e.type].small_effect_icon ? d[e.type].small_effect_icon : $SYS.web_url + "app/douyu/res/page/room-normal/gift/rocketSmall.png?v=20160322",
                                bei: d[e.type].big_effect_icon ? d[e.type].big_effect_icon : $SYS.web_url + "app/douyu/res/page/room-normal/gift/rocket.gif?v=20160322",
                                frog: d[e.type].swf ? d[e.type].swf : "/common/douyu/images/giftbatter/frog.swf?v=20160322"
                            },
                                e.peckc = {
                                    TYPE: j.nodeType.peck,
                                    createTime: (new Date).getTime(),
                                    pid: void 0 !== h.rpid ? parseInt(h.rpid, 10) : 0,
                                    start: void 0 !== h.slt ? parseInt(h.slt, 10) : 0,
                                    end: void 0 !== h.elt ? parseInt(h.elt, 10) : 0,
                                    delayTime: s.randomTime(),
                                    uid: h.sid,
                                    uname: h.src_ncnm,
                                    gci: d[e.type].gift_icon ? d[e.type].gift_icon : $SYS.web_url + "app/douyu/res/page/room-normal/gift/peck-close.png?v=20160322",
                                    goi: d[e.type].gift_open_icon ? d[e.type].gift_open_icon : $SYS.web_url + "app/douyu/res/page/room-normal/gift/peck-open.gif?v=20160322"
                                },
                                e.peckc.start = 1e3 * e.peckc.start,
                                e.peckc.end = 1e3 * e.peckc.end,
                                e.peckc.timeout = e.peckc.end + s.getLastDelayTime(),
                                n.use($SYS.uid === h.sid ? "rocketSmall" : "rocketBig", {
                                    node: e
                                }))
                        }
                        if ("memberinfores" === h.type) {
                            if ("" !== h.list) {
                                for (var i = [], k = h.list.split("/|/"), m = k.length, o = 0; m > o; o++)
                                    if ("" != k[o]) {
                                        var q = f.decode(k[o]).too()
                                            , r = {};
                                        r = {
                                            TYPE: j.nodeType.peck,
                                            createTime: (new Date).getTime(),
                                            gid: void 0 !== q.gid ? parseInt(q.gid, 10) : 0,
                                            pid: void 0 !== q.rpid ? parseInt(q.rpid, 10) : 0,
                                            start: void 0 !== q.stl ? parseInt(q.stl, 10) : 0,
                                            end: void 0 !== q.etl ? parseInt(q.etl, 10) : 0,
                                            delayTime: s.randomTime(),
                                            uid: q.sid,
                                            uname: q.snk
                                        },
                                            r.start = 1e3 * r.start,
                                            r.end = 1e3 * r.end,
                                            r.timeout = r.end,
                                            r.gci = d[r.gid].gift_icon ? d[r.gid].gift_icon : $SYS.web_url + "app/douyu/res/page/room-normal/gift/peck-close.png?v=20160322",
                                            r.goi = d[r.gid].gift_open_icon ? d[r.gid].gift_open_icon : $SYS.web_url + "app/douyu/res/page/room-normal/gift/peck-open.gif?v=20160322",
                                            i.push(r),
                                        o > 0 && (i[o].timeout = i[o].timeout + i[o - 1].delayTime)
                                    }
                                i.sort(function (a, b) {
                                    return a.start > b.start ? 1 : -1
                                }),
                                    s.add(i)
                            }
                            if ("" !== h.glist)
                                for (var t = h.glist.split("/|/"), u = t.length, v = 0; u > v; v++)
                                    if ("" != t[v]) {
                                        var w = f.decode(t[v]).too()
                                            , x = {};
                                        x = {
                                            TYPE: j.nodeType.gift,
                                            type: parseInt(w.gid, 10),
                                            createTime: (new Date).getTime(),
                                            viewc: {
                                                count: w.hs ? parseInt(w.hs, 10) : 0,
                                                name: w.snk,
                                                style: w.gs ? parseInt(w.gs, 10) : 0,
                                                st: 1e3 * w.ctc,
                                                ts: 1
                                            }
                                        },
                                        1 === d[x.type].is_stay && p.add(x)
                                    }
                        }
                        if ("ggbr" === h.type) {
                            var y = s.target()
                                , z = a('<div class="peck-back-tip"></div>')
                                , A = a("#right_col_peck").position();
                            y.append(z),
                                h.sl > 0 ? (z.addClass("peck-back-success").html('<p><span>恭喜您，领取了</span><strong title="' + h.snk + '">' + h.snk + "</strong></p><p><span>派送的</span><strong>" + h.sl + "个鱼丸</strong><span>~</span></p>"),
                                    b.trigger("mod.userinfo.change", {
                                        current: {
                                            silver: h.sb
                                        }
                                    })) : z.addClass("peck-back-error").html("<p><span>" + (s.isGet() ? "宝箱已被洗劫一空T_T" : "运气不佳，您没有领到宝箱礼物") + "</span></p>"),
                                z.css({
                                    top: A.top - z.height() - 10,
                                    "margin-left": -(z.width() / 2)
                                }).fadeIn(400, function () {
                                    s.save(h.rpid);
                                    var a;
                                    l.each(function (b, c) {
                                        b.TYPE === j.nodeType.peck && b.pid == h.rpid && (a = b)
                                    }),
                                    a && l.destroy(a, !0)
                                }).delay(3e3).fadeOut(400, function () {
                                    z.remove()
                                }),
                                a(window).resize(function () {
                                    z.css({
                                        top: A.top - z.height() - 10,
                                        "margin-left": -(z.width() / 2)
                                    })
                                })
                        }
                    }
                    , m = function (a) {
                        var c = f.decode(a).too()
                            , d = f.decode(c.sui).too()
                            , e = 0
                            , h = 0;
                        if (!b.fire("mod.chat.msg.shield").effect || c.sid == g.get("sys.uid")) {
                            switch (c.lev) {
                                case "1":
                                    e = "cq-1",
                                        h = 8;
                                    break;
                                case "2":
                                    e = "cq-2",
                                        h = 9;
                                    break;
                                case "3":
                                    e = "cq-3",
                                        h = 10
                            }
                            var i = {
                                TYPE: j.nodeType.gift,
                                type: e,
                                createTime: (new Date).getTime(),
                                viewc: {
                                    count: c.hits ? parseInt(c.hits, 10) : 0,
                                    name: d.nick,
                                    style: h
                                }
                            };
                            p.add(i)
                        }
                    }
                    , o = function (a) {
                        var c, d = f.decode(a).too(), e = f.decode(d.sui).too();
                        if ((!b.fire("mod.chat.msg.shield").effect || e.id == g.get("sys.uid")) && "donateres" === d.type && "0" === d.r) {
                            if (c = {
                                    TYPE: j.nodeType.gift,
                                    type: "older100Balls",
                                    createTime: (new Date).getTime(),
                                    viewc: {
                                        count: d.hc ? parseInt(d.hc, 10) : 0,
                                        name: e.nick,
                                        style: 1
                                    }
                                },
                                c.viewc.count <= 1 && 1 === c.viewc.style)
                                return;
                            p.add(c)
                        }
                    }
                    ;
                l = l.create({
                    autoStartListen: !0
                }),
                    p = new q({
                        resource: d
                    }),
                    s = new t,
                    b.on("mod.chat.gift.setdata", function (a) {
                        p.add(a)
                    }),
                    b.on("mod.chat.gift.call", function (a) {
                        k(a)
                    }),
                    b.on("mod.chat.gift.peck.setdata", function (a) {
                        s.add(a)
                    }),
                    i.reg("room_data_giftbat1", function (a) {
                        var c = f.decode(a).too();
                        c.sid != g.get("sys.uid") && c.uid != g.get("sys.uid") || b.trigger("mod.gift.exp.up", {
                            gid: c.gfid,
                            silver: c.sb
                        }),
                        "dgn" !== c.type && "dgb" !== c.type || b.trigger("mod.titleinfo.change", {
                            weight: c.dw
                        }),
                        "dsgr" === c.type && 0 == c.r && b.trigger("mod.userinfo.change", {
                            current: {
                                silver: c.sb
                            }
                        }),
                            k(a),
                            b.trigger("mod.gift.allowsend"),
                            b.trigger("mod.gift.yw.res", a),
                            b.trigger("mod.chat.msg.res.gift", a),
                            b.trigger("mod.chat.msg.res.peck", a),
                            b.trigger("mod.chat.msg.gift", a, d)
                    }),
                    i.reg("room_data_buycq", function (a) {
                        b.trigger("mod.chat.msg.res.cq", a),
                            m(a)
                    }),
                    i.reg("room_data_gift", function (a) {
                        o(a),
                            b.trigger("mod.chat.msg.gift", a)
                    }),
                    i.reg("room_data_login", function (a) {
                        if (null != g.get("sys.uid") || null != g.get("sys.username")) {
                            var b = f.decode(a).too()
                                , c = {
                                status: 0,
                                url: ""
                            };
                            0 == b.ps && 0 == b.es ? (c.status = 1,
                                c.url = "/member/cp") : 0 == b.es ? (c.status = 2,
                                c.url = "/member/cp/changeEmail") : 0 == b.ps && (c.status = 3,
                                c.url = "/member/cp/cpBindPhone"),
                                s.isUnbind(c)
                        }
                    }),
                    a(document).on("click", "#right_col_peck", function (b) {
                        if (b.preventDefault(),
                                window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty(),
                                !h.check())
                            return void h.show();
                        var c = a(this);
                        if (c.hasClass("peck-open") && c.data("switch") && !a(this).data("bind")) {
                            var d = f.encode([{
                                name: "type",
                                value: "ggbq"
                            }, {
                                name: "rpid",
                                value: c.data("pid")
                            }, {
                                name: "rid",
                                value: $ROOM.room_id
                            }]);
                            i.exe("js_GetHongbao", d),
                                c.data("switch", !1)
                        }
                    })
            }
            ,
        {
            init: function () {
                o()
            }
        }
    }),
    define("douyu/page/room/normal/mod/chat-msg-queue", ["jquery", "shark/class"], function (a, b) {
        var c = {
            isIE7: navigator.appVersion.indexOf("MSIE 7.0;") > 0
        }
            , d = b({
            init: function (a) {
                this.QUEUE = [],
                    this.RELEASE_STATE = !1,
                    this.RELEASE_STEP = a.releaseStep || function () {
                        }
            },
            may: function (a) {
                if (c.isIE7) {
                    if (this.QUEUE.push(a),
                        this.RELEASE_STATE === !0)
                        return;
                    this.releaseIf()
                } else
                    this.RELEASE_STEP(a)
            },
            release: function (a) {
                var b = a.length
                    , c = this;
                b ? (this.RELEASE_STATE = !0,
                    setTimeout(function () {
                        var b = a.shift();
                        c.RELEASE_STEP(b),
                            c.release(a)
                    }, 60)) : (this.RELEASE_STATE = !1,
                    this.releaseIf())
            },
            releaseIf: function () {
                if (this.QUEUE.length) {
                    var a = this.QUEUE.slice(0);
                    this.QUEUE = [],
                        this.release(a)
                }
            }
        });
        return d.create = function () {
            return new d
        }
            ,
            d
    }),
    define("douyu/page/room/normal/mod/chat-msg-roll", ["jquery", "shark/observer"], function (a, b) {
        var c = {}
            , d = {};
        return c.init = function () {
            c.$chatCont = a("#js-chat-cont"),
                c.$chatCls = c.$chatCont.find('[data-type="chat-cls"]')
        }
            ,
            d.init = function () {
                c.$chatCont.on({
                    mouseenter: function () {
                        c.$chatCls.removeClass("hide")
                    },
                    mouseleave: function () {
                        c.$chatCls.addClass("hide")
                    }
                }).on("click", '[data-type="roll"]', function () {
                    var b = a(this);
                    b.hasClass("c-scr") ? b.removeClass("c-scr").find("span").text("开始滚屏") : b.addClass("c-scr").find("span").text("关闭滚屏")
                }).on("click", '[data-type="clear"]', function () {
                    b.trigger("mod.chat.msg.clear.chat")
                })
            }
            ,
        {
            init: function () {
                c.init(),
                    d.init()
            }
        }
    }),
    define("douyu/page/room/normal/mod/chat-msg-tmp", ["jquery", "shark/observer", "shark/util/lang/1.0", "shark/util/flash/data/1.0", "shark/util/template/1.0", "douyu/context"], function (a, b, c, d, e, f) {
        var g = {}
            , h = {};
        return h.roomLinkCheck = function (b) {
            var c = /\[room\=([^\]]+)\]/gi
                , d = /\[room\=([a-z\d]+)\]/gi
                , e = b.match(c)
                , f = 1;
            return e && a.each(e, function (a, b) {
                return d.test(b) ? void 0 : (f = 0,
                    !1)
            }),
                f
        }
            ,
            h.htmlEncode = function (a) {
                var b = "";
                return 0 === a.length ? b : b = a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/ /g, "&nbsp;").replace(/\'/g, "&#39;").replace(/\"/g, "&quot;").replace(/\s/g, " ")
            }
            ,
            h.replaceFace = function (b) {
                var c = ["dy001", "dy002", "dy003", "dy004", "dy005", "dy006", "dy007", "dy008", "dy009", "dy010", "dy011", "dy012", "dy013", "dy014", "dy015", "dy016", "dy017", "dy101", "dy102", "dy103", "dy104", "dy105", "dy106", "dy107", "dy108", "dy109", "dy110", "dy111", "dy112", "dy113", "dy114", "dy115", "dy116", "dy117", "dy118", "dy119", "dy120", "dy121", "dy122", "dy123", "dy124", "dy125", "dy126", "dy127", "dy128", "dy129", "dy130", "dy131", "dy132", "dy133", "dy134", "dy135", "dy136", "dy137"]
                    , d = ["good", "kiss", "drop", "fil", "grief", "badluck", "indecent", "kiss", "laugh", "lovely", "rage", "scare", "sleep", "trick", "awesome", "snicker", "doubt", "guise", "sorry", "nosebleed", "moving", "grimace", "laughing", "revel", "excited", "dizzy", "bye", "up", "a", "dzt", "js", "kx", "uccu", "wy", "dyfn", "dyw", "dyhp", "dycy", "dylb", "dyjj", "dydoge", "dylyl", "dyhc", "dytk", "dysyw"]
                    , e = f.get("sys.web_url");
                return a.each(c, function (a, c) {
                    b = b.replace(new RegExp("\\[emot:" + c + "\\]", "g"), '<img rel="' + c + '" src="' + e + "app/douyu/res/page/room-normal/face/" + c + '.png?v=20160121" />')
                }),
                    a.each(d, function (a, c) {
                        b = b.replace(new RegExp("\\[emot:" + c + "\\]", "g"), '<img rel="' + c + '" src="' + e + "app/douyu/res/page/room-normal/face/" + c + '.gif?v=20160121" />')
                    }),
                    b
            }
            ,
            h.getColor = function (a) {
                return ["#ff0000", "#1e87f0", "#7ac84b", "#ff7f00", "#9b39f4", "#ff69b4"][a]
            }
            ,
            h.getLevJson = function (b) {
                var c = f.get("room.args.leve_json")
                    , d = {};
                return a.each(c, function (a, c) {
                    return a = parseInt(a, 10),
                        c.score = a,
                        d.next = c,
                        a > b ? !1 : void (d.current = c)
                }),
                    d
            }
            ,
            h.getUserLevIcon = function (a) {
                var b = 60
                    , d = a > b ? b : a
                    , e = a >= 40 ? "gif" : "png";
                return c.string.format("{0}app/douyu/res/page/room-normal/level/LV{1}.{2}?v=20160427", f.get("sys.web_url"), d, e)
            }
            ,
            h.getCqName = function (a) {
                return 1 == a ? "初级酬勤" : 2 == a ? "中级酬勤" : 3 == a ? "高级酬勤" : 4 == a ? "超级酬勤" : void 0
            }
            ,
            h.getUserCqName = function (a) {
                return a = a ? a : 10,
                    0 == a ? "酬勤用户" : 1 == a ? "初级酬勤用户" : 2 == a ? "中级酬勤用户" : 3 == a ? "高级酬勤用户" : ""
            }
            ,
            h.getCqLevIcon = function (a) {
                return c.string.format("{0}app/douyu/res/page/room-normal/cq/level/cq_0{1}.gif?v=20160322", f.get("sys.web_url"), a)
            }
            ,
            h.getCqTitIcon = function (a) {
                return c.string.format("{0}app/douyu/res/page/room-normal/cq/level/cq_no0{1}.png?v=20160322", f.get("sys.web_url"), a)
            }
            ,
            h.getRankTypeName = function (a) {
                return 1 == a ? "贡献周榜" : 2 == a ? "贡献总榜" : "贡献周榜"
            }
            ,
            h.getFishShowIcon = function (a) {
                var b = $ROOM.giftStarSetting
                    , c = b[a];
                return c ? c : null
            }
            ,
            h.processFishshowData = function (a) {
                for (var b, c, e, f = [], g = 0, i = a.length; i > g; g++)
                    b = d.decode(a[g].value),
                        f.push(b);
                for (var g = 0, i = f.length; i > g; g++)
                    b = f[g],
                        f[g] = d.too(b);
                for (var g = 0, i = f.length; i > g; g++)
                    b = f[g],
                        c = b.gt,
                        e = h.getFishShowIcon(c),
                    e && (b.medal_icon = e.medal_icon);
                return f
            }
            ,
            g.superBarrage = function (a) {
                a = d.decode(a).too();
                var b, h, i;
                return g.superBarrage.RENDER ? h = g.superBarrage.RENDER : (b = c.string.join('<li class="jschartli" data-type="list">', '<p class="text-cont">', '<img class="cj-img" src="<%=attr.web_url%>app/douyu/res/page/room-normal/lw_pc_img.png?v=20160322" />', '<span class="super-barrage" data-sdid="<%=sdid%>" data-trid="<%=trid%>"><%=text%></span>', "</p>", "</li>"),
                    h = g.superBarrage.RENDER = e.compile(b)),
                    i = h({
                        sdid: a.sdid,
                        trid: a.trid,
                        text: a.content,
                        attr: {
                            web_url: f.get("sys.web_url")
                        }
                    })
            }
            ,
            g.superBarrage.RENDER = null ,
            g.barrage = function (a) {
                var i, j, k, l = a, m = b.fire("mod.chat.blackList.get", parseInt(l.uid, 10));
                return -1 === m.index && h.roomLinkCheck(l.txt) ? (l.txt = h.htmlEncode(l.txt),
                    l.txt = h.replaceFace(l.txt),
                    l.txt = l.txt.replace(/\[room\=([a-zA-Z\d]+)\]/gi, '<a href="/$1" target="_blank" class="cont-room"><img src="' + f.get("sys.web_url") + 'app/douyu/res/page/room-normal/link.png?v=20160310" />$1</a>'),
                    a.cqt = h.getUserCqName(a.dlv) || "",
                    a.bgt = Math.pow(10, a.gt),
                    a.color = h.getColor(a.col - 1) || "",
                    l.ut = d.isArray(a.ut) ? d.decode(a.ut) : [{
                        value: a.ut
                    }],
                    l.fishshowArr = h.processFishshowData(l.ut),
                    l.highLevel = 60,
                    g.barrage.RENDER ? j = g.barrage.RENDER : (i = c.string.join("<% if ( node.isSender ) { %>", '<li class="jschartli chartli" data-type="list">', "<% if ( node.dlv > 0 && node.dc > 0 ) { %>", '<p class="my-cont cqback">', "<% } else { %>", '<p class="my-cont">', "<% } %>", "<% } else { %>", '<li class="jschartli" data-type="list">', "<% if ( node.dlv > 0 && node.dc > 0 ) { %>", '<p class="text-cont cqback">', "<% } else { %>", '<p class="text-cont">', "<% } %>", "<% } %>", "<% if ( node.ct === 1 || node.ct === 2 ) { %>", '<span class="f-phone"><a href="/client" target="_blank" title="【来自于斗鱼移动端】"><img src="<%= attr.web_url %>app/douyu/res/page/room-normal/mobile.png?v=<%= attr.web_ver %>" /></a></span>', "<% } %>", "<% if ( node.pg === 5 || node.pg === 2 ) { %>", '<span class="chat-icon-pad"><img class="icon-role" src="<%= attr.web_url %>app/douyu/res/page/room-normal/super_admin.gif?v=<%= attr.web_ver %>" /></span>', "<% } else if ( node.rg === 4 ) { %>", '<span class="chat-icon-pad"><img class="icon-role" src="<%= attr.web_url %>app/douyu/res/page/room-normal/roomadmin.gif?v=<%= attr.web_ver %>" /></span>', "<% } else if ( node.rg === 5 ) { %>", '<span class="chat-icon-pad"><img class="icon-role" src="<%= attr.web_url %>app/douyu/res/page/room-normal/anchor.gif?v=<%= attr.web_ver %>" /></span>', "<%} %>", "<% for(var i=0;i<node.fishshowArr.length;i++){ %>", "<% if(node.fishshowArr[i]&&node.fishshowArr[i].gt&&node.fishshowArr[i].gn){ %>", '<img class="week_gift_img"  title="鱼秀专区周星奖励，获得最多的<%= node.fishshowArr[i].gn %>。图标有效期7天。"  src="<%= node.fishshowArr[i].medal_icon %>">', "<% } %>", "<% } %>", "<% if ( node.dlv > 0 && node.dc > 0) { %>", '<span class="chat-icon-pad cq-level c-lv<%= node.dlv %>" title="<%= node.cqt %>"><img src="<%= attr.web_url %>app/douyu/res/page/room-normal/cq_no0<%= node.dlv %>.png?v=<%= attr.web_ver %>" /><em>×<%= node.dc %></em></span>', "<% } else if ( node.bdlv > 0 ) { %>", '<img src="<%= attr.web_url %>app/douyu/res/page/room-normal/cq_other.png?v=<%= attr.web_ver %>" class="chat-icon-pad cq-other" title="酬勤用户"/>', "<% } %>", "<% if ( node.gt > 0 && node.gt < 4 ) { %>", '<span class="chat-icon-pad user-honor"><img src="<%= attr.web_url %>app/douyu/res/page/room-normal/user_honor/honor<%= node.gt %>.png?v=<%= attr.web_ver %>" title="一天内在当前房间赠送礼物达到<%= node.bgt %>鱼翅" /></span>', "<% } %>", "<% if ( node.level >= 20 ) { %>", '<a class="chat-icon-pad user-level">', '<img src="<%= attr.web_url %>app/douyu/res/page/room-normal/level/LV', "<% if (node.level < (node.highLevel+1)) { %>", "<%= node.level %>", "<% } else { %>", "<%= node.highLevel %>", "<% } %>", "<% if (node.level >= 40) { %>", ".gif", "<% } else { %>", ".png", "<% } %>", '?v=<%= attr.web_ver %>" title="用户等级：<%= node.level %>" />', "</a>", "<% } %>", '<span class="name"><a href="javascript:;" class="nick js-nick" rel="<%= node.uid %>" gid="<%= node.pg %>"><%= node.nn %>：</a></span>', '<span class="<% if ( node.isSender ) { %>', "m", "<% } else { %>", "text-cont", '<% } %>" chatid="<% if ( node.pg < 5 ) { %>', "<%= node.cid %>", '<% } %>" <% if ( node.col >= 1 && node.col <= 6) { %>', 'style="color:<%= node.color %>"', "<% } %>>", "<%=# node.txt %>", "</span>", '<% if (node.shark === "hjs") { %>', '<a href="/cms/zt/mayday.html" target="_blank">', '<img src="<%= attr.web_url %>app/douyu/activity/res/mayday/pc/shark-hjs.gif?v=<%= attr.web_ver %>"', ' title="狠角色宝宝专享特权：直播间进入提示，免费\n专享彩色弹幕，限量狠角色宝宝30天出入跟随" />', "</a>", "<% } %>", "</p>", "</li>"),
                        j = g.barrage.RENDER = e.compile(i)),
                    k = j({
                        node: l,
                        attr: {
                            web_url: f.get("sys.web_url"),
                            web_ver: "20160310"
                        }
                    })) : void 0
            }
            ,
            g.barrage.RENDER = null ,
            g.userEnter = function (a) {
                var b, i, j, k = a;
                return k.cqt = h.getUserCqName(a.dlv) || "",
                    k.uli = h.getUserLevIcon(a.level) || "",
                    k.bgt = Math.pow(10, a.gt),
                    k.ut = d.isArray(a.ut) ? d.decode(a.ut) : [{
                        value: a.ut
                    }],
                    k.fishshowArr = h.processFishshowData(k.ut),
                    k.highLevel = 60,
                    g.userEnter.RENDER ? i = g.userEnter.RENDER : (b = c.string.join('<li class="jschartli" data-type="list">', '<p class="text-cont">', "<% if (node.lev >= 2) { %>", "<% if (node.lev >= (node.highLevel/10)) { %>", '<span class="user-level-wel"><img src="<%= attr.web_url %>app/douyu/res/page/room-normal/w_lv<%= node.highLevel %>.png?v=<%= attr.web_ver %>"></span>', "<% } else { %>", '<span class="user-level-wel"><img src="<%= attr.web_url %>app/douyu/res/page/room-normal/w_lv<%= node.lev %>0.png?v=<%= attr.web_ver %>"></span>', "<% } %>", "<% } %>", '<span class="c-wel">欢迎</span>', "<% for(var i=0;i<node.fishshowArr.length;i++){ %>", "<% if(node.fishshowArr[i]&&node.fishshowArr[i].gt&&node.fishshowArr[i].gn){ %>", '<img class="week_gift_img"  title="鱼秀专区周星奖励，获得最多的<%= node.fishshowArr[i].gn %>。图标有效期7天。"  src="<%= node.fishshowArr[i].medal_icon %>">', "<% } %>", "<% } %>", "<% if (node.dlv > 0 && node.dc > 0) { %>", '<span class="chat-icon-pad cq-level c-lv<%= node.dlv %>" title="<%= node.cqt %>"><img src="<%= attr.web_url %>app/douyu/res/page/room-normal/cq_no0<%= node.dlv %>.png?v=<%= attr.web_ver %>" /><em>×<%= node.dc %></em></span>', "<% } else if (node.bdlv > 0) { %>", '<img src="<%= attr.web_url %>app/douyu/res/page/room-normal/cq_other.png?v=<%= node.web_ver %>" class="chat-icon-pad cq-other" title="酬勤用户"/>', "<% } %>", "<% if (node.gt > 0 && node.gt < 4) { %>", '<span class="chat-icon-pad user-honor"><img src="<%= attr.web_url %>app/douyu/res/page/room-normal/user_honor/honor<%= node.gt %>.png?v=<%= attr.web_ver %>" title="一天内在当前房间赠送礼物达到<%= node.bgt %>鱼翅" /></span>', "<% } %>", "<% if (node.level >= 20) { %>", '<a class="chat-icon-pad user-level"><img src="<%= node.uli %>" title="用户等级：<%= node.level %>" />', "</a>", "<% } %>", '<a href="javascript:;" class="hy-name js-nick" rel="<%= node.uid %>" gid="<%= node.pg %>"><%= node.nn %></a>', "<span>来到本直播间</span>", "</p>", "</li>"),
                        i = g.userEnter.RENDER = e.compile(b)),
                    j = i({
                        node: k,
                        attr: {
                            web_url: f.get("sys.web_url"),
                            web_ver: "20160121"
                        }
                    })
            }
            ,
            g.userEnter.RENDER = null ,
            g.lottery = function (a) {
                a = d.decode(a).too();
                var b, h, i, j, k = a.sl || 0, l = a.gl / 100 || 0;
                return j = k > 0 ? l > 0 ? "赠送过" + k + "鱼丸以上或" + l + "鱼翅以上" : "赠送过" + k + "鱼丸以上" : l > 0 ? "赠送过" + l + "鱼翅以上" : "",
                    g.lottery.RENDER ? h = g.lottery.RENDER : (b = c.string.join('<li class="jschartli chart-rank-up-tip chart-lottery" data-type="list">', '<div class="my_cont clearfix">', '<img src="<%= attr.web_url %>app/douyu/res/page/room-normal/lw_pc_img.png?v=20160316" />', '<div class="mycont-r">', "主播将会在", "<span><%= secstr %></span>", "开始从", "<span><%= condition %></span>", "的用户中抽取幸运观众，快来参与吧~", "</div>", "</div>", "</li>"),
                        h = g.lottery.RENDER = e.compile(b)),
                    i = h({
                        secstr: a.sec < 60 ? a.sec + "秒后" : parseInt(a.sec / 60, 10) + "分钟后",
                        condition: j,
                        attr: {
                            web_url: f.get("sys.web_url")
                        }
                    })
            }
            ,
            g.lottery.RENDER = null ,
            g.setAdmin = function (a) {
                var b, d, f;
                return g.setAdmin.RENDER ? d = g.setAdmin.RENDER : (b = c.string.join('<li class="jschartli">', '<p class="text-cont">', "<% if ( node.rescode == 0 ) { %>", '<a href="javascript:;" class="js-nick" rel="<%= node.userid %>" style="color:#f00;"><%= node.adnick %></a>', "<% if ( node.group > 1 ) { %>", '<span style="color:#f00;">被任命管理员身份。</span>', "<% } else { %>", '<span style="color:#f00;">被罢免管理员身份。</span>', "<% } %>", "<% } else if ( node.rescode == 214 ) { %>", '<span style="color:#f00;">管理员数量以达上限。</span>', "<% } %>", "</p>", "</li>"),
                    d = g.setAdmin.RENDER = e.compile(b)),
                    f = d({
                        node: a
                    })
            }
            ,
            g.setAdmin.RENDER = null ,
            g.oneKey = function (a) {
                var b, d, f;
                return g.oneKey.RENDER ? d = g.oneKey.RENDER : (b = c.string.join('<li class="jschartli">', '<p class="text-cont">', "<% if ( node.ret == 0 ) { %>", '<span style="color:#f00;">已对 <%= node.uname %> 进行一键封号</span>', "<% } else if (node.ret == 208) { %>", '<span style="color:#f00;"><%= node.uname %> 用户已被封禁或已被一键封号</span>', "<% } else { %>", '<span style="color:#f00;">对 <%= node.uname %> 进行一键封号失败,错误码:<%= node.ret %></span>', "<% } %>", "</p>", "</li>"),
                    d = g.oneKey.RENDER = e.compile(b)),
                    f = d({
                        node: a
                    })
            }
            ,
            g.oneKey.RENDER = null ,
            g.ulico = function (a) {
                a = d.decode(a).too();
                var b, h, i;
                return g.ulico.RENDER ? h = g.ulico.RENDER : (b = c.string.join("<% if (node.gt == 1) { %>", '<li class="jschartli" data-type="list">', '<p class="honor-yc-tip">', '<img src="<%=attr.web_url%>app/douyu/res/page/room-show/user_honor/honor-bronze-tip.png?v=20160322"/>', "<span>恭喜</span>", '<span class="honor-user"><%=node.uname%></span>', "<span>今天在该房间赠送礼物超过</span>", '<span class="honor-yc-num">10鱼翅,</span>', "<span>获得</span>", '<span class="honor-room-name"><%=node.rname%></span>', "<span>房间铜牌粉丝称号！</span>", "</p>", "</li>", "<% } else if (node.gt == 2) { %>", '<li class="jschartli" data-type="list">', '<p class="honor-yc-tip">', '<img src="<%=attr.web_url%>app/douyu/res/page/room-show/user_honor/honor-silver-tip.png?v=20160322"/>', "<span>恭喜</span>", '<span class="honor-user"><%=node.uname%></span>', "<span>今天在该房间赠送礼物超过</span>", '<span class="honor-yc-num">100鱼翅,</span>', "<span>获得</span>", '<span class="honor-room-name"><%=node.rname%></span>', "<span>房间银牌粉丝称号！</span>", "</p>", "</li>", "<% } else if (node.gt == 3) { %>", '<li class="jschartli" data-type="list">', '<p class="honor-yc-tip">', '<img src="<%=attr.web_url%>app/douyu/res/page/room-show/user_honor/honor-gold-tip.png?v=20160322"/>', "<span>恭喜</span>", '<span class="honor-user"><%=node.uname%></span>', "<span>今天在该房间赠送礼物超过</span>", '<span class="honor-yc-num">1000鱼翅,</span>', "<span>获得</span>", '<span class="honor-room-name"><%=node.rname%></span>', "<span>房间金牌粉丝称号！</span>", "</p>", "</li>", "<% } %>"),
                    h = g.ulico.RENDER = e.compile(b)),
                    i = h({
                        node: a,
                        attr: {
                            web_url: f.get("sys.web_url")
                        }
                    })
            }
            ,
            g.ulico.RENDER = null ,
            g.chouqin = function (a) {
                a = d.decode(a).too();
                var b, f, i, j = d.decode(a.sui).too(), k = j.level, l = a.lev;
                return g.chouqin.RENDER ? f = g.chouqin.RENDER : (b = c.string.join('<li class="jschartli" data-type="list">', '<a class="chat-icon-pad user-level<%=ulevIn1t9 ? " lve-icon-1to9" : ""%>">', '<img src="<%=userIcon%>" title="用户等级：<%=userLev%>"/>', "</a>", '<a href="#" class="nick js-nick" rel="<%=userId%>"><%=userNick%></a>', "赠送了<%=cqName%>", '<img src="<%=cqLevIcon%>">', "<span>获得了本房间</span>", '<span class="s-cq">', '<img src="<%=cqTitIcon%>">', "</span>", "<span>头衔30天</span>", "</li>"),
                    f = g.chouqin.RENDER = e.compile(b)),
                    i = f({
                        ulevIn1t9: k >= 1 && 9 >= k,
                        userId: j.id,
                        userNick: j.nick,
                        userLev: k,
                        userIcon: h.getUserLevIcon(k),
                        cqName: h.getCqName(l),
                        cqLevIcon: h.getCqLevIcon(l),
                        cqTitIcon: h.getCqTitIcon(l)
                    })
            }
            ,
            g.chouqin.RENDER = null ,
            g.gift1 = function (a, b) {
                a = d.decode(a).too();
                var i, j, k, l = {
                    1: 25,
                    2: 35,
                    3: 45,
                    4: 50,
                    5: 55,
                    6: 60
                }, m = b[a.gfid];
                return g.gift1.RENDER ? j = g.gift1.RENDER : (i = c.string.join('<li class="jschartli" data-type="list">', '<p class="text_cont">', "<% if (cqLev > 0 && userCnt > 0) { %>", '<span class="chat-icon-pad cq-level c-lv<%=cqLev%>" title="<%=cqName%>">', '<img src="<%=cqTitIcon%>">', "<em>×<%=userCnt%></em>", "</span>", "<% } else  {%>", "<% if (userBdl > 0) { %>", '<img src="<%=attr.web_url%>app/douyu/res/page/room-show/cq/cq_other.png?v=20160322" class="chat-icon-pad cq-other" title="酬勤用户">', "<% } %>", "<% } %>", '<a class="chat-icon-pad user-level<%=ulevIn1t9 ? " lve-icon-1to9" : ""%>">', '<img src="<%=userIcon%>" title="用户等级：<%=userLev%>">', "</a>", '<a href="#" class="nick js-nick" rel="<%=sid%>" gid="<%=spg%>"><%=srcNcnm%></a>', "<span>赠送给主播</span>", "<% if (giftType == 1) { %>", "<span><%=giftCount%>个鱼丸</span>", "<% } %>", '<img class="lw-imgs" src="<%=giftCImg%>" width="<%=giftWidth%>" height="<%=giftHeight%>">', "<% if (hits > 1) { %>", "<span><%=hits%>连击</span>", "<% } %>", "</p>", "</li>"),
                    j = g.gift1.RENDER = e.compile(i)),
                    k = j({
                        cqLev: a.lev,
                        userLev: a.level,
                        userCnt: a.cnt,
                        userIcon: h.getUserLevIcon(a.level),
                        ulevIn1t9: a.level >= 1 && a.level <= 9,
                        cqName: h.getUserCqName(a.lev),
                        cqTitIcon: h.getCqTitIcon(a.lev),
                        userBdl: a.bdl,
                        sid: a.sid,
                        spg: a.spg,
                        srcNcnm: a.src_ncnm,
                        hits: a.hits,
                        giftType: m.type,
                        giftCount: m.pc,
                        giftCImg: m.cimg,
                        giftWidth: l[m.style],
                        giftHeight: l[m.style],
                        attr: {
                            web_url: f.get("sys.web_url")
                        }
                    })
            }
            ,
            g.gift1.RENDER = null ,
            g.gift2 = function (a, b) {
                a = d.decode(a).too();
                var i, j, k, l = {
                    1: 25,
                    2: 35,
                    3: 45,
                    4: 50,
                    5: 55,
                    6: 60
                }, m = b[a.gfid];
                return g.gift2.RENDER ? j = g.gift2.RENDER : (i = c.string.join('<li class="jschartli" data-type="list">', '<p class="text-cont">', "<% if (dlv > 0 && dc > 0) { %>", '<span class="chat-icon-pad cq-level c-lv<%=dlv%>" title="<%=cqName%>">', '<img src="<%=cqTitIcon%>">', "<em>×<%=dc%></em>", "</span>", "<% } else  {%>", "<% if (bdl > 0) { %>", '<img src="<%=attr.web_url%>app/douyu/res/page/room-show/cq/cq_other.png?v=20160322" class="chat-icon-pad cq-other" title="酬勤用户">', "<% } %>", "<% } %>", '<a class="chat-icon-pad user-level<%=ulevIn1t9 ? " lve-icon-1to9" : ""%>">', '<img src="<%=userIcon%>" title="用户等级：<%=userLev%>">', "</a>", '<a href="#" class="nick js-nick" rel="<%=uid%>" gid="<%=pg%>"><%=nn%></a>', "<span>赠送给主播</span>", "<% if (giftType == 1) { %>", "<span><%=giftCount%>个鱼丸</span>", "<% } %>", '<img class="lw-imgs" src="<%=giftCImg%>" width="<%=giftWidth%>" height="<%=giftHeight%>">', "<% if (hits > 1) { %>", "<span><%=hits%>连击</span>", "<% } %>", "</p>", "</li>"),
                    j = g.gift2.RENDER = e.compile(i)),
                    k = j({
                        uid: a.uid,
                        nn: a.nn,
                        dlv: a.dlv || 0,
                        dc: a.dc || 0,
                        bdl: a.bdl || 0,
                        pg: a.pg || 1,
                        rg: a.rg || 1,
                        hits: a.hits || 1,
                        userLev: a.level,
                        userIcon: h.getUserLevIcon(a.level),
                        ulevIn1t9: a.level >= 1 && a.level <= 9,
                        cqName: h.getUserCqName(a.dlv),
                        cqTitIcon: h.getCqTitIcon(a.dlv),
                        giftType: m.type,
                        giftCount: m.pc,
                        giftCImg: m.cimg,
                        giftWidth: l[m.style],
                        giftHeight: l[m.style],
                        attr: {
                            web_url: f.get("sys.web_url")
                        }
                    })
            }
            ,
            g.gift2.RENDER = null ,
            g.balls = function (a, b) {
                a = d.decode(a).too();
                var i, j, k, l = d.decode(a.sui).too();
                return g.balls.RENDER ? j = g.balls.RENDER : (i = c.string.join('<li class="jschartli older-balls" data-type="list">', '<p class="text-cont">', "<% if (dlv > 0 && dc > 0) { %>", '<span class="chat-icon-pad cq-level c-lv<%=dlv%>" title="<%=cqName%>">', '<img src="<%=cqTitIcon%>">', "<em>×<%=dc%></em>", "</span>", "<% } else  {%>", "<% if (bdl > 0) { %>", '<img src="<%=attr.web_url%>app/douyu/res/page/room-show/cq/cq_other.png?v=20160322" class="chat-icon-pad cq-other" title="酬勤用户">', "<% } %>", "<% } %>", '<a class="chat-icon-pad user-level<%=ulevIn1t9 ? " lve-icon-1to9" : ""%>">', '<img src="<%=userIcon%>" title="用户等级：<%=userLev%>">', "</a>", '<a href="#" class="nick js-nick" rel="<%=uid%>" gid="<%=pg%>"><%=nn%></a>', "<span>赠送给主播</span>", "<span><%=giftCount%>个鱼丸</span>", '<img class="lw-imgs" src="<%=attr.web_url%>app/douyu/res/page/room-normal/gift/mobile-yw-100.png?v=20160331" />', "</p>", "</li>"),
                    j = g.balls.RENDER = e.compile(i)),
                    k = j({
                        uid: l.id,
                        nn: l.nick,
                        dlv: l.cur_lev || 0,
                        dc: l.cq_cnt || 0,
                        bdl: l.best_dlev || 0,
                        pg: l.pg || 1,
                        rg: l.rg || 1,
                        hits: a.hc || 1,
                        userLev: l.level,
                        userIcon: h.getUserLevIcon(l.level),
                        ulevIn1t9: l.level >= 1 && l.level <= 9,
                        cqName: h.getUserCqName(l.cur_lev),
                        cqTitIcon: h.getCqTitIcon(l.cur_lev),
                        giftCount: a.ms,
                        attr: {
                            web_url: f.get("sys.web_url")
                        }
                    })
            }
            ,
            g.balls.RENDER = null ,
            g.rankupdate = function (a) {
                a = d.decode(a).too();
                var b, i, j;
                return g.rankupdate.RENDER ? i = g.rankupdate.RENDER : (b = c.string.join('<li class="jschartli chart-rank-up-tip" data-type="list">', '<div class="my-cont clearfix">', '<img src="<%=attr.web_url%>app/douyu/res/page/room-show/welcome.png?v=20160322">', '<div class="mycont-r">', "<% if (broadcastType == 2 || broadcastType == 4) { %>", "<p>", "<span>恭喜</span>", '<a class="nick js-nick" href="/<%=dstRoomId%>" target="_blank"><%=userNick%></a>', "</p>", "<% } else { %>", "<p>", "<span>恭喜</span>", '<a class="nick js0nick"><%=userNick%></a>', "</p>", "<% } %>", "<p>", "<span>的<%=rankTypeName%>排名上升到了第</span>", '<span class="highLight"><%=rankNum%></span>名！', "</p>", "</div>", "</div>", "</li>"),
                    i = g.rankupdate.RENDER = e.compile(b)),
                    j = i({
                        dstRoomId: "",
                        userNick: a.nk,
                        rankNum: a.rn,
                        rankTypeName: h.getRankTypeName(a.rkt),
                        broadcastType: a.bt,
                        attr: {
                            web_url: f.get("sys.web_url")
                        }
                    })
            }
            ,
            g.rankupdate.RENDER = null ,
            g.rankgap = function (a) {
                a = d.decode(a).too();
                var b = parseInt(a.nz, 10);
                if (1 !== b && 3 !== b)
                    return "";
                var i, j, k;
                return g.rankgap.RENDER ? j = g.rankgap.RENDER : (i = c.string.join('<li class="jschartli chart-rank-gap-tip">', '<div class="my-cont clearfix">', '<img src="/common/douyu/images/wel_rank_need.png?v=20160322"/>', '<div class="mycont-r">', "<span>继续赠送</span>", '<span class="highLight"><%=contributionGap%></span>', "点贡献值", "<p>", "<span>您就可以升到<%=rankTypeName%>第</span>", '<span class="highLight highLight2"><%=urln%></span>', "<span>名</span>", "</p>", "</div>", "</div>", "</li>"),
                    j = g.rankgap.RENDER = e.compile(i)),
                    k = j({
                        contributionGap: a.cg,
                        rankTypeName: h.getRankTypeName(a.rt),
                        urln: a.urn - 1,
                        attr: {
                            web_url: f.get("sys.web_url")
                        }
                    })
            }
            ,
            g.rankgap.RENDER = null ,
            g.luckburst = function (a) {
                if (a = d.decode(a).too(),
                        !a.ur)
                    return "";
                var b, i, j, k, l = parseInt(a.sil), m = parseInt(a.ur), k = l / m, n = parseInt(a.ct), o = parseInt(a["if"]);
                return 1 == n && k >= 1e3 ? (g.luckburst.RENDER1 ? i = g.luckburst.RENDER1 : (b = c.string.join('<li class="jschartli" data-type="list">', '<a href="/client" target="_blank" class="text-app text-app-phone">', '<span class="text-app-icon fl"></span> ', '<span class="text-app-des">', "<i>恭喜 <em><%=nick%></em> </i>", "<i>使用斗鱼手机APP领取了 ", '<b><img src="<%=attr.web_url%>app/douyu/res/page/room-show/olyw/olyw-1000.png?v=20160322"></b> 鱼丸', "</i>", "</span>", "</a>", "</li>"),
                    i = g.luckburst.RENDER1 = e.compile(b)),
                    j = i({
                        nick: a.nn,
                        attr: {
                            web_url: f.get("sys.web_url")
                        }
                    })) : 0 == n && k > 0 && m > 1 ? (g.luckburst.RENDER2 ? i = g.luckburst.RENDER2 : (b = c.string.join('<li class="jschartli" data-type="list">', "<% if (level >= 10) { %>", '<img class="cj-img" src="<%=attr.web_url%>app/douyu/res/page/room-show/olyw/baoji.png?v=20160322">', '<a class="chat-icon-pad user-level<%=ulevIn1t9 ? " lve-icon-1to9" : ""%>">', '<img src="<%=userIcon%>" title="用户等级：<%=userLev%>">', "</a>", '<span class="nick js-nick"><%=nick%></span>在第<%=lev%>次在线领鱼丸时触发', "<span><%=userRate%>倍暴击</span>，获得了", "<span><%=gold%></span>个鱼丸", '<img src="<%=attr.web_url%>app/douyu/res/page/room-show/olyw/yw.png?1">', "<% } else { %>", '<img class="cj-img" src="<%=attr.web_url%>app/douyu/res/page/room-show/olyw/lw-pc-img.png?v=20160322">', '<span class="nick js-nick"><%=nick%></span>', "在第<%=lev%>次在线领鱼丸时获得了<%=gold%>个鱼丸", '<img src="<%=attr.web_url%>app/douyu/res/page/room-show/olyw/yw.png?v=20160322">', "<% } %>", "</li>"),
                    i = g.luckburst.RENDER2 = e.compile(b)),
                    j = i({
                        gold: l,
                        lev: a["if"],
                        level: a.level,
                        nick: a.nn,
                        userIcon: h.getUserLevIcon(a.level),
                        userLev: a.level,
                        userRate: m,
                        ulevIn1t9: a.level >= 1 && a.level <= 9,
                        attr: {
                            web_url: f.get("sys.web_url")
                        }
                    })) : 0 == n && 6 == o && k > 0 ? (g.luckburst.RENDER3 ? i = g.luckburst.RENDER3 : (b = c.string.join('<li class="jschartli" data-type="list">', '<img src="<%=attr.web_url%>app/douyu/res/page/room-show/cq/cq-pic.png?v=20160322">', '<img src="<%=attr.web_url%>app/douyu/res/page/room-show/cq/cq_other.png?v=20160322" class="chat-icon-pad cq-other" title="酬勤用户">', '<span class="nick js-nick"><%=nick%></span>', "<span>通过在线领鱼丸获得了</span>", "<span><%=gold%></span>个", "<span>酬勤专享鱼丸</span>", '<img src="<%=attr.web_url%>app/douyu/res/page/room-show/olyw/yw.png?v=20160322">', "</li>"),
                    i = g.luckburst.RENDER3 = e.compile(b)),
                    j = i({
                        gold: l,
                        nick: a.nn,
                        attr: {
                            web_url: f.get("sys.web_url")
                        }
                    })) : void 0
            }
            ,
            g.luckburst.RENDER1 = null ,
            g.luckburst.RENDER2 = null ,
            g.luckburst.RENDER3 = null ,
            g.peck = function (a) {
                a = d.decode(a).too();
                var b, h, i;
                return g.peck.RENDER ? h = g.peck.RENDER : (b = c.string.join('<li class="jschartli" data-type="list">', '<p class="text-cont">', '<img class="cj-img" src="<%=attr.web_url%>app/douyu/res/page/room-show/gift/msg-ywol.png?v=20160322" />', '<a href="javascript:;" class="nick" style="cursor:text;" rel="<%=did%>"><%=dnk%></a>', "<span> 领取了 </span>", '<span class="hy-org"><%=snk%></span>', "<span> 派送的 </span>", '<span class="hy-org"><%=sl%></span>', "<span>个鱼丸</span>", "</p>", "</li>"),
                    h = g.peck.RENDER = e.compile(b)),
                    i = h({
                        did: a.did,
                        dnk: a.dnk,
                        snk: a.snk,
                        sl: a.sl,
                        attr: {
                            web_url: f.get("sys.web_url")
                        }
                    })
            }
            ,
            g.peck.RENDER = null ,
            g.uplevel = function (a) {
                a = d.decode(a).too();
                var i, j, k, l = a.level;
                return parseInt(l / 10),
                $SYS.uid == a.uid && b.trigger("mod.chatrank.cqrankupdate", l),
                    10 == l || 20 == l || 30 == l || 40 == l || 50 == l || 60 == l ? (g.uplevel.RENDER ? j = g.uplevel.RENDER : (i = c.string.join('<li class="jschartli" data-type="list">', '<p class="text_cont">', "<% if (level >= 10) { %>", '<span class="user_level_wel"><img src="<%=attr.web_url%>app/douyu/res/page/room-normal/w_grow_lv<%= level %>.png?v=20160428" style="padding-left:0;" /></span>', "<% } %>", '<span style="margin-right:8px;">恭喜</span>', '<a class="chat-icon-pad user_level  <%=ulevIn1t9 ? " lve-icon-1to9" : ""%>">', '<img src="<%= userIcon %>" title="用户等级：<%= level %>" style="vertical-align:middle;"/>', "</a>", '<span class="name"><a href="javascript:;" class="nick js-nick" rel="<%= uid %>" gid="<%= gid %>"><%= user_nick %></a></span>', '升级到<span style="color:rgb(230,0,18);margin:0 2px;"><%= level %></span>级!', "</p>", "</li>"),
                        j = g.uplevel.RENDER = e.compile(i)),
                        k = j({
                            level: l,
                            uid: a.uid,
                            user_nick: a.nn,
                            gid: a.gid,
                            userIcon: h.getUserLevIcon(l),
                            ulevIn1t9: l >= 1 && 9 >= l,
                            attr: {
                                web_url: f.get("sys.web_url")
                            }
                        })) : void 0
            }
            ,
            g.uplevel.RENDER = null ,
            g
    }),
    define("douyu/page/room/normal/mod/chat-msg", ["jquery", "shark/observer", "shark/util/lang/1.0", "shark/util/flash/data/1.0", "shark/util/template/1.0", "douyu/context", "douyu/com/user", "douyu/com/vcode9", "douyu/page/room/base/api", "douyu/page/room/normal/mod/chat-msg-queue", "douyu/page/room/normal/mod/chat-msg-tmp"], function (a, b, c, d, e, f, g, h, i, j, k) {
        var l = {
            limitConfig: {
                vistor: 200,
                normal: 200,
                anchor: 1e3,
                roomAdmin: 1e3,
                superAdmin: 1e3
            }
        }
            , m = {}
            , n = {}
            , o = {};
        n.init = function () {
            n.$chatCont = a("#js-chat-cont"),
                n.$chatContWrap = n.$chatCont.find('[data-type="chat-cont"]'),
                n.$chatList = n.$chatContWrap.find('ul[data-type="chat-list"]'),
                n.$roll = n.$chatCont.find('[data-type="roll"]'),
                n.$chatSpeak = a("#js-chat-speak")
        }
            ,
            o.init = function () {
                n.$chatCont.on("click", "span.super-barrage", function () {
                    var b, c = a(this), e = f.get("room.room_id"), g = f.get("sys.uid"), h = c.data("trid"), j = c.data("sdid"), k = c.html();
                    e != h && (b = [{
                        name: "sdid",
                        value: j
                    }, {
                        name: "trid",
                        value: h
                    }, {
                        name: "content",
                        value: k
                    }, {
                        name: "rid",
                        value: e
                    }, {
                        name: "uid",
                        value: g
                    }],
                        i.exe("js_superDanmuClick", d.encode(b)),
                        window.open("/" + h))
                })
            }
            ,
            m.init = function () {
                m.Queue = new j({
                    releaseStep: function (a) {
                        m.addView(a)
                    }
                }),
                    b.on("mod.center.userrole.ready", function (a) {
                        a.isVistor() ? l.limitMaxl = l.limitConfig.vistor : a.isSuperAdmin() ? l.limitMaxl = l.limitConfig.superAdmin : a.isRoomAdmin() ? l.limitMaxl = l.limitConfig.roomAdmin : a.isAnchor() ? l.limitMaxl = l.limitConfig.anchor : l.limitMaxl = l.limitConfig.normal
                    }),
                    b.on("mod.chat.msg.msg", function (a) {
                        void 0 !== a && "" !== a && m.addQueue(a)
                    }),
                    b.on("mod.chat.msg.clear.chat", function () {
                        m.clearChat()
                    })
            }
            ,
            m.addQueue = function (a) {
                m.Queue.may(a)
            }
            ,
            m.addView = function (a) {
                n.$chatList.append(a),
                    m.limit(),
                    m.scrollToBottom()
            }
            ,
            m.clearChat = function () {
                n.$chatList.html("");
                var a = '<li class="jschartli"><p class="my-cont"><span style="color:#f00;">已清空所有弹幕内容</span></p></li>';
                b.trigger("mod.chat.msg.msg", a)
            }
            ,
            m.limit = function () {
                var b = n.$chatList.find('li[data-type="list"]')
                    , c = b.length - l.limitMaxl;
                c > 0 && b.each(function (b) {
                    return c >= b ? (a(this).remove(),
                        !0) : !1
                })
            }
            ,
            m.scrollToBottom = function () {
                if (!n.$roll.hasClass("c-scr")) {
                    var a = n.$chatContWrap.prop("scrollHeight");
                    n.$chatContWrap.scrollTop(a)
                }
            }
            ,
            m.sendVerify = function (b, c) {
                var d, e, f;
                f = b ? b : {},
                    c = a.isFunction(c) ? c : function () {
                    }
                    ,
                    e = function (b) {
                        a.ajax("/member/gift/verify", {
                            type: "post",
                            dataType: "json",
                            data: {
                                dy: f.dy,
                                task_ca: b
                            },
                            error: function () {
                                d.destroy(),
                                    a.dialog.tips_black("发送彩色弹幕失败！", 1.5)
                            },
                            success: function (b) {
                                var e = b.result;
                                0 == e ? (d.destroy(),
                                    c()) : (d.refresh(),
                                    a.dialog.tips_black(b.msg, 1.5))
                            }
                        })
                    }
                    ,
                    d = h.create({
                        title: "请输入验证码",
                        sence: "task",
                        lock: !0,
                        onSelectOver: e
                    })
            }
        ;
        var p = function (c) {
                var e, g = b.fire("mod.center.userrole.get"), h = {
                    len: 200
                };
                if ("chatres" !== c.type && "chatmsg" !== c.type || (e = a.extend(!0, {}, {
                        isSender: parseInt(c.uid, 10) === parseInt(f.get("sys.uid"), 10),
                        uid: c.uid,
                        nn: c.nn,
                        txt: c.txt,
                        cid: c.cid,
                        level: parseInt(c.level, 10) || 0,
                        gt: parseInt(c.gt, 10) || 0,
                        col: parseInt(c.col, 10) || 0,
                        ct: parseInt(c.ct, 10) || 0,
                        rg: parseInt(c.rg, 10) || 1,
                        pg: parseInt(c.pg, 10) || 1,
                        dlv: c.dlv || 0,
                        dc: c.dc || 0,
                        bdlv: c.bdlv || 0,
                        ut: c.ut || "",
                        at: c.at || "",
                        shark: c.shark || ""
                    }, e),
                    "chatres" === c.type && (e.isSender = !0,
                        e.len = parseInt(c.len, 10),
                        a.extend(!0, h, {
                            isSender: !0,
                            res: c.res,
                            cd: parseInt(c.cd, 10),
                            len: parseInt(c.len, 10)
                        }),
                        b.trigger("mod.chat.msg.send.cd", h.cd),
                        n.$chatSpeak.find('[data-type="cont"]').prop({
                            maxlength: h.len
                        }))),
                    "chatmessage" === c.type && (e = a.extend(!0, {}, {
                        isSender: parseInt(c.sender, 10) === parseInt(f.get("sys.uid"), 10),
                        uid: c.sender,
                        nn: c.sender_nickname,
                        txt: c.content,
                        cid: c.chatmsgid,
                        level: parseInt(c.level, 10) || 0,
                        gt: parseInt(c.gt, 10) || 0,
                        col: parseInt(c.col, 10) || 0,
                        ct: parseInt(c.ct, 10) || 0,
                        rg: parseInt(c.sender_rg, 10) || 1,
                        pg: parseInt(c.sender_pg, 10) || 1,
                        dlv: c.m_deserve_lev || 0,
                        dc: c.cq_cnt || 0,
                        bdlv: c.best_dlev || 0,
                        len: parseInt(c.maxl, 10),
                        ut: c.ut || "",
                        at: c.at || "",
                        shark: c.shark || ""
                    }, e),
                        a.extend(!0, h, {
                            isSender: parseInt(c.sender, 10) === parseInt(f.get("sys.uid"), 10),
                            res: c.rescode,
                            cd: parseInt(c.cd, 10),
                            len: parseInt(c.len, 10)
                        }),
                        b.trigger("mod.chat.msg.send.cd", h.cd),
                        n.$chatSpeak.find('[data-type="cont"]').prop({
                            maxlength: h.len
                        })),
                    h.res > 0) {
                    if (h.isSender) {
                        var j = "";
                        switch (h.res) {
                            case "2":
                                j = "您已被禁言";
                                break;
                            case "5":
                                j = "全站禁言";
                                break;
                            case "289":
                                j = "请不要重复发言。";
                                break;
                            case "290":
                                j = "您的发言速度过快....";
                                break;
                            case "294":
                                a.dialog({
                                    content: "鱼翅余额不足，点击获取！",
                                    icon: "warning",
                                    okVal: "确定",
                                    ok: function () {
                                        window.location.href = "/web_game/welcome/18"
                                    },
                                    cancelVal: "取消",
                                    cancel: function () {
                                    }
                                });
                                break;
                            case "363":
                                m.sendVerify({
                                    dy: c.cid
                                }, function () {
                                    i.exe("js_sendmsg", d.encode([{
                                        name: "content",
                                        value: c.txt.replace(/\\/g, "\\\\")
                                    }, {
                                        name: "col",
                                        value: c.col
                                    }, {
                                        name: "sender",
                                        value: f.get("sys.uid")
                                    }]))
                                })
                        }
                        j.length && b.trigger("mod.chat.msg.msg", '<li class="jschartli"><p class="text-cont"><a style="color:#f00;">' + j + "</a></p></li>")
                    }
                    return void ("288" != h.res && "356" != h.res || (b.trigger("mod.chat.msg.msg", k.barrage(e)),
                        b.trigger("mod.center.usergroup.set", e.uid, {
                            pg: e.pg,
                            rg: e.rg
                        })))
                }
                if (g.isSuperAdmin() || g.isAnchor() || (h.len = e.len),
                        b.trigger("mod.chat.msg.msg", k.barrage(e)),
                        b.trigger("mod.center.usergroup.set", e.uid, {
                            pg: e.pg,
                            rg: e.rg
                        }),
                    f.get("sys.uid") == e.uid && e.col > 0) {
                    if (1 === e.col && "hjs" === e.shark)
                        return;
                    b.trigger("mod.userinfo.change", {
                        change: {
                            exp: 10
                        }
                    })
                }
            }
            , q = function (a) {
                var c;
                if ("uenter" === a.type && (c = {
                        level: parseInt(a.level, 10),
                        lev: parseInt(a.level / 10, 10),
                        dlv: parseInt(a.dlv, 10) || 0,
                        dc: parseInt(a.dc, 10) || 0,
                        bdlv: parseInt(a.bdlv, 10) || 0,
                        gt: parseInt(a.gt, 10) || 0,
                        rg: parseInt(a.rg, 10) || 1,
                        pg: parseInt(a.pg, 10) || 1,
                        uid: parseInt(a.uid, 10),
                        nn: a.nn || "",
                        ut: a.ut || "",
                        at: a.at || ""
                    }),
                    "userenter" === a.type) {
                    var e = d.decode(a.userinfo).too();
                    c = {
                        level: parseInt(e.level, 10),
                        lev: parseInt(e.level / 10, 10),
                        dlv: parseInt(e.m_deserve_lev, 10) || 0,
                        dc: parseInt(e.cq_cnt, 10) || 0,
                        bdlv: parseInt(e.best_dlev, 10) || 0,
                        gt: parseInt(e.gt, 10) || 0,
                        rg: parseInt(e.rg, 10) || 1,
                        pg: parseInt(e.pg, 10) || 1,
                        uid: parseInt(e.id, 10),
                        nn: e.nick || "",
                        ut: a.ut || "",
                        at: a.at || ""
                    }
                }
                return c.level < 20 && (c.gt <= 0 || c.gt >= 4) ? !1 : (b.trigger("mod.chat.msg.msg", k.userEnter(c)),
                    void b.trigger("mod.center.usergroup.set", c.uid, {
                        pg: c.pg,
                        rg: c.rg
                    }))
            }
            ;
        return i.reg("room_data_chat", function (a) {
            p(d.decode(a).too())
        }),
            i.reg("room_data_chat2", function (a) {
                p(d.decode(a).too())
            }),
            i.reg("room_data_nstip", function (a) {
                q(d.decode(a).too())
            }),
            i.reg("room_data_nstip2", function (a) {
                q(d.decode(a).too())
            }),
            i.reg("room_data_luckdrawcd", function (a) {
                b.trigger("mod.chat.msg.msg", k.lottery(a))
            }),
            i.reg("room_data_chatrep", function (b) {
                var c = d.decode(b).too()
                    , e = "";
                e = 1 == c.state ? "<p>您已成功举报了弹幕！<p><br><p>超管在后台确认该弹幕违规后，会对弹幕发言人<br />进行相应的处理，并对首位举报该弹幕的用户赠<br />送100鱼丸。 鱼丸会直接发放到帐号上，无需通<br />过任务大厅领取。</p>" : "<p>举报失败</p>",
                    a.dialog.alert(e)
            }),
            i.reg("room_data_setadm", function (a) {
                var c = d.decode(a).too();
                b.trigger("mod.chat.msg.msg", k.setAdmin(c)),
                0 === parseInt(c.rescode, 10) && b.trigger("mod.center.usergroup.set", c.userid, {
                    rg: c.group
                })
            }),
            i.reg("room_data_onekeyacc", function (c) {
                var e = d.decode(c).too();
                b.trigger("mod.chat.msg.msg", k.oneKey(e)),
                f.get("sys.uid") == e.uid && (b.trigger("mod.gift.auto.send.set", !1),
                    b.trigger("mod.chouqin.auto.send.set", !1),
                    b.trigger("mod.task.destroy", !1),
                    b.trigger("mod.olyw.destroy", !1),
                    n.$chatSpeak.find('[data-type="send"]').addClass("b-btn-gray"),
                    a.dialog.tips_black("当前用户已被封号不能发送弹幕！", 3))
            }),
            i.reg("room_data_sys", function (c) {
                if ("全站禁言" === c) {
                    var d = null
                        , e = 0
                        , f = function () {
                            e = 0,
                            d && d.close && (d.close(),
                                d = null )
                        }
                        , g = function () {
                            return e >= 3 ? (a.dialog({
                                content: "服务器繁忙，请稍后再试.",
                                time: 3
                            }),
                                void f()) : (e++,
                                void a.ajax("/curl/smscp/chat_verify", {
                                    type: "POST",
                                    dataType: "json",
                                    success: function (b) {
                                        var c = b.result
                                            , d = b.error;
                                        return 0 === c ? (f(),
                                            void a.dialog({
                                                content: d,
                                                time: 3,
                                                okVal: "确定",
                                                ok: function () {
                                                },
                                                close: function () {
                                                    window.location.reload()
                                                }
                                            })) : -1 === c || 101 === c || 102 === c || 103 === c || 105 === c ? (a.dialog({
                                            content: d,
                                            time: 3
                                        }),
                                            void f()) : void setTimeout(g, 2e4)
                                    }
                                }))
                        }
                        ;
                    d = a.dialog({
                        width: 640,
                        height: 170,
                        content: "您最近的发言记录存在违规行为，发言权限已经被冻结。请使用当前账号绑定的手机号码<br/><br/>发送短信：danmu 至号码：+86 137 2032 1374  进行验证。发送完成后请点击我已发送",
                        okVal: "我已发送",
                        ok: function () {
                            if (!(e > 0)) {
                                var b = a(d.DOM.dialog).find(".aui_state_highlight");
                                return g(),
                                    b.text("验证中..."),
                                    !1
                            }
                        },
                        lock: !0,
                        close: function () {
                            d = null
                        }
                    }),
                        a(d.DOM.dialog).find(".aui_icon").hide()
                } else
                    b.trigger("mod.chat.msg.msg", '<li class="jschartli"><p class="text-cont"><span style="color:#f00;">系统广播: ' + c + "</span></p></li>")
            }),
            i.reg("room_data_schat", function (a) {
                b.fire("mod.chat.msg.shield").message || b.trigger("mod.chat.msg.msg", k.superBarrage(a))
            }),
            i.reg("room_data_ulico", function (a) {
                var c = d.decode(a).too();
                return c.uid != f.get("sys.uid") && b.fire("mod.chat.msg.shield").message ? !1 : void b.trigger("mod.chat.msg.msg", k.ulico(a))
            }),
            b.on("mod.chat.msg.res.cq", function (a) {
                var c = d.decode(a).too()
                    , e = d.decode(c.sui).too();
                return e.id != f.get("sys.uid") && b.fire("mod.chat.msg.shield").info ? !1 : void b.trigger("mod.chat.msg.msg", k.chouqin(a))
            }),
            b.on("mod.chat.msg.gift", function (a, c) {
                var e, g = d.decode(a).too();
                if ("dgn" === g.type) {
                    if (e = k.gift1(a, c),
                        g.sid != f.get("sys.uid") && b.fire("mod.chat.msg.shield").info)
                        return !1;
                    b.trigger("mod.center.usergroup.set", g.sid, {
                        pg: g.spg || 1,
                        rg: g.srg || 1
                    })
                }
                if ("dgb" === g.type) {
                    if (e = k.gift2(a, c),
                        g.uid != f.get("sys.uid") && b.fire("mod.chat.msg.shield").info)
                        return !1;
                    b.trigger("mod.center.usergroup.set", g.uid, {
                        pg: g.pg || 1,
                        rg: g.rg || 1
                    })
                }
                if ("ggbb" === g.type && (e = k.peck(a),
                    g.did != f.get("sys.uid") && b.fire("mod.chat.msg.shield").message))
                    return !1;
                if ("donateres" === g.type) {
                    var h = d.decode(g.sui).too();
                    if (e = k.balls(a),
                        h.id != f.get("sys.uid") && b.fire("mod.chat.msg.shield").info)
                        return !1;
                    b.trigger("mod.center.usergroup.set", h.id, {
                        pg: h.pg || 1,
                        rg: h.rg || 1
                    })
                }
                b.trigger("mod.chat.msg.msg", e)
            }),
            b.on("mod.chat.msg.res.rankupdate", function (a) {
                var c = d.decode(a).too();
                return c.uid != f.get("sys.uid") && b.fire("mod.chat.msg.shield").message ? !1 : void b.trigger("mod.chat.msg.msg", k.rankupdate(a))
            }),
            b.on("mod.chat.msg.res.rankgap", function (a) {
                b.trigger("mod.chat.msg.msg", k.rankgap(a))
            }),
            b.on("mod.chat.msg.res.olyw.luckburst", function (a) {
                var c = d.decode(a).too();
                return c.uid != f.get("sys.uid") && b.fire("mod.chat.msg.shield").message ? !1 : void b.trigger("mod.chat.msg.msg", k.luckburst(a))
            }),
            i.reg("room_data_ulgrow", function (a) {
                var c = d.decode(a).too();
                return c.uid != f.get("sys.uid") && b.fire("mod.chat.msg.shield").message ? !1 : void b.trigger("mod.chat.msg.msg", k.uplevel(a))
            }),
        {
            init: function () {
                n.init(),
                    o.init(),
                    m.init()
            }
        }
    }),
    define("douyu/page/room/normal/mod/chat-send", ["jquery", "shark/observer", "shark/util/flash/data/1.0", "douyu/context", "douyu/com/user", "douyu/page/room/base/api"], function (a, b, c, d, e, f) {
        var g = {
            currentVal: "",
            lastText: "",
            cdTime: 1,
            cursurPosition: 0
        }
            , h = {}
            , i = {}
            , j = {};
        return h.init = function () {
            h.$target = a("#js-send-msg"),
                h.$content = h.$target.find('[data-type="cont"]'),
                h.$send = h.$target.find('[data-type="send"]'),
                h.$log = h.$target.find('[data-type="log"]'),
                e.check() ? (h.$log.hide(),
                    h.$send.removeClass("b-btn-gray")) : (h.$log.show(),
                    h.$send.addClass("b-btn-gray")),
                b.on("mod.center.userrole.ready", function (a) {
                    a.isVistor() ? (h.$log.show(),
                        h.$send.addClass("b-btn-gray")) : (h.$log.hide(),
                        h.$send.removeClass("b-btn-gray"))
                }),
                b.on("mod.chat.msg.exp", function (a) {
                    var b = h.$content[0]
                        , c = h.$content.attr("placeholder");
                    b.value === c && (b.value = ""),
                    b.value.length < b.maxLength && (b.value = b.value.substring(0, g.cursurPosition) + "[emot:" + a + "]" + b.value.substring(g.cursurPosition),
                        b.focus())
                }),
                b.on("mod.chat.msg.color.set", function (a) {
                    null === a ? h.$content.removeAttr("style").focus() : h.$content.css({
                        color: a
                    }).focus()
                }),
                b.on("mod.chat.msg.send.cd", function (a) {
                    g.cdTime = a
                })
        }
            ,
            i.roomLinkCheck = function (b) {
                var c = /\[room\=([^\]]+)\]/gi
                    , d = /\[room\=([a-z\d]+)\]/gi
                    , e = b.match(c)
                    , f = 1;
                return e && a.each(e, function (a, b) {
                    return d.test(b) ? void 0 : (f = 0,
                        !1)
                }),
                    f
            }
            ,
            i.sendMsg = function () {
                var j, k = a.trim(h.$content.val()) || a.trim(g.currentVal), l = b.fire("mod.chat.msg.color.get"), m = "";
                if (!h.$send.hasClass("b-btn-gray")) {
                    if ("" === k)
                        return void h.$content.val("").focus();
                    if (!e.check())
                        return void e.show("login");
                    if (g.lastText === k)
                        return m = '<li class="jschartli"><p class="text-cont"><span style="color:#f00;">请不要重复发言。</span></p></li>',
                            void b.trigger("mod.chat.msg.msg", m);
                    if (!i.roomLinkCheck(k))
                        return m = '<li class="jschartli"><p class="text-cont"><span style="color:#f00;">您输入的代码中含有非法字符，请重新输入。</span></p></li>',
                            void b.trigger("mod.chat.msg.msg", m);
                    "" === k.replace(/\[emot:[A-Za-z0-9_]+\]/g, "") && (l = 0),
                        j = [{
                            name: "content",
                            value: k.replace(/\\/g, "\\\\")
                        }, {
                            name: "col",
                            value: l
                        }, {
                            name: "sender",
                            value: d.get("sys.uid")
                        }],
                        f.exe("js_sendmsg", c.encode(j)),
                        g.lastText = k,
                        h.$content.val("").focus(),
                        g.currentVal = "",
                    g.cdTime > 0 && i.interval()
                }
            }
            ,
            i.interval = function () {
                var a = h.$send.html()
                    , b = g.cdTime
                    , c = null
                    , d = null;
                d = function () {
                    0 >= b ? (h.$send.removeClass("b-btn-gray").html(a),
                        clearInterval(c)) : (h.$send.addClass("b-btn-gray").html(b),
                        b--)
                }
                    ,
                    d(),
                    c = setInterval(function () {
                        d()
                    }, 1e3)
            }
            ,
            j.init = function () {
                h.$log.on("click", '[data-type="login"]', function (a) {
                    a.preventDefault(),
                        e.show("login")
                }),
                    h.$send.on("click", function (a) {
                        a.preventDefault(),
                            g.currentVal = h.$content.val(),
                            i.sendMsg()
                    }),
                    h.$content.on("keydown click focus keyup", function (a) {
                        if (document.selection) {
                            var b = document.selection.createRange()
                                , c = document.body.createTextRange()
                                , d = 0;
                            for (c.moveToElementText(this); c.compareEndPoints("StartToStart", b) < 0; d++)
                                c.moveStart("character", 1);
                            g.cursurPosition = d
                        } else
                            g.cursurPosition = this.selectionStart
                    }).on("keypress", function (a) {
                        return 13 === a.which ? (g.currentVal = this.value,
                            i.sendMsg(),
                            !1) : void 0
                    }).on("input propertychange", function () {
                        this.value.length >= this.maxLength && (this.value = this.value.substr(0, this.maxLength))
                    })
            }
            ,
            f.reg("room_data_chatinit", function (a) {
                var e = c.decode(a).too()
                    , f = b.fire("mod.center.userrole.get")
                    , i = parseInt(e.maxl, 10);
                f.isAnchor() || f.isSuperAdmin() ? h.$content.prop({
                    maxLength: 200
                }) : d.get("sys.uid") == e.uid && h.$content.prop({
                    maxLength: i
                }),
                    g.cdTime = e.cd / 1e3
            }),
            f.reg("room_bus_phobi", function (a) {
                var d = c.decode(a).too()
                    , e = !b.fire("mod.center.userrole.get").isVistor()
                    , f = parseInt(d.npv, 10);
                !f && e ? (h.$log.hide(),
                    h.$send.removeClass("b-btn-gray")) : 1 === f && (h.$log.show().html('<a class="is-log" data-type="phobi" href="/member/cp#phone" target="_blank">验证手机号</a>即可发送弹幕！'),
                    h.$send.addClass("b-btn-gray"))
            }),
            f.reg("room_data_reg", function (a) {
                if (!e.check())
                    return e.show("reg"),
                        void f.exe("js_sendhandler", [2, ""]);
                var b = [{
                    name: "content",
                    value: a.replace(/\\/g, "\\\\")
                }, {
                    name: "sender",
                    value: d.get("sys.uid")
                }];
                f.exe("js_sendmsg", c.encode(b)),
                    h.$content.val(""),
                g.cdTime > 0 && i.interval(),
                    f.exe("js_sendhandler", [0, g.cdTime])
            }),
        {
            init: function () {
                h.init(),
                    j.init()
            }
        }
    }),
    define("douyu/page/room/normal/mod/chat-rank", ["jquery", "shark/class", "shark/observer", "shark/util/lang/1.0", "shark/util/flash/data/1.0", "shark/util/template/2.0", "douyu/context", "douyu/page/room/base/api"], function (a, b, c, d, e, f, g, h) {
        var i, j = {
            rank_type: {
                week: "week",
                all: "all"
            },
            rank_def_height: {
                week: 115,
                all: 115
            }
        }, k = b({
            init: function (b) {
                this.config = a.extend(!0, {}, {
                    $el: a("#mainbody .chat .fans-rank"),
                    current: j.rank_type.week,
                    onChange: function () {
                    },
                    highLevel: 60
                }, b),
                    this.render(),
                    this.bindEvt()
            },
            render: function () {
                this.config.$weekTit = this.config.$el.find(".f-tit [data-type=week]"),
                    this.config.$allTit = this.config.$el.find(".f-tit [data-type=all]"),
                    this.config.$weekCon = this.config.$el.find(".f-con [data-type=week]"),
                    this.config.$allCon = this.config.$el.find(".f-con [data-type=all]"),
                    this.config.$weekCon.removeClass("hide").show(),
                    this.config.$allCon.removeClass("hide").hide()
            },
            height: function () {
                return this.$el.height()
            },
            outerHeight: function (a) {
                return a === !0 ? this.$el.outerHeight(!0) : this.$el.outerHeight()
            },
            current: function (a) {
                return 0 === arguments.length ? this.config.current : void this.showRank(a)
            },
            rankListForMat: function (a) {
                for (var b = 0; b < a.length; b++) {
                    var c = parseInt(a[b].lrk);
                    c >= 1 && 10 >= c ? a[b].lrkTitle = "之前排名第" + c + "位" : a[b].lrkTitle = "之前未上榜"
                }
                return a
            },
            resetWeekRank: function (a) {
                for (var b, c, h = [], i = this, j = 0, k = a.length; k > j; j++)
                    b = e.decode(a[j].value),
                        h.push(b);
                for (var j = 0, k = h.length; k > j; j++)
                    b = h[j],
                        h[j] = e.too(b),
                    h[j].gold && (h[j].gold = parseInt(h[j].gold / 100)),
                    h[j].level && (c = h[j].level > this.config.highLevel ? this.config.highLevel : h[j].level,
                        h[j].level = c);
                var l = d.string.join("{{each list as item}}", "{{if $index == 0}}", '<li class="first">', "{{else}}", "<li>", "{{/if}}", "{{if $index <= 2}}", '<img class="hg" src="{{attr.web_url}}app/douyu/res/page/room-normal/normal-fans-hg0{{$index + 1}}.png?v=20160322">', "{{else}}", '<i class="n-icon">{{$index + 1}}</i>', "{{/if}}", '<span class="l-icon cuserlevel" data-uid="{{item.uid}}">', '<img src="{{attr.web_url}}app/douyu/res/page/room-normal/level/LV{{item.level}}.', '{{item.level >= 40 ? "gif" : "png"}}', '?v=20160427" title="用户等级：{{item.level}}" alt=""></span>', '<span class="r-nick" title="{{item.nickname}}">{{item.nickname}}</span>', '<a class="r-img">', "{{if item.rs == 1}}", '<img src="{{attr.web_url}}app/douyu/res/page/room-normal/rank-up.png?v=20160322" title="{{item.lrkTitle}}" alt="">', "{{/if}}", "{{if item.rs == -1}}", '<img src="{{attr.web_url}}app/douyu/res/page/room-normal/rank-down.png?v=20160322" title="{{item.lrkTitle}}" alt="">', "{{/if}}", "{{if item.rs == 0}}", '<img src="{{attr.web_url}}app/douyu/res/page/room-normal/rank-nochange.png?v=20160322" alt="">', "{{/if}}", "</a>", "</li>", "{{/each}}")
                    , m = f.compile(l)
                    , n = m({
                    list: i.rankListForMat(h),
                    attr: {
                        web_url: g.get("sys.web_url")
                    }
                });
                this.config.weekSource = h,
                    this.config.$weekCon.find("ul").html(n)
            },
            resetAllRank: function (a) {
                for (var b, c, h = [], i = 0, j = a.length; j > i; i++)
                    b = e.decode(a[i].value),
                        h.push(b);
                for (var i = 0, j = h.length; j > i; i++)
                    b = h[i],
                        h[i] = e.too(b),
                    h[i].gold && (h[i].gold = parseInt(h[i].gold / 100)),
                    h[i].level && (c = h[i].level > this.config.highLevel ? this.config.highLevel : h[i].level,
                        h[i].level = c);
                var k = d.string.join("{{each list as item}}", "{{if $index == 0}}", '<li class="first">', "{{else}}", "<li>", "{{/if}}", "{{if $index <= 2}}", '<img class="hg" src="{{attr.web_url}}app/douyu/res/page/room-normal/normal-fans-hg0{{$index + 1}}.png?v=20160322">', "{{else}}", '<i class="n-icon">{{$index + 1}}</i>', "{{/if}}", '<span class="l-icon cuserlevel" data-uid="{{item.uid}}">', '<img src="{{attr.web_url}}app/douyu/res/page/room-normal/level/LV{{item.level}}.', '{{item.level >= 40 ? "gif" : "png"}}', '?v=20160427" title="用户等级：{{item.level}}" alt=""></span>', '<span class="r-nick" title="{{item.nickname}}">{{item.nickname}}</span>', '<a class="r-img">', "{{if item.rs == 1}}", '<img src="{{attr.web_url}}app/douyu/res/page/room-normal/rank-up.png?v=20160322" title="{{item.lrkTitle}}" alt="">', "{{/if}}", "{{if item.rs == -1}}", '<img src="{{attr.web_url}}app/douyu/res/page/room-normal/rank-down.png?v=20160322" title="{{item.lrkTitle}}" alt="">', "{{/if}}", "{{if item.rs == 0}}", '<img src="{{attr.web_url}}app/douyu/res/page/room-normal/rank-nochange.png?v=20160322" alt="">', "{{/if}}", "</a>", "</li>", "{{/each}}")
                    , l = this
                    , m = f.compile(k)
                    , n = m({
                    list: l.rankListForMat(h),
                    attr: {
                        web_url: g.get("sys.web_url")
                    }
                });
                this.config.allSource = h,
                    this.config.$allCon.find("ul").html(n)
            },
            showRank: function (a) {
                var b = j.rank_def_height;
                this.config.$weekTit.removeClass("cur"),
                    this.config.$allTit.removeClass("cur"),
                    this.config.$weekCon.hide(),
                    this.config.$allCon.hide(),
                    a === j.rank_type.week ? (this.config.$weekTit.addClass("cur"),
                        this.config.$weekCon.show()) : a === j.rank_type.all && (this.config.$allTit.addClass("cur"),
                        this.config.$allCon.show()),
                    this.config.$el.height(b[a]),
                    this.config.$el.find(".fans-list").height(b[a]),
                    this.config.current = a,
                    this.config.onChange(this)
            },
            showRankIf: function () {
                var a = j.rank_type
                    , b = this.config.weekSource
                    , d = b && b.length
                    , e = this.config.allSource
                    , f = e && e.length;
                d ? this.config.$el.show().height(j.rank_def_height.week) : (this.showRank(a.all),
                    this.config.$weekCon.find("ul").html('<li style="text-align:center;margin-top:28px;">暂时无人上榜</li>'),
                    f ? this.config.$el.show().height(j.rank_def_height.all) : this.config.$el.hide().height(0)),
                    c.trigger("mod.chat.height.change")
            },
            detailRank: function (b, c) {
                var d, e = 0, f = this.config.$el, g = f.find(".fans-list"), h = j.rank_def_height;
                return b ? (d = f.find(".f-con .f-cn[data-type=" + c + "]").find(".r-list li"),
                    d.length ? (d.each(function () {
                        e += a(this).outerHeight(!0)
                    }),
                        e += 38,
                        c === j.rank_type.week && e > h[c] ? g.height(e) : c === j.rank_type.all && e > h[c] ? g.height(e) : void 0) : void 0) : (f.height(h[c]),
                    void g.height(h[c]))
            },
            returnUlevelIcon: function (a) {
                var b = this;
                return g.get("sys.web_url") + "/app/douyu/res/page/room-normal/level/LV" + (a < b.config.highLevel + 1 ? a : b.config.highLevel) + (a >= 40 ? ".gif" : ".png") + "?" + Math.random()
            },
            upRankListCurUserLev: function (b) {
                var c = this;
                this.config.$weekCon.find("ul").find("li").each(function (d, e) {
                    var f = a(e).find(".cuserlevel")
                        , g = f.data("uid");
                    if (g == $SYS.uid) {
                        var h = c.returnUlevelIcon(b);
                        f.find("img").attr({
                            src: h
                        })
                    }
                }),
                    this.config.$allCon.find("ul").find("li").each(function (d, e) {
                        var f = a(e).find(".cuserlevel")
                            , g = f.data("uid");
                        if (g == $SYS.uid) {
                            var h = c.returnUlevelIcon(b);
                            f.find("img").attr({
                                src: h
                            })
                        }
                    })
            },
            bindEvt: function () {
                var b = this;
                this.config.$el.on("click", ".f-tit li", function () {
                    b.showRank(a(this).data("type"))
                }),
                    this.config.$el.on("mouseenter", ".f-con .f-cn", function () {
                        b.detailRank(!0, a(this).data("type"))
                    }).on("mouseleave", ".f-con .f-cn", function () {
                        b.detailRank(!1, a(this).data("type"))
                    }),
                    c.on("mod.chatrank.cqrankupdate", function (a) {
                        b.upRankListCurUserLev(a)
                    })
            }
        });
        return h.reg("room_data_cqrank", function (a) {
            var b, c;
            a = e.decode(a),
                b = a.get("list"),
                c = a.get("list_all"),
            b && (b = e.isArray(b) ? e.decode(b) : [{
                value: b
            }],
                i.resetWeekRank(b)),
            c && (c = e.isArray(c) ? e.decode(c) : [{
                value: c
            }],
                i.resetAllRank(c)),
                i.showRankIf()
        }),
            h.reg("room_data_cqrankupdate", function (a) {
                c.trigger("mod.chat.msg.res.rankupdate", a)
            }),
            h.reg("room_data_rankgap", function (a) {
                c.trigger("mod.chat.msg.res.rankgap", a)
            }),
        {
            init: function (a) {
                i = new k(a)
            }
        }
    }),
    define("douyu/page/room/normal/mod/chat-shield", ["jquery", "shark/observer", "shark/class", "shark/util/cookie/1.0", "douyu/page/room/base/api"], function (a, b, c, d, e) {
        var f = {
            checkedMap: {
                message: !1,
                info: !1,
                effect: !1,
                videoBroadcast: !1
            }
        }
            , g = c({
            init: function (c) {
                this.config = a.extend(!0, {}, {
                    target: "#js-shie-gift",
                    cookieName: "shie",
                    isChecked: !1,
                    isUserLogin: !1
                }, c);
                var e = this;
                b.on("mod.center.userrole.ready", function (b) {
                    if (e.config.isUserLogin = !b.isVistor(),
                            e.config.isUserLogin) {
                        var c = d.get(e.config.cookieName)
                            , f = c ? c.split(",") : []
                            , g = f.length;
                        if (0 === g)
                            b.isAnchor() && (document.getElementById("shieGiftEffect").checked = !1);
                        else
                            for (var h = 0; g > h; h++) {
                                var i = a("#" + f[h]);
                                i.length && i.prop({
                                    checked: !1
                                })
                            }
                    }
                }),
                    this.bindEvent()
            },
            saveCookie: function (a) {
                var b = d.get(this.config.cookieName)
                    , c = null === b ? "" : b;
                c += "," + a,
                    d.set(this.config.cookieName, c, 31536e3)
            },
            removeCookie: function (a) {
                for (var b = d.get(this.config.cookieName), c = b ? b.split(",") : [], e = [], f = 0, g = c.length; g > f; f++)
                    c[f] != a && e.push(c[f]);
                0 === e.length && e.push("noId"),
                    d.set(this.config.cookieName, e.join(""), 31536e3)
            },
            videoBroadcast: function () {
                var a = document.getElementById("shieVideoBroadcast").checked && this.config.isChecked;
                e.exe("js_effectVisible", a ? 1 : 0)
            },
            bindEvent: function () {
                var c = a(this.config.target)
                    , d = c.find(".shie-site-icon")
                    , e = c.find(".shie-site-list")
                    , g = c.find(".shie-tip")
                    , h = this;
                d.on("click", function (a) {
                    a.preventDefault(),
                        a.stopPropagation(),
                        e.toggleClass("hide")
                }),
                    c.on({
                        click: function (d) {
                            "INPUT" !== d.target.nodeName && d.preventDefault(),
                                d.stopPropagation();
                            var i, j, k;
                            c.toggleClass("shie-switch-open"),
                                a(this).find("i.sw-icon").toggleClass("sw-icon-on"),
                                c.hasClass("shie-switch-open") ? (i = !0,
                                    j = "显示",
                                    k = "屏蔽") : (i = !1,
                                    j = "屏蔽",
                                    k = "开启"),
                                h.config.isChecked = i,
                                a(this).find("input:checkbox").prop({
                                    checked: i
                                }),
                                e.find("input:checkbox").each(function () {
                                    a(this).prop({
                                        disabled: !i
                                    }),
                                        f.checkedMap[this.name] = this.checked && i
                                }),
                                g.find("p").html("点击" + j + "礼物特效"),
                                b.trigger("mod.chat.msg.msg", '<li class="jschartli" data-type="list"><p class="text-cont"><span style="color:#f00;">已' + k + "礼物特效</span></p></li>"),
                                h.videoBroadcast()
                        },
                        mouseenter: function () {
                            g.removeClass("hide")
                        },
                        mouseleave: function () {
                            g.addClass("hide")
                        }
                    }, ".shie-switch > .shie-input"),
                    e.on("click", function (a) {
                        a.stopPropagation();
                        var b = a.target;
                        h.config.isChecked && "INPUT" === b.nodeName && (h.config.isUserLogin && h[b.checked ? "removeCookie" : "saveCookie"](b.id),
                        "shieVideoBroadcast" === b.id && h.videoBroadcast(),
                            f.checkedMap[b.name] = b.checked)
                    }),
                    a(document).on("click", function (a) {
                        e.addClass("hide")
                    })
            }
        });
        return b.on("mod.chat.msg.shield", function () {
            return f.checkedMap
        }),
        {
            init: function (a) {
                return new g(a)
            },
            val: function () {
                return f.checkedMap
            }
        }
    }),
    define("douyu/page/room/normal/mod/chat-user-manager", ["jquery", "shark/observer", "shark/util/flash/data/1.0", "douyu/context", "douyu/com/user", "douyu/page/room/base/api"], function (a, b, c, d, e, f) {
        var g = {}
            , h = {}
            , i = {}
            , j = {}
            , k = {};
        return j.stopEvt = function (a) {
            a.preventDefault(),
                a.stopPropagation()
        }
            ,
            h.init = function () {
                h.$chatCont = a("#js-chat-cont"),
                    h.$userManager = a("#js-user-manager"),
                    h.$mute = h.$userManager.find('[data-type="mute"]'),
                    h.$report = h.$userManager.find('[data-type="report"]'),
                    h.$shield = h.$userManager.find('[data-type="shield"]'),
                    h.$appoint = h.$userManager.find('[data-type="appoint"]'),
                    h.$closure = h.$userManager.find('[data-type="closure"]'),
                    b.on("mod.center.userrole.ready", function (a) {
                        5 != d.get("sys.groupid") && h.$closure.remove(),
                            g.role = a.join(","),
                            g.uid = d.get("sys.uid"),
                            g.ugd = d.get("sys.groupid")
                    })
            }
            ,
            h.showManager = function () {
                g.rgp.rg < 4 && (g.ugp.rg >= 4 || 5 == g.ugd || 2 == g.ugd) ? h.$mute.show() : h.$mute.hide(),
                5 == g.rgp.pg && h.$mute.hide(),
                    h.$report[void 0 === g.cid || g.gid >= 5 ? "hide" : "show"]();
                var a = b.fire("mod.chat.blackList.get", g.rel)
                    , c = h.$shield.text()
                    , d = 0;
                if (a.index > -1 ? (c = "取消屏蔽",
                        d = 1) : a.length >= 10 ? (c = "屏蔽人数已满",
                        d = 3) : (c = "屏蔽该用户",
                        d = 0),
                        h.$shield.html('<i class="icon pb-icon"></i>' + c).attr("rel", d),
                    5 == g.ugp.rg || 5 == g.ugd && g.rgp.rg < 5) {
                    var e = 4 == g.rgp.rg ? 1 : 4
                        , f = 4 == g.rgp.rg ? "解除管理员" : "任命管理员";
                    h.$appoint.show().html('<i class="icon rm-icon"></i>' + f).attr("rel", e)
                } else
                    h.$appoint.hide()
            }
            ,
            i.init = function () {
                i.chatCont(),
                    i.userManager(),
                    a(document).on("click", function () {
                        h.$userManager.hide()
                    })
            }
            ,
            i.chatCont = function () {
                h.$chatCont.on("click", ".js-nick", function (c) {
                    j.stopEvt(c);
                    var d = a(this)
                        , e = d.offset();
                    g.rel = parseInt(d.attr("rel"), 10),
                        g.gid = parseInt(d.attr("gid"), 10),
                        g.cid = d.parent().next().attr("chatid"),
                        g.rgp = b.fire("mod.center.usergroup.get", g.rel),
                        g.una = d.text(),
                    g.uid && 2 != g.gid && g.uid != g.rel && (g.ugp || (g.ugp = b.fire("mod.center.usergroup.get", g.uid)),
                        h.showManager(),
                        h.$userManager.show().css({
                            top: e.top - h.$userManager.outerHeight(!0),
                            left: e.left
                        }))
                })
            }
            ,
            i.userManager = function () {
                h.$mute.on("click", function (a) {
                    j.stopEvt(a),
                        k.mute()
                }),
                    h.$report.on("click", function (a) {
                        j.stopEvt(a),
                            k.report()
                    }),
                    h.$shield.on("click", function (a) {
                        j.stopEvt(a),
                            k.shield()
                    }),
                    h.$appoint.on("click", function (a) {
                        j.stopEvt(a),
                            k.appoint()
                    }),
                    h.$closure.on("click", function (a) {
                        j.stopEvt(a),
                            k.closure()
                    }),
                    h.$userManager.on("mouseleave", function () {
                        a(this).hide()
                    })
            }
            ,
            k.mute = function () {
                if (2 == g.ugd || !(g.ugp.rg < 4 && 5 != g.ugd || g.uid == g.rel)) {
                    var b = ['<div id="blackshow">', '<div class="box_bs">', "<p>请选择要对用户进行的操作</p>", '<div class="box_label fixed">', '<label class="con_label">范围：</label>', '<div class="controls">', '<label class="radio inline"><input type="radio" checked="checked" name="range" value="1">该用户</label>', -1 === g.role.indexOf(4) ? "" : '<label class="radio inline js_login_sa js_login_myroom"><input type="radio" value="2" name="range">该IP段</label>', "</div>", "</div>", '<div class="box_label fixed">', '<label class="con_label">操作：</label>', '<div class="controls">', '<label class="radio inline"><input type="radio" name="blacktype" value="2" checked="checked">禁止发言</label>', "</div>", "</div>", '<div class="box_label">', '<label class="con_label">时长：</label>', '<div class="controls">', '<label class="radio inline"><input type="text" value="99" maxlength="10" id="blacktime" class="input_time">小时</label>', "</div>", "</div>", "</div>", "</div>"].join("");
                    a.dialog({
                        title: "用户屏蔽",
                        content: b,
                        id: "black900l",
                        init: function () {
                            a("#blacktime").focus()
                        },
                        ok: function () {
                            if (!e.check())
                                return void e.show("reg");
                            var b = a("#blacktime")
                                , d = b.val()
                                , h = a('input[name="blacktype"]:checked').val();
                            if (isNaN(d) || 0 >= d)
                                return void a.dialog.tips_black("请重新输入!");
                            if (2 == a('input[name="range"]:checked').val()) {
                                if (h = 2 == h ? 4 : 1,
                                    d > 99)
                                    return void a.dialog.tips_black("封禁时长不能超过99小时!")
                            } else if (d > 720)
                                return void a.dialog.tips_black("封禁时长不能超过720小时!");
                            d = 3600 * d,
                                f.exe("js_blackuser", c.encode([{
                                    name: "type",
                                    value: "blackreq"
                                }, {
                                    name: "userid",
                                    value: g.rel
                                }, {
                                    name: "blacktype",
                                    value: h
                                }, {
                                    name: "limittime",
                                    value: d
                                }])),
                                b.val("99")
                        },
                        cancelVal: "关闭",
                        cancel: !0
                    })
                }
            }
            ,
            k.report = function () {
                return g.uid == g.rel ? void a.dialog.alert("不能举报自已!") : -1 === g.cid ? void h.$userManager.hide() : (f.exe("js_reportBarrage", c.encode([{
                    name: "suid",
                    value: g.rel
                }, {
                    name: "rid",
                    value: d.get("room.room_id")
                }, {
                    name: "chatmsgid",
                    value: g.cid
                }])),
                    void h.$userManager.hide())
            }
            ,
            k.shield = function () {
                var a = parseInt(h.$shield.attr("rel"), 10)
                    , c = b.fire("mod.chat.blackList.get", g.rel)
                    , d = 0
                    , e = "";
                if (0 === a) {
                    if (c.index > -1 || c.length >= 10)
                        return;
                    d = 1,
                        e = "取消屏蔽",
                        b.trigger("mod.chat.blackList.set", g.rel)
                } else {
                    if (-1 == c.index)
                        return;
                    d = 0,
                        e = "屏蔽该用户",
                        b.trigger("mod.chat.blackList.del", g.rel)
                }
                h.$shield.html('<i class="icon pb-icon"></i>' + e).attr("rel", d),
                    f.exe("js_myblacklist", c.list.join("|"))
            }
            ,
            k.appoint = function () {
                f.exe("js_setadmin", c.encode([{
                    name: "type",
                    value: "setadminreq"
                }, {
                    name: "userid",
                    value: g.rel
                }, {
                    name: "group",
                    value: h.$appoint.attr("rel")
                }])),
                    h.$userManager.hide()
            }
            ,
            k.closure = function () {
                if (d.get("sys.uid") == g.rel || 5 != d.get("sys.groupid"))
                    return void a.dialog.alert("没有相应权限!");
                "：" == g.una.charAt(g.una.length - 1) && (g.una = g.una.substring(0, g.una.length - 1));
                var b = ['<div id="onekeyblackshow">', '<div class="box_bs">', '<p class="userinfo">封禁用户:<span style="color:blue">' + g.una + "</span></p>", "<p>请选择封禁原因:</p>", '<div class="box_label fixed">', '<input type="radio" name="reason_choice" checked="">', '<select name="ban_reason">', "<option>发广告</option>", "<option>工作室账号刷鱼丸</option>", "<option>辱骂主播、超管、观众</option>", "</select>", "<p></p>", '<p><input type="radio" name="reason_choice"><input name="oreason" type="text" class="input_time">(其它原因)</p>', "</div>", "</div>", "</div>"].join("");
                a.dialog({
                    title: "用户一键封号",
                    content: b,
                    id: "oneKeyblack00l",
                    ok: function () {
                        var b = a.trim(a("#onekeyblackshow input:radio:checked[name='reason_choice']").next().val());
                        return "" === b ? void a.dialog.alert("原因未填写") : b.length >= 50 ? void a.dialog.alert("原因长度不能大于50个字") : void f.exe("js_keyTitles", c.encode([{
                            name: "type",
                            value: 0
                        }, {
                            name: "roomid",
                            value: d.get("room.room_id")
                        }, {
                            name: "userid",
                            value: g.rel
                        }, {
                            name: "username",
                            value: g.una
                        }, {
                            name: "limittime",
                            value: 0
                        }, {
                            name: "reason",
                            value: b
                        }]))
                    },
                    cancelVal: "关闭",
                    cancel: !0
                })
            }
            ,
        {
            init: function () {
                h.init(),
                    i.init()
            }
        }
    }),
    define("douyu/page/room/normal/mod/chat", ["jquery", "shark/observer", "douyu/page/room/base/api", "douyu/page/room/normal/mod/chat-rank", "douyu/page/room/normal/mod/chat-exp", "douyu/page/room/normal/mod/chat-color", "douyu/page/room/normal/mod/chat-shield", "douyu/page/room/normal/mod/chat-msg", "douyu/page/room/normal/mod/chat-send", "douyu/page/room/normal/mod/chat-user-manager", "douyu/page/room/normal/mod/chat-msg-roll", "douyu/page/room/normal/mod/chat-gift"], function (a, b, c, d, e, f, g, h, i, j, k, l) {
        var m = {
            blackList: []
        };
        return b.on("mod.chat.blackList.set", function (a) {
            void 0 !== a && m.blackList.push(a)
        }),
            b.on("mod.chat.blackList.get", function (b) {
                return {
                    list: m.blackList,
                    index: void 0 === b ? 0 : a.inArray(b, m.blackList),
                    length: m.blackList.length
                }
            }),
            b.on("mod.chat.blackList.del", function (b) {
                void 0 !== b && m.blackList.splice(a.inArray(b, m.blackList), 1)
            }),
        {
            init: function () {
                d.init(),
                    e.init(),
                    f.init(),
                    g.init(),
                    h.init(),
                    i.init(),
                    j.init(),
                    k.init(),
                    l.init()
            }
        }
    }),
    define("douyu/page/room/normal/mod/guide", ["jquery", "shark/observer", "shark/util/cookie/1.0", "douyu/context", "douyu/com/user", "douyu/page/room/base/api"], function (a, b, c, d, e, f) {
        var g = {
            chat: {
                isLogin: e.check(),
                isShow: !1,
                $target: a("#js-chat-speak")
            },
            curBody: a("body")
        };
        return Guide = function (a) {
            this.init(a)
        }
            ,
            a.extend(!0, Guide.prototype, {
                init: function (b) {
                    this.config = a.extend(!0, {
                        speed: 6e5,
                        delay: !0
                    }, b),
                        this.render(),
                        this.showWatch(),
                        this.bindEvt()
                },
                interval: function (a, b, c) {
                    var d = this;
                    this.timer = setTimeout(function () {
                        a() !== !1 && d.interval(a, b)
                    }, b),
                    c === !0 && a()
                },
                render: function () {
                    var a = this;
                    Number(d.get("sys.uid")) !== Number(d.get("room.owner_uid")) && this.interval(function () {
                        a._runtime()
                    }, this.config.speed, !this.config.delay)
                },
                _runtime: function () {
                    g.chat.isShow || g.chat.isLogin || this.chat()
                },
                chat: function () {
                    this.$chat = a('<div class="' + this.randomClass() + '"><div class="lead-close" data-type="live-lead-close"></div></div>'),
                        g.chat.$target.append(this.$chat),
                        g.chat.isShow = !0
                },
                randomClass: function () {
                    var a = ["live-lead", "live-lead live-yw-lead", "live-lead live-quality-lead", "live-lead live-focus-lead", "live-lead live-share-lead"];
                    return a[Math.ceil(Math.random() * a.length) - 1]
                },
                relayout: function () {
                    if (this.$chat) {
                        var a = g.chat.$target.offset();
                        this.$chat.css({
                            left: a.left,
                            top: a.top - this.$chat.outerHeight(!0)
                        })
                    }
                },
                bindEvt: function () {
                    var b = this;
                    a(document).on("click", '[data-type="live-lead-close"]', function (a) {
                        a.preventDefault(),
                            a.stopPropagation(),
                            b.$chat.hide().remove(),
                            g.chat.isShow = !1
                    }).on("click", ".live-lead", function (a) {
                        a.preventDefault(),
                            e.show("login")
                    }),
                        a(window).resize(function () {
                            b.relayout()
                        })
                },
                showWatchTpl: function (b) {
                    var c = this;
                    c.videoContent = a("#js-room-video");
                    var d = '<div class="show-watch" data-watch-content="content"><div class="close"><a href="#" data-watch-close="btn">关闭</a></div><div class="lead-txt" data-watch-content="txt"><div class="watchtxt"><p class="start"><span data-watch-time="second">5S</span>后将切换为 普通画质</p><p class="end">已切换为 普通画质</p><h4>登录继续畅享 超/高清画质</h4></div><div class="watchbtn"><a class="abtn1" href="#" data-watch-btn="login">登录</a><a class="abtn2" href="#" data-watch-btn="register">注册</a></div><div class="watchdown"><a target="_blank" href="/client" >[ 下载APP畅享超清 ]</a></div></div><div class="lead-txt hide" data-watch-content="normal"><div class="watchtxt"><p>当前观看的是普通画质</p><h4>登录继续畅享 超/高清画质</h4></div><div class="watchbtn"><a class="abtn1" href="#" data-watch-btn="login">登录</a><a class="abtn2" href="#" data-watch-btn="register">注册</a></div><div class="watchdown"><a target="_blank" href="/client">[ 下载APP畅享超清 ]</a></div></div></div>';
                    a(".show-watch").remove(),
                        c.videoContent.append(d),
                        c.timSecond = a('[data-watch-time="second"]'),
                        a('[data-watch-close="btn"]').on("click", function () {
                            return a('[data-watch-content="content"]').hide(),
                                f.exe("js_timeLoginTip"),
                                !1
                        }),
                        a('[data-watch-btn="login"]').on("click", function () {
                            return e.show("login"),
                                !1
                        }),
                        a('[data-watch-btn="register"]').on("click", function () {
                            return e.show("reg"),
                                !1
                        }),
                        b ? (a('[data-watch-content="txt"]').removeClass("hide"),
                            a('[data-watch-content="normal"]').addClass("hide")) : (a('[data-watch-content="txt"]').addClass("hide"),
                            a('[data-watch-content="normal"]').removeClass("hide"))
                },
                showWatch: function () {
                    var a = this;
                    f.reg("room_bus_showwatchtipdown", function () {
                        a.showWatchTpl(!0),
                            a.showWatchtips()
                    }),
                        f.reg("room_bus_showwatchtip", function () {
                            a.showWatchTpl(!1)
                        })
                },
                showWatchtips: function () {
                    var b = this
                        , c = 5;
                    this.watchTimer = setInterval(function () {
                        return c--,
                            0 > c ? (clearInterval(b.watchTimer),
                                a('[data-watch-content="txt"]').addClass("hide"),
                                a('[data-watch-content="normal"]').removeClass("hide"),
                                void f.exe("js_switchStream")) : void b.timSecond.html(c + "S")
                    }, 1e3)
                }
            }),
        {
            init: function (a) {
                return new Guide(a)
            }
        }
    }),
    define("douyu/page/room/normal/mod/recommended", ["jquery", "shark/observer"], function (a, b) {
        var c = {
            promoteWidht: 362,
            videoWidht: 283
        }
            , d = {}
            , e = {};
        return d.init = function () {
            d.$recommand = a("#js-recommand"),
                d.$trigger = d.$recommand.find('[data-type="trigger"]'),
                d.$target = d.$recommand.find('[data-type="target"]'),
                d.$promote = d.$recommand.find('[data-target="promote"]'),
                d.$video = d.$recommand.find('[data-target="video"]'),
                d.$equalLeft = a("#js-live-room-normal-equal-left"),
                d.$equalRight = a("#js-live-room-normal-equal-right"),
                d.layout(),
                b.on("mod.normal.recommand.layout", function () {
                    d.layout()
                })
        }
            ,
            d.layout = function () {
                d.$promote.length && !d.$promote.hasClass("hide") && (d.$promos = d.$promote.find('[data-type="promos"]'),
                    c.promoteBoxWidht = d.$promos.width(),
                    c.promoteRow = Math.floor(c.promoteBoxWidht / c.promoteWidht),
                    d.promoteLayout()),
                d.$video.length && !d.$video.hasClass("hide") && (d.$lives = d.$video.find('[data-type="lives"]'),
                    c.livesBoxWidht = d.$lives.width(),
                    c.livesRow = Math.floor(c.livesBoxWidht / c.videoWidht),
                    d.videoLayout())
            }
            ,
            d.promoteLayout = function () {
                d.$promos.each(function () {
                    a(this).find("li").each(function (b) {
                        var d = 0
                            , e = "";
                        1 === c.promoteRow ? (d = (b + 1) % 2 === 0 ? 0 : 10,
                            e = c.promoteBoxWidht / 2 - 5) : d = (b + 1) % c.promoteRow === 0 ? 0 : Math.floor((c.promoteBoxWidht - c.promoteWidht * c.promoteRow) / (c.promoteRow - 1)),
                            a(this).css({
                                "margin-right": d,
                                width: e
                            })
                    })
                })
            }
            ,
            d.videoLayout = function () {
                d.$lives.find("li").each(function (b) {
                    if (b >= 12)
                        return a(this).hide(),
                            !0;
                    var d = 0
                        , e = "";
                    1 === c.livesRow ? (d = (b + 1) % 2 === 0 ? 0 : 10,
                        e = c.livesBoxWidht / 2 - 5) : d = (b + 1) % c.livesRow === 0 ? 0 : Math.floor((c.livesBoxWidht - c.videoWidht * c.livesRow) / (c.livesRow - 1)),
                        a(this).css({
                            "margin-right": d,
                            width: e
                        })
                })
            }
            ,
            e.init = function () {
                d.$recommand.on("click", '[data-type="trigger"]', function (b) {
                    b.preventDefault(),
                        b.stopPropagation();
                    var c = a(this)
                        , e = c.data("trigger");
                    d.$trigger.removeClass("current"),
                        d.$target.addClass("hide"),
                        c.addClass("current"),
                        d.$recommand.find('[data-target="' + e + '"]').removeClass("hide"),
                        d.layout();
                    var f = d.$equalLeft.height()
                        , g = d.$equalRight.height();
                    d.$equalLeft.css({
                        "min-height": g > f ? g : ""
                    }),
                    window.DYS && ("promote" === e ? DYS.submit({
                        point_id: DYS.point.page(9)
                    }) : DYS.submit({
                        point_id: DYS.point.page(10)
                    }))
                }),
                    d.$recommand.on("mousedown", '[data-target="promote"] a', function () {
                        if (window.DYS) {
                            var b = a(this)
                                , c = b.parent()
                                , d = c.index()
                                , e = b.closest(".promotion")
                                , f = 0
                                , g = b.attr("href");
                            switch (!0) {
                                case e.hasClass("official"):
                                    f = 1;
                                    break;
                                case e.hasClass("other"):
                                    f = 2
                            }
                            DYS.submit({
                                point_id: DYS.point.page(9, f),
                                ext: {
                                    i: d + 1,
                                    t: g
                                }
                            })
                        }
                    }),
                    d.$video.on("mousedown", '[data-type="lives"] li a', function () {
                        if (window.DYS) {
                            var b = a(this)
                                , c = b.parent()
                                , d = c.index()
                                , e = b.attr("href");
                            DYS.submit({
                                point_id: DYS.point.page(10, 1),
                                ext: {
                                    i: d + 1,
                                    t: e
                                }
                            })
                        }
                    }),
                    d.$recommand.find('[data-type="trigger"]').eq(0).trigger("click")
            }
            ,
        {
            init: function () {
                d.init(),
                    e.init()
            }
        }
    }),
    define("douyu/page/room/normal/mod/room-point", ["jquery", "shark/class", "douyu/context", "shark/util/flash/data/1.0", "douyu/page/room/base/api"], function (a, b, c, d, e) {
        var f = {
            getDoms: function () {
                this.doms = {
                    curBody: a("body"),
                    lookRoomPoint: a("#look-room-point"),
                    lookpointRool: a("#look-point-rool"),
                    pointTipBtn: a('[data-point-num="num"]'),
                    errorTicBtn: a('[data-point-tip="errorbox"]'),
                    showLiveRool: a('[data-float-content="pointWaringTip"]'),
                    gift: a("#gift-content"),
                    roomWaringClose: a('[data-room-gift="close"]'),
                    illegalPop: a(".illegal-pop")
                }
            },
            init: function (a) {
                this.illegalPop(),
                    this.getDoms(),
                    this.userRole = a.role,
                    this.isRoomPlayer = "",
                    window.isCanNotLive = !1;
                var b = $ROOM.can_send_gift;
                "string" == typeof b && (b = JSON.parse(b)),
                    this.stop_gift_credit = b.stop_gift_credit,
                    this.creditPoint = b.credit,
                    this.is_white_list = b.is_white_list,
                    this.checkUserRole(),
                    this.initRoomPoint(),
                    this.addEvent()
            },
            alert_msg: function (b, c, d) {
                try {
                    switch (d) {
                        case 4:
                        case "succeed":
                            var e = "succeed";
                            break;
                        case 3:
                            var e = "error";
                            break;
                        case 2:
                            var e = "question";
                            break;
                        default:
                            var e = "warning"
                    }
                    a.dialog({
                        lock: !0,
                        content: b,
                        icon: e,
                        ok: function () {
                            return c && setTimeout(c, 100),
                                !0
                        }
                    })
                } catch (f) {
                    a.dialog.tips_black(b),
                    c && setTimeout(c, 100)
                }
            },
            illegalPop: function () {
                var b = '<div class="illegal-pop illegal-pop-1300" data-float-content="illegal" style="display: none;"><div class="close" data-float-btn="illegal" data-float-target="illegal"></div><p class="dis">你由于违反主播规范：<b></b>，被扣除<b>分</b>，请阅读<a href="" target="_blank">主播积分管理详细规则。</a>合理播放内容，共同净化互联网环境！</p></div>';
                a("#js-room-video").append(b)
            },
            getData: function (b, c) {
                var d = {
                    url: b.url || "",
                    type: b.type || "GET",
                    data: b.data || {},
                    success: function (a) {
                        c && c(a)
                    }
                };
                b.jsonp && (d.jsonp = b.jsonp,
                    d.callback = b.jsonCallBack),
                    a.ajax(d)
            },
            initRoomPoint: function () {
                -1 == this.userRole.indexOf(4) && -1 == this.userRole.indexOf(2) || (this.doms.lookRoomPoint.removeClass("hide"),
                    this.doms.lookpointRool.removeClass("hide"),
                    this.getUserPoint()),
                -1 != this.userRole.indexOf(2) && (this.isRoomPlayer = !0,
                    this.doms.showLiveRool.show())
            },
            showUserBtn: function (a) {
                var b = this.doms
                    , c = this;
                a > 5 ? b.pointTipBtn.css("color", "green") : 3 >= a ? b.pointTipBtn.css("color", "red") : b.pointTipBtn.css("color", "#ff7700"),
                    a <= c.stop_gift_credit ? c.is_white_list || (b.errorTicBtn.css("display", "inline-block"),
                        b.roomWaringClose.show(),
                    b.gift.length && b.gift.hide(),
                        window.isCanNotLive = !0) : (b.errorTicBtn.css("display", "none"),
                        b.roomWaringClose.hide(),
                    b.gift.length && -1 == this.userRole.indexOf(2) && b.gift.show(),
                        window.isCanNotLive = !1),
                    c.currentPoint = a
            },
            checkUserRole: function () {
                var a = this;
                a.showUserBtn(a.creditPoint)
            },
            addEvent: function () {
                var b = this
                    , c = this.doms;
                c.lookpointRool.on("click", function () {
                    a(this).find("a")[0].click()
                });
                var d = this.doms.lookRoomPoint.find('[data-point-error="pop"]')
                    , f = d.find('[data-point-error="tip"]');
                c.pointTipBtn.hover(function () {
                    d.show(),
                        f.html(f.attr("data-pointdis-nonetip")),
                        d.css("left", -18)
                }, function () {
                    d.hide()
                }),
                    c.errorTicBtn.hover(function () {
                        d.show(),
                            f.html(f.attr("errordata-pointdis-tip")),
                            d.css("left", -4)
                    }, function () {
                        d.hide()
                    }),
                    e.reg("room_data_ancpoints", function (a) {
                        b.roomAnchorPoints(a)
                    }),
                    window.formsuccess = b.formsuccess,
                    c.curBody.delegate("#add-live-file-img", "click", function () {
                        a("#add-live-file")[0].click()
                    }),
                    c.showLiveRool.on("click", function (a) {
                        return !1
                    }),
                    a('[data-float-btn="close"]').on("click", function (b) {
                        var c = a(this)
                            , d = c.attr("data-float-target")
                            , e = a("[data-float-content=" + d + "]");
                        e.hide()
                    }),
                    a('[data-float-btn="illegal"]').on("click", function (c) {
                        var d = a(this)
                            , e = d.attr("data-float-target")
                            , f = a("[data-float-content=" + e + "]");
                        f.hide(),
                            clearTimeout(b.timer),
                        !b.is_white_list && b.currentPoint <= b.stop_gift_credit && a.dialog.alert("由于你的当前积分小于等于" + b.stop_gift_credit + "分，你的房间礼物与酬勤功能被停用，请遵守直播规则获取积分。")
                    })
            },
            formsuccess: function (b) {
                "string" == typeof b && (b = JSON.parse(b)),
                    a("#r_mana_iframe").remove(),
                    b.error ? f.alert_msg(b.msg) : (f.doms.pointTipBtn.text(b.msg),
                        f.showUserBtn(b.msg),
                        f.alert_msg("操作成功"))
            },
            roomAnchorPoints: function (a) {
                for (var b = d.decode(a), c = {
                    credit: "",
                    cd_diff: "",
                    content: ""
                }, e = 0; e < b.length; e++)
                    "credit" == b[e].key && (c.credit = b[e].value),
                    "cd_diff" == b[e].key && (c.cd_diff = b[e].value),
                    "content" == b[e].key && (c.content = b[e].value);
                f.checkRoomIsNeedClose(c)
            },
            checkRoomIsNeedClose: function (b) {
                var c = f
                    , d = c.doms;
                if (b.cd_diff < 0 && c.isRoomPlayer) {
                    var e = d.illegalPop.find(".dis");
                    e.find("b").eq(0).html(b.content),
                        e.find("b").eq(1).text((b.cd_diff + "").replace("-", "") + "分"),
                        e.find("a").eq(0).attr("href", rule_link),
                        d.illegalPop.show(),
                        c.timer = setTimeout(function () {
                            d.illegalPop.hide(),
                            !c.is_white_list && c.currentPoint <= c.stop_gift_credit && a.dialog.alert("由于你的当前积分小于等于" + c.stop_gift_credit + "分，你的房间礼物与酬勤功能被停用，请遵守直播规则获取积分。")
                        }, 3e4)
                }
                b.credit = parseInt(b.credit),
                    d.pointTipBtn.text(b.credit),
                    f.showUserBtn(b.credit)
            },
            getUserPoint: function () {
                var b = this
                    , c = this.doms
                    , d = {
                    url: "/room/my_admin/getCreditByUid",
                    type: "POST",
                    data: {
                        uid: $ROOM.owner_uid
                    }
                };
                b.getData(d, function (d) {
                    if ("string" == typeof d && (d = JSON.parse(d)),
                            !d.error) {
                        d = d.msg;
                        var e = parseInt(d.credit, 10);
                        window.rule_link = d.rule_link,
                            c.pointTipBtn.text(e),
                            c.lookpointRool.find("a").attr("href", window.rule_link);
                        var f = a("[errordata-pointdis-tip]")
                            , g = f.attr("errordata-pointdis-tip");
                        f.attr("errordata-pointdis-tip", g.replace("X", d.stop_gift_credit)),
                            b.stop_gift_credit = parseInt(d.stop_gift_credit, 10),
                            e = parseInt(e),
                            b.showUserBtn(e)
                    }
                })
            }
        }
            , g = {
            init: function (a) {
                return f.init(a),
                    window.roomPointMgrObj = f,
                    f
            }
        };
        return g
    }),
    define("douyu/page/room/normal/mod/anchor-like", ["jquery", "shark/util/lang/1.0", "shark/util/template/1.0", "douyu/context"], function (a, b, c, d) {
        var e = {
                url: "/swf_api/getAnchorLike",
                roomId: d.get("room.room_id"),
                maxItem: 6,
                $anchorLike: a("#js-anchor-like"),
                $slider: a("#js-chat-right-ad")
            }
            , f = function () {
                var d = function (d) {
                        var f, g, h;
                        return f = b.string.join("<% var _index = 1; %>", "<% for (var key in list) { %>", "<% if ( _index <= maxLength) { %>", "<% var item = list[key]; %>", '<li class="live" data-point-2="<%= _index %>">', '<a href="/<%= key %>" target="_blank" title="<%= item.name %>">', '<div class="live-preview">', '<img src="<%= item.room_src %>" />', '<b class="border"></b>', "</div>", '<div class="live-details">', '<h3 class="live-title"><%= item.name %></h3>', '<p class="live-category">分类：<%= item.game_name %></p>', '<p class="live-anchor">主播：<%= item.nickname %></p>', "</div>", "</a>", "</li>", "<% _index++; %>", "<% } %>", "<% } %>"),
                            g = c.compile(f),
                            (h = g({
                                list: d,
                                maxLength: e.maxItem
                            })) ? (e.$anchorLike.show().html(h),
                                void (window.DYS && (e.$anchorLike.find("li>a").each(function () {
                                    var b = a(this)
                                        , c = b.parent().attr("data-point-2")
                                        , d = DYS.point.page(1, c)
                                        , f = {
                                        f: e.roomId,
                                        t: b.attr("href").replace(/\//g, ""),
                                        i: c
                                    };
                                    b.data("extdata", f),
                                        b.data("point", d)
                                }),
                                    e.$anchorLike.on("mousedown", "li a", function () {
                                        var b = a(this)
                                            , c = b.data("point")
                                            , d = b.data("extdata");
                                        DYS.submit({
                                            point_id: c,
                                            ext: d
                                        })
                                    })))) : void e.$anchorLike.hide()
                    }
                    ;
                a.ajax({
                    url: e.url,
                    type: "GET",
                    dataType: "json",
                    data: {
                        room_id: e.roomId
                    },
                    success: function (a) {
                        d(a)
                    },
                    error: function () {
                        e.$anchorLike.hide()
                    }
                });
                var f = function () {
                        var a = e.$slider.find("ul li")
                            , c = e.$slider.find("ol li")
                            , d = 0;
                        b.interval(function () {
                            a.css("opacity", 0).hide(),
                                c.removeClass("cur"),
                                d = d >= 2 ? -1 : d,
                                d++,
                                a.eq(d).css("opacity", 1).show(),
                                c.eq(d).addClass("cur")
                        }, 5e3)
                    }
                    ;
                f()
            }
            ;
        a(f)
    }),
    define("douyu/page/room/normal/mod/weibo", ["jquery", "shark/observer", "douyu/page/room/base/api", "douyu/com/user", "shark/util/cookie/1.0", "shark/util/flash/data/1.0", "douyu/context", "shark/util/template/2.0"], function (a, b, c, d, e, f, g, h) {
        var i = {};
        i.templateSettings = {
            evaluate: /%([\s\S]+?)%/g,
            interpolate: /%=([\s\S]+?)%/g,
            escape: /%-([\s\S]+?)%/g
        },
            i.template = function (b, c, d) {
                var e = /\\|'|\r|\n|\u2028|\u2029/g
                    , f = function (a) {
                        return "\\" + escapes[a]
                    }
                    ;
                !c && d && (c = d),
                    c = a.extend({}, c, i.templateSettings);
                var g = RegExp([(c.escape || noMatch).source, (c.interpolate || noMatch).source, (c.evaluate || noMatch).source].join("|") + "|$", "g")
                    , h = 0
                    , j = "__p+='";
                b.replace(g, function (a, c, d, g, i) {
                    return j += b.slice(h, i).replace(e, f),
                        h = i + a.length,
                        c ? j += "'+\n((__t=(" + c + "))==null?'':_.escape(__t))+\n'" : d ? j += "'+\n((__t=(" + d + "))==null?'':__t)+\n'" : g && (j += "';\n" + g + "\n__p+='"),
                        a
                }),
                    j += "';\n",
                c.variable || (j = "with(obj||{}){\n" + j + "}\n"),
                    j = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + j + "return __p;\n";
                try {
                    var k = new Function(c.variable || "obj", "_", j)
                } catch (l) {
                    throw l
                }
                var m = function (a) {
                    return k.call(this, a)
                }
                    , n = c.variable || "obj";
                return m.source = "function(" + n + "){\n" + j + "}",
                    m
            }
        ;
        var j = (a(document),
            0)
            , k = 0
            , l = (new Date).getTime()
            , m = (String.prototype.toString,
            !1)
            , n = {
            1: {
                name: "观看时长",
                cookiename: "plogin",
                val: 0,
                tmpl: "<div class='room-wbshare wbshare-login'></div>",
                btnid: "wb-sh-login-btn"
            },
            2: {
                name: "鱼丸暴击",
                cookiename: "pcritical",
                val: 0,
                style: 0,
                tmpl: "<div class='room-wbshare wbshare-critical'></div>",
                btnid: "wb-sh-crit-btn"
            },
            3: {
                name: "高级酬勤",
                lev: 3,
                cookiename: "padvcq",
                val: 0,
                tmpl: "<div class='room-wbshare wbshare-advcq'></div>",
                btnid: "wb-sh-advcq-btn"
            },
            4: {
                name: "中级酬勤",
                lev: 2,
                cookiename: "pmidcq",
                val: 0,
                tmpl: "<div class='room-wbshare wbshare-midcq'></div>",
                btnid: "wb-sh-midcq-btn"
            },
            5: {
                name: "初级酬勤",
                lev: 1,
                cookiename: "pjuncq",
                val: 0,
                tmpl: "<div class='room-wbshare wbshare-juncq'></div>",
                btnid: "wb-sh-juncq-btn"
            },
            6: {
                name: "火箭",
                cookiename: "procket",
                val: 0,
                style: 6,
                tmpl: "<div class='room-wbshare wbshare-rocket'></div>",
                btnid: "wb-sh-rock-btn"
            },
            7: {
                name: "飞机",
                cookiename: "pplane",
                val: 0,
                style: 5,
                tmpl: "<div class='room-wbshare wbshare-plane'></div>",
                btnid: "wb-sh-plan-btn"
            },
            8: {
                name: "666",
                cookiename: "pliu",
                val: 0,
                style: 4,
                tmpl: "<div class='room-wbshare wbshare-liu'></div>",
                btnid: "wb-sh-liu-btn"
            },
            9: {
                name: "赞",
                cookiename: "pzan",
                val: 0,
                style: 3,
                tmpl: "<div class='room-wbshare wbshare-zan'></div>",
                btnid: "wb-sh-zan-btn"
            },
            10: {
                name: "520",
                cookiename: "pwel",
                val: 0,
                style: 2,
                tmpl: "<div class='room-wbshare wbshare-wel'></div>",
                btnid: "wb-sh-wel-btn"
            },
            11: {
                name: "100鱼丸",
                cookiename: "phyw",
                val: 0,
                style: 1,
                tmpl: "<div class='room-wbshare wbshare-hyw'></div>",
                btnid: "wb-sh-hyw-btn"
            }
        }
            , o = null
            , p = "share"
            , q = null
            , r = {
            init: function () {
                var c = this;
                q = a("#js-stats-and-actions"),
                    b.on("mod.center.userrole.ready", function (a) {
                        if (!m) {
                            m = 1;
                            var b = d.check();
                            b && c.getServerInfo()
                        }
                    })
            },
            getServerInfo: function () {
                var b = this;
                a.ajax({
                    url: "/wb_share/config",
                    type: "get",
                    dataType: "json",
                    success: function (a) {
                        if (a && 0 == a.error) {
                            var c = a.data;
                            b.setData(c);
                            var d = parseInt(c.switch_on);
                            if (!c.events)
                                return !1;
                            d && (l = 1e3 * c.system_time,
                                j = parseInt(c.probability),
                                k = c.experience,
                                b.ready())
                        }
                    }
                })
            },
            getCookie: function (a) {
                return e.get(p + a)
            },
            setCookie: function (a, b, c) {
                e.set(p + a, b, c)
            },
            triggered: function (a) {
                var b = this
                    , c = n[a];
                return g.get("sys.uid") == b.getCookie(c.cookiename)
            },
            loginAction: function (a) {
                var b = this
                    , c = null
                    , d = 0
                    , e = (n[a],
                    b.getEvent(a));
                b.getRestTime(l),
                    c = setInterval(function () {
                        d = d ? d : 0,
                            d++;
                        var f = parseInt(e.count);
                        if (isNaN(f) || !f)
                            return !1;
                        if (d / 60 % e.count == 0) {
                            var g = 100 * Math.random();
                            j > g && (clearInterval(c),
                                c = null ,
                                b.render(a))
                        }
                    }, 1e3)
            },
            giftAction: function (a, b) {
                var c = this
                    , d = (n[a],
                    c.getEvent(a))
                    , e = parseInt(d.count)
                    , f = parseInt(b.hits)
                    , g = 100 * Math.random()
                    , h = d.probability || j;
                if (f = f ? f : 1,
                    b.ur && "" != b.ur)
                    ;
                else if (e > f)
                    return !1;
                h > g && c.render(a, b)
            },
            render: function (b, c) {
                var d = this
                    , e = d.getModule(b, c)
                    , f = h.compile(d.getContainer(b), {
                    openTag: "{{",
                    closeTag: "}}"
                })
                    , g = f(e)
                    , i = a(e.wrap);
                i.html(g),
                    q.append(i),
                    d.dp("5.12.1.0"),
                    d.bindEvent(b, i, e)
            },
            bindEvent: function (b, c, d) {
                var e = this
                    , f = n[b]
                    , h = !1
                    , i = 0;
                c.on("click.wbshare", ".wbshare-close", function () {
                    e.closeTip(c)
                }).on("change.wbshare", "[type='checkbox']", function () {
                    var b = a(this);
                    b.is(":checked") ? f.val = b.val() : f.val = 0,
                        i = e.getRestTime((new Date).getTime(), f.val),
                        e.setCookie(f.cookiename, g.get("sys.uid"), i / 1e3)
                }).on("mousedown", "button", function () {
                    return h ? !1 : (h = !0,
                        void e.dp("5.12.2.0"))
                }),
                    i = e.getRestTime((new Date).getTime(), f.val),
                    e.setCookie(f.cookiename, g.get("sys.uid"), i / 1e3),
                    a.extend(d, {
                        callback: function () {
                            c.fadeOut(1e3),
                                e.getReward()
                        }
                    }),
                    e.share(d)
            },
            getModule: function (b, c) {
                var d = this
                    , e = n[b]
                    , f = d.getEvent(b)
                    , h = null
                    , i = []
                    , j = 0
                    , l = e.style
                    , m = $ROOM.giftBatterConfig
                    , o = ""
                    , p = 1
                    , q = ""
                    , p = 0
                    , r = "";
                if (l)
                    for (var s in m) {
                        var t = m[s];
                        if (t.style == l) {
                            o = t.name;
                            break
                        }
                    }
                else
                    o = e.name;
                if (c)
                    if (c.ur && "" != c.ur)
                        p = c.sil,
                            q = f.git_content;
                    else {
                        var u = c.hits ? c.hits : 1;
                        q = 1 == u ? f.tip_content : f.git_content,
                            p = u
                    }
                else
                    q = f.git_content,
                        p = f.count;
                return h = {
                    giftName: o,
                    giftCount: p,
                    roomName: g.get("room.room_name"),
                    anchorName: g.get("room.owner_name"),
                    roomId: g.get("room.room_id"),
                    url: window.location.href
                },
                    i = f.article,
                    j = i.length ? parseInt(Math.random() * i.length) : 0,
                    r = d.helperTmpl(i[j], h),
                    a.extend(h, {
                        cq: e.lev,
                        btnid: e.btnid,
                        tips: d.helperTmpl(q, h),
                        wrap: e.tmpl,
                        template: r,
                        exp: f.experience || k
                    }),
                    h
            },
            getContainer: function () {
                var a = ["<a class='wbshare-close' href='javascript:;'></a>", "<div class='wbshare-title'><i></i></div>", "<div class='wbshare-body'>", "<h2 class='wbshare-content'>", "{{if cq}}", "<i></i>", "{{/if}}", "{{tips}}", "</h2>", "<p>分享即可获得<em>{{exp}}</em>经验值（每天一次）</p>", "<div class='wbshare-btn-grp'>", "<button id='{{btnid}}' type='button' class='wbshare-btn'><i></i><span>微博分享</span></button>", "<label><input value='6' type='checkbox'><span>不再提醒</span></label>", "</div>", "</div>"];
                return a.join("")
            },
            dp: function (a, b) {
                try {
                    DYS.submit({
                        point_id: a,
                        ext: b
                    })
                } catch (c) {
                }
            },
            clone: function (a, b) {
                a = a ? a : {},
                b || (b = a);
                for (var c in b)
                    a[c] = b[c];
                return a
            },
            helperTmpl: function (a, b) {
                var c, d = "";
                if (i) {
                    var e = this.clone(i.templateSettings);
                    i.templateSettings = {
                        evaluate: /%([\s\S]+?)%/g,
                        interpolate: /%([\s\S]+?)%/g,
                        escape: /%-([\s\S]+?)%/g
                    },
                        c = i.template(a),
                        d = c(b),
                        i.templateSettings = e
                }
                return d
            },
            closeTip: function (a) {
                a.remove()
            },
            getRestTime: function (a, b) {
                b = parseInt(b),
                    b = b ? b : 0;
                var c = new Date(a);
                c.setDate(c.getDate() + b),
                    c.setHours(24),
                    c.setMinutes(0),
                    c.setSeconds(0);
                var d = c.getTime() - (new Date).getTime();
                return d
            },
            ready: function () {
                var a = this;
                a.dispatch("1"),
                    c.reg("room_data_giftbat1", function (b) {
                        var c = f.decode(b).too();
                        if ("dgb" === c.type && c.uid == g.get("sys.uid"))
                            for (var d in n) {
                                var e = n[d];
                                if (e.style == c.gs) {
                                    a.dispatch(d, c);
                                    break
                                }
                            }
                    }),
                    b.on("mod.chat.msg.res.olyw.luckburst", function (b) {
                        var c = f.decode(b).too();
                        if (c.uid == g.get("sys.uid")) {
                            if (!c.ur)
                                return "";
                            a.dispatch("2", c)
                        }
                    }),
                    b.on("mod.chat.msg.res.cq", function (b) {
                        var c = f.decode(b).too()
                            , d = f.decode(c.sui).too();
                        if (d.id == g.get("sys.uid"))
                            for (var e in n) {
                                var h = n[e];
                                if (h.lev == c.lev) {
                                    a.dispatch(e, c);
                                    break
                                }
                            }
                    })
            },
            getEvent: function (a) {
                for (var b = this.getData(), c = b.events, d = {}, e = 0, f = c.length; f > e; e++)
                    if (c[e].type == a) {
                        d = c[e];
                        break
                    }
                return d
            },
            dispatch: function (a, b) {
                var c = this;
                if (c.triggered(a))
                    return !1;
                switch (a) {
                    case "1":
                        c.loginAction(a);
                        break;
                    case "2":
                        c.giftAction(a, b);
                        break;
                    case "3":
                    case "4":
                    case "5":
                    case "6":
                    case "7":
                    case "8":
                    case "9":
                    case "10":
                    case "11":
                        c.giftAction(a, b)
                }
            },
            setData: function (a) {
                o = a || {}
            },
            getData: function () {
                return o
            },
            share: function (a) {
                WB2.anyWhere(function (b) {
                    b.widget.publish({
                        id: a.btnid,
                        default_text: a.template,
                        callback: function (b) {
                            a.callback && a.callback.call(b)
                        }
                    })
                })
            },
            getReward: function () {
                var c = this;
                return c.dp("5.12.3.0"),
                    c.getCookie("rewarded") ? !1 : void a.ajax({
                        url: "/member/wb_share/nc_reward",
                        dataType: "json",
                        success: function (a) {
                            0 == a.error && (b.trigger("mod.userinfo.change", {
                                change: {
                                    exp: k
                                }
                            }),
                                c.setCookie("rewarded", !0, c.getRestTime((new Date).getTime()) / 1e3))
                        }
                    })
            }
        };
        r.init();
        var s = new Image;
        s.src = $SYS.web_url + "app/douyu/res/page/room-normal/wbshare/title.png"
    }),
    define("douyu/page/room/normal/mod/charge", ["jquery", "shark/class", "shark/observer", "douyu/context", "douyu/com/user", "douyu/page/room/base/api", "shark/util/cookie/1.0", "shark/ui/dialog/1.0/dialog", "shark/util/flash/data/1.0"], function (a, b, c, d, e, f, g, h, i) {
        function j(a, b) {
            var c = ""
                , d = a.getFullYear()
                , e = a.getMonth() + 1
                , f = a.getDate()
                , g = a.getHours()
                , h = a.getMinutes()
                , i = a.getSeconds();
            return e = e > 9 ? e : "0" + e,
                f = f > 9 ? f : "0" + f,
                g = g > 9 ? g : "0" + g,
                h = h > 9 ? h : "0" + h,
                i = i > 9 ? i : "0" + i,
                !a || isNaN(a) ? c : (b = b.replace("YYYY", d),
                    b = b.replace("MM", e),
                    b = b.replace("DD", f),
                    b = b.replace("hh", g),
                    b = b.replace("mm", h),
                    b = b.replace("ss", i),
                    c = b)
        }

        var k = a(document)
            , l = window.$ROOM
            , m = window.$SYS
            , n = m.groupid
            , o = n >= 5
            , p = l.owner_uid == m.uid
            , q = null
            , r = "liveNotify"
            , s = 0
            , t = Number.prototype.toFixed
            , u = {
            init: function (a) {
                var b = this;
                f.reg("room_data_buytickets", function (a) {
                    b.buyTickets(a)
                }),
                    f.reg("room_data_chargelive", function (a) {
                        return a ? void b.chargeLive(a) : !1
                    }),
                    f.reg("room_data_endchargelive", function () {
                        b.endChargeLive()
                    })
            },
            chargeLive: function (b) {
                if (!e.check())
                    return !1;
                if (m = window.$SYS,
                        n = m.groupid,
                        o = n >= 5,
                        p = l.owner_uid == m.uid,
                    110017 == b.error)
                    return a.dialog.tips_black(b.msg),
                        !1;
                if (0 != b.error && 110006 != b.error)
                    return !1;
                var c = b.data;
                f.exe("js_exitFullScreen");
                var h = parseInt(1e3 * c.start_time)
                    , i = parseInt(1e3 * c.end_time)
                    , u = parseInt(c.expire_time / 60)
                    , v = parseInt(c.trail_seconds)
                    , w = v / 60
                    , x = c.is_pay
                    , y = 0
                    , z = parseInt(c.price) / 100;
                if (z != parseInt(z) && (z = t.call(z, 1)),
                        p) {
                    var A = new Date(h);
                    if (A.setHours(24),
                            A.setMinutes(0),
                            A.setSeconds(0),
                            y = A.getTime() - (new Date).getTime(),
                        0 > y && g.set(r, d.get("sys.uid"), y / 1e3),
                        d.get("sys.uid") == g.get(r))
                        return !1;
                    g.set(r, d.get("sys.uid"), y / 1e3);
                    var B = "";
                    B = w > 0 ? "<b>你设置了<em>" + w + "</em>分钟免费试看时间。</b><div><b>试看结束后，其他用户进入直播间将需要付费。</b></div>" : "<b>其他用户进入直播间将需要付费。</b>",
                        q = a.dialog({
                            id: "tickets",
                            content: '<div class="room-charge-notice"><h3>付费直播时间已开始。</h3>' + B + '<div class="btn-group"><input class="btn btn-normal" data-type="confirm" type="button" value="确定"/></div></div>',
                            title: "付费直播提示",
                            lock: !0
                        }),
                        k.off("click.room_charge").on("click.room_charge", '[data-type="confirm"]', function () {
                            q.close()
                        })
                } else if (!o) {
                    var C = new Date(h)
                        , D = new Date(i);
                    if (s = 1 === d.get("room.show_status"),
                        u > 0 && s && !x) {
                        var E = a('<div class="room-charge-trail-panel"><a data-role="confirm" class="room-charge-close" href="javascript:;"></a><div class="room-charge-time"><span>' + j(C, "YYYY年MM月DD日 hh:mm") + "</span><span>" + j(D, "YYYY年MM月DD日 hh:mm") + '</span></div><div class="room-charge-tickets"><div class="room-charge-tickets-info"><strong>票价</strong><em><b>' + z + '</b><i>鱼翅</i></em></div><div class="room-charge-trail-info"><div>你的免费试看时间不超过<b>' + w + '</b>分钟！</div><div>试看完毕后需要付费继续观看</div></div></div><div class="room-charge-btn-grp"><a data-role="confirm" href="javascript:;">继续试看</a></div></div>');
                        a(".room-charge-trail-panel").remove(),
                            a("body").append(E),
                            E.on("click", '[data-role="confirm"]', function () {
                                E.hide()
                            })
                    }
                }
            },
            endChargeLive: function () {
                p && (f.exe("js_exitFullScreen"),
                    q = a.dialog({
                        id: "tickets",
                        content: '<div class="room-charge-notice"><h3 class="title">付费直播时间已结束，请关闭直播！<br/>否则付费时长将一直持续。</h3><div class="btn-group"><input class="btn btn-normal" data-type="confirm" type="button" value="确定"/></div></div>',
                        title: "直播提示",
                        lock: !0
                    }),
                    k.off("click.room_charge").on("click.room_charge", '[data-type="confirm"]', function () {
                        q.close()
                    })),
                    g.remove(r)
            },
            buyTickets: function (b) {
                f.exe("js_exitFullScreen");
                var c = null
                    , g = 0
                    , h = 0;
                return e.check() ? b ? (c = b.data,
                    c.need_pay ? (h = parseFloat(a('[data-login-user="gold"]').text()),
                        isNaN(h) ? (a.dialog.tips_black("正在获取余额，请稍后再试！"),
                            !1) : (g = parseInt(c.price) / 100,
                        g != parseInt(g) && (g = t.call(g, 1)),
                            void (p || o || (a(".room-charge-trail-panel").remove(),
                                h >= g ? (q = a.dialog({
                                    id: "tickets",
                                    content: '<div class="room-charge-notice">门票价格：' + g + "鱼翅<br/>购买门票将扣除你" + g + '鱼翅<br/>且<strong>不能退票</strong><div class="btn-group"><input class="btn btn-normal" data-type="confirm" type="button" value="确认购买"/><input class="btn btn-gray" data-type="cancel" type="button" value="取消"/></div></div>',
                                    title: "购买确认"
                                }),
                                    k.off("click.room_charge").on("click.room_charge", '[data-type="confirm"]', function () {
                                        a.ajax({
                                            url: "/room/eticket/deal_eticket",
                                            dataType: "json",
                                            type: "post",
                                            data: {
                                                id: c.ticket_id,
                                                room_id: l.room_id,
                                                dy: d.get("room.device_id")
                                            }
                                        }).then(function (b) {
                                            var c = b.msg;
                                            q.close(),
                                                a.dialog.tips_black(c),
                                            999 == b.code && window.location.reload(!0)
                                        })
                                    }).on("click.room_charge", '[data-type="cancel"]', function () {
                                        q.close()
                                    })) : (q = a.dialog({
                                    id: "tickets",
                                    content: '<div class="room-charge-notice">门票价格：' + g + '鱼翅<br/><strong>购买失败</strong><br/>鱼翅不足，点击获取！<div class="btn-group"><input class="btn btn-normal" data-type="confirm" type="button" value="获取鱼翅"/><input class="btn btn-gray"  data-type="cancel" type="button" value="取消"/></div></div>'
                                }),
                                    k.off("click.room_charge").on("click.room_charge", '[data-type="confirm"]', function () {
                                        q.close();
                                        try {
                                            DYS.storage.save("_dypay_fp", 5)
                                        } catch (a) {
                                        }
                                        window.open("/web_game/welcome/18")
                                    }).on("click.room_charge", '[data-type="cancel"]', function () {
                                        q.close()
                                    })))))) : !1) : !1 : void e.show("login")
            }
        };
        return u
    }),
    define("douyu/page/room/normal/mod/super-recommended", ["jquery", "shark/observer", "shark/util/lang/1.0", "shark/util/cookie/1.0", "shark/util/template/2.0", "douyu/context", "douyu/com/imgp"], function (a, b, c, d, e, f, g) {
        function h() {
            var a = new Date
                , b = a.getFullYear() + "/" + (a.getMonth() + 1) + "/" + a.getDate()
                , c = new Date(b);
            c.setDate(c.getDate() + 1);
            var d = ((c.getTime() - a.getTime()) / 1e3).toFixed(0);
            return parseInt(d)
        }

        var i = {
            loccookie: {
                locname: "showsuperrmd" + (d.get("uid") || "no"),
                showsuper: 1,
                cookietime: 86400
            },
            tipcookie: {
                locname: "showtiprmd" + (d.get("uid") || "no"),
                showtip: 1,
                cookietime: 259200,
                cookietime2: h()
            },
            listdata: [],
            ywlistdata: [],
            showtime: 3e4,
            tiptime: 18e4,
            showflag: 0,
            togglefirst: 1,
            dataflag: {
                rightPop: 0,
                ywPop: 1
            }
        }
            , j = {
            $win: a(window)
        }
            , k = {}
            , l = {}
            , m = {};
        return i.getdata = function (b) {
            var c = $ROOM.room_id
                , d = $ROOM.cate_id
                , e = "/roomrecomm/getrecommand";
            a.ajax(e, {
                data: {
                    roomid: c,
                    cateid: d
                },
                type: "get",
                dataType: "json",
                timeout: 3e3,
                success: function (a) {
                    0 == a.error && (i.listdata = a.data.right,
                        i.ywlistdata = a.data.fish,
                    i.loccookie.showsuper && i.listdata.length >= 4 && setTimeout(function () {
                        j.init(),
                            k.init()
                    }, i.showtime))
                }
            })
        }
            ,
            i.init = function () {
                var b = d.get(i.loccookie.locname)
                    , c = d.get(i.tipcookie.locname);
                i.loccookie.showsuper = a.isNumeric(b) ? parseInt(b) : 1,
                    i.tipcookie.showsuper = a.isNumeric(c) ? parseInt(c) : 1,
                    i.getdata(i.dataflag.rightPop)
            }
            ,
            i.ywinit = function () {
                i.ywlistdata.length >= 2 && (l.init(),
                    m.init())
            }
            ,
            j.init = function () {
                j.$body = a("body"),
                    j.$body.append(c.string.join('<div class="js-live-room-recommend" id="js-live-room-recommend">', '<b class="super-rmd-bg tggcontrol"></b>', '<b class="super-rmd-title tggcontrol"></b>', '<div class="rmd-tip"><div class="rmd-tip-close"></div><div class="rmd-tip-content">', '<p class="rmd-tip-text">阅尽千万主播，超管吐血推荐</p>', '<p class="rmd-tip-btn"><button>查看</button><a href="#" class="rmd-tip-notshow">不再提示</a></p>', "</div></div>", '<div class="title tggcontrol">', '<img src="' + $SYS.web_url + 'app/douyu/res/page/room-normal/super-rmd/rgrmd-top.png" />', "</div>", '<div class="list">', "</div>", '<div class="footer super-notshow" data-flag="1"><img src="' + $SYS.web_url + 'app/douyu/res/page/room-normal/super-rmd/rgrmd-foot.png" /></div>', "</div>")),
                    j.$recommend = a("#js-live-room-recommend"),
                    j.$list = j.$recommend.find(".list"),
                    j.$tggcontrol = j.$recommend.find(".tggcontrol"),
                    j.$notshow = j.$recommend.find(".super-notshow"),
                    j.$tip = j.$recommend.find(".rmd-tip"),
                    j.$footer = j.$recommend.find(".footer"),
                    j.mainObj.renderData(),
                    j.mainObj.fitSize(),
                    j.tipObj.showTip(),
                    j.mainObj.keaiShow(1)
            }
            ,
            j.mainObj = {
                getTemplate: function () {
                    return '{{each items as value i}}<div class="list-item" title="{{value.title}}"><a  target="_blank" href="/{{value.roomid}}" data-cateid="{{value.cateid}}" data-roomid="{{value.roomid}}"><div class="room-img"><b></b><img data-original="{{value.roompic}}" src="http://www.dev.dz11.com/upload/web_pic/default2_thumb.gif" title="{{value.title}}"><div class="room-img-bg"></div></div><div class="room-info" ><div class="room-zhubo-img"><img data-original="{{value.avatar}}" src="' + $SYS.web_url + 'app/douyu/res/page/room-normal/super-rmd/rgrmd-default.jpg"/></div><div class="room-type-name">{{value.catename}}</div><div class="room-title">{{value.title}}</div></div></a></div>{{/each}}'
                },
                renderData: function () {
                    var a = i.listdata.splice(0, 4)
                        , b = e.compile(j.mainObj.getTemplate())
                        , c = b({
                        items: a
                    });
                    j.$list.append(c),
                        g.build({
                            container: "#js-live-room-recommend",
                            threshold: 200
                        })
                },
                toggle: function () {
                    if (j.tipObj.hideTip(),
                        0 == i.showflag && i.togglefirst && window.DYS) {
                        var b = $ROOM.room_id
                            , c = [];
                        j.$recommend.find(".list-item").each(function (d) {
                            var e = this
                                , f = a(e).find("a").attr("data-roomid")
                                , g = a(e).find("a").attr("data-cateid");
                            c.push({
                                point_id: "2.3.0.0",
                                rid: b,
                                ext: {
                                    at: "show",
                                    rid: f,
                                    rt: 5,
                                    tid: g,
                                    pg: "",
                                    idx: d + 1
                                }
                            })
                        }),
                        c.length > 0 && DYS.submit(c)
                    }
                    if (i.togglefirst = 0,
                            i.showflag) {
                        j.$recommend.removeClass("active").css({
                            right: "-" + (j.$list.width() + 6) + "px"
                        }),
                            i.showflag = 0,
                            j.mainObj.keaiShow(1);
                        var d = j.$footer.attr("data-flag");
                        1 != d && j.mainObj.notShow()
                    } else
                        j.$recommend.addClass("active").css({
                            right: "0px"
                        }),
                            i.showflag = 1,
                            j.mainObj.keaiShow(0)
                },
                keaiShow: function (a) {
                    a ? (setTimeout(function () {
                        j.$recommend.find(".super-rmd-title").stop().animate({
                            left: "-66px"
                        }, 600)
                    }, 300),
                        setTimeout(function () {
                            j.$recommend.find(".super-rmd-bg").stop().animate({
                                height: "99px",
                                top: "-10px"
                            }, 1e3)
                        }, 600)) : (j.$recommend.find(".super-rmd-bg").stop().css({
                        height: "0px",
                        top: "65px"
                    }),
                        j.$recommend.find(".super-rmd-title").stop().css("left", "0px"))
                },
                fitSize: function () {
                    var a = j.$win.height()
                        , b = 565
                        , c = (a - b) / 2;
                    78 > c && (c = 78),
                        565 > a ? j.$recommend.css({
                            top: "0px",
                            display: "block"
                        }) : j.$recommend.css({
                            top: c.toFixed(0) + "px",
                            display: "block"
                        })
                },
                notShow: function () {
                    d.set(i.loccookie.locname, 0, i.loccookie.cookietime),
                        j.$recommend.hide()
                }
            },
            j.tipObj = {
                showTip: function () {
                    i.tipcookie.showsuper && setTimeout(function () {
                        i.showflag || (j.$tip.show(),
                            j.$tip.find("button").click(function () {
                                j.mainObj.toggle()
                            }),
                            j.$tip.find("a.rmd-tip-notshow").click(function (a) {
                                j.$tip.hide(),
                                    a.stopPropagation(),
                                    a.preventDefault()
                            }),
                            j.$tip.find(".rmd-tip-close").click(function (a) {
                                j.$tip.hide()
                            }),
                            d.set(i.tipcookie.locname, 0, i.tipcookie.cookietime),
                            i.tipcookie.showsuper = 0)
                    }, i.tiptime)
                },
                hideTip: function () {
                    i.tipcookie.showsuper || (j.$tip.hide(),
                        d.set(i.tipcookie.locname, 0, i.tipcookie.cookietime2),
                        i.tipcookie.showsuper = 0)
                }
            },
            k.init = function () {
                j.$tggcontrol.click(function () {
                    j.mainObj.toggle()
                }),
                    j.$notshow.click(function (a) {
                        var b = j.$footer.attr("data-flag");
                        1 == b ? (j.$footer.attr("data-flag", 0),
                            j.$footer.find("img").attr("src", $SYS.web_url + "app/douyu/res/page/room-normal/super-rmd/rgrmd-foot-select.png")) : (j.$footer.attr("data-flag", 1),
                            j.$footer.find("img").attr("src", $SYS.web_url + "app/douyu/res/page/room-normal/super-rmd/rgrmd-foot.png"))
                    }),
                window.DYS && j.$list.find(".list-item").each(function (b) {
                    var c = this;
                    a(c).click(function (d) {
                        var e = $ROOM.room_id
                            , f = a(c).find("a").attr("data-roomid")
                            , g = a(c).find("a").attr("data-cateid");
                        DYS.submit({
                            point_id: "2.3.0.0",
                            rid: e,
                            ext: {
                                at: "click",
                                rid: f,
                                rt: 5,
                                tid: g,
                                pg: "",
                                idx: b + 1
                            }
                        })
                    })
                }),
                    j.$win.resize(function () {
                        j.mainObj.fitSize()
                    })
            }
            ,
            l.init = function () {
                var b = c.string.join('<div class="rmd-rooms">', '<div class="rmd-rooms-title"></div>', '<ul class="rmd-rooms-list clearfix">', "</ul>", "</div>");
                if (l.$ywrmdroom = a("#js-yw-rmd-rooms"),
                    l.$ywrmdroom.find(".rmd-rooms").length <= 0 && l.$ywrmdroom.html(b),
                        l.$ywrmdlist = a("#js-yw-rmd-rooms").find("ul.rmd-rooms-list"),
                        l.mainObj.renderData(),
                        window.DYS) {
                    var d = $ROOM.room_id
                        , e = [];
                    l.$ywrmdlist.find("li").each(function (b) {
                        var c = this
                            , f = a(c).find("a").attr("data-roomid")
                            , g = a(c).attr("data-cateid");
                        e.push({
                            point_id: "2.3.0.0",
                            rid: d,
                            ext: {
                                at: "show",
                                rid: f,
                                rt: 4,
                                tid: g,
                                pg: "",
                                idx: b + 1
                            }
                        })
                    }),
                    e.length > 0 && DYS.submit(e)
                }
            }
            ,
            l.mainObj = {
                getTemplate: function () {
                    return '{{each items as value i}}<li title="{{value.title}}"><a target="_blank" href="/{{value.roomid}}" data-cateid="{{value.cateid}}" data-roomid="{{value.roomid}}"><div class="rmd-room"><div class="rmd-room-img"><b></b><img  data-original="{{value.roompic}}" src="http://www.dev.dz11.com/upload/web_pic/default2_thumb.gif" title="{{value.title}}"></div><div class="rmd-room-title" >{{value.title}}</div></div></a></li>{{/each}}'
                },
                renderData: function () {
                    var a = i.ywlistdata.slice(0, 2)
                        , b = e.compile(l.mainObj.getTemplate())
                        , c = b({
                        items: a
                    });
                    l.$ywrmdroom.parent(".yw-collect-box").addClass("ywrmd"),
                        l.$ywrmdlist.html(c),
                        g.build({
                            container: "#js-yw-rmd-rooms"
                        })
                },
                rmdRefresh: function () {
                }
            },
            m.init = function () {
                window.DYS && l.$ywrmdlist.find("a").each(function (b) {
                    var c = this;
                    a(c).click(function (d) {
                        var e = $ROOM.room_id
                            , f = a(c).attr("data-roomid")
                            , g = a(c).attr("data-cateid");
                        DYS.submit({
                            point_id: "2.3.0.0",
                            rid: e,
                            ext: {
                                at: "click",
                                rid: f,
                                rt: 4,
                                tid: g,
                                pg: "",
                                idx: b + 1
                            }
                        })
                    })
                })
            }
            ,
        {
            init: function () {
                i.init()
            },
            ywinit: function () {
                i.ywinit()
            },
            ywRmdRefresh: function () {
                l.mainObj.rmdRefresh()
            }
        }
    }),
    define("douyu/page/room/normal/mod/video", ["jquery", "shark/observer", "shark/ext/swfobject", "shark/util/cookie/1.0", "shark/util/flash/data/1.0", "douyu/context", "douyu/page/room/base/api"], function (a, b, c, d, e, f, g) {
        var h = {
            flash: {
                id: "douyu_room_flash_proxy",
                box_id: "douyu_room_normal_flash_proxy_box",
                ver: "11.1.4",
                full_key: "douyu_room_flash_full",
                state: {
                    full: "full",
                    norm: "norm"
                }
            },
            fullClass: {
                flashBox: "flash-fullpage",
                bodyBox: "body-flash-fullpage"
            }
        }
            , i = {}
            , j = {}
            , k = {};
        i.URL = {
            param: function (a) {
                var b, c;
                return a = a.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]"),
                    b = new RegExp("[\\?&]" + a + "=([^&#]*)"),
                    c = b.exec(location.search),
                    null == c ? "" : decodeURIComponent(c[1].replace(/\+/g, " "))
            }
        },
            j.build = function () {
                var a, b = f.get("room.args"), e = f.get("room.effectConfig"), g = f.get("room.flashConfig"), j = f.get("room.is_video_high_quality_time"), k = f.get("room.video_high_quality_resolution"), l = f.get("room.video_high_quality_num"), m = {}, n = {}, o = {};
                "undefined" !== j && "undefined" !== k && "undefined" !== l && (a = [parseInt(k), parseInt(l), parseInt(j)]),
                    m.DomainName = window.location.host,
                    m.cdn = i.URL.param("cdn"),
                    m.asset_url = f.get("sys.res_url"),
                    m.checkowne = f.get("sys.uid") == f.get("room.owner_uid") ? 1 : 0,
                    m.usergroupid = f.get("sys.groupid"),
                    m.uid = f.get("sys.uid") || 0,
                    m.room_link = "",
                    m.Servers = f.get("room.args.server_config"),
                    m.RoomId = f.get("room.room_id"),
                    m.RoomTitle = f.get("room.room_name"),
                    m.cate_id = f.get("room.cate_id"),
                    m.OwnerId = f.get("room.owner_uid"),
                    m.Status = 1 === f.get("room.show_status"),
                    m.closeFMS = !(1 === f.get("room.show_status") && !b.live_url),
                    m.roompass = f.get("room.room_pwd"),
                    m.isshow = f.get("room.isshow"),
                f.get("room.eticket") && (m.eticket = f.get("room.eticket")),
                    m.phonestatus = d.get("phonestatus") || 0,
                    m.WidgetUrl = "http://s.csbew.com/FrameWork/AFP/ASP_vastTrack2.swf",
                    m.WidgetId = 5322,
                    m.WidgetServers = "http://afp.wasu.cn/",
                    m.WidgetPosition = f.get("room.widgetPosition"),
                    m.WidgetType = f.get("room.widgetType"),
                    m.effectConfig = e ? escape(JSON.stringify(e)) : "",
                    m.flashConfig = g ? escape(JSON.stringify(g)) : "",
                    m.effectSwf = f.get("room.effectSwf"),
                    m.definitionConfig = a ? escape(JSON.stringify(a)) : "",
                    n.quality = "high",
                    n.bgcolor = "#ffffff",
                    n.allowscriptaccess = "always",
                    n.allowfullscreen = "true",
                    n.wmode = "Opaque",
                    n.allowFullScreenInteractive = "true",
                    o.id = h.flash.id,
                    o.name = h.flash.id,
                    o.align = "middle",
                    o.allowscriptaccess = "always",
                    o.allowfullscreen = "true",
                    o.allowFullScreenInteractive = "true",
                    c.embedSWF(b.swf_url, h.flash.box_id, b.live_url ? "0" : "100%", b.live_url ? "0" : "100%", h.flash.ver, "", m, n, o),
                    c.createCSS(h.flash.box_id, "display:block;text-align:left;")
            }
            ,
            k.pageFull = function () {
                var b = a("body")
                    , c = a("#" + h.flash.id)
                    , d = c.parent();
                document.body.style.overlfow = "hidden",
                    document.documentElement.style.overflow = "hidden",
                    d.addClass(h.fullClass.flashBox),
                    b.data(h.flash.full_key, !0).addClass(h.fullClass.bodyBox)
            }
            ,
            k.pageNorm = function () {
                var b = a("body")
                    , c = a("#" + h.flash.id)
                    , d = c.parent();
                document.body.style.overlfow = "auto",
                    document.documentElement.style.overflow = "auto",
                    d.removeClass(h.fullClass.flashBox),
                    b.data(h.flash.full_key, !1).removeClass(h.fullClass.bodyBox)
            }
            ,
            k.pageToggle = function () {
                var c = a("body")
                    , d = c.data(h.flash.full_key);
                d ? k.pageNorm() : k.pageFull(),
                    b.trigger("mod.video.state.change", !d)
            }
        ;
        var l = a("#js-room-video")
            , m = {
            illeaglMsg: function (a) {
                this.showIlleaglMsgTpl(a)
            },
            showIlleaglMsgTpl: function (b) {
                var c = l.find('[data-video-illeagl="illeag"]')
                    , d = l.find(".watch")
                    , e = a('[data-super-meun="js-set-violation-remind"]');
                1 == parseInt(b.flag) ? c.length ? (c.show(),
                e && (e.html("关闭违规提醒"),
                    e.attr("data-isopen", 0))) : (l.append(this.checkTpl(b.data.context, this.userrole)),
                    l.append('<div class="watch"></div>'),
                4 == this.roll && (this.illRemindCountdown(b.data.startTime, b.data.serverTime),
                e && (e.html("关闭违规提醒"),
                    e.attr("data-isopen", 0)))) : (c.hide(),
                    d.hide(),
                e.length && (e.html("开启违规提醒"),
                    e.attr("data-isopen", 1)),
                    this.removeIllegalRemind())
            },
            checkTpl: function (a, b) {
                var c = "";
                return a = a ? a : this.info.supremindtip,
                    -1 != b.indexOf(4) && -1 == b.indexOf(2) ? (c = '<div class="super-illremtip" data-video-illeagl="illeag"><a style=""></a><p>该直播间涉嫌违规正在处理中...</p><p>距离该违规提醒自动关闭时间<span class="cdTime" data-illeag-time="time">02分:36秒</span></p></div>',
                        this.roll = 4) : -1 != b.indexOf(2) && (c = '<div class="anchor-illremtip" data-video-illeagl="illeag"><div class="con"><p style="top: 42px;">' + a + "</p></div></div>"),
                    c
            },
            illRemindCountdown: function (b, c) {
                var e = this
                    , f = (new Date).getTime()
                    , g = c - b
                    , h = parseInt(36e5 - g);
                if (h > 0) {
                    var i = h % 36e5
                        , j = parseInt(i / 6e4)
                        , k = i % 6e4
                        , l = parseInt(k / 1e3);
                    j = 10 > j ? "0" + j : j,
                        l = 10 > l ? "0" + l : l;
                    var m = j + "分:" + l + "秒";
                    a(".super-illremtip .cdTime").length > 0 && a(".super-illremtip .cdTime").html(m),
                        setTimeout(function () {
                            var a = (new Date).getTime() - f
                                , d = c + a;
                            e.illRemindCountdown(b, d)
                        }, 200)
                } else if (0 >= h) {
                    if ($SYS.uid == $ROOM.owner_uid && d.set("illAchorCheck", JSON.stringify({
                            roomid: $ROOM.owner_uid,
                            flag: 1
                        }), 864e3),
                            e.removeIllegalRemind(),
                        0 > h)
                        return;
                    if (5 == $SYS.groupid) {
                        var n = "/" + $ROOM.room_id + "?_r=" + Math.random(1);
                        location.href = n
                    }
                }
            },
            removeIllegalRemind: function () {
                if ($SYS.uid == $ROOM.owner_uid) {
                    var b = {};
                    if (d.get("illAchorCheck") && (b = JSON.parse(d.get("illAchorCheck"))),
                        "1" == b.flag && b.roomid == $ROOM.owner_uid) {
                        d.set("illAchorCheck", JSON.stringify({
                            roomid: $ROOM.owner_uid,
                            flag: 0
                        }), 864e3);
                        var c = l.find(".super-illremtip");
                        c.length || (c = l.find(".anchor-illremtip")),
                        c.length && c.remove(),
                            l.append('<div class="anchor-cheSuccess anchorRmSuc"> <a href="javascript:;" class="close"></a></div>');
                        var e = a(".anchor-cheSuccess");
                        e.find(".close").click(function () {
                            a(".anchorRmSuc").hide()
                        }),
                            setTimeout(function () {
                                e.hide()
                            }, 3e4)
                    } else
                        d.set("illAchorCheck", JSON.stringify({
                            roomid: $ROOM.owner_uid,
                            flag: 0
                        }), 864e3),
                            a(".anchorRmSuc").hide()
                } else {
                    a(".illeagalReminds").hide(),
                        a(".super-illremtip").hide();
                    var f = a('[data-super-meun="js-set-violation-remind"]');
                    f.html("开启违规提醒"),
                        f.attr("data-isopen", 1)
                }
                a(".watch").hide()
            },
            reduceIlleaglMsg: function (a) {
                this.showReduceIlleaglMsgTpl(a)
            },
            showReduceIlleaglMsgTpl: function (a) {
                var b = '<div class="live-rule-out"><div class="lead-close"></div><p>你由于违法主播规范：<span>版权问题</span>，被扣除<span>100分</span>，请阅读<span><a href="">主播积分管理详细规则</a>。</span></p><p>合理播放内容，共同净化互联网环境！</p></div>';
                return b
            }
        };
        return m.info = {
            roomid: $ROOM.owner_uid,
            supremindtip: "直播内容已经涉嫌违规，请您迅速进行整改，在整改期间，您的直播内容（包括图像和声音）都将被屏蔽。整改通过后直播间将正常播放。如果未做出整改，我们将会关闭您的直播间!",
            flag: 0
        },
            b.on("mod.video.showroomillega", function (a) {
                m.userrole = a.userrole.join(","),
                    m.illeaglMsg(a)
            }),
            b.on("mod.video.state.get", function () {
                var b = a("body").data(h.flash.full_key);
                return b ? h.flash.state.full : h.flash.state.norm
            }),
            b.on("mod.video.state.norm", function () {
                k.pageNorm()
            }),
            b.on("mod.video.state.flashnorm", function () {
                var a = b.fire("mod.video.state.get");
                a === h.flash.state.full && g.exe("js_breakRuleTip", 1)
            }),
            b.on("mod.video.state.full", function () {
                k.pageFull()
            }),
            g.reg("room_bus_pagescr", function () {
                k.pageToggle()
            }),
            g.reg("room_data_illchange", function (b) {
                var c = a("body").data(h.flash.full_key)
                    , f = e.decode(b)
                    , i = parseInt(e.get(f, "ii"))
                    , j = 1e3 * parseInt(e.get(f, "timestamp"))
                    , l = e.get(f, "content")
                    , n = 1e3 * parseInt(e.get(f, "now"));
                g.exe("js_breakRuleTip", c),
                c && k.pageNorm(),
                    g.exe("js_exitFullScreen"),
                0 == i && d.set("illAchorCheck", JSON.stringify({
                    roomid: $ROOM.owner_uid,
                    flag: 1
                }), 864e3),
                    1 == i ? m.illeaglMsg({
                        flag: i,
                        data: {
                            startTime: j,
                            serverTime: n,
                            context: l
                        }
                    }) : 0 == i && m.removeIllegalRemind()
            }),
        {
            init: function () {
                g.set("flash.id", h.flash.id),
                    j.build()
            }
        }
    }),
    define("douyu/page/room/normal/app", ["jquery", "shark/observer", "douyu/com/imgp", "douyu/com/header", "douyu/com/user", "douyu/com/avatar", "douyu/com/zoom", "douyu/page/room/base/api", "douyu/page/room/normal/mod/sign", "douyu/page/room/normal/mod/center", "douyu/page/room/normal/mod/layout", "douyu/page/room/normal/mod/title", "douyu/page/room/normal/mod/userinfo", "douyu/page/room/normal/mod/gift", "douyu/page/room/normal/mod/chat", "douyu/page/room/normal/mod/task", "douyu/page/room/normal/mod/olyw", "douyu/page/room/normal/mod/broadcast", "douyu/page/room/normal/mod/share", "douyu/page/room/normal/mod/qr-code", "douyu/page/room/normal/mod/menu", "douyu/page/room/normal/mod/chouqin", "douyu/page/room/normal/mod/guide", "douyu/page/room/normal/mod/recommended", "douyu/page/room/normal/mod/anchor-like", "douyu/page/room/normal/mod/charge", "douyu/page/room/normal/mod/weibo", "douyu/page/room/normal/mod/video", "douyu-activity/mayday/pc/mayday", "douyu/page/room/normal/mod/super-recommended"], function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C, D) {
        var E = function () {
                var b = d.init({
                    onLogin: function () {
                        e.show("login")
                    },
                    onReg: function () {
                        e.show("reg")
                    },
                    onExit: function () {
                        e.exit()
                    }
                });
                e.init({
                    onAuto: function (a) {
                        a && b.login()
                    }
                }),
                a.fn.placeholder && a("input[placeholder], textarea[placeholder]").each(function () {
                    "password" !== this.type && a(this).placeholder()
                }),
                    c.build(),
                    i.init(),
                    k.init(),
                    s.init(),
                    t.init(),
                    l.init(),
                    m.init(),
                    n.init(),
                    o.init(),
                    q.init(),
                    r.init(),
                    v.init(),
                    w.init(),
                    x.init(),
                    B.init(),
                    z.init(),
                    D.init(),
                    C.init()
            }
            ;
        a(E)
    });
