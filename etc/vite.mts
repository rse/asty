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

import * as Vite             from "vite"
import { tscPlugin }         from "@wroud/vite-plugin-tsc"
import { viteSingleFile }    from "vite-plugin-singlefile"
import { nodePolyfills }     from "vite-plugin-node-polyfills"

const formats = process.env.VITE_BUILD_FORMATS ?? "esm"

/*  the build formats, mapped from our external names onto the
    enumeration Vite expects internally (we use "esm", Vite uses "es")  */
const libFormatsMap: Record<string, Vite.LibraryFormats | undefined> = {
    esm:  "es",
    es:   "es",
    cjs:  "cjs",
    umd:  "umd",
    iife: "iife"
}
const libFormats = formats.split(",").map((format) => {
    const libFormat = libFormatsMap[format]
    if (libFormat === undefined)
        throw new Error(`invalid build format "${format}" ` +
            `(expected one of: ${Object.keys(libFormatsMap).join(", ")})`)
    return libFormat
})

export default Vite.defineConfig(({ mode }) => ({
    logLevel: "info",
    appType:  "custom",
    base:     "",
    root:     "",
    plugins: [
        tscPlugin({
            tscArgs:        [ "--build", "etc/tsc.json" ],
            prebuild:       true
        }),
        ...(libFormats.includes("umd") ? [ nodePolyfills() ] : []),
        viteSingleFile()
    ],
    build: {
        lib: {
            entry:    "dst-stage1/asty.js",
            formats:  libFormats,
            name:     "ASTY",
            fileName: (format) => `asty.${format === "es" ? "esm" : format}.js`
        },
        target:                 "es2022",
        outDir:                 "dst-stage2",
        assetsDir:              "",
        emptyOutDir:            (mode === "production") && !libFormats.includes("umd"),
        chunkSizeWarningLimit:  5000,
        assetsInlineLimit:      0,
        sourcemap:              (mode === "development"),
        minify:                 (mode === "production") && libFormats.includes("umd"),
        reportCompressedSize:   (mode === "production")
    }
}))

