import {h} from 'preact';
import {render} from 'preact-render-to-string';

import TableRow from './TableRow';

describe('components/TableRow', () => {
    it('should match snapshot', () => {
        const renderable = (
            <TableRow
                row={{
                    _id:         'abcdef',
                    room:        'bed',
                    name:        'clean the floor',
                    description: 'floor gets really dirty after a party',
                    isDeep:      true
                }}
                headerKeys={'name,isDeep,description'.split(',')}
            />
        );

        expect(render(renderable)).toMatchSnapshot();
        expect(getCSSRules()).toMatchSnapshot('css');
    });
});
