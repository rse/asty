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

class ASTYMerge {
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
}

module.exports = ASTYMerge

