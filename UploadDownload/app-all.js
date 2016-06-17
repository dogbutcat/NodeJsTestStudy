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
                    d == g() && d.select();
            else
                e.removeClass("placeholder")
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
            location.host;
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
        var c, d = shark.helper.file, e = "2.0";
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
    define("douyu/page/room/base/api", ["jquery", "shark/util/flash/bridge/1.0"], function (a, b, c) {
        var d = {
            flash: {
                id: "room_flash_proxy"
            }
        }
            , e = ["room_dycookie_set", "room_dycookie_get", "room_login_show", "room_reg_show", "room_bus_login", "room_bus_login2", "room_bus_phock", "room_bus_pagescr", "room_bus_showwatchtip", "room_bus_showwatchtipdown", "room_bus_checksevertime", "room_data_sererr", "room_data_flaerr", "room_data_chat", "room_data_chat2", "room_data_schat", "room_data_sys", "room_data_brocast", "room_data_cqrank", "room_data_cqrankupdate", "room_data_olyw", "room_data_info", "room_data_login", "room_data_userc", "room_data_setadm", "room_data_gift", "room_data_buycq", "room_data_tasklis", "room_data_taskcou", "room_data_taskrec", "room_data_chest", "room_data_onekeyacc", "room_data_chatinit", "room_data_chatrep", "room_data_ycchange", "room_data_state", "room_data_nstip", "room_data_nstip2", "room_data_illchange", "room_data_getdid", "room_data_giftbat1", "room_data_ancpoints", "room_data_reg", "room_data_idle", "room_data_idle_dp", "room_screenChange", "room_data_ulgrow", "room_data_ulico", "room_data_rankgap", "room_data_expchange", "room_data_beastrec", "room_data_beastrep", "room_data_petrec", "room_data_buytickets", "room_data_chargelive", "room_data_endchargelive", "room_data_sabonus", "room_data_sabonusget", "room_bus_comcall", "room_data_admfail", "room_data_chatpri", "room_data_per", "room_data_giftbat2", "room_data_balance", "room_data_tasksign", "room_data_chestquery", "room_data_chatcd", "room_data_luckdrawcd", "room_data_wbsharesuc"]
            , f = ["js_newuser_client", "js_userlogin", "js_verReque", "js_anotherlogin", "js_sendmsg", "js_blackuser", "js_userlogout", "js_setadmin", "js_sendsize", "js_barrage", "js_myblacklist", "adverment", "js_givePresent", "js_giveGift", "js_queryTask", "js_newQueryTask", "js_obtainTask", "js_roomSignUp", "js_keyTitles", "js_reportBarrage", "js_exitFullScreen", "js_rewardList", "js_pmFeedback", "js_query_giftPkg", "js_switchStream", "js_superDanmuClick", "js_GetHongbao", "js_effectVisible", "js_breakRuleTip", "js_timeLoginTip", "js_sendhandler", "js_shareSuccess", "js_turn_on_activity", "js_UserNoHandle", "js_UserNoFlowHandle", "js_UserHaveHandle"]
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
    define("douyu/com/header", ["jquery", "shark/class", "shark/observer", "shark/util/lang/1.0", "shark/util/template/2.0", "shark/util/cookie/1.0", "douyu/context", "douyu/com/sign", "douyu/com/header-dp", "douyu/com/verifyPhone", "douyu/com/user", "shark/util/flash/data/1.0", "douyu/page/room/base/api"], function (a, b, c, d, e, f, g, h, i, j, k, l, m) {
        var n, o, p, q, r, s, t, u;
        p = {
            interval: function (a, b, c) {
                setTimeout(function () {
                    a() !== !1 && p.interval(a, b)
                }, b),
                c === !0 && a()
            },
            console: function (a) {
                window.location.href.indexOf("WD_DEBUG=true") > 0 && (window.console ? console[a.type ? a.type : "log"](a.info) : window.alert(a.info))
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
            },
            _format_his_time: function (a, b) {
                var c = a - b;
                return c >= 604800 ? "很久以前" : c >= 86400 ? Math.floor(c / 86400) + "天前" : c >= 3600 ? Math.floor(c / 3600) + "小时前" : c >= 1200 ? 15 * Math.floor(Math.floor(c / 60) / 15) + "分钟前" : c >= 900 ? "15分钟前" : c >= 60 ? Math.floor(c / 60) + "分钟前" : "刚刚"
            },
            _format_online: function (a) {
                return a = parseInt(a),
                    1 > a ? 0 : a >= 1e4 ? (a / 1e4).toFixed(1) + "万" : a
            }
        },
            q = {
                flanch: function () {
                    var a = o
                        , b = a.doms.search
                        , c = b.find(".ipt")
                        , d = b.find("i");
                    a.config.search || (a.config.search = {
                        boxw: b.width(),
                        iptw: c.width(),
                        icow: d.width()
                    });
                    var e = a.config.search
                        , f = e.boxw - e.iptw
                        , g = 20
                        , h = e.boxw + g
                        , i = h - f;
                    b.animate({
                        width: h
                    }),
                        c.animate({
                            width: i
                        })
                },
                narrowing: function () {
                    var a = o;
                    if (a.config.search) {
                        var b = a.doms.search
                            , c = b.find(".ipt")
                            , d = a.config.search;
                        b.animate({
                            width: d.boxw
                        }),
                            c.animate({
                                width: d.iptw
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
                }
            },
            r = {
                preLoadHistory: function () {
                    var a = o
                        , b = a.doms.historyEle
                        , c = b.find(".h-pop");
                    c.removeClass("state-2 state-3").addClass("state-1"),
                        b.addClass("open"),
                        this.reqHistoryData()
                },
                reqHistoryData: function () {
                    var b = function (a) {
                            this.resHistoryView(a)
                        }
                        ;
                    a.ajax("/member/cp/get_user_history", {
                        type: "get",
                        dataType: "json",
                        success: a.proxy(b, this)
                    })
                },
                resHistoryView: function (a) {
                    var b = o
                        , c = b.doms.historyEle
                        , f = c.find(".h-pop");
                    if (!(a && a.nowtime && a.history_list && a.history_list.length))
                        return void f.removeClass("state-1 state-2").addClass("state-3");
                    for (var g, h, i = a.history_list, j = a.nowtime, k = d.string.join("{{each list as item}}", "<li>", "<p>", '<a href="/{{item.rid}}" target="_blank">{{item.n}}</a>', "</p>", "<span>", '<a href="#" class="{{item.headCls}}">{{item.timegap}}</a>', '<a href="#" class="head-ico2">{{item.on}}</a>', '<a href="#" class="head-ico3">{{item.uc}}</a>', "</span>", "</li>", "{{/each}}"), l = e.compile(k), m = 0, n = i.length; n > m; m++)
                        h = i[m],
                            h.headCls = 0 == h.ls ? "head-ico4" : "head-ico1",
                            h.timegap = p._format_his_time(j, h.lt);
                    g = l({
                        list: i
                    }),
                        f.find(".h-list").html(g),
                        f.removeClass("state-1 state-3").addClass("state-2")
                },
                clsHistoryView: function () {
                    var a = o
                        , b = a.doms.historyEle
                        , c = b.find(".h-pop");
                    b.removeClass("open"),
                        c.removeClass("state-1 state-2 state-3")
                }
            },
            s = {
                preLoadFollow: function () {
                    var a = o
                        , b = a.doms.follow
                        , c = b.find(".f-pop");
                    c.removeClass("state-2 state-3").addClass("state-1"),
                        b.addClass("open"),
                        this.reqFollowData()
                },
                reqFollowData: function () {
                    var b = function (a) {
                            this.resFollowView(a)
                        }
                        ;
                    a.ajax("/member/cp/get_follow_list", {
                        type: "get",
                        dataType: "json",
                        success: a.proxy(b, this)
                    })
                },
                resFollowView: function (a) {
                    var b = o
                        , c = b.doms.follow
                        , f = c.find(".f-pop");
                    if (!(a && a.nowtime && a.room_list && a.room_list.length))
                        return void f.removeClass("state-1 state-2").addClass("state-3");
                    for (var g, h, i = a.room_list, j = a.nowtime, k = d.string.join("{{each list as item}}", "<li>", "<p>", '<a href="/{{item.room_id}}" target="_blank">{{item.room_name}}</a>', "</p>", "<span>", '<a href="/{{item.room_id}}" class="head-ico1">已播{{item.minnum}}分钟</a>', '<a href="/{{item.room_id}}" class="head-ico2">{{item.nickname}}</a>', '<a href="/{{item.room_id}}" class="head-ico3">{{item.onlineStr}}</a>', "</span>", "</li>", "{{/each}}"), l = e.compile(k), m = 0, n = i.length; n > m; m++)
                        h = i[m],
                            h.minnum = parseInt((j - h.show_time) / 60),
                            h.onlineStr = p._format_online(h.online);
                    g = l({
                        list: i
                    }),
                        f.find(".f-list").html(g),
                        f.removeClass("state-1 state-3").addClass("state-2")
                },
                clsFollowView: function () {
                    var a = o
                        , b = a.doms.follow
                        , c = b.find(".f-pop");
                    b.removeClass("open"),
                        c.removeClass("state-1 state-2 state-3")
                }
            },
            t = {
                reqLetterData: function (b) {
                    var c = o
                        , d = c.config.autoReqLet
                        , e = (g.get("sys.uid"),
                        this);
                    if (d) {
                        var f = "/lapi/member/userInfo/getInfo/";
                        c.config.autoReqLet = !1,
                            a.ajax(f, {
                                type: "get",
                                dataType: "json",
                                timeout: 3e3,
                                success: function (a) {
                                    c.config.autoReqLet = !0,
                                        e.resLetterView1(a),
                                        e.reqLetterNext()
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
                        type: "get",
                        dataType: "json",
                        timeout: 3e3,
                        success: function (a) {
                            c.resLetterView1(a),
                                c.reqLetterNext()
                        }
                    })
                },
                reqLetterDataFirstRandom: function () {
                    var a = parseInt(10 * Math.random()) + 1
                        , b = 1e3 * a;
                    setTimeout(function () {
                        t.reqLetterDataFirst()
                    }, b)
                },
                reqLetterNext: function () {
                    var a = this
                        , b = o;
                    setTimeout(function () {
                        b.config.autoReqLet = !0,
                            a.reqLetterData()
                    }, 3e5)
                },
                resLetterView1: function (a) {
                    var b = a.error
                        , c = o
                        , d = c.doms;
                    if (0 == b) {
                        var e = a.data;
                        if (e && e.pmNew && 0 == e.pmNew.code) {
                            var e = a.data
                                , h = e.pmNew.msg ? e.pmNew.msg : 0
                                , i = ""
                                , j = "userletnum" + g.get("sys.uid")
                                , k = d.loginEle.find(".umes-icon");
                            $uinfoMenuMIcon = d.loginEle.find(".mes-icon"),
                                h > 0 ? (i = h > 99 ? "99+" : h,
                                    k.html(i).removeClass("hide"),
                                    $uinfoMenuMIcon.html(i).removeClass("hide")) : (k.html("").addClass("hide"),
                                    $uinfoMenuMIcon.html("").addClass("hide")),
                                f.set(j, h, 2592e3)
                        }
                    }
                },
                resLetterView2: function () {
                    var b = o
                        , c = b.doms
                        , d = "userletnum" + g.get("sys.uid")
                        , e = f.get(d)
                        , h = ""
                        , i = c.loginEle.find(".mes-icon")
                        , e = a.isNumeric(e) ? parseInt(e) : 0;
                    h = e > 99 ? "99+" : e,
                        e > 0 ? (c.loginEle.find(".umes-icon").html(h).removeClass("hide"),
                            i.html(h).removeClass("hide")) : (c.loginEle.find(".umes-icon").addClass("hide"),
                            i.addClass("hide"))
                }
            },
            u = {
                levelExp: {
                    leve_json: {
                        0: {
                            lv: 1,
                            pic: "user1.gif",
                            mpic: "cn01.png",
                            name: "菜鸟"
                        },
                        100: {
                            lv: 2,
                            pic: "user2.gif",
                            mpic: "brass05.png",
                            name: "黄铜5"
                        },
                        1000: {
                            lv: 3,
                            pic: "user3.gif",
                            mpic: "brass04.png",
                            name: "黄铜4"
                        },
                        5000: {
                            lv: 4,
                            pic: "user4.gif",
                            mpic: "brass03.png",
                            name: "黄铜3"
                        },
                        10000: {
                            lv: 5,
                            pic: "user5.gif",
                            mpic: "brass02.png",
                            name: "黄铜2"
                        },
                        20000: {
                            lv: 6,
                            pic: "user6.gif",
                            mpic: "brass01.png",
                            name: "黄铜1"
                        },
                        30000: {
                            lv: 7,
                            pic: "user7.gif",
                            mpic: "silver05.png",
                            name: "白银5"
                        },
                        40000: {
                            lv: 8,
                            pic: "user8.gif",
                            mpic: "silver04.png",
                            name: "白银4"
                        },
                        50000: {
                            lv: 9,
                            pic: "user9.gif",
                            mpic: "silver03.png",
                            name: "白银3"
                        },
                        60000: {
                            lv: 10,
                            pic: "user10.gif",
                            mpic: "silver02.png",
                            name: "白银2"
                        },
                        80000: {
                            lv: 11,
                            pic: "user11.gif",
                            mpic: "silver01.png",
                            name: "白银1"
                        },
                        100000: {
                            lv: 12,
                            pic: "user12.gif",
                            mpic: "gold05.png",
                            name: "黄金5"
                        },
                        150000: {
                            lv: 13,
                            pic: "user13.gif",
                            mpic: "gold04.png",
                            name: "黄金4"
                        },
                        200000: {
                            lv: 14,
                            pic: "user14.gif",
                            mpic: "gold03.png",
                            name: "黄金3"
                        },
                        250000: {
                            lv: 15,
                            pic: "user15.gif",
                            mpic: "gold02.png",
                            name: "黄金2"
                        },
                        300000: {
                            lv: 16,
                            pic: "user16.gif",
                            mpic: "gold01.png",
                            name: "黄金1"
                        },
                        400000: {
                            lv: 17,
                            pic: "user17.gif",
                            mpic: "pt05.png",
                            name: "铂金5"
                        },
                        500000: {
                            lv: 18,
                            pic: "user18.gif",
                            mpic: "pt04.png",
                            name: "铂金4"
                        },
                        600000: {
                            lv: 19,
                            pic: "user19.gif",
                            mpic: "pt03.png",
                            name: "铂金3"
                        },
                        700000: {
                            lv: 20,
                            pic: "user20.gif",
                            mpic: "pt02.png",
                            name: "铂金2"
                        },
                        800000: {
                            lv: 21,
                            pic: "user21.gif",
                            mpic: "pt01.png",
                            name: "铂金1"
                        },
                        1000000: {
                            lv: 22,
                            pic: "user22.gif",
                            mpic: "diamond05.png",
                            name: "钻石5"
                        },
                        1200000: {
                            lv: 23,
                            pic: "user23.gif",
                            mpic: "diamond04.png",
                            name: "钻石4"
                        },
                        1500000: {
                            lv: 24,
                            pic: "user24.gif",
                            mpic: "diamond03.png",
                            name: "钻石3"
                        },
                        2000000: {
                            lv: 25,
                            pic: "user25.gif",
                            mpic: "diamond02.png",
                            name: "钻石2"
                        },
                        3000000: {
                            lv: 26,
                            pic: "user26.gif",
                            mpic: "diamond01.png",
                            name: "钻石1"
                        },
                        5000000: {
                            lv: 27,
                            pic: "user27.gif",
                            mpic: "master05.png",
                            name: "大师5"
                        },
                        8000000: {
                            lv: 28,
                            pic: "user28.gif",
                            mpic: "master04.png",
                            name: "大师4"
                        },
                        11000000: {
                            lv: 29,
                            pic: "user29.gif",
                            mpic: "master03.png",
                            name: "大师3"
                        },
                        14000000: {
                            lv: 30,
                            pic: "user30.gif",
                            mpic: "master02.png",
                            name: "大师2"
                        },
                        17000000: {
                            lv: 31,
                            pic: "user31.gif",
                            mpic: "master01.png",
                            name: "大师1"
                        }
                    },
                    exp_level: {
                        0: {
                            lv: 1,
                            ywzr: 0,
                            dmtx: 0,
                            jgyc: 0,
                            ryzl: 0,
                            pic: "newlv1.png",
                            mpic1: "newm1_lv1.png",
                            mpic2: "newm2_lv1.png",
                            mpic3: "newm3_lv1.png"
                        },
                        10: {
                            lv: 2,
                            ywzr: 0,
                            dmtx: 0,
                            jgyc: 0,
                            ryzl: 0,
                            pic: "newlv2.png",
                            mpic1: "newm1_lv2.png",
                            mpic2: "newm2_lv2.png",
                            mpic3: "newm3_lv2.png"
                        },
                        55: {
                            lv: 3,
                            ywzr: 0,
                            dmtx: 0,
                            jgyc: 0,
                            ryzl: 0,
                            pic: "newlv3.png",
                            mpic1: "newm1_lv3.png",
                            mpic2: "newm2_lv3.png",
                            mpic3: "newm3_lv3.png"
                        },
                        145: {
                            lv: 4,
                            ywzr: 0,
                            dmtx: 0,
                            jgyc: 0,
                            ryzl: 0,
                            pic: "newlv4.png",
                            mpic1: "newm1_lv4.png",
                            mpic2: "newm2_lv4.png",
                            mpic3: "newm3_lv4.png"
                        },
                        290: {
                            lv: 5,
                            ywzr: 0,
                            dmtx: 1,
                            jgyc: 0,
                            ryzl: 0,
                            pic: "newlv5.png",
                            mpic1: "newm1_lv5.png",
                            mpic2: "newm2_lv5.png",
                            mpic3: "newm3_lv5.png"
                        },
                        500: {
                            lv: 6,
                            ywzr: 0,
                            dmtx: 1,
                            jgyc: 0,
                            ryzl: 0,
                            pic: "newlv6.png",
                            mpic1: "newm1_lv6.png",
                            mpic2: "newm2_lv6.png",
                            mpic3: "newm3_lv6.png"
                        },
                        785: {
                            lv: 7,
                            ywzr: 0,
                            dmtx: 1,
                            jgyc: 0,
                            ryzl: 0,
                            pic: "newlv7.png",
                            mpic1: "newm1_lv7.png",
                            mpic2: "newm2_lv7.png",
                            mpic3: "newm3_lv7.png"
                        },
                        1155: {
                            lv: 8,
                            ywzr: 0,
                            dmtx: 2,
                            jgyc: 0,
                            ryzl: 0,
                            pic: "newlv8.png",
                            mpic1: "newm1_lv8.png",
                            mpic2: "newm2_lv8.png",
                            mpic3: "newm3_lv8.png"
                        },
                        1620: {
                            lv: 9,
                            ywzr: 0,
                            dmtx: 2,
                            jgyc: 0,
                            ryzl: 0,
                            pic: "newlv9.png",
                            mpic1: "newm1_lv9.png",
                            mpic2: "newm2_lv9.png",
                            mpic3: "newm3_lv9.png"
                        },
                        2285: {
                            lv: 10,
                            ywzr: 2,
                            dmtx: 3,
                            jgyc: 0,
                            ryzl: 0,
                            pic: "newlv10.png",
                            mpic1: "newm1_lv10.png",
                            mpic2: "newm2_lv10.png",
                            mpic3: "newm3_lv10.png"
                        },
                        3248: {
                            lv: 11,
                            ywzr: 2,
                            dmtx: 3,
                            jgyc: 0,
                            ryzl: 0,
                            pic: "newlv11.png",
                            mpic1: "newm1_lv11.png",
                            mpic2: "newm2_lv11.png",
                            mpic3: "newm3_lv11.png"
                        },
                        4607: {
                            lv: 12,
                            ywzr: 2,
                            dmtx: 3,
                            jgyc: 0,
                            ryzl: 0,
                            pic: "newlv12.png",
                            mpic1: "newm1_lv12.png",
                            mpic2: "newm2_lv12.png",
                            mpic3: "newm3_lv12.png"
                        },
                        6460: {
                            lv: 13,
                            ywzr: 2,
                            dmtx: 3,
                            jgyc: 0,
                            ryzl: 0,
                            pic: "newlv13.png",
                            mpic1: "newm1_lv13.png",
                            mpic2: "newm2_lv13.png",
                            mpic3: "newm3_lv13.png"
                        },
                        8905: {
                            lv: 14,
                            ywzr: 2,
                            dmtx: 3,
                            jgyc: 0,
                            ryzl: 0,
                            pic: "newlv14.png",
                            mpic1: "newm1_lv14.png",
                            mpic2: "newm2_lv14.png",
                            mpic3: "newm3_lv14.png"
                        },
                        12040: {
                            lv: 15,
                            ywzr: 2,
                            dmtx: 3,
                            jgyc: 0,
                            ryzl: 0,
                            pic: "newlv15.png",
                            mpic1: "newm1_lv15.png",
                            mpic2: "newm2_lv15.png",
                            mpic3: "newm3_lv15.png"
                        },
                        15963: {
                            lv: 16,
                            ywzr: 2,
                            dmtx: 3,
                            jgyc: 0,
                            ryzl: 0,
                            pic: "newlv16.png",
                            mpic1: "newm1_lv16.png",
                            mpic2: "newm2_lv16.png",
                            mpic3: "newm3_lv16.png"
                        },
                        20772: {
                            lv: 17,
                            ywzr: 2,
                            dmtx: 3,
                            jgyc: 0,
                            ryzl: 0,
                            pic: "newlv17.png",
                            mpic1: "newm1_lv17.png",
                            mpic2: "newm2_lv17.png",
                            mpic3: "newm3_lv17.png"
                        },
                        26565: {
                            lv: 18,
                            ywzr: 2,
                            dmtx: 3,
                            jgyc: 0,
                            ryzl: 0,
                            pic: "newlv18.png",
                            mpic1: "newm1_lv18.png",
                            mpic2: "newm2_lv18.png",
                            mpic3: "newm3_lv18.png"
                        },
                        33440: {
                            lv: 19,
                            ywzr: 2,
                            dmtx: 3,
                            jgyc: 0,
                            ryzl: 0,
                            pic: "newlv19.png",
                            mpic1: "newm1_lv19.png",
                            mpic2: "newm2_lv19.png",
                            mpic3: "newm3_lv19.png"
                        },
                        42315: {
                            lv: 20,
                            ywzr: 3,
                            dmtx: 6,
                            jgyc: "1",
                            ryzl: 1,
                            pic: "newlv20.png",
                            mpic1: "newm1_lv20.png",
                            mpic2: "newm2_lv20.png",
                            mpic3: "newm3_lv20.png"
                        },
                        53689: {
                            lv: 21,
                            ywzr: 3,
                            dmtx: 6,
                            jgyc: "1",
                            ryzl: 1,
                            pic: "newlv21.png",
                            mpic1: "newm1_lv21.png",
                            mpic2: "newm2_lv21.png",
                            mpic3: "newm3_lv21.png"
                        },
                        68061: {
                            lv: 22,
                            ywzr: 3,
                            dmtx: 6,
                            jgyc: "1",
                            ryzl: 1,
                            pic: "newlv22.png",
                            mpic1: "newm1_lv22.png",
                            mpic2: "newm2_lv22.png",
                            mpic3: "newm3_lv22.png"
                        },
                        85930: {
                            lv: 23,
                            ywzr: 3,
                            dmtx: 6,
                            jgyc: "1",
                            ryzl: 1,
                            pic: "newlv23.png",
                            mpic1: "newm1_lv23.png",
                            mpic2: "newm2_lv23.png",
                            mpic3: "newm3_lv23.png"
                        },
                        107795: {
                            lv: 24,
                            ywzr: 3,
                            dmtx: 6,
                            jgyc: "1",
                            ryzl: 1,
                            pic: "newlv24.png",
                            mpic1: "newm1_lv24.png",
                            mpic2: "newm2_lv24.png",
                            mpic3: "newm3_lv24.png"
                        },
                        134155: {
                            lv: 25,
                            ywzr: 3,
                            dmtx: 6,
                            jgyc: "1",
                            ryzl: 1,
                            pic: "newlv25.png",
                            mpic1: "newm1_lv25.png",
                            mpic2: "newm2_lv25.png",
                            mpic3: "newm3_lv25.png"
                        },
                        165509: {
                            lv: 26,
                            ywzr: 3,
                            dmtx: 6,
                            jgyc: "1",
                            ryzl: 1,
                            pic: "newlv26.png",
                            mpic1: "newm1_lv26.png",
                            mpic2: "newm2_lv26.png",
                            mpic3: "newm3_lv26.png"
                        },
                        202356: {
                            lv: 27,
                            ywzr: 3,
                            dmtx: 6,
                            jgyc: "1",
                            ryzl: 1,
                            pic: "newlv27.png",
                            mpic1: "newm1_lv27.png",
                            mpic2: "newm2_lv27.png",
                            mpic3: "newm3_lv27.png"
                        },
                        245195: {
                            lv: 28,
                            ywzr: 3,
                            dmtx: 6,
                            jgyc: "1",
                            ryzl: 1,
                            pic: "newlv28.png",
                            mpic1: "newm1_lv28.png",
                            mpic2: "newm2_lv28.png",
                            mpic3: "newm3_lv28.png"
                        },
                        294525: {
                            lv: 29,
                            ywzr: 3,
                            dmtx: 6,
                            jgyc: "1",
                            ryzl: 1,
                            pic: "newlv29.png",
                            mpic1: "newm1_lv29.png",
                            mpic2: "newm2_lv29.png",
                            mpic3: "newm3_lv29.png"
                        },
                        353855: {
                            lv: 30,
                            ywzr: 4,
                            dmtx: 10,
                            jgyc: "1",
                            ryzl: 1,
                            pic: "newlv30.png",
                            mpic1: "newm1_lv30.png",
                            mpic2: "newm2_lv30.png",
                            mpic3: "newm3_lv30.png"
                        },
                        425182: {
                            lv: 31,
                            ywzr: 4,
                            dmtx: 10,
                            jgyc: "1",
                            ryzl: 1,
                            pic: "newlv31.png",
                            mpic1: "newm1_lv31.png",
                            mpic2: "newm2_lv31.png",
                            mpic3: "newm3_lv31.png"
                        },
                        510503: {
                            lv: 32,
                            ywzr: 4,
                            dmtx: 10,
                            jgyc: "1",
                            ryzl: 1,
                            pic: "newlv32.png",
                            mpic1: "newm1_lv32.png",
                            mpic2: "newm2_lv32.png",
                            mpic3: "newm3_lv32.png"
                        },
                        611815: {
                            lv: 33,
                            ywzr: 4,
                            dmtx: 10,
                            jgyc: "1",
                            ryzl: 1,
                            pic: "newlv33.png",
                            mpic1: "newm1_lv33.png",
                            mpic2: "newm2_lv33.png",
                            mpic3: "newm3_lv33.png"
                        },
                        731115: {
                            lv: 34,
                            ywzr: 4,
                            dmtx: 10,
                            jgyc: "1",
                            ryzl: 1,
                            pic: "newlv34.png",
                            mpic1: "newm1_lv34.png",
                            mpic2: "newm2_lv34.png",
                            mpic3: "newm3_lv34.png"
                        },
                        870400: {
                            lv: 35,
                            ywzr: 4,
                            dmtx: 10,
                            jgyc: "1",
                            ryzl: 1,
                            pic: "newlv35.png",
                            mpic1: "newm1_lv35.png",
                            mpic2: "newm2_lv35.png",
                            mpic3: "newm3_lv35.png"
                        },
                        1031667: {
                            lv: 36,
                            ywzr: 4,
                            dmtx: 10,
                            jgyc: "1",
                            ryzl: 1,
                            pic: "newlv36.png",
                            mpic1: "newm1_lv36.png",
                            mpic2: "newm2_lv36.png",
                            mpic3: "newm3_lv36.png"
                        },
                        1216913: {
                            lv: 37,
                            ywzr: 4,
                            dmtx: 10,
                            jgyc: "1",
                            ryzl: 1,
                            pic: "newlv37.png",
                            mpic1: "newm1_lv37.png",
                            mpic2: "newm2_lv37.png",
                            mpic3: "newm3_lv37.png"
                        },
                        1428135: {
                            lv: 38,
                            ywzr: 4,
                            dmtx: 10,
                            jgyc: "1",
                            ryzl: 1,
                            pic: "newlv38.png",
                            mpic1: "newm1_lv38.png",
                            mpic2: "newm2_lv38.png",
                            mpic3: "newm3_lv38.png"
                        },
                        1667330: {
                            lv: 39,
                            ywzr: 4,
                            dmtx: 10,
                            jgyc: "1",
                            ryzl: 1,
                            pic: "newlv39.png",
                            mpic1: "newm1_lv39.png",
                            mpic2: "newm2_lv39.png",
                            mpic3: "newm3_lv39.png"
                        },
                        1936525: {
                            lv: 40,
                            ywzr: 5,
                            dmtx: 18,
                            jgyc: "1",
                            ryzl: 1,
                            pic: "newlv40.gif",
                            mpic1: "newm1_lv40.png",
                            mpic2: "newm2_lv40.png",
                            mpic3: "newm3_lv40.png"
                        },
                        2245716: {
                            lv: 41,
                            ywzr: 5,
                            dmtx: 18,
                            jgyc: "1",
                            ryzl: 1,
                            pic: "newlv41.gif",
                            mpic1: "newm1_lv41.png",
                            mpic2: "newm2_lv41.png",
                            mpic3: "newm3_lv41.png"
                        },
                        2604899: {
                            lv: 42,
                            ywzr: 5,
                            dmtx: 18,
                            jgyc: "1",
                            ryzl: 1,
                            pic: "newlv42.gif",
                            mpic1: "newm1_lv42.png",
                            mpic2: "newm2_lv42.png",
                            mpic3: "newm3_lv42.png"
                        },
                        3024070: {
                            lv: 43,
                            ywzr: 5,
                            dmtx: 18,
                            jgyc: "1",
                            ryzl: 1,
                            pic: "newlv43.gif",
                            mpic1: "newm1_lv43.png",
                            mpic2: "newm2_lv43.png",
                            mpic3: "newm3_lv43.png"
                        },
                        3513225: {
                            lv: 44,
                            ywzr: 5,
                            dmtx: 18,
                            jgyc: "1",
                            ryzl: 1,
                            pic: "newlv44.gif",
                            mpic1: "newm1_lv44.png",
                            mpic2: "newm2_lv44.png",
                            mpic3: "newm3_lv44.png"
                        },
                        4082360: {
                            lv: 45,
                            ywzr: 5,
                            dmtx: 18,
                            jgyc: "1",
                            ryzl: 1,
                            pic: "newlv45.gif",
                            mpic1: "newm1_lv45.png",
                            mpic2: "newm2_lv45.png",
                            mpic3: "newm3_lv45.png"
                        },
                        4741471: {
                            lv: 46,
                            ywzr: 5,
                            dmtx: 18,
                            jgyc: "1",
                            ryzl: 1,
                            pic: "newlv46.gif",
                            mpic1: "newm1_lv46.png",
                            mpic2: "newm2_lv46.png",
                            mpic3: "newm3_lv46.png"
                        },
                        5500554: {
                            lv: 47,
                            ywzr: 5,
                            dmtx: 18,
                            jgyc: "1",
                            ryzl: 1,
                            pic: "newlv47.gif",
                            mpic1: "newm1_lv47.png",
                            mpic2: "newm2_lv47.png",
                            mpic3: "newm3_lv47.png"
                        },
                        6369605: {
                            lv: 48,
                            ywzr: 5,
                            dmtx: 18,
                            jgyc: "1",
                            ryzl: 1,
                            pic: "newlv48.gif",
                            mpic1: "newm1_lv48.png",
                            mpic2: "newm2_lv48.png",
                            mpic3: "newm3_lv48.png"
                        },
                        7358620: {
                            lv: 49,
                            ywzr: 5,
                            dmtx: 18,
                            jgyc: "1",
                            ryzl: 1,
                            pic: "newlv49.gif",
                            mpic1: "newm1_lv49.png",
                            mpic2: "newm2_lv49.png",
                            mpic3: "newm3_lv49.png"
                        },
                        8477635: {
                            lv: 50,
                            ywzr: 6,
                            dmtx: 30,
                            jgyc: "1",
                            ryzl: 1,
                            pic: "newlv50.gif",
                            mpic1: "newm1_lv50.png",
                            mpic2: "newm2_lv50.png",
                            mpic3: "newm3_lv50.png"
                        },
                        9743316: {
                            lv: 51,
                            ywzr: 6,
                            dmtx: 30,
                            jgyc: "1",
                            ryzl: 1,
                            pic: "newlv51.gif",
                            mpic1: "newm1_lv51.png",
                            mpic2: "newm2_lv51.png",
                            mpic3: "newm3_lv51.png"
                        },
                        11172329: {
                            lv: 52,
                            ywzr: 6,
                            dmtx: 30,
                            jgyc: "1",
                            ryzl: 1,
                            pic: "newlv52.gif",
                            mpic1: "newm1_lv52.png",
                            mpic2: "newm2_lv52.png",
                            mpic3: "newm3_lv52.png"
                        },
                        12781340: {
                            lv: 53,
                            ywzr: 6,
                            dmtx: 30,
                            jgyc: "1",
                            ryzl: 1,
                            pic: "newlv53.gif",
                            mpic1: "newm1_lv53.png",
                            mpic2: "newm2_lv53.png",
                            mpic3: "newm3_lv53.png"
                        },
                        14587015: {
                            lv: 54,
                            ywzr: 6,
                            dmtx: 30,
                            jgyc: "1",
                            ryzl: 1,
                            pic: "newlv54.gif",
                            mpic1: "newm1_lv54.png",
                            mpic2: "newm2_lv54.png",
                            mpic3: "newm3_lv54.png"
                        },
                        16606020: {
                            lv: 55,
                            ywzr: 6,
                            dmtx: 30,
                            jgyc: "1",
                            ryzl: 1,
                            pic: "newlv55.gif",
                            mpic1: "newm1_lv55.png",
                            mpic2: "newm2_lv55.png",
                            mpic3: "newm3_lv55.png"
                        },
                        18855021: {
                            lv: 56,
                            ywzr: 6,
                            dmtx: 30,
                            jgyc: "1",
                            ryzl: 1,
                            pic: "newlv56.gif",
                            mpic1: "newm1_lv56.png",
                            mpic2: "newm2_lv56.png",
                            mpic3: "newm3_lv56.png"
                        },
                        21350684: {
                            lv: 57,
                            ywzr: 6,
                            dmtx: 30,
                            jgyc: "1",
                            ryzl: 1,
                            pic: "newlv57.gif",
                            mpic1: "newm1_lv57.png",
                            mpic2: "newm2_lv57.png",
                            mpic3: "newm3_lv57.png"
                        },
                        24109675: {
                            lv: 58,
                            ywzr: 6,
                            dmtx: 30,
                            jgyc: "1",
                            ryzl: 1,
                            pic: "newlv58.gif",
                            mpic1: "newm1_lv58.png",
                            mpic2: "newm2_lv58.png",
                            mpic3: "newm3_lv58.png"
                        },
                        27148660: {
                            lv: 59,
                            ywzr: 6,
                            dmtx: 30,
                            jgyc: "1",
                            ryzl: 1,
                            pic: "newlv59.gif",
                            mpic1: "newm1_lv59.png",
                            mpic2: "newm2_lv59.png",
                            mpic3: "newm3_lv59.png"
                        },
                        30477645: {
                            lv: 60,
                            ywzr: 6,
                            dmtx: 30,
                            jgyc: "1",
                            ryzl: 1,
                            pic: "newlv60.gif",
                            mpic1: "newm1_lv60.png",
                            mpic2: "newm2_lv60.png",
                            mpic3: "newm3_lv60.png"
                        },
                        34116628: {
                            lv: 61,
                            ywzr: 6,
                            dmtx: 30,
                            jgyc: "1",
                            ryzl: 1,
                            pic: "newlv61.gif",
                            mpic1: "newm1_lv61.png",
                            mpic2: "newm2_lv61.png",
                            mpic3: "newm3_lv61.png"
                        }
                    }
                },
                show: function () {
                    var a = o
                        , b = a.doms.loginEle
                        , c = b.find(".l-menu")
                        , d = a.doms.loginBox.find(".l-txt")
                        , e = 0;
                    c.stop(!0, !0).animate({}, 50, function () {
                        c.show().removeClass("out"),
                            b.addClass("open")
                    }),
                        e = 15 + d.outerWidth() + 6,
                        a.doms.lmsjtop.css({
                            right: e
                        })
                },
                hide: function () {
                    var a = o
                        , b = a.doms.loginEle
                        , c = b.find(".l-menu");
                    c.stop(!0, !0).fadeOut(),
                        c.addClass("out"),
                        b.removeClass("open")
                },
                getRoomFlashData: function () {
                    var b = o
                        , c = this
                        , d = b.doms
                        , e = k.check();
                    e ? c.roomHeaderRender() : ("1" == d.body.data("diy") ? d.chatTopAd.css({
                        top: "0px"
                    }) : d.chatTopAd.css({
                        top: "105px"
                    }),
                        a('[data-login-content="no"]').removeClass("hide"),
                        a(document).trigger("scroll"))
                },
                reqTaskData: function () {
                    var b = this
                        , c = function (a) {
                            0 == a.error && a.msg && b.resTaskInfoView(a.msg)
                        }
                        ;
                    a.ajax("/lapi/member/api/getTask", {
                        type: "get",
                        dataType: "json",
                        success: a.proxy(c, b)
                    })
                },
                resTaskInfoView: function (a) {
                    var b = o
                        , c = this
                        , d = b.doms;
                    if ("undefined" != typeof a.image && "" != a.image || "undefined" != typeof a.link && "" != a.link || "undefined" != typeof a.name && "" != a.name || "undefined" != typeof a.comment && "" != a.comment) {
                        var e = d.loginBox.find(".task-a")
                            , f = d.loginBox.find(".task-text")
                            , h = d.loginBox.find(".task-img")
                            , i = f.find(".title")
                            , j = f.find(".comment")
                            , k = (g.get("sys.res_url"),
                            g.get("sys.upload_url"))
                            , l = a.image ? k + a.image : ""
                            , m = a.link ? a.link : ""
                            , n = a.name ? a.name : ""
                            , p = a.comment ? a.comment : ""
                            , q = c.curStrByLen(p, 69);
                        h.css({
                            background: "none"
                        }),
                            h.html('<img src="' + l + '"/>'),
                            "" != m ? e.attr({
                                href: m,
                                target: "_blank"
                            }) : e.removeAttr("href"),
                            i.html(n).attr({
                                title: n
                            }),
                            j.html(q).attr({
                                title: p
                            })
                    } else {
                        var r = d.loginBox.find(".l-menu")
                            , s = r.find(".task");
                        s.hide()
                    }
                },
                curStrByLen: function (a, b) {
                    for (var c, d = 0, e = a.length, f = new String, g = 0; e > g; g++)
                        if (c = a.charAt(g),
                                d++,
                            escape(c).length > 4 && d++,
                                f = f.concat(c),
                            d >= b)
                            return f = f.concat("...");
                    return b > d ? a : void 0
                },
                getNoRoomHttpData: function () {
                    var b = this
                        , c = function (a) {
                            0 == a.error && a.msg && b.noRoomHeaderRender(a.msg)
                        }
                        ;
                    a.ajax("/lapi/member/api/getInfo", {
                        type: "get",
                        dataType: "json",
                        success: a.proxy(c, b)
                    })
                },
                noRoomHeaderRender: function (a) {
                    var b = o
                        , c = this
                        , d = b.doms
                        , e = ""
                        , f = d.loginEle;
                    f.find(".l-menu");
                    e = a.gold / 100 + "",
                        d.silverBox.html(a.silver),
                        d.goldBox.html(e),
                        c.identify(a),
                        c.renderExp(a),
                    a.info && a.info.orm && c.renderLiveSet(a.info.orm)
                },
                renderLiveSet: function (a) {
                    var b, c = o, d = c.doms.loginBox.find(".live-set").find("p"), e = c.doms.loginBox.find(".live-set-a"), f = c.doms.loginBox.find(".live-hot");
                    "undefined" != typeof a ? "1" == a ? (d.html("直播设置"),
                        f.addClass("hide")) : (d.html("我要直播"),
                        e.attr({
                            href: "/client?platform=1"
                        }),
                        f.removeClass("hide")) : (b = g.get("sys.own_room"),
                        0 == b ? (d.html("我要直播"),
                            e.attr({
                                href: "/client?platform=1"
                            }),
                            f.removeClass("hide")) : (d.html("直播设置"),
                            f.addClass("hide")))
                },
                getExpInfo: function (b) {
                    var c = this
                        , d = {}
                        , e = c.levelExp.exp_level;
                    return a.each(e, function (a, c) {
                        return c.score = parseInt(a),
                            d.next = c,
                            b < parseInt(a) ? !1 : void (d.current = c)
                    }),
                        d
                },
                processIdenifyData: function (a) {
                    var b = o
                        , c = this
                        , d = (b.doms,
                    {});
                    c.umidfy = a.its ? a.its : c.umidfy,
                        c.emidfy = a.es ? a.es : c.emidfy,
                        c.mbidfy = a.ps ? a.ps : c.mbidfy,
                        d.info = {
                            its: c.umidfy,
                            ems: c.emidfy,
                            pos: c.mbidfy
                        },
                        c.identify(d)
                },
                identify: function (a) {
                    var b, c = o, d = this, e = c.doms, f = a.info ? a.info : {}, g = !1, h = e.loginEle.find(".uname-aut"), i = e.loginEle.find(".mobile-aut"), j = e.loginEle.find(".email-aut"), k = {
                        its: {
                            ele: h,
                            "false": "实名认证",
                            href: "/member/cp/changeIdent",
                            "true": "已认证"
                        },
                        pos: {
                            ele: i,
                            "false": "绑定手机",
                            href: "/member/cp/cpBindPhone",
                            "true": "已绑定手机"
                        },
                        ems: {
                            ele: j,
                            "false": "绑定邮箱",
                            href: "/member/cp/changeEmail",
                            "true": "已绑定邮箱"
                        }
                    };
                    for (var l in f)
                        "ems" == l && (g = "1" == f[l],
                            b = k[l],
                            d.identifySingle(b.ele, g, b[g], b.href)),
                        "its" == l && (g = "2" == f[l],
                            b = k[l],
                            d.identifySingle(b.ele, g, b[g], b.href)),
                        "pos" == l && (g = "1" == f[l],
                            b = k[l],
                            d.identifySingle(b.ele, g, b[g], b.href))
                },
                identifySingle: function (a, b, c, d) {
                    b ? a.find("i").addClass("high") : (a.find("i").removeClass("high"),
                        a.attr({
                            href: d,
                            target: "_blank"
                        })),
                        a.attr("title", c)
                },
                renderExp: function (a) {
                    var b, c, d = o, e = this, f = d.doms;
                    e.userExp = a.exp,
                        e.userTotleExp = parseFloat(a.exp) / 100,
                        e.exp_json = e.getExpInfo(parseInt(e.userTotleExp, 10)),
                        e.currentLevel = e.exp_json.current.lv,
                        b = e.currentLevel + 1,
                        e.nextUpExp = e.exp_json.next.score,
                        e.updateProgress(),
                        c = g.get("sys.avatar_url"),
                        f.headerImg.attr("src", c + "upload/" + a.info.icon + "_middle.jpg"),
                        f.leaveImg.attr("src", e.returnUlevelIcon(e.currentLevel, !1)),
                        f.leaveImg.attr("title", "用户等级：" + (e.currentLevel < d.config.highLevel + 1 ? e.currentLevel : d.config.highLevel)),
                        b >= d.config.highLevel ? f.leaveNextImg.hide() : (f.leaveNextImg.attr("src", e.returnUlevelIcon(b, !0)),
                            f.leaveNextImg.attr("title", "用户等级：" + (b < d.config.highLevel + 1 ? b : d.config.highLevel))),
                        e.unlockeSkill()
                },
                returnUlevelIcon: function (a, b) {
                    var c, d = o;
                    d.doms;
                    return c = 0 == b ? g.get("sys.web_url") + "/app/douyu/res/page/room-normal/level/LV" + (a < d.config.highLevel + 1 ? a : d.config.highLevel) + (a >= 40 ? ".gif" : ".png") + "?20160519" : g.get("sys.web_url") + "/app/douyu/res/page/room-normal/level/LV" + (a < d.config.highLevel + 1 ? a : d.config.highLevel) + (a >= 40 ? "-next.gif" : "-next.png") + "?20160519"
                },
                updateProgress: function () {
                    var a, b = o, c = this, d = b.doms, e = c.exp_json.current.score, f = (c.userTotleExp - e) / (c.nextUpExp - e) * 100;
                    f += "";
                    var g = f.indexOf(".");
                    if (a = g > -1 ? "0" == f.substring(g + 1, g + 2) ? f.substr(0, g) : f.substr(0, g + 2) : f,
                        c.userTotleExp < c.nextUpExp) {
                        d.curExpBox.css({
                            width: a + "%"
                        }),
                            d.curExpText.text(a + "%");
                        var h = (c.nextUpExp - c.userTotleExp).toFixed(1).split(".");
                        0 === parseInt(h[1], 10) && (h = [h[0]]),
                            d.curExpBoxNum.html(h.join("."))
                    } else
                        d.curExpBox.css({
                            width: "100%"
                        }),
                            d.curExpText.text("100%");
                    return c.userTotleExp >= 34116628 ? void d.curExpBoxNum.parent().html("您已经达到最高等级") : void 0
                },
                unlockeSkill: function () {
                    for (var b = o, c = this, d = b.doms, e = d.skillIcon, f = 0, g = e.length; g > f; f++)
                        !function (b) {
                            var d = a(e[b]);
                            c.unlockeSkillList(d, b)
                        }(f)
                },
                unlockeSkillList: function (b, c) {
                    for (var d = o, e = this, f = (d.doms,
                        b.find("[data-unlocak-list] li")), g = b.find(".locked"), h = 0, i = 0, j = 0, k = 0, l = f.length, m = 0; l > m; m++) {
                        var n = a(f[m])
                            , p = n.attr("data-unlocak-level");
                        if (parseInt(p) <= parseInt(e.currentLevel) && (h++,
                                n.addClass("unlocked-l"),
                                f.eq(m).removeClass("hide")),
                            h && f.eq(m + 1).length) {
                            f.eq(m + 1).removeClass("hide");
                            var q = f.eq(m + 1).attr("data-unlocak-level");
                            if (q > e.currentLevel)
                                break
                        }
                    }
                    0 === h ? f.eq(0).removeClass("hide") : g.html("已解锁" + h + "/" + l),
                        h ? b.addClass("skill-0" + (c + 1)) : b.find(".skill-em").addClass("hide");
                    for (var m = 0; l > m; m++) {
                        var n = a(f[m])
                            , p = n.attr("data-unlocak-level");
                        if (parseInt(e.currentLevel) >= parseInt(p))
                            i = parseInt(p),
                                j = parseInt(e.currentLevel);
                        else if (parseInt(e.currentLevel) >= i && parseInt(e.currentLevel) < parseInt(p)) {
                            j = parseInt(p);
                            break
                        }
                    }
                    parseInt(e.currentLevel) >= i && parseInt(e.currentLevel) < j ? (k = i,
                        b.find(".skill-em").attr("data-min", k).html(k),
                        0 == k ? b.find(".skill-em").addClass("hide") : b.find(".skill-em").removeClass("hide")) : parseInt(e.currentLevel) <= j && (k = i,
                        b.find(".skill-em").attr("data-min", k).html(k).removeClass("hide"))
                },
                ExpPopGX: function (b) {
                    var c, d, e, f = o, g = f.doms, h = g.curExpText.offset();
                    c = a('<div class="exp-pop-gx">经验值 +' + b + "</div>"),
                        a("body").append(c),
                        d = h.top + g.curExpText.height() - c.height(),
                        e = h.top - c.height(),
                        c.css({
                            top: d,
                            left: h.left - c.outerWidth(!0),
                            marginLeft: "112px"
                        }).animate({
                            top: e
                        }, 1e3).fadeOut("slow", function () {
                            a(this).remove()
                        })
                },
                roomHeaderRender: function () {
                    var b = o
                        , d = this
                        , e = b.doms;
                    e.userName.html($SYS.nickname),
                        e.userName.attr("title", $SYS.nickname),
                        d.getFlashData(),
                        c.trigger("mod.room.diy.layout"),
                        e.chatTopAd.css({
                            top: 0
                        }),
                        a('[data-login-content="no"]').addClass("hide")
                },
                getFlashData: function () {
                    var a = o
                        , b = this;
                    a.doms;
                    c.on("mod.login.userinfo", function (a) {
                        b.renderUserInfo(a),
                            b.renderLiveSet()
                    }),
                        c.on("mod.header.identify", function (a) {
                            b.processIdenifyData(a)
                        })
                },
                renderUserInfo: function (a) {
                    var b = o
                        , d = this
                        , e = b.doms
                        , f = l.decode(a);
                    d.silver = l.get(f, "silver");
                    var g = l.get(f, "gold") / 100 + "";
                    g.indexOf(".") > -1 && (g = g.substring(0, g.indexOf(".") + 3)),
                        d.silver = parseFloat(d.silver),
                        d.gold = parseFloat(g),
                        e.silverBox.html(d.silver),
                        e.goldBox.html(d.gold),
                        d.exprienceUpdate(a),
                        c.trigger("mod.userinfo.userinfoready", {
                            msg: "用户信息初始化完成",
                            silver: d.silver,
                            gold: d.gold
                        })
                },
                exprienceUpdate: function (a) {
                    var b, d = o, e = this, f = d.doms, g = l.decode(a);
                    e.userId = l.get(g, "uid"),
                        e.diffExp = parseFloat(l.get(g, "diff")) / 100,
                        e.userTotleExp = parseFloat(l.get(g, "exp")) / 100,
                        e.exp_json = e.getExpInfo(parseInt(e.userTotleExp, 10)),
                        e.currentLevel = parseInt(l.get(g, "level")),
                        b = e.currentLevel + 1,
                        e.nextUpExp = e.exp_json.next.score,
                        e.updateProgress(),
                        e.diffExp,
                        f.headerImg.attr("src", c.fire("douyu.avatar.get", $SYS.uid, "middle")),
                        f.userName.html($SYS.nickname),
                        f.userName.attr("title", $SYS.nickname),
                        f.leaveImg.attr("src", e.returnUlevelIcon(e.currentLevel, !1)),
                        f.leaveImg.attr("title", "用户等级：" + (e.currentLevel < d.config.highLevel + 1 ? e.currentLevel : d.config.highLevel)),
                        b >= d.config.highLevel ? f.leaveNextImg.hide() : (f.leaveNextImg.attr("src", e.returnUlevelIcon(b, !0)),
                            f.leaveNextImg.attr("title", "用户等级：" + (b < d.config.highLevel + 1 ? b : d.config.highLevel))),
                        e.unlockeSkill(),
                        e.userId ? $SYS.uid == e.userId && c.trigger("mod.chatrank.cqrankupdate", e.currentLevel) : c.trigger("mod.chatrank.cqrankupdate", e.currentLevel)
                }
            },
            n = b({
                init: function (b) {
                    this.config = a.extend(!0, {}, {
                        target: "#header",
                        onLogin: function () {
                        },
                        onReg: function () {
                        },
                        onExit: function () {
                        },
                        highLevel: 60,
                        isHasGetHttpData: !1
                    }, b),
                        j.check(),
                        this.getDoms(),
                        this.render(),
                        this.bindEvt()
                },
                getDoms: function () {
                    var b = a('[data-login-content="yes"]');
                    this.config.$el = a(this.config.target),
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
                            leaveNextImg: b.find('[data-login-user="level-next-img"]'),
                            skillIcon: b.find("[data-skill-icon]"),
                            chargeBtn: b.find(".getYc"),
                            chatTopAd: a(".chat-top-ad"),
                            historyEle: this.config.$el.find(".head-oth .o-history"),
                            follow: this.config.$el.find(".head-oth .o-follow"),
                            unlogin: this.config.$el.find(".head-oth .o-unlogin"),
                            loginEle: this.config.$el.find(".head-oth .o-login"),
                            assort: this.config.$el.find(".head-nav .assort"),
                            search: this.config.$el.find(".head-oth .o-search"),
                            download: this.config.$el.find(".head-oth .o-download"),
                            body: a("body"),
                            lmsjtop: b.find(".lmsj-top")
                        }
                },
                render: function () {
                    this.doms;
                    o = this,
                    "undefined" != typeof $ROOM && u.getRoomFlashData()
                },
                login: function () {
                    var a = this.doms
                        , b = g.get("sys.uid")
                        , d = g.get("sys.nickname")
                        , e = (g.get("sys.password"),
                        g.get("sys.own_room"));
                    d && b && (a.loginEle.find(".l-pic").html('<img src="' + $SYS.res_url + 'douyu/images/defaultAvatar.png?20160310"/>'),
                        c.fire("douyu.avatar.get", b, "middle", function (b) {
                            a.loginEle.find(".l-pic img").attr("src", b)
                        }),
                        a.loginEle.find(".l-txt").text(d),
                        a.loginEle.find('[data-login-user="user-name"]').text(d),
                        a.historyEle.removeClass("hide"),
                        a.follow.removeClass("hide"),
                        a.unlogin.addClass("hide"),
                        a.loginEle.removeClass("hide"),
                    0 == e && a.loginEle.find(".l-menu ul li").eq(4).remove(),
                        t.reqLetterDataFirstRandom())
                },
                exit: function () {
                    a.dialog.confirm("确认退出吗？", this.config.onExit)
                },
                bindEvt: function () {
                    var b = this
                        , d = this.doms;
                    p._evt_menu_toggle(d.assort, d.download),
                        d.search.find("input").on("focus", function () {
                            q.flanch()
                        }).on("blur", function () {
                            q.narrowing()
                        }).on("keydown", function (b) {
                            if (13 === b.keyCode) {
                                var c = a(this)
                                    , d = c.val();
                                q.search(d, function () {
                                    c.focus()
                                })
                            }
                        }),
                        d.search.on("click", ".s-ico", function () {
                            var a = d.search.find("input")
                                , b = a.val();
                            return q.search(b, function () {
                                a.focus()
                            }),
                                !1
                        }),
                        d.historyEle.on("mouseenter", function (b) {
                            var c = a(this)
                                , d = c.data("stop")
                                , e = c.data("timer");
                            e && clearTimeout(e),
                                e = setTimeout(function () {
                                    return d ? c.data("stop", !1) : void r.preLoadHistory()
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
                                        var a = p._checkMousePointIsInArea(e, d.historyEle, d.historyEle.find(".h-pop"));
                                        return a || s.clsFollowView(),
                                            c.data("stop", !1)
                                    }
                                    r.clsHistoryView()
                                }, 100),
                                c.data("timer", g)
                        }),
                        d.historyEle.on("mouseenter", ".h-pop", function () {
                            d.historyEle.data("stop", !0),
                                setTimeout(function () {
                                    d.historyEle.data("stop", !1)
                                }, 100)
                        }).on("mouseleave", ".h-pop", function () {
                            r.clsHistoryView()
                        }),
                        d.follow.on("mouseenter", function (b) {
                            var c = a(this)
                                , d = c.data("stop")
                                , e = c.data("timer");
                            e && clearTimeout(e),
                                e = setTimeout(function () {
                                    return d ? c.data("stop", !1) : void s.preLoadFollow()
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
                                        var a = p._checkMousePointIsInArea(e, d.follow, d.follow.find(".f-pop"));
                                        return a || s.clsFollowView(),
                                            c.data("stop", !1)
                                    }
                                    s.clsFollowView()
                                }, 100),
                                c.data("timer", g)
                        }),
                        d.follow.on("mouseenter", ".f-pop", function () {
                            d.follow.data("stop", !0),
                                setTimeout(function () {
                                    d.follow.data("stop", !1)
                                }, 100)
                        }),
                        d.loginEle.on("mouseenter", function (c) {
                            var d = a(this)
                                , e = d.data("stop")
                                , f = d.data("timer");
                            (new Date).getTime();
                            f && clearTimeout(f),
                                f = setTimeout(function () {
                                    return e ? d.data("stop", !1) : (0 == b.config.isHasGetHttpData && ("undefined" == typeof $ROOM && u.getNoRoomHttpData(),
                                        u.reqTaskData(),
                                        b.config.isHasGetHttpData = !0),
                                        void u.show())
                                }, 100),
                                d.data("timer", f)
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
                                        var a = p._checkMousePointIsInArea(e, d.loginEle, d.loginEle.find(".l-menu"));
                                        return a || s.clsFollowView(),
                                            c.data("stop", !1)
                                    }
                                    u.hide()
                                }, 100),
                                c.data("timer", g)
                        }),
                        d.loginEle.on("mouseenter", ".l-menu", function () {
                            d.loginEle.data("stop", !0),
                                setTimeout(function () {
                                    d.loginEle.data("stop", !1)
                                }, 100)
                        }).on("mouseleave", ".l-menu", function () {
                            u.hide()
                        }),
                        d.skillIcon.on("mouseenter", function () {
                            var b = a(this).find(".sl-item-hover");
                            b.removeClass("hide")
                        }),
                        d.skillIcon.on("mouseleave", function () {
                            var b = a(this).find(".sl-item-hover");
                            b.addClass("hide")
                        }),
                        d.expBarBtn.on("mouseenter", function () {
                            d.expBarTip.removeClass("hide")
                        }),
                        d.expBarBtn.on("mouseleave", function () {
                            d.expBarTip.addClass("hide")
                        }),
                        d.chargeBtn.on("mousedown", function () {
                            try {
                                DYS.storage.save("_dypay_fp", 2)
                            } catch (a) {
                            }
                        }),
                        c.on("mod.userinfo.change", function (a) {
                            if (a.current) {
                                var b = a.current;
                                void 0 !== b.silver && (u.silver = parseInt(b.silver),
                                    d.silverBox.html(u.silver)),
                                void 0 !== b.gold && (u.gold = b.gold,
                                    d.goldBox.html(u.gold))
                            }
                            if (a.change) {
                                var b = a.change;
                                if ("yuwan" == b.type && parseInt(b.silver) == u.silver)
                                    return;
                                b.exp && (u.expUpN = b.exp,
                                    u.userTotleExp += parseFloat(b.exp)),
                                b.silver && (b.silver ? b.silver : 0,
                                    u.silver = parseInt(u.silver) + parseInt(b.silver),
                                    d.silverBox.html(u.silver)),
                                b.gold && (b.gold ? b.gold : 0,
                                    u.gold += parseInt(b.gold),
                                    d.goldBox.html(u.gold))
                            }
                        }),
                        m.reg("room_data_ycchange", function (a) {
                            var b = l.decode(a)
                                , c = l.get(b, "b") / 100 + "";
                            c.indexOf(".") > -1 && (c = c.substring(0, c.indexOf(".") + 3)),
                                u.gold = parseFloat(c),
                                d.goldBox.html(u.gold)
                        }),
                        m.reg("room_data_expchange", function (a) {
                            l.decode(a).too();
                            u.exprienceUpdate(a)
                        }),
                        d.loginEle.find(".logout").last().click(function () {
                            return b.exit(),
                                !1
                        }),
                        d.unlogin.on("click", ".u-login", function () {
                            return a.isFunction(b.config.onLogin) ? (b.config.onLogin(),
                                !1) : void 0
                        }).on("click", ".u-reg", function () {
                            return a.isFunction(b.config.onReg) ? (b.config.onReg(),
                                !1) : void 0
                        })
                }
            });
        var v = {
            init: function (b) {
                return h.aop("clean", "header-assort", function (b) {
                    if (b && 1 == b.id) {
                        var c = a(b.el);
                        c[c.html() ? "removeClass" : "addClass"]("hide"),
                            a(document).trigger("scroll")
                    }
                }),
                    o ? void 0 : o = new n(b)
            }
        };
        return v
    }),
    define("douyu/com/verifyPhone", ["jquery", "shark/util/cookie/1.0", "shark/class"], function (a, b, c) {
        var d = c({
            init: function () {
                this.$el = '<div class="solephnoemum" > <div class="solephnoemum-cont"><p class="solephnoemum-title">温馨提示</p> <p class="solephnoemum-body">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;近期，因系统升级和改造，需要再次确认您的手机号码，手机号码是您唯一性的身份标识，为确保您可以正常享受斗鱼直播的乐趣，请及时前往个人中心进行验证。</p></div><div class="aui_buttons"><button  data-type="skip">立即验证</button>&nbsp;&nbsp;&nbsp;&nbsp;<button  data-type="close">稍后确认</button></div></div>'
            },
            check: function () {
                b.get("nickname") && !b.get("verifyPhoneNum") && b.get("phone_need_confirm") && (this.render(),
                    this.bindEvent())
            },
            render: function () {
                a.dialog({
                    content: this.$el,
                    lock: !0,
                    id: "checkNum",
                    close: function () {
                        b.set("verifyPhoneNum", "false", 86400)
                    }
                })
            },
            bindEvent: function () {
                a(".aui_buttons>button[data-type='close']").on("click", function () {
                    a.dialog.list.checkNum.close()
                }),
                    a(".aui_buttons>button[data-type='skip']").on("click", function () {
                        b.set("verifyPhoneNum", "false", 86400),
                            window.location.href = "/member/cp/confirmPhone"
                    })
            }
        })
            , e = new d;
        return e
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
    define("douyu/com/left-dp", ["jquery"], function (a) {
        function b() {
            var a = DYS.point.page()
                , b = a.split(".")
                , c = b.length ? b[0] : "";
            return c
        }

        var c = [{
            target: "#left .left-btn",
            description: "公共模块-左侧导航-导航开关",
            events: "mousedown",
            config: {
                point_id: b() + ".-3.1.0"
            }
        }, {
            target: "#left .channel-cate li:eq(0)",
            description: "公共模块-左侧导航-全部直播按钮",
            events: "mousedown",
            config: {
                point_id: b() + ".-3.2.0"
            }
        }, {
            target: "#left .channel-cate li:eq(1)",
            description: "公共模块-左侧导航-全部分类按钮",
            events: "mousedown",
            config: {
                point_id: b() + ".-3.3.0"
            }
        }, {
            target: "#left .channel-cate li:eq(2)",
            description: "公共模块-左侧导航-我的关注按钮",
            events: "mousedown",
            config: {
                point_id: b() + ".-3.4.0"
            }
        }, {
            target: "#left .channel-cate li:eq(3)",
            description: "公共模块-左侧导航-娱乐中心按钮",
            events: "mousedown",
            config: {
                point_id: b() + ".-3.5.0"
            }
        }, {
            target: "#left .r-tit li:eq(0)",
            description: "公共模块-左侧导航-栏目按钮",
            events: "mousedown",
            config: {
                point_id: b() + ".-3.6.0",
                ext: {
                    handle: function (a) {
                        this.roomId = a.data("id"),
                            this.status = a.data("status"),
                            this.position = a.index()
                    }
                }
            }
        }, {
            target: "#left .r-tit li:eq(1)",
            description: "公共模块-左侧导航-推荐按钮",
            events: "mousedown",
            config: {
                point_id: b() + ".-3.10.0"
            }
        }, {
            target: "#left .recommendHos li",
            description: "公共模块-左侧导航-栏目热门",
            events: "mousedown",
            config: {
                point_id: b() + ".-3.7.0"
            }
        }, {
            target: "#left .column-cont dt a",
            description: "公共模块-左侧导航-栏目一级标签",
            events: "mousedown",
            config: {
                point_id: b() + ".-3.8.0",
                ext: {
                    handle: function (b) {
                        this.tag = a.trim(b.text())
                    }
                }
            }
        }, {
            target: "#left .column-cont dd a",
            description: "公共模块-左侧导航-栏目二级标签",
            events: "mousedown",
            config: {
                point_id: b() + ".-3.9.0",
                ext: {
                    handle: function (b) {
                        var c = b.closest("[data-index]").prev()
                            , d = c.text();
                        this.ptag = a.trim(d),
                            this.tag = a.trim(b.text())
                    }
                }
            }
        }, {
            target: "#left .recom-cont  a",
            description: "公共模块-左侧导航-推荐一级标签",
            events: "mousedown",
            config: {
                point_id: b() + ".-3.11.0",
                ext: {
                    handle: function (b) {
                        this.tag = a.trim(b.text())
                    }
                }
            }
        }, {
            target: "#left .btn-live  a",
            description: "公共模块-左侧导航-申请直播按钮",
            events: "mousedown",
            config: {
                point_id: b() + ".-3.12.0"
            }
        }, {
            target: "#left .f-other li:eq(0)",
            description: "公共模块-左侧导航-直播指导按钮",
            events: "mousedown",
            config: {
                point_id: b() + ".-3.13.0"
            }
        }, {
            target: "#left .f-other li:eq(1)",
            description: "公共模块-左侧导航-客服支持按钮",
            events: "mousedown",
            config: {
                point_id: b() + ".-3.14.0"
            }
        }, {
            target: "#left .f-other li:eq(2)",
            description: "公共模块-左侧导航-房间举报按钮",
            events: "mousedown",
            config: {
                point_id: b() + ".-3.15.0"
            }
        }];
        a.each(c, function (b, c) {
            a(document).on(c.events, c.target, function (b) {
                var d = a.extend(!0, {}, c)
                    , e = d.config ? d.config.ext : null
                    , f = a(this);
                e && e.handle && (e.handle(f),
                    delete e.handle),
                    DYS.submit(d.config)
            })
        })
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
                    skip_invisible: !0,
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
    define("douyu/com/insight", ["jquery"], function (a) {
        return function (a, b, c, d) {
            var e, f = a(b), g = 0, h = 0, i = 0, j = 0, k = null;
            a.fn.insight = function (p) {
                function q() {
                    var c = 0;
                    e = a(s.container),
                        s.container === d || s.container === b ? (e = a(b),
                            g = 0,
                            h = 0) : (g = e.offset().top,
                            h = e.offset().left),
                        i = e.width(),
                        j = e.height(),
                        r.each(function () {
                            var b = a(this);
                            if (!s.skip_invisible || b.is(":visible"))
                                if (n(this, s) || o(this, s))
                                    ;
                                else if (l(this, s) || m(this, s)) {
                                    if (++c > s.failure_limit)
                                        return !1
                                } else
                                    b.trigger("insight"),
                                        c = 0
                        })
                }

                var r = this
                    , s = {
                    threshold: 0,
                    event: "scroll",
                    container: b,
                    data_attribute: "original",
                    skip_invisible: !0,
                    appear: null,
                    load: null
                };
                return p && (d !== p.failurelimit && (p.failure_limit = p.failurelimit,
                    delete p.failurelimit),
                d !== p.effectspeed && (p.effect_speed = p.effectspeed,
                    delete p.effectspeed),
                    a.extend(s, p)),
                    e = s.container === d || s.container === b ? f : a(s.container),
                0 === s.event.indexOf("scroll") && e.bind(s.event, function () {
                    return q()
                }),
                    this.each(function () {
                        var b = this
                            , c = a(b);
                        c.one("insight", function () {
                            if (!this.loaded) {
                                if (s.appear) {
                                    var a = r.length;
                                    s.appear.call(b, a, s)
                                }
                                this.loaded = !0
                            }
                        }),
                        0 !== s.event.indexOf("scroll") && c.bind(s.event, function () {
                            b.loaded || c.trigger("insight")
                        })
                    }),
                    f.bind("resize", function () {
                        k && clearTimeout(k),
                            k = setTimeout(function () {
                                q(),
                                    k = null
                            }, 50)
                    }),
                    a(c).on("scroll click", function () {
                        k && clearTimeout(k),
                            k = setTimeout(function () {
                                q(),
                                    k = null
                            }, 50)
                    }),
                /(?:iphone|ipod|ipad).*os 5/gi.test(navigator.appVersion) && f.bind("pageshow", function (b) {
                    b.originalEvent && b.originalEvent.persisted && r.each(function () {
                        a(this).trigger("insight")
                    })
                }),
                    a(c).ready(function () {
                        q()
                    }),
                    this
            }
            ;
            var l = function (c, e) {
                    var h, i = a(c);
                    return h = e.container === d || e.container === b ? (b.innerHeight ? b.innerHeight : f.height()) + f.scrollTop() : g + j,
                    h <= i.offset().top - e.threshold
                }
                , m = function (c, e) {
                    var g, j = a(c);
                    return g = e.container === d || e.container === b ? f.width() + f.scrollLeft() : h + i,
                    g <= j.offset().left - e.threshold
                }
                , n = function (c, e) {
                    var h, i = a(c);
                    return h = e.container === d || e.container === b ? f.scrollTop() : g,
                    h >= i.offset().top + e.threshold + i.height()
                }
                , o = function (c, e) {
                    var g, i = a(c);
                    return g = e.container === d || e.container === b ? f.scrollLeft() : h,
                    g >= i.offset().left + e.threshold + i.width()
                }
                , p = function (a, b) {
                    return !(m(a, b) || o(a, b) || l(a, b) || n(a, b))
                }
                ;
            a.extend(a.expr[":"], {
                "below-the-fold": function (a) {
                    return l(a, {
                        threshold: 0
                    })
                },
                "above-the-top": function (a) {
                    return !l(a, {
                        threshold: 0
                    })
                },
                "right-of-screen": function (a) {
                    return m(a, {
                        threshold: 0
                    })
                },
                "left-of-screen": function (a) {
                    return !m(a, {
                        threshold: 0
                    })
                },
                "in-viewport": function (a) {
                    return p(a, {
                        threshold: 0
                    })
                },
                "above-the-fold": function (a) {
                    return !l(a, {
                        threshold: 0
                    })
                },
                "right-of-fold": function (a) {
                    return m(a, {
                        threshold: 0
                    })
                },
                "left-of-fold": function (a) {
                    return !m(a, {
                        threshold: 0
                    })
                }
            })
        }(a, window, document),
        {
            build: function (a) {
                a = $.extend({
                    selectors: "[data-dysign]"
                }, a),
                    $(a.selectors).insight(a)
            }
        }
    }),
    define("douyu/com/user-control", ["jquery", "shark/util/lang/1.0", "shark/util/cookie/1.0", "shark/util/flash/bridge/1.0", "douyu/context", "shark/ext/swfobject"], function (a, b, c, d, e, f) {
        var g = {
            client_id: window.client_id || 1,
            hmac_flash_ready: !1,
            salt: null
        }
            , h = {};
        return h.control = {
            _on_auto_login: function () {
            },
            init: function () {
                h.control.auto()
            },
            check: function (a) {
                var b = !!c.get("nickname");
                return a !== !0 || b || c.remove(["auth", "auth_wl", "uid", "nickname", "username", "own_room", "groupid", "notification", "phonestatus"]),
                    !!c.get("uid")
            },
            exit: function (b) {
                if (c.get("stk")) {
                    var d = navigator.userAgent;
                    -1 != d.indexOf("MSIE") || -1 != d.indexOf("rv:11") ? a.post("/member/logout/ajax", function () {
                        location.href = passport_host + "sso/logout?client_id=" + g.client_id
                    }, "json") : location.href = passport_host + "sso/logout?client_id=" + g.client_id
                } else
                    c.get("nickname") ? location.href = "/member/logout" : location.reload()
            },
            auto: function () {
                var a = h.control.check(!0);
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
                    h.control._on_auto_login(a)
            },
            logsalt: function (b, c, d) {
                a.post("/member/login/checkUsername", {
                    username: b
                }, function (b) {
                    b.c >= 0 && (g.salt = {
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
            h.control.API = {
                auth: function (b, c, d) {
                    c = c || a.noop,
                        d = d || a.noop,
                        a.ajax({
                            url: passport_host + "iframe/auth",
                            type: "GET",
                            data: b,
                            dataType: "jsonp",
                            jsonp: "callback",
                            callback: "json_callback",
                            success: c,
                            error: d
                        })
                },
                iframeLogin: function (b, c, d) {
                    c = c || a.noop,
                        d = d || a.noop,
                        a.ajax({
                            url: passport_host + "iframe/login",
                            type: "GET",
                            data: b,
                            dataType: "jsonp",
                            jsonp: "callback",
                            callback: "json_callback",
                            success: c,
                            error: d
                        })
                },
                login: function (b, c, d) {
                    c = c || a.noop,
                        d = d || a.noop,
                        a.ajax({
                            url: "/api/passport/login",
                            type: "GET",
                            data: b,
                            dataType: "json",
                            success: c,
                            error: d
                        })
                },
                reg: function (b, c, d) {
                    c = c || a.noop,
                        d = d || a.noop,
                        a.ajax("/member/register/ajax_new", {
                            type: "post",
                            data: b,
                            dataType: "json",
                            success: c,
                            error: d
                        })
                },
                checkUserStatus: function (b, c, d) {
                    b = b || {},
                        c = c || a.noop,
                        d = d || a.noop,
                        a.ajax({
                            url: "/member/cp/phone_anchor_status",
                            type: "GET",
                            data: b,
                            dataType: "json",
                            success: c,
                            error: d
                        })
                },
                verifyPhone: function (b, c, d) {
                    c = c || a.noop,
                        d = d || a.noop,
                        a.ajax("/curl/smscp/sendphonevoid", {
                            type: "post",
                            data: b,
                            dataType: "json",
                            success: c,
                            error: d
                        })
                },
                bindPhone: function (b, c, d) {
                    c = c || a.noop,
                        d = d || a.noop,
                        a.ajax("/curl/smscp/bindphone", {
                            type: "post",
                            data: b,
                            dataType: "json",
                            success: c,
                            error: d
                        })
                }
            },
            h.control
    }),
    define("douyu/com/user-view", ["jquery", "shark/util/lang/1.0", "shark/util/cookie/1.0", "shark/util/flash/bridge/1.0", "douyu/context", "shark/ext/swfobject", "douyu/com/vcode-user", "douyu/com/vcode9", "douyu/com/user-control"], function (a, b, c, d, e, f, g, h, i) {
        window.user_dialog && (a = window.$ || a);
        var j = {
            view: {
                el: {
                    pop: "pop",
                    shadow: "shadow",
                    logform: "logform",
                    regform: "regform",
                    phoneform: "phoneform"
                },
                type: {
                    login: "login",
                    reg: "reg",
                    phone: "phone",
                    member: "member"
                },
                currentView: null
            },
            client_id: window.client_id || 1,
            hmac_flash_ready: !1,
            salt: null
        }
            , k = {}
            , l = {};
        k.control = i,
            k.init = function () {
                k.view.init(),
                    k.control.init()
            }
            ,
            k.view = {
                init: function () {
                    var b = k.view.make()
                        , c = a("body")
                        , d = a(b.pop)
                        , e = a(b.shadow);
                    k.view.$pop = d,
                        k.view.$shadow = e,
                        k.view.$logform = k.view.$pop.find(".loginbox-login form"),
                        k.view.$regform = k.view.$pop.find(".loginbox-reg form"),
                        k.view.$phoneform = k.view.$pop.find(".loginbox-phone form"),
                        k.view.$pop.hide().removeClass("hide"),
                        k.view.$shadow.hide().removeClass("hide"),
                        c.append(k.view.$pop),
                        c.append(k.view.$shadow),
                        k.view._is_show = !1,
                        k.view._type = j.view.type.login,
                        setTimeout(function () {
                            k.view.checkStkToLogin(),
                                k.view.evt(),
                                k.bindphone.evt()
                        }, 50)
                },
                el: function (a) {
                    return a === j.view.el.pop ? k.view.$pop : a === j.view.el.shadow ? k.view.$shadow : a === j.view.el.logform ? k.view.$logform : a === j.view.el.regform ? k.view.$regform : void 0
                },
                errorTip: function (b) {
                    var c, d, e, f, g = b.type || "error", h = 1e3 * b.delay || 1500;
                    e = j.view.currentView.find(b.element).length > 0 ? j.view.currentView.find(b.element) : j.view.currentView.find('input[type="submit"]'),
                        f = e.position(),
                        c = ['<div class="myuser-error-tip">', '<i class="myuser-error-tip-arrow myuser-error-tip-arrow1"></i><i class="myuser-error-tip-arrow myuser-error-tip-arrow2"></i>', '<div class="myuser-error-tip-cont">' + (b.cont || "") + "</div>", "</div>"].join(""),
                    "info" === g && (c = ['<div class="myuser-info-tip">', '<i class="myuser-info-tip-arrow myuser-info-tip-arrow1"></i><i class="myuser-info-tip-arrow myuser-info-tip-arrow2"></i>', '<div class="myuser-info-tip-cont">' + (b.cont || "") + "</div>", "</div>"].join("")),
                        d = a(c),
                        j.view.currentView.append(d),
                        d.css({
                            top: f.top + 1.2 * e.outerHeight(!0),
                            left: f.left + (e.outerWidth(!0) - d.outerWidth(!0)) / 2
                        }),
                        setTimeout(function () {
                            d.fadeOut("fast", function () {
                                d.remove()
                            })
                        }, h)
                },
                errorPopTip: function (b) {
                    var c, d, e, f, g = 1e3 * b.delay || 1500;
                    e = j.view.currentView.find(b.element).length > 0 ? j.view.currentView.find(b.element) : j.view.currentView.find('input[type="submit"]'),
                        f = e.position(),
                        c = ['<div class="user-error-tip">', '<i class="user-error-tip-arrow user-error-tip-arrow1"></i><i class="user-error-tip-arrow user-error-tip-arrow2"></i>', '<div class="user-error-tip-cont">' + (b.cont || "") + "</div>", "</div>"].join(""),
                        d = a(c),
                        j.view.currentView.eq(0).append(d),
                        d.css({
                            top: f.top - d.outerHeight(!0) - 10,
                            left: f.left + (e.outerWidth(!0) - d.outerWidth(!0)) / 2
                        }),
                        setTimeout(function () {
                            d.fadeOut("fast", function () {
                                d.remove()
                            })
                        }, g)
                },
                showInfoTip: function (b) {
                    var c, d, e, f;
                    b.type || "error",
                    1e3 * b.delay || 1500;
                    return e = j.view.currentView.find(b.element),
                        f = e.position(),
                        c = ['<div class="myuser-info-tip">', '<i class="myuser-info-tip-arrow myuser-info-tip-arrow1"></i><i class="myuser-info-tip-arrow myuser-info-tip-arrow2"></i>', '<div class="myuser-info-tip-cont">' + (b.cont || "") + "</div>", "</div>"].join(""),
                        d = a(c),
                        j.view.currentView.append(d),
                        d.css({
                            top: f.top + 1.2 * e.outerHeight(!0),
                            left: f.left + (e.outerWidth(!0) - d.outerWidth(!0)) / 2
                        }),
                        d
                },
                hideInfoTip: function (a) {
                    try {
                        a.fadeOut("fast", function () {
                            a.remove()
                        })
                    } catch (b) {
                    }
                },
                make: function () {
                    return {
                        pop: a.trim(a("#dytemp-loginbox").html()),
                        shadow: a.trim(a("#dytemp-loginbox-shadow").html())
                    }
                },
                checkStkToLogin: function () {
                    c.get("ltkid") && c.get("nickname") && c.get("uid") && !c.get("stk") && this.show()
                },
                checkLoginnedUserStatus: function () {
                    var a = function (a) {
                            switch (a.result) {
                                case -1:
                                    k.view.show("phone", {
                                        bdTitle: "恭喜您！登录成功"
                                    });
                                    break;
                                case 1:
                                    k.view.show("member", {
                                        bdTitle: "恭喜您！登录成功"
                                    });
                                    break;
                                case 2:
                                    k.view.show("member", {
                                        bdTitle: "恭喜您！登录成功",
                                        memberUrl: "/room/my"
                                    })
                            }
                        }
                        , b = function () {
                        }
                        ;
                    k.control.API.checkUserStatus({}, a, b)
                },
                show: function (b, c, d) {
                    b = b ? b : j.view.type.login,
                        c = a.isPlainObject(c) ? c : {};
                    var e = k.view.$pop.find(".loginbox-hd-tab .t-login")
                        , f = k.view.$pop.find(".loginbox-hd-tab .t-reg")
                        , g = k.view.$pop.find(".loginbox-hd")
                        , h = k.view.$pop.find(".loginbox-bd")
                        , i = k.view.$pop.find(".loginbox-bd[data-type=login]")
                        , m = k.view.$pop.find('.loginbox-bd[data-type="reg"]');
                    return $phone = k.view.$pop.find('.loginbox-bd[data-type="phone"]').addClass("hide"),
                        $member = k.view.$pop.find('.loginbox-bd[data-type="member"]').addClass("hide"),
                        b === j.view.type.phone ? (g.addClass("hide"),
                            h.addClass("hide"),
                        c.bdTitle && $phone.find(".js-loginbox-bd-title").html(c.bdTitle),
                            $phone.removeClass("hide"),
                            j.view.currentView = $phone,
                            k.view._type = b,
                            void k.bindphone.initializeImgCapcha()) : b === j.view.type.member ? (g.addClass("hide"),
                            h.addClass("hide"),
                        c.bdTitle && $member.find(".js-loginbox-bd-title").html(c.bdTitle),
                        c.phoneNum && $member.find(".js-loginbox-bd-title").after('<p class="loginbox-bd-phonenum">手机号码：' + c.phoneNum + "</p>"),
                        c.memberUrl && $member.find(".apply-anchor").attr("href", c.memberUrl),
                            $member.removeClass("hide"),
                            j.view.currentView = $member,
                            void (k.view._type = b)) : (b === j.view.type.login ? (g.removeClass("hide"),
                            e.addClass("current"),
                            i.removeClass("hide"),
                            f.removeClass("current"),
                            m.addClass("hide"),
                            j.view.currentView = i) : (g.removeClass("hide"),
                            e.removeClass("current"),
                            i.addClass("hide"),
                            f.addClass("current"),
                            m.removeClass("hide"),
                            j.view.currentView = m),
                            void ("reg" == b ? (c.redirect && (k.view._redirect = c.redirect),
                                k.view._type = b,
                                k.view.layout(),
                                k.view.$shadow.fadeIn(),
                                k.view.$pop.fadeIn(function () {
                                    k.view._is_show = !0
                                })) : k.control.API.auth({
                                client_id: j.client_id,
                                t: (new Date).getTime()
                            }, function (e) {
                                1 == e.error ? (c.redirect && (k.view._redirect = c.redirect),
                                    k.view._type = b,
                                    k.view.layout(),
                                    l.init("init"),
                                    k.view.$shadow.fadeIn(),
                                    k.view.$pop.fadeIn(function () {
                                        k.view._is_show = !0
                                    })) : 0 == e.error && e.data.code ? k.control.API.login(e.data, function (c) {
                                    0 == c.error ? setTimeout(function () {
                                        return a.dialog.tips_black("登录成功！", 1.5),
                                            d ? void d() : void location.reload()
                                    }, 500) : (a.dialog.tips_black(c.msg, 1.5),
                                        k.view._type = b,
                                        k.view.layout(),
                                        k.view.$shadow.fadeIn(),
                                        k.view.$pop.fadeIn(function () {
                                            k.view._is_show = !0
                                        }))
                                }) : (a.dialog.tips_black(e.msg, 1.5),
                                    k.view._type = b,
                                    k.view.layout(),
                                    k.view.$shadow.fadeIn(),
                                    k.view.$pop.fadeIn(function () {
                                        k.view._is_show = !0
                                    }))
                            })))
                },
                hide: function () {
                    k.view.$pop.fadeOut(function () {
                        k.view._is_show = !1
                    }),
                        k.view.$shadow.fadeOut();
                    var a = j.view.currentView.attr("data-type");
                    "member" !== a && "phone" !== a || !k.control.check() || window.location.reload()
                },
                toggle: function () {
                    k.view._is_show ? k.view.hide() : k.view.show()
                },
                layout: function () {
                    var b, c = a("body"), d = a(window), e = c.height(), f = d.height(), g = k.view.$pop.outerHeight(!0), h = f > e ? f : e;
                    b = 100 >= f - g ? 0 : .2 * f,
                        k.view.$shadow.height(h),
                        k.view.$pop.css("top", b)
                },
                redirect: function (a) {
                    var b = k.view._redirect;
                    return b ? (k.view._redirect = void 0,
                        setTimeout(function () {
                            location.href = b
                        }, a || 50),
                        !0) : !1
                },
                submitLog: function () {
                    var b = k.view.$logform
                        , c = b.find(".btn-sub")
                        , d = b.find("[name]")
                        , e = !0
                        , f = null
                        , g = {};
                    if (!b.data("submit") && (d.each(function () {
                            return (e = k.validate.check(this)) ? void (g[this.name] = this.value) : !1
                        }),
                            e)) {
                        if (l.instance && l.instance.isFast() && !(f = l.instance.getFastResult()))
                            return void a.dialog.tips_black("验证码错误！");
                        g = a.extend({}, g, f, j.salt),
                            b.data("submit", !0),
                            c.val("提交中…"),
                            k.view.enter(g, function (a) {
                                b.data("submit", a),
                                    c.val("登录")
                            })
                    }
                },
                submitReg: function () {
                    var a = k.view.$regform
                        , b = a.find(".btn-sub")
                        , c = a.find("[name]")
                        , d = a.find("[name=nickname]")
                        , e = !0
                        , f = {};
                    if (!a.data("submit") && (c.each(function () {
                            return (e = k.validate.check(this)) ? void (f[this.name] = this.value) : !1
                        }),
                            e)) {
                        var g = m.val();
                        g && (f.ditchName = g),
                            k.validate.ckRegNicknameAsync(d.get(0), function (c) {
                                c && (a.data("submit", !0),
                                    b.val("注册中…"),
                                    k.view.reg(f, function (c) {
                                        a.data("submit", c),
                                            b.val("注册")
                                    }))
                            })
                    }
                },
                submitPhone: function () {
                    var a = k.view.$phoneform
                        , b = a.find(".js-phone-submit")
                        , c = a.find("[name]")
                        , d = !0
                        , e = {};
                    c.each(function () {
                        return (d = k.validate.check(this)) ? void (e[this.name] = this.value) : !1
                    }),
                    d && (a.data("submit", !0),
                        b.find("span").text("提交中…"),
                        k.view.bindphone(e, function (c) {
                            a.data("submit", c),
                                b.find("span").text("确认绑定")
                        }))
                },
                evt: function () {
                    var b = k.view.$pop
                        , c = k.view.$shadow
                        , d = k.view.$logform
                        , e = k.view.$regform;
                    $phoneform = k.view.$phoneform,
                        b.find(".loginbox-close").click(function (a) {
                            k.view._evt_stop(a),
                                k.view.hide()
                        }),
                        b.find(".loginbox-hd-tab .t-login").click(function (a) {
                            k.view._evt_stop(a),
                                k.view.show(j.view.type.login)
                        }),
                        b.find(".loginbox-hd-tab .t-reg").click(function (a) {
                            k.view._evt_stop(a),
                                k.view.show(j.view.type.reg)
                        }),
                        b.find(".loginbox-bd a.js-switch-reg").click(function (a) {
                            k.view._evt_stop(a),
                                k.view.show(j.view.type.reg)
                        }),
                        b.find(".loginbox-bd a.js-switch-login").click(function (a) {
                            k.view._evt_stop(a),
                                k.view.show(j.view.type.login)
                        }),
                        c.on("dblclick", function (a) {
                            k.view._evt_stop(a),
                                k.view.hide()
                        }),
                        a(window).resize(function () {
                            k.view._is_show && k.view.layout()
                        }),
                        b.on("blur", "input", function () {
                            var a = k.validate.check(this);
                            a && ("username" === this.name || "nickname" === this.name && k.validate.ckRegNicknameAsync(this))
                        });
                    var f;
                    e.find("input[name=nickname]").focusin(function () {
                        e.parent().find(".myuser-error-tip").size() > 0 || (f = k.view.showInfoTip({
                            cont: "注册后昵称不能随意更改",
                            element: this
                        }))
                    }).focusout(function () {
                        k.view.hideInfoTip(f)
                    }),
                        d.submit(function () {
                            return k.view.submitLog(),
                                !1
                        }),
                        e.submit(function () {
                            return k.view.submitReg(),
                                !1
                        }),
                        $phoneform.submit(function () {
                            return k.view.submitPhone(),
                                !1
                        })
                },
                _evt_stop: function (a) {
                    a.stopPropagation(),
                        a.preventDefault()
                },
                enter: function (a, b) {
                    k.view._enter(a, b)
                },
                _enter: function (b, d) {
                    var e = function (b) {
                        var e = b.error
                            , g = 0 === e;
                        if (0 === e) {
                            var h = function (b) {
                                    0 == b.error ? (c.set("auth_wl", j.md5_m, 2592e3),
                                        k.control._hmac(j.md5_m, j.md5_h),
                                        a.dialog.tips_black("登录成功！", 2),
                                    k.view.redirect(1e3) || setTimeout(function () {
                                        location.reload()
                                    }, 1e3),
                                        d(g)) : (a.dialog.tips_black(b.msg, 1.5),
                                        d(!1))
                                }
                                ;
                            return void k.control.API.login(b.data, h, f)
                        }
                        var i = "";
                        if (3 === e) {
                            var m = b.data;
                            i = ["<p>", '<span class="user-name" title="' + m.nick_name + '">' + m.nick_name + "</span>", "<span>" + (0 === m.expire_time ? "已被永久封禁" : "将被封禁至" + m.expire_time) + "</span>", "</p>", '<p class="reason">封禁原因：' + m.reason + m.operate_time + "</p>"].join("")
                        } else
                            i = b.msg;
                        k.view.errorPopTip({
                            cont: i
                        }),
                            d(!1),
                        l.instance && l.instance.refresh()
                    }
                        , f = function () {
                        d(!1),
                            a.dialog.tips_black("登录过程中发生错误，请稍候再试！")
                    }
                        , g = b.password;
                    g && (j.md5_m = CryptoJS.MD5(g).toString(),
                        b.password = j.md5_m,
                        j.hmac_flash_ready),
                        b.redirect_url = location.href,
                        b.t = (new Date).getTime(),
                        b.client_id = j.client_id,
                        k.control.API.iframeLogin(b, e, f)
                },
                reg: function (b, d) {
                    var e = null
                        , f = function (f) {
                        var g = f.result;
                        if (d(g),
                            0 === g) {
                            var h = CryptoJS.MD5(b.password + f.data.s).toString();
                            k.control._hmac(b.password, h),
                                c.set("auth_wl", b.password, 2592e3),
                                a.dialog.tips_black("注册成功，正在登录…", 2),
                                e.destroy(),
                                k.view.show("phone", {
                                    bdTitle: "恭喜您！注册成功"
                                })
                        } else
                            2 === g ? (a.dialog.alert("当前ip输入验证码时错误次数过多，请等待一天后在重新尝试！"),
                                e.refresh()) : (a.dialog.tips_black("注册失败：" + f.error),
                                e.refresh())
                    }
                        , g = function () {
                        d(!1),
                            k.view.errorPopTip({
                                cont: "注册过程中发生错误，请稍候再试！"
                            })
                    }
                        , i = b.password
                        , j = b.password2;
                    i && (b.password = CryptoJS.MD5(i).toString()),
                    j && (b.password2 = CryptoJS.MD5(j).toString()),
                        e = h.create({
                            lock: !0,
                            shadow: {
                                opacity: 0
                            },
                            onSelectOver: function (a) {
                                b.captcha_word = a,
                                    k.control.API.reg(b, f, g)
                            },
                            onHide: function () {
                                d(!1)
                            }
                        })
                },
                bindphone: function (a, b) {
                    var c = k.view.$phoneform.find("#js-phone-submit").parent()
                        , d = function (a) {
                            switch (a.result) {
                                case 0:
                                    var b = "恭喜你，绑定成功！";
                                    k.view.show("member", {
                                        bdTitle: b,
                                        phoneNum: a.phone
                                    });
                                    break;
                                default:
                                    k.bindphone.clearTimer(),
                                        k.bindphone.initializeImgCapcha(),
                                        k.bindphone.resetText(),
                                        k.view.errorPopTip({
                                            cont: a.error,
                                            element: c
                                        })
                            }
                        }
                        , e = function () {
                            k.bindphone.initializeImgCapcha(),
                                k.bindphone.resetText(),
                                k.view.errorPopTip({
                                    cont: "系统繁忙，请核定内容后再提交!",
                                    element: c
                                })
                        }
                        ;
                    k.control.API.bindPhone(a, d, e)
                }
            },
            k.validate = {
                check: function (b) {
                    var c = a(b)
                        , d = c.attr("name")
                        , e = a.trim(c.val());
                    if (c.attr("placeholder") || c.val(e),
                        "geetest_challenge" === d || "geetest_validate" === d || "geetest_seccode" === d)
                        return !0;
                    if ("captcha_word" === d) {
                        if (k.view._type === j.view.type.login && l.instance && l.instance.isFast())
                            return !0;
                        if (k.view._type === j.view.type.reg)
                            return !0
                    }
                    if ("" === e)
                        return k.validate._fx_err_ipt(b),
                            !1;
                    var f = !0;
                    return k.view._type === j.view.type.login ? "username" === d ? f = k.validate._ck_login_username(b) : "password" === d ? f = k.validate._ck_login_password(b) : "captcha_word" === d && (f = k.validate._ck_login_captcha(b)) : k.view._type === j.view.type.reg && ("nickname" === d ? f = k.validate._ck_reg_nickname(b) : "password" === d ? f = k.validate._ck_reg_password(b) : "password2" === d ? f = k.validate._ck_reg_password2(b) : "email" === d ? f = k.validate._ck_reg_email(b) : "protocol" === d && (f = k.validate._ck_reg_protocol(b))),
                    k.view._type === j.view.type.phone && ("bindphonenum" === d ? f = k.validate._ck_phonenum(b) : "phonenum_captcha" === d ? f = k.validate._ck_phonenum_captcha(b) : "yzphonenum" === d && (f = k.validate._ck_yzphonenum(b))),
                        f ? (k.validate._fx_rig_ipt(b),
                            !0) : !1
                },
                ckRegNicknameAsync: function (b, c) {
                    a.getJSON("/member/register/validate/nickname_new", {
                        data: encodeURIComponent(b.value)
                    }, function (d) {
                        var e = d.result
                            , f = 0 === e;
                        0 === e ? k.validate._fx_rig_ipt(b) : -2 === e ? k.validate._showerr(d.msg, b) : k.validate._showerr("用户昵称不合法或已被占用", b),
                        a.isFunction(c) && c(f)
                    })
                },
                _showerr: function (a, b) {
                    k.view.errorTip({
                        element: b,
                        cont: a,
                        delay: 2
                    }),
                        k.validate._fx_err_ipt(b)
                },
                _showinfo: function (a, b) {
                    k.view.errorTip({
                        element: b,
                        cont: a,
                        type: "info",
                        delay: 2
                    })
                },
                _fx_rig_ipt: function (b) {
                    a(b).removeClass("ipt-err")
                },
                _fx_success_ipt: function (b) {
                    var c = a(b);
                    k.view._type !== j.view.type.login && (c.hasClass("ipt-success") || (c.is(":text") || c.is(":password")) && (c.addClass("ipt-success"),
                        setTimeout(function () {
                            c.removeClass("ipt-success")
                        }, 2e3)))
                },
                _fx_err_ipt: function (b) {
                    var c = a(b);
                    c.hasClass("ipt-err") || (c.hasClass("ipt-need-parent") && (c.parent().addClass("ipt-parent-err"),
                        setTimeout(function () {
                            c.parent().removeClass("ipt-parent-err")
                        }, 2e3)),
                    (c.is(":text") || c.is(":password")) && (c.addClass("ipt-err"),
                        setTimeout(function () {
                            c.removeClass("ipt-err")
                        }, 2e3)))
                },
                _ck_login_captcha: function (b) {
                    var c = a(b).val();
                    return 4 != c.length ? (k.validate._showerr("验证码不正确", b),
                        !1) : !0
                },
                _ck_phonenum: function (b) {
                    function c(a, b) {
                        var c = /^((13|15|18)[0-9]{9}|(176|177|178)[0-9]{8})$/;
                        return !("0086" == a && !c.test(b))
                    }

                    var d = a(b).val()
                        , e = !!/^[^0]\d{6,}$/.test(d);
                    if (!e)
                        return k.validate._showerr("手机号码不正确", b),
                            !1;
                    var f = a.trim(k.view.$pop.find('.loginbox-bd[data-type="phone"] form .js-country-code').text());
                    return c(f, d) === !1 ? (k.validate._showerr("请勿使用网络手机进行绑定", b),
                        !1) : !0
                },
                _ck_phonenum_captcha: function (b) {
                    var c = a(b).val()
                        , d = !!/^[0-9]{4}$/.test(c);
                    return d ? !0 : (k.validate._showerr("校验码格式不正确", b),
                        !1)
                },
                _ck_yzphonenum: function (b) {
                    var c = a(b).val();
                    return 6 != c.length ? (k.validate._showerr("验证码格式不正确", b),
                        !1) : !0
                },
                _ck_login_username: function (b) {
                    var c = a(b).val();
                    return "" == c ? (k.validate._showerr("用户昵称不能为空", b),
                        !1) : 0 === c.indexOf("_") ? (k.validate._showerr("用户昵称不能以下划线开头", b),
                        !1) : !0
                },
                _ck_login_password: function (b) {
                    var c = a(b).val();
                    return c.length < 5 || c.length > 25 ? (k.validate._showerr("密码长度不正确，仅限5~25个字符", b),
                        !1) : !0
                },
                _ck_reg_nickname: function (c) {
                    var d = a(c).val();
                    if ("" == d)
                        return k.validate._showerr("用户昵称不能为空", c),
                            !1;
                    if (-1 != d.indexOf("_"))
                        return k.validate._showerr("用户昵称不能含有下划线", c),
                            !1;
                    var e = b.string.bytelen(d);
                    return 5 > e ? (k.validate._showerr("您的昵称过短", c),
                        !1) : e > 30 ? (k.validate._showerr("您的昵称过长", c),
                        !1) : !0
                },
                _ck_reg_password: function (a) {
                    return k.validate._ck_login_password(a)
                },
                _ck_reg_password2: function (b) {
                    var c = a(b)
                        , d = c.val()
                        , e = c.parents("form").find("[name=password]").val();
                    return d !== e ? (k.validate._showerr("两次密码输入不一致", b),
                        !1) : !0
                },
                _ck_reg_email: function (b) {
                    var c = /^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+.[a-zA-Z]{2,4}$/
                        , d = a(b).val();
                    return c.test(d) ? !0 : (k.validate._showerr("邮箱地址格式不正确", b),
                        !1)
                },
                _ck_reg_protocol: function (b) {
                    var c = a(b);
                    return c.prop("checked") ? !0 : (k.validate._showerr("您还没有同意注册协议", b),
                        !1)
                }
            },
            k.bindphone = {
                initializeImgCapcha: function () {
                    var a = k.view.$pop.find('.loginbox-bd[data-type="phone"] img.phone-capimg')
                        , b = k.view.$pop.find('.loginbox-bd[data-type="phone"] #phonenum_captcha')
                        , c = a.attr("data-src") + "?v=" + (new Date).getTime();
                    a.attr("src", c),
                        b.val("")
                },
                changeAreaCode: function () {
                    var a = k.view.$pop.find('.loginbox-bd[data-type="phone"] select.js-select-country').val();
                    k.view.$pop.find('.loginbox-bd[data-type="phone"] .js-country-code').text(a)
                },
                getPhoneData: function () {
                    var b = {
                        bindphonenum: a.trim(k.view.$pop.find('.loginbox-bd[data-type="phone"] form #bindphonenum').val()),
                        phonenum_captcha: a.trim(k.view.$pop.find('.loginbox-bd[data-type="phone"] form #phonenum_captcha').val()),
                        areaCode: a.trim(k.view.$pop.find('.loginbox-bd[data-type="phone"] form .js-country-code').text()),
                        email_captcha: ""
                    };
                    return b
                },
                verifyPhone: function () {
                    var a = k.view.$pop.find('.loginbox-bd[data-type="phone"] form input[name]').not("input[name=yzphonenum]")
                        , b = k.view.$pop.find('.loginbox-bd[data-type="phone"] form .js-sendvoice')
                        , c = !0;
                    if (a.each(function () {
                            return (c = k.validate.check(this)) ? void 0 : !1
                        }),
                            c) {
                        var d = k.bindphone.getPhoneData()
                            , e = function () {
                                k.view.errorPopTip({
                                    cont: "语音验证过程发生错误，请稍候再试！",
                                    element: b
                                })
                            }
                            , f = function (a) {
                                switch (a.result) {
                                    case 0:
                                        k.bindphone.countDown(b, 60, "语音验证");
                                        break;
                                    default:
                                        k.view.errorPopTip({
                                            cont: a.error,
                                            element: b
                                        }),
                                            k.bindphone.initializeImgCapcha()
                                }
                            }
                            ;
                        k.control.API.verifyPhone(d, f, e)
                    }
                },
                clearTimer: function () {
                    k.bindphone.countTimer && clearTimeout(k.bindphone.countTimer)
                },
                countDown: function (a, b, c) {
                    b >= 0 ? (a.attr("disabled", !0),
                        a.val(c + "(" + b + ")"),
                        a.addClass("long"),
                        b--,
                        k.bindphone.countTimer = setTimeout(function () {
                            k.bindphone.countDown(a, b, c)
                        }, 1e3)) : (a.removeClass("long"),
                        a.attr("disabled", !1),
                        a.val("重新获取"))
                },
                resetText: function () {
                    var a = k.view.$pop.find('.loginbox-bd[data-type="phone"] form .js-sendvoice')
                        , b = k.view.$pop.find('.loginbox-bd[data-type="phone"] form .js-phone-submit');
                    a.attr("disabled", !1),
                        a.val("语音验证").removeClass("long"),
                        b.find("span").text("确认绑定")
                },
                evt: function () {
                    k.view.$pop.find('.loginbox-bd[data-type="phone"] img.phone-capimg').click(function (a) {
                        k.view._evt_stop(a),
                            k.bindphone.initializeImgCapcha()
                    }),
                        k.view.$pop.find('.loginbox-bd[data-type="phone"] select.js-select-country').change(function (a) {
                            k.view._evt_stop(a),
                                k.bindphone.changeAreaCode()
                        }),
                        k.view.$pop.find('.loginbox-bd[data-type="phone"] input.js-sendvoice').click(function (a) {
                            k.view._evt_stop(a),
                                k.bindphone.verifyPhone()
                        }),
                        k.view.$pop.find('.loginbox-bd[data-type="phone"] input#bindphonenum').focusin(function (b) {
                            k.view._evt_stop(b);
                            var c = a(this).val().replace("请输入您的手机号码", "");
                            a(this).val(c)
                        })
                }
            },
            l._is_init = !1,
            l.init = function (a) {
                if (!l._is_init && (!k.control.check(!0) || a)) {
                    var b = k.view.el(j.view.el.pop)
                        , c = !!b.find(".captcha").length;
                    c && (l._is_init = !0,
                        l.instance = g.init(b))
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
                a.isFunction(b.onAuto) && (k.control._on_auto_login = b.onAuto),
                    k.init()
            },
            show: k.view.show,
            hide: k.view.hide,
            toggle: k.view.toggle,
            exitif: k.view.exitif,
            check: k.control.check,
            enter: k.view.enter,
            exit: k.control.exit
        };
        return window.return_loadhmOk = function () {
            hmac_flash_ready = !0
        }
            ,
            a(k.control._load_hmac),
            a(m.check),
            n
    }),
    define("douyu/com/user", ["jquery", "douyu/com/user-view"], function (a, b) {
        try {
            window.user_dialog && window.user_dialog.open_login && (window.user_dialog._open_login = window.user_dialog.open_login,
                    window.user_dialog.open_login = function () {
                        a(".loginbox-shadow").size() < 1 && a(".loginbox").size() < 1 ? (b.init(),
                            b.show("login")) : b.show("login")
                    }
            ),
            window.user_dialog && window.user_dialog.open_reg && (window.user_dialog._open_reg = window.user_dialog.open_reg,
                    window.user_dialog.open_reg = function () {
                        a(".loginbox-shadow").size() < 1 && a(".loginbox").size() < 1 ? (b.init(),
                            b.show("reg")) : b.show("reg")
                    }
            )
        } catch (c) {
            window.user_dialog && window.user_dialog._open_login && (window.user_dialog.open_login = window.user_dialog._open_login),
            window.user_dialog && window.user_dialog._open_reg && (window.user_dialog.open_reg = window.user_dialog._open_reg)
        }
        return b
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
                    , e = a("[data-dysign=" + b + "]").clone().attr({
                    style: "",
                    "class": ""
                });
                if (e.size() && !(d > 0)) {
                    var i = c.string.join('<div class="vcode9-sign">', '<div class="s-cdown">', '<span class="closetxt"><em>0</em>s 后可关闭广告</span>', '<span class="closebtn" style="">关闭</span>', '<span class="cqnosign">酬勤用户免广告</span>', "</div>", '<div class="s-box"></div>', "</div>")
                        , j = this;
                    this.config.$sign = a(i),
                        this.config.$pop.append(this.config.$sign),
                        this.config.$sign.find(".s-box").empty().append(e),
                    h.isExposured || (g.exposure(),
                    e && e.trigger("scroll"),
                        h.isExposured = !0),
                        this.config.$sign.find(".s-cdown .closebtn").one("click", function () {
                            j.hideSign()
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
                this.config.$sign && (this.config.$sign.hide(),
                    this.config.$sign.find(".s-box").empty()),
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
    define("douyu/com/sign", ["jquery", "shark/class", "shark/util/lang/1.0", "shark/util/ready/1.0", "shark/util/flash/bridge/1.0", "shark/util/flash/data/1.0", "shark/ext/swfobject", "douyu/context", "douyu/com/insight"], function (a, b, c, d, e, f, g, h, i) {
        var j = (d.create(),
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
            , k = {
            elementSign: function (b) {
                return a(b).attr(j.sign.dom_prop)
            },
            pageSigns: function () {
                var b, c = [];
                return a("[" + j.sign.dom_prop + "]").each(function () {
                    b = k.elementSign(this),
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
            , l = 0;
        try {
            l = $ROOM.room_id
        } catch (m) {
        }
        var n = window._pageadvar || []
            , o = {
            build: function () {
                var b = a("[data-dysign]");
                n.length && p.response(n);
                var c = this.getAjaxPosList(b, n).join(",");
                c ? p.getAjaxPosListData(c) : (j.sign.render_count = 0,
                    q.completeCallback()),
                    p.exposureAd(),
                    p.exposureAdNew()
            },
            getAjaxPosList: function (b, c) {
                for (var d = [], e = 0, f = b.length; f > e; e++) {
                    var g = a(b[e])
                        , h = g.attr("data-dysign") - 0;
                    if (g.attr("data-dysign-show"))
                        j.showAdPos.push(h);
                    else {
                        for (var i = !1, k = 0, l = c.length; l > k; k++)
                            h == c[k].posid - 0 && (i = !0);
                        i || d.push(h)
                    }
                }
                return d
            }
        }
            , p = {
            request: function (a, b) {
                this.getAjaxPosListData(a)
            },
            response: function (a) {
                a && q.render(a)
            },
            _decodeFlashText: function (a) {
                var b, d, e, f, g = "ad_list@=";
                if (a && !(a.indexOf(g) < 0))
                    return b = a.replace(g, "").replace(/@AAS/g, "/").split("@S"),
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
                        e
            },
            getAjaxPosListData: function (b) {
                var c = this
                    , d = "/lapi/sign/signapi/getinfo";
                a.ajax({
                    url: d,
                    type: "POST",
                    data: {
                        posid: b,
                        roomid: l
                    },
                    dataType: "json",
                    success: function (a) {
                        0 === a.error ? c.response(a.data) : (j.sign.render_count = 0,
                            q.completeCallback())
                    },
                    error: function () {
                        j.sign.render_count = 0,
                            q.completeCallback()
                    }
                })
            },
            exposureAd: function () {
                for (var b = [], c = 0, d = j.showAdPos.length; d > c; c++) {
                    var e = a("[data-dysign=" + j.showAdPos[c] + "]")
                        , f = {
                        adid: e.attr("data-dysign-adid") || "",
                        posid: e.attr("data-dysign") || "",
                        proid: e.attr("data-dysign-proid") || "",
                        roomid: l
                    };
                    b.push(f)
                }
                if (window._pageadvar)
                    for (var c = 0, d = _pageadvar.length; d > c; c++) {
                        var f = {
                            adid: _pageadvar[c].adid || "",
                            posid: _pageadvar[c].posid || "",
                            proid: _pageadvar[c].proid || "",
                            roomid: l
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
            },
            exposureAdNew: function () {
                var b = []
                    , c = []
                    , d = null
                    , e = 500
                    , f = 0
                    , g = 0
                    , h = null;
                i.build({
                    appear: function () {
                        b.push(a(this)),
                        d && clearTimeout(d),
                            d = setTimeout(function () {
                                for (f = 0,
                                         g = b.length; g > f; f++) {
                                    h = b[f];
                                    var d = h.attr("data-dysign-adid") || ""
                                        , e = h.attr("data-dysign") || ""
                                        , i = h.attr("data-dysign-proid") || "";
                                    "" != d && "" != e && "" != i && c.push({
                                        adid: d,
                                        posid: e,
                                        proid: i,
                                        roomid: l
                                    })
                                }
                                if (c.length) {
                                    var j = "/lapi/sign/signapi/rtpv";
                                    a.ajax({
                                        url: j,
                                        type: "POST",
                                        dataType: "json",
                                        data: {
                                            data: JSON.stringify(c)
                                        },
                                        success: function (a) {
                                        }
                                    }),
                                        b = [],
                                        c = []
                                }
                            }, e)
                    }
                })
            }
        }
            , q = {
            render: function (a) {
                var b, c, d, e = q.render.ways, f = e["default"];
                try {
                    for (var g = 0, h = a.length; h > g; g++)
                        if (b = a[g],
                                !(b.adid < 0)) {
                            d = !1;
                            for (var i in e)
                                if (c = e[i],
                                    "default" !== i && c(b) === !0) {
                                    d = !0;
                                    break
                                }
                            d !== !0 && f(b)
                        }
                } catch (k) {
                    window.console && console.error(k)
                }
                try {
                    q.clean()
                } catch (k) {
                    window.console && console.error(k)
                }
                1 === j.sign.render_count ? (j.sign.render_count = 0,
                    q.completeCallback()) : j.sign.render_count++,
                n.length || (j.sign.render_count = 0,
                    q.completeCallback())
            },
            clean: function () {
                var b, c, d, e, f, g = q.clean.ways, h = g["default"], i = a("[" + j.sign.dom_prop + "]");
                i.each(function (a) {
                    b = i.eq(a),
                        c = b.attr(j.sign.dom_prop),
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
        q.render.reg = function (a, b) {
            "default" !== a && (q.render.ways[a] = b)
        }
            ,
            q.render.remove = function (a) {
                if ("default" !== a) {
                    var b = {}
                        , c = q.render.ways;
                    for (var d in c)
                        a !== d && (b[d] = c[d]);
                    q.render.ways = b
                }
            }
            ,
            q.clean.reg = function (a, b) {
                "default" !== a && (q.clean.ways[a] = b)
            }
            ,
            q.clean.remove = function (a) {
                if ("default" !== a) {
                    var b = {}
                        , c = q.clean.ways;
                    for (var d in c)
                        a !== d && (b[d] = c[d]);
                    q.clean.ways = b
                }
            }
            ,
            q.render.ways = {
                "default": function (b) {
                    var d, e, f, i, m, n = (c.string.join,
                        c.string.format);
                    if (b.adid && !(b.adid <= 0) && b.srcid && (d = n("[{0}={1}]", j.sign.dom_prop, b.posid),
                            m = a(d),
                            m.length)) {
                        m.empty(),
                            m.attr({
                                "data-dysign-adid": b.adid,
                                "data-dysign-proid": b.proid
                            }),
                            f = b.link ? k.innerLink(b) : "",
                            b.srcid.indexOf(".swf") > 0 ? (i = {
                                id: j.sign.id_pre + b.posid,
                                cover: h.get("sys.web_url") + "app/douyu/res/flash/swfcover.gif",
                                path: k.innerPath(b.srcid),
                                params: {
                                    wmode: "opaque",
                                    menu: "false",
                                    allowFullScreen: "false",
                                    AllowScriptAccess: "never"
                                }
                            },
                                e = n('<div id="{0}"></div>', i.id)) : e = n('<img src="{0}" style="width:100%;height:100%">', k.innerPath(b.srcid));
                        var o = b && b.ec ? JSON.parse(b.ec).innerlink : 0;
                        if (i && o - 0 == 1) {
                            e = n('<div id="{0}"></div>', i.id),
                                m.append(e);
                            var p = "http://" + window.location.host + "/lapi/sign/signapi/click?roomid=" + l + "&aid=" + b.adid + "&posid=" + b.posid + "&projid=" + b.proid + "&callback=1";
                            return p = escape(p),
                                void g.embedSWF(i.path, i.id, "100%", "100%", "9.0.0", null, {
                                    adcl: p
                                }, i.params)
                        }
                        var q = h.get("sys.web_url") + "/app/douyu/res/flash/swfcover.gif";
                        m.is("a") ? m.prop("href", f).prop("href", "_blank") : e = i ? n('<a href="{0}" target="_blank" style="position: relative; display: block;width: 100%;height: 100%;">{1}<img src="' + q + '" width="100%" height="100%" style="position: absolute;top: 0;left: 0;z-index: 10;" onclick="this.parentNode.click(); return false;" /></a>', f, e) : n('<a href="{0}" target="_blank">{1}</a>', f, e),
                            m.append(e),
                        i && g.embedSWF(i.path, i.id, "100%", "100%", "9.0.0", null, null, i.params)
                    }
                }
            },
            q.clean.ways = {
                "default": function (a) {
                }
            },
            q.completeCallback = function () {
            }
        ;
        var r = function (b) {
                var c = [].slice.call(arguments, 1);
                b === j.aop.view && (c[0] === j.aop.optype.remove ? q.render.remove(c[1]) : q.render.reg(c[0], c[1])),
                b === j.aop.clean && (c[0] === j.aop.optype.remove ? q.clean.remove(c[1]) : q.clean.reg(c[0], c[1])),
                b === j.aop.complete && (q.completeCallback = a.isFunction(c[0]) ? c[0] : q.completeCallback)
            }
            ;
        return {
            request: function (a) {
                p.request(a)
            },
            requestPage: function () {
                o.build()
            },
            exposure: function () {
                p.exposureAdNew()
            },
            response: p.response,
            helper: {
                innerPath: k.innerPath,
                innerLink: k.innerLink,
                defview: q.render.ways["default"]
            },
            aop: r
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
    define("douyu/page/lives/mod/dp", ["jquery"], function (a) {
        function b(a) {
            return a ? a.indexOf("#") > -1 || a.indexOf("javascript") > -1 ? "" : a.substring(a.lastIndexOf("/") + 1) : ""
        }

        var c = [{
            target: "#change-live-new-show",
            events: "mousedown",
            config: {
                point_id: "2.1.1.0"
            }
        }, {
            target: "#live-new-show-content-box li:not([data-ranktype]) a",
            events: "mousedown",
            config: {
                point_id: "2.1.2.0",
                ext: {
                    handle: function (a) {
                        var c = a.attr("href")
                            , d = b(c)
                            , e = [];
                        e.push(a.closest("li").index() + 1),
                            this.roomId = d,
                            this.position = e.join(".")
                    }
                }
            }
        }, {
            target: ".player_zb .title li a",
            events: "mousedown",
            config: {
                point_id: "2.2.1.0",
                ext: {
                    handle: function (b) {
                        this.reqUrl = b.attr("data-href"),
                            this.tag = a.trim(b.text())
                    }
                }
            }
        }, {
            target: "#live-list-contentbox li a",
            events: "mousedown",
            config: {
                point_id: "2.2.2.0",
                ext: {
                    handle: function (a) {
                        var c = a.attr("href")
                            , d = b(c)
                            , e = [];
                        e.push(a.closest("li").index() + 1),
                            this.roomId = d,
                            this.position = e.join(".")
                    }
                }
            }
        }, {
            target: "#J-pager a",
            events: "mousedown",
            config: {
                point_id: "2.2.3.1",
                ext: {
                    handle: function (b) {
                        var c = window.location.href
                            , d = a.trim(b.parent().find(".current").text())
                            , e = a.trim(b.parent().find(".jumptxt").val());
                        this.page = isNaN(a.trim(b.text())) ? b.hasClass("shark-pager-next") ? parseInt(d) + 1 : b.hasClass("shark-pager-prev") ? parseInt(d) - 1 : b.hasClass("shark-pager-submit") ? e : null : a.trim(b.text()),
                            this.reqUrl = c + "?isAjax=0&page=" + this.page
                    }
                }
            }
        }];
        return {
            init: function () {
                a.each(c, function (b, c) {
                    a(document).on(c.events, c.target, function () {
                        var b = a.extend(!0, {}, c)
                            , d = b.config ? b.config.ext : null
                            , e = a(this);
                        d && d.handle && (d.handle(e),
                            delete d.handle),
                            DYS.submit(b.config)
                    })
                })
            }
        }
    }),
    define("douyu/page/lives/app", ["jquery", "shark/observer", "shark/util/cookie/1.0", "douyu/context", "douyu/com/left", "douyu/com/imgp", "douyu/com/header", "douyu/com/user", "douyu/com/sign", "vcss!shark/ui/pager/2.0", "douyu/com/avatar", "douyu/com/zoom", "douyu/page/lives/mod/dp", "douyu/com/insight"], function (a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
        var o = function () {
            var b = g.init({
                onLogin: function () {
                    h.show("login")
                },
                onReg: function () {
                    h.show("reg")
                },
                onExit: function () {
                    h.exit()
                }
            });
            h.init({
                onAuto: function (a) {
                    a && b.login()
                }
            }),
                f.build({
                    container: "#mainbody"
                });
            var c = 0;
            i.aop("clean", "two-img", function (b) {
                var d = b.id
                    , e = a(b.el)
                    , f = a.trim(e.html());
                7 != d && 8 != d || f || c++,
                2 === c && (a("#main-col .lol-ad").remove(),
                    c = -1)
            }),
            a.fn.placeholder && a("input[placeholder]").each(function () {
                "password" !== this.type && a(this).placeholder()
            }),
                m.init(),
                i.requestPage()
        }
            , p = {
            vars: {
                prop: "data-ranktype",
                propd: "data-ranktypedata",
                propc: "data-cid",
                propr: "data-rid"
            },
            show: function () {
                if (window.DYS) {
                    var b, c, d, e, f, g = q.currentPageIndex || 1;
                    a("#mainbody li[" + p.vars.prop + "]");
                    n.build({
                        selectors: "#live-new-show-content-box [" + p.vars.prop + "]",
                        container: "#live-new-show-content-box",
                        appear: function () {
                            var h = a(this);
                            b = h.attr(p.vars.propr),
                            b || (b = h.find("a").attr("href").replace("/", "")),
                                c = h.attr(p.vars.prop),
                                e = h.index(),
                                f = h.attr(p.vars.propc),
                                d = {
                                    rid: b,
                                    rt: c,
                                    tid: f,
                                    pg: g,
                                    idx: e
                                },
                                h.data(p.vars.propd, d),
                                d = a.extend(!0, {}, d, {
                                    at: "show"
                                }),
                                DYS.submit({
                                    point_id: DYS.point.page(3),
                                    ext: d
                                })
                        }
                    }),
                        n.build({
                            selectors: "#live-list-content [" + p.vars.prop + "]",
                            container: "#mainbody",
                            appear: function () {
                                var h = a(this);
                                b = h.attr(p.vars.propr),
                                b || (b = h.find("a").attr("href").replace("/", "")),
                                    c = h.attr(p.vars.prop),
                                    e = h.index(),
                                    f = h.attr(p.vars.propc),
                                    d = {
                                        rid: b,
                                        rt: c,
                                        tid: f,
                                        pg: g,
                                        idx: e
                                    },
                                    h.data(p.vars.propd, d),
                                    d = a.extend(!0, {}, d, {
                                        at: "show"
                                    }),
                                    DYS.submit({
                                        point_id: DYS.point.page(3),
                                        ext: d
                                    })
                            }
                        })
                }
            },
            bindEvt: function () {
                window.DYS && a("#mainbody").on("mousedown", "li[data-ranktype] a", function (b) {
                    var c = a(this).parent().data(p.vars.propd);
                    c && (c.at = "click",
                        DYS.submit({
                            point_id: DYS.point.page(3),
                            ext: c
                        }))
                })
            }
        }
            , q = {
            getDoms: function () {
                this.doms = {
                    changeLiveNewShowBtn: a("#change-live-new-show"),
                    changeLiveNewShowBox: a("#live-new-show-content-box"),
                    liveListContent: a("#live-list-content"),
                    liveListTypeBtn: a("[data-live-list-type]"),
                    liveListContentBox: a("#live-list-contentbox"),
                    tseContent: a("#main-col").find(".tse-content"),
                    newShowTitle: a("#change-live-new-show").siblings(".real-dycj"),
                    mainBody: a("#mainbody"),
                    leftBody: a("#left"),
                    body: a("body"),
                    allTypeBtn: a('[data-live-list-type="all"]'),
                    nonemsg: a(".nonemsg")
                }
            },
            init: function () {
                this.getDoms(),
                    this.Pager = j,
                    this.changeLiveNewShowClickNum = 0,
                    this.mainBodyMarginLeft = parseInt(this.doms.mainBody.css("marginLeft"), 10),
                    this.leftBodyWidth = this.doms.leftBody.width(),
                    this.HEADHEIGHT = 50;
                var a = document.documentElement.clientHeight || document.body.clientHeight;
                this.doms.mainBody.height(a - 51),
                this.doms.nonemsg.length && (this.doms.liveListContent.css("overflow", "hidden"),
                    this.doms.liveListContentBox.width(2e4)),
                    this.createPager(),
                    this.setLiveHeight(),
                    this.checkBodyHeight(),
                    this.fitListNone(),
                    this.livePageInterfaceConfig(),
                    this.bigDataRecommend(),
                    this.addEvent()
            },
            halfRandomRatio: function () {
                var a = [!0, !1]
                    , b = Math.floor(Math.random() * a.length);
                return a[b]
            },
            bigDataRecommend: function () {
                var a = this
                    , b = c.get("uid")
                    , d = a.doms.changeLiveNewShowBox.length;
                if (b && d && a.halfRandomRatio()) {
                    var e = {
                        url: a.getLiveNewShowList,
                        data: {
                            uid: b,
                            bzdata: 1
                        }
                    };
                    this.getData(e, function (b) {
                        a.listRecommend(b),
                            f.build({
                                container: "#mainbody"
                            }),
                            a.resizeListNewbie(a.getliveListConfig()),
                            p.show()
                    })
                }
            },
            listRecommend: function (a) {
                var b = this
                    , c = "";
                a = JSON.parse(a),
                    c = b.getNewShowList(a),
                    b.doms.newShowTitle.text(a.title),
                    b.doms.changeLiveNewShowBox.html(c)
            },
            getNewShowList: function (a) {
                for (var b = 0, c = "", d = "", e = a.bzdata, f = a.room.length; f > b; b++)
                    d = e ? '<li data-ranktype="6" data-cid="' + a.room[b].cateid + '" data-rid="' + a.room[b].roomid + '"><a href="/' + a.room[b].roomid + '" title="' + a.room[b].roomname + '"><span class="imgbox"><b></b><i class="black"></i><img data-original="' + a.room[b].pic + '" src="http://shark.douyucdn.cn/app/douyu/res/page/list-item-def-thumb.gif"></span><div class="mes"><div class="mes-tit"><h3 class="ellipsis">' + a.room[b].roomname + '</h3><span class="tag ellipsis">' + a.room[b].gamename + '</span></div><p><span class="dy-name ellipsis fl">' + a.room[b].nickname + "</span></p></div></a></li>" : '<li data-cid="' + a.room[b].cateid + '" data-rid="' + a.room[b].roomid + '"><a href="/' + a.room[b].roomid + '" title="' + a.room[b].roomname + '"><span class="imgbox"><b></b><i class="black"></i><img data-original="' + a.room[b].pic + '" src="http://shark.douyucdn.cn/app/douyu/res/page/list-item-def-thumb.gif"></span><div class="mes"><div class="mes-tit"><h3 class="ellipsis">' + a.room[b].roomname + '</h3><span class="tag ellipsis">' + a.room[b].gamename + '</span></div><p><span class="dy-name ellipsis fl">' + a.room[b].nickname + "</span></p></div></a></li>",
                        c += d;
                return c
            },
            isBigData: function () {
                return "斗鱼推荐" === this.doms.newShowTitle.text() ? 0 : 1
            },
            livePageInterfaceConfig: function () {
                this.getLiveNewShowList = "/member/recommlist/getfreshlistajax",
                    this.getLiveTypeData = location.href.split("/")[1],
                    this.oldLiveTypeData = this.getLiveTypeData
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
            getliveListConfig: function () {
                var a = this.doms.liveListContent.width()
                    , b = a / Math.ceil(a / 332) - 10
                    , c = b - 2
                    , d = c / 16 * 9
                    , e = d / 2 - 35
                    , f = c / 2 - 24;
                return {
                    liveListContentWidth: a,
                    li_width: b,
                    img_width: c,
                    img_height: d,
                    top: e,
                    left: f
                }
            },
            resizeList: function (b) {
                var c = this.doms
                    , d = c.tseContent
                    , e = a("#live-loading")
                    , f = a("#resizeListStyle")
                    , g = '<style type="text/css">#live-list-content li{width:' + b.li_width + "px;}#live-list-content li img{height:" + b.img_height + "px;}#live-list-content li .shadow{width:" + b.img_width + "px;height:" + b.img_height + "px;}#live-list-content li .iconPlay{left:" + b.left + "px;}</style>";
                f.length ? f.html(g) : a('<div id="resizeListStyle" style="display: none  ">' + g + "</div>").appendTo("body"),
                e.length && e.remove(),
                "hidden" === d.css("visibility") && "1" != d.css("opacity") && (d.css({
                    visibility: "visible"
                }),
                    d.fadeTo(400, 1))
            },
            resizeListNewbie: function (b) {
                var c = this.doms
                    , d = c.changeLiveNewShowBox;
                return d.length < 1 ? !1 : (d.find("li").each(function () {
                    a(this).width(b.li_width),
                        a(this).find("img").height(b.img_height),
                        a(this).find(".shadow").width(b.img_width).height(b.img_height),
                        a(this).find(".iconPlay").css({
                            left: b.left
                        })
                }),
                    d.css({
                        height: d.find("li").eq(0).outerHeight(!0) + "px",
                        overflow: "hidden",
                        position: "relative"
                    }),
                    void d.trigger("scroll"))
            },
            setLiveHeight: function () {
                var b = (function () {
                    var b = a("#elem-mimiko-test")
                        , c = a(window).width() || a(document).width()
                        , d = c - parseInt(b.css("padding-left")) - parseInt(b.css("padding-right")) - a("#left_col").width();
                    b.css({
                        width: d
                    })
                }(),
                    this.getliveListConfig());
                this.resizeList(b),
                    this.resizeListNewbie(b)
            },
            fitListNone: function () {
                function b(a, b, c, d) {
                    if (!(c.length < d)) {
                        if (b() >= a + 30)
                            return void c.eq(d - 1).hide();
                        c.eq(d).show(),
                            arguments.callee(a, b, c, ++d)
                    }
                }

                var c = a("#item_data_rec")
                    , d = c.find("li")
                    , e = c.width()
                    , f = c.height()
                    , g = e / Math.ceil(e / 332) - 10
                    , h = 0
                    , i = g - 2
                    , j = i / 16 * 9
                    , k = i / 2 - 24
                    , l = a(window).width() / 1920;
                a(".nonemsg").css("font-size", 45 * l + "px"),
                    d.each(function (b, c) {
                        var d = a(this);
                        d.width(g),
                            d.find("img").width(i).height(j),
                            d.find(".shadow").width(i).height(j),
                            d.find(".iconPlay").css({
                                left: k
                            })
                    }),
                    d.hide(),
                f > h && b(d.outerHeight(), function () {
                    return c.height()
                }, d, 0)
            },
            addEvent: function () {
                var d = this
                    , g = this.doms;
                a(window).resize(function () {
                    b.trigger("mod.layout.screen.change"),
                        d.setLiveHeight(),
                        d.fitListNone();
                    var a = document.documentElement.clientHeight || document.body.clientHeight;
                    d.doms.mainBody.height(a - 51)
                }),
                    g.changeLiveNewShowBtn.on("click", function () {
                        var a = d.isBigData()
                            , b = {
                            url: d.getLiveNewShowList,
                            data: {
                                clickNum: ++d.changeLiveNewShowClickNum
                            }
                        }
                            , e = c.get("uid");
                        e ? (b.data.uid = e,
                            b.data.bzdata = a) : b.data.bzdata = 0,
                            d.getData(b, function (a) {
                                d.listRecommend(a),
                                    f.build({
                                        container: "#mainbody"
                                    }),
                                    d.resizeListNewbie(d.getliveListConfig()),
                                    p.show()
                            })
                    }),
                    g.liveListTypeBtn.on("click", function (b) {
                        var c = b || window.event;
                        c.preventDefault(),
                            c.stopPropagation();
                        var e = a(this);
                        g.liveListTypeBtn.removeClass("lihover"),
                            e.addClass("lihover"),
                            d.getLiveTypeData = e.attr("data-href"),
                            d.pageTotal = e.attr("data-pagecount"),
                            d.getLiveListType()
                    }),
                    e.onToggle(function (a) {
                        var b = d.leftBodyWidth - g.leftBody.width()
                            , c = d.mainBodyMarginLeft - b;
                        "close" == a ? g.mainBody.css("marginLeft", c) : g.mainBody.css("marginLeft", c),
                            d.leftBodyWidth = g.leftBody.width(),
                            d.mainBodyMarginLeft = c,
                            d.setLiveHeight(),
                            d.fitListNone()
                    })
            },
            getLiveListType: function (b) {
                var c = this
                    , d = {
                    url: c.getLiveTypeData,
                    data: {
                        page: b || 1,
                        isAjax: "1"
                    }
                };
                c.getData(d, function (b) {
                    b ? (c.doms.liveListContentBox.html(b),
                    c.oldLiveTypeData != c.getLiveTypeData && c.createPager(),
                        a("#mainbody").scrollTop(0),
                        c.oldLiveTypeData = c.getLiveTypeData,
                        p.show()) : c.doms.liveListContentBox.html(b),
                        c.checkBodyHeight(),
                        f.build({
                            container: "#mainbody"
                        }),
                        c.setLiveHeight()
                })
            },
            checkBodyHeight: function () {
                var a = document.documentElement.clientHeight || document.body.clientHeight;
                this.doms.mainBody.css("height", a - this.HEADHEIGHT - 2)
            },
            createPager: function () {
                var b = 1
                    , c = this.pageTotal || this.doms.allTypeBtn.attr("data-pagecount") || d.get("page").pager.count || 1
                    , e = this;
                this.Pager.create({
                    target: "#J-pager",
                    totalPage: parseInt(c, 10),
                    currentIndex: parseInt(b, 10),
                    url: "",
                    showNum: {
                        enable: 1,
                        size: 9
                    },
                    showPrevAndNext: 1,
                    showForm: 1,
                    clickCallBack: function (a) {
                        q.currentPageIndex = a,
                            e.getLiveListType(a)
                    },
                    wrongPageCall: function () {
                        a.dialog.tips_black("请输入正确的页码！")
                    }
                })
            }
        };
        a(function () {
            o(),
                q.init(),
                p.bindEvt(),
                p.show()
        })
    });
