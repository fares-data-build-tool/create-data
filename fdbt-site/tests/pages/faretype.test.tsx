import * as React from 'react';
import { shallow } from 'enzyme';
import FareType, { buildUuid, getServerSideProps } from '../../src/pages/fareType';
import { getMockContext, mockSchemOpIdToken } from '../testData/mockData';

describe('pages', () => {
    const writeHeadMock = jest.fn();

    afterEach(() => {
        jest.resetAllMocks();
    });

    const mockErrors = [{ errorMessage: 'Choose a fare type from the options', id: 'fare-type-error' }];

    describe('fareType', () => {
        it('should render correctly', () => {
            const tree = shallow(<FareType operatorName={' '} errors={[]} csrfToken="" />);
            expect(tree).toMatchSnapshot();
        });

        it('should render error messaging when errors are passed to the page', () => {
            const tree = shallow(<FareType operatorName={' '} errors={mockErrors} csrfToken="" />);
            expect(tree).toMatchSnapshot();
        });

        describe('getServerSideProps', () => {
            it('should return expected props when a the user logged in is not a scheme operator', () => {
                const expectedProps = { props: { operatorName: expect.any(String), errors: [], csrfToken: '' } };
                const mockContext = getMockContext();
                const actualProps = getServerSideProps(mockContext);
                expect(actualProps).toEqual(expectedProps);
            });

            it('should redirect straight to /passengerType when a the user logged in is a scheme operator', () => {
                const mockContext = getMockContext({
                    mockWriteHeadFn: writeHeadMock,
                    cookies: {
                        operator: { operator: 'SCHEME_OPERATOR', region: 'SCHEME_REGION' },
                        idToken: mockSchemOpIdToken,
                    },
                });
                getServerSideProps(mockContext);
                expect(writeHeadMock).toBeCalledWith(302, { Location: '/passengerType' });
            });
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
