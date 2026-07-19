/*
**  ASTy -- Abstract Syntax Tree (AST) Data Structure
**  Copyright (c) 2014-2026 Dr. Ralf S. Engelschall <rse@engelschall.com>
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

import pluginJs        from "@eslint/js"
import pluginStylistic from "@stylistic/eslint-plugin"
import pluginN         from "eslint-plugin-n"
import pluginImport    from "eslint-plugin-import-x"
import pluginPromise   from "eslint-plugin-promise"
import pluginMocha     from "eslint-plugin-mocha"
import pluginChai      from "eslint-plugin-chai-expect"
import pluginTS        from "typescript-eslint"
import globals         from "globals"
import parserTS        from "@typescript-eslint/parser"
import oxlint          from "eslint-plugin-oxlint"

export default [
    {
        ignores: [ "node_modules", "lib", "dst-stage1", "dst-stage2" ]
    },
    pluginJs.configs.recommended,
    pluginMocha.configs.recommended,
    pluginChai.configs["recommended-flat"],
    ...pluginTS.configs.strict,
    ...pluginTS.configs.stylistic,
    {
        plugins: {
            "n":          pluginN,
            "import-x":   pluginImport,
            "promise":    pluginPromise,
            "@stylistic": pluginStylistic
        },
        files: [ "src/**/*.ts", "tst/**/*.ts" ],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType:  "module",
            parser:      parserTS,
            parserOptions: {
                ecmaFeatures: {
                    jsx: false
                }
            },
            globals: {
                ...globals.node,
                ...globals.browser,
                ...globals.commonjs,
                ...globals.mocha
            }
        },
        rules: {
            "curly":                                              "off",
            "require-atomic-updates":                             "off",
            "dot-notation":                                       "off",
            "no-labels":                                          "off",
            "no-useless-constructor":                             "off",
            "no-unused-vars":                                     "off",

            "@stylistic/arrow-spacing":                           [ "error", { before: true, after: true } ],
            "@stylistic/block-spacing":                           [ "error", "always" ],
            "@stylistic/comma-spacing":                           [ "error", { before: false, after: true } ],
            "@stylistic/comma-style":                             [ "error", "last" ],
            "@stylistic/dot-location":                            [ "error", "property" ],
            "@stylistic/eol-last":                                "error",
            "@stylistic/keyword-spacing":                         [ "error", { before: true, after: true } ],
            "@stylistic/new-parens":                              "error",
            "@stylistic/no-mixed-spaces-and-tabs":                "error",
            "@stylistic/no-tabs":                                 "error",
            "@stylistic/no-trailing-spaces":                      "error",
            "@stylistic/no-whitespace-before-property":           "error",
            "@stylistic/object-curly-spacing":                    [ "error", "always" ],
            "@stylistic/rest-spread-spacing":                     [ "error", "never" ],
            "@stylistic/semi-spacing":                            [ "error", { before: false, after: true } ],
            "@stylistic/space-before-blocks":                     [ "error", "always" ],
            "@stylistic/space-infix-ops":                         "error",
            "@stylistic/template-curly-spacing":                  [ "error", "never" ],
            "@stylistic/template-tag-spacing":                    [ "error", "never" ],

            "n/handle-callback-err":                              [ "error", "^(err|error)$" ],
            "n/no-callback-literal":                              "error",
            "n/no-deprecated-api":                                "warn",
            "n/no-exports-assign":                                "error",
            "n/no-new-require":                                   "error",
            "n/no-path-concat":                                   "error",
            "n/process-exit-as-throw":                            "error",

            "promise/param-names":                                "error",

            "@stylistic/indent":                                  "off",
            "@stylistic/linebreak-style":                         [ "error", "unix" ],
            "@stylistic/semi":                                    [ "error", "never" ],
            "@stylistic/operator-linebreak":                      [ "error", "after", { overrides: { "&&": "before", "||": "before", ":": "after" } } ],
            "@stylistic/brace-style":                             [ "error", "stroustrup", { allowSingleLine: true } ],
            "@stylistic/quotes":                                  [ "error", "double" ],

            "@stylistic/no-multi-spaces":                         "off",
            "@stylistic/no-multiple-empty-lines":                 "off",
            "@stylistic/key-spacing":                             "off",
            "@stylistic/object-property-newline":                 "off",
            "@stylistic/space-in-parens":                         "off",
            "@stylistic/array-bracket-spacing":                   "off",
            "@stylistic/lines-between-class-members":             "off",
            "@stylistic/multiline-ternary":                       "off",
            "@stylistic/quote-props":                             "off",

            "@typescript-eslint/no-empty-function":               "off",
            "@typescript-eslint/no-explicit-any":                 "off",
            "@typescript-eslint/no-unused-vars":                  "off",
            "@typescript-eslint/ban-ts-comment":                  "off",
            "@typescript-eslint/no-this-alias":                   "off",
            "@typescript-eslint/no-non-null-assertion":           "off",
            "@typescript-eslint/consistent-type-definitions":     "off",
            "@typescript-eslint/array-type":                      "off",
            "@typescript-eslint/no-extraneous-class":             "off",
            "@typescript-eslint/consistent-indexed-object-style": "off",
            "@typescript-eslint/prefer-function-type":            "off",
            "@typescript-eslint/no-unnecessary-type-constraint":  "off",
            "@typescript-eslint/no-empty-object-type":            "off",

            "mocha/no-mocha-arrows":                              "off"
        }
    },
    ...oxlint.buildFromOxlintConfigFile("etc/oxlint.jsonc")
]

