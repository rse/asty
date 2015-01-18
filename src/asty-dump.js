/*
**  ASTy -- Generic Abstract Syntax Tree (AST)
**  Copyright (c) 2014 Ralf S. Engelschall <rse@engelschall.com>
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

class ASTYDump {
    /*  dump the AST recursively  */
    dump () {
        var out = ""
        this.walk(function (node, depth /*, parent, when */) {
            for (var i = 0; i < depth; i++)
                out += "    "
            out += node.T + " "
            var keys = Object.keys(node.A)
            if (keys.length > 0) {
                out += "("
                var first = true
                keys.forEach(function (key) {
                    if (!first)
                        out += ", "
                    else
                        first = false
                    out += key + ": "
                    var value = node.A[key]
                    switch (typeof value) {
                        case "string":
                            out += "\"" + value.replace(/\n/, "\\n").replace(/"/, "\\\"") + "\""
                            break
                        case "object":
                            if (value instanceof RegExp)
                                out += "/" +
                                    value.toString()
                                    .replace(/^\//, "")
                                    .replace(/\/$/, "")
                                    .replace(/\//g, "\\/") +
                                "/"
                            else
                                out += JSON.stringify(value)
                            break
                        default:
                            out += JSON.stringify(value)
                            break
                    }
                })
                out += ") "
            }
            out += "[" + node.P.L + "/" + node.P.C + "]\n"
        }, "downward")
        return out
    }
}

module.exports = ASTYDump

