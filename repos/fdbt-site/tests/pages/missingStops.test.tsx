import * as React from 'react';
import { shallow } from 'enzyme';
import MissingStops from '../../src/pages/missingStops';

describe('pages', () => {
    describe('missingStops', () => {
        it('should render correctly', () => {
            const tree = shallow(<MissingStops missingStops={['07093832','wdfa22323','2323b23b']}/>);
            expect(tree).toMatchSnapshot();
        });
    });
});
