/*
**  ASTy -- Abstract Syntax Tree (AST) Data Structure
**  Copyright (c) 2014-2015 Ralf S. Engelschall <rse@engelschall.com>
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit persons to whom the Software is furnished to do so, subject to
**  the following conditions:
**
**  The above copyright notice and this permission notice shall be included
**  in all copies or substantial portions of the Software.
**
**  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
**  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
**  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
**  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
**  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
**  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
**  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.ASTY=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/*
**  ASTy -- Abstract Syntax Tree (AST) Data Structure
**  Copyright (c) 2014-2015 Ralf S. Engelschall <rse@engelschall.com>
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit persons to whom the Software is furnished to do so, subject to
**  the following conditions:
**
**  The above copyright notice and this permission notice shall be included
**  in all copies or substantial portions of the Software.
**
**  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
**  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
**  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
**  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
**  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
**  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
**  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var ASTYBase = (function () {
    function ASTYBase() {
        _classCallCheck(this, ASTYBase);
    }

    _prototypeProperties(ASTYBase, null, {
        init: {
            /*  AST node initialization  */
            value: function init(T, A, C) {
                if (typeof T === "undefined") throw new Error("init: invalid argument");
                this.ASTy = true;
                this.T = T;
                this.L = { L: 0, C: 0, O: 0 };
                this.A = {};
                this.C = [];
                this.P = null;
                if (typeof A === "object") {
                    for (var _name in A) {
                        if (A.hasOwnProperty(_name)) this.set(_name, A[_name]);
                    }
                }
                if (typeof C === "object" && C instanceof Array) this.add(C);
                return this;
            },
            writable: true,
            configurable: true
        },
        type: {

            /*  check the type of an AST node  */
            value: function type(T) {
                if (arguments.length === 0) {
                    return this.T;
                } else if (arguments.length === 1) {
                    this.T = T;
                    return this;
                } else throw new Error("type: invalid number of arguments");
            },
            writable: true,
            configurable: true
        },
        pos: {

            /*  set the parsing position   */
            value: function pos(L, C, O) {
                if (arguments.length === 0) {
                    return this.L;
                } else if (arguments.length <= 3) {
                    this.L.L = L || 0;
                    this.L.C = C || 0;
                    this.L.O = O || 0;
                    return this;
                } else throw new Error("pos: invalid number of arguments");
            },
            writable: true,
            configurable: true
        },
        set: {

            /*  set AST node attributes  */
            value: function set() {
                var _this = this;
                var _arguments = arguments;
                if (arguments.length === 1 && typeof arguments[0] === "object") {
                    (function () {
                        var args = _arguments;
                        Object.keys(args[0]).forEach(function (key) {
                            _this.A[key] = args[0][key];
                        });
                    })();
                } else if (arguments.length === 2) this.A[arguments[0]] = arguments[1];else throw new Error("set: invalid arguments");
                return this;
            },
            writable: true,
            configurable: true
        },
        get: {

            /*  get AST node attributes  */
            value: function get(key) {
                if (arguments.length !== 1) throw new Error("get: invalid number of arguments");
                if (typeof key !== "string") throw new Error("get: invalid argument");
                return this.A[key];
            },
            writable: true,
            configurable: true
        },
        attrs: {

            /*  get names of all AST node attributes  */
            value: function attrs() {
                return Object.keys(this.A);
            },
            writable: true,
            configurable: true
        },
        add: {

            /*  add child AST node(s)  */
            value: function add() {
                var _this = this;
                if (arguments.length === 0) throw new Error("add: missing argument(s)");
                var _add = function (node, child) {
                    if (!(typeof child === "object" && typeof child.T === "string" && typeof child.L === "object" && typeof child.A === "object" && typeof child.P === "object" && (typeof child.C === "object" && child.C instanceof Array))) throw new Error("add: invalid AST node: " + JSON.stringify(child));
                    node.C.push(child);
                    child.P = node;
                };
                if (arguments !== null) {
                    Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                        if (typeof arg === "object" && arg instanceof Array) arg.forEach(function (child) {
                            _add(_this, child);
                        });else if (arg !== null) _add(_this, arg);
                    });
                }
                return this;
            },
            writable: true,
            configurable: true
        },
        del: {

            /*  delete child AST node(s)  */
            value: function del() {
                var _this = this;
                if (arguments.length === 0) throw new Error("del: invalid argument");
                Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                    var found = false;
                    for (var j = 0; j < _this.C.length; j++) {
                        if (_this.C[j] === arg) {
                            _this.C.splice(j, 1);
                            arg.P = null;
                            found = true;
                            break;
                        }
                    }
                    if (!found) throw new Error("del: child not found");
                });
                return this;
            },
            writable: true,
            configurable: true
        },
        childs: {

            /*  get child AST nodes  */
            value: function childs() {
                return this.C;
            },
            writable: true,
            configurable: true
        },
        parent: {

            /*  get parent AST node  */
            value: function parent() {
                return this.P;
            },
            writable: true,
            configurable: true
        }
    });

    return ASTYBase;
})();

module.exports = ASTYBase;

},{}],2:[function(_dereq_,module,exports){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/*
**  ASTy -- Abstract Syntax Tree (AST) Data Structure
**  Copyright (c) 2014-2015 Ralf S. Engelschall <rse@engelschall.com>
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit persons to whom the Software is furnished to do so, subject to
**  the following conditions:
**
**  The above copyright notice and this permission notice shall be included
**  in all copies or substantial portions of the Software.
**
**  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
**  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
**  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
**  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
**  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
**  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
**  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var ASTYDump = (function () {
    function ASTYDump() {
        _classCallCheck(this, ASTYDump);
    }

    _prototypeProperties(ASTYDump, null, {
        dump: {
            /*  dump the AST recursively  */
            value: function dump(maxDepth) {
                if (maxDepth === undefined) maxDepth = Infinity;
                var out = "";
                this.walk(function (node, depth /*, parent, when */) {
                    if (depth > maxDepth) return;
                    for (var i = 0; i < depth; i++) {
                        out += "    ";
                    }out += node.T + " ";
                    var keys = Object.keys(node.A);
                    if (keys.length > 0) {
                        (function () {
                            out += "(";
                            var first = true;
                            keys.forEach(function (key) {
                                if (!first) out += ", ";else first = false;
                                out += key + ": ";
                                var value = node.A[key];
                                switch (typeof value) {
                                    case "string":
                                        out += "\"" + value.replace(/\n/, "\\n").replace(/"/, "\\\"") + "\"";
                                        break;
                                    case "object":
                                        if (value instanceof RegExp) out += "/" + value.toString().replace(/^\//, "").replace(/\/$/, "").replace(/\//g, "\\/") + "/";else out += JSON.stringify(value);
                                        break;
                                    default:
                                        out += JSON.stringify(value);
                                        break;
                                }
                            });
                            out += ") ";
                        })();
                    }
                    out += "[" + node.L.L + "/" + node.L.C + "]\n";
                }, "downward");
                return out;
            },
            writable: true,
            configurable: true
        }
    });

    return ASTYDump;
})();

module.exports = ASTYDump;

},{}],3:[function(_dereq_,module,exports){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/*
**  ASTy -- Abstract Syntax Tree (AST) Data Structure
**  Copyright (c) 2014-2015 Ralf S. Engelschall <rse@engelschall.com>
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit persons to whom the Software is furnished to do so, subject to
**  the following conditions:
**
**  The above copyright notice and this permission notice shall be included
**  in all copies or substantial portions of the Software.
**
**  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
**  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
**  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
**  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
**  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
**  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
**  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var ASTYMerge = (function () {
    function ASTYMerge() {
        _classCallCheck(this, ASTYMerge);
    }

    _prototypeProperties(ASTYMerge, null, {
        merge: {
            /*  merge attributes and childs of an AST node  */
            value: function merge(node, takePos, attrMap) {
                var _this = this;
                if (typeof node !== "object") throw new Error("merge: invalid AST node argument");
                if (typeof takePos === "undefined") takePos = false;
                if (typeof attrMap === "undefined") attrMap = {};
                if (takePos) {
                    var pos = node.pos();
                    this.pos(pos.L, pos.C, pos.O);
                }
                node.attrs().forEach(function (attrSource) {
                    var attrTarget = typeof attrMap[attrSource] !== "undefined" ? attrMap[attrSource] : attrSource;
                    if (attrTarget !== null) _this.set(attrTarget, node.get(attrSource));
                });
                node.childs().forEach(function (child) {
                    _this.add(child);
                });
                return this;
            },
            writable: true,
            configurable: true
        }
    });

    return ASTYMerge;
})();

module.exports = ASTYMerge;

},{}],4:[function(_dereq_,module,exports){
"use strict";

/*
**  ASTy -- Abstract Syntax Tree (AST) Data Structure
**  Copyright (c) 2014-2015 Ralf S. Engelschall <rse@engelschall.com>
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit persons to whom the Software is furnished to do so, subject to
**  the following conditions:
**
**  The above copyright notice and this permission notice shall be included
**  in all copies or substantial portions of the Software.
**
**  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
**  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
**  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
**  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
**  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
**  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
**  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/* global 1: false */
/* global 0: false */
/* global 5: false */
/* global 20150215:  false */

var version = {
    major: 1,
    minor: 0,
    micro: 5,
    date: 20150215
};

module.exports = version;

},{}],5:[function(_dereq_,module,exports){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/*
**  ASTy -- Abstract Syntax Tree (AST) Data Structure
**  Copyright (c) 2014-2015 Ralf S. Engelschall <rse@engelschall.com>
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit persons to whom the Software is furnished to do so, subject to
**  the following conditions:
**
**  The above copyright notice and this permission notice shall be included
**  in all copies or substantial portions of the Software.
**
**  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
**  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
**  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
**  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
**  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
**  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
**  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var ASTYWalk = (function () {
    function ASTYWalk() {
        _classCallCheck(this, ASTYWalk);
    }

    _prototypeProperties(ASTYWalk, null, {
        walk: {
            /*  walk the AST recursively  */
            value: function walk(cb, when) {
                if (typeof when === "undefined") when = "downward";
                var _walk = function (node, depth, parent) {
                    if (when === "downward" || when === "both") cb.call(null, node, depth, parent, "downward");
                    node.C.forEach(function (child) {
                        _walk(child, depth + 1, node);
                    });
                    if (when === "upward" || when === "both") cb.call(null, node, depth, parent, "upward");
                };
                _walk(this, 0, null);
                return this;
            },
            writable: true,
            configurable: true
        }
    });

    return ASTYWalk;
})();

module.exports = ASTYWalk;

},{}],6:[function(_dereq_,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/*
**  ASTy -- Abstract Syntax Tree (AST) Data Structure
**  Copyright (c) 2014-2015 Ralf S. Engelschall <rse@engelschall.com>
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit persons to whom the Software is furnished to do so, subject to
**  the following conditions:
**
**  The above copyright notice and this permission notice shall be included
**  in all copies or substantial portions of the Software.
**
**  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
**  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
**  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
**  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
**  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
**  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
**  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var ASTYBase = _interopRequire(_dereq_("./asty-base.js"));

var ASTYMerge = _interopRequire(_dereq_("./asty-merge.js"));

var ASTYWalk = _interopRequire(_dereq_("./asty-walk.js"));

var ASTYDump = _interopRequire(_dereq_("./asty-dump.js"));

var ASTYVersion = _interopRequire(_dereq_("./asty-version.js"));

var ASTYCtx = (function () {
    function ASTYCtx() {
        var _this = this;
        _classCallCheck(this, ASTYCtx);

        this.ASTYNode = function () {};
        var mixins = [[ASTYBase, "init", "type", "pos", "set", "get", "attrs", "add", "del", "childs", "parent"], [ASTYMerge, "merge"], [ASTYWalk, "walk"], [ASTYDump, "dump"]];
        mixins.forEach(function (mixin) {
            var proto = mixin[0].prototype;
            mixin.slice(1).forEach(function (method) {
                _this.ASTYNode.prototype[method] = proto[method];
            });
        });
        return this;
    }

    _prototypeProperties(ASTYCtx, null, {
        version: {
            value: function version() {
                return ASTYVersion;
            },
            writable: true,
            configurable: true
        },
        extend: {
            value: function extend(mixin) {
                for (var method in mixin) {
                    if (mixin.hasOwnProperty(method)) this.ASTYNode.prototype[method] = mixin[method];
                }return this;
            },
            writable: true,
            configurable: true
        },
        create: {
            value: function create(type) {
                return new this.ASTYNode().init(type);
            },
            writable: true,
            configurable: true
        },
        isA: {
            value: function isA(node) {
                return typeof node === "object" && node instanceof this.ASTYNode && typeof node.ASTy === "boolean" && node.ASTy === true;
            },
            writable: true,
            configurable: true
        }
    });

    return ASTYCtx;
})();

module.exports = ASTYCtx;

},{"./asty-base.js":1,"./asty-dump.js":2,"./asty-merge.js":3,"./asty-version.js":4,"./asty-walk.js":5}]},{},[1,2,3,4,5,6])(6)
});