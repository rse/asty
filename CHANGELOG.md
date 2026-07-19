
CHANGELOG
=========

2.0.2 (2026-07-19)
------------------

- IMPROVEMENT [docs]: clarify the available transpilation results in README

2.0.1 (2026-07-19)
------------------

- BUGFIX [infr]: add a "type: module" to package.json

2.0.0 (2026-07-19)
------------------

- FEATURE [code,othr]: support recursive ASTYNode#ins(), #del() and #add()
- IMPROVEMENT [code]: harden ASTYNode#unserialize() against prototype pollution
- IMPROVEMENT [code]: validate and guard input in ASTYNode#unserialize()
- IMPROVEMENT [code]: catch structured cloning problems in ASTYNode#serialize()
- IMPROVEMENT [code]: reject self-merge and merging of an own ancestor in merge()
- IMPROVEMENT [code]: harden ASTYNode#set(), #unset() and #get() argument handling
- IMPROVEMENT [code]: always return a sliced copy of the childs array
- IMPROVEMENT [code]: improve typing of ASTYNode#walk() and ASTYNode#get()
- IMPROVEMENT [code,othr]: dump regex flags and escape control characters correctly
- IMPROVEMENT [othr]: extend test suite to cover entire public API
- BUGFIX [code]: re-parent nodes correctly in ASTYNode#ins() and #add()
- BUGFIX [code]: skip undefined values in ASTYNode#ins() and #add()
- BUGFIX [code]: delete childs correctly in ASTYNode#merge()
- BUGFIX [code]: avoid out-of-bound indexing on the childs array
- BUGFIX [code,othr]: correctly implement ASTYNode#ins() with a negative position
- BUGFIX [code,othr]: let ASTYNode#nth() return 0 for a node without a parent node
- CLEANUP [code,othr]: simplify code in dump(), serialize() and node handling
- REFACTORING [code,docs,infr,othr]: migrate from JavaScript to TypeScript

1.8.21 (2024-03-08)
-------------------

(see Git history)

1.x.x (2015-XX-XX)
------------------

(see Git history)

