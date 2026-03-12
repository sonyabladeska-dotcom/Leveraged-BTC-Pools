import { readFileSync } from 'fs';

const src = readFileSync('node_modules/opnet/browser/index.js', 'utf8');

// Find all .toHex() calls and their surrounding context
const regex = /(\w+)\.toHex\(\)/g;
let match;
const seen = new Set();
while ((match = regex.exec(src)) !== null) {
    const start = Math.max(0, match.index - 60);
    const end = Math.min(src.length, match.index + 60);
    const context = src.substring(start, end).trim();
    if (!seen.has(context)) {
        seen.add(context);
        console.log(`var: ${match[1]} | context: ...${context}...`);
        console.log('---');
    }
}
