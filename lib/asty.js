/*
**  ASTy -- Generic Abstract Syntax Tree (AST)
**  Copyright (c) 2014 Ralf S. Engelschall <rse@engelschall.com>
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

!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.ASTY=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";var ASTYBase=function(){var t=function(){};return t.prototype.init=function(t){if("undefined"==typeof t)throw new Error("init: invalid argument");return this.T=t,this.A={},this.C=[],this.P={L:0,C:0,O:0},this},t.prototype.merge=function(t,r,e){if("object"!=typeof t)throw new Error("merge: invalid AST node argument");"undefined"==typeof r&&(r=!1),"undefined"==typeof e&&(e={});var n=this;if(r){var o=t.pos();n.pos(o.L,o.C,o.O)}return t.attrs().forEach(function(r){var o="undefined"!=typeof e[r]?e[r]:r;null!==o&&n.set(o,t.get(r))}),t.childs().forEach(function(t){n.add(t)}),this},t.prototype.type=function(t){if(0===arguments.length)return this.T;if(1===arguments.length)return this.T=t,this;throw new Error("type: invalid number of arguments")},t.prototype.pos=function(t,r,e){if(0===arguments.length)return this.P;if(arguments.length<=3)return this.P.L=t||0,this.P.C=r||0,this.P.O=e||0,this;throw new Error("pos: invalid number of arguments")},t.prototype.set=function(){if(1===arguments.length&&"object"==typeof arguments[0]){var t=this,r=arguments;Object.keys(r[0]).forEach(function(e){t.A[e]=r[0][e]})}else{if(2!==arguments.length)throw new Error("set: invalid arguments");this.A[arguments[0]]=arguments[1]}return this},t.prototype.get=function(t){if(1!==arguments.length)throw new Error("get: invalid number of arguments");if("string"!=typeof t)throw new Error("get: invalid argument");return this.A[t]},t.prototype.attrs=function(){return Object.keys(this.A)},t.prototype.add=function(){if(0===arguments.length)throw new Error("add: missing argument(s)");var t=function(t,r){if(!("object"==typeof r&&"string"==typeof r.T&&"object"==typeof r.P&&"object"==typeof r.A&&"object"==typeof r.C&&r.C instanceof Array))throw new Error("add: invalid AST node: "+JSON.stringify(r));t.push(r)},r=this;return Array.prototype.slice.call(arguments,0).forEach(function(e){"object"==typeof e&&e instanceof Array?e.forEach(function(e){t(r.C,e)}):null!==e&&t(r.C,e)}),this},t.prototype.del=function(){if(0===arguments.length)throw new Error("del: invalid argument");var t=this;return Array.prototype.slice.call(arguments,0).forEach(function(r){for(var e=!1,n=0;n<t.C.length;n++)if(t.C[n]===r){t.C.splice(n,1),e=!0;break}if(!e)throw new Error("del: child not found")}),this},t.prototype.childs=function(){return this.C},t.prototype.walk=function(t,r){"undefined"==typeof r&&(r="downward");var e=function(n,o,i){("downward"===r||"both"===r)&&t.call(null,n,o,i,"downward"),n.C.forEach(function(t){e(t,o+1,n)}),("upward"===r||"both"===r)&&t.call(null,n,o,i,"upward")};return e(this,0,null),this},t.prototype.dump=function(){var t="";return this.walk(function(r,e){for(var n=0;e>n;n++)t+="    ";t+=r.T+" ";var o=Object.keys(r.A);if(o.length>0){t+="(";var i=!0;o.forEach(function(e){i?i=!1:t+=", ",t+=e+": ";var n=r.A[e];switch(typeof n){case"string":t+='"'+n.replace(/\n/,"\\n").replace(/"/,'\\"')+'"';break;case"object":t+=n instanceof RegExp?"/"+n.toString().replace(/^\//,"").replace(/\/$/,"").replace(/\//g,"\\/")+"/":JSON.stringify(n);break;default:t+=JSON.stringify(n)}}),t+=") "}t+="["+r.P.L+"/"+r.P.C+"]\n"},"downward"),t},t}();module.exports=ASTYBase;
},{}],2:[function(require,module,exports){
"use strict";module.exports=function(){for(var t=function(){},r=0;r<arguments.length;r++){var o=arguments[r];"function"==typeof o&&(o=o.prototype);for(var e in o)Object.prototype.hasOwnProperty.call(o,e)&&(t.prototype[e]=o[e])}return t};
},{}],3:[function(require,module,exports){
"use strict";var _extends=function(e,t){e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),e.__proto__=t},ASTYBase=require("./asty-base.js"),mixins=require("./asty-mixins.js"),ASTY=function(e){var t=function r(){if(this instanceof r)return this.init.apply(this,arguments);var e=new r("");return e.init.apply(e,arguments)};return _extends(t,e),t}(mixins(ASTYBase));module.exports=ASTY;
},{"./asty-base.js":1,"./asty-mixins.js":2}]},{},[1,2,3])(3)
});


//# sourceMappingURL=asty.map