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

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ASTY = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
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

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ASTYBase = (function () {
    function ASTYBase() {
        _classCallCheck(this, ASTYBase);
    }

    _createClass(ASTYBase, [{
        key: "init",

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
        }

        /*  check the type of an AST node  */
    }, {
        key: "type",
        value: function type(T) {
            if (arguments.length === 0) return this.T;else if (arguments.length === 1) {
                this.T = T;
                return this;
            } else throw new Error("type: invalid number of arguments");
        }

        /*  set the parsing position   */
    }, {
        key: "pos",
        value: function pos(line, column, offset) {
            if (arguments.length === 0) return {
                line: this.L.L,
                column: this.L.C,
                offset: this.L.O
            };else if (arguments.length <= 3) {
                this.L.L = line || 0;
                this.L.C = column || 0;
                this.L.O = offset || 0;
                return this;
            } else throw new Error("pos: invalid number of arguments");
        }

        /*  set AST node attributes  */
    }, {
        key: "set",
        value: function set() {
            var _arguments = arguments,
                _this = this;

            if (arguments.length === 1 && typeof arguments[0] === "object") {
                (function () {
                    var args = _arguments;
                    Object.keys(args[0]).forEach(function (key) {
                        _this.A[key] = args[0][key];
                    });
                })();
            } else if (arguments.length === 2) this.A[arguments[0]] = arguments[1];else throw new Error("set: invalid arguments");
            return this;
        }

        /*  get AST node attributes  */
    }, {
        key: "get",
        value: function get(key) {
            if (arguments.length !== 1) throw new Error("get: invalid number of arguments");
            if (typeof key !== "string") throw new Error("get: invalid argument");
            return this.A[key];
        }

        /*  get names of all AST node attributes  */
    }, {
        key: "attrs",
        value: function attrs() {
            return Object.keys(this.A);
        }

        /*  add child AST node(s)  */
    }, {
        key: "add",
        value: function add() {
            var _this2 = this;

            if (arguments.length === 0) throw new Error("add: missing argument(s)");
            var _add = function _add(node, child) {
                if (!(typeof child === "object" && typeof child.T === "string" && typeof child.L === "object" && typeof child.A === "object" && typeof child.P === "object" && (typeof child.C === "object" && child.C instanceof Array))) throw new Error("add: invalid AST node: " + JSON.stringify(child));
                node.C.push(child);
                child.P = node;
            };
            if (arguments !== null) {
                Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                    if (typeof arg === "object" && arg instanceof Array) arg.forEach(function (child) {
                        _add(_this2, child);
                    });else if (arg !== null) _add(_this2, arg);
                });
            }
            return this;
        }

        /*  delete child AST node(s)  */
    }, {
        key: "del",
        value: function del() {
            var _this3 = this;

            if (arguments.length === 0) throw new Error("del: invalid argument");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                var found = false;
                for (var j = 0; j < _this3.C.length; j++) {
                    if (_this3.C[j] === arg) {
                        _this3.C.splice(j, 1);
                        arg.P = null;
                        found = true;
                        break;
                    }
                }
                if (!found) throw new Error("del: child not found");
            });
            return this;
        }

        /*  get child AST nodes  */
    }, {
        key: "childs",
        value: function childs() {
            return this.C;
        }

        /*  get parent AST node  */
    }, {
        key: "parent",
        value: function parent() {
            return this.P;
        }
    }]);

    return ASTYBase;
})();

exports["default"] = ASTYBase;
module.exports = exports["default"];

},{}],2:[function(_dereq_,module,exports){
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

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ASTYDump = (function () {
    function ASTYDump() {
        _classCallCheck(this, ASTYDump);
    }

    _createClass(ASTYDump, [{
        key: "dump",

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
                                    var hex = function hex(ch) {
                                        return ch.charCodeAt(0).toString(16).toUpperCase();
                                    };
                                    out += "\"" + value.replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/\x08/g, "\\b").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\f/g, "\\f").replace(/\r/g, "\\r").replace(/[\x00-\x07\x0B\x0E\x0F]/g, function (ch) {
                                        return "\\x0" + hex(ch);
                                    }).replace(/[\x10-\x1F\x80-\xFF]/g, function (ch) {
                                        return "\\x" + hex(ch);
                                    }).replace(/[\u0100-\u0FFF]/g, function (ch) {
                                        return "\\u0" + hex(ch);
                                    }).replace(/[\u1000-\uFFFF]/g, function (ch) {
                                        return "\\u" + hex(ch);
                                    }) + "\"";
                                    break;
                                case "object":
                                    if (value instanceof RegExp) out += value.source;else out += JSON.stringify(value);
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
        }
    }]);

    return ASTYDump;
})();

exports["default"] = ASTYDump;
module.exports = exports["default"];

},{}],3:[function(_dereq_,module,exports){
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

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ASTYMerge = (function () {
    function ASTYMerge() {
        _classCallCheck(this, ASTYMerge);
    }

    _createClass(ASTYMerge, [{
        key: "merge",

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
        }
    }]);

    return ASTYMerge;
})();

exports["default"] = ASTYMerge;
module.exports = exports["default"];

},{}],4:[function(_dereq_,module,exports){
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

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ASTYSerialize = (function () {
    function ASTYSerialize() {
        _classCallCheck(this, ASTYSerialize);
    }

    _createClass(ASTYSerialize, null, [{
        key: "serialize",

        /*  recursively serialize AST nodes into JSON string  */
        value: function serialize(asty, node) {
            var serializeNode = function serializeNode(node) {
                var clone = {
                    T: node.T,
                    L: { L: node.L.L, C: node.L.C, O: node.L.O }
                };
                var keys = Object.keys(node.A);
                if (keys.length > 0) {
                    clone.A = {};
                    keys.forEach(function (key) {
                        var value = node.A[key];
                        switch (typeof value) {
                            case "boolean":
                            case "number":
                            case "string":
                                clone.A[key] = value;
                                break;
                            default:
                                /*  use the slow approach only for non-atomic attributes  */
                                clone.A[key] = JSON.parse(JSON.stringify(value));
                                break;
                        }
                    });
                }
                if (node.C.length > 0) clone.C = node.C.map(function (C) {
                    return serializeNode(C);
                });
                return clone;
            };
            if (!asty.isA(node)) throw new Error("failed to serialize: not an ASTy node");
            return JSON.stringify({ ASTy: serializeNode(node) });
        }

        /*  recursively unserialize JSON string into AST nodes  */
    }, {
        key: "unserialize",
        value: function unserialize(asty, json) {
            var unserializeNode = function unserializeNode(clone) {
                var node = asty.create(clone.T);
                node.pos(clone.L.L, clone.L.C, clone.L.O);
                if (typeof clone.A === "object") {
                    Object.keys(clone.A).forEach(function (key) {
                        var value = clone.A[key];
                        switch (typeof value) {
                            case "boolean":
                            case "number":
                            case "string":
                                node.set(key, value);
                                break;
                            default:
                                /*  use the slow approach only for non-atomic attributes  */
                                node.set(key, JSON.parse(JSON.stringify(value)));
                                break;
                        }
                    });
                }
                if (typeof clone.C === "object" && clone.C instanceof Array) node.add(clone.C.map(function (C) {
                    return unserializeNode(C);
                }));
                return node;
            };
            var obj = JSON.parse(json);
            if (typeof obj !== "object" || typeof obj.ASTy !== "object") throw new Error("failed to unserialize: not an ASTy JSON export");
            return unserializeNode(obj.ASTy);
        }
    }]);

    return ASTYSerialize;
})();

exports["default"] = ASTYSerialize;
module.exports = exports["default"];

},{}],5:[function(_dereq_,module,exports){
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
/* global 2: false */
/* global 0: false */
/* global 20150531:  false */

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var version = {
    major: 1,
    minor: 2,
    micro: 0,
    date: 20150531
};

exports["default"] = version;
module.exports = exports["default"];

},{}],6:[function(_dereq_,module,exports){
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

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ASTYWalk = (function () {
    function ASTYWalk() {
        _classCallCheck(this, ASTYWalk);
    }

    _createClass(ASTYWalk, [{
        key: "walk",

        /*  walk the AST recursively  */
        value: function walk(cb, when) {
            if (typeof when === "undefined") when = "downward";
            var _walk = function _walk(node, depth, parent) {
                if (when === "downward" || when === "both") cb.call(null, node, depth, parent, "downward");
                node.C.forEach(function (child) {
                    _walk(child, depth + 1, node);
                });
                if (when === "upward" || when === "both") cb.call(null, node, depth, parent, "upward");
            };
            _walk(this, 0, null);
            return this;
        }
    }]);

    return ASTYWalk;
})();

exports["default"] = ASTYWalk;
module.exports = exports["default"];

},{}],7:[function(_dereq_,module,exports){
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

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _astyBaseJs = _dereq_("./asty-base.js");

var _astyBaseJs2 = _interopRequireDefault(_astyBaseJs);

var _astyMergeJs = _dereq_("./asty-merge.js");

var _astyMergeJs2 = _interopRequireDefault(_astyMergeJs);

var _astyWalkJs = _dereq_("./asty-walk.js");

var _astyWalkJs2 = _interopRequireDefault(_astyWalkJs);

var _astyDumpJs = _dereq_("./asty-dump.js");

var _astyDumpJs2 = _interopRequireDefault(_astyDumpJs);

var _astySerializeJs = _dereq_("./asty-serialize.js");

var _astySerializeJs2 = _interopRequireDefault(_astySerializeJs);

var _astyVersionJs = _dereq_("./asty-version.js");

var _astyVersionJs2 = _interopRequireDefault(_astyVersionJs);

var ASTYCtx = (function () {
    function ASTYCtx() {
        var _this = this;

        _classCallCheck(this, ASTYCtx);

        this.ASTYNode = function () {};
        var mixins = [[_astyBaseJs2["default"], "init", "type", "pos", "set", "get", "attrs", "add", "del", "childs", "parent"], [_astyMergeJs2["default"], "merge"], [_astyWalkJs2["default"], "walk"], [_astyDumpJs2["default"], "dump"]];
        mixins.forEach(function (mixin) {
            var proto = mixin[0].prototype;
            mixin.slice(1).forEach(function (method) {
                _this.ASTYNode.prototype[method] = proto[method];
            });
        });
        return this;
    }

    _createClass(ASTYCtx, [{
        key: "version",
        value: function version() {
            return _astyVersionJs2["default"];
        }
    }, {
        key: "extend",
        value: function extend(mixin) {
            for (var method in mixin) {
                if (mixin.hasOwnProperty(method)) this.ASTYNode.prototype[method] = mixin[method];
            }return this;
        }
    }, {
        key: "create",
        value: function create(type) {
            return new this.ASTYNode().init(type);
        }
    }, {
        key: "isA",
        value: function isA(node) {
            return typeof node === "object" && node instanceof this.ASTYNode && typeof node.ASTy === "boolean" && node.ASTy === true;
        }
    }, {
        key: "serialize",
        value: function serialize(node) {
            return _astySerializeJs2["default"].serialize(this, node);
        }
    }, {
        key: "unserialize",
        value: function unserialize(json) {
            return _astySerializeJs2["default"].unserialize(this, json);
        }
    }]);

    return ASTYCtx;
})();

exports["default"] = ASTYCtx;
module.exports = exports["default"];

},{"./asty-base.js":1,"./asty-dump.js":2,"./asty-merge.js":3,"./asty-serialize.js":4,"./asty-version.js":5,"./asty-walk.js":6}]},{},[1,2,3,4,5,6,7])(7)
});