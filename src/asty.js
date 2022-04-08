/*
**  ASTy -- Abstract Syntax Tree (AST) Data Structure
**  Copyright (c) 2014-2022 Dr. Ralf S. Engelschall <rse@engelschall.com>
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

class ASTYCtx {
    constructor () {
        this.ASTYNode = class ASTYNode {}
        let mixins = [
            [ ASTYBase,
                "init", "create", "type", "pos",
                "set", "unset", "get", "attrs",
                "nth", "ins", "add", "del",
                "childs", "child", "parent",
                "serialize" ],
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
            if (Object.prototype.hasOwnProperty.call(mixin, method))
                this.ASTYNode.prototype[method] = mixin[method]
        return this
    }
    create (type, attrs, childs) {
        return (new this.ASTYNode()).init(this, type, attrs, childs)
    }
    isA (node) {
        return (typeof node === "object"
            && node instanceof this.ASTYNode
            && typeof node.ASTy === "boolean"
            && node.ASTy === true)
    }
    __serialize (node) {
        return ASTYCtx.serialize(node)
    }
    static serialize (node) {
        return ASTYSerialize.serialize(node.ctx, node)
    }
    static unserialize (json) {
        let Ctx = this
        return ASTYSerialize.unserialize(new Ctx(), json)
    }
}

/*  export the traditional way for interoperability reasons
    (as Babel would export an object with a 'default' field)  */
module.exports = ASTYCtx

