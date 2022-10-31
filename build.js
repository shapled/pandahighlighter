#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const langs = [
    "c",
    "javascript",
];

function createParsersDir() {
    const parsersDir = path.join(__dirname, "parsers");
    if (!fs.existsSync(parsersDir)) {
        fs.mkdirSync(parsersDir);
    }
}

function buildWasm(lang, output) {
    const treeSitter = "node_modules/.bin/tree-sitter";
    const module = `node_modules/tree-sitter-${lang}`;
    const process = spawn(treeSitter, ["build-wasm", module]);
    process.stdout.on("close", () => {
        fs.rename(`tree-sitter-${lang}.wasm`, output, (err) => {
            if (err) {
                console.log(`Failed to built parser of ${lang}: ${err}`);
            } else {
                console.log(`Successfully compiled parser of ${lang} to ${output}`);
            }
        });
    });
    process.stderr.on("data", (err) => {
        console.log(`Failed to built parser of ${lang}: ${err}`);
    });
}

function build() {
    createParsersDir();
    for(const lang of langs) {
        const wasmPath = path.join(__dirname, "parsers", `${lang}.wasm`);
        if (!fs.existsSync(wasmPath)) {
            buildWasm(lang, wasmPath);
        } else {
            console.log(`Skip building ${lang}.wasm, it exists.`);
        }
    }
}

build();
