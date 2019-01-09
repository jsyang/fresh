const {writeFileSync, readFileSync, statSync} = require('fs');

const OUTPUT_FILE              = 'index.html';
const SCRIPT_TAG               = /<script src="src\/client\/index\.tsx"><\/script>/;
const SCRIPT_TAG_INSIDE_STRING = `<script src=\\"src\\/client\\/index\\.tsx\\"><\\/script>`;

const js   = readFileSync('fresh.js').toString();
const html = readFileSync('_dev.html').toString();

const baked = html
    .replace(SCRIPT_TAG, `<script>${js}</script>`)
    .replace(SCRIPT_TAG, SCRIPT_TAG_INSIDE_STRING);

writeFileSync(OUTPUT_FILE, baked);

// Update the file size figure within the project readme

const {size}            = statSync(OUTPUT_FILE);
const sizeIndex         = Math.floor(Math.log(size) / Math.log(1024));
const sizeHumanReadable = (size / Math.pow(1024, sizeIndex)).toFixed(2) * 1 + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][sizeIndex];

const README_FILE           = 'readme.md';
const readmeWithUpdatedSize = readFileSync(README_FILE).toString()
    .replace(/Total client file size:.*\n/, `Total client file size: ${sizeHumanReadable}\n`);

writeFileSync(README_FILE, readmeWithUpdatedSize);