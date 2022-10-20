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
            const mockOperatorsToAdd = ['BLAC#Blackpool Transport', "WBTR#Warrington's Own Buses"];
            const mockSelectedOperators: Operator[] = [
                { name: 'IW Bus Co', nocCode: 'IWBusCo' },
                { name: "Warrington's Own Buses", nocCode: 'WBTR' },
            ];
            const expectedUpdatedList: Operator[] = [
                { name: 'IW Bus Co', nocCode: 'IWBusCo' },
                { name: "Warrington's Own Buses", nocCode: 'WBTR' },
                { name: 'Blackpool Transport', nocCode: 'BLAC' },
            ];
            const updatedList = addOperatorsToPreviouslySelectedOperators(mockOperatorsToAdd, mockSelectedOperators);
            expect(updatedList).toEqual(expectedUpdatedList);
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

    it("should succesfully add to the selected operators when the user selects from the search results and clicks the 'Add Opertator' button", async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                addOperators: 'Add Operator(s)',
                operatorsToAdd: "WBTR#Warrington's Own Buses",
                searchText: '',
            },
        });

        const expectedSessionAttributeCall: MultipleOperatorsAttribute = {
            selectedOperators: [
                {
                    nocCode: 'WBTR',
                    name: "Warrington's Own Buses",
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

    it("should redirect with errors when the user tries to add to the selected operators and clicks the 'Continue' button", async () => {
        const mockSelectedOperators: Operator[] = [{ nocCode: 'MCTR', name: 'Manchester Community Transport' }];
        const { req, res } = getMockRequestAndResponse({
            requestHeaders: { referer: 'host/searchOperators?searchOperator=warr' },
            body: {
                continueButtonClick: 'Continue',
                operatorsToAdd: "WBTR#Warrington's Own Buses",
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
                { errorMessage: "Click the 'Add Operator(s)' button to add operators", id: 'add-operator-checkbox-0' },
            ],
        };

        await searchOperators(req, res);

        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(
            req,
            MULTIPLE_OPERATOR_ATTRIBUTE,
            expectedSessionAttributeCall,
        );
        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/searchOperators?searchOperator=warr',
        });
    });

    it("should redirect with errors when the user clicks the 'Add Operator' button without making a selection", async () => {
        const { req, res } = getMockRequestAndResponse({
            requestHeaders: { referer: 'host/searchOperators?searchOperator=warr' },
            body: {
                addOperators: 'Add Operator(s)',
                searchText: '',
            },
        });

        const expectedSessionAttributeCall: MultipleOperatorsAttributeWithErrors = {
            selectedOperators: [],
            errors: [{ errorMessage: 'Select at least one operator to add', id: 'add-operator-checkbox-0' }],
        };

        await searchOperators(req, res);

        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(
            req,
            MULTIPLE_OPERATOR_ATTRIBUTE,
            expectedSessionAttributeCall,
        );
        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/searchOperators?searchOperator=warr',
        });
    });

    it("should succesfully remove from the selected operators when the user selects from the list and clicks the 'Remove Operator' button", async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                operatorsToRemove: ['MCTR#Manchester Community Transport', 'MCTR2#Manchester Community Transport 2'],
                removeOperators: 'Remove Operators',
                searchText: '',
            },
            session: {
                [MULTIPLE_OPERATOR_ATTRIBUTE]: {
                    selectedOperators: [
                        {
                            nocCode: 'MCTR',
                            name: 'Manchester Community Transport',
                        },
                        {
                            nocCode: 'MCTR2',
                            name: 'Manchester Community Transport 2',
                        },
                        {
                            nocCode: 'MCTR3',
                            name: 'Manchester Community Transport 3',
                        },
                    ],
                },
            },
        });

        const expectedSessionAttributeCall: MultipleOperatorsAttribute = {
            selectedOperators: [
                {
                    nocCode: 'MCTR3',
                    name: 'Manchester Community Transport 3',
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

    it("should redirect with errors when the user tries to remove selected operators and clicks the 'Continue' button", async () => {
        const mockSelectedOperators: Operator[] = [{ nocCode: 'WBTR', name: "Warrington's Own Buses" }];
        const { req, res } = getMockRequestAndResponse({
            body: {
                continueButtonClick: 'Continue',
                operatorsToRemove: "WBTR#Warrington's Own Buses",
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
                    errorMessage: "Click the 'Remove Operator(s)' button to remove operators",
                    id: 'remove-operator-checkbox-0',
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

    it("should redirect with errors when the user clicks the 'Remove Operator' button without making a selection", async () => {
        const mockSelectedOperators: Operator[] = [{ nocCode: 'WBTR', name: "Warrington's Own Buses" }];
        const { req, res } = getMockRequestAndResponse({
            body: {
                removeOperators: 'Remove Operators',
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
            errors: [{ errorMessage: 'Select at least one operator to remove', id: 'remove-operator-checkbox-0' }],
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

    it('should redirect to /saveOperatorGroup when the user has successfully selected operators for a geoZone multi op ticket', async () => {
        jest.spyOn(auroradb, 'operatorHasBodsServices').mockResolvedValue(true);
        const mockSelectedOperators: Operator[] = [
            {
                nocCode: 'MCTR',
                name: 'Manchester Community Transport',
            },
            {
                nocCode: 'MCTR2',
                name: 'Manchester Community Transport 2',
            },
            {
                nocCode: 'MCTR3',
                name: 'Manchester Community Transport 3',
            },
        ];
        const { req, res } = getMockRequestAndResponse({
            body: {
                continueButtonClick: 'Continue',
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
            Location: '/saveOperatorGroup',
        });
    });

    it('should redirect to /saveOperatorGroup when the user has successfully selected operators for a multipleServices multi op ticket', async () => {
        jest.spyOn(auroradb, 'operatorHasBodsServices').mockResolvedValue(true);
        const mockSelectedOperators: Operator[] = [
            {
                nocCode: 'MCTR',
                name: 'Manchester Community Transport',
            },
            {
                nocCode: 'MCTR2',
                name: 'Manchester Community Transport 2',
            },
            {
                nocCode: 'MCTR3',
                name: 'Manchester Community Transport 3',
            },
        ];
        const { req, res } = getMockRequestAndResponse({
            body: {
                continueButtonClick: 'Continue',
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
            Location: '/saveOperatorGroup',
        });
    });
    it("should redirect with errors when the user clicks the 'Confirm operators and continue' button and Bods has no services", async () => {
        jest.spyOn(auroradb, 'operatorHasBodsServices').mockResolvedValue(false);
        const mockSelectedOperators: Operator[] = [
            { nocCode: 'BLAC', name: 'Blackpool Transport' },
            { nocCode: 'LNUD', name: 'The Blackburn Bus Company' },
        ];
        const { req, res } = getMockRequestAndResponse({
            body: {
                continueButtonClick: 'Continue',
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
                { errorMessage: 'Some of the selected operators have no services', id: 'remove-operator-checkbox-0' },
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
    it("should redirect to /saveOperatorGroup when clicking  'Confirm operators and continue' button and Bods has services", async () => {
        jest.spyOn(auroradb, 'operatorHasBodsServices').mockResolvedValue(true);
        const mockSelectedOperators: Operator[] = [
            { nocCode: 'BLACK', name: 'Blackpool Transport' },
            { nocCode: 'LNUD', name: 'The Blackburn Bus Company' },
        ];
        const { req, res } = getMockRequestAndResponse({
            body: {
                continueButtonClick: 'Continue',
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
            Location: '/saveOperatorGroup',
        });
    });
});
