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

import type { ASTYNodeT, ASTYContext, ASTYAttributeSet, ASTYPositionInternal } from "./asty-base"

interface ASTYSerializedNode {
    T: string
    L: ASTYPositionInternal
    A?: ASTYAttributeSet
    C?: ASTYSerializedNode[]
}

interface ASTYSerializationWrapper {
    ASTy: ASTYSerializedNode
}

export default class ASTYSerialize {
    /*  recursively serialize AST nodes into JSON string  */
    static serialize (asty: ASTYContext, node: unknown): string {
        const serializeNode = (node: ASTYNodeT): ASTYSerializedNode => {
            const clone: ASTYSerializedNode = {
                T: node.T,
                L: { L: node.L.L, C: node.L.C, O: node.L.O }
            }
            const keys = Object.keys(node.A)
            if (keys.length > 0) {
                clone.A = {}
                keys.forEach((key) => {
                    const value = node.A[key]
                    switch (typeof value) {
                        case "boolean":
                        case "number":
                        case "string":
                            clone.A![key] = value
                            break
                        default:
                            /*  use the slow approach only for non-atomic attributes  */
                            clone.A![key] = structuredClone(value)
                            break
                    }
                })
            }
            if (node.C.length > 0)
                clone.C = node.C.map((C: ASTYNodeT) => serializeNode(C))
            return clone
        }
        if (!asty.isA(node))
            throw new Error("serialize: not an ASTy node")
        return JSON.stringify({ ASTy: serializeNode(node) })
    }

    /*  recursively unserialize JSON string into AST nodes  */
    static unserialize (asty: ASTYContext, json: string): ASTYNodeT {
        const unserializeNode = (clone: ASTYSerializedNode): ASTYNodeT => {
            if (   typeof clone !== "object" || clone === null
                || typeof clone.T !== "string"
                || typeof clone.L !== "object" || clone.L === null
                || typeof clone.L.L !== "number"
                || typeof clone.L.C !== "number"
                || typeof clone.L.O !== "number")
                throw new Error("unserialize: not an ASTy JSON export")
            const node = asty.create(clone.T)
            node.pos(clone.L.L, clone.L.C, clone.L.O)

            /*  no cloning needed, as JSON.parse already produced a fresh object graph  */
            if (typeof clone.A === "object" && clone.A !== null)
                Object.keys(clone.A).forEach((key) => {
                    node.set(key, clone.A![key])
                })
            if (Array.isArray(clone.C))
                node.add(clone.C.map((C: ASTYSerializedNode) => unserializeNode(C)))
            return node
        }
        const obj: ASTYSerializationWrapper = JSON.parse(json)
        if (   typeof obj !== "object" || obj === null
            || typeof obj.ASTy !== "object" || obj.ASTy === null)
            throw new Error("unserialize: not an ASTy JSON export")
        return unserializeNode(obj.ASTy)
    }
}
