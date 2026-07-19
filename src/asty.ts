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

import ASTYBase      from "./asty-base"
import ASTYMerge     from "./asty-merge"
import ASTYWalk      from "./asty-walk"
import ASTYDump      from "./asty-dump"
import ASTYSerialize from "./asty-serialize"
import pkg           from "../package.json"
import type { ASTYNodeT as ASTYNode, ASTYAttributeSet, ASTYChildSpec } from "./asty-base"

/*  the composed public AST node type, declared in asty-base.ts (to
    avoid a circular module import) and re-exported here under its
    public name, together with the auxiliary public types  */
export type {
    ASTYNodeT as ASTYNode,
    ASTYContext,
    ASTYPosition,
    ASTYPositionInternal,
    ASTYAttributeValue,
    ASTYAttributeSet,
    ASTYChildSpec
} from "./asty-base"
export type { ASTYWalkDirection, ASTYWalkCallback } from "./asty-walk"

interface ASTYMixin {
    [ key: string ]: any
}

interface ASTYVersion {
    major: number
    minor: number
    micro: number
    date:  string
}

export default class ASTYCtx {
    public ASTYNode: new () => ASTYNode

    constructor () {
        /*  synthesize a fresh, per-context AST node class  */
        this.ASTYNode = class ASTYNode {} as unknown as new () => ASTYNode

        /*  the mixin classes and the methods contributed by each  */
        const mixins: Array<[any, ...string[]]> = [
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

        /*  copy the mixin methods onto the node prototype  */
        mixins.forEach((mixin) => {
            const proto = (mixin[0] as any).prototype
            mixin.slice(1).forEach((method) => {
                (this.ASTYNode.prototype as any)[method] = proto[method]
            })
        })
    }

    version (): ASTYVersion {
        const m = pkg.version.match(/^(\d+)\.(\d+)\.(\d+)$/)
        if (m === null)
            throw new Error("failed to parse own version")
        const [ , major, minor, micro ] = m
        return {
            major: Number.parseInt(major, 10),
            minor: Number.parseInt(minor, 10),
            micro: Number.parseInt(micro, 10),
            date:  pkg["x-date"] ?? "????-??-??"
        } satisfies ASTYVersion
    }

    extend (mixin: ASTYMixin): this {
        for (const method in mixin)
            if (Object.hasOwn(mixin, method))
                (this.ASTYNode.prototype as any)[method] = mixin[method]
        return this
    }

    create (type?: string, attrs?: ASTYAttributeSet, childs?: ASTYChildSpec[]): ASTYNode {
        return (new this.ASTYNode()).init(this, type, attrs, childs)
    }

    isA (node: unknown): node is ASTYNode {
        return (node instanceof this.ASTYNode
            && node.ASTy === true)
    }

    __serialize (node: ASTYNode): string {
        return ASTYSerialize.serialize(this, node)
    }

    static serialize (node: ASTYNode): string {
        return ASTYSerialize.serialize(node.ctx, node)
    }

    static unserialize (json: string): ASTYNode {
        return ASTYSerialize.unserialize(new ASTYCtx(), json)
    }
}
