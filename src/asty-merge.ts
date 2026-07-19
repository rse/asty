/*
**  ASTy -- Abstract Syntax Tree (AST) Data Structure
**  Copyright (c) 2014-2026 Dr. Ralf S. Engelschall <rse@engelschall.com>
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

import type { ASTYNodeT, ASTYAttributeMap } from "./asty-base"

export default class ASTYMerge {
    /*  merge attributes and childs of an AST node  */
    merge (this: ASTYNodeT, node: ASTYNodeT | null, takePos = false, attrMap: ASTYAttributeMap = {}): ASTYNodeT {
        /*  short-circuit  */
        if (node === null)
            return this

        /*  sanity check situation  */
        if (!this.ctx.isA(node))
            throw new Error("merge: invalid AST node argument")

        /*  reject self-merge and merging of an own ancestor, as both
            would either detach the node from itself or create a cycle  */
        if (node === this)
            throw new Error("merge: cannot merge an AST node into itself")
        for (let p = this.parent(); p !== null; p = p.parent())
            if (p === node)
                throw new Error("merge: cannot merge an ancestor AST node")

        /*  handle position  */
        if (takePos) {
            const pos = node.pos()
            this.pos(pos.line, pos.column, pos.offset)
        }

        /*  handle attributes  */
        node.attrs().forEach((attrSource: string) => {
            const attrTarget = (Object.hasOwn(attrMap, attrSource) ?
                attrMap[attrSource] : attrSource)
            if (attrTarget !== null)
                this.set(attrTarget, node.get(attrSource))
        })

        /*  move over all child AST nodes (childs() already returns a copy)  */
        node.childs().forEach((child: ASTYNodeT) => {
            node.del(child)
            this.add(child)
        })

        /*  delete node from parent  */
        const parent = node.parent()
        if (parent !== null)
            parent.del(node)

        return this
    }
}
