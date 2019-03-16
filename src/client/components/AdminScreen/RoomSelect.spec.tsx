import {h} from 'preact';
import {render} from 'preact-render-to-string';

import {RoomSelect} from './RoomSelect';

describe('components/RoomSelect', () => {
    it('should match snapshot', () => {
        expect(render(
            <RoomSelect
                rooms={[
                    {name: 'bed'},
                    {name: 'bath'},
                    {name: 'kitchen'}
                ]}
                selected="bed"
                onChange={new Function}
            />
        )).toMatchSnapshot();
    });
});
