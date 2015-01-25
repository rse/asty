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

class ASTYBase {
    /*  AST node initialization  */
    init (T, A, C) {
        if (typeof T === "undefined")
            throw new Error("init: invalid argument")
        this.ASTy = true
        this.T = T
        this.L = { L: 0, C: 0, O: 0 }
        this.A = {}
        this.C = []
        this.P = null
        if (typeof A === "object") {
            for (let name in A)
                if (A.hasOwnProperty(name))
                    this.set(name, A[name])
        }
        if (typeof C === "object" && C instanceof Array)
            this.add(C)
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
            return this.L
        else if (arguments.length <= 3) {
            this.L.L = L || 0
            this.L.C = C || 0
            this.L.O = O || 0
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
        var _add = function (node, child) {
            if (!((typeof child   === "object") &&
                  (typeof child.T === "string") &&
                  (typeof child.L === "object") &&
                  (typeof child.A === "object") &&
                  (typeof child.P === "object") &&
                  (typeof child.C === "object" && child.C instanceof Array)))
                throw new Error("add: invalid AST node: " + JSON.stringify(child))
            node.C.push(child)
            child.P = node
        }
        if (arguments !== null) {
            var self = this
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                if (typeof arg === "object" && arg instanceof Array)
                    arg.forEach(function (child) { _add(self, child) })
                else if (arg !== null)
                    _add(self, arg)
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
                    arg.P = null
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

    /*  get parent AST node  */
    parent () {
        return this.P
    }
}

module.exports = ASTYBase

