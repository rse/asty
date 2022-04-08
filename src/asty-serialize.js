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

export default class ASTYSerialize {
    /*  recursively serialize AST nodes into JSON string  */
    static serialize (asty, node) {
        const serializeNode = (node) => {
            let clone = {
                T: node.T,
                L: { L: node.L.L, C: node.L.C, O: node.L.O }
            }
            let keys = Object.keys(node.A)
            if (keys.length > 0) {
                clone.A = {}
                keys.forEach((key) => {
                    let value = node.A[key]
                    switch (typeof value) {
                        case "boolean":
                        case "number":
                        case "string":
                            clone.A[key] = value
                            break
                        default:
                            /*  use the slow approach only for non-atomic attributes  */
                            clone.A[key] = JSON.parse(JSON.stringify(value))
                            break
                    }
                })
            }
            if (node.C.length > 0)
                clone.C = node.C.map((C) => serializeNode(C))
            return clone
        }
        if (!asty.isA(node))
            throw new Error("serialize: not an ASTy node")
        return JSON.stringify({ ASTy: serializeNode(node) })
    }

    /*  recursively unserialize JSON string into AST nodes  */
    static unserialize (asty, json) {
        const unserializeNode = (clone) => {
            let node = asty.create(clone.T)
            node.pos(clone.L.L, clone.L.C, clone.L.O)
            if (typeof clone.A === "object") {
                Object.keys(clone.A).forEach((key) => {
                    let value = clone.A[key]
                    switch (typeof value) {
                        case "boolean":
                        case "number":
                        case "string":
                            node.set(key, value)
                            break
                        default:
                            /*  use the slow approach only for non-atomic attributes  */
                            node.set(key, JSON.parse(JSON.stringify(value)))
                            break
                    }
                })
            }
            if (typeof clone.C === "object" && clone.C instanceof Array)
                node.add(clone.C.map((C) => unserializeNode(C)))
            return node
        }
        let obj = JSON.parse(json)
        if (typeof obj !== "object" || typeof obj.ASTy !== "object")
            throw new Error("unserialize: not an ASTy JSON export")
        return unserializeNode(obj.ASTy)
    }
}

