
ASTy
====

Abstract Syntax Tree (AST) Data Structure

[![github (author stars)](https://img.shields.io/github/stars/rse?logo=github&label=author%20stars&color=%233377aa)](https://github.com/rse)
[![github (author followers)](https://img.shields.io/github/followers/rse?label=author%20followers&logo=github&color=%234477aa)](https://github.com/rse)
<br/>
[![npm (project release)](https://img.shields.io/npm/v/asty?logo=npm&label=npm%20release&color=%23cc3333)](https://npmjs.com/asty)
[![npm (project downloads)](https://img.shields.io/npm/dm/asty?logo=npm&label=npm%20downloads&color=%23cc3333)](https://npmjs.com/asty)

Installation
------------

```shell
$ npm install asty
```

About
-----

ASTy is a Abstract Syntax Tree (AST) Data Structure library for JavaScript/TypeScript,
i.e., it provides a hierarchical data structure for holding the syntax
abstraction of an arbitrary formal language. It is usually used
in combination with a parser generator like [Peggy.js](https://peggyjs.org/)
to carry the results of the parsing step and to provide the vehicle
for further processing those results.

Usage
-----

ASTy provides a context (`ASTYCtx` below) for the creation of AST node
(`ASTYNode` below). The tree of AST nodes is formed by linking child
AST nodes into a parent AST node. The ASTy API, here assumed to be
exposed through the variable `ASTY`, provides the following methods (in
TypeScript type definition notation):

### ASTy Types

The following auxiliary types are exported alongside `ASTYCtx` (the
default export) and `ASTYNode`:

- `type ASTYAttributeValue = any`:<br/>
  The value of a single AST node attribute. Attribute values are
  arbitrary, as ASTy does not constrain what an application stores.

- `type ASTYAttributeSet = { [ key: string ]: ASTYAttributeValue }`:<br/>
  A set of AST node attributes, as name and value pairs.

- `type ASTYChildSpec = ASTYNode | ASTYChildSpec[]`:<br/>
  A child AST node specification, as accepted by `ASTYNode#ins`,
  `ASTYNode#add` and `ASTYCtx#create`. It is either a single AST node
  or an arbitrarily nested array of AST nodes.

- `interface ASTYContext`:<br/>
  The AST context, as seen by the AST nodes. It is the type of the
  `ASTYNode#ctx` field and is satisfied by `ASTYCtx`.

- `interface ASTYPosition { line: number, column: number, offset: number }`:<br/>
  The parsing position of an AST node, as returned by `ASTYNode#pos`.

- `interface ASTYPositionInternal { L: number, C: number, O: number }`:<br/>
  The compact storage form of the parsing position, as held in the
  `ASTYNode#L` field. Prefer `ASTYNode#pos` over accessing this directly.

- `type ASTYWalkDirection = "downward" | "upward" | "both"`:<br/>
  The walking direction, as accepted by `ASTYNode#walk`.

- `type ASTYWalkCallback = (node: ASTYNode, depth: number, parent: ASTYNode | null, when?: string) => void`:<br/>
  The callback function, as accepted by `ASTYNode#walk`.

### ASTy Context (ASTYCtx)

- `new ASTY(): ASTYCtx`:<br/>
  Create a new instance of the ASTy context.
  It internally captures the prototype (`ASTYNode`) of the AST nodes to be created.

- `ASTYCtx#version(): { major: number, minor: number, micro: number, date: string }`:<br/>
  Return the ASTy version detals. The date is in string format `YYYY-MM-DD`.

- `ASTYCtx#extend(mixin: { [ methodName: string ]: any }): this`:<br/>
  Extend the internal ASTYNode prototype with additional methods which are then available on each
  ASTYNode instance when created with `ASTYCtx#create`. This should be used by ASTy extension modules only.

- `ASTYCtx#create(type?: string, attrs?: ASTYAttributeSet, childs?: ASTYChildSpec[]): ASTYNode`:<br/>
  Create a new ASTYNode instance of `type` and optionally already set attributes and add child nodes.

- `ASTYCtx#isA(node: any): node is ASTYNode`:<br/>
  Check whether `node` is an ASTYNode instance. This is a TypeScript type
  guard, i.e., it narrows `node` to `ASTYNode` in the truthy branch.

- `static ASTYCtx.serialize(node: any): string`:<br/>
  Serializes (formats) ASTy nodes to JSON string. Use this for exporting an AST.

- `static ASTYCtx.unserialize(json: string): any`:<br/>
  Unserializes (parses) JSON string to ASTy nodes. Use this for importing an AST.

### ASTy Node (ASTYNode)

- `ASTYNode#create(type?: string, attrs?: ASTYAttributeSet, childs?: ASTYChildSpec[]): ASTYNode`:<br/>
  Create a new ASTYNode instance of `type` and optionally already set attributes and add child nodes.

- `ASTYNode#merge(node: ASTYNode | null, takePos?: boolean, attrMap?: { [ sourceAttr: string ]: string | null }): ASTYNode`:<br/>
  Merge attributes, childs and optionally the position of a node.
  The attributes can be renamed or skipped (if mapped onto `null`).

- `ASTYNode#type(type: string): this`:<br/>
  `ASTYNode#type(): string`:<br/>
  Set or get type of node.

- `ASTYNode#pos(line: number, column?: number, offset?: number): this`:<br/>
  `ASTYNode#pos(): ASTYPosition`:<br/>
  Set or get the position for the node.

- `ASTYNode#set(key: string, value: ASTYAttributeValue): this`:<br/>
  `ASTYNode#set(attrs: ASTYAttributeSet): this`:<br/>
  Set a single attribute `key` to `value` or set multiple
  attributes to their corresponding value.

- `ASTYNode#unset(key: string | string[]): this`:<br/>
  Unset a single attribute `key` or unset multiple attributes.

- `ASTYNode#get(key: string | string[]): ASTYAttributeValue`:<br/>
  Get value of a particular attribute `key`,
  or get array of values corresponding to each key in `key`.

- `ASTYNode#attrs(): string[]`:<br/>
  Get names of all node attributes.

- `ASTYNode#nth(): number`:<br/>
  Get position among sibling nodes in parent's child node list.
  The positions start at 0. For a root node (a node without a parent),
  `0` is returned.

- `ASTYNode#ins(pos: number, ...childs: ASTYChildSpec[]): ASTYNode`:<br/>
  Add one or more childs to a node, at a fixed position `pos`. The arguments `childs`
  can either be ASTYNode objects or even arrays of ASTYNode objects.
  If `pos` is negative it counts from the end of child list,
  with `-1` the position before the last existing child.

- `ASTYNode#add(...childs: ASTYChildSpec[]): ASTYNode`:<br/>
  Add one or more childs to a node, at the end of the child list. The arguments `childs`
  can either be ASTYNode objects or even arrays of ASTYNode objects.

- `ASTYNode#del(...childs: ASTYNode[]): ASTYNode`:<br/>
  Delete one or more childs from a node.

- `ASTYNode#childs(start?: number, end?: number): ASTYNode[]`:<br/>
  Get a nodes list of all or some childs. The `start` and `end` parameters
  are passed-through to `Array::slice`. If the range from `start` to `end` is
  out of range, an empty array is returned.

- `ASTYNode#child(pos: number): ASTYNode | null`:<br/>
  Get a particular child node. If `pos` is out of range, `null` is returned.

- `ASTYNode#parent(): ASTYNode | null`:<br/>
  Get parent node. For a root node, `null` is returned.

- `ASTYNode#walk(cb: ASTYWalkCallback, when?: ASTYWalkDirection): ASTYNode`:<br/>
  Recursively walk the AST starting at this node (at depth 0). For
  each visited node the `cb` callback function is called with the
  current node, the current node's tree depth, the current node's
  parent node and the current walking situation.  By default (and
  if `when` is either `downward` or `both`), the callback is called
  in the downward phase, i.e., before(!) all child nodes will be
  visited, and with `when` set to `downward`. If `when` is set to
  `upward` or `both`, the callback is called in the upward phase,
  i.e., after(!) all child nodes were visited, and with `when` set
  to `upward`.

- `ASTYNode#dump(maxDepth?: number, colorize?: (type: string, txt: string) => string, unicode?: boolean): string`:<br/>
  Returns a textual dump of the AST starting at the current node. By
  default `maxDepth` is `Infinity` and this way the whole AST below the
  current node is dumped. If `maxDepth` is `0` only the current node is
  dumped. If `maxDepth` is `1` the current node and all its direct child
  nodes are dumped. The parameter `colorize` is an optional callback function,
  intended to colorize the output `txt` fragments according to their `type`.
  The following `type` strings are supported: `tree`, `type`, `parenthesis`, `comma`,
  `key`, `colon`, `value`, `position`, `bracket`, `line`, `slash`, and `column`.
  If `unicode` is set to `false`, ASCII substitution characters are used
  for the tree structure.

- `ASTYNode#serialize(): string`:<br/>
  Recursively serializes the AST node to JSON.
  Use this for exporting.

Implementation Notice
---------------------

ASTy is written in TypeScript and ships with bundled TypeScript type
definitions, so the API above is fully typed for TypeScript consumers.
It is transpiled to JavaScript and this way runs in all current
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

Copyright &copy; 2014-2024 Dr. Ralf S. Engelschall (http://engelschall.com/)

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

