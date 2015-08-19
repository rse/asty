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

export default class ASTYBase {
    /*  AST node initialization  */
    init (ctx, T, A, C) {
        if (arguments.length < 2)
            throw new Error("init: invalid number of arguments")
        this.ctx = ctx
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
    pos (line, column, offset) {
        if (arguments.length === 0)
            return {
                line:   this.L.L,
                column: this.L.C,
                offset: this.L.O
            }
        else if (arguments.length <= 3) {
            this.L.L = line   || 0
            this.L.C = column || 0
            this.L.O = offset || 0
            return this
        }
        else
            throw new Error("pos: invalid number of arguments")
    }

    /*  set AST node attributes  */
    set (...args) {
        if (   args.length === 1
            && typeof args[0] === "object") {
            Object.keys(args[0]).forEach((key) => {
                this.A[key] = args[0][key]
            })
        }
        else if (args.length === 2)
            this.A[args[0]] = args[1]
        else
            throw new Error("set: invalid number of arguments")
        return this
    }

    /*  unset AST node attributes  */
    unset (...args) {
        if (   args.length === 1
            && typeof args[0] === "object"
            && args[0] instanceof Array   ) {
            args[0].forEach((key) => {
                delete this.A[key]
            })
        }
        else if (args.length === 1)
            delete this.A[args[0]]
        else
            throw new Error("unset: invalid number of arguments")
        return this
    }

    /*  get AST node attributes  */
    get (key) {
        if (arguments.length !== 1)
            throw new Error("get: invalid number of arguments")
        if (typeof key !== "string")
            throw new Error("get: invalid key argument")
        return this.A[key]
    }

    /*  get names of all AST node attributes  */
    attrs () {
        return Object.keys(this.A)
    }

    /*  return current sibling position  */
    nth () {
        if (this.P === null)
            return 1
        let nth = this.P.C.indexOf(this)
        if (nth < 0)
            throw new Error("nth: internal error -- node not in childs of its parent")
        return nth
    }

    /*  insert child AST node(s)  */
    ins (pos, ...args) {
        if (args.length === 0)
            throw new Error("ins: invalid number of arguments")
        if (pos < 0)
            pos = (this.C.length + 1) - pos
        if (!(0 <= pos && pos <= this.C.length))
            throw new Error("ins: invalid position")
        let _ins = (node) => {
            if (!this.ctx.isA(node))
                throw new Error(`ins: invalid AST node argument: ${ JSON.stringify(node) }`)
            this.C.splice(pos++, 0, node)
            node.P = this
        }
        args.forEach((arg) => {
            if (typeof arg === "object" && arg instanceof Array)
                arg.forEach((arg) => { _ins(arg) })
            else if (arg !== null)
                _ins(arg)
        })
        return this
    }

    /*  add child AST node(s)  */
    add (...args) {
        if (args.length === 0)
            throw new Error("add: invalid number of arguments")
        let _add = (node) => {
            if (!this.ctx.isA(node))
                throw new Error(`add: invalid AST node argument: ${ JSON.stringify(node) }`)
            this.C.push(node)
            node.P = this
        }
        args.forEach((arg) => {
            if (typeof arg === "object" && arg instanceof Array)
                arg.forEach((arg) => { _add(arg) })
            else if (arg !== null)
                _add(arg)
        })
        return this
    }

    /*  delete child AST node(s)  */
    del (...args) {
        if (args.length === 0)
            throw new Error("del: invalid number of argument")
        args.forEach((node) => {
            if (!this.ctx.isA(node))
                throw new Error(`del: invalid AST node argument: ${ JSON.stringify(node) }`)
            let found = false
            for (let j = 0; j < this.C.length; j++) {
                if (this.C[j] === node) {
                    this.C.splice(j, 1)
                    node.P = null
                    found = true
                    break
                }
            }
            if (!found)
                throw new Error("del: AST node not found in childs")
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

