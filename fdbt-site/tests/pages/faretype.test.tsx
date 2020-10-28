import * as React from 'react';
import { shallow } from 'enzyme';
import FareType, { buildUuid } from '../../src/pages/fareType';

describe('pages', () => {
    const mockErrors = [{ errorMessage: 'Choose a fare type from the options', id: 'fare-type-error' }];

    describe('fareType', () => {
        it('should render correctly', () => {
            const tree = shallow(<FareType operator={' '} errors={[]} csrfToken="" />);
            expect(tree).toMatchSnapshot();
        });

        it('should render error messaging when errors are passed to the page', () => {
            const tree = shallow(<FareType operator={' '} errors={mockErrors} csrfToken="" />);
            expect(tree).toMatchSnapshot();
        });
    });

    describe('buildUUid', () => {
        it('should return a string starting with the NOC and then 8 characters of uuid', () => {
            const result = buildUuid('TEST');

            expect(result.substring(0, 4)).toBe('TEST');
            expect(result.length).toBe(12);
        });
    });
});
