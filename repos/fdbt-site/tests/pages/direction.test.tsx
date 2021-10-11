import * as React from 'react';
import { shallow } from 'enzyme';

import Direction, { getServerSideProps } from '../../src/pages/direction';
import { getServiceByIdAndDataSource, batchGetStopsByAtcoCode } from '../../src/data/auroradb';
import { mockRawService, getMockContext } from '../testData/mockData';

jest.mock('../../src/data/auroradb.ts');

describe('pages', () => {
    describe('direction', () => {
        beforeEach(() => {
            (getServiceByIdAndDataSource as jest.Mock).mockImplementation(() => mockRawService);
            (batchGetStopsByAtcoCode as jest.Mock).mockImplementation(() => [{ localityName: '' }]);
        });

        it('should render correctly', () => {
            const tree = shallow(<Direction errors={[]} directions={['outbound', 'inbound']} csrfToken="csrf" />);
            expect(tree).toMatchSnapshot();
        });

        describe('getServerSideProps', () => {
            it('returns operator value and list of services when operator attribute exists with NOCCode', async () => {
                (({ ...getServiceByIdAndDataSource } as jest.Mock).mockImplementation(() => mockRawService));

                const ctx = getMockContext();

                const result = await getServerSideProps(ctx);

                expect(result.props.directions).toEqual(['outbound', 'inbound']);
            });
        });
    });
});
