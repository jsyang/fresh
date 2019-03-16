const cssBeautify = require('cssbeautify');
const css         = require('css');

const CSSBEAUTIFY_OPTIONS = {
    indent: '  '
};

export function test(value: any): boolean {
    if (typeof value === 'string') {
        try {
            const ast = css.parse(value);

            // Only pass it to the print function if there has been parsed rules, otherwise we end up with <style> tags in JSON.
            return (ast && ast.stylesheet && ast.stylesheet.rules.length > 0);
        } catch (e) {
            return false;
        }
    } else {

        return false;
    }
}

export function print(value: string): string {
    return cssBeautify(value, CSSBEAUTIFY_OPTIONS);
}
