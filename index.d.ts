declare namespace ASTY {
  export class ASTYContext {
    version(): ASTYVersion;
    extend(nodeMethods: Record<string, Function>): ASTYContext;
    create: ASTYNode["create"];
    isA(node: any): node is ASTYNode;

    static serialize(node: ASTYNode): string;
    static unserialize(node: string): ASTYNode;
  }

  export interface ASTYNode<T = string | symbol> {
    T: T;
    A: Record<string, any>;
    C: ASTYNode[];

    create(
      type: T,
      attrMap?: Record<string, any>,
      childs?: ASTYNode[]
    ): ASTYNode;
    type(): string;
    type(type: string): ASTYNode;
    pos(line: number, column: number, offset: number): ASTYNode;
    set(name: string, value?: any): ASTYNode;
    set(attrMap: Record<string, any>): ASTYNode;
    unset(name: string | string[]): ASTYNode;
    get(name: string): any;
    get(names: string[]): any[];
    attrs(): string[];
    nth(): number;
    ins(pos: number, childs: ASTYNode[]): ASTYNode;
    add(childs: ASTYNode[]): ASTYNode;
    del(childs: ASTYNode[]): ASTYNode;
    childs(begin?: number, end?: number): ASTYNode;
    child(pos: number): ASTYNode;
    parent(): ASTYNode;
    serialize(): string;

    merge(
      node: ASTYNode,
      takePos?: boolean,
      attrMap?: Record<string, string | null>
    ): ASTYNode;
    walk(callback: WalkCallback, when?: WalkWhen): ASTYNode;
    dump(
      maxDepth?: number,
      colorize?: (type: string, text: string) => string,
      unicode?: boolean
    ): string;
  }

  type WalkCallback = (
    node: ASTYNode,
    depth: number,
    parent: ASTYNode,
    when: WalkWhen
  ) => void;
  type WalkWhen = "downward" | "upward" | "both";

  export interface ASTYVersion {
    major: number;
    minor: number;
    micro: number;
    date: number;
  }
}

export = ASTY.ASTYContext;
