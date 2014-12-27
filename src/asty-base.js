/*
**  ASTy -- Generic Abstract Syntax Tree (AST)
**  Copyright (c) 2014 Ralf S. Engelschall <rse@engelschall.com>
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

class ASTYBase {
    /*  constructor helper: AST node initialization  */
    init (T) {
        if (typeof T === "undefined")
            throw new Error("init: invalid argument")
        this.T = T
        this.A = {}
        this.C = []
        this.P = { L: 0, C: 0, O: 0 }
        return this
    }

    /*  merge attributes and childs of an AST node  */
    merge (node, takePos, attrMap) {
        if (typeof node !== "object")
            throw new Error("merge: invalid AST node argument")
        if (typeof takePos === "undefined")
            takePos = false
        if (typeof attrMap === "undefined")
            attrMap = {}
        var self = this
        if (takePos) {
            var pos = node.pos()
            self.pos(pos.L, pos.C, pos.O)
        }
        node.attrs().forEach(function (attrSource) {
            var attrTarget = (typeof attrMap[attrSource] !== "undefined" ?
                attrMap[attrSource] : attrSource)
            if (attrTarget !== null)
                self.set(attrTarget, node.get(attrSource))
        })
        node.childs().forEach(function (child) {
            self.add(child)
        })
        return this
    }

    /*  check the type of an AST node  */
    type (T) {
        if (arguments.length === 0)
            return this.T
        else if (arguments.length === 1) {
            this.T = T
            return this
        }
        else
            throw new Error("type: invalid number of arguments")
    }

    /*  set the parsing position   */
    pos (L, C, O) {
        if (arguments.length === 0)
            return this.P
        else if (arguments.length <= 3) {
            this.P.L = L || 0
            this.P.C = C || 0
            this.P.O = O || 0
            return this
        }
        else
            throw new Error("pos: invalid number of arguments")
    }

    /*  set AST node attributes  */
    set () {
        if (arguments.length === 1 && typeof arguments[0] === "object") {
            var self = this
            var args = arguments
            Object.keys(args[0]).forEach(function (key) { self.A[key] = args[0][key]; })
        }
        else if (arguments.length === 2)
            this.A[arguments[0]] = arguments[1]
        else
            throw new Error("set: invalid arguments")
        return this
    }

    /*  get AST node attributes  */
    get (key) {
        if (arguments.length !== 1)
            throw new Error("get: invalid number of arguments")
        if (typeof key !== "string")
            throw new Error("get: invalid argument")
        return this.A[key]
    }

    /*  get names of all AST node attributes  */
    attrs () {
        return Object.keys(this.A)
    }

    /*  add child AST node(s)  */
    add () {
        if (arguments.length === 0)
            throw new Error("add: missing argument(s)")
        var _add = function (C, node) {
            if (!((typeof node   === "object") &&
                  (typeof node.T === "string") &&
                  (typeof node.P === "object") &&
                  (typeof node.A === "object") &&
                  (typeof node.C === "object" && node.C instanceof Array)))
                throw new Error("add: invalid AST node: " + JSON.stringify(node))
            C.push(node)
        }
        if (arguments !== null) {
            var self = this
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                if (typeof arg === "object" && arg instanceof Array)
                    arg.forEach(function (child) { _add(self.C, child) })
                else if (arg !== null)
                    _add(self.C, arg)
            })
        }
        return this
    }

    /*  delete child AST node(s)  */
    del () {
        if (arguments.length === 0)
            throw new Error("del: invalid argument")
        var self = this
        Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
            var found = false
            for (var j = 0; j < self.C.length; j++) {
                if (self.C[j] === arg) {
                    self.C.splice(j, 1)
                    found = true
                    break
                }
            }
            if (!found)
                throw new Error("del: child not found")
        })
        return this
    }

    /*  get child AST nodes  */
    childs () {
        return this.C
    }

    /*  walk the AST recursively  */
    walk (cb, when) {
        if (typeof when === "undefined")
            when = "downward"
        var _walk = function (node, depth, parent) {
            if (when === "downward" || when === "both")
                cb.call(null, node, depth, parent, "downward")
            node.C.forEach(function (child) { _walk(child, depth + 1, node) })
            if (when === "upward" || when === "both")
                cb.call(null, node, depth, parent, "upward")
        }
        _walk(this, 0, null)
        return this
    }

    /*  dump the AST recursively  */
    dump () {
        var out = ""
        this.walk(function (node, depth /*, parent, when */) {
            for (var i = 0; i < depth; i++)
                out += "    "
            out += node.T + " "
            var keys = Object.keys(node.A)
            if (keys.length > 0) {
                out += "("
                var first = true
                keys.forEach(function (key) {
                    if (!first)
                        out += ", "
                    else
                        first = false
                    out += key + ": "
                    var value = node.A[key]
                    switch (typeof value) {
                        case "string":
                            out += "\"" + value.replace(/\n/, "\\n").replace(/"/, "\\\"") + "\""
                            break
                        case "object":
                            if (value instanceof RegExp)
                                out += "/" +
                                    value.toString()
                                    .replace(/^\//, "")
                                    .replace(/\/$/, "")
                                    .replace(/\//g, "\\/") +
                                "/"
                            else
                                out += JSON.stringify(value)
                            break
                        default:
                            out += JSON.stringify(value)
                            break
                    }
                })
                out += ") "
            }
            out += "[" + node.P.L + "/" + node.P.C + "]\n"
        }, "downward")
        return out
    }
}

module.exports = ASTYBase

