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

export default class ASTYMerge {
    /*  merge attributes and childs of an AST node  */
    merge (node, takePos = false, attrMap = {}) {
        if (node === null)
            return this
        if (!this.ctx.isA(node))
            throw new Error("merge: invalid AST node argument")
        if (takePos) {
            let pos = node.pos()
            this.pos(pos.line, pos.column, pos.offset)
        }
        node.attrs().forEach((attrSource) => {
            let attrTarget = (typeof attrMap[attrSource] !== "undefined" ?
                attrMap[attrSource] : attrSource)
            if (attrTarget !== null)
                this.set(attrTarget, node.get(attrSource))
        })
        node.childs().forEach((child) => {
            node.del(child)
            this.add(child)
        })
        let parent = node.parent()
        if (parent !== null)
            parent.del(node)
        return this
    }
}

