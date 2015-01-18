/*
**  ASTy -- Generic Abstract Syntax Tree (AST)
**  Copyright (c) 2014-2015 Ralf S. Engelschall <rse@engelschall.com>
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
"use strict";var _prototypeProperties=function(e,r,t){r&&Object.defineProperties(e,r),t&&Object.defineProperties(e.prototype,t)},ASTYBase=function(){function e(){}return _prototypeProperties(e,null,{init:{value:function(e){if("undefined"==typeof e)throw new Error("init: invalid argument");return this.T=e,this.A={},this.C=[],this.P={L:0,C:0,O:0},this},writable:!0,enumerable:!0,configurable:!0},merge:{value:function(e,r,t){if("object"!=typeof e)throw new Error("merge: invalid AST node argument");"undefined"==typeof r&&(r=!1),"undefined"==typeof t&&(t={});var n=this;if(r){var i=e.pos();n.pos(i.L,i.C,i.O)}return e.attrs().forEach(function(r){var i="undefined"!=typeof t[r]?t[r]:r;null!==i&&n.set(i,e.get(r))}),e.childs().forEach(function(e){n.add(e)}),this},writable:!0,enumerable:!0,configurable:!0},type:{value:function(e){if(0===arguments.length)return this.T;if(1===arguments.length)return this.T=e,this;throw new Error("type: invalid number of arguments")},writable:!0,enumerable:!0,configurable:!0},pos:{value:function(e,r,t){if(0===arguments.length)return this.P;if(arguments.length<=3)return this.P.L=e||0,this.P.C=r||0,this.P.O=t||0,this;throw new Error("pos: invalid number of arguments")},writable:!0,enumerable:!0,configurable:!0},set:{value:function(){if(1===arguments.length&&"object"==typeof arguments[0]){var e=this,r=arguments;Object.keys(r[0]).forEach(function(t){e.A[t]=r[0][t]})}else{if(2!==arguments.length)throw new Error("set: invalid arguments");this.A[arguments[0]]=arguments[1]}return this},writable:!0,enumerable:!0,configurable:!0},get:{value:function(e){if(1!==arguments.length)throw new Error("get: invalid number of arguments");if("string"!=typeof e)throw new Error("get: invalid argument");return this.A[e]},writable:!0,enumerable:!0,configurable:!0},attrs:{value:function(){return Object.keys(this.A)},writable:!0,enumerable:!0,configurable:!0},add:{value:function(){if(0===arguments.length)throw new Error("add: missing argument(s)");var e=function(e,r){if(!("object"==typeof r&&"string"==typeof r.T&&"object"==typeof r.P&&"object"==typeof r.A&&"object"==typeof r.C&&r.C instanceof Array))throw new Error("add: invalid AST node: "+JSON.stringify(r));e.push(r)};if(null!==arguments){var r=this;Array.prototype.slice.call(arguments,0).forEach(function(t){"object"==typeof t&&t instanceof Array?t.forEach(function(t){e(r.C,t)}):null!==t&&e(r.C,t)})}return this},writable:!0,enumerable:!0,configurable:!0},del:{value:function(){if(0===arguments.length)throw new Error("del: invalid argument");var e=this;return Array.prototype.slice.call(arguments,0).forEach(function(r){for(var t=!1,n=0;n<e.C.length;n++)if(e.C[n]===r){e.C.splice(n,1),t=!0;break}if(!t)throw new Error("del: child not found")}),this},writable:!0,enumerable:!0,configurable:!0},childs:{value:function(){return this.C},writable:!0,enumerable:!0,configurable:!0},walk:{value:function(e,r){"undefined"==typeof r&&(r="downward");var t=function(n,i,a){("downward"===r||"both"===r)&&e.call(null,n,i,a,"downward"),n.C.forEach(function(e){t(e,i+1,n)}),("upward"===r||"both"===r)&&e.call(null,n,i,a,"upward")};return t(this,0,null),this},writable:!0,enumerable:!0,configurable:!0}}),e}();module.exports=ASTYBase;
},{}],2:[function(require,module,exports){
"use strict";var _prototypeProperties=function(e,r,t){r&&Object.defineProperties(e,r),t&&Object.defineProperties(e.prototype,t)},ASTYDump=function(){function e(){}return _prototypeProperties(e,null,{dump:{value:function(){var e="";return this.walk(function(r,t){for(var n=0;t>n;n++)e+="    ";e+=r.T+" ";var o=Object.keys(r.A);if(o.length>0){e+="(";var i=!0;o.forEach(function(t){i?i=!1:e+=", ",e+=t+": ";var n=r.A[t];switch(typeof n){case"string":e+='"'+n.replace(/\n/,"\\n").replace(/"/,'\\"')+'"';break;case"object":e+=n instanceof RegExp?"/"+n.toString().replace(/^\//,"").replace(/\/$/,"").replace(/\//g,"\\/")+"/":JSON.stringify(n);break;default:e+=JSON.stringify(n)}}),e+=") "}e+="["+r.P.L+"/"+r.P.C+"]\n"},"downward"),e},writable:!0,enumerable:!0,configurable:!0}}),e}();module.exports=ASTYDump;
},{}],3:[function(require,module,exports){
"use strict";module.exports=function(){for(var t=function(){},r=0;r<arguments.length;r++){var o=arguments[r];"function"==typeof o&&(o=o.prototype);for(var e in o)Object.prototype.hasOwnProperty.call(o,e)&&(t.prototype[e]=o[e])}return t};
},{}],4:[function(require,module,exports){
"use strict";var ASTQuery=function(){};module.exports=ASTQuery;
},{}],5:[function(require,module,exports){
"use strict";var _inherits=function(e,r){if("function"!=typeof r&&null!==r)throw new TypeError("Super expression must either be null or a function, not "+typeof r);e.prototype=Object.create(r&&r.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),r&&(e.__proto__=r)},ASTYBase=require("./asty-base.js"),ASTYDump=require("./asty-dump.js"),ASTYQuery=require("./asty-query.js"),mixins=require("./asty-mixins.js"),ASTY=function(e){function r(){if(this instanceof r)return this.init.apply(this,arguments);var e=new r("");return e.init.apply(e,arguments)}return _inherits(r,e),r}(mixins(ASTYBase,ASTYDump,ASTYQuery));module.exports=ASTY;
},{"./asty-base.js":1,"./asty-dump.js":2,"./asty-mixins.js":3,"./asty-query.js":4}]},{},[1,2,3,4,5])(5)
});


//# sourceMappingURL=asty.map