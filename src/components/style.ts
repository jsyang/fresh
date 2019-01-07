import {h} from 'preact';
import picostyle, {createNode} from 'picostyle';

export default picostyle(h as createNode);

export const common = {
    button: {
        '-webkit-appearance': 'none',
        '-moz-appearance':    'none',
        'box-sizing':         'border-box'
    }
};