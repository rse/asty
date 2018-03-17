/*
**  ASTy -- Abstract Syntax Tree (AST) Data Structure
**  Copyright (c) 2014-2018 Ralf S. Engelschall <rse@engelschall.com>
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
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
**  ASTy -- Abstract Syntax Tree (AST) Data Structure
**  Copyright (c) 2014-2018 Ralf S. Engelschall <rse@engelschall.com>
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

var ASTYBase = function () {
    function ASTYBase() {
        _classCallCheck(this, ASTYBase);
    }

    _createClass(ASTYBase, [{
        key: "init",

        /*  AST node initialization  */
        value: function init(ctx, T, A, C) {
            if (arguments.length < 2) throw new Error("init: invalid number of arguments");
            this.ctx = ctx;
            this.ASTy = true;
            this.T = T;
            this.L = { L: 0, C: 0, O: 0 };
            this.A = {};
            this.C = [];
            this.P = null;
            if ((typeof A === "undefined" ? "undefined" : _typeof(A)) === "object") {
                for (var name in A) {
                    if (A.hasOwnProperty(name)) this.set(name, A[name]);
                }
            }
            if ((typeof C === "undefined" ? "undefined" : _typeof(C)) === "object" && C instanceof Array) this.add(C);
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
            var _this = this;

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            if (args.length === 1 && _typeof(args[0]) === "object") {
                Object.keys(args[0]).forEach(function (key) {
                    _this.A[key] = args[0][key];
                });
            } else if (args.length === 2) this.A[args[0]] = args[1];else throw new Error("set: invalid number of arguments");
            return this;
        }

        /*  unset AST node attributes  */

    }, {
        key: "unset",
        value: function unset() {
            var _this2 = this;

            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            if (args.length === 1 && _typeof(args[0]) === "object" && args[0] instanceof Array) {
                args[0].forEach(function (key) {
                    delete _this2.A[key];
                });
            } else if (args.length === 1) delete this.A[args[0]];else throw new Error("unset: invalid number of arguments");
            return this;
        }

        /*  get AST node attributes  */

    }, {
        key: "get",
        value: function get(key) {
            if (arguments.length !== 1) throw new Error("get: invalid number of arguments");
            if (typeof key !== "string") throw new Error("get: invalid key argument");
            return this.A[key];
        }

        /*  get names of all AST node attributes  */

    }, {
        key: "attrs",
        value: function attrs() {
            return Object.keys(this.A);
        }

        /*  return current sibling position  */

    }, {
        key: "nth",
        value: function nth() {
            if (this.P === null) return 1;
            var idx = this.P.C.indexOf(this);
            if (idx < 0) throw new Error("nth: internal error -- node not in childs of its parent");
            return idx;
        }

        /*  insert child AST node(s)  */

    }, {
        key: "ins",
        value: function ins(pos) {
            var _this3 = this;

            for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                args[_key3 - 1] = arguments[_key3];
            }

            if (args.length === 0) throw new Error("ins: invalid number of arguments");
            if (pos < 0) pos = this.C.length + 1 - pos;
            if (!(0 <= pos && pos <= this.C.length)) throw new Error("ins: invalid position");
            var _ins = function _ins(node) {
                if (!_this3.ctx.isA(node)) throw new Error("ins: invalid AST node argument");
                _this3.C.splice(pos++, 0, node);
                node.P = _this3;
            };
            args.forEach(function (arg) {
                if ((typeof arg === "undefined" ? "undefined" : _typeof(arg)) === "object" && arg instanceof Array) arg.forEach(function (arg) {
                    _ins(arg);
                });else if (arg !== null) _ins(arg);
            });
            return this;
        }

        /*  add child AST node(s)  */

    }, {
        key: "add",
        value: function add() {
            var _this4 = this;

            for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                args[_key4] = arguments[_key4];
            }

            if (args.length === 0) throw new Error("add: invalid number of arguments");
            var _add = function _add(node) {
                if (!_this4.ctx.isA(node)) throw new Error("add: invalid AST node argument");
                _this4.C.push(node);
                node.P = _this4;
            };
            args.forEach(function (arg) {
                if ((typeof arg === "undefined" ? "undefined" : _typeof(arg)) === "object" && arg instanceof Array) arg.forEach(function (arg) {
                    _add(arg);
                });else if (arg !== null) _add(arg);
            });
            return this;
        }

        /*  delete child AST node(s)  */

    }, {
        key: "del",
        value: function del() {
            var _this5 = this;

            for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                args[_key5] = arguments[_key5];
            }

            if (args.length === 0) throw new Error("del: invalid number of arguments");
            args.forEach(function (node) {
                if (!_this5.ctx.isA(node)) throw new Error("del: invalid AST node argument");
                var found = false;
                for (var j = 0; j < _this5.C.length; j++) {
                    if (_this5.C[j] === node) {
                        _this5.C.splice(j, 1);
                        node.P = null;
                        found = true;
                        break;
                    }
                }
                if (!found) throw new Error("del: AST node not found in childs");
            });
            return this;
        }

        /*  get all or some child AST nodes  */

    }, {
        key: "childs",
        value: function childs() {
            if (arguments.length > 2) throw new Error("childs: invalid number of arguments");
            if (arguments.length === 2 && typeof (arguments.length <= 0 ? undefined : arguments[0]) === "number" && typeof (arguments.length <= 1 ? undefined : arguments[1]) === "number") return this.C.slice(arguments.length <= 0 ? undefined : arguments[0], arguments.length <= 1 ? undefined : arguments[1]);else if (arguments.length === 1 && typeof (arguments.length <= 0 ? undefined : arguments[0]) === "number") return this.C.slice(arguments.length <= 0 ? undefined : arguments[0]);else if (arguments.length === 0) return this.C;else throw new Error("childs: invalid type of arguments");
        }

        /*  get one child AST node  */

    }, {
        key: "child",
        value: function child(pos) {
            if (typeof pos !== "number") throw new Error("child: invalid argument");
            return pos < this.C.length ? this.C[pos] : null;
        }

        /*  get parent AST node  */

    }, {
        key: "parent",
        value: function parent() {
            return this.P;
        }

        /*  serialize AST node recursively  */

    }, {
        key: "serialize",
        value: function serialize() {
            return this.ctx.serialize(this.ctx, this);
        }
    }]);

    return ASTYBase;
}();

exports.default = ASTYBase;

},{}],2:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
**  ASTy -- Abstract Syntax Tree (AST) Data Structure
**  Copyright (c) 2014-2018 Ralf S. Engelschall <rse@engelschall.com>
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

var tree = {
    mid: { unicode: String.fromCharCode(9500), ascii: "+" },
    last: { unicode: String.fromCharCode(9492), ascii: "+" },
    down: { unicode: String.fromCharCode(9474), ascii: "|" },
    left: { unicode: String.fromCharCode(9472), ascii: "-" }
};

var ASTYDump = function () {
    function ASTYDump() {
        _classCallCheck(this, ASTYDump);
    }

    _createClass(ASTYDump, [{
        key: "dump",

        /*  dump the AST recursively  */
        value: function dump() {
            var maxDepth = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Infinity;
            var colorize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (type, txt) {
                return txt;
            };
            var unicode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

            var out = "";
            this.walk(function (node, depth /*, parent, when */) {
                /*  short-circuit processing at a certain depth  */
                if (depth > maxDepth) return;

                /*  draw tree structure  */
                if (depth > 0) {
                    var nodeIndex = function nodeIndex(node) {
                        var nth = 0;
                        var max = 0;
                        if (node.P !== null) {
                            nth = node.P.C.indexOf(node);
                            max = node.P.C.length - 1;
                        }
                        return { nth: nth, max: max };
                    };

                    var _nodeIndex = nodeIndex(node),
                        nth = _nodeIndex.nth,
                        max = _nodeIndex.max;

                    var prefix = " ";
                    if (unicode) prefix = "" + tree.left.unicode + tree.left.unicode + prefix;else prefix = "" + tree.left.ascii + tree.left.ascii + prefix;
                    if (nth < max) prefix = "" + (unicode ? tree.mid.unicode : tree.mid.ascii) + prefix;else prefix = "" + (unicode ? tree.last.unicode : tree.last.ascii) + prefix;
                    for (var parent = node.P; parent !== null; parent = parent.P) {
                        if (parent.P !== null) {
                            var _nodeIndex2 = nodeIndex(parent),
                                _nth = _nodeIndex2.nth,
                                _max = _nodeIndex2.max;

                            if (_nth < _max) prefix = (unicode ? tree.down.unicode : tree.down.ascii) + "   " + prefix;else prefix = "    " + prefix;
                        }
                    }
                    out += colorize("tree", prefix);
                }

                /*  draw node type  */
                out += colorize("type", node.T) + " ";

                /*  draw node attributes  */
                var keys = Object.keys(node.A);
                if (keys.length > 0) {
                    out += colorize("parenthesis", "(");
                    var first = true;
                    keys.forEach(function (key) {
                        if (!first) out += colorize("comma", ",") + " ";else first = false;
                        out += colorize("key", key) + colorize("colon", ":") + " ";
                        var value = node.A[key];
                        switch (typeof value === "undefined" ? "undefined" : _typeof(value)) {
                            case "boolean":
                            case "number":
                                out += colorize("value", value.toString());
                                break;
                            case "string":
                                var hex = function hex(ch) {
                                    return ch.charCodeAt(0).toString(16).toUpperCase();
                                };
                                out += colorize("value", "\"" + value.replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/\x08/g, "\\b").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\f/g, "\\f").replace(/\r/g, "\\r").replace(/[\x00-\x07\x0B\x0E\x0F]/g, function (ch) {
                                    return "\\x0" + hex(ch);
                                }).replace(/[\x10-\x1F\x80-\xFF]/g, function (ch) {
                                    return "\\x" + hex(ch);
                                }).replace(/[\u0100-\u0FFF]/g, function (ch) {
                                    return "\\u0" + hex(ch);
                                }).replace(/[\u1000-\uFFFF]/g, function (ch) {
                                    return "\\u" + hex(ch);
                                }) + "\"");
                                break;
                            case "object":
                                if (value instanceof RegExp) out += colorize("value", "/" + value.source + "/");else out += colorize("value", JSON.stringify(value));
                                break;
                            default:
                                out += colorize("value", JSON.stringify(value));
                                break;
                        }
                    });
                    out += colorize("parenthesis", ")") + " ";
                }

                /*  draw node position  */
                out += colorize("position", colorize("bracket", "[") + colorize("line", node.L.L) + colorize("slash", ",") + colorize("column", node.L.C) + colorize("bracket", "]"));

                out += "\n";
            }, "downward");
            return out;
        }
    }]);

    return ASTYDump;
}();

exports.default = ASTYDump;

},{}],3:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
**  ASTy -- Abstract Syntax Tree (AST) Data Structure
**  Copyright (c) 2014-2018 Ralf S. Engelschall <rse@engelschall.com>
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

var ASTYMerge = function () {
    function ASTYMerge() {
        _classCallCheck(this, ASTYMerge);
    }

    _createClass(ASTYMerge, [{
        key: "merge",

        /*  merge attributes and childs of an AST node  */
        value: function merge(node) {
            var _this = this;

            var takePos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
            var attrMap = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            if (node === null) return this;
            if (!this.ctx.isA(node)) throw new Error("merge: invalid AST node argument");
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
}();

exports.default = ASTYMerge;

},{}],4:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
**  ASTy -- Abstract Syntax Tree (AST) Data Structure
**  Copyright (c) 2014-2018 Ralf S. Engelschall <rse@engelschall.com>
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

var ASTYSerialize = function () {
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
                        switch (typeof value === "undefined" ? "undefined" : _typeof(value)) {
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
            if (!asty.isA(node)) throw new Error("serialize: not an ASTy node");
            return JSON.stringify({ ASTy: serializeNode(node) });
        }

        /*  recursively unserialize JSON string into AST nodes  */

    }, {
        key: "unserialize",
        value: function unserialize(asty, json) {
            var unserializeNode = function unserializeNode(clone) {
                var node = asty.create(clone.T);
                node.pos(clone.L.L, clone.L.C, clone.L.O);
                if (_typeof(clone.A) === "object") {
                    Object.keys(clone.A).forEach(function (key) {
                        var value = clone.A[key];
                        switch (typeof value === "undefined" ? "undefined" : _typeof(value)) {
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
                if (_typeof(clone.C) === "object" && clone.C instanceof Array) node.add(clone.C.map(function (C) {
                    return unserializeNode(C);
                }));
                return node;
            };
            var obj = JSON.parse(json);
            if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) !== "object" || _typeof(obj.ASTy) !== "object") throw new Error("unserialize: not an ASTy JSON export");
            return unserializeNode(obj.ASTy);
        }
    }]);

    return ASTYSerialize;
}();

exports.default = ASTYSerialize;

},{}],5:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/*
**  ASTy -- Abstract Syntax Tree (AST) Data Structure
**  Copyright (c) 2014-2018 Ralf S. Engelschall <rse@engelschall.com>
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
/* global 6: false */
/* global 0: false */
/* global 20180317:  false */

var version = {
    major: 1,
    minor: 6,
    micro: 0,
    date: 20180317
};

exports.default = version;

},{}],6:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
**  ASTy -- Abstract Syntax Tree (AST) Data Structure
**  Copyright (c) 2014-2018 Ralf S. Engelschall <rse@engelschall.com>
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

var ASTYWalk = function () {
    function ASTYWalk() {
        _classCallCheck(this, ASTYWalk);
    }

    _createClass(ASTYWalk, [{
        key: "walk",

        /*  walk the AST recursively  */
        value: function walk(cb) {
            var when = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "downward";

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
}();

exports.default = ASTYWalk;

},{}],7:[function(_dereq_,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     **  ASTy -- Abstract Syntax Tree (AST) Data Structure
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     **  Copyright (c) 2014-2018 Ralf S. Engelschall <rse@engelschall.com>
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

var _astyBase = _dereq_("./asty-base.js");

var _astyBase2 = _interopRequireDefault(_astyBase);

var _astyMerge = _dereq_("./asty-merge.js");

var _astyMerge2 = _interopRequireDefault(_astyMerge);

var _astyWalk = _dereq_("./asty-walk.js");

var _astyWalk2 = _interopRequireDefault(_astyWalk);

var _astyDump = _dereq_("./asty-dump.js");

var _astyDump2 = _interopRequireDefault(_astyDump);

var _astySerialize = _dereq_("./asty-serialize.js");

var _astySerialize2 = _interopRequireDefault(_astySerialize);

var _astyVersion = _dereq_("./asty-version.js");

var _astyVersion2 = _interopRequireDefault(_astyVersion);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ASTYCtx = function () {
    function ASTYCtx() {
        var _this = this;

        _classCallCheck(this, ASTYCtx);

        this.ASTYNode = function () {};
        var mixins = [[_astyBase2.default, "init", "type", "pos", "set", "unset", "get", "attrs", "nth", "ins", "add", "del", "childs", "child", "parent", "serialize"], [_astyMerge2.default, "merge"], [_astyWalk2.default, "walk"], [_astyDump2.default, "dump"]];
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
            return _astyVersion2.default;
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
        value: function create(type, attrs, childs) {
            return new this.ASTYNode().init(this, type, attrs, childs);
        }
    }, {
        key: "isA",
        value: function isA(node) {
            return (typeof node === "undefined" ? "undefined" : _typeof(node)) === "object" && node instanceof this.ASTYNode && typeof node.ASTy === "boolean" && node.ASTy === true;
        }
    }, {
        key: "serialize",
        value: function serialize(node) {
            return _astySerialize2.default.serialize(this, node);
        }
    }, {
        key: "unserialize",
        value: function unserialize(json) {
            return _astySerialize2.default.unserialize(this, json);
        }
    }]);

    return ASTYCtx;
}();

/*  export the traditional way for interoperability reasons
    (as Babel would export an object with a 'default' field)  */


module.exports = ASTYCtx;

},{"./asty-base.js":1,"./asty-dump.js":2,"./asty-merge.js":3,"./asty-serialize.js":4,"./asty-version.js":5,"./asty-walk.js":6}]},{},[1,2,3,4,5,6,7])(7)
});