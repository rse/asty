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

describe("ASTy Library", function () {
    it("node base functionality", function () {
        var ASTy = require("../lib/asty.node.js");
        var ast = new ASTy("foo");
        expect(ast).to.be.a("object")
        expect(ast).to.include.keys("T", "L", "A", "P", "C")
        expect(ast.type()).to.be.equal("foo")
        expect(ast).to.respondTo("type")
        expect(ast).to.respondTo("dump")
    })
    it("node tree structure", function () {
        var ASTy = require("../lib/asty.node.js");
        var node1 = new ASTy("1");
        var node11 = new ASTy("1.1");
        var node12 = new ASTy("1.2");
        var node121 = new ASTy("1.2.1");
        var node122 = new ASTy("1.2.2");
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
        var ASTy = require("../lib/asty.node.js");
        ASTy.extend({
            foo: function (arg) {
                return "<" + arg + ">"
            }
        })
        var ast = new ASTy("foo");
        expect(ast).to.be.a("object")
        expect(ast).to.respondTo("foo")
        expect(ast.foo("bar")).to.be.equal("<bar>");
    })
})

