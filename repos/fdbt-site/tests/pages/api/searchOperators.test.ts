import { getMockRequestAndResponse } from '../../testData/mockData';
import searchOperators, {
    removeOperatorsFromPreviouslySelectedOperators,
    addOperatorsToPreviouslySelectedOperators,
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

    describe('removeOperatorsFromPreviouslySelectedOperators', () => {
        it('should remove operators from the list of selected operators', () => {
            const mockOperatorToRemove = ['BLAC#Blackpool Transport'];
            const expectedUpdatedList: Operator[] = [
                { name: "Warrington's Own Buses", nocCode: 'WBTR' },
                { name: 'IW Bus Co', nocCode: 'IWBusCo' },
            ];
            const mockSelectedOperators: Operator[] = [
                ...expectedUpdatedList,
                { name: 'Blackpool Transport', nocCode: 'BLAC' },
            ];
            const updatedList = removeOperatorsFromPreviouslySelectedOperators(
                mockOperatorToRemove,
                mockSelectedOperators,
            );
            expect(updatedList).toEqual(expectedUpdatedList);
        });
    });

    describe('addOperatorsToPreviouslySelectedOperators', () => {
        it('should add operators to the list of selected operators', () => {
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
            const updatedList = addOperatorsToPreviouslySelectedOperators(mockNewOperators);
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
                    id: 'remove-operator-checkbox-0',
                },
                { errorMessage: 'Blackpool Transport', id: 'remove-operator-checkbox-0' },
                { errorMessage: 'The Blackburn Bus Company', id: 'remove-operator-checkbox-0' },
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
});
