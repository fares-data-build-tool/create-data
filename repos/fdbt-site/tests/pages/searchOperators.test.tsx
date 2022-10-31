import * as React from 'react';
import { shallow } from 'enzyme';
import { getMockContext, mockSchemOpIdToken } from '../testData/mockData';
import * as aurora from '../../src/data/auroradb';
import SearchOperators, {
    getServerSideProps,
    SearchOperatorProps,
    ShowSelectedOperators,
    ShowSearchResults,
} from '../../src/pages/searchOperators';
import { MULTIPLE_OPERATOR_ATTRIBUTE, OPERATOR_ATTRIBUTE } from '../../src/constants/attributes';
import { ErrorInfo, Operator } from '../../src/interfaces';

describe('pages', () => {
    describe('searchOperator', () => {
        const mockOperators: Operator[] = [
            {
                name: "Warrington's Own Buses",
                nocCode: 'WBTR',
            },
            {
                name: 'Blackpool Transport',
                nocCode: 'BLAC',
            },
            {
                name: 'IW Bus Co',
                nocCode: 'IWBusCo',
            },
        ];

        afterEach(() => {
            jest.resetAllMocks();
        });

        it('should render just the search input when the user first visits the page', () => {
            const tree = shallow(
                <SearchOperators
                    errors={[]}
                    searchText=""
                    databaseSearchResults={[]}
                    preSelectedOperators={[]}
                    csrfToken=""
                />,
            );

            expect(tree).toMatchSnapshot();
        });

        it('should render the search input and search results when there is a successful search', () => {
            const tree = shallow(
                <SearchOperators
                    errors={[]}
                    searchText="blac"
                    databaseSearchResults={[{ nocCode: 'BLAC', name: 'Blackpool' }]}
                    preSelectedOperators={[]}
                    csrfToken=""
                />,
            );

            expect(tree).toMatchSnapshot();
        });

        it('should render an input error when the user makes an unsucessful search', () => {
            const tree = shallow(
                <SearchOperators
                    errors={[{ errorMessage: 'Search requires a minimum of three characters', id: 'search-input' }]}
                    searchText=""
                    databaseSearchResults={[]}
                    preSelectedOperators={[]}
                    csrfToken=""
                />,
            );

            expect(tree).toMatchSnapshot();
        });

        it('should render a selection error when the user tries to add operators without selecting any search results', () => {
            const tree = shallow(
                <SearchOperators
                    errors={[]}
                    searchText="blac"
                    databaseSearchResults={[{ nocCode: 'BLAC', name: 'Blackpool' }]}
                    preSelectedOperators={[]}
                    csrfToken=""
                />,
            );

            expect(tree).toMatchSnapshot();
        });

        it('should render the search input and a list of selected operators when search results have been selected', () => {
            const tree = shallow(
                <SearchOperators
                    errors={[]}
                    searchText=""
                    databaseSearchResults={[]}
                    preSelectedOperators={mockOperators}
                    csrfToken=""
                />,
            );

            expect(tree).toMatchSnapshot();
        });

        it('should render a selection error when the user tries to remove selected operators without making a selection', () => {
            const tree = shallow(
                <SearchOperators
                    errors={[]}
                    searchText=""
                    databaseSearchResults={[]}
                    preSelectedOperators={mockOperators}
                    csrfToken=""
                />,
            );

            expect(tree).toMatchSnapshot();
        });

        it('should render the search input, search results and a list of selected operators when an additional search is made', () => {
            const tree = shallow(
                <SearchOperators
                    errors={[]}
                    searchText="warri"
                    databaseSearchResults={[mockOperators[0]]}
                    preSelectedOperators={mockOperators}
                    csrfToken=""
                />,
            );

            expect(tree).toMatchSnapshot();
        });

        describe('getServerSideProps', () => {
            const getSearchOperatorsBySearchTextSpy = jest.spyOn(aurora, 'getSearchOperatorsBySearchText');

            it('should return base props when the page is first visited by the user', async () => {
                const mockProps: { props: SearchOperatorProps } = {
                    props: {
                        errors: [],
                        searchText: '',
                        databaseSearchResults: [],
                        preSelectedOperators: [],
                        csrfToken: '',
                    },
                };
                const ctx = getMockContext();
                const result = await getServerSideProps(ctx);

                expect(result).toEqual(mockProps);
            });

            it('should return base props with errors when the the MULTIPLE_OPERATOR_ATTRIBUTE contains errors', async () => {
                const mockErrors: ErrorInfo[] = [
                    {
                        errorMessage: 'Search requires a minimum of three characters',
                        id: 'search-input',
                    },
                ];
                const mockProps: { props: SearchOperatorProps } = {
                    props: {
                        errors: mockErrors,
                        searchText: '',
                        databaseSearchResults: [],
                        preSelectedOperators: [],
                        csrfToken: '',
                    },
                };
                const ctx = getMockContext({ session: { [MULTIPLE_OPERATOR_ATTRIBUTE]: { errors: mockErrors } } });
                const result = await getServerSideProps(ctx);

                expect(result).toEqual(mockProps);
            });

            it('should return base props with errors when the url query string contains an invalid search term', async () => {
                getSearchOperatorsBySearchTextSpy.mockImplementation().mockResolvedValue([]);
                const mockErrors: ErrorInfo[] = [
                    {
                        errorMessage: "No operators found for 'asda'. Try another search term.",
                        id: 'search-input',
                    },
                ];
                const mockProps: { props: SearchOperatorProps } = {
                    props: {
                        errors: mockErrors,
                        searchText: 'asda',
                        databaseSearchResults: [],
                        preSelectedOperators: [],
                        csrfToken: '',
                    },
                };
                const ctx = getMockContext({
                    session: { [MULTIPLE_OPERATOR_ATTRIBUTE]: undefined },
                    query: { searchOperator: 'asda' },
                });
                const result = await getServerSideProps(ctx);

                expect(result).toEqual(mockProps);
            });

            it('should return props containing search results when the url query string contains a valid search term and the user is not a scheme operator', async () => {
                getSearchOperatorsBySearchTextSpy.mockImplementation().mockResolvedValue(mockOperators);
                const mockProps: { props: SearchOperatorProps } = {
                    props: {
                        errors: [],
                        searchText: 'blac',
                        databaseSearchResults: mockOperators,
                        preSelectedOperators: [],
                        csrfToken: '',
                    },
                };
                const ctx = getMockContext({
                    session: { [MULTIPLE_OPERATOR_ATTRIBUTE]: undefined },
                    query: { searchOperator: 'blac' },
                });
                const result = await getServerSideProps(ctx);

                expect(getSearchOperatorsBySearchTextSpy).toHaveBeenCalled();
                expect(result).toEqual(mockProps);
            });

            it('should return props containing search results when the url query string contains a valid search term and the user is a scheme operator', async () => {
                getSearchOperatorsBySearchTextSpy.mockImplementation().mockResolvedValue(mockOperators);
                const mockProps: { props: SearchOperatorProps } = {
                    props: {
                        errors: [],
                        searchText: 'blac',
                        databaseSearchResults: mockOperators,
                        preSelectedOperators: [],
                        csrfToken: '',
                    },
                };
                const ctx = getMockContext({
                    session: {
                        [MULTIPLE_OPERATOR_ATTRIBUTE]: undefined,
                        [OPERATOR_ATTRIBUTE]: { name: 'SCHEME_OPERATOR', region: 'SCHEME_REGION' },
                    },
                    query: { searchOperator: 'blac' },
                    cookies: {
                        idToken: mockSchemOpIdToken,
                    },
                });
                const result = await getServerSideProps(ctx);

                expect(getSearchOperatorsBySearchTextSpy).toHaveBeenCalled();
                expect(result).toEqual(mockProps);
            });
        });

        describe('Update selectedOperators', () => {
            it('should remove selected operator from selectedOperator list', () => {
                const setSelectedOperators = jest.fn();
                const mocSelectedOperators: Operator[] = [
                    { nocCode: 'BLAC', name: 'Blackpool Transport' },
                    { nocCode: 'LNUD', name: 'The Blackburn Bus Company' },
                ];
                const mocErrors: ErrorInfo[] = [];
                const wrapper = shallow(ShowSelectedOperators(mocSelectedOperators, setSelectedOperators, mocErrors));
                wrapper.find('#remove-0').simulate('click');
                expect(setSelectedOperators).toBeCalledWith([{ nocCode: 'LNUD', name: 'The Blackburn Bus Company' }]);
            });
            it('should remove all operators from selectedOperator list', () => {
                const setSelectedOperators = jest.fn();
                const mocSelectedOperators: Operator[] = [
                    { nocCode: 'BLAC', name: 'Blackpool Transport' },
                    { nocCode: 'LNUD', name: 'The Blackburn Bus Company' },
                ];
                const mocErrors: ErrorInfo[] = [];
                const wrapper = shallow(ShowSelectedOperators(mocSelectedOperators, setSelectedOperators, mocErrors));
                wrapper.find('#removeAll').simulate('click');
                expect(setSelectedOperators).toBeCalledWith([]);
            });
            it('should add operators to selectedOperator list', () => {
                const mocksearchText = 'blac';
                const mockErrors: ErrorInfo[] = [];
                const mockDatabaseSearchResultsCount = 2;
                const mockSelectedOperators: Operator[] = [];
                const setSelectedOperators = jest.fn();
                const mockSearchResultsCount = 2;
                const setSearchResultsCount = jest.fn();
                const mocksearchResults: Operator[] = [
                    { nocCode: 'BLAC', name: 'Blackpool Transport' },
                    { nocCode: 'LNUD', name: 'The Blackburn Bus Company' },
                ];
                const setSearchResults = jest.fn();

                const wrapper = shallow(
                    ShowSearchResults(
                        mocksearchText,
                        mockErrors,
                        mockDatabaseSearchResultsCount,
                        mockSelectedOperators,
                        setSelectedOperators,
                        mockSearchResultsCount,
                        setSearchResultsCount,
                        mocksearchResults,
                        setSearchResults,
                    ),
                );

                wrapper.find('#operator-to-add-0').simulate('click');
                expect(setSelectedOperators).toBeCalledWith([{ nocCode: 'BLAC', name: 'Blackpool Transport' }]);
                expect(setSearchResultsCount).toBeCalledWith(1);
                expect(setSearchResults).toBeCalledWith([{ nocCode: 'LNUD', name: 'The Blackburn Bus Company' }]);
            });
        });
    });
});
