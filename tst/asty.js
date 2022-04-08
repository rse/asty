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

/* global describe: false */
/* global it: false */
/* jshint -W030 */
/* eslint no-unused-expressions: 0 */

const chai = require("chai")
const expect = chai.expect
chai.config.includeStack = true

const ASTy = require("../lib/asty.node.js")

describe("ASTy Library", function () {
    it("node base functionality", function () {
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
    it("node tree structure", function () {
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
    it("node extension functionality", function () {
        const asty = new ASTy()
        asty.extend({
            foo: function (arg) {
                return "<" + arg + ">"
            }
        })
        const node = asty.create("foo")
        expect(node).to.be.a("object")
        expect(node).to.respondTo("foo")
        expect(node.foo("bar")).to.be.equal("<bar>")
    })
    it("node serialize/unserialize functionality", function () {
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
})

