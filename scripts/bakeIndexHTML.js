const {writeFileSync,readFileSync} = require('fs');

const SCRIPT_TAG = /<script src="src\/index\.tsx"><\/script>/;
const SCRIPT_TAG_INSIDE_STRING = `<script src=\\"src\\/index\\.tsx\\"><\\/script>`;

const js = readFileSync('fresh.js').toString();
const html = readFileSync('_dev.html').toString();

const baked = html
    .replace(SCRIPT_TAG, `<script>${js}</script>`)
    .replace(SCRIPT_TAG, SCRIPT_TAG_INSIDE_STRING);

writeFileSync('index.html', baked);
