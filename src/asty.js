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

let ASTYBase  = require("./asty-base.js");
let ASTYMerge = require("./asty-merge.js");
let ASTYWalk  = require("./asty-walk.js");
let ASTYDump  = require("./asty-dump.js");

let ASTYCtx = class ASTYCtx {
    constructor () {
        if (!(this instanceof ASTYCtx))
            return new ASTYCtx()
        this.ASTYNode = () => {}
        let mixins = [ ASTYBase, ASTYMerge, ASTYWalk, ASTYDump ]
        mixins.forEach((mixin) => {
            for (let method in mixin.prototype)
                if (mixin.prototype.hasOwnProperty(method))
                    this.ASTYNode.prototype[method] = mixin.prototype[method]
        })
        return this
    }
    extend (mixin) {
        for (let method in mixin)
            if (mixin.hasOwnProperty(method))
                this.ASTYNode.prototype[method] = mixin[method]
        return this
    }
    create (type) {
        return (new this.ASTYNode()).init(type)
    }
    isA (node) {
        return (
               typeof node === "object"
            && node instanceof this.ASTYNode
            && typeof node.ASTy === "boolean"
            && node.ASTy === true
        )
    }
}

module.exports = ASTYCtx

