import { getMockRequestAndResponse } from '../../testData/mockData';
import searchOperators, {
    replaceSelectedOperatorsWithUserSelectedOperators,
    isSearchInputValid,
} from '../../../src/pages/api/searchOperators';
import * as session from '../../../src/utils/sessions';
import { Operator, MultipleOperatorsAttribute, MultipleOperatorsAttributeWithErrors } from '../../../src/interfaces';
import { MULTIPLE_OPERATOR_ATTRIBUTE, TICKET_REPRESENTATION_ATTRIBUTE } from '../../../src/constants/attributes';
import * as auroradb from '../../../src/data/auroradb';

describe('searchOperators', () => {
    const updateSessionAttributeSpy = jest.spyOn(session, 'updateSessionAttribute');

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('replaceSelectedOperatorsWithUserSelectedOperators', () => {
        it('should update operators to the list of selected operators', () => {
            const mockUpdatedList = [
                {
                    name: 'Blackpool Transport',
                    nocCode: 'BLAC',
                },
                {
                    name: "Warrington's Own Buses",
                    nocCode: 'WBTR',
                },
            ];
            const mockNewOperators = ['BLAC#Blackpool Transport', "WBTR#Warrington's Own Buses"];
            const updatedList = replaceSelectedOperatorsWithUserSelectedOperators(mockNewOperators);
            expect(updatedList).toEqual(mockUpdatedList);
        });
    });

    describe('isSearchInputValid', () => {
        it.each([
            [true, 'only valid', 'blackburn - bus'],
            [false, 'invalid', 'bl@ckpoo| tran$port'],
        ])('should return %s when a search term contains %s characters', (expectedValidity, _case, searchText) => {
            const actualValidity = isSearchInputValid(searchText);
            expect(actualValidity).toBe(expectedValidity);
        });
    });

    it('should redirect to itself (i.e. /searchOperators) with search text in the query string when the search term is valid', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                search: 'Search',
                searchText: 'manchester',
            },
        });

        await searchOperators(req, res);

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/searchOperators?searchOperator=manchester',
        });
    });

    it('should redirect to itself (i.e. /searchOperators) with search input errors when the user enters an invalid search term', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                search: 'Search',
                searchText: 'ab',
            },
        });

        const expectedSessionAttributeCall: MultipleOperatorsAttributeWithErrors = {
            selectedOperators: [],
            errors: [
                {
                    errorMessage: 'Search requires a minimum of three characters',
                    id: 'search-input',
                },
            ],
        };

        await searchOperators(req, res);

        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(
            req,
            MULTIPLE_OPERATOR_ATTRIBUTE,
            expectedSessionAttributeCall,
        );

        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/searchOperators',
        });
    });

    it('should redirect to /viewOperatorGroups when the user has successfully selected operators for a geoZone multi op ticket', async () => {
        jest.spyOn(auroradb, 'operatorHasBodsServices').mockResolvedValue(true);
        const mockUserSelectedOperators: string[] = ['BLAC#Blackpool Transport', 'LNUD#The Blackburn Bus Company'];
        const mockSelectedOperators: Operator[] = [
            { nocCode: 'BLAC', name: 'Blackpool Transport' },
            { nocCode: 'LNUD', name: 'The Blackburn Bus Company' },
        ];

        const { req, res } = getMockRequestAndResponse({
            body: {
                continueButtonClick: 'Continue',
                userSelectedOperators: mockUserSelectedOperators,
                searchText: '',
            },
            session: {
                [MULTIPLE_OPERATOR_ATTRIBUTE]: {
                    selectedOperators: mockSelectedOperators,
                },
                [TICKET_REPRESENTATION_ATTRIBUTE]: {
                    name: 'geoZone',
                },
            },
        });

        const expectedSessionAttributeCall: MultipleOperatorsAttribute = {
            selectedOperators: mockSelectedOperators,
        };

        await searchOperators(req, res);

        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(
            req,
            MULTIPLE_OPERATOR_ATTRIBUTE,
            expectedSessionAttributeCall,
        );
        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/viewOperatorGroups',
        });
    });

    it('should redirect to /viewOperatorGroups when the user has successfully selected operators for a multipleServices multi op ticket', async () => {
        jest.spyOn(auroradb, 'operatorHasBodsServices').mockResolvedValue(true);
        const mockUserSelectedOperators: string[] = ['BLAC#Blackpool Transport', 'LNUD#The Blackburn Bus Company'];
        const mockSelectedOperators: Operator[] = [
            { nocCode: 'BLAC', name: 'Blackpool Transport' },
            { nocCode: 'LNUD', name: 'The Blackburn Bus Company' },
        ];
        const { req, res } = getMockRequestAndResponse({
            body: {
                continueButtonClick: 'Continue',
                userSelectedOperators: mockUserSelectedOperators,
                searchText: '',
            },
            session: {
                [MULTIPLE_OPERATOR_ATTRIBUTE]: {
                    selectedOperators: mockSelectedOperators,
                },
                [TICKET_REPRESENTATION_ATTRIBUTE]: {
                    name: 'multipleServices',
                },
            },
        });

        const expectedSessionAttributeCall: MultipleOperatorsAttribute = {
            selectedOperators: mockSelectedOperators,
        };

        await searchOperators(req, res);

        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(
            req,
            MULTIPLE_OPERATOR_ATTRIBUTE,
            expectedSessionAttributeCall,
        );
        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/viewOperatorGroups',
        });
    });
    it("should redirect with errors when the user clicks the 'Confirm operators and continue' button and one of the selected operators has no bods services", async () => {
        jest.spyOn(auroradb, 'operatorHasBodsServices').mockResolvedValue(false);
        const mockUserSelectedOperators: string[] = ['BLAC#Blackpool Transport', 'LNUD#The Blackburn Bus Company'];
        const mockSelectedOperators: Operator[] = [
            { nocCode: 'BLAC', name: 'Blackpool Transport' },
            { nocCode: 'LNUD', name: 'The Blackburn Bus Company' },
        ];
        const { req, res } = getMockRequestAndResponse({
            body: {
                continueButtonClick: 'Continue',
                userSelectedOperators: mockUserSelectedOperators,
                searchText: '',
            },
            session: {
                [MULTIPLE_OPERATOR_ATTRIBUTE]: {
                    selectedOperators: mockSelectedOperators,
                },
            },
        });
        const expectedSessionAttributeCall: MultipleOperatorsAttributeWithErrors = {
            selectedOperators: mockSelectedOperators,
            errors: [
                {
                    errorMessage:
                        'Some of the selected operators have no services. To continue you must only select operators which have services in BODS',
                    id: 'remove-operator-0',
                },
                { errorMessage: 'Blackpool Transport', id: 'remove-operator-0' },
                { errorMessage: 'The Blackburn Bus Company', id: 'remove-operator-0' },
            ],
        };

        await searchOperators(req, res);

        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(
            req,
            MULTIPLE_OPERATOR_ATTRIBUTE,
            expectedSessionAttributeCall,
        );
        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/searchOperators',
        });
    });
    it("should redirect to /viewOperatorGroups when clicking 'Confirm operators and continue' button and all of the operators have bods services", async () => {
        jest.spyOn(auroradb, 'operatorHasBodsServices').mockResolvedValue(true);
        const mockSelectedOperators: Operator[] = [
            { nocCode: 'BLACK', name: 'Blackpool Transport' },
            { nocCode: 'LNUD', name: 'The Blackburn Bus Company' },
        ];
        const mockUserSelectedOperators: string[] = ['BLACK#Blackpool Transport', 'LNUD#The Blackburn Bus Company'];
        const { req, res } = getMockRequestAndResponse({
            body: {
                continueButtonClick: 'Continue',
                userSelectedOperators: mockUserSelectedOperators,
                searchText: '',
            },
            session: {
                [MULTIPLE_OPERATOR_ATTRIBUTE]: {
                    selectedOperators: mockSelectedOperators,
                },
            },
        });
        const expectedSessionAttributeCall: MultipleOperatorsAttribute = {
            selectedOperators: mockSelectedOperators,
        };

        await searchOperators(req, res);

        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(
            req,
            MULTIPLE_OPERATOR_ATTRIBUTE,
            expectedSessionAttributeCall,
        );
        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/viewOperatorGroups',
        });
    });
    describe('searchOperators updated with search and continue buttons automatically in one session update call', () => {
        it("should update selectedOperators then redirect to /viewOperatorGroups when clicking 'Confirm operators and continue' ", async () => {
            jest.spyOn(auroradb, 'operatorHasBodsServices').mockResolvedValue(true);
            const mockSelectedOperators: Operator[] = [
                { nocCode: 'BLACK', name: 'Blackpool Transport' },
                { nocCode: 'LNUD', name: 'The Blackburn Bus Company' },
            ];
            const mockUserSelectedOperators: string[] = ['BLAC#Blackpool Transport'];
            const { req, res } = getMockRequestAndResponse({
                body: {
                    continueButtonClick: 'Continue',
                    userSelectedOperators: mockUserSelectedOperators,
                },
                session: {
                    [MULTIPLE_OPERATOR_ATTRIBUTE]: {
                        selectedOperators: mockSelectedOperators,
                    },
                },
            });
            const expectedSessionAttributeCall: MultipleOperatorsAttribute = {
                selectedOperators: [{ nocCode: 'BLAC', name: 'Blackpool Transport' }],
            };

            await searchOperators(req, res);

            expect(updateSessionAttributeSpy).toHaveBeenCalledWith(
                req,
                MULTIPLE_OPERATOR_ATTRIBUTE,
                expectedSessionAttributeCall,
            );
            expect(updateSessionAttributeSpy).toBeCalledTimes(1);
            expect(res.writeHead).toBeCalledWith(302, {
                Location: '/viewOperatorGroups',
            });
        });
        it("should update selectedOperators then redirect to /searchOperators with errors  when clicking 'Confirm operators and continue' ", async () => {
            jest.spyOn(auroradb, 'operatorHasBodsServices').mockResolvedValue(false);
            const mockSelectedOperators: Operator[] = [
                { nocCode: 'BLACK', name: 'Blackpool Transport' },
                { nocCode: 'LNUD', name: 'The Blackburn Bus Company' },
            ];
            const mockUserSelectedOperators: string[] = ['BLAC#Blackpool Transport'];
            const { req, res } = getMockRequestAndResponse({
                body: {
                    continueButtonClick: 'Continue',
                    userSelectedOperators: mockUserSelectedOperators,
                },
                session: {
                    [MULTIPLE_OPERATOR_ATTRIBUTE]: {
                        selectedOperators: mockSelectedOperators,
                    },
                },
            });
            const expectedSessionAttributeCall: MultipleOperatorsAttributeWithErrors = {
                selectedOperators: [{ nocCode: 'BLAC', name: 'Blackpool Transport' }],
                errors: [
                    {
                        errorMessage:
                            'Some of the selected operators have no services. To continue you must only select operators which have services in BODS',
                        id: 'remove-operator-0',
                    },
                    {
                        errorMessage: 'Blackpool Transport',
                        id: 'remove-operator-0',
                    },
                ],
            };

            await searchOperators(req, res);

            expect(updateSessionAttributeSpy).toHaveBeenCalledWith(
                req,
                MULTIPLE_OPERATOR_ATTRIBUTE,
                expectedSessionAttributeCall,
            );
            expect(updateSessionAttributeSpy).toBeCalledTimes(1);
            expect(res.writeHead).toBeCalledWith(302, {
                Location: '/searchOperators',
            });
        });
        it('update selectedOperators with empty search should redirect to searchOperators with empty search error and updated selectedOperators', async () => {
            jest.spyOn(auroradb, 'operatorHasBodsServices').mockResolvedValue(true);
            const mockUserSelectedOperators: string[] = ['BLAC#Blackpool Transport'];
            const { req, res } = getMockRequestAndResponse({
                body: {
                    search: 'Search',
                    searchText: '',
                    userSelectedOperators: mockUserSelectedOperators,
                },
            });
            const expectedSessionAttributeCall: MultipleOperatorsAttributeWithErrors = {
                selectedOperators: [{ nocCode: 'BLAC', name: 'Blackpool Transport' }],
                errors: [
                    {
                        errorMessage: 'Search requires a minimum of three characters',
                        id: 'search-input',
                    },
                ],
            };

            await searchOperators(req, res);

            expect(updateSessionAttributeSpy).toHaveBeenCalledWith(
                req,
                MULTIPLE_OPERATOR_ATTRIBUTE,
                expectedSessionAttributeCall,
            );
            expect(updateSessionAttributeSpy).toHaveBeenCalledTimes(1);
            expect(res.writeHead).toBeCalledWith(302, {
                Location: '/searchOperators',
            });
        });
        it('update selectedOperators with search should redirect to searchOperators with search results and and updated selectedOperators', async () => {
            jest.spyOn(auroradb, 'operatorHasBodsServices').mockResolvedValue(true);
            const mockUserSelectedOperators: string[] = ['BLAC#Blackpool Transport'];
            const { req, res } = getMockRequestAndResponse({
                body: {
                    search: 'Search',
                    searchText: 'blac',
                    userSelectedOperators: mockUserSelectedOperators,
                },
            });
            const expectedSessionAttributeCall: MultipleOperatorsAttribute = {
                selectedOperators: [{ nocCode: 'BLAC', name: 'Blackpool Transport' }],
            };

            await searchOperators(req, res);

            expect(updateSessionAttributeSpy).toHaveBeenCalledWith(
                req,
                MULTIPLE_OPERATOR_ATTRIBUTE,
                expectedSessionAttributeCall,
            );
            expect(updateSessionAttributeSpy).toHaveBeenCalledTimes(1);
            expect(res.writeHead).toBeCalledWith(302, {
                Location: '/searchOperators?searchOperator=blac',
            });
        });
    });
});
