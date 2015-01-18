
ASTy
====

Generic Abstract Syntax Tree (AST)

<p/>
<img src="https://nodei.co/npm/asty.png?downloads=true&stars=true" alt=""/>

<p/>
<img src="https://david-dm.org/rse/asty.png" alt=""/>

Installation
------------

#### Node environments (with NPM package manager):

```shell
$ npm install asty
```

#### Browser environments (with Bower package manager):

```shell
$ bower install asty
```

About
-----

ASTy is a Generic Abstract Syntax Tree (AST) library for JavaScript,
i.e., it provides a hierarchical data structure for holding the syntax
abstraction of an arbitrary formal language. It is usually used
in combination with a parser generator like [PEG.js](http://pegjs.org/)
(and then especially with its utility class [PEGUtil](http://github.com/rse/pegjs-util))
to carry the results of the parsing step and to provide the vehicle
for further processing of those results.

Usage
-----

ASTy provides a class for the construction of a single AST node. The
tree of AST nodes is formed by linking child nodes into a parent node.
The ASTy API, here assumed to be exposed through the variable `ASTY`,
provides the following methods (in a notation somewhat resembling
TypeScript type definitions) is:

- `new ASTY(type: String, attrs?: {[name: String]: [value: Object]}, childs?: ASTY[]): ASTY`:<br/>
  Create a new ASTY node and optionally already set attributes and add child nodes.

- `ASTY#merge(node: Node, takePos?: Boolean, attrMap?: {[from: String]: [to: (String|null)})): ASTY`:<br/>
  Merge attributes, childs and optionally the position of a node.
  The attributes can be renamed or skipped (if mapped onto `null`).

- `ASTY#type(type: String): Boolean`:<br/>
  `ASTY#type(): String`:<br/>
  Set or get type of node.

- `ASTY#pos(line: Number, column: Number, offset: Number): ASTY`:<br/>
  `ASTY#pos(): Object`:<br/>
  Set or get the position for the node.

- `ASTY#set(name: String, value: Object): ASTY`:<br/>
  Set a single attribute `name` to `value`.

- `ASTY#set({ [name: String]: [value: Object] }): ASTY`:<br/>
  Set multiple attributes, each consisting of name and value pairs.

- `ASTY#get(name: String): Object`:<br/>
  Get value of attribute `name`.

- `ASTY#attrs(): String[]:<br/>
  Get names of all node attributes.

- `ASTY#add(childs: ASTY[]): ASTY`:<br/>
  Add one or more childs to a node. The array `childs`
  can either contain ASTY objects or even arrays
  of ASTY objects.

- `ASTY#del(childs: ASTY[]): ASTY`:<br/>
  Delete one or more childs from a node.

- `ASTY#childs(): ASTY[]`:<br/>
  Get a nodes list of childs.

- `ASTY#walk(callback: (node: ASTY, depth: Number, parent: ASTY, when: String) => Void, when?: String): ASTY`:<br/>
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

- `ASTY#dump(): String`:<br/>
  Returns a textual dump of the AST starting at the current node.

License
-------

Copyright (c) 2014-2015 Ralf S. Engelschall (http://engelschall.com/)

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

