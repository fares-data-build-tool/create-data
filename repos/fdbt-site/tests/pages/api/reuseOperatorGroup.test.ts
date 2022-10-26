import {
    FARE_TYPE_ATTRIBUTE,
    MULTIPLE_OPERATOR_ATTRIBUTE,
    REUSE_OPERATOR_GROUP_ATTRIBUTE,
    TICKET_REPRESENTATION_ATTRIBUTE,
} from '../../../src/constants/attributes';
import { getMockRequestAndResponse } from '../../testData/mockData';
import * as sessions from '../../../src/utils/sessions';
import reuseOperatorGroup from '../../../src/pages/api/reuseOperatorGroup';
import * as auroradb from '../../../src/data/auroradb';
import * as index from '../../../src/utils/apiUtils/index';

describe('reuseOperatorGroup', () => {
    const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');
    const writeHeadMock = jest.fn();

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should redirect back to reuseOperatorGroup with errors if the user does not select a radio button', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: {},
            mockWriteHeadFn: writeHeadMock,
        });
        await reuseOperatorGroup(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, REUSE_OPERATOR_GROUP_ATTRIBUTE, [
            { errorMessage: 'Choose an operator group from the options below', id: 'operatorGroup' },
        ]);
        expect(writeHeadMock).toBeCalledWith(302, { Location: '/reuseOperatorGroup' });
    });

    it('should update the MULTIPLE_OPERATOR_ATTRIBUTE with the selected operator group operators if selected', async () => {
        const getOperatorGroupByNocAndId = jest.spyOn(auroradb, 'getOperatorGroupByNocAndId');
        const testOperators = [
            {
                name: 'Best Op 1',
                nocCode: 'BO1',
            },
            {
                name: 'Best Op 2',
                nocCode: 'BO3',
            },
            {
                name: 'Best Op Supreme',
                nocCode: 'BOS',
            },
        ];
        getOperatorGroupByNocAndId.mockImplementation().mockResolvedValue({
            id: 1,
            name: 'Best Ops',
            operators: testOperators,
        });
        const { req, res } = getMockRequestAndResponse({
            body: { operatorGroupId: '1' },
            mockWriteHeadFn: writeHeadMock,
        });
        await reuseOperatorGroup(req, res);

        expect(getOperatorGroupByNocAndId).toBeCalledWith(1, 'TEST');
        expect(updateSessionAttributeSpy).toBeCalledWith(req, REUSE_OPERATOR_GROUP_ATTRIBUTE, []);
        expect(updateSessionAttributeSpy).toBeCalledWith(req, MULTIPLE_OPERATOR_ATTRIBUTE, {
            selectedOperators: testOperators,
            id: 1,
        });
        expect(writeHeadMock).toBeCalledWith(302, { Location: '/multipleProducts' });
    });

    it('should redirect to /multipleOperatorsServiceList if operator group reused, is scheme operator, and fareType is flat fare', async () => {
        const getOperatorGroupByNocAndId = jest.spyOn(auroradb, 'getOperatorGroupByNocAndId');
        const testOperators = [
            {
                name: 'Best Op 1',
                nocCode: 'BO1',
            },
            {
                name: 'Best Op 2',
                nocCode: 'BO3',
            },
            {
                name: 'Best Op Supreme',
                nocCode: 'BOS',
            },
        ];
        getOperatorGroupByNocAndId.mockImplementation().mockResolvedValue({
            id: 1,
            name: 'Best Ops',
            operators: testOperators,
        });
        const isSchemeOperatorSpy = jest.spyOn(index, 'isSchemeOperator');
        isSchemeOperatorSpy.mockImplementation(() => true);
        const { req, res } = getMockRequestAndResponse({
            body: { operatorGroupId: '1' },
            session: {
                [TICKET_REPRESENTATION_ATTRIBUTE]: {
                    name: 'multipleServices',
                },
                [FARE_TYPE_ATTRIBUTE]: {
                    fareType: 'flatFare',
                },
            },
            mockWriteHeadFn: writeHeadMock,
        });
        await reuseOperatorGroup(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, REUSE_OPERATOR_GROUP_ATTRIBUTE, []);
        expect(writeHeadMock).toBeCalledWith(302, { Location: '/multipleOperatorsServiceList' });
    });
});
