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

/*  the external AST node parsing position  */
export interface ASTYPosition {
    line:   number
    column: number
    offset: number
}

/*  the internal AST node parsing position (compact storage form)  */
export interface ASTYPositionInternal {
    L: number
    C: number
    O: number
}

/*  the attribute value and attribute set types  */
export type ASTYAttributeValue = any
export type ASTYAttributeSet = { [ key: string ]: ASTYAttributeValue }

/*  the composed public AST node type. It is declared here (instead of
    in asty.ts, where it is composed and re-exported from) so that the
    mixin classes can refer to the full node type without creating a
    circular module import.  */
export interface ASTYNodeT extends ASTYBase {
    merge (node: ASTYNodeT, takePos?: boolean, attrMap?: { [ sourceAttr: string ]: string | null }): this
    walk (cb: (node: ASTYNodeT, depth: number, parent: ASTYNodeT | null, when?: string) => void,
        when?: "downward" | "upward" | "both"): this
    dump (maxDepth?: number, colorize?: (type: string, txt: string) => string, unicode?: boolean): string
}

/*  the child AST node specification, as accepted by ins/add/del  */
export type ASTYChildSpec = ASTYNodeT | ASTYChildSpec[]

/*  the AST context, as seen by the AST nodes and the mixin classes  */
export interface ASTYContext {
    isA(node: any): node is ASTYNodeT
    create(T?: string, A?: ASTYAttributeSet, C?: ASTYChildSpec[]): ASTYNodeT
    __serialize(node: ASTYNodeT): string
}

export default class ASTYBase {
    public ctx!:  ASTYContext
    public ASTy!: boolean
    public T!:    string
    public L!:    ASTYPositionInternal
    public A!:    ASTYAttributeSet
    public C!:    ASTYNodeT[]
    public P!:    ASTYNodeT | null

    /*  AST node initialization  */
    init (this: ASTYNodeT, ctx: ASTYContext, T?: string, A?: ASTYAttributeSet, C?: ASTYChildSpec[]): ASTYNodeT {
        if (arguments.length < 2)
            throw new Error("init: invalid number of arguments")
        this.ctx = ctx
        this.ASTy = true
        this.T = T ?? ""
        this.L = { L: 0, C: 0, O: 0 }
        this.A = {}
        this.C = []
        this.P = null
        if (typeof A === "object" && A !== null)
            for (const name in A)
                if (Object.hasOwn(A, name))
                    this.set(name, A[name])
        if (typeof C === "object" && Array.isArray(C))
            this.add(C)
        return this
    }

    /*  create new AST node  */
    create (T?: string, A?: ASTYAttributeSet, C?: ASTYChildSpec[]): ASTYNodeT {
        return this.ctx.create(T, A, C)
    }

    /*  check the type of an AST node  */
    type (): string
    type (T: string): this
    type (T?: string): string | this {
        if (arguments.length === 0)
            return this.T
        else if (arguments.length === 1) {
            this.T = T!
            return this
        }
        else
            throw new Error("type: invalid number of arguments")
    }

    /*  set the parsing position   */
    pos (): ASTYPosition
    pos (line: number, column?: number, offset?: number): this
    pos (line?: number, column?: number, offset?: number): ASTYPosition | this {
        if (arguments.length === 0)
            return {
                line:   this.L.L,
                column: this.L.C,
                offset: this.L.O
            }
        else if (arguments.length <= 3) {
            this.L.L = line   ?? 0
            this.L.C = column ?? 0
            this.L.O = offset ?? 0
            return this
        }
        else
            throw new Error("pos: invalid number of arguments")
    }

    /*  set AST node attributes  */
    set (attrs: ASTYAttributeSet): this
    set (key: string, value: ASTYAttributeValue): this
    set (...args: any[]): this {
        if (   args.length === 1
            && typeof args[0] === "object") {
            Object.keys(args[0]).forEach((key) => {
                if (args[0][key] !== undefined)
                    this.A[key] = args[0][key]
                else
                    delete this.A[key]
            })
        }
        else if (args.length === 2) {
            if (args[1] !== undefined)
                this.A[args[0]] = args[1]
            else
                delete this.A[args[0]]
        }
        else
            throw new Error("set: invalid number of arguments")
        return this
    }

    /*  unset AST node attributes  */
    unset (key: string | string[]): this
    unset (...args: any[]): this {
        if (   args.length === 1
            && typeof args[0] === "object"
            && Array.isArray(args[0])   ) {
            args[0].forEach((key: string) => {
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
    get (key: string | string[]): ASTYAttributeValue
    get (...args: any[]): any {
        if (args.length !== 1)
            throw new Error("get: invalid number of arguments")
        if (typeof args[0] === "object" && Array.isArray(args[0])) {
            return args[0].map((key: string) => {
                if (typeof key !== "string")
                    throw new Error("get: invalid key argument")
                return this.A[key]
            })
        }
        else {
            const key = args[0]
            if (typeof key !== "string")
                throw new Error("get: invalid key argument")
            return this.A[key]
        }
    }

    /*  get names of all AST node attributes  */
    attrs (): string[] {
        return Object.keys(this.A)
    }

    /*  return current sibling position  */
    nth (this: ASTYNodeT): number {
        if (this.P === null)
            return 0
        const idx = this.P.C.indexOf(this)
        if (idx < 0)
            throw new Error("nth: internal error -- node not in childs of its parent")
        return idx
    }

    /*  insert child AST node(s)  */
    ins (this: ASTYNodeT, pos: number, ...args: ASTYChildSpec[]): ASTYNodeT {
        if (args.length === 0)
            throw new Error("ins: invalid number of arguments")
        if (pos < 0)
            pos = this.C.length + pos
        if (!(pos >= 0 && pos <= this.C.length))
            throw new Error("ins: invalid position")
        const _ins = (node: ASTYChildSpec) => {
            if (!this.ctx.isA(node))
                throw new Error("ins: invalid AST node argument")
            this.C.splice(pos++, 0, node)
            node.P = this
        }
        args.forEach((arg) => {
            if (typeof arg === "object" && Array.isArray(arg))
                arg.forEach((child) => { _ins(child) })
            else if (arg !== null)
                _ins(arg)
        })
        return this
    }

    /*  add child AST node(s)  */
    add (this: ASTYNodeT, ...args: ASTYChildSpec[]): ASTYNodeT {
        if (args.length === 0)
            throw new Error("add: invalid number of arguments")
        const _add = (node: ASTYChildSpec) => {
            if (!this.ctx.isA(node))
                throw new Error("add: invalid AST node argument")
            this.C.push(node)
            node.P = this
        }
        args.forEach((arg) => {
            if (typeof arg === "object" && Array.isArray(arg))
                arg.forEach((child) => { _add(child) })
            else if (arg !== null)
                _add(arg)
        })
        return this
    }

    /*  delete child AST node(s)  */
    del (this: ASTYNodeT, ...args: ASTYNodeT[]): ASTYNodeT {
        if (args.length === 0)
            throw new Error("del: invalid number of arguments")
        args.forEach((node) => {
            if (!this.ctx.isA(node))
                throw new Error("del: invalid AST node argument")
            const idx = this.C.indexOf(node)
            if (idx < 0)
                throw new Error("del: AST node not found in childs")
            this.C.splice(idx, 1)
            node.P = null
        })
        return this
    }

    /*  get all or some child AST nodes  */
    childs (start?: number, end?: number): ASTYNodeT[]
    childs (...args: any[]): ASTYNodeT[] {
        if (args.length > 2)
            throw new Error("childs: invalid number of arguments")
        if (args.length === 2 && typeof args[0] === "number" && typeof args[1] === "number")
            return this.C.slice(args[0], args[1])
        else if (args.length === 1 && typeof args[0] === "number")
            return this.C.slice(args[0])
        else if (args.length === 0)
            return this.C
        else
            throw new Error("childs: invalid type of arguments")
    }

    /*  get one child AST node  */
    child (pos: number): ASTYNodeT | null {
        if (typeof pos !== "number")
            throw new Error("child: invalid argument")
        return (pos < this.C.length ? this.C[pos] : null)
    }

    /*  get parent AST node  */
    parent (): ASTYNodeT | null {
        return this.P
    }

    /*  serialize AST node recursively  */
    serialize (this: ASTYNodeT): string {
        return this.ctx.__serialize(this)
    }
}
