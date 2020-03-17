import * as React from 'react';
import { shallow } from 'enzyme';
import CsvZoneUpload from '../../src/pages/csvZoneUpload';

describe('pages', () => {
    describe('csvzoneupload', () => {
        it('should render correctly', () => {
            const tree = shallow(<CsvZoneUpload />);
            expect(tree).toMatchSnapshot();
        });
    });
});
