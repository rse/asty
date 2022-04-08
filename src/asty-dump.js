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

const tree = {
    mid:  { unicode: String.fromCharCode(9500), ascii: "+" },
    last: { unicode: String.fromCharCode(9492), ascii: "+" },
    down: { unicode: String.fromCharCode(9474), ascii: "|" },
    left: { unicode: String.fromCharCode(9472), ascii: "-" }
}

export default class ASTYDump {
    /*  dump the AST recursively  */
    dump (maxDepth = Infinity, colorize = (type, txt) => txt, unicode = true) {
        let out = ""
        let self = this
        this.walk((node, depth /*, parent, when */) => {
            /*  short-circuit processing at a certain depth  */
            if (depth > maxDepth)
                return

            /*  draw tree structure  */
            if (depth > 0) {
                const nodeIndex = (node) => {
                    let nth = 0
                    let max = 0
                    if (node.P !== null) {
                        nth = node.P.C.indexOf(node)
                        max = node.P.C.length - 1
                    }
                    return { nth, max }
                }
                let { nth, max } = nodeIndex(node)
                let prefix = " "
                if (unicode)
                    prefix = `${tree.left.unicode}${tree.left.unicode}${prefix}`
                else
                    prefix = `${tree.left.ascii}${tree.left.ascii}${prefix}`
                if (nth < max)
                    prefix = `${unicode ? tree.mid.unicode : tree.mid.ascii}${prefix}`
                else
                    prefix = `${unicode ? tree.last.unicode : tree.last.ascii}${prefix}`
                for (let parent = node.P; parent !== null && parent !== self; parent = parent.P) {
                    if (parent.P !== null) {
                        let { nth, max } = nodeIndex(parent)
                        if (nth < max)
                            prefix = `${unicode ? tree.down.unicode : tree.down.ascii}   ${prefix}`
                        else
                            prefix = `    ${prefix}`
                    }
                }
                out += colorize("tree", prefix)
            }

            /*  draw node type  */
            out += colorize("type", node.T) + " "

            /*  draw node attributes  */
            let keys = Object.keys(node.A)
                .filter((key) => !key.match(/^__/))
            if (keys.length > 0) {
                out += colorize("parenthesis", "(")
                let first = true
                keys.forEach((key) => {
                    if (!first)
                        out += colorize("comma", ",") + " "
                    else
                        first = false
                    out += colorize("key", key) + colorize("colon", ":") + " "
                    let value = node.A[key]
                    switch (typeof value) {
                        case "boolean":
                        case "number":
                            out += colorize("value", value.toString())
                            break
                        case "string": {
                            let hex = (ch) => ch.charCodeAt(0).toString(16).toUpperCase()
                            /* eslint no-control-regex: off */
                            out += colorize("value", "\"" +
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
                                "\"")
                            break
                        }
                        case "object":
                            if (value instanceof RegExp)
                                out += colorize("value", "/" + value.source + "/")
                            else
                                out += colorize("value", JSON.stringify(value))
                            break
                        default:
                            out += colorize("value", JSON.stringify(value))
                            break
                    }
                })
                out += colorize("parenthesis", ")") + " "
            }

            /*  draw node position  */
            out += colorize("position",
                colorize("bracket", "[") +
                colorize("line", node.L.L) +
                colorize("slash", ",") +
                colorize("column", node.L.C) +
                colorize("bracket", "]"))

            out += "\n"
        }, "downward")
        return out
    }
}

