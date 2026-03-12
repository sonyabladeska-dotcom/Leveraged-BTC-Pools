/**
 * Post-install patches for browser-build bugs in dependencies.
 * With opnet@^1.8.3 and @btc-vision/transaction@^1.8.0 most old
 * issues are resolved.  This script applies safe guards only when
 * the specific patterns are still present in the installed version.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function patchFile(label, relPath, search, replace) {
    const file = resolve(__dirname, relPath);
    if (!existsSync(file)) {
        console.log(`[${label}] file not found — skipping (not needed in this version)`);
        return;
    }
    try {
        let src = readFileSync(file, 'utf8');
        if (src.includes(replace)) {
            console.log(`[${label}] already patched, skipping`);
            return;
        }
        if (!src.includes(search)) {
            console.log(`[${label}] pattern not found — skipping (fixed in this version)`);
            return;
        }
        src = src.replace(search, replace);
        writeFileSync(file, src, 'utf8');
        console.log(`[${label}] patched successfully`);
    } catch (e) {
        console.warn(`[${label}] could not patch:`, e.message);
    }
}

// 1. Fix "prng" crash in @btc-vision/transaction browser build (if present)
patchFile(
    'patch-vendors',
    '../node_modules/@btc-vision/transaction/browser/vendors.js',
    'function ve() {\n  if (da) return kt;\n  da = 1, kt.randomBytes',
    'function ve() {\n  if (da) return kt;\n  if (!kt) kt = {};\n  da = 1, kt.randomBytes',
);

// 2. Fix CallResult.parseEvents null guard (if present)
patchFile(
    'patch-opnet-browser',
    '../node_modules/opnet/browser/index.js',
    'this.parseEvents(e.events)),this.accessList',
    'this.parseEvents(e.events||{})),this.accessList',
);

patchFile(
    'patch-opnet-callresult',
    '../node_modules/opnet/build/contracts/CallResult.js',
    'this.#rawEvents = this.parseEvents(callResult.events);',
    'this.#rawEvents = this.parseEvents(callResult.events || {});',
);

console.log('[patch-vendors] done');
