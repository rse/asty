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

export default class ASTYDump {
    /*  dump the AST recursively  */
    dump (maxDepth) {
        if (maxDepth === undefined)
            maxDepth = Infinity
        let out = ""
        this.walk((node, depth /*, parent, when */) => {
            if (depth > maxDepth)
                return
            for (let i = 0; i < depth; i++)
                out += "    "
            out += node.T + " "
            let keys = Object.keys(node.A)
            if (keys.length > 0) {
                out += "("
                let first = true
                keys.forEach((key) => {
                    if (!first)
                        out += ", "
                    else
                        first = false
                    out += key + ": "
                    let value = node.A[key]
                    switch (typeof value) {
                        case "string":
                            let hex = (ch) => ch.charCodeAt(0).toString(16).toUpperCase()
                            out += "\"" +
                                value.replace(/\\/g, "\\\\")
                                    .replace(/"/g, "\\\"")
                                    .replace(/\x08/g, "\\b")
                                    .replace(/\t/g, "\\t")
                                    .replace(/\n/g, "\\n")
                                    .replace(/\f/g, "\\f")
                                    .replace(/\r/g, "\\r")
                                    .replace(/[\x00-\x07\x0B\x0E\x0F]/g, (ch) => "\\x0" + hex(ch))
                                    .replace(/[\x10-\x1F\x80-\xFF]/g,    (ch) => "\\x"  + hex(ch))
                                    .replace(/[\u0100-\u0FFF]/g,         (ch) => "\\u0" + hex(ch))
                                    .replace(/[\u1000-\uFFFF]/g,         (ch) => "\\u"  + hex(ch)) +
                                "\""
                            break
                        case "object":
                            if (value instanceof RegExp)
                                out += value.source
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
            out += "[" + node.L.L + "/" + node.L.C + "]\n"
        }, "downward")
        return out
    }
}

