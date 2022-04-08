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

/* global module: true */
module.exports = function (grunt) {
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-browserify");
    grunt.loadNpmTasks("grunt-mocha-test");
    grunt.loadNpmTasks("grunt-eslint");

    grunt.initConfig({
        version: grunt.file.readYAML("VERSION.yml"),
        eslint: {
            options: {
                overrideConfigFile: "eslint.yaml"
            },
            "asty": [ "src/**/*.js", "tst/**/*.js" ]
        },
        browserify: {
            "asty-browser": {
                files: {
                    "lib/asty.browser.js": [ "src/**/*.js" ]
                },
                options: {
                    transform: [
                        [ "browserify-replace", { replace: [
                            { from: /\$major/g, to: "<%= version.major %>" },
                            { from: /\$minor/g, to: "<%= version.minor %>" },
                            { from: /\$micro/g, to: "<%= version.micro %>" },
                            { from: /\$date/g,  to: "<%= version.date  %>" }
                        ] } ],
                        [ "babelify", {
                            presets: [
                                [ "@babel/preset-env", {
                                    "targets": {
                                        "browsers": "last 8 versions, > 1%, ie 11"
                                    }
                                } ]
                            ]
                        } ],
                        [ "uglifyify", { sourceMap: false, global: true } ]
                    ],
                    plugin: [
                        [ "browserify-derequire" ],
                        [ "browserify-header" ]
                    ],
                    browserifyOptions: {
                        standalone: "ASTY",
                        debug: false
                    }
                }
            },
            "asty-node": {
                files: {
                    "lib/asty.node.js": [ "src/**/*.js" ]
                },
                options: {
                    transform: [
                        [ "browserify-replace", { replace: [
                            { from: /\$major/g, to: "<%= version.major %>" },
                            { from: /\$minor/g, to: "<%= version.minor %>" },
                            { from: /\$micro/g, to: "<%= version.micro %>" },
                            { from: /\$date/g,  to: "<%= version.date  %>" }
                        ] } ],
                        [ "babelify", {
                            presets: [
                                [ "@babel/preset-env", {
                                    "targets": {
                                        "node": "8.0.0"
                                    }
                                } ]
                            ]
                        } ]
                    ],
                    plugin: [
                        [ "browserify-derequire" ],
                        [ "browserify-header" ]
                    ],
                    browserifyOptions: {
                        standalone: "ASTY",
                        debug: false
                    }
                }
            }
        },
        mochaTest: {
            "asty": {
                src: [ "tst/*.js" ]
            },
            options: {
                reporter: "spec"
            }
        },
        clean: {
            clean: [],
            distclean: [ "node_modules" ]
        }
    });

    grunt.registerTask("default", [ "eslint", "browserify", "mochaTest" ]);
};

