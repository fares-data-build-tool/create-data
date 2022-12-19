import { getMockRequestAndResponse } from '../../testData/mockData';
import searchOperators, {
    replaceSelectedOperatorsWithUserSelectedOperators,
    isSearchInputValid,
} from '../../../src/pages/api/searchOperators';
import * as session from '../../../src/utils/sessions';
import { Operator, MultipleOperatorsAttributeWithErrors } from '../../../src/interfaces';
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
        const mockSelectedOperators: Operator[] = [
            { nocCode: 'BLAC', name: 'Blackpool Transport' },
            { nocCode: 'LNUD', name: 'The Blackburn Bus Company' },
        ];

        const { req, res } = getMockRequestAndResponse({
            body: {
                search: 'Search',
                searchText: 'manchester',
            },
            session: {
                [MULTIPLE_OPERATOR_ATTRIBUTE]: {
                    selectedOperators: mockSelectedOperators,
                },
            },
        });

        await searchOperators(req, res);

        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(req, MULTIPLE_OPERATOR_ATTRIBUTE, {
            selectedOperators: [],
        });

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

    it('should redirect to /searchOperators with errors when the user does not provide a name', async () => {
        jest.spyOn(auroradb, 'operatorHasBodsServices').mockResolvedValue(true);
        jest.spyOn(auroradb, 'operatorHasFerryOrTramServices').mockResolvedValue(false);
        jest.spyOn(auroradb, 'getOperatorGroupsByNameAndNoc').mockResolvedValue(undefined);

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

        const expectedSessionAttributeCall: MultipleOperatorsAttributeWithErrors = {
            selectedOperators: mockSelectedOperators,
            errors: [
                {
                    errorMessage: 'Provide a name for the operator group',
                    id: 'operator-group-name',
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

    it("should redirect with errors when the user clicks the 'Confirm operators and continue' button and one of the selected operators has no bods services and no tnds tram or ferry services", async () => {
        jest.spyOn(auroradb, 'operatorHasBodsServices').mockResolvedValue(false);
        jest.spyOn(auroradb, 'operatorHasFerryOrTramServices').mockResolvedValue(false);
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
                        'Some of the selected operators have no services. To continue you must only select operators which have services in BODS, or operators who have Ferry/Tram services in TNDS',
                    id: 'search-input',
                },
                { errorMessage: 'Blackpool Transport', id: 'search-input' },
                { errorMessage: 'The Blackburn Bus Company', id: 'search-input' },
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

    it('should redirect to /viewOperatorGroups when the user has successfully selected operators with services in BODS', async () => {
        jest.spyOn(auroradb, 'operatorHasBodsServices').mockResolvedValue(true);
        jest.spyOn(auroradb, 'operatorHasFerryOrTramServices').mockResolvedValue(false);
        jest.spyOn(auroradb, 'getOperatorGroupsByNameAndNoc').mockResolvedValue(undefined);
        jest.spyOn(auroradb, 'insertOperatorGroup').mockResolvedValue();

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
                operatorGroupName: 'Operator Group',
            },
            session: {
                [MULTIPLE_OPERATOR_ATTRIBUTE]: {
                    selectedOperators: mockSelectedOperators,
                },
            },
        });

        await searchOperators(req, res);

        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(req, MULTIPLE_OPERATOR_ATTRIBUTE, undefined);
        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/viewOperatorGroups',
        });
    });

    it('should redirect to /viewOperatorGroups when the user has successfully selected operators with ferry/tram services in TNDS', async () => {
        jest.spyOn(auroradb, 'operatorHasBodsServices').mockResolvedValue(false);
        jest.spyOn(auroradb, 'operatorHasFerryOrTramServices').mockResolvedValue(true);
        jest.spyOn(auroradb, 'getOperatorGroupsByNameAndNoc').mockResolvedValue(undefined);
        jest.spyOn(auroradb, 'insertOperatorGroup').mockResolvedValue();

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
                operatorGroupName: 'Operator Group',
            },
            session: {
                [MULTIPLE_OPERATOR_ATTRIBUTE]: {
                    selectedOperators: mockSelectedOperators,
                },
            },
        });

        await searchOperators(req, res);

        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(req, MULTIPLE_OPERATOR_ATTRIBUTE, undefined);
        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/viewOperatorGroups',
        });
    });

    it('should call updateSessionAttribute with undefined & update operator group when in Edit mode', async () => {
        jest.spyOn(auroradb, 'operatorHasBodsServices').mockResolvedValue(true);
        jest.spyOn(auroradb, 'operatorHasFerryOrTramServices').mockResolvedValue(false);
        jest.spyOn(auroradb, 'updateOperatorGroup').mockResolvedValue();
        jest.spyOn(auroradb, 'getOperatorGroupsByNameAndNoc').mockResolvedValue(undefined);

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
                operatorGroupName: 'Operator Group',
                id: '1',
            },
            session: {
                [MULTIPLE_OPERATOR_ATTRIBUTE]: {
                    selectedOperators: mockSelectedOperators,
                },
            },
        });

        await searchOperators(req, res);

        expect(updateSessionAttributeSpy).toHaveBeenCalledWith(req, MULTIPLE_OPERATOR_ATTRIBUTE, undefined);
        expect(res.writeHead).toBeCalledWith(302, {
            Location: '/viewOperatorGroups',
        });
    });
});
