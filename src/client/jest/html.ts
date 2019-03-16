const toDiffableHtml = require('diffable-html');

export function test(value: any): boolean {
    return typeof value === 'string' && value[0] === '<';
}

export function print(value: string): string {
    return toDiffableHtml(value);
}
