
ASTy
====

Abstract Syntax Tree (AST) Data Structure

<p/>
<img src="https://nodei.co/npm/asty.png?downloads=true&stars=true" alt=""/>

<p/>
<img src="https://david-dm.org/rse/asty.png" alt=""/>

Installation
------------

```shell
$ npm install asty
```

About
-----

ASTy is a Abstract Syntax Tree (AST) Data Structure library for JavaScript,
i.e., it provides a hierarchical data structure for holding the syntax
abstraction of an arbitrary formal language. It is usually used
in combination with a parser generator like [PEG.js](http://pegjs.org/)
(and then especially with its utility class [PEGUtil](http://github.com/rse/pegjs-util))
to carry the results of the parsing step and to provide the vehicle
for further processing those results.

Usage
-----

ASTy provides a context (`ASTYCtx` below) for the creation of AST node
(`ASTYNode` below). The tree of AST nodes is formed by linking child
AST nodes into a parent AST node. The ASTy API, here assumed to be
exposed through the variable `ASTY`, provides the following methods (in
a notation somewhat resembling TypeScript type definitions):

### ASTy Context (ASTYCtx)

- `new ASTY(): ASTYCtx`:<br/>
  Create a new instance of the ASTy context.
  It internally captures the prototype (`ASTYNode`) of the AST nodes to be created.

- `ASTYCtx#version(): { major: Number, minor: Number, micro: Number, date: Number }`:<br/>
  Return the ASTy version detals. The date is in numeric format `YYYYMMDD`.

- `ASTYCtx#extend(object: { [methodName: String]: [methodFunc: Function] }): ASTYCtx`:<br/>
  Extend the internal ASTYNode prototype with additional methods which are then available on each
  ASTYNode instance when created with `ASTYCtx#create`. This should be used by ASTy extension modules only.

- `ASTYCtx#create(type: String, attrs?: {[name: String]: [value: Object]}, childs?: ASTY[]): ASTYNode`:<br/>
  Create a new ASTYNode instance of `type` and optionally already set attributes and add child nodes.

- `ASTYCtx#isA(object: Object): Boolean`:<br/>
  Check whether `object` is an ASTYNode instance.

- `static ASTYCtx::serialize(node: ASTYNode): String`:<br/>
  Serializes (formats) ASTy nodes to JSON string. Use this for exporting an AST.

- `static ASTYCtx::unserialize(json: String): ASTYNode`:<br/>
  Unserializes (parses) JSON string to ASTy nodes. Use this for importing an AST.

### ASTy Node (ASTYNode)

- `ASTYNode#create(type: String, attrs?: {[name: String]: [value: Object]}, childs?: ASTY[]): ASTYNode`:<br/>
  Create a new ASTYNode instance of `type` and optionally already set attributes and add child nodes.

- `ASTYNode#merge(node: Node, takePos?: Boolean, attrMap?: {[from: String]: [to: (String|null)})): ASTYNode`:<br/>
  Merge attributes, childs and optionally the position of a node.
  The attributes can be renamed or skipped (if mapped onto `null`).

- `ASTYNode#type(type: String): Boolean`:<br/>
  `ASTYNode#type(): String`:<br/>
  Set or get type of node.

- `ASTYNode#pos(line: Number, column: Number, offset: Number): ASTYNode`:<br/>
  `ASTYNode#pos(): { line: Number, column: Number, offset: Number }`:<br/>
  Set or get the position for the node.

- `ASTYNode#set(name: String, value: Object): ASTYNode`:<br/>
  `ASTYNode#set({ [String]: Object }): ASTYNode`:<br/>
  Set a single attribute `name` to `value` or set multiple
  attributes to their corresponding value.

- `ASTYNode#unset(name: String): ASTYNode`:<br/>
  `ASTYNode#unset(names: String[]): ASTYNode`:<br/>
  Unset a single attribute `name` or unset multiple attributes.

- `ASTYNode#set({ [name: String]: [value: Object] }): ASTYNode`:<br/>
  Set multiple attributes, each consisting of name and value pairs.

- `ASTYNode#get(name: String): Object`:<br/>
  `ASTYNode#get(names: String[]): Object[]`:<br/>
  Get value of a particular attribute `name`,
  or get array of values corresponding to each name in `names`.

- `ASTYNode#attrs(): String[]`:<br/>
  Get names of all node attributes.

- `ASTYNode#nth(): Number`:<br/>
  Get position among sibling nodes in parent's child node list.
  The positions start at 0.

- `ASTYNode#ins(pos: Number, childs: ASTYNode[]): ASTYNode`:<br/>
  Add one or more childs to a node, at a fixed position `pos`. The array `childs`
  can either contain ASTYNode objects or even arrays of ASTYNode objects.
  If `pos` is negative it counts from the end of child list,
  with `-1` the position after the last existing child.

- `ASTYNode#add(childs: ASTYNode[]): ASTYNode`:<br/>
  Add one or more childs to a node, at the end of the child list. The array `childs`
  can either contain ASTYNode objects or even arrays of ASTYNode objects.

- `ASTYNode#del(childs: ASTYNode[]): ASTYNode`:<br/>
  Delete one or more childs from a node.

- `ASTYNode#childs(begin?: Number, end?: Number): ASTYNode[]`:<br/>
  Get a nodes list of all or some childs. The `begin` and `end` parameters
  are passed-through to `Array::slice`. If the range from `begin` to `end` is
  out of range, an empty array is returned.

- `ASTYNode#child(pos: Number): ASTYNode`:<br/>
  Get a particular child node. If `pos` is out of range, `null` is returned.

- `ASTYNode#parent(): ASTYNode`:<br/>
  Get parent node.

- `ASTYNode#walk(callback: (node: ASTYNode, depth: Number, parent: ASTYNode, when: String) => Void, when?: String): ASTYNode`:<br/>
  Recursively walk the AST starting at this node (at depth 0). For
  each visited node the `callback` function is called with the
  current node, the current node's tree depth, the current node's
  parent node and the current walking situation.  By default (and
  if `when` is either `downward` or `both`), the callback is called
  in the downward phase, i.e., before(!) all child nodes will be
  visited, and with `when` set to `downward`. If `when` is set to
  `upward` or `both`, the callback is called in the upward phase,
  i.e., after(!) all child nodes were visited, and with `when` set
  to `upward`.

- `ASTYNode#dump(maxDepth?: Number, colorize?: (type: String, text: String) => String, unicode?: Boolean): String`:<br/>
  Returns a textual dump of the AST starting at the current node. By
  default `maxDepth` is `Infinity` and this way the whole AST below the
  current node is dumped. If `maxDepth` is `0` only the current node is
  dumped. If `maxDepth` is `1` the current node and all its direct child
  nodes are dumped. The parameter `colorize` is an optional callback function,
  intended to colorize the output `text` fragments according to their `type`.
  The following `type` strings are supported: `tree`, `type`, `parenthesis`, `comma`,
  `key`, `colon`, `value`, `position`, `bracket`, `line`, `slash`, and `column`.
  If `unicode` is set to `false`, ASCII substitution characters are used
  for the tree structure.

- `ASTYNode#serialize(): String`:<br/>
  Recursively serializes the AST node to JSON.
  Use this for exporting.

Implementation Notice
---------------------

Although ASTy is written in ECMAScript 2018, it is transpiled to older
environments and this way runs in really all current (as of 2018)
JavaScript environments, of course.

Additionally, there are two transpilation results: first, there is a
compressed `asty.browser.js` for Browser environments. Second, there is
an uncompressed `asty.node.js` for Node.js environments.

Alternatives
------------

A few decent alternatives to ASTy exist:

- [UniST](https://github.com/syntax-tree/unist) and [UniST Builder](https://github.com/syntax-tree/unist-builder)
- [estree](https://github.com/estree/estree)
- [AST-Types](https://www.npmjs.com/package/ast-types)

License
-------

Copyright (c) 2014-2022 Dr. Ralf S. Engelschall (http://engelschall.com/)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

