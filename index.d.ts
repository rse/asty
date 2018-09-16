declare namespace ASTY {
  class ASTYContext {
    create: ASTYNode["create"];
    isA(node: any): node is ASTYNode;

    version(): ASTYVersion;
    extend(nodeMethods: Record<string, Function>): ASTYContext;

    static serialize(node: ASTYNode): string;
    static unserialize(node: string): ASTYNode;
  }

  interface ASTYNode {
    T: string | symbol;
    A: Record<string, any>;
    C: this[];

    create(type: this["T"], attrMap?: this["A"], childs?: this[]): this;
    type(): this["T"];
    type(type: this["T"]): this;
    pos(line: number, column: number, offset: number): this;
    set(name: string, value?: any): this;
    set(attrMap: this["A"]): this;
    unset(name: string | string[]): this;
    get(name: string): any;
    get(names: string[]): any[];
    attrs(): string[];
    nth(): number;
    ins(pos: number, childs: this[]): this;
    add(childs: this[]): this;
    del(childs: this[]): this;
    childs(begin?: number, end?: number): this;
    child(pos: number): this;
    parent(): this;
    serialize(): string;

    merge(node: this, takePos?: boolean, attrMap?: this["A"]): this;
    walk(callback: WalkCallback, when?: WalkWhen): this;
    dump(
      maxDepth?: number,
      colorize?: (type: ColorizeType, text: string) => string,
      unicode?: boolean
    ): string;
  }

  type WalkCallback = (
    node: ASTYNode,
    depth: number,
    parent: ASTYNode,
    when: WalkWhen
  ) => void;
  type WalkWhen = "both" | "downward" | "upward";
  type ColorizeType =
    | "boolean"
    | "bracket"
    | "colon"
    | "column"
    | "comma"
    | "key"
    | "line"
    | "number"
    | "object"
    | "parenthesis"
    | "position"
    | "slash"
    | "string"
    | "tree"
    | "type"
    | "value";

  interface ASTYVersion {
    major: number;
    minor: number;
    micro: number;
    date: number;
  }
}

export = ASTY.ASTYContext;
