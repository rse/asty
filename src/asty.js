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

import ASTYBase      from "./asty-base.js"
import ASTYMerge     from "./asty-merge.js"
import ASTYWalk      from "./asty-walk.js"
import ASTYDump      from "./asty-dump.js"
import ASTYSerialize from "./asty-serialize.js"
import ASTYVersion   from "./asty-version.js"

export default class ASTYCtx {
    constructor () {
        this.ASTYNode = () => {}
        let mixins = [
            [ ASTYBase,  "init", "type", "pos", "set", "get", "attrs", "add", "del", "childs", "parent" ],
            [ ASTYMerge, "merge" ],
            [ ASTYWalk,  "walk" ],
            [ ASTYDump,  "dump" ]
        ]
        mixins.forEach((mixin) => {
            let proto = mixin[0].prototype
            mixin.slice(1).forEach((method) => {
                this.ASTYNode.prototype[method] = proto[method]
            })
        })
        return this
    }
    version () {
        return ASTYVersion
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
    serialize (node) {
        return ASTYSerialize.serialize(this, node)
    }
    unserialize (json) {
        return ASTYSerialize.unserialize(this, json)
    }
}

