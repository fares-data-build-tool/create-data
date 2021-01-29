import * as React from 'react';
import { shallow } from 'enzyme';
import FareType, { buildUuid, getServerSideProps } from '../../src/pages/fareType';
import { getMockContext, mockSchemOpIdToken } from '../testData/mockData';
import { getServicesByNocCode } from '../../src/data/auroradb';

jest.mock('../../src/data/auroradb');

describe('pages', () => {
    const writeHeadMock = jest.fn();

    afterEach(() => {
        jest.resetAllMocks();
    });

    const mockErrors = [{ errorMessage: 'Choose a fare type from the options', id: 'fare-type-single' }];

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
            beforeEach(() => {
                (getServicesByNocCode as jest.Mock).mockImplementation(() => [
                    {
                        lineName: '123',
                        startDate: '05/02/2020',
                        description: 'this bus service is 123',
                        serviceCode: 'NW_05_BLAC_123_1',
                    },
                    {
                        lineName: 'X1',
                        startDate: '06/02/2020',
                        description: 'this bus service is X1',
                        serviceCode: 'NW_05_BLAC_X1_1',
                    },
                    {
                        lineName: 'Infinity Line',
                        startDate: '07/02/2020',
                        description: 'this bus service is Infinity Line',
                        serviceCode: 'WY_13_IWBT_07_1',
                    },
                ]);
            });

            it('should return expected props when a the user logged in is not a scheme operator', async () => {
                const expectedProps = { props: { operatorName: expect.any(String), errors: [], csrfToken: '' } };
                const mockContext = getMockContext();
                const actualProps = await getServerSideProps(mockContext);
                expect(actualProps).toEqual(expectedProps);
            });

            it('should redirect to /passengerType when the user logged in is a scheme operator', async () => {
                const mockContext = getMockContext({
                    mockWriteHeadFn: writeHeadMock,
                    cookies: {
                        operator: { name: 'SCHEME_OPERATOR', region: 'SCHEME_REGION', nocCode: 'TESTSCHEME' },
                        idToken: mockSchemOpIdToken,
                    },
                });
                await getServerSideProps(mockContext);
                expect(writeHeadMock).toBeCalledWith(302, { Location: '/passengerType' });
            });

            it('should redirect to /noServices when the chosen NOC has no services', async () => {
                (getServicesByNocCode as jest.Mock).mockImplementation(() => []);
                const mockContext = getMockContext({
                    mockWriteHeadFn: writeHeadMock,
                    cookies: {
                        operator: { name: 'SCHEME_OPERATOR', region: 'SCHEME_REGION', nocCode: 'TESTSCHEME' },
                        idToken: mockSchemOpIdToken,
                    },
                });
                await getServerSideProps(mockContext);
                expect(writeHeadMock).toBeCalledWith(302, { Location: '/noServices' });
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
