import * as React from 'react';
import { shallow } from 'enzyme';

import Direction, { getServerSideProps } from '../../src/pages/direction';
import * as auroradb from '../../src/data/auroradb';
import { getServiceByIdAndDataSource, batchGetStopsByAtcoCode } from '../../src/data/auroradb';
import { mockRawService, getMockContext } from '../testData/mockData';
import { TXC_SOURCE_ATTRIBUTE } from '../../src/constants/attributes';

jest.mock('../../src/data/auroradb.ts');

describe('pages', () => {
    describe('direction', () => {
        beforeEach(() => {
            (getServiceByIdAndDataSource as jest.Mock).mockImplementation(() => mockRawService);
            (batchGetStopsByAtcoCode as jest.Mock).mockImplementation(() => [{ localityName: '' }]);
        });

        it('should render correctly', () => {
            const tree = shallow(
                <Direction
                    errors={[]}
                    direction="outbound"
                    inboundDirection="inbound"
                    directionDesc="hello"
                    inboundDirectionDesc="world"
                    csrfToken="csrf"
                />,
            );
            expect(tree).toMatchSnapshot();
        });

        describe('getServerSideProps', () => {
            it('returns correct values fpr props', async () => {
                (({ ...getServiceByIdAndDataSource } as jest.Mock).mockImplementation(() => mockRawService));

                const ctx = getMockContext();

                const result = await getServerSideProps(ctx);

                expect('props' in result && result.props).toEqual({
                    csrfToken: '',
                    direction: 'outbound',
                    directionDesc: 'Interchange Stand B,Seaham - Estate (Hail and Ride) N/B,Westlea',
                    errors: [],
                    inboundDirection: 'inbound',
                    inboundDirectionDesc: 'Estate (Hail and Ride) N/B,Westlea - Interchange Stand B,Seaham',
                });
            });

            it('should return 302 redirect to /inputMethod when there is a bods service selected with one direction', async () => {
                const writeHeadMock = jest.fn();
                const ctx = getMockContext({
                    body: { serviceId: '123' },
                    uuid: {},
                    mockWriteHeadFn: writeHeadMock,
                    session: {
                        [TXC_SOURCE_ATTRIBUTE]: { source: 'bods', hasTnds: true, hasBods: true },
                    },
                });

                jest.spyOn(auroradb, 'getServiceByIdAndDataSource').mockResolvedValue({
                    ...mockRawService,
                    journeyPatterns: [mockRawService.journeyPatterns[0]],
                });

                expect(await getServerSideProps(ctx)).toEqual({
                    redirect: {
                        destination: '/inputMethod',
                        permanent: false,
                    },
                });
            });
        });
    });
});
