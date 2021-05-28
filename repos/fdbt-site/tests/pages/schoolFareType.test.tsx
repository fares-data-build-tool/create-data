import * as React from 'react';
import { shallow } from 'enzyme';
import SchoolFareType, { getServerSideProps } from '../../src/pages/schoolFareType';
import { getMockContext } from '../testData/mockData';

describe('pages', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    const mockErrors = [{ errorMessage: 'Choose a fare type from the options', id: 'school-fare-type-single' }];

    describe('fareType', () => {
        it('should render correctly', () => {
            const tree = shallow(<SchoolFareType operatorName={' '} errors={[]} csrfToken="" />);
            expect(tree).toMatchSnapshot();
        });

        it('should render error messaging when errors are passed to the page', () => {
            const tree = shallow(<SchoolFareType operatorName={' '} errors={mockErrors} csrfToken="" />);
            expect(tree).toMatchSnapshot();
        });

        describe('getServerSideProps', () => {
            it('should return expected props', () => {
                const expectedProps = { props: { operatorName: expect.any(String), errors: [], csrfToken: '' } };
                const mockContext = getMockContext();
                const actualProps = getServerSideProps(mockContext);
                expect(actualProps).toEqual(expectedProps);
            });
        });
    });
});
