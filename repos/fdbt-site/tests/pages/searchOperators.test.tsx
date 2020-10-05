import * as React from 'react';
import { shallow } from 'enzyme';
import { getMockContext } from '../testData/mockData';
import { getSearchOperators, OperatorNameType } from '../../src/data/auroradb';
import SearchOperators, { getServerSideProps } from '../../src/pages/searchOperators';
import { SEARCH_OPERATOR_ATTRIBUTE } from '../../src/constants';

jest.mock('../../src/data/auroradb');

describe('pages', () => {
    describe('searchOperator', () => {
        const mockOperators: OperatorNameType[] = [
            {
                nocCode: 'BLAC',
                operatorPublicName: 'Blackpool',
            },
            {
                nocCode: 'BLAC',
                operatorPublicName: 'Blackpool operator',
            },
        ];

        beforeEach(() => {
            (getSearchOperators as jest.Mock).mockImplementation(() => mockOperators);
        });

        afterEach(() => {
            jest.resetAllMocks();
        });

        it('should render the page correctly without search results', () => {
            const tree = shallow(
                <SearchOperators errors={[]} searchText="" operators={[]} csrfToken="" pageProps={[]} />,
            );

            expect(tree).toMatchSnapshot();
        });

        it('should render the page correctly with search results', () => {
            const tree = shallow(
                <SearchOperators
                    errors={[]}
                    searchText=""
                    operators={[{ nocCode: 'BLAC', operatorPublicName: 'Blackpool' }]}
                    csrfToken=""
                    pageProps={[]}
                />,
            );

            expect(tree).toMatchSnapshot();
        });

        it('should render an error when errors are passed through', () => {
            const tree = shallow(
                <SearchOperators
                    errors={[{ errorMessage: 'Search requires a minimum of three characters', id: 'searchText' }]}
                    searchText=""
                    operators={[]}
                    csrfToken=""
                    pageProps={[]}
                />,
            );

            expect(tree).toMatchSnapshot();
        });
    });

    describe('getServerSideProps', () => {
        it('should return expected props to the page when the page is first visited by the user', async () => {
            (getSearchOperators as jest.Mock).mockImplementation(() => []);
            const ctx = getMockContext({ session: { [SEARCH_OPERATOR_ATTRIBUTE]: { errors: [] } } });
            const result = await getServerSideProps(ctx);

            expect(result.props.errors.length).toBe(0);
            expect(result.props.operators.length).toBe(0);
        });

        it('should throw an error if noc invalid', async () => {
            const ctx = getMockContext({
                cookies: { operator: null },
                body: null,
                uuid: {},
                mockWriteHeadFn: jest.fn(),
                mockEndFn: jest.fn(),
                isLoggedin: false,
            });
            await expect(getServerSideProps(ctx)).rejects.toThrow('invalid NOC set');
        });
    });
});
