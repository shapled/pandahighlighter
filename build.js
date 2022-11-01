#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');

const parserDir = path.join(__dirname, "parsers");
const langConfigs = {
    c: null,
    javascript: null,
    bash: null,
    c: null,
    cpp: null,
    go: null,
    javascript: null,
    lua: null,
    ocaml: [{
        module: "tree-sitter-ocaml/ocaml",
        wasm: {
            tmp: "tree-sitter-ocaml.wasm",
            target: path.join(parserDir, "ocaml.wasm"),
        }
    }, {
        module: "tree-sitter-ocaml/interface",
        wasm: {
            tmp: "tree-sitter-ocaml_interface.wasm",
            target: path.join(parserDir, "ocamlInterface.wasm"),
        }
    }],
    php: null,
    python: null,
    ruby: null,
    rust: null,
    typescript: [{
        module: "tree-sitter-typescript/typescript",
        wasm: {
            tmp: "tree-sitter-typescript.wasm",
            target: path.join(parserDir, "typescript.wasm"),
        }
    }],
    tsx: [{
        module: "tree-sitter-typescript/tsx",
        wasm: {
            tmp: "tree-sitter-tsx.wasm",
            target: path.join(parserDir, "tsx.wasm"),
        }
    }],
};

function createParserDir() {
    if (!fs.existsSync(parserDir)) {
        fs.mkdirSync(parserDir);
    }
}

function buildWasm(module, tmp, target) {
    const treeSitter = path.join(__dirname, "node_modules/.bin/tree-sitter");
    const process = spawn(treeSitter, ["build-wasm", module]);
    process.stdout.on("close", () => {
        fs.rename(tmp, target, (err) => {
            if (err) {
                console.log(`Failed to built parser of ${target}: ${err}`);
            } else {
                console.log(`Successfully compiled parser ${target}`);
            }
        });
    });
    process.stderr.on("data", (err) => {
        console.log(`Failed to built parser of ${target}: ${err}`);
    });
}

function buildWasmCache(module, tmp, target) {
    if (!fs.existsSync(target)) {
        buildWasm(module, tmp, target);
    } else {
        console.log(`Skip building ${target}, it exists.`);
    }
}

function build() {
    createParserDir();
    for(const lang in langConfigs) {
        const configs = langConfigs[lang];
        if (!configs) {
            const module = path.join(__dirname, "node_modules", `tree-sitter-${lang}`);
            const tmp = path.join(__dirname, `tree-sitter-${lang}.wasm`);
            const target = path.join(parserDir, `${lang}.wasm`);
            buildWasmCache(module, tmp, target);
        } else {
            for(const config of configs) {
                const module = path.join(__dirname, "node_modules", config.module);
                const tmp = path.join(__dirname, config.wasm.tmp);
                const target = config.wasm.target;
                buildWasmCache(module, tmp, target);
            }
        }
    }
}

build();
