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

import { expect } from "chai"

import ASTy from ".."

describe("ASTy Library", function () {
    it("node base functionality", () => {
        const asty = new ASTy()
        const node = asty.create("foo")
        expect(asty.isA(node)).to.be.true
        expect(node).to.be.a("object")
        expect(node).to.include.keys("T", "L", "A", "P", "C")
        expect(node.type()).to.be.equal("foo")
        expect(node).to.respondTo("type")
        expect(node).to.respondTo("dump")
        const node2 = node.create("foo")
        expect(asty.isA(node2)).to.be.true
    })
    it("node tree structure", () => {
        const asty = new ASTy()
        const node1 = asty.create("1")
        const node11 = asty.create("1.1")
        const node12 = asty.create("1.2")
        const node121 = asty.create("1.2.1")
        const node122 = asty.create("1.2.2")
        node1.add(node11, node12)
        node12.add(node121, node122)
        expect(node1.parent()).to.be.equal(null)
        expect(node1.childs()).to.have.members([ node11, node12 ])
        expect(node12.parent()).to.be.equal(node1)
        expect(node12.childs()).to.have.members([ node121, node122 ])
        expect(node121.parent()).to.be.equal(node12)
        expect(node122.parent()).to.be.equal(node12)
    })
    it("node extension functionality", () => {
        const asty = new ASTy()
        asty.extend({
            foo: function (arg: string): string {
                return "<" + arg + ">"
            }
        })
        const node = asty.create("foo")
        expect(node).to.be.a("object")
        expect(node).to.respondTo("foo")
        expect(node.foo("bar")).to.be.equal("<bar>")
    })
    it("node serialize/unserialize functionality", () => {
        const asty = new ASTy()
        const node1 = asty.create("1")
        node1.set("foo", "bar")
        expect(node1.get("foo")).to.be.equal("bar")
        node1.unset("foo")
        expect(node1.get("foo")).to.be.equal(undefined)
        node1.set("foo", "bar")
        node1.unset([ "foo" ])
        expect(node1.get("foo")).to.be.equal(undefined)
        node1.set("foo", { bar: 42, quux: "7" })
        const node11 = asty.create("1.1")
        const node12 = asty.create("1.2")
        const node121 = asty.create("1.2.1")
        const node122 = asty.create("1.2.2")
        node1.add(node11, node12)
        node12.add(node121, node122)
        const dump1 = node1.dump()
        const dump2 = ASTy.unserialize(ASTy.serialize(node1)).dump()
        expect(dump1).to.be.equal(dump2)
        const dump3 = ASTy.unserialize(node1.serialize()).dump()
        expect(dump1).to.be.equal(dump3)
    })
    it("context version functionality", () => {
        const asty = new ASTy()
        const version = asty.version()
        expect(version).to.include.keys("major", "minor", "micro", "date")
        expect(version.major).to.be.a("number")
        expect(version.minor).to.be.a("number")
        expect(version.micro).to.be.a("number")
        expect(version.date).to.be.a("string")
        expect(version.date).to.match(/^(?:\d{4}-\d{2}-\d{2}|\?{4}-\?{2}-\?{2})$/)
    })
    it("context create functionality", () => {
        const asty = new ASTy()
        const child1 = asty.create("child1")
        const child2 = asty.create("child2")
        const node = asty.create("root", { foo: "bar", quux: 42 }, [ child1, child2 ])
        expect(node.type()).to.be.equal("root")
        expect(node.get("foo")).to.be.equal("bar")
        expect(node.get("quux")).to.be.equal(42)
        expect(node.childs()).to.have.members([ child1, child2 ])
        const empty = asty.create()
        expect(empty.type()).to.be.equal("")
        expect(empty.attrs()).to.be.deep.equal([])
        expect(empty.childs()).to.be.deep.equal([])
    })
    it("context isA functionality", () => {
        const asty1 = new ASTy()
        const asty2 = new ASTy()
        const node = asty1.create("foo")
        expect(asty1.isA(node)).to.be.true
        expect(asty2.isA(node)).to.be.false
        expect(asty1.isA(null)).to.be.false
        expect(asty1.isA(undefined)).to.be.false
        expect(asty1.isA(42)).to.be.false
        expect(asty1.isA({ ASTy: true })).to.be.false
    })
    it("node type functionality", () => {
        const asty = new ASTy()
        const node = asty.create("foo")
        expect(node.type()).to.be.equal("foo")
        expect(node.type("bar")).to.be.equal(node)
        expect(node.type()).to.be.equal("bar")
    })
    it("node position functionality", () => {
        const asty = new ASTy()
        const node = asty.create("foo")
        expect(node.pos()).to.be.deep.equal({ line: 0, column: 0, offset: 0 })
        expect(node.pos(1, 2, 3)).to.be.equal(node)
        expect(node.pos()).to.be.deep.equal({ line: 1, column: 2, offset: 3 })
        node.pos(7)
        expect(node.pos()).to.be.deep.equal({ line: 7, column: 0, offset: 0 })
        node.pos(7, 8)
        expect(node.pos()).to.be.deep.equal({ line: 7, column: 8, offset: 0 })
    })
    it("node attribute functionality", () => {
        const asty = new ASTy()
        const node = asty.create("foo")
        expect(node.attrs()).to.be.deep.equal([])
        node.set({ foo: "bar", quux: 42 })
        expect(node.attrs()).to.have.members([ "foo", "quux" ])
        expect(node.get([ "foo", "quux" ])).to.be.deep.equal([ "bar", 42 ])
        node.set("foo", undefined)
        expect(node.attrs()).to.have.members([ "quux" ])
        node.set({ quux: undefined })
        expect(node.attrs()).to.be.deep.equal([])
        node.set({ a: 1, b: 2, c: 3 })
        node.unset([ "a", "b" ])
        expect(node.attrs()).to.be.deep.equal([ "c" ])
        expect(() => (node as any).set()).to.throw()
        expect(() => (node as any).unset()).to.throw()
        expect(() => (node as any).get()).to.throw()
        expect(() => (node as any).get(42)).to.throw()
        expect(() => (node as any).get([ 42 ])).to.throw()
    })
    it("node child access functionality", () => {
        const asty = new ASTy()
        const root = asty.create("root")
        const c0 = asty.create("c0")
        const c1 = asty.create("c1")
        const c2 = asty.create("c2")
        root.add(c0, c1, c2)
        expect(root.childs()).to.be.deep.equal([ c0, c1, c2 ])
        expect(root.childs(1)).to.be.deep.equal([ c1, c2 ])
        expect(root.childs(0, 2)).to.be.deep.equal([ c0, c1 ])
        expect(root.childs(5)).to.be.deep.equal([])
        expect(root.child(0)).to.be.equal(c0)
        expect(root.child(2)).to.be.equal(c2)
        expect(root.child(3)).to.be.equal(null)
        expect(() => (root as any).child("x")).to.throw()
        expect(() => (root as any).childs(1, 2, 3)).to.throw()
    })
    it("node sibling position functionality", () => {
        const asty = new ASTy()
        const root = asty.create("root")
        const c0 = asty.create("c0")
        const c1 = asty.create("c1")
        root.add(c0, c1)
        expect(root.nth()).to.be.equal(1)
        expect(c0.nth()).to.be.equal(0)
        expect(c1.nth()).to.be.equal(1)
    })
    it("node add functionality", () => {
        const asty = new ASTy()
        const root = asty.create("root")
        const c0 = asty.create("c0")
        const c1 = asty.create("c1")
        const c2 = asty.create("c2")
        expect(root.add(c0)).to.be.equal(root)
        root.add([ c1, c2 ])
        expect(root.childs()).to.be.deep.equal([ c0, c1, c2 ])
        expect(c1.parent()).to.be.equal(root)
        expect(() => (root as any).add()).to.throw()
        expect(() => (root as any).add("nonode")).to.throw()
    })
    it("node insert functionality", () => {
        const asty = new ASTy()
        const root = asty.create("root")
        const c0 = asty.create("c0")
        const c1 = asty.create("c1")
        const c2 = asty.create("c2")
        root.add(c0, c2)
        expect(root.ins(1, c1)).to.be.equal(root)
        expect(root.childs()).to.be.deep.equal([ c0, c1, c2 ])
        expect(c1.parent()).to.be.equal(root)
        const c3 = asty.create("c3")
        const c4 = asty.create("c4")
        root.ins(0, [ c3, c4 ])
        expect(root.childs()).to.be.deep.equal([ c3, c4, c0, c1, c2 ])
        expect(() => (root as any).ins(0)).to.throw()
        expect(() => root.ins(99, asty.create("x"))).to.throw()
        expect(() => (root as any).ins(0, "nonode")).to.throw()
    })
    it("node delete functionality", () => {
        const asty = new ASTy()
        const root = asty.create("root")
        const c0 = asty.create("c0")
        const c1 = asty.create("c1")
        const c2 = asty.create("c2")
        root.add(c0, c1, c2)
        expect(root.del(c1)).to.be.equal(root)
        expect(root.childs()).to.be.deep.equal([ c0, c2 ])
        expect(c1.parent()).to.be.equal(null)
        root.del(c0, c2)
        expect(root.childs()).to.be.deep.equal([])
        expect(() => (root as any).del()).to.throw()
        expect(() => (root as any).del("nonode")).to.throw()
        expect(() => root.del(c0)).to.throw()
    })
    it("node walk functionality", () => {
        const asty = new ASTy()
        const node1 = asty.create("1")
        const node11 = asty.create("1.1")
        const node12 = asty.create("1.2")
        const node121 = asty.create("1.2.1")
        node1.add(node11, node12)
        node12.add(node121)
        const downward: string[] = []
        expect(node1.walk((node, depth, parent, when) => {
            expect(when).to.be.equal("downward")
            expect(depth).to.be.a("number")
            expect(parent === null || asty.isA(parent)).to.be.true
            downward.push(`${node.type()}@${depth}`)
        })).to.be.equal(node1)
        expect(downward).to.be.deep.equal([ "1@0", "1.1@1", "1.2@1", "1.2.1@2" ])
        const upward: string[] = []
        node1.walk((node) => { upward.push(node.type()) }, "upward")
        expect(upward).to.be.deep.equal([ "1.1", "1.2.1", "1.2", "1" ])
        const both: string[] = []
        node1.walk((node, depth, parent, when) => { both.push(`${when}:${node.type()}`) }, "both")
        expect(both).to.be.deep.equal([
            "downward:1", "downward:1.1", "upward:1.1", "downward:1.2",
            "downward:1.2.1", "upward:1.2.1", "upward:1.2", "upward:1"
        ])
        const parents: Array<string | null> = []
        node1.walk((node, depth, parent) => { parents.push(parent === null ? null : parent.type()) })
        expect(parents).to.be.deep.equal([ null, "1", "1", "1.2" ])
    })
    it("node merge functionality", () => {
        const asty = new ASTy()
        const root = asty.create("root")
        const target = asty.create("target")
        const source = asty.create("source", { foo: "bar", baz: "quux", drop: 1 })
        const child = asty.create("child")
        source.add(child)
        source.pos(1, 2, 3)
        root.add(target, source)
        expect(target.merge(source, true, { baz: "renamed", drop: null })).to.be.equal(target)
        expect(target.get("foo")).to.be.equal("bar")
        expect(target.get("renamed")).to.be.equal("quux")
        expect(target.get("baz")).to.be.equal(undefined)
        expect(target.get("drop")).to.be.equal(undefined)
        expect(target.childs()).to.be.deep.equal([ child ])
        expect(child.parent()).to.be.equal(target)
        expect(target.pos()).to.be.deep.equal({ line: 1, column: 2, offset: 3 })
        expect(root.childs()).to.be.deep.equal([ target ])
        expect(target.merge(null)).to.be.equal(target)
        const untouched = asty.create("untouched")
        untouched.merge(asty.create("other"))
        expect(untouched.pos()).to.be.deep.equal({ line: 0, column: 0, offset: 0 })
        expect(() => (untouched as any).merge("nonode")).to.throw()
    })
    it("node dump functionality", () => {
        const asty = new ASTy()
        const root = asty.create("root", { str: "a\"b\n", num: 42, bool: true, re: /x/, obj: { a: 1 } })
        const c0 = asty.create("c0")
        const c1 = asty.create("c1")
        const c00 = asty.create("c00")
        root.add(c0, c1)
        c0.add(c00)
        c0.pos(3, 4, 5)
        const dump = root.dump()
        expect(dump).to.be.a("string")
        expect(dump).to.match(/^root \(/)
        expect(dump).to.contain("str: \"a\\\"b\\n\"")
        expect(dump).to.contain("num: 42")
        expect(dump).to.contain("bool: true")
        expect(dump).to.contain("re: /x/")
        expect(dump).to.contain("obj: {\"a\":1}")
        expect(dump).to.contain("[3,4]")
        expect(dump.split("\n").filter((line) => line !== "")).to.have.lengthOf(4)
        const dump0 = root.dump(0)
        expect(dump0.split("\n").filter((line) => line !== "")).to.have.lengthOf(1)
        const dump1 = root.dump(1)
        expect(dump1.split("\n").filter((line) => line !== "")).to.have.lengthOf(3)
        const ascii = root.dump(Infinity, (type, txt) => txt, false)
        expect(ascii).to.contain("+-- ")
        expect(ascii).to.not.contain(String.fromCharCode(9500))
        const types: string[] = []
        root.dump(Infinity, (type, txt) => { types.push(type); return txt })
        expect(types).to.include.members([
            "tree", "type", "parenthesis", "comma", "key",
            "colon", "value", "position", "bracket", "line", "column"
        ])
        const hidden = asty.create("hidden", { __internal: 1 })
        expect(hidden.dump()).to.not.contain("__internal")
    })
    it("node serialization round-trip functionality", () => {
        const asty = new ASTy()
        const root = asty.create("root", { str: "s", num: 1, bool: false, obj: { a: [ 1, 2 ] } })
        const child = asty.create("child", { x: 1 })
        root.add(child)
        root.pos(1, 2, 3)
        const json = root.serialize()
        expect(json).to.be.a("string")
        expect(JSON.parse(json)).to.have.property("ASTy")
        const clone = ASTy.unserialize(json)
        expect(asty.isA(clone)).to.be.false
        expect(clone.type()).to.be.equal("root")
        expect(clone.pos()).to.be.deep.equal({ line: 1, column: 2, offset: 3 })
        expect(clone.get("obj")).to.be.deep.equal({ a: [ 1, 2 ] })
        expect(clone.childs()).to.have.lengthOf(1)
        expect(clone.child(0)!.type()).to.be.equal("child")
        expect(clone.dump()).to.be.equal(root.dump())
        expect(() => ASTy.serialize({} as any)).to.throw()
        expect(() => ASTy.unserialize("{}")).to.throw()
    })
    it("node extension chaining functionality", () => {
        const asty = new ASTy()
        expect(asty.extend({
            first: function (this: any): string { return this.type() }
        })).to.be.equal(asty)
        asty.extend({
            second: function (): number { return 42 }
        })
        const node = asty.create("foo") as any
        expect(node.first()).to.be.equal("foo")
        expect(node.second()).to.be.equal(42)
        const other = new ASTy()
        expect(other.create("foo")).to.not.respondTo("first")
    })
})

