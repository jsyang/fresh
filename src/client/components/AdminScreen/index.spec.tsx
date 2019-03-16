import {h} from 'preact';
import {render} from 'preact-render-to-string';

import {AdminScreen} from '.';

describe('components/AdminScreen', () => {
    it('should match loading snapshot', () => {
        expect(render(
            <AdminScreen
                rooms={[]}
                tasks={[]}
            />
        )).toMatchSnapshot();
    });
});
