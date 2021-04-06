import { MULTIPLE_OPERATOR_ATTRIBUTE, REUSE_OPERATOR_GROUP_ATTRIBUTE } from '../../../src/constants/attributes';
import { getMockRequestAndResponse } from '../../testData/mockData';
import * as sessions from '../../../src/utils/sessions';
import reuseOperatorGroup from '../../../src/pages/api/reuseOperatorGroup';
import * as auroradb from '../../../src/data/auroradb';

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
            { errorMessage: 'Choose one of the options below', id: 'conditional-form-group' },
        ]);
        expect(writeHeadMock).toBeCalledWith(302, { Location: '/reuseOperatorGroup' });
    });

    it('should redirect back to reuseOperatorGroup with errors if the user selects yes but does not select an operator group name', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: { reuseGroupChoice: 'Yes' },
            mockWriteHeadFn: writeHeadMock,
        });
        await reuseOperatorGroup(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, REUSE_OPERATOR_GROUP_ATTRIBUTE, [
            { errorMessage: 'Choose a premade operator group from the options below', id: 'premadeOperatorGroup' },
        ]);
        expect(writeHeadMock).toBeCalledWith(302, { Location: '/reuseOperatorGroup' });
    });

    it('should update the MULTIPLE_OPERATOR_ATTRIBUTE with the selected operator group operators if chosen in dropdown', async () => {
        const getOperatorGroupsByNameAndNocSpy = jest.spyOn(auroradb, 'getOperatorGroupsByNameAndNoc');
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
        getOperatorGroupsByNameAndNocSpy.mockImplementation().mockResolvedValue([
            {
                name: 'Best Ops',
                operators: testOperators,
            },
        ]);
        const { req, res } = getMockRequestAndResponse({
            body: { reuseGroupChoice: 'Yes', premadeOperatorGroup: 'Best Ops' },
            mockWriteHeadFn: writeHeadMock,
        });
        await reuseOperatorGroup(req, res);

        expect(getOperatorGroupsByNameAndNocSpy).toBeCalledWith('Best Ops', 'TEST');
        expect(updateSessionAttributeSpy).toBeCalledWith(req, REUSE_OPERATOR_GROUP_ATTRIBUTE, []);
        expect(updateSessionAttributeSpy).toBeCalledWith(req, MULTIPLE_OPERATOR_ATTRIBUTE, {
            selectedOperators: testOperators,
        });
        expect(writeHeadMock).toBeCalledWith(302, { Location: '/howManyProducts' });
    });

    it('should do nothing but redirect on to searchOperators if no is selected', async () => {
        const { req, res } = getMockRequestAndResponse({
            body: { reuseGroupChoice: 'No' },
            mockWriteHeadFn: writeHeadMock,
        });
        await reuseOperatorGroup(req, res);

        expect(updateSessionAttributeSpy).toBeCalledWith(req, REUSE_OPERATOR_GROUP_ATTRIBUTE, []);
        expect(writeHeadMock).toBeCalledWith(302, { Location: '/searchOperators' });
    });
});
